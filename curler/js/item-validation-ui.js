/**
 * Item Validation UI - Handles visual feedback for item validation
 * 
 * Features:
 * - Shows loading spinner during validation
 * - Shows success checkmark when item exists
 * - Shows error message when item doesn't exist
 * - Auto-fills related fields (currency, unit) when item is valid
 * - Attaches to input fields with data-validate-item attribute
 */

class ItemValidationUI {
    constructor(itemValidator) {
        this.itemValidator = itemValidator;

        // Track attached inputs
        this.attachedInputs = new Map(); // inputId -> config
    }

    /**
     * Attach validation to an item code input field
     * 
     * @param {HTMLInputElement} inputElement - The input field to attach to
     * @param {Object} config - Configuration object
     * @param {HTMLElement} config.currencyField - Optional currency field to auto-fill
     * @param {HTMLElement} config.unitField - Optional unit field to auto-fill
     * @param {Function} config.onValidated - Optional callback when validation completes
     */
    attachToInput(inputElement, config = {}) {
        if (!inputElement) return;

        const inputId = inputElement.id || `item-input-${Date.now()}`;
        if (!inputElement.id) inputElement.id = inputId;

        // Store config
        this.attachedInputs.set(inputId, config);

        // Create validation feedback container
        const feedbackContainer = this._createFeedbackContainer(inputElement);

        // Add input event listener
        inputElement.addEventListener('input', (e) => {
            const itemCode = e.target.value.trim();

            this.itemValidator.validateItemCode(
                itemCode,
                inputId,
                // onSuccess
                (itemData) => this._handleSuccess(inputElement, feedbackContainer, itemData, config),
                // onError
                (errorMsg) => this._handleError(inputElement, feedbackContainer, errorMsg),
                // onLoading
                () => this._handleLoading(inputElement, feedbackContainer)
            );
        });

        // Add blur event to trigger immediate validation
        inputElement.addEventListener('blur', (e) => {
            const itemCode = e.target.value.trim();
            if (itemCode) {
                // Cancel debounce and validate immediately
                this.itemValidator.cancelValidation(inputId);
                this.itemValidator.validateItemCode(
                    itemCode,
                    inputId + '-immediate',
                    (itemData) => this._handleSuccess(inputElement, feedbackContainer, itemData, config),
                    (errorMsg) => this._handleError(inputElement, feedbackContainer, errorMsg),
                    () => this._handleLoading(inputElement, feedbackContainer)
                );
            }
        });

        console.log('Item validation attached to:', inputId);
    }

    /**
     * Create feedback container next to input
     * @private
     */
    _createFeedbackContainer(inputElement) {
        // Check if feedback container already exists
        let feedbackContainer = inputElement.parentElement.querySelector('.item-validation-feedback');

        if (!feedbackContainer) {
            feedbackContainer = document.createElement('div');
            feedbackContainer.className = 'item-validation-feedback';
            feedbackContainer.style.cssText = `
                display: inline-flex;
                align-items: center;
                gap: 6px;
                margin-left: 8px;
                font-size: 13px;
                min-height: 20px;
            `;

            // Insert after input
            inputElement.parentElement.style.position = 'relative';
            inputElement.parentElement.appendChild(feedbackContainer);
        }

        return feedbackContainer;
    }

    /**
     * Handle loading state
     * @private
     */
    _handleLoading(inputElement, feedbackContainer) {
        inputElement.classList.remove('validation-success', 'validation-error');
        inputElement.classList.add('validation-loading');

        feedbackContainer.innerHTML = `
            <span class="validation-spinner" style="
                display: inline-block;
                width: 14px;
                height: 14px;
                border: 2px solid #e2e8f0;
                border-top-color: #3b82f6;
                border-radius: 50%;
                animation: spin 0.6s linear infinite;
            "></span>
            <span style="color: #64748b;">Validating...</span>
        `;
    }

    /**
     * Handle success state
     * @private
     */
    _handleSuccess(inputElement, feedbackContainer, itemData, config) {
        inputElement.classList.remove('validation-loading', 'validation-error');
        inputElement.classList.add('validation-success');

        feedbackContainer.innerHTML = `
            <span style="color: #10b981; font-size: 16px;">✓</span>
            <span style="color: #10b981; font-weight: 500;">Item exists</span>
        `;

        // Auto-fill related fields if provided
        if (config.currencyField && itemData.currency_code_id) {
            config.currencyField.value = itemData.currency_code_id;
            console.log('✓ Auto-filled currency:', itemData.currency_code_id);
        }
        if (config.unitField && itemData.measurement_unit_id) {
            config.unitField.value = itemData.measurement_unit_id;
            console.log('✓ Auto-filled unit:', itemData.measurement_unit_id);
        }

        // Call custom callback
        if (config.onValidated) {
            config.onValidated(true, itemData);
        }
    }

    /**
     * Handle error state
     * @private
     */
    _handleError(inputElement, feedbackContainer, errorMsg) {
        inputElement.classList.remove('validation-loading', 'validation-success');
        inputElement.classList.add('validation-error');

        feedbackContainer.innerHTML = `
            <span style="color: #ef4444; font-size: 16px;">✗</span>
            <span style="color: #ef4444; font-weight: 500;">${errorMsg}</span>
        `;

        // Call custom callback
        const inputId = inputElement.id;
        const config = this.attachedInputs.get(inputId);
        if (config && config.onValidated) {
            config.onValidated(false, null);
        }
    }

    /**
     * Detach validation from an input
     * 
     * @param {string} inputId - The input identifier
     */
    detachFromInput(inputId) {
        this.itemValidator.cancelValidation(inputId);
        this.attachedInputs.delete(inputId);
    }

    /**
     * Clear all attached validations
     */
    clearAll() {
        this.itemValidator.clearAll();
        this.attachedInputs.clear();
    }
}

// Add CSS animation for spinner
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .input-field.validation-loading {
            border-color: #3b82f6 !important;
        }
        
        .input-field.validation-success {
            border-color: #10b981 !important;
        }
        
        .input-field.validation-error {
            border-color: #ef4444 !important;
        }
    `;
    document.head.appendChild(style);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ItemValidationUI;
}
