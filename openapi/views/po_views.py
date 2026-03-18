from custom.serializers import CustomSectionsOpenAPIInputSerializer
from django.urls import reverse
from openapi.serializers import AdditionalCostInputSerializer, AttachmentSerializer
from openapi.services import po_services as openapi_po_service
from purchase_order.states import PurchaseOrderState, PurchaseOrderTerminationStatus
from purchase_order.views.request_serializer import (
    DeliverablesPaymentTermsSerializer,
    PaymentTermsSerializer,
)
from rest_framework import serializers, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from factwise.openapi.service import normalize_serializer_errors
from factwise.states import PaymentType, states_as_list


class TermsAndConditionsSerializer(serializers.Serializer):
    terms_and_conditions_id = serializers.CharField(
        required=False,
        allow_null=True,
        default=None,
        error_messages={
            "invalid": "terms_and_conditions_id must be a string",
        },
    )
    name = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
        default=None,
        error_messages={
            "invalid": "name must be a string",
        },
    )
    data = serializers.CharField(  # type: ignore
        required=False,
        allow_blank=True,
        allow_null=True,
        default=None,
        error_messages={
            "invalid": "data must be a string",
        },
    )


class DeliveryScheduleSerializer(serializers.Serializer):
    project_id = serializers.CharField(
        required=False,
        allow_null=True,
        default=None,
        error_messages={
            "invalid": "project_id must be a string",
        },
    )
    cost_centre_id = serializers.CharField(
        required=False,
        allow_null=True,
        default=None,
        error_messages={
            "invalid": "cost_centre_id must be a string",
        },
    )
    general_ledger_id = serializers.CharField(
        required=False,
        allow_null=True,
        default=None,
        error_messages={
            "invalid": "general_ledger_id must be a string",
        },
    )
    quantity = serializers.DecimalField(
        max_digits=30,
        decimal_places=10,
        required=True,
        error_messages={
            "required": "quantity is required",
            "invalid": "quantity must be a decimal number",
            "max_digits": "quantity exceeds maximum precision",
            "max_decimal_places": "quantity exceeds decimal precision",
        },
    )
    delivery_date = serializers.DateField(
        required=False,
        allow_null=True,
        default=None,
        error_messages={
            "invalid": "delivery_date must be a valid date (YYYY-MM-DD)",
        },
    )


