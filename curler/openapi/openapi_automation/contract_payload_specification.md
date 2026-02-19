# Contract Creation - OpenAPI Payload Specification

## Overview
This document details the complete payload structure required to create a contract via the OpenAPI endpoint.

**Endpoint**: `POST /openapi/contracts/create/`  
**Service**: `factwise/openapi/services/contract_services.py::create_contract()`  
**View**: `factwise/openapi/views/contract_views.py::ContractCreateAPI`

---

## Complete Payload Structure

```json
{
  "enterprise_id": "uuid",
  "created_by_user_email": "string (email)",
  "contract_name": "string (max 200 chars)",
  "ERP_contract_id": "string | null",
  "contract_start_date": "date (YYYY-MM-DD)",
  "contract_end_date": "date (YYYY-MM-DD)",
  "entity_name": "string",
  "status": "DRAFT | SUBMITTED",
  "template_name": "string",
  "buyer_identifications": ["string"],
  "buyer_address": "string | null",
  "buyer_contact": "string (email)",
  "factwise_vendor_code": "string | null",
  "ERP_vendor_code": "string | null",
  "vendor_identifications": [
    {
      "identification_name": "string",
      "identification_value": "string"
    }
  ],
  "vendor_address": {
    "address_id": "uuid | null",
    "full_address": "string"
  },
  "vendor_contact": "string (email)",
  "project": "string | null",
  "additional_costs": [
    {
      "name": "string",
      "value": "decimal"
    }
  ],
  "taxes": [
    {
      "name": "string",
      "value": "decimal"
    }
  ],
  "discounts": [
    {
      "name": "string",
      "value": "decimal"
    }
  ],
  "prepayment_percentage": "decimal (0-100) | null",
  "payment_type": "PER_INVOICE_ITEM | PER_DELIVERABLE | null",
  "payment_terms": {
    "payment_terms": "integer",
    "payment_terms_period": "DAYS | WEEKS | MONTHS | null",
    "payment_terms_applied_from": "string | null"
  },
  "deliverables_payment_terms": [
    {
      "deliverable_name": "string",
      "payment_percentage": "decimal"
    }
  ],
  "incoterm": "EXW | FCA | CPT | CIP | DAP | DPU | DDP | FAS | FOB | CFR | CIF",
  "lead_time": "decimal | null",
  "lead_time_period": "DAYS | WEEKS | MONTHS | YEARS | null",
  "custom_sections": [
    {
      "section_name": "string",
      "fields": [
        {
          "field_name": "string",
          "field_value": "any"
        }
      ]
    }
  ],
  "attachments": [
    {
      "attachment_id": "uuid",
      "attachment_name": "string"
    }
  ],
  "terms_and_conditions": {
    "terms": "string",
    "conditions": "string"
  },
  "contract_items": [
    {
      "ERP_item_code": "string | null",
      "factwise_item_code": "string | null",
      "currency_code_id": "uuid",
      "measurement_unit_id": "uuid",
      "attributes": [
        {
          "attribute_name": "string",
          "attribute_type": "string",
          "attribute_value": [
            {
              "value": "string"
            }
          ]
        }
      ],
      "prepayment_percentage": "decimal (0-100) | null",
      "payment_type": "PER_INVOICE_ITEM | PER_DELIVERABLE | null",
      "payment_terms": {
        "payment_terms": "integer",
        "payment_terms_period": "DAYS | WEEKS | MONTHS | null",
        "payment_terms_applied_from": "string | null"
      },
      "deliverables_payment_terms": [
        {
          "deliverable_name": "string",
          "payment_percentage": "decimal"
        }
      ],
      "incoterm": "EXW | FCA | CPT | CIP | DAP | DPU | DDP | FAS | FOB | CFR | CIF",
      "lead_time": "decimal | null",
      "lead_time_period": "DAYS | WEEKS | MONTHS | YEARS | null",
      "pricing_tiers": [
        {
          "rate": "decimal",
          "min_quantity": "decimal",
          "max_quantity": "decimal",
          "additional_costs": [
            {
              "name": "string",
              "value": "decimal"
            }
          ],
          "taxes": [
            {
              "name": "string",
              "value": "decimal"
            }
          ],
          "discounts": [
            {
              "name": "string",
              "value": "decimal"
            }
          ]
        }
      ],
      "attachments": [
        {
          "attachment_id": "uuid",
          "attachment_name": "string"
        }
      ],
      "custom_sections": [
        {
          "section_name": "string",
          "fields": [
            {
              "field_name": "string",
              "field_value": "any"
            }
          ]
        }
      ]
    }
  ]
}
```

---

## Field Details & Requirements

### Contract Level Fields

