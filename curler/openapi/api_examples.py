from drf_spectacular.utils import (
    extend_schema,
    extend_schema_serializer,
    OpenApiParameter,
    OpenApiExample,
)
from drf_spectacular.types import OpenApiTypes


PO_CREATE_API = [
    OpenApiExample(
        name="Example",
        value={
            "buyer_details": {
                "entity_name": "DM Buyer",
                "billing_address_id": "619cc3df-617d-47b9-91a0-e28b8cc1a352",
                "shipping_address_id": "619cc3df-617d-47b9-91a0-e28b8cc1a352",
                "identifications": [],
                "contacts": [],
            },
            "seller_details": {
                "entity_name": "DM Buyer",
                "billing_address_id": "619cc3df-617d-47b9-91a0-e28b8cc1a352",
                "shipping_address_id": "619cc3df-617d-47b9-91a0-e28b8cc1a352",
                "identifications": [],
                "contacts": [],
            },
            "purchase_order_details": {
                "custom_id": "PO-0001",
                "status": "DELIVERY_PENDING",
                "issue_date": "2021-04-08",
                "accepted_date": "2021-04-08",
                "creator": "8717e118-46e8-4b44-ab3b-89677e0ae7c9",
                "currency_code": "INR",
                "discount": "10.00",
                "notes": "hihi",
                "terms_and_conditions": [],
            },
            "purchase_order_item_details": [
                {
                    "item_name": "Raman",
                    "custom_id": "Sauce",
                    "item_description": "Raman",
                    "item_additional_details": "Raman",
                    "item_attribute": [],
                    "item_custom_fields": [],
                    "item_custom_attributes": {},
                    "internal_notes": None,
                    "external_notes": None,
                    "pricing_information": {
                        "currency": "INR",
                        "price": "100.00",
                        "discounts": [],
                        "shipping_per_unit": "10.00",
                        "additional_charges": [
                            {"charge_name": "tax1", "charge_value": "1"}
                        ],
                        "additional_costs": [
                            {
                                "cost_name": "tax",
                                "cost_type": "PERCENTAGE",
                                "cost_value": "10.00",
                                "allocation_type": "OVERALL_QUANTITY",
                            }
                        ],
                    },
                    "payment_information": {
                        "incoterm": "EXW",
                        "prepayment_percentage": 1,
                        "lead_time": "10",
                        "lead_time_period": None,
                        "payment_terms": 1,
                        "payment_terms_period": None,
                        "payment_terms_applied_from": None,
                        "custom_fields_negotiate": [],
                    },
                    "quantity_information": {
                        "UOM": "Kilogram",
                        "quantity": "10000.00",
                        "quantity_tolerance_percentage": "10.00",
                        "delivery_date": None,
                        "requisition_department": None,
                        "department": None,
                        "general_ledger": None,
                        "cost_centre": None,
                        "project": None,
                    },
                    "delivery_schedules": [
                        {
                            "delivery_date": None,
                            "quantity": "50",
                            "department": None,
                            "cost_centre_id": None,
                            "general_ledger_id": None,
                            "project_id": None,
                            "requisition_department": None,
                        }
                    ],
                    "attachments": {},
                }
            ],
        },
    )
]
