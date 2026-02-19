import uuid
from dataclasses import asdict
from datetime import datetime

from additional_costs import services as additional_cost_service
from additional_costs.structures import AdditionalCostDataClass
from backbone import service as backbone_service
from django.db import transaction
from django.db.models import Count
from django.db.models import Q
from django.utils import timezone
from decimal import Decimal
from event.rfq.services import rfq_item_service
from event.services import event_service
from event.states import EventType, SellerState
from event.po_group.services import po_group_service
from event.po_group.services import po_group_item_service
from event.po_group.states import PoGroupStandardTermsType
from event.po_group.structures import (
    PoGroupItemAdditionalDetails,
    PoGroupItemDeliveryInformation,
    PoGroupItemSellerContacts,
)

# from custom.structures import CustomSectionDataClass, CustomFieldDataClass
from factwise.openapi.services import custom_services
from organization.org_models.vendor_master_model import EnterpriseVendorMaster
from organization.services import address_service
from organization.services import enterprise_user_service
from organization.services import item_service
from organization.services import project_service
from organization.services import terms_and_conditions_service
from invoice.states import InvoiceState
from invoice.states import InvoiceType
from module_templates import services as template_services
from module_templates.types import ModuleTemplateType
from openapi.structures import ProcurementInfo

from permission.models import Permission
from organization.org_models.item_master_model import EnterpriseItem, EntityItem
from organization.services import entity_service
from organization.services import identification_service
from organization.services import vendor_contact_service
from organization.services import vendor_master_service
from organization.services import custom_id_service as org_service
from organization.subscriptions import services as subscription_service
from organization.subscriptions.types import QuantityType
from purchase_order.models.purchase_order_model import PurchaseOrder
from purchase_order.models.purchase_order_item_model import PurchaseOrderItem
from purchase_order.services import event_po_service
from purchase_order.services import event_po_item_service
from purchase_order.services import purchase_order_service
from purchase_order.services import purchase_order_item_service
from purchase_order.services import common as po_common_service
from purchase_order.states import (
    PurchaseOrderItemInternalStatus,
    PurchaseOrderState,
    PurchaseOrderCreationState,
    PurchaseOrderTerminationStatus,
    PurchaseOrderType,
)
from purchase_order.structures.po_structures import (
    PurchaseOrderPricingInformation,
    PurchaseOrderItemNotes,
    PurchaseOrderItemPricingInformation,
    PurchaseOrderTerminationInformation,
)
from purchase_order.workflows import po_workflows
from purchase_order.workflows import event_po_workflows

from factwise.exception import BadRequestException
from factwise.exception import ValidationException
from factwise.states import validate_state
from factwise.utils import JSONUtils


# @transaction.atomic
# def create_direct_purchase_order(
#     *,
#     enterprise_id,
#     entity_name,
#     shipping_address,
#     billing_address,
#     items,
#     seller_enterprise_id,
#     seller_entity_id,
#     seller_address_id,
#     seller_full_address,
#     new_buyer_identifications,
#     buyer_identifications,
#     seller_custom_identifications,
#     seller_identifications,
#     currency_code,
#     discount_percentage,
#     buyer_contact_list,
#     seller_contact_list,
#     terms_and_conditions,
#     notes
# ):
#     buyer_enterprise_id = enterprise_id
#     buyer_entity = entity_service.get_entity_via_name(
#         entity_name=entity_name, enterprise_id=buyer_enterprise_id
#     )
#     seller_entity = entity_service.get_entity(entity_id=seller_entity_id)

#     currency_code_obj = backbone_service.get_currency_via_code(
#         currency_code=currency_code
#     )
#     pricing_information = purchase_order_service.__pre_payment_default_pricing_info__(
#         discount_percentage=discount_percentage,
#         currency_code_id=currency_code_obj.entry_id
#     )

#     if shipping_address["address_id"]:
#         shipping_address_id = shipping_address["address_id"]
#     else:
#         shipping_address = AddressStruct(**shipping_address)
#         shipping_address_id = address_service.__save_address__(
#             address_nickname=shipping_address.address_nickname,
#             address1=shipping_address.address1,
#             address2=shipping_address.address2,
#             address3=shipping_address.address3,
#             city=shipping_address.city,
#             state_or_territory=shipping_address.state_or_territory,
#             postal_code=shipping_address.postal_code,
#             country=shipping_address.country,
#             notes=shipping_address.notes
#         )
#         address_service.__save_entity_addresses__(
#             entity_id=buyer_entity.entity_id,
#             address_list=EntityAddressInputRequestList(
#                 entity_address_list=EntityAddressInputRequest(
#                     address_id=shipping_address_id,
#                     status=EntityAddressState.ENTITY_ADDRESS_ACTIVE.value,
#                     is_public=True,
#                     is_primary_address=False,
#                     is_billing_address=True,
#                     is_shipping_address=True
#                 )
#             )
#         )

#     if billing_address["address_id"]:
#         billing_address_id = billing_address["address_id"]
#     else:
#         billing_address = AddressStruct(**billing_address)
#         billing_address_id = address_service.__save_address__(
#             address_nickname=billing_address.address_nickname,
#             address1=billing_address.address1,
#             address2=billing_address.address2,
#             address3=billing_address.address3,
#             city=billing_address.city,
#             state_or_territory=billing_address.state_or_territory,
#             postal_code=billing_address.postal_code,
#             country=billing_address.country,
#             notes=billing_address.notes
#         )
#         address_service.__save_entity_addresses__(
#             entity_id=buyer_entity.entity_id,
#             address_list=EntityAddressInputRequestList(
#                 entity_address_list=EntityAddressInputRequest(
#                     address_id=billing_address_id,
#                     status=EntityAddressState.ENTITY_ADDRESS_ACTIVE.value,
#                     is_public=True,
#                     is_primary_address=False,
#                     is_billing_address=True,
#                     is_shipping_address=True
#                 )
#             )
#         )

#     for buyer_identification in new_buyer_identifications:
#         identification = identification_service.__save_identification__(
#             entity_id=buyer_entity.entity_id,
#             name=buyer_identification.name,
#             value=buyer_identification.value,
#             category=IdentificationCategoryChoices.OTHERS.value,
#             notes=buyer_identification.notes,
#             is_default=buyer_identification.is_default,
#             is_public=buyer_identification.is_public
#         )
#         buyer_identification.append(identification.identification_id)

#     buyer_information = purchase_order_service.__construct_buyer_information__(
#         buyer_entity=buyer_entity,
#         billing_address_id=billing_address_id,
#         shipping_address_id=shipping_address_id,
#         buyer_identifications=buyer_identifications
#     )

#     buyer_contact_list = purchase_order_service.__construct_buyer_contact_list__(
#         buyer_contact_list, buyer_enterprise_id
#     )

#     seller_information = purchase_order_service.__construct_seller_information__(
#         seller_entity=seller_entity,
#         seller_address_id=seller_address_id,
#         seller_full_address=seller_full_address,
#         seller_custom_identifications=seller_custom_identifications,
#         seller_identifications=seller_identifications
#     )

#     terms_and_conditions_list = []
#     for term_and_condition in terms_and_conditions:
#         if term_and_condition["terms_and_conditions_id"]:
#             terms_and_conditions_id = term_and_condition["terms_and_conditions_id"]
#         else:
#             terms_and_conditions = TermsAndConditionsStruct(**term_and_condition)
#             terms_and_conditions_id = terms_and_conditions_service.__save_terms_and_conditions__(
#                 enterprise_id=enterprise_id,
#                 name=terms_and_conditions.name,
#                 terms_and_conditions_type=TermsAndConditionsType.PURCHASE_ORDER.value,
#                 data=terms_and_conditions.data,
#                 notes=terms_and_conditions.notes
#             )
#             terms_and_conditions_service.__save_entity_terms_and_conditions__(
#                 terms_and_conditions_id=terms_and_conditions_id,
#                 terms_and_conditions_list=EntityTNCUpdateRequestList(
#                     entity_tnc_request_list=EntityTNCUpdateRequest(
#                         entity=buyer_entity.entity_id, is_default=False
#                     )
#                 )
#             )
#             terms_and_conditions_list.append(
#                 {"terms_and_conditions_id": terms_and_conditions_id}
#             )
#         terms_and_conditions = purchase_order_service.__construct_terms_and_conditions__(
#             enterprise=buyer_entity.enterprise,
#             terms_and_conditions=terms_and_conditions_list
#         )

#     purchase_order = purchase_order_service.__save_purchase_order__(
#         event=None,
#         buyer_enterprise_id=buyer_enterprise_id,
#         buyer_entity_id=buyer_entity.entity_id,
#         buyer_information=buyer_information,
#         buyer_contact_list=buyer_contact_list,
#         seller_enterprise_id=seller_enterprise_id,
#         seller_entity_id=seller_entity_id,
#         seller_information=seller_information,
#         seller_contact_list=seller_contact_list,
#         notes=notes,
#         pricing_information=pricing_information,
#         terms_and_conditions=terms_and_conditions,
#         final_buyer_approval=None,
#         status=PurchaseOrderState.PO_ISSUED.value,
#         purchase_order_type=PurchaseOrderType.PO_DIRECT.value,
#         additional_information=None,
#         requisition_department=None
#     )
#     for item in items:
#         try:
#             existing_item = item_service.get_active_entity_item(
#                 item_id=item.enterprise_item_id,
#                 enterprise_id=buyer_enterprise_id,
#                 entity_id=buyer_entity.entity_id
#             )
#         except EntityItem.DoesNotExist:
#             raise ValidationException("Item doesn't exist for this entity")
#         quantity = __validate_and_get_quantity__(item.delivery_schedules)

#         measurement_unit = backbone_service.get_measurement_unit_via_name(
#             measurement_unit_name=item.measurement_unit
#         )
#         alternate_measurement_units = []
#         for alternate_measurement_unit in item.alternate_measurement_unit_list:
#             alternate_measurement_unit_obj = backbone_service.get_measurement_unit_via_name(
#                 measurement_unit_name=alternate_measurement_unit.measurement_unit
#             )
#             alternate_measurement_units.append(
#                 AlternateMeasurementUnitRequest(
#                     measurement_unit_id=alternate_measurement_unit_obj.measurement_unit_id,
#                     conversion_factor=alternate_measurement_unit.conversion_factor
#                 )
#             )

#         quantity_information = purchase_order_item_service.__construct_quantity_information__(
#             quantity=quantity,
#             measurement_unit_id=measurement_unit.measurement_unit_id,
#             alternate_measurement_unit_list=alternate_measurement_units,
#             quantity_tolerance_percentage=item.quantity_tolerance_percentage
#         )

