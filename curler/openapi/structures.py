import uuid
import dataclasses
import typing
from dataclasses import field
from datetime import date
from decimal import Decimal
from typing import Optional, Union
from typing import List
from rest_framework import serializers
from pydantic import EmailStr
from pydantic.dataclasses import dataclass
from dataclasses_json import dataclass_json

from organization.states import EntityContactStatus
from templates.structures import TemplateSectionList

from states import PeriodType
from states import AppliedFromType
from states import states_as_list

import typing


@dataclass_json
@dataclass
class AddressStruct:
    address_id: Optional[uuid.UUID] = field(
        metadata={
            "serializer_field": serializers.UUIDField(default=None, allow_null=True)
        }
    )
    address_nickname: str
    address1: str
    address2: Optional[str] = field(
        metadata={
            "serializer_field": serializers.CharField(default=None, allow_null=True)
        }
    )
    address3: Optional[str] = field(
        metadata={
            "serializer_field": serializers.CharField(default=None, allow_null=True)
        }
    )
    city: str
    state_or_territory: str
    postal_code: str
    country: str
    notes: Optional[str] = field(
        metadata={
            "serializer_field": serializers.CharField(default=None, allow_null=True)
        }
    )


@dataclass_json
@dataclass
class Identification:
    name: str
    value: str
    is_default: bool
    is_public: bool
    notes: typing.Optional[str] = None


@dataclass_json
@dataclass
class TermsAndConditionsStruct:
    terms_and_conditions_id: Optional[uuid.UUID] = field(
        metadata={
            "serializer_field": serializers.UUIDField(default=None, allow_null=True)
        }
    )
    name: str
    data: str
    notes: Optional[str] = field(
        metadata={
            "serializer_field": serializers.CharField(default=None, allow_null=True)
        }
    )


@dataclass_json
@dataclass
class Attribute:
    attribute_name: str
    attribute_value: List[str]
    attribute_exclude: Optional[bool] = field(
        metadata={"serializer_field": serializers.BooleanField(default=False)}
    )


@dataclass_json
@dataclass
class AlternateMeasurementUnitRequest:
    measurement_unit: str
    conversion_factor: Decimal


@dataclass_json
@dataclass
class ProcurementInfo:
    prepayment_percentage: Optional[Decimal] = None
    lead_time: Union[int, None] = None
    lead_time_period: Optional[Union[PeriodType, None]] = None
    payment_terms: Optional[int] = None
    payment_terms_period: Optional[str] = None
    payment_terms_applied_from: Optional[str] = None


@dataclass_json
@dataclass
class DeliverySchedule:
    quantity: Decimal
    delivery_date: Optional[date] = field(
        metadata={"serializer_field": serializers.DateField(default=None)}
    )
    requisition_department: Optional[uuid.UUID] = field(
        metadata={"serializer_field": serializers.DateField(default=None)}
    )


@dataclass_json
@dataclass
class AdditionalCharges:
    charge_name: str
    charge_value: Decimal


@dataclass_json
@dataclass
class Property:
    property_name: str
    property_value: str


@dataclass_json
@dataclass
class AttachmentTypeInput:
    id: uuid.UUID
    type: str


@dataclass_json
@dataclass
class PurchaseOrderItem:
    enterprise_item_id: uuid.UUID
    attributes: List[Attribute]
    quantity_tolerance_percentage: Optional[Decimal] = field(
        metadata={
            "serializer_field": serializers.DecimalField(
                max_digits=13, decimal_places=10, default=0
            )
        }
    )
    item_additional_details: Optional[str] = field(
        metadata={
            "serializer_field": serializers.CharField(default=None, allow_null=True)
        }
    )
    custom_item_name: Optional[str] = field(
        metadata={
            "serializer_field": serializers.CharField(default=None, allow_null=True)
        }
    )
    measurement_unit: str
    alternate_measurement_unit_list: List[AlternateMeasurementUnitRequest]
    delivery_schedules: List[DeliverySchedule]
    price: Decimal
    shipping_per_unit: Optional[Decimal] = field(
        metadata={
            "serializer_field": serializers.DecimalField(
                max_digits=30, decimal_places=10, default=0
            )
        }
    )
    additional_charges: List[AdditionalCharges]
    incoterm: Optional[str] = field(
        metadata={
            "serializer_field": serializers.CharField(default=None, allow_null=True)
        }
    )
    internal_notes: Optional[str] = field(
        metadata={
            "serializer_field": serializers.CharField(default="", allow_blank=True)
        }
    )
    external_notes: Optional[str] = field(
        metadata={
            "serializer_field": serializers.CharField(default="", allow_blank=True)
        }
    )
    prepayment_percentage: Optional[Decimal] = field(
        metadata={
            "serializer_field": serializers.DecimalField(
                max_digits=13, decimal_places=10, default=None, allow_null=True
            )
        }
    )
    lead_time: Optional[int] = field(
        metadata={
            "serializer_field": serializers.IntegerField(default=None, allow_null=True)
        }
    )
    lead_time_period: Optional[str] = field(
        metadata={
            "serializer_field": serializers.ChoiceField(
                states_as_list(PeriodType), default=None, allow_null=True
            )
        }
    )
    payment_terms: Optional[int] = field(
        metadata={
            "serializer_field": serializers.IntegerField(default=None, allow_null=True)
        }
    )
    payment_terms_period: Optional[str] = field(
        metadata={
            "serializer_field": serializers.ChoiceField(
                states_as_list(PeriodType), default=None, allow_null=True
            )
        }
    )
    payment_terms_applied_from: Optional[str] = field(
        metadata={
            "serializer_field": serializers.ChoiceField(
                states_as_list(AppliedFromType), default=None, allow_null=True
            )
        }
    )
    property_information: List[Property]
    attachments: List[AttachmentTypeInput]
    custom_fields_negotiate: TemplateSectionList


