import operator
from functools import reduce

from django.db import transaction
from django.db.models import Q
from organization.models import Entity
from organization.org_models.identification_model import EntityIdentification
from organization.services import entity_service
from organization.services import entity_status_service
from organization.services import identification_service
from organization.states import EntityVerificationState
from organization.states import EntitySetupInfoType
from organization.states import IdentificationCategoryChoices
from verification import services as verification_service

from factwise.exception import ValidationException


def identification_list(*, enterprise_id):
    identifications = identification_service.get_enterprise_identifications(
        enterprise_id=enterprise_id
    )
    return identifications


@transaction.atomic
def identification_create(*, enterprise_id, identification_list):
    entities, entities_to_update, identifications_to_create = [], [], []
    entity_obj_map = {}
    for identification in identification_list:
        entities.append(identification.entity_name)
    entity = entity_service.get_entities_via_names_for_update(
        entity_names=entities, enterprise_id=enterprise_id
    )
    entity_objs = entity_service.get_entities_via_names(
        entity_names=entities, enterprise_id=enterprise_id
    )
    if len(entities) != entity_objs.count():
        raise ValidationException(
            "Input entity(s) not found in the enterprise! Please enter correct entity name(s)"
        )

    for entity in entity_objs:
        entity_obj_map[entity.entity_name] = entity

    if EntityIdentification.objects.filter(
        reduce(
            operator.or_,
            (
                Q(
                    entity=entity_obj_map[identification.entity_name],
                    identification_name=identification.name,
                    deleted_datetime__isnull=True,
                )
                for identification in identification_list
            ),
        )
    ).exists():
        raise ValidationException(
            "Identification with the name already exist! Please create an identification with different name"
        )

    for entity in entity_objs:
        entity_obj_map[entity.entity_name] = entity

    for identification in identification_list:
        entity = entity_obj_map[identification.entity_name]
        identification_service.__validate_default_identification__(
            identification=identification
        )
        identification = identification_service.save_entity_identification(
            entity_id=entity.entity_id,
            name=identification.name,
            value=identification.value,
            category=IdentificationCategoryChoices.OTHERS.value,
            notes=identification.notes,
            is_default=identification.is_default,
            is_public=identification.is_public,
        )
        identifications_to_create.append(identification)

        if entity.verification_status in [
            EntityVerificationState.REJECTED.value,
            EntityVerificationState.UNVERIFIED.value,
        ]:
            entity.verification_status = EntityVerificationState.PENDING.value
            entities_to_update.append(entity)

        entity_status_service.validate_and_update_entity_status(
            enterprise_id=enterprise_id,
            entity_id=entity.entity_id,
            model_name=EntitySetupInfoType.IDENTIFICATION,
        )

        verification_service.create_identification_verification_request(
            enterprise_id=enterprise_id,
            entity_id=entity.entity_id,
            identification_id=identification.identification_id,
        )
    Entity.objects.bulk_update(entities_to_update, fields=["verification_status"])
    EntityIdentification.objects.bulk_create(identifications_to_create)
