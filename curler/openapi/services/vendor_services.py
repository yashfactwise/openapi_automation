import datetime
import uuid
from collections import defaultdict

from additional_costs import services as additional_cost_service
from additional_costs.models import AdditionalCostLinkage
from additional_costs.states import (
    AdditionalCostLinkageModule,
    AdditionalCostSource,
    AdditionalCostType,
)
from additional_costs.structures import AdditionalCostDataClass
from celery import shared_task
from custom import service as custom_service
from custom.models import CustomField, CustomSection
from django.db import transaction
from django.db.models import F, JSONField, Q, Value
from module_templates import services as module_template_service
from module_templates.models import ModuleTemplate
from module_templates.types import ModuleTemplateType, TemplateStatus
from openapi.models import BulkTask
from openapi.services import custom_services
from openapi.structures import VendorContactDetail, VendorContactEntity
from organization.invitation import service as invitation_service
from organization.models import Enterprise, Entity, OrganizationUser
from organization.org_models.entity_settings_model import EntitySetting
from organization.org_models.identification_model import EntityIdentification
from organization.org_models.vendor_master_model import (
    EnterpriseVendorMaster,
    VendorContact,
)
from organization.services import (
    enterprise_service,
    enterprise_user_service,
    entity_service,
    entity_settings_service,
    entity_status_service,
    tag_service,
    vendor_contact_service,
    vendor_master_service,
)
from organization.states import (
    EnterpriseVendorMasterStatus,
    EntityContactStatus,
    EntitySetupInfoType,
    TagType,
    UserRole,
)

from factwise.exception import ValidationException
from factwise.openapi.service import JsonbConcat, make_json_safe
from factwise.utils import set_statement_timeout

domains_to_exclude = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com",
    "aol.com",
    "protonmail.com",
    "tutanota.com",
    "mailfence.com",
    "posteo.net",
    "rediffmail.com",
    "gmx.com",
    "yandex.com",
]


def list_enterprise_vendors(*, enterprise_id, seller_entity_id):
    vendors = (
        vendor_master_service.__get_enterprise_vendors__(enterprise_id)
        .prefetch_related("entityvendormaster_set", "vendorcontact_set")
        .select_related("seller_entity")
    )
    if seller_entity_id:
        vendors = vendors.filter(seller_entity_id=seller_entity_id)
    return vendors


