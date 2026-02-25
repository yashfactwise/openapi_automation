[
    {
        "type": "VENDOR",
        "count": 1,
        "templates": [
            {
                "template_id": "c973b6a2-3da7-41b3-ae3d-b91da3f53137",
                "type": "VENDOR",
                "name": "Default Vendor",
                "tags": [
                    "#VENDOR"
                ],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": true,
                "created_on": "2024-12-12T10:21:20.715687Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-11-08T07:11:33.361007Z",
                "entity_id": "20d11e41-5ee0-40f1-9f01-a619d20e74e3",
                "entity_name": "FactWise",
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
                        "section_id": "aa9787ae-1bf5-4165-bdb9-18186bfed3eb",
                        "name": "Vendor Details",
                        "alternate_name": "Vendor Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "0eafae1d-542f-4746-a495-cb70ccc5a625",
                                "name": "Vendor company legal name",
                                "alternate_name": "Vendor company legal name",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 1,
                                    "max_limit": 500,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "2282a231-6ad9-49fa-ba6d-c4f033125df4",
                                "name": "Primary contact",
                                "alternate_name": "Primary contact",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "cafca47e-1861-4f75-a2e5-95330e843775",
                                "name": "Vendor identification",
                                "alternate_name": "Vendor identification",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "57823289-e5cf-4f0c-ba87-7e4dab47e292",
                                "name": "Secondary contact",
                                "alternate_name": "Secondary contact",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "b0f660af-fd91-4e4e-83c6-6fd6f9eebab8",
                                "name": "Tag",
                                "alternate_name": "Tag",
                                "constraints": {
                                    "field_type": "SHORTTEXT",
                                    "min_limit": 1,
                                    "max_limit": 100,
                                    "type": "ShortTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "d24efdc1-83ae-4830-9d04-fbab73e5f8bf",
                                "name": "Notes",
                                "alternate_name": "Notes",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 1,
                                    "max_limit": 1000,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "f156563a-6268-4b6a-af55-461422575f85",
                                "name": "Additional costs",
                                "alternate_name": "Additional costs",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "efbd5415-a5dc-4016-bce4-58011110a52f",
                                "name": "Vendor addresses",
                                "alternate_name": "Vendor addresses",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 1,
                                    "max_limit": 500,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "90d1b54f-db82-4ad6-86bf-39278f97741c",
                                "name": "Vendor code",
                                "alternate_name": "Vendor code",
                                "constraints": {
                                    "field_type": "SHORTTEXT",
                                    "min_limit": 1,
                                    "max_limit": 200,
                                    "type": "ShortTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "d74e5bd7-bc28-488d-bdf1-1c747171ca0b",
                                "name": "Short text | OL",
                                "alternate_name": "Short text | OL",
                                "constraints": {
                                    "field_type": "SHORTTEXT",
                                    "min_limit": 0,
                                    "max_limit": 15,
                                    "type": "ShortTextField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "03d4e5ab-2c42-49a6-8d0d-081cb1ffe9a4",
                                "name": "Long text | OL",
                                "alternate_name": "Long text | OL",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 0,
                                    "max_limit": 120,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "20668fdd-5b20-4652-97fe-683b232513ef",
                                "name": "Multi-select | OL",
                                "alternate_name": "Multi-select | OL",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Option 1",
                                        "Option 2",
                                        "Option 3",
                                        "Option 4"
                                    ],
                                    "choice_type": "MULTI_SELECT",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "7516449d-81e0-4e84-8555-af684e81b15d",
                                "name": "Checkbox | OL",
                                "alternate_name": "Checkbox | OL",
                                "constraints": {
                                    "field_type": "BOOLEAN",
                                    "type": "BooleanField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "dbc23473-5d38-4679-acb4-1e846467e16b",
                                "name": "Date | OL",
                                "alternate_name": "Date | OL",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "a3c8f79b-77e6-4b6c-ab28-f2a608ecdf8b",
                                "name": "TEST",
                                "alternate_name": "TEST",
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
                                        "cost_source": "VENDOR",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "61ef7135-aa26-40cf-88e9-e744e621e1d6"
                                    }
                                },
                                "parent_section_item": "f156563a-6268-4b6a-af55-461422575f85"
                            },
                            {
                                "section_item_id": "5a4ff833-15f8-412c-81b5-6673310638dd",
                                "name": "Tyt",
                                "alternate_name": "Tyt",
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
                                        "cost_source": "VENDOR",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "c97a5435-b031-443d-905d-91debf14f935"
                                    }
                                },
                                "parent_section_item": "f156563a-6268-4b6a-af55-461422575f85"
                            },
                            {
                                "section_item_id": "56996183-1bf3-43a7-94f7-906b788ec256",
                                "name": "Number | OL",
                                "alternate_name": "Number | OL",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
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