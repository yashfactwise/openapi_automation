# Phase 2 Requirements: Contract Module Implementation

## Overview

Phase 2 implements the Contract module as the first fully functional module in The cURLer. This serves as the reference implementation pattern for all future modules (Phase 3+).

**Phase 1 Status**: ✅ Complete
- Environment management (dev/prod switching with auto-account switching)
- Account management (GlobalFields for dev, Syrma SGS for prod)
- Token management (automatic refresh)
- UI infrastructure (dashboard, operation forms, cURL generation)
- All 22 operations visible in UI (placeholders)

**Phase 2 Goal**: Implement full Contract module functionality
- Real payload building for Contract operations
- Form inputs for Contract Create, Update, and State
- Templates for 1-tier and 2-tier contracts
- Real API execution with response display
- Error handling for Contract operations

## Current Implementation Context

### Working Infrastructure (Phase 1)
```
✅ Environment Manager - Dev/Prod switching
✅ Account Store - GlobalFields (dev), Syrma SGS (prod)
✅ Token Manager - Auto-refresh bearer tokens
✅ Module Registry - All 22 operations defined
✅ cURL Generator - Complete formatting with headers
✅ API Client - HTTP request execution ready
✅ UI Controller - Dashboard, forms, routing
```

### Current Accounts
**Dev Environment:**
- Entity: GlobalFields
- Email: globalfieldsETE@gmail.com
- API ID: 1
- Enterprise ID: 1
- Buyer ID: 1
- API Key: b34e0d6295a0f5c5f471c0cc527b5a93

**Prod Environment:**
- Entity: Syrma SGS
- Email: syrma_sgs@example.com
- API ID: syrma_api_id
- Enterprise ID: ent_prod_001
- Buyer ID: buy_prod_001
- API Key: syrma_api_key_placeholder

### API Endpoints (Contract Module)
```
POST /openapi/contract/create/     - Create a new contract
PUT  /openapi/contract/update/     - Modify an existing contract
PUT  /openapi/contract/state/      - Update status or terminate
```

## Requirements

### Requirement 1: Contract Create Payload Building

**User Story:** As a developer, I want to generate valid Contract Create payloads, so that I can create contracts via API.

#### Acceptance Criteria

1. THE Payload_Builder SHALL implement `buildContractCreatePayload(account, params)` method
2. THE payload SHALL include account headers (api_id, enterprise_id, buyer_id, api_key)
3. THE payload SHALL support 1-tier and 2-tier contract structures
4. THE payload SHALL include all required fields:
   - contract_name (string, required)
   - vendor_id (string, required)
   - start_date (ISO date, required)
   - end_date (ISO date, required)
   - tiers (array, required) - each tier with:
     - tier_number (integer)
     - min_quantity (number)
     - max_quantity (number)
     - items (array) - each item with:
       - item_id (string)
       - item_name (string)
       - unit_price (number)
       - quantity (number)
5. THE payload SHALL be compatible with the actual backend API format
6. THE method SHALL validate required fields before returning payload

### Requirement 2: Contract Create Form

**User Story:** As a developer, I want a form to input Contract Create parameters, so that I can customize the contract before generating the request.

#### Acceptance Criteria

1. THE UI Controller SHALL render a Contract Create form with the following inputs:
   - Contract Name (text input, required)
   - Vendor ID (text input, required)
   - Start Date (date input, required)
   - End Date (date input, required)
   - Template Selector (dropdown: "1 Tier", "2 Tiers", "Custom")
2. WHEN a template is selected, THE form SHALL auto-populate with template data
3. THE form SHALL display tier and item inputs based on selected template
4. THE form SHALL allow adding/removing tiers and items for "Custom" template
5. THE form SHALL validate all required fields before enabling "Generate" button
6. THE form SHALL show account headers at the top (as currently implemented)

### Requirement 3: Contract Create Templates

**User Story:** As a developer, I want pre-built templates for common contract structures, so that I can quickly generate test contracts.