#         incoterm_id = backbone_service.get_incoterm_via_name(incoterm='NA').entry_id
#         if item.incoterm:
#             incoterm = backbone_service.get_incoterm_via_name(incoterm=item.incoterm)
#             incoterm_id = incoterm.entry_id

#         attribute_information = purchase_order_item_service.__construct_attribute_information__(
#             existing_item.attributes, item.attributes
#         )
#         item_pricing_information = __construct_item_pricing_information__(
#             price=item.price,
#             shipping_per_unit=item.shipping_per_unit,
#             additional_charges=item.additional_charges,
#             currency_code=currency_code,
#             quantity=quantity
#         )
#         item_information = rfq_item_service.__construct_item_information__(
#             item_additional_details=item.item_additional_details,
#             custom_item_name=item.custom_item_name,
#             enterprise_item=existing_item
#         )
#         procurement_info = __construct_purchase_order_item_procurement_information__(
#             lead_time=item.lead_time,
#             prepayment_percentage=item.prepayment_percentage,
#             payment_terms=item.payment_terms,
#             payment_terms_period=item.payment_terms_period,
#             payment_terms_applied_from=item.payment_terms_applied_from,
#             lead_time_period=item.lead_time_period
#         )
#         custom_fields_negotiate = item.custom_fields_negotiate
#         if not item.custom_fields_negotiate:
#             custom_fields_negotiate = TemplateSectionList(
#                 section_list=[]
#             )
#         save_direct_purchase_order_item(
#             purchase_order=purchase_order,
#             quantity_information=quantity_information,
#             incoterm_id=incoterm_id,
#             fulfillment_information=PurchaseOrderItemFulfilmentInformation(),
#             item_information=item_information,
#             enterprise_item_id=item.enterprise_item_id,
#             attribute_information=attribute_information,
#             pricing_information=item_pricing_information,
#             procurement_info=procurement_info,
#             internal_notes=item.internal_notes,
#             external_notes=item.external_notes,
#             custom_fields_negotiate=custom_fields_negotiate
#         )
#     return purchase_order.purchase_order_id


# @transaction.atomic
# def create_direct_purchase_order(
#     *,
#     enterprise_id,
#     buyer_details,
#     seller_details,
#     purchase_order_details,
#     purchase_order_item_details,
#     entity_name,
#     shipping_address,
#     billing_address,
#     items,
#     seller_enterprise_id,
#     seller_entity_id,
#     seller_address_id,
#     seller_full_address,
#     new_buyer_identifications,
#     buyer_identifications,
#     seller_custom_identifications,
#     seller_identifications,
#     currency_code,
#     discount_percentage,
#     buyer_contact_list,
#     seller_contact_list,
#     terms_and_conditions,
#     notes,
#     action,
#     lead_time,
#     lead_time_period,
#     incoterm_id,
#     project_id,
#     gl_id,
#     cost_centre_id,
#     prepayment_percentage,
#     payment_type,
#     payment_terms,
#     deliverables_payment_terms,
#     custom_additional_information,
#     gr_tolerance,
#     requisition_information,
#     custom_fields,
# ):
#     buyer_details['shipping_address_id'] = openapi_common_service.external_id_to_internal_id(
#         model_name="Address",
#         integration_system="ERP",
#         external_id=buyer_details['shipping_address_id']
#     )
#     buyer_details['billing_address_id'] = openapi_common_service.external_id_to_internal_id(
#         model_name="Address",
#         integration_system="ERP",
#         external_id=buyer_details['billing_address_id']
#     )
#     if seller_details['identifications']:
#         seller_details['identifications'] = openapi_common_service.external_id_to_internal_id(
#             model_name="Identification",
#             integration_system="ERP",
#             external_id=seller_details['identifications']
#     )
#     if buyer_details['identifications']:
#         buyer_details['identifications'] = openapi_common_service.external_id_to_internal_id(
#             model_name="Identification",
#             integration_system="ERP",
#             external_id=buyer_details['identifications']
#     )
#     seller_details['billing_address_id'] = openapi_common_service.external_id_to_internal_id(
#         model_name="Address",
#         integration_system="ERP",
#         external_id=seller_details['billing_address_id']
#     )
#     if purchase_order_details['terms_and_conditions']:
#         purchase_order_details['terms_and_conditions'] = openapi_common_service.external_id_to_internal_id(
#             model_name="TermsAndConditions",
#             integration_system="ERP",
#             external_id=purchase_order_details['terms_and_conditions']
#         )

#     buyer_enterprise_id = enterprise_id
#     buyer_entity = entity_service.get_entity_via_name(
#         entity_name=buyer_details['entity_name'], enterprise_id=buyer_enterprise_id
#     )


#     buyer_information = purchase_order_service.__construct_buyer_information__(
#         buyer_entity=buyer_entity,
#         billing_address_id=buyer_details['billing_address_id'],
#         shipping_address_id=buyer_details['shipping_address_id'],
#         buyer_identifications=buyer_details['identifications']
#     )
#     buyer_contact_list = purchase_order_service.__construct_buyer_contact_list__(
#         buyer_details['contacts'], buyer_enterprise_id
#     )

#     seller_entity = entity_service.get_entity_via_name(
#         entity_name=seller_details['entity_name'], enterprise_id=buyer_enterprise_id
#     )
#     seller_information = purchase_order_service.__construct_seller_information__(
#         seller_entity=seller_entity,
#         seller_address_id=seller_details['billing_address_id'],
#         seller_full_address=seller_details['billing_address_id'],
#         seller_identifications=seller_details['identifications'],
#         seller_custom_identifications=[],
#     )

#     terms_and_conditions_list = []
#     for term_and_condition in purchase_order_details['terms_and_conditions']:
#         terms_and_conditions_id = term_and_condition["terms_and_conditions_id"]

#         terms_and_conditions_list.append(
#             {"terms_and_conditions_id": terms_and_conditions_id}
#         )

#     terms_and_conditions = purchase_order_service.__construct_terms_and_conditions__(
#         enterprise=buyer_entity.enterprise,
#         terms_and_conditions=terms_and_conditions_list
#     )

#     currency_code_obj = backbone_service.get_currency_via_code(
#         currency_code=purchase_order_details["currency_code"]
#     )
#     pricing_information = purchase_order_service.__pre_payment_default_pricing_info__(
#         discount_percentage=purchase_order_details["discount"],
#         currency_code_id=currency_code_obj.entry_id
#     )

#     purchase_order = __save_purchase_order__(
#         event=None,
#         buyer_enterprise_id=buyer_enterprise_id,
#         buyer_entity_id=buyer_entity.entity_id,
#         buyer_information=buyer_information,
#         buyer_contact_list=buyer_contact_list,
#         seller_enterprise_id=buyer_enterprise_id,
#         seller_entity_id=seller_entity.entity_id,
#         seller_information=seller_information,
#         seller_contact_list=[],
#         notes=purchase_order_details["notes"],
#         pricing_information=pricing_information,
#         terms_and_conditions=terms_and_conditions,
#         final_buyer_approval=None,
#         status=PurchaseOrderState.PO_ISSUED.value,
#         purchase_order_type=PurchaseOrderType.PO_DIRECT.value,
#         lead_time=lead_time,
#         lead_time_period=lead_time_period,
#         incoterm_id=incoterm_id,
#         project_id=project_id,
#         gl_id=gl_id,
#         cost_centre_id=cost_centre_id,
#         prepayment_percentage=prepayment_percentage,
#         payment_type=payment_type,
#         payment_terms=payment_terms,
#         deliverables_payment_terms=deliverables_payment_terms,
#         custom_additional_information=custom_additional_information,
#         gr_tolerance=gr_tolerance,
#         requisition_information=requisition_information,
#         custom_fields=custom_fields,
#         additional_information=None,
#         requisition_department=None,
#         custom_fields=purchase_order_details["custom_fields"][0]
#     )
#     purchase_order.save()

#     for item in purchase_order_item_details:
#         try:
#             item_id = openapi_common_service.external_id_to_internal_id(
#             model_name="EnterpriseItem",
#             integration_system="ERP",
#             external_id=item['custom_id']
#         )
#             existing_item = item_service.get_entity_item(
#                 item_id=item_id,
#                 enterprise_id=buyer_enterprise_id,
#                 entity_id=buyer_entity.entity_id
#             )

#         except EntityItem.DoesNotExist:
#             raise ValidationException("Item doesn't exist for this entity")

#         quantity = __validate_and_get_quantity__(item["delivery_schedules"])

#         measurement_unit = backbone_service.get_measurement_unit_via_name(
#             measurement_unit_name=item["quantity_information"]["UOM"]
#         )

#         quantity_information = purchase_order_item_service.__construct_quantity_information__(
#             quantity=quantity,
#             measurement_unit_id=measurement_unit.measurement_unit_id,
#             alternate_measurement_unit_list=[],
#             quantity_tolerance_percentage=item["quantity_information"]["quantity_tolerance_percentage"]
#         )

#         incoterm_id = backbone_service.get_incoterm_via_name(incoterm=item["payment_information"]["incoterm"]).entry_id

#         attribute_information = purchase_order_item_service.__construct_attribute_information__(
#             existing_item.attributes, item["item_attribute"]
#         )

#         item_pricing_information = __construct_item_pricing_information__(
#             price=item["pricing_information"]["price"],
#             shipping_per_unit=item["pricing_information"]["shipping_per_unit"],
#             additional_costs=item["pricing_information"]["additional_costs"],
#             additional_charges=item["pricing_information"]["additional_charges"],
#             discounts=item["pricing_information"]["discounts"],
#             currency_code=purchase_order_details["currency_code"],
#             quantity=quantity
#         )

#         item_information = rfq_item_service.__construct_item_information__(
#             item_additional_details=item["item_additional_details"],
#             custom_item_name=item["custom_id"],
#             enterprise_item=existing_item
#         )

#         procurement_info = __construct_purchase_order_item_procurement_information__(
#             lead_time=item["payment_information"]["lead_time"],
#             prepayment_percentage=item["payment_information"]["prepayment_percentage"],
#             payment_terms=item["payment_information"]["payment_terms"],
#             payment_terms_period=item["payment_information"]["payment_terms_period"],
#             payment_terms_applied_from=item["payment_information"]["payment_terms_applied_from"],
#             lead_time_period=item["payment_information"]["lead_time_period"]
#         )

#         custom_fields_negotiate = item["payment_information"]["custom_fields_negotiate"]
#         if not item["payment_information"]["custom_fields_negotiate"]:
#             custom_fields_negotiate = TemplateSectionList(
#                 section_list=[]
#             )

