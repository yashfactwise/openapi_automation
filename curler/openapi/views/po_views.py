from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from openapi.serializers import AdditionalCostInputSerializer, AttachmentSerializer
from purchase_order.views.request_serializer import PaymentTermsSerializer
from purchase_order.views.request_serializer import DeliverablesPaymentTermsSerializer

from custom.serializers import CustomSectionsOpenAPIInputSerializer
from openapi.services import po_services as openapi_po_service
from purchase_order.states import PurchaseOrderState, PurchaseOrderTerminationStatus
from factwise.states import PaymentType
from factwise.states import states_as_list


class TermsAndConditionsSerializer(serializers.Serializer):
    terms_and_conditions_id = serializers.CharField(default=None, allow_null=True)
    name = serializers.CharField(default=None, allow_blank=True, allow_null=True)
    data = serializers.CharField(default=None, allow_blank=True, allow_null=True)


class DeliveryScheduleSerializer(serializers.Serializer):
    project_id = serializers.CharField(default=None, allow_null=True)
    cost_centre_id = serializers.CharField(default=None, allow_null=True)
    general_ledger_id = serializers.CharField(default=None, allow_null=True)
    quantity = serializers.DecimalField(max_digits=30, decimal_places=10)
    delivery_date = serializers.DateField(default=None, allow_null=True)


class PurchaseOrderItemsInputSerializer(serializers.Serializer):
    ERP_item_code = serializers.CharField(allow_null=True, default=None)
    factwise_item_code = serializers.CharField(allow_null=True, default=None)
    item_additional_details = serializers.CharField(
        required=False, default=None, allow_blank=True
    )
    internal_notes = serializers.CharField(default=None, allow_blank=True)
    external_notes = serializers.CharField(default=None, allow_blank=True)
    price = serializers.DecimalField(max_digits=30, decimal_places=10)
    additional_costs = AdditionalCostInputSerializer(many=True, default=[])
    taxes = AdditionalCostInputSerializer(many=True, default=[])
    discounts = AdditionalCostInputSerializer(many=True, default=[])
    measurement_unit = serializers.UUIDField(allow_null=True, default=None)
    quantity = serializers.DecimalField(max_digits=30, decimal_places=10)
    incoterm = serializers.CharField(default=None, allow_null=True)
    prepayment_percentage = serializers.DecimalField(
        max_digits=13,
        decimal_places=10,
        default=0,
        allow_null=True,
        required=False,
    )
    payment_terms = PaymentTermsSerializer(
        allow_null=True, default=None, required=False
    )
    payment_type = serializers.ChoiceField(
        states_as_list(PaymentType),
        default=None,
        allow_null=True,
        required=False,
    )
    deliverables_payment_terms = DeliverablesPaymentTermsSerializer(
        many=True, allow_null=True, default=[], required=False
    )
    lead_time = serializers.DecimalField(
        max_digits=30, decimal_places=10, default=None, allow_null=True
    )
    lead_time_period = serializers.CharField(
        max_length=100, default=None, allow_null=True
    )
    delivery_schedules = serializers.ListField(
        child=DeliveryScheduleSerializer(), min_length=1
    )
    custom_sections = CustomSectionsOpenAPIInputSerializer(many=True)
    attachments = AttachmentSerializer(many=True)


class PurchaseOrderCreateAPI(APIView):
    class InputSerializer(serializers.Serializer):
        class BuyerDetailsSerializer(serializers.Serializer):
            entity_name = serializers.CharField()
            billing_address_id = serializers.CharField()
            shipping_address_id = serializers.CharField()
            identifications = serializers.ListField(
                child=serializers.CharField(), min_length=0
            )
            contacts = serializers.ListField(
                child=serializers.CharField(), min_length=0
            )

        class SellerDetailsSerializer(serializers.Serializer):
            factwise_vendor_code = serializers.CharField(allow_null=True, default=None)
            ERP_vendor_code = serializers.CharField(allow_null=True, default=None)
            seller_address_id = serializers.CharField(allow_null=True)
            seller_full_address = serializers.CharField(default="", allow_blank=True)
            identifications = serializers.ListField(
                child=serializers.CharField(), min_length=0
            )
            contacts = serializers.ListField(
                child=serializers.CharField(), min_length=0
            )

        class PurchaseOrderDetailsSerializer(serializers.Serializer):
            created_by_user_email = serializers.EmailField()
            ERP_po_id = serializers.CharField()
            status = serializers.ChoiceField(states_as_list(PurchaseOrderState))
            event = serializers.CharField(allow_null=True)
            template_name = serializers.CharField(allow_null=True)
            issued_date = serializers.DateField(default=None, allow_null=True)
            accepted_date = serializers.DateField(default=None, allow_null=True)
            currency_code = serializers.UUIDField(allow_null=True, default=None)
            notes = serializers.CharField(default=None, allow_blank=True)
            terms_and_conditions = TermsAndConditionsSerializer(allow_null=True)
            incoterm = serializers.CharField(default="NA")
            prepayment_percentage = serializers.DecimalField(
                max_digits=13,
                decimal_places=10,
                default=0,
                allow_null=True,
                required=False,
            )
            payment_type = serializers.ChoiceField(
                states_as_list(PaymentType),
                default=None,
                allow_null=True,
                required=False,
            )
            payment_terms = PaymentTermsSerializer(
                allow_null=True, default=None, required=False
            )
            deliverables_payment_terms = DeliverablesPaymentTermsSerializer(
                many=True, allow_null=True, default=[], required=False
            )
            lead_time = serializers.DecimalField(
                max_digits=30, decimal_places=10, default=None, allow_null=True
            )
            lead_time_period = serializers.CharField(
                max_length=100, default=None, allow_null=True
            )
            additional_costs = AdditionalCostInputSerializer(many=True, default=[])
            taxes = AdditionalCostInputSerializer(many=True, default=[])
            discounts = AdditionalCostInputSerializer(many=True, default=[])
            custom_sections = CustomSectionsOpenAPIInputSerializer(many=True)

        buyer_details = BuyerDetailsSerializer()
        seller_details = SellerDetailsSerializer()
        purchase_order_details = PurchaseOrderDetailsSerializer()
        purchase_order_items = PurchaseOrderItemsInputSerializer(many=True)

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        custom_purchase_order_id = openapi_po_service.create_purchase_order(
            enterprise_id=request.enterprise_id, **serializer.validated_data
        )
        response_data = {"custom_purchase_order_id": custom_purchase_order_id}
        return Response(data=response_data, status=status.HTTP_201_CREATED)


