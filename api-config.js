// API Configuration for Live Stock Prices
// Choose your preferred API provider

// ============================================
// OPTION 1: NSE India Official API (WITH CORS PROXY)
// ============================================
// Free: No API key required, no rate limits!
// Direct from NSE India official website via CORS proxy
//
// DEPLOYMENT INSTRUCTIONS:
// 1. For local development: Use 'http://localhost:3001'
// 2. For production (Render.com): Replace with your Render URL
//    Example: 'https://trading-simulator-proxy.onrender.com'
// 3. See DEPLOYMENT.md for complete setup guide
const NSE_INDIA_CONFIG = {
    enabled: true,
    apiKey: null, // No API key needed
    endpoint: 'https://trading-proxy-dc80.onrender.com', // Production Render URL
    
    async fetchPrice(symbol) {
        try {
            const url = `${this.endpoint}?symbol=${symbol}`;
            console.log(`[NSE India] Fetching via proxy: ${url}`);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                console.error(`[NSE India] Proxy server error: ${response.status}`);
                console.error('💡 Make sure the proxy server is running: node nse-proxy-server.js');
                return null;
            }
            
            const data = await response.json();
            
            console.log(`[NSE India] Response for ${symbol}:`, data);
            
            // Check for errors
            if (!data.priceInfo) {
                console.error(`[NSE India] No price info for ${symbol}`);
                return null;
            }
            
            const priceInfo = data.priceInfo;
            
            return {
                symbol: symbol,
                price: parseFloat(priceInfo.lastPrice),
                previousClose: parseFloat(priceInfo.previousClose),
                change: parseFloat(priceInfo.change),
                changePercent: parseFloat(priceInfo.pChange),
                high: parseFloat(priceInfo.intraDayHighLow.max),
                low: parseFloat(priceInfo.intraDayHighLow.min),
                open: parseFloat(priceInfo.open),
                close: parseFloat(priceInfo.close)
            };
        } catch (error) {
            console.error(`[NSE India] Fetch error for ${symbol}:`, error);
            console.error('💡 Make sure the proxy server is running: node nse-proxy-server.js');
            return null;
        }
    }
};

// ============================================
// OPTION 2: Twelve Data (BACKUP)
// ============================================
// Free: 800 requests/day (8 per minute limit)
// Sign up: https://twelvedata.com/
// NOTE: Free tier doesn't support NSE, but works for simulation/testing
const TWELVE_DATA_CONFIG = {
    enabled: false, // ❌ DISABLED - Using NSE India via proxy now
    apiKey: 'c9731c14b76941ccada3a8e0382bcc99',
    endpoint: 'https://api.twelvedata.com/quote',
    
    async fetchPrice(symbol) {
        try {
            const url = `${this.endpoint}?symbol=${symbol}&exchange=NSE&apikey=${this.apiKey}`;
            console.log(`[Twelve Data] Fetching: ${url}`);
            
            const response = await fetch(url);
            const data = await response.json();
            
            console.log(`[Twelve Data] Response for ${symbol}:`, data);
            
            // Check for API errors
            if (data.status === 'error') {
                console.error(`[Twelve Data] API Error for ${symbol}:`, data.message);
                return null;
            }
            
            if (data.price) {
                return {
                    symbol: symbol,
                    price: parseFloat(data.price),
                    previousClose: parseFloat(data.previous_close),
                    change: parseFloat(data.change),
                    changePercent: parseFloat(data.percent_change),
                    high: parseFloat(data.high),
                    low: parseFloat(data.low)
                };
            }
            
            console.warn(`[Twelve Data] No price data for ${symbol}`);
            return null;
        } catch (error) {
            console.error(`[Twelve Data] Fetch error for ${symbol}:`, error);
            return null;
        }
    }
};

