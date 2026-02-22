/**
 * Module Registry - Defines all API modules and operations
 * 
 * Phase 1: FULLY IMPLEMENTED
 * - All 6 modules defined (Contracts, Purchase Orders, Items, Vendors, Projects, Costing Sheets)
 * - All 22 operations defined with correct endpoints and HTTP methods
 * - All operations marked as implemented: false for Phase 1
 * - Module and operation lookup methods
 * 
 * Phase 2: Contract module operations will be marked as implemented: true
 * Phase 3+: Other module operations will be marked as implemented: true
 * 
 * Related specs:
 * - Requirements: .kiro/specs/api-curl-generator-webapp/requirements.md (Req 4.1, 5.1, 6.1, 7.1, 8.1, 9.1, 16.3)
 * - Design: .kiro/specs/api-curl-generator-webapp/design.md
 */

/**
 * COMPLETE API ENDPOINT LIST
 * 
 * This webapp provides cURL generation for the following 21 API operations:
 * 
 * CONTRACTS MODULE (3 operations):
 * - POST   /openapi/contract/create/           - Create a new contract
 * - PUT    /openapi/contract/update/           - Modify an existing contract
 * - PUT    /openapi/contract/state/            - Update contract status or terminate
 * 
 * PURCHASE ORDERS MODULE (4 operations):
 * - POST   /openapi/purchase_order/create/     - Create a new purchase order
 * - PUT    /openapi/purchase_order/update/     - Modify an existing purchase order
 * - PUT    /openapi/purchase_order/state/      - Update purchase order status
 * - PUT    /openapi/purchase_order/terminate/  - Terminate a purchase order
 * 
 * ITEMS MODULE (4 operations):
 * - POST   /openapi/items/create/              - Create a new item
 * - POST   /openapi/items/bulk-create/         - Create multiple items
 * - PUT    /openapi/items/update/              - Modify an existing item
 * - PUT    /openapi/items/update/state/        - Change item status
 * 
 * VENDORS MODULE (6 operations):
 * - POST   /openapi/vendors/create/            - Create a new vendor
 * - PUT    /openapi/vendors/update/            - Modify an existing vendor
 * - PUT    /openapi/vendors/state/             - Update vendor status
 * - POST   /openapi/vendors/contacts/create/   - Add a vendor contact
 * - PUT    /openapi/vendors/contacts/update/   - Modify a vendor contact
 * - POST   /openapi/vendors/contacts/delete/   - Remove a vendor contact
 * 
 * PROJECTS MODULE (2 operations):
 * - POST   /openapi/project/create/            - Create a new project
 * - POST   /openapi/project/bulk-create/       - Create multiple projects
 * 
 * COSTING SHEETS MODULE (2 operations):
 * - GET    /openapi/costing-sheet/             - Retrieve costing sheets
 * - PUT    /openapi/costing-sheet/mapping/     - Map costing sheet IDs
 */

