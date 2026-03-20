// NSE India API Proxy Server
// This simple Node.js server acts as a proxy to bypass CORS restrictions
// Run with: node nse-proxy-server.js

const http = require('http');
const https = require('https');
const url = require('url');
const zlib = require('zlib');

const PORT = 3001;

// CORS headers to allow browser access
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
};

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

    // NSE India API endpoint
    const nseUrl = `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`;

    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://www.nseindia.com/',
            'X-Requested-With': 'XMLHttpRequest'
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