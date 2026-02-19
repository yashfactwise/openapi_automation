# The cURLer - API Request Generator

A developer productivity tool for generating and executing cURL requests for OpenAPI endpoints.

## Overview

The cURLer is a single-page web application that streamlines API testing by providing:
- Environment management (dev/prod)
- Account configuration management
- Automatic bearer token handling
- Complete cURL command generation
- Direct API execution with response display

## Phased Implementation

This project is implemented in phases to ensure incremental delivery and validation:

### Phase 1: Core Infrastructure and UI Skeleton ✅ COMPLETE

**Status**: Complete

**Scope**:
- ✅ Environment management (dev/prod toggle with auto-account switching)
- ✅ Account management (CRUD operations, localStorage persistence)
- ✅ Token management (automatic refresh, credential storage)
- ✅ Module/operation navigation (all 22 operations visible in UI)
- ✅ cURL generation (with placeholder payloads)
- ✅ Action buttons (Copy, Download, Execute*)
- ✅ Response display UI
- ✅ Error handling and display

### Phase 2: Contract Module Full Implementation ✅ COMPLETE

**Status**: Complete

**Scope**:
- ✅ Complete Contract API integration
- ✅ Payload building for all 3 Contract operations
- ✅ Templates for 1-tier and 2-tier contracts
- ✅ Real API calls and response handling
- ✅ Execute button functional for Contract operations
- ✅ Form validation and error handling
- ✅ Dynamic form rendering with tier/item inputs

**Contract Operations Implemented**:
1. **Contract Create** - Create contracts with 1-tier or 2-tier templates
2. **Contract Update** - Modify existing contracts (partial updates supported)
3. **Contract State** - Update status or terminate contracts

**Pattern**: Phase 2 establishes the reference implementation pattern for all future modules.

### Phase 3+: Other Modules (Future)

**Scope**:
- Purchase Orders module (4 operations)
- Items module (4 operations)
- Vendors module (6 operations)
- Projects module (2 operations)
- Costing Sheets module (2 operations)

**Pattern**: Each module follows the Contract implementation pattern from Phase 2.

## API Operations

The cURLer supports 22 API operations across 6 modules:

### Contract Module (3 operations)
- Contract Create - Create a new contract
- Contract Update - Modify an existing contract
- Contract State - Update Status/Terminate

### Purchase Order Module (4 operations)
- Purchase Order Create - Create a new purchase order
- Purchase Order Update - Modify an existing purchase order
- Purchase Order State - Update Status
- Purchase Order Terminate - Terminate a purchase order

### Items Module (4 operations)
- Items Create - Create a new item
- Items Bulk Create - Create multiple items
- Items Update - Modify an existing item
- Items Update State - Change Status

### Vendors Module (6 operations)
- Vendors Create - Create a new vendor
- Vendors Update - Modify an existing vendor
- Vendors State - Update Status
- Vendor Contacts Create - Add a vendor contact
- Vendor Contacts Update - Modify a vendor contact
- Vendor Contacts Delete - Remove a vendor contact

### Projects Module (2 operations)
- Project Create - Create a new project
- Project Bulk Create - Create multiple projects

### Costing Sheets Module (2 operations)
- Costing Sheet List - Retrieve costing sheets
- Costing Sheet Mapping - Map costing sheet IDs

## Setup Instructions

### Prerequisites

- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- HTTP server for local development (Python, Node.js, or PHP)

### Installation

1. Clone or download this repository
2. No build step required - this is a vanilla JavaScript application

### Running Locally

Choose one of the following methods to serve the application:

**Python**:
```bash
cd api-curl-generator-webapp
python -m http.server 8000
```

**Node.js**:
```bash
cd api-curl-generator-webapp
npx http-server
```

**PHP**:
```bash
cd api-curl-generator-webapp
php -S localhost:8000
```

Then open your browser to `http://localhost:8000`

## Usage Instructions

### 1. Select Environment

Toggle between Development and Production environments using the environment selector at the top of the page.

- **Dev**: Points to development API endpoints (uses GlobalFields account)
- **Prod**: Points to production API endpoints (uses Syrma SGS account)

Accounts automatically switch when you change environments.

### 2. Manage Accounts

Accounts store test parameters like enterprise_id, buyer_id, entity_name, and user_email.

- Default accounts are created automatically for each environment
- Add new accounts using the "Add Account" button
- Edit existing accounts by clicking the edit icon
- Delete accounts by clicking the delete icon
- Click an account in the sidebar to expand/collapse headers

**Default Accounts**:
- **Dev**: GlobalFields (api_id: 1, enterprise_id: 1, buyer_id: 1)
- **Prod**: Syrma SGS (api_id: syrma_api_id, enterprise_id: ent_prod_001, buyer_id: buy_prod_001)

### 3. Select Operation

Navigate through the module list to find your desired operation:

1. Click on a module (e.g., "Contracts")
2. Click on an operation (e.g., "Contract Create")
3. The operation form will appear

**Phase 2**: Contract operations have full forms with validation and templates.
**Other Modules**: Show placeholder forms (Phase 3+ implementation).

### 4. Use Contract Operations (Phase 2)

#### Contract Create
1. Select a template (1 Tier, 2 Tiers, or Custom)
2. Template auto-populates all fields with sample data
3. Modify any fields as needed
4. Click "Generate cURL" to see the command
5. Click "Execute Request" to make the actual API call

#### Contract Update
1. Enter Contract ID (required)
2. Fill in any fields you want to update (all optional)
3. Click "Generate cURL" or "Execute Request"