class PurchaseOrderItemsInputSerializer(serializers.Serializer):
    ERP_item_code = serializers.CharField(
        required=False,
        allow_null=True,
        default=None,
        error_messages={
            "invalid": "ERP_item_code must be a string",
        },
    )
    factwise_item_code = serializers.CharField(
        required=False,
        allow_null=True,
        default=None,
        error_messages={
            "invalid": "factwise_item_code must be a string",
        },
    )
    item_additional_details = serializers.CharField(
        required=False,
        allow_blank=True,
        default=None,
        error_messages={
            "invalid": "item_additional_details must be a string",
        },
    )
    internal_notes = serializers.CharField(
        required=False,
        allow_blank=True,
        default=None,
        error_messages={
            "invalid": "internal_notes must be a string",
        },
    )
    external_notes = serializers.CharField(
        required=False,
        allow_blank=True,
        default=None,
        error_messages={
            "invalid": "external_notes must be a string",
        },
    )
    price = serializers.DecimalField(
        max_digits=30,
        decimal_places=10,
        required=True,
        min_value=0,
        error_messages={
            "required": "price is required",
            "invalid": "price must be a decimal number",
            "min_value": "price cannot be negative",
            "max_digits": "price exceeds maximum precision",
            "max_decimal_places": "price exceeds decimal precision",
        },
    )
    additional_costs = AdditionalCostInputSerializer(
        many=True,
        required=False,
        default=list,
        error_messages={
            "invalid": "additional_costs must be a list of valid objects",
        },
    )
    taxes = AdditionalCostInputSerializer(
        many=True,
        required=False,
        default=list,
        error_messages={
            "invalid": "taxes must be a list of valid objects",
        },
    )
    discounts = AdditionalCostInputSerializer(
        many=True,
        required=False,
        default=list,
        error_messages={
            "invalid": "discounts must be a list of valid objects",
        },
    )
    measurement_unit = serializers.UUIDField(
        required=False,
        allow_null=True,
        default=None,
        error_messages={
            "invalid": "measurement_unit must be a valid UUID",
        },
    )
    quantity = serializers.DecimalField(
        max_digits=30,
        decimal_places=10,
        min_value=0,
        required=True,
        error_messages={
            "required": "quantity is required",
            "invalid": "quantity must be a decimal number",
            "min_value": "quantity cannot be negative",
            "max_digits": "quantity exceeds maximum precision",
            "max_decimal_places": "quantity exceeds decimal precision",
        },
    )
    incoterm = serializers.CharField(
        required=False,
        allow_null=True,
        default=None,
        error_messages={
            "invalid": "incoterm must be a string",
        },
    )
    prepayment_percentage = serializers.DecimalField(
        max_digits=13,
        decimal_places=10,
        default=0,
        allow_null=True,
        required=False,
        error_messages={
            "invalid": "prepayment_percentage must be a decimal number",
            "max_digits": "prepayment_percentage exceeds maximum precision",
            "max_decimal_places": "prepayment_percentage exceeds decimal precision",
        },
    )
    payment_terms = PaymentTermsSerializer(
        required=False,
        allow_null=True,
        default=None,
        error_messages={
            "invalid": "payment_terms must be a valid object",
        },
    )
    payment_type = serializers.ChoiceField(
        choices=states_as_list(PaymentType),  # type: ignore
        default=None,
        allow_null=True,
        required=False,
        error_messages={
            "invalid_choice": "payment_type is not a valid value",
        },
    )
    deliverables_payment_terms = DeliverablesPaymentTermsSerializer(
        many=True,
        required=False,
        allow_null=True,
        default=list,
        error_messages={
            "invalid": "deliverables_payment_terms must be a list of valid objects",
        },
    )
    lead_time = serializers.DecimalField(
        max_digits=30,
        decimal_places=10,
        default=None,
        allow_null=True,
        required=False,
        error_messages={
            "invalid": "lead_time must be a decimal number",
            "max_digits": "lead_time exceeds maximum precision",
            "max_decimal_places": "lead_time exceeds decimal precision",
        },
    )
    lead_time_period = serializers.CharField(
        max_length=100,
        default=None,
        allow_null=True,
        required=False,
        error_messages={
            "invalid": "lead_time_period must be a string",
            "max_length": "lead_time_period exceeds maximum length",
        },
    )
    delivery_schedules = serializers.ListField(
        child=DeliveryScheduleSerializer(),
        min_length=1,
        required=True,
        error_messages={
            "required": "delivery_schedules is required",
            "not_a_list": "delivery_schedules must be a list",
            "min_length": "delivery_schedules must contain at least one entry",
            "invalid": "delivery_schedules must be a list of valid objects",
        },
    )
    custom_sections = CustomSectionsOpenAPIInputSerializer(
        many=True,
        required=True,
        error_messages={
            "required": "custom_sections is required",
            "invalid": "custom_sections must be a list of valid objects",
        },
    )
    attachments = AttachmentSerializer(
        many=True,
        required=True,
        error_messages={
            "required": "attachments is required",
            "invalid": "attachments must be a list of valid objects",
        },
    )


