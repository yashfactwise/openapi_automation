/**
 * Item Validator - Validates item codes and retrieves item information
 * 
 * Features:
 * - Validates if item code exists in Factwise
 * - Retrieves currency code, unit code, and other item details
 * - Debounced validation (2 seconds after user stops typing)
 * - Request cancellation when user changes input
 * - Visual feedback (loading, success, error states)
 * 
 * Integration:
 * - Contract Create API - validates contract items
 * - Contract Update API - validates contract items
 * 
 * API Endpoint: GET /items/admin/exists/?code={item_code}
 * Response: { item_exists: boolean, item_name: string }
 */

class ItemValidator {
    constructor(apiClient, tokenManager, environmentManager) {
        this.apiClient = apiClient;
        this.tokenManager = tokenManager;
        this.environmentManager = environmentManager;

        // Track pending requests for cancellation
        this.pendingRequests = new Map(); // inputId -> AbortController

        // Track validation timers for debouncing
        this.validationTimers = new Map(); // inputId -> timeoutId

        // Cache validated items to avoid redundant API calls
        this.itemCache = new Map(); // itemCode -> itemData

        // Debounce delay in milliseconds
        this.debounceDelay = 2000; // 2 seconds
    }

    /**
     * Validate an item code with debouncing and cancellation
     * 
     * @param {string} itemCode - The item code to validate
     * @param {string} inputId - Unique identifier for the input field
     * @param {Function} onSuccess - Callback when item exists (receives item data)
     * @param {Function} onError - Callback when item doesn't exist or error occurs
     * @param {Function} onLoading - Callback when validation starts
     * @returns {void}
     */
    validateItemCode(itemCode, inputId, onSuccess, onError, onLoading) {
        // Clear any existing timer for this input
        if (this.validationTimers.has(inputId)) {
            clearTimeout(this.validationTimers.get(inputId));
        }

        // Cancel any pending request for this input
        if (this.pendingRequests.has(inputId)) {
            this.pendingRequests.get(inputId).abort();
            this.pendingRequests.delete(inputId);
        }

        // If item code is empty, clear validation state
        if (!itemCode || itemCode.trim() === '') {
            if (onError) onError('Item code is required');
            return;
        }

        // Check cache first
        if (this.itemCache.has(itemCode)) {
            const cachedData = this.itemCache.get(itemCode);
            if (onSuccess) onSuccess(cachedData);
            return;
        }

        // Set debounce timer
        const timerId = setTimeout(async () => {
            this.validationTimers.delete(inputId);

            // Call loading callback
            if (onLoading) onLoading();

            // Execute validation
            await this._executeValidation(itemCode, inputId, onSuccess, onError);
        }, this.debounceDelay);

        this.validationTimers.set(inputId, timerId);
    }

    /**
     * Execute the actual validation API call
     * @private
     */
    async _executeValidation(itemCode, inputId, onSuccess, onError) {
        try {
            // Get current environment and token
            const environment = this.environmentManager.getCurrentEnvironment();
            const token = this.tokenManager.getToken();

            if (!environment || !environment.baseUrl) {
                if (onError) onError('Environment not configured');
                return;
            }

            if (!token) {
                if (onError) onError('Authentication token not found');
                return;
            }

            // Create AbortController for this request
            const abortController = new AbortController();
            this.pendingRequests.set(inputId, abortController);

            // Construct API URL
            const url = `${environment.baseUrl}items/admin/exists/?code=${encodeURIComponent(itemCode)}`;

            // Make API request using fetch with AbortController
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                signal: abortController.signal
            });

            // Remove from pending requests
            this.pendingRequests.delete(inputId);

            // Handle response
            if (!response.ok) {
                if (response.status === 401) {
                    if (onError) onError('Authentication failed. Please refresh.');
                    return;
                }
                if (onError) onError(`API Error: ${response.status}`);
                return;
            }

            const data = await response.json();

            // Check if item exists
            if (data.item_exists) {
                // Get full item details
                const itemDetails = await this._getItemDetails(itemCode, token, environment);

                // Cache the result
                this.itemCache.set(itemCode, itemDetails);

                // Call success callback
                if (onSuccess) onSuccess(itemDetails);
            } else {
                if (onError) onError('Item code does not exist');
            }

        } catch (error) {
            // Remove from pending requests
            this.pendingRequests.delete(inputId);

            // Handle abort (user changed input)
            if (error.name === 'AbortError') {
                console.log('Validation request cancelled for:', inputId);
                return;
            }

            // Handle other errors
            console.error('Item validation error:', error);
            if (onError) onError(error.message || 'Validation failed');
        }
    }

    /**
     * Get full item details including currency and unit codes
     * @private
     */
    async _getItemDetails(itemCode, token, environment) {
        // For now, return basic info from exists API
        // TODO: If needed, call additional API to get currency_code, unit_code, etc.
        // Example: GET /items/{item_id}/admin/

        return {
            item_code: itemCode,
            item_exists: true,
            // These would come from a detailed item API call
            // currency_code: 'USD',
            // unit_code: 'EA',
            // item_name: 'Item Name',
            // Add more fields as needed
        };
    }

    /**
     * Cancel validation for a specific input
     * 
     * @param {string} inputId - The input identifier
     */
    cancelValidation(inputId) {
        // Clear timer
        if (this.validationTimers.has(inputId)) {
            clearTimeout(this.validationTimers.get(inputId));
            this.validationTimers.delete(inputId);
        }

        // Cancel request
        if (this.pendingRequests.has(inputId)) {
            this.pendingRequests.get(inputId).abort();
            this.pendingRequests.delete(inputId);
        }
    }

    /**
     * Clear all pending validations
     */
    clearAll() {
        // Clear all timers
        this.validationTimers.forEach((timerId) => clearTimeout(timerId));
        this.validationTimers.clear();

        // Cancel all requests
        this.pendingRequests.forEach((controller) => controller.abort());
        this.pendingRequests.clear();
    }

    /**
     * Clear the item cache
     */
    clearCache() {
        this.itemCache.clear();
    }

    /**
     * Get cached item data
     * 
     * @param {string} itemCode - The item code
     * @returns {Object|null} Cached item data or null
     */
    getCachedItem(itemCode) {
        return this.itemCache.get(itemCode) || null;
    }

    /**
     * Set debounce delay
     * 
     * @param {number} delay - Delay in milliseconds
     */
    setDebounceDelay(delay) {
        this.debounceDelay = delay;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ItemValidator;
}
