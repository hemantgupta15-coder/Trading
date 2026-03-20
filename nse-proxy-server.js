// NSE India API Proxy Server
// This simple Node.js server acts as a proxy to bypass CORS restrictions
// Run with: node nse-proxy-server.js

const http = require('http');
const https = require('https');
const url = require('url');
const zlib = require('zlib');

const PORT = process.env.PORT || 3001;

// CORS headers to allow browser access
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
};

// Store cookies from NSE
let nseCookies = '';
let lastCookieUpdate = 0;
const COOKIE_REFRESH_INTERVAL = 5 * 60 * 1000; // Refresh cookies every 5 minutes

// Function to get fresh cookies from NSE homepage
function refreshNSECookies() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'www.nseindia.com',
            path: '/',
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            }
        };

        https.get(options, (res) => {
            const cookies = res.headers['set-cookie'];
            if (cookies) {
                nseCookies = cookies.map(cookie => cookie.split(';')[0]).join('; ');
                lastCookieUpdate = Date.now();
                console.log('✅ NSE cookies refreshed');
                resolve(nseCookies);
            } else {
                reject(new Error('No cookies received from NSE'));
            }
            
            // Consume response data to free up memory
            res.on('data', () => {});
            res.on('end', () => {});
        }).on('error', reject);
    });
}

// Initialize cookies on startup
refreshNSECookies().catch(err => {
    console.error('⚠️  Failed to get initial NSE cookies:', err.message);
});

const server = http.createServer((req, res) => {
    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.writeHead(200, corsHeaders);
        res.end();
        return;
    }

    // Parse the request URL
    const parsedUrl = url.parse(req.url, true);
    const symbol = parsedUrl.query.symbol;

    if (!symbol) {
        res.writeHead(400, corsHeaders);
        res.end(JSON.stringify({ error: 'Symbol parameter is required' }));
        return;
    }

    console.log(`[${new Date().toISOString()}] Fetching NSE data for: ${symbol}`);

    // Refresh cookies if needed
    const now = Date.now();
    const cookiePromise = (now - lastCookieUpdate > COOKIE_REFRESH_INTERVAL || !nseCookies)
        ? refreshNSECookies()
        : Promise.resolve(nseCookies);

    cookiePromise.then(cookies => {
        // NSE India API endpoint
        const nseUrl = `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`;

        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Referer': 'https://www.nseindia.com/',
                'X-Requested-With': 'XMLHttpRequest',
                'Cookie': cookies,
                'Connection': 'keep-alive'
            }
        };

        // Make request to NSE India
        https.get(nseUrl, options, (nseRes) => {
        const chunks = [];

        nseRes.on('data', (chunk) => {
            chunks.push(chunk);
        });

        nseRes.on('end', () => {
            try {
                const buffer = Buffer.concat(chunks);
                
                // Check if response is gzipped
                const encoding = nseRes.headers['content-encoding'];
                
                let data;
                if (encoding === 'gzip') {
                    data = zlib.gunzipSync(buffer).toString();
                } else if (encoding === 'deflate') {
                    data = zlib.inflateSync(buffer).toString();
                } else if (encoding === 'br') {
                    data = zlib.brotliDecompressSync(buffer).toString();
                } else {
                    data = buffer.toString();
                }
                
                const jsonData = JSON.parse(data);
                console.log(`✅ Successfully fetched data for ${symbol}`);
                
                res.writeHead(200, corsHeaders);
                res.end(JSON.stringify(jsonData));
            } catch (error) {
                console.error(`❌ Error processing response for ${symbol}:`, error.message);
                res.writeHead(500, corsHeaders);
                res.end(JSON.stringify({ error: 'Failed to process NSE response', details: error.message }));
            }
        });
        }).on('error', (error) => {
            console.error(`❌ Error fetching from NSE for ${symbol}:`, error.message);
            res.writeHead(500, corsHeaders);
            res.end(JSON.stringify({ error: 'Failed to fetch from NSE India' }));
        });
    }).catch(error => {
        console.error(`❌ Error refreshing cookies for ${symbol}:`, error.message);
        res.writeHead(500, corsHeaders);
        res.end(JSON.stringify({ error: 'Failed to refresh NSE cookies' }));
    });
});

server.listen(PORT, () => {
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 NSE India Proxy Server Started!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📡 Server running at: http://localhost:${PORT}`);
    console.log(`🔗 Example: http://localhost:${PORT}?symbol=RELIANCE`);
    console.log('');
    console.log('✅ CORS enabled - Browser can now access NSE India data!');
    console.log('');
    console.log('📝 Usage in your app:');
    console.log('   Update api-config.js endpoint to: http://localhost:3001');
    console.log('');
    console.log('⚠️  Keep this server running while using the trading simulator');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
});