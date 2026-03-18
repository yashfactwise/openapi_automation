import uuid
from dataclasses import asdict

from additional_costs import services as additional_cost_service
from additional_costs.models import AdditionalCostLinkage
from additional_costs.states import AdditionalCostLinkageModule, AdditionalCostType
from additional_costs.structures import AdditionalCostDataClass
from attributes import services as attribute_service
from attributes.models import AttributeLinkage, AttributeValueLinkage
from attributes.states import AttributeLinkageModule
from attributes.structures import (
    AttributeLinkageInputStruct,
    AttributeValueLinkageInputStruct,
)
from backbone import service as backbone_service
from celery import shared_task
from contract import workflows as contract_workflows
from contract.models.contract_item_model import ContractItem
from contract.models.contract_model import Contract
from contract.models.pricing_tier_model import PricingTier
from contract.services import (
    contract_item_service,
    contract_service,
    pricing_tier_service,
)
from contract.states import ContractState
from contract.structures import (
    ContractAdditionalDetails,
    ContractItemPricingInformation,
    ContractProjectInformation,
)
from custom import service as custom_service
from custom.models import CustomField, CustomSection
from django.db import transaction
from django.db.models import F, JSONField, Q, Value
from module_templates import services as template_services
from module_templates.types import (
    ModuleTemplateSectionItemLevel,
    ModuleTemplateSectionType,
    ModuleTemplateType,
)
from openapi.models import BulkTask
from openapi.services import custom_services
from organization.models import Entity
from organization.org_models.identification_model import EntityIdentification
from organization.org_models.item_master_model import EnterpriseItem
from organization.org_models.vendor_master_model import (
    EntityVendorMaster,
    VendorContact,
)
from organization.services import (
    address_service,
    enterprise_user_service,
    entity_service,
    identification_service,
    item_service,
    project_service,
    terms_and_conditions_service,
    vendor_contact_service,
    vendor_master_service,
)
from purchase_order.structures.event_po_structures import (
    EventPurchaseOrderTermsAndConditions,
)

from factwise.backbone.states import EnterpriseItemState
from factwise.exception import BadRequestException, ValidationException
from factwise.openapi.service import JsonbConcat, make_json_safe
from factwise.utils import set_statement_timeout


