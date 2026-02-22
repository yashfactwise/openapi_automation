# 🚀 Factwise iframe Integration Guide

## Complete Guide to Creating External Apps with Factwise Backend Integration

This guide explains how to create a separate application that integrates with Factwise using iframes, allowing you to call Factwise backend APIs without managing authentication yourself.

**REAL EXAMPLE**: This guide documents the actual integration of Curler (OpenAPI Automation tool) into Factwise, completed on [date]. All code examples are from the real implementation.

---

## 📖 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Real Implementation: Curler Integration](#real-implementation-curler-integration)
3. [How Authentication Works](#how-authentication-works)
4. [Step-by-Step Implementation](#step-by-step-implementation)
5. [Complete Code Examples](#complete-code-examples)
6. [Deployment Guide](#deployment-guide)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Real Implementation: Curler Integration

### What We Built
We integrated **Curler** (OpenAPI Automation tool) into Factwise as an iframe application accessible at `/buyer/openapi-automation`.

### Key Details
- **External App URL**: https://openapi-automation.vercel.app
- **Factwise Route**: `/buyer/openapi-automation`
- **Access Level**: GLOBAL_ADMIN only
- **Sidebar Icon**: Code-slash icon (`bi bi-code-slash`)
- **Integration Type**: Token-based authentication via URL parameters

### Files Modified in Factwise Frontend
1. `env/.env.newdbtest` - Added app URL
2. `src/App.tsx` - Created iframe component and route
3. `src/Components/SideBar/SideBarOptions.tsx` - Added sidebar option
4. `src/Components/SideBar/SideBar.tsx` - Added permission checks

### Files Modified in Curler App
1. `js/factwise-integration.js` - NEW: Handles token reading and integration
2. `index.html` - Added integration script
3. `js/main.js` - Integrated with Factwise token system

---

## 🏗️ Architecture Overview

### The Big Picture

```
┌─────────────────────────────────────────────────────────────────┐
│ Factwise Frontend (factwise.com)                                │
│                                                                  │
│  User visits: /buyer/your-app                                   │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ <iframe>                                               │    │
│  │   src="https://your-app.vercel.app                     │    │
│  │        ?token=eyJhbGc...                               │    │
│  │        &api_url=https://api.factwise.com               │    │
│  │        &api_env=dev"                                   │    │
│  │                                                         │    │
│  │   ┌─────────────────────────────────────────────┐     │    │
│  │   │ Your External App                           │     │    │
│  │   │ - Reads token from URL                      │     │    │
│  │   │ - Calls Factwise APIs with token            │     │    │
│  │   │ - Displays data                             │     │    │
│  │   └─────────────────────────────────────────────┘     │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                   Factwise Backend
                   - Validates token
                   - Returns data
```

### Key Components

1. **Factwise Frontend** (This codebase)
   - Hosts the iframe
   - Passes authentication token via URL
   - Manages user session

2. **Your External App** (Separate codebase)
   - Deployed independently (e.g., Vercel)
   - Reads token from URL parameters
   - Makes authenticated API calls to Factwise backend

3. **Factwise Backend**
   - Validates JWT tokens
   - Returns data to your app

---

## 🔐 How Authentication Works

### The Flow

```
Step 1: User logs into Factwise
   ↓
Step 2: Factwise stores JWT token in localStorage
   ↓
Step 3: User navigates to /buyer/your-app
   ↓
Step 4: Factwise creates iframe with token in URL
   URL: your-app.vercel.app?token=abc123&api_url=...
   ↓
Step 5: Your app reads token from URL
   const token = new URLSearchParams(window.location.search).get('token')
   ↓
Step 6: Your app makes API calls with token
   fetch(apiUrl, { headers: { 'Authorization': `Bearer ${token}` } })
   ↓
Step 7: Backend validates token and returns data
```

### What You DON'T Need

❌ Login page  
❌ Password storage  
❌ JWT generation  
❌ OAuth configuration  
❌ Session management  
❌ User database  

### What You DO Need

✅ Read token from URL parameters  
✅ Include token in API request headers  
✅ Handle token validation errors  

---

## 📝 Step-by-Step Implementation

### REAL EXAMPLE: How We Integrated Curler

This section shows the ACTUAL steps we took to integrate Curler into Factwise.

---

### STEP 1: Deploy Your External App

**What We Did:**
```bash
# Curler was already deployed to Vercel
# URL: https://openapi-automation.vercel.app
```

**Your Turn:**
- Deploy your app to Vercel, Netlify, or any hosting service
- Note down the deployment URL
- Ensure your app can be embedded in an iframe (no X-Frame-Options blocking)

---

### STEP 2: Add Environment Variable to Factwise

**What We Did:**

Edit `Factwise Frontend/env/.env.newdbtest`:

```bash
REACT_APP_ENV = "start"
REACT_APP_API_URL = "https://poiigw0go0.execute-api.us-east-1.amazonaws.com/dev/"
REACT_APP_CLOUDINARY_CLOUD_NAME=djbqcki6c
REACT_APP_CLOUDINARY_UPLOAD_PRESET=support_tickets
GENERATE_SOURCEMAP=false
DISABLE_ESLINT_PLUGIN=true
REACT_APP_STRATEGY_DASHBOARD_URL=https://procurement-dashboard-orcin.vercel.app
REACT_APP_QUOTE_ANALYTICS_URL=https://quote-analytics.vercel.app
REACT_APP_PRICING_DASHBOARD_URL=https://pricing-dashboard-beige.vercel.app
REACT_APP_OPENAPI_AUTOMATION_URL=https://openapi-automation.vercel.app  # ← ADDED THIS
```

**Your Turn:**
- Add `REACT_APP_YOUR_APP_URL=https://your-app.vercel.app`
- Also add to `.env.newdbtest1` and `.env.production` when ready

---

### STEP 3: Create iframe Component in App.tsx

**What We Did:**

Added this component in `Factwise Frontend/src/App.tsx` (after the PricingRepositoryDashboard component):

```typescript
// OpenAPI Automation (Curler) Dashboard Component with postMessage listener
// Admin-only tool for API testing and automation
const OpenAPIAutomationDashboard: React.FC = () => {
    const idToken = localStorage.getItem('idToken');

    // Get external dashboard URL from environment
    const OPENAPI_AUTOMATION_URL =
        process.env.REACT_APP_OPENAPI_AUTOMATION_URL || 'http://localhost:3000';

    // Get API URL from env (same as Factwise uses)
    const apiUrl = process.env.REACT_APP_API_URL;

    // Determine API environment based on REACT_APP_ENV
    const apiEnv =
        process.env.REACT_APP_ENV === 'production' ||
        process.env.REACT_APP_ENV === 'newdbtest1'
            ? 'prod'
            : 'dev';

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (!event.data || !event.data.type) return;

            // Handle NAVIGATE messages from curler iframe
            if (event.data.type === 'NAVIGATE' && event.data.url) {
                console.log(
                    'Factwise received NAVIGATE message from Curler:',
                    event.data.url
                );
                window.open(window.location.origin + event.data.url, '_blank');
            }

            // Handle NAVIGATE_BACK messages - go back in Factwise history
            if (event.data.type === 'NAVIGATE_BACK') {
                console.log('Factwise received NAVIGATE_BACK message from Curler');
                window.history.back();
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
            }}
        >
            <iframe
                src={`${OPENAPI_AUTOMATION_URL}?token=${idToken}&api_env=${apiEnv}&api_url=${encodeURIComponent(
                    apiUrl || ''
                )}`}
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    display: 'block',
                }}
                title="OpenAPI Automation Dashboard"
            />
        </div>
    );
};
```

**Your Turn:**
- Copy this pattern
- Change component name: `YourAppDashboard`
- Change URL variable: `REACT_APP_YOUR_APP_URL`
- Change title: "Your App Dashboard"
- Add any additional URL parameters you need

---

### STEP 4: Add Route in App.tsx

**What We Did:**

In the same `App.tsx` file, inside the `<Switch>` component (around line 310), we added:

```typescript
{/* OpenAPI Automation (Curler) Dashboard */}
<Route
    path="/buyer/openapi-automation"
    component={OpenAPIAutomationDashboard}
/>
{/* OpenAPI Automation Dashboard end */}
```

**Your Turn:**
- Add your route: `path="/buyer/your-app-name"`
- Use your component: `component={YourAppDashboard}`
- Choose appropriate path (buyer/seller/admin)

---

### STEP 5: Add to Sidebar Options

**What We Did:**

Edit `Factwise Frontend/src/Components/SideBar/SideBarOptions.tsx`:

```typescript
export const buyerOptions: Array<IOptionsInterface> = [
    // ... existing options ...
    {
        id: 14,
        name: 'pricing-repository-v2',
        display: 'Pricing Repository V2',
        icon: <i className="bi bi-database"></i>,
    },
    {
        id: 15,
        name: 'openapi-automation',  // ← ADDED THIS
        display: 'OpenAPI Automation',
        icon: <i className="bi bi-code-slash"></i>,
    },
    // ... rest of options ...
];
```

**Important Notes:**
- The `name` field must match your route path (without `/buyer/` prefix)
- Example: `name: 'openapi-automation'` → routes to `/buyer/openapi-automation`
- Choose an appropriate Bootstrap icon from https://icons.getbootstrap.com/

**Your Turn:**
- Add your option with unique ID
- Set `name` to match your route
- Choose appropriate icon
- Set display name

---

### STEP 6: Add Permission Checks in SideBar.tsx

**What We Did:**

Edit `Factwise Frontend/src/Components/SideBar/SideBar.tsx`:

**6a. Add to buyerPermissions object (around line 30):**

```typescript
const buyerPermissions: PermissionInterface = {
    events: {
        permission: false,
        featureAccessPermission: false,
    },
    // ... other permissions ...
    'openapi-automation': {  // ← ADDED THIS
        permission: false,
    },
};
```

**6b. Add permission check in first useEffect (around line 165):**

```typescript
'pricing-repository-v2': {
    permission: checkPermission(
        'GLOBAL_ADMIN',
        null,
        null,
        null
    ),
},
'openapi-automation': {  // ← ADDED THIS
    permission: checkPermission(
        'GLOBAL_ADMIN',
        null,
        null,
        null
    ),
},
requisitions: {
    permission: checkPermission(
        'BUYER',
        'REQUISITION',
        'REQUISITION_VIEW',
        null
    ),
},
```

**6c. Add permission check in second useEffect (around line 335):**

```typescript
'pricing-repository-v2': {
    permission: checkPermission(
        'GLOBAL_ADMIN',
        null,
        null,
        null
    ),
},
'openapi-automation': {  // ← ADDED THIS
    permission: checkPermission(
        'GLOBAL_ADMIN',
        null,
        null,
        null
    ),
},
requisitions: {
    permission: true,
},
```

**Your Turn:**
- Add your app name to all three locations
- Choose appropriate permission level:
  - `'GLOBAL_ADMIN'` - Admin only
  - `'BUYER'` - Buyer users with specific module permission
  - `'SELLER'` - Seller users
- Adjust permission parameters based on your needs

---

### STEP 7: Create Integration Script in Your External App

**What We Did:**

Created `curler/js/factwise-integration.js`:

```javascript
/**
 * Factwise Integration - Handles iframe integration with Factwise platform
 */

class FactwiseIntegration {
    constructor() {
        this.token = null;
        this.apiUrl = null;
        this.apiEnv = null;
        this.isEmbedded = false;

        // Read parameters from URL
        this.readUrlParameters();
    }

    /**
     * Read authentication and configuration from URL parameters
     */
    readUrlParameters() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            
            this.token = urlParams.get('token');
            this.apiUrl = urlParams.get('api_url');
            this.apiEnv = urlParams.get('api_env');

            // If we have a token, we're embedded in Factwise
            this.isEmbedded = !!this.token;

            if (this.isEmbedded) {
                console.log('Running in Factwise iframe mode');
                console.log('API Environment:', this.apiEnv);
                console.log('API URL:', this.apiUrl);
            } else {
                console.log('Running in standalone mode');
            }
        } catch (error) {
            console.error('Failed to read URL parameters:', error);
        }
    }

    /**
     * Check if app is embedded in Factwise
     */
    isEmbeddedInFactwise() {
        return this.isEmbedded;
    }

    /**
     * Get the Factwise authentication token
     */
    getToken() {
        return this.token;
    }

    /**
     * Get the Factwise API URL
     */
    getApiUrl() {
        return this.apiUrl;
    }

    /**
     * Get the API environment
     */
    getApiEnv() {
        return this.apiEnv;
    }

    /**
     * Send a message to the parent Factwise window
     */
    sendMessageToFactwise(type, data = {}) {
        if (!this.isEmbedded) {
            console.warn('Cannot send message: not embedded in Factwise');
            return;
        }

        try {
            window.parent.postMessage(
                {
                    type,
                    ...data
                },
                '*'
            );
            console.log('Message sent to Factwise:', type, data);
        } catch (error) {
            console.error('Failed to send message to Factwise:', error);
        }
    }

    /**
     * Navigate to a Factwise URL
     */
    navigateToFactwise(url) {
        this.sendMessageToFactwise('NAVIGATE', { url });
    }

    /**
     * Go back in Factwise history
     */
    navigateBack() {
        this.sendMessageToFactwise('NAVIGATE_BACK');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FactwiseIntegration;
}
```

**Your Turn:**
- Create similar integration script for your app
- Adapt to your app's architecture (React, Vue, vanilla JS, etc.)
- Add any additional URL parameters you need

---

### STEP 8: Integrate Token in Your App

**What We Did:**

Updated `curler/index.html` to include the integration script:

```html
<!-- JavaScript Modules -->
<script src="js/factwise-integration.js"></script>  <!-- ← ADDED THIS FIRST -->
<script src="js/environment-manager.js"></script>
<script src="js/account-store.js"></script>
<!-- ... other scripts ... -->
```

Updated `curler/js/main.js` to use Factwise token:

```javascript
class Application {
    constructor() {
        // Component instances
        this.factwiseIntegration = null;  // ← ADDED THIS
        this.environmentManager = null;
        this.tokenManager = null;
        // ... other components ...
    }

    async init() {
        try {
            // Initialize all components
            this.initializeComponents();

            // Check for Factwise integration and override if embedded
            this.integrateWithFactwise();  // ← ADDED THIS

            // Load persisted data
            this.loadPersistedData();

            // Initialize UI
            this.uiController.init();

            // ... rest of init ...
        } catch (error) {
            console.error('Failed to initialize application:', error);
        }
    }

    initializeComponents() {
        console.log('Creating component instances...');

        // 0. Factwise Integration (check if embedded)
        this.factwiseIntegration = new FactwiseIntegration();  // ← ADDED THIS
        console.log('✓ FactwiseIntegration created');

        // 1. Environment Manager
        this.environmentManager = new EnvironmentManager();
        console.log('✓ EnvironmentManager created');

        // ... rest of components ...
    }

    /**
     * Integrate with Factwise if running in iframe
     */
    integrateWithFactwise() {  // ← ADDED THIS METHOD
        if (!this.factwiseIntegration.isEmbeddedInFactwise()) {
            console.log('Running in standalone mode - using local configuration');
            return;
        }

        console.log('Integrating with Factwise...');

        // Use Factwise token for API calls
        const token = this.factwiseIntegration.getToken();
        const apiUrl = this.factwiseIntegration.getApiUrl();
        const apiEnv = this.factwiseIntegration.getApiEnv();

        // Override your app's token/auth system here
        // Example: this.tokenManager.setToken(token);
        // Example: this.apiClient.setBaseUrl(apiUrl);

        console.log('✓ Factwise integration complete');
    }
}
```

**Your Turn:**
- Adapt this pattern to your app's architecture
- Override your authentication system with Factwise token
- Ensure API calls use the Factwise token

---

```javascript
import React, { useState, useEffect } from 'react';

function ItemSearch() {
  // State management
  const [itemName, setItemName] = useState('');
  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // ============================================================
  // AUTHENTICATION: Read token and API config from URL
  // ============================================================
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const apiUrl = urlParams.get('api_url');
  const apiEnv = urlParams.get('api_env');

  // Check if token exists on component mount
  useEffect(() => {
    if (!token) {
      setError('Authentication token not found. Please access this from Factwise.');
    }
  }, [token]);

  // ============================================================
  // API CALL: Search for item using Factwise backend
  // ============================================================
  const searchItem = async () => {
    if (!itemName.trim()) {
      setError('Please enter an item name');
      return;
    }
    
    setLoading(true);
    setError(null);
    setItemData(null);
    
    try {
      // Make API call to Factwise backend
      const response = await fetch(`${apiUrl}items/search/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // ← KEY: Include token here!
        },
        body: JSON.stringify({
          search_text: itemName
        })
      });

      // Handle response
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please refresh and try again.');
        }
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setItemData(data);
      
    } catch (err) {
      setError(err.message);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchItem();
    }
  };

  // ============================================================
  // RENDER: Show error if no token
  // ============================================================
  if (!token) {
    return (
      <div style={styles.errorContainer}>
        <h2>🔒 Authentication Required</h2>
        <p>Please access this dashboard from Factwise.</p>
        <p style={{ fontSize: '12px', color: '#666' }}>
          This app must be accessed through the Factwise platform.
        </p>
      </div>
    );
  }

  // ============================================================
  // RENDER: Main UI
  // ============================================================
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>🔍 Item Search</h1>
        <p style={styles.subtitle}>
          Search for items in the Factwise database
        </p>
      </div>

      {/* Search Input */}
      <div style={styles.searchBox}>
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter item name or code..."
          style={styles.input}
          disabled={loading}
        />
        <button 
          onClick={searchItem} 
          style={styles.button}
          disabled={loading}
        >
          {loading ? '⏳ Searching...' : '🔍 Search'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={styles.errorBox}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={styles.loadingBox}>
          <p>Loading item data...</p>
        </div>
      )}
      
      {/* Results */}
      {itemData && !loading && (
        <div style={styles.resultsBox}>
          <h2>📦 Item Details</h2>
          <div style={styles.dataDisplay}>
            <pre>{JSON.stringify(itemData, null, 2)}</pre>
          </div>
        </div>
      )}

      {/* Debug Info (remove in production) */}
      <div style={styles.debugInfo}>
        <small>
          API Environment: {apiEnv} | 
          API URL: {apiUrl?.substring(0, 30)}...
        </small>
      </div>
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================
const styles = {
  container: {
    padding: '40px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  subtitle: {
    color: '#666',
    fontSize: '14px',
  },
  searchBox: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '12px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '4px',
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  errorBox: {
    padding: '15px',
    backgroundColor: '#fee',
    border: '1px solid #fcc',
    borderRadius: '4px',
    color: '#c00',
    marginBottom: '20px',
  },
  loadingBox: {
    padding: '20px',
    textAlign: 'center',
    color: '#666',
  },
  resultsBox: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  dataDisplay: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '4px',
    overflow: 'auto',
    maxHeight: '400px',
  },
  errorContainer: {
    padding: '40px',
    textAlign: 'center',
    color: '#666',
  },
  debugInfo: {
    marginTop: '40px',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#666',
  },
};

