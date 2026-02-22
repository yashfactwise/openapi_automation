# 🚀 Factwise iframe Integration Guide

## Complete Guide to Creating External Apps with Factwise Backend Integration

This guide explains how to create a separate React application that integrates with Factwise using iframes, allowing you to call Factwise backend APIs without managing authentication yourself.

---

## 📖 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [How Authentication Works](#how-authentication-works)
3. [Step-by-Step Implementation](#step-by-step-implementation)
4. [Complete Code Examples](#complete-code-examples)
5. [Deployment Guide](#deployment-guide)
6. [Troubleshooting](#troubleshooting)

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

### STEP 1: Create Your External React App

```bash
# Create new React app
npx create-react-app item-search-app
cd item-search-app

# Install dependencies (if needed)
npm install axios  # Optional: for easier API calls
```

---

### STEP 2: Create Your Main Component

Create `src/ItemSearch.js`:

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

### Example: Using Axios Instead of Fetch

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

### Vercel Deployment (Recommended)

#### Initial Setup

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login
```

#### Deploy

```bash
# Production deployment
vercel --prod

# Development deployment
vercel
```

#### Environment Variables (if needed)

```bash
# Add environment variables via CLI
vercel env add REACT_APP_CUSTOM_VAR

# Or via Vercel dashboard:
# 1. Go to project settings
# 2. Navigate to "Environment Variables"
# 3. Add variables
```

### Alternative: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### Alternative: GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json
"homepage": "https://yourusername.github.io/item-search-app",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

# Deploy
npm run deploy
```

---

## 🐛 Troubleshooting

### Issue 1: "Authentication token not found"

**Cause:** Accessing the external app directly instead of through Factwise iframe.

**Solution:**
- Always access via: `factwise.com/buyer/item-search`
- Never access directly: `item-search-app.vercel.app`

### Issue 2: CORS Errors

**Cause:** Backend not allowing requests from your external domain.

**Solution:** Contact backend team to add your Vercel domain to CORS whitelist:
```python
# In backend settings
CORS_ALLOWED_ORIGINS = [
    'https://item-search-app.vercel.app',
]
```

### Issue 3: 401 Unauthorized

**Cause:** Token expired or invalid.

**Solutions:**
1. Check token is being passed correctly in URL
2. Verify token is included in Authorization header
3. Check token hasn't expired (ask user to refresh Factwise)

```javascript
// Add better error handling
if (response.status === 401) {
  setError('Session expired. Please refresh the Factwise page and try again.');
}
```

### Issue 4: iframe Not Loading

**Cause:** Content Security Policy or X-Frame-Options blocking iframe.

**Solution:** Ensure your external app allows being embedded:

```javascript
// In your external app's public/index.html, remove any X-Frame-Options
// Or in server config, allow framing from Factwise domain
```

### Issue 5: Environment Variables Not Working

**Cause:** Environment variables not loaded in Factwise.

**Solution:**
1. Restart Factwise development server after adding env vars
2. Check correct env file is being used (.env.newdbtest vs .env.production)
3. Verify variable name starts with `REACT_APP_`

---

## 📋 Checklist

### External App Setup
- [ ] Create React app
- [ ] Implement token reading from URL
- [ ] Add API calls with Authorization header
- [ ] Test locally with mock token
- [ ] Deploy to Vercel/Netlify
- [ ] Note deployment URL

### Factwise Integration
- [ ] Add `REACT_APP_YOUR_APP_URL` to env files
- [ ] Create iframe component in App.tsx
- [ ] Add route for your app
- [ ] Add to sidebar (optional)
- [ ] Add permission checks (optional)
- [ ] Test in development
- [ ] Deploy to staging/production

### Testing
- [ ] Test authentication flow
- [ ] Test API calls work correctly
- [ ] Test error handling
- [ ] Test on different browsers
- [ ] Test mobile responsiveness (if needed)

---

## 🎯 Quick Reference

### URL Parameters Passed to Your App

| Parameter | Description | Example |
|-----------|-------------|---------|
| `token` | JWT authentication token | `eyJhbGciOiJIUzI1NiIs...` |
| `api_url` | Factwise backend API URL | `https://api.factwise.com/dev/` |
| `api_env` | Environment (dev/prod) | `dev` or `prod` |
| `can_export` | Export permission flag | `true` or `false` |

### Reading Parameters in Your App

```javascript
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
const apiUrl = urlParams.get('api_url');
const apiEnv = urlParams.get('api_env');
const canExport = urlParams.get('can_export') === 'true';
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

---

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Verify token is being passed in URL
3. Test API endpoint with Postman using the token
4. Check backend logs for authentication errors
5. Contact the Factwise backend team for API issues

---

## 🎉 Success!

You now have a fully integrated external app that:
- ✅ Loads inside Factwise via iframe
- ✅ Authenticates using Factwise tokens
- ✅ Calls Factwise backend APIs
- ✅ Requires no separate authentication setup
- ✅ Deploys independently

Happy coding! 🚀