@transaction.atomic
def create_contract(
    *,
    enterprise_id,
    created_by_user_email,
    contract_name,
    factwise_contract_id,
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
    print(
        f"[OPENAPI-CONTRACT] >>> create_contract ENTERED enterprise={enterprise_id} status={status} name={contract_name}",
        flush=True,
    )
    user = enterprise_user_service.get_user_by_enterprise_email(
        enterprise_id=enterprise_id, email=created_by_user_email
    )
    if not user:
        raise ValidationException("User email does not exist in the enterprise")
    user_id = user.user_id

    # factwise_contract_id uniqueness
    if (
        factwise_contract_id
        and Contract.objects.filter(
            buyer_enterprise_id=enterprise_id,
            custom_contract_id=factwise_contract_id,
        ).exists()
    ):
        raise ValidationException(
            "Contract with the same factwise_contract_id already exists"
        )

    # ERP_contract_id uniqueness
    if (
        ERP_contract_id
        and Contract.objects.filter(
            buyer_enterprise_id=enterprise_id,
            ERP_contract_id=ERP_contract_id,
        ).exists()
    ):
        raise ValidationException(
            "Contract with the same ERP_contract_id already exists"
        )

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
        custom_contract_id=factwise_contract_id,
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
    print(
        f"[OPENAPI-CONTRACT] >>> ABOUT TO CALL _queue_contract_pricing_sync contract={contract_id} enterprise={enterprise_id}",
        flush=True,
    )
    _queue_contract_pricing_sync(contract_id, enterprise_id)
    print(
        f"[OPENAPI-CONTRACT] >>> _queue_contract_pricing_sync DONE, returning {contract.custom_contract_id}",
        flush=True,
    )

    return contract.custom_contract_id


def _create_contracts_bulk_impl(*, enterprise_id, contracts_payload, task_id=None):
    results = []

    if task_id:
        BulkTask.objects.filter(task_id=task_id).update(status="running")

    # -------------------------------------------------
    # PRELOAD (READ-ONLY, BULK SAFE)
    # -------------------------------------------------

    emails = {p.get("created_by_user_email") for p in contracts_payload}
    user_map = enterprise_user_service.get_users_by_enterprise_emails(
        enterprise_id=enterprise_id,
        emails=emails,
    )
    user_id_map = {email: u.user_id for email, u in user_map.items()}

    # -------------------------------------------------
    # PRELOAD EXISTING CONTRACT IDS (MAPS)
    # -------------------------------------------------

    existing_factwise_id_map = set(
        Contract.objects.filter(
            buyer_enterprise_id=enterprise_id,
            custom_contract_id__isnull=False,
        ).values_list("custom_contract_id", flat=True)
    )

    existing_erp_id_map = set(
        Contract.objects.filter(
            buyer_enterprise_id=enterprise_id,
            ERP_contract_id__isnull=False,
        ).values_list("ERP_contract_id", flat=True)
    )

    entity_names = {p.get("entity_name") for p in contracts_payload}
    entities = Entity.objects.filter(
        enterprise_id=enterprise_id,
        entity_name__in=entity_names,
    ).values("entity_id", "entity_name")
    entity_map = {e["entity_name"]: e["entity_id"] for e in entities}
    entity_ids = list(entity_map.values())

    template_names = {
        p.get("template_name") for p in contracts_payload if p.get("template_name")
    }
    templates = template_services._get_templates_from_names(
        entity_ids=entity_ids,
        names=template_names,
        type=ModuleTemplateType.CLM_TEMPLATE,
    )
    template_map = {(t.entity_id, t.name): t for t in templates}

    template_section_cache = {}

    def get_template_section_maps(template_id):
        if template_id not in template_section_cache:
            sections = template_services.get_template_sections(template_id=template_id)
            items = template_services.get_template_section_items(
                template_id=template_id
            ).filter(is_builtin_field=False)
            template_section_cache[template_id] = (
                {s.alternate_name: s for s in sections},
                {(i.section.alternate_name, i.alternate_name): i for i in items},
            )
        return template_section_cache[template_id]

    currency_ids = set()
    incoterm_names = set()
    attribute_names = set()
    overall_cost_names = set()
    item_cost_names = set()

    for payload in contracts_payload:
        for cost in payload.get("additional_costs"):
            overall_cost_names.add(cost["name"])
        for cost in payload.get("taxes"):
            overall_cost_names.add(cost["name"])
        for cost in payload.get("discounts"):
            overall_cost_names.add(cost["name"])

        for item in payload.get("contract_items"):
            currency_ids.add(item["currency_code_id"])
            incoterm_names.add(item["incoterm"])
            for attr in item["attributes"]:
                attribute_names.add(attr["attribute_name"])
            for tier in item["pricing_tiers"]:
                for c in tier["additional_costs"]:
                    item_cost_names.add(c["name"])
                for c in tier["taxes"]:
                    item_cost_names.add(c["name"])
                for c in tier["discounts"]:
                    item_cost_names.add(c["name"])

    currency_map = {
        c.entry_id: c
        for c in backbone_service.get_currency_list_via_ids(
            currency_code_id_list=list(currency_ids)
        )
    }

    incoterm_map = {
        i.incoterm_abbreviation: i
        for i in backbone_service.get_incoterm_list(incoterms=list(incoterm_names))
    }

    attributes_map = {
        a.attribute_name: a
        for a in attribute_service.get_attributes_via_names(
            enterprise_id=enterprise_id,
            attribute_names=list(attribute_names),
        )
    }

    overall_costs_map = {
        c.cost_name: c
        for c in additional_cost_service.get_additional_costs_from_names(
            enterprise_id=enterprise_id,
            additional_cost_names=list(overall_cost_names),
        ).filter(field_level=ModuleTemplateSectionItemLevel.OTHER.value)
    }

    item_costs_map = {
        c.cost_name: c
        for c in additional_cost_service.get_additional_costs_from_names(
            enterprise_id=enterprise_id,
            additional_cost_names=list(item_cost_names),
        ).filter(field_level=ModuleTemplateSectionItemLevel.ITEM.value)
    }

    # -------------------------------------------------
    # MAIN LOOP (PER-CONTRACT ATOMICITY)
    # -------------------------------------------------

    for index, payload in enumerate(contracts_payload):
        try:
            with transaction.atomic():
                set_statement_timeout(900000)

                user_id = user_id_map.get(payload.get("created_by_user_email"))
                if not user_id:
                    raise ValidationException(
                        "User email does not exist in the enterprise"
                    )

                factwise_contract_id = payload.get("factwise_contract_id")
                ERP_contract_id = payload.get("ERP_contract_id")

                if (
                    factwise_contract_id
                    and factwise_contract_id in existing_factwise_id_map
                ):
                    raise ValidationException(
                        "Contract with the same factwise_contract_id already exists"
                    )

                if ERP_contract_id and ERP_contract_id in existing_erp_id_map:
                    raise ValidationException(
                        "Contract with the same ERP_contract_id already exists"
                    )

                buyer_entity_id = entity_map.get(payload.get("entity_name"))
                if not buyer_entity_id:
                    raise BadRequestException("Invalid entity")

                buyer_identifications = (
                    _get_buyer_identiifications_from_entity_and_identification_names(
                        buyer_entity_id=buyer_entity_id,
                        identification_name_list=payload.get("buyer_identifications"),
                    )
                )
                buyer_address_information = (
                    _get_buyer_address_information_from_entity_and_nickname(
                        buyer_entity_id=buyer_entity_id,
                        buyer_address=payload.get("buyer_address"),
                    )
                )
                buyer_contact_information = _get_buyer_contact_information_from_email(
                    enterprise_id=enterprise_id,
                    email=payload.get("buyer_contact"),
                )

                entity_vm = _get_entity_vm_from_code(
                    buyer_entity_id=buyer_entity_id,
                    factwise_vendor_code=payload.get("factwise_vendor_code"),
                    ERP_vendor_code=payload.get("ERP_vendor_code"),
                )
                enterprise_vm = entity_vm.enterprise_vendor_master

                vendor_contact_information = _get_vendor_contact_information_from_buyer_and_seller_entity_and_email(
                    buyer_entity_id=buyer_entity_id,
                    seller_entity_id=enterprise_vm.seller_entity_id,
                    vendor_contact=payload.get("vendor_contact"),
                )
                vendor_address_information = (
                    _get_vendor_address_information_from_seller_entity_and_nickname(
                        seller_entity_id=enterprise_vm.seller_entity_id,
                        vendor_address=payload.get("vendor_address"),
                    )
                )

                vendor_ident_map = {
                    (vi.identification_name, vi.identification_value): vi
                    for vi in EntityIdentification.objects.filter(
                        entity_id=enterprise_vm.seller_entity_id,
                        deleted_datetime__isnull=True,
                    )
                }

                for ident in payload.get("vendor_identifications", []):
                    key = (
                        ident["identification_name"],
                        ident["identification_value"],
                    )
                    if key not in vendor_ident_map:
                        raise ValidationException(
                            f"Vendor identification {ident['identification_name']} with value {ident['identification_value']} does not belong to the vendor"
                        )

                template = template_map.get(
                    (buyer_entity_id, payload.get("template_name"))
                )
                if not template:
                    raise BadRequestException("Invalid template")

                section_map, item_map = get_template_section_maps(template.template_id)

                custom_sections = (
                    custom_services.validate_and_autofill_custom_sections_from_template(
                        custom_sections=payload.get("custom_sections"),
                        template_section_map=section_map,
                        template_section_item_map=item_map,
                    )
                )

                contract = contract_service._save_contract(
                    custom_contract_id=factwise_contract_id,
                    ERP_contract_id=ERP_contract_id,
                    contract_name=payload.get("contract_name"),
                    contract_start_date=payload.get("contract_start_date"),
                    contract_end_date=payload.get("contract_end_date"),
                    buyer_entity_id=buyer_entity_id,
                    buyer_enterprise_id=enterprise_id,
                    seller_entity_id=enterprise_vm.seller_entity_id,
                    seller_enterprise_id=enterprise_vm.seller_enterprise_id,
                    buyer_address_information=buyer_address_information,
                    buyer_contact_information=buyer_contact_information,
                    buyer_identifications=buyer_identifications,
                    status=payload.get("status"),
                    additional_details=ContractAdditionalDetails(
                        template_id=template.template_id
                    ),
                    project_information=_get_project_information_from_project_code(
                        buyer_entity_id=buyer_entity_id,
                        project_code=payload.get("project"),
                    ),
                    prepayment_percentage=payload.get("prepayment_percentage"),
                    payment_type=payload.get("payment_type"),
                    payment_terms=payload.get("payment_terms"),
                    deliverables_payment_terms=payload.get(
                        "deliverables_payment_terms"
                    ),
                    incoterm_id=backbone_service.get_incoterm_via_name(
                        incoterm=payload.get("incoterm")
                    ).entry_id,
                    lead_time=payload.get("lead_time"),
                    lead_time_period=payload.get("lead_time_period"),
                    terms_and_conditions=_get_terms_and_conditions(
                        enterprise_id=enterprise_id,
                        terms_and_conditions=payload.get("terms_and_conditions"),
                    ),
                    vendor_identifications=payload.get("vendor_identifications"),
                    vendor_address_information=vendor_address_information,
                    vendor_contact_information=vendor_contact_information,
                )
                contract.created_by_user_id = user_id
                contract.save()
                contract_id = contract.contract_id

                existing_factwise_id_map.add(contract.custom_contract_id)
                existing_erp_id_map.add(contract.ERP_contract_id)

                # CONTRACT-LEVEL ADDITIONAL COSTS (verbatim parity with single-create)
                contract_additional_costs = []
                contract_taxes = []
                contract_discounts = []

                for cost in payload.get("additional_costs"):
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

                for cost in payload.get("taxes"):
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

                for cost in payload.get("discounts"):
                    if cost["name"] != "Overall discount":
                        additional_cost = overall_costs_map[cost["name"]]
                        contract_discounts.append(
                            AdditionalCostDataClass(
                                additional_cost_id=additional_cost.additional_cost_id,
                                cost_name=cost["name"],
                                cost_type=additional_cost.cost_type,
                                allocation_type=additional_cost.allocation_type,
                                cost_value=cost["value"],
                            )
                        )
                    else:
                        contract_discounts.append(
                            AdditionalCostDataClass(
                                additional_cost_id=None,
                                cost_name=cost["name"],
                                cost_type="PERCENTAGE",
                                allocation_type=None,
                                cost_value=cost["value"],
                            )
                        )

                additional_costs_to_create, _ = (
                    additional_cost_service.handle_additional_costs(
                        type=AdditionalCostType.ADDITIONAL_COST.value,
                        user_id=user_id,
                        enterprise_id=enterprise_id,
                        module=AdditionalCostLinkageModule.CONTRACT.value,
                        additional_costs=contract_additional_costs,
                        contract_id=contract_id,
                        is_create=True,
                    )
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
                discounts_to_create, _ = (
                    additional_cost_service.handle_additional_costs(
                        type=AdditionalCostType.DISCOUNT.value,
                        user_id=user_id,
                        enterprise_id=enterprise_id,
                        module=AdditionalCostLinkageModule.CONTRACT.value,
                        additional_costs=contract_discounts,
                        contract_id=contract_id,
                        is_create=True,
                    )
                )

                AdditionalCostLinkage.objects.bulk_create(additional_costs_to_create)
                AdditionalCostLinkage.objects.bulk_create(taxes_to_create)
                AdditionalCostLinkage.objects.bulk_create(discounts_to_create)

                # ============================
                # FIX APPLIED: CONTRACT CUSTOM SECTIONS
                # (verbatim from single-create)
                # ============================
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

                for contract_item in payload.get("contract_items"):
                    contract_item_attributes = []

                    ERP_item_code = contract_item.get("ERP_item_code")
                    factwise_item_code = contract_item.get("factwise_item_code")

                    if factwise_item_code:
                        try:
                            enterprise_item = item_service.get_enterprise_item_via_code(
                                enterprise_id=enterprise_id, code=factwise_item_code
                            )
                        except EnterpriseItem.DoesNotExist:
                            raise ValidationException(
                                f"Item with FactWise Item Code {factwise_item_code} does not exist"
                            )
                    else:
                        enterprise_item = item_service.validate_and_get_enterprise_item(
                            enterprise_id=enterprise_id,
                            ERP_item_code=ERP_item_code,
                        )

                    if (
                        enterprise_item.status
                        == EnterpriseItemState.ITEM_INACTIVE.value
                    ):
                        if factwise_item_code:
                            raise ValidationException(
                                f"Item with FactWise Item Code {factwise_item_code} is disabled."
                            )
                        else:
                            raise ValidationException(
                                f"Item with ERP Item Code {ERP_item_code} is disabled."
                            )

                    enterprise_item_id = enterprise_item.enterprise_item_id

                    currency_code = currency_map[contract_item.get("currency_code_id")]
                    measurement_unit_id = contract_item.get("measurement_unit_id")

                    for attribute in contract_item.get("attributes"):
                        name = attribute["attribute_name"]
                        if name not in attributes_map:
                            raise ValidationException(f"Attribute not found: {name}")
                        attribute_def = attributes_map[name]
                        contract_item_attributes.append(
                            AttributeLinkageInputStruct(
                                attribute_name=attribute_def.attribute_name,
                                attribute_type=attribute_def.attribute_type,
                                attribute_id=attribute_def.attribute_id,
                                attribute_values=[
                                    AttributeValueLinkageInputStruct(value=v["value"])
                                    for v in attribute["attribute_value"]
                                ],
                            )
                        )

                    incoterm_id = incoterm_map[contract_item.get("incoterm")].entry_id

                    procurement_information = (
                        contract_item_service._construct_procurement_information(
                            lead_time=contract_item.get("lead_time"),
                            lead_time_period=contract_item.get("lead_time_period"),
                        )
                    )

                    pricing_tiers = contract_item.get("pricing_tiers")
                    item_quantity = 0

                    for tier in pricing_tiers:
                        format_costs_result = _format_costs(
                            additional_costs=tier["additional_costs"],
                            taxes=tier["taxes"],
                            discounts=tier["discounts"],
                            costs_map=item_costs_map,
                        )

                        tier["additional_costs"] = format_costs_result[
                            "additional_costs"
                        ]
                        tier["taxes"] = format_costs_result["taxes"]
                        tier["discounts"] = format_costs_result["discounts"]

                        tier["effective_rate"] = (
                            additional_cost_service._get_item_effective_rate(
                                base_quantity=tier["max_quantity"]
                                - tier["min_quantity"],
                                base_rate=tier["rate"],
                                additional_costs=[
                                    asdict(c) for c in tier["additional_costs"]
                                ],
                                taxes=[asdict(c) for c in tier["taxes"]],
                                discounts=[asdict(c) for c in tier["discounts"]],
                            )
                        )

                        if item_quantity < tier["max_quantity"]:
                            item_quantity = tier["max_quantity"]

                    pricing_information = ContractItemPricingInformation(
                        currency_code_id=currency_code.entry_id,
                        currency_name=currency_code.currency_name,
                        currency_symbol=currency_code.currency_symbol,
                        currency_code_abbreviation=currency_code.currency_code_abbreviation,
                        desired_price=None,
                        total_price=0,
                    )

                    contract_item_obj = contract_item_service._save_contract_item(
                        contract_id=contract_id,
                        enterprise_item_id=enterprise_item_id,
                        currency_id=currency_code.entry_id,
                        measurement_unit_id=measurement_unit_id,
                        rate=None,
                        pricing_information=pricing_information,
                        quantity=item_quantity,
                        buyer_skus=[],
                        prepayment_percentage=payload.get("prepayment_percentage"),
                        payment_type=payload.get("payment_type"),
                        payment_terms=payload.get("payment_terms"),
                        deliverables_payment_terms=payload.get(
                            "deliverables_payment_terms"
                        ),
                        incoterm_id=incoterm_id,
                        procurement_information=procurement_information,
                    )

                    contract_items_to_create.append(contract_item_obj)

                    _attrs, _vals, _ = attribute_service.handle_attributes(
                        enterprise_id=enterprise_id,
                        module=AttributeLinkageModule.CONTRACT_ITEM.value,
                        attributes=contract_item_attributes,
                        contract_item_id=contract_item_obj.contract_item_id,
                        is_create=True,
                    )
                    attributes_to_create.extend(_attrs)
                    attribute_values_to_create.extend(_vals)

                    _attrs, _vals = attribute_service.clone_module_attributes(
                        enterprise_id=enterprise_id,
                        from_module=AttributeLinkageModule.ITEM.value,
                        to_module=AttributeLinkageModule.CONTRACT_ITEM.value,
                        old_enterprise_item_id=enterprise_item_id,
                        new_contract_item_id=contract_item_obj.contract_item_id,
                    )
                    attributes_to_create.extend(_attrs)
                    attribute_values_to_create.extend(_vals)

                    pricing_result = pricing_tier_service.create_pricing_tiers(
                        enterprise_id=enterprise_id,
                        contract_item_id=contract_item_obj.contract_item_id,
                        pricing_tiers=pricing_tiers,
                    )

                    pricing_tiers_to_create.extend(
                        pricing_result["pricing_tiers_to_create"]
                    )
                    additional_costs_to_create.extend(
                        pricing_result["additional_costs_to_create"]
                    )
                    taxes_to_create.extend(pricing_result["taxes_to_create"])
                    discounts_to_create.extend(pricing_result["discounts_to_create"])

                ContractItem.objects.bulk_create(contract_items_to_create)
                AttributeLinkage.objects.bulk_create(attributes_to_create)
                AttributeValueLinkage.objects.bulk_create(attribute_values_to_create)
                PricingTier.objects.bulk_create(pricing_tiers_to_create)
                AdditionalCostLinkage.objects.bulk_create(additional_costs_to_create)
                AdditionalCostLinkage.objects.bulk_create(taxes_to_create)
                AdditionalCostLinkage.objects.bulk_create(discounts_to_create)
                CustomField.objects.bulk_create(custom_fields_to_create)

                # ============================

                _queue_contract_pricing_sync(contract_id, enterprise_id)

            result = {
                "index": index,
                "status": "success",
                "erp_contract_code": payload.get("ERP_contract_id"),
                "contract_code": contract.custom_contract_id,
                "contract_id": str(contract.contract_id),
            }
            results.append(result)

            if task_id:
                BulkTask.objects.filter(task_id=task_id).update(
                    processed=F("processed") + 1,
                    success=F("success") + 1,
                    results=JsonbConcat(
                        F("results"),
                        Value([result], output_field=JSONField()),
                    ),
                )

        except Exception as exc:
            failure = {
                "index": index,
                "status": "failed",
                "erp_contract_code": payload.get("ERP_contract_id"),
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
        "total": len(contracts_payload),
        "success": sum(r["status"] == "success" for r in results),
        "failed": sum(r["status"] == "failed" for r in results),
        "results": results,
    }


@shared_task(
    bind=True,
    name="factwise.openapi.services.contract_services.create_contracts_bulk_task",
)
def create_contracts_bulk_task(self, *, enterprise_id, contracts_payload, task_id):
    try:
        return _create_contracts_bulk_impl(
            enterprise_id=enterprise_id,
            contracts_payload=contracts_payload,
            task_id=task_id,
        )
    except Exception as exc:
        BulkTask.objects.filter(task_id=task_id).update(
            status="failed",
            error=str(exc),
        )
        raise


ASYNC_CONTRACT_THRESHOLD = 1000


def create_contracts_bulk(
    *, enterprise_id, contracts_payload, total_len, validation_errors
):
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

    total = len(contracts_payload)

    if total >= ASYNC_CONTRACT_THRESHOLD:
        task_id = uuid.uuid4()
        BulkTask.objects.create(
            task_id=task_id,
            task_type="contract",
            enterprise_id=enterprise_id,
            status="pending",
            total=total_len,
            processed=len(validation_errors),
            success=0,
            failed=len(validation_errors),
            results=[
                {
                    "index": e["index"],
                    "status": "failed",
                    "erp_contract_code": e.get("erp_contract_code"),
                    "error": e["error"],
                }
                for e in validation_errors
            ],
        )

        create_contracts_bulk_task.delay(  # type: ignore
            enterprise_id=enterprise_id,
            contracts_payload=make_json_safe(contracts_payload),
            task_id=str(task_id),
        )

        return {
            "status": "accepted",
            "mode": "async",
            "task_id": str(task_id),
        }

    return _create_contracts_bulk_impl(
        enterprise_id=enterprise_id,
        contracts_payload=contracts_payload,
    )


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


def _update_contracts_bulk_impl(*, enterprise_id, contracts_payload, task_id=None):
    results = []

    if task_id:
        BulkTask.objects.filter(task_id=task_id).update(status="running")

    # -------------------------------------------------
    # PRELOAD (READ-ONLY, BULK SAFE)
    # -------------------------------------------------

    user_emails = set()
    factwise_contract_ids = set()
    erp_contract_ids = set()
    attribute_names = set()
    overall_cost_names = set()
    item_cost_names = set()
    currency_code_ids = set()
    incoterm_names = set()

    for payload in contracts_payload:
        user_emails.add(payload.get("modified_by_user_email"))

        if payload.get("factwise_contract_id"):
            factwise_contract_ids.add(payload.get("factwise_contract_id"))
        else:
            erp_contract_ids.add(payload.get("ERP_contract_id"))

        for cost in payload.get("additional_costs"):
            overall_cost_names.add(cost["name"])
        for cost in payload.get("taxes"):
            overall_cost_names.add(cost["name"])
        for cost in payload.get("discounts"):
            overall_cost_names.add(cost["name"])

        for item in payload.get("contract_items"):
            currency_code_ids.add(item["currency_code_id"])
            incoterm_names.add(item["incoterm"])

            for attr in item["attributes"]:
                attribute_names.add(attr["attribute_name"])

            for tier in item["pricing_tiers"]:
                for cost in tier["additional_costs"]:
                    item_cost_names.add(cost["name"])
                for cost in tier["taxes"]:
                    item_cost_names.add(cost["name"])
                for cost in tier["discounts"]:
                    item_cost_names.add(cost["name"])

    # ---- users ----
    user_map = enterprise_user_service.get_users_by_enterprise_emails(
        enterprise_id=enterprise_id,
        emails=list(user_emails),
    )

    # ---- contracts ----
    contracts = list(
        contract_service.get_enterprise_contracts(
            enterprise_id=enterprise_id,
            custom_contract_ids=list(factwise_contract_ids),
            ERP_contract_ids=list(erp_contract_ids),
        )
    )
    contract_by_factwise = {
        c.custom_contract_id: c for c in contracts if c.custom_contract_id
    }
    contract_by_erp = {c.ERP_contract_id: c for c in contracts if c.ERP_contract_id}

    # ---- attributes ----
    attributes = attribute_service.get_attributes_via_names(
        enterprise_id=enterprise_id,
        attribute_names=list(attribute_names),
    )
    attributes_map = {a.attribute_name: a for a in attributes}

    # ---- costs ----
    overall_costs = additional_cost_service.get_additional_costs_from_names(
        enterprise_id=enterprise_id,
        additional_cost_names=list(overall_cost_names),
    ).filter(field_level=ModuleTemplateSectionItemLevel.OTHER.value)
    overall_cost_map = {c.cost_name: c for c in overall_costs}

    item_costs = additional_cost_service.get_additional_costs_from_names(
        enterprise_id=enterprise_id,
        additional_cost_names=list(item_cost_names),
    )
    item_costs_map = {c.cost_name: c for c in item_costs}

    # ---- currencies ----
    currencies = backbone_service.get_currency_list_via_ids(
        currency_code_id_list=list(currency_code_ids)
    )
    currency_code_map = {c.entry_id: c for c in currencies}

    # ---- incoterms ----
    incoterms = backbone_service.get_incoterm_list(incoterms=list(incoterm_names))
    incoterm_map = {i.incoterm_abbreviation: i for i in incoterms}

    # -------------------------------------------------
    # MAIN LOOP (PER-CONTRACT ATOMICITY)
    # -------------------------------------------------

    for index, payload in enumerate(contracts_payload):
        try:
            with transaction.atomic():
                set_statement_timeout(900000)
                # ---- user ----
                user = user_map.get(payload.get("modified_by_user_email"))
                if not user:
                    raise ValidationException(
                        "User email does not exist in the enterprise"
                    )

                # ---- contract ----
                if payload.get("factwise_contract_id"):
                    contract = contract_by_factwise.get(
                        payload.get("factwise_contract_id")
                    )
                    if not contract:
                        raise ValidationException(
                            "Contract with Factwise contract id does not exist"
                        )
                else:
                    contract = contract_by_erp.get(payload.get("ERP_contract_id"))
                    if not contract:
                        raise ValidationException(
                            "Contract with ERP contract id does not exist"
                        )

                # ---- transition ----
                transition = (contract.status, payload.get("status"))
                status_workflow = get_and_validate_contract_update_transition(
                    transition
                )

                # ---- buyer ----
                buyer_entity_id = contract.buyer_entity_id

                buyer_identifications = (
                    _get_buyer_identiifications_from_entity_and_identification_names(
                        buyer_entity_id=buyer_entity_id,
                        identification_name_list=payload.get("buyer_identifications"),
                    )
                )

                buyer_address_information = (
                    _get_buyer_address_information_from_entity_and_nickname(
                        buyer_entity_id=buyer_entity_id,
                        buyer_address=payload.get("buyer_address"),
                    )
                )

                buyer_contact_information = _get_buyer_contact_information_from_email(
                    enterprise_id=enterprise_id,
                    email=payload.get("buyer_contact"),
                )

                entity_vm = _get_entity_vm_from_code(
                    buyer_entity_id=buyer_entity_id,
                    factwise_vendor_code=payload.get("factwise_vendor_code"),
                    ERP_vendor_code=payload.get("ERP_vendor_code"),
                )

                if contract.status == ContractState.CONTRACT_SUBMITTED.value:
                    seller_entity_id = contract.seller_entity_id
                    seller_enterprise_id = contract.seller_enterprise_id
                else:
                    seller_entity_id = (
                        entity_vm.enterprise_vendor_master.seller_entity_id
                    )
                    seller_enterprise_id = (
                        entity_vm.enterprise_vendor_master.seller_enterprise_id
                    )

                vendor_contact_information = _get_vendor_contact_information_from_buyer_and_seller_entity_and_email(
                    buyer_entity_id=buyer_entity_id,
                    seller_entity_id=seller_entity_id,
                    vendor_contact=payload.get("vendor_contact"),
                )

                vendor_address_information = (
                    _get_vendor_address_information_from_seller_entity_and_nickname(
                        seller_entity_id=seller_entity_id,
                        vendor_address=payload.get("vendor_address"),
                    )
                )

                vendor_ident_map = {
                    (vi.identification_name, vi.identification_value): vi
                    for vi in EntityIdentification.objects.filter(
                        entity_id=seller_entity_id,
                        deleted_datetime__isnull=True,
                    )
                }

                for ident in payload.get("vendor_identifications", []):
                    key = (
                        ident["identification_name"],
                        ident["identification_value"],
                    )
                    if key not in vendor_ident_map:
                        raise ValidationException(
                            f"Vendor identification {ident['identification_name']} with value {ident['identification_value']} does not belong to the vendor"
                        )

                # ---- misc ----
                terms_and_conditions = _get_terms_and_conditions(
                    enterprise_id=enterprise_id,
                    terms_and_conditions=payload.get("terms_and_conditions"),
                )

                project_information = _get_project_information_from_project_code(
                    buyer_entity_id=buyer_entity_id,
                    project_code=payload.get("project"),
                )

                incoterm_id = backbone_service.get_incoterm_via_name(
                    incoterm=payload.get("incoterm")
                ).entry_id

                template_id = contract.additional_details["template_id"]
                template_sections = template_services.get_template_sections(
                    template_id=template_id
                )
                template_section_map = {s.alternate_name: s for s in template_sections}

                template_section_items = template_services.get_template_section_items(
                    template_id=template_id
                ).filter(is_builtin_field=False)
                template_section_item_map = {
                    (i.section.alternate_name, i.alternate_name): i
                    for i in template_section_items
                }

                custom_sections = (
                    custom_services.validate_and_autofill_custom_sections_from_template(
                        custom_sections=payload.get("custom_sections"),
                        template_section_map=template_section_map,
                        template_section_item_map=template_section_item_map,
                    )
                )

                # ---- overall costs ----
                contract_additional_costs = []
                contract_taxes = []
                contract_discounts = []

                for cost in payload.get("additional_costs"):
                    c = overall_cost_map[cost["name"]]
                    contract_additional_costs.append(
                        AdditionalCostDataClass(
                            additional_cost_id=c.additional_cost_id,
                            cost_name=c.cost_name,
                            cost_type=c.cost_type,
                            allocation_type=c.allocation_type,
                            cost_value=cost["value"],
                        )
                    )

                for cost in payload.get("taxes"):
                    c = overall_cost_map[cost["name"]]
                    contract_taxes.append(
                        AdditionalCostDataClass(
                            additional_cost_id=c.additional_cost_id,
                            cost_name=c.cost_name,
                            cost_type=c.cost_type,
                            allocation_type=c.allocation_type,
                            cost_value=cost["value"],
                        )
                    )

                for cost in payload.get("discounts"):
                    if cost["name"] == "Overall discount":
                        contract_discounts.append(
                            AdditionalCostDataClass(
                                additional_cost_id=None,
                                cost_name=cost["name"],
                                cost_type="PERCENTAGE",  # type: ignore
                                allocation_type=None,
                                cost_value=cost["value"],
                            )
                        )
                    else:
                        c = overall_cost_map[cost["name"]]
                        contract_discounts.append(
                            AdditionalCostDataClass(
                                additional_cost_id=c.additional_cost_id,
                                cost_name=c.cost_name,
                                cost_type=c.cost_type,
                                allocation_type=c.allocation_type,
                                cost_value=cost["value"],
                            )
                        )

                # ---- workflow call (truth) ----
                status_workflow(
                    user_id=user.user_id,
                    contract=contract,
                    contract_name=payload.get("contract_name"),
                    contract_start_date=payload.get("contract_start_date"),
                    contract_end_date=payload.get("contract_end_date"),
                    status=payload.get("status"),
                    buyer_entity_id=buyer_entity_id,
                    enterprise_id=enterprise_id,
                    seller_entity_id=seller_entity_id,
                    seller_enterprise_id=seller_enterprise_id,
                    buyer_address_information=buyer_address_information,
                    buyer_contact_information=buyer_contact_information,
                    buyer_identifications=buyer_identifications,
                    vendor_identifications=payload.get("vendor_identifications"),
                    vendor_contact_information=vendor_contact_information,
                    vendor_address_information=vendor_address_information,
                    project_information=project_information,
                    additional_costs=contract_additional_costs,
                    taxes=contract_taxes,
                    discounts=contract_discounts,
                    prepayment_percentage=payload.get("prepayment_percentage"),
                    payment_type=payload.get("payment_type"),
                    payment_terms=payload.get("payment_terms"),
                    deliverables_payment_terms=payload.get(
                        "deliverables_payment_terms"
                    ),
                    incoterm_id=incoterm_id,
                    lead_time=payload.get("lead_time"),
                    lead_time_period=payload.get("lead_time_period"),
                    terms_and_conditions=terms_and_conditions,
                    custom_sections=custom_sections,
                    attachments=payload.get("attachments"),
                    contract_items=payload.get("contract_items"),
                    template_section_map=template_section_map,
                    template_section_item_map=template_section_item_map,
                    currency_code_map=currency_code_map,
                    incoterm_map=incoterm_map,
                    attributes_map=attributes_map,
                    item_costs_map=item_costs_map,
                )

            result = {
                "index": index,
                "status": "success",
                "erp_contract_code": payload.get("ERP_contract_id"),
                "contract_code": contract.custom_contract_id,
                "contract_id": str(contract.contract_id),
            }
            results.append(result)

            if task_id:
                BulkTask.objects.filter(task_id=task_id).update(
                    processed=F("processed") + 1,
                    success=F("success") + 1,
                    results=JsonbConcat(
                        F("results"),
                        Value([result], output_field=JSONField()),
                    ),
                )

        except Exception as exc:
            failure = {
                "index": index,
                "status": "failed",
                "erp_contract_code": payload.get("ERP_contract_id"),
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
        "total": len(contracts_payload),
        "success": sum(r["status"] == "success" for r in results),
        "failed": sum(r["status"] == "failed" for r in results),
        "results": results,
    }


@shared_task(
    bind=True,
    name="factwise.openapi.services.contract_services.update_contracts_bulk_task",
)
def update_contracts_bulk_task(self, *, enterprise_id, contracts_payload, task_id):
    try:
        return _update_contracts_bulk_impl(
            enterprise_id=enterprise_id,
            contracts_payload=contracts_payload,
            task_id=task_id,
        )
    except Exception as exc:
        BulkTask.objects.filter(task_id=task_id).update(
            status="failed",
            error=str(exc),
        )
        raise


def update_contracts_bulk(
    *, enterprise_id, contracts_payload, total_len, validation_errors
):
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

    total = len(contracts_payload)

    if total >= ASYNC_CONTRACT_THRESHOLD:
        task_id = uuid.uuid4()
        BulkTask.objects.create(
            task_id=task_id,
            task_type="contract",
            enterprise_id=enterprise_id,
            status="pending",
            total=total_len,
            processed=len(validation_errors),
            success=0,
            failed=len(validation_errors),
            results=[
                {
                    "index": e["index"],
                    "status": "failed",
                    "erp_contract_code": e.get("erp_contract_code"),
                    "error": e["error"],
                }
                for e in validation_errors
            ],
        )

        update_contracts_bulk_task.delay(  # type: ignore
            enterprise_id=enterprise_id,
            contracts_payload=make_json_safe(contracts_payload),
            task_id=str(task_id),
        )

        return {
            "status": "accepted",
            "mode": "async",
            "task_id": str(task_id),
        }

    return _update_contracts_bulk_impl(
        enterprise_id=enterprise_id,
        contracts_payload=contracts_payload,
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
        except Contract.DoesNotExist:
            raise ValidationException(
                "Contract with Factwise contract id does not exist"
            )
    else:
        try:
            contract = contract_service.get_enterprise_contract_via_ERP_contract_id(
                enterprise_id=enterprise_id, ERP_contract_id=ERP_contract_id
            )
        except Contract.DoesNotExist:
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
        ERP_item_code = contract_item.get("ERP_item_code")
        factwise_item_code = contract_item.get("factwise_item_code")

        if factwise_item_code:
            try:
                enterprise_item = item_service.get_enterprise_item_via_code(
                    enterprise_id=enterprise_id, code=factwise_item_code
                )
            except EnterpriseItem.DoesNotExist:
                raise ValidationException(
                    f"Item with FactWise Item Code {factwise_item_code} does not exist"
                )
        else:
            enterprise_item = item_service.validate_and_get_enterprise_item(
                enterprise_id=enterprise_id, ERP_item_code=ERP_item_code
            )

        if enterprise_item.status == EnterpriseItemState.ITEM_INACTIVE.value:
            if factwise_item_code:
                raise ValidationException(
                    f"Item with FactWise Item Code {factwise_item_code} is disabled."
                )
            else:
                raise ValidationException(
                    f"Item with ERP Item Code {ERP_item_code} is disabled."
                )

        enterprise_item_id = enterprise_item.enterprise_item_id
        currency_code_id = contract_item.get("currency_code_id")
        currency_code = currency_code_map[currency_code_id]

        measurement_unit_id = contract_item.get("measurement_unit_id")
        attributes = contract_item.get("attributes")
        for attribute in attributes:
            name = attribute["attribute_name"]
            if name not in attributes_map:
                raise ValidationException(f"Attribute not found: {name}")
            contract_item_attribute = attributes_map[name]
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
        prepayment_percentage = contract_item.get("prepayment_percentage")
        payment_type = contract_item.get("payment_type")
        payment_terms = contract_item.get("payment_terms")
        incoterm = contract_item.get("incoterm")
        incoterm_id = incoterm_map[incoterm].entry_id
        deliverables_payment_terms = contract_item.get("deliverables_payment_terms")

        lead_time = contract_item.get("lead_time")
        lead_time_period = contract_item.get("lead_time_period")
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
        pricing_tiers = contract_item.get("pricing_tiers")
        item_quantity = 0
        for pricing_tier in pricing_tiers:
            tier_rate = pricing_tier.get("rate")
            min_quantity = pricing_tier.get("min_quantity")
            max_quantity = pricing_tier.get("max_quantity")
            additional_costs = pricing_tier.get("additional_costs")
            taxes = pricing_tier.get("taxes")
            discounts = pricing_tier.get("discounts")
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
        attachments = contract_item.get("attachments")

        custom_sections = contract_item.get("custom_sections")
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
                _discounts_to_create = create_pricing_tiers_result[
                    "discounts_to_create"
                ]
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


def _resolve_enterprise_item_ids(*, enterprise_id, contract_items):
    factwise_codes = set()
    erp_codes = set()

    for item in contract_items:
        if item.get("factwise_item_code"):
            factwise_codes.add(item["factwise_item_code"])
        elif item.get("ERP_item_code"):
            erp_codes.add(item["ERP_item_code"])

    enterprise_items = (
        EnterpriseItem.objects.filter(buyer_enterprise_id=enterprise_id)
        .filter(Q(code__in=factwise_codes) | Q(ERP_item_code__in=erp_codes))
        .only("enterprise_item_id", "code", "ERP_item_code")
    )

    code_map = {}
    for ei in enterprise_items:
        if ei.code:
            code_map[("factwise", ei.code)] = ei.enterprise_item_id
        if ei.ERP_item_code:
            code_map[("erp", ei.ERP_item_code)] = ei.enterprise_item_id

    resolved_ids = set()
    for item in contract_items:
        if item.get("factwise_item_code"):
            resolved_ids.add(code_map[("factwise", item["factwise_item_code"])])
        elif item.get("ERP_item_code"):
            resolved_ids.add(code_map[("erp", item["ERP_item_code"])])

    return resolved_ids


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

    incoming_enterprise_item_ids = _resolve_enterprise_item_ids(
        enterprise_id=enterprise_id,
        contract_items=contract_items,
    )

    existing_contract_items = contract_item_service.get_contract_items_for_update(
        contract_id=contract_id
    )

    items_to_delete = [
        item.contract_item_id
        for item in existing_contract_items
        if item.enterprise_item_id not in incoming_enterprise_item_ids
    ]

    if items_to_delete:
        ContractItem.objects.filter(contract_item_id__in=items_to_delete).delete()

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
        print(
            f"[OPENAPI-SYNC] REGISTERING on_commit for contract {_cid} enterprise {_eid}",
            flush=True,
        )

        def _do_sync():
            print(
                f"[OPENAPI-SYNC] on_commit FIRED — sending celery task for contract {_cid}",
                flush=True,
            )
            result = sync_contract_all_items.delay(_cid, _eid, action="sync")
            print(
                f"[OPENAPI-SYNC] celery task SENT for contract {_cid}, task_id={result.id}",
                flush=True,
            )

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
