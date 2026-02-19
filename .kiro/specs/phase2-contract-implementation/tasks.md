# Phase 2 Implementation Tasks: Contract Module

## Overview

This task list covers the implementation of the Contract module as the first fully functional module in The cURLer. Phase 1 infrastructure is complete and working.

## Prerequisites (Already Complete ✅)

- ✅ Environment Manager (dev/prod switching)
- ✅ Account Store (GlobalFields dev, Syrma SGS prod)
- ✅ Token Manager (auto-refresh)
- ✅ Module Registry (all operations defined)
- ✅ cURL Generator (working)
- ✅ API Client (ready for real calls)
- ✅ UI Controller (dashboard, routing, forms)

## Phase 2 Tasks

### Task 1: Implement Contract Create Payload Builder

**Goal**: Build real payloads for Contract Create operation

- [ ] 1.1 Implement `buildContractCreatePayload(account, params)` in payload-builder.js
  - Accept account object and params object
  - Construct payload with contract_name, vendor_id, start_date, end_date, tiers
  - Each tier should have tier_number, min_quantity, max_quantity, items array
  - Each item should have item_id, item_name, unit_price, quantity
  - Return structured payload object
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6_

- [ ] 1.2 Add validation to `buildContractCreatePayload()`
  - Validate required fields: contract_name, vendor_id, start_date, end_date, tiers
  - Validate tiers array is not empty
  - Validate each tier has required fields
  - Validate each item has required fields
  - Throw descriptive errors for missing fields
  - _Requirements: 1.6_

- [ ] 1.3 Create 1-tier template method
  - Create `getContractCreate1TierTemplate()` method
  - Return template with 1 tier (tier_number: 1, min: 1, max: 100)
  - Include 1 sample item with realistic data
  - _Requirements: 3.1, 3.3, 3.5_

- [ ] 1.4 Create 2-tier template method
  - Create `getContractCreate2TierTemplate()` method
  - Return template with 2 tiers (tier 1: 1-50, tier 2: 51-100)
  - Include 2 sample items with realistic data
  - _Requirements: 3.2, 3.3, 3.5_

### Task 2: Implement Contract Create Form

**Goal**: Create functional form for Contract Create operation

- [ ] 2.1 Update `renderFormInputs()` in ui-controller.js for Contract Create
  - Check if module.id === 'contract' && operation.id === 'create'
  - Render account headers (already working)
  - Add template selector dropdown (1 Tier, 2 Tiers, Custom)
  - Add contract name input (required)
  - Add vendor ID input (required)
  - Add start date input (required)
  - Add end date input (required)
  - _Requirements: 2.1, 2.2_

- [ ] 2.2 Implement template selection logic
  - Add event listener for template selector change
  - When "1 Tier" selected, call `getContractCreate1TierTemplate()` and populate form
  - When "2 Tiers" selected, call `getContractCreate2TierTemplate()` and populate form
  - When "Custom" selected, show empty tier/item inputs
  - _Requirements: 2.2, 3.3, 3.4_

- [ ] 2.3 Render tier and item inputs dynamically
  - For each tier, show: tier_number, min_quantity, max_quantity
  - For each item in tier, show: item_id, item_name, unit_price, quantity
  - Add "Add Tier" button for Custom template
  - Add "Add Item" button for each tier
  - Add "Remove" buttons for tiers and items
  - _Requirements: 2.3, 2.4_

- [ ] 2.4 Implement form validation for Contract Create
  - Validate required fields on input/change
  - Highlight invalid fields with red border
  - Show validation messages below fields
  - Enable/disable Generate and Execute buttons based on validation
  - _Requirements: 2.5, 10.1, 10.2, 10.3, 10.4_

### Task 3: Implement Contract Update Payload Builder

**Goal**: Build real payloads for Contract Update operation

