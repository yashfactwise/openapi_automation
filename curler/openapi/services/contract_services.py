from dataclasses import asdict
from django.db import transaction

from additional_costs import services as additional_cost_service
from additional_costs.models import AdditionalCostLinkage
from additional_costs.states import AdditionalCostType
from additional_costs.states import AdditionalCostLinkageModule
from additional_costs.structures import AdditionalCostDataClass
from attributes import services as attribute_service
from attributes.models import AttributeLinkage
from attributes.models import AttributeValueLinkage
from attributes.states import AttributeLinkageModule
from attributes.structures import (
    AttributeLinkageInputStruct,
    AttributeValueLinkageInputStruct,
)
from backbone import service as backbone_service
from contract import workflows as contract_workflows
from contract.models.contract_item_model import ContractItem
from contract.services import contract_item_service
from contract.services import contract_service
from contract.structures import (
    ContractAdditionalDetails,
    ContractItemPricingInformation,
    ContractProjectInformation,
)
from custom import service as custom_service
from custom.models import CustomField, CustomSection
from contract.models.contract_model import Contract
from contract.models.pricing_tier_model import PricingTier
from contract.services import pricing_tier_service
from contract.states import ContractState
from organization.states import EntitySettingKeyType
from organization.services import identification_service
from module_templates import services as template_services
from module_templates.types import (
    ModuleTemplateSectionItemLevel,
    ModuleTemplateSectionType,
    ModuleTemplateType,
)
from openapi.services import custom_services
from organization.org_models.item_master_model import EnterpriseItem
from organization.org_models.vendor_master_model import (
    EntityVendorMaster,
    VendorContact,
)
from organization.services import address_service
from organization.services import enterprise_user_service
from organization.services import entity_service
from organization.services import entity_settings_service
from organization.services import item_service
from organization.services import project_service
from organization.services import terms_and_conditions_service
from organization.services import vendor_contact_service
from organization.services import vendor_master_service
from purchase_order.structures.event_po_structures import (
    EventPurchaseOrderTermsAndConditions,
)

from factwise.exception import BadRequestException, ValidationException