#         purchase_order_item = save_direct_purchase_order_item(
#             purchase_order=purchase_order,
#             quantity_information=quantity_information,
#             incoterm_id=incoterm_id,
#             fulfillment_information=PurchaseOrderItemFulfilmentInformation(),
#             item_information=item_information,
#             enterprise_item_id=existing_item.enterprise_item_id,
#             attribute_information=attribute_information,
#             pricing_information=item_pricing_information,
#             procurement_info=procurement_info,
#             internal_notes=item["internal_notes"],
#             external_notes=item["external_notes"],
#             custom_fields_negotiate=custom_fields_negotiate
#         )

#         openapi_common_service.save_external_id(
#             model_name="PurchaseOrderItem",
#             integration_system="ERP",
#             external_id=item["custom_id"],
#             internal_id=purchase_order_item.purchase_order_item_id
#         )

#     openapi_common_service.save_external_id(
#         model_name="PurchaseOrder",
#         integration_system="ERP",
#         external_id=purchase_order_details["custom_id"],
#         internal_id=purchase_order.purchase_order_id
#     )


#     resp = {
#         "purchase_order_id": purchase_order.purchase_order_id,
#         "purchase_order_custom_id": purchase_order_details["custom_id"]
#     }
#     return resp


@transaction.atomic
def create_purchase_order(
    *,
    enterprise_id,
    buyer_details,
    seller_details,
    purchase_order_details,
    purchase_order_items,
):
    print(f"[OPENAPI-PO] >>> create_purchase_order ENTERED enterprise={enterprise_id}", flush=True)
    email = purchase_order_details.get("created_by_user_email")
    user = enterprise_user_service.get_user_by_enterprise_email(
        enterprise_id=enterprise_id, email=email
    )
    if not user:
        raise ValidationException("User email does not exist in the enterprise")
    user_id = user.user_id
    buyer_entity_name = buyer_details.get("entity_name")
    buyer_entity = entity_service.get_entity_via_name(
        entity_name=buyer_entity_name, enterprise_id=enterprise_id
    )
    buyer_entity_id = buyer_entity.entity_id

    buyer_billing_address_nickname = buyer_details.get("billing_address_id")
    buyer_billing_address = address_service.get_address_via_name(
        enterprise_id=enterprise_id, address=buyer_billing_address_nickname
    )
    buyer_billing_address_id = buyer_billing_address.address_id
    buyer_shipping_address_nickname = buyer_details.get("shipping_address_id")
    buyer_shipping_address = address_service.get_address_via_name(
        enterprise_id=enterprise_id, address=buyer_shipping_address_nickname
    )
    buyer_shipping_address_id = buyer_shipping_address.address_id

    buyer_identification_name_list = buyer_details.get("identifications")
    buyer_identifications = identification_service.get_identification_list(
        identification_name_list=buyer_identification_name_list,
        entity_id=buyer_entity_id,
    ).values_list("identification_id", flat=True)

    # TODO: Use these emails instead of creator if they want to send contacts instead
    # buyer_contact_emails = seller_details.get("contacts")

    factwise_vendor_code = seller_details.get("factwise_vendor_code")
    if factwise_vendor_code:
        enterprise_vm = (
            vendor_master_service.get_enterprise_vendor_master_via_code_list(
                vendor_code_list=[factwise_vendor_code],
                buyer_enterprise_id=enterprise_id,
            )
            .filter(seller_entity__isnull=False)
            .first()
        )
        if enterprise_vm is None:
            raise ValidationException(f"Vendor {factwise_vendor_code} does not exist")
    else:
        ERP_vendor_code = seller_details.get("ERP_vendor_code")
        try:
            enterprise_vm = (
                vendor_master_service.get_enterprise_vendor_master_via_ERP_vendor_code(
                    buyer_enterprise_id=enterprise_id, ERP_vendor_code=ERP_vendor_code
                )
            )
        except EnterpriseVendorMaster.DoesNotExist:
            raise ValidationException("Vendor with ERP vendor Code does not exist")

    seller_entity_id = enterprise_vm.seller_entity_id
    seller_enterprise_id = enterprise_vm.seller_enterprise_id

    seller_address_nickname = seller_details.get("seller_address_id")
    seller_address_id = None
    if seller_address_nickname:
        seller_address = address_service.get_address_via_name(
            enterprise_id=seller_enterprise_id, address=seller_address_nickname
        )
        seller_address_id = seller_address.address_id
    seller_full_address = seller_details.get("seller_full_address")

    seller_identification_name_list = seller_details.get("identifications")
    seller_identifications = identification_service.get_identification_list(
        identification_name_list=seller_identification_name_list,
        entity_id=seller_entity_id,
    ).values_list("identification_id", flat=True)
    seller_contact_emails = seller_details.get("contacts")
    vcs = vendor_contact_service.get_vendor_contacts_from_emails(
        seller_entity_id=seller_entity_id,
        emails=seller_contact_emails,
    )
    seller_contact_list = vcs.values_list("user_id", flat=True)
    custom_event_id = purchase_order_details.get("event")
    event_id = None
    rfq_items_map = {}
    if custom_event_id:
        event = event_service.get_event_from_custom_event_id(
            enterprise_id=enterprise_id, custom_event_id=custom_event_id
        )
        if event.event_type != EventType.EVENT_RFQ.value:
            raise ValidationException(f"Event {custom_event_id} does not have a RFQ")
        rfq_items = event.sub_event.rfqeventitem_set.filter(
            deleted_datetime__isnull=True
        )
        for rfq_item in rfq_items:
            rfq_items_map[rfq_item.enterprise_item.ERP_item_code] = rfq_item
        event_id = event.event_id

    ERP_po_id = purchase_order_details.get("ERP_po_id")
    template_name = purchase_order_details.get("template_name")
    template = template_services._get_template_from_name(
        entity_id=buyer_entity_id,
        name=template_name,
        type=ModuleTemplateType.PO_GROUP_TEMPLATE,
    )
    template_id = template.template_id
    template_sections = template_services.get_template_sections(template_id=template_id)
    template_section_map = {
        section.alternate_name: section for section in template_sections
    }

    template_section_items = template_services.get_template_section_items(
        template_id=template_id
    ).filter(is_builtin_field=False)
    template_section_item_map = {
        (section_item.section.alternate_name, section_item.alternate_name): section_item
        for section_item in template_section_items
    }

    issued_date = purchase_order_details.get("issued_date")
    accepted_date = purchase_order_details.get("accepted_date")

    currency_id = purchase_order_details.get("currency_code")
    notes = purchase_order_details.get("notes")

    overall_incoterm = purchase_order_details.get("incoterm")
    overall_incoterm_id = (
        backbone_service.get_incoterm_via_name(incoterm=overall_incoterm).entry_id
        if overall_incoterm
        else None
    )

    prepayment_percentage = purchase_order_details.get("prepayment_percentage")
    payment_type = purchase_order_details.get("payment_type")
    payment_terms = purchase_order_details.get("payment_terms")
    deliverables_payment_terms = purchase_order_details.get(
        "deliverables_payment_terms"
    )
    lead_time = purchase_order_details.get("lead_time")
    lead_time_period = purchase_order_details.get("lead_time_period")

    overall_additional_costs = purchase_order_details.get("additional_costs")
    overall_taxes = purchase_order_details.get("taxes")
    overall_discounts = purchase_order_details.get("discounts")
    custom_sections = purchase_order_details.get("custom_sections")
    custom_sections = (
        custom_services.validate_and_autofill_custom_sections_from_template(
            custom_sections=custom_sections,
            template_section_map=template_section_map,
            template_section_item_map=template_section_item_map,
        )
    )

    terms_and_conditions = purchase_order_details.get("terms_and_conditions")
    if tnc_name := terms_and_conditions["terms_and_conditions_id"]:
        tnc = terms_and_conditions_service.get_terms_and_conditions_via_name(
            name=tnc_name, enterprise_id=enterprise_id
        )
        terms_and_conditions["terms_and_conditions_id"] = tnc.terms_and_conditions_id

    (
        cost_names,
        po_additional_costs,
        po_taxes,
        po_discounts,
    ) = ([], [], [], [])
    costs_map = {}

    for cost in overall_additional_costs:
        cost_names.append(cost["name"])
    for cost in overall_taxes:
        cost_names.append(cost["name"])
    for cost in overall_discounts:
        cost_names.append(cost["name"])

    for purchase_order_item in purchase_order_items:
        item_additional_costs = purchase_order_item.get("additional_costs")
        item_taxes = purchase_order_item.get("taxes")
        item_discounts = purchase_order_item.get("discounts")
        for cost in item_additional_costs:
            cost_names.append(cost["name"])
        for cost in item_taxes:
            cost_names.append(cost["name"])
        for cost in item_discounts:
            cost_names.append(cost["name"])

    existing_additional_costs = additional_cost_service.get_additional_costs_from_names(
        enterprise_id=enterprise_id, additional_cost_names=cost_names
    )
    for additional_cost in existing_additional_costs:
        costs_map[additional_cost.cost_name] = additional_cost

    for cost in overall_additional_costs:
        additional_cost = costs_map[cost["name"]]
        po_additional_costs.append(
            AdditionalCostDataClass(
                additional_cost_id=additional_cost.additional_cost_id,
                cost_name=cost["name"],
                cost_type=additional_cost.cost_type,
                allocation_type=additional_cost.allocation_type,
                cost_value=cost["value"],
            )
        )
    for cost in overall_taxes:
        additional_cost = costs_map[cost["name"]]
        po_taxes.append(
            AdditionalCostDataClass(
                additional_cost_id=additional_cost.additional_cost_id,
                cost_name=cost["name"],
                cost_type=additional_cost.cost_type,
                allocation_type=additional_cost.allocation_type,
                cost_value=cost["value"],
            )
        )
    for cost in overall_discounts:
        cost_name = cost["name"]
        if cost_name != "Overall discount":
            additional_cost = costs_map[cost_name]
            po_discounts.append(
                AdditionalCostDataClass(
                    additional_cost_id=additional_cost.additional_cost_id,
                    cost_name=cost_name,
                    cost_type=additional_cost.cost_type,
                    allocation_type=additional_cost.allocation_type,
                    cost_value=cost["value"],
                )
            )
        else:
            po_discounts.append(
                AdditionalCostDataClass(
                    additional_cost_id=None,
                    cost_name=cost_name,
                    cost_type="PERCENTAGE",
                    allocation_type=None,
                    cost_value=cost["value"],
                )
            )

    if not event_id:
        po_group_id, custom_section_map = po_group_service.create_po_group(
            user_id=user_id,
            template_id=template_id,
            event_name=None,
            event_entity_id=buyer_entity_id,
            event_end_datetime=None,
            buyer_billing_address_id=buyer_billing_address_id,
            buyer_shipping_address_id=buyer_shipping_address_id,
            requisition_information=[],
            additional_costs=po_additional_costs,
            taxes=po_taxes,
            discounts=po_discounts,
            item_taxes_total=0,
            item_additional_costs_total=0,
            item_discounts_total=0,
            item_subtotal=0,
            item_total=0,
            total_price=0,
            standard_terms_type=PoGroupStandardTermsType.NONE.value,
            default_event_prepayment_percentage=0,
            default_event_payment_type=None,
            default_event_payment_terms=None,
            default_event_deliverables_payment_terms=None,
            default_event_incoterm_id=overall_incoterm_id,
            default_event_lead_time=None,
            default_event_lead_time_period=None,
            default_currency_id=currency_id,
            default_delivery_date=None,
            default_event_project_id=None,
            default_event_gl_id=None,
            default_event_cost_centre_id=None,
            lead_time=lead_time,
            lead_time_period=lead_time_period,
            incoterm_id=overall_incoterm_id,
            project_id=None,
            gl_id=None,
            cost_centre_id=None,
            prepayment_percentage=prepayment_percentage,
            payment_type=payment_type,
            payment_terms=payment_terms,
            deliverables_payment_terms=deliverables_payment_terms,
            custom_additional_information=None,
            gr_tolerance=None,
            custom_fields={"section_list": []},
            custom_sections=custom_sections,
        )
        po_group = po_group_service.get_po_group_event(po_group_id=po_group_id)
        po_group_additional_details = po_group.additional_details
        po_group_additional_details["vendor_count"] = 1
        po_group.additional_details = po_group_additional_details
        po_group.save()
        event_id = po_group.event_id
        seller_event_access = po_group_item_service._create_seller_event_access(
            seller_enterprise_id,
            seller_entity_id,
            event_id,
            SellerState.SELLER_PO_PENDING.value,
            item_count=len(purchase_order_items),
        )
        seller_event_access.save()
        event = po_group.event
        event.event_name = str(
            event.custom_event_id + timezone.now().strftime("%y%m%d %I:%M %p")
        )
        event.save()
        event_id = po_group.event_id

    created_purchase_order_items, created_purchase_order_items_dicts = [], []
    permissions_to_create = []
    for purchase_order_item in purchase_order_items:
        (
            po_item_additional_costs,
            po_item_taxes,
            po_item_discounts,
            po_group_item_delivery_schedules,
        ) = ([], [], [], [])

        factwise_item_code = purchase_order_item.get("factwise_item_code")
        ERP_item_code = purchase_order_item.get("ERP_item_code")

        if factwise_item_code:
            try:
                enterprise_item = item_service.get_enterprise_item_via_code(
                    enterprise_id=enterprise_id, code=factwise_item_code
                )
            except EnterpriseItem.DoesNotExist:
                raise ValidationException("Item with Factwise item Code does not exist")
        else:
            # ERP_item_code=purchase_order_item.get("ERP_item_code")
            try:
                enterprise_item = item_service.get_enterprise_item_via_ERP_item_code(
                    enterprise_id=enterprise_id, ERP_item_code=ERP_item_code
                )
            except EnterpriseItem.DoesNotExist:
                raise ValidationException("Item with ERP item Code does not exist")

        enterprise_item_id = enterprise_item.enterprise_item_id
        internal_notes = purchase_order_item.get("internal_notes")
        external_notes = purchase_order_item.get("external_notes")
        price = purchase_order_item.get("price")
        item_additional_costs = purchase_order_item.get("additional_costs")
        item_taxes = purchase_order_item.get("taxes")
        item_discounts = purchase_order_item.get("discounts")
        # TODO: Throw error if they are already sent in overall
        incoterm = purchase_order_item.get("incoterm")
        incoterm_id = backbone_service.get_incoterm_via_name(incoterm=incoterm).entry_id
        prepayment_percentage = purchase_order_item.get("prepayment_percentage")
        payment_type = purchase_order_item.get("payment_type")
        payment_terms = purchase_order_item.get("payment_terms")
        deliverables_payment_terms = purchase_order_item.get(
            "deliverables_payment_terms"
        )
        lead_time = purchase_order_item.get("lead_time")
        lead_time_period = purchase_order_item.get("lead_time_period")

        procurement_informations = {
            "lead_time": lead_time,
            "lead_time_period": lead_time_period,
        }

        for cost in item_additional_costs:
            additional_cost = costs_map[cost["name"]]
            po_item_additional_costs.append(
                AdditionalCostDataClass(
                    additional_cost_id=additional_cost.additional_cost_id,
                    cost_name=cost["name"],
                    cost_type=additional_cost.cost_type,
                    allocation_type=additional_cost.allocation_type,
                    cost_value=cost["value"],
                )
            )
        for cost in item_taxes:
            additional_cost = costs_map[cost["name"]]
            po_item_taxes.append(
                AdditionalCostDataClass(
                    additional_cost_id=additional_cost.additional_cost_id,
                    cost_name=cost["name"],
                    cost_type=additional_cost.cost_type,
                    allocation_type=additional_cost.allocation_type,
                    cost_value=cost["value"],
                )
            )
        for cost in item_discounts:
            cost_name = cost["name"]
            if cost_name != "Discount":
                additional_cost = costs_map[cost_name]
                po_item_discounts.append(
                    AdditionalCostDataClass(
                        additional_cost_id=additional_cost.additional_cost_id,
                        cost_name=cost_name,
                        cost_type=additional_cost.cost_type,
                        allocation_type=additional_cost.allocation_type,
                        cost_value=cost["value"],
                    )
                )
            else:
                po_item_discounts.append(
                    AdditionalCostDataClass(
                        additional_cost_id=None,
                        cost_name=cost_name,
                        cost_type="PERCENTAGE",
                        allocation_type=None,
                        cost_value=cost["value"],
                    )
                )

        measurement_unit = purchase_order_item.get("measurement_unit")
        quantity = purchase_order_item.get("quantity")
        delivery_schedules = purchase_order_item.get("delivery_schedules")

        for delivery_schedule in delivery_schedules:
            project_code = delivery_schedule.get("project_id")
            if project_code:
                project = project_service.get_project_via_code(
                    enterprise_id=enterprise_id,
                    project_code=project_code,
                )
                delivery_schedule["project_id"] = project.project_id

            cost_centre_id = delivery_schedule.get("cost_centre_id")
            if cost_centre_id:
                cost_centre = project_service.get_cost_centre_via_code(
                    enterprise_id=enterprise_id,
                    cost_centre_id=cost_centre_id,
                )
                delivery_schedule["cost_centre_id"] = cost_centre.cost_centre_id

            general_ledger_code = delivery_schedule.get("general_ledger_id")
            if general_ledger_code:
                general_ledger = project_service.get_general_ledger_via_code(
                    enterprise_id=enterprise_id,
                    general_ledger_code=general_ledger_code,
                )
                delivery_schedule["general_ledger_id"] = (
                    general_ledger.general_ledger_id
                )

        custom_sections = purchase_order_item.get("custom_sections")
        custom_sections = (
            custom_services.validate_and_autofill_custom_sections_from_template(
                custom_sections=custom_sections,
                template_section_map=template_section_map,
                template_section_item_map=template_section_item_map,
            )
        )

        attachments = purchase_order_item.get("attachments")

        # FROM D2PO
        if not custom_event_id:
            item_additional_details = purchase_order_item.get("item_additional_details")
            for delivery_schedule in delivery_schedules:
                po_group_item_delivery_schedules.append(
                    PoGroupItemDeliveryInformation(
                        quantity=delivery_schedule.get("quantity"),
                        delivery_date=delivery_schedule.get("delivery_date"),
                        project_id=delivery_schedule.get("project_id"),
                        cost_centre_id=delivery_schedule.get("cost_centre_id"),
                        general_ledger_id=delivery_schedule.get("general_ledger_id"),
                    )
                )
            po_group_item, _ = po_group_item_service.create_po_group_item(
                user_id=user_id,
                po_group_id=po_group_id,
                custom_item_name=None,
                item_id=enterprise_item_id,
                item_additional_details=item_additional_details,
                attributes=[],
                properties=None,
                quantity=quantity,
                quantity_tolerance_percentage=None,
                measurement_unit_id=measurement_unit,
                desired_price=price,
                shipping_per_unit=None,
                additional_charges=[],
                additional_costs=po_item_additional_costs,
                taxes=po_item_taxes,
                discounts=po_item_discounts,
                total=0,
                currency_code_id=currency_id,
                is_price_confidential=False,
                delivery_schedule=po_group_item_delivery_schedules,
                allow_substitutes=False,
                prepayment_percentage=prepayment_percentage,
                payment_type=payment_type,
                payment_terms=payment_terms,
                deliverables_payment_terms=deliverables_payment_terms,
                lead_time=lead_time,
                lead_time_period=lead_time_period,
                requisition_information=[],
                incoterm_id=incoterm_id,
                attachment_ids=attachments,
                custom_fields={"section_list": []},
                custom_sections=custom_sections,
                custom_section_map=custom_section_map,
            )
            po_group_item_id = po_group_item.po_group_item_entry_id
            seller_item_permission = po_group_item_service._add_seller_to_item(
                po_group_id=po_group_id,
                po_group_item_id=po_group_item_id,
                seller_entity_id=seller_entity_id,
                contact_id_list=PoGroupItemSellerContacts(
                    contact_id_list=seller_contact_list
                ),
            )
            permissions_to_create.append(seller_item_permission)
            po_group_item.additional_details = PoGroupItemAdditionalDetails(
                vendor_count=1
            )
            po_group_item.save()
            purchase_order_item_obj, context = (
                event_po_item_service.create_event_purchase_order_item(
                    user_id=user_id,
                    event_id=event_id,
                    po_group_item_id=po_group_item_id,
                    seller_entity_id=seller_entity_id,
                    price=price,
                    currency_code_id=currency_id,
                    shipping_per_unit=0,
                    measurement_unit_id=measurement_unit,
                    alternate_measurement_unit_list=[],
                    quantity_tolerance_percentage=0,
                    additional_charges=[],
                    additional_costs=po_item_additional_costs,
                    taxes=po_item_taxes,
                    discounts=po_item_discounts,
                    property_information=[],
                    incoterm_id=incoterm_id,
                    prepayment_percentage=prepayment_percentage,
                    payment_type=payment_type,
                    payment_terms=payment_terms,
                    deliverables_payment_terms=deliverables_payment_terms,
                    procurement_information=procurement_informations,
                    delivery_schedules=delivery_schedules,
                    internal_notes=internal_notes,
                    external_notes=external_notes,
                )
            )
        else:
            rfq_item = rfq_items_map[ERP_item_code]
            rfq_item_id = rfq_item.rfq_item_entry_id
            purchase_order_item_obj, context = (
                purchase_order_item_service.create_purchase_order_item(
                    user_id=user_id,
                    event_id=event_id,
                    rfq_item_id=rfq_item_id,
                    seller_entity_id=seller_entity_id,
                    price=price,
                    currency_code_id=currency_id,
                    shipping_per_unit=0,
                    measurement_unit_id=measurement_unit,
                    alternate_measurement_unit_list=[],
                    quantity_tolerance_percentage=0,
                    additional_charges=[],
                    property_information=[],
                    incoterm_id=incoterm_id,
                    prepayment_percentage=prepayment_percentage,
                    payment_type=payment_type,
                    payment_terms=payment_terms,
                    deliverables_payment_terms=deliverables_payment_terms,
                    procurement_information=procurement_informations,
                    delivery_schedules=delivery_schedules,
                    internal_notes=internal_notes,
                    external_notes=external_notes,
                    attachments=attachments,
                    custom_sections=custom_sections,
                    custom_fields_negotiate={"section_list": []},
                    additional_costs=po_item_additional_costs,
                    taxes=po_item_taxes,
                    discounts=po_item_discounts,
                )
            )
        delivery_schedule_dict = context.get("delivery_schedule_dict")
        created_delivery_schedules = delivery_schedule_dict[
            purchase_order_item_obj.purchase_order_item_id
        ]
        delivery_schedule_items_ids = [
            created_delivery_schedule.delivery_schedule_item_id
            for created_delivery_schedule in created_delivery_schedules
        ]
        purchase_order_item_dict = {
            "purchase_order_item_id": purchase_order_item_obj.purchase_order_item_id,
            "internal_notes": internal_notes,
            "external_notes": external_notes,
            "delivery_schedule_items": delivery_schedule_items_ids,
        }
        created_purchase_order_items_dicts.append(purchase_order_item_dict)
        created_purchase_order_items.append(purchase_order_item_obj)

    Permission.objects.bulk_create(permissions_to_create)

    purchase_order_id = event_po_service.create_event_purchase_order(
        user_id=user_id,
        event_id=event_id,
        ERP_po_id=ERP_po_id,
        buyer_entity_id=buyer_entity_id,
        billing_address_id=buyer_billing_address_id,
        shipping_address_id=buyer_shipping_address_id,
        seller_entity_id=seller_entity_id,
        seller_address_id=seller_address_id,
        seller_full_address=seller_full_address,
        buyer_identifications=buyer_identifications,
        seller_identifications=seller_identifications,
        seller_custom_identifications=[],
        discount_percentage=Decimal(0),
        buyer_contact_list=[user_id],
        seller_contact_list=seller_contact_list,
        terms_and_conditions=terms_and_conditions,
        notes=notes,
        action=PurchaseOrderCreationState.PO_APPROVE_AND_SUBMIT.value,
        lead_time=lead_time,
        lead_time_period=lead_time_period,
        incoterm_id=overall_incoterm_id,
        project_id=None,
        gl_id=None,
        cost_centre_id=None,
        prepayment_percentage=prepayment_percentage,
        payment_type=payment_type,
        payment_terms=payment_terms,
        deliverables_payment_terms=deliverables_payment_terms,
        custom_additional_information=None,
        gr_tolerance=None,
        requisition_information=[],
        additional_costs=po_additional_costs,
        taxes=po_taxes,
        discounts=po_discounts,
        custom_fields={"section_list": []},
        # custom_sections=custom_sections,
        purchase_order_items=created_purchase_order_items_dicts,
    )
    purchase_order, context = purchase_order_service.get_purchase_order(
        purchase_order_id=purchase_order_id
    )
    purchase_order.created_by_user_id = user_id
    purchase_order.modified_by_user_id = user_id
    purchase_order.submission_datetime = accepted_date
    purchase_order.acceptance_datetime = issued_date
    purchase_order.save()
    # for purchase_order_item in created_purchase_order_items:
    #     purchase_order_item.created_by_user_id = user_id
    #     purchase_order_item.modified_by_user_id = user_id
    #     purchase_order_item.purchase_order_id = purchase_order_id
    #     purchase_order_item.save()

    status = purchase_order_details.get("status")
    if status not in [PurchaseOrderState.PO_ISSUED]:
        purchase_order_service.update_purchase_order_status(
            user_id=user_id,
            purchase_order_id=purchase_order_id,
            status=status,
            notes=None,
            purchase_order_items=[],
        )
    # Explicitly trigger pricing repo sync for OpenAPI-created POs
    # (Django signal skips on created=True for initial insert)
    print(f"[OPENAPI-PO] >>> ABOUT TO CALL _queue_po_pricing_sync po={purchase_order.purchase_order_id}", flush=True)
    _queue_po_pricing_sync(str(purchase_order.purchase_order_id), str(purchase_order.buyer_enterprise_id))
    print(f"[OPENAPI-PO] >>> _queue_po_pricing_sync DONE, returning {purchase_order.custom_purchase_order_id}", flush=True)

    return purchase_order.custom_purchase_order_id


