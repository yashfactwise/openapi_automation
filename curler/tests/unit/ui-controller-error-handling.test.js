/**
 * Unit tests for UIController error handling methods (Task 14.1)
 * Tests displayError, highlightInvalidField, and specialized error display methods
 * Requirements: 11.5, 13.1, 13.2, 13.3, 13.4, 13.5
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

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

// Import components
const EnvironmentManager = (await import('../../js/environment-manager.js')).default;
const AccountStore = (await import('../../js/account-store.js')).default;
const TokenManager = (await import('../../js/token-manager.js')).default;
const ModuleRegistry = (await import('../../js/module-registry.js')).default;
const PayloadBuilder = (await import('../../js/payload-builder.js')).default;
const CurlGenerator = (await import('../../js/curl-generator.js')).default;
const ApiClient = (await import('../../js/api-client.js')).default;
const UIController = (await import('../../js/ui-controller.js')).default;

describe('UIController - Error Handling (Task 14.1)', () => {
    let uiController;
    let environmentManager;
    let accountStore;
    let tokenManager;
    let moduleRegistry;
    let payloadBuilder;
    let curlGenerator;
    let apiClient;
    let consoleErrorSpy;

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

        // Spy on console.error
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        // Restore console.error
        consoleErrorSpy.mockRestore();
    });

    describe('displayError', () => {
        it('should create error container if it does not exist', () => {
            const error = {
                type: 'network',
                title: 'Test Error',
                message: 'This is a test error'
            };

            uiController.displayError(error);

            const errorContainer = document.getElementById('error-container');
            expect(errorContainer).toBeTruthy();
        });

        it('should display error message with correct title and message', () => {
            const error = {
                type: 'network',
                title: 'Network Error',
                message: 'Failed to connect to server'
            };

            uiController.displayError(error);

            const errorDisplay = document.getElementById('error-display');
            expect(errorDisplay).toBeTruthy();
            expect(errorDisplay.textContent).toContain('Network Error');
            expect(errorDisplay.textContent).toContain('Failed to connect to server');
        });

        it('should log all errors to console (Requirement 13.5)', () => {
            const error = {
                type: 'application',
                title: 'App Error',
                message: 'Something went wrong',
                details: 'Stack trace here'
            };

            uiController.displayError(error);

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                '[application] App Error:',
                'Something went wrong',
                'Stack trace here'
            );
        });

        it('should display technical details in collapsible section when provided', () => {
            const error = {
                type: 'network',
                title: 'Network Error',
                message: 'Connection failed',
                details: 'Error: ECONNREFUSED at line 42'
            };

            uiController.displayError(error);

            const errorDisplay = document.getElementById('error-display');
            const details = errorDisplay.querySelector('.error-details');
            expect(details).toBeTruthy();
            expect(details.textContent).toContain('Error: ECONNREFUSED at line 42');
        });

        it('should display action button when action is provided', () => {
            const actionHandler = vi.fn();
            const error = {
                type: 'network',
                title: 'Network Error',
                message: 'Connection failed',
                action: {
                    label: 'Retry',
                    handler: actionHandler
                }
            };

            uiController.displayError(error);

            const actionBtn = document.getElementById('error-action-btn');
            expect(actionBtn).toBeTruthy();
            expect(actionBtn.textContent).toContain('Retry');
        });

        it('should call action handler when action button is clicked', () => {
            const actionHandler = vi.fn();
            const error = {
                type: 'network',
                title: 'Network Error',
                message: 'Connection failed',
                action: {
                    label: 'Retry',
                    handler: actionHandler
                }
            };

            uiController.displayError(error);

            const actionBtn = document.getElementById('error-action-btn');
            actionBtn.click();

            expect(actionHandler).toHaveBeenCalled();
        });

        it('should apply correct CSS class for network errors', () => {
            const error = {
                type: 'network',
                title: 'Network Error',
                message: 'Connection failed'
            };

            uiController.displayError(error);

            const errorDisplay = document.getElementById('error-display');
            expect(errorDisplay.classList.contains('error-network')).toBe(true);
        });

        it('should apply correct CSS class for auth errors', () => {
            const error = {
                type: 'auth',
                title: 'Auth Error',
                message: 'Authentication failed'
            };

            uiController.displayError(error);

            const errorDisplay = document.getElementById('error-display');
            expect(errorDisplay.classList.contains('error-auth')).toBe(true);
        });

        it('should apply correct CSS class for validation errors', () => {
            const error = {
                type: 'validation',
                title: 'Validation Error',
                message: 'Invalid input'
            };

            uiController.displayError(error);

            const errorDisplay = document.getElementById('error-display');
            expect(errorDisplay.classList.contains('error-validation')).toBe(true);
        });

        it('should apply correct CSS class for storage errors', () => {
            const error = {
                type: 'storage',
                title: 'Storage Error',
                message: 'Failed to save'
            };

            uiController.displayError(error);

            const errorDisplay = document.getElementById('error-display');
            expect(errorDisplay.classList.contains('error-storage')).toBe(true);
        });

        it('should apply correct CSS class for application errors', () => {
            const error = {
                type: 'application',
                title: 'Application Error',
                message: 'Unexpected error'
            };

            uiController.displayError(error);

            const errorDisplay = document.getElementById('error-display');
            expect(errorDisplay.classList.contains('error-application')).toBe(true);
        });

        it('should highlight invalid field for validation errors (Requirement 13.2)', () => {
            // Create a mock field
            const mockField = document.createElement('input');
            mockField.id = 'test-field';
            const fieldContainer = document.createElement('div');
            fieldContainer.appendChild(mockField);
            document.body.appendChild(fieldContainer);

            const error = {
                type: 'validation',
                title: 'Validation Error',
                message: 'Field is required',
                fieldId: 'test-field'
            };

            uiController.displayError(error);

            expect(mockField.classList.contains('field-invalid')).toBe(true);
        });
    });

    describe('highlightInvalidField', () => {
        it('should add error class to invalid field', () => {
            const mockField = document.createElement('input');
            mockField.id = 'test-field';
            const fieldContainer = document.createElement('div');
            fieldContainer.appendChild(mockField);
            document.body.appendChild(fieldContainer);

            uiController.highlightInvalidField('test-field', 'This field is required');

            expect(mockField.classList.contains('field-invalid')).toBe(true);
        });

        it('should display validation message below field', () => {
            const mockField = document.createElement('input');
            mockField.id = 'test-field';
            const fieldContainer = document.createElement('div');
            fieldContainer.appendChild(mockField);
            document.body.appendChild(fieldContainer);

            uiController.highlightInvalidField('test-field', 'This field is required');

            const validationMessage = fieldContainer.querySelector('.field-validation-message');
            expect(validationMessage).toBeTruthy();
            expect(validationMessage.textContent).toBe('This field is required');
        });

        it('should remove existing validation message before adding new one', () => {
            const mockField = document.createElement('input');
            mockField.id = 'test-field';
            const fieldContainer = document.createElement('div');
            fieldContainer.appendChild(mockField);
            document.body.appendChild(fieldContainer);

            // Add first validation message
            uiController.highlightInvalidField('test-field', 'First error');

            // Add second validation message
            uiController.highlightInvalidField('test-field', 'Second error');

            const validationMessages = fieldContainer.querySelectorAll('.field-validation-message');
            expect(validationMessages.length).toBe(1);
            expect(validationMessages[0].textContent).toBe('Second error');
        });

        it('should clear validation when user types in field', () => {
            const mockField = document.createElement('input');
            mockField.id = 'test-field';
            const fieldContainer = document.createElement('div');
            fieldContainer.appendChild(mockField);
            document.body.appendChild(fieldContainer);

            uiController.highlightInvalidField('test-field', 'This field is required');

            // Simulate user input
            mockField.dispatchEvent(new Event('input'));

            expect(mockField.classList.contains('field-invalid')).toBe(false);
            const validationMessage = fieldContainer.querySelector('.field-validation-message');
            expect(validationMessage).toBeNull();
        });

        it('should handle non-existent field gracefully', () => {
            const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

            uiController.highlightInvalidField('non-existent-field', 'Error message');

            expect(consoleWarnSpy).toHaveBeenCalledWith(
                'Field not found for validation highlighting:',
                'non-existent-field'
            );

            consoleWarnSpy.mockRestore();
        });
    });

    describe('displayNetworkError', () => {
        it('should display network error with correct type and message (Requirement 13.1)', () => {
            const error = new Error('Connection refused');

            uiController.displayNetworkError(error);

            const errorDisplay = document.getElementById('error-display');
            expect(errorDisplay).toBeTruthy();
            expect(errorDisplay.classList.contains('error-network')).toBe(true);
            expect(errorDisplay.textContent).toContain('Network Error');
            expect(errorDisplay.textContent).toContain('Connection refused');
        });

        it('should include retry button when retry handler is provided', () => {
            const error = new Error('Connection failed');
            const retryHandler = vi.fn();

            uiController.displayNetworkError(error, retryHandler);

            const actionBtn = document.getElementById('error-action-btn');
            expect(actionBtn).toBeTruthy();
            expect(actionBtn.textContent).toContain('Retry');
        });

        it('should use default message when error has no message', () => {
            const error = new Error();
            error.message = '';

            uiController.displayNetworkError(error);

            const errorDisplay = document.getElementById('error-display');
            expect(errorDisplay.textContent).toContain('Failed to connect to the API server');
        });
    });

    describe('displayAuthError', () => {
        it('should display authentication error with correct type (Requirement 13.3)', () => {
            const error = new Error('Invalid credentials');

            uiController.displayAuthError(error);

            const errorDisplay = document.getElementById('error-display');
            expect(errorDisplay).toBeTruthy();
            expect(errorDisplay.classList.contains('error-auth')).toBe(true);
            expect(errorDisplay.textContent).toContain('Authentication Error');
        });

        it('should display custom reason when provided', () => {
            const error = new Error('Token expired');
            const reason = 'Your session has expired. Please log in again.';

            uiController.displayAuthError(error, reason);

            const errorDisplay = document.getElementById('error-display');
            expect(errorDisplay.textContent).toContain(reason);
        });

        it('should use error message when no reason is provided', () => {
            const error = new Error('Invalid token');

            uiController.displayAuthError(error);

            const errorDisplay = document.getElementById('error-display');
            expect(errorDisplay.textContent).toContain('Invalid token');
        });
    });

    describe('displayValidationError', () => {
        it('should display validation error with correct type (Requirement 13.2)', () => {
            uiController.displayValidationError('Field is required');

            const errorDisplay = document.getElementById('error-display');
            expect(errorDisplay).toBeTruthy();
            expect(errorDisplay.classList.contains('error-validation')).toBe(true);
            expect(errorDisplay.textContent).toContain('Validation Error');
            expect(errorDisplay.textContent).toContain('Field is required');
        });

        it('should include validation rule when provided', () => {
            uiController.displayValidationError(
                'Invalid email format',
                'email-field',
                'Must be a valid email address'
            );

            const errorDisplay = document.getElementById('error-display');
            expect(errorDisplay.textContent).toContain('Invalid email format');
            expect(errorDisplay.textContent).toContain('Validation rule: Must be a valid email address');
        });

        it('should highlight field when fieldId is provided', () => {
            const mockField = document.createElement('input');
            mockField.id = 'email-field';
            const fieldContainer = document.createElement('div');
            fieldContainer.appendChild(mockField);
            document.body.appendChild(fieldContainer);

            uiController.displayValidationError('Invalid email', 'email-field');

            expect(mockField.classList.contains('field-invalid')).toBe(true);
        });
    });

    describe('displayStorageError', () => {
        it('should display storage error with graceful degradation message (Requirement 11.5, 13.4)', () => {
            const error = new Error('QuotaExceededError');

            uiController.displayStorageError(error, 'save');

            const errorDisplay = document.getElementById('error-display');
            expect(errorDisplay).toBeTruthy();
            expect(errorDisplay.classList.contains('error-storage')).toBe(true);
            expect(errorDisplay.textContent).toContain('Storage Warning');
            expect(errorDisplay.textContent).toContain('in-memory data');
            expect(errorDisplay.textContent).toContain('will not persist');
        });

        it('should log warning about graceful degradation', () => {
            const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
            const error = new Error('Storage failed');

            uiController.displayStorageError(error, 'load');

            expect(consoleWarnSpy).toHaveBeenCalledWith(
                'Storage failure - graceful degradation active. Data will not persist.'
            );

            consoleWarnSpy.mockRestore();
        });

        it('should include operation type in message', () => {
            const error = new Error('Storage error');

            uiController.displayStorageError(error, 'save');

            const errorDisplay = document.getElementById('error-display');
            expect(errorDisplay.textContent).toContain('Failed to save data');
        });
    });

    describe('displayApplicationError', () => {
        it('should display application error with reset option (Requirement 13.4)', () => {
            const error = new Error('Unexpected error');

            uiController.displayApplicationError(error, 'data processing');

            const errorDisplay = document.getElementById('error-display');
            expect(errorDisplay).toBeTruthy();
            expect(errorDisplay.classList.contains('error-application')).toBe(true);
            expect(errorDisplay.textContent).toContain('Application Error');
            expect(errorDisplay.textContent).toContain('data processing');
        });

        it('should include reset button', () => {
            const error = new Error('Critical error');

            uiController.displayApplicationError(error);

            const actionBtn = document.getElementById('error-action-btn');
            expect(actionBtn).toBeTruthy();
            expect(actionBtn.textContent).toContain('Reset Application');
        });

        it('should include error stack trace in details', () => {
            const error = new Error('Test error');
            error.stack = 'Error: Test error\n    at line 42';

            uiController.displayApplicationError(error);

            const errorDisplay = document.getElementById('error-display');
            const details = errorDisplay.querySelector('.error-details');
            expect(details).toBeTruthy();
        });
    });

    describe('clearErrors', () => {
        it('should remove all error messages', () => {
            // Display multiple errors
            uiController.displayError({
                type: 'network',
                title: 'Error 1',
                message: 'Message 1'
            });

            uiController.clearErrors();

            const errorContainer = document.getElementById('error-container');
            expect(errorContainer.innerHTML).toBe('');
        });

        it('should clear all field validation highlights', () => {
            const mockField1 = document.createElement('input');
            mockField1.id = 'field1';
            mockField1.classList.add('field-invalid');
            const mockField2 = document.createElement('input');
            mockField2.id = 'field2';
            mockField2.classList.add('field-invalid');
            document.body.appendChild(mockField1);
            document.body.appendChild(mockField2);

            uiController.clearErrors();

            expect(mockField1.classList.contains('field-invalid')).toBe(false);
            expect(mockField2.classList.contains('field-invalid')).toBe(false);
        });

        it('should remove all validation messages', () => {
            const validationMsg1 = document.createElement('div');
            validationMsg1.className = 'field-validation-message';
            const validationMsg2 = document.createElement('div');
            validationMsg2.className = 'field-validation-message';
            document.body.appendChild(validationMsg1);
            document.body.appendChild(validationMsg2);

            uiController.clearErrors();

            const remainingMessages = document.querySelectorAll('.field-validation-message');
            expect(remainingMessages.length).toBe(0);
        });
    });

    describe('Integration - Error handling in existing methods', () => {
        it('should use displayApplicationError when environment change fails', () => {
            const displayErrorSpy = vi.spyOn(uiController, 'displayApplicationError');

            // Force an error by mocking setEnvironment to throw
            vi.spyOn(environmentManager, 'setEnvironment').mockImplementation(() => {
                throw new Error('Environment switch failed');
            });

            uiController.handleEnvironmentChange('prod');

            expect(displayErrorSpy).toHaveBeenCalled();
            displayErrorSpy.mockRestore();
        });

        it('should use displayApplicationError when copy fails', async () => {
            const displayErrorSpy = vi.spyOn(uiController, 'displayApplicationError');

            // Mock clipboard API to fail
            Object.assign(navigator, {
                clipboard: {
                    writeText: vi.fn().mockRejectedValue(new Error('Clipboard access denied'))
                }
            });

            // Set up required state
            uiController.currentModule = 'contract';
            uiController.currentOperation = 'create';
            const currentEnv = environmentManager.getCurrentEnvironment();
            const accounts = accountStore.getAccounts(currentEnv.id);
            uiController.currentAccount = accounts[0];

            await uiController.handleCopyClick();

            expect(displayErrorSpy).toHaveBeenCalled();
            displayErrorSpy.mockRestore();
        });
    });
});
