/**
 * Simple CORS Proxy Server for Local Development
 * 
 * This proxy forwards requests to the API and adds CORS headers
 * so the browser allows the requests.
 * 
 * Usage: node proxy-server.js
 * Then update environment-manager.js to use http://localhost:8080
 */

const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 8080;

const server = http.createServer((req, res) => {
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, api-id, x-api-key, enterprise-id, Authorization',
            'Access-Control-Max-Age': '86400'
        });
        res.end();
        return;
    }

    // Parse the target URL from the request path
    // Expected format: http://localhost:8080/https://api.example.com/endpoint
    const targetUrl = req.url.substring(1); // Remove leading /

    if (!targetUrl.startsWith('http')) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid target URL. Format: http://localhost:8080/https://target-api.com/endpoint' }));
        return;
    }

    console.log(`[${new Date().toISOString()}] ${req.method} ${targetUrl}`);

    const parsedUrl = url.parse(targetUrl);
    const isHttps = parsedUrl.protocol === 'https:';
    const httpModule = isHttps ? https : http;

    // Collect request body
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        // Forward headers (excluding host)
        const headers = { ...req.headers };
        delete headers.host;
        delete headers.connection;

        // Make the proxied request
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (isHttps ? 443 : 80),
            path: parsedUrl.path,
            method: req.method,
            headers: headers
        };

        const proxyReq = httpModule.request(options, (proxyRes) => {
            // Add CORS headers to response
            const responseHeaders = {
                ...proxyRes.headers,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, api-id, x-api-key, enterprise-id, Authorization'
            };

            res.writeHead(proxyRes.statusCode, responseHeaders);

            proxyRes.on('data', chunk => {
                res.write(chunk);
            });

            proxyRes.on('end', () => {
                res.end();
                console.log(`[${new Date().toISOString()}] Response: ${proxyRes.statusCode}`);
            });
        });

        proxyReq.on('error', (error) => {
            console.error(`[${new Date().toISOString()}] Proxy error:`, error.message);
            res.writeHead(502, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ error: 'Proxy error: ' + error.message }));
        });

        if (body) {
            proxyReq.write(body);
        }

        proxyReq.end();
    });
});

server.listen(PORT, () => {
    console.log(`\n🚀 CORS Proxy Server running on http://localhost:${PORT}`);
    console.log(`\nUsage: Make requests to http://localhost:${PORT}/[TARGET_URL]`);
    console.log(`Example: http://localhost:${PORT}/https://api.example.com/endpoint\n`);
    console.log(`Press Ctrl+C to stop\n`);
});
