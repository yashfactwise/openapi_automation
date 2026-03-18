from custom.serializers import CustomSectionsOpenAPIInputSerializer
from django.urls import reverse
from openapi.serializers import (
    ContactDetailListSerializer,
    EntityVendorSerializer,
    VendorContactDetailSerializer,
)
from openapi.services import vendor_services
from openapi.structures import VendorContactEntity
from organization.org_models.vendor_master_model import EnterpriseVendorMaster
from organization.states import EnterpriseVendorMasterStatus
from organization.views.vendor_contact_view import VendorContactEmailInputSerializer
from organization.views.vendor_master_view import (
    SellerEntitySerializer,
    VendorContactInputSerializer,
    VendorIdentificationSerializer,
)
from rest_framework import serializers, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_dataclasses.serializers import DataclassSerializer

from factwise.openapi.service import normalize_serializer_errors
from factwise.states import states_as_list


class AdditionalCostInputSerializer(serializers.Serializer):
    name = serializers.CharField(
        max_length=100,
        error_messages={
            "required": "name is required",
            "blank": "name cannot be empty",
            "max_length": "name cannot exceed 100 characters",
        },
    )
    value = serializers.DecimalField(
        allow_null=True,
        max_digits=30,
        decimal_places=10,
        min_value=0,
        error_messages={
            "invalid": "value must be a valid decimal number",
            "max_digits": "value exceeds maximum allowed digits",
            "max_decimal_places": "value exceeds maximum decimal places (10)",
            "min_value": "value cannot be negative",
        },
    )


class EntityVendorInputSerializer(serializers.Serializer):
    entity_name = serializers.CharField(
        max_length=200,
        error_messages={
            "required": "entity_name is required",
            "blank": "entity_name cannot be empty",
            "max_length": "entity_name cannot exceed 200 characters",
        },
    )
    preferred_items = serializers.ListField(
        child=serializers.CharField(
            max_length=200,
            error_messages={
                "blank": "preferred_items entries cannot be empty",
                "max_length": "preferred_items entry cannot exceed 200 characters",
            },
        ),
        default=[],
        error_messages={
            "not_a_list": "preferred_items must be a list of strings",
        },
    )


