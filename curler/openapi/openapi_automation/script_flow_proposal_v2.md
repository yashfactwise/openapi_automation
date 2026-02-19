# Contract Payload Builder - Flow Proposal V2 (REVISED)

## Overview
Simplified flow with defaults from your CURL payload. Only asks user for essential fields.

## Default Configuration (Auto-loaded)
```json
{
  "created_by_user_email": "globalfieldsETE@gmail.com",
  "entity_name": "FactWise",
  "buyer_contact": "globalfieldsETE@gmail.com",
  "buyer_address": "Main address",
  "buyer_identifications": ["GST"],
  "factwise_vendor_code": "V001",
  "ERP_vendor_code": null,
  "vendor_contact": "dimple@factwise.io",
  "vendor_address": {"address_id": null, "full_address": "432 Tool Ave, Chicago"},
  "vendor_identifications": [{"identification_name": "Precision Tools Corp.", "identification_value": "901234567"}],
  "template_name": "Open API Test",
  "incoterm": "CFR",
  "project": "P000039",
  "additional_costs": [],
  "taxes": [],
  "discounts": [{"name": "Overall discount", "value": 5}],
  "prepayment_percentage": 0,
  "payment_type": "PER_INVOICE_ITEM",
  "payment_terms": {"term": 1, "period": "MONTHS", "applied_from": "INVOICE_DATE"},
  "deliverables_payment_terms": [],
  "lead_time": "10",
  "lead_time_period": "DAYS",
  "custom_sections": [
    {"name": "Contract Details", "custom_fields": []},
    {"name": "Essential Terms", "section_type": "ITEM", "custom_fields": []},
    {"name": "Payment and Delivery Terms", "section_type": "ITEM", "custom_fields": []}
  ],
  "attachments": [],
  "terms_and_conditions": {"data": "", "name": "FactWise Default TNC"},
  "currency_code_id": "a8c3e3fd-b05f-4d09-bd2f-9fedd07d0ec3",
  "measurement_unit_id": "21213178-90a1-4663-bd7c-8b79dedc295a"
}
```

---

## STEP 1: GLOBAL CONTRACT FIELDS

### Display:
```
═══════════════════════════════════════════════════════════════════
  GLOBAL CONTRACT FIELDS
═══════════════════════════════════════════════════════════════════

Hi! Let's make a CURL request for your dev server account.

I've set some smart defaults:

  1. Contract Name:       OpenAPI - Test Automation
  2. Contract Start Date: 2026-02-13 (today)
  3. Contract End Date:   2026-02-27 (2 weeks from today)

  4. Continue →

Enter 1-3 to change, or 4 to continue:
```

### Options:
- **1**: Change contract name
  - Prompt: `Enter contract name: `
  - Validation: Non-empty string
  
- **2**: Change start date
  - Prompt: `Enter start date (YYYY-MM-DD): `
  - Validation: Must match YYYY-MM-DD format
  - Error: `⚠ Invalid format. Use YYYY-MM-DD (e.g., 2026-02-13)`
  
- **3**: Change end date
  - Prompt: `Enter end date (YYYY-MM-DD): `
  - Validation: Must match YYYY-MM-DD format, must be after start date
  - Error: `⚠ Invalid format. Use YYYY-MM-DD` or `⚠ End date must be after start date`
  
- **4**: Continue

### Fields Set:
- `contract_name`
- `contract_start_date`
- `contract_end_date`

---

## STEP 2: CONTRACT STATUS

### Display:
```
═══════════════════════════════════════════════════════════════════
  CONTRACT STATUS
═══════════════════════════════════════════════════════════════════

What should be the contract status?

  1. DRAFT
  2. SUBMITTED

Enter 1 or 2:
```

### Options:
- **1**: Set status to DRAFT
- **2**: Set status to SUBMITTED

### Validation:
- Must enter 1 or 2
- Error: `⚠ Invalid choice. Enter 1 or 2.`

### Fields Set:
- `status` = "DRAFT" or "SUBMITTED"

---

## STEP 3: TEMPLATE NAME

### Display:
```
═══════════════════════════════════════════════════════════════════
  TEMPLATE NAME
═══════════════════════════════════════════════════════════════════

Current template: Open API Test

  1. Keep current template
  2. Change template name

Enter 1 or 2:
```