- [ ] 3.1 Implement `buildContractUpdatePayload(account, params)` in payload-builder.js
  - Accept account object and params object
  - Construct payload with contract_id (required)
  - Include only fields that are being updated (contract_name, vendor_id, dates, tiers)
  - Return structured payload object
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 3.2 Add validation to `buildContractUpdatePayload()`
  - Validate contract_id is present
  - Validate at least one field is being updated
  - Throw descriptive errors for missing required fields
  - _Requirements: 4.5_

### Task 4: Implement Contract Update Form

**Goal**: Create functional form for Contract Update operation

- [ ] 4.1 Update `renderFormInputs()` in ui-controller.js for Contract Update
  - Check if module.id === 'contract' && operation.id === 'update'
  - Render account headers
  - Add contract ID input (required)
  - Add contract name input (optional)
  - Add vendor ID input (optional)
  - Add start date input (optional)
  - Add end date input (optional)
  - Add tier/item update inputs (optional)
  - _Requirements: 5.1, 5.2, 5.4_

- [ ] 4.2 Implement form validation for Contract Update
  - Validate contract_id is present
  - Enable/disable buttons based on validation
  - _Requirements: 5.2, 10.1, 10.2_

### Task 5: Implement Contract State Payload Builder

**Goal**: Build real payloads for Contract State operation

- [ ] 5.1 Implement `buildContractStatePayload(account, params)` in payload-builder.js
  - Accept account object and params object
  - Construct payload with contract_id, action, status (if applicable), notes
  - Support actions: "update_status", "terminate"
  - Return structured payload object
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 5.2 Add validation to `buildContractStatePayload()`
  - Validate contract_id is present
  - Validate action is present and valid
  - Validate status is present if action is "update_status"
  - Throw descriptive errors for missing fields
  - _Requirements: 6.5_

### Task 6: Implement Contract State Form

**Goal**: Create functional form for Contract State operation

- [ ] 6.1 Update `renderFormInputs()` in ui-controller.js for Contract State
  - Check if module.id === 'contract' && operation.id === 'state'
  - Render account headers
  - Add contract ID input (required)
  - Add action dropdown (Update Status, Terminate)
  - Add status dropdown (DRAFT, ACTIVE, SUSPENDED, COMPLETED) - conditional
  - Add notes textarea (optional)
  - _Requirements: 7.1, 7.4_

- [ ] 6.2 Implement conditional status field
  - Show status dropdown only when action is "Update Status"
  - Hide status dropdown when action is "Terminate"
  - Update validation based on selected action
  - _Requirements: 7.2_

- [ ] 6.3 Implement form validation for Contract State
  - Validate contract_id is present
  - Validate action is selected
  - Validate status is selected if action is "Update Status"
  - Enable/disable buttons based on validation
  - _Requirements: 7.3, 10.1, 10.2_

### Task 7: Implement Real API Execution

**Goal**: Make actual API calls when Execute button is clicked

- [ ] 7.1 Update `handleExecute()` in ui-controller.js
  - Remove mock response code
  - Build payload using appropriate Payload_Builder method based on operation
  - Get valid token from Token_Manager for current environment
  - Get current environment config from Environment_Manager
  - Get current operation from Module_Registry
  - Call API_Client.executeOperation(environment, operation, payload, token)
  - _Requirements: 8.1, 8.2_

- [ ] 7.2 Display real API response
  - Show response in Response panel
  - Display status code with color coding (green 2xx, yellow 3xx, red 4xx/5xx)
  - Display response headers (collapsible)
  - Display response body (formatted JSON)
  - Display request execution time
  - _Requirements: 8.3, 9.1, 9.2_

- [ ] 7.3 Handle API errors
  - Display error status code and message
  - Show error details in Response panel
  - Log errors to console
  - Allow retry
  - _Requirements: 8.4, 11.1, 11.4_

### Task 8: Enhance Response Display

**Goal**: Improve response panel with better formatting and features

- [ ] 8.1 Add status code color coding
  - Green background for 2xx responses
  - Yellow background for 3xx responses
  - Red background for 4xx/5xx responses
  - _Requirements: 9.1_