class CreatePOBaseInputSerializer(serializers.Serializer):
    class BuyerDetailsSerializer(serializers.Serializer):
        entity_name = serializers.CharField(
            required=True,
            allow_blank=False,
            error_messages={
                "required": "entity_name is required",
                "blank": "entity_name cannot be empty",
            },
        )
        billing_address_id = serializers.CharField(
            required=True,
            allow_blank=False,
            error_messages={
                "required": "billing_address_id is required",
                "blank": "billing_address_id cannot be empty",
            },
        )
        shipping_address_id = serializers.CharField(
            required=True,
            allow_blank=False,
            error_messages={
                "required": "shipping_address_id is required",
                "blank": "shipping_address_id cannot be empty",
            },
        )
        identifications = serializers.ListField(
            child=serializers.CharField(allow_blank=False),
            required=False,
            default=list,
            error_messages={
                "not_a_list": "identifications must be a list of strings",
            },
        )
        contacts = serializers.ListField(
            child=serializers.CharField(allow_blank=False),
            required=False,
            default=list,
            error_messages={
                "not_a_list": "contacts must be a list of strings",
            },
        )

    class SellerDetailsSerializer(serializers.Serializer):
        factwise_vendor_code = serializers.CharField(
            required=False,
            allow_null=True,
            default=None,
            error_messages={
                "invalid": "factwise_vendor_code must be a string",
            },
        )
        ERP_vendor_code = serializers.CharField(
            required=False,
            allow_null=True,
            default=None,
            error_messages={
                "invalid": "ERP_vendor_code must be a string",
            },
        )
        seller_address_id = serializers.CharField(
            required=False,
            allow_null=True,
            error_messages={
                "invalid": "seller_address_id must be a string",
            },
        )
        seller_full_address = serializers.CharField(
            required=False,
            allow_blank=True,
            default="",
            error_messages={
                "invalid": "seller_full_address must be a string",
            },
        )
        identifications = serializers.ListField(
            child=serializers.CharField(
                allow_blank=False,
                error_messages={
                    "blank": "identifications entries cannot be empty",
                    "invalid": "identifications entries must be strings",
                },
            ),
            required=False,
            default=list,
            error_messages={
                "not_a_list": "identifications must be a list of strings",
            },
        )
        contacts = serializers.ListField(
            child=serializers.CharField(
                allow_blank=False,
                error_messages={
                    "blank": "contacts entries cannot be empty",
                    "invalid": "contacts entries must be strings",
                },
            ),
            required=False,
            default=list,
            error_messages={
                "not_a_list": "contacts must be a list of strings",
            },
        )

    class PurchaseOrderDetailsSerializer(serializers.Serializer):
        created_by_user_email = serializers.EmailField(
            required=True,
            error_messages={
                "required": "created_by_user_email is required",
                "invalid": "created_by_user_email must be a valid email address",
            },
        )
        ERP_po_id = serializers.CharField(
            required=True,
            allow_blank=False,
            error_messages={
                "required": "ERP_po_id is required",
                "blank": "ERP_po_id cannot be empty",
                "invalid": "ERP_po_id must be a string",
            },
        )
        status = serializers.ChoiceField(
            choices=states_as_list(PurchaseOrderState),  # type: ignore
            required=True,
            error_messages={
                "required": "status is required",
                "invalid_choice": "status is not a valid value",
            },
        )
        event = serializers.CharField(
            required=False,
            allow_null=True,
            error_messages={
                "invalid": "event must be a string",
            },
        )
        template_name = serializers.CharField(
            required=False,
            allow_null=True,
            error_messages={
                "invalid": "template_name must be a string",
            },
        )
        issued_date = serializers.DateField(
            required=False,
            allow_null=True,
            default=None,
            error_messages={
                "invalid": "issued_date must be a valid date (YYYY-MM-DD)",
            },
        )
        accepted_date = serializers.DateField(
            required=False,
            allow_null=True,
            default=None,
            error_messages={
                "invalid": "accepted_date must be a valid date (YYYY-MM-DD)",
            },
        )
        currency_code = serializers.UUIDField(
            required=False,
            allow_null=True,
            default=None,
            error_messages={
                "invalid": "currency_code must be a valid UUID",
            },
        )
        notes = serializers.CharField(
            required=False,
            allow_blank=True,
            default=None,
            error_messages={
                "invalid": "notes must be a string",
            },
        )
        terms_and_conditions = TermsAndConditionsSerializer(
            required=False,
            allow_null=True,
            error_messages={
                "invalid": "terms_and_conditions must be a valid object",
            },
        )
        incoterm = serializers.CharField(
            required=False,
            default="NA",
            allow_blank=False,
            error_messages={
                "blank": "incoterm cannot be empty",
                "invalid": "incoterm must be a string",
            },
        )
        prepayment_percentage = serializers.DecimalField(
            max_digits=13,
            decimal_places=10,
            default=0,
            allow_null=True,
            required=False,
            error_messages={
                "invalid": "prepayment_percentage must be a decimal number",
                "max_digits": "prepayment_percentage exceeds maximum precision",
                "max_decimal_places": "prepayment_percentage exceeds decimal precision",
            },
        )
        payment_type = serializers.ChoiceField(
            choices=states_as_list(PaymentType),  # type: ignore
            default=None,
            allow_null=True,
            required=False,
            error_messages={
                "invalid_choice": "payment_type is not a valid value",
            },
        )
        payment_terms = PaymentTermsSerializer(
            required=False,
            allow_null=True,
            default=None,
            error_messages={
                "invalid": "payment_terms must be a valid object",
            },
        )
        deliverables_payment_terms = DeliverablesPaymentTermsSerializer(
            many=True,
            required=False,
            allow_null=True,
            default=list,
            error_messages={
                "invalid": "deliverables_payment_terms must be a list of valid objects",
            },
        )
        lead_time = serializers.DecimalField(
            max_digits=30,
            decimal_places=10,
            default=None,
            allow_null=True,
            required=False,
            error_messages={
                "invalid": "lead_time must be a decimal number",
                "max_digits": "lead_time exceeds maximum precision",
                "max_decimal_places": "lead_time exceeds decimal precision",
            },
        )
        lead_time_period = serializers.CharField(
            max_length=100,
            default=None,
            allow_null=True,
            required=False,
            error_messages={
                "invalid": "lead_time_period must be a string",
                "max_length": "lead_time_period exceeds maximum length",
            },
        )
        additional_costs = AdditionalCostInputSerializer(
            many=True,
            required=False,
            default=list,
            error_messages={
                "invalid": "additional_costs must be a list of valid objects",
            },
        )
        taxes = AdditionalCostInputSerializer(
            many=True,
            required=False,
            default=list,
            error_messages={
                "invalid": "taxes must be a list of valid objects",
            },
        )
        discounts = AdditionalCostInputSerializer(
            many=True,
            required=False,
            default=list,
            error_messages={
                "invalid": "discounts must be a list of valid objects",
            },
        )
        custom_sections = CustomSectionsOpenAPIInputSerializer(
            many=True,
            required=True,
            error_messages={
                "required": "custom_sections is required",
                "invalid": "custom_sections must be a list of valid objects",
            },
        )

    buyer_details = BuyerDetailsSerializer(
        required=True,
        error_messages={
            "required": "buyer_details is required",
            "null": "buyer_details cannot be null",
            "invalid": "buyer_details must be a valid object",
        },
    )
    seller_details = SellerDetailsSerializer(
        required=True,
        error_messages={
            "required": "seller_details is required",
            "null": "seller_details cannot be null",
            "invalid": "seller_details must be a valid object",
        },
    )
    purchase_order_details = PurchaseOrderDetailsSerializer(
        required=True,
        error_messages={
            "required": "purchase_order_details is required",
            "null": "purchase_order_details cannot be null",
            "invalid": "purchase_order_details must be a valid object",
        },
    )
    purchase_order_items = PurchaseOrderItemsInputSerializer(
        many=True,
        required=True,
        error_messages={
            "required": "purchase_order_items is required",
            "not_a_list": "purchase_order_items must be a list",
            "invalid": "purchase_order_items must be a list of valid objects",
        },
    )


