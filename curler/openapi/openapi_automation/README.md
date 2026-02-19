# OpenAPI Automation - Contract Module

## Overview
This directory contains documentation and tools for automating contract creation via the Factwise OpenAPI.

---

## Directory Structure

```
openapi_automation/
├── README.md                              # This file
├── contracts_context_checklist.md         # Files to review for understanding
├── contract_payload_specification.md      # Complete payload documentation
├── interactive_script_plan.md             # Plan for interactive builder tool
├── modules/                                # (Future) Script modules
├── templates/                              # (Future) Payload templates
├── drafts/                                 # (Future) Saved draft payloads
└── outputs/                                # (Future) Generated payloads
```

---

## Quick Start

### 1. Understanding the Contract API

Start with the **Context Checklist** to understand the codebase:
- `contracts_context_checklist.md` - Systematic checklist of files to review

### 2. Payload Structure

Refer to the **Payload Specification** for complete details:
- `contract_payload_specification.md` - Complete payload structure, validation rules, and examples

### 3. Building Payloads

Use the **Interactive Script** (coming soon):
- `interactive_script_plan.md` - Plan for the interactive payload builder tool

---

## Key Documents

### contracts_context_checklist.md
**Purpose**: Guide for understanding how contracts work in the codebase

**Use when**:
- New to the contract module
- Need to understand data flow
- Debugging contract creation issues
- Planning modifications

**Contents**:
- Contract module files (models, views, services)
- OpenAPI integration files
- Supporting infrastructure
- Key questions to answer
- Analysis workflow

### contract_payload_specification.md
**Purpose**: Complete reference for contract creation payload

**Use when**:
- Creating contract payloads
- Validating payload structure
- Understanding field requirements
- Debugging API errors

**Contents**:
- Complete payload structure (JSON)
- Field details and requirements
- Valid enum values
- Data model references
- Business logic and validation rules
- Processing flow
- Response formats
- Example payloads

### interactive_script_plan.md
**Purpose**: Design document for interactive payload builder tool

**Use when**:
- Implementing the builder script
- Understanding tool architecture
- Planning enhancements
- Reviewing implementation phases

**Contents**:
- Script goals and architecture
- High-level flow
- Module structure
- Key features
- User experience design
- Implementation phases
- Technical considerations
- Testing strategy

---

## API Endpoint Reference

### Create Contract
**Endpoint**: `POST /openapi/contracts/create/`  
**Authentication**: Required (Bearer token)  
**Content-Type**: `application/json`

**Headers**:
```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
X-Enterprise-ID: {enterprise_id}
```

**Response**: 
```json
{
  "custom_contract_id": "string"
}
```

### Update Contract
**Endpoint**: `PUT /openapi/contracts/update/`  
**Authentication**: Required (Bearer token)  
**Content-Type**: `application/json`

### Update Contract Status
**Endpoint**: `PUT /openapi/contracts/status/`  
**Authentication**: Required (Bearer token)  
**Content-Type**: `application/json`

---

## Common Workflows

### Creating a Minimal Contract

1. **Gather Required Information**:
   - User email (must exist in enterprise)
   - Contract name, start date, end date
   - Buyer entity name
   - Vendor code (Factwise or ERP)
   - Buyer and vendor contact emails
   - Template name
   - At least one item with:
     - Item code (Factwise or ERP)
     - Currency ID
     - Measurement unit ID
     - At least one pricing tier

2. **Build Payload**:
   - Use the minimal example from `contract_payload_specification.md`
   - Fill in required fields
   - Validate against specification

3. **Submit Request**:
   - POST to `/openapi/contracts/create/`
   - Include authentication headers
   - Handle response

### Creating a Complex Multi-Item Contract

1. **Plan Structure**:
   - Define all contract items
   - Plan pricing tiers for each item
   - Identify costs at each level (overall, item, tier)
   - Prepare custom sections

2. **Build Incrementally**:
   - Start with contract-level information
   - Add items one by one
   - Add pricing tiers for each item
   - Add costs at appropriate levels
   - Add custom sections

3. **Validate**:
   - Check all required fields
   - Validate enum values
   - Verify quantity ranges in tiers
   - Ensure cost names exist

4. **Submit and Verify**:
   - Submit payload
   - Verify response
   - Check contract in system

---

## Validation Checklist

Before submitting a payload, verify:

