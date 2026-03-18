from change_event.decorator import change_event
from openapi.services import identification_services
from openapi.structures import IdentificationInputRequest
from organization.org_models.identification_model import EntityIdentification
from organization.views.identification_view import IdentificationDetailSerializer
from rest_framework import serializers
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_dataclasses.serializers import DataclassSerializer


class IdentificationListAPI(APIView):
    class OutputSerializer(serializers.ModelSerializer):
        entity_name = serializers.ReadOnlyField()

        class Meta:
            model = EntityIdentification
            fields = "__all__"

    def get(self, request):
        identifications = identification_services.identification_list(
            enterprise_id=request.enterprise_id
        )
        response_data = self.OutputSerializer(identifications, many=True).data
        return Response(data=response_data, status=status.HTTP_200_OK)


class IdentificationCreateAPI(APIView):
    class InputSerializer(DataclassSerializer):
        class Meta:
            dataclass = IdentificationInputRequest

    def post(self, request):
        serializer = self.InputSerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        identification_services.identification_create(
            enterprise_id=request.enterprise_id,
            identification_list=serializer.validated_data,
        )
        return Response(status=status.HTTP_201_CREATED)
