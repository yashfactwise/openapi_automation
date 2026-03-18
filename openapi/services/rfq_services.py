from event.rfq.models import RfqEvent
from event.models.live_models import EventBuyerEntity
from event.models.seller_event_model import SellerEventAccess
from event.states import EventType
from organization.services import enterprise_service
from organization.services import entity_service

from factwise.states import EnterpriseType


def list_rfq(*, enteprise_id, enterprise_type):
    enterprise_service.get_enterprise(enterprise_id=enteprise_id)
    entities = entity_service.get_enterprise_entities(
        enterprise_id=enteprise_id
    ).values_list("entity_id", flat=True)
    if enterprise_type == EnterpriseType.BUYER_ENTERPRISE.value:
        event_ids = EventBuyerEntity.objects.filter(
            buyer_entity_id__in=entities, deleted_datetime__isnull=True
        ).values_list("event_id", flat=True)
    else:
        event_ids = SellerEventAccess.objects.filter(
            seller_entity_id__in=entities, deleted_datetime__isnull=True
        )

    rfq_events = RfqEvent.objects.filter(
        event_id__in=event_ids,
        event__event_type=EventType.EVENT_RFQ.value,
        deleted_datetime__isnull=True,
    )
    return rfq_events