class UpdatePOBaseInputSerializer(serializers.Serializer):
    class BuyerDetailsSerializer(serializers.Serializer):
        entity_name = serializers.CharField(
            required=True,
            allow_blank=False,
            error_messages={
                "required": "entity_name is required",
                "blank": "entity_name cannot be empty",
            },
        )
        identifications = serializers.ListField(
            child=serializers.CharField(allow_blank=False),
            required=False,
            default=list,
            error_messages={
                "not_a_list": "identifications must be a list of strings",
            },
        )
        contacts = serializers.ListField(
            child=serializers.CharField(allow_blank=False),
            required=False,
            default=list,
            error_messages={
                "not_a_list": "contacts must be a list of strings",
            },
        )

    class SellerDetailsSerializer(serializers.Serializer):
        factwise_vendor_code = serializers.CharField(
            required=False,
            allow_null=True,
            default=None,
            error_messages={
                "invalid": "factwise_vendor_code must be a string",
            },
        )
        ERP_vendor_code = serializers.CharField(
            required=False,
            allow_null=True,
            default=None,
            error_messages={
                "invalid": "ERP_vendor_code must be a string",
            },
        )
        seller_address_id = serializers.CharField(
            required=False,
            allow_null=True,
            error_messages={
                "invalid": "seller_address_id must be a string",
            },
        )
        seller_full_address = serializers.CharField(
            required=False,
            allow_blank=True,
            default="",
            error_messages={
                "invalid": "seller_full_address must be a string",
            },
        )
        identifications = serializers.ListField(
            child=serializers.CharField(
                allow_blank=False,
                error_messages={
                    "blank": "identifications entries cannot be empty",
                    "invalid": "identifications entries must be strings",
                },
            ),
            required=False,
            default=list,
            error_messages={
                "not_a_list": "identifications must be a list of strings",
            },
        )
        contacts = serializers.ListField(
            child=serializers.CharField(
                allow_blank=False,
                error_messages={
                    "blank": "contacts entries cannot be empty",
                    "invalid": "contacts entries must be strings",
                },
            ),
            required=False,
            default=list,
            error_messages={
                "not_a_list": "contacts must be a list of strings",
            },
        )

    class PurchaseOrderDetailsSerializer(serializers.Serializer):
        modified_by_user_email = serializers.EmailField(
            required=True,
            error_messages={
                "required": "modified_by_user_email is required",
                "invalid": "modified_by_user_email must be a valid email address",
            },
        )
        factwise_po_id = serializers.CharField(
            required=True,
            allow_blank=False,
            error_messages={
                "required": "factwise_po_id is required",
                "blank": "factwise_po_id cannot be empty",
                "invalid": "factwise_po_id must be a string",
            },
        )
        ERP_po_id = serializers.CharField(
            required=True,
            allow_blank=False,
            error_messages={
                "required": "ERP_po_id is required",
                "blank": "ERP_po_id cannot be empty",
                "invalid": "ERP_po_id must be a string",
            },
        )
        status = serializers.ChoiceField(
            choices=states_as_list(PurchaseOrderState),  # type: ignore
            required=True,
            error_messages={
                "required": "status is required",
                "invalid_choice": "status is not a valid value",
            },
        )
        issued_date = serializers.DateField(
            required=False,
            allow_null=True,
            default=None,
            error_messages={
                "invalid": "issued_date must be a valid date (YYYY-MM-DD)",
            },
        )
        accepted_date = serializers.DateField(
            required=False,
            allow_null=True,
            default=None,
            error_messages={
                "invalid": "accepted_date must be a valid date (YYYY-MM-DD)",
            },
        )
        currency_code = serializers.UUIDField(
            error_messages={
                "invalid": "currency_code must be a valid UUID",
            },
        )
        notes = serializers.CharField(
            required=False,
            allow_blank=True,
            default=None,
            error_messages={
                "invalid": "notes must be a string",
            },
        )
        terms_and_conditions = TermsAndConditionsSerializer(
            required=False,
            allow_null=True,
            error_messages={
                "invalid": "terms_and_conditions must be a valid object",
            },
        )
        incoterm = serializers.CharField(
            required=False,
            default=None,
            allow_blank=False,
            error_messages={
                "blank": "incoterm cannot be empty",
                "invalid": "incoterm must be a string",
            },
        )
        prepayment_percentage = serializers.DecimalField(
            max_digits=13,
            decimal_places=10,
            default=0,
            allow_null=True,
            required=False,
            error_messages={
                "invalid": "prepayment_percentage must be a decimal number",
                "max_digits": "prepayment_percentage exceeds maximum precision",
                "max_decimal_places": "prepayment_percentage exceeds decimal precision",
            },
        )
        payment_type = serializers.ChoiceField(
            choices=states_as_list(PaymentType),  # type: ignore
            default=None,
            allow_null=True,
            required=False,
            error_messages={
                "invalid_choice": "payment_type is not a valid value",
            },
        )
        payment_terms = PaymentTermsSerializer(
            required=False,
            allow_null=True,
            default=None,
            error_messages={
                "invalid": "payment_terms must be a valid object",
            },
        )
        deliverables_payment_terms = DeliverablesPaymentTermsSerializer(
            many=True,
            required=False,
            allow_null=True,
            default=list,
            error_messages={
                "invalid": "deliverables_payment_terms must be a list of valid objects",
            },
        )
        lead_time = serializers.DecimalField(
            max_digits=30,
            decimal_places=10,
            default=None,
            allow_null=True,
            required=False,
            error_messages={
                "invalid": "lead_time must be a decimal number",
                "max_digits": "lead_time exceeds maximum precision",
                "max_decimal_places": "lead_time exceeds decimal precision",
            },
        )
        lead_time_period = serializers.CharField(
            max_length=100,
            default=None,
            allow_null=True,
            required=False,
            error_messages={
                "invalid": "lead_time_period must be a string",
                "max_length": "lead_time_period exceeds maximum length",
            },
        )
        additional_costs = AdditionalCostInputSerializer(
            many=True,
            required=False,
            default=list,
            error_messages={
                "invalid": "additional_costs must be a list of valid objects",
            },
        )
        taxes = AdditionalCostInputSerializer(
            many=True,
            required=False,
            default=list,
            error_messages={
                "invalid": "taxes must be a list of valid objects",
            },
        )
        discounts = AdditionalCostInputSerializer(
            many=True,
            required=False,
            default=list,
            error_messages={
                "invalid": "discounts must be a list of valid objects",
            },
        )
        custom_sections = CustomSectionsOpenAPIInputSerializer(
            many=True,
            required=True,
            error_messages={
                "required": "custom_sections is required",
                "invalid": "custom_sections must be a list of valid objects",
            },
        )

    buyer_details = BuyerDetailsSerializer(
        required=True,
        error_messages={
            "required": "buyer_details is required",
            "null": "buyer_details cannot be null",
            "invalid": "buyer_details must be a valid object",
        },
    )
    seller_details = SellerDetailsSerializer(
        required=True,
        error_messages={
            "required": "seller_details is required",
            "null": "seller_details cannot be null",
            "invalid": "seller_details must be a valid object",
        },
    )
    purchase_order_details = PurchaseOrderDetailsSerializer(
        required=True,
        error_messages={
            "required": "purchase_order_details is required",
            "null": "purchase_order_details cannot be null",
            "invalid": "purchase_order_details must be a valid object",
        },
    )
    purchase_order_items = PurchaseOrderItemsInputSerializer(
        many=True,
        required=True,
        error_messages={
            "required": "purchase_order_items is required",
            "not_a_list": "purchase_order_items must be a list",
            "invalid": "purchase_order_items must be a list of valid objects",
        },
    )


