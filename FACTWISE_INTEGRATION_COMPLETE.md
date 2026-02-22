# Curler - Factwise Integration Complete ✅

## Overview
Curler has been successfully integrated into Factwise as an iframe application, following the same pattern as Pricing Repository V2.

## What Was Done

### 1. Environment Configuration
Added Curler URL to `.env.newdbtest`:
```
REACT_APP_OPENAPI_AUTOMATION_URL=https://openapi-automation.vercel.app
```

### 2. Factwise Frontend Integration

#### App.tsx
- Created `OpenAPIAutomationDashboard` component (similar to PricingRepositoryDashboard)
- Added iframe that loads Curler with authentication parameters
- Added route: `/buyer/openapi-automation`
- Implemented postMessage listener for iframe communication

#### Sidebar Configuration
- Added "OpenAPI Automation" option to `SideBarOptions.tsx`
- Icon: `<i className="bi bi-code-slash"></i>`
- Added permission checks in `SideBar.tsx` (GLOBAL_ADMIN only)

### 3. Curler App Updates

#### New File: `factwise-integration.js`
- Reads token, api_url, and api_env from URL parameters
- Provides methods to check if embedded in Factwise
- Overrides environment and token when embedded
- Supports postMessage communication with parent window

#### Updated: `index.html`
- Added factwise-integration.js script

#### Updated: `main.js`
- Integrated FactwiseIntegration component
- Automatically detects Factwise embedding
- Overrides environment and token when embedded

## How It Works

### URL Parameters Passed to Curler
When accessed via Factwise, Curler receives:
```
https://openapi-automation.vercel.app?token=JWT_TOKEN&api_env=dev&api_url=API_URL
```

### Authentication Flow
1. User logs into Factwise
2. User navigates to `/buyer/openapi-automation`
3. Factwise creates iframe with token in URL
4. Curler reads token from URL parameters
5. Curler uses Factwise token for API calls
6. No separate login required!

### Access Control
- Only GLOBAL_ADMIN users can see the OpenAPI Automation option
- Permission check: `checkPermission('GLOBAL_ADMIN', null, null, null)`

## Testing

### To Test Locally
1. Start Factwise frontend: `npm start`
2. Login as GLOBAL_ADMIN user
3. Look for "OpenAPI Automation" in sidebar (code-slash icon)
4. Click to open Curler in iframe
5. Curler should automatically use Factwise token

### To Test in Production
1. Deploy Curler to Vercel (already done: https://openapi-automation.vercel.app)
2. Update environment variables in production `.env` files
3. Deploy Factwise frontend
4. Access via `/buyer/openapi-automation`

## API Calls from Curler

Curler can now call Factwise APIs using the token:
```javascript
fetch(`${apiUrl}your-endpoint/`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({ your: 'data' })
})
```

The token is automatically available in Curler's TokenManager after Factwise integration.

## Communication with Factwise

Curler can send messages to Factwise:

```javascript
// Navigate to a Factwise URL
app.factwiseIntegration.navigateToFactwise('/buyer/events/123');

// Go back in Factwise history
app.factwiseIntegration.navigateBack();
```

## Files Modified

### Factwise Frontend
- `env/.env.newdbtest` - Added REACT_APP_OPENAPI_AUTOMATION_URL
- `src/App.tsx` - Added OpenAPIAutomationDashboard component and route
- `src/Components/SideBar/SideBarOptions.tsx` - Added openapi-automation option
- `src/Components/SideBar/SideBar.tsx` - Added permission checks

### Curler
- `curler/js/factwise-integration.js` - NEW: Handles Factwise integration
- `curler/index.html` - Added factwise-integration.js script
- `curler/js/main.js` - Integrated FactwiseIntegration component

## Next Steps

1. **Deploy Curler**: Already deployed to https://openapi-automation.vercel.app
2. **Update Other Environments**: Add REACT_APP_OPENAPI_AUTOMATION_URL to:
   - `.env.newdbtest1`
   - `.env.production`
3. **Test**: Login as GLOBAL_ADMIN and test the integration
4. **Customize**: Modify Curler UI to better integrate with Factwise design

## Differences from Pricing Repository V2

1. **No Backend APIs**: Curler doesn't need Factwise backend endpoints (unlike Pricing Repo which has `/pricing_repository/v2/permissions/`)
2. **Simpler Integration**: Just token passing, no permission API calls
3. **Admin Access**: Uses GLOBAL_ADMIN permission (same as Pricing Repo)

## Benefits

✅ No separate authentication for Curler
✅ Seamless integration with Factwise
✅ Automatic token management
✅ Environment synchronization
✅ Secure iframe communication
✅ Admin-only access control

## Support

If you need to:
- Add more API endpoints for Curler to call
- Change access permissions
- Customize the integration
- Add more URL parameters

Just update the relevant files following the patterns established here!