@transaction.atomic
def update_purchase_order(
    *,
    enterprise_id,
    buyer_details,
    seller_details,
    purchase_order_details,
    purchase_order_items,
):
    email = purchase_order_details.get("modified_by_user_email")
    print(email)
    user = enterprise_user_service.get_user_by_enterprise_email(
        enterprise_id=enterprise_id, email=email
    )
    if not user:
        raise ValidationException("User email does not exist in the enterprise")
    user_id = user.user_id
    buyer_entity_name = buyer_details.get("entity_name")
    buyer_entity = entity_service.get_entity_via_name(
        entity_name=buyer_entity_name, enterprise_id=enterprise_id
    )
    buyer_entity_id = buyer_entity.entity_id

    custom_event_id = purchase_order_details.get("event")
    event_id = None
    # if custom_event_id:
    #     event = event_service.get_event_from_custom_event_id(
    #         enterprise_id=enterprise_id, custom_event_id=custom_event_id
    #     )
    #     if event.event_type != EventType.EVENT_RFQ.value:
    #         raise ValidationException(f"Event {custom_event_id} does not have a RFQ")

    #     event_id = event.event_id
    # else:
    #     raise ValidationException("Event is required to update a purchase order")

    # buyer_billing_address_nickname = buyer_details.get("billing_address_id")
    # buyer_billing_address = address_service.get_address_via_name(
    #     enterprise_id=enterprise_id, address=buyer_billing_address_nickname
    # )
    # buyer_billing_address_id = buyer_billing_address.address_id
    # buyer_shipping_address_nickname = buyer_details.get("shipping_address_id")
    # buyer_shipping_address = address_service.get_address_via_name(
    # enterprise_id=enterprise_id, address=buyer_shipping_address_nickname
    # )
    # buyer_shipping_address_id = buyer_shipping_address.address_id

    buyer_identification_name_list = buyer_details.get("identifications")
    buyer_identifications = identification_service.get_identification_list(
        identification_name_list=buyer_identification_name_list,
        entity_id=buyer_entity_id,
    ).values_list("identification_id", flat=True)

    # TODO: Use these emails instead of creator if they want to send contacts instead
    # buyer_contact_emails = seller_details.get("contacts")

    factwise_vendor_code = seller_details.get("factwise_vendor_code")
    if factwise_vendor_code:
        enterprise_vm = (
            vendor_master_service.get_enterprise_vendor_master_via_code_list(
                vendor_code_list=[factwise_vendor_code],
                buyer_enterprise_id=enterprise_id,
            )
            .filter(seller_entity__isnull=False)
            .first()
        )
        if enterprise_vm is None:
            raise ValidationException(f"Vendor {factwise_vendor_code} does not exist")
    else:
        ERP_vendor_code = seller_details.get("ERP_vendor_code")
        try:
            enterprise_vm = (
                vendor_master_service.get_enterprise_vendor_master_via_ERP_vendor_code(
                    buyer_enterprise_id=enterprise_id, ERP_vendor_code=ERP_vendor_code
                )
            )
        except EnterpriseVendorMaster.DoesNotExist:
            raise ValidationException("Vendor with ERP vendor Code does not exist")

    seller_entity_id = enterprise_vm.seller_entity_id
    seller_enterprise_id = enterprise_vm.seller_enterprise_id

    seller_address_nickname = seller_details.get("seller_address_id")
    seller_address_id = None
    if seller_address_nickname:
        seller_address = address_service.get_address_via_name(
            enterprise_id=seller_enterprise_id, address=seller_address_nickname
        )
        seller_address_id = seller_address.address_id
    seller_full_address = seller_details.get("seller_full_address")

    seller_identification_name_list = seller_details.get("identifications")
    seller_identifications = identification_service.get_identification_list(
        identification_name_list=seller_identification_name_list,
        entity_id=seller_entity_id,
    ).values_list("identification_id", flat=True)
    seller_contact_emails = seller_details.get("contacts")
    vcs = vendor_contact_service.get_vendor_contacts_from_emails(
        seller_entity_id=seller_entity_id,
        emails=seller_contact_emails,
    )
    seller_contact_list = vcs.values_list("user_id", flat=True)
    rfq_items_map = {}

    ERP_po_id = purchase_order_details.get("ERP_po_id")
    factwise_po_id = purchase_order_details.get("factwise_po_id")
    if factwise_po_id:
        old_purchase_order = purchase_order_service.get_purchase_order_details_from_custom_purchase_order_id(
            user_id=user_id,
            enterprise_id=enterprise_id,
            custom_purchase_order_id=factwise_po_id,
        )
    else:
        old_purchase_order = (
            purchase_order_service.get_purchase_order_details_from_ERP_po_id(
                user_id=user_id,
                enterprise_id=enterprise_id,
                ERP_po_id=ERP_po_id,
            )
        )
    event_id = old_purchase_order.event_id
    try:
        event = event_service.get_event(event_id=event_id)
        template_id = event.additional_details["template_id"]
        sub_event_id = event.sub_event_id
        old_purchase_order_id = old_purchase_order.purchase_order_id
    except Exception as e:
        print(e)
        raise BadRequestException("Purchase Order does not exist")

    template_sections = template_services.get_template_sections(template_id=template_id)
    template_section_map = {
        section.alternate_name: section for section in template_sections
    }

    template_section_items = template_services.get_template_section_items(
        template_id=template_id
    ).filter(is_builtin_field=False)
    template_section_item_map = {
        (section_item.section.alternate_name, section_item.alternate_name): section_item
        for section_item in template_section_items
    }

    issued_date = purchase_order_details.get("issued_date")
    accepted_date = purchase_order_details.get("accepted_date")

    currency_id = purchase_order_details.get("currency_code")
    notes = purchase_order_details.get("notes")

    overall_incoterm = purchase_order_details.get("incoterm")
    overall_incoterm_id = (
        backbone_service.get_incoterm_via_name(incoterm=overall_incoterm).entry_id
        if overall_incoterm
        else None
    )

    prepayment_percentage = purchase_order_details.get("prepayment_percentage")
    payment_type = purchase_order_details.get("payment_type")
    payment_terms = purchase_order_details.get("payment_terms")
    deliverables_payment_terms = purchase_order_details.get(
        "deliverables_payment_terms"
    )
    lead_time = purchase_order_details.get("lead_time")
    lead_time_period = purchase_order_details.get("lead_time_period")

    additional_costs = purchase_order_details.get("additional_costs")
    taxes = purchase_order_details.get("taxes")
    discounts = purchase_order_details.get("discounts")
    custom_sections = purchase_order_details.get("custom_sections")
    terms_and_conditions = purchase_order_details.get("terms_and_conditions")
    if tnc_name := terms_and_conditions["terms_and_conditions_id"]:
        tnc = terms_and_conditions_service.get_terms_and_conditions_via_name(
            name=tnc_name, enterprise_id=enterprise_id
        )
        terms_and_conditions["terms_and_conditions_id"] = tnc.terms_and_conditions_id
    (
        cost_names,
        po_additional_costs,
        po_taxes,
        po_discounts,
    ) = ([], [], [], [])
    costs_map = {}

    for cost in additional_costs:
        cost_names.append(cost["name"])
    for cost in taxes:
        cost_names.append(cost["name"])
    for cost in discounts:
        cost_names.append(cost["name"])

    for purchase_order_item in purchase_order_items:
        additional_costs = purchase_order_item.get("additional_costs")
        taxes = purchase_order_item.get("taxes")
        discounts = purchase_order_item.get("discounts")
        for cost in additional_costs:
            cost_names.append(cost["name"])
        for cost in taxes:
            cost_names.append(cost["name"])
        for cost in discounts:
            cost_names.append(cost["name"])

    existing_additional_costs = additional_cost_service.get_additional_costs_from_names(
        enterprise_id=enterprise_id, additional_cost_names=cost_names
    )
    for additional_cost in existing_additional_costs:
        costs_map[additional_cost.cost_name] = additional_cost

    for cost in additional_costs:
        additional_cost = costs_map[cost["name"]]
        po_additional_costs.append(
            AdditionalCostDataClass(
                additional_cost_id=additional_cost.additional_cost_id,
                cost_name=cost["name"],
                cost_type=additional_cost.cost_type,
                allocation_type=additional_cost.allocation_type,
                cost_value=cost["value"],
            )
        )
    for cost in taxes:
        additional_cost = costs_map[cost["name"]]
        po_taxes.append(
            AdditionalCostDataClass(
                additional_cost_id=additional_cost.additional_cost_id,
                cost_name=cost["name"],
                cost_type=additional_cost.cost_type,
                allocation_type=additional_cost.allocation_type,
                cost_value=cost["value"],
            )
        )
    for cost in discounts:
        additional_cost = costs_map[cost["name"]]
        po_discounts.append(
            AdditionalCostDataClass(
                additional_cost_id=additional_cost.additional_cost_id,
                cost_name=cost["name"],
                cost_type=additional_cost.cost_type,
                allocation_type=additional_cost.allocation_type,
                cost_value=cost["value"],
            )
        )

    created_purchase_order_items, created_purchase_order_items_dicts = [], []
    for purchase_order_item in purchase_order_items:
        (
            po_item_additional_costs,
            po_item_taxes,
            po_item_discounts,
            po_group_item_delivery_schedules,
        ) = ([], [], [], [])

        factwise_item_code = purchase_order_item.get("factwise_item_code")
        if factwise_item_code:
            try:
                enterprise_item = item_service.get_enterprise_item_via_code(
                    enterprise_id=enterprise_id, code=factwise_item_code
                )
            except EnterpriseItem.DoesNotExist:
                raise ValidationException("Item with Factwise item Code does not exist")
        else:
            ERP_item_code = purchase_order_item.get("ERP_item_code")
            try:
                enterprise_item = item_service.get_enterprise_item_via_ERP_item_code(
                    enterprise_id=enterprise_id, ERP_item_code=ERP_item_code
                )
            except EnterpriseItem.DoesNotExist:
                raise ValidationException("Item with ERP item Code does not exist")

        enterprise_item_id = enterprise_item.enterprise_item_id
        internal_notes = purchase_order_item.get("internal_notes")
        external_notes = purchase_order_item.get("external_notes")
        price = purchase_order_item.get("price")
        additional_costs = purchase_order_item.get("additional_costs")
        taxes = purchase_order_item.get("taxes")
        discounts = purchase_order_item.get("discounts")
        # TODO: Throw error if they are already sent in overall
        incoterm = purchase_order_item.get("incoterm")
        incoterm_id = backbone_service.get_incoterm_via_name(incoterm=incoterm).entry_id
        prepayment_percentage = purchase_order_item.get("prepayment_percentage")
        payment_type = purchase_order_item.get("payment_type")
        payment_terms = purchase_order_item.get("payment_terms")
        deliverables_payment_terms = purchase_order_item.get(
            "deliverables_payment_terms"
        )
        lead_time = purchase_order_item.get("lead_time")
        lead_time_period = purchase_order_item.get("lead_time_period")

        procurement_informations = {
            "lead_time": lead_time,
            "lead_time_period": lead_time_period,
        }

        for cost in additional_costs:
            additional_cost = costs_map[cost["name"]]
            po_item_additional_costs.append(
                AdditionalCostDataClass(
                    additional_cost_id=additional_cost.additional_cost_id,
                    cost_name=cost["name"],
                    cost_type=additional_cost.cost_type,
                    allocation_type=additional_cost.allocation_type,
                    cost_value=cost["value"],
                )
            )
        for cost in taxes:
            additional_cost = costs_map[cost["name"]]
            po_item_taxes.append(
                AdditionalCostDataClass(
                    additional_cost_id=additional_cost.additional_cost_id,
                    cost_name=cost["name"],
                    cost_type=additional_cost.cost_type,
                    allocation_type=additional_cost.allocation_type,
                    cost_value=cost["value"],
                )
            )
        for cost in discounts:
            additional_cost = costs_map[cost["name"]]
            po_item_discounts.append(
                AdditionalCostDataClass(
                    additional_cost_id=additional_cost.additional_cost_id,
                    cost_name=cost["name"],
                    cost_type=additional_cost.cost_type,
                    allocation_type=additional_cost.allocation_type,
                    cost_value=cost["value"],
                )
            )

        measurement_unit = purchase_order_item.get("measurement_unit")
        quantity = purchase_order_item.get("quantity")
        delivery_schedules = purchase_order_item.get("delivery_schedules")

        for delivery_schedule in delivery_schedules:
            project_code = delivery_schedule.get("project_id")
            if project_code:
                project = project_service.get_project_via_code(
                    enterprise_id=enterprise_id,
                    project_code=project_code,
                )
                delivery_schedule["project_id"] = project.project_id

            cost_centre_id = delivery_schedule.get("cost_centre_id")
            if cost_centre_id:
                cost_centre = project_service.get_cost_centre_via_code(
                    enterprise_id=enterprise_id,
                    cost_centre_id=cost_centre_id,
                )
                delivery_schedule["cost_centre_id"] = cost_centre.cost_centre_id

            general_ledger_code = delivery_schedule.get("general_ledger_id")
            if general_ledger_code:
                general_ledger = project_service.get_general_ledger_via_code(
                    enterprise_id=enterprise_id,
                    general_ledger_code=general_ledger_code,
                )
                delivery_schedule["general_ledger_id"] = (
                    general_ledger.general_ledger_id
                )

        custom_sections = purchase_order_item.get("custom_sections")
        attachments = purchase_order_item.get("attachments")
        item_additional_details = purchase_order_item.get("item_additional_details")

        # rfq_item = rfq_items_map[ERP_item_code]
        # rfq_item_id = rfq_item.rfq_item_entry_id
        print(sub_event_id)
        print(sub_event_id)
        print(sub_event_id)
        print(sub_event_id)
        print(sub_event_id)

        po_group_item, _ = po_group_item_service.create_po_group_item(
            user_id=user_id,
            po_group_id=sub_event_id,
            custom_item_name=None,
            item_id=enterprise_item_id,
            item_additional_details=item_additional_details,
            attributes=[],
            properties=None,
            quantity=quantity,
            quantity_tolerance_percentage=None,
            measurement_unit_id=measurement_unit,
            desired_price=price,
            shipping_per_unit=None,
            additional_charges=[],
            additional_costs=po_item_additional_costs,
            taxes=po_item_taxes,
            discounts=po_item_discounts,
            total=0,
            currency_code_id=currency_id,
            is_price_confidential=False,
            delivery_schedule=po_group_item_delivery_schedules,
            allow_substitutes=False,
            prepayment_percentage=prepayment_percentage,
            payment_type=payment_type,
            payment_terms=payment_terms,
            deliverables_payment_terms=deliverables_payment_terms,
            lead_time=lead_time,
            lead_time_period=lead_time_period,
            requisition_information=[],
            incoterm_id=incoterm_id,
            attachment_ids=attachments,
            custom_fields={"section_list": []},
            custom_sections=[],
            for_po_amendment=True,
        )
        po_group_item_id = po_group_item.po_group_item_entry_id
        purchase_order_item_obj, context = (
            event_po_item_service.create_event_purchase_order_item(
                user_id=user_id,
                event_id=event_id,
                po_group_item_id=po_group_item_id,
                seller_entity_id=seller_entity_id,
                price=price,
                currency_code_id=currency_id,
                shipping_per_unit=0,
                measurement_unit_id=measurement_unit,
                alternate_measurement_unit_list=[],
                quantity_tolerance_percentage=0,
                additional_charges=[],
                additional_costs=po_item_additional_costs,
                taxes=po_item_taxes,
                discounts=po_item_discounts,
                property_information=[],
                incoterm_id=incoterm_id,
                prepayment_percentage=prepayment_percentage,
                payment_type=payment_type,
                payment_terms=payment_terms,
                deliverables_payment_terms=deliverables_payment_terms,
                procurement_information=procurement_informations,
                delivery_schedules=delivery_schedules,
                internal_notes=internal_notes,
                external_notes=external_notes,
            )
        )
        delivery_schedule_dict = context.get("delivery_schedule_dict")
        created_delivery_schedules = delivery_schedule_dict[
            purchase_order_item_obj.purchase_order_item_id
        ]
        delivery_schedule_items_ids = [
            created_delivery_schedule.delivery_schedule_item_id
            for created_delivery_schedule in created_delivery_schedules
        ]
        purchase_order_item_dict = {
            "purchase_order_item_id": purchase_order_item_obj.purchase_order_item_id,
            "internal_notes": internal_notes,
            "external_notes": external_notes,
            "delivery_schedule_items": delivery_schedule_items_ids,
        }
        created_purchase_order_items_dicts.append(purchase_order_item_dict)
        created_purchase_order_items.append(purchase_order_item_obj)
    purchase_order_id = event_po_service.revise_event_purchase_order(
        purchase_order_id=old_purchase_order_id,
        user_id=user_id,
        ERP_po_id=ERP_po_id,
        factwise_po_id=factwise_po_id,
        buyer_entity_id=buyer_entity_id,
        # billing_address_id=buyer_billing_address_id,
        # shipping_address_id=buyer_shipping_address_id,
        seller_entity_id=seller_entity_id,
        seller_address_id=seller_address_id,
        seller_full_address=seller_full_address,
        buyer_identifications=buyer_identifications,
        seller_identifications=seller_identifications,
        seller_custom_identifications=[],
        discount_percentage=Decimal(0),
        buyer_contact_list=[user_id],
        seller_contact_list=seller_contact_list,
        terms_and_conditions=terms_and_conditions,
        notes=notes,
        action=PurchaseOrderCreationState.PO_APPROVE_AND_SUBMIT.value,
        lead_time=lead_time,
        lead_time_period=lead_time_period,
        incoterm_id=overall_incoterm_id,
        project_id=None,
        gl_id=None,
        cost_centre_id=None,
        prepayment_percentage=prepayment_percentage,
        payment_type=payment_type,
        payment_terms=payment_terms,
        deliverables_payment_terms=deliverables_payment_terms,
        custom_additional_information=None,
        gr_tolerance=None,
        requisition_information=[],
        additional_costs=po_additional_costs,
        taxes=po_taxes,
        discounts=po_discounts,
        custom_fields={"section_list": []},
        # custom_sections=custom_sections,
        purchase_order_items=created_purchase_order_items_dicts,
        skip_create_po_items=True,
    )
    purchase_order, context = purchase_order_service.get_purchase_order(
        purchase_order_id=purchase_order_id
    )
    purchase_order.created_by_user_id = user_id
    purchase_order.modified_by_user_id = user_id
    purchase_order.submission_datetime = accepted_date
    purchase_order.acceptance_datetime = issued_date
    purchase_order.save()
    # for purchase_order_item in created_purchase_order_items:
    #     purchase_order_item.created_by_user_id = user_id
    #     purchase_order_item.modified_by_user_id = user_id
    #     purchase_order_item.purchase_order_id = purchase_order_id
    #     purchase_order_item.save()

    status = purchase_order_details.get("status")
    if status not in [PurchaseOrderState.PO_ISSUED]:
        purchase_order_service.update_purchase_order_status(
            user_id=user_id,
            purchase_order_id=purchase_order_id,
            status=status,
            notes=None,
            purchase_order_items=[],
        )
    return purchase_order.custom_purchase_order_id


