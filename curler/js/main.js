/**
 * The cURLer - Main Application Entry Point
 * 
 * ============================================================================
 * PHASED IMPLEMENTATION APPROACH
 * ============================================================================
 * 
 * This application is built in phases to ensure a solid foundation before
 * adding complex functionality:
 * 
 * PHASE 1 (CURRENT): Core Infrastructure and UI Skeleton
 * - Environment management (dev/prod switching)
 * - Account management (CRUD operations with localStorage persistence)
 * - Token management (automatic bearer token refresh)
 * - Module/operation navigation (all 20 operations visible in UI)
 * - cURL generation with placeholder payloads
 * - Basic form structure and action buttons
 * - Response display with formatting
 * - Error handling and graceful degradation
 * - NO actual API integration or payload building yet
 * 
 * PHASE 2 (FUTURE): Contract Module Full Implementation
 * - Complete Contract API integration
 * - Payload building for Contract operations (Create, Update, State)
 * - Templates for 1-tier and 2-tier contracts
 * - Real API calls and response handling
 * - Contract module serves as reference pattern for other modules
 * 
 * PHASE 3+ (FUTURE): * - All 5 modules defined (Contracts, Purchase Orders, Items, Vendors, Projects)
 * - Items module (4 operations)
 * - Vendors module (6 operations)
 * - Projects module (2 operations)
 * - Each module follows the Contract pattern established in Phase 2
 * 
 * ============================================================================
 * ARCHITECTURE OVERVIEW
 * ============================================================================
 * 
 * The application follows a modular architecture with clear separation of
 * concerns:
 * 
 * COMPONENT STRUCTURE:
 * 
 * 1. EnvironmentManager (environment-manager.js)
 *    - Manages dev/prod environment configuration
 *    - Persists environment selection to localStorage
 *    - Provides base URLs and auth endpoints
 * 
 * 2. AccountStore (account-store.js)
 *    - Manages test account data (enterprise_id, buyer_id, etc.)
 *    - CRUD operations for accounts
 *    - Persists accounts to localStorage per environment
 *    - Generates default accounts on first load
 * 
 * 3. TokenManager (token-manager.js)
 *    - Handles bearer token lifecycle
 *    - Automatic token refresh when expired
 *    - Stores API credentials per environment
 *    - Persists tokens to localStorage
 * 
 * 4. ModuleRegistry (module-registry.js)
 *    - Defines all 5 modules and 20 operations
 *    - Provides operation metadata (endpoint, method, description)
 *    - Tracks implementation status per operation
 * 
 * 5. PayloadBuilder (payload-builder.js)
 *    - Constructs API request payloads
 *    - Phase 1: Stub methods returning placeholder data
 *    - Phase 2+: Full implementation per module
 * 
 * 6. CurlGenerator (curl-generator.js)
 *    - Formats complete cURL commands
 *    - Handles shell escaping and line breaks
 *    - Generates ready-to-use shell scripts
 * 
 * 7. ApiClient (api-client.js)
 *    - Executes HTTP requests using fetch API
 *    - Measures request execution time
 *    - Handles network errors and structured responses
 * 
 * 8. UIController (ui-controller.js)
 *    - Coordinates all UI updates and user interactions
 *    - Renders environment selector, account manager, module navigator
 *    - Handles action buttons (Copy, Download, Execute)
 *    - Displays API responses with formatting
 *    - Manages error display and validation
 * 
 * DATA FLOW:
 * 
 * User Action → UIController → Component(s) → localStorage/API → UIController → UI Update
 * 
 * Example: Selecting an operation
 * 1. User clicks operation in module navigator
 * 2. UIController.handleOperationSelect() is called
 * 3. ModuleRegistry provides operation metadata
 * 4. UIController renders operation form with account context
 * 5. User clicks "Copy cURL"
 * 6. PayloadBuilder constructs payload (placeholder in Phase 1)
 * 7. CurlGenerator formats complete cURL command
 * 8. UIController copies to clipboard and shows feedback
 * 
 * STORAGE STRATEGY:
 * 
 * All data is stored in browser localStorage for privacy and speed:
 * - curler_current_environment: Current environment selection (dev/prod)
 * - curler_accounts: Account data per environment
 * - curler_tokens: Bearer tokens and credentials per environment
 * 
 * Graceful degradation: If localStorage fails, app continues with in-memory
 * data and displays a warning to the user.
 * 
 * ============================================================================
 * ADDING NEW MODULES (Phase 2+ Implementation Guide)
 * ============================================================================
 * 
 * When implementing a new module in Phase 2+, follow this pattern:
 * 
 * 1. UPDATE ModuleRegistry (module-registry.js):
 *    - Set implemented: true for the module's operations
 * 
 * 2. IMPLEMENT PayloadBuilder methods (payload-builder.js):
 *    - Replace stub methods with actual payload construction
 *    - Accept account object and operation-specific parameters
 *    - Construct payload compatible with API endpoint
 *    - Validate required fields
 *    - Return structured payload object
 * 
 * 3. UPDATE UIController (ui-controller.js):
 *    - Add parameter form rendering for the module's operations
 *    - Implement form validation
 *    - Handle user input and form submission
 *    - Update _buildPayload() method mapping if needed
 * 
 * 4. ADD TESTS:
 *    - Unit tests for payload construction
 *    - Property-based tests for correctness properties
 *    - Integration tests for complete workflows
 * 
 * CONTRACT MODULE EXAMPLE (Phase 2 Reference):
 * 
 * The Contract module will be the first fully implemented module and serves
 * as the reference pattern for all other modules. It will include:
 * 
 * - Complete payload building for Create, Update, State operations
 * - Templates for 1-tier and 2-tier contracts
 * - Parameter forms with validation
 * - Real API integration with error handling
 * - Comprehensive test coverage
 * 
 * Other modules should follow the same pattern established by Contract.
 * 
 * ============================================================================
 * RELATED DOCUMENTATION
 * ============================================================================
 * 
 * - Requirements: .kiro/specs/api-curl-generator-webapp/requirements.md
 * - Design: .kiro/specs/api-curl-generator-webapp/design.md
 * - Tasks: .kiro/specs/api-curl-generator-webapp/tasks.md
 * 
 * ============================================================================
 */

