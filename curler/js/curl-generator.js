/**
 * cURL Generator - The cURLer Phase 1
 * 
 * Purpose: Formats complete cURL commands with proper escaping and readability
 * 
 * This component generates shell-ready cURL commands from API request configurations.
 * It handles:
 * - Complete cURL command structure (method, URL, headers, body)
 * - Shell special character escaping
 * - Header formatting for cURL -H flags
 * - JSON body formatting with proper escaping
 * - Line breaks (backslash continuation) for readability
 * 
 * Phase 1 Status: FULLY IMPLEMENTED
 * 
 * Requirements: 10.2, 10.3, 10.4, 10.5
 * Properties: 10 (cURL generation completeness), 11 (cURL formatting readability)
 * 
 * Related: .kiro/specs/api-curl-generator-webapp/design.md
 */

class CurlGenerator {
    /**
     * Generate a complete cURL command from request options
     * 
     * @param {Object} options - Request configuration
     * @param {string} options.method - HTTP method (GET, POST, PUT, DELETE, etc.)
     * @param {string} options.url - Complete URL including base URL and endpoint
     * @param {Object} options.headers - Headers object (e.g., { 'Authorization': 'Bearer token' })
     * @param {Object|string} options.body - Request body (will be JSON stringified if object)
     * @param {boolean} options.pretty - Whether to format with line breaks (default: true)
     * @returns {string} Complete cURL command ready for shell execution
     */
    generate(options) {
        const {
            method = 'GET',
            url,
            headers = {},
            body = null,
            pretty = true
        } = options;

        if (!url) {
            throw new Error('URL is required for cURL generation');
        }

        const parts = [];
        const lineBreak = pretty ? ' \\\n  ' : ' ';

        // Start with curl command and method
        parts.push('curl');

        if (method !== 'GET') {
            parts.push(`-X ${method}`);
        }

        // Add URL (with single quotes to prevent shell expansion)
        parts.push(`'${url}'`);

        // Add headers
        const formattedHeaders = this.formatHeaders(headers);
        if (formattedHeaders.length > 0) {
            parts.push(...formattedHeaders);
        }

        // Add body if present
        if (body !== null && body !== undefined) {
            const formattedBody = this.formatBody(body);
            parts.push(`-d '${formattedBody}'`);
        }

        // Join parts with line breaks or spaces
        return parts.join(lineBreak);
    }

    /**
     * Format headers for cURL -H flags
     * 
     * @param {Object} headers - Headers object
     * @returns {Array<string>} Array of formatted header strings (e.g., ["-H 'Content-Type: application/json'"])
     */
    formatHeaders(headers) {
        if (!headers || typeof headers !== 'object') {
            return [];
        }

        return Object.entries(headers).map(([key, value]) => {
            // Escape single quotes in header values
            const escapedValue = this.escape(String(value));
            return `-H '${key}: ${escapedValue}'`;
        });
    }

    /**
     * Format JSON body with proper escaping for shell
     * 
     * @param {Object|string} body - Request body
     * @returns {string} Escaped JSON string ready for shell
     */
    formatBody(body) {
        // Convert to JSON string if object
        let jsonString;
        if (typeof body === 'string') {
            jsonString = body;
        } else {
            jsonString = JSON.stringify(body, null, 2);
        }

        // Escape single quotes for shell (replace ' with '\'' which ends the quote, adds escaped quote, starts new quote)
        return this.escape(jsonString);
    }

    /**
     * Escape special characters for shell execution
     * 
     * This method handles single quotes which are used to wrap the body in the cURL command.
     * Single quotes in shell prevent all expansions, but to include a literal single quote,
     * we need to end the quoted string, add an escaped single quote, and start a new quoted string.
     * 
     * @param {string} str - String to escape
     * @returns {string} Escaped string safe for shell
     */
    escape(str) {
        if (typeof str !== 'string') {
            return '';
        }

        // Replace single quotes with '\'' (end quote, escaped quote, start quote)
        // This is the standard way to include single quotes within single-quoted strings in shell
        return str.replace(/'/g, "'\\''");
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CurlGenerator;
} else {
    window.CurlGenerator = CurlGenerator;
}