class CreateVendorBaseInputSerializer(serializers.Serializer):
    created_by_user_email = serializers.EmailField(
        error_messages={
            "required": "created_by_user_email is required",
            "null": "created_by_user_email cannot be null",
            "blank": "created_by_user_email cannot be empty",
            "invalid": "Invalid email format",
            "max_length": "created_by_user_email exceeds maximum length",
            "min_length": "created_by_user_email below minimum length",
        }
    )
    vendor_name = serializers.CharField(
        max_length=200,
        error_messages={
            "required": "vendor_name is required",
            "null": "vendor_name cannot be null",
            "blank": "vendor_name cannot be empty",
            "invalid": "vendor_name must be a string",
            "max_length": "vendor_name cannot exceed 200 characters",
            "min_length": "vendor_name below minimum length",
        },
    )
    factwise_vendor_code = serializers.CharField(
        required=False,
        allow_null=True,
        default=None,
        error_messages={
            "required": "factwise_vendor_code is required",
            "null": "factwise_vendor_code cannot be null",
            "blank": "factwise_vendor_code cannot be empty",
            "invalid": "factwise_vendor_code must be a string",
            "max_length": "factwise_vendor_code exceeds maximum length",
            "min_length": "factwise_vendor_code below minimum length",
        },
    )
    ERP_vendor_code = serializers.CharField(
        error_messages={
            "required": "ERP_vendor_code is required",
            "null": "ERP_vendor_code cannot be null",
            "blank": "ERP_vendor_code cannot be empty",
            "invalid": "ERP_vendor_code must be a string",
            "max_length": "ERP_vendor_code exceeds maximum length",
            "min_length": "ERP_vendor_code below minimum length",
        },
    )
    seller_address_information = serializers.ListField(
        child=serializers.CharField(
            allow_blank=False,
            error_messages={
                "blank": "seller_address_information item cannot be empty",
                "invalid": "seller_address_information item must be a string",
                "max_length": "seller_address_information item exceeds maximum length",
                "min_length": "seller_address_information item below minimum length",
            },
        ),
        default=[],
        error_messages={
            "required": "seller_address_information is required",
            "null": "seller_address_information cannot be null",
            "not_a_list": "seller_address_information must be a list",
            "empty": "seller_address_information cannot be empty",
            "min_length": "seller_address_information has too few items",
            "max_length": "seller_address_information has too many items",
        },
    )
    seller_identifications = serializers.ListField(
        child=VendorIdentificationSerializer(),
        default=[],
        error_messages={
            "required": "seller_identifications is required",
            "null": "seller_identifications cannot be null",
            "not_a_list": "seller_identifications must be a list",
            "empty": "seller_identifications cannot be empty",
            "min_length": "seller_identifications has too few items",
            "max_length": "seller_identifications has too many items",
        },
    )
    notes = serializers.CharField(
        allow_null=True,
        allow_blank=True,
        default=None,
        error_messages={
            "invalid": "notes must be a string",
            "max_length": "notes exceeds maximum length",
            "min_length": "notes below minimum length",
        },
    )
    tags = serializers.ListField(
        child=serializers.CharField(
            allow_blank=False,
            error_messages={
                "blank": "tag cannot be empty",
                "invalid": "tag must be a string",
                "max_length": "tag exceeds maximum length",
                "min_length": "tag below minimum length",
            },
        ),
        min_length=0,
        default=[],
        error_messages={
            "required": "tags is required",
            "null": "tags cannot be null",
            "not_a_list": "tags must be a list of strings",
            "empty": "tags cannot be empty",
            "min_length": "tags has too few items",
            "max_length": "tags has too many items",
        },
    )
    additional_costs = AdditionalCostInputSerializer(
        many=True,
        default=[],
        error_messages={
            "required": "additional_costs is required",
            "null": "additional_costs cannot be null",
            "not_a_list": "additional_costs must be a list",
            "empty": "additional_costs cannot be empty",
            "min_length": "additional_costs has too few items",
            "max_length": "additional_costs has too many items",
        },
    )
    primary_contact = VendorContactInputSerializer(
        error_messages={
            "required": "primary_contact is required",
            "null": "primary_contact cannot be null",
            "invalid": "primary_contact must be a valid object",
        }
    )
    secondary_contacts = serializers.ListField(
        child=VendorContactInputSerializer(),
        min_length=0,
        required=False,
        default=[],
        error_messages={
            "required": "secondary_contacts is required",
            "null": "secondary_contacts cannot be null",
            "not_a_list": "secondary_contacts must be a list",
            "empty": "secondary_contacts cannot be empty",
            "min_length": "secondary_contacts has too few items",
            "max_length": "secondary_contacts has too many items",
        },
    )
    entities = EntityVendorInputSerializer(
        many=True,
        default=[],
        error_messages={
            "required": "entities is required",
            "null": "entities cannot be null",
            "not_a_list": "entities must be a list",
            "empty": "entities cannot be empty",
            "min_length": "entities has too few items",
            "max_length": "entities has too many items",
        },
    )
    custom_sections = CustomSectionsOpenAPIInputSerializer(
        many=True,
        error_messages={
            "required": "custom_sections is required",
            "null": "custom_sections cannot be null",
            "not_a_list": "custom_sections must be a list",
            "empty": "custom_sections cannot be empty",
            "min_length": "custom_sections has too few items",
            "max_length": "custom_sections has too many items",
        },
    )


