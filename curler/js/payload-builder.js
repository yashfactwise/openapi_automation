/**
 * Payload Builder - Constructs API request payloads
 * 
 * Handles payload construction for various API operations,
 * ensuring proper format and required fields.
 */

class PayloadBuilder {
    constructor() {
        console.log('PayloadBuilder initialized');
    }

    /**
     * Build payload for items bulk create operation
     * @param {Object} account - Current account with user email
     * @param {Object} data - Data object containing items array
     * @returns {Object} Formatted payload for API
     */
    buildItemsBulkCreatePayload(account, data) {
        const payload = {
            created_by_user_email: account?.user_email || '',
            items: data.items || []
        };
        return payload;
    }

    /**
     * Build payload for contract state operation
     * @param {Object} account - Current account with user email
     * @param {Object} params - Parameters for contract state update
     * @returns {Object} Formatted payload for API
     */
    buildContractStatePayload(account, params) {
        const payload = {
            modified_by_user_email: account?.user_email || params.modified_by_user_email || '',
            ...params
        };
        return payload;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PayloadBuilder;
} else {
    window.PayloadBuilder = PayloadBuilder;
}
