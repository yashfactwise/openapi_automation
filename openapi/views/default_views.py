from attachment.models import Attachment
from attachment.types import AttachmentStatus
from django.http import FileResponse
from rest_framework import serializers, status
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView

import factwise.openapi.service as openapi_service
from factwise.aws.s3 import S3Client


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
                attachment_status=AttachmentStatus.ACTIVE.value,
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
