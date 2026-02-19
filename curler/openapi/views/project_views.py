from custom.serializers import CustomSectionsOpenAPIInputSerializer
from django.urls import reverse
from organization.states import ProjectStatus
from rest_framework import serializers, status
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from factwise.openapi.services import project_services
from factwise.states import states_as_list


class ProjectBaseInputSerializer(serializers.Serializer):
    created_by_user_email = serializers.EmailField(
        error_messages={
            "required": "creator email is required",
            "invalid": "creator email must be a valid email address",
        }
    )

    project_code = serializers.CharField(
        max_length=100,
        allow_null=True,
        required=False,
        error_messages={
            "max_length": "project_code cannot exceed 100 characters",
        },
    )

    ERP_project_code = serializers.CharField(
        max_length=100,
        allow_null=True,
        required=False,
        error_messages={
            "max_length": "ERP_project_code cannot exceed 100 characters",
        },
    )

    project_name = serializers.CharField(
        max_length=200,
        error_messages={
            "required": "project_name is required",
            "blank": "project_name cannot be empty",
            "max_length": "project_name cannot exceed 200 characters",
        },
    )

    customer_code = serializers.CharField(
        allow_null=True,
        required=False,
        error_messages={
            "max_length": "customer_code is too long",
        },
    )

    entity_name = serializers.CharField(
        error_messages={
            "required": "entity_name is required",
            "blank": "entity_name cannot be empty",
        }
    )

    description = serializers.CharField(
        max_length=2000,
        allow_blank=True,
        allow_null=True,
        required=False,
        error_messages={
            "max_length": "description cannot exceed 2000 characters",
        },
    )

    internal_notes = serializers.CharField(
        max_length=2000,
        allow_blank=True,
        allow_null=True,
        required=False,
        error_messages={
            "max_length": "internal_notes cannot exceed 2000 characters",
        },
    )

    validity_from = serializers.DateTimeField(
        allow_null=True,
        required=False,
        error_messages={
            "invalid": "validity_from must be a valid datetime",
        },
    )

    validity_to = serializers.DateTimeField(
        allow_null=True,
        required=False,
        error_messages={
            "invalid": "validity_to must be a valid datetime",
        },
    )

    custom_sections = CustomSectionsOpenAPIInputSerializer(
        many=True,
        error_messages={
            "invalid": "custom_sections must be a list",
        },
    )

    project_status = serializers.ChoiceField(
        choices=states_as_list(ProjectStatus),
        error_messages={
            "required": "project_status is required",
            "invalid_choice": "project_status is not a valid value",
        },
    )

    template_name = serializers.CharField(
        allow_null=True,
        required=False,
        error_messages={
            "max_length": "template_name is too long",
        },
    )

    def validate(self, data):
        if not data.get("ERP_project_code") and not data.get("project_code"):
            raise serializers.ValidationError(
                {
                    "project_code": "either project_code or ERP_project_code is required",
                    "ERP_project_code": "either project_code or ERP_project_code is required",
                }
            )

        if data.get("validity_from") and data.get("validity_to"):
            if data["validity_from"] >= data["validity_to"]:
                raise serializers.ValidationError(
                    {
                        "validity_to": "validity_to must be after validity_from",
                    }
                )
        return data


class CreateProjectAPI(APIView):
    class InputSerializer(ProjectBaseInputSerializer):
        class Meta:
            ref_name = "CreateProjectAPIInputSerializer"

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        project_code = project_services.create_project(
            enterprise_id=request.enterprise_id, **serializer.validated_data
        )

        return Response(
            data={"project_code": project_code}, status=status.HTTP_201_CREATED
        )


class BulkCreateProjectAPI(APIView):
    def post(self, request):
        if not isinstance(request.data, dict) or "projects" not in request.data:
            raise ValidationError("'projects' must be provided")

        projects = request.data["projects"]
        if not isinstance(projects, list):
            raise ValidationError("'projects' must be a list")

        validated_projects = []
        validation_errors = []

        for index, project_data in enumerate(projects):
            serializer = ProjectBaseInputSerializer(data=project_data)
            if serializer.is_valid():
                validated_projects.append(
                    {
                        "index": index,
                        "data": serializer.validated_data,
                    }
                )
            else:
                validation_errors.append(
                    {
                        "index": index,
                        "erp_project_code": project_data.get("ERP_project_code"),
                        "error": "; ".join(
                            f"{field}: {', '.join(map(str, msgs))}"
                            for field, msgs in serializer.errors.items()
                        ),
                    }
                )

        service_result = project_services.create_projects_bulk(
            enterprise_id=request.enterprise_id,
            projects_payload=[p["data"] for p in validated_projects],
            total_len=len(projects),
            validation_errors=validation_errors,
        )

        if service_result.get("mode") == "async":
            return Response(
                {
                    "mode": "async",
                    "status": "accepted",
                    "task_id": service_result["task_id"],
                    "total_projects": len(projects),
                    "message": "Project count exceeds synchronous limit. Processing asynchronously.",
                    "status_url": request.build_absolute_uri(
                        reverse(
                            "openapi:bulk_task_status",
                            kwargs={"task_id": service_result["task_id"]},
                        )
                    ),
                },
                status=status.HTTP_202_ACCEPTED,
            )

        results = service_result["results"]

        final_failed = validation_errors + [
            {
                "index": r["index"],
                "erp_project_code": r.get("erp_project_code"),
                "error": r["error"],
            }
            for r in results
            if r["status"] == "failed"
        ]

        return Response(
            {
                "total": len(projects),
                "successful_count": service_result["success"],
                "failed_count": len(final_failed),
                "successful": [
                    {
                        "erp_project_code": str(r.get("erp_project_code", "")),
                        "project_code": str(r.get("project_code", "")),
                        "project_id": str(r.get("project_id", "")),
                    }
                    for r in results
                    if r["status"] == "success"
                ],
                "failed": final_failed,
            },
            status=status.HTTP_207_MULTI_STATUS,
        )


class BulkCreateProjectTaskStatusAPI(APIView):
    def get(self, request, task_id):
        try:
            data = project_services.get_bulk_project_task_status(
                enterprise_id=request.enterprise_id,
                task_id=task_id,
            )
            return Response(data, status=status.HTTP_200_OK)
        except NotFound:
            return Response(
                data={"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND
            )
