from decimal import Decimal

from attributes.states import AttributeType
from openapi.structures import (
    AddressStruct,
    EntityAddressInputRequest,
    EntityTermsAndConditionsInputRequest,
    Identification,
    InvitedContact,
    PurchaseOrderItem,
    TermsAndConditionsStruct,
    VendorContactDeleteRequest,
)
from organization.org_models.vendor_master_model import (
    EntityVendorMaster,
    VendorContact,
)
from organization.structures import VendorContactDetailList
from purchase_order.states import PurchaseOrderInternalStatus
from rest_framework import serializers
from rest_framework_dataclasses.serializers import DataclassSerializer

from factwise.states import AppliedFromType, PeriodType, states_as_list


class AddressSerializer(serializers.Serializer):
    address_id = serializers.UUIDField()
    address_nickname = serializers.CharField(default=None, allow_null=True)
    address1 = serializers.CharField(default=None, allow_null=True)
    address2 = serializers.CharField(allow_blank=True, allow_null=True, default=None)
    address3 = serializers.CharField(allow_blank=True, allow_null=True, default=None)
    city = serializers.CharField(default=None, allow_null=True)
    state_or_territory = serializers.CharField(default=None, allow_null=True)
    postal_code = serializers.CharField(default=None, allow_null=True)
    country = serializers.CharField(default=None, allow_null=True)
    notes = serializers.CharField(allow_blank=True, allow_null=True, default=None)

    def validate(self, input_request):
        if input_request["address_id"]:
            return input_request
        else:
            return AddressStruct(**input_request)


class IdentificationSerializer(DataclassSerializer):
    class Meta:
        dataclass = Identification


class ItemAttributeSerializer(serializers.Serializer):
    attribute_name = serializers.CharField()
    attribute_value = serializers.ListField(child=serializers.CharField())
    attribute_exclude = serializers.BooleanField(default=False)


class AlternateMeasurementUnitSerializer(serializers.Serializer):
    measurement_unit = serializers.CharField()
    conversion_factor = serializers.DecimalField(max_digits=30, decimal_places=10)


class DeliveryScheduleSerializer(serializers.Serializer):
    quantity = serializers.DecimalField(max_digits=30, decimal_places=10)
    delivery_date = serializers.DateField(default=None, allow_null=True)
    requisition_department = serializers.UUIDField(allow_null=True, default=None)


class AdditionalChargesSerializer(serializers.Serializer):
    charge_name = serializers.CharField()
    charge_value = serializers.DecimalField(max_digits=30, decimal_places=10)


class ProcurementSerializer(serializers.Serializer):
    prepayment_percentage = serializers.DecimalField(
        max_digits=13, decimal_places=10, default=None
    )
    lead_time = serializers.IntegerField(default=None)
    lead_time_period = serializers.ChoiceField(states_as_list(PeriodType), default=None)
    payment_terms = serializers.IntegerField(default=None, allow_null=True)
    payment_terms_period = serializers.ChoiceField(
        states_as_list(PeriodType), default=None, allow_null=True
    )
    payment_terms_applied_from = serializers.ChoiceField(
        states_as_list(AppliedFromType), default=None, allow_null=True
    )


class DirectPurchaseOrderItemsSerializer(DataclassSerializer):
    class Meta:
        dataclass = PurchaseOrderItem


class EntityVendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = EntityVendorMaster
        fields = ["buyer_entity_name", "buyer_entity_id"]


class VendorContactDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorContact
        fields = [
            "vendor_contact_id",
            "buyer_entity",
            "seller_entity",
            "full_name",
            "primary_email",
            "phone_numbers",
            "tags",
            "user",
            "status",
        ]


class VendorContactEntityDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorContact
        fields = [
            "vendor_contact_id",
            "seller_entity",
            "full_name",
            "primary_email",
            "phone_numbers",
            "tags",
            "user",
            "status",
        ]


class ContactDetailListSerializer(DataclassSerializer):
    class Meta:
        dataclass = VendorContactDetailList


class InvitedContactSerializer(DataclassSerializer):
    class Meta:
        dataclass = InvitedContact


