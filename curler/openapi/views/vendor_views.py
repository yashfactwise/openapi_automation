from change_event.decorator import change_event
from custom.serializers import CustomSectionsOpenAPIInputSerializer
from openapi.serializers import EntityVendorSerializer
from openapi.serializers import ContactDetailListSerializer
from openapi.serializers import VendorContactDetailSerializer
from openapi.services import vendor_services
from openapi.structures import VendorContactEntity
from organization.org_models.vendor_master_model import EnterpriseVendorMaster
from organization.states import EnterpriseVendorMasterStatus
from organization.views.vendor_contact_view import VendorContactEmailInputSerializer
from organization.views.vendor_master_view import SellerEntitySerializer
from organization.views.vendor_master_view import VendorContactDetailSerializer
from organization.views.vendor_master_view import VendorContactInputSerializer
from organization.views.vendor_master_view import VendorIdentificationSerializer
from rest_framework import serializers
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_dataclasses.serializers import DataclassSerializer

from factwise.states import states_as_list


class AdditionalCostInputSerializer(serializers.Serializer):
    name = serializers.CharField()
    value = serializers.DecimalField(allow_null=True, max_digits=30, decimal_places=10)


class EntityVendorInputSerializer(serializers.Serializer):
    entity_name = serializers.CharField()
    preferred_items = serializers.ListField(child=serializers.CharField(), default=[])


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
    class InputSerializer(serializers.Serializer):
        created_by_user_email = serializers.EmailField()
        # vendor_code = serializers.CharField()
        vendor_name = serializers.CharField(max_length=200)
        ERP_vendor_code = serializers.CharField()
        seller_address_information = serializers.ListField(
            child=serializers.CharField(), default=[]
        )
        seller_identifications = serializers.ListField(
            child=VendorIdentificationSerializer(), default=[]
        )
        notes = serializers.CharField(allow_null=True, allow_blank=True, default=None)
        tags = serializers.ListField(
            child=serializers.CharField(), min_length=0, default=[]
        )
        additional_costs = AdditionalCostInputSerializer(many=True, default=[])
        primary_contact = VendorContactInputSerializer()
        secondary_contacts = serializers.ListField(
            child=VendorContactInputSerializer(), min_length=0
        )
        entities = EntityVendorInputSerializer(many=True, default=[])
        custom_sections = CustomSectionsOpenAPIInputSerializer(many=True)

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        enterprise_vendor_master_id = vendor_services.create_enterprise_vendor(
            enterprise_id=request.enterprise_id, **serializer.validated_data
        )
        return Response(
            data={"enterprise_vendor_master_id": enterprise_vendor_master_id},
            status=status.HTTP_201_CREATED,
        )


class UpdateEnterpriseVendorAPI(APIView):
    class InputSerializer(serializers.Serializer):
        modified_by_user_email = serializers.EmailField()
        # vendor_code = serializers.CharField()
        ERP_vendor_code = serializers.CharField(default=None, required=False)
        factwise_vendor_code = serializers.CharField(default=None, required=False)
        vendor_name = serializers.CharField()
        notes = serializers.CharField(allow_null=True, allow_blank=True, default=None)
        tags = serializers.ListField(
            child=serializers.CharField(), min_length=0, default=[]
        )
        seller_address_information = serializers.ListField(
            child=serializers.CharField(), default=[]
        )
        seller_identifications = serializers.ListField(
            child=VendorIdentificationSerializer(), default=[]
        )
        additional_costs = AdditionalCostInputSerializer(many=True, default=[])
        entities = EntityVendorInputSerializer(many=True, default=[])
        custom_sections = CustomSectionsOpenAPIInputSerializer(many=True)

    def put(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        vendor_services.update_enterprise_vendor(
            enterprise_id=request.enterprise_id, **serializer.validated_data
        )
        return Response(status=status.HTTP_200_OK)


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