#### Required Fields
- **enterprise_id** (UUID): The enterprise creating the contract (auto-populated from request context)
- **created_by_user_email** (Email): Must exist in the enterprise
- **contract_name** (String, max 200): Unique contract name
- **contract_start_date** (Date): Format YYYY-MM-DD
- **contract_end_date** (Date): Format YYYY-MM-DD, must be after start date
- **entity_name** (String): Buyer entity name (must exist in enterprise)
- **status** (Enum): Either "DRAFT" or "SUBMITTED"
- **template_name** (String): CLM template name (must exist for entity)
- **buyer_contact** (Email): Buyer contact email
- **vendor_contact** (Email): Vendor contact email
- **incoterm** (Enum): Valid incoterm abbreviation

#### Conditional Requirements
- **Either** `factwise_vendor_code` OR `ERP_vendor_code` must be provided (not both null)

#### Optional Fields
- **ERP_contract_id** (String): External ERP system contract ID
- **buyer_identifications** (Array): List of identification names
- **buyer_address** (String): Address nickname
- **vendor_identifications** (Array): Custom vendor identifications
- **vendor_address** (Object): Address details
- **project** (String): Project code
- **additional_costs** (Array): Overall contract additional costs
- **taxes** (Array): Overall contract taxes
- **discounts** (Array): Overall contract discounts
- **prepayment_percentage** (Decimal 0-100): Prepayment percentage
- **payment_type** (Enum): Payment type
- **payment_terms** (Object): Payment terms details
- **deliverables_payment_terms** (Array): Deliverable-based payment terms
- **lead_time** (Decimal): Lead time value
- **lead_time_period** (Enum): Lead time period unit
- **custom_sections** (Array): Custom template sections
- **attachments** (Array): Attachment references
- **terms_and_conditions** (Object): T&C details

### Contract Item Fields

#### Required Fields (per item)
- **currency_code_id** (UUID): Currency for pricing
- **measurement_unit_id** (UUID): Unit of measurement
- **incoterm** (Enum): Item-level incoterm
- **pricing_tiers** (Array, min 1): At least one pricing tier required

#### Conditional Requirements (per item)
- **Either** `ERP_item_code` OR `factwise_item_code` must be provided

#### Optional Fields (per item)
- **attributes** (Array): Item attributes
- **prepayment_percentage** (Decimal 0-100): Item-level prepayment
- **payment_type** (Enum): Item-level payment type
- **payment_terms** (Object): Item-level payment terms
- **deliverables_payment_terms** (Array): Item-level deliverable payments
- **lead_time** (Decimal): Item-level lead time
- **lead_time_period** (Enum): Item-level lead time period
- **attachments** (Array): Item-level attachments
- **custom_sections** (Array): Item-level custom sections

### Pricing Tier Fields

#### Required Fields (per tier)
- **rate** (Decimal): Price per unit for this tier
- **min_quantity** (Decimal): Minimum quantity for tier
- **max_quantity** (Decimal): Maximum quantity for tier

#### Optional Fields (per tier)
- **additional_costs** (Array): Tier-level additional costs
- **taxes** (Array): Tier-level taxes
- **discounts** (Array): Tier-level discounts

---

## Valid Enum Values

### Contract Status
- `DRAFT` - Contract in draft state
- `SUBMITTED` - Contract submitted for approval

### Payment Type
- `PER_INVOICE_ITEM` - Payment per invoice item
- `PER_DELIVERABLE` - Payment per deliverable

### Period Type
- `DAYS`
- `WEEKS`
- `MONTHS`
- `YEARS`

### Incoterm Abbreviations
- `EXW` - Ex Works
- `FCA` - Free Carrier
- `CPT` - Carriage Paid To
- `CIP` - Carriage and Insurance Paid To
- `DAP` - Delivered At Place
- `DPU` - Delivered at Place Unloaded
- `DDP` - Delivered Duty Paid
- `FAS` - Free Alongside Ship
- `FOB` - Free On Board
- `CFR` - Cost and Freight
- `CIF` - Cost, Insurance and Freight

---

## Data Models Reference

### Contract Model
**File**: `factwise/contract/models/contract_model.py`

Key fields:
- `contract_id` (UUID, PK, auto-generated)
- `custom_contract_id` (String, 20 chars) - Generated by system
- `ERP_contract_id` (String, 200 chars, optional)
- `version` (Integer) - Auto-incremented
- `contract_name` (String, 500 chars)
- `contract_start_date` (Date)
- `contract_end_date` (Date)
- `buyer_enterprise` (FK to Enterprise)
- `buyer_entity` (FK to Entity)
- `seller_enterprise` (FK to Enterprise, optional)
- `seller_entity` (FK to Entity, optional)
- `status` (Enum: ContractState)
- `buyer_identifications` (JSONField)
- `buyer_contact_information` (JSONField)
- `buyer_address_information` (JSONField)
- `vendor_identifications` (JSONField)
- `vendor_contact_information` (JSONField)
- `vendor_address_information` (JSONField)
- `prepayment_percentage` (Decimal 30,10)
- `payment_type` (Enum: PaymentType)
- `payment_terms` (JSONField)
- `deliverables_payment_terms` (JSONField)
- `lead_time` (Decimal 30,10)
- `lead_time_period` (String, 100 chars)
- `incoterm` (FK to Incoterms)
- `additional_details` (JSONField)
- `project_information` (JSONField)
- `terms_and_conditions` (JSONField)
- `custom_fields` (JSONField)
- `custom_fields_negotiate` (JSONField)