class VendorContactDeleteRequestSerializer(DataclassSerializer):
    class Meta:
        dataclass = VendorContactDeleteRequest


class VendorContactEntityDeleteRequestSerializer(serializers.Serializer):
    buyer_entity_name = serializers.CharField()
    entity_contacts = serializers.ListField(
        child=VendorContactDeleteRequestSerializer()
    )


class EntityAddressCreateSerializer(DataclassSerializer):
    class Meta:
        dataclass = EntityAddressInputRequest


class EntityTermsAndConditionsSerializer(DataclassSerializer):
    class Meta:
        dataclass = EntityTermsAndConditionsInputRequest


class EntityDetailsSerializer(serializers.Serializer):
    entity_name = serializers.CharField()
    billing_address_id = serializers.CharField()
    shipping_address_id = serializers.CharField()
    identifications = serializers.ListField(
        child=IdentificationSerializer(), default=[]
    )
    contacts = serializers.ListField(child=ContactDetailListSerializer(), default=[])


class PurchaseOrderDetailsSerializer(serializers.Serializer):
    custom_id = serializers.CharField()
    status = serializers.ChoiceField(
        choices=states_as_list(PurchaseOrderInternalStatus)
    )
    issue_date = serializers.DateField()
    accepted_date = serializers.DateField()
    # creator = serializers.UUIDField()
    currency_code = serializers.CharField()
    discount = serializers.DecimalField(max_digits=13, decimal_places=10)
    notes = serializers.CharField(allow_null=True, default=None, allow_blank=True)
    terms_and_conditions = serializers.ListField(
        child=serializers.UUIDField(), default=[]
    )
    custom_fields = serializers.ListField(child=serializers.DictField(), required=False)


class AttributeSerializer(serializers.Serializer):
    attribute_name = serializers.CharField()
    attribute_value = serializers.ListField(child=serializers.CharField())
    attribute_exclude = serializers.BooleanField(default=False)


class PaymentSerializer(serializers.Serializer):
    incoterm = serializers.CharField(default=None, allow_null=True)
    prepayment_percentage = serializers.DecimalField(
        max_digits=13, decimal_places=10, default=None
    )
    lead_time = serializers.IntegerField(default=None)
    lead_time_period = serializers.ChoiceField(
        states_as_list(PeriodType), default=None, allow_null=True
    )
    payment_terms = serializers.IntegerField(default=None, allow_null=True)
    payment_terms_period = serializers.ChoiceField(
        states_as_list(PeriodType), default=None, allow_null=True
    )
    payment_terms_applied_from = serializers.ChoiceField(
        states_as_list(AppliedFromType), default=None, allow_null=True
    )
    custom_fields_negotiate = serializers.ListField(
        child=AttributeSerializer(), default=[]
    )


class QuantityInformationSerializer(serializers.Serializer):
    UOM = serializers.CharField()
    quantity = serializers.DecimalField(max_digits=10, decimal_places=2)
    quantity_tolerance_percentage = serializers.DecimalField(
        max_digits=10, decimal_places=2
    )
    delivery_date = serializers.DateField(allow_null=True, required=False)
    requisition_department = serializers.CharField(allow_null=True, required=False)
    department = serializers.CharField(allow_null=True, required=False)
    general_ledger = serializers.CharField(allow_null=True, required=False)
    cost_centre = serializers.CharField(allow_null=True, required=False)
    project = serializers.CharField(allow_null=True, required=False)


class PurchaseOrderItemDetailsSerializer(serializers.Serializer):
    custom_id = serializers.CharField()
    item_description = serializers.CharField(default=None, allow_null=True)
    item_additional_details = serializers.CharField(default=None, allow_null=True)
    item_attribute = serializers.ListField(child=AttributeSerializer(), default=[])
    item_custom_fields = serializers.ListField(child=AttributeSerializer(), default=[])
    item_custom_attributes = serializers.DictField(
        child=serializers.CharField(), required=False
    )
    # pricing_information = PricingInformationSerializer()
    payment_information = PaymentSerializer()
    quantity_information = QuantityInformationSerializer()
    delivery_schedules = DeliveryScheduleSerializer(many=True)
    attachments = serializers.DictField(child=serializers.CharField(), required=False)
    internal_notes = serializers.CharField(
        default=None, allow_null=True, allow_blank=True
    )
    external_notes = serializers.CharField(
        default=None, allow_null=True, allow_blank=True
    )