class PurchaseOrderUpdateAPI(APIView):
    class InputSerializer(serializers.Serializer):
        class BuyerDetailsSerializer(serializers.Serializer):
            entity_name = serializers.CharField()
            # billing_address_id = serializers.CharField()
            # shipping_address_id = serializers.CharField()
            identifications = serializers.ListField(
                child=serializers.CharField(), min_length=0
            )
            contacts = serializers.ListField(
                child=serializers.CharField(), min_length=0
            )

        class SellerDetailsSerializer(serializers.Serializer):
            factwise_vendor_code = serializers.CharField(allow_null=True, default=None)
            ERP_vendor_code = serializers.CharField(allow_null=True, default=None)
            seller_address_id = serializers.CharField(allow_null=True)
            seller_full_address = serializers.CharField(default="", allow_blank=True)
            identifications = serializers.ListField(
                child=serializers.CharField(), min_length=0
            )
            contacts = serializers.ListField(
                child=serializers.CharField(), min_length=0
            )

        class PurchaseOrderDetailsSerializer(serializers.Serializer):
            # custom_id = serializers.CharField()
            modified_by_user_email = serializers.EmailField()
            factwise_po_id = serializers.CharField(required=False, default=None)
            ERP_po_id = serializers.CharField(required=False, default=None)
            status = serializers.ChoiceField(states_as_list(PurchaseOrderState))
            issued_date = serializers.DateField(default=None, allow_null=True)
            accepted_date = serializers.DateField(default=None, allow_null=True)
            currency_code = serializers.UUIDField()
            notes = serializers.CharField(default=None, allow_blank=True)
            terms_and_conditions = TermsAndConditionsSerializer(allow_null=True)
            incoterm = serializers.CharField(default=None, allow_null=True)
            prepayment_percentage = serializers.DecimalField(
                max_digits=13,
                decimal_places=10,
                default=0,
                allow_null=True,
                required=False,
            )
            payment_type = serializers.ChoiceField(
                states_as_list(PaymentType),
                default=None,
                allow_null=True,
                required=False,
            )
            payment_terms = PaymentTermsSerializer(
                allow_null=True, default=None, required=False
            )
            deliverables_payment_terms = DeliverablesPaymentTermsSerializer(
                many=True, allow_null=True, default=[], required=False
            )
            lead_time = serializers.DecimalField(
                max_digits=30, decimal_places=10, default=None, allow_null=True
            )
            lead_time_period = serializers.CharField(
                max_length=100, default=None, allow_null=True
            )
            additional_costs = AdditionalCostInputSerializer(many=True, default=[])
            taxes = AdditionalCostInputSerializer(many=True, default=[])
            discounts = AdditionalCostInputSerializer(many=True, default=[])
            custom_sections = CustomSectionsOpenAPIInputSerializer(many=True)

        buyer_details = BuyerDetailsSerializer()
        seller_details = SellerDetailsSerializer()
        purchase_order_details = PurchaseOrderDetailsSerializer()
        purchase_order_items = PurchaseOrderItemsInputSerializer(many=True)

    def put(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        po_id = openapi_po_service.update_purchase_order(
            enterprise_id=request.enterprise_id, **serializer.validated_data
        )
        response_data = {"purchase_order_id": po_id}
        return Response(data=response_data, status=status.HTTP_201_CREATED)


class PurchaseOrderStatusAPI(APIView):
    class InputSerializer(serializers.Serializer):
        status = serializers.ChoiceField(states_as_list(PurchaseOrderState))
        notes = serializers.CharField(default=None, allow_blank=True, allow_null=True)
        modified_by_user_email = serializers.EmailField()
        ERP_po_id = serializers.CharField(allow_null=True, default=None)
        factwise_po_id = serializers.CharField(allow_null=True, default=None)

    def put(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        openapi_po_service.update_purchase_order_status(
            enterprise_id=request.enterprise_id,
            **serializer.validated_data,
        )
        return Response(status=status.HTTP_200_OK)


class PurchaseOrderUpdateTerminationAPI(APIView):
    class InputSerializer(serializers.Serializer):
        status = serializers.ChoiceField(states_as_list(PurchaseOrderTerminationStatus))
        notes = serializers.CharField(required=False, default="", allow_blank=True)
        modified_by_user_email = serializers.EmailField()
        ERP_po_id = serializers.CharField(allow_null=True, default=None)
        factwise_po_id = serializers.CharField(allow_null=True, default=None)

    def put(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        openapi_po_service.update_purchase_order_termination(
            enterprise_id=request.enterprise_id,
            **serializer.validated_data,
        )
        return Response(status=status.HTTP_200_OK)