### Contract Item Model
**File**: `factwise/contract/models/contract_item_model.py`

Key fields:
- `contract_item_id` (UUID, PK, auto-generated)
- `contract` (FK to Contract)
- `enterprise_item` (FK to EnterpriseItem)
- `measurement_unit` (FK to MeasurementUnit)
- `currency` (FK to CurrencyCode)
- `buyer_skus` (JSONField)
- `rate` (Decimal 30,10, optional)
- `pricing_information` (JSONField)
- `quantity` (Decimal 30,10, optional)
- `attribute_information` (JSONField)
- `prepayment_percentage` (Decimal 30,10)
- `payment_type` (Enum: PaymentType)
- `payment_terms` (JSONField)
- `deliverables_payment_terms` (JSONField)
- `procurement_information` (JSONField)
- `incoterm` (FK to Incoterms)
- `custom_fields` (JSONField)
- `custom_fields_negotiate` (JSONField)

### Pricing Tier Model
**File**: `factwise/contract/models/pricing_tier_model.py`

Key fields:
- `tier_id` (UUID, PK, auto-generated)
- `rate` (Decimal 30,10)
- `effective_rate` (Decimal 30,10) - Calculated
- `min_quantity` (Decimal 30,10)
- `max_quantity` (Decimal 30,10)
- `contract_item` (FK to ContractItem)

---

## Business Logic & Validation

### Contract Level Validation
1. **User Validation**: `created_by_user_email` must exist in the enterprise
2. **Entity Validation**: `entity_name` must exist in the enterprise
3. **Vendor Validation**: Either `factwise_vendor_code` or `ERP_vendor_code` must resolve to a valid vendor
4. **Template Validation**: `template_name` must exist for the entity as a CLM_TEMPLATE type
5. **Date Validation**: `contract_end_date` must be after `contract_start_date`
6. **Identification Validation**: Buyer identifications must exist for the buyer entity
7. **Address Validation**: Addresses must exist for respective entities
8. **Contact Validation**: Contacts must exist and be valid emails
9. **Project Validation**: If provided, project code must exist for the buyer entity
10. **Incoterm Validation**: Incoterm must be a valid abbreviation

### Item Level Validation
1. **Item Code Validation**: Either `ERP_item_code` or `factwise_item_code` must resolve to a valid enterprise item
2. **Currency Validation**: `currency_code_id` must be a valid currency
3. **Measurement Unit Validation**: `measurement_unit_id` must be a valid unit
4. **Attribute Validation**: 
   - If `attribute_name`, `attribute_type`, and `attribute_value` are provided, all three must be present
   - Attributes must exist in the enterprise
5. **Pricing Tier Validation**: At least one pricing tier is required
6. **Incoterm Validation**: Item-level incoterm must be valid

### Pricing Tier Validation
1. **Quantity Range**: `max_quantity` must be greater than `min_quantity`
2. **Rate Validation**: Rate must be a positive decimal
3. **Cost Validation**: Additional costs, taxes, and discounts must reference valid cost definitions

### Additional Cost Validation
1. **Cost Name Validation**: Cost names must exist in the enterprise's additional cost definitions
2. **Field Level Matching**: 
   - Overall costs must have `field_level = OTHER`
   - Item-level costs must have `field_level = ITEM`
3. **Special Discount**: "Overall discount" is a special case that doesn't require a cost definition

---

## Processing Flow

### 1. Pre-Processing
- Validate user email exists in enterprise
- Resolve entity name to entity_id
- Resolve buyer identifications, addresses, contacts
- Resolve vendor via codes (factwise or ERP)
- Resolve seller entity and enterprise from vendor
- Resolve project information if provided
- Resolve incoterm from abbreviation
- Resolve template and get template sections

### 2. Cost Resolution
- Collect all cost names (overall + item-level)
- Fetch existing cost definitions from database
- Build cost maps for quick lookup
- Validate all costs exist (except "Overall discount")

### 3. Item Pre-Processing
- Collect all currency IDs, incoterm names, attribute names
- Fetch and build lookup maps for:
  - Currency codes
  - Incoterms
  - Attributes
  - Item-level additional costs

### 4. Contract Creation
- Create main contract record
- Set created_by_user_id
- Save contract to get contract_id