@transaction.atomic
def update_purchase_order_status(
    *,
    enterprise_id,
    modified_by_user_email,
    ERP_po_id,
    factwise_po_id,
    status,
    notes,
):
    user = enterprise_user_service.get_user_by_enterprise_email(
        enterprise_id=enterprise_id, email=modified_by_user_email
    )
    if not user:
        raise ValidationException("User email does not exist in the enterprise")
    user_id = user.user_id
    if factwise_po_id:
        purchase_order = purchase_order_service.get_purchase_order_details_from_custom_purchase_order_id(
            user_id=user_id,
            enterprise_id=enterprise_id,
            custom_purchase_order_id=factwise_po_id,
        )
    else:
        purchase_order = (
            purchase_order_service.get_purchase_order_details_from_ERP_po_id(
                user_id=user_id,
                enterprise_id=enterprise_id,
                ERP_po_id=ERP_po_id,
            )
        )

    current_status = purchase_order.status
    next_status = status
    validate_state(next_status, PurchaseOrderState)
    status_transition = (
        PurchaseOrderState(current_status),
        PurchaseOrderState(next_status),
    )

    approvers = []
    if status not in purchase_order_service.__seller_purchase_order_actions__:
        approvers = po_common_service.get_approvers(
            org_user=user,
            purchase_order=purchase_order,
            buyer_entity_id=purchase_order.buyer_entity_id,
            discount_percentage=PurchaseOrderPricingInformation(
                **purchase_order.pricing_information
            ).discount_percentage,
            event=purchase_order.event,
        )
    if purchase_order.purchase_order_type == PurchaseOrderType.PO_GROUP.value:
        status_workflow = event_po_workflows.get_and_validate_transition(
            status_transition
        )

    else:
        status_workflow = po_workflows.get_and_validate_transition(status_transition)
    status_workflow(
        purchase_order=purchase_order,
        org_user=user,
        approvers=approvers,
        notes=notes,
        buyer_entity=purchase_order.buyer_entity,
        current_status=current_status,
    )
    purchase_order_service.__update_seller_po_status__(
        purchase_order.event_id, purchase_order.seller_entity_id
    )
    po_common_service.update_purchase_order_delivery_information(
        purchase_order=purchase_order
    )
    po_common_service.update_purchase_order_warning_information(
        purchase_order=purchase_order
    )
    if purchase_order.purchase_order_type == PurchaseOrderType.PO_GROUP.value:
        if (
            current_status == PurchaseOrderState.PO_APPROVAL_PENDING.value
            and next_status == PurchaseOrderState.PO_ISSUED.value
        ):
            subscription_service.verify_and_update_subscription_quota(
                enterprise_id=purchase_order.buyer_enterprise_id,
                quota_type=QuantityType.FEATURE_PO_DIRECT_COUNT.value,
                value_change=1,
            )
        if (
            current_status == PurchaseOrderState.PO_ISSUED.value
            and next_status == PurchaseOrderState.PO_RESCINDED.value
            or current_status == PurchaseOrderState.PO_ISSUED.value
            and next_status == PurchaseOrderState.PO_DECLINED.value
        ):
            subscription_service.verify_and_update_subscription_quota(
                enterprise_id=purchase_order.buyer_enterprise_id,
                quota_type=QuantityType.FEATURE_PO_DIRECT_COUNT.value,
                value_change=-1,
            )
    else:
        if next_status == PurchaseOrderState.PO_ISSUED.value:
            subscription_service.verify_and_update_subscription_quota(
                enterprise_id=purchase_order.buyer_enterprise_id,
                quota_type=QuantityType.FEATURE_PO_EVENTS_COUNT.value,
                value_change=1,
            )
        if (
            current_status == PurchaseOrderState.PO_ISSUED.value
            and next_status == PurchaseOrderState.PO_RESCINDED.value
            or current_status == PurchaseOrderState.PO_ISSUED.value
            and next_status == PurchaseOrderState.PO_DECLINED.value
        ):
            subscription_service.verify_and_update_subscription_quota(
                enterprise_id=purchase_order.buyer_enterprise_id,
                quota_type=QuantityType.FEATURE_PO_EVENTS_COUNT.value,
                value_change=-1,
            )