@dataclass_json
@dataclass
class InvitedContact:
    name: Optional[str] = field(
        metadata={
            "serializer_field": serializers.CharField(default=None, allow_null=True)
        }
    )
    email: Optional[EmailStr] = field(
        metadata={
            "serializer_field": serializers.EmailField(default=None, allow_null=True)
        }
    )


@dataclass_json
@dataclass
class EntityAddressInputRequest:
    entity_name: Optional[str] = field(
        metadata={"serializer_field": serializers.CharField(default=None)}
    )
    is_public: Optional[bool] = field(
        metadata={"serializer_field": serializers.BooleanField(default=None)}
    )
    is_primary_address: Optional[bool] = field(
        metadata={"serializer_field": serializers.BooleanField(default=None)}
    )
    is_billing_address: Optional[bool] = field(
        metadata={"serializer_field": serializers.BooleanField(default=None)}
    )
    is_shipping_address: Optional[bool] = field(
        metadata={"serializer_field": serializers.BooleanField(default=None)}
    )


@dataclass_json
@dataclass
class EntityTermsAndConditionsInputRequest:
    entity_name: Optional[str] = field(
        metadata={"serializer_field": serializers.CharField(default=None)}
    )
    is_default: Optional[bool] = field(
        metadata={"serializer_field": serializers.BooleanField(default=None)}
    )


@dataclass_json
@dataclass
class IdentificationInputRequest:
    entity_name: str
    name: str
    value: str
    notes: Optional[str] = field(
        metadata={
            "serializer_field": serializers.CharField(
                default=None, allow_null=True, allow_blank=True
            )
        }
    )
    is_default: Optional[bool] = field(
        metadata={"serializer_field": serializers.BooleanField(default=None)}
    )
    is_public: Optional[bool] = field(
        metadata={"serializer_field": serializers.BooleanField(default=None)}
    )


@dataclass_json
@dataclass
class VendorContactDetail:
    vendor_contact_id: uuid.UUID
    seller_entity_id: uuid.UUID
    full_name: str
    primary_email: EmailStr = field(
        metadata={"serializer_field": serializers.EmailField()}
    )
    phone_numbers: List[str]
    tags: List[str]
    user_id: uuid.UUID
    status: EntityContactStatus

    def __init__(self, **kwargs):
        names = {f.name for f in dataclasses.fields(self)}
        for k, v in kwargs.items():
            if k in names:
                setattr(self, k, v)


@dataclass_json
@dataclass
class VendorContactEntity:
    buyer_entity_id: uuid.UUID
    buyer_entity_name: str
    entity_contacts: List[VendorContactDetail]


@dataclass_json
@dataclass
class VendorEnterpriseEmailParameters:
    name: str
    enterprise_name: str
    invited_by_name: str
    invitation_id: uuid.UUID
    invitation_code: str


@dataclass_json
@dataclass
class VendorContactEmailParameters:
    name: str
    buyer_entity: str
    primary_contact_added_by: str
    seller_entity: str
    invitation_id: uuid.UUID
    invitation_code: str


@dataclass_json
@dataclass
class VendorContactDeleteRequest:
    vendor_contact_id: Optional[uuid.UUID] = field(
        metadata={
            "serializer_field": serializers.UUIDField(default=None, allow_null=True)
        }
    )
    email: Optional[EmailStr] = field(
        metadata={
            "serializer_field": serializers.EmailField(default=None, allow_null=True)
        }
    )


@dataclass_json
@dataclass
class VendorContactEntityDeleteRequest:
    buyer_entity_name: str
    entity_contacts: List[VendorContactDeleteRequest]