// Import all components
// Components are loaded via script tags in HTML and are available globally

/**
 * Application class - Main entry point and component coordinator
 * 
 * This class initializes all components, loads persisted data from localStorage,
 * and wires everything together through the UIController.
 */
class Application {
    constructor() {
        // Component instances (will be initialized in init())
        this.environmentManager = null;
        this.accountStore = null;
        this.tokenManager = null;
        this.moduleRegistry = null;
        this.payloadBuilder = null;
        this.curlGenerator = null;
        this.apiClient = null;
        this.uiController = null;

        // Application state
        this.initialized = false;
    }

    /**
     * Initialize the application
     * 
     * This method:
     * 1. Creates all component instances
     * 2. Loads data from localStorage
     * 3. Initializes the UIController
     * 4. Sets up global error handlers
     * 5. Renders the initial UI
     */
    async init() {
        try {

            // Initialize all components in dependency order
            this.initializeComponents();

            // Check for Factwise integration and override if embedded
            this.integrateWithFactwise();

            // Load persisted data from localStorage
            this.loadPersistedData();

            // Initialize UI Controller and render initial UI
            this.uiController.init();

            // Set up global error handlers
            this.setupErrorHandlers();

            // Mark as initialized
            this.initialized = true;

            console.log('The cURLer application initialized successfully');
            console.log('Phase 1: Core infrastructure and UI skeleton');
            console.log('All 20 API operations are visible in the UI');
            console.log('Full API integration will be implemented in Phase 2+');

        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.displayInitializationError(error);
        }
    }

