# Vendor Create Implementation Plan

## Status: Ready to Implement

## Overview
Implement vendor create form with dynamic template-based field generation, similar to contract and items implementations.

## Template Structure
- **Template Type**: VENDOR
- **API Endpoint**: `GET /module_templates/?template_type=VENDOR`
- **Built-in Fields**: Vendor name, code, addresses, identifications, contacts, additional costs, tags, notes
- **Custom Fields**: Support for SHORTTEXT, LONGTEXT, FLOAT, DATE, BOOLEAN, CHOICE (multi-select), PERCENTAGE

## Form Sections

### 1. Basic Information
- Created By User Email (auto-filled)
- Vendor Name (required)
- ERP Vendor Code (required)
- Notes (optional textarea)
- Tags (comma-separated)

### 2. Vendor Addresses
- Seller Address Information (array of strings, comma-separated or dynamic add)

### 3. Vendor Identifications
- Dynamic list with:
  - Identification Name
  - Identification Value
  - Add/Remove buttons

### 4. Primary Contact (Required)
- Full Name
- Phone Numbers (comma-separated)
- Primary Email
- Additional Emails (dynamic list with email + type dropdown)

### 5. Secondary Contacts (Optional)
- Dynamic list of contacts, each with:
  - Full Name
  - Phone Numbers
  - Emails (with type)
  - Add/Remove buttons

### 6. Additional Costs (Optional, from template)
- Dynamic list with:
  - Cost Name (dropdown from template)
  - Cost Value
  - Add/Remove buttons

### 7. Custom Fields (from template)
- Dynamically generated based on template
- Support all field types: SHORTTEXT, LONGTEXT, FLOAT, DATE, BOOLEAN, CHOICE, PERCENTAGE

### 8. Entities (Required)
- Entity Name (required, can be multiple)
- Dynamic add/remove

## Implementation Steps

1. **Module Registry** ✅
   - Mark vendor create as implemented
   - Endpoint: `/dev/api/vendors/create/`

2. **Template Loading**
   - Add `_loadVendorTemplates()` method
   - Parse template similar to contract templates
   - Extract built-in and custom fields

3. **Form Rendering**
   - Create comprehensive form in `renderFormInputs()`
   - Use template data to show/hide sections
   - Generate custom fields dynamically

4. **Helper Methods**
   - `_addVendorIdentification()` - Add identification row
   - `_addVendorSecondaryContact()` - Add secondary contact
   - `_addVendorAdditionalCost()` - Add cost row
   - `_addVendorEntity()` - Add entity row

5. **Payload Builder**
   - `_buildVendorCreatePayload()` - Build complete payload
   - Handle nested structures (contacts, identifications, etc.)
   - Parse arrays and custom fields

6. **Integration**
   - Update `handleExecute()` and `_generateCurlCommand()`
   - Add to real API call execution

## Payload Structure
```json
{
  "created_by_user_email": "string",
  "vendor_name": "string",
  "ERP_vendor_code": "string",
  "notes": "string",
  "tags": ["string"],
  "seller_address_information": ["string"],
  "seller_identifications": [
    {
      "identification_name": "string",
      "identification_value": "string"
    }
  ],
  "primary_contact": {
    "full_name": "string",
    "phone_numbers": [number],
    "emails": [
      {
        "primary_email": "string",
        "type": "string"
      }
    ]
  },
  "secondary_contacts": [
    {
      "full_name": "string",
      "phone_numbers": [number],
      "emails": [
        {
          "email": "string",
          "type": "string"
        }
      ]
    }
  ],
  "additional_costs": [
    {
      "name": "string",
      "value": number
    }
  ],
  "custom_sections": [
    {
      "name": "string",
      "custom_fields": [
        {
          "name": "string",
          "value": any
        }
      ]
    }
  ],
  "entities": [
    {
      "entity_name": "string"
    }
  ]
}
```

## Notes
- This is the most complex form after contract create
- Uses template-based dynamic field generation
- Supports nested objects and arrays
- Similar pattern to contract create but with vendor-specific fields
- Will require significant code but follows established patterns
