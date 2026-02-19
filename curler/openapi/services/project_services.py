import uuid

from celery import shared_task
from custom.models import CustomField, CustomSection
from custom.states import CustomSectionStatus
from django.db import transaction
from django.db.models import F, JSONField, Value
from django.utils import timezone
from event.utils.permission_check import has_permission
from module_templates import services as template_services
from module_templates.types import ModuleTemplateSectionType, ModuleTemplateType
from openapi.models import BulkTask
from openapi.services import custom_services
from organization.models import Entity
from organization.org_models.buyer_master_model import EntityBuyerMaster
from organization.org_models.project_model import Project
from organization.services import (
    buyer_master_service,
    enterprise_user_service,
    entity_service,
    entity_settings_service,
    project_service,
)
from organization.states import EntitySettingKeyType, UserPermissionChoices
from organization.structures import ProjectAdditionalDetails
from rest_framework.exceptions import NotFound

from factwise.exception import BadRequestException, ValidationException
from factwise.openapi.service import JsonbConcat, make_json_safe
from factwise.utils import set_statement_timeout


@transaction.atomic
def create_project(
    created_by_user_email,
    enterprise_id,
    project_code,
    ERP_project_code,
    customer_code,
    project_name,
    entity_name,
    description,
    internal_notes,
    validity_from,
    validity_to,
    template_name,
    project_status,
    custom_sections,
):
    start_time = timezone.now()
    user = enterprise_user_service.get_user_by_enterprise_email(
        enterprise_id=enterprise_id, email=created_by_user_email
    )
    if not user:
        raise ValidationException("User email does not exist in the enterprise")
    user_id = user.user_id

    if project_code:
        if Project.objects.filter(
            buyer_enterprise_id=enterprise_id,
            project_code=project_code,
            deleted_datetime__isnull=True,
        ).exists():
            raise ValidationException("A project with the same code already exists")
    else:
        if Project.objects.filter(
            buyer_enterprise_id=enterprise_id,
            ERP_project_code=ERP_project_code,
            deleted_datetime__isnull=True,
        ).exists():
            raise ValidationException("ERP project ID must be unique")
    buyer_entity_name = entity_name
    buyer_entity = entity_service.get_entity_via_name(
        entity_name=buyer_entity_name, enterprise_id=enterprise_id
    )
    if not buyer_entity:
        raise BadRequestException("Provided entity does not exist in the enterprise")
    buyer_entity_id = buyer_entity.entity_id

    customer_entity_id = None
    if customer_code:
        entity_bm = _get_entity_bm_from_code(
            seller_entity_id=buyer_entity_id,
            customer_code=customer_code,
        )
        enterprise_bm = entity_bm.enterprise_buyer_master
        customer_entity_id = enterprise_bm.buyer_entity_id

    permission = UserPermissionChoices.PROJECT_CREATE
    if not has_permission(
        user=user_id, entity_id=buyer_entity.entity_id, permission_to_check=permission
    ):
        raise ValidationException(
            "User does not have the permission to create a project. Contact your Admin."
        )
    if template_name:
        template = template_services._get_template_from_name(
            entity_id=buyer_entity_id,
            name=template_name,
            type=ModuleTemplateType.PROJECT_TEMPLATE,
        )
        if not template:
            raise BadRequestException("Template does not exist")
    else:
        template = template_services.get_entity_default_template(
            enterprise_id=enterprise_id,
            entity_id=buyer_entity_id,
            type=ModuleTemplateType.PROJECT_TEMPLATE,
        )
    template_id = template.template_id
    additional_details = ProjectAdditionalDetails(template_id=template_id)
    event_quantity_tolerance = None
    event_quantity_tolerance_setting = entity_settings_service.get_entity_setting(
        entity_id=buyer_entity_id,
        key=EntitySettingKeyType.EVENT_PROJECT_QUANTITY_TOLERANCE.value,
    )
    if event_quantity_tolerance_setting:
        event_quantity_tolerance = event_quantity_tolerance_setting.max_value
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
    project = project_service.save_project(
        project_name=project_name,
        project_code=project_code,
        buyer_enterprise_id=enterprise_id,
        buyer_entity_id=buyer_entity.entity_id,
        description=description,
        internal_notes=internal_notes,
        validity_from=validity_from,
        validity_to=validity_to,
        tags=[],
        project_status=project_status,
        additional_details=additional_details,
        customer_entity_id=customer_entity_id,
        event_quantity_tolerance=event_quantity_tolerance,
    )
    project.ERP_project_code = ERP_project_code
    project.created_by_user_id = user_id
    project.created_datetime = start_time
    project.modified_by_user_id = user_id
    project.modified_datetime = start_time
    project.save(update_modified_by_user=False)
    for section in custom_sections:
        project_custom_section = project_service.save_project_custom_section(
            name=section.name,
            enterprise_id=enterprise_id,
            entity_id=project.buyer_entity_id,
            project_id=project.project_id,
            target_duration=None,
            target_duration_period=None,
            start_time=start_time,
            status=CustomSectionStatus.DRAFT,
            section_type=ModuleTemplateSectionType.OTHER,
        )

        for custom_field_struct in section.custom_fields:
            project_custom_field = project_service.custom_service.save_custom_field(
                enterprise_id=enterprise_id,
                entity_id=project.buyer_entity_id,
                custom_section_id=project_custom_section.custom_section_id,
                project_id=project.project_id,
                name=custom_field_struct.name,
                type=custom_field_struct.type,
                text_value=custom_field_struct.text_value,
                boolean_value=custom_field_struct.boolean_value,
                percentage_value=custom_field_struct.percentage_value,
                integer_value=custom_field_struct.integer_value,
                decimal_value=custom_field_struct.decimal_value,
                date_value=custom_field_struct.date_value,
                datetime_value=custom_field_struct.datetime_value,
                multi_choice_value=custom_field_struct.multi_choice_value,
                link_value=custom_field_struct.link_value,
                email_value=custom_field_struct.email_value,
                attachment_value=custom_field_struct.attachment_value,
                currency=custom_field_struct.currency,
            )
            project_custom_field.save()

    return project.project_code


