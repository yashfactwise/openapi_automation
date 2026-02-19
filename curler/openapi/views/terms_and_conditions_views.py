from rest_framework import serializers
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from openapi.serializers import EntityTermsAndConditionsSerializer
from openapi.services import terms_and_conditions_services
from organization.org_models.terms_and_conditions_model import TermsAndConditions
from organization.states import TermsAndConditionsType

from factwise.states import states_as_list


class TermsAndConditionsListAPI(APIView):
    class InputSerializer(serializers.Serializer):
        terms_and_conditions_type = serializers.ChoiceField(
            choices=states_as_list(TermsAndConditionsType),
            allow_null=True,
            default=None,
        )

    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = TermsAndConditions
            fields = [
                "terms_and_conditions_id",
                "name",
                "data",
                "default",
                "status",
                "notes",
                "additional_details",
                "created_by_user",
                "created_by_user_name",
                "modified_by_user",
                "deleted_by_user",
                "created_datetime",
                "modified_datetime",
                "deleted_datetime",
            ]

    def get(self, request):
        terms_and_conditions_type = request.query_params.get("type")
        serializer = self.InputSerializer(
            data={"terms_and_conditions_type": terms_and_conditions_type}
        )
        serializer.is_valid(raise_exception=True)

        terms_and_conditions_list = (
            terms_and_conditions_services.list_terms_and_conditions(
                enterprise_id=request.enterprise_id, **serializer.validated_data
            )
        )
        response_data = self.OutputSerializer(terms_and_conditions_list, many=True).data
        return Response(data=response_data, status=status.HTTP_200_OK)


class TermsAndConditionsCreateAPI(APIView):
    class InputSerializer(serializers.Serializer):
        entity_details = serializers.ListField(
            child=EntityTermsAndConditionsSerializer(), min_length=0
        )
        name = serializers.CharField()
        data = serializers.CharField()
        notes = serializers.CharField(allow_null=True, allow_blank=True, default=None)

    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = TermsAndConditions
            fields = "__all__"

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        terms_and_conditions = (
            terms_and_conditions_services.terms_and_conditions_create(
                enterprise_id=request.enterprise_id, **serializer.validated_data
            )
        )
        response_data = self.OutputSerializer(terms_and_conditions).data
        return Response(data=response_data, status=status.HTTP_200_OK)
