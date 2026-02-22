/**
 * Item Validator - Validates item codes using Dashboard API with fallback to Exists API
 */

class ItemValidator {
    constructor(apiClient, tokenManager, environmentManager, factwiseIntegration) {
        this.apiClient = apiClient;
        this.tokenManager = tokenManager;
        this.environmentManager = environmentManager;
        this.factwiseIntegration = factwiseIntegration;
        this.pendingRequests = new Map();
        this.validationTimers = new Map();
        this.itemCache = new Map();
        this.debounceDelay = 2000;
    }

    validateItemCode(itemCode, inputId, onSuccess, onError, onLoading) {
        if (this.validationTimers.has(inputId)) {
            clearTimeout(this.validationTimers.get(inputId));
        }

        if (this.pendingRequests.has(inputId)) {
            this.pendingRequests.get(inputId).abort();
            this.pendingRequests.delete(inputId);
        }

        if (!itemCode || itemCode.trim() === '') {
            if (onError) onError('Item code is required');
            return;
        }

        if (this.itemCache.has(itemCode)) {
            const cachedData = this.itemCache.get(itemCode);
            if (onSuccess) onSuccess(cachedData);
            return;
        }

        const timerId = setTimeout(async () => {
            this.validationTimers.delete(inputId);
            if (onLoading) onLoading();
            await this._executeValidation(itemCode, inputId, onSuccess, onError);
        }, this.debounceDelay);

        this.validationTimers.set(inputId, timerId);
    }

    async _executeValidation(itemCode, inputId, onSuccess, onError) {
        try {
            const environment = this.environmentManager.getCurrentEnvironment();
            let token = this.factwiseIntegration?.getToken() || this.tokenManager.getToken();

            if (!environment || !environment.factwiseBaseUrl || !token) {
                if (onError) onError('Configuration error');
                return;
            }

            const abortController = new AbortController();
            this.pendingRequests.set(inputId, abortController);

            // Try dashboard API first
            const baseUrl = this.environmentManager.getFactwiseBaseUrl();
            const url = `${baseUrl}dashboard/`;

            const requestBody = {
                dashboard_view: "enterprise_item",
                tab: "active",
                sort_fields: [{ ascending: false, field: "modified_datetime", field_type: "BUILTIN", type: "DATETIME" }],
                search_text: itemCode,
                items_per_page: 5,
                page_number: 1,
                filters: null
            };

            console.log('✓ Validating item:', itemCode, 'using dashboard API');

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
                signal: abortController.signal
            });

            this.pendingRequests.delete(inputId);

            if (!response.ok) {
                console.log('⚠ Dashboard API failed, trying exists API...');
                await this._fallbackToExistsAPI(itemCode, token, inputId, onSuccess, onError);
                return;
            }

            const data = await response.json();
            const item = data.data?.find(i => i.code && i.code.toLowerCase() === itemCode.toLowerCase());

            if (item) {
                let measurement_unit_id = null;
                if (item.measurement_units?.item_measurement_units?.length > 0) {
                    measurement_unit_id = item.measurement_units.item_measurement_units[0].measurement_unit_id;
                }

                let currency_code_id = null;
                if (item.buyer_pricing_information?.currency_code_id) {
                    currency_code_id = item.buyer_pricing_information.currency_code_id;
                }

                console.log('✓ Auto-fill data:', { currency_code_id, measurement_unit_id });

                const itemDetails = {
                    item_code: itemCode,
                    item_exists: true,
                    item_name: item.name,
                    enterprise_item_id: item.enterprise_item_id,
                    measurement_unit_id,
                    currency_code_id
                };

                this.itemCache.set(itemCode, itemDetails);
                if (onSuccess) onSuccess(itemDetails);
            } else {
                await this._fallbackToExistsAPI(itemCode, token, inputId, onSuccess, onError);
            }

        } catch (error) {
            this.pendingRequests.delete(inputId);

            if (error.name === 'AbortError') {
                return;
            }

            try {
                const token = this.factwiseIntegration?.getToken() || this.tokenManager.getToken();
                await this._fallbackToExistsAPI(itemCode, token, inputId, onSuccess, onError);
            } catch (e) {
                if (onError) onError('Validation failed');
            }
        }
    }

    async _fallbackToExistsAPI(itemCode, token, inputId, onSuccess, onError) {
        const baseUrl = this.environmentManager.getFactwiseBaseUrl();
        const url = `${baseUrl}organization/items/admin/exists/?code=${encodeURIComponent(itemCode)}`;

        console.log('✓ Using exists API (fallback)');

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            if (onError) onError(`API Error: ${response.status}`);
            return;
        }

        const data = await response.json();

        if (data.item_exists) {
            const itemDetails = { item_code: itemCode, item_exists: true, item_name: data.item_name };
            this.itemCache.set(itemCode, itemDetails);
            if (onSuccess) onSuccess(itemDetails);
        } else {
            if (onError) onError('Item code does not exist');
        }
    }

    cancelValidation(inputId) {
        if (this.validationTimers.has(inputId)) {
            clearTimeout(this.validationTimers.get(inputId));
            this.validationTimers.delete(inputId);
        }
        if (this.pendingRequests.has(inputId)) {
            this.pendingRequests.get(inputId).abort();
            this.pendingRequests.delete(inputId);
        }
    }

    clearAll() {
        this.validationTimers.forEach((timerId) => clearTimeout(timerId));
        this.validationTimers.clear();
        this.pendingRequests.forEach((controller) => controller.abort());
        this.pendingRequests.clear();
    }

    clearCache() {
        this.itemCache.clear();
    }

    getCachedItem(itemCode) {
        return this.itemCache.get(itemCode) || null;
    }

    setDebounceDelay(delay) {
        this.debounceDelay = delay;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ItemValidator;
}
