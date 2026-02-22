# Contract Create API - Field Analysis

## Contract-Level Fields

| Field Name | Type | Required | Input Type | Notes |
|------------|------|----------|------------|-------|
| `enterprise_id` | UUID | ✅ Yes | Hidden | Auto-filled from account |
| `created_by_user_email` | Email | ✅ Yes | Text (email) | Auto-filled from account |
| `contract_name` | String | ✅ Yes | Text | Max 200 chars |
| `ERP_contract_id` | String | ❌ No | Text | Nullable |
| `contract_start_date` | Date | ✅ Yes | Date picker | ISO format |
| `contract_end_date` | Date | ✅ Yes | Date picker | ISO format |
| `entity_name` | String | ✅ Yes | Text | Buyer entity name |
| `status` | Choice | ✅ Yes | **Dropdown** | `DRAFT` or `SUBMITTED` |
| `template_name` | String | ✅ Yes | Text | Template identifier |
| `buyer_identifications` | List[String] | ✅ Yes | Text (comma-separated) | Min length 0, e.g., ["GST"] |
| `buyer_address` | String | ❌ No | Text | Nullable |
| `buyer_contact` | Email | ✅ Yes | Text (email) | |
| `factwise_vendor_code` | String | ⚠️ Conditional | Text | Required if ERP_vendor_code is null |
| `ERP_vendor_code` | String | ⚠️ Conditional | Text | Required if factwise_vendor_code is null |
| `vendor_contact` | Email | ✅ Yes | Text (email) | |
| `project` | String | ❌ No | Text | Nullable, e.g., "P000039" |
| `prepayment_percentage` | Decimal | ❌ No | Number | 0-100, 4 decimal places |
| `payment_type` | Choice | ❌ No | **Dropdown** | PaymentType enum (e.g., "PER_INVOICE_ITEM") |
| `incoterm` | Choice | ✅ Yes | **Dropdown** | IncotermAbbreviationType (e.g., "CFR", "DAP", "NA") |
| `lead_time` | Decimal | ❌ No | Number | Max 30 digits, 10 decimal places |
| `lead_time_period` | Choice | ❌ No | **Dropdown** | PeriodType (e.g., "DAYS", "WEEKS", "MONTHS") |

### Nested Objects (Contract-Level)

#### `vendor_identifications` (Array) - Required
```json
[
  {
    "identification_name": "string",  // Required, text input
    "identification_value": "string"  // Required, text input
  }
]
```

#### `vendor_address` (Object) - Nullable
```json
{
  "address_id": "string or null",    // Text input
  "full_address": "string or null"   // Text input
}
```

#### `payment_terms` (Object) - Nullable
```json
{
  "term": 1,                         // Integer, min 0
  "period": "MONTHS",                // Dropdown: DAYS/WEEKS/MONTHS
  "applied_from": "INVOICE_DATE"     // Text input
}
```

#### `deliverables_payment_terms` (Array) - Required
```json
[
  {
    "allocation_percentage": "100",  // Decimal 0-100, 4 decimal places
    "term": "2",                     // Integer, min 0
    "period": "WEEKS",               // Dropdown: DAYS/WEEKS/MONTHS
    "applied_from_milestone": "string or null",  // Text input
    "applied_from_fixed_date": "2025-07-10 or null"  // Date picker
  }
]
```

#### `additional_costs` (Array) - Optional (default [])
**Toggle: Contract-Level Additional Costs**
```json
[
  {
    "name": "string",   // Text input
    "value": 5.0        // Decimal number
  }
]
```

#### `taxes` (Array) - Optional (default [])
**Toggle: Contract-Level Additional Costs**
```json
[
  {
    "name": "GST",      // Text input
    "value": 18.0       // Decimal number
  }
]
```

#### `discounts` (Array) - Optional (default [])
**Toggle: Contract-Level Additional Costs**
```json
[
  {
    "name": "string",   // Text input
    "value": 10.0       // Decimal number
  }
]
```

#### `custom_sections` (Array) - Required
**Toggle: Contract-Level Custom Fields**
```json
[
  {
    "name": "Contract Details",      // Text input
    "custom_fields": []               // Array (complex structure)
  }
]
```

#### `attachments` (Array) - Required
```json
[
  {
    "base64EncodedData": "",  // Text area or file upload
    "filename": ""            // Text input
  }
]
```

#### `terms_and_conditions` (Object) - Nullable
```json
{
  "name": "FactWise Default TNC",  // Text input
  "data": "<p>...</p>"             // Text area (HTML)
}
```

---

## Contract Items (Array) - Required

Each contract must have at least one item.