@transaction.atomic
def update_purchase_order_termination(
    *,
    enterprise_id,
    modified_by_user_email,
    ERP_po_id,
    factwise_po_id,
    status,
    notes,
):
    user = enterprise_user_service.get_user_by_enterprise_email(
        enterprise_id=enterprise_id, email=modified_by_user_email
    )
    if not user:
        raise ValidationException("User email does not exist in the enterprise")
    user_id = user.user_id
    if factwise_po_id:
        purchase_order = purchase_order_service.get_purchase_order_details_from_custom_purchase_order_id(
            user_id=user_id,
            enterprise_id=enterprise_id,
            custom_purchase_order_id=factwise_po_id,
        )
    else:
        purchase_order = (
            purchase_order_service.get_purchase_order_details_from_ERP_po_id(
                user_id=user_id,
                enterprise_id=enterprise_id,
                ERP_po_id=ERP_po_id,
            )
        )

    termination_info = JSONUtils().from_dict_to_obj(
        purchase_order.termination_information, PurchaseOrderTerminationInformation
    )
    current_status = (
        PurchaseOrderTerminationStatus.PO_TERMINATION_NA.value
        if termination_info is None
        else termination_info.status
    )
    validate_state(status, PurchaseOrderTerminationStatus)
    termination_transition = (
        PurchaseOrderTerminationStatus(current_status),
        PurchaseOrderTerminationStatus(status),
    )
    termination_workflow = get_and_validate_termination_transition(
        termination_transition
    )
    termination_workflow(
        purchase_order=purchase_order,
        org_user=user,
        notes=notes,
        termination_info=termination_info,
    )