// ============================================
// OPTION 3: Alpha Vantage (BACKUP)
// ============================================
// Free: 25 requests/day, 5 requests/minute
// Sign up: https://www.alphavantage.co/support/#api-key
const ALPHA_VANTAGE_CONFIG = {
    enabled: false, // Disabled (using Twelve Data now)
    apiKey: 'IBR2ZOARKOZ1O8XZ',
    endpoint: 'https://www.alphavantage.co/query',
    
    async fetchPrice(symbol) {
        const url = `${this.endpoint}?function=GLOBAL_QUOTE&symbol=${symbol}.BSE&apikey=${this.apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        
        const quote = data['Global Quote'];
        if (quote && quote['05. price']) {
            return {
                symbol: symbol,
                price: parseFloat(quote['05. price']),
                previousClose: parseFloat(quote['08. previous close']),
                change: parseFloat(quote['09. change']),
                changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
                high: parseFloat(quote['03. high']),
                low: parseFloat(quote['04. low'])
            };
        }
        return null;
    }
};

// ============================================
// OPTION 4: Finnhub
// ============================================
// Free: 60 requests/minute
// Sign up: https://finnhub.io/
const FINNHUB_CONFIG = {
    enabled: false,
    apiKey: 'YOUR_FINNHUB_API_KEY',
    endpoint: 'https://finnhub.io/api/v1/quote',
    
    async fetchPrice(symbol) {
        const url = `${this.endpoint}?symbol=${symbol}.NS&token=${this.apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.c) {
            return {
                symbol: symbol,
                price: data.c, // current price
                previousClose: data.pc, // previous close
                change: data.d, // change
                changePercent: data.dp, // change percent
                high: data.h, // high
                low: data.l // low
            };
        }
        return null;
    }
};

// ============================================
// OPTION 5: Yahoo Finance via RapidAPI
// ============================================
// Free: 500 requests/month
// Sign up: https://rapidapi.com/
const YAHOO_RAPIDAPI_CONFIG = {
    enabled: false,
    apiKey: 'YOUR_RAPIDAPI_KEY',
    endpoint: 'https://yahoo-finance15.p.rapidapi.com/api/yahoo/qu/quote',
    
    async fetchPrice(symbol) {
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': this.apiKey,
                'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com'
            }
        };
        
        const url = `${this.endpoint}/${symbol}.NS`;
        const response = await fetch(url, options);
        const data = await response.json();
        
        if (data.body && data.body.length > 0) {
            const quote = data.body[0];
            return {
                symbol: symbol,
                price: quote.regularMarketPrice,
                previousClose: quote.regularMarketPreviousClose,
                change: quote.regularMarketChange,
                changePercent: quote.regularMarketChangePercent,
                high: quote.regularMarketDayHigh,
                low: quote.regularMarketDayLow
            };
        }
        return null;
    }
};

// ============================================
// OPTION 6: INDstocks (FUTURE PROVIDER - PLACEHOLDER)
// ============================================
// This is a FUTURE integration point. The rest of the app already uses
// API_CONFIG.fetchPrice(symbol) and marketData[symbol].currentPrice,
// so swapping to INDstocks here will automatically feed all flows
// (equities, options, futures, holdings, positions, P&L).
//
// To actually enable INDstocks later:
//
// 1) Implement a Node proxy that connects to INDstocks:
//    - Maintains a single WebSocket connection to INDstocks
//    - Caches live quotes for subscribed symbols
//    - Exposes: GET /indstocks/price?symbol=RELIANCE
//      (or similar) for the frontend
//
// 2) Update INDSTOCKS_CONFIG below with real base URL / API key.
// 3) Set INDSTOCKS_CONFIG.enabled = true and disable others,
//    or adjust getActiveAPI() to prefer INDstocks.
//
// NOTE: The frontend NEVER calls INDstocks directly; it only calls
//       this.fetchPrice(symbol), which should hit your proxy.
//
// Example proxy flow (future):
//   Browser → /indstocks/price?symbol=RELIANCE (Node)
//   Node proxy → WebSocket / REST → INDstocks
//   Node proxy → returns latest cached quote as JSON
const INDSTOCKS_CONFIG = {
    enabled: false, // ✅ ENABLED - using INDstocks mock/proxy for testing
    // REST base URL of your Node proxy that fronts INDstocks
    // e.g. 'http://localhost:3002/indstocks'
    restEndpoint: 'http://localhost:3002/indstocks',
    // Optional WebSocket URL if you stream quotes into the proxy cache
    // e.g. 'wss://stream.indstocks.com/quotes'
    wsEndpoint: null,
    // API key / auth token that your Node proxy uses to talk to INDstocks
    // (NOT exposed to the browser in a real setup)
    apiKey: null,

    /**
     * Future-ready fetchPrice for INDstocks.
     *
     * Implementation options (on your Node proxy):
     *  - REST mode:
     *      GET /indstocks/price?symbol=RELIANCE
     *      → proxy forwards to INDstocks REST and returns normalized JSON
     *
     *  - WebSocket+cache mode:
     *      - Proxy subscribes to INDstocks WebSocket for many symbols
     *      - Keeps latest quote per symbol in memory
     *      - GET /indstocks/price?symbol=RELIANCE just returns cached quote
     *
     * This frontend method DOES NOT care which strategy you pick;
     * it only expects normalized JSON with price fields.
     */
    async fetchPrice(symbol) {
        try {
            const url = `${this.restEndpoint}/price?symbol=${encodeURIComponent(symbol)}`;
            console.log(`[INDstocks] Fetching via proxy: ${url}`);

            const response = await fetch(url);

            if (!response.ok) {
                console.error(`[INDstocks] Proxy server error: ${response.status}`);
                console.error('💡 Make sure the INDstocks proxy is running and configured.');
                return null;
            }

            const data = await response.json();
            console.log(`[INDstocks] Response for ${symbol}:`, data);

            // Expected normalized shape from your proxy (example):
            // {
            //   symbol: "RELIANCE",
            //   lastPrice: 2850.5,
            //   previousClose: 2820.0,
            //   change: 30.5,
            //   changePercent: 1.08,
            //   high: 2860.0,
            //   low: 2815.0,
            //   open: 2830.0,
            //   close: 2840.0
            // }
            if (!data || typeof data.lastPrice === 'undefined') {
                console.error(`[INDstocks] No price info for ${symbol}`);
                return null;
            }

            return {
                symbol: symbol,
                price: parseFloat(data.lastPrice),
                previousClose: data.previousClose != null ? parseFloat(data.previousClose) : null,
                change: data.change != null ? parseFloat(data.change) : null,
                changePercent: data.changePercent != null ? parseFloat(data.changePercent) : null,
                high: data.high != null ? parseFloat(data.high) : null,
                low: data.low != null ? parseFloat(data.low) : null,
                open: data.open != null ? parseFloat(data.open) : null,
                close: data.close != null ? parseFloat(data.close) : null
            };
        } catch (error) {
            console.error(`[INDstocks] Fetch error for ${symbol}:`, error);
            console.error('💡 Make sure the INDstocks proxy is implemented and reachable.');
            return null;
        }
    }
};

