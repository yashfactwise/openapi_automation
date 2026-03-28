import os
import uuid

from attachment.models import Attachment
from attachment.types import AttachmentModuleType, AttachmentStatus, AttachmentType
from django.db import transaction
from django.http import FileResponse
from django.urls import reverse
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

import factwise.openapi.service as openapi_service
from factwise.attachment.service import generate_attachment_and_upload_to_s3
from factwise.aws.s3 import S3Client, construct_file_path


class DefaultAPI(APIView):
    def get(self, request):
        # check if db connection is working
        print("Checking DB connection")
        try:
            from django.db import connection

            cursor = connection.cursor()
            cursor.execute("SELECT 1")
            cursor.fetchone()
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        resp = {"status": "success", "data": "Hello World"}
        return Response(resp, status=status.HTTP_200_OK)


class AttachmentDownloadAPI(APIView):
    def get(self, request, attachment_id):
        attachment = (
            Attachment.objects.filter(
                attachment_id=attachment_id,
                enterprise_id=request.enterprise_id,
            )
            .only("attachment_id", "key", "file_name")
            .first()
        )

        if not attachment:
            return Response(
                data={"error": "Attachment not found"}, status=status.HTTP_404_NOT_FOUND
            )

        __FILE_CLIENT__ = S3Client()
        file_stream = __FILE_CLIENT__.get_file_stream(key=attachment.key)

        return FileResponse(
            file_stream,
            as_attachment=True,
            filename=attachment.file_name,
        )


class AttachmentUploadAPI(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        files = request.FILES.getlist("files")

        if not files:
            return Response(
                {"error": "No files provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        s3_client = S3Client()

        successful = []
        failed = []

        for index, file_obj in enumerate(files):
            try:
                result = generate_attachment_and_upload_to_s3(
                    file_obj=file_obj,
                    enterprise_id=request.enterprise_id,  # type: ignore
                    attachment_module_type=AttachmentModuleType.UNSET.value,
                    s3_client=s3_client,
                )

                download_url = request.build_absolute_uri(
                    reverse(
                        "openapi:attachment_download",
                        kwargs={"attachment_id": result["attachment_id"]},
                    )
                )

                successful.append(
                    {
                        "index": index,
                        "attachment_id": result["attachment_id"],
                        "file_name": result["file_name"],
                        "url": download_url,
                    }
                )

            except Exception as exc:
                failed.append(
                    {
                        "index": index,
                        "file_name": file_obj.name,
                        "error": str(exc),
                    }
                )

        response = {
            "total": len(files),
            "successful_count": len(successful),
            "failed_count": len(failed),
            "successful": successful,
            "failed": failed,
        }

        return Response(response, status=status.HTTP_207_MULTI_STATUS)


class BulkTaskStatusAPI(APIView):
    def get(self, request, task_id):
        try:
            data = openapi_service.get_bulk_task_status(
                enterprise_id=request.enterprise_id,
                task_id=task_id,
            )
            return Response(data, status=status.HTTP_200_OK)
        except NotFound:
            return Response(
                {"error": "Task not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
