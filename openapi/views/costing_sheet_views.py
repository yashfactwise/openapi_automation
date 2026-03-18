from django.utils.dateparse import parse_datetime
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView, status

from factwise.openapi.services import costing_sheet_service


class CostingSheetListAPI(APIView):

    def get(self, request):

        start_str = request.query_params.get("start_datetime")
        end_str = request.query_params.get("end_datetime")

        if not start_str or not end_str:
            return Response(
                {"error": "start_datetime and end_datetime are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        start_datetime = parse_datetime(start_str)
        end_datetime = parse_datetime(end_str)

        if not start_datetime or not end_datetime:
            return Response(
                {"error": "Invalid datetime format"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = costing_sheet_service.get_enterprise_costing_sheets(
            enterprise_id=request.enterprise_id,
            start_datetime=start_datetime,
            end_datetime=end_datetime,
            request=request,
        )

        return Response(data, status=status.HTTP_200_OK)


class CostingSheetMappingSerializer(serializers.Serializer):
    factwise_id = serializers.CharField(
        required=True,
        allow_blank=False,
        error_messages={
            "required": "factwise_id is required.",
            "blank": "factwise_id cannot be empty.",
        },
    )

    erp_id = serializers.CharField(
        required=True,
        allow_blank=False,
        trim_whitespace=True,
        error_messages={
            "required": "erp_id is required.",
            "blank": "erp_id cannot be empty.",
        },
    )


class MapCostingSheetIDsAPI(APIView):
    class InputSerializer(serializers.Serializer):
        mappings = serializers.ListField(child=serializers.DictField())

    def put(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        raw_mappings = serializer.validated_data["mappings"]

        results = []

        for item in raw_mappings:
            item_serializer = CostingSheetMappingSerializer(data=item)

            if not item_serializer.is_valid():
                results.append(
                    {
                        "factwise_id": item.get("factwise_id"),
                        "status": "failed",
                        "error": "; ".join(
                            f"{field}: {', '.join(map(str, msgs))}"
                            for field, msgs in item_serializer.errors.items()
                        ),
                    }
                )
                continue

            service_result = costing_sheet_service.map_erp_ids_to_costing_sheets(
                enterprise_id=request.enterprise_id,
                mappings=[item_serializer.validated_data],
            )

            results.extend(service_result)

        return Response({"results": results}, status=status.HTTP_207_MULTI_STATUS)