#### Acceptance Criteria

1. THE Payload_Builder SHALL provide a 1-tier template with:
   - 1 tier (tier_number: 1)
   - min_quantity: 1, max_quantity: 100
   - 1 commonly used item with sample data
2. THE Payload_Builder SHALL provide a 2-tier template with:
   - Tier 1: min_quantity: 1, max_quantity: 50
   - Tier 2: min_quantity: 51, max_quantity: 100
   - 2 items with sample data
3. WHEN a template is selected, ALL fields SHALL be populated with sensible defaults
4. THE user SHALL be able to modify any template field before generating the request
5. Templates SHALL use realistic sample data (item names, prices, quantities)

### Requirement 4: Contract Update Payload Building

**User Story:** As a developer, I want to generate valid Contract Update payloads, so that I can modify existing contracts via API.

#### Acceptance Criteria

1. THE Payload_Builder SHALL implement `buildContractUpdatePayload(account, params)` method
2. THE payload SHALL include account headers
3. THE payload SHALL include:
   - contract_id (string, required)
   - Fields to update (any combination of contract_name, vendor_id, dates, tiers)
4. THE payload SHALL be compatible with the actual backend API format
5. THE method SHALL validate that contract_id is present

### Requirement 5: Contract Update Form

**User Story:** As a developer, I want a form to input Contract Update parameters, so that I can modify existing contracts.

#### Acceptance Criteria

1. THE UI Controller SHALL render a Contract Update form with:
   - Contract ID (text input, required)
   - Contract Name (text input, optional)
   - Vendor ID (text input, optional)
   - Start Date (date input, optional)
   - End Date (date input, optional)
   - Tier/Item updates (optional)
2. THE form SHALL validate that at least Contract ID is provided
3. THE form SHALL allow partial updates (only changed fields)
4. THE form SHALL show account headers at the top

### Requirement 6: Contract State Payload Building

**User Story:** As a developer, I want to generate valid Contract State payloads, so that I can change contract status or terminate contracts via API.

#### Acceptance Criteria

1. THE Payload_Builder SHALL implement `buildContractStatePayload(account, params)` method
2. THE payload SHALL include account headers
3. THE payload SHALL include:
   - contract_id (string, required)
   - action (string, required: "update_status" or "terminate")
   - status (string, required if action is "update_status")
   - notes (string, optional)
4. THE payload SHALL be compatible with the actual backend API format
5. THE method SHALL validate required fields based on action type

### Requirement 7: Contract State Form

**User Story:** As a developer, I want a form to change contract status or terminate contracts, so that I can manage contract lifecycle.

#### Acceptance Criteria

1. THE UI Controller SHALL render a Contract State form with:
   - Contract ID (text input, required)
   - Action (dropdown: "Update Status", "Terminate")
   - Status (dropdown: "DRAFT", "ACTIVE", "SUSPENDED", "COMPLETED" - shown only if action is "Update Status")
   - Notes (textarea, optional)
2. THE form SHALL show/hide status field based on selected action
3. THE form SHALL validate required fields before enabling "Generate" button
4. THE form SHALL show account headers at the top

### Requirement 8: Real API Execution

**User Story:** As a developer, I want to execute Contract API requests directly from the webapp, so that I can test without copying to terminal.

#### Acceptance Criteria

1. WHEN the "Execute Request" button is clicked, THE UI Controller SHALL:
   - Build the payload using Payload_Builder
   - Get a valid token from Token_Manager
   - Call API_Client.executeOperation() with environment, operation, payload, and token
2. THE API_Client SHALL make the actual HTTP request to the backend
3. THE response SHALL be displayed in the Response panel with:
   - HTTP status code (color-coded: green 2xx, yellow 3xx, red 4xx/5xx)
   - Response headers (collapsible)
   - Response body (formatted JSON)
   - Request execution time
