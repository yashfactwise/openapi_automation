import gc
from collections import defaultdict

from additional_costs.models import AdditionalCostLinkage
from attachment.models import Attachment
from attachment.types import AttachmentModuleType
from attributes.models import AttributeLinkage
from cost_calculator.models.costing_sheet_model import CostingSheet
from custom.models import CustomField, CustomSection
from delivery_schedule.models import DeliveryScheduleItem
from django.db import IntegrityError, transaction
from django.db.models import Q
from organization.states import AdditionalCostType

from factwise.custom.states import CustomFieldType


def resolve_custom_field_value(field):
    field_type = field.type

    if field_type in [
        CustomFieldType.SHORTTEXT.value,
        CustomFieldType.LONGTEXT.value,
        CustomFieldType.CHOICE.value,
    ]:
        return field.text_value

    if field_type == CustomFieldType.BOOLEAN.value:
        return field.boolean_value

    if field_type == CustomFieldType.INTEGER.value:
        return field.integer_value

    if field_type == CustomFieldType.PERCENTAGE.value:
        return field.percentage_value

    if field_type == CustomFieldType.FLOAT.value:
        return field.decimal_value

    if field_type == CustomFieldType.CURRENCY.value:
        return field.decimal_value

    if field_type == CustomFieldType.DATETIME.value:
        return field.datetime_value

    if field_type == CustomFieldType.DATE.value:
        return field.date_value

    if field_type == CustomFieldType.EMAIL.value:
        return field.email_value

    if field_type == CustomFieldType.LINK.value:
        return field.link_value

    if field_type == CustomFieldType.MULTI_CHOICE.value:
        return field.multi_choice_value

    if field_type in [
        CustomFieldType.ATTACHMENT.value,
        CustomFieldType.TEMPLATE.value,
    ]:
        return list(field.attachment_values.values_list("attachment_id", flat=True))

    return field.text_value


BATCH_SIZE = 1000