### 5. Overall Costs Creation
- Create additional cost linkages for contract-level costs
- Bulk create: additional_costs, taxes, discounts

### 6. Custom Sections Creation (Contract Level)
- Validate custom sections against template
- Create custom section records
- Create custom field records
- Bulk create all custom sections and fields

### 7. Contract Items Creation
For each contract item:
- Resolve item code to enterprise_item_id
- Resolve currency and measurement unit
- Process attributes
- Create procurement information structure
- Create pricing information structure
- Save contract item
- Clone item-level attributes from enterprise item
- Create attribute linkages
- Process pricing tiers:
  - Calculate effective rate for each tier
  - Create pricing tier records
  - Create tier-level cost linkages
- Create item-level custom sections and fields

### 8. Bulk Operations
- Bulk create all contract items
- Bulk create all attribute linkages
- Bulk create all attribute value linkages
- Bulk create all pricing tiers
- Bulk create all additional cost linkages (item + tier level)
- Bulk create all custom fields

### 9. Post-Processing
- Trigger pricing repository sync (for pricing repo integration)
- Return custom_contract_id

---

## Response Format

### Success Response (201 Created)
```json
{
  "custom_contract_id": "string"
}
```

The `custom_contract_id` is the system-generated contract identifier (not the UUID).

### Error Responses

#### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

Common validation errors:
- "User email does not exist in the enterprise"
- "Invalid entity"
- "Item with Factwise item Code does not exist"
- "Contract with ERP contract id does not exist"
- "Either factwise_vendor_code or ERP_vendor_code is required"
- "Either factwise_item_code or ERP_item_code is required"
- "attribute_name, attribute_type and attribute_value is required for contract item {index}"

#### 401 Unauthorized
Authentication failure

#### 403 Forbidden
Insufficient permissions

---

## Important Notes

### Pricing Tiers
- Pricing tiers replace the old `rate` and `quantity` fields at the item level
- Each tier defines a quantity range and rate
- The system calculates `effective_rate` based on rate + costs/taxes/discounts
- Item quantity is derived from the maximum `max_quantity` across all tiers

### Custom Sections
- Must match the template structure
- Template sections are validated and auto-filled
- Both contract-level and item-level custom sections are supported

### Attributes
- Item attributes can be explicitly provided
- System also clones attributes from the enterprise item master
- Both custom and standard attributes are supported

### Costs Hierarchy
- Overall costs apply to the entire contract
- Item-level costs apply to specific items
- Tier-level costs apply to specific pricing tiers
- Costs cascade: overall → item → tier

### Identifications
- Buyer identifications are entity-level identifications
- Vendor identifications are custom key-value pairs

### Addresses
- Addresses are referenced by nickname (string) or address_id (UUID)
- System resolves nicknames to actual address records

### Contacts
- Contacts are referenced by email
- System resolves emails to contact records

---

## Example Minimal Payload

```json
{
  "created_by_user_email": "user@example.com",
  "contract_name": "Test Contract",
  "contract_start_date": "2026-01-01",
  "contract_end_date": "2026-12-31",
  "entity_name": "Buyer Entity Name",
  "status": "DRAFT",
  "template_name": "Standard CLM Template",
  "buyer_identifications": [],
  "buyer_address": null,
  "buyer_contact": "buyer@example.com",
  "factwise_vendor_code": "VEND001",
  "ERP_vendor_code": null,
  "vendor_identifications": [],
  "vendor_address": null,
  "vendor_contact": "vendor@example.com",
  "project": null,
  "additional_costs": [],
  "taxes": [],
  "discounts": [],
  "prepayment_percentage": null,
  "payment_type": null,
  "payment_terms": null,
  "deliverables_payment_terms": [],
  "incoterm": "EXW",
  "lead_time": null,
  "lead_time_period": null,
  "custom_sections": [],
  "attachments": [],
  "terms_and_conditions": null,
  "contract_items": [
    {
      "ERP_item_code": null,
      "factwise_item_code": "ITEM001",
      "currency_code_id": "550e8400-e29b-41d4-a716-446655440000",
      "measurement_unit_id": "550e8400-e29b-41d4-a716-446655440001",
      "attributes": [],
      "prepayment_percentage": null,
      "payment_type": null,
      "payment_terms": null,
      "deliverables_payment_terms": [],
      "incoterm": "EXW",
      "lead_time": null,
      "lead_time_period": null,
      "pricing_tiers": [
        {
          "rate": "100.00",
          "min_quantity": "0",
          "max_quantity": "1000",
          "additional_costs": [],
          "taxes": [],
          "discounts": []
        }
      ],
      "attachments": [],
      "custom_sections": []
    }
  ]
}
```

---

**Status**: Complete  
**Last Updated**: 2026-02-13  
**Version**: 1.0
