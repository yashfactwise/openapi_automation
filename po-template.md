[
    {
        "type": "PO_GROUP",
        "count": 14,
        "templates": [
            {
                "template_id": "a273b5d4-e768-4167-9ff1-ed884ce94b8c",
                "type": "PO_GROUP",
                "name": "Default PO GROUP",
                "tags": [
                    "#PO GROUP",
                    "#EVENT"
                ],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": true,
                "created_on": "2025-01-07T14:10:38.514828Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-01-07T14:10:38.509824Z",
                "entity_id": "47924a71-c523-4c7a-934d-f1f6ac543bbc",
                "entity_name": "FactWise Demo",
                "auto_reminders": null,
                "linked_templates": null,
                "last_edited_by_name": "Admin",
                "assigned_users": [],
                "section_list": [
                    {
                        "section_id": "1cb97afd-f2ce-423f-9915-9a65d35d4391",
                        "name": "PO Group Details",
                        "alternate_name": "PO Group Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "5bec83dd-59a5-47a8-8cbd-462dbb4240af",
                                "name": "PO Group Name",
                                "alternate_name": "PO Group Name",
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
                                "section_item_id": "eef330f2-754e-4b70-bd5d-10bcea014213",
                                "name": "Buyer entity",
                                "alternate_name": "Buyer entity",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "88876794-df93-4e3e-8916-db03d697adc1",
                                "name": "Template",
                                "alternate_name": "Template",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "a5cf87ce-3f5e-49ef-b404-23ba654a8f34",
                                "name": "Overall currency",
                                "alternate_name": "Overall currency",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "427aaf60-8645-401b-8bd6-33f1f838e11f",
                                "name": "Default item terms",
                                "alternate_name": "Default item terms",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "16f58e9e-c36d-46b2-9b40-40ce8019b318",
                                "name": "Overall taxes",
                                "alternate_name": "Overall taxes",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "5432eac8-3ae1-4962-9d00-4149cf9156fb",
                                "name": "Overall additional costs",
                                "alternate_name": "Overall additional costs",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "2b2f2fe3-4ebc-452b-bd6d-f7e9eb57ab07",
                                "name": "Overall discount information",
                                "alternate_name": "Overall discount information",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "23a9bb59-8c04-47d6-9ada-43dbb8570300",
                                "name": "Overall discount",
                                "alternate_name": "Overall discount",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": true,
                                    "is_negotiable": false,
                                    "discount_information": {
                                        "cost_type": "PERCENTAGE",
                                        "allocation_type": null
                                    }
                                },
                                "parent_section_item": "2b2f2fe3-4ebc-452b-bd6d-f7e9eb57ab07"
                            }
                        ]
                    },
                    {
                        "section_id": "2a36e949-42b9-4daf-b9b0-4a61d94dbf1e",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "572cb5e3-fba7-4e13-9667-e85d751a7558",
                                "name": "Item",
                                "alternate_name": "Item",
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
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "05a88614-a983-4bbc-a870-10f805abd9d8",
                                "name": "Custom specification",
                                "alternate_name": "Custom specification",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "97a3554e-7b33-4959-9127-753c51cf461f",
                                "name": "Quantity Information",
                                "alternate_name": "Quantity Information",
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
                                "section_item_id": "0d0c0f1a-4fae-4eb5-a7fd-9711a347e649",
                                "name": "Delivery date",
                                "alternate_name": "Delivery date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "97a3554e-7b33-4959-9127-753c51cf461f"
                            },
                            {
                                "section_item_id": "d880b3c1-dfd1-4406-8bdf-25789e44f7a6",
                                "name": "Quantity",
                                "alternate_name": "Quantity",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "97a3554e-7b33-4959-9127-753c51cf461f"
                            },
                            {
                                "section_item_id": "7e3bf526-b89c-4542-bdb1-350693f87bbb",
                                "name": "Cost center",
                                "alternate_name": "Cost center",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "97a3554e-7b33-4959-9127-753c51cf461f"
                            },
                            {
                                "section_item_id": "e819ccb6-69c1-474c-b564-d6d2d3373522",
                                "name": "GL",
                                "alternate_name": "GL",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "97a3554e-7b33-4959-9127-753c51cf461f"
                            },
                            {
                                "section_item_id": "ad1dab76-7e6a-43a0-8971-1cc53a0c4668",
                                "name": "Project",
                                "alternate_name": "Project",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "97a3554e-7b33-4959-9127-753c51cf461f"
                            },
                            {
                                "section_item_id": "3a4e885a-ad37-4276-972b-238837956818",
                                "name": "Target rate",
                                "alternate_name": "Target rate",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "65a0d1ea-55e9-41d7-9d69-0f0f794be43b",
                                "name": "Taxes",
                                "alternate_name": "Taxes",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "6950ba65-32f9-4559-95a5-dcc59b9f5449",
                                "name": "Additional costs",
                                "alternate_name": "Additional costs",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "1e530dd6-7d47-451f-907f-694481ae9acd",
                                "name": "Discount information",
                                "alternate_name": "Discount information",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "ae651e8e-6135-421c-a614-a2d8ac1b929b",
                                "name": "Discount",
                                "alternate_name": "Discount",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false,
                                    "discount_information": {
                                        "cost_type": "PERCENTAGE",
                                        "allocation_type": null
                                    }
                                },
                                "parent_section_item": "1e530dd6-7d47-451f-907f-694481ae9acd"
                            }
                        ]
                    },
                    {
                        "section_id": "828dee43-f557-4b6c-b77e-a4b451f523d4",
                        "name": "Vendor Information",
                        "alternate_name": "Vendor Information",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "3857b87b-1f6e-41ce-8ea7-181ad47345b0",
                                "name": "Vendor",
                                "alternate_name": "Vendor",
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
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "d00dd2f6-fd82-48a2-a3a3-5d29a5ef5be4",
                        "name": "Payment and Delivery Terms",
                        "alternate_name": "Payment and Delivery Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "eca03ee4-ec06-4821-a8a7-4862ad70a3ee",
                                "name": "Payment terms",
                                "alternate_name": "Payment terms",
                                "constraints": {
                                    "field_type": "PERIOD",
                                    "choices": null,
                                    "type": "PeriodField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "payment_type": "Pay as per Invoice terms",
                                    "is_negotiable": false,
                                    "allow_prepayment": true,
                                    "payment_from_options": [
                                        "Dispatch date",
                                        "Invoice date",
                                        "Receipt date"
                                    ]
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "da476f22-929b-46ba-a5c3-31ec316b0644",
                                "name": "Incoterms",
                                "alternate_name": "Incoterms",
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
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "7f840c5b-0803-4bef-8b7e-39576828a79e",
                                "name": "Lead time",
                                "alternate_name": "Lead time",
                                "constraints": {
                                    "field_type": "PERIOD",
                                    "choices": null,
                                    "type": "PeriodField"
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
                                "section_item_id": "40e98a38-7a51-4c9f-bd97-c7eafd569b3b",
                                "name": "GR tolerance",
                                "alternate_name": "GR tolerance",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 10.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "4835b276-cf19-44d1-98de-4867c62d5022",
                        "name": "Additional Details",
                        "alternate_name": "Additional Details",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "dc1e284a-f70b-497a-ae15-54e815f88d49",
                                "name": "Additional information",
                                "alternate_name": "Additional information",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 0,
                                    "max_limit": 1000,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    }
                ]
            },
            {
                "template_id": "b9a1e5b5-aa66-415f-be9a-5427e59ead19",
                "type": "PO_GROUP",
                "name": "PO DTA",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2026-02-19T10:59:06.303321Z",
                "creator_name": "Admin",
                "last_edited_on": "2026-02-19T10:59:06.293922Z",
                "entity_id": "47924a71-c523-4c7a-934d-f1f6ac543bbc",
                "entity_name": "FactWise Demo",
                "auto_reminders": {
                    "max_reminders": 4,
                    "reminder_interval": 24,
                    "is_remainder_required": true,
                    "initial_reminder_hours": 12
                },
                "linked_templates": {},
                "last_edited_by_name": "Admin",
                "assigned_users": [],
                "section_list": [
                    {
                        "section_id": "d57deb91-1518-4b64-be74-1c85424cb8a1",
                        "name": "PO Group Details",
                        "alternate_name": "PO Group Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "d400bcdc-75c6-48da-bbe5-6c7b9c2935b4",
                                "name": "PO Group Name",
                                "alternate_name": "PO Group Name",
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
                                "section_item_id": "d6b8666f-9400-4025-9e05-77daa5732141",
                                "name": "Buyer entity",
                                "alternate_name": "Buyer entity",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "1547e436-f0bb-461a-911c-f8512e80ede3",
                                "name": "Template",
                                "alternate_name": "Template",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "67e0ba9b-14f9-4e6b-bf54-aedc694c8e61",
                                "name": "Overall currency",
                                "alternate_name": "Overall currency",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "250912bb-fd83-4e7e-bfd8-986d34a4e906",
                                "name": "Default item terms",
                                "alternate_name": "Default item terms",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "a5a2c4ac-2eb1-47a8-973f-ff391a539447",
                                "name": "Overall discount information",
                                "alternate_name": "Overall discount information",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "e0093125-87e6-4644-8fcf-2becde9efd26",
                                "name": "Overall discount",
                                "alternate_name": "Overall discount",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false,
                                    "discount_information": {
                                        "cost_type": "PERCENTAGE",
                                        "allocation_type": null
                                    }
                                },
                                "parent_section_item": "a5a2c4ac-2eb1-47a8-973f-ff391a539447"
                            },
                            {
                                "section_item_id": "90e3c74b-8590-4847-bb46-d7cdf4a5b790",
                                "name": "Overall taxes",
                                "alternate_name": "Overall taxes",
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
                                "section_item_id": "fa8b06e4-c042-4689-8ca3-612fc6817373",
                                "name": "Overall additional costs",
                                "alternate_name": "Overall additional costs",
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
                            }
                        ]
                    },
                    {
                        "section_id": "165f9f8f-9594-4455-8e7a-ea57a34da8d4",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "f4709068-083f-45c2-8e98-fed9f49f57e7",
                                "name": "Item",
                                "alternate_name": "Item",
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
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "1766a9eb-2ac7-479c-b211-e45f5b1c54d9",
                                "name": "Custom specification",
                                "alternate_name": "Custom specification",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "af06f196-a49b-4a9b-a2e4-3824bafadcce",
                                "name": "Quantity Information",
                                "alternate_name": "Quantity Information",
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
                                "section_item_id": "586134d7-ab73-47e5-a991-0eed00be98b1",
                                "name": "Delivery date",
                                "alternate_name": "Delivery date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "af06f196-a49b-4a9b-a2e4-3824bafadcce"
                            },
                            {
                                "section_item_id": "d8726d01-8c79-4a13-b301-4298c6cca1e7",
                                "name": "Quantity",
                                "alternate_name": "Quantity",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "af06f196-a49b-4a9b-a2e4-3824bafadcce"
                            },
                            {
                                "section_item_id": "d54a24f4-cebd-4eae-ad94-ca70c633fd8a",
                                "name": "Cost center",
                                "alternate_name": "Cost center",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "af06f196-a49b-4a9b-a2e4-3824bafadcce"
                            },
                            {
                                "section_item_id": "f80a3988-508f-495c-97ce-9afa670598cd",
                                "name": "GL",
                                "alternate_name": "GL",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "af06f196-a49b-4a9b-a2e4-3824bafadcce"
                            },
                            {
                                "section_item_id": "c18774ba-aa96-46d1-8e70-a9305929df33",
                                "name": "Project",
                                "alternate_name": "Project",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "af06f196-a49b-4a9b-a2e4-3824bafadcce"
                            },
                            {
                                "section_item_id": "5626b5e3-d099-4a7f-a6af-1ef4a14bcc8f",
                                "name": "Target rate",
                                "alternate_name": "Target rate",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "0d562747-ab76-496a-babb-94c14dcf867c",
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
                                "section_item_id": "fdf318d6-cc1d-4f91-840c-80a7bdf66f42",
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
                                "section_item_id": "9f553d52-a369-4d5a-97f7-a99e30e2a7aa",
                                "name": "Discount",
                                "alternate_name": "Discount",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "discount_information": {
                                        "cost_type": "PERCENTAGE",
                                        "cost_source": null,
                                        "allocation_type": "PER_UNIT",
                                        "additional_cost_id": null
                                    }
                                },
                                "parent_section_item": "a741b03b-14e7-4b05-b6af-9c84e32f93a9"
                            },
                            {
                                "section_item_id": "3117e5ab-6439-4d32-854c-99cb19e3abcf",
                                "name": "Item AC OQ",
                                "alternate_name": "Item AC OQ",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "c43ab29e-1019-4741-86be-a8f44958b621"
                                    }
                                },
                                "parent_section_item": "fdf318d6-cc1d-4f91-840c-80a7bdf66f42"
                            },
                            {
                                "section_item_id": "319e7458-f382-4a53-8a37-e02604e411ce",
                                "name": "DONT INCLUDE TAX ITEM LEVEL",
                                "alternate_name": "DONT INCLUDE TAX ITEM LEVEL",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": null,
                                        "additional_cost_id": "a9623968-6bc0-4d10-bbc6-68956e0da56b"
                                    }
                                },
                                "parent_section_item": "fdf318d6-cc1d-4f91-840c-80a7bdf66f42"
                            },
                            {
                                "section_item_id": "7fd07b56-765d-43d8-a010-ef09b0cd703c",
                                "name": "Item AC %",
                                "alternate_name": "Item AC %",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": null,
                                        "additional_cost_id": "41d06475-c338-42b3-8507-4658fc56e686"
                                    }
                                },
                                "parent_section_item": "fdf318d6-cc1d-4f91-840c-80a7bdf66f42"
                            },
                            {
                                "section_item_id": "ef372693-81ca-4c51-962c-b52a374cf658",
                                "name": "Tax 3 (Flat rate per unit) - included",
                                "alternate_name": "Tax 3 (Flat rate per unit) - included",
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
                                        "additional_cost_id": "fc4e2c5c-b116-4e00-b6a0-504f0e63cb85"
                                    }
                                },
                                "parent_section_item": "0d562747-ab76-496a-babb-94c14dcf867c"
                            },
                            {
                                "section_item_id": "35d86be7-840e-4235-b54e-e59e5706c13f",
                                "name": "DONT INCLUDE TAX IN TOTAL",
                                "alternate_name": "DONT INCLUDE TAX IN TOTAL",
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
                                        "additional_cost_id": "465c4b20-aabd-49fe-92eb-02439c7b613c"
                                    }
                                },
                                "parent_section_item": "0d562747-ab76-496a-babb-94c14dcf867c"
                            },
                            {
                                "section_item_id": "212e8fbd-a962-46da-a437-3b09adef0649",
                                "name": "INCLUDE TAX IN TOTAL",
                                "alternate_name": "INCLUDE TAX IN TOTAL",
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
                                        "additional_cost_id": "30d3d7c9-246b-428a-ad98-54d982b1a4ae"
                                    }
                                },
                                "parent_section_item": "0d562747-ab76-496a-babb-94c14dcf867c"
                            },
                            {
                                "section_item_id": "a741b03b-14e7-4b05-b6af-9c84e32f93a9",
                                "name": "Discount information",
                                "alternate_name": "Discount information",
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
                            }
                        ]
                    },
                    {
                        "section_id": "b8ed0ad4-8183-46b3-b532-9b52774e6e1c",
                        "name": "Vendor Information",
                        "alternate_name": "Vendor Information",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "8ab67c12-e21d-477a-bfa5-0e3ece0ff91b",
                                "name": "Vendor",
                                "alternate_name": "Vendor",
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
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "e1dfabb4-c519-4156-a9f4-cec02c702b3f",
                        "name": "Payment and Delivery Terms",
                        "alternate_name": "Payment and Delivery Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "6d2651a4-a0f2-463b-ac4d-7edb05e7a382",
                                "name": "Payment terms",
                                "alternate_name": "Payment terms",
                                "constraints": {
                                    "field_type": "PERIOD",
                                    "choices": null,
                                    "type": "PeriodField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "payment_type": "Pay as per Invoice terms",
                                    "is_negotiable": false,
                                    "allow_prepayment": true,
                                    "payment_from_options": [
                                        "Dispatch date",
                                        "Invoice date",
                                        "Receipt date"
                                    ]
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "beb3fb01-d567-441d-9e13-21815ff77962",
                                "name": "Incoterms",
                                "alternate_name": "Incoterms",
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
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "6acb393c-7a12-4aac-a850-3b54cb396e7d",
                                "name": "Lead time",
                                "alternate_name": "Lead time",
                                "constraints": {
                                    "field_type": "PERIOD",
                                    "choices": null,
                                    "type": "PeriodField"
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
                                "section_item_id": "6e333a0c-4f0e-4dcf-aac9-5cf210e620e9",
                                "name": "GR tolerance",
                                "alternate_name": "GR tolerance",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 10.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "f6ddcff7-eb4b-47a6-bf2b-a7782db2500d",
                        "name": "Additional Details",
                        "alternate_name": "Additional Details",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "094dd5fa-fd59-4da1-b14b-cdd2cb5c1f90",
                                "name": "Additional information",
                                "alternate_name": "Additional information",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 0,
                                    "max_limit": 1000,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    }
                ]
            },
            {
                "template_id": "4a5ddf41-d0a2-4763-9cd8-757214ce40c5",
                "type": "PO_GROUP",
                "name": "Template pr",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2026-02-06T08:36:25.565205Z",
                "creator_name": "Admin",
                "last_edited_on": "2026-02-06T08:36:25.558496Z",
                "entity_id": "47924a71-c523-4c7a-934d-f1f6ac543bbc",
                "entity_name": "FactWise Demo",
                "auto_reminders": {
                    "max_reminders": 4,
                    "reminder_interval": 24,
                    "is_remainder_required": true,
                    "initial_reminder_hours": 12
                },
                "linked_templates": {},
                "last_edited_by_name": "Admin",
                "assigned_users": [],
                "section_list": [
                    {
                        "section_id": "d0900863-7351-4157-8848-98d3939e8d14",
                        "name": "PO Group Details",
                        "alternate_name": "PO Group Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "3e4fc064-f247-4256-a331-b8c1633db437",
                                "name": "PO Group Name",
                                "alternate_name": "PO Group Name",
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
                                "section_item_id": "61321dbe-9881-4cea-8d84-2052650c426a",
                                "name": "Buyer entity",
                                "alternate_name": "Buyer entity",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "117f8036-5559-4689-922a-45907e2e923a",
                                "name": "Template",
                                "alternate_name": "Template",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "7d5b4f05-f4b3-4cbb-a20e-d31794138a7c",
                                "name": "Overall currency",
                                "alternate_name": "Overall currency",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "b6ae6d8d-a964-4d04-8ff7-7ac8b843e518",
                                "name": "Default item terms",
                                "alternate_name": "Default item terms",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "5a7db998-2f1c-41e2-8fb5-a88a07c2c44a",
                                "name": "Overall discount information",
                                "alternate_name": "Overall discount information",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "73c6c78a-8304-4cf6-bebd-3ea9739cab8b",
                                "name": "Overall discount",
                                "alternate_name": "Overall discount",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false,
                                    "discount_information": {
                                        "cost_type": "PERCENTAGE",
                                        "allocation_type": null
                                    }
                                },
                                "parent_section_item": "5a7db998-2f1c-41e2-8fb5-a88a07c2c44a"
                            },
                            {
                                "section_item_id": "fa4b49c9-7930-437d-8107-679c24adf92e",
                                "name": "Overall taxes",
                                "alternate_name": "Overall taxes",
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
                                "section_item_id": "84067d2b-340b-4bdb-b693-12e8e5e2e195",
                                "name": "Overall additional costs",
                                "alternate_name": "Overall additional costs",
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
                                "section_item_id": "a76f2bf0-11c9-4c10-a9f4-51be9b6fbab7",
                                "name": "OV Tax 2 (Flat rate) - not included",
                                "alternate_name": "OV Tax 2 (Flat rate) - not included",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1e+19,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "taxes_information": {
                                        "cost_type": "ABSOLUTE_VALUE",
                                        "cost_source": null,
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "5b0e865b-3a6a-4c45-94b6-51125f609e27"
                                    }
                                },
                                "parent_section_item": "fa4b49c9-7930-437d-8107-679c24adf92e"
                            },
                            {
                                "section_item_id": "28f98022-cdfd-429e-a278-175d7aa283d7",
                                "name": "OV Tax 1 (%) - not included",
                                "alternate_name": "OV Tax 1 (%) - not included",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 100.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "taxes_information": {
                                        "cost_type": "PERCENTAGE",
                                        "cost_source": null,
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "1e88c151-d4ce-4178-8ae8-d662f27de409"
                                    }
                                },
                                "parent_section_item": "fa4b49c9-7930-437d-8107-679c24adf92e"
                            },
                            {
                                "section_item_id": "a15df406-ffd7-461e-b248-d846da4405f7",
                                "name": "OV Tax 2 (Flat rate) - included",
                                "alternate_name": "OV Tax 2 (Flat rate) - included",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1e+19,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "taxes_information": {
                                        "cost_type": "ABSOLUTE_VALUE",
                                        "cost_source": null,
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "15e02a3e-81bd-4070-9fa3-10fdcb8efcb3"
                                    }
                                },
                                "parent_section_item": "fa4b49c9-7930-437d-8107-679c24adf92e"
                            },
                            {
                                "section_item_id": "fe271962-4b4f-4207-9809-b22a432468cd",
                                "name": "OV Tax 1 (%) - included",
                                "alternate_name": "OV Tax 1 (%) - included",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 100.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "taxes_information": {
                                        "cost_type": "PERCENTAGE",
                                        "cost_source": null,
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "7a11f7c4-a9cf-4681-bc5b-60d9c397c275"
                                    }
                                },
                                "parent_section_item": "fa4b49c9-7930-437d-8107-679c24adf92e"
                            },
                            {
                                "section_item_id": "344d1ea8-a622-4034-9600-028cc2308d75",
                                "name": "NOT INCLUDED TAX",
                                "alternate_name": "NOT INCLUDED TAX",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 100.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "taxes_information": {
                                        "cost_type": "PERCENTAGE",
                                        "cost_source": null,
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "364a0b88-d1fb-4cf8-874f-ded0a97efc34"
                                    }
                                },
                                "parent_section_item": "fa4b49c9-7930-437d-8107-679c24adf92e"
                            },
                            {
                                "section_item_id": "ec3e9aa7-27e7-45ae-bd8e-09ca39d76569",
                                "name": "INCLUDED TAX",
                                "alternate_name": "INCLUDED TAX",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 100.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "taxes_information": {
                                        "cost_type": "PERCENTAGE",
                                        "cost_source": null,
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "5bfafe7c-a76e-4f72-99fc-5b4ff7b4ed85"
                                    }
                                },
                                "parent_section_item": "fa4b49c9-7930-437d-8107-679c24adf92e"
                            },
                            {
                                "section_item_id": "3b1236d2-aa01-49c0-8b68-7c0771f4c136",
                                "name": "Customer cost",
                                "alternate_name": "Customer cost",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1e+19,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "additional_cost_information": {
                                        "cost_type": "ABSOLUTE_VALUE",
                                        "cost_source": "BUYER",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "0e5aaf0b-f23e-48b8-9758-f3bb314d46a5"
                                    }
                                },
                                "parent_section_item": "84067d2b-340b-4bdb-b693-12e8e5e2e195"
                            },
                            {
                                "section_item_id": "64a6a593-a968-455c-aea5-855de76d56ca",
                                "name": "Freight Cost",
                                "alternate_name": "Freight Cost",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1e+19,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "additional_cost_information": {
                                        "cost_type": "ABSOLUTE_VALUE",
                                        "cost_source": "VENDOR",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "6341cd24-5343-4021-8e43-e7ab511d828b"
                                    }
                                },
                                "parent_section_item": "84067d2b-340b-4bdb-b693-12e8e5e2e195"
                            },
                            {
                                "section_item_id": "cd5209a2-25f2-4650-af1f-c2edd1328180",
                                "name": "Packaging charge",
                                "alternate_name": "Packaging charge",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1e+19,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "additional_cost_information": {
                                        "cost_type": "ABSOLUTE_VALUE",
                                        "cost_source": "BUYER",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "a9967959-ce75-440b-9fbf-5fae45ccca20"
                                    }
                                },
                                "parent_section_item": "84067d2b-340b-4bdb-b693-12e8e5e2e195"
                            },
                            {
                                "section_item_id": "a2655be3-9315-48d6-ab49-5d1917641168",
                                "name": "AC - OQ",
                                "alternate_name": "AC - OQ",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1e+19,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "additional_cost_information": {
                                        "cost_type": "ABSOLUTE_VALUE",
                                        "cost_source": "BUYER",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "0e3b690b-db6e-452c-b287-384fee6a0174"
                                    }
                                },
                                "parent_section_item": "84067d2b-340b-4bdb-b693-12e8e5e2e195"
                            },
                            {
                                "section_item_id": "8f78dc2b-f8e3-4882-aa83-d4363035f362",
                                "name": "Overall AC OQ",
                                "alternate_name": "Overall AC OQ",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1e+19,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "additional_cost_information": {
                                        "cost_type": "ABSOLUTE_VALUE",
                                        "cost_source": "VENDOR",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "243bf4ac-a381-4d9a-ba5a-845a18a8dd31"
                                    }
                                },
                                "parent_section_item": "84067d2b-340b-4bdb-b693-12e8e5e2e195"
                            },
                            {
                                "section_item_id": "404b44ae-173b-4c12-8b30-89e68ffa8fd2",
                                "name": "Overall AC %",
                                "alternate_name": "Overall AC %",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 100.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "additional_cost_information": {
                                        "cost_type": "PERCENTAGE",
                                        "cost_source": "VENDOR",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "95ccb388-c556-400d-a2ec-20a51a6fc51a"
                                    }
                                },
                                "parent_section_item": "84067d2b-340b-4bdb-b693-12e8e5e2e195"
                            },
                            {
                                "section_item_id": "5a575b92-53f8-4bf1-a21b-bb6947af4f5c",
                                "name": "AC% VO",
                                "alternate_name": "AC% VO",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 100.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "additional_cost_information": {
                                        "cost_type": "PERCENTAGE",
                                        "cost_source": "VENDOR",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "08b49f73-2e22-4ffd-8ec2-b0a86141ade9"
                                    }
                                },
                                "parent_section_item": "84067d2b-340b-4bdb-b693-12e8e5e2e195"
                            },
                            {
                                "section_item_id": "125f73d4-2b81-4a6a-bb8c-edc4868db7b3",
                                "name": "ACOQ VO",
                                "alternate_name": "ACOQ VO",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1e+19,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "additional_cost_information": {
                                        "cost_type": "ABSOLUTE_VALUE",
                                        "cost_source": "VENDOR",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "d6e18f17-d6c8-4d21-9207-7709e51b5342"
                                    }
                                },
                                "parent_section_item": "84067d2b-340b-4bdb-b693-12e8e5e2e195"
                            },
                            {
                                "section_item_id": "40c23298-e74c-4d24-a6c6-4087606b337a",
                                "name": "OV AC 1 (%) - included",
                                "alternate_name": "OV AC 1 (%) - included",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 100.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "additional_cost_information": {
                                        "cost_type": "PERCENTAGE",
                                        "cost_source": "DEFAULT",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "e9361d9b-b4ed-45c5-94f8-17b4242271c7"
                                    }
                                },
                                "parent_section_item": "84067d2b-340b-4bdb-b693-12e8e5e2e195"
                            },
                            {
                                "section_item_id": "25e07456-c576-4dc6-9d0c-7efa1ef0aa6b",
                                "name": "OV AC 2 (Flat rate) - included",
                                "alternate_name": "OV AC 2 (Flat rate) - included",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1e+19,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "additional_cost_information": {
                                        "cost_type": "ABSOLUTE_VALUE",
                                        "cost_source": "DEFAULT",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "d2d0c9a8-415c-4694-b5c3-09f0b207498f"
                                    }
                                },
                                "parent_section_item": "84067d2b-340b-4bdb-b693-12e8e5e2e195"
                            },
                            {
                                "section_item_id": "f44a6c6f-4f3d-4e64-b96c-7605c709fd9e",
                                "name": "OV AC 1 (%) - not included",
                                "alternate_name": "OV AC 1 (%) - not included",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 100.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "additional_cost_information": {
                                        "cost_type": "PERCENTAGE",
                                        "cost_source": "DEFAULT",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "a3907145-db58-4dc9-8e3b-ca7818c5a8b1"
                                    }
                                },
                                "parent_section_item": "84067d2b-340b-4bdb-b693-12e8e5e2e195"
                            },
                            {
                                "section_item_id": "b943004c-345c-4679-b2c5-b5b3c9bf6efc",
                                "name": "OV AC 2 (Flat rate) - not included",
                                "alternate_name": "OV AC 2 (Flat rate) - not included",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1e+19,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "additional_cost_information": {
                                        "cost_type": "ABSOLUTE_VALUE",
                                        "cost_source": "DEFAULT",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "e75ec075-469c-4d02-a3d0-7695518a84ad"
                                    }
                                },
                                "parent_section_item": "84067d2b-340b-4bdb-b693-12e8e5e2e195"
                            }
                        ]
                    },
                    {
                        "section_id": "d1af161e-f9db-4096-a342-58f8a867dce1",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "da823d3c-3b1a-4729-abce-872fb1f5c002",
                                "name": "Item",
                                "alternate_name": "Item",
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
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "fa365f5a-4fc7-490c-94b0-570fbf7e9213",
                                "name": "Custom specification",
                                "alternate_name": "Custom specification",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "27d9f977-a9a7-4bdb-b170-a38f37b4d3cd",
                                "name": "Quantity Information",
                                "alternate_name": "Quantity Information",
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
                                "section_item_id": "dc09fec9-0bc9-44a0-9d2c-ae054a652e43",
                                "name": "Delivery date",
                                "alternate_name": "Delivery date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "27d9f977-a9a7-4bdb-b170-a38f37b4d3cd"
                            },
                            {
                                "section_item_id": "8b14f261-2ed6-4ed6-a012-fe2028267b72",
                                "name": "Quantity",
                                "alternate_name": "Quantity",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "27d9f977-a9a7-4bdb-b170-a38f37b4d3cd"
                            },
                            {
                                "section_item_id": "83d7cdcb-984b-4abe-bb84-5f50125c3611",
                                "name": "Cost center",
                                "alternate_name": "Cost center",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "27d9f977-a9a7-4bdb-b170-a38f37b4d3cd"
                            },
                            {
                                "section_item_id": "e90b5057-d3ec-44b0-90cc-e7cc65aa092f",
                                "name": "GL",
                                "alternate_name": "GL",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "27d9f977-a9a7-4bdb-b170-a38f37b4d3cd"
                            },
                            {
                                "section_item_id": "ed049f5f-e611-4862-85a5-233a5a249a61",
                                "name": "Target rate",
                                "alternate_name": "Target rate",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "3daf25b1-185c-4a5e-8e35-6daca1114d93",
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
                                "section_item_id": "8959b374-c02c-440b-989c-9db5c1014478",
                                "name": "Discount information",
                                "alternate_name": "Discount information",
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
                                "section_item_id": "cbd5da55-934f-4a92-922a-7775cb13ef0d",
                                "name": "Project",
                                "alternate_name": "Project",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "27d9f977-a9a7-4bdb-b170-a38f37b4d3cd"
                            },
                            {
                                "section_item_id": "a8a6067f-c5c3-4d31-bc2b-bda8e37c7951",
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
                                "section_item_id": "c17db458-3308-4143-9a1f-0d60c66701b7",
                                "name": "Cost1",
                                "alternate_name": "Cost1",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "15098509-ec3d-4f9f-aa71-542e80b7f686"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "c5c3bf44-7635-4de7-8349-33da75f8553c",
                                "name": "Add Cost",
                                "alternate_name": "Add Cost",
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
                                        "cost_source": "FORMULA",
                                        "allocation_type": null,
                                        "additional_cost_id": "14f5834d-7994-4e44-9267-adb5c31393e4"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "d3f7db19-20ae-497f-8797-5f38e5dabb21",
                                "name": "Item AC OQ",
                                "alternate_name": "Item AC OQ",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "c43ab29e-1019-4741-86be-a8f44958b621"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "31cb48d2-2ed5-4781-a683-8fef5647878e",
                                "name": "v3",
                                "alternate_name": "v3",
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
                                        "cost_source": "FORMULA",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "54d187fe-cd75-47a3-841e-349120ce774a"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "a51fb4fa-889f-4deb-8d60-333778c9c1be",
                                "name": "ACOQ VI",
                                "alternate_name": "ACOQ VI",
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
                                        "cost_source": "VENDOR",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "4650ccb1-ab9a-4869-b223-cc69c0645460"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "afee7b7c-e95f-4ad7-8db0-faae3e37fc13",
                                "name": "ACPU VI",
                                "alternate_name": "ACPU VI",
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
                                        "cost_source": "VENDOR",
                                        "allocation_type": "PER_UNIT",
                                        "additional_cost_id": "47cbc39e-38e3-4214-aacf-bcab6dff9416"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "989c4ba8-219c-42bc-8dfb-55deedffbe91",
                                "name": "AC% - Item - NMB NV",
                                "alternate_name": "AC% - Item - NMB NV",
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
                                    "is_visible": false,
                                    "is_negotiable": false,
                                    "additional_cost_information": {
                                        "cost_type": "PERCENTAGE",
                                        "cost_source": "DEFAULT",
                                        "allocation_type": null,
                                        "additional_cost_id": "8222d17e-6ac9-49d2-9622-0fbde57ad813"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "63009c58-987b-4bc0-aedc-46e58b8deeec",
                                "name": "AC% - Item - NMB V",
                                "alternate_name": "AC% - Item - NMB V",
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
                                    "is_negotiable": false,
                                    "additional_cost_information": {
                                        "cost_type": "PERCENTAGE",
                                        "cost_source": "DEFAULT",
                                        "allocation_type": null,
                                        "additional_cost_id": "34e29d61-f0d5-464c-aab3-036c59d77c87"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "16987316-5a1a-4008-b2ba-9ec9f65ad3a9",
                                "name": "AC% - Item - NMB VCN",
                                "alternate_name": "AC% - Item - NMB VCN",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": null,
                                        "additional_cost_id": "0859c6ce-4bfb-4e21-9fc7-fd5f42a77bd2"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "1ba60520-4654-4328-87ea-d7c201999c58",
                                "name": "AC% - Item - NMB MV",
                                "alternate_name": "AC% - Item - NMB MV",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": null,
                                        "additional_cost_id": "1df0384d-7dad-4002-9654-046c4c007132"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "c7c74812-d926-4147-8b5a-715b57932073",
                                "name": "AC% - Item - MB MV",
                                "alternate_name": "AC% - Item - MB MV",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": null,
                                        "additional_cost_id": "7287c237-a144-4042-882d-6876cf8b488e"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "4e50b95d-38b3-4009-bc79-be7ad87be03e",
                                "name": "AC% - Item - MB VCN",
                                "alternate_name": "AC% - Item - MB VCN",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": null,
                                        "additional_cost_id": "6a8ffd4d-725f-479b-b65e-082cbf14aea2"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "13168519-2af6-47ef-8448-4261a9748943",
                                "name": "AC% - Item - MB V",
                                "alternate_name": "AC% - Item - MB V",
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
                                    "is_negotiable": false,
                                    "additional_cost_information": {
                                        "cost_type": "PERCENTAGE",
                                        "cost_source": "DEFAULT",
                                        "allocation_type": null,
                                        "additional_cost_id": "b366c2d6-e281-46c4-8ebd-828138d3b4be"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "038acee5-8e14-4752-83fa-4e632bad082d",
                                "name": "AC% - Item - MB NV",
                                "alternate_name": "AC% - Item - MB NV",
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
                                    "is_visible": false,
                                    "is_negotiable": false,
                                    "additional_cost_information": {
                                        "cost_type": "PERCENTAGE",
                                        "cost_source": "DEFAULT",
                                        "allocation_type": null,
                                        "additional_cost_id": "e21907ff-a6ff-4c82-b01c-1740374769f3"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "30973cfd-ade0-4cc3-ae46-df0df77116e8",
                                "name": "AC% VI",
                                "alternate_name": "AC% VI",
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
                                        "allocation_type": null,
                                        "additional_cost_id": "6b064af6-21f2-45fd-ad59-fbdc37745901"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "fefbb77c-8650-4fa9-8a27-3270266c4c8e",
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
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "dc3379da-043f-4dde-a11c-2c207a54c8be",
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
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "b0d31140-589c-4748-a0f0-a07b11c3a11e",
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
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "42dcf525-480f-4cb4-a36d-de619f7de3b2",
                                "name": "AC % Item level recurring HFC",
                                "alternate_name": "AC % Item level recurring HFC",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": null,
                                        "additional_cost_id": "200d8944-09ee-48f8-b2b5-51df8d7e887b"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "837aa1e2-2f2b-4584-8ca9-cc31bcef4d3f",
                                "name": "Test Cost Source",
                                "alternate_name": "Test Cost Source",
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
                                        "additional_cost_id": "6d49977f-6d42-48f3-877a-7312772abda8"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "d3cd36df-0d90-44e7-b98c-17f7dc7f641e",
                                "name": "SWS%",
                                "alternate_name": "SWS%",
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
                                        "additional_cost_id": "2d0d33ac-a0db-449d-8433-e6a0ba8b387a"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "0cc4befe-4181-49ac-aa54-5cb3a5d66cc1",
                                "name": "Item AC PU",
                                "alternate_name": "Item AC PU",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": "PER_UNIT",
                                        "additional_cost_id": "a8ffba07-82eb-46ff-ab61-a11e24eb4cd1"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "c1c8b6d7-748d-4048-b266-907acd13ec65",
                                "name": "BCD%",
                                "alternate_name": "BCD%",
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
                                        "additional_cost_id": "63a8b8e0-8a6f-476c-8761-7e52e36bf9cf"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "1118735f-5b60-4b91-9406-51fb01e513c5",
                                "name": "JOY",
                                "alternate_name": "JOY",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": null,
                                        "additional_cost_id": "b35d3070-c03b-4db5-9979-68d13cbd2c80"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "c73f1567-2081-40c3-bb66-e0d228f608c3",
                                "name": "source currency check",
                                "alternate_name": "source currency check",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "e1ce867e-74c6-4971-a211-211c29307164"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "4e82f02f-1b6f-4648-b0aa-1477188ad69d",
                                "name": "DONT INCLUDE TAX ITEM LEVEL",
                                "alternate_name": "DONT INCLUDE TAX ITEM LEVEL",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": null,
                                        "additional_cost_id": "a9623968-6bc0-4d10-bbc6-68956e0da56b"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "354e1b7e-a4ab-479a-aaa3-b183591cc996",
                                "name": "INCLUDE TAX ITEM LEVEL",
                                "alternate_name": "INCLUDE TAX ITEM LEVEL",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": null,
                                        "additional_cost_id": "6521baab-4fab-4490-a553-20a4456b2e65"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "a7c1d0df-2f7b-45c1-baad-54af12a2aae3",
                                "name": "DONT INCLUDE PERCENTAGE ITEM LEVEL",
                                "alternate_name": "DONT INCLUDE PERCENTAGE ITEM LEVEL",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": null,
                                        "additional_cost_id": "a2739517-9e66-4efd-8eb2-4694655620b7"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "6c0a1521-ff98-406b-93d3-c08b0aec3829",
                                "name": "INCLUDE % ITEM LEVEL",
                                "alternate_name": "INCLUDE % ITEM LEVEL",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": null,
                                        "additional_cost_id": "a174b6a9-6d89-485e-9217-514e8610d6d1"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "3ca54dbb-bd31-486b-a53f-59e0a3f2994d",
                                "name": "DONT INCLUDE FR ITEM LEVEL",
                                "alternate_name": "DONT INCLUDE FR ITEM LEVEL",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": "PER_UNIT",
                                        "additional_cost_id": "9f7fd61f-745d-427a-80cd-3d85b6557084"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "f7848f47-f91f-4f9c-9362-452e699eba2a",
                                "name": "INCLUDE FR ITEM LEVEL",
                                "alternate_name": "INCLUDE FR ITEM LEVEL",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": "PER_UNIT",
                                        "additional_cost_id": "cbfd666d-0324-4be0-a9ae-83fae1a476f3"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "a2ddb127-7ed1-49d4-ac50-5df7aafb0e37",
                                "name": "Freight Percent",
                                "alternate_name": "Freight Percent",
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
                                        "additional_cost_id": "78c531a5-c815-4110-8483-6202a324786a"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "cb32ac6b-00da-449e-98c9-02ad4aa31b47",
                                "name": "AC 1 (%) - included",
                                "alternate_name": "AC 1 (%) - included",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": null,
                                        "additional_cost_id": "fe334377-405a-4461-b894-e3cf9dd832ec"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "74965a0a-b67e-428d-993d-3e04528be14b",
                                "name": "AC 2 (Flat rate) - included",
                                "alternate_name": "AC 2 (Flat rate) - included",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "2005a90f-f816-4dfc-90f3-b71ff819a7e9"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "47cb1119-5ab5-40a1-bdae-6320eb0e0117",
                                "name": "AC 1 (%) - not included",
                                "alternate_name": "AC 1 (%) - not included",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": null,
                                        "additional_cost_id": "d3beaa2c-f984-4162-9e6a-27623610ba31"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "b933f72e-5a5c-4491-a970-575bc2545b11",
                                "name": "AC 3 (Flat rate per unit) - included",
                                "alternate_name": "AC 3 (Flat rate per unit) - included",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": "PER_UNIT",
                                        "additional_cost_id": "ca74b02b-4fce-4e96-a1a2-cd14d6af9e3a"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "4b6e2253-8693-4d42-8eaf-c2fe8d5d639b",
                                "name": "AC 2 (Flat rate) - not included",
                                "alternate_name": "AC 2 (Flat rate) - not included",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "893792f8-6a0c-4a94-813a-9bda913aeb83"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "56013740-7dc3-4e88-b2be-12459018fed9",
                                "name": "AC 3 (Flat rate per unit) - not included",
                                "alternate_name": "AC 3 (Flat rate per unit) - not included",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": "PER_UNIT",
                                        "additional_cost_id": "8a9a1e73-1a20-4f80-9e0d-2f5171e86632"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "16428c36-6aa8-47d4-a799-f9d459d9aade",
                                "name": "NRE",
                                "alternate_name": "NRE",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "598c4b94-bf90-4c48-baf6-473d11a04028"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "2ef27e98-a49a-43a4-8fb4-4366edc15a20",
                                "name": "Item AC %",
                                "alternate_name": "Item AC %",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": null,
                                        "additional_cost_id": "41d06475-c338-42b3-8507-4658fc56e686"
                                    }
                                },
                                "parent_section_item": "3daf25b1-185c-4a5e-8e35-6daca1114d93"
                            },
                            {
                                "section_item_id": "a8b4c3af-0a2c-4745-85ce-3dba333f78de",
                                "name": "Discount",
                                "alternate_name": "Discount",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "discount_information": {
                                        "cost_type": "PERCENTAGE",
                                        "cost_source": null,
                                        "allocation_type": "PER_UNIT",
                                        "additional_cost_id": null
                                    }
                                },
                                "parent_section_item": "8959b374-c02c-440b-989c-9db5c1014478"
                            },
                            {
                                "section_item_id": "a9be98eb-3c04-4559-a43c-dae55c293732",
                                "name": "Tax 3 (Flat rate per unit) - included",
                                "alternate_name": "Tax 3 (Flat rate per unit) - included",
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
                                        "additional_cost_id": "fc4e2c5c-b116-4e00-b6a0-504f0e63cb85"
                                    }
                                },
                                "parent_section_item": "a8a6067f-c5c3-4d31-bc2b-bda8e37c7951"
                            },
                            {
                                "section_item_id": "2c57ea00-de93-46ca-a996-b4d78f13aa61",
                                "name": "Tax 2 (Flat rate) - included",
                                "alternate_name": "Tax 2 (Flat rate) - included",
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
                                        "additional_cost_id": "40fb72f4-7490-474a-b054-81024e164d36"
                                    }
                                },
                                "parent_section_item": "a8a6067f-c5c3-4d31-bc2b-bda8e37c7951"
                            },
                            {
                                "section_item_id": "98acdfcb-5236-40ac-b6f8-8ae2d906762d",
                                "name": "Tax 1 (%) - included",
                                "alternate_name": "Tax 1 (%) - included",
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
                                        "additional_cost_id": "8748c6bc-50ff-4849-b82b-ce3c5f8f372f"
                                    }
                                },
                                "parent_section_item": "a8a6067f-c5c3-4d31-bc2b-bda8e37c7951"
                            },
                            {
                                "section_item_id": "862ad056-12bb-40ef-bad0-8439d7e5c00b",
                                "name": "DONT INCLUDE TAX IN TOTAL",
                                "alternate_name": "DONT INCLUDE TAX IN TOTAL",
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
                                        "additional_cost_id": "465c4b20-aabd-49fe-92eb-02439c7b613c"
                                    }
                                },
                                "parent_section_item": "a8a6067f-c5c3-4d31-bc2b-bda8e37c7951"
                            },
                            {
                                "section_item_id": "afb04a2b-5847-499a-8536-cac1d5a80c21",
                                "name": "INCLUDE TAX IN TOTAL",
                                "alternate_name": "INCLUDE TAX IN TOTAL",
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
                                        "additional_cost_id": "30d3d7c9-246b-428a-ad98-54d982b1a4ae"
                                    }
                                },
                                "parent_section_item": "a8a6067f-c5c3-4d31-bc2b-bda8e37c7951"
                            },
                            {
                                "section_item_id": "d7f2888f-170c-4d2e-be1f-fa11b17633fd",
                                "name": "TAX PQ MANDATORY",
                                "alternate_name": "TAX PQ MANDATORY",
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
                                        "additional_cost_id": "b5144400-3639-45d5-84b6-ae1846fa6003"
                                    }
                                },
                                "parent_section_item": "a8a6067f-c5c3-4d31-bc2b-bda8e37c7951"
                            },
                            {
                                "section_item_id": "75286ddf-48b2-4ff0-8cc3-194f298c8914",
                                "name": "TAX OQ NOT MANDATORY",
                                "alternate_name": "TAX OQ NOT MANDATORY",
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
                                        "additional_cost_id": "7f0472ff-e40c-4331-ba43-3c20f35c09fc"
                                    }
                                },
                                "parent_section_item": "a8a6067f-c5c3-4d31-bc2b-bda8e37c7951"
                            },
                            {
                                "section_item_id": "64beb332-3b48-4992-a42b-338b6bd85308",
                                "name": "TAX PQ NOT MANDATORY",
                                "alternate_name": "TAX PQ NOT MANDATORY",
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
                                        "additional_cost_id": "dc1414de-2a53-4189-aa6d-2ede10b99f02"
                                    }
                                },
                                "parent_section_item": "a8a6067f-c5c3-4d31-bc2b-bda8e37c7951"
                            },
                            {
                                "section_item_id": "bcbba7e7-e543-48ba-87da-0d179ef88364",
                                "name": "TAX OQ MANDATORY",
                                "alternate_name": "TAX OQ MANDATORY",
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
                                        "additional_cost_id": "8c951799-c863-4ea9-b911-382b6636cc84"
                                    }
                                },
                                "parent_section_item": "a8a6067f-c5c3-4d31-bc2b-bda8e37c7951"
                            },
                            {
                                "section_item_id": "89835a39-5148-453e-802d-c40b16d12fe7",
                                "name": "RT TAX % NOT MANDATORY",
                                "alternate_name": "RT TAX % NOT MANDATORY",
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
                                        "additional_cost_id": "1c74f46f-ebfb-44cc-9573-999c424095f4"
                                    }
                                },
                                "parent_section_item": "a8a6067f-c5c3-4d31-bc2b-bda8e37c7951"
                            },
                            {
                                "section_item_id": "d3a04991-8484-48c7-9131-28426f7975fd",
                                "name": "RT TAX % MANDATORY",
                                "alternate_name": "RT TAX % MANDATORY",
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
                                        "additional_cost_id": "5f6ed1b9-8576-4a0e-b7bb-9b48161ba412"
                                    }
                                },
                                "parent_section_item": "a8a6067f-c5c3-4d31-bc2b-bda8e37c7951"
                            },
                            {
                                "section_item_id": "8b7317a0-5eed-4b1e-a967-2d02de82ec76",
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
                                "parent_section_item": "a8a6067f-c5c3-4d31-bc2b-bda8e37c7951"
                            },
                            {
                                "section_item_id": "c8718d3c-b87f-4b73-a22d-5a34774bd6aa",
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
                                "parent_section_item": "a8a6067f-c5c3-4d31-bc2b-bda8e37c7951"
                            },
                            {
                                "section_item_id": "c5e32a4d-1b4e-4fa6-82f6-bb3f8ab402d0",
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
                                "parent_section_item": "a8a6067f-c5c3-4d31-bc2b-bda8e37c7951"
                            },
                            {
                                "section_item_id": "7130961a-3de7-4891-b1bb-5eef84052bc4",
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
                                "parent_section_item": "a8a6067f-c5c3-4d31-bc2b-bda8e37c7951"
                            },
                            {
                                "section_item_id": "d1860310-368d-4bb7-9674-a6b1572ad217",
                                "name": "Tax OQ - USD",
                                "alternate_name": "Tax OQ - USD",
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
                                        "additional_cost_id": "ce0db267-4801-45ae-a0c0-00fd0c562fff"
                                    }
                                },
                                "parent_section_item": "a8a6067f-c5c3-4d31-bc2b-bda8e37c7951"
                            },
                            {
                                "section_item_id": "8bfe4269-1615-4bd5-94d7-242abe092db6",
                                "name": "Tax 3 (Flat rate per unit) - not included",
                                "alternate_name": "Tax 3 (Flat rate per unit) - not included",
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
                                        "additional_cost_id": "62bc4976-5d54-4b84-bff7-348231821643"
                                    }
                                },
                                "parent_section_item": "a8a6067f-c5c3-4d31-bc2b-bda8e37c7951"
                            },
                            {
                                "section_item_id": "7f661b1b-6475-4df4-8775-9991c052c311",
                                "name": "Tax 2 (Flat rate) - not included",
                                "alternate_name": "Tax 2 (Flat rate) - not included",
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
                                        "additional_cost_id": "f164429e-0169-4dff-8c09-aff9db8005f7"
                                    }
                                },
                                "parent_section_item": "a8a6067f-c5c3-4d31-bc2b-bda8e37c7951"
                            },
                            {
                                "section_item_id": "a45ef1a8-754d-414f-8c42-15f19f8aae74",
                                "name": "Tax 1 (%) - not included",
                                "alternate_name": "Tax 1 (%) - not included",
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
                                        "additional_cost_id": "14241e96-2564-4cd5-b1df-ebceb642a849"
                                    }
                                },
                                "parent_section_item": "a8a6067f-c5c3-4d31-bc2b-bda8e37c7951"
                            },
                            {
                                "section_item_id": "bd85f987-9f29-43ec-8d66-5582b04eb855",
                                "name": "Tax %",
                                "alternate_name": "Tax %",
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
                                        "additional_cost_id": "de06095e-4e0e-4ef4-8644-19b8570b2d7c"
                                    }
                                },
                                "parent_section_item": "a8a6067f-c5c3-4d31-bc2b-bda8e37c7951"
                            },
                            {
                                "section_item_id": "80e1476f-3f87-4703-826e-bf994a6fb25d",
                                "name": "Tax OQ",
                                "alternate_name": "Tax OQ",
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
                                        "additional_cost_id": "01978ea9-4b42-4064-80b2-ecbc9397fc97"
                                    }
                                },
                                "parent_section_item": "a8a6067f-c5c3-4d31-bc2b-bda8e37c7951"
                            },
                            {
                                "section_item_id": "d8908f6a-9612-4403-ab74-4bf0fb4ad42b",
                                "name": "Tax PU",
                                "alternate_name": "Tax PU",
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
                                        "additional_cost_id": "5d4a2c55-b003-4b97-bb62-e206d1f70e2d"
                                    }
                                },
                                "parent_section_item": "a8a6067f-c5c3-4d31-bc2b-bda8e37c7951"
                            },
                            {
                                "section_item_id": "a0a12cd1-e759-4f3d-a07a-a5d343fff192",
                                "name": "Formula F - Tax %",
                                "alternate_name": "Formula F - Tax %",
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
                                        "additional_cost_id": "7d866f4b-d723-4df3-8ef1-658adef1ed08"
                                    }
                                },
                                "parent_section_item": "a8a6067f-c5c3-4d31-bc2b-bda8e37c7951"
                            },
                            {
                                "section_item_id": "b78fbddf-3725-4981-a6ab-d533358f1627",
                                "name": "Formula E - Tax OQ",
                                "alternate_name": "Formula E - Tax OQ",
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
                                        "additional_cost_id": "3f1c6c07-6709-4a18-ae96-d5e4b0c04f51"
                                    }
                                },
                                "parent_section_item": "a8a6067f-c5c3-4d31-bc2b-bda8e37c7951"
                            },
                            {
                                "section_item_id": "bd3ef30c-8baa-426c-bfdb-c17cc707e7bd",
                                "name": "Formula C - Tax %",
                                "alternate_name": "Formula C - Tax %",
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
                                        "additional_cost_id": "fee598d7-c7af-422b-a783-c150bbab4203"
                                    }
                                },
                                "parent_section_item": "a8a6067f-c5c3-4d31-bc2b-bda8e37c7951"
                            },
                            {
                                "section_item_id": "a36c934c-4c31-4151-abc2-3a99b12e4f45",
                                "name": "Formula B - Tax OQ",
                                "alternate_name": "Formula B - Tax OQ",
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
                                        "additional_cost_id": "e3dc01e9-16ab-4f9c-96ce-1529dd850073"
                                    }
                                },
                                "parent_section_item": "a8a6067f-c5c3-4d31-bc2b-bda8e37c7951"
                            },
                            {
                                "section_item_id": "40858f2c-e0f9-4620-9051-595851017cca",
                                "name": "Formula A - Tax PU",
                                "alternate_name": "Formula A - Tax PU",
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
                                        "additional_cost_id": "aca8adf1-4d89-4b1a-8b7c-0d3347228cc3"
                                    }
                                },
                                "parent_section_item": "a8a6067f-c5c3-4d31-bc2b-bda8e37c7951"
                            },
                            {
                                "section_item_id": "43091604-8718-406d-8d7d-6cb8fcf647dc",
                                "name": "Formula A - Tax %",
                                "alternate_name": "Formula A - Tax %",
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
                                        "additional_cost_id": "369d422a-f961-4334-9e31-e49fd32d887f"
                                    }
                                },
                                "parent_section_item": "a8a6067f-c5c3-4d31-bc2b-bda8e37c7951"
                            }
                        ]
                    },
                    {
                        "section_id": "4cc8ac20-f6fe-4cd4-b066-8e99eb871be1",
                        "name": "Vendor Information",
                        "alternate_name": "Vendor Information",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "7d9b7ad9-205b-42b0-a2bb-34e1fc999ef5",
                                "name": "Vendor",
                                "alternate_name": "Vendor",
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
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "b7cdfcc7-d781-4697-a807-fba4c97467ef",
                        "name": "Payment and Delivery Terms",
                        "alternate_name": "Payment and Delivery Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "48f2e373-1fec-46d6-be3f-33972442e6fc",
                                "name": "Payment terms",
                                "alternate_name": "Payment terms",
                                "constraints": {
                                    "field_type": "PERIOD",
                                    "choices": null,
                                    "type": "PeriodField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "payment_type": "Pay as per Invoice terms",
                                    "is_negotiable": false,
                                    "allow_prepayment": true,
                                    "payment_from_options": [
                                        "Dispatch date",
                                        "Invoice date",
                                        "Receipt date"
                                    ]
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "eee90731-7662-42eb-84f2-7ed36b3f0dc9",
                                "name": "Incoterms",
                                "alternate_name": "Incoterms",
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
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "75fc7409-3a7d-4fcf-becc-f0144c747c1a",
                                "name": "Lead time",
                                "alternate_name": "Lead time",
                                "constraints": {
                                    "field_type": "PERIOD",
                                    "choices": null,
                                    "type": "PeriodField"
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
                                "section_item_id": "8c380523-bfdf-4198-b0f5-88fd38a8eadb",
                                "name": "GR tolerance",
                                "alternate_name": "GR tolerance",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 10.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "89e9fa3a-359f-40c8-9f34-aa712d75df2e",
                        "name": "Additional Details",
                        "alternate_name": "Additional Details",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "6e0aee56-d81c-44ae-9ace-316ed918409a",
                                "name": "Quoted MPN",
                                "alternate_name": "Quoted MPN",
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
                                "section_item_id": "70cd25b9-bc72-4e95-afda-86c1549d8f1d",
                                "name": "% of Item Total",
                                "alternate_name": "% of Item Total",
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
                                "section_item_id": "7d4b69d2-2ad4-4931-b42a-ef0f366a16cd",
                                "name": "Additional information",
                                "alternate_name": "Additional information",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 0,
                                    "max_limit": 1000,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "3a930f7a-d078-469b-b51d-dd56970e125d",
                                "name": "Date 3",
                                "alternate_name": "Date 3",
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
                                "section_item_id": "618b7642-058e-41fd-bf1b-61857f43fcf0",
                                "name": "Multi-select 3",
                                "alternate_name": "Multi-select 3",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "option 1",
                                        "option 2",
                                        "option 3",
                                        "option 4"
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
                                "section_item_id": "63eab098-4483-44bf-992f-b476c6a5e07d",
                                "name": "checoe",
                                "alternate_name": "checoe",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "asdasj     qw",
                                        "dwa               dwi"
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
                            }
                        ]
                    }
                ]
            },
            {
                "template_id": "80c78093-f376-493a-b552-33555c04650e",
                "type": "PO_GROUP",
                "name": "Project Item Level",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2025-12-09T10:07:48.557961Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-12-09T10:07:48.545058Z",
                "entity_id": "47924a71-c523-4c7a-934d-f1f6ac543bbc",
                "entity_name": "FactWise Demo",
                "auto_reminders": {
                    "max_reminders": 4,
                    "reminder_interval": 24,
                    "is_remainder_required": true,
                    "initial_reminder_hours": 12
                },
                "linked_templates": {},
                "last_edited_by_name": "Admin",
                "assigned_users": [],
                "section_list": [
                    {
                        "section_id": "fef9bdb4-d54c-4121-9963-64fa6413b90e",
                        "name": "PO Group Details",
                        "alternate_name": "PO Group Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "d7d8cf98-1bb4-437d-b923-9fd3687f1d62",
                                "name": "PO Group Name",
                                "alternate_name": "PO Group Name",
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
                                "section_item_id": "c37e29a1-1530-4892-a93e-e0b3cd13ab4f",
                                "name": "Buyer entity",
                                "alternate_name": "Buyer entity",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "6f246731-dd61-4087-96f9-d85f85e7e856",
                                "name": "Template",
                                "alternate_name": "Template",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "4f9cae0e-919c-4daa-b85b-04cbd0d04a6c",
                                "name": "Overall currency",
                                "alternate_name": "Overall currency",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "c68a13b8-868c-41de-ae49-bce8dd2f37f3",
                                "name": "Default item terms",
                                "alternate_name": "Default item terms",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "82aa7d11-4117-4c46-a6b8-72d7a0904ded",
                                "name": "Overall taxes",
                                "alternate_name": "Overall taxes",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "a1cc83a9-c140-4eef-9003-7d5943b4da3c",
                                "name": "Overall additional costs",
                                "alternate_name": "Overall additional costs",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "bfc5d88d-7734-4381-93a5-c424671a5afa",
                                "name": "Overall discount information",
                                "alternate_name": "Overall discount information",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "11505ea1-abc2-428f-a3be-3ab2ec696382",
                                "name": "Overall discount",
                                "alternate_name": "Overall discount",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false,
                                    "discount_information": {
                                        "cost_type": "PERCENTAGE",
                                        "allocation_type": null
                                    }
                                },
                                "parent_section_item": "bfc5d88d-7734-4381-93a5-c424671a5afa"
                            }
                        ]
                    },
                    {
                        "section_id": "10374917-64a1-48d9-96f9-763eb93f48fd",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "b60ce966-85dd-48c3-9e5d-0b0dd90d1099",
                                "name": "Target rate",
                                "alternate_name": "Target rate",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "4213416c-2c7b-4184-8146-59f2f21e5f3f",
                                "name": "Item",
                                "alternate_name": "Item",
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
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "1ac2536e-269c-44de-9565-b516211337ec",
                                "name": "Custom specification",
                                "alternate_name": "Custom specification",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "9c7a3787-c3b6-4860-ab14-649eba990b38",
                                "name": "Quantity Information",
                                "alternate_name": "Quantity Information",
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
                                "section_item_id": "c084e960-387f-4b55-93a5-2b89c40a1a3d",
                                "name": "Delivery date",
                                "alternate_name": "Delivery date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "9c7a3787-c3b6-4860-ab14-649eba990b38"
                            },
                            {
                                "section_item_id": "85c77e14-f0fd-4341-9b95-7197bbc5c64e",
                                "name": "Quantity",
                                "alternate_name": "Quantity",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "9c7a3787-c3b6-4860-ab14-649eba990b38"
                            },
                            {
                                "section_item_id": "7cd89035-06f9-4b31-93d8-e6252e369a2c",
                                "name": "Cost center",
                                "alternate_name": "Cost center",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "9c7a3787-c3b6-4860-ab14-649eba990b38"
                            },
                            {
                                "section_item_id": "9acc3911-ebab-48e1-a760-b19eb6bfea41",
                                "name": "GL",
                                "alternate_name": "GL",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "9c7a3787-c3b6-4860-ab14-649eba990b38"
                            },
                            {
                                "section_item_id": "30379833-7503-4416-94ef-b66c987c44d3",
                                "name": "Taxes",
                                "alternate_name": "Taxes",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "d95fbdc0-477c-4a00-9add-60172e428586",
                                "name": "Additional costs",
                                "alternate_name": "Additional costs",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "30a573ae-b863-407a-8909-3be98dbd2dc5",
                                "name": "Discount information",
                                "alternate_name": "Discount information",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "a405f9fb-007f-4bc1-a868-b0292b747a4b",
                                "name": "Discount",
                                "alternate_name": "Discount",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false,
                                    "discount_information": {
                                        "cost_type": "PERCENTAGE",
                                        "allocation_type": null
                                    }
                                },
                                "parent_section_item": "30a573ae-b863-407a-8909-3be98dbd2dc5"
                            },
                            {
                                "section_item_id": "c69fb919-60f3-48e4-840c-820f0e37c145",
                                "name": "Project",
                                "alternate_name": "Project",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "9c7a3787-c3b6-4860-ab14-649eba990b38"
                            }
                        ]
                    },
                    {
                        "section_id": "c3ce9815-8fd5-4608-85cc-88eff846a7f6",
                        "name": "Vendor Information",
                        "alternate_name": "Vendor Information",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "12b19861-9b91-4a28-943a-4c76c3cdb2f6",
                                "name": "Vendor",
                                "alternate_name": "Vendor",
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
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "3b46a9f6-fa7e-46ff-ad56-46d90d620799",
                        "name": "Payment and Delivery Terms",
                        "alternate_name": "Payment and Delivery Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "8b24e84e-f352-482c-8c07-d69751d7f1f7",
                                "name": "Payment terms",
                                "alternate_name": "Payment terms",
                                "constraints": {
                                    "field_type": "PERIOD",
                                    "choices": null,
                                    "type": "PeriodField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "payment_type": "Pay as per Invoice terms",
                                    "is_negotiable": false,
                                    "allow_prepayment": true,
                                    "payment_from_options": [
                                        "Dispatch date",
                                        "Invoice date",
                                        "Receipt date"
                                    ]
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "3fe9ea63-4d8e-4208-90bb-e95f6f3d5576",
                                "name": "Incoterms",
                                "alternate_name": "Incoterms",
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
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "8b05aed2-657a-4b80-a396-336ff35a33f4",
                                "name": "Lead time",
                                "alternate_name": "Lead time",
                                "constraints": {
                                    "field_type": "PERIOD",
                                    "choices": null,
                                    "type": "PeriodField"
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
                                "section_item_id": "6f141c92-10d8-455c-a31d-49abed4eddcd",
                                "name": "GR tolerance",
                                "alternate_name": "GR tolerance",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 10.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "26ed281f-c5ed-4337-804d-1eea3509a933",
                        "name": "Additional Details",
                        "alternate_name": "Additional Details",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "471b0ed1-2b69-4b9d-a5c1-af4fc9701c1a",
                                "name": "Additional information",
                                "alternate_name": "Additional information",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 0,
                                    "max_limit": 1000,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    }
                ]
            },
            {
                "template_id": "4fd0d60e-a242-4369-9f14-b56b5f9dd457",
                "type": "PO_GROUP",
                "name": "Project Overall",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2025-12-09T10:06:53.034496Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-12-09T10:07:25.791964Z",
                "entity_id": "47924a71-c523-4c7a-934d-f1f6ac543bbc",
                "entity_name": "FactWise Demo",
                "auto_reminders": {
                    "max_reminders": 4,
                    "reminder_interval": 24,
                    "is_remainder_required": true,
                    "initial_reminder_hours": 12
                },
                "linked_templates": {},
                "last_edited_by_name": "Admin",
                "assigned_users": [],
                "section_list": [
                    {
                        "section_id": "fef52811-37f8-41d6-a8ee-e8f3bf70ba82",
                        "name": "PO Group Details",
                        "alternate_name": "PO Group Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "dfecc27c-b997-46ba-b18c-1825d8f7275d",
                                "name": "PO Group Name",
                                "alternate_name": "PO Group Name",
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
                                "section_item_id": "2a3dc367-e48c-4bb7-ae40-f31ea13832f0",
                                "name": "Buyer entity",
                                "alternate_name": "Buyer entity",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "911f3d4c-554f-422b-a44c-1dd5125d62f5",
                                "name": "Template",
                                "alternate_name": "Template",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "f5eedae0-7197-4b1b-ac70-097909c86fc9",
                                "name": "Overall currency",
                                "alternate_name": "Overall currency",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "45da9a4a-3184-4690-b908-f58c6f9535ae",
                                "name": "Default item terms",
                                "alternate_name": "Default item terms",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "7b456b35-a41c-4734-9c6a-bbd653eb659f",
                                "name": "Overall taxes",
                                "alternate_name": "Overall taxes",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "8dd71e02-a87b-404d-be27-8bd90f1eae06",
                                "name": "Overall additional costs",
                                "alternate_name": "Overall additional costs",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "efc3c88c-5c4d-4d6d-9451-9260b1876bfc",
                                "name": "Overall discount information",
                                "alternate_name": "Overall discount information",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "f599b913-7f22-4872-b24c-9abf767f0057",
                                "name": "Overall discount",
                                "alternate_name": "Overall discount",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false,
                                    "discount_information": {
                                        "cost_type": "PERCENTAGE",
                                        "allocation_type": null
                                    }
                                },
                                "parent_section_item": "efc3c88c-5c4d-4d6d-9451-9260b1876bfc"
                            }
                        ]
                    },
                    {
                        "section_id": "44379688-e5bc-4320-bd3a-5ddf7bcd014c",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "2315e065-c6ff-4338-be7d-d349d72e0294",
                                "name": "Item",
                                "alternate_name": "Item",
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
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "d3d7ef2f-86d1-49c5-9e57-4ec31926a5d0",
                                "name": "Custom specification",
                                "alternate_name": "Custom specification",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "3e0caee3-0882-44b0-a76b-6b3ddbf81aef",
                                "name": "Quantity Information",
                                "alternate_name": "Quantity Information",
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
                                "section_item_id": "125e5ae7-7b5a-456a-baf8-f422db65074e",
                                "name": "Delivery date",
                                "alternate_name": "Delivery date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "3e0caee3-0882-44b0-a76b-6b3ddbf81aef"
                            },
                            {
                                "section_item_id": "e99d9470-128e-4ca6-97fc-c18485db286d",
                                "name": "Quantity",
                                "alternate_name": "Quantity",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "3e0caee3-0882-44b0-a76b-6b3ddbf81aef"
                            },
                            {
                                "section_item_id": "404590a2-a15e-4257-81d9-72a8e7e28c9b",
                                "name": "Cost center",
                                "alternate_name": "Cost center",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "3e0caee3-0882-44b0-a76b-6b3ddbf81aef"
                            },
                            {
                                "section_item_id": "90732ec9-1777-40ab-bde5-2f3498d3cfa7",
                                "name": "GL",
                                "alternate_name": "GL",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "3e0caee3-0882-44b0-a76b-6b3ddbf81aef"
                            },
                            {
                                "section_item_id": "3f161178-df0e-4a9f-9817-73330b7f3891",
                                "name": "Target rate",
                                "alternate_name": "Target rate",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "ff1c814f-1d38-4015-af7c-5cee9c64cadd",
                                "name": "Taxes",
                                "alternate_name": "Taxes",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "125bd1a8-3d2a-4c18-bd0c-9aa7adcde0bc",
                                "name": "Additional costs",
                                "alternate_name": "Additional costs",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "582feff1-a1e1-46b7-b98a-77717e9477bc",
                                "name": "Discount information",
                                "alternate_name": "Discount information",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "bac711a3-9b69-4f7c-be73-0050a0a29966",
                                "name": "Discount",
                                "alternate_name": "Discount",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false,
                                    "discount_information": {
                                        "cost_type": "PERCENTAGE",
                                        "allocation_type": null
                                    }
                                },
                                "parent_section_item": "582feff1-a1e1-46b7-b98a-77717e9477bc"
                            },
                            {
                                "section_item_id": "95535e4d-f87e-42fb-830e-14fd7fffe7db",
                                "name": "Project",
                                "alternate_name": "Project",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "3e0caee3-0882-44b0-a76b-6b3ddbf81aef"
                            }
                        ]
                    },
                    {
                        "section_id": "e89999fe-14de-4b09-b89b-0bace52c3288",
                        "name": "Vendor Information",
                        "alternate_name": "Vendor Information",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "2494faeb-71a1-4f50-a976-257f5a569d00",
                                "name": "Vendor",
                                "alternate_name": "Vendor",
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
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "e0d55c41-a8ab-4142-b5e4-48da8b5a34ff",
                        "name": "Payment and Delivery Terms",
                        "alternate_name": "Payment and Delivery Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "7dc1d6b2-9ade-45e3-bb23-3c88613e1903",
                                "name": "Payment terms",
                                "alternate_name": "Payment terms",
                                "constraints": {
                                    "field_type": "PERIOD",
                                    "choices": null,
                                    "type": "PeriodField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "payment_type": "Pay as per Invoice terms",
                                    "is_negotiable": false,
                                    "allow_prepayment": true,
                                    "payment_from_options": [
                                        "Dispatch date",
                                        "Invoice date",
                                        "Receipt date"
                                    ]
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "dd5c692d-b555-4a82-845f-54d939dd75e7",
                                "name": "Incoterms",
                                "alternate_name": "Incoterms",
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
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "0bdcd784-478b-4411-b452-ca234f6ef902",
                                "name": "Lead time",
                                "alternate_name": "Lead time",
                                "constraints": {
                                    "field_type": "PERIOD",
                                    "choices": null,
                                    "type": "PeriodField"
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
                                "section_item_id": "a509426b-3b5f-4815-805d-757d9145fe6e",
                                "name": "GR tolerance",
                                "alternate_name": "GR tolerance",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 10.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "f4a3133c-bed3-4c1f-932d-e4f800be120d",
                        "name": "Additional Details",
                        "alternate_name": "Additional Details",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "85f36533-3f44-4e71-882a-e5bfd548099e",
                                "name": "Additional information",
                                "alternate_name": "Additional information",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 0,
                                    "max_limit": 1000,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    }
                ]
            },
            {
                "template_id": "85b7d489-418d-45b2-ae8e-f191ceb36e5c",
                "type": "PO_GROUP",
                "name": "NA test 1 MB-NA",
                "tags": [
                    "#PO GROUP",
                    "#EVENT"
                ],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2025-10-28T13:27:05.200463Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-10-28T13:27:05.188330Z",
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
                        "section_id": "f9d771e0-70f7-4927-a5b2-407c4ca664e7",
                        "name": "PO Group Details",
                        "alternate_name": "PO Group Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "ea98fbd9-f3ec-4bcc-b571-777312a2adee",
                                "name": "PO Group Name",
                                "alternate_name": "PO Group Name",
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
                                "section_item_id": "a4d13875-fa9b-4688-9067-d4351a4b28ba",
                                "name": "Buyer entity",
                                "alternate_name": "Buyer entity",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "NA(None)"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "59190abf-8f35-4ccd-a6fe-57877fcd1e90",
                                "name": "Template",
                                "alternate_name": "Template",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "04cb3579-ee75-4151-a456-44e121b5bd64",
                                "name": "Overall currency",
                                "alternate_name": "Overall currency",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "642c13fc-7d5f-433d-830f-670c7e8abc9a",
                                "name": "Checkbox  2",
                                "alternate_name": "Checkbox  2",
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
                                "section_item_id": "aca70b11-00ce-48c1-840d-cd85420fa3e9",
                                "name": "checkbox 2",
                                "alternate_name": "checkbox 2",
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
                                "section_item_id": "5528e817-e7e1-42f7-9bc7-f6d6f0e412f8",
                                "name": "Overall taxes",
                                "alternate_name": "Overall taxes",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "0b86e392-068c-4492-86b4-fce73569d5e6",
                                "name": "Overall additional costs",
                                "alternate_name": "Overall additional costs",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "21587ab1-82cc-44cc-af3f-7eaddf1b4868",
                                "name": "Overall discount information",
                                "alternate_name": "Overall discount information",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "4cd65933-7d02-43be-888a-0360ea23e2c7",
                                "name": "Overall discount",
                                "alternate_name": "Overall discount",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false,
                                    "discount_information": {
                                        "cost_type": "PERCENTAGE",
                                        "allocation_type": null
                                    }
                                },
                                "parent_section_item": "21587ab1-82cc-44cc-af3f-7eaddf1b4868"
                            },
                            {
                                "section_item_id": "56f0f69b-d835-48de-a282-e4b7b0fae850",
                                "name": "Select 1",
                                "alternate_name": "Select 1",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Option 1",
                                        "Option 2",
                                        "Option 3",
                                        "Option 4",
                                        "Option 5",
                                        "NA(None)"
                                    ],
                                    "choice_type": "DROPDOWN",
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
                                "section_item_id": "3a3720a1-674d-4f81-ac82-7d385c7d79ea",
                                "name": "Default item terms",
                                "alternate_name": "Default item terms",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "1294d000-0117-4bef-a2ce-c88c296036ad",
                                "name": "Select 2",
                                "alternate_name": "Select 2",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Option 1",
                                        "Option 2",
                                        "Option 3",
                                        "Option 4",
                                        "Option 5"
                                    ],
                                    "choice_type": "DROPDOWN",
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
                                "section_item_id": "c59e0def-4af1-4bf4-b175-e75e99c8b7b2",
                                "name": "Select 3",
                                "alternate_name": "Select 3",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Option 1",
                                        "Option 2",
                                        "Option 3",
                                        "Option 4",
                                        "Option 5"
                                    ],
                                    "choice_type": "DROPDOWN",
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
                            }
                        ]
                    },
                    {
                        "section_id": "e843d6b5-3d08-4c37-97e6-f55799577cc8",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "1f090a23-c24b-49c4-860e-b1e55f23c5f5",
                                "name": "Taxes",
                                "alternate_name": "Taxes",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "15799718-a0d0-4e5c-9d06-08a8a54f6a9a",
                                "name": "CB 02",
                                "alternate_name": "CB 02",
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
                                "section_item_id": "c4f4f25c-c907-4beb-b901-0d4d3f007cb0",
                                "name": "Select 01",
                                "alternate_name": "Select 01",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Option 1",
                                        "Option 2",
                                        "Option 3",
                                        "Option 4",
                                        "Option 5"
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
                                "section_item_id": "af70a82d-d0a1-411c-b55d-6983e9165a2e",
                                "name": "Select 02",
                                "alternate_name": "Select 02",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Option 1",
                                        "Option 2",
                                        "Option 3",
                                        "Option 4"
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
                                "section_item_id": "9000366e-dab5-4117-8180-596579f1e1e8",
                                "name": "Select 03",
                                "alternate_name": "Select 03",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Option 1",
                                        "Option 2",
                                        "Option 3",
                                        "Option 4",
                                        "Option 4a"
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
                                "section_item_id": "bfbff6c2-b85c-4914-a6cd-0ead9109b4ea",
                                "name": "Item",
                                "alternate_name": "Item",
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
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "a25c2043-deeb-4702-9454-61a0ebd9d90b",
                                "name": "Custom specification",
                                "alternate_name": "Custom specification",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "ad295786-2948-41dd-81ce-cd40d94d58b8",
                                "name": "Target rate",
                                "alternate_name": "Target rate",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "c97a0e76-7064-41b2-af15-41181a5308e0",
                                "name": "Additional costs",
                                "alternate_name": "Additional costs",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "802ca46f-55c4-4eed-9a77-a4f72417bcdc",
                                "name": "Discount information",
                                "alternate_name": "Discount information",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "cd2c4541-5330-46df-8783-c7bd7fb94d96",
                                "name": "Discount",
                                "alternate_name": "Discount",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false,
                                    "discount_information": {
                                        "cost_type": "PERCENTAGE",
                                        "allocation_type": null
                                    }
                                },
                                "parent_section_item": "802ca46f-55c4-4eed-9a77-a4f72417bcdc"
                            },
                            {
                                "section_item_id": "d63020e9-72dc-4d4c-b5e9-efb38042a60c",
                                "name": "Delivery date",
                                "alternate_name": "Delivery date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "90961c1f-6c11-4b0a-ac7f-5096fe4cdc9b"
                            },
                            {
                                "section_item_id": "066b8a5e-83b7-447c-ac63-31728d18ae05",
                                "name": "Quantity",
                                "alternate_name": "Quantity",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "90961c1f-6c11-4b0a-ac7f-5096fe4cdc9b"
                            },
                            {
                                "section_item_id": "90961c1f-6c11-4b0a-ac7f-5096fe4cdc9b",
                                "name": "Quantity Information",
                                "alternate_name": "Quantity Information",
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
                                "section_item_id": "689422db-9833-4126-a379-a73bee4b0fdf",
                                "name": "Cost center",
                                "alternate_name": "Cost center",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "90961c1f-6c11-4b0a-ac7f-5096fe4cdc9b"
                            },
                            {
                                "section_item_id": "caef23ac-e7a8-48fc-b45b-488f661509c6",
                                "name": "GL",
                                "alternate_name": "GL",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "90961c1f-6c11-4b0a-ac7f-5096fe4cdc9b"
                            },
                            {
                                "section_item_id": "c9cdc0e5-4c82-42f0-9ede-174117b77d79",
                                "name": "Project",
                                "alternate_name": "Project",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "90961c1f-6c11-4b0a-ac7f-5096fe4cdc9b"
                            },
                            {
                                "section_item_id": "f44e578c-243c-43ae-95e2-6c3444511b83",
                                "name": "CB 01",
                                "alternate_name": "CB 01",
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
                            }
                        ]
                    },
                    {
                        "section_id": "1f4df5da-8195-4f01-aecb-d0449c98a145",
                        "name": "Vendor Information",
                        "alternate_name": "Vendor Information",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "f9b4b2fd-fb7b-4ebc-9a02-6eaae77c77a8",
                                "name": "Vendor",
                                "alternate_name": "Vendor",
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
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "9b8bd7a9-0087-419d-a634-90dcb2334e3b",
                        "name": "Payment and Delivery Terms",
                        "alternate_name": "Payment and Delivery Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "a2c54b0d-62ac-4bc7-82f5-8af1c87d74f8",
                                "name": "Payment terms",
                                "alternate_name": "Payment terms",
                                "constraints": {
                                    "field_type": "PERIOD",
                                    "choices": null,
                                    "type": "PeriodField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "payment_type": "Pay as per Invoice terms",
                                    "is_negotiable": false,
                                    "allow_prepayment": true,
                                    "payment_from_options": [
                                        "Dispatch date",
                                        "Invoice date",
                                        "Receipt date"
                                    ]
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "203c4f11-dd33-44f8-8a22-84f323d4e819",
                                "name": "Incoterms",
                                "alternate_name": "Incoterms",
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
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "169f90de-674e-4455-b53c-61c8ca6fab68",
                                "name": "Lead time",
                                "alternate_name": "Lead time",
                                "constraints": {
                                    "field_type": "PERIOD",
                                    "choices": null,
                                    "type": "PeriodField"
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
                                "section_item_id": "de049fb6-86fc-4bbe-bda6-7b4b26e7f538",
                                "name": "GR tolerance",
                                "alternate_name": "GR tolerance",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 10.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
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
                                "section_item_id": "937cfdeb-6dd4-4c80-bf9f-73c99d5b397d",
                                "name": "Select 5",
                                "alternate_name": "Select 5",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Option 1",
                                        "Option 2",
                                        "Option 3",
                                        "NA(None)"
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
                                "section_item_id": "23e03beb-282d-4122-9f19-9f3a93464669",
                                "name": "Select 6",
                                "alternate_name": "Select 6",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Option 1",
                                        "Option 2",
                                        "Option 3"
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
                                "section_item_id": "123d0822-b660-4094-8d6f-b3e04e143fe2",
                                "name": "Select 7",
                                "alternate_name": "Select 7",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Option 1",
                                        "Option 2",
                                        "Option 3"
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
                                "section_item_id": "6466333c-1e17-4355-b505-836a8426ab2e",
                                "name": "checkbox 3",
                                "alternate_name": "checkbox 3",
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
                                "section_item_id": "8121cd55-ea8f-410e-8107-a52f24412ab5",
                                "name": "checkbox 5",
                                "alternate_name": "checkbox 5",
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
                            }
                        ]
                    },
                    {
                        "section_id": "51893375-441c-458a-8d59-49e448814a84",
                        "name": "Additional Details",
                        "alternate_name": "Additional Details",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "f778cc91-9110-4565-b6f4-ba86b4484f7a",
                                "name": "Additional information",
                                "alternate_name": "Additional information",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 0,
                                    "max_limit": 1000,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "803827b4-8c4d-495e-af90-10a80c3da628",
                                "name": "Select 8",
                                "alternate_name": "Select 8",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Option 1",
                                        "Option 2",
                                        "Option 3"
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
                                "section_item_id": "8fa25541-e703-4a80-9736-c454d3bf4c83",
                                "name": "Select 9",
                                "alternate_name": "Select 9",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Option 1",
                                        "Option 2",
                                        "Option 3",
                                        "NA(None)"
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
                                "section_item_id": "75660cc9-b764-4aae-b0a0-20684332b863",
                                "name": "Select 10",
                                "alternate_name": "Select 10",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Option 1",
                                        "Option 2",
                                        "Option 3"
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
                                "section_item_id": "ba96f888-09e9-40b7-a8dc-54a819e667b5",
                                "name": "checkbox 4",
                                "alternate_name": "checkbox 4",
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
                                "section_item_id": "6738af4f-522b-4bbc-991a-d42588cdfba2",
                                "name": "checkbox 6",
                                "alternate_name": "checkbox 6",
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
                            }
                        ]
                    }
                ]
            },
            {
                "template_id": "34e6b9f9-8857-4bed-9c6b-0c11ec14c731",
                "type": "PO_GROUP",
                "name": "DO NOT TOUCH",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2025-10-06T06:26:02.133234Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-10-06T06:26:02.122736Z",
                "entity_id": "47924a71-c523-4c7a-934d-f1f6ac543bbc",
                "entity_name": "FactWise Demo",
                "auto_reminders": {
                    "max_reminders": 4,
                    "reminder_interval": 24,
                    "is_remainder_required": true,
                    "initial_reminder_hours": 12
                },
                "linked_templates": {},
                "last_edited_by_name": "Admin",
                "assigned_users": [],
                "section_list": [
                    {
                        "section_id": "7815c67f-bcb8-499e-88ea-e7e3f82421c9",
                        "name": "PO Group Details",
                        "alternate_name": "PO Group Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "078c8bf5-73cb-4bcf-beb4-c1f4ba119336",
                                "name": "PO Group Name",
                                "alternate_name": "PO Group Name",
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
                                "section_item_id": "985fe5b3-cd6d-475b-bccd-1eb2915f1396",
                                "name": "Buyer entity",
                                "alternate_name": "Buyer entity",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "76a5efe4-085a-40cd-99eb-62bfb424aee8",
                                "name": "Template",
                                "alternate_name": "Template",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "fc081b30-1b62-45cc-847b-7b952d4135f6",
                                "name": "Overall currency",
                                "alternate_name": "Overall currency",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "0f23c14f-c4a7-4883-8edf-59408e0ff21d",
                                "name": "Default item terms",
                                "alternate_name": "Default item terms",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "1afe8ff7-a5bd-4b8e-a531-003b2e360eab",
                                "name": "Overall taxes",
                                "alternate_name": "Overall taxes",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "348dec8c-193e-4e1a-9164-bb54463e5fee",
                                "name": "Overall additional costs",
                                "alternate_name": "Overall additional costs",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "5cd365ab-8b3c-4fa1-a71d-eea32500628b",
                                "name": "Overall discount information",
                                "alternate_name": "Overall discount information",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "2f53186f-8bcb-432f-9755-4ed3039b6ce0",
                                "name": "Overall discount",
                                "alternate_name": "Overall discount",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false,
                                    "discount_information": {
                                        "cost_type": "PERCENTAGE",
                                        "allocation_type": null
                                    }
                                },
                                "parent_section_item": "5cd365ab-8b3c-4fa1-a71d-eea32500628b"
                            }
                        ]
                    },
                    {
                        "section_id": "52b009e0-d025-4e08-a797-3ff71592df3e",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "0ad9d8e2-ba2c-4fcb-a970-b87a64766155",
                                "name": "Item",
                                "alternate_name": "Item",
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
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "bfcbc14a-09ba-4898-a728-8c0b135d5f10",
                                "name": "Custom specification",
                                "alternate_name": "Custom specification",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "c05f1eaf-e8c9-48b8-a13a-c01296326ee6",
                                "name": "Quantity Information",
                                "alternate_name": "Quantity Information",
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
                                "section_item_id": "c2c6cb9e-78a3-4274-bc76-9a8eaefdc817",
                                "name": "Delivery date",
                                "alternate_name": "Delivery date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "c05f1eaf-e8c9-48b8-a13a-c01296326ee6"
                            },
                            {
                                "section_item_id": "42ca2256-4b9e-4df5-bf20-9fb530df252a",
                                "name": "Quantity",
                                "alternate_name": "Quantity",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "c05f1eaf-e8c9-48b8-a13a-c01296326ee6"
                            },
                            {
                                "section_item_id": "c88f38f8-090c-4e68-843b-3d2e5bdcec27",
                                "name": "Cost center",
                                "alternate_name": "Cost center",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "c05f1eaf-e8c9-48b8-a13a-c01296326ee6"
                            },
                            {
                                "section_item_id": "bff16c9b-efa9-470a-b1df-371a1a0e4be8",
                                "name": "GL",
                                "alternate_name": "GL",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "c05f1eaf-e8c9-48b8-a13a-c01296326ee6"
                            },
                            {
                                "section_item_id": "a9587dab-dd91-4224-ba56-50e70fb9b146",
                                "name": "Project",
                                "alternate_name": "Project",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "c05f1eaf-e8c9-48b8-a13a-c01296326ee6"
                            },
                            {
                                "section_item_id": "e0324b4a-95d8-4c4d-ac8c-47db4bf72039",
                                "name": "Target rate",
                                "alternate_name": "Target rate",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "195e6846-730c-4619-8479-8b9d46f91345",
                                "name": "Taxes",
                                "alternate_name": "Taxes",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "d188ef83-aaee-4ea2-9fc4-8d211c87d6ad",
                                "name": "Additional costs",
                                "alternate_name": "Additional costs",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "33ffed2b-f82a-4332-8df7-23916b93f6bd",
                                "name": "Discount information",
                                "alternate_name": "Discount information",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "5cd0baaf-8b58-4ef9-a265-6cbd22e0f8bd",
                                "name": "Discount",
                                "alternate_name": "Discount",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false,
                                    "discount_information": {
                                        "cost_type": "PERCENTAGE",
                                        "allocation_type": null
                                    }
                                },
                                "parent_section_item": "33ffed2b-f82a-4332-8df7-23916b93f6bd"
                            }
                        ]
                    },
                    {
                        "section_id": "34cebc35-5754-4cad-9c75-95e16e00eea4",
                        "name": "Vendor Information",
                        "alternate_name": "Vendor Information",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "047ae18c-c8cf-43aa-bf8e-aea04da365e5",
                                "name": "Vendor",
                                "alternate_name": "Vendor",
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
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "44bfb1d1-a986-4dfe-9929-eed2cda44e83",
                        "name": "Payment and Delivery Terms",
                        "alternate_name": "Payment and Delivery Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "85292db5-c711-4991-90cf-f316c48e6eda",
                                "name": "Payment terms",
                                "alternate_name": "Payment terms",
                                "constraints": {
                                    "field_type": "PERIOD",
                                    "choices": null,
                                    "type": "PeriodField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "payment_type": "Pay as per Invoice terms",
                                    "is_negotiable": false,
                                    "allow_prepayment": true,
                                    "payment_from_options": [
                                        "Dispatch date",
                                        "Invoice date",
                                        "Receipt date"
                                    ]
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "54f25761-29f2-4565-9801-dd739f1558cb",
                                "name": "Incoterms",
                                "alternate_name": "Incoterms",
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
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "83afd88d-f411-472c-b169-3cd628303bdb",
                                "name": "Lead time",
                                "alternate_name": "Lead time",
                                "constraints": {
                                    "field_type": "PERIOD",
                                    "choices": null,
                                    "type": "PeriodField"
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
                                "section_item_id": "9408aa67-b758-4bca-a900-fa92c5d8cd17",
                                "name": "GR tolerance",
                                "alternate_name": "GR tolerance",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 10.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "d674052e-38f6-4c59-b788-2dd02a68377b",
                        "name": "Additional Details",
                        "alternate_name": "Additional Details",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "1e9ff850-24be-4e87-b951-12d3fcb34047",
                                "name": "Additional information",
                                "alternate_name": "Additional information",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 0,
                                    "max_limit": 1000,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    }
                ]
            },
            {
                "template_id": "92d4ed98-53c5-4f94-95a9-45d6b6cdabc8",
                "type": "PO_GROUP",
                "name": "Template20250602",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2025-09-23T11:45:49.488758Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-09-23T11:45:49.481267Z",
                "entity_id": "47924a71-c523-4c7a-934d-f1f6ac543bbc",
                "entity_name": "FactWise Demo",
                "auto_reminders": {
                    "max_reminders": 4,
                    "reminder_interval": 24,
                    "is_remainder_required": true,
                    "initial_reminder_hours": 12
                },
                "linked_templates": {},
                "last_edited_by_name": "Admin",
                "assigned_users": [],
                "section_list": [
                    {
                        "section_id": "b53541ff-a7e1-4e58-963a-9cd5852e0365",
                        "name": "PO Group Details",
                        "alternate_name": "PO Group Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "90b5f1ed-ef33-45d9-8c1c-98c0d21d10d0",
                                "name": "PO Group Name",
                                "alternate_name": "PO Group Name",
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
                                "section_item_id": "86ed7385-6a49-4708-9439-71f96d9a6625",
                                "name": "Buyer entity",
                                "alternate_name": "Buyer entity",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "4e256da8-76e1-4e33-89b6-afcfa1de194c",
                                "name": "Template",
                                "alternate_name": "Template",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "7eace38f-6d67-4fcc-8867-f73973b25c1a",
                                "name": "Overall currency",
                                "alternate_name": "Overall currency",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "e2069ffb-8c7e-41fa-8b64-908b546b9e82",
                                "name": "Default item terms",
                                "alternate_name": "Default item terms",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "1febd0a6-e5f7-4931-ad26-485b93391373",
                                "name": "Overall taxes",
                                "alternate_name": "Overall taxes",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "38e1aa31-6378-4d4c-b585-510bcdf0407a",
                                "name": "Overall additional costs",
                                "alternate_name": "Overall additional costs",
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
                                "section_item_id": "edf4e838-eaaf-4658-a052-6e1b432aa3bd",
                                "name": "Overall discount information",
                                "alternate_name": "Overall discount information",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "5c34e6b1-2d28-4e46-84a5-a05fa88b69cf",
                                "name": "Overall discount",
                                "alternate_name": "Overall discount",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false,
                                    "discount_information": {
                                        "cost_type": "PERCENTAGE",
                                        "allocation_type": null
                                    }
                                },
                                "parent_section_item": "edf4e838-eaaf-4658-a052-6e1b432aa3bd"
                            },
                            {
                                "section_item_id": "48a3e2c3-f545-4512-9d0a-6e7de44d9304",
                                "name": "Overall AC %",
                                "alternate_name": "Overall AC %",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 100.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "additional_cost_information": {
                                        "cost_type": "PERCENTAGE",
                                        "cost_source": "VENDOR",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "95ccb388-c556-400d-a2ec-20a51a6fc51a"
                                    }
                                },
                                "parent_section_item": "38e1aa31-6378-4d4c-b585-510bcdf0407a"
                            },
                            {
                                "section_item_id": "c931ee07-1663-4ef0-9501-299410fb3043",
                                "name": "Overall AC OQ",
                                "alternate_name": "Overall AC OQ",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1e+19,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "additional_cost_information": {
                                        "cost_type": "ABSOLUTE_VALUE",
                                        "cost_source": "VENDOR",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "243bf4ac-a381-4d9a-ba5a-845a18a8dd31"
                                    }
                                },
                                "parent_section_item": "38e1aa31-6378-4d4c-b585-510bcdf0407a"
                            }
                        ]
                    },
                    {
                        "section_id": "3c13966e-3183-4ab8-89f7-a330c369b90f",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "14d6c878-1a98-4ded-808a-24d9a93bfd68",
                                "name": "Item",
                                "alternate_name": "Item",
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
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "be24d2f3-9b46-4821-ad62-e9add9835ac9",
                                "name": "Custom specification",
                                "alternate_name": "Custom specification",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "5240138a-9506-4183-a7dc-b2885b53d754",
                                "name": "Quantity Information",
                                "alternate_name": "Quantity Information",
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
                                "section_item_id": "913937a7-0864-4bc7-8146-481f89ee436c",
                                "name": "Delivery date",
                                "alternate_name": "Delivery date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "5240138a-9506-4183-a7dc-b2885b53d754"
                            },
                            {
                                "section_item_id": "33bb5def-7171-4a1d-9b17-67fe7bbe6204",
                                "name": "Quantity",
                                "alternate_name": "Quantity",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "5240138a-9506-4183-a7dc-b2885b53d754"
                            },
                            {
                                "section_item_id": "36bd8697-5831-4d64-9d14-b1a986a2ec87",
                                "name": "Cost center",
                                "alternate_name": "Cost center",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "5240138a-9506-4183-a7dc-b2885b53d754"
                            },
                            {
                                "section_item_id": "1cf3f414-18c0-4a97-b302-88562abfa2aa",
                                "name": "GL",
                                "alternate_name": "GL",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "5240138a-9506-4183-a7dc-b2885b53d754"
                            },
                            {
                                "section_item_id": "6d2a3cdc-d45d-4100-a4b6-f3e31bcd8a47",
                                "name": "Project",
                                "alternate_name": "Project",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "5240138a-9506-4183-a7dc-b2885b53d754"
                            },
                            {
                                "section_item_id": "f08a6e5f-469e-40aa-bf21-b8b4ba1158fa",
                                "name": "Target rate",
                                "alternate_name": "Target rate",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "085d01f3-52f6-4ac6-867a-199d053d32fa",
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
                                "section_item_id": "37e90ae8-a48d-41aa-a34a-e5a21abf1005",
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
                                "section_item_id": "be410c89-f62d-4ac7-8f62-bc8ceb65ddbb",
                                "name": "Discount information",
                                "alternate_name": "Discount information",
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
                                "section_item_id": "66949597-4eef-43eb-84ce-3901057876f0",
                                "name": "Discount",
                                "alternate_name": "Discount",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "discount_information": {
                                        "cost_type": "ABSOLUTE_VALUE",
                                        "cost_source": null,
                                        "allocation_type": "PER_UNIT",
                                        "additional_cost_id": null
                                    }
                                },
                                "parent_section_item": "be410c89-f62d-4ac7-8f62-bc8ceb65ddbb"
                            },
                            {
                                "section_item_id": "055fc52d-a8ef-4dd3-944c-d0ec11ecfcd6",
                                "name": "Item AC %",
                                "alternate_name": "Item AC %",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": null,
                                        "additional_cost_id": "41d06475-c338-42b3-8507-4658fc56e686"
                                    }
                                },
                                "parent_section_item": "37e90ae8-a48d-41aa-a34a-e5a21abf1005"
                            },
                            {
                                "section_item_id": "d6851f5f-a631-4e18-a7be-c500764e52e8",
                                "name": "Item AC PU",
                                "alternate_name": "Item AC PU",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": "PER_UNIT",
                                        "additional_cost_id": "a8ffba07-82eb-46ff-ab61-a11e24eb4cd1"
                                    }
                                },
                                "parent_section_item": "37e90ae8-a48d-41aa-a34a-e5a21abf1005"
                            },
                            {
                                "section_item_id": "78bda424-9053-466d-bbbc-02ea2d61bc96",
                                "name": "Item AC OQ",
                                "alternate_name": "Item AC OQ",
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
                                        "cost_source": "DEFAULT",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "c43ab29e-1019-4741-86be-a8f44958b621"
                                    }
                                },
                                "parent_section_item": "37e90ae8-a48d-41aa-a34a-e5a21abf1005"
                            },
                            {
                                "section_item_id": "500cbf4e-59da-4faa-85c3-d1d8763459e2",
                                "name": "Tax PU",
                                "alternate_name": "Tax PU",
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
                                        "additional_cost_id": "5d4a2c55-b003-4b97-bb62-e206d1f70e2d"
                                    }
                                },
                                "parent_section_item": "085d01f3-52f6-4ac6-867a-199d053d32fa"
                            },
                            {
                                "section_item_id": "92775041-1b66-488a-a5b8-d349c39b7936",
                                "name": "Tax OQ",
                                "alternate_name": "Tax OQ",
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
                                        "additional_cost_id": "01978ea9-4b42-4064-80b2-ecbc9397fc97"
                                    }
                                },
                                "parent_section_item": "085d01f3-52f6-4ac6-867a-199d053d32fa"
                            },
                            {
                                "section_item_id": "ea43779c-2f59-420c-a9f3-efb5e6c9c664",
                                "name": "Tax %",
                                "alternate_name": "Tax %",
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
                                        "additional_cost_id": "de06095e-4e0e-4ef4-8644-19b8570b2d7c"
                                    }
                                },
                                "parent_section_item": "085d01f3-52f6-4ac6-867a-199d053d32fa"
                            }
                        ]
                    },
                    {
                        "section_id": "e0eb3967-4a47-47cc-8e35-8ef8f0004d5d",
                        "name": "Vendor Information",
                        "alternate_name": "Vendor Information",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "be126015-f21e-47a7-ad35-3edb340a3cfb",
                                "name": "Vendor",
                                "alternate_name": "Vendor",
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
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "5486df97-20b6-4c70-b921-1e9798dfd63d",
                        "name": "Payment and Delivery Terms",
                        "alternate_name": "Payment and Delivery Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "834bab26-7ac7-4c71-9637-5ad487aa0262",
                                "name": "Payment terms",
                                "alternate_name": "Payment terms",
                                "constraints": {
                                    "field_type": "PERIOD",
                                    "choices": null,
                                    "type": "PeriodField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "payment_type": "Pay as per Invoice terms",
                                    "is_negotiable": false,
                                    "allow_prepayment": true,
                                    "payment_from_options": [
                                        "Dispatch date",
                                        "Invoice date",
                                        "Receipt date"
                                    ]
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "13859aac-0a0e-49bc-9394-51d4a210c390",
                                "name": "Incoterms",
                                "alternate_name": "Incoterms",
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
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "89c1844a-cb94-4312-8d3d-0091aa81b77b",
                                "name": "Lead time",
                                "alternate_name": "Lead time",
                                "constraints": {
                                    "field_type": "PERIOD",
                                    "choices": null,
                                    "type": "PeriodField"
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
                                "section_item_id": "9b449d44-1c0f-43e7-8d0c-10df3573a901",
                                "name": "GR tolerance",
                                "alternate_name": "GR tolerance",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 10.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "4898f898-e481-4ed5-8936-06576eaf3a8e",
                        "name": "Additional Details",
                        "alternate_name": "Additional Details",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "f57351e5-c826-40b0-bc87-8fa0809ccfa2",
                                "name": "Additional information",
                                "alternate_name": "Additional information",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 0,
                                    "max_limit": 1000,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    }
                ]
            },
            {
                "template_id": "2aad0701-3f63-4bc4-88fc-dc59af5b29fc",
                "type": "PO_GROUP",
                "name": "NA test 2 NMB",
                "tags": [
                    "#PO GROUP",
                    "#EVENT"
                ],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2025-01-31T11:08:50.026789Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-01-31T11:08:50.017792Z",
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
                        "section_id": "f23000a9-d16d-4645-916a-2532674b58a1",
                        "name": "PO Group Details",
                        "alternate_name": "PO Group Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "a5caf332-505f-4323-b9b8-7d7bd2553ba9",
                                "name": "PO Group Name",
                                "alternate_name": "PO Group Name",
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
                                "section_item_id": "60c76ceb-35bc-4a2a-a88b-374f5bb45aa9",
                                "name": "Buyer entity",
                                "alternate_name": "Buyer entity",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "NA(None)"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "0797ca21-0e38-4c13-9126-db4265d92d85",
                                "name": "Template",
                                "alternate_name": "Template",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "abed8a22-1046-4abc-ad7a-82241ae73444",
                                "name": "Overall currency",
                                "alternate_name": "Overall currency",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "32f85629-cd8c-42cf-9d66-4df9f87e73ad",
                                "name": "Default item terms",
                                "alternate_name": "Default item terms",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "935b702b-a8fa-4cad-a654-74048fe70777",
                                "name": "Overall taxes",
                                "alternate_name": "Overall taxes",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "e430456d-df85-45e1-a3c9-67d11a0c7fc2",
                                "name": "Overall additional costs",
                                "alternate_name": "Overall additional costs",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "a7b603d0-31fd-4d69-8a7e-65c9cf23e446",
                                "name": "Overall discount information",
                                "alternate_name": "Overall discount information",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "bdc3d667-d205-41be-bfb1-d80b482f2d49",
                                "name": "Overall discount",
                                "alternate_name": "Overall discount",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false,
                                    "discount_information": {
                                        "cost_type": "PERCENTAGE",
                                        "allocation_type": null
                                    }
                                },
                                "parent_section_item": "a7b603d0-31fd-4d69-8a7e-65c9cf23e446"
                            },
                            {
                                "section_item_id": "467d9a00-4cc0-4820-b6b7-a9b07c9c6570",
                                "name": "Select 2",
                                "alternate_name": "Select 2",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Option 1",
                                        "Option 2",
                                        "Option 3",
                                        "Option 4",
                                        "Option 5"
                                    ],
                                    "choice_type": "DROPDOWN",
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
                                "section_item_id": "7e5fc18a-cffb-4e6d-aecd-1523dfb7b232",
                                "name": "CF Select",
                                "alternate_name": "CF Select",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "A",
                                        "V"
                                    ],
                                    "choice_type": "DROPDOWN",
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
                            }
                        ]
                    },
                    {
                        "section_id": "8edaa68d-350b-40ad-8055-67d3a7eae84d",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "83aebc4f-ef03-4ce9-a05d-7ef046ebadc4",
                                "name": "Item",
                                "alternate_name": "Item",
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
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "a2c7c742-8bc7-4716-81e8-a50c3c70a8d1",
                                "name": "Custom specification",
                                "alternate_name": "Custom specification",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "c9624bfe-7619-4f1b-b2bd-ac3366f6ed01",
                                "name": "Quantity Information",
                                "alternate_name": "Quantity Information",
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
                                "section_item_id": "cc037305-fbd1-4cc5-bd95-9e786249a3fb",
                                "name": "Delivery date",
                                "alternate_name": "Delivery date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "c9624bfe-7619-4f1b-b2bd-ac3366f6ed01"
                            },
                            {
                                "section_item_id": "4d53ab12-2ecb-4b19-a9f3-302a2640d5ea",
                                "name": "Quantity",
                                "alternate_name": "Quantity",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "c9624bfe-7619-4f1b-b2bd-ac3366f6ed01"
                            },
                            {
                                "section_item_id": "973655fd-ad55-4c54-8dce-3fb24580add6",
                                "name": "Cost center",
                                "alternate_name": "Cost center",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "c9624bfe-7619-4f1b-b2bd-ac3366f6ed01"
                            },
                            {
                                "section_item_id": "9160b4f3-dbf1-4f42-920d-3503e15855e0",
                                "name": "GL",
                                "alternate_name": "GL",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "c9624bfe-7619-4f1b-b2bd-ac3366f6ed01"
                            },
                            {
                                "section_item_id": "4678dd57-5c5a-48ac-9e2d-2c3c558f00e8",
                                "name": "Project",
                                "alternate_name": "Project",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "c9624bfe-7619-4f1b-b2bd-ac3366f6ed01"
                            },
                            {
                                "section_item_id": "5e79a38b-fcae-4c83-b702-794bb6f5a4e3",
                                "name": "Target rate",
                                "alternate_name": "Target rate",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "0fdc1c95-6cac-417b-b8f8-5746a63fc4aa",
                                "name": "Taxes",
                                "alternate_name": "Taxes",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "01c0db60-73e1-4591-a6f8-8b8bac96df8a",
                                "name": "Additional costs",
                                "alternate_name": "Additional costs",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "c053c3ab-2626-4527-bf57-dc443d323467",
                                "name": "Discount information",
                                "alternate_name": "Discount information",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "a741f1f1-06a8-481e-88ed-1d57dfd70058",
                                "name": "Discount",
                                "alternate_name": "Discount",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false,
                                    "discount_information": {
                                        "cost_type": "PERCENTAGE",
                                        "allocation_type": null
                                    }
                                },
                                "parent_section_item": "c053c3ab-2626-4527-bf57-dc443d323467"
                            },
                            {
                                "section_item_id": "386e04d7-be22-4e1e-b9eb-b5b4459ed3ea",
                                "name": "Select 01",
                                "alternate_name": "Select 01",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Option 1",
                                        "Option 2",
                                        "Option 3",
                                        "Option 4",
                                        "Option 5"
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
                                "section_item_id": "62a159b5-189a-4197-8a42-a75e8f739dfd",
                                "name": "Select 02",
                                "alternate_name": "Select 02",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Option 1",
                                        "Option 2",
                                        "Option 3",
                                        "Option 4"
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
                                "section_item_id": "cdc69d2f-2708-4f8d-a772-4c7d2b08a066",
                                "name": "Select 03",
                                "alternate_name": "Select 03",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Option 1",
                                        "Option 2",
                                        "Option 3",
                                        "Option 4",
                                        "Option 4a",
                                        "NA(None)"
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
                            }
                        ]
                    },
                    {
                        "section_id": "8087051d-da14-411c-bd00-89f88192fc9f",
                        "name": "Vendor Information",
                        "alternate_name": "Vendor Information",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "14e31265-3114-4557-988a-f0a42ded896e",
                                "name": "Vendor",
                                "alternate_name": "Vendor",
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
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "a74991a8-3e34-4d56-a922-ada909e665b7",
                        "name": "Payment and Delivery Terms",
                        "alternate_name": "Payment and Delivery Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "516abba7-17d6-4284-acdd-84f923286cbd",
                                "name": "Payment terms",
                                "alternate_name": "Payment terms",
                                "constraints": {
                                    "field_type": "PERIOD",
                                    "choices": null,
                                    "type": "PeriodField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "payment_type": "Pay as per Invoice terms",
                                    "is_negotiable": false,
                                    "allow_prepayment": true,
                                    "payment_from_options": [
                                        "Dispatch date",
                                        "Invoice date",
                                        "Receipt date"
                                    ]
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "438f8d51-739e-40cd-8098-0e14118f3f04",
                                "name": "Incoterms",
                                "alternate_name": "Incoterms",
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
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "f6da82a5-cb7f-4623-831c-1ab4ef29e49d",
                                "name": "Lead time",
                                "alternate_name": "Lead time",
                                "constraints": {
                                    "field_type": "PERIOD",
                                    "choices": null,
                                    "type": "PeriodField"
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
                                "section_item_id": "ed5ac6ba-8b4e-4b0c-9f0e-2dbe1fd78c37",
                                "name": "GR tolerance",
                                "alternate_name": "GR tolerance",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 10.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
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
                    },
                    {
                        "section_id": "0ecbdc59-aef4-4890-9da2-c19afc13d207",
                        "name": "Additional Details",
                        "alternate_name": "Additional Details",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "e3450b0a-c170-4b9d-8fd4-cce4f83d3b1c",
                                "name": "Additional information",
                                "alternate_name": "Additional information",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 0,
                                    "max_limit": 1000,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    }
                ]
            },
            {
                "template_id": "fcd9034f-e04c-4cec-9a20-108189b1b285",
                "type": "PO_GROUP",
                "name": "NA test 3 MB+NA",
                "tags": [
                    "#PO GROUP",
                    "#EVENT"
                ],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2025-01-28T12:01:34.910343Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-01-28T12:01:34.903198Z",
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
                        "section_id": "5c2eef31-72cf-4105-b211-2a23688c813b",
                        "name": "PO Group Details",
                        "alternate_name": "PO Group Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "f2b22ef7-665a-491a-a3d2-a81badcee665",
                                "name": "PO Group Name",
                                "alternate_name": "PO Group Name",
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
                                "section_item_id": "c59313f9-96c0-45ca-b524-9bccaa2c20e5",
                                "name": "Buyer entity",
                                "alternate_name": "Buyer entity",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "NA(None)"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "2d365933-2e98-4a40-b149-b8056367587f",
                                "name": "Template",
                                "alternate_name": "Template",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "c0f35531-11f1-4a7e-a026-10761d762a0c",
                                "name": "Overall currency",
                                "alternate_name": "Overall currency",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "5d425c9f-9bcd-4b22-945e-30bf2150f726",
                                "name": "Default item terms",
                                "alternate_name": "Default item terms",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "26af63c7-65e2-43e5-b261-6d767d641d34",
                                "name": "Overall taxes",
                                "alternate_name": "Overall taxes",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "444040fd-6b74-4efe-9f25-d96dd2a51b3c",
                                "name": "Overall additional costs",
                                "alternate_name": "Overall additional costs",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "9204bad6-7658-4175-9a8f-cdc24d655b9c",
                                "name": "Overall discount information",
                                "alternate_name": "Overall discount information",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "59101ad6-7c08-4509-9766-168bd5cfa8c4",
                                "name": "Overall discount",
                                "alternate_name": "Overall discount",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false,
                                    "discount_information": {
                                        "cost_type": "PERCENTAGE",
                                        "allocation_type": null
                                    }
                                },
                                "parent_section_item": "9204bad6-7658-4175-9a8f-cdc24d655b9c"
                            },
                            {
                                "section_item_id": "f034fe2f-9bc1-4713-a7ac-c7816a673cac",
                                "name": "Select 1",
                                "alternate_name": "Select 1",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Option 1",
                                        "Option 2",
                                        "Option 3",
                                        "Option 4",
                                        "Option 5",
                                        "NA(None)"
                                    ],
                                    "choice_type": "DROPDOWN",
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
                                "section_item_id": "8b0d3e85-fa67-4d0e-a6fc-3c324531d20f",
                                "name": "CF Select",
                                "alternate_name": "CF Select",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "A",
                                        "V",
                                        "NA(None)"
                                    ],
                                    "choice_type": "DROPDOWN",
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
                            }
                        ]
                    },
                    {
                        "section_id": "e440bd68-18e8-442b-a89a-97fc71d05ab1",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "e6356e13-d3ab-4d6e-a2af-efe9fb008670",
                                "name": "Item",
                                "alternate_name": "Item",
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
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "ad02f776-e091-4c94-8e14-ee558f979b68",
                                "name": "Custom specification",
                                "alternate_name": "Custom specification",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "07539385-70ee-46a4-ad01-468bce2db589",
                                "name": "Quantity Information",
                                "alternate_name": "Quantity Information",
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
                                "section_item_id": "ad0ff025-5020-4706-840d-6d90797808a1",
                                "name": "Delivery date",
                                "alternate_name": "Delivery date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "07539385-70ee-46a4-ad01-468bce2db589"
                            },
                            {
                                "section_item_id": "a17f9167-5c8b-4ac9-b8c7-5f525b6182cd",
                                "name": "Quantity",
                                "alternate_name": "Quantity",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "07539385-70ee-46a4-ad01-468bce2db589"
                            },
                            {
                                "section_item_id": "b7f9914d-7d34-45f0-b063-e109c3e3f2f9",
                                "name": "Cost center",
                                "alternate_name": "Cost center",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "07539385-70ee-46a4-ad01-468bce2db589"
                            },
                            {
                                "section_item_id": "59061385-12b8-41d9-8ab6-62718348e41f",
                                "name": "GL",
                                "alternate_name": "GL",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "07539385-70ee-46a4-ad01-468bce2db589"
                            },
                            {
                                "section_item_id": "85f7d5fd-c3c9-4884-b2ff-27f43d5edbad",
                                "name": "Target rate",
                                "alternate_name": "Target rate",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "ecebc86f-9cd0-4d02-a122-02386f1ac7b7",
                                "name": "Taxes",
                                "alternate_name": "Taxes",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "ae327bc8-db51-4b89-9913-9e98539b15d9",
                                "name": "Additional costs",
                                "alternate_name": "Additional costs",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "ef4f35d3-a7c7-40a7-aa70-660cdde7e8c1",
                                "name": "Discount information",
                                "alternate_name": "Discount information",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "79b8c7a4-b118-4d53-9aac-fa3c728fdb41",
                                "name": "Discount",
                                "alternate_name": "Discount",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false,
                                    "discount_information": {
                                        "cost_type": "PERCENTAGE",
                                        "allocation_type": null
                                    }
                                },
                                "parent_section_item": "ef4f35d3-a7c7-40a7-aa70-660cdde7e8c1"
                            },
                            {
                                "section_item_id": "0500ed5c-975f-4cf6-8168-943e6870d8c7",
                                "name": "Project",
                                "alternate_name": "Project",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "NA(None)"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "07539385-70ee-46a4-ad01-468bce2db589"
                            }
                        ]
                    },
                    {
                        "section_id": "146404b1-8e28-41b7-8975-9034e04e1416",
                        "name": "Vendor Information",
                        "alternate_name": "Vendor Information",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "af0a04cc-e185-451d-a77b-c5ff45822396",
                                "name": "Vendor",
                                "alternate_name": "Vendor",
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
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "c045cf0e-dd97-4081-81f3-8dde843908aa",
                        "name": "Payment and Delivery Terms",
                        "alternate_name": "Payment and Delivery Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "177c8f54-6de2-4291-8113-305d87aa4a86",
                                "name": "Payment terms",
                                "alternate_name": "Payment terms",
                                "constraints": {
                                    "field_type": "PERIOD",
                                    "choices": null,
                                    "type": "PeriodField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "payment_type": "Pay as per Invoice terms",
                                    "is_negotiable": false,
                                    "allow_prepayment": true,
                                    "payment_from_options": [
                                        "Dispatch date",
                                        "Invoice date",
                                        "Receipt date"
                                    ]
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "a8f1261d-2025-4b39-aa48-54cb84fc91df",
                                "name": "Incoterms",
                                "alternate_name": "Incoterms",
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
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "989e4a81-08ca-491f-b0f2-f7c93c1b2a6d",
                                "name": "Lead time",
                                "alternate_name": "Lead time",
                                "constraints": {
                                    "field_type": "PERIOD",
                                    "choices": null,
                                    "type": "PeriodField"
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
                                "section_item_id": "f96475d6-0bee-4e66-9c23-4d585db70dc6",
                                "name": "GR tolerance",
                                "alternate_name": "GR tolerance",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 10.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
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
                    },
                    {
                        "section_id": "82ec28c7-0e8c-4777-99ba-6b24de16f969",
                        "name": "Additional Details",
                        "alternate_name": "Additional Details",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "ca526f68-dd7f-4a91-ae8f-3d4cb4b48548",
                                "name": "Additional information",
                                "alternate_name": "Additional information",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 0,
                                    "max_limit": 1000,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "54af77ed-cd03-41d0-b78a-7372ad199fd9",
                                "name": "Select 01",
                                "alternate_name": "Select 01",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Option 1",
                                        "Option 2",
                                        "Option 3",
                                        "Option 4",
                                        "Option 5",
                                        "NA(None)"
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
                                "section_item_id": "db0366f7-b4be-49b9-846c-0c9782a95005",
                                "name": "Select 02",
                                "alternate_name": "Select 02",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Option 1",
                                        "Option 2",
                                        "Option 3",
                                        "Option 4",
                                        "NA(None)"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": false,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "34a94d83-a57e-4918-b629-6ba4d5c289fc",
                                "name": "Select 03",
                                "alternate_name": "Select 03",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Option 1",
                                        "Option 2",
                                        "Option 3",
                                        "Option 4",
                                        "Option 4a",
                                        "NA(None)"
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
                            }
                        ]
                    }
                ]
            },
            {
                "template_id": "9fa78ee6-db9b-4c04-b279-b36239bf487e",
                "type": "PO_GROUP",
                "name": "DM Test - All",
                "tags": [],
                "status": "DRAFT",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2026-02-28T11:31:39.561199Z",
                "creator_name": "Admin",
                "last_edited_on": "2026-02-28T11:31:39.550251Z",
                "entity_id": "47924a71-c523-4c7a-934d-f1f6ac543bbc",
                "entity_name": "FactWise Demo",
                "auto_reminders": {
                    "max_reminders": 4,
                    "reminder_interval": 24,
                    "is_remainder_required": true,
                    "initial_reminder_hours": 12
                },
                "linked_templates": {},
                "last_edited_by_name": "Admin",
                "assigned_users": [],
                "section_list": [
                    {
                        "section_id": "6e25c5f7-c603-4623-8ff7-eec1e7f3956c",
                        "name": "PO Group Details",
                        "alternate_name": "PO Group Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "474acf2e-cd1f-40f5-b40f-eb789d0b16b3",
                                "name": "Template",
                                "alternate_name": "Template",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "dfba7ebe-f2a7-4f98-96b3-7ee73c723087",
                                "name": "Overall currency",
                                "alternate_name": "Overall currency",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "e69a443c-936b-4c60-8a80-b94c82af2ffd",
                                "name": "Default item terms",
                                "alternate_name": "Default item terms",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "de44c524-7f30-426e-87cb-2fab5f032f41",
                                "name": "Overall discount information",
                                "alternate_name": "Overall discount information",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "71f345f8-3e96-4e0c-a519-1b3f93c80e05",
                                "name": "Overall attachments",
                                "alternate_name": "Overall attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false,
                                    "notes_mandatory": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "f0acfcef-95f4-44fc-84ca-b2a4979bf5b9",
                                "name": "Overall taxes",
                                "alternate_name": "Overall taxes",
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
                                "section_item_id": "0233f01c-bffb-4ee9-a5a2-2256ae1d196f",
                                "name": "OV Tax 2 (Flat rate) - not included",
                                "alternate_name": "OV Tax 2 (Flat rate) - not included",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1e+19,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "taxes_information": {
                                        "cost_type": "ABSOLUTE_VALUE",
                                        "cost_source": null,
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "5b0e865b-3a6a-4c45-94b6-51125f609e27"
                                    }
                                },
                                "parent_section_item": "f0acfcef-95f4-44fc-84ca-b2a4979bf5b9"
                            },
                            {
                                "section_item_id": "407e6a35-474c-49f8-a5fb-b6ae96c91c85",
                                "name": "OV Tax 1 (%) - not included",
                                "alternate_name": "OV Tax 1 (%) - not included",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 100.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "taxes_information": {
                                        "cost_type": "PERCENTAGE",
                                        "cost_source": null,
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "1e88c151-d4ce-4178-8ae8-d662f27de409"
                                    }
                                },
                                "parent_section_item": "f0acfcef-95f4-44fc-84ca-b2a4979bf5b9"
                            },
                            {
                                "section_item_id": "ce654f73-88bd-4685-a8ff-a16555e2eb05",
                                "name": "OV Tax 2 (Flat rate) - included",
                                "alternate_name": "OV Tax 2 (Flat rate) - included",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1e+19,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "taxes_information": {
                                        "cost_type": "ABSOLUTE_VALUE",
                                        "cost_source": null,
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "15e02a3e-81bd-4070-9fa3-10fdcb8efcb3"
                                    }
                                },
                                "parent_section_item": "f0acfcef-95f4-44fc-84ca-b2a4979bf5b9"
                            },
                            {
                                "section_item_id": "15ded10e-051c-46bf-9428-cc789e336d95",
                                "name": "OV Tax 1 (%) - included",
                                "alternate_name": "OV Tax 1 (%) - included",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 100.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "taxes_information": {
                                        "cost_type": "PERCENTAGE",
                                        "cost_source": null,
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "7a11f7c4-a9cf-4681-bc5b-60d9c397c275"
                                    }
                                },
                                "parent_section_item": "f0acfcef-95f4-44fc-84ca-b2a4979bf5b9"
                            },
                            {
                                "section_item_id": "61dd2e69-6624-46b7-9b8c-c1a39b3d3759",
                                "name": "NOT INCLUDED TAX",
                                "alternate_name": "NOT INCLUDED TAX",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 100.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "taxes_information": {
                                        "cost_type": "PERCENTAGE",
                                        "cost_source": null,
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "364a0b88-d1fb-4cf8-874f-ded0a97efc34"
                                    }
                                },
                                "parent_section_item": "f0acfcef-95f4-44fc-84ca-b2a4979bf5b9"
                            },
                            {
                                "section_item_id": "538f6ca3-71af-4cf6-b7c4-d8878a08729d",
                                "name": "INCLUDED TAX",
                                "alternate_name": "INCLUDED TAX",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 100.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "taxes_information": {
                                        "cost_type": "PERCENTAGE",
                                        "cost_source": null,
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "5bfafe7c-a76e-4f72-99fc-5b4ff7b4ed85"
                                    }
                                },
                                "parent_section_item": "f0acfcef-95f4-44fc-84ca-b2a4979bf5b9"
                            },
                            {
                                "section_item_id": "567610d1-df72-4bc9-b787-042a030161e3",
                                "name": "Overall additional costs",
                                "alternate_name": "Overall additional costs",
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
                                "section_item_id": "00a91908-84e0-47c3-89bd-131175d20a9c",
                                "name": "OV AC 1 (%) - included",
                                "alternate_name": "OV AC 1 (%) - included",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 100.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "additional_cost_information": {
                                        "cost_type": "PERCENTAGE",
                                        "cost_source": "DEFAULT",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "e9361d9b-b4ed-45c5-94f8-17b4242271c7"
                                    }
                                },
                                "parent_section_item": "567610d1-df72-4bc9-b787-042a030161e3"
                            },
                            {
                                "section_item_id": "a1e27972-1f75-42ca-82cd-f49010dd581d",
                                "name": "OV AC 2 (Flat rate) - included",
                                "alternate_name": "OV AC 2 (Flat rate) - included",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1e+19,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "additional_cost_information": {
                                        "cost_type": "ABSOLUTE_VALUE",
                                        "cost_source": "DEFAULT",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "d2d0c9a8-415c-4694-b5c3-09f0b207498f"
                                    }
                                },
                                "parent_section_item": "567610d1-df72-4bc9-b787-042a030161e3"
                            },
                            {
                                "section_item_id": "8579aecf-ad73-477d-8abd-d1bc8b4b5d02",
                                "name": "OV AC 1 (%) - not included",
                                "alternate_name": "OV AC 1 (%) - not included",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 100.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "additional_cost_information": {
                                        "cost_type": "PERCENTAGE",
                                        "cost_source": "DEFAULT",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "a3907145-db58-4dc9-8e3b-ca7818c5a8b1"
                                    }
                                },
                                "parent_section_item": "567610d1-df72-4bc9-b787-042a030161e3"
                            },
                            {
                                "section_item_id": "54ee9417-4194-423b-a75c-bc97bee22ce9",
                                "name": "OV AC 2 (Flat rate) - not included",
                                "alternate_name": "OV AC 2 (Flat rate) - not included",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1e+19,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": true,
                                    "additional_cost_information": {
                                        "cost_type": "ABSOLUTE_VALUE",
                                        "cost_source": "DEFAULT",
                                        "allocation_type": "OVERALL_QUANTITY",
                                        "additional_cost_id": "e75ec075-469c-4d02-a3d0-7695518a84ad"
                                    }
                                },
                                "parent_section_item": "567610d1-df72-4bc9-b787-042a030161e3"
                            },
                            {
                                "section_item_id": "9396bdea-5734-42f0-8295-8ef2ff7dde43",
                                "name": "Overall discount",
                                "alternate_name": "Overall discount",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false,
                                    "discount_information": {
                                        "cost_type": "PERCENTAGE",
                                        "allocation_type": null
                                    }
                                },
                                "parent_section_item": "de44c524-7f30-426e-87cb-2fab5f032f41"
                            },
                            {
                                "section_item_id": "96191a71-9676-4ca5-86e3-53ebf8e126a2",
                                "name": "PO Group Name",
                                "alternate_name": "Po name dm",
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
                                "section_item_id": "fed9fdc6-bf71-42a8-90e4-b046e4c857e6",
                                "name": "Buyer entity",
                                "alternate_name": "Buyer entity dm",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "7ff2cafb-71ee-4c11-be2a-07de8ffb3aee",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "5f8e9357-0ea0-4064-be93-5420557634c3",
                                "name": "Item",
                                "alternate_name": "Item",
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
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "a7283d44-a46b-4ee1-9fbe-55736d01c861",
                                "name": "Custom specification",
                                "alternate_name": "Custom specification",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "baa4eb35-45ad-4056-836a-1d83095f2016",
                                "name": "Quantity Information",
                                "alternate_name": "Quantity Information",
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
                                "section_item_id": "1d78f1a5-b609-493c-be45-b52ee08333a5",
                                "name": "Delivery date",
                                "alternate_name": "Delivery date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "baa4eb35-45ad-4056-836a-1d83095f2016"
                            },
                            {
                                "section_item_id": "070f3244-0bc0-41c2-ba43-80856ca83a5c",
                                "name": "Quantity",
                                "alternate_name": "Quantity",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "baa4eb35-45ad-4056-836a-1d83095f2016"
                            },
                            {
                                "section_item_id": "85f1275a-c6a5-4b54-9111-a994b7770313",
                                "name": "Cost center",
                                "alternate_name": "Cost center",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "baa4eb35-45ad-4056-836a-1d83095f2016"
                            },
                            {
                                "section_item_id": "0b9773f8-955a-400d-91b6-6c735dddf937",
                                "name": "GL",
                                "alternate_name": "GL",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "baa4eb35-45ad-4056-836a-1d83095f2016"
                            },
                            {
                                "section_item_id": "27cbd7f2-7df0-4e14-9b13-fd7487cf7a38",
                                "name": "Project",
                                "alternate_name": "Project",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "baa4eb35-45ad-4056-836a-1d83095f2016"
                            },
                            {
                                "section_item_id": "45322892-b37d-4e93-922e-c5621bbaacbe",
                                "name": "Target rate",
                                "alternate_name": "Target rate",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "73d0e9de-1708-46f2-9a53-114720364d53",
                                "name": "Taxes",
                                "alternate_name": "Taxes",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "91169a51-b66d-474b-8d46-c78d2ea67703",
                                "name": "Additional costs",
                                "alternate_name": "Additional costs",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "e332d90f-f656-4edb-891d-dfc9e8d9e8d3",
                                "name": "Discount information",
                                "alternate_name": "Discount information",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "101f71b6-f3e5-4e41-ab40-ec7ba31dc7cd",
                                "name": "Discount",
                                "alternate_name": "Discount",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false,
                                    "discount_information": {
                                        "cost_type": "PERCENTAGE",
                                        "allocation_type": null
                                    }
                                },
                                "parent_section_item": "e332d90f-f656-4edb-891d-dfc9e8d9e8d3"
                            }
                        ]
                    },
                    {
                        "section_id": "e87adebc-7447-4b85-bc26-b68e40f755e5",
                        "name": "Vendor Information",
                        "alternate_name": "Vendor Information",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "daad4e56-6542-4547-a4d0-ace8709e2c14",
                                "name": "Vendor",
                                "alternate_name": "Vendor",
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
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "bbcb6639-fa13-42d5-8375-fe286ea7bd6a",
                        "name": "Payment and Delivery Terms",
                        "alternate_name": "Payment and Delivery Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "ad17f3c4-4f49-4ed3-a041-ebb346dd2f84",
                                "name": "Payment terms",
                                "alternate_name": "Payment terms",
                                "constraints": {
                                    "field_type": "PERIOD",
                                    "choices": null,
                                    "type": "PeriodField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "payment_type": "Pay as per Invoice terms",
                                    "is_negotiable": false,
                                    "allow_prepayment": true,
                                    "payment_from_options": [
                                        "Dispatch date",
                                        "Invoice date",
                                        "Receipt date"
                                    ]
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "c1247ffd-ce68-4c0b-9625-6ec6d0d4faab",
                                "name": "Incoterms",
                                "alternate_name": "Incoterms",
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
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "41724674-1f06-4a4e-84ae-b77c79c18289",
                                "name": "Lead time",
                                "alternate_name": "Lead time",
                                "constraints": {
                                    "field_type": "PERIOD",
                                    "choices": null,
                                    "type": "PeriodField"
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
                                "section_item_id": "740e2ab6-c788-45b3-b0eb-8c7eb7f3568b",
                                "name": "GR tolerance",
                                "alternate_name": "GR tolerance",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 10.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "16a1cbbb-e146-4a66-a0a4-862ff3ce0e20",
                        "name": "Additional Details",
                        "alternate_name": "Additional Details",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "eabe4681-8c87-47ff-bbae-661f71ff0898",
                                "name": "Additional information",
                                "alternate_name": "Additional information",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 0,
                                    "max_limit": 1000,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    }
                ]
            },
            {
                "template_id": "dd413d36-d731-4f60-8059-f55a2b70b246",
                "type": "PO_GROUP",
                "name": "RahulPO",
                "tags": [],
                "status": "DRAFT",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2026-02-20T08:47:39.321100Z",
                "creator_name": "Admin",
                "last_edited_on": "2026-02-20T08:47:39.312286Z",
                "entity_id": "47924a71-c523-4c7a-934d-f1f6ac543bbc",
                "entity_name": "FactWise Demo",
                "auto_reminders": {
                    "max_reminders": 4,
                    "reminder_interval": 24,
                    "is_remainder_required": true,
                    "initial_reminder_hours": 12
                },
                "linked_templates": {},
                "last_edited_by_name": "Admin",
                "assigned_users": [],
                "section_list": [
                    {
                        "section_id": "eb1de41f-3859-44ca-8eeb-5bd42720646a",
                        "name": "PO Group Details",
                        "alternate_name": "PO Group Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "b6bbdc5b-8106-4e17-8b4c-1e716319c11e",
                                "name": "PO Group Name",
                                "alternate_name": "PO Group Name",
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
                                "section_item_id": "71720299-8aa4-4249-b92b-b60e9ff376c4",
                                "name": "Buyer entity",
                                "alternate_name": "Buyer entity",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "40252293-7ca2-4046-a6b2-91049dfe5c33",
                                "name": "Template",
                                "alternate_name": "Template",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "570bf8a4-6017-4cb7-afa6-5121f6ff988a",
                                "name": "Overall currency",
                                "alternate_name": "Overall currency",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "80fd67e9-3515-4c42-a1f1-f9f1fcdf7cf7",
                                "name": "Default item terms",
                                "alternate_name": "Default item terms",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "b6ddcabf-dab5-453e-bb49-296b5c78688f",
                                "name": "Overall taxes",
                                "alternate_name": "Overall taxes",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "e405678c-cfee-4a53-b2ce-ea35395dd652",
                                "name": "Overall additional costs",
                                "alternate_name": "Overall additional costs",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "ea0991d3-a5d5-4a59-bf15-ebd114f096c4",
                                "name": "Overall discount information",
                                "alternate_name": "Overall discount information",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "33cbc4c7-0b69-4655-a179-d718c2930b27",
                                "name": "Overall attachments",
                                "alternate_name": "Overall attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false,
                                    "notes_mandatory": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "f673ce9e-ec30-4cd1-aae4-d884e54bb292",
                                "name": "Overall discount",
                                "alternate_name": "Overall discount",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false,
                                    "discount_information": {
                                        "cost_type": "PERCENTAGE",
                                        "allocation_type": null
                                    }
                                },
                                "parent_section_item": "ea0991d3-a5d5-4a59-bf15-ebd114f096c4"
                            }
                        ]
                    },
                    {
                        "section_id": "2f7fcee3-a072-47f6-8524-f4a992b1f71a",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "30cbb55e-2f40-4833-8c1d-14bb51f7c47a",
                                "name": "Item",
                                "alternate_name": "Item",
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
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "f1b4770e-38b4-4a6d-bde0-c2e9694340c2",
                                "name": "Custom specification",
                                "alternate_name": "Custom specification",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "84a80d37-4b78-4e1e-a276-71d12a87458d",
                                "name": "Quantity Information",
                                "alternate_name": "Quantity Information",
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
                                "section_item_id": "2a203037-23f0-4ff4-9a17-d97b53cf9a3c",
                                "name": "Delivery date",
                                "alternate_name": "Delivery date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "84a80d37-4b78-4e1e-a276-71d12a87458d"
                            },
                            {
                                "section_item_id": "52bb2e9b-5124-4e8f-9c35-ee05ed924f94",
                                "name": "Quantity",
                                "alternate_name": "Quantity",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "84a80d37-4b78-4e1e-a276-71d12a87458d"
                            },
                            {
                                "section_item_id": "75015443-52ee-4aa9-b1b4-b098a9b56980",
                                "name": "Cost center",
                                "alternate_name": "Cost center",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "84a80d37-4b78-4e1e-a276-71d12a87458d"
                            },
                            {
                                "section_item_id": "91388028-5ae3-436e-b554-b024d9f13b56",
                                "name": "GL",
                                "alternate_name": "GL",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "84a80d37-4b78-4e1e-a276-71d12a87458d"
                            },
                            {
                                "section_item_id": "139e6bed-2d7b-49cd-bc5f-b0dce28ff93e",
                                "name": "Project",
                                "alternate_name": "Project",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "84a80d37-4b78-4e1e-a276-71d12a87458d"
                            },
                            {
                                "section_item_id": "09018c9b-ece1-4940-ac5e-58353a3279bb",
                                "name": "Target rate",
                                "alternate_name": "Target rate",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "cff8f332-6b14-4909-b8be-bfa2db3e3c65",
                                "name": "Taxes",
                                "alternate_name": "Taxes",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "a4fb897b-6950-4301-8b78-4061226bdd0d",
                                "name": "Additional costs",
                                "alternate_name": "Additional costs",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "7e980ba2-3f77-4383-9cdf-6fccb0fc31c0",
                                "name": "Discount information",
                                "alternate_name": "Discount information",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "643a8770-7e44-47a7-9e58-7b6ce01bbeb5",
                                "name": "Discount",
                                "alternate_name": "Discount",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false,
                                    "discount_information": {
                                        "cost_type": "PERCENTAGE",
                                        "allocation_type": null
                                    }
                                },
                                "parent_section_item": "7e980ba2-3f77-4383-9cdf-6fccb0fc31c0"
                            }
                        ]
                    },
                    {
                        "section_id": "fc3583c1-ec7f-4f9d-a3a3-897393224c74",
                        "name": "Vendor Information",
                        "alternate_name": "Vendor Information",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "5195a24b-353f-4b3a-ad33-02ba56b8c0fd",
                                "name": "Vendor",
                                "alternate_name": "Vendor",
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
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "97704c26-13b8-4f78-94e5-0e242e58969c",
                        "name": "Payment and Delivery Terms",
                        "alternate_name": "Payment and Delivery Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "ac57812b-f3ea-4241-b583-a5ade5140344",
                                "name": "Payment terms",
                                "alternate_name": "Payment terms",
                                "constraints": {
                                    "field_type": "PERIOD",
                                    "choices": null,
                                    "type": "PeriodField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "payment_type": "Pay as per Invoice terms",
                                    "is_negotiable": false,
                                    "allow_prepayment": true,
                                    "payment_from_options": [
                                        "Dispatch date",
                                        "Invoice date",
                                        "Receipt date"
                                    ]
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "fbe472b7-942d-4d83-9ff1-7fafa046bb84",
                                "name": "Incoterms",
                                "alternate_name": "Incoterms",
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
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "13eaf2fe-1c13-4767-bcbc-3ae2e5584b30",
                                "name": "Lead time",
                                "alternate_name": "Lead time",
                                "constraints": {
                                    "field_type": "PERIOD",
                                    "choices": null,
                                    "type": "PeriodField"
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
                                "section_item_id": "52986fc0-163f-423a-9e63-ed761b6727b2",
                                "name": "GR tolerance",
                                "alternate_name": "GR tolerance",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 10.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "d486e135-8f2a-4179-9dd6-696f5130a455",
                        "name": "Additional Details",
                        "alternate_name": "Additional Details",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "a2fb5c45-7f83-4aff-b658-475ab4244ec4",
                                "name": "Additional information",
                                "alternate_name": "Additional information",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 0,
                                    "max_limit": 1000,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    }
                ]
            },
            {
                "template_id": "8f4e4d30-daee-4b81-8c07-fdac4398a646",
                "type": "PO_GROUP",
                "name": "Template20250923",
                "tags": [],
                "status": "DRAFT",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2025-09-23T11:42:29.059936Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-09-23T11:42:29.046700Z",
                "entity_id": "47924a71-c523-4c7a-934d-f1f6ac543bbc",
                "entity_name": "FactWise Demo",
                "auto_reminders": {
                    "max_reminders": 4,
                    "reminder_interval": 24,
                    "is_remainder_required": true,
                    "initial_reminder_hours": 12
                },
                "linked_templates": {},
                "last_edited_by_name": "Admin",
                "assigned_users": [],
                "section_list": [
                    {
                        "section_id": "705486c9-7df0-47f9-b156-17196166867b",
                        "name": "PO Group Details",
                        "alternate_name": "PO Group Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "a086fae4-883d-48ab-bb85-0ea3a999aed6",
                                "name": "PO Group Name",
                                "alternate_name": "PO Group Name",
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
                                "section_item_id": "69bd810c-7491-4a76-a4fb-2ba2a6a18028",
                                "name": "Buyer entity",
                                "alternate_name": "Buyer entity",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "f7252ccf-a587-4876-a64b-2454b80793c6",
                                "name": "Template",
                                "alternate_name": "Template",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "b81ae40c-e8bb-42ff-8fb8-f9e779d3e434",
                                "name": "Overall currency",
                                "alternate_name": "Overall currency",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "571909ae-a51b-45d7-a366-dd95cc0491e4",
                                "name": "Default item terms",
                                "alternate_name": "Default item terms",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "ba1fbb77-d4d2-4dc0-add1-13479b68ed89",
                                "name": "Overall taxes",
                                "alternate_name": "Overall taxes",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "6ab45752-5e4e-46fc-9c7c-3773969a8b1a",
                                "name": "Overall additional costs",
                                "alternate_name": "Overall additional costs",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "5ce69394-e7d5-4410-8e2e-fb8b99f504f0",
                                "name": "Overall discount information",
                                "alternate_name": "Overall discount information",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "8ccac8ab-5e62-4dd3-9151-cf2c7cc2f668",
                                "name": "Overall discount",
                                "alternate_name": "Overall discount",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false,
                                    "discount_information": {
                                        "cost_type": "PERCENTAGE",
                                        "allocation_type": null
                                    }
                                },
                                "parent_section_item": "5ce69394-e7d5-4410-8e2e-fb8b99f504f0"
                            }
                        ]
                    },
                    {
                        "section_id": "f66b17d9-fcba-4ed9-994f-5b86226bbeb5",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "26a5b681-c9c8-4a45-89be-fbcc624087fb",
                                "name": "Tax 1 (%) - included",
                                "alternate_name": "Tax 1 (%) - included",
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
                                        "additional_cost_id": "8748c6bc-50ff-4849-b82b-ce3c5f8f372f"
                                    }
                                },
                                "parent_section_item": "b1a571df-8aac-4c84-a2d8-2d66331c54c4"
                            },
                            {
                                "section_item_id": "d14761cd-cff9-4483-a376-5ec7766027c5",
                                "name": "Tax 2 (Flat rate) - included",
                                "alternate_name": "Tax 2 (Flat rate) - included",
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
                                        "additional_cost_id": "40fb72f4-7490-474a-b054-81024e164d36"
                                    }
                                },
                                "parent_section_item": "b1a571df-8aac-4c84-a2d8-2d66331c54c4"
                            },
                            {
                                "section_item_id": "ed111477-1b4d-40f6-bcd4-2085a7261aba",
                                "name": "Item",
                                "alternate_name": "Item",
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
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "410aa383-7b66-4f24-9b66-e7e4c9e7f7c9",
                                "name": "Custom specification",
                                "alternate_name": "Custom specification",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "5fcf7870-df43-4821-aa94-e998f031a009",
                                "name": "Quantity Information",
                                "alternate_name": "Quantity Information",
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
                                "section_item_id": "7b85ba87-2030-4233-becc-56a274142012",
                                "name": "Delivery date",
                                "alternate_name": "Delivery date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "5fcf7870-df43-4821-aa94-e998f031a009"
                            },
                            {
                                "section_item_id": "5612d83b-39d8-436b-b794-127084c9805a",
                                "name": "Quantity",
                                "alternate_name": "Quantity",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "5fcf7870-df43-4821-aa94-e998f031a009"
                            },
                            {
                                "section_item_id": "13ed3979-3a7f-4353-8ede-cf732d63136c",
                                "name": "Cost center",
                                "alternate_name": "Cost center",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "5fcf7870-df43-4821-aa94-e998f031a009"
                            },
                            {
                                "section_item_id": "ed1fc0dc-4cc4-4325-a063-6e366ff5bd59",
                                "name": "GL",
                                "alternate_name": "GL",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "5fcf7870-df43-4821-aa94-e998f031a009"
                            },
                            {
                                "section_item_id": "676abf88-3dbb-4465-8b73-643e35c698b9",
                                "name": "Project",
                                "alternate_name": "Project",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "5fcf7870-df43-4821-aa94-e998f031a009"
                            },
                            {
                                "section_item_id": "d3e00415-7e6d-4424-8684-78aea29b3595",
                                "name": "Target rate",
                                "alternate_name": "Target rate",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "b1a571df-8aac-4c84-a2d8-2d66331c54c4",
                                "name": "Taxes",
                                "alternate_name": "Taxes",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "b30cf101-92cf-43c2-9eb0-4159cdcfbab8",
                                "name": "Additional costs",
                                "alternate_name": "Additional costs",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "57b49ea6-74b6-4385-9a01-5617c4783984",
                                "name": "Discount information",
                                "alternate_name": "Discount information",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "80a615dd-979c-4074-9c66-ce1aa6755e12",
                                "name": "Discount",
                                "alternate_name": "Discount",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false,
                                    "discount_information": {
                                        "cost_type": "PERCENTAGE",
                                        "allocation_type": null
                                    }
                                },
                                "parent_section_item": "57b49ea6-74b6-4385-9a01-5617c4783984"
                            }
                        ]
                    },
                    {
                        "section_id": "311d1ccd-34a4-40bb-803a-82a268ad6e68",
                        "name": "Vendor Information",
                        "alternate_name": "Vendor Information",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "a48e91b0-3696-443c-8502-bdb0cf654bc2",
                                "name": "Vendor",
                                "alternate_name": "Vendor",
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
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "f5ade0ff-ee5a-4d49-a7e9-6392146d471d",
                        "name": "Payment and Delivery Terms",
                        "alternate_name": "Payment and Delivery Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "d1a5f2a1-1006-4eb1-8ecd-bba1e0ba5136",
                                "name": "Payment terms",
                                "alternate_name": "Payment terms",
                                "constraints": {
                                    "field_type": "PERIOD",
                                    "choices": null,
                                    "type": "PeriodField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "payment_type": "Pay as per Invoice terms",
                                    "is_negotiable": false,
                                    "allow_prepayment": true,
                                    "payment_from_options": [
                                        "Dispatch date",
                                        "Invoice date",
                                        "Receipt date"
                                    ]
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "b7fca243-782c-4bbd-8b45-b46589020fb5",
                                "name": "Incoterms",
                                "alternate_name": "Incoterms",
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
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "4b17e448-4fad-40d8-acd0-8639cbc0043f",
                                "name": "Lead time",
                                "alternate_name": "Lead time",
                                "constraints": {
                                    "field_type": "PERIOD",
                                    "choices": null,
                                    "type": "PeriodField"
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
                                "section_item_id": "67e683a6-e6d9-41c8-9451-ced81b1f38de",
                                "name": "GR tolerance",
                                "alternate_name": "GR tolerance",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 10.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "5fc65eb3-4923-48b2-930e-0bbb698a852d",
                        "name": "Additional Details",
                        "alternate_name": "Additional Details",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "b4ff460f-1532-4d79-9480-7d0fbcbe4f47",
                                "name": "Additional information",
                                "alternate_name": "Additional information",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 0,
                                    "max_limit": 1000,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    }
                ]
            },
            {
                "template_id": "11f3e870-15d2-4156-9fb3-400286852cde",
                "type": "PO_GROUP",
                "name": "Draft PO GROUP",
                "tags": [
                    "#PO GROUP",
                    "#EVENT"
                ],
                "status": "DRAFT",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2025-01-07T14:10:38.808635Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-01-07T14:10:38.802912Z",
                "entity_id": "47924a71-c523-4c7a-934d-f1f6ac543bbc",
                "entity_name": "FactWise Demo",
                "auto_reminders": null,
                "linked_templates": null,
                "last_edited_by_name": "Admin",
                "assigned_users": [],
                "section_list": [
                    {
                        "section_id": "4d01b753-1963-4977-8064-d8959d489d48",
                        "name": "PO Group Details",
                        "alternate_name": "PO Group Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "15a049a0-dad1-49bc-b6ab-e9671991d4e6",
                                "name": "PO Group Name",
                                "alternate_name": "PO Group Name",
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
                                "section_item_id": "6ef06dbf-058e-4be1-9a7d-3f69192dc563",
                                "name": "Buyer entity",
                                "alternate_name": "Buyer entity",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "40999bf0-1067-421b-a760-1f1fba3ae901",
                                "name": "Template",
                                "alternate_name": "Template",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "f14eef7a-bb69-44ab-8ecc-16344a7a1b36",
                                "name": "Overall currency",
                                "alternate_name": "Overall currency",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "aa878148-15c2-4d01-8574-9b30ebcce449",
                                "name": "Default item terms",
                                "alternate_name": "Default item terms",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "cc97137b-535a-4521-99ac-8aa349e9d6ec",
                                "name": "Overall taxes",
                                "alternate_name": "Overall taxes",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "49db2c71-1a56-4743-8988-aae79c388ad0",
                                "name": "Overall additional costs",
                                "alternate_name": "Overall additional costs",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "7019a3f9-5862-4fa9-93f6-b5276f87d76f",
                                "name": "Overall discount information",
                                "alternate_name": "Overall discount information",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "ac28b7db-cb24-4d22-a626-8d30563800b9",
                                "name": "Overall discount",
                                "alternate_name": "Overall discount",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": true,
                                    "is_negotiable": false,
                                    "discount_information": {
                                        "cost_type": "PERCENTAGE",
                                        "allocation_type": null
                                    }
                                },
                                "parent_section_item": "7019a3f9-5862-4fa9-93f6-b5276f87d76f"
                            }
                        ]
                    },
                    {
                        "section_id": "e92a518c-6fbd-4d81-8867-b698a16b7e75",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "38461720-f2cb-483d-abb1-e696bfc3e8a2",
                                "name": "Quantity Information",
                                "alternate_name": "Quantity Information",
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
                                "section_item_id": "be8a2387-33d0-42b1-ba36-053d6943f45b",
                                "name": "Delivery date",
                                "alternate_name": "Delivery date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "38461720-f2cb-483d-abb1-e696bfc3e8a2"
                            },
                            {
                                "section_item_id": "0658f90b-67de-43f5-95bd-392c2ecc1f67",
                                "name": "Item",
                                "alternate_name": "Item",
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
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "628bafba-41f1-4ade-a36f-9dce8ce7ea5f",
                                "name": "Custom specification",
                                "alternate_name": "Custom specification",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "559c89b3-1dde-42ab-9a10-5a68a0f484aa",
                                "name": "Quantity",
                                "alternate_name": "Quantity",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "38461720-f2cb-483d-abb1-e696bfc3e8a2"
                            },
                            {
                                "section_item_id": "eaf3013f-0f2a-4009-8374-51859e0336c6",
                                "name": "Cost center",
                                "alternate_name": "Cost center",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "38461720-f2cb-483d-abb1-e696bfc3e8a2"
                            },
                            {
                                "section_item_id": "a12fc61e-e47c-4fc5-a3a2-de71b351cda2",
                                "name": "GL",
                                "alternate_name": "GL",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "38461720-f2cb-483d-abb1-e696bfc3e8a2"
                            },
                            {
                                "section_item_id": "b39e3032-57a4-4ec6-8ee3-ae71cf94f81c",
                                "name": "Project",
                                "alternate_name": "Project",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "DELIVERY_SCHEDULE",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": "38461720-f2cb-483d-abb1-e696bfc3e8a2"
                            },
                            {
                                "section_item_id": "dd5d07e7-3efe-4208-aada-b10b822c298d",
                                "name": "Target rate",
                                "alternate_name": "Target rate",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "666f3769-c3b8-4d1a-9d17-90a3d764933d",
                                "name": "Additional costs",
                                "alternate_name": "Additional costs",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "435b8034-177e-4ce6-87e7-f57ad122a852",
                                "name": "Discount information",
                                "alternate_name": "Discount information",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "72952ecc-aaac-4b20-96b9-53e198ae7fd6",
                                "name": "Discount",
                                "alternate_name": "Discount",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 999999999.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false,
                                    "discount_information": {
                                        "cost_type": "PERCENTAGE",
                                        "allocation_type": null
                                    }
                                },
                                "parent_section_item": "435b8034-177e-4ce6-87e7-f57ad122a852"
                            },
                            {
                                "section_item_id": "48a8de12-3d95-41a9-8167-45fe470a3068",
                                "name": "Taxes",
                                "alternate_name": "Taxes",
                                "constraints": {
                                    "field_type": "COLLECTION",
                                    "type": "CollectionField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "f53755ac-bbd9-43b7-8ae1-2d667ef59ba7",
                        "name": "Vendor Information",
                        "alternate_name": "Vendor Information",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "57acd40c-247d-46e6-9d40-412e0f224c99",
                                "name": "Vendor",
                                "alternate_name": "Vendor",
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
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "7a98c7fd-3d93-414b-bd55-494c7b4dbd30",
                        "name": "Payment and Delivery Terms",
                        "alternate_name": "Payment and Delivery Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "caeed2c7-40c1-43a1-aa9c-7007cdb39431",
                                "name": "Payment terms",
                                "alternate_name": "Payment terms",
                                "constraints": {
                                    "field_type": "PERIOD",
                                    "choices": null,
                                    "type": "PeriodField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": true,
                                    "payment_type": "Pay as per Invoice terms",
                                    "is_negotiable": false,
                                    "allow_prepayment": true,
                                    "payment_from_options": [
                                        "Dispatch date",
                                        "Invoice date",
                                        "Receipt date"
                                    ]
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "1d55cae5-cf88-4c5e-bf71-b710d2db06f8",
                                "name": "Incoterms",
                                "alternate_name": "Incoterms",
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
                                    "is_visible": true,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "ed57dd5b-0c7c-4df7-a2fb-f334ddf1a3e7",
                                "name": "Lead time",
                                "alternate_name": "Lead time",
                                "constraints": {
                                    "field_type": "PERIOD",
                                    "choices": null,
                                    "type": "PeriodField"
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
                                "section_item_id": "4e93e4a9-410e-4e62-90e5-7a00a2bf9685",
                                "name": "GR tolerance",
                                "alternate_name": "GR tolerance",
                                "constraints": {
                                    "field_type": "PERCENTAGE",
                                    "min_limit": 0.0,
                                    "max_limit": 10.0,
                                    "decimal_places": 4,
                                    "type": "PercentageField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "eb5c26c0-92ef-44c7-83a8-11d5d548e200",
                        "name": "Additional Details",
                        "alternate_name": "Additional Details",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "1275640d-54d0-4645-8c47-55c21927dcfa",
                                "name": "Additional information",
                                "alternate_name": "Additional information",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 0,
                                    "max_limit": 1000,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "ITEM",
                                "additional_information": {
                                    "is_hidden": true,
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