export default ItemSearch;
```

---

### STEP 3: Update App.js

Replace `src/App.js` with:

```javascript
import React from 'react';
import ItemSearch from './ItemSearch';
import './App.css';

function App() {
  return (
    <div className="App">
      <ItemSearch />
    </div>
  );
}

export default App;
```

---

### STEP 4: Test Locally

```bash
# Start development server
npm start

# Test with mock token (in browser)
# Visit: http://localhost:3000?token=test123&api_url=https://api.factwise.com/dev/&api_env=dev
```

---

### STEP 5: Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? item-search-app
# - Directory? ./
# - Override settings? No

# You'll get a URL like: https://item-search-app.vercel.app
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Click "Deploy"
5. Copy the deployment URL

---

### STEP 6: Add to Factwise Frontend

#### 6a. Add Environment Variable

Edit `Factwise Frontend/env/.env.newdbtest`:

```bash
# Add this line
REACT_APP_ITEM_SEARCH_URL=https://item-search-app.vercel.app
```

Also add to other environment files:
- `.env.newdbtest1`
- `.env.production` (when ready for production)

#### 6b. Add iframe Component in App.tsx

Open `Factwise Frontend/src/App.tsx` and add this component before the `App` function:

```typescript
// ============================================================
// Item Search Dashboard - External iframe Integration
// ============================================================
const ItemSearchDashboard: React.FC = () => {
    const idToken = localStorage.getItem('idToken');
    const [canExport, setCanExport] = useState<boolean | null>(null);

    // Get external dashboard URL from environment
    const ITEM_SEARCH_URL =
        process.env.REACT_APP_ITEM_SEARCH_URL || 'http://localhost:3000';

    // Get API URL from env (same as Factwise uses)
    const apiUrl = process.env.REACT_APP_API_URL;

    // Determine API environment based on REACT_APP_ENV
    const apiEnv =
        process.env.REACT_APP_ENV === 'production' ||
        process.env.REACT_APP_ENV === 'newdbtest1'
            ? 'prod'
            : 'dev';

    // Optional: Fetch permissions if needed
    useEffect(() => {
        // Add permission check here if needed
        setCanExport(true); // or fetch from API
    }, []);

    // Optional: Handle messages from iframe
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (!event.data || !event.data.type) return;

            // Handle NAVIGATE messages from iframe
            if (event.data.type === 'NAVIGATE' && event.data.url) {
                console.log('Factwise received NAVIGATE message:', event.data.url);
                window.open(window.location.origin + event.data.url, '_blank');
            }

            // Handle NAVIGATE_BACK messages
            if (event.data.type === 'NAVIGATE_BACK') {
                console.log('Factwise received NAVIGATE_BACK message');
                window.history.back();
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
            }}
        >
            <iframe
                src={`${ITEM_SEARCH_URL}?token=${idToken}&api_env=${apiEnv}&api_url=${encodeURIComponent(
                    apiUrl || ''
                )}&can_export=${canExport ?? false}`}
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    display: 'block',
                }}
                title="Item Search Dashboard"
            />
        </div>
    );
};
```

#### 6c. Add Route

In the same `App.tsx` file, inside the `<Switch>` component, add:

```typescript
{/* Item Search Dashboard */}
<Route
    path="/buyer/item-search"
    component={ItemSearchDashboard}
