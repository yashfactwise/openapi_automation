[
    {
        "type": "ITEM",
        "count": 1,
        "templates": [
            {
                "template_id": "774f64f1-60cf-4419-9db5-0cbeae69e364",
                "type": "ITEM",
                "name": "Default Item",
                "tags": [
                    "#ITEM"
                ],
                "status": "REVISED",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": true,
                "created_on": "2025-01-07T14:10:39.518380Z",
                "creator_name": "Admin",
                "last_edited_on": "2026-02-23T11:25:12.083262Z",
                "entity_id": "47924a71-c523-4c7a-934d-f1f6ac543bbc",
                "entity_name": "FactWise Demo",
                "auto_reminders": {
                    "max_reminders": 4,
                    "reminder_interval": 24,
                    "is_remainder_required": true,
                    "initial_reminder_hours": 12
                },
                "linked_templates": null,
                "last_edited_by_name": "Admin",
                "assigned_users": [],
                "section_list": [
                    {
                        "section_id": "6ff48e5a-5f95-4da0-a829-f3195216efa1",
                        "name": "Item Details",
                        "alternate_name": "Item Details",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "6a2ddf8b-c062-46c7-9375-4457d4d8dc99",
                                "name": "MPN Code",
                                "alternate_name": "MPN Code",
                                "constraints": {
                                    "field_type": "SHORTTEXT",
                                    "min_limit": 1,
                                    "max_limit": 200,
                                    "type": "ShortTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "174fb51f-9fa8-475a-b360-ef6f6e7c67df",
                                "name": "HSN Code",
                                "alternate_name": "HSN Code",
                                "constraints": {
                                    "field_type": "SHORTTEXT",
                                    "min_limit": 1,
                                    "max_limit": 200,
                                    "type": "ShortTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "fd8e472f-fea0-47e5-89dd-ffbfc688ea38",
                                "name": "Short NG",
                                "alternate_name": "Short NG",
                                "constraints": {
                                    "field_type": "SHORTTEXT",
                                    "min_limit": 0,
                                    "max_limit": 15,
                                    "type": "ShortTextField"
                                },
                                "is_builtin_field": false,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "e577214b-55be-4eba-b82c-5faf05320425",
                                "name": "Number NG",
                                "alternate_name": "Number NG",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "aa1fe93b-b5c2-4ce7-a78c-0c494d3a3517",
                                "name": "Long NG",
                                "alternate_name": "Long NG",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 0,
                                    "max_limit": 120,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": false,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "bc5db6f3-ae4d-4d44-adec-9d036b024481",
                                "name": "Date NG",
                                "alternate_name": "Date NG",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": false,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "260c6b3c-7e2e-4c1d-bf93-e5eebc042d9e",
                                "name": "Checkbox NG",
                                "alternate_name": "Checkbox NG",
                                "constraints": {
                                    "field_type": "BOOLEAN",
                                    "type": "BooleanField"
                                },
                                "is_builtin_field": false,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "e50a019f-3216-4d13-b8a2-b48e4d50a014",
                                "name": "Select NG",
                                "alternate_name": "Select NG",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Yes",
                                        "No",
                                        "Maybe",
                                        "Idk"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": false,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "4f3ed1b9-2604-4118-af8d-a585adf8c3f8",
                                "name": "Multi Select NG",
                                "alternate_name": "Multi Select NG",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Yes",
                                        "No",
                                        "Maybe",
                                        "Idk"
                                    ],
                                    "choice_type": "MULTI_SELECT",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": false,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "0aa4f59b-ea00-48dc-b692-a6441979ebdd",
                                "name": "AC % ID",
                                "alternate_name": "AC % ID",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 100.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
                                },
                                "is_builtin_field": false,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "additional_cost_information": {
                                        "cost_type": "PERCENTAGE",
                                        "cost_source": "ITEM",
                                        "allocation_type": null,
                                        "additional_cost_id": "aa8d6811-87ce-4116-a7ce-eded09a935ad"
                                    }
                                },
                                "parent_section_item": "cc24ffb6-2802-4623-b50c-46193d6151dc"
                            },
                            {
                                "section_item_id": "ec64b19b-0c6d-486d-822b-feba234518af",
                                "name": "AC PU ID",
                                "alternate_name": "AC PU ID",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1e+19,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "additional_cost_information": {
                                        "cost_type": "ABSOLUTE_VALUE",
                                        "cost_source": "ITEM",
                                        "allocation_type": "PER_UNIT",
                                        "additional_cost_id": "2d37845e-55d0-4d27-b727-473cb29ff6f3"
                                    }
                                },
                                "parent_section_item": "cc24ffb6-2802-4623-b50c-46193d6151dc"
                            },
                            {
                                "section_item_id": "685980a5-a999-4d32-84a8-4f6476f9bb83",
                                "name": "AC OQ ID",
                                "alternate_name": "AC OQ ID",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1e+19,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "additional_cost_information": {
                                        "cost_type": "ABSOLUTE_VALUE",
                                        "cost_source": "ITEM",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "34301747-341d-4c03-aaa3-27096c37352b"
                                    }
                                },
                                "parent_section_item": "cc24ffb6-2802-4623-b50c-46193d6151dc"
                            },
                            {
                                "section_item_id": "aaf0d5e1-21c4-4f71-bf91-75331ed6ed9c",
                                "name": "Item code",
                                "alternate_name": "Item code",
                                "constraints": {
                                    "field_type": "SHORTTEXT",
                                    "min_limit": 1,
                                    "max_limit": 200,
                                    "type": "ShortTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "399ecf9f-0382-47bb-8597-0bbb2b2a940b",
                                "name": "Item name",
                                "alternate_name": "Item name",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 1,
                                    "max_limit": 500,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "abf0c30f-ef17-4ac8-9f63-d7bd504b03f3",
                                "name": "Description",
                                "alternate_name": "Description",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 1,
                                    "max_limit": 500,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "67de4e5d-3ff8-452e-baf1-f3e6bad4c40b",
                                "name": "Procurement item",
                                "alternate_name": "Procurement item",
                                "constraints": {
                                    "field_type": "BOOLEAN",
                                    "type": "BooleanField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "3fb5da9c-c854-49b6-8b64-89bb78585742",
                                "name": "Sales item price",
                                "alternate_name": "Sales item price",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "cc24ffb6-2802-4623-b50c-46193d6151dc",
                                "name": "Additional costs",
                                "alternate_name": "Additional costs",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "16e8b0d5-e516-4d49-a67e-042458e6c412",
                                "name": "Item type",
                                "alternate_name": "Item type",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Finished good",
                                        "Raw material"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "86712023-9866-4d93-b62d-a58ec0b1f240",
                                "name": "Procurement item price",
                                "alternate_name": "Procurement item price",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "1b78eb1b-8675-4086-ab40-dbb0c953b502",
                                "name": "Measurement unit",
                                "alternate_name": "Measurement unit",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "315d90b4-8da9-4ddf-be70-edda2829753e",
                                "name": "Notes",
                                "alternate_name": "Notes",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 1,
                                    "max_limit": 500,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "04f29e38-354a-4ffa-89fc-44e4de9d834d",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 1,
                                    "max_limit": 500,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "6a72437f-1e9c-4e0f-8537-28a685d83738",
                                "name": "Specification",
                                "alternate_name": "Specification",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "c93c4ebe-20b1-441e-828a-f34a0161bedd",
                                "name": "Tag",
                                "alternate_name": "Tag",
                                "constraints": {
                                    "field_type": "SHORTTEXT",
                                    "min_limit": 1,
                                    "max_limit": 100,
                                    "type": "ShortTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "ac8295f3-3c50-4121-b041-86a9125b3abd",
                                "name": "Sales item",
                                "alternate_name": "Sales item",
                                "constraints": {
                                    "field_type": "BOOLEAN",
                                    "type": "BooleanField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "6f727739-2b9d-4191-a6ca-2b37554d21c2",
                                "name": "Tax PU ID",
                                "alternate_name": "Tax PU ID",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1e+19,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "taxes_information": {
                                        "cost_type": "ABSOLUTE_VALUE",
                                        "cost_source": null,
                                        "allocation_type": "PER_UNIT",
                                        "additional_cost_id": "9cbb9b5a-393a-4eef-9572-af88f4d2df2d"
                                    }
                                },
                                "parent_section_item": "ce7341b2-10d5-4a50-96ce-cd4e6a5644a7"
                            },
                            {
                                "section_item_id": "ce7341b2-10d5-4a50-96ce-cd4e6a5644a7",
                                "name": "Taxes",
                                "alternate_name": "Taxes",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "12d94ead-d3dd-4b05-bee6-41d29dbc62d9",
                                "name": "Tax OQ ID",
                                "alternate_name": "Tax OQ ID",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1e+19,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "taxes_information": {
                                        "cost_type": "ABSOLUTE_VALUE",
                                        "cost_source": null,
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "b2760053-2371-4c96-b4da-d1299801c1e4"
                                    }
                                },
                                "parent_section_item": "ce7341b2-10d5-4a50-96ce-cd4e6a5644a7"
                            },
                            {
                                "section_item_id": "cbc28138-218f-4a24-9b82-2bc41d3c9677",
                                "name": "Tax % ID",
                                "alternate_name": "Tax % ID",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 100.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
                                },
                                "is_builtin_field": false,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "taxes_information": {
                                        "cost_type": "PERCENTAGE",
                                        "cost_source": null,
                                        "allocation_type": null,
                                        "additional_cost_id": "f940d07a-668e-4d8e-bb1a-b014b558fde8"
                                    }
                                },
                                "parent_section_item": "ce7341b2-10d5-4a50-96ce-cd4e6a5644a7"
                            },
                            {
                                "section_item_id": "810b07d6-69df-453a-8603-668fe3a36c4d",
                                "name": "Custom identification",
                                "alternate_name": "Item identifications",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "1cdfb0ff-6a65-474d-8b9e-5bd47c4c88c8",
                                "name": "Tax Source",
                                "alternate_name": "Tax Source",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1e+19,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "taxes_information": {
                                        "cost_type": "ABSOLUTE_VALUE",
                                        "cost_source": null,
                                        "allocation_type": "PER_UNIT",
                                        "additional_cost_id": "1f995f7c-18fd-4715-b1a2-984ece874365"
                                    }
                                },
                                "parent_section_item": "ce7341b2-10d5-4a50-96ce-cd4e6a5644a7"
                            },
                            {
                                "section_item_id": "db9786d2-88ce-4bb5-b52c-47cd0bfd5859",
                                "name": "CPN Code",
                                "alternate_name": "CPN Code",
                                "constraints": {
                                    "field_type": "SHORTTEXT",
                                    "min_limit": 1,
                                    "max_limit": 200,
                                    "type": "ShortTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "865a8555-03de-4e03-b7fa-4a1e4c13f853",
                                "name": "ERP Code",
                                "alternate_name": "SAP Item ID",
                                "constraints": {
                                    "field_type": "SHORTTEXT",
                                    "min_limit": 1,
                                    "max_limit": 200,
                                    "type": "ShortTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    }
                ]
            }
        ]
    }
]