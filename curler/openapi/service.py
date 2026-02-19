import secrets
import string
import uuid
from datetime import date, datetime

from additional_costs.structures import AdditionalCostDataClass
from django.db import transaction
from django.db.models import Func, JSONField
from module_templates.types import ModuleTemplateSectionItemLevel
from openapi.models import BulkTask, CustomTokens
from organization.services import enterprise_user_service
from rest_framework.exceptions import NotFound

__SECRET_KEY_LENGTH__ = 25
__SECRET_KEY_CHARS__ = string.ascii_letters + string.digits


def generate_secret_key():
    return "".join(
        secrets.choice(__SECRET_KEY_CHARS__) for _ in range(__SECRET_KEY_LENGTH__)
    )


def get_enterprise_id(*, secret_key):
    return CustomTokens.objects.get(secret_key=secret_key).enterprise_id


@transaction.atomic
def create_user_token(*, user_id):
    org_user = enterprise_user_service.get_admin_user(user_id)
    entry_id = uuid.uuid4()
    custom_token = CustomTokens()
    custom_token.entry_id = entry_id
    custom_token.enterprise_id = org_user.enterprise_id
    custom_token.secret_key = uuid.uuid4()
    custom_token.save()
    return custom_token.secret_key


def _format_costs(*, additional_costs, taxes, discounts, costs_map, level):
    additional_costs_dataclass, taxes_dataclass, discounts_dataclass = (
        [],
        [],
        [],
    )
    default_discount_map = {
        ModuleTemplateSectionItemLevel.ITEM: "Discount",
        ModuleTemplateSectionItemLevel.OTHER: "Overall discount",
        # ModuleTemplateSectionItemLevel.BOM: "BOM discount",
    }
    default_discount = default_discount_map[level]

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
        if cost_name != default_discount:
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


def make_json_safe(obj):
    if isinstance(obj, uuid.UUID):
        return str(obj)
    if isinstance(obj, dict):
        return {k: make_json_safe(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [make_json_safe(v) for v in obj]
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    return obj


class JsonbConcat(Func):
    function = "jsonb_concat"
    output_field = JSONField()


def get_bulk_task_status(*, enterprise_id, task_id):
    task = BulkTask.objects.filter(
        task_id=task_id,
        enterprise_id=enterprise_id,
    ).first()

    if not task:
        raise NotFound("Task not found")

    base_response = {
        "mode": "async",
        "task_id": str(task.task_id),
        "task_type": task.task_type,
        "status": task.status,
        "total": task.total,
        "processed": task.processed,
        "success_count": task.success,
        "failure_count": task.failed,
        "created_at": task.created_at,
        "updated_at": task.updated_at,
    }

    # If still running, return progress only
    if task.status in {
        BulkTask.STATUS_PENDING,
        BulkTask.STATUS_RUNNING,
    }:
        return base_response

    # Completed state (success or failed)
    success_items = []
    failed_items = []

    for r in task.results or []:
        if r.get("status") == BulkTask.STATUS_SUCCESS:
            success_items.append(r)
        else:
            failed_items.append(r)

    base_response.update(
        {
            "success": success_items,
            "failed": failed_items,
            "completed_at": task.updated_at,
        }
    )

    return base_response