| Field Name | Type | Required | Input Type | Notes |
|------------|------|----------|------------|-------|
| `ERP_item_code` | String | ⚠️ Conditional | Text | Required if factwise_item_code is null |
| `factwise_item_code` | String | ⚠️ Conditional | Text | Required if ERP_item_code is null |
| `currency_code_id` | UUID | ✅ Yes | **Dropdown** | Predefined currency list |
| `measurement_unit_id` | UUID | ✅ Yes | **Dropdown** | Predefined unit list |
| `rate` | Decimal | ❌ No | Number | Max 30 digits, 10 decimal places |
| `quantity` | Decimal | ❌ No | Number | Max 30 digits, 10 decimal places |
| `prepayment_percentage` | Decimal | ❌ No | Number | 0-100, 4 decimal places |
| `payment_type` | Choice | ❌ No | **Dropdown** | PaymentType enum |
| `incoterm` | Choice | ✅ Yes | **Dropdown** | IncotermAbbreviationType |
| `lead_time` | Decimal | ❌ No | Number | Max 30 digits, 10 decimal places |
| `lead_time_period` | Choice | ❌ No | **Dropdown** | PeriodType |

### Nested Objects (Item-Level)

#### `attributes` (Array) - Required
```json
[
  {
    "attribute_name": "string",      // Text input
    "attribute_type": "TEXT",        // Dropdown: AttributeType enum
    "attribute_value": [             // Array of objects
      {
        "value": "string"            // Text input
      }
    ]
  }
]
```

#### `payment_terms` (Object) - Nullable
Same structure as contract-level payment_terms

#### `deliverables_payment_terms` (Array) - Required
Same structure as contract-level deliverables_payment_terms

#### `pricing_tiers` (Array) - **Required, min_length=1**
**Config: Number of Pricing Tiers**

```json
[
  {
    "min_quantity": 100,             // Decimal, min 0
    "max_quantity": 200,             // Decimal, min 0
    "rate": 5.0,                     // Decimal, min 0, nullable
    "additional_costs": [],          // Array (toggle: Tier-Level Additional Costs)
    "taxes": [],                     // Array (toggle: Tier-Level Additional Costs)
    "discounts": []                  // Array (toggle: Tier-Level Additional Costs)
  }
]
```

#### `additional_costs` (Array) - Optional (default [])
**Toggle: Item-Level Additional Costs** (if we add this toggle)
Same structure as contract-level additional_costs

#### `taxes` (Array) - Optional (default [])
Same structure as contract-level taxes

#### `discounts` (Array) - Optional (default [])
Same structure as contract-level discounts

#### `custom_sections` (Array) - Required
**Toggle: Item-Level Custom Fields**
```json
[
  {
    "name": "Essential Terms",       // Text input
    "custom_fields": []              // Array (complex structure)
  }
]
```

#### `attachments` (Array) - Required
Same structure as contract-level attachments

---

## Dropdown Values (Enums)

Based on the payload examples, here are the known values:

### `status` (Contract-Level)
- `DRAFT`
- `SUBMITTED`

### `payment_type`
- `PER_INVOICE_ITEM`
- (Other values from PaymentType enum - need to check states.py)

### `incoterm`
- `CFR`
- `DAP`
- `NA`
- (Other Incoterm values - need to check states.py)

### `lead_time_period` / `period`
- `DAYS`
- `WEEKS`
- `MONTHS`

### `attribute_type`
- `TEXT`
- (Other values from AttributeType enum - need to check states.py)

---

## Config Box Controls

Based on this analysis, the config box should have:

1. **Number of Pricing Tiers** (integer input) - Controls how many pricing tier objects to generate
2. **Contract-Level Additional Costs** (toggle) - Shows/hides `additional_costs`, `taxes`, `discounts` at contract level
3. **Tier-Level Additional Costs** (toggle) - Shows/hides `additional_costs`, `taxes`, `discounts` inside each pricing tier
4. **Contract-Level Custom Fields** (toggle) - Shows/hides `custom_sections` at contract level
5. **Item-Level Custom Fields** (toggle) - Shows/hides `custom_sections` inside each contract item

---

## Validation Rules

1. Either `factwise_vendor_code` OR `ERP_vendor_code` must be provided
2. Either `factwise_item_code` OR `ERP_item_code` must be provided for each item
3. For attributes: if any of `attribute_name`, `attribute_type`, or `attribute_value` is provided, all three must be provided
4. `pricing_tiers` array must have at least 1 tier
5. `contract_items` array must have at least 1 item

---

## Predefined Data (UUIDs)

These fields require predefined UUIDs from the system:

- `currency_code_id` - e.g., "a8c3e3fd-b05f-4d09-bd2f-9fedd07d0ec3"
- `measurement_unit_id` - e.g., "f16d124e-db59-48fe-a2b8-19f625745cbf"

For the cURLer tool, we can provide sample UUIDs or allow users to input their own.

---

## Simplified Form Strategy

For the cURLer tool, we should:

1. **Required fields only** by default
2. **Config box** to enable optional complex structures
3. **Sample data** pre-filled for UUIDs and complex nested objects
4. **Import cURL** feature to parse existing cURL and pre-fill all fields
5. **Template system** with 3 levels:
   - Simple: Minimal required fields only
   - Medium: Add either additional costs OR custom fields
   - Full: Everything enabled

