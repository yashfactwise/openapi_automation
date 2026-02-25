# Vendor Contact Create Implementation

## Overview
Implemented the vendor contact create form for the cURLer application. This allows users to add new vendor contacts through the API.

## Implementation Details

### 1. Module Registry Update
- Updated `curler/js/module-registry.js`
- Marked `contacts_create` operation as `implemented: true`
- Updated endpoint to `/dev/api/vendors/contacts/create/`

### 2. Form Implementation
- Added vendor contact create form in `renderFormInputs()` method
- Form includes 4 sections:
  1. **Contact Information** (Required)
     - Created By User Email (auto-filled from current account)
     - Full Name
     - Primary Email
     - Entity Name
  
  2. **Vendor Identification**
     - ERP Vendor Code (optional, but at least one required)
     - Factwise Vendor Code (optional, but at least one required)
  
  3. **Additional Contact Details** (Optional)
     - Phone Numbers (comma-separated)
  
  4. **Additional Emails** (Optional)
     - Dynamic email list with type (TO/CC/BCC)
     - Add/Remove functionality

### 3. Helper Methods
- `_addVendorContactEmail()`: Adds additional email fields dynamically
- `_buildVendorContactCreatePayload()`: Builds the API payload from form data

### 4. Payload Building
The payload builder:
- Collects all form fields
- Validates at least one vendor code (ERP or Factwise) is provided
- Parses comma-separated phone numbers into integer array
- Collects additional emails with their types
- Returns properly formatted JSON payload

### 5. API Integration
- Updated `handleExecute()` to use vendor contact create payload builder
- Updated `_generateCurlCommand()` to handle vendor contact create
- Added vendor contact create to real API call execution

## API Endpoint
```
POST /dev/api/vendors/contacts/create/
```

## Example Payload
```json
{
  "created_by_user_email": "admin@example.com",
  "full_name": "John Doe",
  "primary_email": "john@vendor.com",
  "entity_name": "FactWise Demo",
  "ERP_vendor_code": "MDvendorcreate7",
  "factwise_vendor_code": "FacVENDOR120620240416",
  "phone_numbers": [1234567890, 9876543210],
  "emails": [
    {
      "email": "contact@vendor.com",
      "type": "CC"
    }
  ]
}
```

## Validation Rules
1. **User Email**: Must be an admin user in the enterprise
2. **Entity Name**: Must exist in the enterprise
3. **Vendor Code**: At least one of ERP_vendor_code or factwise_vendor_code is required
4. **Vendor**: Vendor must exist in the database
5. **Duplicate Check**: System checks if vendor contact already exists for the entity

## Error Handling
The API will return errors for:
- User email does not exist in enterprise
- User is not an admin
- Entity not found
- Vendor not found (invalid vendor code)
- Vendor contact already exists for the entity

## Files Modified
1. `curler/js/module-registry.js` - Marked operation as implemented
2. `curler/js/ui-controller.js` - Added form, helpers, and payload builder
3. `curler/js/payload-builder.js` - Created missing PayloadBuilder class (was referenced but didn't exist)

## Testing
To test the implementation:
1. Navigate to Vendors → Vendor Contacts Create
2. Fill in the required fields
3. Click "Generate cURL" to see the generated command
4. Click "Execute" to make the actual API call
5. Verify the response in the response panel

## Notes
- Form auto-fills the created_by_user_email from the current account
- Phone numbers are parsed as integers (no string formatting)
- Additional emails are optional and can be added dynamically
- The form validates that at least one vendor code is provided before submission
