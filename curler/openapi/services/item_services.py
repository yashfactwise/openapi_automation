import operator
from datetime import datetime
from functools import reduce

from additional_costs import services as additional_cost_service
from additional_costs.states import AdditionalCostSource
from attributes import services as attribute_service
from attributes.structures import (
    AttributeLinkageInputStruct,
    AttributeValueLinkageInputStruct,
)
from celery import shared_task
from code_sequence import service as code_sequence_service
from django.db import transaction
from django.db.models import Case, Count, F, JSONField, Q, Value, When
from module_templates import services as module_template_service
from module_templates.models import ModuleTemplate
from module_templates.types import ModuleTemplateType, TemplateStatus
from openapi.models import BulkTask
from openapi.services import custom_services
from organization.models import Enterprise
from organization.org_models.item_master_model import EnterpriseItem
from organization.org_models.vendor_master_model import EntityVendorMaster
from organization.services import (
    enterprise_settings_service,
    enterprise_user_service,
    entity_service,
    item_service,
    vendor_master_service,
)
from organization.states import (
    EnterpriseItemPreferredVendorState,
    EnterpriseItemState,
    EnterpriseSettingKeyType,
    EntityItemState,
    EntityVendorMasterStatus,
    UserRole,
)
from organization.structures import EntityItemRequest, PricingInformation

from factwise.additional_costs.structures import AdditionalCostDataClass
from factwise.exception import BadRequestException, ValidationException
from factwise.openapi.services.project_services import JsonbConcat


def list_enterprise_items(*, enterprise_id):
    return (
        EnterpriseItem.objects.filter(
            buyer_enterprise_id=enterprise_id, deleted_datetime__isnull=True
        )
        .annotate(
            _entity_count=Count(
                "entity_enterprise_item__buyer_entity_id",
                filter=Q(
                    entity_enterprise_item__status=EntityItemState.ITEM_ACTIVE.value
                ),
                distinct=True,
            ),
            _preferred_vendor_status=Case(
                When(
                    Q(
                        preferred_vendor_status=EnterpriseItemPreferredVendorState.UNASSIGNED.value
                    ),
                    then=Value("Not Assigned"),
                ),
                default=F("preferred_vendor_status"),
            ),
        )
        .prefetch_related("entity_enterprise_item")
    )