    /**
     * Initialize all component instances
     * Creates components in the correct dependency order
     * @private
     */
    initializeComponents() {
        console.log('Creating component instances...');

        // 0. Factwise Integration (check if embedded)
        this.factwiseIntegration = new FactwiseIntegration();
        console.log('✓ FactwiseIntegration created');

        // 1. Environment Manager (no dependencies)
        this.environmentManager = new EnvironmentManager();
        console.log('✓ EnvironmentManager created');

        // 2. Account Store (no dependencies)
        this.accountStore = new AccountStore();
        console.log('✓ AccountStore created');

        // 3. Token Manager (depends on EnvironmentManager)
        this.tokenManager = new TokenManager(this.environmentManager);
        console.log('✓ TokenManager created');

        // 4. Module Registry (no dependencies)
        this.moduleRegistry = new ModuleRegistry();
        console.log('✓ ModuleRegistry created');

        // 5. Payload Builder (no dependencies)
        this.payloadBuilder = new PayloadBuilder();
        console.log('✓ PayloadBuilder created');

        // 6. cURL Generator (no dependencies)
        this.curlGenerator = new CurlGenerator();
        console.log('✓ CurlGenerator created');

        // 7. API Client (no dependencies)
        this.apiClient = new ApiClient();
        console.log('✓ ApiClient created');

        // 8. Item Validator (depends on ApiClient, TokenManager, EnvironmentManager, FactwiseIntegration)
        this.itemValidator = new ItemValidator(
            this.apiClient,
            this.tokenManager,
            this.environmentManager,
            this.factwiseIntegration
        );
        console.log('✓ ItemValidator created');

        // 9. Item Validation UI (depends on ItemValidator)
        this.itemValidationUI = new ItemValidationUI(this.itemValidator);
        console.log('✓ ItemValidationUI created');

        // 10. Template Manager (no dependencies)
        this.templateManager = new TemplateManager();
        console.log('✓ TemplateManager created');

        // 11. UI Controller (depends on all other components)
        this.uiController = new UIController(
            this.environmentManager,
            this.accountStore,
            this.tokenManager,
            this.moduleRegistry,
            this.payloadBuilder,
            this.curlGenerator,
            this.apiClient,
            this.itemValidator,
            this.itemValidationUI,
            this.factwiseIntegration,
            this.templateManager
        );
        console.log('✓ UIController created');

        console.log('All components created successfully');
    }

    /**
     * Integrate with Factwise if running in iframe
     * Overrides environment and token with Factwise configuration
     * @private
     */
    integrateWithFactwise() {
        if (!this.factwiseIntegration.isEmbeddedInFactwise()) {
            console.log('Running in standalone mode - using local configuration');
            return;
        }

        console.log('Integrating with Factwise...');

        // Override environment to match Factwise
        this.factwiseIntegration.overrideEnvironment(this.environmentManager);

        // Override token with Factwise token
        this.factwiseIntegration.overrideToken(
            this.tokenManager,
            this.environmentManager
        );

        console.log('✓ Factwise integration complete');
    }

    /**
     * Load persisted data from localStorage
     * 
     * Data is automatically loaded by each component's constructor:
     * - EnvironmentManager loads current environment selection
     * - AccountStore loads accounts and creates defaults if needed
     * - TokenManager loads tokens and credentials
     * 
     * This method just logs the loaded state for debugging.
     * @private
     */
    loadPersistedData() {
        console.log('Loading persisted data from localStorage...');

        // Get current environment
        const currentEnv = this.environmentManager.getCurrentEnvironment();
        console.log(`✓ Environment: ${currentEnv.name} (${currentEnv.id})`);

        // Get accounts for current environment
        const accounts = this.accountStore.getAccounts(currentEnv.id);
        console.log(`✓ Accounts: ${accounts.length} account(s) loaded for ${currentEnv.id}`);

        // Check token status
        const hasToken = this.tokenManager.isTokenValid(currentEnv.id);
        console.log(`✓ Token: ${hasToken ? 'Valid token found' : 'No valid token (will refresh on first use)'}`);

        // Get module count
        const modules = this.moduleRegistry.getAllModules();
        const totalOperations = modules.reduce((sum, module) => sum + module.operations.length, 0);
        console.log(`✓ Modules: ${modules.length} modules with ${totalOperations} operations loaded`);

        console.log('All persisted data loaded successfully');
    }