@transaction.atomic
def create_contract(
    *,
    enterprise_id,
    created_by_user_email,
    contract_name,
    ERP_contract_id,
    contract_start_date,
    contract_end_date,
    entity_name,
    status,
    template_name,
    buyer_identifications,
    buyer_address,
    buyer_contact,
    factwise_vendor_code,
    ERP_vendor_code,
    vendor_identifications,
    vendor_address,
    vendor_contact,
    project,
    additional_costs,
    taxes,
    discounts,
    prepayment_percentage,
    payment_type,
    payment_terms,
    deliverables_payment_terms,
    incoterm,
    lead_time,
    lead_time_period,
    custom_sections,
    attachments,
    terms_and_conditions,
    contract_items,
):
    print(f"[OPENAPI-CONTRACT] >>> create_contract ENTERED enterprise={enterprise_id} status={status} name={contract_name}", flush=True)
    user = enterprise_user_service.get_user_by_enterprise_email(
        enterprise_id=enterprise_id, email=created_by_user_email
    )
    if not user:
        raise ValidationException("User email does not exist in the enterprise")
    user_id = user.user_id
    buyer_entity_name = entity_name
    buyer_entity = entity_service.get_entity_via_name(
        entity_name=buyer_entity_name, enterprise_id=enterprise_id
    )
    if not buyer_entity:
        raise BadRequestException("Invalid entity")
    buyer_entity_id = buyer_entity.entity_id
    buyer_identifications = (
        _get_buyer_identiifications_from_entity_and_identification_names(
            buyer_entity_id=buyer_entity_id,
            identification_name_list=buyer_identifications,
        )
    )
    buyer_address_information = _get_buyer_address_information_from_entity_and_nickname(
        buyer_entity_id=buyer_entity_id, buyer_address=buyer_address
    )

    buyer_contact_information = _get_buyer_contact_information_from_email(
        enterprise_id=enterprise_id, email=buyer_contact
    )

    entity_vm = _get_entity_vm_from_code(
        buyer_entity_id=buyer_entity_id,
        factwise_vendor_code=factwise_vendor_code,
        ERP_vendor_code=ERP_vendor_code,
    )
    enterprise_vm = entity_vm.enterprise_vendor_master
    seller_entity_id = enterprise_vm.seller_entity_id
    seller_enterprise_id = enterprise_vm.seller_enterprise_id

    vendor_contact_information = (
        _get_vendor_contact_information_from_buyer_and_seller_entity_and_email(
            buyer_entity_id=buyer_entity_id,
            seller_entity_id=seller_entity_id,
            vendor_contact=vendor_contact,
        )
    )

    vendor_address_information = (
        _get_vendor_address_information_from_seller_entity_and_nickname(
            seller_entity_id=seller_entity_id, vendor_address=vendor_address
        )
    )

    terms_and_conditions = _get_terms_and_conditions(
        enterprise_id=enterprise_id, terms_and_conditions=terms_and_conditions
    )
    project_information = _get_project_information_from_project_code(
        buyer_entity_id=buyer_entity_id, project_code=project
    )
    incoterm_id = backbone_service.get_incoterm_via_name(incoterm=incoterm).entry_id
    template = template_services._get_template_from_name(
        entity_id=buyer_entity_id,
        name=template_name,
        type=ModuleTemplateType.CLM_TEMPLATE,
    )
    template_id = template.template_id
    additional_details = ContractAdditionalDetails(template_id=template_id)

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
    custom_sections = (
        custom_services.validate_and_autofill_custom_sections_from_template(
            custom_sections=custom_sections,
            template_section_map=template_section_map,
            template_section_item_map=template_section_item_map,
        )
    )
    (
        attribute_names,
        overall_cost_names,
        item_cost_names,
        contract_additional_costs,
        contract_taxes,
        contract_discounts,
        currency_code_ids,
        incoterm_names,
    ) = ([], [], [], [], [], [], [], [])
    (
        attributes_map,
        overall_costs_map,
        item_costs_map,
        currency_code_map,
        incoterm_map,
    ) = ({}, {}, {}, {}, {})

    for cost in additional_costs:
        overall_cost_names.append(cost["name"])
    for cost in taxes:
        overall_cost_names.append(cost["name"])
    for cost in discounts:
        overall_cost_names.append(cost["name"])

    existing_overall_additional_costs = (
        additional_cost_service.get_additional_costs_from_names(
            enterprise_id=enterprise_id, additional_cost_names=overall_cost_names
        ).filter(field_level=ModuleTemplateSectionItemLevel.OTHER.value)
    )
    for additional_cost in existing_overall_additional_costs:
        overall_costs_map[additional_cost.cost_name] = additional_cost

    for cost in additional_costs:
        additional_cost = overall_costs_map[cost["name"]]
        contract_additional_costs.append(
            AdditionalCostDataClass(
                additional_cost_id=additional_cost.additional_cost_id,
                cost_name=cost["name"],
                cost_type=additional_cost.cost_type,
                allocation_type=additional_cost.allocation_type,
                cost_value=cost["value"],
            )
        )
    for cost in taxes:
        additional_cost = overall_costs_map[cost["name"]]
        contract_taxes.append(
            AdditionalCostDataClass(
                additional_cost_id=additional_cost.additional_cost_id,
                cost_name=cost["name"],
                cost_type=additional_cost.cost_type,
                allocation_type=additional_cost.allocation_type,
                cost_value=cost["value"],
            )
        )
    for cost in discounts:
        cost_name = cost["name"]
        if cost_name != "Overall discount":
            additional_cost = overall_costs_map[cost_name]
            contract_discounts.append(
                AdditionalCostDataClass(
                    additional_cost_id=additional_cost.additional_cost_id,
                    cost_name=cost_name,
                    cost_type=additional_cost.cost_type,
                    allocation_type=additional_cost.allocation_type,
                    cost_value=cost["value"],
                )
            )
        else:
            contract_discounts.append(
                AdditionalCostDataClass(
                    additional_cost_id=None,
                    cost_name=cost_name,
                    cost_type="PERCENTAGE",
                    allocation_type=None,
                    cost_value=cost["value"],
                )
            )

    for contract_item in contract_items:
        currency_code_id = contract_item["currency_code_id"]
        currency_code_ids.append(currency_code_id)

        incoterm = contract_item["incoterm"]
        incoterm_names.append(incoterm)
        attributes = contract_item["attributes"]
        for attribute in attributes:
            attribute_names.append(attribute["attribute_name"])
        # additional_costs = contract_item["additional_costs"]
        # taxes = contract_item["taxes"]
        # discounts = contract_item["discounts"]
        # for cost in additional_costs:
        #     item_cost_names.append(cost["name"])
        # for cost in taxes:
        #     item_cost_names.append(cost["name"])
        # for cost in discounts:
        #     item_cost_names.append(cost["name"])
        for pricing_tier in contract_item["pricing_tiers"]:
            additional_costs = pricing_tier["additional_costs"]
            taxes = pricing_tier["taxes"]
            discounts = pricing_tier["discounts"]
            for cost in additional_costs:
                item_cost_names.append(cost["name"])
            for cost in taxes:
                item_cost_names.append(cost["name"])
            for cost in discounts:
                item_cost_names.append(cost["name"])

    currency_codes = backbone_service.get_currency_list_via_ids(
        currency_code_id_list=currency_code_ids
    )
    for currency in currency_codes:
        currency_code_map[currency.entry_id] = currency

    incoterms = backbone_service.get_incoterm_list(incoterms=incoterm_names)
    for incoterm in incoterms:
        incoterm_map[incoterm.incoterm_abbreviation] = incoterm

    existing_attributes = attribute_service.get_attributes_via_names(
        enterprise_id=enterprise_id, attribute_names=attribute_names
    )
    for attribute in existing_attributes:
        attributes_map[attribute.attribute_name] = attribute

    existing_item_additional_costs = (
        additional_cost_service.get_additional_costs_from_names(
            enterprise_id=enterprise_id, additional_cost_names=item_cost_names
        ).filter(field_level=ModuleTemplateSectionItemLevel.ITEM.value)
    )
    for additional_cost in existing_item_additional_costs:
        item_costs_map[additional_cost.cost_name] = additional_cost
    contract = contract_service._save_contract(
        ERP_contract_id=ERP_contract_id,
        contract_name=contract_name,
        contract_start_date=contract_start_date,
        contract_end_date=contract_end_date,
        buyer_entity_id=buyer_entity_id,
        buyer_enterprise_id=enterprise_id,
        seller_entity_id=seller_entity_id,
        seller_enterprise_id=seller_enterprise_id,
        buyer_address_information=buyer_address_information,
        buyer_contact_information=buyer_contact_information,
        buyer_identifications=buyer_identifications,
        status=status,
        additional_details=additional_details,
        project_information=project_information,
        prepayment_percentage=prepayment_percentage,
        payment_type=payment_type,
        payment_terms=payment_terms,
        deliverables_payment_terms=deliverables_payment_terms,
        incoterm_id=incoterm_id,
        lead_time=lead_time,
        lead_time_period=lead_time_period,
        terms_and_conditions=terms_and_conditions,
        vendor_identifications=vendor_identifications,
        vendor_address_information=vendor_address_information,
        vendor_contact_information=vendor_contact_information,
    )
    contract.created_by_user_id = user_id
    contract.save()
    contract_id = contract.contract_id
    additional_costs_to_create, _ = additional_cost_service.handle_additional_costs(
        type=AdditionalCostType.ADDITIONAL_COST.value,
        user_id=user_id,
        enterprise_id=enterprise_id,
        module=AdditionalCostLinkageModule.CONTRACT.value,
        additional_costs=contract_additional_costs,
        contract_id=contract_id,
        is_create=True,
    )
    taxes_to_create, _ = additional_cost_service.handle_additional_costs(
        type=AdditionalCostType.TAX.value,
        user_id=user_id,
        enterprise_id=enterprise_id,
        module=AdditionalCostLinkageModule.CONTRACT.value,
        additional_costs=contract_taxes,
        contract_id=contract_id,
        is_create=True,
    )
    discounts_to_create, _ = additional_cost_service.handle_additional_costs(
        type=AdditionalCostType.DISCOUNT.value,
        user_id=user_id,
        enterprise_id=enterprise_id,
        module=AdditionalCostLinkageModule.CONTRACT.value,
        additional_costs=contract_discounts,
        contract_id=contract_id,
        is_create=True,
    )
    AdditionalCostLinkage.objects.bulk_create(additional_costs_to_create)
    AdditionalCostLinkage.objects.bulk_create(taxes_to_create)
    AdditionalCostLinkage.objects.bulk_create(discounts_to_create)

    (
        custom_sections_to_create,
        _,
        custom_fields_to_create,
        custom_fields_attachments_to_create_map,
        custom_section_map,
    ) = custom_service.create_custom_sections(
        user_id=user_id,
        custom_sections=custom_sections,
        enterprise_id=enterprise_id,
        contract_id=contract_id,
        custom_section_map={},
    )

    CustomSection.objects.bulk_create(custom_sections_to_create)
    CustomField.objects.bulk_create(custom_fields_to_create)

    (
        contract_items_to_create,
        pricing_tiers_to_create,
        custom_fields_to_create,
        additional_costs_to_create,
        taxes_to_create,
        discounts_to_create,
        attributes_to_create,
        attribute_values_to_create,
    ) = ([], [], [], [], [], [], [], [])
    for contract_item in contract_items:
        (
            contract_item_attributes,
            # contract_item_additional_costs,
            # contract_item_taxes,
            # contract_item_discounts,
        ) = (
            [],
            #  [], [], []
        )
        ERP_item_code = contract_item["ERP_item_code"]
        factwise_item_code = contract_item["factwise_item_code"]

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

        enterprise_item_id = enterprise_item.enterprise_item_id

        currency_code_id = contract_item["currency_code_id"]
        currency_code = currency_code_map[currency_code_id]

        measurement_unit_id = contract_item["measurement_unit_id"]
        attributes = contract_item["attributes"]
        for attribute in attributes:
            contract_item_attribute = attributes_map[attribute["attribute_name"]]
            contract_item_attributes.append(
                AttributeLinkageInputStruct(
                    attribute_name=contract_item_attribute.attribute_name,
                    attribute_type=contract_item_attribute.attribute_type,
                    attribute_id=contract_item_attribute.attribute_id,
                    attribute_values=[
                        AttributeValueLinkageInputStruct(value=attribute_value["value"])
                        for attribute_value in attribute["attribute_value"]
                    ],
                )
            )
        # quantity = contract_item["quantity"]
        incoterm = contract_item["incoterm"]
        incoterm_id = incoterm_map[incoterm].entry_id

        lead_time = contract_item["lead_time"]
        lead_time_period = contract_item["lead_time_period"]
        procurement_information = (
            contract_item_service._construct_procurement_information(
                lead_time=lead_time, lead_time_period=lead_time_period
            )
        )
        rate = None
        # item_additional_costs = []
        # item_taxes = []
        # item_discounts = []

        # rate = contract_item["rate"]
        # item_additional_costs = contract_item["additional_costs"]
        # item_taxes = contract_item["taxes"]
        # item_discounts = contract_item["discounts"]
        # format_costs_result = _format_costs(
        #     additional_costs=item_additional_costs,
        #     taxes=item_taxes,
        #     discounts=item_discounts,
        #     costs_map=item_costs_map,
        # )
        # contract_item_additional_costs = format_costs_result["additional_costs"]
        # contract_item_taxes = format_costs_result["taxes"]
        # contract_item_discounts = format_costs_result["discounts"]

        # total = additional_cost_service._get_item_total(
        #     base_quantity=quantity,
        #     base_rate=rate,
        #     additional_costs=[
        #         asdict(additional_cost)
        #         for additional_cost in contract_item_additional_costs
        #     ],
        #     taxes=[
        #         asdict(additional_cost) for additional_cost in contract_item_taxes
        #     ],
        #     discounts=[
        #         asdict(additional_cost)
        #         for additional_cost in contract_item_discounts
        #     ],
        # )
        pricing_tiers = contract_item["pricing_tiers"]
        item_quantity = 0
        for pricing_tier in pricing_tiers:
            tier_rate = pricing_tier["rate"]
            min_quantity = pricing_tier["min_quantity"]
            max_quantity = pricing_tier["max_quantity"]
            additional_costs = pricing_tier["additional_costs"]
            taxes = pricing_tier["taxes"]
            discounts = pricing_tier["discounts"]
            format_costs_result = _format_costs(
                additional_costs=additional_costs,
                taxes=taxes,
                discounts=discounts,
                costs_map=item_costs_map,
            )
            additional_costs = format_costs_result["additional_costs"]
            taxes = format_costs_result["taxes"]
            discounts = format_costs_result["discounts"]

            pricing_tier["additional_costs"] = additional_costs
            pricing_tier["taxes"] = taxes
            pricing_tier["discounts"] = discounts

            effective_rate = additional_cost_service._get_item_effective_rate(
                base_quantity=max_quantity - min_quantity,
                base_rate=tier_rate,
                additional_costs=[
                    asdict(additional_cost) for additional_cost in additional_costs
                ],
                taxes=[asdict(additional_cost) for additional_cost in taxes],
                discounts=[asdict(additional_cost) for additional_cost in discounts],
            )
            pricing_tier["effective_rate"] = effective_rate

            if item_quantity < max_quantity:
                item_quantity = max_quantity

        quantity = item_quantity

        pricing_information = ContractItemPricingInformation(
            currency_code_id=currency_code.entry_id,
            currency_name=currency_code.currency_name,
            currency_symbol=currency_code.currency_symbol,
            currency_code_abbreviation=currency_code.currency_code_abbreviation,
            desired_price=rate,
            total_price=0,
        )
        attachments = contract_item["attachments"]

        custom_sections = contract_item["custom_sections"]
        custom_sections = (
            custom_services.validate_and_autofill_custom_sections_from_template(
                custom_sections=custom_sections,
                template_section_map=template_section_map,
                template_section_item_map=template_section_item_map,
            )
        )
        contract_item = contract_item_service._save_contract_item(
            contract_id=contract_id,
            enterprise_item_id=enterprise_item_id,
            currency_id=currency_code_id,
            measurement_unit_id=measurement_unit_id,
            rate=rate,
            pricing_information=pricing_information,
            quantity=quantity,
            buyer_skus=[],
            prepayment_percentage=prepayment_percentage,
            payment_type=payment_type,
            payment_terms=payment_terms,
            deliverables_payment_terms=deliverables_payment_terms,
            incoterm_id=incoterm_id,
            procurement_information=procurement_information,
        )
        contract_item_id = contract_item.contract_item_id
        contract_items_to_create.append(contract_item)

        _attributes_to_create, _attribute_values_to_create, _ = (
            attribute_service.handle_attributes(
                enterprise_id=enterprise_id,
                module=AttributeLinkageModule.CONTRACT_ITEM.value,
                attributes=contract_item_attributes,
                contract_item_id=contract_item.contract_item_id,
                is_create=True,
            )
        )
        attributes_to_create.extend(_attributes_to_create)
        attribute_values_to_create.extend(_attribute_values_to_create)
        _attributes_to_create, _attribute_values_to_create = (
            attribute_service.clone_module_attributes(
                enterprise_id=enterprise_id,
                from_module=AttributeLinkageModule.ITEM.value,
                to_module=AttributeLinkageModule.CONTRACT_ITEM.value,
                old_enterprise_item_id=enterprise_item_id,
                new_contract_item_id=contract_item.contract_item_id,
            )
        )
        attributes_to_create.extend(_attributes_to_create)
        attribute_values_to_create.extend(_attribute_values_to_create)

        # _additional_costs_to_create, _ = (
        #     additional_cost_service.handle_additional_costs(
        #         type=AdditionalCostType.ADDITIONAL_COST.value,
        #         user_id=user_id,
        #         enterprise_id=enterprise_id,
        #         module=AdditionalCostLinkageModule.CONTRACT_ITEM.value,
        #         additional_costs=contract_item_additional_costs,
        #         contract_item_id=contract_item_id,
        #         is_create=True,
        #     )
        # )
        # _taxes_to_create, _ = additional_cost_service.handle_additional_costs(
        #     type=AdditionalCostType.TAX.value,
        #     user_id=user_id,
        #     enterprise_id=enterprise_id,
        #     module=AdditionalCostLinkageModule.CONTRACT_ITEM.value,
        #     additional_costs=contract_item_taxes,
        #     contract_item_id=contract_item_id,
        #     is_create=True,
        # )
        # _discounts_to_create, _ = additional_cost_service.handle_additional_costs(
        #     type=AdditionalCostType.DISCOUNT.value,
        #     user_id=user_id,
        #     enterprise_id=enterprise_id,
        #     module=AdditionalCostLinkageModule.CONTRACT_ITEM.value,
        #     additional_costs=contract_item_discounts,
        #     contract_item_id=contract_item_id,
        #     is_create=True,
        # )
        # additional_costs_to_create.extend(_additional_costs_to_create)
        # taxes_to_create.extend(_taxes_to_create)
        # discounts_to_create.extend(_discounts_to_create)

        create_pricing_tiers_result = pricing_tier_service.create_pricing_tiers(
            enterprise_id=enterprise_id,
            contract_item_id=contract_item_id,
            pricing_tiers=pricing_tiers,
        )
        _pricing_tiers_to_create = create_pricing_tiers_result[
            "pricing_tiers_to_create"
        ]
        _additional_costs_to_create = create_pricing_tiers_result[
            "additional_costs_to_create"
        ]
        _taxes_to_create = create_pricing_tiers_result["taxes_to_create"]
        _discounts_to_create = create_pricing_tiers_result["discounts_to_create"]
        pricing_tiers_to_create.extend(_pricing_tiers_to_create)

        additional_costs_to_create.extend(_additional_costs_to_create)
        taxes_to_create.extend(_taxes_to_create)
        discounts_to_create.extend(_discounts_to_create)

        (
            _,
            _,
            _custom_fields_to_create,
            custom_fields_attachments_to_create_map,
            _,
        ) = custom_service.create_custom_sections(
            user_id=user_id,
            custom_sections=custom_sections,
            enterprise_id=enterprise_id,
            # entity_id=buyer_entity.entity_id,
            contract_id=contract_id,
            contract_item_id=contract_item_id,
            custom_section_map=custom_section_map,
        )
        custom_fields_to_create.extend(_custom_fields_to_create)
    ContractItem.objects.bulk_create(contract_items_to_create)
    AttributeLinkage.objects.bulk_create(attributes_to_create)
    AttributeValueLinkage.objects.bulk_create(attribute_values_to_create)
    PricingTier.objects.bulk_create(pricing_tiers_to_create)
    AdditionalCostLinkage.objects.bulk_create(additional_costs_to_create)
    AdditionalCostLinkage.objects.bulk_create(taxes_to_create)
    AdditionalCostLinkage.objects.bulk_create(discounts_to_create)
    CustomField.objects.bulk_create(custom_fields_to_create)

    # Explicitly trigger pricing repo sync for OpenAPI-created contracts
    # (Django signal skips on created=True, and bulk_create doesn't fire signals)
    print(f"[OPENAPI-CONTRACT] >>> ABOUT TO CALL _queue_contract_pricing_sync contract={contract_id} enterprise={enterprise_id}", flush=True)
    _queue_contract_pricing_sync(contract_id, enterprise_id)
    print(f"[OPENAPI-CONTRACT] >>> _queue_contract_pricing_sync DONE, returning {contract.custom_contract_id}", flush=True)

    return contract.custom_contract_id