@transaction.atomic
def create_enterprise_item(
    *,
    created_by_user_email,
    enterprise_id,
    factwise_item_code,
    ERP_item_code,
    name,
    description,
    notes,
    internal_notes,
    measurement_units,
    attributes,
    item_type,
    is_buyer,
    is_seller,
    buyer_pricing_information,
    seller_pricing_information,
    custom_ids,
    tags,
    status,
    entities,
    custom_sections,
):
    user = enterprise_user_service.get_user_by_enterprise_email(
        enterprise_id=enterprise_id, email=created_by_user_email
    )
    if not user:
        raise ValidationException("User email does not exist in the enterprise")
    if user.role != UserRole.ADMIN_ROLE.value:
        raise ValidationException(
            "Only admin users can perform the actions. Please change the user's email"
        )

    entity_objs = entity_service.get_entities_via_names(
        entity_names=[entity["entity_name"] for entity in entities],
        enterprise_id=enterprise_id,
    )
    if len(entities) != entity_objs.count():
        raise ValidationException(
            "Input entity(s) not found in the enterprise! Please enter correct entity name(s)"
        )

    (
        attribute_names,
        cost_names,
        tax_names,
        item_attributes,
        buyer_additional_costs,
        buyer_taxes,
        seller_additional_costs,
        seller_taxes,
    ) = ([], [], [], [], [], [], [], [])
    attributes_map, costs_map, taxes_map = {}, {}, {}

    for attribute in attributes:
        attribute_names.append(attribute["attribute_name"])

    existing_attributes = attribute_service.get_attributes_via_names(
        enterprise_id=enterprise_id, attribute_names=attribute_names
    )
    for attribute in existing_attributes:
        attributes_map[attribute.attribute_name] = attribute

    attributes_not_in_template = []
    for attribute_name in attribute_names:
        if attribute_name not in attributes_map:
            attributes_not_in_template.append(attribute_name)

    if attributes_not_in_template:
        raise ValidationException(
            f"Attribute(s) {attributes_not_in_template} not found in spec directory"
        )

    for attribute in attributes:
        item_attribute = attributes_map[attribute["attribute_name"]]
        item_attributes.append(
            AttributeLinkageInputStruct(
                attribute_name=item_attribute.attribute_name,
                attribute_type=item_attribute.attribute_type,
                attribute_id=item_attribute.attribute_id,
                attribute_values=[
                    AttributeValueLinkageInputStruct(value=attribute_value["value"])
                    for attribute_value in attribute["attribute_value"]
                ],
            )
        )

    for cost in buyer_pricing_information["additional_costs"]:
        cost_names.append(cost["name"])
    for cost in seller_pricing_information["additional_costs"]:
        cost_names.append(cost["name"])

    for cost in buyer_pricing_information["taxes"]:
        tax_names.append(cost["name"])
    for cost in seller_pricing_information["taxes"]:
        tax_names.append(cost["name"])

    template = ModuleTemplate.objects.get(
        ~Q(status=TemplateStatus.DEPRECATED.value),
        type=ModuleTemplateType.ITEM_TEMPLATE.value,
        enterprise_id=enterprise_id,
        deleted_datetime__isnull=True,
    )
    template_id = template.template_id
    template_sections = module_template_service.get_template_sections(
        template_id=template_id
    )
    template_section_map = {
        section.alternate_name: section for section in template_sections
    }
    template_section_items = module_template_service.get_template_section_items(
        template_id=template_id
    ).filter(is_builtin_field=False)
    template_section_item_map = {
        (section_item.section.alternate_name, section_item.alternate_name): section_item
        for section_item in template_section_items
    }
    custom_sections = (
        custom_services.validate_and_autofill_custom_sections_from_template(
            custom_sections=custom_sections,
            template_section_map=template_section_map,
            template_section_item_map=template_section_item_map,
        )
    )

    additional_costs_section_items = (
        module_template_service.get_template_section_items(template_id=template_id)
        .select_related("section", "parent_section_item")
        .filter(parent_section_item__name__in=["Additional costs"])
    )
    additional_costs_from_template = {}
    if additional_costs_section_items:
        for section_item in additional_costs_section_items:
            additional_costs_from_template[section_item.name] = True

    costs_not_in_template = []
    for cost in buyer_pricing_information["additional_costs"]:
        if cost["name"] not in additional_costs_from_template:
            costs_not_in_template.append(cost["name"])

    for cost in seller_pricing_information["additional_costs"]:
        if cost["name"] not in additional_costs_from_template:
            costs_not_in_template.append(cost["name"])

    if costs_not_in_template:
        raise ValidationException(
            f"Additional cost(s) {costs_not_in_template} not found in template"
        )

    existing_additional_costs = additional_cost_service.get_additional_costs_from_names(
        enterprise_id=enterprise_id, additional_cost_names=cost_names
    )
    for additional_cost in existing_additional_costs:
        costs_map[additional_cost.cost_name] = additional_cost

    taxes_section_items = (
        module_template_service.get_template_section_items(template_id=template_id)
        .select_related("section", "parent_section_item")
        .filter(parent_section_item__name__in=["Taxes"])
    )
    taxes_from_template = {}
    if taxes_section_items:
        for section_item in taxes_section_items:
            taxes_from_template[section_item.name] = True

    taxes_not_in_template = []
    for cost in buyer_pricing_information["taxes"]:
        if cost["name"] not in taxes_from_template:
            taxes_not_in_template.append(cost["name"])

    for cost in seller_pricing_information["taxes"]:
        if cost["name"] not in taxes_from_template:
            taxes_not_in_template.append(cost["name"])

    if taxes_not_in_template:
        raise ValidationException(
            f"Tax(es) {taxes_not_in_template} not found in template"
        )

    existing_taxes = additional_cost_service.get_additional_costs_from_names(
        enterprise_id=enterprise_id, additional_cost_names=tax_names
    )
    for additional_cost in existing_taxes:
        taxes_map[additional_cost.cost_name] = additional_cost

    if not is_buyer and not is_seller:
        is_buyer = True

    if is_buyer:
        for cost in buyer_pricing_information["additional_costs"]:
            additional_cost = costs_map[cost["name"]]
            buyer_additional_costs.append(
                AdditionalCostDataClass(
                    additional_cost_id=additional_cost.additional_cost_id,
                    cost_name=cost["name"],
                    cost_type=additional_cost.cost_type,
                    allocation_type=additional_cost.allocation_type,
                    cost_source=AdditionalCostSource.ITEM.value,
                    cost_value=cost["value"],
                )
            )
        for cost in buyer_pricing_information["taxes"]:
            additional_cost = taxes_map[cost["name"]]
            buyer_taxes.append(
                AdditionalCostDataClass(
                    additional_cost_id=additional_cost.additional_cost_id,
                    cost_name=cost["name"],
                    cost_type=additional_cost.cost_type,
                    allocation_type=additional_cost.allocation_type,
                    cost_source=AdditionalCostSource.ITEM.value,
                    cost_value=cost["value"],
                )
            )

    if is_seller:
        for cost in seller_pricing_information["additional_costs"]:
            additional_cost = costs_map[cost["name"]]
            seller_additional_costs.append(
                AdditionalCostDataClass(
                    additional_cost_id=additional_cost.additional_cost_id,
                    cost_name=cost["name"],
                    cost_type=additional_cost.cost_type,
                    allocation_type=additional_cost.allocation_type,
                    cost_source=AdditionalCostSource.ITEM.value,
                    cost_value=cost["value"],
                )
            )
        for cost in seller_pricing_information["taxes"]:
            additional_cost = taxes_map[cost["name"]]
            seller_taxes.append(
                AdditionalCostDataClass(
                    additional_cost_id=additional_cost.additional_cost_id,
                    cost_name=cost["name"],
                    cost_type=additional_cost.cost_type,
                    allocation_type=additional_cost.allocation_type,
                    cost_source=AdditionalCostSource.ITEM.value,
                    cost_value=cost["value"],
                )
            )

    buyer_pricing_info = PricingInformation(
        currency_code_id=buyer_pricing_information["currency_code_id"],
        price=buyer_pricing_information["price"],
        additional_costs=buyer_additional_costs,
        taxes=buyer_taxes,
    )
    seller_pricing_info = PricingInformation(
        currency_code_id=seller_pricing_information["currency_code_id"],
        price=seller_pricing_information["price"],
        additional_costs=seller_additional_costs,
        taxes=seller_taxes,
    )

    template = ModuleTemplate.objects.filter(
        enterprise_id=enterprise_id, type=ModuleTemplateType.ITEM_TEMPLATE.value
    ).first()
    item_code_mode = enterprise_settings_service._get_enterprise_setting(
        enterprise_id=enterprise_id,
        key=EnterpriseSettingKeyType.ITEM_ENABLE_AUTOMATIC_CUSTOM_CODE_GENERATION,
    )
    enterprise = user.enterprise
    if not item_code_mode or (item_code_mode and item_code_mode.selected):
        if factwise_item_code:
            if item_service.validate_unique_enterprise_item_code(
                enterprise_id=enterprise_id, code=factwise_item_code
            ):
                raise ValidationException("Item with Factwise item Code already exists")
            code = factwise_item_code
        else:
            sequence = enterprise.current_sequence
            if sequence.last_number is None:
                sequence.last_number = sequence.original_start_number
            else:
                sequence.last_number += 1
            code = code_sequence_service.generate_new_code(
                prefix=sequence.prefix,
                number=sequence.last_number,
                digits=sequence.digits,
            )
            sequence.save()
    else:
        if factwise_item_code:
            if item_service.validate_unique_enterprise_item_code(
                enterprise_id=enterprise_id, code=factwise_item_code
            ):
                raise ValidationException("Item with Factwise item Code already exists")
            code = factwise_item_code
            is_sequence, sequence_data = (
                code_sequence_service.validate_sequence_and_parse_code(code)
            )
            if is_sequence:
                sequence, created = (
                    code_sequence_service.get_and_create_or_update_sequence(
                        enterprise_id=enterprise.enterprise_id,
                        prefix=sequence_data["prefix"],
                        digits=sequence_data["digits"],
                        original_start_number=sequence_data["number"],
                        update_original_start_number=False,
                        update_last_number=True,
                    )
                )
        else:
            raise ValidationException(
                "Factwise item code is required when code auto-generation is disabled"
            )

    current_datetime = datetime.now().strftime("%m%d%Y%H%M")
    # if factwise_item_code:
    #     if item_service.validate_unique_enterprise_item_code(
    #         enterprise_id=enterprise_id, code=factwise_item_code
    #     ):
    #         raise ValidationException("Item with Factwise item Code already exists")
    #     code = factwise_item_code
    # else:
    #     code = f"{user.enterprise_name[:3]}ITEM{current_datetime}"

    if custom_ids is None:
        custom_ids = []

    enterprise_item_id = item_service.admin_create_enterprise_item(
        user_id=user.user_id,
        code=code,
        name=name,
        ERP_item_code=ERP_item_code,
        description=description,
        notes=notes,
        internal_notes=internal_notes,
        measurement_units=measurement_units,
        item_type=item_type,
        is_buyer=is_buyer,
        is_seller=is_seller,
        buyer_pricing_information=buyer_pricing_info,
        seller_pricing_information=seller_pricing_info,
        custom_ids={
            "custom_ids": custom_ids,
        },
        tags=tags,
        status=status,
        attributes=item_attributes,
        template_id=template.template_id,
        custom_sections=custom_sections,
        openapi=True,
    )

    fw_vendor_codes = []
    erp_vendor_codes = []
    erp_vendor_code_list = []
    entity_obj_map, vendor_obj_map = {}, {}

    for entity in entity_objs:
        entity_obj_map[entity.entity_name] = entity

    for entity_item in entities:
        for vendor_code in entity_item["factwise_preferred_vendors"]:
            fw_vendor_codes.append(vendor_code)
        for vendor_code in entity_item["ERP_preferred_vendors"]:
            vendor = (
                vendor_master_service.get_enterprise_vendor_master_via_ERP_vendor_code(
                    buyer_enterprise_id=enterprise_id, ERP_vendor_code=vendor_code
                )
            )
            erp_vendor_code_list.append(vendor.vendor_code)
            erp_vendor_codes.append(vendor_code)

    if fw_vendor_codes:
        vendors_in = vendor_master_service.get_enterprise_vendor_master_via_code_list(
            vendor_code_list=fw_vendor_codes, buyer_enterprise_id=enterprise_id
        )
    else:
        vendors_in = (
            vendor_master_service.get_enterprise_vendor_master_via_ERP_vendor_code_list(
                ERP_vendor_code_list=erp_vendor_codes, buyer_enterprise_id=enterprise_id
            )
        )

    for vendor in vendors_in:
        vendor_obj_map[vendor.vendor_code] = vendor

    entity_item_list = []
    for entity_item in entities:
        entity_item_list.append(
            EntityItemRequest(
                entity_id=entity_obj_map[entity_item["entity_name"]].entity_id,
                item_status=EntityItemState.ITEM_ACTIVE.value,
            )
        )
    if not user.enterprise.is_single_entity():
        item_service.__link_entity_item__(
            enterprise_id=enterprise_id,
            item_id=enterprise_item_id,
            entity_item_list_data=entity_item_list,
        )

        item_service.validate_and_update_item_vendor_status_using_item_id(
            enterprise_id=user.enterprise_id, enterprise_item_id=enterprise_item_id
        )

    for entity_item in entities:
        for vendor_code in entity_item["factwise_preferred_vendors"]:
            vendor_preferred_item = vendor_master_service.save_vendor_buyer_entity_item(
                user_id=user.user_id,
                enterprise_vendor_master=vendor_obj_map[vendor_code],
                buyer_entity_id=entity_obj_map[entity_item["entity_name"]].entity_id,
                enterprise_item_id=enterprise_item_id,
                status=EntityVendorMasterStatus.PREFERRED.value,
            )
            vendor_preferred_item.save()

        for vendor_code in erp_vendor_code_list:
            vendor_preferred_item = vendor_master_service.save_vendor_buyer_entity_item(
                user_id=user.user_id,
                enterprise_vendor_master=vendor_obj_map[vendor_code],
                buyer_entity_id=entity_obj_map[entity_item["entity_name"]].entity_id,
                enterprise_item_id=enterprise_item_id,
                status=EntityVendorMasterStatus.PREFERRED.value,
            )
            vendor_preferred_item.save()

    return code