def _get_entity_bm_from_code(*, seller_entity_id, customer_code):
    try:
        entity_vm = buyer_master_service.get_entity_vendor_master_via_code(
            seller_entity_id=seller_entity_id,
            buyer_code=customer_code,
        )
    except EntityBuyerMaster.DoesNotExist:
        raise ValidationException(
            "Customer with customer code does not exist or is not linked to the entity"
        )
    return entity_vm


def get_customer_entity_map(*, customer_pairs):
    if not customer_pairs:
        return {}

    seller_entity_ids = {p[0] for p in customer_pairs}
    customer_codes = {p[1] for p in customer_pairs}

    entity_bms = EntityBuyerMaster.objects.filter(
        seller_entity_id__in=seller_entity_ids,
        customer_code__in=customer_codes,
    ).select_related("enterprise_buyer_master")

    return {
        (
            bm.seller_entity_id,
            bm.customer_code,
        ): bm.enterprise_buyer_master.buyer_entity_id
        for bm in entity_bms
    }


def _create_projects_bulk_impl(*, enterprise_id, projects_payload, task_id=None):
    start_time = timezone.now()
    results = []

    if task_id:
        BulkTask.objects.filter(task_id=task_id).update(
            status="running",
        )

    emails = {p["created_by_user_email"] for p in projects_payload}
    entity_names = {p["entity_name"] for p in projects_payload}
    template_names = {
        p["template_name"].lower() for p in projects_payload if p.get("template_name")
    }
    project_codes = {
        p["project_code"] for p in projects_payload if p.get("project_code")
    }

    erp_codes = {
        p["ERP_project_code"] for p in projects_payload if p.get("ERP_project_code")
    }

    user_map = enterprise_user_service.get_users_by_enterprise_emails(
        enterprise_id=enterprise_id,
        emails=emails,
    )
    user_id_map = {email: u.user_id for email, u in user_map.items()}

    entities = Entity.objects.filter(
        enterprise_id=enterprise_id,
        entity_name__in=entity_names,
    ).values("entity_id", "entity_name")
    entity_map = {e["entity_name"]: e["entity_id"] for e in entities}
    entity_ids = list(entity_map.values())

    seen_project_codes = set()
    existing_project_codes = set(
        Project.objects.filter(
            buyer_enterprise_id=enterprise_id,
            project_code__in=project_codes,
            deleted_datetime__isnull=True,
        ).values_list("project_code", flat=True)
    )

    seen_erp_codes = set()
    existing_erp_codes = set(
        Project.objects.filter(
            buyer_enterprise_id=enterprise_id,
            ERP_project_code__in=erp_codes,
            deleted_datetime__isnull=True,
        ).values_list("ERP_project_code", flat=True)
    )

    templates = template_services._get_templates_from_names(
        entity_ids=entity_ids,
        names=template_names,
        type=ModuleTemplateType.PROJECT_TEMPLATE,
    )
    template_map = {
        (t.entity_id, (t.name or "").lower()): t.template_id for t in templates
    }

    default_templates = template_services.get_entity_default_templates(
        enterprise_id=enterprise_id,
        entity_ids=entity_ids,
        type=ModuleTemplateType.PROJECT_TEMPLATE,
    )
    default_template_map = {t.entity_id: t.template_id for t in default_templates}

    permission_cache = {}
    template_section_cache = {}

    def has_create_permission(user_id, entity_id):
        key = (user_id, entity_id)
        if key not in permission_cache:
            permission_cache[key] = has_permission(
                user=user_id,
                entity_id=entity_id,
                permission_to_check=UserPermissionChoices.PROJECT_CREATE,
            )
        return permission_cache[key]

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

    for index, payload in enumerate(projects_payload):
        try:
            user_id = user_id_map.get(payload["created_by_user_email"])
            if not user_id:
                raise ValidationException("User email does not exist in the enterprise")

            entity_id = entity_map.get(payload["entity_name"])
            if not entity_id:
                raise BadRequestException(
                    "Provided entity does not exist in the enterprise"
                )

            if not has_create_permission(user_id, entity_id):
                raise ValidationException(
                    "User does not have the permission to create a project. Contact your Admin."
                )

            project_code = payload.get("project_code")
            if project_code:
                if (
                    project_code in existing_project_codes
                    or project_code in seen_project_codes
                ):
                    raise ValidationException(
                        "A project with the same code already exists"
                    )
                seen_project_codes.add(project_code)

            erp_code = payload.get("ERP_project_code")
            if erp_code:
                if erp_code in existing_erp_codes or erp_code in seen_erp_codes:
                    raise ValidationException("ERP project ID must be unique")
                seen_erp_codes.add(erp_code)

            template_name = payload.get("template_name")
            if template_name:
                template_id = template_map.get((entity_id, template_name.lower()))
                if not template_id:
                    raise BadRequestException("Template does not exist")
            else:
                template_id = default_template_map.get(entity_id)

            section_map, item_map = get_template_section_maps(template_id)

            custom_sections = (
                custom_services.validate_and_autofill_custom_sections_from_template(
                    custom_sections=payload["custom_sections"],
                    template_section_map=section_map,
                    template_section_item_map=item_map,
                )
            )

            project = project_service.save_project(
                project_name=payload["project_name"],
                project_code=payload.get("project_code"),
                buyer_enterprise_id=enterprise_id,
                buyer_entity_id=entity_id,
                description=payload.get("description"),
                internal_notes=payload.get("internal_notes"),
                validity_from=payload.get("validity_from"),
                validity_to=payload.get("validity_to"),
                tags=[],
                project_status=payload["project_status"],
                additional_details=ProjectAdditionalDetails(template_id=template_id),
                customer_entity_id=None,
                event_quantity_tolerance=None,
            )

            project.ERP_project_code = payload.get("ERP_project_code")
            project.created_by_user_id = user_id
            project.created_datetime = start_time
            project.modified_by_user_id = user_id
            project.modified_datetime = start_time

            sections_to_create = []
            fields_to_create = []

            for section in custom_sections:
                cs = project_service.create_project_custom_section(
                    name=section.name,
                    enterprise_id=enterprise_id,
                    entity_id=entity_id,
                    project_id=project.project_id,
                    target_duration=None,
                    target_duration_period=None,
                    start_time=start_time,
                    status=CustomSectionStatus.DRAFT,
                    section_type=ModuleTemplateSectionType.OTHER,
                )
                sections_to_create.append(cs)

                for field in section.custom_fields:
                    fields_to_create.append(
                        project_service.custom_service.save_custom_field(
                            enterprise_id=enterprise_id,
                            entity_id=entity_id,
                            custom_section_id=cs.custom_section_id,
                            project_id=project.project_id,
                            name=field.name,
                            type=field.type,
                            text_value=field.text_value,
                            boolean_value=field.boolean_value,
                            percentage_value=field.percentage_value,
                            integer_value=field.integer_value,
                            decimal_value=field.decimal_value,
                            date_value=field.date_value,
                            datetime_value=field.datetime_value,
                            multi_choice_value=field.multi_choice_value,
                            link_value=field.link_value,
                            email_value=field.email_value,
                            attachment_value=field.attachment_value,
                            currency=field.currency,
                        )
                    )

            with transaction.atomic():
                set_statement_timeout(900000)
                project.save(update_modified_by_user=False)
                CustomSection.objects.bulk_create(sections_to_create)
                CustomField.objects.bulk_create(fields_to_create)

            results.append(
                {
                    "index": index,
                    "status": "success",
                    "erp_project_code": payload.get("ERP_project_code", ""),
                    "project_code": str(project.project_code),
                    "project_id": str(project.project_id),
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
                "erp_project_code": payload.get("ERP_project_code"),
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
        "total": len(projects_payload),
        "success": sum(r["status"] == "success" for r in results),
        "failed": sum(r["status"] == "failed" for r in results),
        "results": results,
    }


@shared_task(bind=True)
def create_projects_bulk_task(self, *, enterprise_id, projects_payload, task_id):
    try:
        return _create_projects_bulk_impl(
            enterprise_id=enterprise_id,
            projects_payload=projects_payload,
            task_id=task_id,
        )
    except Exception as exc:
        BulkTask.objects.filter(task_id=task_id).update(
            status="failed",
            error=str(exc),
        )
        raise


ASYNC_PROJECT_THRESHOLD = 70


def create_projects_bulk(
    *, enterprise_id, projects_payload, total_len, validation_errors
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

    total = len(projects_payload)

    if total >= ASYNC_PROJECT_THRESHOLD:
        task_id = uuid.uuid4()
        BulkTask.objects.create(
            task_id=task_id,
            task_type="project",
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
                    "erp_project_code": e.get("erp_project_code"),
                    "error": e["error"],
                }
                for e in validation_errors
            ],
        )

        create_projects_bulk_task.delay(  # type: ignore
            enterprise_id=enterprise_id,
            projects_payload=make_json_safe(projects_payload),
            task_id=str(task_id),
        )

        return {
            "status": "accepted",
            "mode": "async",
            "task_id": str(task_id),
        }

    return _create_projects_bulk_impl(
        enterprise_id=enterprise_id,
        projects_payload=projects_payload,
    )


