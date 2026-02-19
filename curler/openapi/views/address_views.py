from openapi.services import address_services
from openapi.serializers import EntityAddressCreateSerializer
from organization.views.address_view import AddressDetailEntitiesSerializer
from rest_framework import serializers
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class AddressListAPI(APIView):
    def get(self, request):
        address_list = address_services.list_enterprise_address(
            enterprise_id=request.enterprise_id
        )
        response_data = AddressDetailEntitiesSerializer(address_list, many=True).data
        return Response(data=response_data, status=status.HTTP_200_OK)


class AddressCreateAPI(APIView):
    class InputSerializer(serializers.Serializer):
        entity_details = serializers.ListField(
            child=EntityAddressCreateSerializer(), min_length=0
        )
        address_nickname = serializers.CharField()
        address1 = serializers.CharField()
        address2 = serializers.CharField(
            allow_blank=True, allow_null=True, default=None
        )
        address3 = serializers.CharField(
            allow_blank=True, allow_null=True, default=None
        )
        city = serializers.CharField()
        state_or_territory = serializers.CharField()
        postal_code = serializers.CharField()
        country = serializers.CharField()
        notes = serializers.CharField(allow_blank=True, allow_null=True, default=None)

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        address = address_services.address_create(
            enterprise_id=request.enterprise_id, **serializer.validated_data
        )
        response_data = AddressDetailEntitiesSerializer(address).data
        return Response(data=response_data, status=status.HTTP_201_CREATED)