### Options:
- **1**: Keep "Open API Test"
- **2**: Change template
  - Prompt: `Enter template name: `
  - Validation: Non-empty string

### Fields Set:
- `template_name`

---

## STEP 4: INCOTERM

### Display:
```
═══════════════════════════════════════════════════════════════════
  INCOTERM
═══════════════════════════════════════════════════════════════════

Current incoterm: CFR

Valid: EXW, FCA, CPT, CIP, DAP, DPU, DDP, FAS, FOB, CFR, CIF

  1. Keep current (CFR)
  2. Change incoterm

Enter 1 or 2:
```

### Options:
- **1**: Keep "CFR"
- **2**: Change incoterm
  - Prompt: `Enter incoterm: `
  - Validation: Must be one of the valid incoterms
  - Error: `⚠ Invalid. Valid: EXW, FCA, CPT, CIP, DAP, DPU, DDP, FAS, FOB, CFR, CIF`

### Fields Set:
- `incoterm`
- `ERP_contract_id` = null

---

## STEP 5: CONTRACT ITEMS

### 5.1 Item List View

### Display:
```
═══════════════════════════════════════════════════════════════════
  CONTRACT ITEMS
═══════════════════════════════════════════════════════════════════

Current items: 0

  1. Add new item
  2. Continue to review →

Enter 1 or 2:
```

### Options:
- **1**: Add item (go to 5.2)
- **2**: Continue to review
  - Validation: Must have at least 1 item
  - Error: `⚠ You must add at least one item`

---

### 5.2 Single Item Setup

### Display:
```
═══════════════════════════════════════════════════════════════════
  ITEM #1
═══════════════════════════════════════════════════════════════════

  1. Factwise Item Code: (not set) - REQUIRED

  2. Measurement Unit: (not set)
     Common units: Kilogram, Meter, Piece, Liter
     (Enter unit name OR UUID if you have it)

  3. Currency: INR (default)
     Options: INR, USD, AED
     (You can change if needed)

  4. Continue to pricing tiers →
  5. Cancel item

Enter 1-3 to change, 4 to continue, or 5 to cancel:
```

### Options:
- **1**: Set Factwise item code
  - Prompt: `Enter Factwise item code: `
  - Validation: Required, cannot be empty
  - Example: `1000_01521-ATC100B270GTN1500X`
  
- **2**: Set measurement unit
  - Prompt: `Enter measurement unit (name or UUID): `
  - Examples shown: `Kilogram, Meter, Piece, Liter`
  - Validation: Required
  - Accepts TWO formats:
    1. **Unit Name** (e.g., "Kilogram", "Meter") - Script maps to UUID
    2. **UUID directly** (e.g., "21213178-90a1-4663-bd7c-8b79dedc295a") - Used as-is
  - Logic: If input looks like UUID format, use it directly; otherwise treat as name and map to UUID
  - Error if name not found: `⚠ Unit name not recognized. Please enter a valid name or UUID.`
  
- **3**: Change currency
  - Prompt: `Enter currency (INR/USD/AED) [INR]: `
  - Default: INR
  - Validation: Must be INR, USD, or AED
  - Note: Script will map currency code to UUID
  - Error: `⚠ Invalid currency. Choose: INR, USD, or AED`
  
- **4**: Continue to pricing tiers (go to 5.3)
  - Validation: Item code and measurement unit must be set
  - Error: `⚠ Item code and measurement unit are required`
  
- **5**: Cancel (return to 5.1)

### Currency Mapping (Internal):
```
INR → a8c3e3fd-b05f-4d09-bd2f-9fedd07d0ec3
USD → [UUID for USD]
AED → [UUID for AED]
```

### Measurement Unit Mapping (Internal):
```
Kilogram → 21213178-90a1-4663-bd7c-8b79dedc295a
Meter    → [UUID for Meter]
Piece    → [UUID for Piece]
Liter    → [UUID for Liter]
(Add more as needed)
```