4. IF the request fails, THE error SHALL be displayed with status code and message
5. THE cURL command SHALL still be generated and shown in the cURL panel

### Requirement 9: Response Display Enhancement

**User Story:** As a developer, I want to see detailed API responses, so that I can verify the results and debug issues.

#### Acceptance Criteria

1. THE Response panel SHALL display:
   - Status code with color coding (green: 2xx, yellow: 3xx, red: 4xx/5xx)
   - Response time in milliseconds
   - Response headers (collapsible section)
   - Response body (formatted JSON with syntax highlighting)
2. THE Response panel SHALL have a "Copy Response" button
3. IF the response is an error, THE error message SHALL be highlighted
4. THE Response panel SHALL maintain history of last 5 responses (optional)

### Requirement 10: Form Validation

**User Story:** As a developer, I want real-time form validation, so that I know which fields are required before generating requests.

#### Acceptance Criteria

1. THE form SHALL validate required fields on input/change
2. THE "Generate cURL" button SHALL be enabled when all required fields are filled
3. THE "Execute Request" button SHALL be enabled when all required fields are filled
4. Invalid fields SHALL be highlighted with red border
5. Validation messages SHALL appear below invalid fields
6. THE form SHALL show which fields are required with asterisk (*)

### Requirement 11: Error Handling

**User Story:** As a developer, I want clear error messages when API calls fail, so that I can quickly identify and fix issues.

#### Acceptance Criteria

1. WHEN an API request fails, THE webapp SHALL display:
   - HTTP status code
   - Error message from response body
   - Request details (method, URL)
2. WHEN token refresh fails, THE webapp SHALL display authentication error
3. WHEN network errors occur, THE webapp SHALL display connection error
4. ALL errors SHALL be logged to browser console for debugging
5. THE user SHALL be able to retry failed requests

## Success Criteria

Phase 2 is complete when:

1. ✅ All 3 Contract operations have working payload builders
2. ✅ All 3 Contract operations have functional forms
3. ✅ Templates (1-tier, 2-tier) are implemented and working
4. ✅ Execute button makes real API calls
5. ✅ Responses are displayed with proper formatting
6. ✅ Form validation works for all Contract operations
7. ✅ Error handling works for all failure scenarios
8. ✅ cURL generation works with real payloads (not placeholders)

## Out of Scope (Phase 3+)

The following are NOT part of Phase 2:
- Purchase Order module implementation
- Items module implementation
- Vendors module implementation
- Projects module implementation
- Costing Sheets module implementation
- Advanced features (response history, saved templates, bulk operations)
- Comprehensive test coverage (optional)

## Technical Notes

### Payload Builder Pattern
```javascript
buildContractCreatePayload(account, params) {
  return {
    // Headers are added by API Client, not in body
    contract_name: params.contract_name,
    vendor_id: params.vendor_id,
    start_date: params.start_date,
    end_date: params.end_date,
    tiers: params.tiers.map(tier => ({
      tier_number: tier.tier_number,
      min_quantity: tier.min_quantity,
      max_quantity: tier.max_quantity,
      items: tier.items.map(item => ({
        item_id: item.item_id,
        item_name: item.item_name,
        unit_price: item.unit_price,
        quantity: item.quantity
      }))
    }))
  };
}
```

### Headers (Added by API Client)
```javascript
headers: {
  'api-id': account.api_id,
  'x-api-key': account.api_key,
  'Content-Type': 'application/json'
}
```

### Form Rendering Pattern
```javascript
renderContractCreateForm() {
  // Show account headers (already implemented)
  // Show template selector
  // Show contract fields
  // Show tier/item inputs based on template
  // Validate on input
}
```

## Reference

- Phase 1 Implementation: `curler/` folder
- API Endpoints: Module Registry (`curler/js/module-registry.js`)
- Current UI Pattern: `curler/js/ui-controller.js` (renderFormInputs method)
- Payload Builder Stubs: `curler/js/payload-builder.js`