class UpdateVendorBaseInputSerializer(serializers.Serializer):
    modified_by_user_email = serializers.EmailField(
        error_messages={
            "required": "modified_by_user_email is required.",
            "null": "modified_by_user_email cannot be null.",
            "blank": "modified_by_user_email cannot be blank.",
            "invalid": "modified_by_user_email must be a valid email address.",
            "max_length": "modified_by_user_email exceeds maximum length.",
            "min_length": "modified_by_user_email below minimum length.",
        }
    )
    factwise_vendor_code = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
        default=None,
        error_messages={
            "required": "factwise_vendor_code is required.",
            "null": "factwise_vendor_code cannot be null.",
            "blank": "factwise_vendor_code cannot be empty.",
            "invalid": "factwise_vendor_code must be a string.",
            "max_length": "factwise_vendor_code exceeds maximum length.",
            "min_length": "factwise_vendor_code below minimum length.",
        },
    )
    ERP_vendor_code = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
        default=None,
        error_messages={
            "required": "ERP_vendor_code is required.",
            "null": "ERP_vendor_code cannot be null.",
            "blank": "ERP_vendor_code cannot be empty.",
            "invalid": "ERP_vendor_code must be a string.",
            "max_length": "ERP_vendor_code exceeds maximum length.",
            "min_length": "ERP_vendor_code below minimum length.",
        },
    )
    vendor_name = serializers.CharField(
        error_messages={
            "required": "vendor_name is required.",
            "null": "vendor_name cannot be null.",
            "blank": "vendor_name cannot be blank.",
            "invalid": "vendor_name must be a string.",
            "max_length": "vendor_name exceeds maximum length.",
            "min_length": "vendor_name below minimum length.",
        }
    )
    notes = serializers.CharField(
        required=False,
        allow_null=True,
        allow_blank=True,
        default=None,
        error_messages={
            "null": "notes cannot be null.",
            "blank": "notes cannot be blank.",
            "invalid": "notes must be a string or null.",
            "max_length": "notes exceeds maximum length.",
            "min_length": "notes below minimum length.",
        },
    )
    tags = serializers.ListField(
        child=serializers.CharField(
            error_messages={
                "invalid": "Each tag must be a string.",
                "blank": "Tag value cannot be blank.",
                "max_length": "Tag exceeds maximum length.",
                "min_length": "Tag below minimum length.",
            }
        ),
        default=[],
        error_messages={
            "required": "tags is required.",
            "null": "tags cannot be null.",
            "invalid": "tags must be a list of strings.",
            "not_a_list": "tags must be a list.",
            "empty": "tags cannot be empty.",
            "min_length": "tags has too few items.",
            "max_length": "tags has too many items.",
        },
    )
    seller_address_information = serializers.ListField(
        child=serializers.CharField(
            error_messages={
                "invalid": "Each seller_address_information item must be a string.",
                "blank": "seller_address_information entries cannot be blank.",
                "max_length": "seller_address_information entry exceeds maximum length.",
                "min_length": "seller_address_information entry below minimum length.",
            }
        ),
        default=[],
        error_messages={
            "required": "seller_address_information is required.",
            "null": "seller_address_information cannot be null.",
            "invalid": "seller_address_information must be a list of strings.",
            "not_a_list": "seller_address_information must be a list.",
            "empty": "seller_address_information cannot be empty.",
            "min_length": "seller_address_information has too few items.",
            "max_length": "seller_address_information has too many items.",
        },
    )
    seller_identifications = serializers.ListField(
        child=VendorIdentificationSerializer(),
        default=[],
        error_messages={
            "required": "seller_identifications is required.",
            "null": "seller_identifications cannot be null.",
            "invalid": "seller_identifications must be a list of valid identification objects.",
            "not_a_list": "seller_identifications must be a list.",
            "empty": "seller_identifications cannot be empty.",
            "min_length": "seller_identifications has too few items.",
            "max_length": "seller_identifications has too many items.",
        },
    )
    additional_costs = AdditionalCostInputSerializer(
        many=True,
        default=[],
        error_messages={
            "required": "additional_costs is required.",
            "null": "additional_costs cannot be null.",
            "invalid": "additional_costs must be a list of valid additional cost objects.",
            "not_a_list": "additional_costs must be a list.",
            "empty": "additional_costs cannot be empty.",
            "min_length": "additional_costs has too few items.",
            "max_length": "additional_costs has too many items.",
        },
    )
    entities = EntityVendorInputSerializer(
        many=True,
        default=[],
        error_messages={
            "required": "entities is required.",
            "null": "entities cannot be null.",
            "invalid": "entities must be a list of valid entity objects.",
            "not_a_list": "entities must be a list.",
            "empty": "entities cannot be empty.",
            "min_length": "entities has too few items.",
            "max_length": "entities has too many items.",
        },
    )
    custom_sections = CustomSectionsOpenAPIInputSerializer(
        many=True,
        error_messages={
            "required": "custom_sections is required.",
            "null": "custom_sections cannot be null.",
            "invalid": "custom_sections must be a list of valid custom section objects.",
            "not_a_list": "custom_sections must be a list.",
            "empty": "custom_sections cannot be empty.",
            "min_length": "custom_sections has too few items.",
            "max_length": "custom_sections has too many items.",
        },
    )

    def validate(self, data):  # type: ignore
        if not data.get("ERP_vendor_code") and not data.get("factwise_vendor_code"):
            raise serializers.ValidationError(
                "Either factwise_vendor_code or ERP_vendor_code is required."
            )
        return data