### Contract Level
- [ ] `created_by_user_email` exists in enterprise
- [ ] `contract_name` is unique
- [ ] `contract_start_date` < `contract_end_date`
- [ ] `entity_name` exists in enterprise
- [ ] `status` is "DRAFT" or "SUBMITTED"
- [ ] `template_name` exists for entity
- [ ] Either `factwise_vendor_code` OR `ERP_vendor_code` provided
- [ ] `buyer_contact` is valid email
- [ ] `vendor_contact` is valid email
- [ ] `incoterm` is valid abbreviation

### Item Level (for each item)
- [ ] Either `ERP_item_code` OR `factwise_item_code` provided
- [ ] `currency_code_id` is valid UUID
- [ ] `measurement_unit_id` is valid UUID
- [ ] `incoterm` is valid abbreviation
- [ ] At least one pricing tier provided

### Pricing Tier (for each tier)
- [ ] `rate` is positive decimal
- [ ] `min_quantity` < `max_quantity`
- [ ] Quantity ranges don't overlap with other tiers

### Costs (if provided)
- [ ] Cost names exist in enterprise
- [ ] Overall costs have `field_level = OTHER`
- [ ] Item costs have `field_level = ITEM`

---

## Troubleshooting

### Common Errors

#### "User email does not exist in the enterprise"
**Cause**: The `created_by_user_email` is not registered in the enterprise  
**Solution**: Verify the email or create the user first

#### "Invalid entity"
**Cause**: The `entity_name` doesn't exist in the enterprise  
**Solution**: Check entity name spelling or create the entity

#### "Either factwise_vendor_code or ERP_vendor_code is required"
**Cause**: Both vendor code fields are null  
**Solution**: Provide at least one vendor code

#### "Item with Factwise item Code does not exist"
**Cause**: The `factwise_item_code` doesn't exist  
**Solution**: Verify item code or use `ERP_item_code` instead

#### "attribute_name, attribute_type and attribute_value is required"
**Cause**: Incomplete attribute definition  
**Solution**: Provide all three fields or remove the attribute

#### Validation errors on enum fields
**Cause**: Invalid enum value  
**Solution**: Check valid values in specification document

---

## Best Practices

### Payload Construction
1. **Start Simple**: Begin with minimal required fields
2. **Validate Early**: Validate each section before moving to the next
3. **Use Templates**: Create reusable templates for common scenarios
4. **Test Incrementally**: Test with simple payloads before complex ones

### Error Handling
1. **Log Everything**: Keep detailed logs of API requests and responses
2. **Validate Before Submit**: Use client-side validation to catch errors early
3. **Handle Partial Failures**: Plan for scenarios where some items succeed
4. **Retry Logic**: Implement exponential backoff for transient errors

### Data Management
1. **Reference Data**: Cache frequently used IDs (currencies, units, etc.)
2. **Vendor Codes**: Maintain a mapping of vendor codes
3. **Item Codes**: Keep item code mappings up to date
4. **Cost Names**: Document available cost names

### Security
1. **API Keys**: Never hardcode API keys
2. **Environment Variables**: Use environment variables for sensitive data
3. **Audit Logs**: Log all contract creation attempts
4. **Access Control**: Verify user permissions before submission

---

## Development Roadmap

### Completed
- ✅ Context checklist for understanding codebase
- ✅ Complete payload specification
- ✅ Interactive script planning

### In Progress
- 🔄 Interactive payload builder script (Phase 1)

### Planned
- ⏳ Interactive payload builder (Phases 2-6)
- ⏳ Payload validation library
- ⏳ Template library
- ⏳ Batch creation tool
- ⏳ Web UI
- ⏳ Integration tests

---

## Contributing

### Adding Documentation
1. Follow the existing structure
2. Use clear, concise language
3. Include examples
4. Update this README

### Adding Tools
1. Place scripts in appropriate directories
2. Document usage in README
3. Include error handling
4. Add tests

### Reporting Issues
1. Check existing documentation first
2. Provide complete error messages
3. Include payload examples (sanitized)
4. Describe expected vs actual behavior

---

## Resources

### Internal Documentation
- `docs/PRICING_REPOSITORY_CONTRACT_DEEP_DIVE.md` - Contract pricing details
- `factwise/contract/` - Contract module source code
- `factwise/openapi/` - OpenAPI module source code

### API Documentation
- OpenAPI schema (if available)
- Postman collection (if available)

### Related Modules
- Purchase Orders
- RFQs
- Quotes
- Invoices

---

## Contact

For questions or support:
- Review the documentation in this directory
- Check the context checklist for code references
- Consult the payload specification for API details

---

**Last Updated**: 2026-02-13  
**Version**: 1.0  
**Maintainer**: Development Team