class VendorIdentificationSerializer(serializers.Serializer):
    identification_name = serializers.CharField(
        error_messages={
            "required": "Identification name is required.",
            "blank": "Identification name cannot be empty.",
            "invalid": "Invalid identification name.",
        }
    )

    identification_value = serializers.CharField(
        error_messages={
            "required": "Identification value is required.",
            "blank": "Identification value cannot be empty.",
            "invalid": "Invalid identification value.",
        }
    )


class AddressSerializer(serializers.Serializer):
    address_id = serializers.CharField(
        allow_null=True,
        required=False,
        error_messages={
            "invalid": "Invalid address ID.",
            "blank": "Address ID cannot be empty.",
        },
    )
    full_address = serializers.CharField(
        allow_null=True,
        required=False,
        error_messages={
            "invalid": "Invalid address.",
            "blank": "Full address cannot be empty.",
        },
    )


class AttributeValueInputSerializer(serializers.Serializer):
    value = serializers.CharField(allow_null=True, allow_blank=True)


class AttributeInputSerializer(serializers.Serializer):
    attribute_name = serializers.CharField(
        error_messages={
            "required": "Attribute name is required.",
            "blank": "Attribute name cannot be empty.",
            "invalid": "Invalid attribute name.",
        }
    )
    attribute_type = serializers.ChoiceField(
        choices=states_as_list(AttributeType),
        error_messages={
            "required": "Attribute type is required.",
            "invalid_choice": "Invalid attribute type.",
        },
    )
    attribute_value = serializers.ListField(
        child=AttributeValueInputSerializer(),
        error_messages={
            "required": "Attribute value is required.",
            "not_a_list": "Attribute value must be a list.",
            "invalid": "Invalid attribute value.",
        },
    )


class AttachmentSerializer(serializers.Serializer):
    base64EncodedData = serializers.CharField(
        required=True,
        allow_blank=False,
        error_messages={
            "required": "base64EncodedData is required",
            "blank": "base64EncodedData cannot be empty",
            "invalid": "base64EncodedData must be a string",
        },
    )
    filename = serializers.CharField(
        required=True,
        allow_blank=False,
        error_messages={
            "required": "filename is required",
            "blank": "filename cannot be empty",
            "invalid": "filename must be a string",
        },
    )


class PaymentTermsSerializer(serializers.Serializer):
    term = serializers.IntegerField(
        min_value=0,
        error_messages={
            "required": "Payment term is required.",
            "invalid": "Payment term must be an integer.",
            "min_value": "Payment term cannot be negative.",
        },
    )
    period = serializers.ChoiceField(
        states_as_list(PeriodType),
        error_messages={
            "required": "Payment period is required.",
            "invalid_choice": "Invalid payment period.",
        },
    )
    applied_from = serializers.CharField(
        error_messages={
            "required": "Applied-from value is required.",
            "blank": "Applied-from cannot be empty.",
            "invalid": "Invalid applied-from value.",
        },
    )


class DeliverablesPaymentTermsSerializer(serializers.Serializer):
    allocation_percentage = serializers.DecimalField(
        max_digits=7,
        decimal_places=4,
        min_value=0,
        max_value=100,
        error_messages={
            "required": "Allocation percentage is required.",
            "invalid": "Invalid allocation percentage.",
            "min_value": "Allocation percentage cannot be less than 0.",
            "max_value": "Allocation percentage cannot exceed 100.",
            "max_digits": "Allocation percentage exceeds the maximum allowed digits.",
            "max_decimal_places": "Allocation percentage exceeds the maximum allowed decimal places.",
        },
    )
    term = serializers.IntegerField(
        min_value=0,
        error_messages={
            "required": "Payment term is required.",
            "invalid": "Payment term must be an integer.",
            "min_value": "Payment term cannot be negative.",
        },
    )
    period = serializers.ChoiceField(
        states_as_list(PeriodType),
        error_messages={
            "required": "Payment period is required.",
            "invalid_choice": "Invalid payment period.",
        },
    )
    applied_from_milestone = serializers.CharField(
        allow_null=True,
        required=False,
        error_messages={
            "invalid": "Invalid milestone value.",
            "blank": "Milestone value cannot be empty.",
        },
    )
    applied_from_fixed_date = serializers.DateField(
        allow_null=True,
        required=False,
        error_messages={
            "invalid": "Invalid fixed date.",
        },
    )