def get_bulk_project_task_status(*, enterprise_id, task_id):
    task = BulkTask.objects.filter(
        task_id=task_id,
        enterprise_id=enterprise_id,
    ).first()

    if not task:
        raise NotFound("Task not found")

    if task.status in {"pending", "running"}:
        return {
            "mode": "async",
            "task_id": str(task.task_id),
            "status": task.status,
            "success_count": task.success,
            "failure_count": task.failed,
            "total": task.total,
            "processed": task.processed,
            "created_at": task.created_at,
            "updated_at": task.updated_at,
        }

    success_items = []
    failed_items = []

    for r in task.results or []:
        if r.get("status") == "success":
            success_items.append(
                {
                    "erp_project_code": str(r.get("erp_project_code", "")),
                    "project_code": str(r.get("project_code", "")),
                    "project_id": str(r.get("project_id", "")),
                }
            )
        else:
            failed_items.append(
                {
                    "index": str(r.get("index")),
                    "erp_project_code": str(r.get("erp_project_code", "")),
                    "error": str(r.get("error")),
                }
            )

    return {
        "mode": "async",
        "task_id": str(task.task_id),
        "status": task.status,
        "success_count": len(success_items),
        "failure_count": len(failed_items),
        "success": success_items,
        "failed": failed_items,
        "completed_at": task.updated_at,
    }