def __construct_item_pricing_information__(
    price,
    shipping_per_unit,
    additional_costs,
    additional_charges,
    discounts,
    currency_code,
    quantity,
):
    currency = backbone_service.get_currency_via_code(currency_code=currency_code)
    total = purchase_order_item_service.get_po_item_total(
        price=price,
        shipping_per_unit=shipping_per_unit,
        additional_charges=additional_charges,
        taxes=[],
        additional_costs=additional_costs,
        discounts=discounts,
        quantity=quantity,
        currency_code_id=currency.entry_id,
    )[0]
    """
    price,
        shipping_per_unit,
        additional_charges,
        taxes,
        additional_costs,
        discounts,
        currency_code_id,
        currency_name,
        currency_symbol,
        currency_code_abbreviation,
    """
    po_item = PurchaseOrderItemPricingInformation(
        price=price,
        shipping_per_unit=shipping_per_unit,
        taxes=[],
        additional_costs=additional_costs,
        discounts=discounts,
        additional_charges=additional_charges,
        currency_code_id=currency.entry_id,
        currency_name=currency.currency_name,
        currency_symbol=currency.currency_symbol,
        currency_code_abbreviation=currency.currency_code_abbreviation,
        total=total,
    )
    return JSONUtils().from_obj_to_dict(po_item)