class EnterpriseVendorMasterListAPI(APIView):
    class InputSerializer(serializers.Serializer):
        seller_entity_id = serializers.UUIDField(default=None)

    class OutputSerializer(serializers.ModelSerializer):
        buyer_entity_count = serializers.ReadOnlyField(source="_buyer_entity_count")
        buyer_entities = EntityVendorSerializer(many=True, read_only=True)
        primary_vendor_contact = VendorContactDetailSerializer()
        entity_contacts = serializers.SerializerMethodField()
        seller_entity = SellerEntitySerializer()

        def get_entity_contacts(self, enterprise_vendor_master):
            return ContactDetailListSerializer(
                enterprise_vendor_master.entity_contacts
            ).data

        class Meta:
            model = EnterpriseVendorMaster
            fields = [
                "enterprise_vendor_master_id",
                "buyer_enterprise",
                "seller_enterprise",
                "seller_entity",
                "vendor_code",
                "vendor_name",
                "status",
                "notes",
                "tags",
                "buyer_entity_count",
                "buyer_entities",
                "primary_vendor_contact",
                "entity_contacts",
                "created_datetime",
                "modified_datetime",
            ]

    def get(self, request):
        serializer = self.InputSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        vendor_list = vendor_services.list_enterprise_vendors(
            enterprise_id=request.enterprise_id, **serializer.validated_data
        )
        response_data = self.OutputSerializer(vendor_list, many=True).data
        return Response(data=response_data, status=status.HTTP_200_OK)


class CreateEnterpriseVendorAPI(APIView):
    def post(self, request):
        serializer = CreateVendorBaseInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        enterprise_vendor_master_id = vendor_services.create_enterprise_vendor(
            enterprise_id=request.enterprise_id, **serializer.validated_data
        )
        return Response(
            data={"enterprise_vendor_master_id": enterprise_vendor_master_id},
            status=status.HTTP_201_CREATED,
        )


