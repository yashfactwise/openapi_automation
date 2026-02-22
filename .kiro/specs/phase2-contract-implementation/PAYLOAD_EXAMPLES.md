# Contract API Payload Examples

## 1. Contract State (Terminate)

**Endpoint:** `PUT /dev/api/purchase_order/terminate/`

**Headers:**
```
Content-Type: application/json
api-id: 999sl79ylc
x-api-key: 0YwNujOwpH2Q2Hx8QYOeJ6g6OImKmTLW2gB4QcNR
```

**Payload:**
```json
{
  "modified_by_user_email": "globalfieldsETE@gmail.com",
  "status": "ACCEPTED",
  "factwise_po_id": "PO000146-R3",
  "ERP_po_id": "PO_CREATE-3",
  "notes": "aise hi"
}
```

---

## 2. Contract Update

**Endpoint:** `PUT /dev/api/purchase_order/update/`

**Headers:**
```
Content-Type: application/json
api-id: h7kbdchbl2
x-api-key: G620jT6lwx3IbKQKFtmlw9zNYvqVZLQQ5HHCexBj
```

**Payload:**
```json
{
  "buyer_details": {
    "entity_name": "FactWise",
    "billing_address_id": "Main address",
    "shipping_address_id": "Main address",
    "identifications": ["GST"],
    "contacts": ["8928219571"]
  },
  "seller_details": {
    "factwise_vendor_code": "V001",
    "seller_full_address": "Mumbai",
    "seller_address_id": null,
    "identifications": ["GST"],
    "contacts": ["8928219571"]
  },
  "purchase_order_details": {
    "ERP_po_id": "PO_CRATE-5",
    "modified_by_user_email": "globalfieldsETE@gmail.com",
    "status": "ISSUED",
    "template_name": "Syrma PO Template",
    "issue_date": "2025-06-26",
    "accepted_date": "2025-05-27",
    "currency_code": "a8c3e3fd-b05f-4d09-bd2f-9fedd07d0ec3",
    "notes": "overall notes",
    "event": null,
    "terms_and_conditions": {
      "name": "FactWise Default TNC",
      "data": "<p>Acceptance of order...</p>"
    },
    "additional_costs": [],
    "taxes": [],
    "discounts": [],
    "custom_sections": [
      {
        "name": "PO Group Details",
        "custom_fields": []
      },
      {
        "name": "Item Terms",
        "custom_fields": []
      },
      {
        "name": "Vendor Information",
        "custom_fields": []
      },
      {
        "name": "Payment and Delivery Terms",
        "custom_fields": []
      },
      {
        "name": "Additional Details",
        "custom_fields": []
      }
    ]
  },
  "purchase_order_items": [
    {
      "ERP_item_code": null,
      "factwise_item_code": "ADGA0003",
      "item_additional_details": "item level ad",
      "internal_notes": "item level in",
      "external_notes": "item level en",
      "price": 7.9,
      "quantity": 100,
      "measurement_unit": "f16d124e-db59-48fe-a2b8-19f625745cbf",
      "incoterm": "DAP",
      "prepayment_percentage": 10,
      "lead_time": "10",
      "lead_time_period": "DAYS",
      "payment_type": "PER_INVOICE_ITEM",
      "payment_terms": {
        "term": 2,
        "period": "MONTHS",
        "applied_from": "INVOICE_DATE"
      },
      "deliverables_payment_terms": [
        {
          "allocation_percentage": "100",
          "term": "2",
          "period": "WEEKS",
          "applied_from_milestone": "PO allocation date",
          "applied_from_fixed_date": "2025-07-10"
        }
      ],
      "delivery_schedules": [
        {
          "delivery_date": "2026-06-30",
          "quantity": "100",
          "cost_centre_id": null,
          "general_ledger_id": null,
          "project_id": null
        }
      ],
      "additional_costs": [
        {
          "name": "Cost PU | IL",
          "value": 5
        },
        {
          "name": "Shipping rate",
          "value": 300
        },
        {
          "name": "NRE",
          "value": 1000
        }
      ],
      "taxes": [
        {
          "name": "GST",
          "value": 18
        }
      ],
      "discounts": [],
      "custom_sections": [],
      "attachments": []
    }
  ],
  "attachments": [
    {
      "base64EncodedData": "",
      "filename": ""
    }
  ]
}
```

---

## 3. Contract Create

**Endpoint:** `POST /dev/api/contract/create/`

**Headers:**
```
Content-Type: application/json
api-id: h7kbdchbl2
x-api-key: G620jT6lwx3IbKQKFtmlw9zNYvqVZLQQ5HHCexBj
```

**Payload:**
```json
{
  "created_by_user_email": "globalfieldsETE@gmail.com",
  "contract_name": "Syrma Contract 16",
  "ERP_contract_id": "Syrma Contract 16",
  "factwise_contract_id": "C000189",
  "contract_start_date": "2026-01-22",
  "contract_end_date": "2026-07-30",
  "entity_name": "FactWise",
  "status": "DRAFT",
  "template_name": "Syrma Open API",
  "buyer_identifications": ["GST"],
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
  "discounts": [],
  "prepayment_percentage": 10,
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
      "factwise_item_code": "ADGA0010",
      "currency_code_id": "a8c3e3fd-b05f-4d09-bd2f-9fedd07d0ec3",
      "measurement_unit_id": "f16d124e-db59-48fe-a2b8-19f625745cbf",
      "attributes": [],
      "rate": 15,
      "quantity": 200,
      "pricing_tiers": [
        {
          "min_quantity": 100,
          "max_quantity": 200,
          "rate": 5,
          "additional_costs": [],
          "taxes": [],
          "discounts": []
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
    },
    {
      "ERP_item_code": null,
      "factwise_item_code": "ADGA0001",
      "currency_code_id": "a8c3e3fd-b05f-4d09-bd2f-9fedd07d0ec3",
      "measurement_unit_id": "f16d124e-db59-48fe-a2b8-19f625745cbf",
      "attributes": [],
      "rate": 15,
      "quantity": 200,
      "pricing_tiers": [
        {
          "min_quantity": 100,
          "max_quantity": 200,
          "rate": 5,
          "additional_costs": [],
          "taxes": [],
          "discounts": []
        },
        {
          "min_quantity": 1000,
          "max_quantity": 2000,
          "rate": 5,
          "additional_costs": [],
          "taxes": [],
          "discounts": []
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
}
```

---

## Key Observations

### Contract State
- Simple payload with status, IDs, email, and notes
- Status values: "ACCEPTED", etc.

### Contract Create Structure
- **Contract-level** additional_costs, taxes, discounts (empty arrays in example)
- **Contract-level** custom_sections with name and custom_fields array
- **Contract items** array, each with:
  - Item codes (factwise or ERP)
  - **Pricing tiers** array (1 or 2 tiers in examples)
  - Each pricing tier has: min_quantity, max_quantity, rate, additional_costs, taxes, discounts
  - **Item-level** additional_costs, taxes, discounts
  - **Item-level** custom_sections

### Contract Update
- Note: The example shows PO update structure, not contract update
- Contract update should follow similar structure to create but with factwise_contract_id or ERP_contract_id for identification