def _create_items_bulk_impl(*, enterprise_id, items_payload, task_id=None):
    results = []

    if task_id:
        BulkTask.objects.filter(task_id=task_id).update(status="running")

    # ---------------- PRELOAD ENTERPRISE & SETTINGS ----------------
    enterprise = Enterprise.objects.select_related("current_sequence").get(
        enterprise_id=enterprise_id
    )

    item_code_mode = enterprise_settings_service._get_enterprise_setting(
        enterprise_id=enterprise_id,
        key=EnterpriseSettingKeyType.ITEM_ENABLE_AUTOMATIC_CUSTOM_CODE_GENERATION,
    )

    emails = {p["created_by_user_email"] for p in items_payload}

    attribute_names = {
        attr["attribute_name"]
        for p in items_payload
        for attr in p.get("attributes", [])
    }

    erp_item_codes = {
        p["ERP_item_code"] for p in items_payload if p.get("ERP_item_code")
    }

    # ---------------- USERS ----------------
    user_map = enterprise_user_service.get_users_by_enterprise_emails(
        enterprise_id=enterprise_id,
        emails=emails,
    )
    user_obj_map = user_map

    # ---------------- ENTITIES ----------------
    input_entity_names = {
        entity["entity_name"] for p in items_payload for entity in p.get("entities", [])
    }

    entity_objs = entity_service.get_entities_via_names(
        entity_names=list(input_entity_names),
        enterprise_id=enterprise_id,
    )

    found_entity_names = {e.entity_name for e in entity_objs}
    missing = input_entity_names - found_entity_names

    if missing:
        raise ValidationException(
            f"Input entity(s) not found in the enterprise: {sorted(missing)}"
        )

    entity_map = {e.entity_name: e for e in entity_objs}

    # ---------------- ATTRIBUTES ----------------
    existing_attributes = attribute_service.get_attributes_via_names(
        enterprise_id=enterprise_id,
        attribute_names=attribute_names,
    )
    attribute_map = {a.attribute_name: a for a in existing_attributes}

    # ---------------- TEMPLATE ----------------
    template = (
        ModuleTemplate.objects.filter(
            enterprise_id=enterprise_id,
            type=ModuleTemplateType.ITEM_TEMPLATE.value,
            deleted_datetime__isnull=True,
        )
        .exclude(status=TemplateStatus.DEPRECATED.value)
        .first()
    )

    if not template:
        raise ValidationException("Active item template not found")

    template_sections = module_template_service.get_template_sections(
        template_id=template.template_id
    )
    template_section_map = {
        section.alternate_name: section for section in template_sections
    }

    template_section_items = (
        module_template_service.get_template_section_items(
            template_id=template.template_id
        )
        .select_related("section", "parent_section_item")
        .filter(is_builtin_field=False)
    )

    template_section_item_map = {
        (i.section.alternate_name, i.alternate_name): i for i in template_section_items
    }

    additional_cost_items = (
        module_template_service.get_template_section_items(
            template_id=template.template_id
        )
        .select_related("section", "parent_section_item")
        .filter(parent_section_item__name__in=["Additional costs"])
    )

    additional_costs_from_template = {item.name: True for item in additional_cost_items}

    taxes_items = (
        module_template_service.get_template_section_items(
            template_id=template.template_id
        )
        .select_related("section", "parent_section_item")
        .filter(parent_section_item__name__in=["Taxes"])
    )

    taxes_from_template = {item.name: True for item in taxes_items}

    # ---------------- ADDITIONAL COST MASTERS ----------------
    additional_cost_names = set()
    for p in items_payload:
        for c in p.get("buyer_pricing_information", {}).get("additional_costs", []):
            additional_cost_names.add(c["name"])
        for c in p.get("seller_pricing_information", {}).get("additional_costs", []):
            additional_cost_names.add(c["name"])

    existing_additional_costs = additional_cost_service.get_additional_costs_from_names(
        enterprise_id=enterprise_id,
        additional_cost_names=list(additional_cost_names),
    )
    costs_map = {c.cost_name: c for c in existing_additional_costs}

    # ---------------- TAXES MASTERS ----------------
    taxes_names = set()
    for p in items_payload:
        for c in p.get("buyer_pricing_information", {}).get("taxes", []):
            taxes_names.add(c["name"])
        for c in p.get("seller_pricing_information", {}).get("taxes", []):
            taxes_names.add(c["name"])

    existing_taxes = additional_cost_service.get_additional_costs_from_names(
        enterprise_id=enterprise_id,
        additional_cost_names=list(taxes_names),
    )
    taxes_map = {c.cost_name: c for c in existing_taxes}

    # ---------------- EXISTING CODES ----------------
    existing_factwise_codes = set(
        EnterpriseItem.objects.filter(
            buyer_enterprise_id=enterprise_id,
        ).values_list("code", flat=True)
    )
    seen_factwise_codes = set()

    existing_erp_codes = set(
        EnterpriseItem.objects.filter(
            buyer_enterprise_id=enterprise_id,
            ERP_item_code__in=erp_item_codes,
        ).values_list("ERP_item_code", flat=True)
    )
    seen_erp_codes = set()

    # ---------------- PROCESS EACH ITEM ----------------
    for index, payload in enumerate(items_payload):
        try:
            with transaction.atomic():
                email = payload["created_by_user_email"]
                user = user_obj_map.get(email)

                if not user:
                    raise ValidationException(
                        "User email does not exist in the enterprise"
                    )

                if user.role != UserRole.ADMIN_ROLE.value:
                    raise ValidationException(
                        "Only admin users can perform the actions"
                    )

                # -------- Buyer / Seller default --------
                is_buyer = payload.get("is_buyer", True)
                is_seller = payload.get("is_seller", False)
                if not is_buyer and not is_seller:
                    is_buyer = True

                # -------- Code Validation --------
                factwise_item_code = payload.get("factwise_item_code")
                if not item_code_mode or (item_code_mode and item_code_mode.selected):
                    # auto-generation enabled
                    if factwise_item_code:
                        if (
                            factwise_item_code in existing_factwise_codes
                            or factwise_item_code in seen_factwise_codes
                        ):
                            raise ValidationException(
                                "Item with Factwise item Code already exists"
                            )
                        code = factwise_item_code
                    else:
                        sequence = enterprise.current_sequence
                        if sequence.last_number is None:
                            next_number = sequence.original_start_number
                        else:
                            next_number = sequence.last_number + 1

                        code = code_sequence_service.generate_new_code(
                            prefix=sequence.prefix,
                            number=next_number,
                            digits=sequence.digits,
                        )

                        sequence.last_number = next_number
                        sequence.save(update_fields=["last_number"])
                else:
                    # auto-generation disabled
                    if factwise_item_code:
                        if (
                            factwise_item_code in existing_factwise_codes
                            or factwise_item_code in seen_factwise_codes
                        ):
                            raise ValidationException(
                                "Item with Factwise item Code already exists"
                            )
                        code = factwise_item_code

                        is_sequence, sequence_data = (
                            code_sequence_service.validate_sequence_and_parse_code(code)
                        )
                        if is_sequence:
                            code_sequence_service.get_and_create_or_update_sequence(
                                enterprise_id=enterprise.enterprise_id,
                                prefix=sequence_data["prefix"],
                                digits=sequence_data["digits"],
                                original_start_number=sequence_data["number"],
                                update_original_start_number=False,
                                update_last_number=True,
                            )
                    else:
                        raise ValidationException(
                            "Factwise item code is required when code auto-generation is disabled"
                        )

                seen_factwise_codes.add(code)

                erp_code = payload.get("ERP_item_code")
                if erp_code:
                    if erp_code in existing_erp_codes or erp_code in seen_erp_codes:
                        raise ValidationException(
                            "Item with ERP item Code already exists"
                        )
                    seen_erp_codes.add(erp_code)

                # -------- Attribute Validation --------
                item_attributes = []
                for attr in payload.get("attributes", []):
                    attr_obj = attribute_map.get(attr["attribute_name"])
                    if not attr_obj:
                        raise ValidationException(
                            f"Attribute {attr['attribute_name']} not found in spec directory"
                        )

                    item_attributes.append(
                        AttributeLinkageInputStruct(
                            attribute_name=attr_obj.attribute_name,
                            attribute_type=attr_obj.attribute_type,
                            attribute_id=attr_obj.attribute_id,
                            attribute_values=[
                                AttributeValueLinkageInputStruct(value=v["value"])
                                for v in attr["attribute_value"]
                            ],
                        )
                    )

                # -------- ADDITIONAL COST VALIDATION --------
                buyer_additional_costs = []
                seller_additional_costs = []

                buyer_pi = payload.get("buyer_pricing_information")
                seller_pi = payload.get("seller_pricing_information")

                if is_buyer and buyer_pi:
                    for cost in buyer_pi.get("additional_costs", []):
                        if cost["name"] not in additional_costs_from_template:
                            raise ValidationException(
                                f"Additional cost {cost['name']} not found in template"
                            )
                        additional_cost = costs_map[cost["name"]]
                        buyer_additional_costs.append(
                            AdditionalCostDataClass(
                                additional_cost_id=additional_cost.additional_cost_id,
                                cost_name=cost["name"],
                                cost_type=additional_cost.cost_type,
                                allocation_type=additional_cost.allocation_type,
                                cost_source=AdditionalCostSource.ITEM.value,
                                cost_value=cost["value"],
                            )
                        )

                if is_seller and seller_pi:
                    for cost in seller_pi.get("additional_costs", []):
                        if cost["name"] not in additional_costs_from_template:
                            raise ValidationException(
                                f"Additional cost {cost['name']} not found in template"
                            )
                        additional_cost = costs_map[cost["name"]]
                        seller_additional_costs.append(
                            AdditionalCostDataClass(
                                additional_cost_id=additional_cost.additional_cost_id,
                                cost_name=cost["name"],
                                cost_type=additional_cost.cost_type,
                                allocation_type=additional_cost.allocation_type,
                                cost_source=AdditionalCostSource.ITEM.value,
                                cost_value=cost["value"],
                            )
                        )

                # -------- TAXES VALIDATION --------
                buyer_taxes = []
                seller_taxes = []

                buyer_pi = payload.get("buyer_pricing_information")
                seller_pi = payload.get("seller_pricing_information")

                if is_buyer and buyer_pi:
                    for cost in buyer_pi.get("taxes", []):
                        if cost["name"] not in taxes_from_template:
                            raise ValidationException(
                                f"Tax {cost['name']} not found in template"
                            )
                        additional_cost = taxes_map[cost["name"]]
                        buyer_taxes.append(
                            AdditionalCostDataClass(
                                additional_cost_id=additional_cost.additional_cost_id,
                                cost_name=cost["name"],
                                cost_type=additional_cost.cost_type,
                                allocation_type=additional_cost.allocation_type,
                                cost_source=AdditionalCostSource.ITEM.value,
                                cost_value=cost["value"],
                            )
                        )

                if is_seller and seller_pi:
                    for cost in seller_pi.get("taxes", []):
                        if cost["name"] not in taxes_from_template:
                            raise ValidationException(
                                f"Tax {cost['name']} not found in template"
                            )
                        additional_cost = taxes_map[cost["name"]]
                        seller_taxes.append(
                            AdditionalCostDataClass(
                                additional_cost_id=additional_cost.additional_cost_id,
                                cost_name=cost["name"],
                                cost_type=additional_cost.cost_type,
                                allocation_type=additional_cost.allocation_type,
                                cost_source=AdditionalCostSource.ITEM.value,
                                cost_value=cost["value"],
                            )
                        )

                buyer_pricing_info = (
                    PricingInformation(
                        currency_code_id=buyer_pi["currency_code_id"],
                        price=buyer_pi["price"],
                        additional_costs=buyer_additional_costs,
                        taxes=buyer_taxes,
                    )
                    if is_buyer and buyer_pi
                    else None
                )

                seller_pricing_info = (
                    PricingInformation(
                        currency_code_id=seller_pi["currency_code_id"],
                        price=seller_pi["price"],
                        additional_costs=seller_additional_costs,
                        taxes=seller_taxes,
                    )
                    if is_seller and seller_pi
                    else None
                )

                # -------- Custom Sections --------
                custom_sections = (
                    custom_services.validate_and_autofill_custom_sections_from_template(
                        custom_sections=payload.get("custom_sections", []),
                        template_section_map=template_section_map,
                        template_section_item_map=template_section_item_map,
                    )
                )

                custom_ids = payload.get("custom_ids") or []

                # -------- Create Item --------
                enterprise_item_id = item_service.admin_create_enterprise_item(
                    user_id=user.user_id,
                    code=code,
                    name=payload["name"],
                    ERP_item_code=erp_code,
                    description=payload.get("description"),
                    notes=payload.get("notes"),
                    internal_notes=payload.get("internal_notes"),
                    measurement_units=payload.get("measurement_units"),
                    item_type=payload["item_type"],
                    is_buyer=is_buyer,
                    is_seller=is_seller,
                    buyer_pricing_information=buyer_pricing_info,
                    seller_pricing_information=seller_pricing_info,
                    custom_ids={"custom_ids": custom_ids},
                    tags=payload.get("tags", []),
                    status=payload["status"],
                    attributes=item_attributes,
                    template_id=template.template_id,
                    custom_sections=custom_sections,
                    openapi=True,
                )

                # -------- ENTITY LINKING --------
                entity_item_list = [
                    EntityItemRequest(
                        entity_id=entity_map[e["entity_name"]].entity_id,
                        item_status=EntityItemState.ITEM_ACTIVE.value,
                    )
                    for e in payload.get("entities", [])
                ]

                if not user.enterprise.is_single_entity():
                    item_service.__link_entity_item__(
                        enterprise_id=enterprise_id,
                        item_id=enterprise_item_id,
                        entity_item_list_data=entity_item_list,
                    )

                    item_service.validate_and_update_item_vendor_status_using_item_id(
                        enterprise_id=enterprise_id,
                        enterprise_item_id=enterprise_item_id,
                    )

                # -------- VENDOR PREFERENCES --------
                fw_vendor_codes, erp_vendor_codes = [], []

                for e in payload.get("entities", []):
                    fw_vendor_codes.extend(e.get("factwise_preferred_vendors", []))
                    erp_vendor_codes.extend(e.get("ERP_preferred_vendors", []))

                vendor_obj_map = {}

                if fw_vendor_codes:
                    vendors = vendor_master_service.get_enterprise_vendor_master_via_code_list(
                        vendor_code_list=fw_vendor_codes,
                        buyer_enterprise_id=enterprise_id,
                    )
                else:
                    vendors = vendor_master_service.get_enterprise_vendor_master_via_ERP_vendor_code_list(
                        ERP_vendor_code_list=erp_vendor_codes,
                        buyer_enterprise_id=enterprise_id,
                    )

                for v in vendors:
                    vendor_obj_map[v.vendor_code] = v

                for e in payload.get("entities", []):
                    buyer_entity_id = entity_map[e["entity_name"]].entity_id

                    for c in e.get("factwise_preferred_vendors", []):
                        if c not in vendor_obj_map:
                            raise BadRequestException(f"Invalid vendor code: {c}")

                        vendor_master_service.save_vendor_buyer_entity_item(
                            user_id=user.user_id,
                            enterprise_vendor_master=vendor_obj_map[c],
                            buyer_entity_id=buyer_entity_id,
                            enterprise_item_id=enterprise_item_id,
                            status=EntityVendorMasterStatus.PREFERRED.value,
                        ).save()

                    for c in e.get("ERP_preferred_vendors", []):
                        if c not in vendor_obj_map:
                            raise BadRequestException(f"Invalid vendor code: {c}")

                        vendor_master_service.save_vendor_buyer_entity_item(
                            user_id=user.user_id,
                            enterprise_vendor_master=vendor_obj_map[c],
                            buyer_entity_id=buyer_entity_id,
                            enterprise_item_id=enterprise_item_id,
                            status=EntityVendorMasterStatus.PREFERRED.value,
                        ).save()

            results.append(
                {
                    "index": index,
                    "status": "success",
                    "erp_item_code": erp_code,
                    "item_code": factwise_item_code,
                    "item_id": str(enterprise_item_id),
                }
            )

            if task_id:
                BulkTask.objects.filter(task_id=task_id).update(
                    processed=F("processed") + 1,
                    success=F("success") + 1,
                    results=JsonbConcat(
                        F("results"), Value([results[-1]], output_field=JSONField())
                    ),
                )

        except Exception as exc:
            failure = {
                "index": index,
                "status": "failed",
                "erp_item_code": payload.get("ERP_item_code"),
                "error": str(exc),
            }

            results.append(failure)

            if task_id:
                BulkTask.objects.filter(task_id=task_id).update(
                    processed=F("processed") + 1,
                    failed=F("failed") + 1,
                    results=JsonbConcat(
                        F("results"),
                        Value([failure], output_field=JSONField()),
                    ),
                )

    if task_id:
        BulkTask.objects.filter(task_id=task_id).update(status="success")

    return {
        "total": len(items_payload),
        "success": sum(r["status"] == "success" for r in results),
        "failed": sum(r["status"] == "failed" for r in results),
        "results": results,
    }


