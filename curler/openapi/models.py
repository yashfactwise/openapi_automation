import uuid

from django.db import models
from organization.models import Enterprise

from factwise.models import BaseModel


class CustomTokens(BaseModel):
    entry_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    enterprise = models.ForeignKey(Enterprise, on_delete=models.CASCADE, null=True)
    secret_key = models.UUIDField()


class BulkTask(models.Model):
    STATUS_PENDING = "pending"
    STATUS_RUNNING = "running"
    STATUS_SUCCESS = "success"
    STATUS_FAILED = "failed"

    STATUS_CHOICES = (
        (STATUS_PENDING, "Pending"),
        (STATUS_RUNNING, "Running"),
        (STATUS_SUCCESS, "Success"),
        (STATUS_FAILED, "Failed"),
    )

    TASK_TYPE_PROJECT = "project"
    TASK_TYPE_ITEM = "item"

    TASK_TYPE_CHOICES = (
        (TASK_TYPE_PROJECT, "Project"),
        (TASK_TYPE_ITEM, "Item"),
    )

    task_id = models.CharField(
        max_length=255,
        unique=True,
        db_index=True,
    )

    task_type = models.CharField(
        max_length=50,
        choices=TASK_TYPE_CHOICES,
        db_index=True,
    )

    enterprise_id = models.UUIDField(db_index=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING,
    )

    total = models.PositiveIntegerField(default=0)
    processed = models.PositiveIntegerField(default=0)
    success = models.PositiveIntegerField(default=0)
    failed = models.PositiveIntegerField(default=0)

    # Per-project results (append-only)
    results = models.JSONField(default=list)

    error = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["enterprise_id", "task_id"]),
            models.Index(fields=["enterprise_id", "task_type"]),
        ]

    def __str__(self):
        return f"BulkTask(task_id={self.task_id}, type={self.task_type}, status={self.status})"
