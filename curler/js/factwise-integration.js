/**
 * Factwise Integration - Handles iframe integration with Factwise platform
 * 
 * This module reads authentication token and API configuration from URL parameters
 * when the Curler app is embedded as an iframe in Factwise.
 * 
 * URL Parameters:
 * - token: JWT authentication token from Factwise
 * - api_url: Factwise backend API URL
 * - api_env: Environment (dev/prod)
 */

class FactwiseIntegration {
    constructor() {
        this.token = null;
        this.apiUrl = null;
        this.apiEnv = null;
        this.isEmbedded = false;

        // Read parameters from URL
        this.readUrlParameters();
    }

    /**
     * Read authentication and configuration from URL parameters
     * @private
     */
    readUrlParameters() {
        try {
            const urlParams = new URLSearchParams(window.location.search);

            this.token = urlParams.get('token');
            this.apiUrl = urlParams.get('api_url');
            this.apiEnv = urlParams.get('api_env');

            // If we have a token, we're embedded in Factwise
            this.isEmbedded = !!this.token;

            if (this.isEmbedded) {
                console.log('Curler running in Factwise iframe mode');
                console.log('API Environment:', this.apiEnv);
                console.log('API URL:', this.apiUrl);
            } else {
                console.log('Curler running in standalone mode');
            }
        } catch (error) {
            console.error('Failed to read URL parameters:', error);
        }
    }

    /**
     * Check if app is embedded in Factwise
     * @returns {boolean} True if running in Factwise iframe
     */
    isEmbeddedInFactwise() {
        return this.isEmbedded;
    }

    /**
     * Get the Factwise authentication token
     * @returns {string|null} JWT token or null if not embedded
     */
    getToken() {
        return this.token;
    }

    /**
     * Get the Factwise API URL
     * @returns {string|null} API URL or null if not embedded
     */
    getApiUrl() {
        return this.apiUrl;
    }

    /**
     * Get the API environment
     * @returns {string|null} Environment (dev/prod) or null if not embedded
     */
    getApiEnv() {
        return this.apiEnv;
    }

    /**
     * Send a message to the parent Factwise window
     * @param {string} type - Message type (NAVIGATE, NAVIGATE_BACK)
     * @param {Object} data - Additional message data
     */
    sendMessageToFactwise(type, data = {}) {
        if (!this.isEmbedded) {
            console.warn('Cannot send message: not embedded in Factwise');
            return;
        }

        try {
            window.parent.postMessage(
                {
                    type,
                    ...data
                },
                '*'
            );
            console.log('Message sent to Factwise:', type, data);
        } catch (error) {
            console.error('Failed to send message to Factwise:', error);
        }
    }

    /**
     * Navigate to a Factwise URL
     * @param {string} url - Factwise URL path (e.g., '/buyer/events/123')
     */
    navigateToFactwise(url) {
        this.sendMessageToFactwise('NAVIGATE', { url });
    }

    /**
     * Go back in Factwise history
     */
    navigateBack() {
        this.sendMessageToFactwise('NAVIGATE_BACK');
    }

    /**
     * Override environment manager to use Factwise configuration
     * @param {EnvironmentManager} environmentManager - Environment manager instance
     */
    overrideEnvironment(environmentManager) {
        if (!this.isEmbedded) {
            return; // Don't override if not embedded
        }

        // Set environment based on Factwise api_env parameter
        if (this.apiEnv === 'prod') {
            environmentManager.setEnvironment('prod');
        } else {
            environmentManager.setEnvironment('dev');
        }

        console.log('Environment synchronized with Factwise:', this.apiEnv);
    }

    /**
     * Override token manager to use Factwise token
     * @param {TokenManager} tokenManager - Token manager instance
     */
    overrideToken(tokenManager, environmentManager) {
        if (!this.isEmbedded || !this.token) {
            return; // Don't override if not embedded or no token
        }

        const currentEnv = environmentManager.getCurrentEnvironment();
        const envKey = currentEnv.id; // 'dev' or 'prod'

        // Store the Factwise token directly in tokenData structure
        tokenManager.tokenData[envKey].token = this.token;
        tokenManager.tokenData[envKey].expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours from now

        // Persist to localStorage
        tokenManager.saveToStorage();

        console.log('Token synchronized with Factwise');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FactwiseIntegration;
}
