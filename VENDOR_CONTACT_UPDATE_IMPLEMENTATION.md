# Vendor Contact Update Implementation

## Overview
Implemented the vendor contact update form for the cURLer application. This allows users to modify existing vendor contacts through the API.

## Implementation Details

### 1. Module Registry Update
- Updated `curler/js/module-registry.js`
- Marked `contacts_update` operation as `implemented: true`
- Updated endpoint to `/dev/api/vendors/contacts/update/`
- Method: `PUT`

### 2. Form Implementation
- Added vendor contact update form in `renderFormInputs()` method
- Form includes 4 sections:
  1. **Contact Information** (Required)
     - Modified By User Email (auto-filled from current account)
     - Full Name
     - Primary Email
     - Entity Name
     - Is Primary Contact (Yes/No dropdown)
  
  2. **Vendor Identification**
     - ERP Vendor Code (optional, but at least one required)
     - Factwise Vendor Code (optional, but at least one required)
  
  3. **Additional Contact Details** (Optional)
     - Phone Numbers (comma-separated)
  
  4. **Additional Emails** (Optional)
     - Dynamic email list with type (TO/CC/BCC)
     - Add/Remove functionality

### 3. Helper Methods
- `_addVendorContactEmailUpdate()`: Adds additional email fields dynamically for update form
- `_buildVendorContactUpdatePayload()`: Builds the API payload from form data

### 4. Payload Building
The payload builder:
- Collects all form fields including `is_primary` boolean
- Validates at least one vendor code (ERP or Factwise) is provided
- Parses comma-separated phone numbers into integer array
- Collects additional emails with their types
- Converts `is_primary` string to boolean
- Returns properly formatted JSON payload

### 5. API Integration
- Updated `handleExecute()` to use vendor contact update payload builder
- Updated `_generateCurlCommand()` to handle vendor contact update
- Added vendor contact update to real API call execution

## API Endpoint
```
PUT /dev/api/vendors/contacts/update/
```

## Example Payload
```json
{
  "modified_by_user_email": "devanshimehta404@gmail.com",
  "full_name": "ZOsari",
  "primary_email": "za@fw.com",
  "entity_name": "FactWise Demo - EMS",
  "is_primary": true,
  "ERP_vendor_code": "MDvendorcreate7",
  "factwise_vendor_code": "FacVENDOR120620240416",
  "phone_numbers": [9819186167],
  "emails": [
    {
      "email": "zaansari@gmail.com",
      "type": "CC"
    }
  ]
}
```

## Key Differences from Create
1. **Modified By User Email**: Uses `modified_by_user_email` instead of `created_by_user_email`
2. **Is Primary Field**: Required boolean field to indicate if this is the primary contact
3. **Method**: Uses `PUT` instead of `POST`
4. **Purpose**: Updates existing contact instead of creating new one

## Validation Rules
1. **User Email**: Must be an admin user in the enterprise
2. **Entity Name**: Must exist in the enterprise
3. **Vendor Code**: At least one of ERP_vendor_code or factwise_vendor_code is required
4. **Vendor**: Vendor must exist in the database
5. **Contact**: Contact must exist for the specified vendor and entity
6. **Is Primary**: Boolean value indicating primary contact status

## Error Handling
The API will return errors for:
- User email does not exist in enterprise
- User is not an admin
- Entity not found
- Vendor not found (invalid vendor code)
- Vendor contact does not exist

## Files Modified
1. `curler/js/module-registry.js` - Marked operation as implemented
2. `curler/js/ui-controller.js` - Added form, helpers, and payload builder

## Testing
To test the implementation:
1. Navigate to Vendors → Vendor Contacts Update
2. Fill in the required fields (form has default values from the example)
3. Select whether this is a primary contact
4. Click "Generate cURL" to see the generated command
5. Click "Execute" to make the actual API call
6. Verify the response in the response panel

## Form Default Values
The form includes default values from the provided cURL example:
- Full Name: "ZOsari"
- Primary Email: "za@fw.com"
- Entity Name: "FactWise Demo - EMS"
- ERP Vendor Code: "MDvendorcreate7"
- Factwise Vendor Code: "FacVENDOR120620240416"
- Phone Numbers: "9819186167"
- Is Primary: true

## Notes
- Form auto-fills the modified_by_user_email from the current account
- Phone numbers are parsed as integers (no string formatting)
- Additional emails are optional and can be added dynamically
- The form validates that at least one vendor code is provided before submission
- The `is_primary` field is converted from string to boolean in the payload