// ============================================
// AUTO-SELECT ACTIVE API
// ============================================
function getActiveAPI() {
    // Prefer INDstocks when explicitly enabled
    if (INDSTOCKS_CONFIG.enabled) return INDSTOCKS_CONFIG;

    if (NSE_INDIA_CONFIG.enabled) return NSE_INDIA_CONFIG;
    if (TWELVE_DATA_CONFIG.enabled) return TWELVE_DATA_CONFIG;
    if (ALPHA_VANTAGE_CONFIG.enabled) return ALPHA_VANTAGE_CONFIG;
    if (FINNHUB_CONFIG.enabled) return FINNHUB_CONFIG;
    if (YAHOO_RAPIDAPI_CONFIG.enabled) return YAHOO_RAPIDAPI_CONFIG;
    
    // Default to NSE India
    return NSE_INDIA_CONFIG;
}

// Export for use in app.js
const API_CONFIG = getActiveAPI();

console.log('📡 Active API Provider:', 
    INDSTOCKS_CONFIG.enabled ? 'INDstocks (via Node proxy - FUTURE PROVIDER)' :
    NSE_INDIA_CONFIG.enabled ? 'NSE India Official (via Local Proxy) - FREE!' :
    TWELVE_DATA_CONFIG.enabled ? 'Twelve Data (800 req/day, 8 req/min)' :
    ALPHA_VANTAGE_CONFIG.enabled ? 'Alpha Vantage (25 req/day)' :
    FINNHUB_CONFIG.enabled ? 'Finnhub (60 req/min)' :
    YAHOO_RAPIDAPI_CONFIG.enabled ? 'Yahoo Finance (500 req/month)' :
    'Simulation Only'
);

if (NSE_INDIA_CONFIG.enabled) {
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ NSE India API Enabled via Local Proxy Server');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📡 Proxy Server: http://localhost:3001');
    console.log('🔗 Data Source: NSE India Official API');
    console.log('');
    console.log('⚠️  IMPORTANT: Make sure the proxy server is running!');
    console.log('   Run in terminal: node nse-proxy-server.js');
    console.log('');
    console.log('✨ Features:');
    console.log('   • Real-time NSE stock prices');
    console.log('   • No API key required');
    console.log('   • No rate limits');
    console.log('   • CORS issue resolved');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
}

if (INDSTOCKS_CONFIG.enabled) {
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 INDstocks Provider Enabled (via Node Proxy)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📡 Proxy Server (expected):', INDSTOCKS_CONFIG.restEndpoint);
    console.log('🔗 Data Source: INDstocks (real-time equities & F&O)');
    console.log('');
    console.log('⚙️  Make sure your INDstocks proxy is implemented to:');
    console.log('   • Maintain a single WebSocket connection to INDstocks');
    console.log('   • Cache latest quotes per symbol');
    console.log('   • Serve GET /indstocks/price?symbol=RELIANCE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
}