    /**
     * Set up global error handlers
     * Catches unhandled errors and displays them to the user
     * @private
     */
    setupErrorHandlers() {
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);

            if (this.uiController) {
                this.uiController.displayApplicationError(
                    event.reason || new Error('Unhandled promise rejection'),
                    'promise handling'
                );
            }

            // Prevent default browser error handling
            event.preventDefault();
        });

        // Handle global errors
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);

            if (this.uiController) {
                this.uiController.displayApplicationError(
                    event.error || new Error(event.message),
                    'global error handler'
                );
            }

            // Prevent default browser error handling
            event.preventDefault();
        });

        console.log('✓ Global error handlers set up');
    }

    /**
     * Display initialization error
     * Shows a critical error message if the application fails to initialize
     * @param {Error} error - Initialization error
     * @private
     */
    displayInitializationError(error) {
        // Create a simple error display since UIController may not be available
        const errorHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #fff;
                border: 2px solid #dc3545;
                border-radius: 8px;
                padding: 24px;
                max-width: 500px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
            ">
                <h2 style="color: #dc3545; margin-top: 0;">
                    ❌ Application Initialization Failed
                </h2>
                <p style="margin: 16px 0;">
                    The cURLer application failed to initialize. This may be due to:
                </p>
                <ul style="margin: 16px 0; padding-left: 24px;">
                    <li>Browser compatibility issues</li>
                    <li>localStorage access denied</li>
                    <li>Missing JavaScript files</li>
                    <li>Network connectivity problems</li>
                </ul>
                <details style="margin: 16px 0;">
                    <summary style="cursor: pointer; color: #007bff;">
                        Technical Details
                    </summary>
                    <pre style="
                        background: #f8f9fa;
                        padding: 12px;
                        border-radius: 4px;
                        overflow-x: auto;
                        font-size: 12px;
                        margin-top: 8px;
                    ">${error.stack || error.toString()}</pre>
                </details>
                <button 
                    onclick="window.location.reload()" 
                    style="
                        background: #007bff;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                    "
                >
                    Reload Application
                </button>
            </div>
        `;

        document.body.innerHTML = errorHTML;
    }

    /**
     * Get application version and phase information
     * @returns {Object} Version information
     */
    getVersion() {
        return {
            version: '1.0.0',
            phase: 'Phase 1',
            description: 'Core infrastructure and UI skeleton',
            modules: {
                total: 5,
                implemented: 0,
                placeholder: 5
            },
            operations: {
                total: 20,
                implemented: 0,
                placeholder: 20
            }
        };
    }
}

/**
 * Application initialization
 * 
 * Wait for DOM to be fully loaded, then create and initialize the application.
 * The application instance is stored globally for debugging purposes.
 */
let app = null;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM is already ready
    initializeApp();
}

/**
 * Initialize the application
 * Creates the Application instance and starts initialization
 */
async function initializeApp() {
    console.log('DOM ready, starting application initialization...');

    try {
        // Create application instance
        app = new Application();

        // Make app globally available for debugging
        window.curlerApp = app;

        // Initialize the application
        await app.init();

        // Log version information
        const version = app.getVersion();
        console.log(`The cURLer v${version.version} - ${version.phase}`);
        console.log(`${version.operations.total} operations available (${version.operations.placeholder} placeholder)`);

    } catch (error) {
        console.error('Failed to initialize application:', error);
        // Error display is handled by Application.init()
    }
}

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Application, initializeApp };
}