@transaction.atomic
def create_enterprise_vendor(
    *,
    created_by_user_email,
    enterprise_id,
    # vendor_code,
    vendor_name,
    ERP_vendor_code,
    notes,
    tags,
    additional_costs,
    primary_contact,
    secondary_contacts,
    seller_address_information,
    seller_identifications,
    entities,
    custom_sections,
):
    org_user = enterprise_user_service.get_user_by_enterprise_email(
        enterprise_id=enterprise_id, email=created_by_user_email
    )
    if not org_user:
        raise ValidationException("User email does not exist in the enterprise")
    if org_user.role != UserRole.ADMIN_ROLE.value:
        raise ValidationException(
            "Only admin users can perform the actions. Please change the user's email"
        )

    # vendor_master_service.__validate_unique_vendor_code__(
    #     vendor_code=vendor_code, enterprise_id=enterprise_id
    # )

    entity_objs = entity_service.get_entities_via_names(
        entity_names=[entity["entity_name"] for entity in entities],
        enterprise_id=enterprise_id,
    )
    if len(entities) != entity_objs.count():
        raise ValidationException(
            "Input entity(s) not found in the enterprise! Please enter correct entity name(s)"
        )

    entity_ids = entity_objs.values_list("entity_id", flat=True)

    template = ModuleTemplate.objects.get(
        ~Q(status=TemplateStatus.DEPRECATED.value),
        type=ModuleTemplateType.VENDOR_TEMPLATE.value,
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

    cost_names, vendor_additional_costs = [], []
    costs_map = {}
    for cost in additional_costs:
        cost_names.append(cost["name"])
    existing_additional_costs = additional_cost_service.get_additional_costs_from_names(
        enterprise_id=enterprise_id, additional_cost_names=cost_names
    )
    for additional_cost in existing_additional_costs:
        costs_map[additional_cost.cost_name] = additional_cost

    for cost in additional_costs:
        additional_cost = costs_map[cost["name"]]
        vendor_additional_costs.append(
            AdditionalCostDataClass(
                additional_cost_id=additional_cost.additional_cost_id,
                cost_name=cost["name"],
                cost_type=additional_cost.cost_type,
                allocation_type=additional_cost.allocation_type,
                cost_source=AdditionalCostSource.VENDOR.value,
                cost_value=cost["value"],
            )
        )

    # email_domain_expression = Substr(
    #     "email", Length("email") - Length(Value("@")) + 2, Length("email")
    # )
    # annotated_users = OrganizationUser.objects.annotate(
    #     email_domain=email_domain_expression
    # )
    # matching_users_subquery = (
    #     annotated_users.filter(enterprise=OuterRef("pk"))
    #     .exclude(Q(email_domain__in=domains_to_exclude))
    #     .filter(email_domain__in=[str(primary_contact.primary_email).split("@")[1]])
    # )
    # filtered_enterprises = Enterprise.objects.filter(
    #     enterprise_name__iexact=vendor_name
    # ).filter(Exists(matching_users_subquery))

    filtered_enterprises = []
    users_map, identifications_map = defaultdict(lambda: []), defaultdict(lambda: [])
    enterprise_map = {}

    enterprises = Enterprise.objects.filter(is_virtual=False)
    for enterprise in enterprises:
        enterprise_map[enterprise.enterprise_id] = enterprise

    identifications = EntityIdentification.objects.filter(
        entity__enterprise_id__in=enterprises.values_list("enterprise_id", flat=True)
    )
    for identification in identifications:
        identifications_map[identification.entity.enterprise_id].append(identification)

    users = OrganizationUser.objects.filter(
        enterprise_id__in=enterprises.values_list("enterprise_id", flat=True)
    )
    for user in users:
        if user.email.split("@")[1] not in domains_to_exclude:
            users_map[user.enterprise_id].append(user.email.split("@")[1])

    for user_enterprise_id in users_map:
        if (
            all(
                [
                    domain == primary_contact.primary_email.split("@")[1]
                    for domain in users_map[user_enterprise_id]
                ]
            )
            or enterprise_map[user_enterprise_id].enterprise_name.lower()
            == vendor_name.lower()
            or any(
                [
                    identification.identification_name
                    in identification_struct["identification_name"]
                    and identification.identification_value
                    == identification_struct["identification_value"]
                    for identification in identifications_map[user_enterprise_id]
                    for identification_struct in seller_identifications
                ]
            )
        ):
            filtered_enterprises.append(user_enterprise_id)

    vendor_code = (
        f"{org_user.enterprise_name[:3].upper()}"
        f"VENDOR"
        f"{datetime.datetime.utcnow().strftime('%m%d%Y%H%M%S')}"
        f"{uuid.uuid4().hex[:4].upper()}"
    )
    if filtered_enterprises:
        tags = tag_service.get_or_create_tags(
            tags=tags, enterprise_id=enterprise_id, tag_type=TagType.VENDOR
        )

        if vendor_master_service.validate_unique_ERP_vendor_code(
            enterprise_id=enterprise_id, code=ERP_vendor_code
        ):
            raise ValidationException(
                "SAP Vendor Code already exists in the enterprise"
            )

        enterprise_vendor_master = vendor_master_service.__save_enterprise_vendor__(
            user_id=org_user.user_id,
            enterprise_id=enterprise_id,
            notes=notes,
            tags=tags,
            seller_enterprise_id=None,
            seller_entity_id=None,
            vendor_code=vendor_code,
            vendor_name=vendor_name,
            ERP_vendor_code=ERP_vendor_code,
            seller_address_information=seller_address_information,
            seller_identifications=seller_identifications,
            status=EnterpriseVendorMasterStatus.INVITED.value,
        )
        enterprise_vendor_master.save()
        enterprise_vendor_master_id = (
            enterprise_vendor_master.enterprise_vendor_master_id
        )

        additional_costs_to_create, _ = additional_cost_service.handle_additional_costs(
            type=AdditionalCostType.ADDITIONAL_COST.value,
            enterprise_id=enterprise_id,
            module=AdditionalCostLinkageModule.VENDOR.value,
            enterprise_vendor_master_id=enterprise_vendor_master_id,
            additional_costs=vendor_additional_costs,
        )
        AdditionalCostLinkage.objects.bulk_create(additional_costs_to_create)

        (
            custom_sections_to_create,
            _,
            custom_fields_to_create,
            custom_fields_attachments_to_create_map,
            _,
        ) = custom_service.create_custom_sections(
            user_id=org_user.user_id,
            custom_sections=custom_sections,
            enterprise_id=user.enterprise_id,
            enterprise_vendor_master_id=enterprise_vendor_master_id,
            custom_section_map={},
        )
        CustomSection.objects.bulk_create(custom_sections_to_create)
        CustomField.objects.bulk_create(custom_fields_to_create)
        for custom_field in custom_fields_to_create:
            attachments = custom_fields_attachments_to_create_map[
                custom_field.custom_field_id
            ]
            custom_field.attachment_values.add(*attachments)

        vendor_contact = vendor_contact_service.save_vendor_contact(
            user_id=org_user.user_id,
            enterprise_vendor_master_id=enterprise_vendor_master_id,
            buyer_enterprise_id=enterprise_id,
            seller_enterprise_id=None,
            seller_entity_id=None,
            vendor_user_id=None,
            full_name=primary_contact.full_name,
            primary_email=primary_contact.primary_email,
            phone_numbers=primary_contact.phone_numbers,
            tags=primary_contact.tags,
            notes=primary_contact.notes,
            is_primary=True,
            status=EntityContactStatus.INVITED.value,
        )
        vendor_contact.save()

        for entity_id in entity_ids:
            entity_vendor_master = vendor_master_service._link_entity_master(
                user_id=org_user.user_id,
                enterprise_vendor_master=enterprise_vendor_master,
                entity_id=entity_id,
            )
            entity_vendor_master.save()

            entity_primary_vendor_contact = vendor_contact_service.save_vendor_contact(
                user_id=org_user.user_id,
                enterprise_vendor_master_id=enterprise_vendor_master_id,
                entity_vendor_master_id=entity_vendor_master.entity_vendor_master_id,
                buyer_enterprise_id=enterprise_id,
                seller_enterprise_id=None,
                seller_entity_id=None,
                vendor_user_id=None,
                full_name=primary_contact.full_name,
                primary_email=primary_contact.primary_email,
                phone_numbers=primary_contact.phone_numbers,
                tags=primary_contact.tags,
                notes=primary_contact.notes,
                is_primary=True,
                status=EntityContactStatus.INVITED.value,
                buyer_entity_id=entity_id,
            )
            entity_primary_vendor_contact.save()

            for secondary_contact in secondary_contacts:
                entity_secondary_vendor_contact = vendor_contact_service.save_vendor_contact(
                    user_id=org_user.user_id,
                    enterprise_vendor_master_id=enterprise_vendor_master_id,
                    entity_vendor_master_id=entity_vendor_master.entity_vendor_master_id,
                    buyer_enterprise_id=enterprise_id,
                    seller_enterprise_id=None,
                    seller_entity_id=None,
                    vendor_user_id=None,
                    full_name=secondary_contact.full_name,
                    primary_email=secondary_contact.primary_email,
                    phone_numbers=secondary_contact.phone_numbers,
                    tags=secondary_contact.tags,
                    notes=secondary_contact.notes,
                    is_primary=False,
                    status=EntityContactStatus.INVITED.value,
                    buyer_entity_id=entity_id,
                )
                entity_secondary_vendor_contact.save()
    else:
        if vendor_master_service.validate_unique_ERP_vendor_code(
            enterprise_id=enterprise_id, code=ERP_vendor_code
        ):
            raise ValidationException(
                "SAP Vendor Code already exists in the enterprise"
            )

        enterprise_vendor_master = vendor_master_service.admin_invite_enterprise_vendor(
            user_id=org_user.user_id,
            entity_ids=entity_objs.values_list("entity_id", flat=True),
            vendor_code=vendor_code,
            ERP_vendor_code=ERP_vendor_code,
            vendor_name=vendor_name,
            seller_address_information=seller_address_information,
            seller_identifications=seller_identifications,
            additional_costs=vendor_additional_costs,
            notes=notes,
            tags=tags,
            primary_contact=primary_contact,
            secondary_contacts=secondary_contacts,
            custom_sections=custom_sections,
        )

    for entity_id in entity_ids:
        entity_status_service.validate_and_update_entity_status(
            enterprise_id=enterprise_id,
            entity_id=entity_id,
            model_name=EntitySetupInfoType.VENDOR,
        )

    return enterprise_vendor_master.enterprise_vendor_master_id


def _create_vendors_bulk_impl(*, enterprise_id, vendors_payload, task_id=None):
    results = []

    if task_id:
        BulkTask.objects.filter(task_id=task_id).update(status="running")

    # ---------- Prefetch users ----------
    emails = {v["created_by_user_email"] for v in vendors_payload}
    user_map = enterprise_user_service.get_users_by_enterprise_emails(
        enterprise_id=enterprise_id,
        emails=emails,
    )

    # ---------- Prefetch entities ----------
    entity_names = {
        e["entity_name"] for v in vendors_payload for e in v.get("entities", [])
    }

    entities = Entity.objects.filter(
        enterprise_id=enterprise_id,
        entity_name__in=entity_names,
    )
    entity_map = {e.entity_name: e for e in entities}

    # ---------- Vendor template (single per enterprise) ----------
    template = ModuleTemplate.objects.get(
        ~Q(status=TemplateStatus.DEPRECATED.value),
        type=ModuleTemplateType.VENDOR_TEMPLATE.value,
        enterprise_id=enterprise_id,
        deleted_datetime__isnull=True,
    )

    template_sections = module_template_service.get_template_sections(
        template_id=template.template_id
    )
    template_section_map = {s.alternate_name: s for s in template_sections}

    template_items = module_template_service.get_template_section_items(
        template_id=template.template_id
    ).filter(is_builtin_field=False)

    template_section_item_map = {
        (i.section.alternate_name, i.alternate_name): i for i in template_items
    }

    template_item_names = {i.alternate_name for i in template_items}

    # ---------- Prefetch additional costs ----------
    all_cost_names = set()
    invalid_template_costs = set()

    for v in vendors_payload:
        for c in v.get("additional_costs", []):
            name = c.get("name")
            if name in template_item_names:
                all_cost_names.add(name)
            else:
                invalid_template_costs.add(name)
    if invalid_template_costs:
        raise ValidationException(
            f"Additional cost(s) not present in vendor template: {', '.join(invalid_template_costs)}"
        )

    additional_costs = additional_cost_service.get_additional_costs_from_names(
        enterprise_id=enterprise_id,
        additional_cost_names=list(all_cost_names),
    )
    additional_cost_map = {c.cost_name: c for c in additional_costs}

    # ---------- Prefetch enterprises / users / identifications (filtered_enterprises logic) ----------
    enterprises = Enterprise.objects.filter(is_virtual=False)
    enterprise_map = {e.enterprise_id: e for e in enterprises}

    identifications = EntityIdentification.objects.filter(
        entity__enterprise_id__in=enterprise_map.keys()
    )
    identifications_map = defaultdict(list)
    for i in identifications:
        identifications_map[i.entity.enterprise_id].append(i)

    users = OrganizationUser.objects.filter(enterprise_id__in=enterprise_map.keys())
    users_map = defaultdict(list)
    for u in users:
        domain = u.email.split("@")[1]
        if domain not in domains_to_exclude:
            users_map[u.enterprise_id].append(domain)

    # ---------- Main loop ----------
    for index, payload in enumerate(vendors_payload):
        try:
            with transaction.atomic():
                set_statement_timeout(900000)

                # ---- user validation ----
                org_user = user_map.get(payload["created_by_user_email"])
                if not org_user:
                    raise ValidationException(
                        "User email does not exist in the enterprise"
                    )
                if org_user.role != UserRole.ADMIN_ROLE.value:
                    raise ValidationException(
                        "Only admin users can perform the actions. Please change the user's email"
                    )

                # ---- entity validation ----
                entity_objs = []
                for e in payload.get("entities", []):
                    entity = entity_map.get(e["entity_name"])
                    if not entity:
                        raise ValidationException(
                            "Input entity(s) not found in the enterprise! Please enter correct entity name(s)"
                        )
                    entity_objs.append(entity)

                entity_ids = [e.entity_id for e in entity_objs]

                # ---- email validation ----
                primary_email = payload["primary_contact"].primary_email.lower()
                secondary_emails = [
                    s.primary_email.lower()
                    for s in payload.get("secondary_contacts", [])
                ]

                # primary vs secondary
                if primary_email in secondary_emails:
                    raise ValidationException(
                        "Primary contact email cannot be the same as a secondary contact email"
                    )

                # duplicate secondary contacts
                if len(secondary_emails) != len(set(secondary_emails)):
                    raise ValidationException(
                        "Duplicate secondary contact emails are not allowed"
                    )

                # ---- custom sections validation ----
                custom_sections = (
                    custom_services.validate_and_autofill_custom_sections_from_template(
                        custom_sections=payload.get("custom_sections", []),
                        template_section_map=template_section_map,
                        template_section_item_map=template_section_item_map,
                    )
                )

                # ---- additional costs mapping ----
                vendor_additional_costs = []
                for cost in payload.get("additional_costs", []):
                    cost_name = cost.get("name")
                    ac = additional_cost_map.get(cost_name)
                    if not ac:
                        raise ValidationException(
                            f"Invalid additional cost: {cost.get('name')}"
                        )
                    vendor_additional_costs.append(
                        AdditionalCostDataClass(
                            additional_cost_id=ac.additional_cost_id,
                            cost_name=cost.get("name"),
                            cost_type=ac.cost_type,
                            allocation_type=ac.allocation_type,
                            cost_source=AdditionalCostSource.VENDOR.value,
                            cost_value=cost.get("value"),
                        )
                    )

                # ---- filtered_enterprises logic (unchanged) ----
                filtered_enterprises = []
                primary_email_domain = payload["primary_contact"].primary_email.split(
                    "@"
                )[1]

                for eid, domains in users_map.items():
                    if (
                        all(d == primary_email_domain for d in domains)
                        or enterprise_map[eid].enterprise_name.lower()
                        == payload["vendor_name"].lower()
                        or (
                            payload.get("seller_identifications")
                            and any(
                                i.identification_name
                                in ident.get("identification_name")
                                and i.identification_value
                                == ident.get("identification_value")
                                for i in identifications_map[eid]
                                for ident in payload.get("seller_identifications")
                            )
                        )
                    ):
                        filtered_enterprises.append(eid)

                vendor_code_input = payload.get("factwise_vendor_code")
                if not vendor_code_input:
                    vendor_code = (
                        f"{org_user.enterprise_name[:3].upper()}"
                        f"VENDOR"
                        f"{datetime.datetime.utcnow().strftime('%m%d%Y%H%M%S')}"
                        f"{uuid.uuid4().hex[:4].upper()}"
                    )
                else:
                    vendor_master_service.validate_unique_vendor_code(
                        vendor_code=vendor_code_input, enterprise_id=enterprise_id
                    )
                    vendor_code = vendor_code_input

                # ---- BRANCH EXACTLY AS SINGLE CREATE ----
                if filtered_enterprises:
                    tags = tag_service.get_or_create_tags(
                        tags=payload.get("tags"),
                        enterprise_id=enterprise_id,
                        tag_type=TagType.VENDOR,
                    )

                    if vendor_master_service.validate_unique_ERP_vendor_code(
                        enterprise_id=enterprise_id,
                        code=payload.get("ERP_vendor_code"),
                    ):
                        raise ValidationException(
                            "SAP Vendor Code already exists in the enterprise"
                        )

                    evm = vendor_master_service.__save_enterprise_vendor__(
                        user_id=org_user.user_id,
                        enterprise_id=enterprise_id,
                        notes=payload.get("notes"),
                        tags=tags,
                        seller_enterprise_id=None,
                        seller_entity_id=None,
                        vendor_code=vendor_code,
                        vendor_name=payload["vendor_name"],
                        ERP_vendor_code=payload.get("ERP_vendor_code"),
                        seller_address_information=payload.get(
                            "seller_address_information"
                        ),
                        seller_identifications=payload.get("seller_identifications"),
                        status=EnterpriseVendorMasterStatus.INVITED.value,
                    )
                    evm.save()

                    enterprise_vendor_master_id = evm.enterprise_vendor_master_id

                    costs_to_create, _ = (
                        additional_cost_service.handle_additional_costs(
                            type=AdditionalCostType.ADDITIONAL_COST.value,
                            enterprise_id=enterprise_id,
                            module=AdditionalCostLinkageModule.VENDOR.value,
                            enterprise_vendor_master_id=enterprise_vendor_master_id,
                            additional_costs=vendor_additional_costs,
                        )
                    )
                    AdditionalCostLinkage.objects.bulk_create(costs_to_create)

                    (
                        sections_to_create,
                        _,
                        fields_to_create,
                        attachments_map,
                        _,
                    ) = custom_service.create_custom_sections(
                        user_id=org_user.user_id,
                        custom_sections=custom_sections,
                        enterprise_id=enterprise_id,
                        enterprise_vendor_master_id=enterprise_vendor_master_id,
                        custom_section_map={},
                    )

                    CustomSection.objects.bulk_create(sections_to_create)
                    CustomField.objects.bulk_create(fields_to_create)
                    for f in fields_to_create:
                        f.attachment_values.add(*attachments_map[f.custom_field_id])

                    vendor_contact = vendor_contact_service.save_vendor_contact(
                        user_id=org_user.user_id,
                        enterprise_vendor_master_id=enterprise_vendor_master_id,
                        buyer_enterprise_id=enterprise_id,
                        seller_enterprise_id=None,
                        seller_entity_id=None,
                        vendor_user_id=None,
                        full_name=payload["primary_contact"].full_name,
                        primary_email=payload["primary_contact"].primary_email,
                        phone_numbers=payload["primary_contact"].phone_numbers,
                        tags=payload["primary_contact"].tags,
                        notes=payload["primary_contact"].notes,
                        is_primary=True,
                        status=EntityContactStatus.INVITED.value,
                    )
                    vendor_contact.save()

                    for entity in entity_objs:
                        evm_entity = vendor_master_service._link_entity_master(
                            user_id=org_user.user_id,
                            enterprise_vendor_master=evm,
                            entity_id=entity.entity_id,
                        )
                        evm_entity.save()

                        # ---- entity-level primary contact ----
                        entity_primary_contact = vendor_contact_service.save_vendor_contact(
                            user_id=org_user.user_id,
                            enterprise_vendor_master_id=enterprise_vendor_master_id,
                            entity_vendor_master_id=evm_entity.entity_vendor_master_id,
                            buyer_enterprise_id=enterprise_id,
                            seller_enterprise_id=None,
                            seller_entity_id=None,
                            vendor_user_id=None,
                            full_name=payload["primary_contact"].full_name,
                            primary_email=payload["primary_contact"].primary_email,
                            phone_numbers=payload["primary_contact"].phone_numbers,
                            tags=payload["primary_contact"].tags,
                            notes=payload["primary_contact"].notes,
                            is_primary=True,
                            status=EntityContactStatus.INVITED.value,
                            buyer_entity_id=entity.entity_id,
                        )
                        entity_primary_contact.save()

                        # ---- entity-level secondary contacts ----
                        for secondary in payload.get("secondary_contacts", []):
                            entity_secondary_contact = vendor_contact_service.save_vendor_contact(
                                user_id=org_user.user_id,
                                enterprise_vendor_master_id=enterprise_vendor_master_id,
                                entity_vendor_master_id=evm_entity.entity_vendor_master_id,
                                buyer_enterprise_id=enterprise_id,
                                seller_enterprise_id=None,
                                seller_entity_id=None,
                                vendor_user_id=None,
                                full_name=secondary.full_name,
                                primary_email=secondary.primary_email,
                                phone_numbers=secondary.phone_numbers,
                                tags=secondary.tags,
                                notes=secondary.notes,
                                is_primary=False,
                                status=EntityContactStatus.INVITED.value,
                                buyer_entity_id=entity.entity_id,
                            )
                            entity_secondary_contact.save()
                else:
                    if vendor_master_service.validate_unique_ERP_vendor_code(
                        enterprise_id=enterprise_id,
                        code=payload.get("ERP_vendor_code"),
                    ):
                        raise ValidationException(
                            "SAP Vendor Code already exists in the enterprise"
                        )

                    evm = vendor_master_service.admin_invite_enterprise_vendor(
                        user_id=org_user.user_id,
                        entity_ids=entity_ids,
                        vendor_code=vendor_code,
                        ERP_vendor_code=payload.get("ERP_vendor_code"),
                        vendor_name=payload["vendor_name"],
                        seller_address_information=payload.get(
                            "seller_address_information"
                        ),
                        seller_identifications=payload.get("seller_identifications"),
                        additional_costs=vendor_additional_costs,
                        notes=payload.get("notes"),
                        tags=payload.get("tags"),
                        primary_contact=payload.get("primary_contact"),
                        secondary_contacts=payload.get("secondary_contacts", []),
                        custom_sections=custom_sections,
                    )

                for entity_id in entity_ids:
                    entity_status_service.validate_and_update_entity_status(
                        enterprise_id=enterprise_id,
                        entity_id=entity_id,
                        model_name=EntitySetupInfoType.VENDOR,
                    )

            results.append(
                {
                    "index": index,
                    "status": "success",
                    "erp_vendor_code": evm.ERP_vendor_code,
                    "vendor_code": evm.vendor_code,
                    "vendor_id": str(evm.enterprise_vendor_master_id),
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
                "erp_vendor_code": payload.get("ERP_vendor_code"),
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
        "total": len(vendors_payload),
        "success": sum(r["status"] == "success" for r in results),
        "failed": sum(r["status"] == "failed" for r in results),
        "results": results,
    }


@shared_task(
    bind=True, name="factwise.openapi.services.vendor_services.create_vendors_bulk_task"
)
def create_vendors_bulk_task(self, *, enterprise_id, vendors_payload, task_id):
    try:
        return _create_vendors_bulk_impl(
            enterprise_id=enterprise_id,
            vendors_payload=vendors_payload,
            task_id=task_id,
        )
    except Exception as exc:
        BulkTask.objects.filter(task_id=task_id).update(
            status="failed",
            error=str(exc),
        )
        raise


ASYNC_VENDOR_THRESHOLD = 10000


def create_vendors_bulk(
    *, enterprise_id, vendors_payload, total_len, validation_errors
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

    total = len(vendors_payload)

    if total >= ASYNC_VENDOR_THRESHOLD:
        task_id = uuid.uuid4()
        BulkTask.objects.create(
            task_id=task_id,
            task_type="vendor",
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
                    "erp_vendor_code": e.get("erp_vendor_code"),
                    "error": e["error"],
                }
                for e in validation_errors
            ],
        )

        create_vendors_bulk_task.delay(  # type: ignore
            enterprise_id=enterprise_id,
            vendors_payload=make_json_safe(vendors_payload),
            task_id=str(task_id),
        )

        return {
            "status": "accepted",
            "mode": "async",
            "task_id": str(task_id),
        }

    return _create_vendors_bulk_impl(
        enterprise_id=enterprise_id,
        vendors_payload=vendors_payload,
    )


@transaction.atomic
def update_enterprise_vendor(
    *,
    modified_by_user_email,
    enterprise_id,
    ERP_vendor_code,
    factwise_vendor_code,
    # vendor_code,
    vendor_name,
    seller_address_information,
    seller_identifications,
    notes,
    tags,
    additional_costs,
    entities,
    custom_sections,
):
    org_user = enterprise_user_service.get_user_by_enterprise_email(
        enterprise_id=enterprise_id, email=modified_by_user_email
    )
    if not org_user:
        raise ValidationException("User email does not exist in the enterprise")
    if org_user.role != UserRole.ADMIN_ROLE.value:
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

    cost_names, vendor_additional_costs = [], []
    costs_map = {}

    for cost in additional_costs:
        cost_names.append(cost["name"])

    existing_additional_costs = additional_cost_service.get_additional_costs_from_names(
        enterprise_id=enterprise_id, additional_cost_names=cost_names
    )
    for additional_cost in existing_additional_costs:
        costs_map[additional_cost.cost_name] = additional_cost

    template = ModuleTemplate.objects.get(
        ~Q(status=TemplateStatus.DEPRECATED.value),
        type=ModuleTemplateType.VENDOR_TEMPLATE.value,
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

    for cost in additional_costs:
        additional_cost = costs_map[cost["name"]]
        vendor_additional_costs.append(
            AdditionalCostDataClass(
                additional_cost_id=additional_cost.additional_cost_id,
                cost_name=cost["name"],
                cost_type=additional_cost.cost_type,
                allocation_type=additional_cost.allocation_type,
                cost_source=AdditionalCostSource.VENDOR.value,
                cost_value=cost["value"],
            )
        )

    try:
        if factwise_vendor_code:
            enterprise_vendor_master = (
                vendor_master_service.get_enterprise_vendor_master_via_code(
                    buyer_enterprise_id=enterprise_id, vendor_code=factwise_vendor_code
                )
            )
            vendor_code = enterprise_vendor_master.vendor_code
        else:
            enterprise_vendor_master = (
                vendor_master_service.get_enterprise_vendor_master_via_ERP_vendor_code(
                    buyer_enterprise_id=enterprise_id, ERP_vendor_code=ERP_vendor_code
                )
            )
            vendor_code = enterprise_vendor_master.vendor_code
    except EnterpriseVendorMaster.DoesNotExist:
        raise ValidationException("Vendor with SAP vendor Code does not exist")

    primary_vendor_contact = VendorContact.objects.filter(
        enterprise_vendor_master_id=enterprise_vendor_master.enterprise_vendor_master_id,
        is_primary=True,
    ).first()
    if enterprise_vendor_master.status == EnterpriseVendorMasterStatus.PENDING.value:
        filtered_enterprises = []
        users_map, identifications_map = defaultdict(lambda: []), defaultdict(
            lambda: []
        )
        enterprise_map = {}

        enterprises = Enterprise.objects.filter(is_virtual=False)
        for enterprise in enterprises:
            enterprise_map[enterprise.enterprise_id] = enterprise

        identifications = EntityIdentification.objects.filter(
            entity__enterprise_id__in=enterprises.values_list(
                "enterprise_id", flat=True
            )
        )
        for identification in identifications:
            identifications_map[identification.entity.enterprise_id].append(
                identification
            )

        users = OrganizationUser.objects.filter(
            enterprise_id__in=enterprises.values_list("enterprise_id", flat=True)
        )
        for user in users:
            if user.email.split("@")[1] not in domains_to_exclude:
                users_map[user.enterprise_id].append(user.email.split("@")[1])

        for enterprise_id in users_map:
            if (
                all(
                    [
                        domain == primary_vendor_contact.primary_email.split("@")[1]
                        for domain in users_map[enterprise_id]
                    ]
                )
                or enterprise_map[enterprise_id].enterprise_name.lower()
                == vendor_name.lower()
                or any(
                    [
                        identification.identification_name
                        in identification_struct["identification_name"]
                        and identification.identification_value
                        == identification_struct["identification_value"]
                        for identification in identifications_map[enterprise_id]
                        for identification_struct in seller_identifications
                    ]
                )
            ):
                filtered_enterprises.append(enterprise_id)

        if filtered_enterprises:
            vendor_master_service.admin_update_enterprise_vendor(
                user_id=org_user.user_id,
                enterprise_vendor_master_id=enterprise_vendor_master.enterprise_vendor_master_id,
                vendor_code=vendor_code,
                vendor_name=vendor_name,
                seller_address_information=seller_address_information,
                seller_identifications=seller_identifications,
                custom_sections=custom_sections,
                notes=notes,
                tags=tags,
                additional_costs=vendor_additional_costs,
            )
        else:
            enterprise = enterprise_service.create_new_enterprise(
                enterprise_name=vendor_name,
                dba=None,
                is_virtual=True,
                user_id=org_user.user_id,
            )
            enterprise.save()
            entity = entity_service.create_new_entity(
                enterprise_id=enterprise.enterprise_id,
                entity_name=vendor_name,
                websites=[],
                is_virtual=True,
                user_id=org_user.user_id,
            )
            entity.save()
            entity_settings = entity_settings_service.enable_default_entity_settings(
                user_id=org_user.user_id,
                entity_id=entity.entity_id,
                enterprise_id=enterprise.enterprise_id,
            )
            EntitySetting.objects.bulk_create(entity_settings)

            enterprise_vendor_master.seller_enterprise_id = enterprise.enterprise_id
            enterprise_vendor_master.seller_entity_id = entity.entity_id
            enterprise_vendor_master.save()
    else:
        vendor_master_service.admin_update_enterprise_vendor(
            user_id=org_user.user_id,
            enterprise_vendor_master_id=enterprise_vendor_master.enterprise_vendor_master_id,
            vendor_code=vendor_code,
            vendor_name=vendor_name,
            seller_address_information=seller_address_information,
            seller_identifications=seller_identifications,
            notes=notes,
            tags=tags,
            additional_costs=vendor_additional_costs,
            custom_sections=custom_sections,
        )


def _update_vendors_bulk_impl(*, enterprise_id, vendors_payload, task_id=None):
    results = []

    if task_id:
        BulkTask.objects.filter(task_id=task_id).update(status="running")

    # ---------- Prefetch users ----------
    emails = {v["modified_by_user_email"] for v in vendors_payload}
    user_map = enterprise_user_service.get_users_by_enterprise_emails(
        enterprise_id=enterprise_id,
        emails=emails,
    )

    # ---------- Main loop ----------
    for index, payload in enumerate(vendors_payload):
        try:
            with transaction.atomic():
                set_statement_timeout(900000)

                # ---- user validation ----
                org_user = user_map.get(payload["modified_by_user_email"])
                if not org_user:
                    raise ValidationException(
                        "User email does not exist in the enterprise"
                    )
                if org_user.role != UserRole.ADMIN_ROLE.value:
                    raise ValidationException(
                        "Only admin users can perform the actions. Please change the user's email"
                    )

                # ---- entity validation ----
                entity_objs = entity_service.get_entities_via_names(
                    entity_names=[
                        e["entity_name"] for e in payload.get("entities", [])
                    ],
                    enterprise_id=enterprise_id,
                )
                if len(payload.get("entities", [])) != entity_objs.count():
                    raise ValidationException(
                        "Input entity(s) not found in the enterprise! Please enter correct entity name(s)"
                    )

                # ---- template & custom sections ----
                template = ModuleTemplate.objects.get(
                    ~Q(status=TemplateStatus.DEPRECATED.value),
                    type=ModuleTemplateType.VENDOR_TEMPLATE.value,
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
                template_section_items = (
                    module_template_service.get_template_section_items(
                        template_id=template_id
                    ).filter(is_builtin_field=False)
                )
                template_section_item_map = {
                    (
                        section_item.section.alternate_name,
                        section_item.alternate_name,
                    ): section_item
                    for section_item in template_section_items
                }
                custom_sections = (
                    custom_services.validate_and_autofill_custom_sections_from_template(
                        custom_sections=payload.get("custom_sections"),
                        template_section_map=template_section_map,
                        template_section_item_map=template_section_item_map,
                    )
                )

                template_item_names = {i.alternate_name for i in template_section_items}

                # ---- additional costs ----
                cost_names, vendor_additional_costs = [], []
                costs_map = {}
                invalid_template_costs = set()

                for cost in payload.get("additional_costs", []):
                    name = cost.get("name")

                    if name not in template_item_names:
                        invalid_template_costs.add(name)
                    else:
                        cost_names.append(name)

                if invalid_template_costs:
                    raise ValidationException(
                        f"Additional cost(s) not present in vendor template: {', '.join(invalid_template_costs)}"
                    )

                existing_additional_costs = (
                    additional_cost_service.get_additional_costs_from_names(
                        enterprise_id=enterprise_id,
                        additional_cost_names=cost_names,
                    )
                )
                for additional_cost in existing_additional_costs:
                    costs_map[additional_cost.cost_name] = additional_cost

                for cost in payload.get("additional_costs", []):
                    cost_name = cost.get("name")
                    ac = costs_map.get(cost_name)
                    if not ac:
                        raise ValidationException(
                            f"Invalid additional cost: {cost.get('name')}"
                        )
                    vendor_additional_costs.append(
                        AdditionalCostDataClass(
                            additional_cost_id=ac.additional_cost_id,
                            cost_name=cost.get("name"),
                            cost_type=ac.cost_type,
                            allocation_type=ac.allocation_type,
                            cost_source=AdditionalCostSource.VENDOR.value,
                            cost_value=cost.get("value"),
                        )
                    )

                # ---- vendor master lookup ----
                try:
                    if payload.get("factwise_vendor_code"):
                        evm = (
                            vendor_master_service.get_enterprise_vendor_master_via_code(
                                buyer_enterprise_id=enterprise_id,
                                vendor_code=payload.get("factwise_vendor_code"),
                            )
                        )
                        vendor_code = evm.vendor_code
                        if payload.get("ERP_vendor_code") and (
                            evm.ERP_vendor_code != payload.get("ERP_vendor_code")
                        ):
                            raise ValidationException(
                                f"SAP vendor code is invalid for vendor with factwise vendor code {vendor_code}"
                            )
                    else:
                        evm = vendor_master_service.get_enterprise_vendor_master_via_ERP_vendor_code(
                            buyer_enterprise_id=enterprise_id,
                            ERP_vendor_code=payload.get("ERP_vendor_code"),
                        )
                        vendor_code = evm.vendor_code
                except EnterpriseVendorMaster.DoesNotExist:
                    raise ValidationException(
                        "Vendor with SAP vendor code does not exist"
                    )

                # ---- primary contact ----
                primary_vendor_contact = VendorContact.objects.filter(
                    enterprise_vendor_master_id=evm.enterprise_vendor_master_id,
                    is_primary=True,
                ).first()

                # ---- status-based behavior ----
                if evm.status == EnterpriseVendorMasterStatus.PENDING.value:
                    filtered_enterprises = []
                    users_map = defaultdict(lambda: [])
                    identifications_map = defaultdict(lambda: [])
                    enterprise_map = {}

                    enterprises = Enterprise.objects.filter(is_virtual=False)
                    for enterprise in enterprises:
                        enterprise_map[enterprise.enterprise_id] = enterprise

                    identifications = EntityIdentification.objects.filter(
                        entity__enterprise_id__in=enterprises.values_list(
                            "enterprise_id", flat=True
                        )
                    )
                    for identification in identifications:
                        identifications_map[identification.entity.enterprise_id].append(
                            identification
                        )

                    users = OrganizationUser.objects.filter(
                        enterprise_id__in=enterprises.values_list(
                            "enterprise_id", flat=True
                        )
                    )
                    for user in users:
                        if user.email.split("@")[1] not in domains_to_exclude:
                            users_map[user.enterprise_id].append(
                                user.email.split("@")[1]
                            )

                    for enterprise_id_ in users_map:
                        if (
                            all(
                                domain
                                == primary_vendor_contact.primary_email.split("@")[1]
                                for domain in users_map[enterprise_id_]
                            )
                            or enterprise_map[enterprise_id_].enterprise_name.lower()
                            == payload["vendor_name"].lower()
                            or any(
                                identification.identification_name
                                in identification_struct.get("identification_name")
                                and identification.identification_value
                                == identification_struct.get("identification_value")
                                for identification in identifications_map[
                                    enterprise_id_
                                ]
                                for identification_struct in payload.get(
                                    "seller_identifications", []
                                )
                            )
                        ):
                            filtered_enterprises.append(enterprise_id_)

                    if filtered_enterprises:
                        vendor_master_service.admin_update_enterprise_vendor(
                            user_id=org_user.user_id,
                            enterprise_vendor_master_id=evm.enterprise_vendor_master_id,
                            vendor_code=vendor_code,
                            vendor_name=payload["vendor_name"],
                            seller_address_information=payload.get(
                                "seller_address_information"
                            ),
                            seller_identifications=payload.get(
                                "seller_identifications"
                            ),
                            custom_sections=custom_sections,
                            notes=payload.get("notes"),
                            tags=payload.get("tags"),
                            additional_costs=vendor_additional_costs,
                        )
                    else:
                        enterprise = enterprise_service.create_new_enterprise(
                            enterprise_name=payload["vendor_name"],
                            dba=None,
                            is_virtual=True,
                            user_id=org_user.user_id,
                        )
                        enterprise.save()

                        entity = entity_service.create_new_entity(
                            enterprise_id=enterprise.enterprise_id,
                            entity_name=payload["vendor_name"],
                            websites=[],
                            is_virtual=True,
                            user_id=org_user.user_id,
                        )
                        entity.save()

                        entity_settings = (
                            entity_settings_service.enable_default_entity_settings(
                                user_id=org_user.user_id,
                                entity_id=entity.entity_id,
                                enterprise_id=enterprise.enterprise_id,
                            )
                        )
                        EntitySetting.objects.bulk_create(entity_settings)

                        evm.seller_enterprise_id = enterprise.enterprise_id
                        evm.seller_entity_id = entity.entity_id
                        evm.save()
                else:
                    vendor_master_service.admin_update_enterprise_vendor(
                        user_id=org_user.user_id,
                        enterprise_vendor_master_id=evm.enterprise_vendor_master_id,
                        vendor_code=vendor_code,
                        vendor_name=payload["vendor_name"],
                        seller_address_information=payload.get(
                            "seller_address_information"
                        ),
                        seller_identifications=payload.get("seller_identifications"),
                        notes=payload.get("notes"),
                        tags=payload.get("tags"),
                        additional_costs=vendor_additional_costs,
                        custom_sections=custom_sections,
                    )

            results.append(
                {
                    "index": index,
                    "status": "success",
                    "erp_vendor_code": evm.ERP_vendor_code,
                    "vendor_code": evm.vendor_code,
                    "vendor_id": str(evm.enterprise_vendor_master_id),
                }
            )

            if task_id:
                BulkTask.objects.filter(task_id=task_id).update(
                    processed=F("processed") + 1,
                    success=F("success") + 1,
                    results=JsonbConcat(
                        F("results"),
                        Value([results[-1]], output_field=JSONField()),
                    ),
                )

        except Exception as exc:
            failure = {
                "index": index,
                "status": "failed",
                "erp_vendor_code": payload.get("ERP_vendor_code"),
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
        "total": len(vendors_payload),
        "success": sum(r["status"] == "success" for r in results),
        "failed": sum(r["status"] == "failed" for r in results),
        "results": results,
    }


@shared_task(
    bind=True, name="factwise.openapi.services.vendor_services.update_vendors_bulk_task"
)
def update_vendors_bulk_task(self, *, enterprise_id, vendors_payload, task_id):
    try:
        return _update_vendors_bulk_impl(
            enterprise_id=enterprise_id,
            vendors_payload=vendors_payload,
            task_id=task_id,
        )
    except Exception as exc:
        BulkTask.objects.filter(task_id=task_id).update(
            status="failed",
            error=str(exc),
        )
        raise


def update_vendors_bulk(
    *, enterprise_id, vendors_payload, total_len, validation_errors
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

    total = len(vendors_payload)

    if total >= ASYNC_VENDOR_THRESHOLD:
        task_id = uuid.uuid4()
        BulkTask.objects.create(
            task_id=task_id,
            task_type="vendor",
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
                    "erp_vendor_code": e.get("erp_vendor_code"),
                    "error": e["error"],
                }
                for e in validation_errors
            ],
        )

        update_vendors_bulk_task.delay(  # type: ignore
            enterprise_id=enterprise_id,
            vendors_payload=make_json_safe(vendors_payload),
            task_id=str(task_id),
        )

        return {
            "status": "accepted",
            "mode": "async",
            "task_id": str(task_id),
        }

    return _update_vendors_bulk_impl(
        enterprise_id=enterprise_id,
        vendors_payload=vendors_payload,
    )


@transaction.atomic
def update_enterprise_vendor_status(
    *,
    modified_by_user_email,
    enterprise_id,
    ERP_vendor_code,
    factwise_vendor_code,
    status,
):
    org_user = enterprise_user_service.get_user_by_enterprise_email(
        enterprise_id=enterprise_id, email=modified_by_user_email
    )
    if not org_user:
        raise ValidationException("User email does not exist in the enterprise")
    if org_user.role != UserRole.ADMIN_ROLE.value:
        raise ValidationException(
            "Only admin users can perform the actions. Please change the user's email"
        )
    try:
        if factwise_vendor_code:
            enterprise_vendor_master = (
                vendor_master_service.get_enterprise_vendor_master_via_code(
                    buyer_enterprise_id=enterprise_id, vendor_code=factwise_vendor_code
                )
            )
            vendor_code = enterprise_vendor_master.vendor_code
        else:
            enterprise_vendor_master = (
                vendor_master_service.get_enterprise_vendor_master_via_ERP_vendor_code(
                    buyer_enterprise_id=enterprise_id, ERP_vendor_code=ERP_vendor_code
                )
            )
            vendor_code = enterprise_vendor_master.vendor_code
    except EnterpriseVendorMaster.DoesNotExist:
        raise ValidationException("Vendor with SAP vendor Code does not exist")
    vendor_master_service.admin_update_enterprise_vendor_status(
        user_id=org_user.user_id,
        enterprise_vendor_master_id=enterprise_vendor_master.enterprise_vendor_master_id,
        status=status,
    )


def list_vendor_contacts(*, enterprise_id):
    entity_map = defaultdict(list)
    contacts = []

    vendor_contacts = VendorContact.objects.filter(
        buyer_enterprise_id=enterprise_id,
        buyer_entity__isnull=False,
        deleted_datetime__isnull=True,
    )
    for contact in vendor_contacts:
        entity_map[contact.buyer_entity].append(contact)

    for entity in entity_map:
        entity_contacts = []
        for contact in entity_map[entity]:
            entity_contacts.append(VendorContactDetail(**contact.__dict__))

        contacts.append(
            VendorContactEntity(
                buyer_entity_id=entity.entity_id,
                buyer_entity_name=entity.entity_name,
                entity_contacts=entity_contacts,
            )
        )

    return contacts


@transaction.atomic
def vendor_contact_create(
    *,
    created_by_user_email,
    enterprise_id,
    # vendor_code,
    ERP_vendor_code,
    factwise_vendor_code,
    primary_email,
    full_name,
    emails,
    phone_numbers,
    # tags,
    entity_name,
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

    entity = entity_service.get_entity_via_name(
        entity_name=entity_name, enterprise_id=enterprise_id
    )
    if not entity:
        raise ValidationException(
            "Input entity not found in the enterprise! Please enter correct entity name"
        )

    try:
        if factwise_vendor_code:
            enterprise_vendor_master = (
                vendor_master_service.get_enterprise_vendor_master_via_code(
                    buyer_enterprise_id=enterprise_id, vendor_code=factwise_vendor_code
                )
            )
            vendor_code = enterprise_vendor_master.vendor_code
        else:
            enterprise_vendor_master = (
                vendor_master_service.get_enterprise_vendor_master_via_ERP_vendor_code(
                    buyer_enterprise_id=enterprise_id, ERP_vendor_code=ERP_vendor_code
                )
            )
            vendor_code = enterprise_vendor_master.vendor_code
    except EnterpriseVendorMaster.DoesNotExist:
        raise ValidationException("Vendor with SAP vendor Code does not exist")

    exsiting_vendor_contact = VendorContact.objects.filter(
        primary_email=primary_email,
        buyer_enterprise_id=enterprise_id,
        buyer_entity_id=entity.entity_id,
        deleted_datetime__isnull=True,
    )

    if exsiting_vendor_contact.exists():
        raise ValidationException("Vendor contact alreadyexists for the entity")

    vendor_contact_service.admin_invite_entity_vendor_contact(
        user_id=user.user_id,
        buyer_entity_id=entity.entity_id,
        full_name=full_name,
        primary_email=primary_email,
        emails=emails,
        phone_numbers=phone_numbers,
        seller_entity_id=enterprise_vendor_master.seller_entity_id,
        tags=None,
    )


@transaction.atomic
def vendor_contact_update(
    *,
    modified_by_user_email,
    enterprise_id,
    # vendor_code,
    ERP_vendor_code,
    factwise_vendor_code,
    primary_email,
    is_primary,
    full_name,
    emails,
    phone_numbers,
    # tags,
    entity_name,
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

    entity = entity_service.get_entity_via_name(
        entity_name=entity_name, enterprise_id=enterprise_id
    )
    if not entity:
        raise ValidationException(
            "Entity not found in the enterprise! Please enter correct entity name"
        )

    try:
        if factwise_vendor_code:
            enterprise_vendor_master = (
                vendor_master_service.get_enterprise_vendor_master_via_code(
                    buyer_enterprise_id=enterprise_id, vendor_code=factwise_vendor_code
                )
            )
            vendor_code = enterprise_vendor_master.vendor_code
        else:
            enterprise_vendor_master = (
                vendor_master_service.get_enterprise_vendor_master_via_ERP_vendor_code(
                    buyer_enterprise_id=enterprise_id, ERP_vendor_code=ERP_vendor_code
                )
            )
            vendor_code = enterprise_vendor_master.vendor_code
    except EnterpriseVendorMaster.DoesNotExist:
        raise ValidationException("Vendor with SAP vendor Code does not exist")

    vendor_contact = VendorContact.objects.get(
        primary_email=primary_email,
        buyer_enterprise_id=enterprise_id,
        buyer_entity_id=entity.entity_id,
        deleted_datetime__isnull=True,
        enterprise_vendor_master=enterprise_vendor_master,
    )

    vendor_contact_service.admin_update_entity_vendor_contact(
        user_id=user.user_id,
        vendor_contact_id=vendor_contact.vendor_contact_id,
        is_primary=is_primary,
        buyer_entity_id=entity.entity_id,
        seller_entity_id=enterprise_vendor_master.seller_entity_id,
        full_name=full_name,
        emails=emails,
        phone_numbers=phone_numbers,
        tags=None,
    )


@transaction.atomic
def vendor_contact_delete(
    *,
    deleted_by_user_email,
    enterprise_id,
    ERP_vendor_code,
    factwise_vendor_code,
    primary_email,
    entity_name,
):
    user = enterprise_user_service.get_user_by_enterprise_email(
        enterprise_id=enterprise_id, email=deleted_by_user_email
    )
    if not user:
        raise ValidationException("User email does not exist in the enterprise")
    if user.role != UserRole.ADMIN_ROLE.value:
        raise ValidationException(
            "Only admin users can perform the actions. Please change the user's email"
        )

    entity = entity_service.get_entity_via_name(
        entity_name=entity_name, enterprise_id=enterprise_id
    )
    if not entity:
        raise ValidationException(
            "Input entity not found in the enterprise! Please enter correct entity name"
        )

    try:
        if factwise_vendor_code:
            enterprise_vendor_master = (
                vendor_master_service.get_enterprise_vendor_master_via_code(
                    buyer_enterprise_id=enterprise_id, vendor_code=factwise_vendor_code
                )
            )
            vendor_code = enterprise_vendor_master.vendor_code
        else:
            enterprise_vendor_master = (
                vendor_master_service.get_enterprise_vendor_master_via_ERP_vendor_code(
                    buyer_enterprise_id=enterprise_id, ERP_vendor_code=ERP_vendor_code
                )
            )
            vendor_code = enterprise_vendor_master.vendor_code
    except EnterpriseVendorMaster.DoesNotExist:
        raise ValidationException("Vendor with SAP vendor Code does not exist")

    vendor_contact = VendorContact.objects.get(
        primary_email=primary_email,
        buyer_enterprise_id=enterprise_id,
        buyer_entity_id=entity.entity_id,
        deleted_datetime__isnull=True,
        enterprise_vendor_master=enterprise_vendor_master,
    )
    if vendor_contact.is_primary == True:
        ValidationException("Primary contact cannot be deleted")
    else:
        vendor_contact.delete()

    invitation_service.revoke_invite_for_vc(
        enterprise_id=enterprise_id,
        enterprise_vendor_master_id=enterprise_vendor_master.enterprise_vendor_master_id,
        email=primary_email,
    )
