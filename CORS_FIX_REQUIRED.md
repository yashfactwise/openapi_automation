# CORS Configuration Required for Item Validation Feature

## Issue
The item validation feature in Curler is blocked by CORS policy when making requests to the Factwise backend.

## Error Message
```
Access to fetch at 'https://poiigw0go0.execute-api.us-east-1.amazonaws.com/dev/organization/items/admin/exists/?code=ITEM_0' 
from origin 'https://openapi-automation.vercel.app' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Root Cause
The Factwise backend API does not include `https://openapi-automation.vercel.app` in its CORS allowed origins list.

## API Endpoint Being Called
- **URL**: `https://poiigw0go0.execute-api.us-east-1.amazonaws.com/dev/organization/items/admin/exists/`
- **Method**: GET
- **Headers**: 
  - `Authorization: Bearer {token}`
  - `Content-Type: application/json`

## Required Fix

### Backend Configuration Change
Add the Curler Vercel domain to the CORS allowed origins in the Factwise backend.

**Location**: Factwise Backend CORS configuration (likely in `settings.py` or API Gateway settings)

**Add this domain**:
```
https://openapi-automation.vercel.app
```

### Example Configuration (Django)
```python
CORS_ALLOWED_ORIGINS = [
    'https://openapi-automation.vercel.app',  # Curler app
    'https://factwise-newdbtest.netlify.app',  # Existing
    'https://apps.factwise.io',  # Existing
    # ... other origins
]
```

### Example Configuration (AWS API Gateway)
If using API Gateway, add CORS configuration:
```json
{
  "Access-Control-Allow-Origin": "https://openapi-automation.vercel.app",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
}
```

## Affected Features
- Item code validation in Contract Create form
- Item code validation in Contract Update form
- Any future features that validate items from Curler

## Testing After Fix
1. Access Curler via Factwise: `/buyer/openapi-automation`
2. Navigate to Contract Create
3. Enter an item code in "Factwise Item Code" field
4. Wait 2 seconds
5. Should see validation feedback (green checkmark or red X)
6. Check Network tab - should see 200 OK response (not 401 or CORS error)

## Priority
**Medium** - Feature is implemented but blocked by CORS. Users can still use Curler for other operations, but item validation won't work until CORS is fixed.

## Contact
For questions about this issue, contact the Curler development team.

---

**Status**: ⏳ Waiting for backend CORS configuration update
**Created**: [Current Date]
**Last Updated**: [Current Date]