@transaction.atomic
def update_contract(
    *,
    enterprise_id,
    modified_by_user_email,
    contract_name,
    factwise_contract_id,
    ERP_contract_id,
    contract_start_date,
    contract_end_date,
    status,
    buyer_identifications,
    buyer_address,
    buyer_contact,
    factwise_vendor_code,
    ERP_vendor_code,
    vendor_identifications,
    vendor_address,
    vendor_contact,
    project,
    additional_costs,
    taxes,
    discounts,
    prepayment_percentage,
    payment_type,
    payment_terms,
    deliverables_payment_terms,
    incoterm,
    lead_time,
    lead_time_period,
    custom_sections,
    attachments,
    terms_and_conditions,
    contract_items,
):
    user = enterprise_user_service.get_user_by_enterprise_email(
        enterprise_id=enterprise_id, email=modified_by_user_email
    )
    if not user:
        raise ValidationException("User email does not exist in the enterprise")
    user_id = user.user_id
    if factwise_contract_id:
        try:
            contract = contract_service.get_enterprise_contract_via_custom_id(
                enterprise_id=enterprise_id, custom_id=factwise_contract_id
            )
        except EnterpriseItem.DoesNotExist:
            raise ValidationException(
                "Contract with Factwise contract id does not exist"
            )
    else:
        try:
            contract = contract_service.get_enterprise_contract_via_ERP_contract_id(
                enterprise_id=enterprise_id, ERP_contract_id=ERP_contract_id
            )
        except EnterpriseItem.DoesNotExist:
            raise ValidationException("Contract with ERP contract id does not exist")
    contract_transition = (contract.status, status)
    status_workflow = get_and_validate_contract_update_transition(contract_transition)

    buyer_entity_id = contract.buyer_entity_id
    buyer_identifications = (
        _get_buyer_identiifications_from_entity_and_identification_names(
            buyer_entity_id=buyer_entity_id,
            identification_name_list=buyer_identifications,
        )
    )
    buyer_address_information = _get_buyer_address_information_from_entity_and_nickname(
        buyer_entity_id=buyer_entity_id, buyer_address=buyer_address
    )

    buyer_contact_information = _get_buyer_contact_information_from_email(
        enterprise_id=enterprise_id, email=buyer_contact
    )
    entity_vm = _get_entity_vm_from_code(
        buyer_entity_id=buyer_entity_id,
        factwise_vendor_code=factwise_vendor_code,
        ERP_vendor_code=ERP_vendor_code,
    )
    enterprise_vm = entity_vm.enterprise_vendor_master
    if contract.status == ContractState.CONTRACT_SUBMITTED.value:
        seller_entity_id = contract.seller_entity_id
        seller_enterprise_id = contract.seller_enterprise_id
    else:
        seller_entity_id = enterprise_vm.seller_entity_id
        seller_enterprise_id = enterprise_vm.seller_enterprise_id

    vendor_contact_information = (
        _get_vendor_contact_information_from_buyer_and_seller_entity_and_email(
            buyer_entity_id=buyer_entity_id,
            seller_entity_id=seller_entity_id,
            vendor_contact=vendor_contact,
        )
    )

    vendor_address_information = (
        _get_vendor_address_information_from_seller_entity_and_nickname(
            seller_entity_id=seller_entity_id, vendor_address=vendor_address
        )
    )

    terms_and_conditions = _get_terms_and_conditions(
        enterprise_id=enterprise_id, terms_and_conditions=terms_and_conditions
    )

    project_information = _get_project_information_from_project_code(
        buyer_entity_id=buyer_entity_id, project_code=project
    )
    incoterm_id = backbone_service.get_incoterm_via_name(incoterm=incoterm).entry_id
    template_id = contract.additional_details["template_id"]

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
    custom_sections = (
        custom_services.validate_and_autofill_custom_sections_from_template(
            custom_sections=custom_sections,
            template_section_map=template_section_map,
            template_section_item_map=template_section_item_map,
        )
    )

    (
        attribute_names,
        overall_cost_names,
        item_cost_names,
        contract_additional_costs,
        contract_taxes,
        contract_discounts,
        currency_code_ids,
        incoterm_names,
    ) = ([], [], [], [], [], [], [], [])
    (
        attributes_map,
        overall_costs_map,
        item_costs_map,
        currency_code_map,
        incoterm_map,
    ) = ({}, {}, {}, {}, {})

    for cost in additional_costs:
        overall_cost_names.append(cost["name"])
    for cost in taxes:
        overall_cost_names.append(cost["name"])
    for cost in discounts:
        overall_cost_names.append(cost["name"])

    existing_overall_additional_costs = (
        additional_cost_service.get_additional_costs_from_names(
            enterprise_id=enterprise_id, additional_cost_names=overall_cost_names
        ).filter(field_level=ModuleTemplateSectionItemLevel.OTHER.value)
    )
    for additional_cost in existing_overall_additional_costs:
        overall_costs_map[additional_cost.cost_name] = additional_cost

    for cost in additional_costs:
        additional_cost = overall_costs_map[cost["name"]]
        contract_additional_costs.append(
            AdditionalCostDataClass(
                additional_cost_id=additional_cost.additional_cost_id,
                cost_name=cost["name"],
                cost_type=additional_cost.cost_type,
                allocation_type=additional_cost.allocation_type,
                cost_value=cost["value"],
            )
        )
    for cost in taxes:
        additional_cost = overall_costs_map[cost["name"]]
        contract_taxes.append(
            AdditionalCostDataClass(
                additional_cost_id=additional_cost.additional_cost_id,
                cost_name=cost["name"],
                cost_type=additional_cost.cost_type,
                allocation_type=additional_cost.allocation_type,
                cost_value=cost["value"],
            )
        )
    for cost in discounts:
        cost_name = cost["name"]
        if cost_name != "Overall discount":
            additional_cost = overall_costs_map[cost_name]
            contract_discounts.append(
                AdditionalCostDataClass(
                    additional_cost_id=additional_cost.additional_cost_id,
                    cost_name=cost_name,
                    cost_type=additional_cost.cost_type,
                    allocation_type=additional_cost.allocation_type,
                    cost_value=cost["value"],
                )
            )
        else:
            contract_discounts.append(
                AdditionalCostDataClass(
                    additional_cost_id=None,
                    cost_name=cost_name,
                    cost_type="PERCENTAGE",
                    allocation_type=None,
                    cost_value=cost["value"],
                )
            )

    for contract_item in contract_items:
        currency_code_id = contract_item["currency_code_id"]
        currency_code_ids.append(currency_code_id)

        incoterm = contract_item["incoterm"]
        incoterm_names.append(incoterm)
        attributes = contract_item["attributes"]
        for attribute in attributes:
            attribute_names.append(attribute["attribute_name"])
        # additional_costs = contract_item["additional_costs"]
        # taxes = contract_item["taxes"]
        # discounts = contract_item["discounts"]
        # for cost in additional_costs:
        #     item_cost_names.append(cost["name"])
        # for cost in taxes:
        #     item_cost_names.append(cost["name"])
        # for cost in discounts:
        #     item_cost_names.append(cost["name"])
        for pricing_tier in contract_item["pricing_tiers"]:
            additional_costs = pricing_tier["additional_costs"]
            taxes = pricing_tier["taxes"]
            discounts = pricing_tier["discounts"]
            for cost in additional_costs:
                item_cost_names.append(cost["name"])
            for cost in taxes:
                item_cost_names.append(cost["name"])
            for cost in discounts:
                item_cost_names.append(cost["name"])

    currency_codes = backbone_service.get_currency_list_via_ids(
        currency_code_id_list=currency_code_ids
    )
    for currency in currency_codes:
        currency_code_map[currency.entry_id] = currency

    incoterms = backbone_service.get_incoterm_list(incoterms=incoterm_names)
    for incoterm in incoterms:
        incoterm_map[incoterm.incoterm_abbreviation] = incoterm

    existing_attributes = attribute_service.get_attributes_via_names(
        enterprise_id=enterprise_id, attribute_names=attribute_names
    )
    for attribute in existing_attributes:
        attributes_map[attribute.attribute_name] = attribute

    existing_additional_costs = additional_cost_service.get_additional_costs_from_names(
        enterprise_id=enterprise_id, additional_cost_names=item_cost_names
    )
    for additional_cost in existing_additional_costs:
        item_costs_map[additional_cost.cost_name] = additional_cost

    status_workflow(
        user_id=user_id,
        contract=contract,
        contract_name=contract_name,
        contract_start_date=contract_start_date,
        contract_end_date=contract_end_date,
        status=status,
        buyer_entity_id=buyer_entity_id,
        enterprise_id=enterprise_id,
        seller_entity_id=seller_entity_id,
        seller_enterprise_id=seller_enterprise_id,
        buyer_address_information=buyer_address_information,
        buyer_contact_information=buyer_contact_information,
        buyer_identifications=buyer_identifications,
        vendor_identifications=vendor_identifications,
        vendor_contact_information=vendor_contact_information,
        vendor_address_information=vendor_address_information,
        project_information=project_information,
        additional_costs=contract_additional_costs,
        taxes=contract_taxes,
        discounts=contract_discounts,
        prepayment_percentage=prepayment_percentage,
        payment_type=payment_type,
        payment_terms=payment_terms,
        deliverables_payment_terms=deliverables_payment_terms,
        incoterm_id=incoterm_id,
        lead_time=lead_time,
        lead_time_period=lead_time_period,
        terms_and_conditions=terms_and_conditions,
        custom_sections=custom_sections,
        attachments=attachments,
        contract_items=contract_items,
        template_section_map=template_section_map,
        template_section_item_map=template_section_item_map,
        currency_code_map=currency_code_map,
        incoterm_map=incoterm_map,
        attributes_map=attributes_map,
        item_costs_map=item_costs_map,
    )