- [ ] 8.2 Add collapsible response headers section
  - Show/hide headers on click
  - Format headers as key-value pairs
  - _Requirements: 9.1_

- [ ] 8.3 Add JSON syntax highlighting
  - Format JSON response with proper indentation
  - Add syntax highlighting (optional - can use simple formatting)
  - _Requirements: 9.1_

- [ ] 8.4 Add "Copy Response" button
  - Copy response body to clipboard
  - Show visual feedback on copy
  - _Requirements: 9.2_

### Task 9: Update cURL Generation for Contract Operations

**Goal**: Generate cURL commands with real payloads instead of placeholders

- [ ] 9.1 Update `_generateCurlCommand()` in ui-controller.js
  - For Contract operations, use Payload_Builder methods instead of form inputs
  - Build payload using appropriate method based on operation
  - Pass payload to CurlGenerator
  - Ensure headers are included (api-id, x-api-key)
  - _Requirements: 8.5_

### Task 10: Testing and Validation

**Goal**: Verify all Contract operations work end-to-end

- [ ] 10.1 Test Contract Create with 1-tier template
  - Select Contract Create operation
  - Select "1 Tier" template
  - Verify form is populated with template data
  - Click "Generate cURL" - verify cURL is correct
  - Click "Execute Request" - verify API call works
  - Verify response is displayed correctly

- [ ] 10.2 Test Contract Create with 2-tier template
  - Select "2 Tiers" template
  - Verify form is populated with 2 tiers
  - Generate and execute
  - Verify response

- [ ] 10.3 Test Contract Update
  - Select Contract Update operation
  - Fill in contract ID and fields to update
  - Generate and execute
  - Verify response

- [ ] 10.4 Test Contract State - Update Status
  - Select Contract State operation
  - Select "Update Status" action
  - Select a status
  - Generate and execute
  - Verify response

- [ ] 10.5 Test Contract State - Terminate
  - Select "Terminate" action
  - Verify status field is hidden
  - Generate and execute
  - Verify response

- [ ] 10.6 Test error handling
  - Test with invalid data
  - Test with network errors
  - Test with authentication errors
  - Verify error messages are displayed

- [ ] 10.7 Test environment switching
  - Switch from Dev to Prod
  - Verify account changes (GlobalFields → Syrma SGS)
  - Verify headers update in form
  - Generate cURL and verify headers are correct

### Task 11: Documentation and Cleanup

**Goal**: Update documentation and mark Phase 2 as complete

- [ ] 11.1 Update payload-builder.js comments
  - Mark Contract methods as "Phase 2: IMPLEMENTED"
  - Remove "TODO: Phase 2" comments
  - Add usage examples in comments

- [ ] 11.2 Update module-registry.js
  - Set implemented: true for Contract operations
  - Add comments indicating Phase 2 completion

- [ ] 11.3 Update README.md
  - Mark Phase 2 as complete
  - Document Contract module usage
  - Add examples for each Contract operation

- [ ] 11.4 Create Phase 3 planning document (optional)
  - Identify next module to implement (Purchase Orders?)
  - Document lessons learned from Contract implementation

## Success Checklist

Phase 2 is complete when:

- [ ] All 3 Contract operations have working payload builders
- [ ] All 3 Contract operations have functional forms with validation
- [ ] Templates (1-tier, 2-tier) work correctly
- [ ] Execute button makes real API calls for Contract operations
- [ ] Responses are displayed with proper formatting and color coding
- [ ] cURL generation works with real payloads (not placeholders)
- [ ] Error handling works for all failure scenarios
- [ ] Environment switching updates headers correctly
- [ ] All manual tests pass (Task 10)
- [ ] Documentation is updated

## Notes

- Focus on Contract module only - don't touch other modules yet
- Use Contract as the reference pattern for Phase 3+ modules
- Keep the UI consistent with Phase 1 design
- Maintain backward compatibility with Phase 1 features
- Test thoroughly before marking Phase 2 complete