@shared_task(bind=True)
def create_items_bulk_task(self, *, enterprise_id, items_payload, task_id):
    try:
        return _create_items_bulk_impl(
            enterprise_id=enterprise_id,
            items_payload=items_payload,
            task_id=task_id,
        )
    except Exception as exc:
        BulkTask.objects.filter(task_id=task_id).update(
            status="failed",
            error=str(exc),
        )
        raise


ASYNC_ITEM_THRESHOLD = 70


def create_items_bulk(*, enterprise_id, items_payload, total_len, validation_errors):
    """
    Returns:
    - Sync:
        {
            "total": int,
            "success": int,
            "failed": int,
            "results": [...]
        }

    - Async:
        {
            "status": "accepted",
            "mode": "async",
            "task_id": str,
        }
    """

    total = len(items_payload)

    # if total >= ASYNC_ITEM_THRESHOLD:
    #     task_id = uuid.uuid4()
    #     BulkTask.objects.create(
    #         task_id=task_id,
    #         task_type="item",
    #         enterprise_id=enterprise_id,
    #         status="pending",
    #         total=total_len,
    #         processed=len(validation_errors),
    #         success=0,
    #         failed=len(validation_errors),
    #         results=[
    #             {
    #                 "index": e["index"],
    #                 "status": "failed",
    #                 "erp_item_code": e.get("erp_item_code"),
    #                 "error": e["error"],
    #             }
    #             for e in validation_errors
    #         ],
    #     )
    #
    #     create_items_bulk_task.delay(  # type: ignore
    #         enterprise_id=enterprise_id,
    #         items_payload=make_json_safe(items_payload),
    #         task_id=str(task_id),
    #     )
    #
    #     return {
    #         "status": "accepted",
    #         "mode": "async",
    #         "task_id": str(task_id),
    #     }
    #
    return _create_items_bulk_impl(
        enterprise_id=enterprise_id,
        items_payload=items_payload,
    )


