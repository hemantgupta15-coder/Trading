// indstocks-mock-server.js
// Mock INDstocks/Upstox-style REST proxy using only Node's built-in http module

const http = require('http');
const url = require('url');

const PORT = 3002;

// Simple in-memory mock quotes
const mockQuotes = {
  RELIANCE: {
    symbol: 'RELIANCE',
    lastPrice: 2850.5,
    previousClose: 2820.0,
    change: 30.5,
    changePercent: 1.08,
    high: 2860.0,
    low: 2815.0,
    open: 2830.0,
    close: 2840.0
  },
  TCS: {
    symbol: 'TCS',
    lastPrice: 3820.0,
    previousClose: 3780.0,
    change: 40.0,
    changePercent: 1.06,
    high: 3850.0,
    low: 3775.0,
    open: 3790.0,
    close: 3810.0
  }
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // Only handle GET /indstocks/price
  if (req.method === 'GET' && parsedUrl.pathname === '/indstocks/price') {
    const symbol = (parsedUrl.query.symbol || '').toUpperCase();

    if (!symbol) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing symbol query param' }));
      return;
    }

    const quote = mockQuotes[symbol];
    if (!quote) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `No mock data for symbol ${symbol}` }));
      return;
    }

    // This JSON shape matches INDSTOCKS_CONFIG.fetchPrice expectations
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(quote));
    return;
  }

  // Fallback for other paths
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`✅ INDstocks mock REST server running at http://localhost:${PORT}/indstocks/price`);
  console.log(`Try: curl "http://localhost:${PORT}/indstocks/price?symbol=RELIANCE"`);
});