@transaction.atomic
def update_contract_status(
    *,
    enterprise_id,
    modified_by_user_email,
    factwise_contract_id,
    ERP_contract_id,
    status,
    notes,
):
    user = enterprise_user_service.get_user_by_enterprise_email(
        enterprise_id=enterprise_id, email=modified_by_user_email
    )
    if not user:
        raise ValidationException("User email does not exist in the enterprise")

    user_id = user.user_id
    if factwise_contract_id:
        try:
            contract = contract_service.get_enterprise_contract_via_custom_id(
                enterprise_id=enterprise_id, custom_id=factwise_contract_id
            )
        except EnterpriseItem.DoesNotExist:
            raise ValidationException(
                "Contract with Factwise contract id does not exist"
            )
    else:
        try:
            contract = contract_service.get_enterprise_contract_via_ERP_contract_id(
                enterprise_id=enterprise_id, ERP_contract_id=ERP_contract_id
            )
        except EnterpriseItem.DoesNotExist:
            raise ValidationException("Contract with ERP contract id does not exist")

    contract_transition = (contract.status, status)
    status_workflow = get_and_validate_contract_status_transition(contract_transition)
    status_workflow(contract=contract, notes=notes)
    contract.modified_by_user_id = user_id
    contract.save()


def _get_buyer_identiifications_from_entity_and_identification_names(
    *, buyer_entity_id, identification_name_list
):
    if identification_name_list:
        buyer_identifications_ids = identification_service.get_identification_list(
            identification_name_list=identification_name_list,
            entity_id=buyer_entity_id,
        ).values_list("identification_id", flat=True)
        if len(buyer_identifications_ids) != len(identification_name_list):
            raise BadRequestException("Invalid identification names")
        buyer_identifications = list(buyer_identifications_ids)
    else:
        buyer_identifications = []
    return buyer_identifications


def _get_buyer_address_information_from_entity_and_nickname(
    *, buyer_entity_id, buyer_address
):
    if buyer_address:
        address = address_service.validate_and_get_address_via_name(
            entity_id=buyer_entity_id,
            address_nickname=buyer_address,
        )
        buyer_address_information = {
            "address_id": address.address_id,
            "full_address": address.full_address,
        }
    else:
        buyer_address_information = None
    return buyer_address_information


def _get_buyer_contact_information_from_email(*, enterprise_id, email):
    buyer_contact = enterprise_user_service.get_user_by_enterprise_email(
        enterprise_id=enterprise_id, email=email
    )
    if not buyer_contact:
        raise BadRequestException("Invalid buyer contact")
    buyer_contact_information = contract_service.construct_buyer_contact_information(
        buyer_contact=buyer_contact
    )
    return buyer_contact_information


def _get_entity_vm_from_code(*, buyer_entity_id, factwise_vendor_code, ERP_vendor_code):
    if factwise_vendor_code:
        try:
            entity_vm = vendor_master_service.get_entity_vendor_master_via_code(
                buyer_entity_id=buyer_entity_id,
                vendor_code=factwise_vendor_code,
            )
        except EntityVendorMaster.DoesNotExist:
            raise ValidationException(
                "Vendor with vendor code does not exist or is not linked to the entity"
            )

    else:
        try:
            entity_vm = (
                vendor_master_service.get_entity_vendor_master_via_ERP_vendor_code(
                    buyer_entity_id=buyer_entity_id, ERP_vendor_code=ERP_vendor_code
                )
            )
        except EntityVendorMaster.DoesNotExist:
            raise ValidationException(
                "Vendor with ERP vendor code does not exist or is not linked to the entity"
            )
    return entity_vm


