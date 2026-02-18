/**
 * Unit tests for UIController module navigation methods (Task 12.1)
 * Tests renderModuleNavigator, handleOperationSelect, and renderOperationForm
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock DOM environment
const createMockDOM = () => {
    document.body.innerHTML = `
        <div id="environment-selector"></div>
        <div id="account-manager"></div>
        <div id="module-navigator"></div>
        <div id="operation-form"></div>
        <div id="action-buttons"></div>
        <div id="response-display"></div>
    `;
};

// Import components (using dynamic import to handle module loading)
const EnvironmentManager = (await import('../../js/environment-manager.js')).default;
const AccountStore = (await import('../../js/account-store.js')).default;
const TokenManager = (await import('../../js/token-manager.js')).default;
const ModuleRegistry = (await import('../../js/module-registry.js')).default;
const PayloadBuilder = (await import('../../js/payload-builder.js')).default;
const CurlGenerator = (await import('../../js/curl-generator.js')).default;
const ApiClient = (await import('../../js/api-client.js')).default;
const UIController = (await import('../../js/ui-controller.js')).default;

describe('UIController - Module Navigation (Task 12.1)', () => {
    let uiController;
    let environmentManager;
    let accountStore;
    let tokenManager;
    let moduleRegistry;
    let payloadBuilder;
    let curlGenerator;
    let apiClient;

    beforeEach(() => {
        // Create mock DOM
        createMockDOM();

        // Initialize components
        environmentManager = new EnvironmentManager();
        accountStore = new AccountStore();
        tokenManager = new TokenManager();
        moduleRegistry = new ModuleRegistry();
        payloadBuilder = new PayloadBuilder();
        curlGenerator = new CurlGenerator();
        apiClient = new ApiClient();

        uiController = new UIController(
            environmentManager,
            accountStore,
            tokenManager,
            moduleRegistry,
            payloadBuilder,
            curlGenerator,
            apiClient
        );

        // Initialize UI
        uiController.init();
    });

    describe('renderModuleNavigator', () => {
        it('should display all 6 modules', () => {
            const moduleNavigator = document.getElementById('module-navigator');
            const moduleGroups = moduleNavigator.querySelectorAll('.module-group');

            expect(moduleGroups.length).toBe(6);
        });

        it('should display all 21 operations across all modules', () => {
            const moduleNavigator = document.getElementById('module-navigator');
            const operationItems = moduleNavigator.querySelectorAll('.operation-item');

            expect(operationItems.length).toBe(21);
        });

        it('should display operation descriptions in parentheses', () => {
            const moduleNavigator = document.getElementById('module-navigator');
            const firstOperation = moduleNavigator.querySelector('.operation-item');
            const description = firstOperation.querySelector('.operation-description');

            expect(description).toBeTruthy();
            expect(description.textContent).toMatch(/^\(.*\)$/);
        });

        it('should display module names as headers', () => {
            const moduleNavigator = document.getElementById('module-navigator');
            const moduleHeaders = moduleNavigator.querySelectorAll('.module-header');

            expect(moduleHeaders.length).toBe(6);
            expect(moduleHeaders[0].textContent).toBe('Contracts');
            expect(moduleHeaders[1].textContent).toBe('Purchase Orders');
        });
    });

    describe('handleOperationSelect', () => {
        it('should update current module and operation when operation is selected', () => {
            uiController.handleOperationSelect('contract', 'create');

            expect(uiController.currentModule).toBe('contract');
            expect(uiController.currentOperation).toBe('create');
        });

        it('should highlight selected operation in module navigator', () => {
            uiController.handleOperationSelect('contract', 'create');

            const moduleNavigator = document.getElementById('module-navigator');
            const selectedOperation = moduleNavigator.querySelector('.operation-item.selected');

            expect(selectedOperation).toBeTruthy();
            expect(selectedOperation.dataset.moduleId).toBe('contract');
            expect(selectedOperation.dataset.operationId).toBe('create');
        });

        it('should render operation form when operation is selected', () => {
            uiController.handleOperationSelect('contract', 'create');

            const operationForm = document.getElementById('operation-form');
            expect(operationForm.innerHTML).not.toBe('');
            expect(operationForm.textContent).toContain('Contract Create');
        });

        it('should handle invalid operation gracefully', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            uiController.handleOperationSelect('invalid', 'invalid');

            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe('renderOperationForm', () => {
        it('should display operation name and method', () => {
            uiController.renderOperationForm('contract', 'create');

            const operationForm = document.getElementById('operation-form');
            expect(operationForm.textContent).toContain('Contract Create');
            expect(operationForm.textContent).toContain('POST');
        });

        it('should display operation description', () => {
            uiController.renderOperationForm('contract', 'create');

            const operationForm = document.getElementById('operation-form');
            expect(operationForm.textContent).toContain('Create a new contract');
        });

        it('should display operation endpoint', () => {
            uiController.renderOperationForm('contract', 'create');

            const operationForm = document.getElementById('operation-form');
            expect(operationForm.textContent).toContain('/openapi/contract/create/');
        });

        it('should display Phase 1 placeholder message', () => {
            uiController.renderOperationForm('contract', 'create');

            const operationForm = document.getElementById('operation-form');
            expect(operationForm.textContent).toContain('Phase 1: Placeholder');
        });

        it('should display account context when account is selected', () => {
            // Select an account first
            const currentEnv = environmentManager.getCurrentEnvironment();
            const accounts = accountStore.getAccounts(currentEnv.id);
            uiController.currentAccount = accounts[0];

            uiController.renderOperationForm('contract', 'create');

            const operationForm = document.getElementById('operation-form');
            expect(operationForm.textContent).toContain('Using Account:');
            expect(operationForm.textContent).toContain(accounts[0].entity_name);
            expect(operationForm.textContent).toContain(accounts[0].user_email);
        });

        it('should display warning when no account is selected', () => {
            uiController.currentAccount = null;

            uiController.renderOperationForm('contract', 'create');

            const operationForm = document.getElementById('operation-form');
            expect(operationForm.textContent).toContain('Please select an account first');
        });

        it('should handle invalid module/operation gracefully', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            uiController.renderOperationForm('invalid', 'invalid');

            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe('Integration - Operation selection flow', () => {
        it('should complete full flow: select operation → display form', () => {
            // Initial state - no operation selected
            expect(uiController.currentModule).toBeNull();
            expect(uiController.currentOperation).toBeNull();

            // Select an operation
            uiController.handleOperationSelect('purchase_order', 'update');

            // Verify state updated
            expect(uiController.currentModule).toBe('purchase_order');
            expect(uiController.currentOperation).toBe('update');

            // Verify form displayed
            const operationForm = document.getElementById('operation-form');
            expect(operationForm.textContent).toContain('Purchase Order Update');
            expect(operationForm.textContent).toContain('PUT');
        });

        it('should update form when account changes', () => {
            // Select operation
            uiController.handleOperationSelect('contract', 'create');

            // Change account
            const currentEnv = environmentManager.getCurrentEnvironment();
            const accounts = accountStore.getAccounts(currentEnv.id);
            uiController.handleAccountSelect(accounts[0].id);

            // Verify form updated with new account
            const operationForm = document.getElementById('operation-form');
            expect(operationForm.textContent).toContain(accounts[0].entity_name);
        });
    });
});
