# Contract Create

curl --location 'https://n29p4xri95.execute-api.us-east-1.amazonaws.com/dev/api/contract/create/' \
--header 'x-api-key: G620jT6lwx3IbKQKFtmlw9zNYvqVZLQQ5HHCexBj' \
--header 'api-id: h7kbdchbl2' \
--header 'Content-Type: application/json' \
--data-raw '{
    "created_by_user_email": "globalfieldsETE@gmail.com",
    "contract_name": "TestAPI 220126",
    "ERP_contract_id": "ERPTEST22",
    "contract_start_date": "2026-01-22",
    "contract_end_date": "2026-07-30",
    "entity_name": "FactWise",
    "status": "DRAFT",
    "template_name": "Open API Test",
    "buyer_identifications": [
        "GST"
    ],
    "buyer_address": "Main address",
    "buyer_contact": "globalfieldsETE@gmail.com",
    "factwise_vendor_code": "V001",
    "ERP_vendor_code": null,
    "vendor_contact": "dimple@factwise.io",
    "vendor_identifications": [
        {
            "identification_name": "Precision Tools Corp.",
            "identification_value": "901234567"
        }
    ],
    "vendor_address": {
        "address_id": null,
        "full_address": "432 Tool Ave, Chicago"
    },
    "project": "P000039",
    "additional_costs": [],
    "taxes": [],
    "discounts": [
        {
            "name": "Overall discount",
            "value": 5
        }
    ],
    "prepayment_percentage": 0,
    "payment_type": "PER_INVOICE_ITEM",
    "payment_terms": {
        "term": 1,
        "period": "MONTHS",
        "applied_from": "INVOICE_DATE"
    },
    "deliverables_payment_terms": [],
    "incoterm": "CFR",
    "lead_time": "10",
    "lead_time_period": "DAYS",
    "custom_sections": [
        {
            "name": "Contract Details",
            "custom_fields": []
        },
        {
            "name": "Essential Terms",
            "section_type": "ITEM",
            "custom_fields": []
        },
        {
            "name": "Payment and Delivery Terms",
            "section_type": "ITEM",
            "custom_fields": []
        }
    ],
    "attachments": [],
    "terms_and_conditions": {
        "data": "",
        "name": "FactWise Default TNC"
    },
    "contract_items": [
        {
            "ERP_item_code": null,
            "factwise_item_code": "BKT112",
            "currency_code_id": "a8c3e3fd-b05f-4d09-bd2f-9fedd07d0ec3",
            "measurement_unit_id": "f16d124e-db59-48fe-a2b8-19f625745cbf",
            "attributes": [],
            "rate": 10,
            "quantity": 1000,
            "pricing_tiers": [
                {
                    "min_quantity": 0,
                    "max_quantity": 100,
                    "rate": 10,
                    "additional_costs": [],
                    "taxes": [],
                    "discounts": [
                        {
                            "name": "Discount",
                            "value": 10
                        }
                    ]
                },
                {
                    "min_quantity": 100,
                    "max_quantity": 200,
                    "rate": 20,
                    "additional_costs": [],
                    "taxes": [],
                    "discounts": [
                        {
                            "name": "Discount",
                            "value": 10
                        }
                    ]
                }
            ],
            "prepayment_percentage": 100,
            "payment_type": "PER_INVOICE_ITEM",
            "payment_terms": {
                "term": 1,
                "period": "MONTHS",
                "applied_from": "INVOICE_DATE"
            },
            "deliverables_payment_terms": [],
            "incoterm": "NA",
            "lead_time": "10",
            "lead_time_period": "DAYS",
            "additional_costs": [],
            "taxes": [],
            "discounts": [],
            "attachments": [],
            "custom_sections": [
                {
                    "name": "Essential Terms",
                    "custom_fields": []
                },
                {
                    "name": "Payment and Delivery Terms",
                    "custom_fields": []
                }
            ]
        }
    ]
}'