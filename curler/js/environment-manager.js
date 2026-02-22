/**
 * Environment Manager - Manages environment configuration and switching
 * 
 * Phase 1: FULLY IMPLEMENTED
 * - Environment configuration storage (dev and prod)
 * - Environment switching
 * - localStorage persistence of current environment
 * - Base URL and auth endpoint retrieval
 * 
 * This component is complete in Phase 1 and requires no changes in future phases.
 * 
 * Related specs:
 * - Requirements: .kiro/specs/api-curl-generator-webapp/requirements.md (Requirement 1)
 * - Design: .kiro/specs/api-curl-generator-webapp/design.md (Component 1)
 */

class EnvironmentManager {
    constructor() {
        this.environments = {
            dev: {
                id: 'dev',
                name: 'Development',
                baseUrl: 'https://n29p4xri95.execute-api.us-east-1.amazonaws.com',
                authEndpoint: '/auth/token',
                deployUrl: 'https://factwise-newdbtest.netlify.app/'
            },
            prod: {
                id: 'prod',
                name: 'Production',
                baseUrl: 'https://qc9s5bz8d7.execute-api.us-east-1.amazonaws.com',
                authEndpoint: '/auth/token',
                deployUrl: 'https://apps.factwise.io/'
            }
        };

        // CORS proxy configuration for local development
        this.useCorsProxy = true; // Enable by default
        this.corsProxyUrl = 'http://localhost:8080/'; // Local proxy server

        // Load current environment from localStorage or default to dev
        this.current = this.loadCurrentEnvironment();
    }

    /**
     * Get the current environment configuration
     * @returns {Object} Current environment config with name, baseUrl, authEndpoint
     */
    getCurrentEnvironment() {
        return {
            id: this.current,
            ...this.environments[this.current]
        };
    }

    /**
     * Switch to a different environment
     * @param {string} envName - Environment name ('dev' or 'prod')
     * @throws {Error} If environment name is invalid
     */
    setEnvironment(envName) {
        if (!this.environments[envName]) {
            throw new Error(`Invalid environment: ${envName}. Must be 'dev' or 'prod'.`);
        }

        this.current = envName;
        this.saveCurrentEnvironment();
    }

    /**
     * Get the base URL for the current environment
     * Optionally prepends CORS proxy if enabled
     * @returns {string} Base URL for API requests
     */
    getBaseUrl() {
        const baseUrl = this.environments[this.current].baseUrl;
        if (this.useCorsProxy) {
            return this.corsProxyUrl + baseUrl;
        }
        return baseUrl;
    }

    /**
     * Get the raw base URL without CORS proxy
     * @returns {string} Raw base URL
     */
    getRawBaseUrl() {
        return this.environments[this.current].baseUrl;
    }

    /**
     * Toggle CORS proxy on/off
     * @param {boolean} enabled - Whether to use CORS proxy
     */
    setCorsProxy(enabled) {
        this.useCorsProxy = enabled;
    }

    /**
     * Check if CORS proxy is enabled
     * @returns {boolean} True if CORS proxy is enabled
     */
    isCorsProxyEnabled() {
        return this.useCorsProxy;
    }

    /**
     * Get the authentication endpoint for the current environment
     * @returns {string} Auth endpoint path
     */
    getAuthEndpoint() {
        return this.environments[this.current].authEndpoint;
    }

    /**
     * Load current environment selection from localStorage
     * @returns {string} Environment name ('dev' or 'prod')
     * @private
     */
    loadCurrentEnvironment() {
        try {
            const stored = localStorage.getItem('curler_current_environment');
            if (stored && this.environments[stored]) {
                return stored;
            }
        } catch (error) {
            console.error('Failed to load environment from localStorage:', error);
        }

        // Default to dev if nothing stored or error occurred
        return 'dev';
    }

    /**
     * Save current environment selection to localStorage
     * @private
     */
    saveCurrentEnvironment() {
        try {
            localStorage.setItem('curler_current_environment', this.current);
        } catch (error) {
            console.error('Failed to save environment to localStorage:', error);
            // Continue operation even if save fails (graceful degradation)
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnvironmentManager;
}