@transaction.atomic
def update_item(
    *,
    modified_by_user_email,
    enterprise_id,
    name,
    ERP_item_code,
    factwise_item_code,
    item_type,
    description,
    notes,
    internal_notes,
    measurement_units,
    custom_ids,
    attributes,
    is_buyer,
    is_seller,
    buyer_pricing_information,
    seller_pricing_information,
    tags,
    entities,
    custom_sections,
):
    user = enterprise_user_service.get_user_by_enterprise_email(
        enterprise_id=enterprise_id, email=modified_by_user_email
    )
    if not user:
        raise ValidationException("User email does not exist in the enterprise")
    if user.role != UserRole.ADMIN_ROLE.value:
        raise ValidationException(
            "Only admin users can perform the actions. Please change the user's email"
        )

    entity_objs = entity_service.get_entities_via_names(
        entity_names=[entity["entity_name"] for entity in entities],
        enterprise_id=enterprise_id,
    )
    if len(entities) != entity_objs.count():
        raise ValidationException(
            "Input entity(s) not found in the enterprise! Please enter correct entity name(s)"
        )

    (
        attribute_names,
        cost_names,
        item_attributes,
        buyer_additional_costs,
        seller_additional_costs,
    ) = ([], [], [], [], [])
    attributes_map, costs_map = {}, {}

    for attribute in attributes:
        attribute_names.append(attribute["attribute_name"])

    existing_attributes = attribute_service.get_attributes_via_names(
        enterprise_id=enterprise_id, attribute_names=attribute_names
    )
    for attribute in existing_attributes:
        attributes_map[attribute.attribute_name] = attribute

    attributes_not_in_template = []
    for attribute_name in attribute_names:
        if attribute_name not in attributes_map:
            attributes_not_in_template.append(attribute_name)

    if attributes_not_in_template:
        raise ValidationException(
            f"Attribute(s) {attributes_not_in_template} not found in spec directory"
        )

    for attribute in attributes:
        item_attribute = attributes_map[attribute["attribute_name"]]
        item_attributes.append(
            AttributeLinkageInputStruct(
                attribute_name=item_attribute.attribute_name,
                attribute_type=item_attribute.attribute_type,
                attribute_id=item_attribute.attribute_id,
                attribute_values=[
                    AttributeValueLinkageInputStruct(value=attribute_value["value"])
                    for attribute_value in attribute["attribute_value"]
                ],
            )
        )

    for cost in buyer_pricing_information["additional_costs"]:
        cost_names.append(cost["name"])
    for cost in seller_pricing_information["additional_costs"]:
        cost_names.append(cost["name"])

    template = ModuleTemplate.objects.get(
        ~Q(status=TemplateStatus.DEPRECATED.value),
        type=ModuleTemplateType.ITEM_TEMPLATE.value,
        enterprise_id=enterprise_id,
        deleted_datetime__isnull=True,
    )
    template_id = template.template_id
    template_sections = module_template_service.get_template_sections(
        template_id=template_id
    )
    template_section_map = {
        section.alternate_name: section for section in template_sections
    }

    template_section_items = module_template_service.get_template_section_items(
        template_id=template_id
    ).filter(is_builtin_field=False)
    template_section_item_map = {
        (section_item.section.alternate_name, section_item.alternate_name): section_item
        for section_item in template_section_items
    }
    custom_services.validate_and_autofill_custom_sections_from_template(
        custom_sections=custom_sections,
        template_section_map=template_section_map,
        template_section_item_map=template_section_item_map,
    )
    section_items = (
        module_template_service.get_template_section_items(template_id=template_id)
        .select_related("section", "parent_section_item")
        .filter(parent_section_item__name__in=["Additional costs"])
    )

    additional_costs_from_template = {}
    if section_items:
        for section_item in section_items:
            additional_costs_from_template[section_item.name] = True

    costs_not_in_template = []
    for cost in buyer_pricing_information["additional_costs"]:
        if cost["name"] not in additional_costs_from_template:
            costs_not_in_template.append(cost["name"])

    for cost in seller_pricing_information["additional_costs"]:
        if cost["name"] not in additional_costs_from_template:
            costs_not_in_template.append(cost["name"])

    if costs_not_in_template:
        raise ValidationException(
            f"Additional cost(s) {costs_not_in_template} not found in template"
        )

    if not is_buyer and not is_seller:
        is_buyer = True

    existing_additional_costs = additional_cost_service.get_additional_costs_from_names(
        enterprise_id=enterprise_id, additional_cost_names=cost_names
    )
    for additional_cost in existing_additional_costs:
        costs_map[additional_cost.cost_name] = additional_cost

    if is_buyer:
        for cost in buyer_pricing_information["additional_costs"]:
            additional_cost = costs_map[cost["name"]]
            buyer_additional_costs.append(
                AdditionalCostDataClass(
                    additional_cost_id=additional_cost.additional_cost_id,
                    cost_name=cost["name"],
                    cost_type=additional_cost.cost_type,
                    allocation_type=additional_cost.allocation_type,
                    cost_source=AdditionalCostSource.ITEM.value,
                    cost_value=cost["value"],
                )
            )

    if is_seller:
        for cost in seller_pricing_information["additional_costs"]:
            additional_cost = costs_map[cost["name"]]
            seller_additional_costs.append(
                AdditionalCostDataClass(
                    additional_cost_id=additional_cost.additional_cost_id,
                    cost_name=cost["name"],
                    cost_type=additional_cost.cost_type,
                    allocation_type=additional_cost.allocation_type,
                    cost_source=AdditionalCostSource.ITEM.value,
                    cost_value=cost["value"],
                )
            )

    buyer_pricing_info = PricingInformation(
        currency_code_id=buyer_pricing_information["currency_code_id"],
        price=buyer_pricing_information["price"],
        additional_costs=buyer_additional_costs,
    )
    seller_pricing_info = PricingInformation(
        currency_code_id=seller_pricing_information["currency_code_id"],
        price=seller_pricing_information["price"],
        additional_costs=seller_additional_costs,
    )

    if factwise_item_code:
        try:
            enterprise_item = item_service.get_enterprise_item_via_code(
                enterprise_id=enterprise_id, code=factwise_item_code
            )
        except EnterpriseItem.DoesNotExist:
            raise ValidationException("Item with Factwise item Code does not exist")
    else:
        enterprise_item = item_service.validate_and_get_enterprise_item(
            enterprise_id=enterprise_id, ERP_item_code=ERP_item_code
        )

    if custom_ids is None:
        custom_ids = []

    item_service.admin_update_enterprise_item(
        user_id=user.user_id,
        enterprise_id=enterprise_id,
        item_id=enterprise_item.enterprise_item_id,
        code=enterprise_item.code,
        name=name,
        description=description,
        notes=notes,
        internal_notes=internal_notes,
        measurement_units=measurement_units,
        attributes=item_attributes,
        item_type=item_type,
        is_buyer=is_buyer,
        is_seller=is_seller,
        custom_ids={
            "custom_ids": custom_ids,
        },
        custom_sections=custom_sections,
        buyer_pricing_information=buyer_pricing_info,
        seller_pricing_information=seller_pricing_info,
        tags=tags,
        status=EnterpriseItemState.ITEM_ACTIVE.value,
    )

    entity_item_vendors = []
    fw_vendor_codes = []
    erp_vendor_codes = []
    erp_vendor_code_list = []
    vendor_obj_map, entity_obj_map, entity_item_vendor_obj_map = {}, {}, {}

    for entity in entity_objs:
        entity_obj_map[entity.entity_name] = entity

    for entity_item in entities:
        for vendor_code in entity_item["factwise_preferred_vendors"]:
            fw_vendor_codes.append(vendor_code)
        for vendor_code in entity_item["ERP_preferred_vendors"]:
            vendor = (
                vendor_master_service.get_enterprise_vendor_master_via_ERP_vendor_code(
                    buyer_enterprise_id=enterprise_id, ERP_vendor_code=vendor_code
                )
            )
            erp_vendor_code_list.append(vendor.vendor_code)
            erp_vendor_codes.append(vendor_code)

    if fw_vendor_codes:
        vendors_in = vendor_master_service.get_enterprise_vendor_master_via_code_list(
            vendor_code_list=fw_vendor_codes, buyer_enterprise_id=enterprise_id
        )
    else:
        vendors_in = (
            vendor_master_service.get_enterprise_vendor_master_via_ERP_vendor_code_list(
                ERP_vendor_code_list=erp_vendor_codes, buyer_enterprise_id=enterprise_id
            )
        )

    for vendor in vendors_in:
        vendor_obj_map[vendor.vendor_code] = vendor

    if entity_item_vendors:
        query = reduce(
            operator.or_,
            (
                Q(
                    enterprise_vendor_master=vendor_obj_map[vendor_code],
                    buyer_entity_id=entity_obj_map[entity].entity_id,
                    enterprise_item_id=enterprise_item.enterprise_item_id,
                    deleted_datetime__isnull=True,
                )
                for entity, vendor_code in entity_item_vendors
            ),
            Q(),
        )
        entity_item_vendors_in = EntityVendorMaster.objects.filter(
            query
        ).select_related("enterprise_item", "buyer_entity", "enterprise_vendor_master")
        for entity_item_vendor in entity_item_vendors_in:
            entity_item_vendor_obj_map[
                (
                    entity_item_vendor.buyer_entity.entity_name,
                    entity_item_vendor.enterprise_vendor_master.vendor_code,
                )
            ] = entity_item_vendor

    entity_item_list = []
    all_entities = entity_service.get_entities_count(enterprise_id)
    inactive_entities = all_entities.exclude(
        entity_id__in=entity_objs.values_list("entity_id", flat=True)
    )
    for entity in entity_objs:
        entity_item_list.append(
            EntityItemRequest(
                entity_id=entity.entity_id,
                item_status=EntityItemState.ITEM_ACTIVE.value,
            )
        )
    for entity in inactive_entities:
        entity_item_list.append(
            EntityItemRequest(
                entity_id=entity.entity_id,
                item_status=EntityItemState.ITEM_INACTIVE.value,
            )
        )
    item_service.admin_update_entity_item(
        user_id=user.user_id,
        item_id=enterprise_item.enterprise_item_id,
        entity_item_list=entity_item_list,
    )
    for entity_item in entities:
        for vendor_code in entity_item["factwise_preferred_vendors"]:
            if (
                entity_item["entity_name"],
                vendor_code,
            ) not in entity_item_vendor_obj_map:
                vendor_preferred_item = (
                    vendor_master_service.save_vendor_buyer_entity_item(
                        user_id=user.user_id,
                        enterprise_vendor_master=vendor_obj_map[vendor_code],
                        buyer_entity_id=entity_obj_map[
                            entity_item["entity_name"]
                        ].entity_id,
                        enterprise_item_id=enterprise_item.enterprise_item_id,
                        status=EntityVendorMasterStatus.PREFERRED.value,
                    )
                )
                entity_item_vendor_obj_map[
                    (entity_item["entity_name"], vendor_code)
                ] = vendor_preferred_item
                vendor_preferred_item.save()
            else:
                entity_vendor_master = entity_item_vendor_obj_map[
                    (entity_item["entity_name"], vendor_code)
                ]
                entity_vendor_master.status = EntityVendorMasterStatus.PREFERRED.value
                entity_vendor_master.save()
        for vendor_code in erp_vendor_code_list:
            if (
                entity_item["entity_name"],
                vendor_code,
            ) not in entity_item_vendor_obj_map:
                vendor_preferred_item = (
                    vendor_master_service.save_vendor_buyer_entity_item(
                        user_id=user.user_id,
                        enterprise_vendor_master=vendor_obj_map[vendor_code],
                        buyer_entity_id=entity_obj_map[
                            entity_item["entity_name"]
                        ].entity_id,
                        enterprise_item_id=enterprise_item.enterprise_item_id,
                        status=EntityVendorMasterStatus.PREFERRED.value,
                    )
                )
                entity_item_vendor_obj_map[
                    (entity_item["entity_name"], vendor_code)
                ] = vendor_preferred_item
                vendor_preferred_item.save()
            else:
                entity_vendor_master = entity_item_vendor_obj_map[
                    (entity_item["entity_name"], vendor_code)
                ]
                entity_vendor_master.status = EntityVendorMasterStatus.PREFERRED.value
                entity_vendor_master.save()


@transaction.atomic
def update_item_status(
    *, modified_by_user_email, enterprise_id, ERP_item_code, factwise_item_code, status
):
    user = enterprise_user_service.get_user_by_enterprise_email(
        enterprise_id=enterprise_id, email=modified_by_user_email
    )
    if not user:
        raise ValidationException("User email does not exist in the enterprise")
    if user.role != UserRole.ADMIN_ROLE.value:
        raise ValidationException(
            "Only admin users can perform the actions. Please change the user's email"
        )

    if factwise_item_code:
        try:
            enterprise_item = item_service.get_enterprise_item_via_code(
                enterprise_id=enterprise_id, code=factwise_item_code
            )
        except EnterpriseItem.DoesNotExist:
            raise ValidationException("Item with Factwise item Code does not exist")
    else:
        enterprise_item = item_service.validate_and_get_enterprise_item(
            enterprise_id=enterprise_id, ERP_item_code=ERP_item_code
        )
    item_service.admin_update_enterprise_item_status(
        user_id=user.user_id, item_id=enterprise_item.enterprise_item_id, status=status
    )