/>
```

---

### STEP 7: Add to Sidebar (Optional)

Edit `Factwise Frontend/src/Components/SideBar/SideBarOptions.tsx`:

```typescript
// Add to the sideBarOptions array
{
    id: 15,
    name: 'item-search',
    display: 'Item Search',
    icon: <i className="bi bi-search"></i>,
    link: '/buyer/item-search',
    type: 'buyer',
    permission: 'ITEM_VIEW', // Use appropriate permission
}
```

---

### STEP 8: Add Permission Check (Optional)

Edit `Factwise Frontend/src/Components/SideBar/SideBar.tsx`:

Add permission check in the `useEffect` where other permissions are checked:

```typescript
// Add this in the permission checking useEffect
(async () => {
    // Check if user has item view permission
    const hasPermission = await checkUserPermission('ITEM_VIEW');
    setPermission((prev) => ({
        ...prev,
        'item-search': { permission: hasPermission },
    }));
})();
```

---

## 📚 Complete Code Examples

### Example 1: Making API Calls with Factwise Token

**In Your External App:**

```javascript
// Read token from Factwise integration
const factwiseIntegration = new FactwiseIntegration();
const token = factwiseIntegration.getToken();
const apiUrl = factwiseIntegration.getApiUrl();

// Make authenticated API call
async function fetchContracts() {
    try {
        const response = await fetch(`${apiUrl}contracts/list/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,  // ← Use Factwise token
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication failed. Please refresh Factwise.');
            }
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}
```

---

### Example 2: Using Axios Instead of Fetch

```javascript
import axios from 'axios';

const factwiseIntegration = new FactwiseIntegration();
const token = factwiseIntegration.getToken();
const apiUrl = factwiseIntegration.getApiUrl();

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: apiUrl,
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
});

// Make API calls
async function createContract(contractData) {
    try {
        const response = await apiClient.post('/contracts/create/', contractData);
        return response.data;
    } catch (error) {
        console.error('Failed to create contract:', error);
        throw error;
    }
}
```

---

### Example 3: Sending Messages to Factwise Parent

```javascript
const factwiseIntegration = new FactwiseIntegration();

// Navigate to a specific contract in Factwise
function openContractInFactwise(contractId) {
    factwiseIntegration.navigateToFactwise(`/buyer/clm/contracts/${contractId}`);
}

// Navigate to events page
function openEventsPage() {
    factwiseIntegration.navigateToFactwise('/buyer/events');
}

// Go back to previous page in Factwise
function goBack() {
    factwiseIntegration.navigateBack();
}

// Example: Add button in your UI
<button onClick={() => openContractInFactwise('contract-123')}>
    View in Factwise
</button>
```

---

### Example 4: Conditional Rendering Based on Embedding

```javascript
const factwiseIntegration = new FactwiseIntegration();

function App() {
    if (!factwiseIntegration.isEmbeddedInFactwise()) {
        // Show standalone mode UI
        return (
            <div className="standalone-mode">
                <h1>🔒 Authentication Required</h1>
                <p>Please access this app through Factwise.</p>
                <a href="https://apps.factwise.io/buyer/your-app">
                    Open in Factwise
                </a>
            </div>
        );
    }

    // Show embedded mode UI
    return (
        <div className="embedded-mode">
            <h1>Your App</h1>
            {/* Your app content */}
        </div>
    );
}
```

---

### Example 5: React Hook for Factwise Integration

```javascript
import { useState, useEffect } from 'react';

function useFactwiseIntegration() {
    const [integration, setIntegration] = useState(null);
    const [isEmbedded, setIsEmbedded] = useState(false);
    const [token, setToken] = useState(null);
    const [apiUrl, setApiUrl] = useState(null);

    useEffect(() => {
        const factwiseIntegration = new FactwiseIntegration();
        setIntegration(factwiseIntegration);
        setIsEmbedded(factwiseIntegration.isEmbeddedInFactwise());
        setToken(factwiseIntegration.getToken());
        setApiUrl(factwiseIntegration.getApiUrl());
    }, []);

    return {
        integration,
        isEmbedded,
        token,
        apiUrl,
        navigateToFactwise: (url) => integration?.navigateToFactwise(url),
        navigateBack: () => integration?.navigateBack(),
    };
}

// Usage in component
function MyComponent() {
    const { isEmbedded, token, apiUrl, navigateToFactwise } = useFactwiseIntegration();

    if (!isEmbedded) {
        return <div>Please access through Factwise</div>;
    }

    return (
        <div>
            <button onClick={() => navigateToFactwise('/buyer/events')}>
                View Events
            </button>
        </div>
    );
}
```

---

### Example 6: Error Handling with Token Expiry

```javascript
async function makeApiCall(endpoint, options = {}) {
    const factwiseIntegration = new FactwiseIntegration();
    const token = factwiseIntegration.getToken();
    const apiUrl = factwiseIntegration.getApiUrl();

    try {
        const response = await fetch(`${apiUrl}${endpoint}`, {
            ...options,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...options.headers,
            }
        });

        if (response.status === 401) {
            // Token expired - ask user to refresh Factwise
            alert('Your session has expired. Please refresh the Factwise page.');
            return null;
        }

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}
```

---

```javascript
import axios from 'axios';

const searchItem = async () => {
  setLoading(true);
  
  try {
    const response = await axios.post(
      `${apiUrl}items/search/`,
      { search_text: itemName },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }
    );
    
    setItemData(response.data);
  } catch (err) {
    setError(err.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};
```

### Example: Multiple API Calls

```javascript
const fetchItemDetails = async (itemId) => {
  // All API calls use the same token
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // Call 1: Get item basic info
  const itemInfo = await fetch(`${apiUrl}items/${itemId}/`, {
    headers
  }).then(r => r.json());

  // Call 2: Get item pricing
  const pricing = await fetch(`${apiUrl}items/${itemId}/pricing/`, {
    headers
  }).then(r => r.json());

  // Call 3: Get item suppliers
  const suppliers = await fetch(`${apiUrl}items/${itemId}/suppliers/`, {
    headers
  }).then(r => r.json());

  return { itemInfo, pricing, suppliers };
};
```

### Example: Sending Messages to Parent (Factwise)

```javascript
// In your external app, send message to Factwise
const navigateToItem = (itemId) => {
  window.parent.postMessage(
    {
      type: 'NAVIGATE',
      url: `/buyer/items/${itemId}`
    },
    '*'
  );
};

const goBack = () => {
  window.parent.postMessage(
    { type: 'NAVIGATE_BACK' },
    '*'
  );
};
```

---

## 🚀 Deployment Guide

### Real Example: Curler Deployment

**Curler is deployed to Vercel:**
- URL: https://openapi-automation.vercel.app
- Deployment: Automatic via Git push
- Environment: Production

### Deploying Your App to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# You'll get a URL like: https://your-app.vercel.app
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Click "Deploy"
5. Copy the deployment URL

#### Option C: Using GitHub Integration

1. Push your code to GitHub
2. Connect GitHub repo to Vercel
3. Automatic deployments on every push
4. Get production URL

---

### Updating Factwise Environment Files

After deploying, update ALL environment files:

**Development:**
```bash
# Factwise Frontend/env/.env.newdbtest
REACT_APP_YOUR_APP_URL=https://your-app.vercel.app
```

**Staging:**
```bash
# Factwise Frontend/env/.env.newdbtest1
REACT_APP_YOUR_APP_URL=https://your-app.vercel.app
```

**Production:**
```bash
# Factwise Frontend/env/.env.production
REACT_APP_YOUR_APP_URL=https://your-app.vercel.app
```

---

### Testing the Integration

#### Local Testing (Development)

1. Start Factwise frontend:
```bash
cd "Factwise Frontend"
npm start
```

2. Login as GLOBAL_ADMIN user

3. Look for your app in sidebar

4. Click to open - should load your Vercel app in iframe

5. Check browser console for:
   - "Running in Factwise iframe mode"
   - Token and API URL logs

#### Production Testing

1. Deploy Factwise frontend to staging/production

2. Login with appropriate permissions

3. Navigate to your app route

4. Verify:
   - App loads correctly
   - API calls work
   - No CORS errors
   - Token is valid

---

## 🐛 Troubleshooting

### Issue 1: "Authentication token not found"

**Cause:** Accessing the external app directly instead of through Factwise iframe.

**Solution:**
- Always access via: `factwise.com/buyer/your-app`
- Never access directly: `your-app.vercel.app`
- Check that token is being passed in URL parameters

**Debug:**
```javascript
// Add this to your app to debug
const urlParams = new URLSearchParams(window.location.search);
console.log('Token:', urlParams.get('token'));
console.log('API URL:', urlParams.get('api_url'));
console.log('API Env:', urlParams.get('api_env'));
```

---

### Issue 2: CORS Errors

**Cause:** Backend not allowing requests from your external domain.

**Solution:** Contact backend team to add your Vercel domain to CORS whitelist:

```python
# In backend settings.py
CORS_ALLOWED_ORIGINS = [
    'https://your-app.vercel.app',
    'https://openapi-automation.vercel.app',  # Curler example
]
```

**Temporary Workaround:** Use Factwise API proxy if available

---

### Issue 3: 401 Unauthorized

**Cause:** Token expired or invalid.

**Solutions:**

1. **Check token is being passed correctly:**
```javascript
const token = new URLSearchParams(window.location.search).get('token');
console.log('Token received:', token ? 'Yes' : 'No');
```

2. **Verify token is included in API calls:**
```javascript
fetch(apiUrl, {
    headers: {
        'Authorization': `Bearer ${token}`,  // ← Must include this
    }
})
```

3. **Handle token expiry:**
```javascript
if (response.status === 401) {
    alert('Session expired. Please refresh the Factwise page.');
}
```

---

### Issue 4: iframe Not Loading

**Cause:** Content Security Policy or X-Frame-Options blocking iframe.

**Solution:** Ensure your external app allows being embedded:

**In your app's server config (if using Express):**
```javascript
app.use((req, res, next) => {
    // Allow embedding from Factwise domains
    res.setHeader('X-Frame-Options', 'ALLOW-FROM https://apps.factwise.io');
    // Or remove X-Frame-Options entirely
    next();
});
```

**In Vercel (vercel.json):**
```json
{
    "headers": [
        {
            "source": "/(.*)",
            "headers": [
                {
                    "key": "X-Frame-Options",
                    "value": "ALLOWALL"
                }
            ]
        }
    ]
}
```

---

### Issue 5: Environment Variables Not Working

**Cause:** Environment variables not loaded in Factwise.

**Solution:**

1. **Restart Factwise development server after adding env vars:**
```bash
# Stop the server (Ctrl+C)
npm start
```

2. **Check correct env file is being used:**
- Development: `.env.newdbtest`
- Staging: `.env.newdbtest1`
- Production: `.env.production`

3. **Verify variable name starts with `REACT_APP_`:**
```bash
# ✅ Correct
REACT_APP_YOUR_APP_URL=https://your-app.vercel.app

# ❌ Wrong (won't be loaded)
YOUR_APP_URL=https://your-app.vercel.app
```

4. **Check variable is being read:**
```javascript
console.log('App URL:', process.env.REACT_APP_YOUR_APP_URL);
```

---

### Issue 6: Sidebar Option Not Showing

**Cause:** Permission check failing or option not configured correctly.

**Debug Steps:**

1. **Check user has correct permission:**
```javascript
// In browser console on Factwise
console.log('User permissions:', authData);
```

2. **Verify option name matches route:**
```typescript
// In SideBarOptions.tsx
{
    name: 'openapi-automation',  // Must match route without /buyer/ prefix
}

// In App.tsx
<Route path="/buyer/openapi-automation" />  // ← Must match
```

3. **Check permission is set in SideBar.tsx:**
```typescript
// Should be in THREE places:
// 1. buyerPermissions object
// 2. First useEffect permission check
// 3. Second useEffect permission check
```

4. **Verify module is not disabled:**
```typescript
// Check authData.disabledModules
if (authData.disabledModules?.includes('YOUR_MODULE')) {
    // Module is disabled
}
```

---

### Issue 7: postMessage Not Working

**Cause:** Message not being sent or received correctly.

**Solution:**

**In your external app:**
```javascript
// Send message to Factwise
window.parent.postMessage(
    {
        type: 'NAVIGATE',
        url: '/buyer/events'
    },
    '*'  // ← Use '*' for any origin, or specify Factwise domain
);
```

**In Factwise App.tsx:**
```typescript
// Listen for messages
useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
        console.log('Message received:', event.data);  // ← Add logging
        
        if (event.data.type === 'NAVIGATE') {
            window.open(window.location.origin + event.data.url, '_blank');
        }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
}, []);
```

---

### Issue 8: App Works Locally But Not in Production

**Possible Causes:**

1. **Environment variable not set in production:**
   - Check `.env.production` has your app URL

2. **HTTPS required:**
   - Ensure your app is deployed with HTTPS (Vercel does this automatically)

3. **CORS not configured for production domain:**
   - Add production domain to backend CORS whitelist

4. **Build errors:**
   - Check Vercel deployment logs
   - Ensure all dependencies are in `package.json`

**Debug:**
```bash
# Check Vercel deployment logs
vercel logs your-app-name

# Test production URL directly
curl https://your-app.vercel.app
```

---

### Issue 9: Token Not Being Used in API Calls

**Cause:** Token not being passed to API client.

**Solution:**

**Check your API client setup:**
```javascript
// ❌ Wrong - token not included
fetch(`${apiUrl}/contracts/`, {
    method: 'GET',
});

// ✅ Correct - token included
fetch(`${apiUrl}/contracts/`, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
    }
});
```

**For Axios:**
```javascript
// Set default header
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Or per request
axios.get('/contracts/', {
    headers: {
        'Authorization': `Bearer ${token}`,
    }
});
```

---

### Issue 10: Real Example - Curler Integration Issues

**Problem:** Curler wasn't reading token from URL

**Solution:** 
1. Created `factwise-integration.js` to read URL parameters
2. Integrated with existing token manager
3. Added logging to verify token was received

**Code:**
```javascript
// In main.js
this.factwiseIntegration = new FactwiseIntegration();
if (this.factwiseIntegration.isEmbeddedInFactwise()) {
    const token = this.factwiseIntegration.getToken();
    console.log('Token received from Factwise:', token ? 'Yes' : 'No');
}
```

---

## 📋 Integration Checklist

### External App Setup
- [ ] Create/deploy your external app
- [ ] Deploy to Vercel/Netlify (get URL)
- [ ] Create `factwise-integration.js` (or equivalent)
- [ ] Read token, api_url, api_env from URL parameters
- [ ] Override your app's auth system with Factwise token
- [ ] Test locally with mock URL parameters
- [ ] Verify API calls include Authorization header
- [ ] Test standalone mode (without Factwise)
- [ ] Test embedded mode (with Factwise token)

### Factwise Frontend Integration
- [ ] Add `REACT_APP_YOUR_APP_URL` to `.env.newdbtest`
- [ ] Add `REACT_APP_YOUR_APP_URL` to `.env.newdbtest1`
- [ ] Add `REACT_APP_YOUR_APP_URL` to `.env.production`
- [ ] Create iframe component in `App.tsx`
- [ ] Add route in `App.tsx` (inside `<Switch>`)
- [ ] Add option to `SideBarOptions.tsx`
- [ ] Add to `buyerPermissions` object in `SideBar.tsx`
- [ ] Add permission check in first `useEffect` in `SideBar.tsx`
- [ ] Add permission check in second `useEffect` in `SideBar.tsx`
- [ ] Choose appropriate icon from Bootstrap Icons
- [ ] Set correct permission level (GLOBAL_ADMIN, BUYER, etc.)

### Testing
- [ ] Test in development environment
- [ ] Verify token is passed in URL
- [ ] Verify API calls work correctly
- [ ] Test error handling (401, 403, etc.)
- [ ] Test postMessage communication (if used)
- [ ] Test on different browsers
- [ ] Test mobile responsiveness (if needed)
- [ ] Test with different user permission levels
- [ ] Verify sidebar option shows/hides correctly
- [ ] Test in staging environment
- [ ] Test in production environment

### Deployment
- [ ] Deploy external app to production
- [ ] Update production environment variables
- [ ] Deploy Factwise frontend to staging
- [ ] Test staging deployment
- [ ] Deploy Factwise frontend to production
- [ ] Verify production deployment
- [ ] Monitor for errors in production

---

## 🎯 Quick Reference

### URL Parameters Passed to Your App

| Parameter | Description | Example |
|-----------|-------------|---------|
| `token` | JWT authentication token | `eyJhbGciOiJIUzI1NiIs...` |
| `api_url` | Factwise backend API URL | `https://api.factwise.com/dev/` |
| `api_env` | Environment (dev/prod) | `dev` or `prod` |

### Reading Parameters in Your App

```javascript
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
const apiUrl = urlParams.get('api_url');
const apiEnv = urlParams.get('api_env');
```

### Making API Calls

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

### Sending Messages to Factwise

```javascript
// Navigate to Factwise URL
window.parent.postMessage({
    type: 'NAVIGATE',
    url: '/buyer/events/123'
}, '*');

// Go back
window.parent.postMessage({
    type: 'NAVIGATE_BACK'
}, '*');
```

### Permission Levels

| Level | Description | Usage |
|-------|-------------|-------|
| `GLOBAL_ADMIN` | Admin users only | Admin tools, system config |
| `BUYER` + module | Buyer users with module permission | Buyer-specific features |
| `SELLER` + module | Seller users with module permission | Seller-specific features |

### File Locations

**Factwise Frontend:**
- Environment: `env/.env.newdbtest`
- iframe Component: `src/App.tsx`
- Sidebar Options: `src/Components/SideBar/SideBarOptions.tsx`
- Sidebar Permissions: `src/Components/SideBar/SideBar.tsx`

**Your External App:**
- Integration Script: `js/factwise-integration.js` (or equivalent)
- Main Entry: Your app's main file

---

## 🎉 Real Integration Example: Curler

### What We Built
- **App**: Curler (OpenAPI Automation tool)
- **URL**: https://openapi-automation.vercel.app
- **Route**: `/buyer/openapi-automation`
- **Access**: GLOBAL_ADMIN only
- **Icon**: Code-slash (`bi bi-code-slash`)

### Files Modified
1. `Factwise Frontend/env/.env.newdbtest` - Added URL
2. `Factwise Frontend/src/App.tsx` - Added component and route
3. `Factwise Frontend/src/Components/SideBar/SideBarOptions.tsx` - Added option
4. `Factwise Frontend/src/Components/SideBar/SideBar.tsx` - Added permissions
5. `Curler/curler/js/factwise-integration.js` - NEW integration script
6. `Curler/curler/index.html` - Added script tag
7. `Curler/curler/js/main.js` - Integrated with token system

### Result
✅ Curler loads in Factwise iframe
✅ Automatically uses Factwise token
✅ No separate login required
✅ Can call Factwise APIs
✅ Admin-only access

---

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Verify token is being passed in URL
3. Test API endpoint with Postman using the token
4. Check backend logs for authentication errors
5. Contact the Factwise backend team for API issues
6. Review this guide's troubleshooting section
7. Check the real Curler implementation as reference

---

## 🔑 Key Takeaways

### What Makes This Integration Work

1. **No Separate Authentication**: Your app uses Factwise's JWT token
2. **URL Parameters**: Token and config passed via iframe URL
3. **Automatic Sync**: Environment and token automatically synchronized
4. **Secure**: Token only accessible within iframe context
5. **Simple**: No complex OAuth or authentication flows

### Best Practices

✅ **Always check if embedded**: Handle both standalone and embedded modes
✅ **Validate token**: Check for token presence before making API calls
✅ **Handle errors gracefully**: Show user-friendly messages for auth failures
✅ **Log for debugging**: Add console logs to track integration status
✅ **Test thoroughly**: Test in all environments (dev, staging, prod)
✅ **Follow the pattern**: Use Curler integration as reference

### Common Mistakes to Avoid

❌ Don't hardcode API URLs - use URL parameters
❌ Don't forget to add Authorization header to API calls
❌ Don't skip permission checks in sidebar
❌ Don't forget to update all environment files
❌ Don't test only in development - test in production too
❌ Don't ignore CORS errors - fix them properly

### When to Use This Pattern

✅ **Good for:**
- Admin tools and utilities
- Data visualization dashboards
- API testing tools
- Analytics and reporting tools
- External integrations that need Factwise data

❌ **Not good for:**
- Core Factwise features (build directly in Factwise)
- Features requiring deep Factwise integration
- Features that need to modify Factwise UI
- Real-time collaborative features

---

## 🎓 Learning Resources

### Related Documentation
- Factwise API Documentation (internal)
- Bootstrap Icons: https://icons.getbootstrap.com/
- Vercel Documentation: https://vercel.com/docs
- React Documentation: https://react.dev/

### Example Implementations
- **Curler**: OpenAPI Automation tool (this repo)
- **Pricing Repository V2**: Pricing dashboard
- **Procurement Strategy Dashboard**: Strategy analytics
- **Quote Analytics**: Quote analysis tool

### Getting Help
- Check this guide first
- Review Curler implementation
- Ask Factwise development team
- Check browser console for errors

---

## 📝 Document History

**Last Updated**: [Current Date]

**Changes:**
- Added real Curler integration example
- Updated all code examples with actual implementation
- Added comprehensive troubleshooting section
- Added detailed step-by-step guide
- Added integration checklist
- Added key takeaways and best practices

**Contributors:**
- Factwise Development Team
- Curler Integration Team

---

## 🎉 Success!

You now have a complete guide to integrating external apps with Factwise via iframe!

**What you learned:**
- ✅ How to create iframe components in Factwise
- ✅ How to pass authentication tokens via URL
- ✅ How to read tokens in your external app
- ✅ How to make authenticated API calls
- ✅ How to add sidebar options and permissions
- ✅ How to deploy and test your integration
- ✅ How to troubleshoot common issues

**Real working example:**
- Curler is live at `/buyer/openapi-automation`
- All code is in this repository
- Follow the same pattern for your app

Happy coding! 🚀