def list_purchase_order_buyer(
    enterprise_id: str,
    internal_status: list,
    purchase_order_status: list,
    purchase_order_type: list,
    seller_entity_id: str,
    event_id: str,
    **kwargs,
):
    user_entity_list = entity_service.get_enterprise_entities(
        enterprise_id=enterprise_id
    )

    buyer_purchase_orders = (
        PurchaseOrder.objects.filter(
            buyer_enterprise_id=enterprise_id,
            buyer_entity_id__in=user_entity_list,
            deleted_datetime__isnull=True,
        )
        .select_related("seller_entity", "created_by_user")
        .annotate(
            _invoice_count=Count(
                "invoice",
                filter=Q(
                    invoice__invoice_type__in=[
                        InvoiceType.BUYER_GR_INVOICE.value,
                        InvoiceType.SELLER_GOODS_INVOICE.value,
                        InvoiceType.PREPAYMENT_INVOICE.value,
                    ],
                    invoice__status__in=[
                        InvoiceState.INVOICE_ISSUED.value,
                        InvoiceState.INVOICE_ONGOING.value,
                        InvoiceState.INVOICE_GOODS_RECEIVED.value,
                        InvoiceState.INVOICE_COMPLETED.value,
                    ],
                ),
                distinct=True,
            )
        )
    )

    buyer_purchase_orders = purchase_order_service.__filter_purchase_orders__(
        event_id=event_id,
        internal_status=internal_status,
        purchase_order_list=buyer_purchase_orders,
        purchase_order_status=purchase_order_status,
        purchase_order_type=purchase_order_type,
        seller_entity_id=seller_entity_id,
    )

    return buyer_purchase_orders


def list_purchase_order_seller(
    enterprise_id: str,
    internal_status: list,
    purchase_order_status: list,
    seller_entity_id: str,
    buyer_entity_id: str,
    event_id: str,
    **kwargs,
):
    user_entity_list = (
        entity_service.get_enterprise_entities(enterprise_id=enterprise_id)
        if not seller_entity_id
        else [seller_entity_id]
    )

    optional_params = {}
    if event_id:
        optional_params["event_id"] = event_id

    seller_purchase_orders = PurchaseOrder.objects.filter(
        seller_enterprise_id=enterprise_id,
        seller_entity_id__in=user_entity_list,
        status__in=purchase_order_service.__seller_allowed_po_states__,
        deleted_datetime__isnull=True,
        **optional_params,
    )
    seller_purchase_orders = purchase_order_service.__filter_purchase_orders__(
        internal_status=internal_status,
        purchase_order_list=seller_purchase_orders,
        purchase_order_status=purchase_order_status,
        buyer_entity_id=buyer_entity_id,
    ).annotate(
        _invoice_count=Count(
            "invoice",
            filter=Q(
                invoice__invoice_type__in=[
                    InvoiceType.BUYER_GR_INVOICE.value,
                    InvoiceType.SELLER_GOODS_INVOICE.value,
                    InvoiceType.PREPAYMENT_INVOICE.value,
                ],
                invoice__status__in=[
                    InvoiceState.INVOICE_ISSUED.value,
                    InvoiceState.INVOICE_ONGOING.value,
                    InvoiceState.INVOICE_GOODS_RECEIVED.value,
                    InvoiceState.INVOICE_COMPLETED.value,
                ],
            ),
            distinct=True,
        )
    )
    return seller_purchase_orders


def __validate_and_get_quantity__(delivery_schedules):
    quantity = 0
    for delivery_info in delivery_schedules:
        if not delivery_info["quantity"]:
            raise BadRequestException("NULL_QUANTITY_FOUND")
        quantity += delivery_info["quantity"]
    return quantity


def __construct_purchase_order_item_procurement_information__(
    lead_time=None,
    prepayment_percentage=None,
    payment_terms=None,
    payment_terms_period=None,
    payment_terms_applied_from=None,
    lead_time_period=None,
):
    procurement_information = ProcurementInfo(
        prepayment_percentage,
        lead_time,
        lead_time_period,
        payment_terms,
        payment_terms_period,
        payment_terms_applied_from,
    )
    return asdict(procurement_information)


def save_direct_purchase_order_item(
    *,
    purchase_order,
    quantity_information,
    incoterm_id,
    item_information,
    fulfillment_information,
    enterprise_item_id,
    attribute_information,
    pricing_information,
    procurement_info,
    internal_notes,
    external_notes,
    custom_fields_negotiate,
):
    purchase_order_item_id = uuid.uuid4()
    purchase_order_item = PurchaseOrderItem()
    purchase_order_item.purchase_order_item_id = purchase_order_item_id
    purchase_order_item.purchase_order = purchase_order
    purchase_order_item.buyer_entity = purchase_order.buyer_entity
    purchase_order_item.seller_entity = purchase_order.seller_entity
    purchase_order_item.buyer_enterprise = purchase_order.buyer_entity.enterprise
    purchase_order_item.seller_enterprise = purchase_order.seller_entity.enterprise

    purchase_order_item.item_information = item_information
    purchase_order_item.quantity_information = quantity_information
    purchase_order_item.incoterm_id = incoterm_id
    purchase_order_item.fulfilment_information = fulfillment_information
    purchase_order_item.enterprise_item_id = enterprise_item_id
    purchase_order_item.attribute_information = attribute_information
    purchase_order_item.pricing_information = pricing_information
    purchase_order_item.procurement_information = procurement_info
    purchase_order_item.internal_notes = PurchaseOrderItemNotes(
        notes=internal_notes, modified_datetime=datetime.now()
    )
    purchase_order_item.external_notes = PurchaseOrderItemNotes(
        notes=external_notes, modified_datetime=datetime.now()
    )
    purchase_order_item.custom_fields_negotiate = custom_fields_negotiate
    purchase_order_item.full_clean()
    purchase_order_item.save()
    return purchase_order_item


def _termination_seller_accept(*, purchase_order, org_user, notes, termination_info):
    termination_info = PurchaseOrderTerminationInformation(
        PurchaseOrderTerminationStatus.PO_TERMINATION_SELLER_ACCEPTED.value
    )
    termination_info.seller_user_id = org_user.user_id
    termination_info.seller_datetime = timezone.now()
    termination_info.seller_notes = notes
    purchase_order.termination_information = JSONUtils().from_obj_to_dict(
        termination_info
    )
    purchase_order.status = PurchaseOrderState.PO_TERMINATED.value
    purchase_order.save()
    purchase_order_items = purchase_order.purchaseorderitem_set.all()
    po_group_item_service.update_po_group_item_po_status_terminated(
        purchase_order=purchase_order, purchase_order_items=purchase_order_items
    )
    po_group_service.update_po_group_status(event=purchase_order.event)


_termination_transition_workflows = {
    (
        PurchaseOrderTerminationStatus.PO_TERMINATION_NA,
        PurchaseOrderTerminationStatus.PO_TERMINATION_REQUESTED,
    ): po_workflows.__termination_request__,
    (
        PurchaseOrderTerminationStatus.PO_TERMINATION_REQUESTED,
        PurchaseOrderTerminationStatus.PO_TERMINATION_REQUESTED,
    ): po_workflows.__termination_request__,
    (
        PurchaseOrderTerminationStatus.PO_TERMINATION_NA,
        PurchaseOrderTerminationStatus.PO_TERMINATION_SELLER_ACCEPTED,
    ): _termination_seller_accept,
    (
        PurchaseOrderTerminationStatus.PO_TERMINATION_REQUESTED,
        PurchaseOrderTerminationStatus.PO_TERMINATION_SELLER_ACCEPTED,
    ): _termination_seller_accept,
    (
        PurchaseOrderTerminationStatus.PO_TERMINATION_REQUESTED,
        PurchaseOrderTerminationStatus.PO_TERMINATION_REVOKED,
    ): po_workflows.__termination_revoke__,
}


def get_and_validate_termination_transition(termination_transition):
    if termination_transition not in _termination_transition_workflows:
        raise ValidationException(
            f"Illegal status transition {termination_transition[0]} to {termination_transition[1]}"
        )
    return _termination_transition_workflows[termination_transition]


# def __save_purchase_order__(
#     event,
#     buyer_enterprise_id,
#     buyer_entity_id,
#     buyer_information,
#     buyer_contact_list,
#     seller_enterprise_id,
#     seller_entity_id,
#     seller_information,
#     seller_contact_list,
#     notes,
#     pricing_information,
#     terms_and_conditions,
#     final_buyer_approval,
#     status,
#     purchase_order_type,
#     additional_information,
#     requisition_department,
#     custom_fields,
#     ERP_po_id=None,
# ):
#     purchase_order_id = uuid.uuid4()
#     purchase_order = PurchaseOrder()
#     purchase_order.purchase_order_id = purchase_order_id
#     purchase_order.ERP_po_id = ERP_po_id
#     purchase_order.buyer_enterprise_id = buyer_enterprise_id
#     purchase_order.buyer_entity_id = buyer_entity_id
#     purchase_order.buyer_information = buyer_information
#     purchase_order.seller_enterprise_id = seller_enterprise_id
#     purchase_order.seller_entity_id = seller_entity_id
#     purchase_order.seller_information = seller_information
#     purchase_order.buyer_contact_list = buyer_contact_list
#     purchase_order.seller_contact_list = seller_contact_list
#     purchase_order.event = event
#     purchase_order.custom_purchase_order_id = org_service.generate_po_custom_id(
#         buyer_enterprise_id
#     )
#     purchase_order.internal_status = PurchaseOrderItemInternalStatus.DELIVERY_PENDING.value
#     purchase_order.status = status
#     purchase_order.additional_information = additional_information
#     purchase_order.purchase_order_type = purchase_order_type
#     purchase_order.terms_and_conditions = terms_and_conditions
#     purchase_order.notes = notes
#     purchase_order.final_buyer_approval = final_buyer_approval
#     purchase_order.pricing_information = pricing_information
#     purchase_order.requisition_department_id = requisition_department
#     purchase_order.custom_fields = custom_fields
#     purchase_order.full_clean()
#     purchase_order.save()
#     return purchase_order


def _queue_po_pricing_sync(purchase_order_id, enterprise_id):
    """Queue pricing repo sync for a PO after transaction commits."""
    try:
        from pricing_repository.tasks import sync_po_all_items
        _pid = str(purchase_order_id)
        _eid = str(enterprise_id)
        print(f"[OPENAPI-SYNC] REGISTERING on_commit for PO {_pid} enterprise {_eid}", flush=True)

        def _do_sync():
            print(f"[OPENAPI-SYNC] on_commit FIRED — sending celery task for PO {_pid}", flush=True)
            result = sync_po_all_items.delay(_pid, _eid, action='sync')
            print(f"[OPENAPI-SYNC] celery task SENT for PO {_pid}, task_id={result.id}", flush=True)

        transaction.on_commit(_do_sync)
    except Exception as e:
        print(f"[OPENAPI-SYNC] ERROR queueing PO sync: {e}", flush=True)
        import traceback
        traceback.print_exc()
