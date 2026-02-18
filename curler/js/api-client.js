/**
 * API Client - Handles HTTP requests to backend APIs
 * 
 * Phase 1: FULLY IMPLEMENTED
 * - HTTP request execution using fetch API
 * - Request execution time measurement
 * - Structured error response handling
 * - Network error handling
 * - Complete response data capture (status, headers, body, time)
 * 
 * This component is complete in Phase 1 and requires no changes in future phases.
 * 
 * Usage:
 * - request() for low-level HTTP requests
 * - executeOperation() for high-level operation execution with environment, token, etc.
 * 
 * Related specs:
 * - Requirements: .kiro/specs/api-curl-generator-webapp/requirements.md (Requirements 10.7, 10.8, 10.9, 15.6)
 * - Design: .kiro/specs/api-curl-generator-webapp/design.md (Component 7)
 */

class ApiClient {
    /**
     * Make an HTTP request using fetch API
     * Measures execution time and returns structured response
     * 
     * @param {Object} options - Request configuration
     * @param {string} options.method - HTTP method (GET, POST, PUT, DELETE, etc.)
     * @param {string} options.url - Complete URL for the request
     * @param {Object} options.headers - Request headers object
     * @param {Object|string} options.body - Request body (will be JSON stringified if object)
     * @returns {Promise<Object>} Response object with status, statusText, headers, body, time, error
     */
    async request(options) {
        const {
            method = 'GET',
            url,
            headers = {},
            body = null
        } = options;

        if (!url) {
            return {
                status: 0,
                statusText: 'Bad Request',
                headers: {},
                body: null,
                time: 0,
                error: 'URL is required for API request'
            };
        }

        // Record start time for execution measurement
        const startTime = performance.now();

        try {
            // Prepare fetch options
            const fetchOptions = {
                method,
                headers: {
                    ...headers
                }
            };

            // Add body if present (and method supports it)
            if (body !== null && body !== undefined && method !== 'GET' && method !== 'HEAD') {
                if (typeof body === 'string') {
                    fetchOptions.body = body;
                } else {
                    fetchOptions.body = JSON.stringify(body);
                    // Ensure Content-Type is set for JSON
                    if (!fetchOptions.headers['Content-Type']) {
                        fetchOptions.headers['Content-Type'] = 'application/json';
                    }
                }
            }

            // Make the HTTP request
            const response = await fetch(url, fetchOptions);

            // Calculate execution time
            const endTime = performance.now();
            const executionTime = Math.round(endTime - startTime);

            // Extract response headers
            const responseHeaders = {};
            response.headers.forEach((value, key) => {
                responseHeaders[key] = value;
            });

            // Parse response body
            let responseBody;
            const contentType = response.headers.get('content-type') || '';

            try {
                if (contentType.includes('application/json')) {
                    responseBody = await response.json();
                } else {
                    responseBody = await response.text();
                }
            } catch (parseError) {
                // If body parsing fails, use empty string
                console.warn('Failed to parse response body:', parseError);
                responseBody = '';
            }

            // Return structured response
            return {
                status: response.status,
                statusText: response.statusText,
                headers: responseHeaders,
                body: responseBody,
                time: executionTime,
                error: null
            };

        } catch (error) {
            // Handle network errors and other exceptions
            const endTime = performance.now();
            const executionTime = Math.round(endTime - startTime);

            console.error('API request failed:', error);

            // Return structured error response
            return {
                status: 0,
                statusText: 'Network Error',
                headers: {},
                body: null,
                time: executionTime,
                error: error.message || 'Network request failed'
            };
        }
    }

    /**
     * Execute an API operation with environment, token, and payload
     * High-level method that combines all pieces for a complete API call
     * 
     * @param {Object} environment - Environment configuration object
     * @param {string} environment.baseUrl - Base URL for the API
     * @param {Object} operation - Operation definition object
     * @param {string} operation.endpoint - API endpoint path
     * @param {string} operation.method - HTTP method
     * @param {Object} payload - Request payload/body
     * @param {string} token - Bearer token for authentication
     * @returns {Promise<Object>} Response object with status, statusText, headers, body, time, error
     */
    async executeOperation(environment, operation, payload, token) {
        // Validate required parameters
        if (!environment || !environment.baseUrl) {
            return {
                status: 0,
                statusText: 'Bad Request',
                headers: {},
                body: null,
                time: 0,
                error: 'Environment with baseUrl is required'
            };
        }

        if (!operation || !operation.endpoint || !operation.method) {
            return {
                status: 0,
                statusText: 'Bad Request',
                headers: {},
                body: null,
                time: 0,
                error: 'Operation with endpoint and method is required'
            };
        }

        // Construct complete URL
        const url = `${environment.baseUrl}${operation.endpoint}`;

        // Prepare headers
        const headers = {
            'Content-Type': 'application/json'
        };

        // Add Authorization header if token is provided
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Execute the request
        return await this.request({
            method: operation.method,
            url,
            headers,
            body: payload
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiClient;
}
