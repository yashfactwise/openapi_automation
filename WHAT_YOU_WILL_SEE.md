# What You'll See When You Access Curler in Factwise

## 🌐 Access URLs

You can now access Curler at BOTH:
- **`http://localhost:3000/admin/curler`** (direct URL)
- **`http://localhost:3000/buyer/curler`** (via sidebar)

## 🎯 What You'll See

### 1. Full-Screen Curler Interface

When you navigate to `/admin/curler` or `/buyer/curler`, you'll see:

```
┌─────────────────────────────────────────────────────────────────┐
│ Factwise (just the top bar, if any)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │              ⚡ The cURLer                                │ │
│  │                                                           │ │
│  │  ┌─────────────┐  ┌──────────────────────────────────┐  │ │
│  │  │ Environment │  │                                  │  │ │
│  │  │ ○ Dev       │  │  Dashboard View                  │  │ │
│  │  │ ○ Prod      │  │                                  │  │ │
│  │  │             │  │  Select an operation from        │  │ │
│  │  │ Account     │  │  the modules list to begin       │  │ │
│  │  │ [Select]    │  │                                  │  │ │
│  │  │             │  │  Available Modules:              │  │ │
│  │  │ Modules     │  │  • Contracts (4 operations)      │  │ │
│  │  │ ▼ Contracts │  │  • Purchase Orders (4 ops)       │  │ │
│  │  │   - Create  │  │  • Items (4 operations)          │  │ │
│  │  │   - Update  │  │  • Vendors (6 operations)        │  │ │
│  │  │   - State   │  │  • Projects (2 operations)       │  │ │
│  │  │   - List    │  │  • Costing Sheets (2 ops)        │  │ │
│  │  │ ▼ POs       │  │                                  │  │ │
│  │  │ ▼ Items     │  │                                  │  │ │
│  │  │ ▼ Vendors   │  │                                  │  │ │
│  │  │ ▼ Projects  │  │                                  │  │ │
│  │  │ ▼ Costing   │  │                                  │  │ │
│  │  │             │  │                                  │  │ │
│  │  └─────────────┘  └──────────────────────────────────┘  │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2. When You Select an Operation

For example, clicking "Contracts > Create":

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              ⚡ The cURLer - Create Contract              │ │
│  │                                                           │ │
│  │  ┌─────────────┐  ┌──────────────────────────────────┐  │ │
│  │  │ Sidebar     │  │  Parameters                      │  │ │
│  │  │             │  │                                  │  │ │
│  │  │ Environment │  │  Contract Name: [____________]   │  │ │
│  │  │ ● Dev       │  │  Contract Type: [1-tier ▼]      │  │ │
│  │  │             │  │  Supplier:      [____________]   │  │ │
│  │  │ Account     │  │  Start Date:    [____________]   │  │ │
│  │  │ Test Acc 1  │  │  End Date:      [____________]   │  │ │
│  │  │             │  │                                  │  │ │
│  │  │ Modules     │  │  ┌────────────────────────────┐ │  │ │
│  │  │ ▼ Contracts │  │  │ Generated cURL             │ │  │ │
│  │  │   ● Create  │  │  │                            │ │  │ │
│  │  │   - Update  │  │  │ curl -X POST \             │ │  │ │
│  │  │   - State   │  │  │   https://api... \         │ │  │ │
│  │  │   - List    │  │  │   -H "Authorization: ..." \│ │  │ │
│  │  │             │  │  │   -d '{"name":"..."}'      │ │  │ │
│  │  │             │  │  │                            │ │  │ │
│  │  │             │  │  │ [Copy] [Download] [Execute]│ │  │ │
│  │  │             │  │  └────────────────────────────┘ │  │ │
│  │  │             │  │                                  │  │ │
│  │  └─────────────┘  └──────────────────────────────────┘  │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3. After Executing a Request

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  ... (same as above) ...                                  │ │
│  │                                                           │ │
│  │  ┌──────────────────────────────────────────────────────┐│ │
│  │  │ Response (200 OK) - 234ms                            ││ │
│  │  │                                                       ││ │
│  │  │ {                                                     ││ │
│  │  │   "contract_id": "abc-123",                          ││ │
│  │  │   "name": "Test Contract",                           ││ │
│  │  │   "status": "draft",                                 ││ │
│  │  │   "created_at": "2024-01-15T10:30:00Z"              ││ │
│  │  │ }                                                     ││ │
│  │  │                                                       ││ │
│  │  └──────────────────────────────────────────────────────┘│ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🔑 Key Features You'll See

### Left Sidebar (in Curler)
1. **Environment Selector** - Switch between Dev/Prod
2. **Account Manager** - Select test accounts with pre-filled IDs
3. **Module Navigator** - Browse all 22 API operations

### Main Area
1. **Dashboard** - When no operation selected
2. **Parameter Form** - When operation selected
3. **Generated cURL** - Live preview of the cURL command
4. **Action Buttons** - Copy, Download, Execute
5. **Response Display** - API response with syntax highlighting

## 🎨 Visual Style

Curler has its own design:
- Dark sidebar with light main area
- Modern, clean interface
- Syntax-highlighted code blocks
- Responsive layout
- Professional typography (Inter + JetBrains Mono)

## 🔐 Authentication

**Important:** When loaded in Factwise iframe:
- Curler automatically receives your Factwise token
- No login required
- Token is used for all API calls
- Environment syncs with Factwise (dev/prod)

You'll see in the browser console:
```
Curler running in Factwise iframe mode
API Environment: dev
API URL: https://...
Token synchronized with Factwise
```

## 📱 What You WON'T See

- No Factwise sidebar (Curler takes full screen)
- No Factwise navigation (except maybe top bar)
- No Factwise styling (Curler has its own design)

## 🚀 How to Test

1. **Start Factwise Frontend:**
   ```bash
   cd "Factwise Frontend"
   npm start
   ```

2. **Login as GLOBAL_ADMIN**

3. **Navigate to:**
   - Type in browser: `http://localhost:3000/admin/curler`
   - OR click "OpenAPI Automation" in sidebar (goes to `/buyer/curler`)

4. **You should see:**
   - Curler interface loads
   - Console shows "Running in Factwise iframe mode"
   - Environment selector shows Dev/Prod
   - All 22 operations visible in sidebar

## 🐛 If You Don't See Curler

**Check:**
1. Is Factwise frontend running? (`npm start`)
2. Are you logged in as GLOBAL_ADMIN?
3. Check browser console for errors
4. Verify URL is correct: `/admin/curler` or `/buyer/curler`
5. Check that `REACT_APP_OPENAPI_AUTOMATION_URL` is set in `.env.newdbtest`

**Common Issues:**
- **Blank screen**: Check console for CORS errors
- **404 Not Found**: Route not configured correctly
- **No sidebar option**: Permission check failing
- **"Authentication Required"**: Token not being passed

## 🎯 What Makes This Cool

1. **Seamless Integration** - Looks like part of Factwise
2. **No Separate Login** - Uses your Factwise session
3. **Live Updates** - Any changes to Curler on Vercel appear immediately
4. **Full Functionality** - All Curler features work inside Factwise
5. **Secure** - Token only accessible within iframe

## 📸 Real Example

The actual Curler app is deployed at:
**https://openapi-automation.vercel.app**

You can visit it directly to see what it looks like, but when accessed through Factwise, it automatically receives the authentication token and API configuration!
