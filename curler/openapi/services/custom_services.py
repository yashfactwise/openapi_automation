import re
from datetime import datetime

from custom.states import CustomFieldType
from custom.structures import CustomSectionDataClass
from module_templates.types import FieldChoiceType, ModuleTemplateFieldType


def to_internal_value(custom_field, field_type):
    type_to_field_mapping = {
        CustomFieldType.SHORTTEXT.value: "text_value",
        CustomFieldType.LONGTEXT.value: "text_value",
        CustomFieldType.CHOICE.value: "text_value",
        CustomFieldType.BOOLEAN.value: "boolean_value",
        CustomFieldType.INTEGER.value: "integer_value",
        CustomFieldType.PERCENTAGE.value: "percentage_value",
        CustomFieldType.FLOAT.value: "decimal_value",
        CustomFieldType.DATETIME.value: "datetime_value",
        CustomFieldType.DATE.value: "date_value",
        CustomFieldType.EMAIL.value: "email_value",
        CustomFieldType.LINK.value: "link_value",
        CustomFieldType.MULTI_CHOICE.value: "multi_choice_value",
        CustomFieldType.ATTACHMENT.value: "attachment_values",
        CustomFieldType.TEMPLATE.value: "attachment_values",
        CustomFieldType.CURRENCY.value: "decimal_value",
    }

    if field_type in type_to_field_mapping:
        mapped_field = type_to_field_mapping[field_type]
        setattr(custom_field, mapped_field, custom_field.value)
    return custom_field


def validate_custom_field(*, custom_field, template_item, section_name):
    field_type = template_item.constraints["field_type"]
    is_required = template_item.is_required

    # name presence
    if not custom_field.name:
        raise ValueError(f"Field name is required in section '{section_name}'.")

    # name must be string
    if not isinstance(custom_field.name, str):
        raise ValueError(f"Field name in section '{section_name}' must be a string.")

    # name length
    if len(custom_field.name) > 200:
        raise ValueError(
            f"Field '{custom_field.name}' in section '{section_name}' "
            f"cannot exceed 200 characters."
        )

    # Validate select/multiselect options
    if field_type in [ModuleTemplateFieldType.CHOICE] and custom_field.value:
        choices = template_item.constraints["choices"]
        choice_type = template_item.constraints["choice_type"]
        if choice_type == FieldChoiceType.DROPDOWN:
            invalid_values = (
                [custom_field.value]
                if custom_field.value and custom_field.value not in choices
                else []
            )
        else:
            # Expect list for multi-select
            if not isinstance(custom_field.value, list):
                raise ValueError(
                    f"Field '{custom_field.name}' in section '{section_name}' must be a list of choices."
                )
            invalid_values = [val for val in custom_field.value if val not in choices]

        if invalid_values:
            raise ValueError(
                f"Field '{custom_field.name}' in section '{section_name}' contains invalid options: {invalid_values}. "
                f"Allowed: {choices}."
            )

    # Validate date format
    if field_type == ModuleTemplateFieldType.DATE and custom_field.value:
        try:
            datetime.strptime(custom_field.value, "%Y-%m-%d")
        except ValueError:
            raise ValueError(
                f"Field '{custom_field.name}' in section '{section_name}' has an incorrect date format. "
                f"Expected: YYYY-MM-DD."
            )

    if field_type == ModuleTemplateFieldType.SHORTTEXT and custom_field.value:
        if len(custom_field.value) > 15:
            raise ValueError(
                f"Value of '{custom_field.name}' in section '{section_name}' "
                f"cannot exceed 15 characters."
            )

    if field_type == ModuleTemplateFieldType.LONGTEXT and custom_field.value:
        if len(custom_field.value) > 120:
            raise ValueError(
                f"Value of '{custom_field.name}' in section '{section_name}' "
                f"cannot exceed 120 characters."
            )

    # INTEGER
    if field_type == ModuleTemplateFieldType.INTEGER and custom_field.value is not None:
        if not isinstance(custom_field.value, int):
            raise ValueError(
                f"Field '{custom_field.name}' in section '{section_name}' must be an integer."
            )

    # FLOAT
    if field_type == ModuleTemplateFieldType.FLOAT and custom_field.value is not None:
        try:
            float(custom_field.value)
        except (TypeError, ValueError):
            raise ValueError(
                f"Field '{custom_field.name}' in section '{section_name}' must be a float."
            )

    # PERCENTAGE
    if (
        field_type == ModuleTemplateFieldType.PERCENTAGE
        and custom_field.value is not None
    ):
        try:
            value = float(custom_field.value)
            if not 0 <= value <= 100:
                raise ValueError
        except (TypeError, ValueError):
            raise ValueError(
                f"Field '{custom_field.name}' in section '{section_name}' must be a percentage between 0 and 100."
            )

    # BOOLEAN
    if field_type == ModuleTemplateFieldType.BOOLEAN and custom_field.value is not None:
        if not isinstance(custom_field.value, bool):
            raise ValueError(
                f"Field '{custom_field.name}' in section '{section_name}' must be a boolean."
            )

    # PERIOD (expects { "term": int, "period": str })
    if field_type == ModuleTemplateFieldType.PERIOD and custom_field.value:
        if not isinstance(custom_field.value, dict):
            raise ValueError(
                f"Field '{custom_field.name}' in section '{section_name}' must be a period object."
            )

        if not isinstance(custom_field.value.get("term"), int):
            raise ValueError(
                f"Field '{custom_field.name}' in section '{section_name}' requires integer 'term'."
            )

        if not isinstance(custom_field.value.get("period"), str):
            raise ValueError(
                f"Field '{custom_field.name}' in section '{section_name}' requires string 'period'."
            )

    # ATTACHMENT / LOGO / BANNER
    if (
        field_type
        in {
            ModuleTemplateFieldType.ATTACHMENT,
            ModuleTemplateFieldType.LOGO,
            ModuleTemplateFieldType.BANNER,
        }
        and custom_field.value
    ):
        if (
            not isinstance(custom_field.value, dict)
            or "file_id" not in custom_field.value
        ):
            raise ValueError(
                f"Field '{custom_field.name}' in section '{section_name}' must reference a valid file."
            )

    # COLLECTION
    if field_type == ModuleTemplateFieldType.COLLECTION and custom_field.value:
        if not isinstance(custom_field.value, list):
            raise ValueError(
                f"Field '{custom_field.name}' in section '{section_name}' must be a list."
            )

    # TEMPLATE
    if field_type == ModuleTemplateFieldType.TEMPLATE and custom_field.value:
        if not isinstance(custom_field.value, dict):
            raise ValueError(
                f"Field '{custom_field.name}' in section '{section_name}' must be a template object."
            )

    # Validate mandatory/optional fields
    if is_required:
        if custom_field.value is None:
            raise ValueError(
                f"Field '{custom_field.name}' in section '{section_name}' is mandatory and cannot be null."
            )
        elif custom_field.value == "":
            raise ValueError(
                f"Field '{custom_field.name}' in section '{section_name}' is mandatory and cannot be blank."
            )
        elif field_type == ModuleTemplateFieldType.CHOICE and not custom_field.value:
            raise ValueError(
                f"Field '{custom_field.name}' in section '{section_name}' is mandatory and should have a value."
            )
    elif custom_field.value == "":
        custom_field.value = None