class PurchaseOrderCreateAPI(APIView):
    def post(self, request):
        serializer = CreatePOBaseInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        custom_purchase_order_id = openapi_po_service.create_purchase_order(
            enterprise_id=request.enterprise_id, **serializer.validated_data
        )
        response_data = {"custom_purchase_order_id": custom_purchase_order_id}
        return Response(data=response_data, status=status.HTTP_201_CREATED)


class PurchaseOrderBulkCreateAPI(APIView):
    def post(self, request):
        if not isinstance(request.data, dict) or "purchase_orders" not in request.data:
            raise ValidationError("'purchase_orders' must be provided")

        pos = request.data["purchase_orders"]
        if not isinstance(pos, list):
            raise ValidationError("'purchase_orders' must be a list")

        validated_pos = []
        validation_errors = []

        for index, po_data in enumerate(pos):
            serializer = CreatePOBaseInputSerializer(data=po_data)
            if serializer.is_valid():
                validated_pos.append(
                    {"index": index, "data": serializer.validated_data}
                )
            else:
                errors = normalize_serializer_errors(serializer.errors)  # type: ignore
                validation_errors.append(
                    {
                        "index": index,
                        "erp_purchase_order_code": po_data.get(
                            "purchase_order_details"
                        ).get("ERP_po_id"),
                        "error": "; ".join(
                            f"{field}: {', '.join(map(str, msgs)) if isinstance(msgs, list) else msgs}"
                            for field, msgs in errors.items()
                        ),
                    }
                )

        service_result = openapi_po_service.create_purchase_orders_bulk(
            enterprise_id=request.enterprise_id,
            purchase_orders_payload=[i["data"] for i in validated_pos],
            total_len=len(pos),
            validation_errors=validation_errors,
        )

        if service_result.get("mode") == "async":
            return Response(
                {
                    "mode": "async",
                    "status": "accepted",
                    "task_id": service_result["task_id"],
                    "total_purchase_orders": len(pos),
                    "message": "Purchase order count exceeds synchronous limit. Processing asynchronously.",
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
                "erp_purchase_order_code": r.get("erp_purchase_order_code"),  # type: ignore
                "error": r["error"],  # type: ignore
            }
            for r in results
            if r["status"] == "failed"  # type: ignore
        ]

        return Response(
            {
                "total": len(pos),
                "successful_count": service_result["success"],
                "failed_count": len(final_failed),
                "successful": [
                    {
                        "erp_purchase_order_code": str(r.get("erp_purchase_order_code", "")),  # type: ignore
                        "purchase_order_code": str(r.get("purchase_order_code", "")),  # type: ignore
                        "purchase_order_id": str(r.get("purchase_order_id", "")),  # type: ignore
                    }
                    for r in results
                    if r["status"] == "success"  # type: ignore
                ],
                "failed": final_failed,
            },
            status=status.HTTP_207_MULTI_STATUS,
        )


