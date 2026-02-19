from django.db import transaction
from organization.models import Address
from organization.models import EntityAddress
from organization.services import address_service
from organization.services import enterprise_service
from organization.services import entity_service
from organization.states import EntityAddressState

from factwise.exception import ValidationException


def list_enterprise_address(*, enterprise_id):
    enterprise = enterprise_service.get_enterprise(enterprise_id=enterprise_id)
    address_list = Address.objects.filter(enterprise=enterprise).select_related(
        "country"
    )
    return address_list


@transaction.atomic
def address_create(
    *,
    enterprise_id,
    entity_details,
    address_nickname,
    address1,
    address2,
    address3,
    city,
    state_or_territory,
    postal_code,
    country,
    notes
):
    entities, entity_addresses_to_create, entity_address_to_update = [], [], []
    entity_obj_map, entity_address_obj_map = {}, {}
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

    entity_addresses = EntityAddress.objects.filter(
        address__enterprise_id=enterprise_id,
        is_primary_address=True,
        deleted_datetime__isnull=True,
    ).select_related("address", "entity")
    for entity_address in entity_addresses:
        entity_address_obj_map[entity_address.entity.entity_name] = entity_address

    for entity_detail in entity_details:
        if (
            entity_detail.entity_name in entity_address_obj_map
            and entity_detail.is_primary_address
        ):
            entity_address = entity_address_obj_map[entity_detail.entity_name]
            entity_address.is_primary_address = False
            entity_address_to_update.append(entity_address)
    if entity_address_to_update:
        EntityAddress.objects.bulk_update(
            entity_address_to_update, fields=["is_primary_address"]
        )

    country = address_service.get_country(country_iso=country)
    address = address_service.get_address_via_name(
        enterprise_id=enterprise_id, address=address_nickname
    )

    if not address:
        address = address_service.__save_address__(
            enterprise_id=enterprise_id,
            address_nickname=address_nickname,
            address1=address1,
            address2=address2,
            address3=address3,
            city=city,
            state_or_territory=state_or_territory,
            postal_code=postal_code,
            country=country,
            notes=notes,
        )
        for entity_detail in entity_details:
            entity = entity_obj_map[entity_detail.entity_name]
            is_public = (
                True if entity_detail.is_public is None else entity_detail.is_public
            )
            is_billing_address = (
                True
                if entity_detail.is_billing_address is None
                else entity_detail.is_billing_address
            )
            is_shipping_address = (
                True
                if entity_detail.is_shipping_address is None
                else entity_detail.is_shipping_address
            )
            is_primary_address = False
            if entity_detail.is_primary_address is not None:
                is_primary_address = entity_detail.is_primary_address

            entity_addresses_to_create.append(
                address_service.save_entity_address(
                    address_id=address.address_id,
                    entity_id=entity.entity_id,
                    is_public=is_public,
                    is_primary_address=is_primary_address,
                    is_billing_address=is_billing_address,
                    is_shipping_address=is_shipping_address,
                    status=EntityAddressState.ENTITY_ADDRESS_ACTIVE.value,
                )
            )
            EntityAddress.objects.bulk_create(entity_addresses_to_create)
    else:
        raise ValidationException(
            "Address with this name already exist! Please create an address with different name"
        )
    return address