def get_enterprise_costing_sheets(enterprise_id, start_datetime, end_datetime, request):

    clean_path = request.path.rstrip("/").removesuffix("/costing-sheet")

    queryset = (
        CostingSheet.objects.filter(
            seller_enterprise_id=enterprise_id,
            deleted_datetime__isnull=True,
        )
        .filter(Q(modified_datetime__range=(start_datetime, end_datetime)))
        .select_related(
            "seller_entity",
            "customer_entity",
            "currency_code",
            "created_by_user",
            "modified_by_user",
            "project",
        )
        .prefetch_related("customer_contacts")
        .order_by("-modified_datetime")
    )

    response = []

    for sheet in queryset.iterator(chunk_size=1):

        # ---------------- CUSTOMER EMAILS ----------------

        customer_emails = []
        for contact in sheet.customer_contacts.all():
            if contact.primary_email:
                customer_emails.append(contact.primary_email)

            if contact.emails:
                for email_obj in contact.emails:
                    email = email_obj.get("email")
                    if email:
                        customer_emails.append(email)

        # ---------------- SHEET SECTIONS ----------------

        sheet_sections = CustomSection.objects.filter(
            name="Quote Details",
            costing_sheet_id=sheet.costing_sheet_id,
            deleted_datetime__isnull=True,
        )

        custom_sections_data = [
            {
                "name": section.name,
                "custom_fields": [
                    {
                        "name": field.name,
                        "value": resolve_custom_field_value(field),
                    }
                    for field in section.custom_fields
                ],
            }
            for section in sheet_sections.iterator()
        ]

        # ---------------- TEMPLATE ----------------

        template_name = None
        if sheet.additional_details:
            template_id = sheet.additional_details.get("template_id")
            if template_id:
                from module_templates import services as template_service

                template = template_service._get_template(template_id=template_id)
                template_name = template.name if template else None

        # ---------------- SHEET ATTACHMENTS ----------------

        sheet_attachments = [
            request.build_absolute_uri(
                clean_path + f"/attachments/{att.attachment_id}/download/"
            )
            for att in Attachment.objects.filter(
                resource_id__in=[sheet.costing_sheet_id],
                attachment_type__in=[AttachmentModuleType.COSTING_SHEET.value],
            ).only("attachment_id")
        ]

        # ---------------- ITEMS (BATCHED) ----------------

        item_ids = list(
            sheet.costing_sheet_items.values_list("costing_sheet_item_id", flat=True)
        )

        item_sections = list(
            CustomSection.objects.filter(
                costing_sheet=sheet,
                section_type="ITEM",
                deleted_datetime__isnull=True,
            )
        )

        costing_sheet_items_data = []

        for start in range(0, len(item_ids), BATCH_SIZE):

            batch_ids = item_ids[start : start + BATCH_SIZE]

            # -------- ITEM ATTACHMENTS --------

            item_attachment_map = defaultdict(list)

            for att in (
                Attachment.objects.filter(
                    resource_id__in=batch_ids,
                    attachment_type__in=[AttachmentModuleType.COSTING_SHEET_ITEM.value],
                )
                .only("attachment_id")
                .iterator(chunk_size=BATCH_SIZE)
            ):
                item_attachment_map[att.resource_id].append(
                    request.build_absolute_uri(
                        clean_path + f"/attachments/{att.attachment_id}/download/"
                    )
                )

            items = list(
                sheet.costing_sheet_items.filter(costing_sheet_item_id__in=batch_ids)
                .select_related(
                    "enterprise_item",
                    "vendor_entity",
                    "vendor_currency",
                )
                .only(
                    "costing_sheet_item_id",
                    "enterprise_item__code",
                    "enterprise_item__name",
                    "enterprise_item__description",
                    "enterprise_item__item_type",
                    "enterprise_item__notes",
                    "enterprise_item__internal_notes",
                    "enterprise_item__measurement_units",
                    "enterprise_item__custom_ids",
                    "enterprise_item__tags",
                    "vendor_entity__entity_name",
                    "vendor_currency__currency_name",
                    "notes",
                    "quantity",
                    "rate",
                    "total",
                    "procurement_information",
                    "vendor_rate",
                    "created_datetime",
                    "modified_datetime",
                    "deleted_datetime",
                )
            )

            # -------- ATTRIBUTES --------

            attr_map = defaultdict(list)
            attr_qs = AttributeLinkage.objects.filter(
                costing_sheet_item_id__in=batch_ids,
                deleted_datetime__isnull=True,
            ).prefetch_related("attributevaluelinkage_set")

            for attr in attr_qs.iterator(chunk_size=BATCH_SIZE):
                attr_map[attr.costing_sheet_item_id].append(
                    {
                        "attribute_name": attr.attribute_name,
                        "attribute_type": attr.attribute_type,
                        "attribute_value": [
                            {"value": val.value}
                            for val in attr.attributevaluelinkage_set.all()
                        ],
                    }
                )

            # -------- COSTS (ALL TYPES IN ONE QUERY) --------

            add_map = defaultdict(list)
            tax_map = defaultdict(list)
            discount_map = defaultdict(list)

            for cost in AdditionalCostLinkage.objects.filter(
                costing_sheet_item_id__in=batch_ids,
                deleted_datetime__isnull=True,
            ).iterator(chunk_size=BATCH_SIZE):
                data = {"name": cost.cost_name, "value": cost.cost_value}

                if cost.type == AdditionalCostType.ADDITIONAL_COST.value:
                    add_map[cost.costing_sheet_item_id].append(data)
                elif cost.type == AdditionalCostType.TAX.value:
                    tax_map[cost.costing_sheet_item_id].append(data)
                elif cost.type == AdditionalCostType.DISCOUNT.value:
                    discount_map[cost.costing_sheet_item_id].append(data)

            # -------- DELIVERY --------

            delivery_map = defaultdict(list)
            for ds_item in DeliveryScheduleItem.objects.filter(
                costing_sheet_item_id__in=batch_ids,
                deleted_datetime__isnull=True,
            ).iterator(chunk_size=BATCH_SIZE):
                delivery_map[ds_item.costing_sheet_item_id].append(
                    {
                        "quantity": ds_item.quantity,
                        "delivery_date": ds_item.delivery_date,
                    }
                )

            # -------- ITEM FIELDS --------
            field_map = defaultdict(list)
            for field in CustomField.objects.filter(
                costing_sheet_item_id__in=batch_ids,
                deleted_datetime__isnull=True,
            ).iterator(chunk_size=1000):
                field_map[field.costing_sheet_item_id].append(
                    {"name": field.name, "value": resolve_custom_field_value(field)}
                )

            # -------- ENTERPRISE ITEM CUSTOM FIELDS --------
            enterprise_item_ids = [
                item.enterprise_item_id for item in items if item.enterprise_item_id
            ]

            enterprise_item_field_map = defaultdict(list)

            for field in CustomField.objects.filter(
                enterprise_item_id__in=enterprise_item_ids,
                deleted_datetime__isnull=True,
            ).iterator(chunk_size=1000):
                enterprise_item_field_map[field.enterprise_item_id].append(
                    {"name": field.name, "value": resolve_custom_field_value(field)}
                )

            # -------- BUILD ITEMS --------
            for item in items:

                enterprise_item = item.enterprise_item

                costing_sheet_items_data.append(
                    {
                        "item_information": {
                            "factwise_costing_sheet_item_id": item.costing_sheet_item_id,
                            "erp_item_code": None,
                            "factwise_item_code": (
                                enterprise_item.code if enterprise_item else None
                            ),
                            "name": (enterprise_item.name if enterprise_item else None),
                            "description": (
                                enterprise_item.description if enterprise_item else None
                            ),
                            "item_type": (
                                enterprise_item.item_type if enterprise_item else None
                            ),
                            "notes": (
                                enterprise_item.notes if enterprise_item else None
                            ),
                            "internal_notes": (
                                enterprise_item.internal_notes
                                if enterprise_item
                                else None
                            ),
                            "attributes": attr_map[item.costing_sheet_item_id],
                            "measurement_units": (
                                [
                                    mu.get("measurement_unit_primary_name")
                                    for mu in enterprise_item.measurement_units.get(
                                        "item_measurement_units", []
                                    )
                                ]
                                if enterprise_item
                                else []
                            ),
                            "custom_ids": (
                                enterprise_item.custom_ids.get("custom_ids")
                                if enterprise_item
                                else []
                            ),
                            "tags": (enterprise_item.tags if enterprise_item else []),
                            "custom_fields": (
                                enterprise_item_field_map.get(
                                    item.enterprise_item_id, []
                                )
                                if item.enterprise_item_id
                                else []
                            ),
                        },
                        "notes": item.notes,
                        "attachments": item_attachment_map[item.costing_sheet_item_id],
                        "quantity": item.quantity,
                        "rate": item.rate,
                        "total": item.total,
                        "lead_time": (
                            item.procurement_information.get("lead_time")
                            if item.procurement_information
                            else None
                        ),
                        "lead_time_period": (
                            item.procurement_information.get("lead_time_period")
                            if item.procurement_information
                            else None
                        ),
                        "vendor_entity_name": (
                            item.vendor_entity.entity_name
                            if item.vendor_entity
                            else None
                        ),
                        "vendor_currency": (
                            item.vendor_currency.currency_name
                            if item.vendor_currency
                            else None
                        ),
                        "vendor_rate": item.vendor_rate,
                        "conversion_rate": item.conversion_rate,
                        "created_datetime": item.created_datetime,
                        "modified_datetime": item.modified_datetime,
                        "additional_costs": add_map[item.costing_sheet_item_id],
                        "taxes": tax_map[item.costing_sheet_item_id],
                        "discounts": discount_map[item.costing_sheet_item_id],
                        "delivery_schedule": delivery_map[item.costing_sheet_item_id],
                        "custom_sections": [
                            {
                                "name": section.name,
                                "section_type": section.section_type,
                                "custom_fields": field_map[item.costing_sheet_item_id],
                            }
                            for section in item_sections
                        ],
                    }
                )

            # -------- CLEAR BATCH MEMORY --------
            attr_map.clear()
            add_map.clear()
            tax_map.clear()
            discount_map.clear()
            delivery_map.clear()
            field_map.clear()
            enterprise_item_field_map.clear()

            del attr_map
            del add_map
            del tax_map
            del discount_map
            del delivery_map
            del field_map
            del enterprise_item_field_map
            del items
            del batch_ids

            gc.collect()

        # ---------------- FINAL SHEET ----------------

        response.append(
            {
                "name": sheet.name,
                "factwise_costing_sheet_code": sheet.custom_costing_sheet_id,
                "ERP_costing_sheet_id": sheet.ERP_costing_sheet_id,
                "seller_entity_name": (
                    sheet.seller_entity.entity_name if sheet.seller_entity else None
                ),
                "template_name": template_name,
                "validity_datetime": sheet.validity_datetime,
                "customer_contact_emails": customer_emails,
                "customer_entity_name": (
                    sheet.customer_entity.entity_name if sheet.customer_entity else None
                ),
                "additional_costs": [
                    {
                        "name": cost["cost_name"],
                        "value": cost["cost_value"],
                    }
                    for cost in sheet.additional_costs
                ],
                "currency_code_id": sheet.currency_code_id,
                "project_code": (sheet.project.project_code if sheet.project else None),
                "ERP_project_code": (
                    sheet.project.ERP_project_code if sheet.project else None
                ),
                "internal_notes": sheet.internal_notes,
                "external_notes": sheet.external_notes,
                "status": sheet.status,
                "attachments": sheet_attachments,
                "created_datetime": sheet.created_datetime,
                "modified_datetime": sheet.modified_datetime,
                "created_by_user_email": (
                    sheet.created_by_user.email if sheet.created_by_user else None
                ),
                "modified_by_user_email": (
                    sheet.modified_by_user.email if sheet.modified_by_user else None
                ),
                "custom_sections": custom_sections_data,
                "costing_sheet_items": costing_sheet_items_data,
            }
        )

        gc.collect()

    return response