class AdditionalCostInputSerializer(serializers.Serializer):
    name = serializers.CharField(
        required=True,
        allow_blank=False,
        error_messages={
            "required": "name is required",
            "blank": "name cannot be empty",
            "invalid": "name must be a string",
        },
    )
    value = serializers.DecimalField(
        max_digits=30,
        decimal_places=10,
        min_value=0,
        required=True,
        error_messages={
            "required": "value is required",
            "invalid": "value must be a decimal number",
            "min_value": "value cannot be negative",
            "max_digits": "value exceeds maximum precision",
            "max_decimal_places": "value exceeds decimal precision",
        },
    )


class TermsAndConditionsSerializer(serializers.Serializer):
    name = serializers.CharField(
        error_messages={
            "required": "Terms and conditions name is required.",
            "blank": "Terms and conditions name cannot be empty.",
            "invalid": "Invalid terms and conditions name.",
        }
    )
    data = serializers.CharField(  # type: ignore
        allow_blank=True,
        allow_null=True,
        required=False,
        error_messages={
            "invalid": "Invalid terms and conditions data.",
        },
    )


class PricingTierInputSerializer(serializers.Serializer):
    rate = serializers.DecimalField(
        max_digits=30,
        decimal_places=10,
        min_value=Decimal("0.0000000001"),
        allow_null=True,
        required=False,
        error_messages={
            "invalid": "Invalid rate value.",
            "min_value": "Rate must be greater than 0.",
            "max_digits": "Rate exceeds the maximum allowed digits.",
            "max_decimal_places": "Rate exceeds the maximum allowed decimal places.",
        },
    )
    min_quantity = serializers.DecimalField(
        max_digits=30,
        decimal_places=10,
        min_value=Decimal("0.0000000001"),
        error_messages={
            "required": "Minimum quantity is required.",
            "invalid": "Invalid minimum quantity.",
            "min_value": "Minimum quantity must be greater than 0.",
            "max_digits": "Minimum quantity exceeds the maximum allowed digits.",
            "max_decimal_places": "Minimum quantity exceeds the maximum allowed decimal places.",
        },
    )
    max_quantity = serializers.DecimalField(
        max_digits=30,
        decimal_places=10,
        min_value=Decimal("0.0000000001"),
        error_messages={
            "required": "Maximum quantity is required.",
            "invalid": "Invalid maximum quantity.",
            "min_value": "Maximum quantity must be greater than 0.",
            "max_digits": "Maximum quantity exceeds the maximum allowed digits.",
            "max_decimal_places": "Maximum quantity exceeds the maximum allowed decimal places.",
        },
    )
    additional_costs = AdditionalCostInputSerializer(
        many=True,
        default=[],
        error_messages={
            "invalid": "Invalid additional cost data.",
        },
    )
    taxes = AdditionalCostInputSerializer(
        many=True,
        default=[],
        error_messages={
            "invalid": "Invalid tax data.",
        },
    )
    discounts = AdditionalCostInputSerializer(
        many=True,
        default=[],
        error_messages={
            "invalid": "Invalid discount data.",
        },
    )

    def validate(self, attrs):
        min_q = attrs.get("min_quantity")
        max_q = attrs.get("max_quantity")

        if min_q is not None and max_q is not None and min_q >= max_q:
            raise serializers.ValidationError(
                {
                    "max_quantity": "Maximum quantity must be greater than minimum quantity."
                }
            )

        return attrs