### Fields Set (per item):
- `ERP_item_code` = null
- `factwise_item_code` (user input - REQUIRED)
- `currency_code_id` (mapped from currency name)
- `measurement_unit_id` (mapped from unit name)
- `incoterm` = inherited from contract (CFR) - NOT shown to user
- `attributes` = []
- `prepayment_percentage` = 100
- `payment_type` = "PER_INVOICE_ITEM"
- `payment_terms` = {"term": 1, "period": "MONTHS", "applied_from": "INVOICE_DATE"}
- `deliverables_payment_terms` = []
- `lead_time` = "10"
- `lead_time_period` = "DAYS"
- `additional_costs` = []
- `taxes` = []
- `discounts` = []
- `attachments` = []
- `custom_sections` = [{"name": "Essential Terms", "custom_fields": []}, {"name": "Payment and Delivery Terms", "custom_fields": []}]

---

### 5.3 Pricing Tiers Count

### Display:
```
───────────────────────────────────────────────────────────────────
  PRICING TIERS
───────────────────────────────────────────────────────────────────

How many pricing tiers for this item? [1]:
```

### Input:
- Prompt: `How many pricing tiers? [1]: `
- Default: 1
- Validation: Positive integer (1, 2, 3, etc.)
- Examples:
  - Enter `1` for single tier pricing
  - Enter `2` for volume-based pricing (e.g., 0-100 @ $10, 100-500 @ $9)
  - Enter `3` or more for multiple volume breaks
- Proceeds to create N tiers (loops through 5.4 for each tier)

### Example Flow:
```
User enters: 2

→ Script will now ask for Tier 1 details (5.4)
→ Then ask for Tier 2 details (5.4)
→ Then show item complete summary (5.5)
```

---

### 5.4 Single Pricing Tier

### Display (Tier 1 of 2):
```
═══════════════════════════════════════════════════════════════════
  TIER #1 of 2 (Item #1)
═══════════════════════════════════════════════════════════════════

  1. Min Quantity: (not set)
  2. Max Quantity: (not set)
  3. Rate:         (not set)
  4. Discounts:    0 items (optional)

  5. Continue to next tier →
  6. Cancel

Enter 1-4 to change, 5 to continue, or 6 to cancel:
```

### Display (Tier 2 of 2):
```
═══════════════════════════════════════════════════════════════════
  TIER #2 of 2 (Item #1)
═══════════════════════════════════════════════════════════════════

  1. Min Quantity: (not set) - Should be 100 (previous tier's max)
  2. Max Quantity: (not set)
  3. Rate:         (not set)
  4. Discounts:    0 items (optional)

  5. Complete item →
  6. Cancel

Enter 1-4 to change, 5 to continue, or 6 to cancel:
```

### Options:
- **1**: Set min quantity
  - Prompt: `Enter minimum quantity: `
  - Validation: Numeric
  - Note: For Tier 2+, suggest using previous tier's max quantity
  - Example: If Tier 1 max = 100, Tier 2 min should be 100
  
- **2**: Set max quantity
  - Prompt: `Enter maximum quantity: `
  - Validation: Numeric, must be > min quantity
  - Error: `⚠ Max must be greater than min`
  
- **3**: Set rate
  - Prompt: `Enter rate per unit: `
  - Validation: Numeric
  - Example: `10.50` or `20`
  
- **4**: Add discounts (optional)
  - Shows sub-menu:
    ```
    Add discount?
    1. Yes - add discount
    2. No - skip
    ```
  - If yes:
    - Prompt: `Enter discount name [Discount]: `
    - Prompt: `Enter discount value (percentage): `
    - Creates: `{"name": "Discount", "value": 10}`
  
