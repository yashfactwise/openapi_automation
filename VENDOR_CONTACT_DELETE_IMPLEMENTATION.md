# Vendor Contact Delete Implementation

## Overview
Implemented the vendor contact delete form for the cURLer application. This allows users to permanently remove vendor contacts through the API.

## Implementation Details

### 1. Module Registry Update
- Updated `curler/js/module-registry.js`
- Marked `contacts_delete` operation as `implemented: true`
- Updated endpoint to `/dev/api/vendors/contacts/delete/`
- Method: `DELETE`

### 2. Form Implementation
- Added vendor contact delete form in `renderFormInputs()` method
- Form includes 2 sections:
  1. **Delete Contact Information** (Required)
     - Deleted By User Email (auto-filled from current account)
     - Primary Email (email of contact to delete)
     - Entity Name
  
  2. **Vendor Identification**
     - ERP Vendor Code (optional, but at least one required)
     - Factwise Vendor Code (optional, but at least one required)

  3. **Warning Message**
     - Red warning box indicating the action cannot be undone
     - Alerts user to verify contact information before proceeding

### 3. Helper Methods
- `_buildVendorContactDeletePayload()`: Builds the API payload from form data

### 4. Payload Building
The payload builder:
- Collects minimal required fields (deleted_by_user_email, primary_email, entity_name)
- Validates at least one vendor code (ERP or Factwise) is provided
- Returns properly formatted JSON payload
- No phone numbers or additional emails needed for delete

### 5. API Integration
- Updated `handleExecute()` to use vendor contact delete payload builder
- Updated `_generateCurlCommand()` to handle vendor contact delete
- Added vendor contact delete to real API call execution

## API Endpoint
```
DELETE /dev/api/vendors/contacts/delete/
```

## Example Payload
```json
{
  "deleted_by_user_email": "devanshimehta404@gmail.com",
  "primary_email": "zaa@fw.com",
  "entity_name": "FactWise Demo",
  "ERP_vendor_code": "MDvendorcreate7",
  "factwise_vendor_code": "FacVENDOR120620240416"
}
```

## Key Differences from Create/Update
1. **Deleted By User Email**: Uses `deleted_by_user_email` instead of created/modified
2. **Minimal Fields**: Only requires identification fields (no phone numbers, additional emails, full name, etc.)
3. **Method**: Uses `DELETE` instead of `POST` or `PUT`
4. **Warning UI**: Includes prominent warning message about permanent deletion
5. **Purpose**: Permanently removes contact from the system

## Validation Rules
1. **User Email**: Must be an admin user in the enterprise
2. **Entity Name**: Must exist in the enterprise
3. **Vendor Code**: At least one of ERP_vendor_code or factwise_vendor_code is required
4. **Vendor**: Vendor must exist in the database
5. **Contact**: Contact must exist for the specified vendor and entity
6. **Primary Email**: Must match an existing contact's primary email

## Error Handling
The API will return errors for:
- User email does not exist in enterprise
- User is not an admin
- Entity not found
- Vendor not found (invalid vendor code)
- Vendor contact does not exist
- Contact not found for the specified primary email and entity

## Files Modified
1. `curler/js/module-registry.js` - Marked operation as implemented, changed method to DELETE
2. `curler/js/ui-controller.js` - Added form and payload builder

## Testing
To test the implementation:
1. Navigate to Vendors → Vendor Contacts Delete
2. Fill in the required fields (form has default values from the example)
3. Review the warning message
4. Click "Generate cURL" to see the generated command
5. Click "Execute" to make the actual API call
6. Verify the response in the response panel

## Form Default Values
The form includes default values from the provided cURL example:
- Primary Email: "zaa@fw.com"
- Entity Name: "FactWise Demo"
- ERP Vendor Code: "MDvendorcreate7"
- Factwise Vendor Code: "FacVENDOR120620240416"

## UI/UX Features
- **Red Badge**: "Delete" badge in red to indicate destructive action
- **Warning Box**: Prominent red warning message with:
  - Warning icon (⚠️)
  - Bold warning text
  - Explanation that action cannot be undone
  - Reminder to verify contact information
- **Trash Icon**: 🗑️ icon in section header to indicate delete operation

## Notes
- Form auto-fills the deleted_by_user_email from the current account
- Only essential identification fields are required (no contact details needed)
- The form validates that at least one vendor code is provided before submission
- DELETE method is used instead of POST (as specified in the cURL example)
- Warning message helps prevent accidental deletions
- This is a permanent operation with no undo functionality
