/**
 * Token Manager - Handles bearer token lifecycle and automatic refresh
 * 
 * Phase 1: FULLY IMPLEMENTED
 * - Token storage per environment with expiration timestamps
 * - Token validity checking
 * - Automatic token refresh when expired or missing
 * - API credentials storage per environment
 * - localStorage persistence of tokens and credentials
 * 
 * This component is complete in Phase 1 and requires no changes in future phases.
 * 
 * Token Lifecycle:
 * - Tokens expire after 1 hour (3600 seconds)
 * - getToken() automatically refreshes expired tokens
 * - Credentials are stored per environment for automatic refresh
 * 
 * Related specs:
 * - Requirements: .kiro/specs/api-curl-generator-webapp/requirements.md (Requirement 3, 11)
 * - Design: .kiro/specs/api-curl-generator-webapp/design.md (Component 3)
 */

class TokenManager {
    constructor(environmentManager) {
        this.environmentManager = environmentManager;

        // Initialize token data structure: { dev: {...}, prod: {...} }
        this.tokenData = {
            dev: {
                token: null,
                expiresAt: null,
                credentials: {
                    username: null,
                    password: null
                }
            },
            prod: {
                token: null,
                expiresAt: null,
                credentials: {
                    username: null,
                    password: null
                }
            }
        };

        // Load token data from localStorage
        this.loadFromStorage();
    }

    /**
     * Get a valid token for the specified environment
     * Automatically refreshes the token if expired or missing
     * @param {string} environment - 'dev' or 'prod'
     * @returns {Promise<string>} Valid bearer token
     * @throws {Error} If token refresh fails or credentials are missing
     */
    async getToken(environment) {
        // Check if token is valid
        if (this.isTokenValid(environment)) {
            return this.tokenData[environment].token;
        }

        // Token is expired or missing, refresh it
        return await this.refreshToken(environment);
    }

    /**
     * Check if the token for an environment is valid (not expired)
     * @param {string} environment - 'dev' or 'prod'
     * @returns {boolean} True if token exists and is not expired
     */
    isTokenValid(environment) {
        const data = this.tokenData[environment];

        // Token must exist
        if (!data.token) {
            return false;
        }

        // Token must not be expired
        if (!data.expiresAt) {
            return false;
        }

        // Check if token is still valid (with 60 second buffer)
        const now = Date.now();
        return data.expiresAt > now + 60000; // 60 second buffer before expiry
    }

    /**
     * Refresh the bearer token for an environment
     * Makes an API call to the auth endpoint using stored credentials
     * @param {string} environment - 'dev' or 'prod'
     * @returns {Promise<string>} New bearer token
     * @throws {Error} If credentials are missing or refresh fails
     */
    async refreshToken(environment) {
        const credentials = this.tokenData[environment].credentials;

        // Check if credentials are available
        if (!credentials.username || !credentials.password) {
            throw new Error(`No credentials stored for ${environment} environment. Please set credentials first.`);
        }

        // Get auth endpoint from environment manager
        const envConfig = this.environmentManager.getCurrentEnvironment();
        const authUrl = `${this.environmentManager.getBaseUrl()}${this.environmentManager.getAuthEndpoint()}`;

        try {
            // Make auth request
            const response = await fetch(authUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: credentials.username,
                    password: credentials.password
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Token refresh failed: ${response.status} ${response.statusText}. ${errorText}`);
            }

            const data = await response.json();

            // Extract token from response (adjust based on actual API response format)
            const token = data.token || data.access_token || data.bearer_token;

            if (!token) {
                throw new Error('Token refresh failed: No token in response');
            }

            // Store token with expiration (1 hour from now)
            this.tokenData[environment].token = token;
            this.tokenData[environment].expiresAt = Date.now() + 3600000; // 1 hour = 3600000ms

            // Persist to storage
            this.saveToStorage();

            return token;
        } catch (error) {
            console.error(`Token refresh failed for ${environment}:`, error);
            throw error;
        }
    }

    /**
     * Set API credentials for an environment
     * @param {string} environment - 'dev' or 'prod'
     * @param {Object} credentials - Credentials object with username and password
     * @param {string} credentials.username - API username
     * @param {string} credentials.password - API password
     */
    setCredentials(environment, credentials) {
        if (!credentials.username || !credentials.password) {
            throw new Error('Credentials must include username and password');
        }

        this.tokenData[environment].credentials = {
            username: credentials.username,
            password: credentials.password
        };

        // Persist to storage
        this.saveToStorage();
    }

    /**
     * Get stored credentials for an environment
     * @param {string} environment - 'dev' or 'prod'
     * @returns {Object} Credentials object with username and password
     */
    getCredentials(environment) {
        return {
            ...this.tokenData[environment].credentials
        };
    }

    /**
     * Save token data to localStorage
     */
    saveToStorage() {
        try {
            localStorage.setItem('curler_tokens', JSON.stringify(this.tokenData));
        } catch (error) {
            console.error('Failed to save tokens to localStorage:', error);
            // Graceful degradation - continue with in-memory data
        }
    }

    /**
     * Load token data from localStorage
     */
    loadFromStorage() {
        try {
            const stored = localStorage.getItem('curler_tokens');
            if (stored) {
                const loaded = JSON.parse(stored);

                // Merge loaded data with default structure to ensure all fields exist
                this.tokenData.dev = {
                    ...this.tokenData.dev,
                    ...loaded.dev
                };
                this.tokenData.prod = {
                    ...this.tokenData.prod,
                    ...loaded.prod
                };
            }
        } catch (error) {
            console.error('Failed to load tokens from localStorage:', error);
            // Continue with empty token data structure
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TokenManager;
}