- **5**: Continue
  - Validation: Min, max, and rate must be set
  - If more tiers remain: go to next tier (5.4 again with Tier #N)
  - If all tiers complete: show item summary (5.5)
  
- **6**: Cancel (return to 5.3)

### Example 2-Tier Flow:

**Tier 1 Setup:**
```
User enters:
  Min: 0
  Max: 100
  Rate: 10
  Discount: Yes → Name: "Discount", Value: 10

Result: Tier 1 = 0-100 units @ $10/unit (10% discount)
```

**Tier 2 Setup:**
```
User enters:
  Min: 100 (suggested from Tier 1 max)
  Max: 200
  Rate: 20
  Discount: Yes → Name: "Discount", Value: 10

Result: Tier 2 = 100-200 units @ $20/unit (10% discount)
```

**Final Item:**
```
Item with 2 tiers:
  - Tier 1: 0-100 @ $10/unit (10% discount)
  - Tier 2: 100-200 @ $20/unit (10% discount)
```

### Fields Set (per tier):
- `min_quantity`
- `max_quantity`
- `rate`
- `additional_costs` = []
- `taxes` = []
- `discounts` = [] or [{"name": "Discount", "value": X}]

---

### 5.5 Item Complete

### Display (Example with 2 tiers):
```
───────────────────────────────────────────────────────────────────
  ITEM #1 COMPLETE
───────────────────────────────────────────────────────────────────

  ✓ Item: 1000_01521-ATC100B270GTN1500X
  ✓ Measurement Unit: Kilogram
  ✓ Currency: INR
  ✓ Tiers: 2
    - Tier 1: 0-100 units @ ₹10/unit (Discount: 10%)
    - Tier 2: 100-200 units @ ₹20/unit (Discount: 10%)

Add another item? (y/n):
```

### Display (Example with 1 tier):
```
───────────────────────────────────────────────────────────────────
  ITEM #1 COMPLETE
───────────────────────────────────────────────────────────────────

  ✓ Item: WIDGET-A-001
  ✓ Measurement Unit: Piece
  ✓ Currency: USD
  ✓ Tiers: 1
    - Tier 1: 0-1000 units @ $15.50/unit

Add another item? (y/n):
```

### Options:
- **y**: Add another item (return to 5.2 with Item #2)
- **n**: Continue to review (go to Step 6)

### Note:
- Shows all tier details including discounts if added
- Currency symbol shown based on selected currency (₹ for INR, $ for USD, د.إ for AED)
- Works for any number of tiers (1, 2, 3, or more)

---

## STEP 6: REVIEW & GENERATE

### Display:
```
═══════════════════════════════════════════════════════════════════
  REVIEW YOUR CONTRACT
═══════════════════════════════════════════════════════════════════

Contract Summary:

  Name:     OpenAPI - Test Automation
  Period:   2026-02-13 to 2026-02-27
  Status:   DRAFT
  Buyer:    FactWise
  Vendor:   V001
  Template: Open API Test
  Incoterm: CFR
  Items:    2

  1. WIDGET-A (2 tiers)
  2. WIDGET-B (1 tier)

  1. Edit items
  2. Generate payload →
  3. Cancel

Enter 1, 2, or 3:
```

### Options:
- **1**: Edit items (return to 5.1)
- **2**: Generate payload (go to Step 7)
- **3**: Cancel and exit

---

## STEP 7: OUTPUT

### Display:
```
═══════════════════════════════════════════════════════════════════
  SUCCESS!
═══════════════════════════════════════════════════════════════════

  ✓ Payload generated!

  JSON: outputs/contract_payload_20260213_103045.json
  CURL: outputs/contract_curl_20260213_103045.sh

  Next steps:
  1. Update CURL with your API key
  2. Run: bash outputs/contract_curl_20260213_103045.sh

Press Enter to exit...
```

---

## Summary of Changes from V1

### Removed Sections:
- ❌ Section 2: User Information (auto-loaded from config)
- ❌ Section 3: Buyer Information (auto-loaded from config)
- ❌ Section 4: Vendor Information (auto-loaded from config)
- ❌ Section 5: Contract Details (split into separate steps)

### New/Modified Sections:
- ✅ Step 1: Global fields (name, dates) - **with date validation**
- ✅ Step 2: Status selection (1=DRAFT, 2=SUBMITTED) - **NEW**
- ✅ Step 3: Template name (keep or change) - **NEW**
- ✅ Step 4: Incoterm (keep or change) - **NEW**
- ✅ Step 5: Items (simplified with defaults)
- ✅ Step 6: Review
- ✅ Step 7: Output

### Key Improvements:
1. **Date validation**: YYYY-MM-DD format enforced
2. **Defaults from CURL**: All buyer/vendor/template fields pre-filled
3. **Simpler flow**: Only 7 steps instead of 11
4. **Status selection**: Clear 1 or 2 choice
5. **Default UUIDs**: Currency and measurement unit pre-filled

---

## APPROVAL NEEDED

Please confirm:
- [ ] Flow is correct (Steps 1-7)
- [ ] Date validation approach is good
- [ ] Status selection (1=DRAFT, 2=SUBMITTED) is clear
- [ ] Template/incoterm "keep or change" approach works
- [ ] Item defaults (currency, measurement unit) are correct
- [ ] Discount handling in tiers is okay

Once approved, I'll update the Python script!