def _get_vendor_contact_information_from_buyer_and_seller_entity_and_email(
    *, buyer_entity_id, seller_entity_id, vendor_contact
):
    try:
        vendor_contact = (
            vendor_contact_service.get_vendor_contact_for_buyer_entity_via_email(
                buyer_entity_id=buyer_entity_id,
                seller_entity_id=seller_entity_id,
                email=vendor_contact,
            )
        )
        vendor_contact_information = (
            contract_service.construct_vendor_contact_information(
                vendor_contact=vendor_contact
            )
        )
    except VendorContact.DoesNotExist:
        raise ValidationException("Vendor contact does not exist")
    return vendor_contact_information


def _get_vendor_address_information_from_seller_entity_and_nickname(
    *, seller_entity_id, vendor_address
):
    if vendor_address:
        if vendor_address_nickname := vendor_address["address_id"]:
            vendor_address = address_service.validate_and_get_address_via_name(
                entity_id=seller_entity_id,
                address_nickname=vendor_address_nickname,
            )
            vendor_address_information = {
                "address_id": vendor_address.address_id,
                "full_address": vendor_address.full_address,
            }
        else:
            vendor_address_information = {
                "address_id": None,
                "full_address": vendor_address["full_address"],
            }
    else:
        vendor_address_information = None
    return vendor_address_information


def _get_terms_and_conditions(*, enterprise_id, terms_and_conditions):
    if terms_and_conditions:
        name = terms_and_conditions["name"]
        tnc = terms_and_conditions_service.get_terms_and_conditions_via_name(
            name=name, enterprise_id=enterprise_id
        )
        if tnc:
            terms_and_conditions_id = tnc.terms_and_conditions_id
            data = tnc.data
        else:
            terms_and_conditions_id = None
            data = terms_and_conditions["data"]
            if not data:
                raise BadRequestException("Terms and Conditions data is required")

        terms_and_conditions = EventPurchaseOrderTermsAndConditions(
            terms_and_conditions_id=terms_and_conditions_id, name=name, data=data
        )
    return terms_and_conditions


def _get_project_information_from_project_code(
    *,
    buyer_entity_id,
    project_code,
):
    if project_code:
        project = project_service.get_entity_project_via_code(
            entity_id=buyer_entity_id,
            project_code=project_code,
        )
        project_information = ContractProjectInformation(
            project_id=project.project_id,
            project_code=project.project_code,
            project_name=project.project_name,
        )
    else:
        project_information = None
    return project_information


