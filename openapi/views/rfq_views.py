from event.rfq.models import RfqEvent
from event.rfq.states import RfqEventState
from openapi.services import rfq_services
from rest_framework import serializers
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from factwise.states import EnterpriseType
from factwise.states import states_as_list


class RfqListAPI(APIView):
    class InputSerializer(serializers.Serializer):
        rfq_event_status = serializers.ListField(
            required=False,
            allow_null=True,
            child=serializers.ChoiceField(choices=states_as_list(RfqEventState)),
        )
        enterprise_type = serializers.ChoiceField(states_as_list(EnterpriseType))
        buyer_item_ids = serializers.ListField(
            child=serializers.UUIDField(), default=None
        )

    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = RfqEvent
            ref_name = "RFQ List"
            fields = (
                "rfq_entry_id",
                "event_id",
                "event_name",
                "live_event_start_datetime",
                "custom_event_id",
                "buyer_entity",
                "original_event_creator_name",
                "rfq_event_creator",
                "event_type",
                "status",
                "version",
                "additional_details",
                "event_end_datetime",
            )

    def get(self, request):
        enterprise_type = request.query_params.get("enterprise_type")
        serializer = self.InputSerializer(data={"enterprise_type": enterprise_type})
        serializer.is_valid(raise_exception=True)
        rfq_event_list = rfq_services.list_rfq(
            enterprise_id=request.enterprise_id, **serializer.data
        )
        response_data = self.OutputSerializer(rfq_event_list, many=True).data
        return Response(data=response_data, status=status.HTTP_200_OK)