class BulkCreateEnterpriseVendorAPI(APIView):
    def post(self, request):
        if not isinstance(request.data, dict) or "vendors" not in request.data:
            raise ValidationError("'vendors' must be provided")

        vendors = request.data["vendors"]
        if not isinstance(vendors, list):
            raise ValidationError("'vendors' must be a list")

        validated_vendors = []
        validation_errors = []

        for index, vendor_data in enumerate(vendors):
            serializer = CreateVendorBaseInputSerializer(data=vendor_data)
            if serializer.is_valid():
                validated_vendors.append(
                    {"index": index, "data": serializer.validated_data}
                )
            else:
                errors = normalize_serializer_errors(serializer.errors)  # type: ignore
                validation_errors.append(
                    {
                        "index": index,
                        "erp_vendor_code": vendor_data.get("ERP_vendor_code"),
                        "error": "; ".join(
                            f"{field}: {', '.join(map(str, msgs)) if isinstance(msgs, list) else msgs}"
                            for field, msgs in errors.items()
                        ),
                    }
                )

        service_result = vendor_services.create_vendors_bulk(
            enterprise_id=request.enterprise_id,
            vendors_payload=[i["data"] for i in validated_vendors],
            total_len=len(vendors),
            validation_errors=validation_errors,
        )

        if service_result.get("mode") == "async":
            return Response(
                {
                    "mode": "async",
                    "status": "accepted",
                    "task_id": service_result["task_id"],
                    "total_vendors": len(vendors),
                    "message": "Vendor count exceeds synchronous limit. Processing asynchronously.",
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
                "index": r["index"],  # type: ignore
                "erp_vendor_code": r.get("erp_vendor_code"),  # type: ignore
                "error": r["error"],  # type: ignore
            }
            for r in results
            if r["status"] == "failed"  # type: ignore
        ]

        return Response(
            {
                "total": len(vendors),
                "successful_count": service_result["success"],
                "failed_count": len(final_failed),
                "successful": [
                    {
                        "erp_vendor_code": str(r.get("erp_vendor_code", "")),  # type: ignore
                        "vendor_code": str(r.get("vendor_code", "")),  # type: ignore
                        "vendor_id": str(r.get("vendor_id", "")),  # type: ignore
                    }
                    for r in results
                    if r["status"] == "success"  # type: ignore
                ],
                "failed": final_failed,
            },
            status=status.HTTP_207_MULTI_STATUS,
        )


class UpdateEnterpriseVendorAPI(APIView):
    def put(self, request):
        serializer = UpdateVendorBaseInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        vendor_services.update_enterprise_vendor(
            enterprise_id=request.enterprise_id, **serializer.validated_data
        )
        return Response(status=status.HTTP_200_OK)


class BulkUpdateEnterpriseVendorAPI(APIView):
    def put(self, request):
        if not isinstance(request.data, dict) or "vendors" not in request.data:
            raise ValidationError("'vendors' must be provided")

        vendors = request.data["vendors"]
        if not isinstance(vendors, list):
            raise ValidationError("'vendors' must be a list")

        validated_vendors = []
        validation_errors = []

        for index, vendor_data in enumerate(vendors):
            serializer = UpdateVendorBaseInputSerializer(data=vendor_data)
            if serializer.is_valid():
                validated_vendors.append(
                    {
                        "index": index,
                        "data": serializer.validated_data,
                        "erp_vendor_code": vendor_data.get("ERP_vendor_code"),
                    }
                )
            else:
                errors = normalize_serializer_errors(serializer.errors)  # type: ignore
                validation_errors.append(
                    {
                        "index": index,
                        "erp_vendor_code": vendor_data.get("ERP_vendor_code"),
                        "error": "; ".join(
                            f"{field}: {', '.join(map(str, msgs)) if isinstance(msgs, list) else msgs}"
                            for field, msgs in errors.items()  # type: ignore
                        ),
                    }
                )

        service_result = vendor_services.update_vendors_bulk(
            enterprise_id=request.enterprise_id,
            vendors_payload=[i["data"] for i in validated_vendors],
            total_len=len(vendors),
            validation_errors=validation_errors,
        )

        if service_result.get("mode") == "async":
            return Response(
                {
                    "mode": "async",
                    "status": "accepted",
                    "task_id": service_result["task_id"],
                    "total_vendors": len(vendors),
                    "message": "Vendor count exceeds synchronous limit. Processing asynchronously.",
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
                "index": r["index"],  # type: ignore
                "erp_vendor_code": r.get("erp_vendor_code"),  # type: ignore
                "error": r["error"],  # type: ignore
            }
            for r in results
            if r["status"] == "failed"  # type: ignore
        ]

        return Response(
            {
                "total": len(vendors),
                "successful_count": service_result["success"],
                "failed_count": len(final_failed),
                "successful": [
                    {
                        "erp_vendor_code": str(r.get("erp_vendor_code", "")),  # type: ignore
                        "vendor_code": str(r.get("vendor_code", "")),  # type: ignore
                        "vendor_id": str(r.get("vendor_id", "")),  # type: ignore
                    }
                    for r in results
                    if r["status"] == "success"  # type: ignore
                ],
                "failed": final_failed,
            },
            status=status.HTTP_207_MULTI_STATUS,
        )