def map_erp_ids_to_costing_sheets(enterprise_id, mappings):
    """
    mappings: list of dicts with keys:
        - factwise_id (str)
        - erp_id (str)

    Returns:
        list of per-item results
    """
    results = []

    for item in mappings:
        factwise_id = item["factwise_id"]
        erp_id = item["erp_id"]

        try:
            with transaction.atomic():
                sheet = CostingSheet.objects.select_for_update().get(
                    seller_enterprise_id=enterprise_id,
                    custom_costing_sheet_id=factwise_id,
                    deleted_datetime__isnull=True,
                )

                if sheet.ERP_costing_sheet_id:
                    results.append(
                        {
                            "factwise_id": factwise_id,
                            "status": "failed",
                            "error": "ERP ID already set",
                        }
                    )
                    continue

                sheet.ERP_costing_sheet_id = erp_id
                sheet.save(update_fields=["ERP_costing_sheet_id"])

            results.append({"factwise_id": factwise_id, "status": "success"})

        except CostingSheet.DoesNotExist:
            results.append(
                {"factwise_id": factwise_id, "status": "failed", "error": "Not found"}
            )

        except IntegrityError:
            results.append(
                {
                    "factwise_id": factwise_id,
                    "status": "failed",
                    "error": "ERP ID must be unique",
                }
            )

        except Exception as e:
            results.append(
                {"factwise_id": factwise_id, "status": "failed", "error": str(e)}
            )

    return results