class ModuleRegistry {
    constructor() {
        this.modules = [
            {
                id: "contract",
                name: "Contracts",
                operations: [
                    {
                        id: "create",
                        name: "Contract Create",
                        description: "Create a new contract",
                        endpoint: "/dev/api/contract/create/",
                        method: "POST",
                        implemented: true // Phase 2: IMPLEMENTED
                    },
                    {
                        id: "update",
                        name: "Contract Update",
                        description: "Modify an existing contract",
                        endpoint: "/dev/api/contract/update/",
                        method: "PUT",
                        implemented: true // Phase 2: IMPLEMENTED
                    },
                    {
                        id: "state",
                        name: "Contract State",
                        description: "Update status or terminate contract",
                        endpoint: "/dev/api/contract/state/",
                        method: "PUT",
                        implemented: true // Phase 2: IMPLEMENTED
                    }
                ]
            },
            {
                id: "purchase_order",
                name: "Purchase Orders",
                operations: [
                    {
                        id: "create",
                        name: "Purchase Order Create",
                        description: "Create a new purchase order",
                        endpoint: "/openapi/purchase_order/create/",
                        method: "POST",
                        implemented: false // Phase 3+: will be true
                    },
                    {
                        id: "update",
                        name: "Purchase Order Update",
                        description: "Modify an existing purchase order",
                        endpoint: "/openapi/purchase_order/update/",
                        method: "PUT",
                        implemented: false // Phase 3+: will be true
                    },
                    {
                        id: "state",
                        name: "Purchase Order State",
                        description: "Update Status",
                        endpoint: "/openapi/purchase_order/state/",
                        method: "PUT",
                        implemented: false // Phase 3+: will be true
                    },
                    {
                        id: "terminate",
                        name: "Purchase Order Terminate",
                        description: "Terminate a purchase order",
                        endpoint: "/openapi/purchase_order/terminate/",
                        method: "PUT",
                        implemented: false // Phase 3+: will be true
                    }
                ]
            },
            {
                id: "items",
                name: "Items",
                operations: [
                    {
                        id: "create",
                        name: "Items Create",
                        description: "Create a new item",
                        endpoint: "/openapi/items/create/",
                        method: "POST",
                        implemented: false // Phase 3+: will be true
                    },
                    {
                        id: "bulk_create",
                        name: "Items Bulk Create",
                        description: "Create multiple items",
                        endpoint: "/openapi/items/bulk-create/",
                        method: "POST",
                        implemented: false // Phase 3+: will be true
                    },
                    {
                        id: "update",
                        name: "Items Update",
                        description: "Modify an existing item",
                        endpoint: "/openapi/items/update/",
                        method: "PUT",
                        implemented: false // Phase 3+: will be true
                    },
                    {
                        id: "update_state",
                        name: "Items Update State",
                        description: "Change Status",
                        endpoint: "/openapi/items/update/state/",
                        method: "PUT",
                        implemented: false // Phase 3+: will be true
                    }
                ]
            },
            {
                id: "vendors",
                name: "Vendors",
                operations: [
                    {
                        id: "create",
                        name: "Vendors Create",
                        description: "Create a new vendor",
                        endpoint: "/openapi/vendors/create/",
                        method: "POST",
                        implemented: false // Phase 3+: will be true
                    },
                    {
                        id: "update",
                        name: "Vendors Update",
                        description: "Modify an existing vendor",
                        endpoint: "/openapi/vendors/update/",
                        method: "PUT",
                        implemented: false // Phase 3+: will be true
                    },
                    {
                        id: "state",
                        name: "Vendors State",
                        description: "Update Status",
                        endpoint: "/openapi/vendors/state/",
                        method: "PUT",
                        implemented: false // Phase 3+: will be true
                    },
                    {
                        id: "contacts_create",
                        name: "Vendor Contacts Create",
                        description: "Add a vendor contact",
                        endpoint: "/openapi/vendors/contacts/create/",
                        method: "POST",
                        implemented: false // Phase 3+: will be true
                    },
                    {
                        id: "contacts_update",
                        name: "Vendor Contacts Update",
                        description: "Modify a vendor contact",
                        endpoint: "/openapi/vendors/contacts/update/",
                        method: "PUT",
                        implemented: false // Phase 3+: will be true
                    },
                    {
                        id: "contacts_delete",
                        name: "Vendor Contacts Delete",
                        description: "Remove a vendor contact",
                        endpoint: "/openapi/vendors/contacts/delete/",
                        method: "POST",
                        implemented: false // Phase 3+: will be true
                    }
                ]
            },
            {
                id: "projects",
                name: "Projects",
                operations: [
                    {
                        id: "create",
                        name: "Project Create",
                        description: "Create a new project",
                        endpoint: "/openapi/project/create/",
                        method: "POST",
                        implemented: false // Phase 3+: will be true
                    },
                    {
                        id: "bulk_create",
                        name: "Project Bulk Create",
                        description: "Create multiple projects",
                        endpoint: "/openapi/project/bulk-create/",
                        method: "POST",
                        implemented: false // Phase 3+: will be true
                    }
                ]
            },
            {
                id: "costing_sheets",
                name: "Costing Sheets",
                operations: [
                    {
                        id: "list",
                        name: "Costing Sheet List",
                        description: "Retrieve costing sheets",
                        endpoint: "/openapi/costing-sheet/",
                        method: "GET",
                        implemented: false // Phase 3+: will be true
                    },
                    {
                        id: "mapping",
                        name: "Costing Sheet Mapping",
                        description: "Map costing sheet IDs",
                        endpoint: "/openapi/costing-sheet/mapping/",
                        method: "PUT",
                        implemented: false // Phase 3+: will be true
                    }
                ]
            }
        ];
    }

    /**
     * Get all modules
     * @returns {Array} Array of all module definitions
     */
    getAllModules() {
        return this.modules;
    }

    /**
     * Get a specific module by ID
     * @param {string} moduleId - The module ID (e.g., "contract", "purchase_order")
     * @returns {Object|null} Module definition or null if not found
     */
    getModule(moduleId) {
        return this.modules.find(module => module.id === moduleId) || null;
    }

    /**
     * Get a specific operation from a module
     * @param {string} moduleId - The module ID
     * @param {string} operationId - The operation ID (e.g., "create", "update")
     * @returns {Object|null} Operation definition or null if not found
     */
    getOperation(moduleId, operationId) {
        const module = this.getModule(moduleId);
        if (!module) {
            return null;
        }
        return module.operations.find(op => op.id === operationId) || null;
    }

    /**
     * Check if an operation is implemented
     * @param {string} moduleId - The module ID
     * @param {string} operationId - The operation ID
     * @returns {boolean} True if operation is implemented, false otherwise
     */
    isOperationImplemented(moduleId, operationId) {
        const operation = this.getOperation(moduleId, operationId);
        return operation ? operation.implemented : false;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModuleRegistry;
} else {
    window.ModuleRegistry = ModuleRegistry;
}

