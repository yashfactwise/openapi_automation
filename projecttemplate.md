[
    {
        "type": "PROJECT",
        "count": 35,
        "templates": [
            {
                "template_id": "27fecd17-f933-4c8f-93e8-0e1806ff976d",
                "type": "PROJECT",
                "name": "VIS project template",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": true,
                "created_on": "2026-02-10T13:42:44.798697Z",
                "creator_name": "Admin",
                "last_edited_on": "2026-02-10T13:42:44.787857Z",
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
                        "section_id": "0bb69b13-09df-4241-a43e-b6a05e25b656",
                        "name": "Project Details",
                        "alternate_name": "Salesforce Cases",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "42eb59c4-f903-4afc-a567-6e8197c42018",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "38e75317-73b6-474b-978b-7b6c0416b807",
                                "name": "Start date",
                                "alternate_name": "Customer Inquiry Date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "09b9bb6f-825d-41d0-850e-1edcb0bc44c8",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "1b5727ef-5bc6-4a79-a5b4-0c6c87fafab9",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "35419ba9-d52d-4f94-9bc7-e8bba365dd06",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                                    "is_hidden": true,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "50655ca3-e3af-4dee-96ad-b8ea104130c1",
                                "name": "Project code",
                                "alternate_name": "Project number",
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
                                "section_item_id": "9067546d-aed0-420b-b5ca-3e19f9a1eaa2",
                                "name": "Description",
                                "alternate_name": "Description",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 1,
                                    "max_limit": 1000,
                                    "type": "LongTextField"
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
                                "section_item_id": "fe337674-3a11-4b7e-8303-e25f4bf7e6fb",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 1,
                                    "max_limit": 1000,
                                    "type": "LongTextField"
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
                                "section_item_id": "276a131a-6673-4755-b864-b3959ae25387",
                                "name": "End customer name",
                                "alternate_name": "End customer name",
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
                                "section_item_id": "97c2423d-377d-4faa-8af2-08f9cd2c3355",
                                "name": "SFDC Case No.",
                                "alternate_name": "SFDC Case No.",
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
                                "section_item_id": "d95cc92b-dc88-48ef-b1e9-9c92d98cd21f",
                                "name": "Date of Assignment",
                                "alternate_name": "Date of Assignment",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "96f686f7-aae2-4bef-801c-4a98ae2ad48c",
                                "name": "Inquiry",
                                "alternate_name": "Inquiry",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
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
                                "section_item_id": "b2513fbb-2de8-427a-ae09-f6964e817546",
                                "name": "Inquiry Link",
                                "alternate_name": "Inquiry Link",
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
                                "section_item_id": "85c7b27e-48ec-49de-83c5-c9882eeeb0a6",
                                "name": "Customer region",
                                "alternate_name": "Customer region",
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
                                "section_item_id": "0961122e-8f97-4ade-8195-31d18bb36fb3",
                                "name": "SFDC Customer payment terms",
                                "alternate_name": "SFDC Customer payment terms",
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
                                "section_item_id": "d0178a82-52d9-44c0-8c56-0f87b60cb625",
                                "name": "RM name",
                                "alternate_name": "RM name",
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
                                "section_item_id": "43c9dad2-17b4-423b-a5e3-caedd8f64f90",
                                "name": "ACP",
                                "alternate_name": "ACP",
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
                                "section_item_id": "90da3e0f-f9e6-4799-ba9d-2ab4b320b8de",
                                "name": "BFM Category",
                                "alternate_name": "BFM Category",
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
                                "section_item_id": "07c34860-372b-4767-87f2-1c776f16a944",
                                "name": "Subject",
                                "alternate_name": "Subject",
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
                                "section_item_id": "de912104-a958-48f7-8baf-f73ad507a2fb",
                                "name": "Inquiry stage",
                                "alternate_name": "Inquiry stage",
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
                                "section_item_id": "3c32dd7c-4328-47bd-aa09-ffe072120856",
                                "name": "Case status",
                                "alternate_name": "Case status",
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
                                "section_item_id": "78848ac7-f63d-4968-b75c-96b5c2b499bf",
                                "name": "Quotation Maker",
                                "alternate_name": "Quotation Maker",
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
                            }
                        ]
                    },
                    {
                        "section_id": "e423955a-955e-4e55-b72d-46192634f432",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "171d0d10-a108-4ca5-992e-f44691b04cc1",
                                "name": "Item Notes",
                                "alternate_name": "Item Notes",
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
                            }
                        ]
                    },
                    {
                        "section_id": "66e71062-ad0a-48b3-9c6e-791f3a8c0e23",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": []
                    }
                ]
            },
            {
                "template_id": "a412873e-a051-485d-ad00-7f69bc364c9b",
                "type": "PROJECT",
                "name": "QTANLTCS PRJ TEMP",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2026-02-21T18:33:01.121893Z",
                "creator_name": "Admin",
                "last_edited_on": "2026-02-21T18:42:09.216553Z",
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
                        "section_id": "c2dece3c-5015-4f49-b620-4a196c013725",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "d90eb646-cefb-48f8-8f63-6f4c9ddd4be0",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "35c6c55e-1e33-4143-b38d-cd1f50a54ae9",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "10b440c6-63f7-4030-afc4-074d75c6a548",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "eba81c7d-5cb4-4b84-a4b0-7122a6126c8a",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
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
                                "section_item_id": "9dd9a3f4-184d-4094-bc66-b3d7fffbe596",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "0f833d4a-b385-4183-b19d-9d0180b690f4",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "91446e80-bcb9-4619-9530-6bcba05da4d1",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "8c3255c2-12c6-4e05-a074-d09e08a7b8df",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                                "section_item_id": "78fd8fe2-730b-4931-b82c-5145849c5eb0",
                                "name": "Number of model",
                                "alternate_name": "Number of model",
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
                            },
                            {
                                "section_item_id": "f40ebeff-6ccc-4e77-b822-e81172d7ace2",
                                "name": "Date 1",
                                "alternate_name": "Date 1",
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
                                "section_item_id": "3acaa553-67c6-4ef7-aad2-38780a6ab3eb",
                                "name": "Date 2",
                                "alternate_name": "Date 2",
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
                                "section_item_id": "0035b236-11ab-40e3-a381-c6081fd6c11c",
                                "name": "Final Cost Submitted Date",
                                "alternate_name": "Final Cost Submitted Date",
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
                                "section_item_id": "2269f6e6-522e-4aeb-8101-9b377307b566",
                                "name": "Target Lead time (days)",
                                "alternate_name": "Target Lead time (days)",
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
                    },
                    {
                        "section_id": "10c86efb-aef4-4e03-8b08-e52145c49f12",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "8be2b99a-72ee-4f86-a1ab-3dabbdf8b8e1",
                                "name": "Short text 1",
                                "alternate_name": "Short text 1",
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
                                "section_item_id": "0dea8999-c5fa-419c-a266-21c1992a91be",
                                "name": "MOQ",
                                "alternate_name": "MOQ",
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
                                "section_item_id": "51ca7f06-9af0-4574-a975-8938277f2518",
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
                                "section_item_id": "e1fa968e-8a9b-4727-a78d-33457e3bbe6a",
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
                                "section_item_id": "2e5d6466-a025-428f-a60f-d954220f3d4f",
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
                                "section_item_id": "b24fa4e8-6c7a-49bc-838c-bdf9dc3e9bf4",
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
                                "section_item_id": "7423b88e-433b-4f3a-8734-33e6767c6af7",
                                "name": "Additional remarks",
                                "alternate_name": "Additional remarks",
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
                                "section_item_id": "1e67e86d-0665-4344-8d59-2445a463a86b",
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
                                "section_item_id": "9194a006-41f5-4a7d-b7ff-7d3d507238ff",
                                "name": "Purity%",
                                "alternate_name": "Purity%",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
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
                        "section_id": "3ee814ee-9d59-4163-9082-073a4bd36ffc",
                        "name": "KT TEST 1",
                        "alternate_name": "KT TEST 1",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "3f76b8a7-c308-43ab-abee-6a8015d462ba",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "323459e7-aa16-4d89-8e61-f09fe2430d7d",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "55ae72ad-c9cc-4b3b-989a-e39da6982c8c",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "8368e8ca-ace8-49bf-9355-648f46e34beb",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "b691551e-1f62-4898-83d6-e9f6f77c268f",
                                "name": "Boxing (sec)",
                                "alternate_name": "Boxing (sec)",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "548cb82c-3972-4981-8379-7a686017b9fb",
                                "name": "Glueing (sec)",
                                "alternate_name": "Glueing (sec)",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "c9371714-25ab-4975-8160-4cb28ed65a76",
                                "name": "ABC Files",
                                "alternate_name": "ABC Files",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 0,
                                    "max_limit": 120,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "b0acc52a-ce02-4e4f-a404-8bcc6b384dab",
                                "name": "ABC Attachment",
                                "alternate_name": "ABC Attachment",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "85dd61ea-6e24-422f-8dfe-36b0e3a678d5",
                                "name": "THT time per board (sec)",
                                "alternate_name": "THT time per board (sec)",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "bd456660-aa73-488c-8092-b7103eaad537",
                                "name": "hii",
                                "alternate_name": "hii",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "d2861aa4-e079-44eb-b7c3-8bfa17b7d500",
                                "name": "hiiiii",
                                "alternate_name": "hiiiii",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "1",
                                        "2"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "d6199f0d-338d-4b4b-a3d3-ea225035191c",
                                "name": "hiii",
                                "alternate_name": "hiii",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "dfgd",
                                        "fdg d",
                                        "gfd"
                                    ],
                                    "choice_type": "MULTI_SELECT",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
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
                "template_id": "2290f1a4-ef84-4227-8041-b9298774be53",
                "type": "PROJECT",
                "name": "Syrma SGS Template",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2026-02-18T14:34:07.310583Z",
                "creator_name": "Admin",
                "last_edited_on": "2026-02-18T14:34:07.302516Z",
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
                        "section_id": "cb393a37-b56e-486e-8f9b-224db383c04a",
                        "name": "Project Details",
                        "alternate_name": "Marketing",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "097bbed7-8d78-4aa5-a7a9-bcb0a3666a02",
                                "name": "Project code",
                                "alternate_name": "Request code",
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
                                "section_item_id": "88ca7e9b-c78f-4053-9567-8abe63c606c0",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "0b450402-5f76-41c6-90d6-8eca6c58472f",
                                "name": "Description",
                                "alternate_name": "Description",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 1,
                                    "max_limit": 1000,
                                    "type": "LongTextField"
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
                                "section_item_id": "4629d5bd-5e1a-4711-82a2-c4762934c57b",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 1,
                                    "max_limit": 1000,
                                    "type": "LongTextField"
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
                                "section_item_id": "29b0998f-aac6-4b4c-b7db-b50884230e86",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "7b3df3c9-ace2-4159-a95e-3c891df674d0",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "646faa2e-5d83-4d4d-a2f9-34776a91fa3e",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "7a058329-ad4c-4c6a-a05a-64a236008602",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                                "section_item_id": "dd4f1189-d507-4e32-b73d-799732bdcdcc",
                                "name": "Product Description/Application",
                                "alternate_name": "Product Description/Application",
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
                                "section_item_id": "ce2adf30-2412-4389-838f-2822168bc3d6",
                                "name": "Product Design Location",
                                "alternate_name": "Product Design Location",
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
                                "section_item_id": "ea19f75c-61c6-4b2c-a072-34e973056205",
                                "name": "Letter of Authorization/Contract Price Available",
                                "alternate_name": "Letter of Authorization/Contract Price Available",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Yes",
                                        "No"
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
                                "section_item_id": "cfe45006-7e61-4733-b8c9-2cb8c9980dda",
                                "name": "Prototype Required",
                                "alternate_name": "Prototype Required",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Yes",
                                        "No"
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
                                "section_item_id": "6a58e0a6-212a-46a3-8b23-eec45cbedfb4",
                                "name": "Proto Quantity",
                                "alternate_name": "Proto Quantity",
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
                            },
                            {
                                "section_item_id": "13aa09e4-549a-41fb-b5a9-895735c624c9",
                                "name": "EAU(Estimated Annual Usage)",
                                "alternate_name": "EAU(Estimated Annual Usage)",
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
                            },
                            {
                                "section_item_id": "ae1ff6b4-5536-496e-878a-88730d9c6977",
                                "name": "Expected Volume for Next 2 years",
                                "alternate_name": "Expected Volume for Next 2 years",
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
                            },
                            {
                                "section_item_id": "1e91baa6-2f28-43df-bf78-0c9338076170",
                                "name": "Quote Target Date",
                                "alternate_name": "Quote Target Date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "9cf52c89-4d85-4add-b67a-1cd9ebf46bff",
                                "name": "Target Price",
                                "alternate_name": "Target Price",
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
                            },
                            {
                                "section_item_id": "e64aff8d-38bd-4e86-a807-314751ed864c",
                                "name": "Alternates Allowed",
                                "alternate_name": "Alternates Allowed",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Yes",
                                        "No"
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
                                "section_item_id": "da9678f4-9922-48cd-9f49-09582b46408d",
                                "name": "SOP",
                                "alternate_name": "SOP",
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
                                "section_item_id": "f73f8d0e-c744-48a4-b170-91971044dae3",
                                "name": "Product or Quotation Type",
                                "alternate_name": "Product or Quotation Type",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Potential Quote",
                                        "Benchmarking Quote"
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
                                "section_item_id": "938fc009-8cf7-4dd0-bd4c-c926ef58729f",
                                "name": "BOM Attachment",
                                "alternate_name": "BOM Attachment",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
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
                                "section_item_id": "2d013dbf-e186-4579-966d-34e7509775b5",
                                "name": "Export or Domestic",
                                "alternate_name": "Export or Domestic",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Export",
                                        "Domestic"
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
                                "section_item_id": "13899dd7-dbed-48cc-88a7-2aa4bdd91bb4",
                                "name": "Country",
                                "alternate_name": "Country",
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
                                "section_item_id": "0df762b7-2ac4-4281-88ae-1c8192b9088c",
                                "name": "Syrma SGS Manufacturing location",
                                "alternate_name": "Syrma SGS Manufacturing location",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Bangalore",
                                        "Chennai",
                                        "Manesar",
                                        "Bawal",
                                        "Pune",
                                        "Husur",
                                        "Baddi",
                                        "Noida",
                                        "Sets-Chennai",
                                        "Gurgaon"
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
                                "section_item_id": "c76820ca-c7e9-43d2-acc9-09d1fbd93503",
                                "name": "Conformal coating / Epoxy potting/ Ultrasonic welding / any other special processes",
                                "alternate_name": "Conformal coating / Epoxy potting/ Ultrasonic welding / any other special processes",
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
                                "section_item_id": "b5957cc7-8043-4e80-9daf-c4f077288d51",
                                "name": "RFQ Request date from Customer",
                                "alternate_name": "RFQ Request date from Customer",
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
                                "section_item_id": "58dc3299-6c49-4ed1-9126-ab1124931ec5",
                                "name": "Link",
                                "alternate_name": "Link",
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
                                "section_item_id": "34529c98-5f2c-4859-a6e7-5e7b78fcaac5",
                                "name": "Notes",
                                "alternate_name": "Notes",
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
                                "section_item_id": "85544d36-f545-4fb3-92bd-70426d0b8966",
                                "name": "Business segment",
                                "alternate_name": "Business segment",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Aerospace",
                                        "Automotive",
                                        "Consumer",
                                        "Defense",
                                        "IT",
                                        "Industrial",
                                        "Medical",
                                        "Telecom",
                                        "Other"
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
                                "section_item_id": "36de6de9-2a27-4645-8217-b6f5ab2249e6",
                                "name": "Business Lead",
                                "alternate_name": "Business Lead",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Sanjeev Kr Pandey",
                                        "Antony",
                                        "Ravindra Reddy",
                                        "Nataraj",
                                        "Lovesh"
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
                            }
                        ]
                    },
                    {
                        "section_id": "ffe684ff-1c2f-4fc2-9650-88b71f935c9b",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": []
                    },
                    {
                        "section_id": "fa96d182-e254-4936-9488-530e26eda108",
                        "name": "Project - Allocation",
                        "alternate_name": "Project - Allocation",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "4767b56d-737b-4095-8cdd-5127ec448760",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
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
                                "section_item_id": "fb81d585-28f6-4d0e-a5a0-5859bc0de485",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
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
                                "section_item_id": "6ddd4a0f-b185-4302-8eb8-258690015ebe",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "bc0a5b8c-d68e-4169-bf5e-05c7135c67e7",
                                "name": "RfQ Number",
                                "alternate_name": "RfQ Number",
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
                                "section_item_id": "5f4f2646-901d-4a39-a546-e46afd0d50e3",
                                "name": "Customer/Project type",
                                "alternate_name": "Customer/Project type",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "EE",
                                        "EN",
                                        "NN"
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
                                "section_item_id": "832535f9-af83-43ad-aa99-02f07a8aea7e",
                                "name": "Project Buyer",
                                "alternate_name": "Project Buyer",
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
                            }
                        ]
                    },
                    {
                        "section_id": "80b8e128-9722-4fe1-892b-fe381a6cd5b8",
                        "name": "Project - Review",
                        "alternate_name": "Project - Review",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "86f39f9b-d7ab-4a47-88b5-e995c2c01560",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
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
                                "section_item_id": "8f44f220-5d80-4325-9bba-88bb6f174511",
                                "name": "Attachments",
                                "alternate_name": "Review Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "15faaad0-bf2f-4203-9850-4e5e281a334e",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Accepted",
                                        "Partially Accepted",
                                        "Not enough information available"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "7bcd2f1c-6bc2-4c6d-a57b-57c6524d3a38",
                                "name": "1st Review Complete Date",
                                "alternate_name": "1st Review Complete Date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "36a2d445-07e5-4128-8671-4276b872a313",
                                "name": "Package review target date",
                                "alternate_name": "Package review target date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "84c4186a-c9eb-4f9e-9e47-edf4feb5a3ee",
                                "name": "RfQ Status",
                                "alternate_name": "RfQ Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Customer Clarification",
                                        "Dropped",
                                        "Hold",
                                        "Submitted",
                                        "Under Online Pricing",
                                        "Working With Suppliers",
                                        "Yet to Start"
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
                                "section_item_id": "3f0ff157-77a3-452d-a2fa-893ddfc53145",
                                "name": "Review Comments",
                                "alternate_name": "Review Comments",
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
                                "section_item_id": "9f82e230-25b5-4527-a537-93821ca793d2",
                                "name": "Turnkey/Job work",
                                "alternate_name": "Turnkey/Job work",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "JobWork",
                                        "Turnkey",
                                        "Turnkey & JobWork",
                                        "Turnkey/JobWork"
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
                                "section_item_id": "47189e94-633a-46ed-8bfa-96c267d2cd56",
                                "name": "PCBA/Box build",
                                "alternate_name": "PCBA/Box build",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "BoxBuild",
                                        "PCBA"
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
                                "section_item_id": "543b6c14-b7b7-4b7a-ad98-3540a24b017e",
                                "name": "Online Quote",
                                "alternate_name": "Online Quote",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Yes",
                                        "No"
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
                                "section_item_id": "15464485-7ff2-413e-8118-8a4115b723b7",
                                "name": "Supplier Quote",
                                "alternate_name": "Supplier Quote",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Yes",
                                        "No"
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
                                "section_item_id": "7172c7bf-5fbd-4bb8-8a52-938c184ecb4d",
                                "name": "No. of Component lines",
                                "alternate_name": "No. of Component lines",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Less than 150",
                                        "Greater than 150"
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
                                "section_item_id": "d4772a08-b1a2-43d7-acc6-44bb95a81328",
                                "name": "No. of models",
                                "alternate_name": "No. of models",
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
                            },
                            {
                                "section_item_id": "f155153e-2953-4a51-af26-d5cf3433ace5",
                                "name": "Remarks",
                                "alternate_name": "Remarks",
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
                                "section_item_id": "14cf6a5a-e73f-4844-8049-7bfecad15aa5",
                                "name": "Target Lead time (days)",
                                "alternate_name": "Target Lead time (days)",
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
                            },
                            {
                                "section_item_id": "09196945-f84a-44d3-a4a4-e30f9c56a71f",
                                "name": "Quote submission target date",
                                "alternate_name": "Quote submission target date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                        "section_id": "396bf6ec-02a8-454e-9320-155009e3287b",
                        "name": "Engineering Review",
                        "alternate_name": "Engineering Review",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "1763e82f-2172-450e-b0cb-95b4779d41e3",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
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
                                "section_item_id": "6f320486-c503-4764-a998-ca431a937277",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
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
                                "section_item_id": "084df274-5f66-4594-9b06-e4448659bc53",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "a822c75d-3c52-468c-8ef7-abb6d2fa7337",
                                "name": "Review status",
                                "alternate_name": "Review status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Work in progress",
                                        "Customer clarification",
                                        "Hold",
                                        "Insufficient data"
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
                                "section_item_id": "c040f977-36fc-46d4-b253-74a659b0c40e",
                                "name": "Engineering Comments",
                                "alternate_name": "Engineering Comments",
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
                            }
                        ]
                    },
                    {
                        "section_id": "b4dd1caa-ec76-43aa-8297-2f716a03c27f",
                        "name": "Engineering Estimates",
                        "alternate_name": "Engineering Estimates",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "8742a0ef-2a13-478c-b7ee-d8d40c8d2fc1",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
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
                                "section_item_id": "74fb1515-10a2-45d0-91bd-0362ea963db4",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
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
                                "section_item_id": "128793cc-cd94-41c7-ad4f-10251f351d7c",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "580c855e-19bb-4312-bacf-e6237c0d7fca",
                                "name": "Engineering Revision No.",
                                "alternate_name": "Engineering Revision No.",
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
                            }
                        ]
                    },
                    {
                        "section_id": "cb2f84f8-cb5c-4d95-84de-4a65687d40d5",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "b48f4fd7-af7c-4abf-aa3f-770f2ea0a3e7",
                                "name": "SMT Time Per Board (sec)",
                                "alternate_name": "SMT Time Per Board (sec)",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "240e31e0-a4b0-4e7b-98f6-713e1c20ece4",
                                "name": "THT time per board(sec)",
                                "alternate_name": "THT time per board(sec)",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "420498f8-5482-461d-a6cc-812a24f9513b",
                                "name": "THT time (manual soldering) (sec)",
                                "alternate_name": "THT time (manual soldering) (sec)",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "f7bb1b26-511c-4d40-88cf-39039fc8bc59",
                                "name": "Insp. time (AOI and Visual) (sec)",
                                "alternate_name": "Insp. time (AOI and Visual) (sec)",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "ad1c74fb-2c42-4b60-b825-2e8433915534",
                                "name": "Routing time (sec)",
                                "alternate_name": "Routing time (sec)",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "ecc1d39a-6bf7-43da-9278-03992e5d88fb",
                                "name": "FQA time and Manual VI (sec)",
                                "alternate_name": "FQA time and Manual VI (sec)",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "17692b01-3c44-496d-a5d8-d6c9181d2fbd",
                                "name": "Conformal Coating (sec)",
                                "alternate_name": "Conformal Coating (sec)",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "50b51330-1275-43d2-b71a-6789280ea864",
                                "name": "Potting (sec)",
                                "alternate_name": "Potting (sec)",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "14702e9a-7d0e-423f-acfd-c5d8762f720a",
                                "name": "Glueing (sec)",
                                "alternate_name": "Glueing (sec)",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "3fe98143-08e5-427c-b1a7-8c7f673473ab",
                                "name": "Assembly Cost (sec)",
                                "alternate_name": "Assembly Cost (sec)",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "f156a9ab-00b1-4fb8-be43-b50d5e37f28d",
                                "name": "Testing (sec)",
                                "alternate_name": "Testing (sec)",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "f7b6ce8f-35ca-4424-abc7-04c32154bd8b",
                                "name": "Functional testing (sec)",
                                "alternate_name": "Functional testing (sec)",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "f6af037f-2ac8-478b-94fa-f06ad5e8a659",
                                "name": "Boxing (sec)",
                                "alternate_name": "Boxing (sec)",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "1a652243-ec44-4bf3-bc0f-e5174c8e39e3",
                                "name": "Consumables",
                                "alternate_name": "Consumables",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "0e0456b6-46d1-4e1c-aeac-55a11eb4034c",
                                "name": "Consumables Attachments",
                                "alternate_name": "Consumables Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "16b8810b-7684-45e6-b67c-361ce8d85d23",
                                "name": "NRE Details",
                                "alternate_name": "NRE Details",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 0,
                                    "max_limit": 120,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "3209d3ce-6b11-43db-9f33-54a6474319f5",
                                "name": "Notes (BOM)",
                                "alternate_name": "Notes (BOM)",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 0,
                                    "max_limit": 120,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "6faa7c3c-97e3-41bf-843b-5c312bc3a644",
                                "name": "Potting",
                                "alternate_name": "Potting",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
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
                        "section_id": "6178487f-e67e-4e76-b28c-d7e488b1d474",
                        "name": "Project Status",
                        "alternate_name": "Project Status",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "8afb60b7-43dc-48bf-921e-b36e4b10d1c4",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
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
                                "section_item_id": "30afbc73-9082-4374-a816-aae34c6c23ab",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
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
                                "section_item_id": "a978bb90-46f2-4e58-91b8-29cf148e860e",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "9a09e4ac-12a9-4fd3-b672-0e3b1bbff581",
                                "name": "Submitted date",
                                "alternate_name": "Submitted date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "f5fd99a8-535a-4681-80a8-634d4d573932",
                                "name": "Initial Unit BOM cost",
                                "alternate_name": "Initial Unit BOM cost",
                                "constraints": {
                                    "field_type": "CURRENCY",
                                    "type": "CurrencyField"
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
                                "section_item_id": "8ebb84fb-100f-43ad-b9b3-6508ab0461a5",
                                "name": "Total Annual value",
                                "alternate_name": "Total Annual value",
                                "constraints": {
                                    "field_type": "CURRENCY",
                                    "type": "CurrencyField"
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
                        "section_id": "41f834a3-8d72-45ef-8439-70d70a2d3fad",
                        "name": "Final Cost Sheet",
                        "alternate_name": "Final Cost Sheet",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "ca645dd3-15f4-4d9a-aabb-533497a5be73",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
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
                                "section_item_id": "8415de18-f1f8-4468-b74e-10a4439b84c8",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
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
                                "section_item_id": "f8103b94-dc26-45b4-b40e-323a0bd27e53",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "c01ffa92-e332-465f-9b74-a6bdbfbafab8",
                                "name": "Final Cost Sheet Attachment",
                                "alternate_name": "Final Cost Sheet Attachment",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
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
                                "section_item_id": "efac5a2c-2fa4-4752-a108-72912de41ba8",
                                "name": "Final Cost Submitted Date",
                                "alternate_name": "Final Cost Submitted Date",
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
                            }
                        ]
                    },
                    {
                        "section_id": "3b422380-d31f-45ee-a30a-594d60deca60",
                        "name": "Quote Status",
                        "alternate_name": "Quote Status",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "82f254f4-b395-409b-a592-58c17a6b4544",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
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
                                "section_item_id": "ae8b44f4-6895-4526-b394-12ce296e38a9",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
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
                                "section_item_id": "1ca0a01c-b131-421c-92f8-36a7dd288a22",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "f715af06-711f-462a-90a0-130d02616ec4",
                                "name": "Quote status",
                                "alternate_name": "Quote status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Alive",
                                        "Closed/Dead",
                                        "Dropped",
                                        "Hold",
                                        "Lost",
                                        "Win"
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
                                "section_item_id": "e8f8c750-4192-4e7a-867f-4594398bc00d",
                                "name": "P.O Received Date",
                                "alternate_name": "P.O Received Date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "17e27e2d-f196-496f-9918-0d3760447c97",
                                "name": "P.O value($)",
                                "alternate_name": "P.O value($)",
                                "constraints": {
                                    "field_type": "CURRENCY",
                                    "type": "CurrencyField"
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
                                "section_item_id": "c53ff3f9-b9d4-40f7-ace9-a7a4e995a0bf",
                                "name": "P.O qty",
                                "alternate_name": "P.O qty",
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
                    },
                    {
                        "section_id": "5511b062-25da-4dca-9265-42c993256cc1",
                        "name": "Rework",
                        "alternate_name": "Rework",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "94c2ccdc-5503-4abe-8b80-3c40fd1ae7d2",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "b4fa7058-6c4d-4e2b-92f8-ff6086c5d14c",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "aaf61494-6b69-45a6-966d-0b9ec5b6586d",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed",
                                        "Open"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "196b2d18-5674-4a62-999b-3265dfe0eb47",
                                "name": "Rework Start Date",
                                "alternate_name": "Rework Start Date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "3d45a11e-6115-4a29-96a4-b8abfad5a95e",
                                "name": "Rework Type",
                                "alternate_name": "Rework Type",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Price Reduction",
                                        "BOM Revision",
                                        "Volume Revision",
                                        "LOA Received",
                                        "Price Validation",
                                        "Last Buy Price Updation",
                                        "Pending BOM Details Received",
                                        "Lead time Reduction",
                                        "MOQ Impact Reduction"
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
                                "section_item_id": "c3253b4a-6402-47bf-8940-777d99e0e4f4",
                                "name": "No. of models(Rework)",
                                "alternate_name": "No. of models(Rework)",
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
                            },
                            {
                                "section_item_id": "b1b62cfb-ae2b-489f-af57-5c392c931827",
                                "name": "Revised Unit BOM Cost",
                                "alternate_name": "Revised Unit BOM Cost",
                                "constraints": {
                                    "field_type": "CURRENCY",
                                    "type": "CurrencyField"
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
                                "section_item_id": "abd2226e-806c-47f7-8549-ce686c20dc8a",
                                "name": "Revised Total Annual value",
                                "alternate_name": "Revised Total Annual value",
                                "constraints": {
                                    "field_type": "CURRENCY",
                                    "type": "CurrencyField"
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
                                "section_item_id": "b1e2bf97-21ac-4ca0-b6ee-e7f948c1df91",
                                "name": "Notes (Rework)",
                                "alternate_name": "Notes (Rework)",
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
                            }
                        ]
                    }
                ]
            },
            {
                "template_id": "a101be0a-4492-4814-9ffd-047318857113",
                "type": "PROJECT",
                "name": "SG NA Test (28-01-24) (MB + NA)",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2026-02-12T09:38:41.754147Z",
                "creator_name": "Admin",
                "last_edited_on": "2026-02-12T09:38:41.744779Z",
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
                        "section_id": "6945850d-0dae-459c-8460-de01be3c5890",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "ff81f8c0-4ff5-476a-9d0c-62b35770e72e",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "593d6247-7d9a-4a87-9f54-1fb13e6a9425",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "30390300-13d1-4f5d-914d-b0d40bcc5862",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "523b1944-496e-47cf-9e28-ec8d90867c27",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 1,
                                    "max_limit": 1000,
                                    "type": "LongTextField"
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
                                "section_item_id": "eb50a507-bd95-4780-8d20-a47a29f75c54",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "7e82b3e8-c58f-48c3-9211-55b317e98e66",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "44e53613-dae3-474c-b666-820ed26c2a08",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "ad8d6c9c-6b8d-404f-a417-f9fdbe055f0f",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                                "section_item_id": "32b162ff-9764-4106-b285-a1113373db2f",
                                "name": "Select 1",
                                "alternate_name": "Select 1",
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
                                "section_item_id": "fb62e5b3-0aa9-4af7-a2c3-d873147fac96",
                                "name": "checkbox 1",
                                "alternate_name": "checkbox 1",
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
                                "section_item_id": "003a8f00-af0e-4810-92cf-6ecf38b208dc",
                                "name": "Incotermscwqc",
                                "alternate_name": "Incotermscwqc",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "1",
                                        "2"
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
                        "section_id": "9f61d81c-29eb-49e7-b2ef-efc11443d5ae",
                        "name": "Custom Section",
                        "alternate_name": "Custom Section",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "2937f997-bde2-4647-b137-19fd88a35c75",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "7f06382c-18ad-45d0-99b0-4a16574ebbc6",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "78703e64-bdb9-470b-9915-7569cb685046",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "f2202a33-24b0-446b-a4cb-bd0b4e8ad4bc",
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
                                "section_item_id": "08ff659b-662b-4daf-9b68-8da782199fdd",
                                "name": "Select 2",
                                "alternate_name": "Select 2",
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
                            }
                        ]
                    },
                    {
                        "section_id": "58e14919-81e8-4800-9bf1-4f1682f03be2",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": []
                    },
                    {
                        "section_id": "636813d3-47bb-44a7-b4b8-a31b1d0e580b",
                        "name": "BOM Details",
                        "alternate_name": "BOM Details",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": []
                    }
                ]
            },
            {
                "template_id": "7bef9ae3-fb10-41f3-810e-babffb6a263b",
                "type": "PROJECT",
                "name": "kpi testing 2",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2026-01-29T09:53:41.873126Z",
                "creator_name": "Admin",
                "last_edited_on": "2026-01-29T09:53:41.864928Z",
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
                        "section_id": "65757fbe-19fb-44e5-9859-248878807bc8",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "91032978-e0e5-43d9-81a5-5a643605402a",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "f86ee798-c005-4561-8fb4-9d4cb8d9d0c9",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "8de4ba5c-31e5-4a9d-8d80-856edaba9a70",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "3ec401dc-22ce-405e-8da0-6658ec35c5de",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "2a72a23b-9aae-44ab-86d2-e5f91fb8ad1b",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "4d988269-cad5-456d-857d-9f3419f743e7",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "c2c2fa3f-96ea-410f-8767-f815c8424f7f",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                                "section_item_id": "f960ed8a-ee0b-49b8-ac42-8f1be79a7ea5",
                                "name": "Earned value",
                                "alternate_name": "Earned value",
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
                            },
                            {
                                "section_item_id": "925287da-aa50-4e26-8885-73dba52ec930",
                                "name": "Planned Value",
                                "alternate_name": "Planned Value",
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
                            },
                            {
                                "section_item_id": "8db1c294-8038-4084-842f-61a7a1f2d85e",
                                "name": "Actual unit price",
                                "alternate_name": "Actual unit price",
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
                            },
                            {
                                "section_item_id": "0df2c08d-b969-4870-b3de-b29018966a77",
                                "name": "On Time Deliveries",
                                "alternate_name": "On Time Deliveries",
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
                            },
                            {
                                "section_item_id": "83adc0d2-b5b2-4c0a-bc63-f84e2dd042d4",
                                "name": "Long text",
                                "alternate_name": "Long text",
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
                                "section_item_id": "d433ab25-d5a4-4863-8ef1-e77b25ffd6df",
                                "name": "check box",
                                "alternate_name": "check box",
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
                                "section_item_id": "a919380b-dec0-41b2-9249-0d963612232e",
                                "name": "Attachment",
                                "alternate_name": "Attachment",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
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
                                "section_item_id": "8ddfe0ba-54da-4958-9bb9-3a599e667c8d",
                                "name": "Rework cost new",
                                "alternate_name": "Rework cost new",
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
                            },
                            {
                                "section_item_id": "4610138a-4225-413b-be7c-f120db1770b6",
                                "name": "Audit Won 5",
                                "alternate_name": "Audit Won 5",
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
                            },
                            {
                                "section_item_id": "809e9077-73a5-4a99-9cfb-800daba66234",
                                "name": "Price Currency",
                                "alternate_name": "Price Currency",
                                "constraints": {
                                    "field_type": "CURRENCY",
                                    "type": "CurrencyField"
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
                                "section_item_id": "f25a566f-9b51-48c0-8dcb-f9c6ebfef96f",
                                "name": "Is Compliant",
                                "alternate_name": "Is Compliant",
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
                                "section_item_id": "2a58edcf-4f2d-4f69-8c1c-aa3b868f92cb",
                                "name": "SPI New",
                                "alternate_name": "SPI New",
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
                            },
                            {
                                "section_item_id": "4cd0ccf7-8548-435c-9d9c-0a81efc6bbcf",
                                "name": "Ideal output units",
                                "alternate_name": "Ideal output units",
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
                            },
                            {
                                "section_item_id": "42d5a177-a0c7-4bdf-b986-87074538dc87",
                                "name": "Good units",
                                "alternate_name": "Good units",
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
                            },
                            {
                                "section_item_id": "b102cf4e-4a83-49e0-a65a-937f0ea83b22",
                                "name": "Total Units produced",
                                "alternate_name": "Total Units produced",
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
                            },
                            {
                                "section_item_id": "59dfdd29-f5d0-4129-a537-12ccca4c448d",
                                "name": "Total change orders",
                                "alternate_name": "Total change orders",
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
                            },
                            {
                                "section_item_id": "94cacb16-0325-4273-9108-d24ce9c9fe41",
                                "name": "Rejected units",
                                "alternate_name": "Rejected units",
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
                            },
                            {
                                "section_item_id": "1f44e1b0-6c2b-4430-80c7-f8952cfef842",
                                "name": "Total units Received",
                                "alternate_name": "Total units Received",
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
                            },
                            {
                                "section_item_id": "b7607c80-8f87-4d6b-8bf2-290b830e6b0b",
                                "name": "Standard Unit price",
                                "alternate_name": "Standard Unit price",
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
                            },
                            {
                                "section_item_id": "e11130cd-ad4e-4a6b-bb73-97985bbb59ea",
                                "name": "Weight CPI",
                                "alternate_name": "Weight CPI",
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
                            },
                            {
                                "section_item_id": "83bf834e-e455-46f3-addd-d336e0b92bc9",
                                "name": "SPI",
                                "alternate_name": "SPI",
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
                            },
                            {
                                "section_item_id": "5e201275-cc39-4552-bf31-8285ecd487ec",
                                "name": "Weight SPI",
                                "alternate_name": "Weight SPI",
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
                            },
                            {
                                "section_item_id": "7b89c70b-7205-4915-bb62-89cddbd0228e",
                                "name": "Risk probability",
                                "alternate_name": "Risk probability",
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
                            },
                            {
                                "section_item_id": "cb4700dd-a959-4565-8709-7b44050006c0",
                                "name": "Risk Impact Cost",
                                "alternate_name": "Risk Impact Cost",
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
                            },
                            {
                                "section_item_id": "d3f49ae1-9dd6-45d9-adbc-92ece1c3ac32",
                                "name": "Scrap cost",
                                "alternate_name": "Scrap cost",
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
                            },
                            {
                                "section_item_id": "9a15b3ce-e12b-4924-bb46-fa512dc26a7b",
                                "name": "Warranty cost",
                                "alternate_name": "Warranty cost",
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
                            },
                            {
                                "section_item_id": "75c20914-6c01-48a9-af53-d093ff06674c",
                                "name": "Benchmark Unit price",
                                "alternate_name": "Benchmark Unit price",
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
                            },
                            {
                                "section_item_id": "475cfa7b-6508-4c54-96c3-e10af401abd8",
                                "name": "operating time",
                                "alternate_name": "operating time",
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
                            },
                            {
                                "section_item_id": "0fbea08b-14d9-427f-bafa-836ba414ccd9",
                                "name": "Rework cost",
                                "alternate_name": "Rework cost",
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
                            },
                            {
                                "section_item_id": "f6ca4b0c-b2e3-4210-92b2-9bd361f15dcb",
                                "name": "Planned production time",
                                "alternate_name": "Planned production time",
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
                            },
                            {
                                "section_item_id": "38de929c-a6f5-4e50-9601-638304d2dd5b",
                                "name": "Actual output units",
                                "alternate_name": "Actual output units",
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
                            },
                            {
                                "section_item_id": "8cb3218f-744b-42e4-b5c3-be88a1f1ca81",
                                "name": "Project duration months",
                                "alternate_name": "Project duration months",
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
                            },
                            {
                                "section_item_id": "f9ebc4e1-ea7a-4398-8c38-b14da6287baf",
                                "name": "Scale Factor",
                                "alternate_name": "Scale Factor",
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
                            },
                            {
                                "section_item_id": "b34a5675-50cd-4d68-ba48-427bebf7d688",
                                "name": "Audit Checkpoint id",
                                "alternate_name": "Audit Checkpoint id",
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
                                "section_item_id": "36a871f7-1f3f-4cee-ada2-b37bc47d966c",
                                "name": "Quote status",
                                "alternate_name": "Quote status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Hold",
                                        "Dropped",
                                        "Won",
                                        "Lost",
                                        "Submitted"
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
                                "section_item_id": "f609fd4f-54ab-4b76-b1de-5a31d1af51d1",
                                "name": "Currency",
                                "alternate_name": "Currency",
                                "constraints": {
                                    "field_type": "CURRENCY",
                                    "type": "CurrencyField"
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
                                "section_item_id": "a5a4aa0a-91f6-407c-8314-6c25949fb035",
                                "name": "DateTime",
                                "alternate_name": "DateTime",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "90bce867-b3a3-4037-beb3-2cdad7097859",
                                "name": "Date",
                                "alternate_name": "Date",
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
                                "section_item_id": "c7744c5e-1fda-4338-a384-da28be781479",
                                "name": "Short text",
                                "alternate_name": "Short text",
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
                                "section_item_id": "a1384b91-3119-4bf2-9892-254d138e72e2",
                                "name": "Select",
                                "alternate_name": "Select",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "opt 1",
                                        "opt 2",
                                        "opt 3"
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
                                "section_item_id": "fd81348d-74e9-4cfd-98bb-4773e8c34671",
                                "name": "Multi-select",
                                "alternate_name": "Multi-select",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "opt_1",
                                        "opt_2",
                                        "opt_3"
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
                                "section_item_id": "ac2e7cee-eeec-4992-8775-8a9b0c29848f",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 1,
                                    "max_limit": 1000,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
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
                        "section_id": "7312b883-990b-41b0-b3df-093a1746a78e",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": []
                    },
                    {
                        "section_id": "aa07b115-c563-4c57-8822-a0d67b392c7b",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": []
                    }
                ]
            },
            {
                "template_id": "6020ad34-f7a1-4c71-9374-46e950432e9f",
                "type": "PROJECT",
                "name": "Multiple Rejections",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2026-01-13T12:19:43.597116Z",
                "creator_name": "Admin",
                "last_edited_on": "2026-01-13T12:19:43.588425Z",
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
                        "section_id": "2f4a4ce5-d2db-40ab-a988-f1429fa038a0",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [
                            {
                                "user_id": "1c406a8d-c302-4c85-afa5-7affa32b17f0",
                                "permission": "ASSIGN"
                            },
                            {
                                "user_id": "1c406a8d-c302-4c85-afa5-7affa32b17f0",
                                "permission": "EDIT"
                            },
                            {
                                "user_id": "1c406a8d-c302-4c85-afa5-7affa32b17f0",
                                "permission": "VIEW"
                            },
                            {
                                "user_id": "48a5bb77-d7e4-42fb-aed8-cc33c58ce9c2",
                                "permission": "ASSIGN"
                            },
                            {
                                "user_id": "48a5bb77-d7e4-42fb-aed8-cc33c58ce9c2",
                                "permission": "EDIT"
                            },
                            {
                                "user_id": "48a5bb77-d7e4-42fb-aed8-cc33c58ce9c2",
                                "permission": "VIEW"
                            }
                        ],
                        "section_items": [
                            {
                                "section_item_id": "ce021615-3322-4a55-a638-89d774938f4d",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "2e2ff4aa-84a1-48df-a542-369c0bb07da6",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "b4f66979-58b1-466a-9585-7ae96b885f1c",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "f199a369-0dab-4f89-b88b-365e061172ab",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
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
                                "section_item_id": "1a33359e-ba9d-4328-bb16-9a82a39f71f7",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "8d0b4ef2-8055-4e80-9397-25398068eb13",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "eda93bd7-875c-475f-be19-d710314ede44",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "b1b49b62-274e-46b0-902c-58d36ef7b60f",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                            }
                        ]
                    },
                    {
                        "section_id": "2a247d18-2bf2-4257-ba3e-f70a2ab8637b",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "ce0a9b34-6593-40f9-980e-73c60a4c7d6d",
                                "name": "Date time - item",
                                "alternate_name": "Date time - item",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "d3f10ac8-9d17-4392-b0f0-c4a5ecd49460",
                                "name": "Item Notes",
                                "alternate_name": "Item Notes",
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
                                "section_item_id": "9afec071-9238-4198-a979-af41fea60a86",
                                "name": "SAP Item ID",
                                "alternate_name": "SAP Item ID",
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
                            }
                        ]
                    },
                    {
                        "section_id": "ca02e2f1-e1d7-4ae9-9c0f-1e47607cebe4",
                        "name": "RJT1",
                        "alternate_name": "RJT1",
                        "section_type": "ITEM",
                        "assigned_users": [
                            {
                                "user_id": "e5752a85-1612-4b27-aa77-b2b685b085cf",
                                "permission": "ASSIGN"
                            },
                            {
                                "user_id": "e5752a85-1612-4b27-aa77-b2b685b085cf",
                                "permission": "EDIT"
                            },
                            {
                                "user_id": "e5752a85-1612-4b27-aa77-b2b685b085cf",
                                "permission": "VIEW"
                            },
                            {
                                "user_id": "5aaf4173-9542-482d-9344-4a2b6869ae18",
                                "permission": "EDIT"
                            },
                            {
                                "user_id": "5aaf4173-9542-482d-9344-4a2b6869ae18",
                                "permission": "VIEW"
                            }
                        ],
                        "section_items": [
                            {
                                "section_item_id": "9c5dbb3f-fe55-4cbb-a4aa-355c0534c372",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "06477625-e264-4b15-bfb6-9a57dba9d254",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "9285498f-59cd-437a-8991-70da38d1849a",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "33f85f49-b0c3-4b06-95c0-c18f6c3c24ea",
                        "name": "RJT2",
                        "alternate_name": "RJT2",
                        "section_type": "ITEM",
                        "assigned_users": [
                            {
                                "user_id": "50a4b5b0-1b35-4162-b594-2fb9b54ddd04",
                                "permission": "ASSIGN"
                            },
                            {
                                "user_id": "50a4b5b0-1b35-4162-b594-2fb9b54ddd04",
                                "permission": "EDIT"
                            },
                            {
                                "user_id": "50a4b5b0-1b35-4162-b594-2fb9b54ddd04",
                                "permission": "VIEW"
                            }
                        ],
                        "section_items": [
                            {
                                "section_item_id": "2bb1b5e6-41f7-42a5-898d-5a97578556e7",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "5e2df5c0-90ec-4e27-96a6-fcb3c0bfa5c0",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "c42b7d0a-b111-471e-a751-bad20149b447",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "ca6f5275-7994-4b4b-8759-9ed22a60aaa6",
                        "name": "RJT3",
                        "alternate_name": "RJT3",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "b21ae8a4-f3b7-4d42-8b59-9a72c58c6472",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "bbea2b1b-474c-4c06-8bd5-c8be41af05e7",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "68d51546-f346-4895-95d9-18f3b67b3404",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "133c77cc-e0c8-4406-8e9e-cd90abb149c8",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "24182743-fd8a-4cbe-a4a5-e7797c320aa7",
                                "name": "Currency - bom",
                                "alternate_name": "Currency - bom",
                                "constraints": {
                                    "field_type": "CURRENCY",
                                    "type": "CurrencyField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "d8b822a0-a345-479a-8139-f3adfd03ccf5",
                                "name": "Attachment - bom",
                                "alternate_name": "Attachment - bom",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
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
                "template_id": "fa2370ec-3f53-4e48-b9ca-392e86c054e4",
                "type": "PROJECT",
                "name": "Multiple Next Section",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2026-01-13T11:54:54.992116Z",
                "creator_name": "Admin",
                "last_edited_on": "2026-01-13T11:54:54.982514Z",
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
                        "section_id": "470f3a87-5465-4792-b78f-e4c7ac4d4fa8",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "6a98cf1f-560e-4b6c-8869-53e7f5b5dcab",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "bfdee5c7-c6b2-448b-be3d-a746a3c289a5",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "b19ea326-56c3-41fb-b488-79b75db05302",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "a99cf2bb-c165-4da6-a2ab-51720e8641a6",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
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
                                "section_item_id": "96a0e457-07e6-486d-b5c3-acd5d3fae288",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "2c007061-9013-4bcd-a418-25e20b89ea1a",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "53f5fa92-0227-42b4-a639-cf1ea0754c56",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "b268e8ea-faf7-444e-94fa-7ec2af9ab53c",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                            }
                        ]
                    },
                    {
                        "section_id": "9cf82f2d-fd26-47dd-ba35-9265434d2051",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "63ece334-a7aa-42a6-bafb-fc708ffcf5aa",
                                "name": "Date time - item",
                                "alternate_name": "Date time - item",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "67f3644d-eb1b-4eaa-9f16-0e794d8dbd1d",
                                "name": "Item Notes",
                                "alternate_name": "Item Notes",
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
                                "section_item_id": "31c66b1e-fa3d-49bc-9714-031b3bbd8af8",
                                "name": "SAP Item ID",
                                "alternate_name": "SAP Item ID",
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
                            }
                        ]
                    },
                    {
                        "section_id": "50850595-a748-456d-b457-7a983b5553cf",
                        "name": "RJT1",
                        "alternate_name": "RJT1",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "78b4d6b2-7e6c-43f8-92d7-6b838af5d314",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "6ff94cdc-b19f-4525-862c-fc9bda95f365",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "53fc302d-fb56-4538-92db-b4ffee4a86db",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "3d44a9ac-3d6f-46b4-91fb-519140becea0",
                        "name": "RJT2",
                        "alternate_name": "RJT2",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "6c15a325-9ffc-489e-8023-f86abbff27d9",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "c15b9abb-5021-400a-8c08-c486c8823218",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "9726e797-feed-480c-bf48-5fae391392a5",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "9a5951d6-395c-4a21-a486-c98706afdd1b",
                        "name": "RJT3",
                        "alternate_name": "RJT3",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "84bb2788-f9b0-4ab9-b5d1-82f88df43db3",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "3e130288-7b86-4fd8-a354-26b86d182a1e",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "36933bb5-4ea3-4e3d-ac21-a44e42865b49",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "a590a5e7-aea2-42d7-9d84-1d0107bdb2bb",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "ba42e05a-6be7-4586-99c1-63d2b38df302",
                                "name": "Currency - bom",
                                "alternate_name": "Currency - bom",
                                "constraints": {
                                    "field_type": "CURRENCY",
                                    "type": "CurrencyField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "1458a196-809e-4000-86ea-1c5c46d86456",
                                "name": "Attachment - bom",
                                "alternate_name": "Attachment - bom",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
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
                "template_id": "29794551-d7f3-479b-ad4b-a59e573a326e",
                "type": "PROJECT",
                "name": "Simple Both",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2026-01-13T11:31:10.824570Z",
                "creator_name": "Admin",
                "last_edited_on": "2026-01-13T11:31:10.812860Z",
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
                        "section_id": "c66786d2-e66d-468f-aa6f-cf608fa5343c",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "f73e0fe9-382c-4471-8ea6-2dd3f5210a27",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "bd8da05e-5299-4d6e-835d-ed956d87677f",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "2e7bdab1-c880-4d0c-a9dd-487dcf9dcfd5",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "de349389-73ce-4994-bbbd-48413b627c97",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
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
                                "section_item_id": "6b08a591-4ce5-4be5-8d79-6d750614850a",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "a511f171-1cd7-422b-beb8-bd280099fa43",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "b7e55d6f-0079-4d44-975c-b29b94d3988f",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "f698b69c-945e-46b1-bc26-e4529d7a4e25",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                            }
                        ]
                    },
                    {
                        "section_id": "d28368f0-bf2f-456c-8920-f0fbff5d9fec",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "a71f2438-7583-446b-8068-20c0b89a050e",
                                "name": "Date time - item",
                                "alternate_name": "Date time - item",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "60cb7671-aae7-42a2-a645-e8a64245460b",
                                "name": "Item Notes",
                                "alternate_name": "Item Notes",
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
                                "section_item_id": "fa121815-e7d9-47a6-b238-73c0621dc40e",
                                "name": "SAP Item ID",
                                "alternate_name": "SAP Item ID",
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
                            }
                        ]
                    },
                    {
                        "section_id": "8929d31c-3952-498b-a53f-a8d93ad94cb5",
                        "name": "RJT1",
                        "alternate_name": "RJT1",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "f96ad998-cd32-4fd2-82eb-3588cc17f716",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "d8ebb266-d23d-4abb-ab80-d63812645991",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "9c848603-c98f-4223-83c9-598fef5190cc",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "a06c75b1-fbe9-4a76-a25d-73654a69cef5",
                        "name": "RJT2",
                        "alternate_name": "RJT2",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "cbb3efc5-8737-4df5-afbc-c1a6f39e09f1",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "283d2cfd-bbdd-4048-9666-ded629707e1f",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "09809385-e1c5-4da6-a0c6-d2c7a82952ec",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "f12f3a50-f73c-425b-8dd7-08531e13f290",
                        "name": "RJT3",
                        "alternate_name": "RJT3",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "26c62eee-ea19-4068-9877-c7ebef4bd821",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "8848e9ae-d35d-4b8d-b268-14ee26fbc2fb",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "a95a4c5f-2a31-400c-8362-b725e78eca1f",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "4c1d4ad1-a5b0-4885-8383-48acba20a9d2",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "597f5aba-bf84-47ef-a903-8858629194e1",
                                "name": "Currency - bom",
                                "alternate_name": "Currency - bom",
                                "constraints": {
                                    "field_type": "CURRENCY",
                                    "type": "CurrencyField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "0ab90b72-cc81-4bc0-a5f0-67b87389ca8e",
                                "name": "Attachment - bom",
                                "alternate_name": "Attachment - bom",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
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
                "template_id": "b0800014-aedb-4829-b117-771ae3d8205d",
                "type": "PROJECT",
                "name": "Simple only Rejectable sections",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2026-01-13T08:54:45.789142Z",
                "creator_name": "Admin",
                "last_edited_on": "2026-01-13T08:54:45.777177Z",
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
                        "section_id": "1fc95a08-f881-4362-aa60-736204fc8196",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "e039599e-1ea4-4930-af0f-b1e687e029be",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "88e1d7e0-8816-4ebd-94b7-e81abbd0ee66",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "db437c5c-ac8f-4ea2-b361-e428d347cebd",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "ae114c16-ac81-41e0-9fb5-f52658f452b3",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
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
                                "section_item_id": "93c25dae-b996-4d36-a87c-3056c51ecd19",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "960c439a-d9cf-4f56-8b2f-69ebb962f3d4",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "0b22cf12-e9ea-4b86-8aae-f132d1e76902",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "21f56317-297b-49ef-9ea5-8370cd94d471",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                            }
                        ]
                    },
                    {
                        "section_id": "c1293b3c-b358-400e-8ebd-ddf4e9a47eae",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "4fb9af90-3dcb-4d16-878d-ed59eb1d138e",
                                "name": "Date time - item",
                                "alternate_name": "Date time - item",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "a1a3d471-0e8f-4b45-8a6a-480e87a64aef",
                                "name": "Item Notes",
                                "alternate_name": "Item Notes",
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
                                "section_item_id": "e289f0a7-a1a8-4fd7-93e8-7f7dd101c083",
                                "name": "SAP Item ID",
                                "alternate_name": "SAP Item ID",
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
                            }
                        ]
                    },
                    {
                        "section_id": "0ac086a8-5a36-429c-a4c0-4c2152ca2b09",
                        "name": "RJT1",
                        "alternate_name": "RJT1",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "04770128-1e74-4f57-b22c-5be925241eb8",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "37dcedb9-3536-45d6-bd2f-45d2d3e7664d",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "612970f3-9a69-4dbf-a669-30fea67db03f",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "aa30007c-4fb3-47ba-ba0d-c4d534298312",
                        "name": "RJT2",
                        "alternate_name": "RJT2",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "5dfd68ae-15d8-464d-a61b-73b075f3b983",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "3e800a49-8581-4e16-a43b-aad1dc47eeae",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "29d024e8-982e-4165-a027-be7ce6bbf4d5",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "15d48416-16d1-4345-899f-9758cd6096ab",
                        "name": "RJT3",
                        "alternate_name": "RJT3",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "304075c5-8cee-4604-8922-3a938c3f6a0b",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "a45fb3f4-4ddf-4143-87a3-f61e50f9e7be",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "068c89a7-ed05-45b4-ae2a-4c3cd8bdb7a3",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "46dba46f-d352-47b6-917f-b97b69d9eee7",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "0d6cd8eb-6a3a-4356-ba70-9fde308dcb60",
                                "name": "Currency - bom",
                                "alternate_name": "Currency - bom",
                                "constraints": {
                                    "field_type": "CURRENCY",
                                    "type": "CurrencyField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "4e215434-30ec-4ab1-91e6-eea65ce3bbef",
                                "name": "Attachment - bom",
                                "alternate_name": "Attachment - bom",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
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
                "template_id": "ac7dcaef-73cb-491d-94f2-ebf38c902646",
                "type": "PROJECT",
                "name": "No Dependency or Rejection",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2026-01-13T07:22:31.634628Z",
                "creator_name": "Admin",
                "last_edited_on": "2026-01-13T07:22:31.593761Z",
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
                        "section_id": "a7d9dd3f-bb13-4688-8c76-6484f41fe12f",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "cc42cde6-fb66-42aa-ba2d-9726935e690d",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "7598d5a7-a64e-4b1f-860f-46d76e191150",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "fdf67af6-21fc-41d8-b807-3a36d8fb76e1",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "86391306-5ff4-4637-b957-2ca0305a4b94",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "8e51e153-b4d3-490e-a545-fc7aeced3da7",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
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
                                "section_item_id": "6cf48b5a-03e3-43a0-80c6-57e15bc7919a",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "f6ba89bd-d2e9-49bf-a14a-d3ad05375596",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "9f95ff31-9d8e-4f50-a7b3-ffe8e2d5f276",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                            }
                        ]
                    },
                    {
                        "section_id": "179065dd-5b8b-41cf-8e49-5429ecdb5929",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "79446e3d-23bc-4690-88aa-a72ebb7b0112",
                                "name": "Date time - item",
                                "alternate_name": "Date time - item",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "d0b072d5-de3d-47a8-b696-5daa29c9df0e",
                                "name": "Item Notes",
                                "alternate_name": "Item Notes",
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
                                "section_item_id": "b4129f8f-7833-48e2-b713-59973da9d6af",
                                "name": "SAP Item ID",
                                "alternate_name": "SAP Item ID",
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
                            }
                        ]
                    },
                    {
                        "section_id": "ccf889c6-1c86-4ebd-bd88-349c03424551",
                        "name": "RJT1",
                        "alternate_name": "RJT1",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "9a9e02c1-5807-47a0-8aef-e2bbb90bb6ce",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "769afca8-8662-4746-b0f6-7157018f6774",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "ac3f837e-2445-4194-8d32-fd225a8d1881",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "d9268677-9218-45ce-8739-2975397d89bb",
                        "name": "RJT2",
                        "alternate_name": "RJT2",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "de150c75-b3a3-45d0-b611-f24eff7820f2",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "6c4a8f09-e6c8-4bb9-8c6c-30ee2ef01821",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "b7c66c87-3774-4c7e-8a40-719e37212dae",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "1575fa07-464c-40c0-a449-360b4a119a85",
                        "name": "RJT3",
                        "alternate_name": "RJT3",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "98646f9d-0043-48a3-b71d-b7438e5a3e75",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "7c724f15-5c8f-407f-8b18-674c95cca2c3",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "692ba7bc-f684-4111-9fbb-3cae5b6dd0aa",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "2f63247f-fced-4e2a-ab51-71b1c94b8716",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "c5b2b39f-2a68-4fda-a6b0-4a0dbfa7bd3f",
                                "name": "Currency - bom",
                                "alternate_name": "Currency - bom",
                                "constraints": {
                                    "field_type": "CURRENCY",
                                    "type": "CurrencyField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "be647826-2ff2-439b-a0c1-a075a1905885",
                                "name": "Attachment - bom",
                                "alternate_name": "Attachment - bom",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
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
                        "section_id": "e41cfbba-6705-4a1b-a4b6-1304690e3723",
                        "name": "RJT4",
                        "alternate_name": "RJT4",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "bb26f66b-0029-4ae4-b40d-2d01f77dd391",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "a0395162-e548-42f9-be65-6926f9f192c8",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "7e2ea590-271f-4f5e-a071-48d155d8a25e",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    }
                ]
            },
            {
                "template_id": "5671c0fc-ee0f-483d-a513-0a99c83b8aa9",
                "type": "PROJECT",
                "name": "Simple Only Next Section",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2026-01-13T06:55:32.864719Z",
                "creator_name": "Admin",
                "last_edited_on": "2026-01-13T07:26:34.543468Z",
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
                "assigned_users": [
                    {
                        "user_id": "50a4b5b0-1b35-4162-b594-2fb9b54ddd04",
                        "permission": "ASSIGN"
                    },
                    {
                        "user_id": "50a4b5b0-1b35-4162-b594-2fb9b54ddd04",
                        "permission": "CREATE"
                    },
                    {
                        "user_id": "d7d8ca27-edb6-402f-8147-3f8e8327a664",
                        "permission": "ASSIGN"
                    },
                    {
                        "user_id": "d7d8ca27-edb6-402f-8147-3f8e8327a664",
                        "permission": "CREATE"
                    }
                ],
                "section_list": [
                    {
                        "section_id": "8b24cf25-fbbe-4284-ae48-a94fb236498d",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "a413ab38-e984-4910-b559-8a271e965555",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "0a6ec23f-9804-4434-8983-ec7de0954ef3",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "09ba0099-ddff-4bb2-973f-1a805e7730f2",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "a6e7bb82-8ef8-4428-a439-6405ab773db4",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
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
                                "section_item_id": "06f826fd-a6bb-4a53-804c-4ba0c8fe9f2b",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "9c7b9c29-9de4-41e6-abc2-d688fcb2a761",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "a0e1e9c5-91e7-467a-84de-5c70f22057ef",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "2f25cfbc-582e-44a5-80e7-160c3d5dcb01",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                            }
                        ]
                    },
                    {
                        "section_id": "2a90e3e6-4cbb-4e46-9230-2bb1bf625a68",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "d278e94e-c9aa-4cd4-af4c-3c895a677e00",
                                "name": "Date time - item",
                                "alternate_name": "Date time - item",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "be749366-3d66-4e99-a725-1eddca956306",
                                "name": "Item Notes",
                                "alternate_name": "Item Notes",
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
                                "section_item_id": "557e6eed-0699-4423-ab8a-2cb337991956",
                                "name": "SAP Item ID",
                                "alternate_name": "SAP Item ID",
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
                            }
                        ]
                    },
                    {
                        "section_id": "2362c793-34fa-44f5-b175-c20509165f72",
                        "name": "RJT1",
                        "alternate_name": "RJT1",
                        "section_type": "ITEM",
                        "assigned_users": [
                            {
                                "user_id": "48a5bb77-d7e4-42fb-aed8-cc33c58ce9c2",
                                "permission": "ASSIGN"
                            },
                            {
                                "user_id": "48a5bb77-d7e4-42fb-aed8-cc33c58ce9c2",
                                "permission": "EDIT"
                            },
                            {
                                "user_id": "48a5bb77-d7e4-42fb-aed8-cc33c58ce9c2",
                                "permission": "VIEW"
                            }
                        ],
                        "section_items": [
                            {
                                "section_item_id": "98108b49-18dd-4b44-b3b8-b60d1bc7cde4",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "5534502f-2f25-4c35-8c44-991928dca65a",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "a547628e-0e7f-49f3-ab68-03b79068e1db",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "79fdfe03-1844-4e44-8779-105ab9547ee2",
                        "name": "RJT2",
                        "alternate_name": "RJT2",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "fca37b66-6eac-4451-94e8-9db91d3e29a2",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "dfa1da90-6698-4103-8b54-d5f3d45e6db4",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "6e4f1c6c-5b53-45ea-bab1-167f7a775d89",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "c41739ef-a6b5-4568-8f3e-e92b3d28b3d2",
                        "name": "RJT3",
                        "alternate_name": "RJT3",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "4f323ea7-a650-4570-95de-d72a49f64a32",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "4ccf35c2-8c4e-472a-97a7-ffadaea81bbd",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "2fd89e16-4f48-42c9-a4ec-1ea9ed98c3f9",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "e8056e11-a3c6-4e08-b6ea-ae6d80d860f6",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "378a0333-7473-48ba-83f7-4ba58095876e",
                                "name": "Currency - bom",
                                "alternate_name": "Currency - bom",
                                "constraints": {
                                    "field_type": "CURRENCY",
                                    "type": "CurrencyField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "6621d356-06ba-4fcf-919d-fb6b256f7a69",
                                "name": "Attachment - bom",
                                "alternate_name": "Attachment - bom",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
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
                "template_id": "b299da17-1bed-4dd3-ab95-61f5f8bc3c33",
                "type": "PROJECT",
                "name": "RAJU TEST",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2026-01-09T07:26:57.153388Z",
                "creator_name": "Admin",
                "last_edited_on": "2026-01-09T07:26:57.143058Z",
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
                        "section_id": "59e67578-3971-4a89-958b-cb557c79dbda",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "0b759517-50a2-40d6-92fe-4d274885ec60",
                                "name": "Currency - bom",
                                "alternate_name": "Currency - bom",
                                "constraints": {
                                    "field_type": "CURRENCY",
                                    "type": "CurrencyField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "72a7a2a5-8d87-4e23-8e40-837606e0895f",
                                "name": "Attachment - bom",
                                "alternate_name": "Attachment - bom",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
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
                        "section_id": "1de24721-7b35-434a-9dd4-a7aac37cffc6",
                        "name": "RJT4",
                        "alternate_name": "RJT4",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "49148fb1-18d0-4483-b3c7-b291133f8159",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "66e79036-6d76-499d-b9a9-ad59a65d2f9a",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "d79bdc7e-281f-4a5e-a78e-b139a88fae8a",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "bb4c5821-e037-4a54-a9de-9783c0614865",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "9105237f-785c-400f-9eb4-0da2ed09f7f8",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "80838a4c-80eb-4cbd-8803-56abc1178a9d",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "874f2467-1225-4c08-b18c-03451c3bc2ea",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "813e055b-96e5-4fed-8252-893f59342399",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
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
                                "section_item_id": "124817ff-6f7a-4f5b-8f3b-9476e4c67263",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "10f838b2-93ef-4e9a-880b-3df450473f14",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "5393787d-692c-4b55-9129-d46b7b511ddc",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "74a708ea-988c-4da3-aff3-71f16ef3973d",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                            }
                        ]
                    },
                    {
                        "section_id": "58238ebb-99b7-4b6a-920d-050e0e324241",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "ace25a38-21a0-402d-aeb0-f52e777f6d9c",
                                "name": "Date time - item",
                                "alternate_name": "Date time - item",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "8070a70c-9be6-47e5-945d-5f3f11ffa3ba",
                                "name": "Item Notes",
                                "alternate_name": "Item Notes",
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
                                "section_item_id": "cd498d6f-6785-4f43-b8df-a538bc930f99",
                                "name": "SAP Item ID",
                                "alternate_name": "SAP Item ID",
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
                            }
                        ]
                    },
                    {
                        "section_id": "3ef94318-21ae-4699-9c30-25bf050bf6e9",
                        "name": "RJT1",
                        "alternate_name": "RJT1",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "256a321a-3200-4286-b741-34f121a6d7c2",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "06a2cd11-e4d6-4b25-9475-3ebff77d48bb",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "e3834e9e-ed6e-4a47-83c8-d7a105c58105",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "a08bbf8b-6291-4849-968d-075b68523ba2",
                        "name": "RJT2",
                        "alternate_name": "RJT2",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "3e0f1fa1-7818-4774-8b5a-39dc4fd8bf0a",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "8d9fa3cc-28a5-4b2a-abff-151042e4b65f",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "d957e05c-4d94-47f6-8287-59a0de651ef3",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "961a72bc-45eb-4444-b843-f9803de02d60",
                        "name": "RJT3",
                        "alternate_name": "RJT3",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "3bee2f74-a5af-4f1c-99a0-d24d003c791e",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "a1807f63-be73-4bdb-aba3-fea096cf3bc5",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "a418fce6-02b6-496d-b075-0dbb38471412",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    }
                ]
            },
            {
                "template_id": "99623314-43fd-4deb-96fe-1ceebd21ca50",
                "type": "PROJECT",
                "name": "Reactflow",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2026-01-07T07:13:00.975096Z",
                "creator_name": "Admin",
                "last_edited_on": "2026-01-07T07:13:00.961603Z",
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
                        "section_id": "1cc9f208-d476-4e05-b9d6-7d538fd79a39",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "0ea4d034-7899-404b-99f6-0faacb2fc61e",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "d61d1c05-5d7a-4370-8055-0443893a9d2d",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "b752f457-d38a-41c0-bcc8-9a51f6fadbac",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "cf21903f-9b13-40af-b9e4-45f7a3357354",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
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
                                "section_item_id": "582d7c70-e9e9-4ed4-821d-5299b706aa0f",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "8b6a7eac-f960-48ed-82cc-2372f0baa40b",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "9001d5e8-86d8-47f2-83c9-ba31dc039745",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "6dfffb7a-ba40-4a89-ba0c-d3bb9157eef0",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                            }
                        ]
                    },
                    {
                        "section_id": "0308fb99-b9e6-47f6-84e8-406802192dbc",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "2d2b819d-027d-48a3-b4c7-153bd4b4da61",
                                "name": "Scale Factor",
                                "alternate_name": "Scale Factor",
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
                                "section_item_id": "66635f63-3145-492d-89f3-d2cea1b5f261",
                                "name": "Audit Checkpoint id",
                                "alternate_name": "Audit Checkpoint id",
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
                            }
                        ]
                    },
                    {
                        "section_id": "afbfcfb6-2e65-4949-bf77-817a958acd6f",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "4e2fdd85-386a-4b42-bb4e-124aac799f76",
                                "name": "Glueing (sec)",
                                "alternate_name": "Glueing (sec)",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "487c2247-a0b7-4a41-a87d-1aa34e40ece6",
                                "name": "Boxing (sec)",
                                "alternate_name": "Boxing (sec)",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
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
                        "section_id": "5bb7c8ce-6c60-4fc9-b3e4-0b50d11cbc68",
                        "name": "1",
                        "alternate_name": "1",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "da02bf08-6013-4e02-9e0b-d05028188a7b",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "32714d78-d8a2-410b-8097-a05f5f9cb14d",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "aa2b825b-2bf4-4ede-b7a0-27f68891169a",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "e6d25088-b3c4-45bf-959e-6525ee57279c",
                        "name": "2",
                        "alternate_name": "2",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "366739ab-c4f8-4eb8-bd0f-9b4d8741c393",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "78ac5622-83bc-4314-9c01-bd0f74b8752a",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "0ca7ed9a-21c0-4d79-af1a-7939d41fd8b3",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "5b45228b-c616-479f-8476-5f3ca6ad9177",
                        "name": "3",
                        "alternate_name": "3",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "d92a37ab-b79f-4896-9dcf-aed4cfd74f44",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "138162a2-6838-4597-be56-d304ebdf339e",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "d1ff502a-7825-4e23-933d-bb8de64fc75e",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    }
                ]
            },
            {
                "template_id": "4720784b-79d8-4234-a878-0a2efbd37d9b",
                "type": "PROJECT",
                "name": "Cyient DLM",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2025-12-30T12:39:02.457864Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-12-30T12:39:46.083197Z",
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
                        "section_id": "f69df985-5cd7-4179-b87d-29b477397496",
                        "name": "Project Details",
                        "alternate_name": "Sales",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "93ef4f9c-c4e5-4da1-b9dd-a23678c4eccd",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "1ef97c21-c70c-4321-9d9b-eec0635c6e00",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "4d41f049-e968-4b75-82e0-1adb7a121efb",
                                "name": "Description",
                                "alternate_name": "Description",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 1,
                                    "max_limit": 1000,
                                    "type": "LongTextField"
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
                                "section_item_id": "47acae59-b921-4fd0-aec7-dd403aed5879",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 1,
                                    "max_limit": 1000,
                                    "type": "LongTextField"
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
                                "section_item_id": "6d1e106c-b5b5-4d97-b77f-deee0cf3fb7c",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "33b92e40-22b5-4b1e-8398-6dff9b5fbe33",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "9a5f450a-6436-46df-ae81-d6071d19ddbc",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "db466ea0-903f-4dc7-bbff-564830f8f8d5",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                                "section_item_id": "a80bb947-20a0-4e2c-91a2-79e665a4cbd1",
                                "name": "Opportunity ID",
                                "alternate_name": "Opportunity ID",
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
                                "section_item_id": "f48da62b-379a-49a2-abcf-6df7a83a7f05",
                                "name": "RFQ Date",
                                "alternate_name": "RFQ Date",
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
                                "section_item_id": "ddbfa037-c5dd-4eff-be83-36668c9ac73f",
                                "name": "Industry Segment",
                                "alternate_name": "Industry Segment",
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
                                "section_item_id": "590f066f-7f1c-4c82-a1cf-25ac3301e0d1",
                                "name": "RFQ Due Date",
                                "alternate_name": "RFQ Due Date",
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
                                "section_item_id": "cb21d80d-e184-401f-b94f-9016381adfe5",
                                "name": "Name of the Organization & Location (City)",
                                "alternate_name": "Name of the Organization & Location (City)",
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
                                "section_item_id": "ee2acc24-868c-47ab-97a2-520427181551",
                                "name": "Customer & Opportunity Category ( EN / NN )",
                                "alternate_name": "Customer & Opportunity Category ( EN / NN )",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "EN",
                                        "NN"
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
                                "section_item_id": "d57b1778-509f-4ce0-9405-469fb0cbbc45",
                                "name": "Country",
                                "alternate_name": "Country",
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
                                "section_item_id": "db05bda3-4ac6-4bb9-a70c-602a1ba5464f",
                                "name": "Primary Contact Name",
                                "alternate_name": "Primary Contact Name",
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
                                "section_item_id": "e39ff50f-3f95-42e4-915d-bce507cb9150",
                                "name": "Primary Contact Designation",
                                "alternate_name": "Primary Contact Designation",
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
                                "section_item_id": "57df20ba-6992-4b9f-bc8b-e9d991115005",
                                "name": "Primary Contact Email",
                                "alternate_name": "Primary Contact Email",
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
                                "section_item_id": "e4d1fcdb-8127-471a-9592-c3b45879d199",
                                "name": "Primary Contact Mobile No",
                                "alternate_name": "Primary Contact Mobile No",
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
                                "section_item_id": "f07ad8cd-7ced-45c2-8b08-86d4a769bf25",
                                "name": "Primary Contact Landline No",
                                "alternate_name": "Primary Contact Landline No",
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
                                "section_item_id": "7a7bb242-f5bb-4c0a-b691-403aa6b74ac1",
                                "name": "Secondary Contact Name",
                                "alternate_name": "Secondary Contact Name",
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
                                "section_item_id": "77d3c715-80b1-4950-b803-93b48730112c",
                                "name": "Secondary Contact Designation",
                                "alternate_name": "Secondary Contact Designation",
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
                                "section_item_id": "b25955de-e56b-45ee-b5c0-48671b6a2d88",
                                "name": "Secondary Contact Email",
                                "alternate_name": "Secondary Contact Email",
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
                                "section_item_id": "4aec63fe-3e73-4adc-9a6a-ead895cde3a5",
                                "name": "Secondary Contact Mobile No",
                                "alternate_name": "Secondary Contact Mobile No",
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
                                "section_item_id": "aafeaec1-c01e-472e-9380-a11970ab4e78",
                                "name": "Secondary Contact Landline No",
                                "alternate_name": "Secondary Contact Landline No",
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
                                "section_item_id": "f3f474c5-3e06-45bd-9e6d-21673003600d",
                                "name": "Firm / (Budgetary or ROM)",
                                "alternate_name": "Firm / (Budgetary or ROM)",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Budgetary",
                                        "ROM"
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
                                "section_item_id": "d4166033-3613-41aa-a1fe-ac5bd9e2b8c7",
                                "name": "End Application",
                                "alternate_name": "End Application",
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
                                "section_item_id": "31ca7321-1bba-4e1b-928e-9c43de7352c2",
                                "name": "Design Origin",
                                "alternate_name": "Design Origin",
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
                                "section_item_id": "b80c7ff9-5b68-4ed4-b499-cbf4ac024e5d",
                                "name": "License Requirements (Specify)",
                                "alternate_name": "License Requirements (Specify)",
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
                                "section_item_id": "c0af5604-3fa2-4888-8be4-6875e5d09386",
                                "name": "Targeted Plant",
                                "alternate_name": "Targeted Plant",
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
                            }
                        ]
                    },
                    {
                        "section_id": "098e3dc1-7496-40bd-8b5c-5c9b1cf6e7c8",
                        "name": "Bid Management",
                        "alternate_name": "Bid Management",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "95accbc9-d3bc-43e8-a5e1-bc49393bfd3b",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
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
                                "section_item_id": "8e20b3ef-584d-485b-b3b6-a2682ff82ba9",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
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
                                "section_item_id": "72b67597-b8f8-4a05-a172-e784441f9b96",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "e035e405-cdaa-4a8d-8773-dd34c1254bdb",
                                "name": "Sales Approved",
                                "alternate_name": "Sales Approved",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Yes",
                                        "No"
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
                        "section_id": "78615b7e-b1f7-4673-a419-278c58b2796a",
                        "name": "Component Engineering",
                        "alternate_name": "Component Engineering",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "d128fc5e-ad80-46e7-97dc-220642542361",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
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
                                "section_item_id": "bb18eb37-4c1c-4740-a784-4fce144f31ed",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "d70c1285-2758-4eb2-8d74-2e7da708f735",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "298dcc4e-c581-4a71-b96f-7cd1bd7c6b71",
                                "name": "Remarks",
                                "alternate_name": "Remarks",
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
                                "section_item_id": "b9cc1fbb-e990-4c29-89f6-2a1036a8a6d9",
                                "name": "Customer BOM Attachments",
                                "alternate_name": "Customer BOM Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
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
                        "section_id": "0405f1ae-37ce-4760-a0ad-f8d474d9fb77",
                        "name": "Sourcing",
                        "alternate_name": "Sourcing",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "bc38b9ea-f6a1-4199-a078-a78cc1e10503",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
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
                                "section_item_id": "6ecd26a5-aa74-4c95-b579-bab1d375570c",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
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
                                "section_item_id": "71a756a1-22a7-4043-82f2-68e585dc6385",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "824bdd29-41ab-44ab-b51e-f14068be6514",
                                "name": "Completion Date",
                                "alternate_name": "Completion Date",
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
                                "section_item_id": "a3de5a5a-5d96-4a80-8b69-f60badbe1027",
                                "name": "Notes",
                                "alternate_name": "Notes",
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
                            }
                        ]
                    },
                    {
                        "section_id": "abbb3db1-e1ec-44ce-aece-dabff60213b5",
                        "name": "Engineering and Testing",
                        "alternate_name": "Engineering and Testing",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "16ac0070-6884-4bd5-957f-24dbae818784",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
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
                                "section_item_id": "0bf3a07a-7487-44ea-ac0f-d1223ecec9fa",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
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
                                "section_item_id": "13997861-36c0-4006-8ce5-4fa4e8aa4327",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
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
                        "section_id": "36cc67e1-afc8-4bf9-8157-37b56492b8f5",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "5ade990e-7e2b-4b33-860c-f8357784daac",
                                "name": "ESS (divide by boardsper room)",
                                "alternate_name": "ESS (divide by boardsper room)",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "a66ee097-52db-45f4-9ddf-fde8fbbd930b",
                                "name": "Burn in (divide by boardsper room)",
                                "alternate_name": "Burn in (divide by boardsper room)",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "d4b5140f-31a7-4db1-99b9-5e9830ab7788",
                                "name": "Vibration",
                                "alternate_name": "Vibration",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "21709afa-14d5-4bba-8116-d80a2ffb9228",
                                "name": "FPT",
                                "alternate_name": "FPT",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "af25b70c-8fdf-4d25-bd46-d1a043107aec",
                                "name": "HI POT",
                                "alternate_name": "HI POT",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "4ce4db7b-a9f0-4859-9489-a9b9dbb81d6e",
                                "name": "No. of SMD Components",
                                "alternate_name": "No. of SMD Components",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "efe53f91-d89a-47e8-8c34-91bd105ecffb",
                                "name": "No. of SMD Line Items",
                                "alternate_name": "No. of SMD Line Items",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "68a70ce0-cbd6-4549-b684-2b6d7fb1034d",
                                "name": "Total Components to be Assembled",
                                "alternate_name": "Total Components to be Assembled",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "2731505a-fbda-4cb0-a4cf-385ed5a9c9f1",
                                "name": "CPH",
                                "alternate_name": "CPH",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "79cf3bf1-58b3-4d67-a6be-2c092c650d9b",
                                "name": "Assy Time Per Lot (hr)",
                                "alternate_name": "Assy Time Per Lot (hr)",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "453d1549-86de-4673-9229-b3ce1fa68b3e",
                                "name": "Set up Time Per Lot (hr)",
                                "alternate_name": "Set up Time Per Lot (hr)",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "4a127877-b811-451b-9859-36399ad18b94",
                                "name": "SMT Manf Cost Per Unit",
                                "alternate_name": "SMT Manf Cost Per Unit",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "217069d1-a407-4835-839e-ad65ff2f40b7",
                                "name": "Manual Operations",
                                "alternate_name": "Manual Operations",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "d10a47df-b452-400f-9844-fb9087693a3d",
                                "name": "Wave & Selective Soldering",
                                "alternate_name": "Wave & Selective Soldering",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "3dd00ee8-dd63-4434-a823-f66f1e73a5c9",
                                "name": "Baking",
                                "alternate_name": "Baking",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "01a5fc17-1f46-4fc0-a6fd-1916810a9a75",
                                "name": "3D AXI",
                                "alternate_name": "3D AXI",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "1869ffd3-9c4f-455c-823d-2caa0e6a0301",
                                "name": "FCT",
                                "alternate_name": "FCT",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
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
                        "section_id": "693c3964-2f4c-4cfb-8cd8-08669e251e35",
                        "name": "Bid Management and Finance",
                        "alternate_name": "Bid Management and Finance",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "d13fe056-706f-4a58-9763-9598b4c20583",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
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
                                "section_item_id": "1a88aa9e-6a2c-4b9b-9315-99a5da38f68c",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
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
                                "section_item_id": "7930a623-bc40-490c-8ffb-ccfebb46a587",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
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
                                "section_item_id": "ce7ae0a4-c599-4b41-8c9b-623637abe8d5",
                                "name": "Final Quote Upload",
                                "alternate_name": "Final Quote Upload",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
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
                        "section_id": "e632828f-c429-4f60-987e-5859a80066f2",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "5261e8e1-53a4-4ae7-be92-d01548239b98",
                                "name": "Item Notes",
                                "alternate_name": "Item Notes",
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
                            }
                        ]
                    }
                ]
            },
            {
                "template_id": "29e9b67e-3fb5-495d-9b3e-128a7217391d",
                "type": "PROJECT",
                "name": "Project Template 01",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2025-12-30T07:25:57.728682Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-12-30T07:25:57.716693Z",
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
                        "section_id": "fb1ad200-c08a-4086-a989-29651084954b",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "a63c2b1d-fd23-4223-9b49-83a3c4fbadc3",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "e4ed6783-3aca-48d1-8aa9-47ad8f72d14d",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "5a788529-c529-45c5-9628-2bb07d30db53",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "b683e142-4b1a-4caf-ab21-15c935836a2e",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
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
                                "section_item_id": "e83373ae-9777-4397-afb3-06688394cc91",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "e8fb48ed-354a-47e3-8884-ff76ba48058e",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "b70d7b6b-e4ea-4a2e-b7a6-1d0c68a8332a",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "b9bb83d6-07cd-49a5-992a-feb653753aea",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                            }
                        ]
                    },
                    {
                        "section_id": "f15e555f-1d9f-439d-8af4-828c7947bb9d",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": []
                    },
                    {
                        "section_id": "09a615e8-7f02-4e1a-8b9d-7677c409ac72",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": []
                    }
                ]
            },
            {
                "template_id": "e09ea9e0-5cc0-42c7-ab57-28ba31894a55",
                "type": "PROJECT",
                "name": "SP TEST 24-12-2025",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2025-12-24T09:18:47.735096Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-12-24T09:18:47.727244Z",
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
                        "section_id": "46a65f54-1700-4478-acc9-b2487d78c7f9",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "df7a87ea-07b1-4f90-9742-e6dd0f046cff",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "8e105f84-0b7e-4043-8160-4db6c2be6544",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "7300c3b8-ed11-412a-8511-c1995d54f9c0",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "a0dce196-df28-4d4c-b928-8b52a69e5254",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
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
                                "section_item_id": "14c3c94d-fcce-4d90-9c79-b852df0e4391",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "fc27a9ea-c407-4963-977a-3bb0913739a1",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "37238f76-46a5-4a26-829f-9e2f25518e10",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "86b4ebfd-59f0-4e3f-9a23-4fba2ff85992",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                            }
                        ]
                    },
                    {
                        "section_id": "fb6297a2-893e-438a-a0ac-5bfe75075136",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "892c31cb-955b-420e-b3b6-3cce8baa28d7",
                                "name": "Scale Factor",
                                "alternate_name": "Scale Factor",
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
                            }
                        ]
                    },
                    {
                        "section_id": "cf95a33d-8ca9-4c9d-b3c4-887950458ef0",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "877e0b73-ec06-48ec-ac54-ff9e2330d853",
                                "name": "Manual Operations",
                                "alternate_name": "Manual Operations",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
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
                        "section_id": "73473a72-aa50-47ed-beb9-3f9f0562daea",
                        "name": "SP TEST 1",
                        "alternate_name": "SP TEST 1",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "0976d97d-9e63-48c9-be97-6bce758bda93",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "774dfa9d-d386-4904-94a7-35d944a27b1b",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "4393a641-1fe1-4eab-a0ee-0983f59858a2",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "538d14c4-34c5-41e6-8c1c-fbdea0ad8318",
                        "name": "SP TEST 2",
                        "alternate_name": "SP TEST 2",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "b4b5701f-0681-4cc0-9726-470dd74b52e4",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "c79ecb60-48d7-4740-be87-0cbcae6957c9",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "5fba3aa1-6359-4920-ba94-777d29c688b8",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "b9fbe482-f15c-4964-9307-70c8a98ec215",
                        "name": "SP TEST 3",
                        "alternate_name": "SP TEST 3",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "f46d605c-5a8e-49fb-86ed-90b3d3c223b8",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "25f6563b-8899-4000-b075-0b70c6543488",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "7b675af8-bb53-47a7-af88-2c2ed56f3bba",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "8d213b63-7adc-4054-909a-40f50a6a93b1",
                        "name": "SP TEST 4",
                        "alternate_name": "SP TEST 4",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "d789fb4d-fe14-4a4e-b00a-a46d0e64f26d",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "15953acc-ec71-44e6-afbb-add485c7a88e",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "9aad2f34-8b68-442b-ba86-527f45211ef5",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    }
                ]
            },
            {
                "template_id": "f19a32cb-82dc-4edf-ab2e-cff406b6b6db",
                "type": "PROJECT",
                "name": "KPI_testing",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2025-12-19T09:32:07.688085Z",
                "creator_name": "Kate - AT",
                "last_edited_on": "2025-12-19T09:32:07.680626Z",
                "entity_id": "47924a71-c523-4c7a-934d-f1f6ac543bbc",
                "entity_name": "FactWise Demo",
                "auto_reminders": {
                    "max_reminders": 4,
                    "reminder_interval": 24,
                    "is_remainder_required": true,
                    "initial_reminder_hours": 12
                },
                "linked_templates": {},
                "last_edited_by_name": "Kate - AT",
                "assigned_users": [],
                "section_list": [
                    {
                        "section_id": "4cfb1bad-c637-4185-aca8-d859dc7cc503",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "4ea092ef-f4f9-4b58-a322-4dcd3e227ffe",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "9535d319-da6b-4a27-8d8c-749e5aa2d5fa",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "57e23259-1bdb-437d-aa9b-094237278046",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "59ae0322-30ad-4adb-9fe0-b5a38ed1f940",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
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
                                "section_item_id": "8b1de4f6-7e18-478d-97d4-0658fad14a29",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "502fb641-132b-42b3-ba94-83b498193eaf",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "f92d3934-092d-4ff7-8d8f-65ac94063467",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "36b5eb9a-2df7-40e4-bbb7-b15787cd8f62",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                            }
                        ]
                    },
                    {
                        "section_id": "77b0e413-be92-4f4c-9de4-7bc5abab9f66",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "512804ef-ee54-43b8-88d6-ceb571fc91d2",
                                "name": "Earned value",
                                "alternate_name": "Earned value",
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
                                "section_item_id": "e5aedc62-c8b5-439e-8961-d84fa7e2767c",
                                "name": "Actual cost",
                                "alternate_name": "Actual cost",
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
                                "section_item_id": "473c6b99-a5d3-4bc0-9a13-59cec64e6958",
                                "name": "Actual material cost",
                                "alternate_name": "Actual material cost",
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
                                "section_item_id": "3b57f70d-b155-4a99-98b0-d86f4bd48c4c",
                                "name": "Planned material cost",
                                "alternate_name": "Planned material cost",
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
                                "section_item_id": "22ee5c29-4528-497c-9a6f-619c1aef9648",
                                "name": "Actual unit price",
                                "alternate_name": "Actual unit price",
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
                                "section_item_id": "d14bd0c1-cd27-48c3-951d-70d536176099",
                                "name": "Standard Unit price",
                                "alternate_name": "Standard Unit price",
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
                                "section_item_id": "a248234c-8e35-400b-9363-943bc6be26b5",
                                "name": "Quantity purchased",
                                "alternate_name": "Quantity purchased",
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
                                "section_item_id": "4d450d56-5fdf-4338-bd42-810b219b55a5",
                                "name": "On Time Deliveries",
                                "alternate_name": "On Time Deliveries",
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
                                "section_item_id": "a78db993-8558-414f-88d3-e15732dfc9ea",
                                "name": "Total Deliveries",
                                "alternate_name": "Total Deliveries",
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
                                "section_item_id": "096cfa36-06b2-4f9b-85fc-87914e419e2a",
                                "name": "CPI",
                                "alternate_name": "CPI",
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
                                "section_item_id": "91c5ad7f-06dc-40b6-8f96-7c032cceb265",
                                "name": "SPI",
                                "alternate_name": "SPI",
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
                                "section_item_id": "37130d8d-db5c-49b6-aeac-8aa1155a8a79",
                                "name": "Weight CPI",
                                "alternate_name": "Weight CPI",
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
                                "section_item_id": "9446208b-8ae0-478c-a4cd-3ac929ac44ec",
                                "name": "Weight SPI",
                                "alternate_name": "Weight SPI",
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
                                "section_item_id": "6d376404-1286-4896-9163-6f5b74413cfc",
                                "name": "Risk probability",
                                "alternate_name": "Risk probability",
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
                                "section_item_id": "1ff19dcb-7de1-4d3d-b850-2a07371a935d",
                                "name": "Risk Impact Cost",
                                "alternate_name": "Risk Impact Cost",
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
                                "section_item_id": "4d905a5e-60eb-4762-a195-557c3e326d77",
                                "name": "Scrap cost",
                                "alternate_name": "Scrap cost",
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
                                "section_item_id": "3917a1c8-a8c6-479f-9307-903bf58effac",
                                "name": "Warranty cost",
                                "alternate_name": "Warranty cost",
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
                                "section_item_id": "b8d17416-61d5-46b8-a48e-23be6dbcadd2",
                                "name": "Benchmark Unit price",
                                "alternate_name": "Benchmark Unit price",
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
                                "section_item_id": "bab77ad5-b6c4-47d2-9c88-623b395f9609",
                                "name": "operating time",
                                "alternate_name": "operating time",
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
                                "section_item_id": "4fc7e971-98d5-4042-8229-50352989e565",
                                "name": "Planned production time",
                                "alternate_name": "Planned production time",
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
                                "section_item_id": "d9c8762e-c25c-4989-9a7c-638dba9c0b36",
                                "name": "Actual output units",
                                "alternate_name": "Actual output units",
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
                                "section_item_id": "62cb1c64-e010-421e-b9f6-49665b1dede3",
                                "name": "Ideal output units",
                                "alternate_name": "Ideal output units",
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
                                "section_item_id": "febd3746-56a9-45d8-91fa-8fd4e9634c6e",
                                "name": "Rework cost",
                                "alternate_name": "Rework cost",
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
                                "section_item_id": "a1cd278a-b147-4876-858c-a5607c1a7279",
                                "name": "Good units",
                                "alternate_name": "Good units",
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
                                "section_item_id": "16322dba-6dae-42f3-8e51-e4c0db9fd9a8",
                                "name": "Total Units produced",
                                "alternate_name": "Total Units produced",
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
                                "section_item_id": "591e7a1a-72d6-4784-b808-dc1e2d697338",
                                "name": "Total change orders",
                                "alternate_name": "Total change orders",
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
                                "section_item_id": "5d873b9f-73ca-483a-adf3-b3c86bedc9cd",
                                "name": "Project duration months",
                                "alternate_name": "Project duration months",
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
                                "section_item_id": "8de0987a-f640-4148-9866-e4a6713d05c5",
                                "name": "Rejected units",
                                "alternate_name": "Rejected units",
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
                                "section_item_id": "d8f189e2-8e9c-4a2e-baaf-7be3218b9b0a",
                                "name": "Total units Received",
                                "alternate_name": "Total units Received",
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
                                "section_item_id": "240ec83c-8b45-4a96-835f-3de770b8ff0f",
                                "name": "Scale Factor",
                                "alternate_name": "Scale Factor",
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
                                "section_item_id": "0894e21e-505f-4b43-a6be-9e2178364905",
                                "name": "Is Compliant",
                                "alternate_name": "Is Compliant",
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
                                "section_item_id": "aa9cb4a9-4291-4d2b-928c-3bc800985f49",
                                "name": "Audit Checkpoint id",
                                "alternate_name": "Audit Checkpoint id",
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
                                "section_item_id": "56f48bf8-abf2-42e6-84d6-50c229afabb8",
                                "name": "Planned Value",
                                "alternate_name": "Planned Value",
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
                            }
                        ]
                    },
                    {
                        "section_id": "6e3df558-ee6c-4729-bbcd-c9f18b3ba136",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": []
                    }
                ]
            },
            {
                "template_id": "1c5c8ec8-c1af-4e4e-a71a-d55c945e31d3",
                "type": "PROJECT",
                "name": "DR - project template",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2025-12-19T09:12:35.701860Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-12-19T09:12:35.692198Z",
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
                        "section_id": "f4b64f7f-4c5e-4ef0-bef1-3b98b8cf2510",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "aba6e451-3da5-48d6-bb59-544c0c5cd93d",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "7bf56fa0-cb42-4acd-883a-8ac8255bae8a",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "66b3741d-915d-417d-902d-4fffb54c74b0",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "e227a939-80d1-44d0-839a-79954aabfca9",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
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
                                "section_item_id": "1db95c6a-9254-4246-84bd-97c899964e62",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "0cd30ba2-58df-43d1-bc8a-38d6c03d3e30",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "bbe28fda-757a-4a94-91a8-bf231ee3e5ca",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "06c5536d-2b99-4ed3-8d83-7dbb07b2c8a8",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                            }
                        ]
                    },
                    {
                        "section_id": "ab81feac-3e8b-4832-a3d6-9f9f10be6f46",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": []
                    },
                    {
                        "section_id": "24629561-e272-4491-9747-65abf3948e1e",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": []
                    },
                    {
                        "section_id": "a42f9537-1f64-4342-85e5-a400e2273820",
                        "name": "DR section 1",
                        "alternate_name": "DR section 1",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "710fa648-edeb-4c05-b650-e6f21397112f",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "277ac70d-fcdc-4e61-a6bd-3898878e6025",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "491c1a56-f55d-4d18-9eec-7924566709e1",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "874ea522-abf0-4005-9204-6d5b84fc197f",
                        "name": "test_section",
                        "alternate_name": "test_section",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "b463209f-fc4f-4232-8bcb-727e7f48f65d",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "300e781a-70f6-40a1-93dd-1b517f3953b8",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
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
                                "section_item_id": "5d78e34c-000a-417d-9cff-a305655fdbb5",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "5cf9906a-4d6f-4d89-a418-01f1ad7f4551",
                                "name": "Is compliant",
                                "alternate_name": "Is compliant",
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
                            }
                        ]
                    }
                ]
            },
            {
                "template_id": "14fad31a-77eb-4c41-9a45-2674a95b1649",
                "type": "PROJECT",
                "name": "SG NA Test (28-01-24) (MB - NA)",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2025-12-15T06:03:24.363859Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-12-15T06:03:24.356208Z",
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
                        "section_id": "99ebfd00-9ac2-4603-b528-406584f40c9d",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": []
                    },
                    {
                        "section_id": "9e04ec1c-4fa0-4e4d-91b8-cf01750f5857",
                        "name": "BOM Details",
                        "alternate_name": "BOM Details",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": []
                    },
                    {
                        "section_id": "0b96f782-482a-4a54-8022-c3e41f277d6a",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "b7c6196f-1f89-4f81-81e5-5969c25c011e",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 1,
                                    "max_limit": 1000,
                                    "type": "LongTextField"
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
                                "section_item_id": "c44e7ceb-3fab-4a7c-945d-63a287507945",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "f208a583-e807-48d8-8b26-8d4206ce393c",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "15979b0c-55a4-47b7-b5e9-c7131f5a0c02",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "f5bce101-12c0-4217-9e3c-7b2a29080f4b",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "42852e71-b143-4d1c-b648-a30918615a5e",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "14746785-8664-4e54-b90d-ae8fae68fa07",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "d5a7ce89-f546-4427-aa79-55658e86fbe7",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                                "section_item_id": "fa0c512e-6f26-400d-8a44-3ebfd0c39c86",
                                "name": "checkbox 1",
                                "alternate_name": "checkbox 1",
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
                                "section_item_id": "87dd01b5-5ccb-45fb-a5cd-19c482e6d7fd",
                                "name": "Select 1",
                                "alternate_name": "Select 1",
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
                        "section_id": "08e73413-43ee-464b-a700-14777253c64d",
                        "name": "Custom Section",
                        "alternate_name": "Custom Section",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "fc9b95b9-f8b9-42d1-b1f2-dc4df4f8b295",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "5161c657-7e0b-4336-87e9-64f40d6f2c48",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "dc687831-4427-4cfa-8a89-c5539d3ff4cd",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "51631f4b-d4b4-4ee5-86f6-466f669c13a0",
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
                                "section_item_id": "00865156-1bb8-49ad-a9f6-69eb93600f10",
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
                            }
                        ]
                    }
                ]
            },
            {
                "template_id": "0d8c5eef-a77c-4fcb-a65a-93c617709b79",
                "type": "PROJECT",
                "name": "Amaan Test 12 Nov 2025",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2025-12-12T14:17:19.742788Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-12-12T14:17:19.725753Z",
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
                        "section_id": "5c56d81e-7f68-4704-a31e-140ae48362ac",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "69e00cc0-56ed-41ca-993e-2cbcd40dbc23",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "7a54051c-664b-431b-9ee4-f2d59ba426ef",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "f56de1f1-f004-439d-9240-1e3ec593466f",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "5b63beb6-7b67-436a-a188-09d994cbf7d6",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
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
                                "section_item_id": "b13df49c-3de6-4885-affa-1e722b4f66c2",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "5f2c96f8-2dbd-4527-9717-1c7f78195e21",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "367017f8-6821-4e6c-a304-8404f5921cec",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "8000f6b1-beac-4bd9-a4be-848572c3067b",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                                "section_item_id": "72372562-6878-4c20-8d3f-d6bed754326d",
                                "name": "Date of Assignment",
                                "alternate_name": "Date of Assignment",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                        "section_id": "ebd21b47-d97d-4316-9fe2-f54ef4cb3216",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "f1043ea0-f82f-4d1c-b208-9bff837e9f7a",
                                "name": "Custom 3",
                                "alternate_name": "Custom 3",
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
                            }
                        ]
                    },
                    {
                        "section_id": "8e378ce5-8918-4c3c-a3a4-565ed3b52f9c",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": []
                    }
                ]
            },
            {
                "template_id": "148c31d4-8262-4ce0-8980-4fc6092973dd",
                "type": "PROJECT",
                "name": "JOY_TEST",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2025-12-12T13:14:22.571798Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-12-12T13:14:22.550737Z",
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
                        "section_id": "f5bb543b-5676-4b2f-983a-0e6a25124781",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": []
                    },
                    {
                        "section_id": "4022c180-398d-41d0-8294-af8955fed057",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "d52fb4b2-777a-4344-8d80-ce054bfd6eea",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "1de473a2-10b3-46eb-a1e5-ab6f0add33d7",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "62e1cc84-a957-4aa3-b94b-7eebd6776d92",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "ca55766c-6c8c-4f68-a0e4-5744573b8329",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
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
                                "section_item_id": "94bf8923-de75-4fa6-a287-47e406bbd9a6",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "5f10aebe-05eb-4042-af2c-e8a4bfcd32a0",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "152064fb-7276-4760-94df-8588ea7945b0",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "c8a1ccbb-65ce-4b84-97fd-43b3f026e4bf",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                            }
                        ]
                    },
                    {
                        "section_id": "46613b09-a571-4bce-b4bf-d5cfa8a93158",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": []
                    },
                    {
                        "section_id": "de7f627a-3506-4f9b-8bec-037ec971a543",
                        "name": "JT1",
                        "alternate_name": "JT1",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "92805853-9364-4f49-b9f2-d27c84f658b0",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "075b1fa1-597b-430c-bba4-480bec36406e",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "536a72b3-0e90-4b3e-837d-0f3d1f3c0ded",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "769ddd36-341d-4dbe-8e74-246e4bd41bfd",
                        "name": "JT2",
                        "alternate_name": "JT2",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "634cd00c-112b-4b70-a6e4-ea0a8335c236",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "06bc22eb-5083-4913-8a6e-8c27655f9454",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "3d58dba7-2c6b-492b-a1d0-cb3cdc4f36d3",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "f7e6b9d7-7715-4358-b34e-aa52ee5360b3",
                        "name": "JT3",
                        "alternate_name": "JT3",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "4a44809d-cda8-4e04-81b8-933b13a63b81",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "4a5feb8d-7eb8-4e76-979a-ac9ddf4b1ae3",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "6cdc4709-84fd-4b75-838f-657c28494bc3",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "b769c2db-85f7-401f-ac47-cf4cc2a500c1",
                        "name": "JT4",
                        "alternate_name": "JT4",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "361d58e2-e0d5-4a50-a2c1-0e75a98f6fcf",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "fc786a46-bbd4-4456-a61f-f8952805cff2",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "0e802651-bcc0-428a-b351-381312037b5d",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "b7eff5c4-603d-4132-8d31-ef2177c06db1",
                        "name": "JT5",
                        "alternate_name": "JT5",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "710ffd08-4cca-447e-9833-0b6e9f0d73b3",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "d3dfd021-2d8c-483c-a6a8-3ab72b7fda20",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "aac5a4af-841d-451e-a60c-7b9397216f73",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    }
                ]
            },
            {
                "template_id": "8fa9fee7-612f-46cf-b506-5ee78c3cb330",
                "type": "PROJECT",
                "name": "Complex Test React Flow",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2025-12-09T05:40:54.677344Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-12-09T05:40:54.664778Z",
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
                        "section_id": "70036977-25ed-462b-8742-b1f02073f942",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "7f60f727-b1df-4bf9-9f57-66906d635d34",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "3245d983-25cf-4668-96a1-b247011e33e8",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "f1db18cc-42d0-4dd6-8b2b-3f492e6eb221",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "36dc0672-1f6a-45fd-af75-6f1f4c295408",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
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
                                "section_item_id": "10d453f2-77ec-483d-9684-63efb6c4628f",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "21ea6506-7629-4354-bf7c-f7bfa44d44ad",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "4b60874f-c816-4da6-a203-5d18f522f337",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "a0a91989-9cf2-4e71-9ba9-2240c6505779",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                            }
                        ]
                    },
                    {
                        "section_id": "cd901a35-32e2-4ae9-bd99-1218bbb3fd5a",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": []
                    },
                    {
                        "section_id": "a6a317d3-2ee0-4b56-b167-3dd91455fa67",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": []
                    },
                    {
                        "section_id": "1fb54d5a-0a1c-4130-abb3-c269322d10b2",
                        "name": "KT TEST 1",
                        "alternate_name": "KT TEST 1",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "90270492-a3f1-4b8e-816f-a250d958e3cc",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "9b3989e9-bf93-47dc-9fa6-62cbe8572eb2",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "250e1a63-7103-4c69-b5dd-aef43904b719",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "80951dd6-3fb7-423f-89b1-06671fd73f72",
                        "name": "KT TEST 2",
                        "alternate_name": "KT TEST 2",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "7b2acad2-a6c6-42ee-aada-b0cd5443e2c9",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "75c9895e-8e06-4199-8cca-730a1b02a6c6",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "62150d5d-dca1-43c8-9897-d21f33dcbd5f",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "1b5c6baf-03c0-46f8-a78f-8bc80e54aadb",
                        "name": "KT TEST 3",
                        "alternate_name": "KT TEST 3",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "10402273-8960-4dcc-951e-6318a085617a",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "2fdc8689-dc92-4a39-a7ef-b6eb1762a74d",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "ee935197-3d60-4feb-9d20-570d37b1f8e3",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "39b98f25-6095-425d-8222-50de95858bff",
                        "name": "KT TEST 4",
                        "alternate_name": "KT TEST 4",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "bf24fde7-caf4-47b5-98f6-a1fc6b04a848",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "8cf8aaea-bef6-4082-a031-f9e334a9ea6f",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "6bb1cde3-e74c-40ac-ba00-af003936af96",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "e222fe1f-b140-4640-b06e-1506cb654ce7",
                        "name": "KT TEST 5",
                        "alternate_name": "KT TEST 5",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "1be52795-f40c-485b-8131-fc00c5e42018",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "28c1cd4e-34db-4f8a-87d9-513b6affe789",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "7b039672-62be-413a-b371-018c3b3a93a6",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    }
                ]
            },
            {
                "template_id": "9e0305a4-ac62-4bde-a627-30e947b4d0f9",
                "type": "PROJECT",
                "name": "new project template 271125",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2025-12-05T13:12:16.051442Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-12-05T13:12:16.041792Z",
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
                        "section_id": "a0a16b5c-4f79-4ecb-bf1a-a2012adc895e",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "76b4d1dc-ba54-455d-8359-5389693b9c6c",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "bfd245ab-3765-442d-a0a7-d631ace65bf2",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "ecd1313e-d65e-4489-947d-bcdff8784bac",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "981c3e60-45d9-47d4-8331-4b2fb4592e62",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
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
                                "section_item_id": "8663ddbf-f19f-4d8c-bbe0-a680f96d10de",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "82a11790-487b-4676-b110-7bae347d3147",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "afd8d8c4-c38a-4f0e-b2e7-40389f432c18",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "86f6c9de-a600-43eb-92c0-6c73de14925f",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                                "section_item_id": "65f13a4f-36a5-48ee-a19b-d1ba837330a3",
                                "name": "Date of Assignment",
                                "alternate_name": "Date of Assignment",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "8416d5aa-ca9f-4e94-a106-9f89258d2f15",
                                "name": "Start",
                                "alternate_name": "Start",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "277fb44e-5ebd-4459-bb12-5896c7aebddf",
                                "name": "hi",
                                "alternate_name": "hi",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                        "section_id": "751ad512-fed4-48e9-9ab2-dc0b765f60d8",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "300862a1-8de0-441c-a6de-dc9593ce6ea2",
                                "name": "CF ITEM - Short text",
                                "alternate_name": "CF ITEM - Short text",
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
                            }
                        ]
                    },
                    {
                        "section_id": "7ceac68f-2fa4-483a-8c6c-e91aabf1bbd6",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "8bf064c7-79ee-4738-9c90-97e0255a6351",
                                "name": "CF BOM - Short text",
                                "alternate_name": "CF BOM - Short text",
                                "constraints": {
                                    "field_type": "SHORTTEXT",
                                    "min_limit": 0,
                                    "max_limit": 15,
                                    "type": "ShortTextField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
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
                "template_id": "54ebbb6b-439d-4c93-a5fc-6b7d13454ad2",
                "type": "PROJECT",
                "name": "AT Test 4-12-2025",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2025-12-04T09:07:47.668413Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-12-04T09:07:47.659862Z",
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
                        "section_id": "c5cd525d-09a2-45c9-b7fe-f7cc72ca4c92",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "86d82565-e5dc-4abf-ab27-349bc1979f4a",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "5676d88d-766f-4a7a-8655-d723d02d7095",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "efcb3d9b-05d3-4266-bf5f-a04b5926797b",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "c6ecf5d0-5f7f-48f4-a9aa-bbdc5d348852",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
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
                                "section_item_id": "f4b3c627-239b-44b1-a8b8-31ef5ce41c09",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "77fc587a-43b0-49ea-a070-f349ee391c83",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "232b5593-761a-4a12-8743-138380b51b7f",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "243c92d5-de9f-44b3-bbcb-ab7c035194e7",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                            }
                        ]
                    },
                    {
                        "section_id": "f07fbb33-838d-40fd-8914-c938e53c1081",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "7315afd1-a1a4-4d64-929e-b05105e0f536",
                                "name": "Date time - item",
                                "alternate_name": "Date time - item",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                        "section_id": "3dc810d7-0124-4be3-ae72-03588ef5f34e",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": []
                    }
                ]
            },
            {
                "template_id": "802eb67f-4158-4f05-965d-4985c37c3ab4",
                "type": "PROJECT",
                "name": "Template BOM Test",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2025-12-02T07:18:51.087429Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-12-02T07:18:51.078975Z",
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
                        "section_id": "974277a6-04a6-4eda-bfcd-c42741c9f75b",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "44984146-b8a1-47dc-9214-47a2fb96cf5c",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "ff61408d-b340-4fa1-87c8-36e46fdc5908",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "5219f01a-0d33-4b09-b6a4-fbe8094c388c",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "051bf858-8af4-496a-93ee-7c85a0802897",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
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
                                "section_item_id": "c31d4c8b-37af-4c6d-a58f-93c1a96cc53b",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "34a978ee-c91d-45ed-88fd-c839b8e57216",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "e7ae21a0-1d19-45f8-9423-55d94438c1f4",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "bad87744-f693-4ffe-935b-fa9c975f5221",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                                "section_item_id": "b509b7f6-ca23-414c-99ee-c65efd7d8afe",
                                "name": "CF - Date",
                                "alternate_name": "CF - Date",
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
                                "section_item_id": "3fb7f3e2-4969-47d2-b9b0-584d2c2f9a77",
                                "name": "CF - Long text",
                                "alternate_name": "CF - Long text",
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
                            }
                        ]
                    },
                    {
                        "section_id": "3141c4e7-9875-41ed-89a8-e45e682a59a1",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": []
                    },
                    {
                        "section_id": "3a931130-3d76-4b07-b03a-22f2e9800c8e",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": []
                    }
                ]
            },
            {
                "template_id": "eeaa1f70-ba3c-4718-a6a8-ff8f2446643f",
                "type": "PROJECT",
                "name": "ProjectTemplate",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2025-12-01T13:06:16.240694Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-12-01T13:06:16.231784Z",
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
                        "section_id": "2ddc1d15-97a7-49d2-ac5b-b00f6cbf5e80",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "4182b008-df02-4041-8044-81568f03c678",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "05a516f6-a3b3-45e8-8a34-48d029a4d753",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "fcebacd7-cc74-49b3-8a30-b3d231e5c46f",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "fb1f806e-37cf-4944-965c-183bb7217d98",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
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
                                "section_item_id": "652de78f-1ee7-48e0-aac2-3fc39d324b43",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "6c8c2520-5c07-4ca3-a88d-7e36e573f411",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "ce841236-a7d2-42ae-9a7f-9b664ea31696",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "ba6d7524-86b1-449b-928b-a478ed4f99f2",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                            }
                        ]
                    },
                    {
                        "section_id": "910776d8-0fa1-4343-97e7-2633300eb2c3",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": []
                    },
                    {
                        "section_id": "d97755f6-8b09-4b7e-ab25-ccc0a6a4e482",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": []
                    }
                ]
            },
            {
                "template_id": "a6ca42d1-dfef-49a4-8813-257cbfc85e94",
                "type": "PROJECT",
                "name": "RAJU TEST clone-A",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2025-11-25T08:13:49.163469Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-11-25T08:13:49.151553Z",
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
                        "section_id": "4159601d-584c-4046-90ab-2a717f2428ec",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "01e8e927-05db-4c16-9e2d-22b19cad2b43",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "b17f1e08-5f2e-4c54-954f-006e26141249",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "7988139c-d82b-43e7-b76a-9c93ab5e93a6",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "50be7a10-893a-475f-a222-846fbd08a7c7",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
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
                                "section_item_id": "03920717-6fcd-447c-afd8-8ed79e4dc008",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "e6182f16-5b88-4552-bdd7-2dcfb22f702b",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "2cc4a08b-64a2-4985-8d66-307799cc5eb3",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "097702ba-93c8-4033-b098-a060139996da",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                            }
                        ]
                    },
                    {
                        "section_id": "a7c8b070-140f-4510-9eb4-6026c040cba9",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": []
                    },
                    {
                        "section_id": "d6c0a03c-1ee8-4c28-9276-fffa949cceac",
                        "name": "RJT1",
                        "alternate_name": "RJT1",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "153cabc6-93b8-4b85-8611-d35437193c0a",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "b32d0aa6-26af-4dd0-bd33-2353bba803e5",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "18299aa3-7a40-4817-ae9e-577ef92b29a9",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "c1de8ae9-4ae6-4d3d-b61b-4e7c2b43a6b0",
                        "name": "RJT2",
                        "alternate_name": "RJT2",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "e630daf2-e2c9-4958-99af-1519de35722c",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "c152d69b-7bbc-4fe6-8eb6-ce64c8cda599",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "51a24068-b9c9-4e6c-ae8d-b1a681cc2ac9",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "c36ff897-5b0c-4290-94e1-2093e61ae494",
                        "name": "RJT3",
                        "alternate_name": "RJT3",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "61ca8248-6ed6-43f2-a62e-2888ae3cb73d",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "f9e3ddd3-1b4d-4e6d-91ba-f0555c3cd46a",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "4ff3c009-490e-434f-a5fe-fedc17869c58",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "1a503fc5-2309-4c67-b669-aed9d31c2e78",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "4e2a3844-3365-405d-b832-14fadae91faf",
                                "name": "Currency - bom",
                                "alternate_name": "Currency - bom",
                                "constraints": {
                                    "field_type": "CURRENCY",
                                    "type": "CurrencyField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "6004fc3b-29a2-4406-876b-27b244277c5d",
                                "name": "Attachment - bom",
                                "alternate_name": "Attachment - bom",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
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
                        "section_id": "3a1f6dd3-4779-44f0-93d6-d1408fc3cff9",
                        "name": "RJT4",
                        "alternate_name": "RJT4",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "b09cef65-ff1f-4ae2-a637-e684ab12553b",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "ff8e5e9a-99f2-4226-8618-065cfe65e907",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "d012443c-ca1e-4ba6-9d2b-2c52b69e9541",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    }
                ]
            },
            {
                "template_id": "e1588813-c935-45aa-8754-0b7fce8be480",
                "type": "PROJECT",
                "name": "Amaan Test 03-11-2025",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2025-11-11T14:38:50.039929Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-11-11T14:38:50.028737Z",
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
                        "section_id": "20e6a2c1-cdb2-4711-be13-65debe0dc66b",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [
                            {
                                "user_id": "d7d8ca27-edb6-402f-8147-3f8e8327a664",
                                "permission": "ASSIGN"
                            },
                            {
                                "user_id": "d7d8ca27-edb6-402f-8147-3f8e8327a664",
                                "permission": "EDIT"
                            },
                            {
                                "user_id": "d7d8ca27-edb6-402f-8147-3f8e8327a664",
                                "permission": "VIEW"
                            }
                        ],
                        "section_items": [
                            {
                                "section_item_id": "78c62754-ce72-4098-901b-c1722fc87c2d",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "6e3974b3-41c2-4240-80eb-aa348321670d",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "a8d03e4c-dcdb-4b85-a689-310af48e034f",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "5a19a763-88b8-4203-891f-f9305f37460e",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
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
                                "section_item_id": "a651aa52-cc43-487a-b03c-49a3de9fafd4",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "db963a23-08ad-4707-b1e4-2ddaf7f6be09",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "ec6ccfc1-1e14-4257-b142-09b7a1fee451",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "66f2437d-ca33-4d48-88bb-6a4fe3b99b5e",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                            }
                        ]
                    },
                    {
                        "section_id": "0c61819e-2b71-4f3e-ba03-d69094cddb48",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms ABC",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "4b90eac3-77e9-4fff-8680-4d0b4585e805",
                                "name": "Attachment - item",
                                "alternate_name": "Attachment - item",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
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
                                "section_item_id": "3f7967d1-c2e6-4262-bde4-681eaf67216c",
                                "name": "Date time - item",
                                "alternate_name": "Date time - item",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "0d885298-3a6f-4378-a441-c7aac6b9558b",
                                "name": "Percentage of BOM cost",
                                "alternate_name": "Percentage of BOM cost",
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
                                "section_item_id": "ba0e384b-dffe-42a6-9e44-108685476d3d",
                                "name": "Item Notes",
                                "alternate_name": "Item Notes",
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
                            }
                        ]
                    },
                    {
                        "section_id": "6f417bee-8abf-478d-b26f-b4c62bd022e2",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "1f9f45ff-24f3-4e0c-92f5-d54947cd872b",
                                "name": "Multi-select 2",
                                "alternate_name": "Multi-select 2",
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
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "376fd64d-e76e-48ca-8a9f-edc428827d8d",
                                "name": "Checkbox - bom",
                                "alternate_name": "Checkbox - bom",
                                "constraints": {
                                    "field_type": "BOOLEAN",
                                    "type": "BooleanField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "f0dfbe5f-8f99-403b-a050-14e78250adc1",
                                "name": "Date - bom",
                                "alternate_name": "Date - bom",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "649bf2cd-d07e-454a-a85c-77b69afb8e77",
                                "name": "INR RATE",
                                "alternate_name": "INR RATE",
                                "constraints": {
                                    "field_type": "CURRENCY",
                                    "type": "CurrencyField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "76eb9239-fd43-45bc-ba37-b2fa3991d809",
                                "name": "BOM notes",
                                "alternate_name": "BOM notes",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 0,
                                    "max_limit": 120,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
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
                        "section_id": "ce16f476-61f8-4090-a773-0c96980af7b1",
                        "name": "IDKMAN",
                        "alternate_name": "IDKMAN (DEPN ON PROJECT DETAILS))",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "c74c0a2f-cf41-4c71-b2b6-4424f5327bf4",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "98bb8f26-2ed3-403d-b552-4da5ebf5d083",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "b59ab170-1f84-4053-975d-e10b3e69eeef",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "3a44395b-c815-4770-894f-3366a36886a2",
                        "name": "FACTMAN",
                        "alternate_name": "FACTMAN",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "e1790566-cec3-41da-9d59-8564eeb5e52a",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "6d931bd7-505f-466c-aa2c-3751ba5fef99",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "ff1ea68c-7df8-4296-9893-8332532fc75f",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "106d9292-6e83-4358-866d-68e98b48e9e9",
                        "name": "KAMAAN",
                        "alternate_name": "KAMAAN",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "7e4ca450-1455-45dd-87db-6189d7749a4c",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "f73a7bb0-a1cb-4524-ba35-3fc2ad406351",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "102b6b51-28cb-43b1-8bb4-64b58f2531d2",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "61b036a9-ef12-4a76-8e41-e061ff50bc1e",
                        "name": "COWMOO (DEPN ON KAMAAN)",
                        "alternate_name": "COWMOO (DEPN ON KAMAAN)",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "31ad7583-6f34-49a3-85e3-20cbd2a8dac2",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "f595cc55-4a13-48c9-8360-6d5774d7e418",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "41de82cf-213e-4eca-bc89-81b0fc9dbc30",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    }
                ]
            },
            {
                "template_id": "95c750e0-a83e-42be-b468-f9c636918f89",
                "type": "PROJECT",
                "name": "Project All fields template",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2025-11-04T10:12:42.548969Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-11-04T10:12:42.537592Z",
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
                        "section_id": "3f935703-f961-45b8-ba68-3f180c96e9e0",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "6fbe3de7-1c5b-4ee3-9cf8-c06dbcd7b28f",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "3e850931-e6c0-4a0c-8c89-6908546e5420",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "d8f075db-cb65-41fa-bcf2-851cc53763cc",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "546692e9-83a8-4a8b-9e59-06e80fe0ea61",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
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
                                "section_item_id": "3e41cfc9-55fc-4a5e-a2db-37fb61221534",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "46c43233-d756-44c3-9f9d-779a27cdf7f4",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "197e1ec2-e899-4c71-b17d-09e915b51112",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "8a7d9251-2138-42c1-9675-4d3bb183cc07",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                                "section_item_id": "b6cb8db7-d946-44ce-8f2b-5caab095858b",
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
                            },
                            {
                                "section_item_id": "9006187a-198a-4294-afef-422f8dd18ab0",
                                "name": "Short text 1",
                                "alternate_name": "Short text 1",
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
                                "section_item_id": "69501c7d-fd10-4876-8e48-34092434cf39",
                                "name": "Multi-select 1",
                                "alternate_name": "Multi-select 1",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "option 1",
                                        "option 2",
                                        "option 3"
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
                                "section_item_id": "448e5334-c9ef-4880-a5b0-7ca320442e4b",
                                "name": "Number 1",
                                "alternate_name": "Number 1",
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
                            },
                            {
                                "section_item_id": "4f268234-5b02-4e7a-bcbe-b7f1eb0eab87",
                                "name": "Long text 1",
                                "alternate_name": "Long text 1",
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
                                "section_item_id": "7e84a515-4984-4754-b1e4-91eb9d0a4309",
                                "name": "Boolean",
                                "alternate_name": "Boolean",
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
                                "section_item_id": "2c80c7be-d4fe-4584-b219-2896c48c7f79",
                                "name": "Date time",
                                "alternate_name": "Date time",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "1001f800-57f0-4b9a-956e-8be58dafa7fa",
                                "name": "date 1",
                                "alternate_name": "date 1",
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
                                "section_item_id": "5b0eb3ac-b388-4662-88a9-772230a7e023",
                                "name": "Currency",
                                "alternate_name": "Currency",
                                "constraints": {
                                    "field_type": "CURRENCY",
                                    "type": "CurrencyField"
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
                                "section_item_id": "f68242c8-1dd1-4ccd-8647-b93dea83a991",
                                "name": "Attachment",
                                "alternate_name": "Attachment",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
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
                        "section_id": "a8d0bc7b-f14b-4299-a947-683a9c9ce866",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "f1212c8e-e065-4b30-8170-b33c58e9deea",
                                "name": "Long text",
                                "alternate_name": "Long text",
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
                                "section_item_id": "ea0e4aa5-c78c-4fae-bf55-e15d47eeae30",
                                "name": "Number",
                                "alternate_name": "Number",
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
                                "section_item_id": "59d3ddd9-8e62-4f7c-872c-fa86281b1c1b",
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
                                "section_item_id": "b02ec2cc-1d8f-498c-ac44-3b2d0b59c7b8",
                                "name": "Date",
                                "alternate_name": "Date",
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
                                "section_item_id": "944566f6-9d4a-40a6-87d5-4a56f44b97ea",
                                "name": "Multi-select",
                                "alternate_name": "Multi-select",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Option 1",
                                        "Option 2",
                                        "Option 3"
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
                                "section_item_id": "8098af46-2561-4eb5-b7ed-664358193e6c",
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
                            },
                            {
                                "section_item_id": "17536112-1210-477d-a250-a0b224091f29",
                                "name": "Short text",
                                "alternate_name": "Short text",
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
                                "section_item_id": "297c790c-557e-4326-b83c-8e389712577e",
                                "name": "Date time - item",
                                "alternate_name": "Date time - item",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                        "section_id": "539489a3-41ef-40a3-921f-4be91ba27561",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "c71fab4b-ef1d-4e3d-b221-436a1eda28a6",
                                "name": "Short text - bom",
                                "alternate_name": "Short text - bom",
                                "constraints": {
                                    "field_type": "SHORTTEXT",
                                    "min_limit": 0,
                                    "max_limit": 15,
                                    "type": "ShortTextField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "9108efba-cb1b-451a-a0e8-21af3706c7a4",
                                "name": "Long text - bom",
                                "alternate_name": "Long text - bom",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 0,
                                    "max_limit": 120,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "6a327302-a059-41ef-9e13-91a11565f880",
                                "name": "Number - bom",
                                "alternate_name": "Number - bom",
                                "constraints": {
                                    "field_type": "FLOAT",
                                    "min_limit": 0.0,
                                    "max_limit": 1000000000.0,
                                    "decimal_places": 10,
                                    "type": "DecimalField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "def9f73c-dc37-431f-801c-dbfd7540613b",
                                "name": "Date - bom",
                                "alternate_name": "Date - bom",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "dbb374c5-c369-4bf3-8043-bbbdae823351",
                                "name": "Date time - bom",
                                "alternate_name": "Date time - bom",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "e548ea90-0e92-473c-b372-a9b4331df361",
                                "name": "Checkbox - bom",
                                "alternate_name": "Checkbox - bom",
                                "constraints": {
                                    "field_type": "BOOLEAN",
                                    "type": "BooleanField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "e485d932-1a54-4811-97b8-b5e543727c7f",
                                "name": "Select - bom",
                                "alternate_name": "Select - bom",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Main",
                                        "Sub",
                                        "Sub Sub",
                                        "Sub Sub Sub"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "fcffd906-fd81-41e6-8c29-f05578a463d9",
                                "name": "Multi-select - bom",
                                "alternate_name": "Multi-select - bom",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Main",
                                        "Sub",
                                        "SubSub",
                                        "SubSubSub"
                                    ],
                                    "choice_type": "MULTI_SELECT",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "1f824c27-2d29-41f5-bbf7-58bac9741e50",
                                "name": "Currency - bom",
                                "alternate_name": "Currency - bom",
                                "constraints": {
                                    "field_type": "CURRENCY",
                                    "type": "CurrencyField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
                                "additional_information": {
                                    "is_hidden": false,
                                    "is_visible": false,
                                    "is_negotiable": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "54f7350c-61fd-4bf9-af4b-2398fd2954e2",
                                "name": "Attachment - bom",
                                "alternate_name": "Attachment - bom",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
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
                "template_id": "418e7f66-b876-4a88-a4ce-2264ce863380",
                "type": "PROJECT",
                "name": "Kya Horha hai",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2025-11-04T08:36:14.713188Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-11-04T08:36:14.698754Z",
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
                        "section_id": "74635a89-d842-47c0-800b-e78a8443be5b",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "16c575e5-f7c3-4ea2-b1dc-f5b85faabdf3",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "7e8d0814-40ab-43a1-b8ca-43285e4caff5",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "06316541-7d62-48c0-9b3d-754f6a3b441a",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "888a22f4-3768-4959-b9f6-3aa6539cf5ed",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
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
                                "section_item_id": "1f8903c9-b143-48e6-80d5-e045cf5e04df",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "7c7c5831-fa43-4bbb-8d11-d95386116a5c",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "88d01528-e63f-41e1-a679-99e422fade04",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "93f6d535-6b34-44c3-9d5f-1a31fbeb4d24",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                            }
                        ]
                    },
                    {
                        "section_id": "df992530-29eb-47d9-b399-5322dbd7638b",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": []
                    },
                    {
                        "section_id": "71f838db-2bdb-41c7-badc-1144ad93be1f",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": []
                    },
                    {
                        "section_id": "24464b78-fb17-4578-8499-2d6fdf7dbb81",
                        "name": "NormalSection",
                        "alternate_name": "NormalSection1",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "0c85de83-cfa9-42a0-a76f-e4901f1613b8",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "dd36cd97-5141-4d5e-a28f-bdd51971005d",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "0f3cd4d4-456b-45c1-bbc7-05f971d2e987",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    },
                    {
                        "section_id": "39418689-9775-4254-b3c9-a9be93d9f8d9",
                        "name": "RejectableSection",
                        "alternate_name": "RejectableSection1",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "1f1e5a51-e152-4bd7-90a0-ba1d98fb8bc4",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "c19fbe1f-20a3-492a-a2e7-032c464e50b4",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "e53f32cf-f07e-486e-9873-133cdfc112ad",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            }
                        ]
                    }
                ]
            },
            {
                "template_id": "e3a2d765-77cb-43da-92bc-19a97b18cb1a",
                "type": "PROJECT",
                "name": "AmaanOrdering",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2025-10-28T13:33:25.080670Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-10-28T13:33:25.066639Z",
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
                        "section_id": "2b64db7a-7e6e-46ac-8a69-d10e90081504",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "bccfb17b-70e9-40d3-b365-a1a827c50daa",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "c8374943-b98e-4604-8946-49e1c0d4007c",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "4914ae51-2e17-4385-81a3-b6944e4575ac",
                                "name": "sss",
                                "alternate_name": "sss",
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
                                "section_item_id": "f694495f-8e53-43a4-bc93-5da98efcd1e7",
                                "name": "Number 1",
                                "alternate_name": "Number 1",
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
                            },
                            {
                                "section_item_id": "17f200cb-4eae-4ef4-9f23-5cd5a5d084e2",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "8f4505a8-0863-43f0-99f1-7927e5170b2f",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "791495b0-9bfd-4605-8c20-8590ec329d7f",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "0c2decee-f26b-4b0f-bc4e-a6af2aec709d",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
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
                                "section_item_id": "ee7ff36d-c93c-444a-85fd-c5153d92ff02",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "cfe6f206-0273-474a-82e7-05c21a42d5ca",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                                "section_item_id": "d23d783c-72b6-40ef-bd5d-17a2f3a59446",
                                "name": "Notes",
                                "alternate_name": "Notes",
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
                            }
                        ]
                    },
                    {
                        "section_id": "2faceca4-acf1-491c-8ce2-010aa44c9129",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "6eed3d3e-eb7a-4b54-aa08-533ddef877a0",
                                "name": "Short text 1",
                                "alternate_name": "Short text 1",
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
                                "section_item_id": "5c88cf61-16ce-427b-afcb-15b50487e953",
                                "name": "Client Volume",
                                "alternate_name": "Client Volume",
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
                                "section_item_id": "56ab9d26-3162-4499-90c0-2560c551a1b1",
                                "name": "Multi-select",
                                "alternate_name": "Multi-select",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Option 1",
                                        "Option 2",
                                        "Option 3"
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
                            }
                        ]
                    },
                    {
                        "section_id": "0ae77b5f-4fb3-41af-b11c-a55ddc80ab7d",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": []
                    },
                    {
                        "section_id": "f0efc2c2-68ec-4633-8d1d-75379bf40a1b",
                        "name": "Ashir",
                        "alternate_name": "Ashir",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "eb07626b-3d6d-4ec8-b4f9-18035a0d8eb2",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "6e7bb3e0-7b97-4ed0-97bc-228502af78dd",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "12be0241-c366-428e-b0f3-7ed37ab0ecda",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "47d124d4-2446-423f-9675-5c92fd605987",
                                "name": "SPQ",
                                "alternate_name": "SPQ",
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
                            },
                            {
                                "section_item_id": "f834ee1f-5144-4ae1-9cac-2b076a846047",
                                "name": "Syrma SGS Manufacturing location",
                                "alternate_name": "Syrma SGS Manufacturing location",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Bangalore",
                                        "Chennai",
                                        "Manesar",
                                        "Bawal",
                                        "Pune",
                                        "Husur",
                                        "Baddi",
                                        "Noida"
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
                        "section_id": "c6c024a0-0d8e-4a98-ac8a-82f29ec1fdc1",
                        "name": "Amaan",
                        "alternate_name": "Amaan",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "b28c228c-5c1f-4e31-bd0e-a0170b0c0846",
                                "name": "Deadline date",
                                "alternate_name": "Deadline date",
                                "constraints": {
                                    "field_type": "DATE",
                                    "type": "DateField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "acb44f84-33d4-4724-80d1-8db51bcd6a22",
                                "name": "Attachments",
                                "alternate_name": "Attachments",
                                "constraints": {
                                    "field_type": "ATTACHMENT",
                                    "type": "AttachmentField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "b8fafb1d-8c8d-4554-93e1-ce72174a01f6",
                                "name": "Status",
                                "alternate_name": "Status",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Ongoing",
                                        "Completed"
                                    ],
                                    "choice_type": "DROPDOWN",
                                    "selected": null,
                                    "type": "ChoiceField"
                                },
                                "is_builtin_field": true,
                                "field_level": "OTHER",
                                "additional_information": {
                                    "is_hidden": false
                                },
                                "parent_section_item": null
                            },
                            {
                                "section_item_id": "542e08ca-10df-4f46-9e32-91a13007f283",
                                "name": "Long text 1",
                                "alternate_name": "Long text 1",
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
                            }
                        ]
                    }
                ]
            },
            {
                "template_id": "184fc149-5088-40ed-8cac-b29473ac8800",
                "type": "PROJECT",
                "name": "PEQ",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2025-10-27T14:25:57.495166Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-10-27T14:25:57.486520Z",
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
                        "section_id": "4160fc57-3354-4da4-bd27-92005f5c2988",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "6c47d95d-241f-4ef8-a921-5b7eb70c92be",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "b8f62610-d731-46d7-bcb1-d4c5142af175",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "05609f5f-2f03-4292-903a-555fd689122e",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "dc57ff10-91d5-47ab-a178-60e830e12478",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "88b41b2a-fde5-427f-a957-8264839a2181",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "a61cb9d5-ebcb-4773-9d78-fa34eab24a2f",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "84ab8810-0c37-446e-948b-4b6bd6c02d62",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
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
                                "section_item_id": "f8914629-20de-4faa-a368-05666b5ae1ad",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                                "section_item_id": "235aaa7c-72b3-450e-a79d-3e2734d1493f",
                                "name": "SOP",
                                "alternate_name": "SOP",
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
                                "section_item_id": "8268558f-c9cf-4562-aa6c-cbc099d44e42",
                                "name": "Project Details",
                                "alternate_name": "Project Details",
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
                                "section_item_id": "5c57c1c4-eded-40c8-a8e0-58597fc16a22",
                                "name": "Alternates Allowed",
                                "alternate_name": "Alternates Allowed",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "Yes",
                                        "No"
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
                                "section_item_id": "7c2bd311-0cfd-4e6e-afd9-095a02e910f7",
                                "name": "Short text 1",
                                "alternate_name": "Short text 1",
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
                                "section_item_id": "b8dad5e6-12d3-4d44-b16a-b409ff7bacd9",
                                "name": "Multi-select 1",
                                "alternate_name": "Multi-select 1",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [
                                        "option 1",
                                        "option 2",
                                        "option 3"
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
                                "section_item_id": "a3920154-4177-4471-a70e-810411ffb5ba",
                                "name": "Long text 1",
                                "alternate_name": "Long text 1",
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
                            }
                        ]
                    },
                    {
                        "section_id": "99c6467a-e3c0-4e04-93ae-62e81e6af4b0",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": []
                    },
                    {
                        "section_id": "36d86e86-dd1f-4bcb-b024-4b48acc5c901",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "47501694-654f-4e99-ba2e-363a45e64d9e",
                                "name": "INR RATE",
                                "alternate_name": "INR RATE",
                                "constraints": {
                                    "field_type": "CURRENCY",
                                    "type": "CurrencyField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
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
                "template_id": "c9ea988e-8dac-48ec-8def-2ad0c2294bda",
                "type": "PROJECT",
                "name": "Project Template",
                "tags": [],
                "status": "ONGOING",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2025-08-14T07:29:05.715838Z",
                "creator_name": "Admin",
                "last_edited_on": "2025-08-14T07:29:16.104141Z",
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
                        "section_id": "0cbf763c-0bb1-44f5-a167-7c21d63b9412",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "d3b7f3fa-825a-4e75-a6a1-3732418eca2c",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "ba1dac8a-43c6-4014-aab3-2a0f850c5774",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "e798ecf7-4583-4681-a670-b637297097d7",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "6412b9da-4f2c-4676-8cbc-fa9699ea778b",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
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
                                "section_item_id": "68388688-8065-4ff9-b63b-de1997cfeb32",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "52edb422-cbcc-4199-bdfa-057239d99a42",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "7b98f82d-fe9a-43b1-8ed5-06ddc3fda56a",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "5b8cd972-f995-472e-adc5-73bcc0c96409",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                            }
                        ]
                    },
                    {
                        "section_id": "d40ab24c-b4d0-43f2-a0d1-e233ca782519",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "b3cf312c-7721-4339-8622-73470c4df23e",
                                "name": "Item Notes",
                                "alternate_name": "Item Notes",
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
                            }
                        ]
                    },
                    {
                        "section_id": "9b1fd70d-f371-40c1-ac12-908d1f5ab7c0",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "ba717bc0-8bdd-4e79-ab6a-207aefe29be4",
                                "name": "BOM notes",
                                "alternate_name": "BOM notes",
                                "constraints": {
                                    "field_type": "LONGTEXT",
                                    "min_limit": 0,
                                    "max_limit": 120,
                                    "type": "LongTextField"
                                },
                                "is_builtin_field": false,
                                "field_level": "BOM",
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
                "template_id": "9e7180bf-4ba4-40ec-b8f7-a21e0fac21da",
                "type": "PROJECT",
                "name": "Template20260212",
                "tags": [],
                "status": "DRAFT",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2026-02-12T14:10:32.137094Z",
                "creator_name": "Admin",
                "last_edited_on": "2026-02-12T14:10:32.126146Z",
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
                        "section_id": "268624b2-3024-4206-a224-b0ce4d288f10",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "7f87dbf8-fb3e-4ac1-86a1-872256355b18",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "0d2a0191-ac87-40d1-80d9-ab4dba972a63",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "740d2615-73a4-4a3f-8392-8d11684d35f7",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "cbf1df21-cb8d-435c-afe0-96933ae0cf4e",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
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
                                "section_item_id": "db46403c-2080-41ff-979b-c2990eef5c5b",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "49cecf24-8b7d-4cbb-9437-80d6b7a56170",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "2827052d-f534-4ab3-a795-a78b4682b08d",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "0a8a2f2b-86bf-49a5-aed9-e3c100fe4f26",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                            }
                        ]
                    },
                    {
                        "section_id": "b750dcc3-00c0-454a-a897-3e6b8bf39ce2",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": []
                    },
                    {
                        "section_id": "94c52d4d-799b-4dac-a05c-69b8d29952bc",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": []
                    }
                ]
            },
            {
                "template_id": "d01a72c2-b949-4256-8bc0-0a194566d2ca",
                "type": "PROJECT",
                "name": "Template20260205 m",
                "tags": [],
                "status": "DRAFT",
                "published_on": null,
                "description": "",
                "is_global": false,
                "is_default": false,
                "created_on": "2026-02-05T12:29:35.306074Z",
                "creator_name": "Admin",
                "last_edited_on": "2026-02-05T12:29:35.297236Z",
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
                        "section_id": "19816d45-1abd-48fb-9504-a9acebc519d8",
                        "name": "Project Details",
                        "alternate_name": "Project Details",
                        "section_type": "OTHER",
                        "assigned_users": [],
                        "section_items": [
                            {
                                "section_item_id": "873d588b-7e59-4cd3-911c-2562cfd07d67",
                                "name": "Project code",
                                "alternate_name": "Project code",
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
                                "section_item_id": "efb6fe98-3fbd-4b68-b01d-7c00aa13fb0e",
                                "name": "Project name",
                                "alternate_name": "Project name",
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
                                "section_item_id": "c65da2c5-2cda-453d-aa91-1f6f349a02dd",
                                "name": "Description",
                                "alternate_name": "Description",
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
                                "section_item_id": "af2c2db6-201a-4bee-a45c-a5a9c040d08f",
                                "name": "Internal notes",
                                "alternate_name": "Internal notes",
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
                                "section_item_id": "6bacf46b-b23c-4cd0-aa98-3d5f28f54f05",
                                "name": "Start date",
                                "alternate_name": "Start date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "a5ffd118-1b9a-4801-b643-b86f227b1b2c",
                                "name": "End date",
                                "alternate_name": "End date",
                                "constraints": {
                                    "field_type": "DATETIME",
                                    "type": "DateTimeField"
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
                                "section_item_id": "8b478cab-dd53-42cf-9b4b-bbd32d5978cd",
                                "name": "Project managers",
                                "alternate_name": "Project managers",
                                "constraints": {
                                    "field_type": "CHOICE",
                                    "choices": [],
                                    "choice_type": "MULTI_SELECT",
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
                                "section_item_id": "c0fc1c16-898c-4e6e-8c99-81046c5785a9",
                                "name": "Customer",
                                "alternate_name": "Customer",
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
                            }
                        ]
                    },
                    {
                        "section_id": "ad16687e-5bb5-4317-ba58-7282f4128a9a",
                        "name": "Item Terms",
                        "alternate_name": "Item Terms",
                        "section_type": "ITEM",
                        "assigned_users": [],
                        "section_items": []
                    },
                    {
                        "section_id": "91b445a7-e6f2-4127-aca9-cf3407fefc96",
                        "name": "BOM",
                        "alternate_name": "BOM",
                        "section_type": "BOM",
                        "assigned_users": [],
                        "section_items": []
                    }
                ]
            }
        ]er
    }
]