#### Contract State
1. Enter Contract ID (required)
2. Select Action (Update Status or Terminate)
3. If Update Status, select a status (DRAFT, ACTIVE, SUSPENDED, COMPLETED)
4. Add optional notes
5. Click "Generate cURL" or "Execute Request"

### 5. Generate cURL

Once you've configured your request:

- **Copy**: Copies the cURL command to your clipboard
- **Download**: Downloads the cURL command as a .sh file
- **Execute**: Makes real API call (Contract operations only in Phase 2)

### 6. View Response

For Contract operations, responses display:

- HTTP status code (color-coded: green for 2xx, yellow for 3xx, red for 4xx/5xx)
- Request execution time in milliseconds
- Response body (formatted JSON)
- Error messages if the request fails

## Testing

### Running Tests

**Unit Tests**:
```bash
npm test
```

**Property-Based Tests**:
```bash
npm run test:property
```

**All Tests**:
```bash
npm run test:all
```

### Test Organization

```
tests/
├── unit/                    # Unit tests for specific examples
│   ├── environment-manager.test.js
│   ├── account-store.test.js
│   ├── token-manager.test.js
│   ├── curl-generator.test.js
│   ├── api-client.test.js
│   └── ui-controller.test.js
├── property/                # Property-based tests for universal properties
│   ├── account-persistence.property.test.js
│   ├── environment-switching.property.test.js
│   ├── curl-generation.property.test.js
│   ├── token-management.property.test.js
│   └── response-display.property.test.js
└── integration/             # End-to-end integration tests
    ├── end-to-end-flow.test.js
    └── storage-integration.test.js
```

## Architecture

### Component Structure

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser UI                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Environment  │  │   Account    │  │   Module     │     │
│  │   Selector   │  │   Manager    │  │  Navigator   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Token      │  │   Account    │  │   Payload    │     │
│  │   Manager    │  │    Store     │  │   Builder    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Browser Storage                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Accounts    │  │ Credentials  │  │ Environment  │     │
│  │   (JSON)     │  │    (JSON)    │  │   (String)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Action → UIController → Application Layer → Data Layer
                   ↓
             UI Update
```

### File Structure

```
api-curl-generator-webapp/
├── index.html                 # Main HTML file
├── css/
│   └── styles.css            # Minimal, functional styles
├── js/
│   ├── main.js               # Application entry point
│   ├── environment-manager.js # Environment configuration
│   ├── account-store.js      # Account data persistence
│   ├── token-manager.js      # Token lifecycle management
│   ├── module-registry.js    # API operation catalog
│   ├── payload-builder.js    # API payload construction (Phase 2+)
│   ├── curl-generator.js     # cURL command formatting
│   ├── api-client.js         # HTTP request execution
│   └── ui-controller.js      # UI coordination
├── tests/
│   ├── unit/                 # Unit tests
│   ├── property/             # Property-based tests
│   └── integration/          # Integration tests
└── README.md                 # This file
```

## Adding New Modules (Phase 2+ Pattern)

When implementing a new module in future phases, follow this pattern:

### 1. Module Definition (module-registry.js)

Add the module and its operations to the registry:

```javascript
{
  id: "new_module",
  name: "New Module",
  operations: [
    {
      id: "create",
      name: "New Module Create",
      description: "Create a new item",
      endpoint: "/openapi/new_module/create/",
      method: "POST",
      implemented: true  // Mark as true when implementing
    }
  ]
}
```

### 2. Payload Builder (payload-builder.js)

Implement the payload construction method:

```javascript
buildNewModuleCreatePayload(account, params) {
  return {
    enterprise_id: account.enterprise_id,
    buyer_id: account.buyer_id,
    // ... other fields from params
  };
}
```

### 3. Add Tests

Create unit tests and property tests for the new module:

```javascript
// tests/unit/new-module.test.js
describe('New Module', () => {
  test('creates valid payload', () => {
    // Test implementation
  });
});

// tests/property/new-module.property.test.js
fc.assert(
  fc.property(accountArb, paramsArb, (account, params) => {
    const payload = builder.buildNewModuleCreatePayload(account, params);
    // Verify properties
  })
);
```

### 4. Update Documentation

Update this README with the new module information.

## Configuration

Environment configurations can be customized by editing `js/environment-manager.js`:

```javascript
environments: {
  dev: {
    name: "Development",
    baseUrl: "https://dev-api.example.com",
    authEndpoint: "/auth/token"
  },
  prod: {
    name: "Production",
    baseUrl: "https://api.example.com",
    authEndpoint: "/auth/token"
  }
}
```

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

No IE11 support (ES6+ features used extensively).

## Security Considerations

- **Credentials**: Stored in browser localStorage (acceptable for dev tool)
- **Warning**: Do not use production credentials in this tool
- **Tokens**: Visible in generated cURL commands (expected behavior for dev tool)
- **HTTPS**: Recommended for production environment access

## Related Documentation

- **Requirements**: `.kiro/specs/api-curl-generator-webapp/requirements.md`
- **Design**: `.kiro/specs/api-curl-generator-webapp/design.md`
- **Tasks**: `.kiro/specs/api-curl-generator-webapp/tasks.md`

## Future Enhancements

Potential features for future phases:

- Request history export (CSV, JSON)
- Saved request templates
- Bulk operation execution
- Response comparison
- API documentation links
- Custom environment configurations
- Request/response filtering
- Dark mode

## License

[Your License Here]

## Contributing

[Your Contributing Guidelines Here]
