from django.db import transaction
from organization.org_models.terms_and_conditions_model import TermsAndConditions
from organization.org_models.terms_and_conditions_model import EntityTermsAndConditions
from organization.services import entity_service
from organization.services import entity_status_service
from organization.services import terms_and_conditions_service
from organization.states import EntitySetupInfoType
from organization.states import TermsAndConditionsState
from organization.states import TermsAndConditionsType

from factwise.exception import ValidationException


def list_terms_and_conditions(enterprise_id, terms_and_conditions_type=None):
    optional_filters = {}
    if terms_and_conditions_type:
        optional_filters["terms_and_conditions_type"] = terms_and_conditions_type
    terms_and_conditions_list = TermsAndConditions.objects.filter(
        enterprise_id=enterprise_id, **optional_filters
    )
    return terms_and_conditions_list


@transaction.atomic
def terms_and_conditions_create(*, enterprise_id, entity_details, name, data, notes):
    (
        entities,
        entity_terms_and_conditions_to_create,
        entity_terms_and_conditions_to_update,
    ) = ([], [], [])
    entity_obj_map, entity_terms_and_conditions_obj_map = {}, {}

    for entity in entity_details:
        entities.append(entity.entity_name)
    entity_objs = entity_service.get_entities_via_names(
        entity_names=entities, enterprise_id=enterprise_id
    )
    if len(entities) != entity_objs.count():
        raise ValidationException(
            "Input entity(s) not found in the enterprise! Please enter correct entity name(s)"
        )

    for entity in entity_objs:
        entity_obj_map[entity.entity_name] = entity

    entity_terms_and_conditions = EntityTermsAndConditions.objects.filter(
        terms_and_conditions__enterprise_id=enterprise_id,
        is_default=True,
        deleted_datetime__isnull=True,
    ).select_related("terms_and_conditions", "entity")
    for entity_term_and_condition in entity_terms_and_conditions:
        entity_terms_and_conditions_obj_map[
            entity_term_and_condition.entity.entity_name
        ] = entity_term_and_condition

    for entity_detail in entity_details:
        if (
            entity_detail.entity_name in entity_terms_and_conditions_obj_map
            and entity_detail.is_default
        ):
            entity_term_and_condition = entity_terms_and_conditions_obj_map[
                entity_detail.entity_name
            ]
            entity_term_and_condition.is_default = False
            entity_terms_and_conditions_to_update.append(entity_term_and_condition)

    tnc_obj = terms_and_conditions_service.get_terms_and_conditions_via_name(
        name=name, enterprise_id=enterprise_id
    )
    if not tnc_obj:
        tnc_obj = terms_and_conditions_service.__save_terms_and_conditions__(
            enterprise_id=enterprise_id,
            name=name,
            terms_and_conditions_type=TermsAndConditionsType.PURCHASE_ORDER.value,
            data=data,
            notes=notes,
        )
        for entity_detail in entity_details:
            entity = entity_obj_map[entity_detail.entity_name]
            is_default = False
            if entity_detail.is_default is not None:
                is_default = entity_detail.is_default

            entity_terms_and_conditions_to_create.append(
                terms_and_conditions_service.save_entity_term_and_condition(
                    enterprise_id=enterprise_id,
                    entity_id=entity.entity_id,
                    terms_and_conditions_id=tnc_obj.terms_and_conditions_id,
                    is_default=is_default,
                    status=TermsAndConditionsState.TNC_ACTIVE.value,
                )
            )
        EntityTermsAndConditions.objects.bulk_create(
            entity_terms_and_conditions_to_create
        )
        terms_and_conditions_service.__update_entity_tnc_count__(
            terms_and_condition=tnc_obj
        )
    else:
        raise ValidationException(
            "Terms and conditions with this name already exist! Please create a terms and condition with different name"
        )

    for entity in entities:
        entity_status_service.validate_and_update_entity_status(
            enterprise_id=enterprise_id,
            entity_id=entity_obj_map[entity].entity_id,
            model_name=EntitySetupInfoType.TERMS_AND_CONDITIONS,
        )
    return tnc_obj