def _format_costs(*, additional_costs, taxes, discounts, costs_map):
    additional_costs_dataclass, taxes_dataclass, discounts_dataclass = (
        [],
        [],
        [],
    )
    for cost in additional_costs:
        additional_cost = costs_map[cost["name"]]
        additional_costs_dataclass.append(
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
        taxes_dataclass.append(
            AdditionalCostDataClass(
                additional_cost_id=additional_cost.additional_cost_id,
                cost_name=cost["name"],
                cost_type=additional_cost.cost_type,
                allocation_type=additional_cost.allocation_type,
                cost_value=cost["value"],
            )
        )
    for cost in discounts:
        cost_name = cost["name"]
        if cost_name != "Discount":
            additional_cost = costs_map[cost_name]
            discounts_dataclass.append(
                AdditionalCostDataClass(
                    additional_cost_id=additional_cost.additional_cost_id,
                    cost_name=cost_name,
                    cost_type=additional_cost.cost_type,
                    allocation_type=additional_cost.allocation_type,
                    cost_value=cost["value"],
                )
            )
        else:
            discounts_dataclass.append(
                AdditionalCostDataClass(
                    additional_cost_id=None,
                    cost_name=cost_name,
                    cost_type="PERCENTAGE",
                    allocation_type=None,
                    cost_value=cost["value"],
                )
            )
    return {
        "additional_costs": additional_costs_dataclass,
        "taxes": taxes_dataclass,
        "discounts": discounts_dataclass,
    }


def _process_contract_items(
    user_id,
    enterprise_id,
    contract: Contract,
    contract_id,
    contract_items,
    template_section_map,
    template_section_item_map,
    attributes_map,
    item_costs_map,
    currency_code_map,
    incoterm_map,
    custom_section_map=None,
    is_create=True,
    contract_items_map=None,
):
    (
        contract_items_to_create,
        contract_items_to_update,
        pricing_tiers_to_create,
        pricing_tiers_to_update,
        custom_fields_to_create,
        custom_fields_to_update,
        additional_costs_to_create,
        additional_costs_to_update,
        taxes_to_create,
        taxes_to_update,
        discounts_to_create,
        discounts_to_update,
        attributes_to_create,
        attributes_to_update,
        attribute_values_to_create,
        attribute_values_to_update,
    ) = ([], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [])

    for contract_item in contract_items:
        (
            contract_item_attributes,
            contract_item_additional_costs,
            contract_item_taxes,
            contract_item_discounts,
        ) = ([], [], [], [])
        ERP_item_code = contract_item["ERP_item_code"]
        factwise_item_code = contract_item["factwise_item_code"]

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

        enterprise_item_id = enterprise_item.enterprise_item_id
        currency_code_id = contract_item["currency_code_id"]
        currency_code = currency_code_map[currency_code_id]

        measurement_unit_id = contract_item["measurement_unit_id"]
        attributes = contract_item["attributes"]
        for attribute in attributes:
            contract_item_attribute = attributes_map[attribute["attribute_name"]]
            contract_item_attributes.append(
                AttributeLinkageInputStruct(
                    attribute_name=contract_item_attribute.attribute_name,
                    attribute_type=contract_item_attribute.attribute_type,
                    attribute_id=contract_item_attribute.attribute_id,
                    attribute_values=[
                        AttributeValueLinkageInputStruct(value=attribute_value["value"])
                        for attribute_value in attribute["attribute_value"]
                    ],
                )
            )
        # quantity = contract_item["quantity"]
        prepayment_percentage = contract_item["prepayment_percentage"]
        payment_type = contract_item["payment_type"]
        payment_terms = contract_item["payment_terms"]
        incoterm = contract_item["incoterm"]
        incoterm_id = incoterm_map[incoterm].entry_id
        deliverables_payment_terms = contract_item["deliverables_payment_terms"]

        lead_time = contract_item["lead_time"]
        lead_time_period = contract_item["lead_time_period"]
        procurement_information = (
            contract_item_service._construct_procurement_information(
                lead_time=lead_time, lead_time_period=lead_time_period
            )
        )

        rate = None
        # item_additional_costs = []
        # item_taxes = []
        # item_discounts = []

        # rate = contract_item["rate"]
        # item_additional_costs = contract_item["additional_costs"]
        # item_taxes = contract_item["taxes"]
        # item_discounts = contract_item["discounts"]
        # format_costs_result = _format_costs(
        #     additional_costs=item_additional_costs,
        #     taxes=item_taxes,
        #     discounts=item_discounts,
        #     costs_map=item_costs_map,
        # )
        # contract_item_additional_costs = format_costs_result["additional_costs"]
        # contract_item_taxes = format_costs_result["taxes"]
        # contract_item_discounts = format_costs_result["discounts"]

        # total = additional_cost_service._get_item_total(
        #     base_quantity=quantity,
        #     base_rate=rate,
        #     additional_costs=[
        #         asdict(additional_cost)
        #         for additional_cost in contract_item_additional_costs
        #     ],
        #     taxes=[
        #         asdict(additional_cost) for additional_cost in contract_item_taxes
        #     ],
        #     discounts=[
        #         asdict(additional_cost)
        #         for additional_cost in contract_item_discounts
        #     ],
        # )
        pricing_tiers = contract_item["pricing_tiers"]
        item_quantity = 0
        for pricing_tier in pricing_tiers:
            tier_rate = pricing_tier["rate"]
            min_quantity = pricing_tier["min_quantity"]
            max_quantity = pricing_tier["max_quantity"]
            additional_costs = pricing_tier["additional_costs"]
            taxes = pricing_tier["taxes"]
            discounts = pricing_tier["discounts"]
            format_costs_result = _format_costs(
                additional_costs=additional_costs,
                taxes=taxes,
                discounts=discounts,
                costs_map=item_costs_map,
            )
            additional_costs = format_costs_result["additional_costs"]
            taxes = format_costs_result["taxes"]
            discounts = format_costs_result["discounts"]
            pricing_tier["additional_costs"] = additional_costs
            pricing_tier["taxes"] = taxes
            pricing_tier["discounts"] = discounts

            effective_rate = additional_cost_service._get_item_effective_rate(
                base_quantity=max_quantity - min_quantity,
                base_rate=tier_rate,
                additional_costs=[
                    asdict(additional_cost) for additional_cost in additional_costs
                ],
                taxes=[asdict(additional_cost) for additional_cost in taxes],
                discounts=[asdict(additional_cost) for additional_cost in discounts],
            )
            pricing_tier["effective_rate"] = effective_rate

            if item_quantity < max_quantity:
                item_quantity = max_quantity
        quantity = item_quantity

        pricing_information = ContractItemPricingInformation(
            currency_code_id=currency_code.entry_id,
            currency_name=currency_code.currency_name,
            currency_symbol=currency_code.currency_symbol,
            currency_code_abbreviation=currency_code.currency_code_abbreviation,
            desired_price=rate,
            total_price=0,
        )
        attachments = contract_item["attachments"]

        custom_sections = contract_item["custom_sections"]
        custom_sections = (
            custom_services.validate_and_autofill_custom_sections_from_template(
                custom_sections=custom_sections,
                template_section_map=template_section_map,
                template_section_item_map=template_section_item_map,
            )
        )

        if is_create:
            contract_item = contract_item_service._save_contract_item(
                contract_id=contract_id,
                enterprise_item_id=enterprise_item_id,
                currency_id=currency_code_id,
                measurement_unit_id=measurement_unit_id,
                rate=rate,
                pricing_information=pricing_information,
                quantity=quantity,
                buyer_skus=[],
                prepayment_percentage=prepayment_percentage,
                payment_type=payment_type,
                payment_terms=payment_terms,
                deliverables_payment_terms=deliverables_payment_terms,
                incoterm_id=incoterm_id,
                procurement_information=procurement_information,
            )
            contract_item_id = contract_item.contract_item_id
            contract_items_to_create.append(contract_item)

            _attributes_to_create, _attribute_values_to_create, _ = (
                attribute_service.handle_attributes(
                    enterprise_id=enterprise_id,
                    module=AttributeLinkageModule.CONTRACT_ITEM.value,
                    attributes=contract_item_attributes,
                    contract_item_id=contract_item.contract_item_id,
                    is_create=True,
                )
            )
            attributes_to_create.extend(_attributes_to_create)
            attribute_values_to_create.extend(_attribute_values_to_create)

            # _additional_costs_to_create, _ = (
            #     additional_cost_service.handle_additional_costs(
            #         type=AdditionalCostType.ADDITIONAL_COST.value,
            #         user_id=user_id,
            #         enterprise_id=enterprise_id,
            #         module=AdditionalCostLinkageModule.CONTRACT_ITEM.value,
            #         additional_costs=contract_item_additional_costs,
            #         contract_item_id=contract_item_id,
            #     )
            # )
            # additional_costs_to_create.extend(_additional_costs_to_create)
            # _taxes_to_create, _ = additional_cost_service.handle_additional_costs(
            #     type=AdditionalCostType.TAX.value,
            #     user_id=user_id,
            #     enterprise_id=enterprise_id,
            #     module=AdditionalCostLinkageModule.CONTRACT_ITEM.value,
            #     additional_costs=contract_item_taxes,
            #     contract_item_id=contract_item_id,
            # )
            # taxes_to_create.extend(_taxes_to_create)
            # _discounts_to_create, _ = (
            #     additional_cost_service.handle_additional_costs(
            #         type=AdditionalCostType.DISCOUNT.value,
            #         user_id=user_id,
            #         enterprise_id=enterprise_id,
            #         module=AdditionalCostLinkageModule.CONTRACT_ITEM.value,
            #         additional_costs=contract_item_discounts,
            #         contract_item_id=contract_item_id,
            #     )
            # )
            # discounts_to_create.extend(_discounts_to_create)
            create_pricing_tiers_result = pricing_tier_service.create_pricing_tiers(
                enterprise_id=enterprise_id,
                contract_item_id=contract_item_id,
                pricing_tiers=pricing_tiers,
            )
            _pricing_tiers_to_create = create_pricing_tiers_result[
                "pricing_tiers_to_create"
            ]
            pricing_tiers_to_create.extend(_pricing_tiers_to_create)
            _additional_costs_to_create = create_pricing_tiers_result[
                "additional_costs_to_create"
            ]
            additional_costs_to_create.extend(_additional_costs_to_create)
            _taxes_to_create = create_pricing_tiers_result["taxes_to_create"]
            taxes_to_create.extend(_taxes_to_create)
            _discounts_to_create = create_pricing_tiers_result["discounts_to_create"]
            discounts_to_create.extend(_discounts_to_create)

            (
                _,
                _,
                _custom_fields_to_create,
                custom_fields_attachments_to_create_map,
                _,
            ) = custom_service.create_custom_sections(
                user_id=user_id,
                custom_sections=custom_sections,
                enterprise_id=enterprise_id,
                contract_id=contract_id,
                contract_item_id=contract_item_id,
                custom_section_map=custom_section_map,
            )
            custom_fields_to_create.extend(_custom_fields_to_create)
        else:
            if enterprise_item_id in contract_items_map:
                existing_item = contract_items_map[enterprise_item_id]
                # ṬODO: Add item if not present
                contract_item = existing_item
                contract_item_id = existing_item.contract_item_id
                custom_service.add_section_id_via_name(
                    enterprise_id=enterprise_id,
                    section_type=ModuleTemplateSectionType.ITEM.value,
                    custom_sections=custom_sections,
                    contract_id=contract_id,
                )
                contract_item_service._update_contact_item(
                    contract_item=contract_item,
                    measurement_unit_id=measurement_unit_id,
                    rate=rate,
                    pricing_information=pricing_information,
                    quantity=quantity,
                    currency_id=currency_code_id,
                    prepayment_percentage=prepayment_percentage,
                    payment_type=payment_type,
                    payment_terms=payment_terms,
                    deliverables_payment_terms=deliverables_payment_terms,
                    incoterm_id=incoterm_id,
                    procurement_information=procurement_information,
                    buyer_skus=[],
                )
                contract_items_to_update.append(contract_item)
                # _additional_costs_to_create, _additional_costs_to_update = (
                #     additional_cost_service.handle_additional_costs(
                #         type=AdditionalCostType.ADDITIONAL_COST.value,
                #         user_id=user_id,
                #         enterprise_id=enterprise_id,
                #         module=AdditionalCostLinkageModule.CONTRACT_ITEM.value,
                #         additional_costs=contract_item_additional_costs,
                #         contract_item_id=contract_item_id,
                #     )
                # )
                # additional_costs_to_create.extend(_additional_costs_to_create)
                # additional_costs_to_update.extend(_additional_costs_to_update)
                # _taxes_to_create, _taxes_to_update = (
                #     additional_cost_service.handle_additional_costs(
                #         type=AdditionalCostType.TAX.value,
                #         user_id=user_id,
                #         enterprise_id=enterprise_id,
                #         module=AdditionalCostLinkageModule.CONTRACT_ITEM.value,
                #         additional_costs=contract_item_taxes,
                #         contract_item_id=contract_item_id,
                #     )
                # )
                # taxes_to_create.extend(_taxes_to_create)
                # taxes_to_update.extend(_taxes_to_update)
                # _discounts_to_create, _discounts_to_update = (
                #     additional_cost_service.handle_additional_costs(
                #         type=AdditionalCostType.DISCOUNT.value,
                #         user_id=user_id,
                #         enterprise_id=enterprise_id,
                #         module=AdditionalCostLinkageModule.CONTRACT_ITEM.value,
                #         additional_costs=contract_item_discounts,
                #         contract_item_id=contract_item_id,
                #     )
                # )
                # discounts_to_create.extend(_discounts_to_create)
                # discounts_to_update.extend(_discounts_to_update)
                update_pricing_tiers_result = pricing_tier_service.update_pricing_tiers(
                    enterprise_id=enterprise_id,
                    contract_item_id=contract_item_id,
                    pricing_tiers=pricing_tiers,
                )
                _pricing_tiers_to_create = update_pricing_tiers_result[
                    "pricing_tiers_to_create"
                ]
                pricing_tiers_to_create.extend(_pricing_tiers_to_create)
                _pricing_tiers_to_update = update_pricing_tiers_result[
                    "pricing_tiers_to_update"
                ]
                pricing_tiers_to_update.extend(_pricing_tiers_to_update)
                _additional_costs_to_create = update_pricing_tiers_result[
                    "additional_costs_to_create"
                ]
                _additional_costs_to_update = update_pricing_tiers_result[
                    "additional_costs_to_update"
                ]
                additional_costs_to_create.extend(_additional_costs_to_create)
                additional_costs_to_update.extend(_additional_costs_to_update)
                _taxes_to_create = update_pricing_tiers_result["taxes_to_create"]
                _taxes_to_update = update_pricing_tiers_result["taxes_to_update"]
                taxes_to_create.extend(_taxes_to_create)
                taxes_to_update.extend(_taxes_to_update)
                _discounts_to_create = update_pricing_tiers_result[
                    "discounts_to_create"
                ]
                _discounts_to_update = update_pricing_tiers_result[
                    "discounts_to_update"
                ]
                discounts_to_create.extend(_discounts_to_create)
                discounts_to_update.extend(_discounts_to_update)

                (
                    _attributes_to_create,
                    _attribute_values_to_create,
                    _attribute_values_to_update,
                ) = attribute_service.handle_attributes(
                    enterprise_id=enterprise_id,
                    module=AttributeLinkageModule.CONTRACT_ITEM.value,
                    attributes=attributes,
                    contract_item_id=contract_item_id,
                )
                attributes_to_create.extend(_attributes_to_create)
                attribute_values_to_create.extend(_attribute_values_to_create)
                attribute_values_to_update.extend(_attribute_values_to_update)

                _custom_fields_to_update = custom_service.update_custom_sections(
                    custom_sections=custom_sections,
                    enterprise_id=enterprise_id,
                    contract_id=contract_id,
                    contract_item_id=contract_item_id,
                )["custom_fields_to_update"]
                custom_fields_to_update.extend(_custom_fields_to_update)

            else:
                contract_item = contract_item_service._save_contract_item(
                    contract_id=contract_id,
                    enterprise_item_id=enterprise_item_id,
                    currency_id=currency_code_id,
                    measurement_unit_id=measurement_unit_id,
                    rate=rate,
                    pricing_information=pricing_information,
                    quantity=quantity,
                    buyer_skus=[],
                    prepayment_percentage=prepayment_percentage,
                    payment_type=payment_type,
                    payment_terms=payment_terms,
                    deliverables_payment_terms=deliverables_payment_terms,
                    incoterm_id=incoterm_id,
                    procurement_information=procurement_information,
                )
                contract_item_id = contract_item.contract_item_id
                contract_items_to_create.append(contract_item)

                _attributes_to_create, _attribute_values_to_create, _ = (
                    attribute_service.handle_attributes(
                        enterprise_id=enterprise_id,
                        module=AttributeLinkageModule.CONTRACT_ITEM.value,
                        attributes=contract_item_attributes,
                        contract_item_id=contract_item.contract_item_id,
                        is_create=True,
                    )
                )
                attributes_to_create.extend(_attributes_to_create)
                attribute_values_to_create.extend(_attribute_values_to_create)

                _additional_costs_to_create, _ = (
                    additional_cost_service.handle_additional_costs(
                        type=AdditionalCostType.ADDITIONAL_COST.value,
                        user_id=user_id,
                        enterprise_id=enterprise_id,
                        module=AdditionalCostLinkageModule.CONTRACT_ITEM.value,
                        additional_costs=contract_item_additional_costs,
                        contract_item_id=contract_item_id,
                    )
                )
                additional_costs_to_create.extend(_additional_costs_to_create)
                _taxes_to_create, _ = additional_cost_service.handle_additional_costs(
                    type=AdditionalCostType.TAX.value,
                    user_id=user_id,
                    enterprise_id=enterprise_id,
                    module=AdditionalCostLinkageModule.CONTRACT_ITEM.value,
                    additional_costs=contract_item_taxes,
                    contract_item_id=contract_item_id,
                )
                taxes_to_create.extend(_taxes_to_create)
                _discounts_to_create, _ = (
                    additional_cost_service.handle_additional_costs(
                        type=AdditionalCostType.DISCOUNT.value,
                        user_id=user_id,
                        enterprise_id=enterprise_id,
                        module=AdditionalCostLinkageModule.CONTRACT_ITEM.value,
                        additional_costs=contract_item_discounts,
                        contract_item_id=contract_item_id,
                    )
                )
                discounts_to_create.extend(_discounts_to_create)

                create_pricing_tiers_result = pricing_tier_service.create_pricing_tiers(
                    enterprise_id=enterprise_id,
                    contract_item_id=contract_item_id,
                    pricing_tiers=pricing_tiers,
                )
                _pricing_tiers_to_create = create_pricing_tiers_result[
                    "pricing_tiers_to_create"
                ]
                pricing_tiers_to_create.extend(_pricing_tiers_to_create)
                _additional_costs_to_create = create_pricing_tiers_result[
                    "additional_costs_to_create"
                ]
                additional_costs_to_create.extend(_additional_costs_to_create)
                _taxes_to_create = create_pricing_tiers_result["taxes_to_create"]
                taxes_to_create.extend(_taxes_to_create)
                _discounts_to_create = create_pricing_tiers_result["discounts_to_create"]
                discounts_to_create.extend(_discounts_to_create)

                (
                    _,
                    _,
                    _custom_fields_to_create,
                    custom_fields_attachments_to_create_map,
                    _,
                ) = custom_service.create_custom_sections(
                    user_id=user_id,
                    custom_sections=custom_sections,
                    enterprise_id=enterprise_id,
                    contract_id=contract_id,
                    contract_item_id=contract_item_id,
                    custom_section_map=custom_section_map,
                )
                custom_fields_to_create.extend(_custom_fields_to_create)

    ContractItem.objects.bulk_create(contract_items_to_create)
    PricingTier.objects.bulk_create(pricing_tiers_to_create)
    PricingTier.objects.bulk_update(
        pricing_tiers_to_update,
        fields=[
            "rate",
            "effective_rate",
            "min_quantity",
            "max_quantity",
            # "total"
        ],
    )
    AdditionalCostLinkage.objects.bulk_create(additional_costs_to_create)
    AdditionalCostLinkage.objects.bulk_create(taxes_to_create)
    AdditionalCostLinkage.objects.bulk_create(discounts_to_create)
    AttributeLinkage.objects.bulk_create(attributes_to_create)
    AttributeValueLinkage.objects.bulk_create(attribute_values_to_create)
    CustomField.objects.bulk_create(custom_fields_to_create)

    if not is_create and contract_items_to_update:
        ContractItem.objects.bulk_update(
            contract_items_to_update,
            fields=[
                "measurement_unit_id",
                "rate",
                "pricing_information",
                "quantity",
                "currency_id",
                "prepayment_percentage",
                "payment_type",
                "payment_terms",
                "deliverables_payment_terms",
                "incoterm_id",
                "procurement_information",
            ],
        )
        AdditionalCostLinkage.objects.bulk_update(
            additional_costs_to_update, fields=["cost_value"]
        )
        AdditionalCostLinkage.objects.bulk_update(
            taxes_to_update, fields=["cost_value"]
        )
        AdditionalCostLinkage.objects.bulk_update(
            discounts_to_update, fields=["cost_value"]
        )
        AttributeValueLinkage.objects.bulk_update(
            attribute_values_to_update,
            fields=["value", "measurement_unit_id", "currency_id"],
        )
        CustomField.objects.bulk_update(
            custom_fields_to_update,
            [
                "name",
                "type",
                "text_value",
                "boolean_value",
                "percentage_value",
                "integer_value",
                "decimal_value",
                "date_value",
                "datetime_value",
                "multi_choice_value",
                "link_value",
                "email_value",
                "attachment_value",
                "currency_id",
                "modified_datetime",
                "modified_by_user_id",
            ],
        )


def _update_contract(
    *,
    user_id,
    contract: Contract,
    contract_name,
    contract_start_date,
    contract_end_date,
    status,
    enterprise_id,
    seller_entity_id,
    seller_enterprise_id,
    buyer_address_information,
    buyer_contact_information,
    buyer_identifications,
    vendor_identifications,
    vendor_contact_information,
    vendor_address_information,
    project_information,
    additional_costs,
    taxes,
    discounts,
    prepayment_percentage,
    payment_type,
    payment_terms,
    deliverables_payment_terms,
    incoterm_id,
    lead_time,
    lead_time_period,
    custom_sections,
    terms_and_conditions,
    attachments,
    contract_items,
    template_section_map,
    template_section_item_map,
    attributes_map,
    item_costs_map,
    currency_code_map,
    incoterm_map,
    **kwargs,
):
    contract_service._update_contract(
        contract=contract,
        contract_name=contract_name,
        contract_start_date=contract_start_date,
        contract_end_date=contract_end_date,
        buyer_identifications=buyer_identifications,
        buyer_address_information=buyer_address_information,
        buyer_contact_information=buyer_contact_information,
        project_information=project_information,
        prepayment_percentage=prepayment_percentage,
        payment_type=payment_type,
        payment_terms=payment_terms,
        deliverables_payment_terms=deliverables_payment_terms,
        incoterm_id=incoterm_id,
        lead_time=lead_time,
        lead_time_period=lead_time_period,
        terms_and_conditions=terms_and_conditions,
        seller_entity_id=seller_entity_id,
        seller_enterprise_id=seller_enterprise_id,
        vendor_identifications=vendor_identifications,
        vendor_address_information=vendor_address_information,
        vendor_contact_information=vendor_contact_information,
    )
    contract.status = status
    contract.modified_by_user_id = user_id
    contract.save()
    contract_id = contract.contract_id

    additional_costs_to_create, additional_costs_to_update = (
        additional_cost_service.handle_additional_costs(
            type=AdditionalCostType.ADDITIONAL_COST.value,
            user_id=user_id,
            enterprise_id=enterprise_id,
            module=AdditionalCostLinkageModule.CONTRACT.value,
            additional_costs=additional_costs,
            contract_id=contract_id,
        )
    )
    taxes_to_create, taxes_to_update = additional_cost_service.handle_additional_costs(
        type=AdditionalCostType.TAX.value,
        user_id=user_id,
        enterprise_id=enterprise_id,
        module=AdditionalCostLinkageModule.CONTRACT.value,
        additional_costs=taxes,
        contract_id=contract_id,
    )
    discounts_to_create, discounts_to_update = (
        additional_cost_service.handle_additional_costs(
            type=AdditionalCostType.DISCOUNT.value,
            user_id=user_id,
            enterprise_id=enterprise_id,
            module=AdditionalCostLinkageModule.CONTRACT.value,
            additional_costs=discounts,
            contract_id=contract_id,
        )
    )

    AdditionalCostLinkage.objects.bulk_create(additional_costs_to_create)
    AdditionalCostLinkage.objects.bulk_create(taxes_to_create)
    AdditionalCostLinkage.objects.bulk_create(discounts_to_create)
    AdditionalCostLinkage.objects.bulk_update(
        additional_costs_to_update, fields=["cost_value"]
    )
    AdditionalCostLinkage.objects.bulk_update(taxes_to_update, fields=["cost_value"])
    AdditionalCostLinkage.objects.bulk_update(
        discounts_to_update, fields=["cost_value"]
    )

    custom_service.add_section_id_via_name(
        enterprise_id=enterprise_id,
        # I've put none so that ids custom sections of both overall and item level get added
        section_type=None,
        custom_sections=custom_sections,
        contract_id=contract_id,
    )
    custom_section_map = custom_service.get_module_custom_sections_map(
        enterprise_id=enterprise_id,
        contract_id=contract_id,
        module_map=False,
        name_map=True,
    )
    custom_fields_to_update = custom_service.update_custom_sections(
        custom_sections=custom_sections,
        enterprise_id=enterprise_id,
        contract_id=contract_id,
    )["custom_fields_to_update"]
    CustomField.objects.bulk_update(
        custom_fields_to_update,
        [
            "name",
            "type",
            "text_value",
            "boolean_value",
            "percentage_value",
            "integer_value",
            "decimal_value",
            "date_value",
            "datetime_value",
            "multi_choice_value",
            "link_value",
            "email_value",
            "attachment_value",
            "currency_id",
            "modified_datetime",
            "modified_by_user_id",
        ],
    )
    existing_contract_items = contract_item_service.get_contract_items_for_update(
        contract_id=contract_id
    )
    contract_items_map = {
        contract_item.enterprise_item_id: contract_item
        for contract_item in existing_contract_items
    }

    _process_contract_items(
        user_id=user_id,
        enterprise_id=enterprise_id,
        contract_id=contract_id,
        contract=contract,
        contract_items=contract_items,
        template_section_map=template_section_map,
        template_section_item_map=template_section_item_map,
        attributes_map=attributes_map,
        custom_section_map=custom_section_map,
        item_costs_map=item_costs_map,
        currency_code_map=currency_code_map,
        incoterm_map=incoterm_map,
        contract_items_map=contract_items_map,
        is_create=False,
    )


def _update_submitted_contract(
    *,
    user_id,
    contract: Contract,
    contract_name,
    contract_start_date,
    contract_end_date,
    buyer_entity_id,
    enterprise_id,
    buyer_address_information,
    buyer_contact_information,
    buyer_identifications,
    vendor_identifications,
    vendor_contact_information,
    vendor_address_information,
    project_information,
    additional_costs,
    taxes,
    discounts,
    prepayment_percentage,
    payment_type,
    payment_terms,
    deliverables_payment_terms,
    incoterm_id,
    lead_time,
    lead_time_period,
    custom_sections,
    terms_and_conditions,
    attachments,
    contract_items,
    template_section_map,
    template_section_item_map,
    attributes_map,
    item_costs_map,
    currency_code_map,
    incoterm_map,
    **kwargs,
):
    old_contract = contract
    new_contract = contract_service._save_contract(
        custom_contract_id=old_contract.custom_contract_id,
        ERP_contract_id=old_contract.ERP_contract_id,
        contract_name=contract_name,
        contract_start_date=contract_start_date,
        contract_end_date=contract_end_date,
        buyer_entity_id=buyer_entity_id,
        buyer_enterprise_id=enterprise_id,
        buyer_address_information=buyer_address_information,
        buyer_contact_information=buyer_contact_information,
        buyer_identifications=buyer_identifications,
        # Seller doesn't change if contract was already submitted
        seller_entity_id=old_contract.seller_entity_id,
        seller_enterprise_id=old_contract.seller_enterprise_id,
        vendor_identifications=vendor_identifications,
        vendor_contact_information=vendor_contact_information,
        vendor_address_information=vendor_address_information,
        status=ContractState.CONTRACT_SUBMITTED.value,
        additional_details=old_contract.additional_details,
        project_information=project_information,
        prepayment_percentage=prepayment_percentage,
        payment_type=payment_type,
        payment_terms=payment_terms,
        deliverables_payment_terms=deliverables_payment_terms,
        incoterm_id=incoterm_id,
        lead_time=lead_time,
        lead_time_period=lead_time_period,
        terms_and_conditions=terms_and_conditions,
        version=old_contract.version + 1,
    )
    new_contract.modified_by_user_id = user_id
    new_contract.save()

    old_contract.status = ContractState.CONTRACT_REVISED.value
    old_contract.modified_by_user_id = user_id
    old_contract.save()
    new_contract_id = new_contract.contract_id

    additional_costs_to_create, _ = additional_cost_service.handle_additional_costs(
        type=AdditionalCostType.ADDITIONAL_COST.value,
        user_id=user_id,
        enterprise_id=enterprise_id,
        module=AdditionalCostLinkageModule.CONTRACT.value,
        additional_costs=additional_costs,
        contract_id=new_contract_id,
    )
    taxes_to_create, _ = additional_cost_service.handle_additional_costs(
        type=AdditionalCostType.TAX.value,
        user_id=user_id,
        enterprise_id=enterprise_id,
        module=AdditionalCostLinkageModule.CONTRACT.value,
        additional_costs=taxes,
        contract_id=new_contract_id,
    )
    discounts_to_create, _ = additional_cost_service.handle_additional_costs(
        type=AdditionalCostType.DISCOUNT.value,
        user_id=user_id,
        enterprise_id=enterprise_id,
        module=AdditionalCostLinkageModule.CONTRACT.value,
        additional_costs=discounts,
        contract_id=new_contract_id,
    )
    AdditionalCostLinkage.objects.bulk_create(additional_costs_to_create)
    AdditionalCostLinkage.objects.bulk_create(taxes_to_create)
    AdditionalCostLinkage.objects.bulk_create(discounts_to_create)

    (
        custom_sections_to_create,
        _,
        custom_fields_to_create,
        custom_fields_attachments_to_create_map,
        custom_section_map,
    ) = custom_service.create_custom_sections(
        user_id=user_id,
        custom_sections=custom_sections,
        enterprise_id=enterprise_id,
        contract_id=new_contract_id,
        custom_section_map={},
    )
    CustomSection.objects.bulk_create(custom_sections_to_create)
    CustomField.objects.bulk_create(custom_fields_to_create)

    _process_contract_items(
        user_id=user_id,
        enterprise_id=enterprise_id,
        contract_id=new_contract_id,
        contract=new_contract,
        contract_items=contract_items,
        template_section_map=template_section_map,
        template_section_item_map=template_section_item_map,
        custom_section_map=custom_section_map,
        attributes_map=attributes_map,
        item_costs_map=item_costs_map,
        currency_code_map=currency_code_map,
        incoterm_map=incoterm_map,
        is_create=True,
    )

    # Delete old contract version's pricing repo entries, then sync new version
    _queue_contract_pricing_delete(old_contract.contract_id)
    _queue_contract_pricing_sync(new_contract.contract_id, enterprise_id)

    return new_contract


_contract_update_transition_workflows = {
    (ContractState.CONTRACT_DRAFT, ContractState.CONTRACT_DRAFT): _update_contract,
    (ContractState.CONTRACT_DRAFT, ContractState.CONTRACT_SUBMITTED): _update_contract,
    (
        ContractState.CONTRACT_SUBMITTED,
        ContractState.CONTRACT_SUBMITTED,
    ): _update_submitted_contract,
}


def get_and_validate_contract_update_transition(contract_transition):
    if contract_transition not in _contract_update_transition_workflows:
        raise ValidationException(
            f"Illegal contract transition from {contract_transition[0]} to {contract_transition[1]}"
        )
    return _contract_update_transition_workflows[contract_transition]


_contract_status_transition_workflows = {
    (
        ContractState.CONTRACT_SUBMITTED,
        ContractState.CONTRACT_TERMINATED,
    ): contract_workflows._terminate,
}


def _queue_contract_pricing_sync(contract_id, enterprise_id):
    """Queue pricing repo sync for a contract after transaction commits."""
    try:
        from pricing_repository.tasks import sync_contract_all_items
        _cid = str(contract_id)
        _eid = str(enterprise_id)
        print(f"[OPENAPI-SYNC] REGISTERING on_commit for contract {_cid} enterprise {_eid}", flush=True)

        def _do_sync():
            print(f"[OPENAPI-SYNC] on_commit FIRED — sending celery task for contract {_cid}", flush=True)
            result = sync_contract_all_items.delay(_cid, _eid, action='sync')
            print(f"[OPENAPI-SYNC] celery task SENT for contract {_cid}, task_id={result.id}", flush=True)

        transaction.on_commit(_do_sync)
    except Exception as e:
        print(f"[OPENAPI-SYNC] ERROR queueing contract sync: {e}", flush=True)
        import traceback
        traceback.print_exc()


def _queue_contract_pricing_delete(contract_id):
    """Delete pricing repo entries for a contract after transaction commits.
    Direct DB delete (no Celery) — reliable on Lambda where signals may not fire."""
    try:
        from pricing_repository.models import PricingRepositoryEntry, SourceType
        _cid = str(contract_id)

        def _do_delete():
            PricingRepositoryEntry.objects.filter(
                source=SourceType.CONTRACT,
                source_parent_id=_cid,
            ).delete()

        transaction.on_commit(_do_delete)
    except Exception as e:
        print(f"[OPENAPI-SYNC] ERROR queueing contract delete: {e}", flush=True)


def get_and_validate_contract_status_transition(contract_transition):
    if contract_transition not in _contract_status_transition_workflows:
        raise ValidationException(
            f"Illegal contract transition from {contract_transition[0]} to {contract_transition[1]}"
        )
    return _contract_status_transition_workflows[contract_transition]