class UpdateEnterpriseVendorStatusAPI(APIView):
    class InputSerializer(serializers.Serializer):
        modified_by_user_email = serializers.EmailField()
        ERP_vendor_code = serializers.CharField(default=None, required=False)
        factwise_vendor_code = serializers.CharField(default=None, required=False)
        status = serializers.ChoiceField(
            choices=states_as_list(EnterpriseVendorMasterStatus)
        )

    def put(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        vendor_services.update_enterprise_vendor_status(
            enterprise_id=request.enterprise_id, **serializer.validated_data
        )
        return Response(status=status.HTTP_200_OK)


class VendorContactListAPI(APIView):
    class OutputSerializer(DataclassSerializer):
        class Meta:
            dataclass = VendorContactEntity

    def get(self, request):
        response = vendor_services.list_vendor_contacts(
            enterprise_id=request.enterprise_id
        )
        response_data = self.OutputSerializer(response, many=True).data
        return Response(data=response_data, status=status.HTTP_200_OK)


class VendorContactCreateAPI(APIView):
    class InputSerializer(serializers.Serializer):
        created_by_user_email = serializers.EmailField()
        # vendor_code = serializers.CharField()
        ERP_vendor_code = serializers.CharField(default=None, required=False)
        factwise_vendor_code = serializers.CharField(default=None, required=False)
        primary_email = serializers.EmailField()
        full_name = serializers.CharField()
        emails = serializers.ListField(
            child=VendorContactEmailInputSerializer(), default=[]
        )
        phone_numbers = serializers.ListField(
            child=serializers.CharField(max_length=12), default=[]
        )
        # tags = serializers.ListField(child=serializers.CharField(), default=[])
        entity_name = serializers.CharField()

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        vendor_services.vendor_contact_create(
            enterprise_id=request.enterprise_id, **serializer.validated_data
        )
        return Response(status=status.HTTP_201_CREATED)


class VendorContactUpdateAPI(APIView):
    class InputSerializer(serializers.Serializer):
        modified_by_user_email = serializers.EmailField()
        # vendor_code = serializers.CharField()
        ERP_vendor_code = serializers.CharField(default=None, required=False)
        factwise_vendor_code = serializers.CharField(default=None, required=False)
        primary_email = serializers.EmailField()
        is_primary = serializers.BooleanField()
        full_name = serializers.CharField()
        emails = serializers.ListField(
            child=VendorContactEmailInputSerializer(), default=[]
        )
        phone_numbers = serializers.ListField(
            child=serializers.CharField(max_length=12), default=[]
        )
        # tags = serializers.ListField(child=serializers.CharField(), default=[])
        entity_name = serializers.CharField()

    def put(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        vendor_services.vendor_contact_update(
            enterprise_id=request.enterprise_id, **serializer.validated_data
        )
        return Response(status=status.HTTP_200_OK)


class VendorContactDeleteAPI(APIView):
    class InputSerializer(serializers.Serializer):
        deleted_by_user_email = serializers.EmailField()
        # vendor_code = serializers.CharField()
        ERP_vendor_code = serializers.CharField(default=None, required=False)
        factwise_vendor_code = serializers.CharField(default=None, required=False)
        primary_email = serializers.EmailField()
        entity_name = serializers.CharField()

    def delete(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        vendor_services.vendor_contact_delete(
            enterprise_id=request.enterprise_id, **serializer.validated_data
        )
        return Response(status=status.HTTP_200_OK)