class PurchaseOrderUpdateAPI(APIView):
    def put(self, request):
        serializer = UpdatePOBaseInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        po_id = openapi_po_service.update_purchase_order(
            enterprise_id=request.enterprise_id, **serializer.validated_data
        )
        response_data = {"purchase_order_id": po_id}
        return Response(data=response_data, status=status.HTTP_201_CREATED)


class PurchaseOrderBulkUpdateAPI(APIView):
    def put(self, request):
        if not isinstance(request.data, dict) or "purchase_orders" not in request.data:
            raise ValidationError("'purchase_orders' must be provided")

        purchase_orders = request.data["purchase_orders"]
        if not isinstance(purchase_orders, list):
            raise ValidationError("'purchase_orders' must be a list")

        validated_pos = []
        validation_errors = []

        for index, po_data in enumerate(purchase_orders):
            serializer = UpdatePOBaseInputSerializer(data=po_data)
            if serializer.is_valid():
                validated_pos.append(
                    {
                        "index": index,
                        "data": serializer.validated_data,
                    }
                )
            else:
                errors = normalize_serializer_errors(serializer.errors)  # type: ignore
                validation_errors.append(
                    {
                        "index": index,
                        "erp_purchase_order_code": po_data.get(
                            "purchase_order_details"
                        ).get("ERP_po_id"),
                        "error": "; ".join(
                            f"{field}: {', '.join(map(str, msgs)) if isinstance(msgs, list) else msgs}"
                            for field, msgs in errors.items()
                        ),
                    }
                )

        service_result = openapi_po_service.update_purchase_orders_bulk(
            enterprise_id=request.enterprise_id,
            purchase_orders_payload=[i["data"] for i in validated_pos],
            total_len=len(purchase_orders),
            validation_errors=validation_errors,
        )

        if service_result.get("mode") == "async":
            return Response(
                {
                    "mode": "async",
                    "status": "accepted",
                    "task_id": service_result["task_id"],
                    "total_purchase_orders": len(purchase_orders),
                    "message": "Purchase order count exceeds synchronous limit. Processing asynchronously.",
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
                "erp_purchase_order_code": r.get("erp_purchase_order_code"),  # type: ignore
                "error": r["error"],  # type: ignore
            }
            for r in results
            if r["status"] == "failed"  # type: ignore
        ]

        return Response(
            {
                "total": len(purchase_orders),
                "successful_count": service_result["success"],
                "failed_count": len(final_failed),
                "successful": [
                    {
                        "erp_purchase_order_code": str(r.get("erp_purchase_order_code", "")),  # type: ignore
                        "purchase_order_code": str(r.get("purchase_order_code", "")),  # type: ignore
                        "purchase_order_id": str(r.get("purchase_order_id", "")),  # type: ignore
                    }
                    for r in results
                    if r["status"] == "success"  # type: ignore
                ],
                "failed": final_failed,
            },
            status=status.HTTP_207_MULTI_STATUS,
        )


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