def validate_and_autofill_custom_sections_from_template(
    *, custom_sections, template_section_map, template_section_item_map
):
    for i, section in enumerate(custom_sections):
        if isinstance(section, dict):
            try:
                section["section_type"] = template_section_map[
                    section["name"]
                ].section_type
            except KeyError:
                raise ValueError(
                    f"Custom section name: {section['name']} is not present in template"
                )
            section = CustomSectionDataClass(**section)
        else:
            section.section_type = template_section_map[section.name].section_type
        for custom_field_struct in section.custom_fields:
            try:
                section_item = template_section_item_map[
                    (section.name, custom_field_struct.name)
                ]
            except KeyError:
                raise ValueError(
                    f"Custom field: {custom_field_struct.name} is not present in section: {section.name}"
                )
            validate_custom_field(
                custom_field=custom_field_struct,
                template_item=section_item,
                section_name=section.name,
            )
            custom_field_struct.type = (
                section_item.constraints["field_type"]
                if section_item.constraints.get("choice_type")
                != FieldChoiceType.MULTI_SELECT
                else CustomFieldType.MULTI_CHOICE.value
            )
            custom_field_struct = to_internal_value(
                custom_field_struct, custom_field_struct.type
            )
            custom_field_struct.description = section_item.description
            custom_field_struct.is_locked = True
            custom_field_struct.is_required = section_item.is_required
            custom_field_struct.is_visible = section_item.additional_information.get(
                "is_visible"
            )
            custom_field_struct.is_negotiable = section_item.additional_information.get(
                "is_negotiable"
            )
            custom_field_struct.is_mandatory = section_item.is_mandatory
        custom_sections[i] = section
    return custom_sections
