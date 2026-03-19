// Trading Simulator Application
// Data Storage
let currentUser = null;
let users = JSON.parse(localStorage.getItem('tradingUsers')) || {};
let marketData = {};
let priceUpdateInterval = null;
let currentTradeStock = null;
let currentTradeType = 'buy';

// Use comprehensive NSE stock data from stocks-data.js
const stocksData = typeof nseStocksData !== 'undefined' ? nseStocksData : [];

// Lot sizes for derivatives (as per NSE F&O - Updated 2026)
const LOT_SIZES = {
    // Indices
    'NIFTY50': 50,
    'BANKNIFTY': 25,
    'FINNIFTY': 40,
    'MIDCPNIFTY': 75,
    
    // Nifty 50 Stocks
    'RELIANCE': 250,
    'TCS': 150,
    'HDFCBANK': 550,
    'INFY': 300,
    'ICICIBANK': 1375,
    'HINDUNILVR': 300,
    'ITC': 3200,
    'SBIN': 1500,
    'BHARTIARTL': 1765,
    'KOTAKBANK': 400,
    'LT': 300,
    'AXISBANK': 1200,
    'ASIANPAINT': 300,
    'MARUTI': 100,
    'TITAN': 300,
    'ULTRACEMCO': 100,
    'WIPRO': 1500,
    'HCLTECH': 700,
    'BAJFINANCE': 125,
    'SUNPHARMA': 700,
    'NESTLEIND': 40,
    'TATAMOTORS': 3250,
    'TECHM': 650,
    'ONGC': 3700,
    'NTPC': 3000,
    'POWERGRID': 3300,
    'M&M': 450,
    'BAJAJFINSV': 500,
    'ADANIENT': 300,
    'TATASTEEL': 5500,
    'COALINDIA': 2100,
    'JSWSTEEL': 950,
    'HINDALCO': 1350,
    'INDUSINDBK': 600,
    'ADANIPORTS': 650,
    'DIVISLAB': 250,
    'DRREDDY': 150,
    'CIPLA': 650,
    'EICHERMOT': 200,
    'HEROMOTOCO': 175,
    'GRASIM': 400,
    'BRITANNIA': 175,
    'APOLLOHOSP': 150,
    'BPCL': 1450,
    'TATACONSUM': 800,
    'SHRIRAMFIN': 350,
    'SBILIFE': 575,
    'HDFCLIFE': 1250,
    'BAJAJ-AUTO': 90,
    'LTIM': 150,
    
    // Banking & Finance
    'BANKBARODA': 3600,
    'PNB': 8000,
    'CANBK': 7500,
    'UNIONBANK': 6750,
    'IDFCFIRSTB': 10000,
    'FEDERALBNK': 5000,
    'BANDHANBNK': 3750,
    'AUBANK': 1250,
    'RBLBANK': 3500,
    'CHOLAFIN': 650,
    'MUTHOOTFIN': 500,
    'LICHSGFIN': 1450,
    'PFC': 2000,
    'RECLTD': 1750,
    'ICICIGI': 500,
    'ICICIPRULI': 1450,
    'HDFCAMC': 250,
    
    // IT & Technology
    'PERSISTENT': 150,
    'COFORGE': 175,
    'MPHASIS': 325,
    'LTTS': 175,
    'TATAELXSI': 115,
    'OFSS': 75,
    
    // Pharma & Healthcare
    'AUROPHARMA': 725,
    'LUPIN': 500,
    'BIOCON': 2625,
    'TORNTPHARM': 300,
    'ALKEM': 150,
    'ABBOTINDIA': 30,
    'GLENMARK': 600,
    'IPCALAB': 650,
    'LAURUSLABS': 1750,
    'GRANULES': 1750,
    'MAXHEALTH': 950,
    'FORTIS': 2000,
    'METROPOLIS': 500,
    
    // Auto & Auto Components
    'TVSMOTOR': 350,
    'ASHOKLEY': 4500,
    'ESCORTS': 250,
    'MOTHERSON': 6750,
    'BOSCHLTD': 25,
    'EXIDEIND': 2000,
    'AMARAJABAT': 1250,
    'MRF': 7,
    'APOLLOTYRE': 1750,
    'CEAT': 325,
    'BALKRISIND': 300,
    
    // FMCG & Consumer
    'DABUR': 1450,
    'MARICO': 1450,
    'GODREJCP': 725,
    'COLPAL': 300,
    'PGHH': 55,
    'EMAMILTD': 1450,
    'GILLETTE': 125,
    'VBL': 575,
    'TATAPOWER': 2200,
    'JUBLFOOD': 1450,
    'WESTLIFE': 950,
    'ZOMATO': 4500,
    'NYKAA': 4500,
    
    // Metals & Mining
    'VEDL': 2200,
    'NMDC': 3750,
    'SAIL': 7500,
    'JINDALSTEL': 950,
    'NATIONALUM': 4500,
    'MOIL': 2200,
    
    // Cement
    'AMBUJACEM': 1450,
    'ACC': 350,
    'SHREECEM': 30,
    'DALMIACEM': 400,
    'JKCEMENT': 225,
    'RAMCOCEM': 875,
    
    // Infrastructure & Real Estate
    'DLF': 1075,
    'OBEROIRLTY': 500,
    'GODREJPROP': 350,
    'PRESTIGE': 500,
    'BRIGADE': 875,
    
    // Telecom & Media
    'INDIGO': 225,
    'ZEEL': 4500,
    'SUNTV': 1250,
    'PVRINOX': 575,
    
    // Energy & Power
    'ADANIGREEN': 500,
    'ADANIPOWER': 1750,
    'TORNTPOWER': 650,
    'NHPC': 10000,
    'IOC': 6750,
    'HINDPETRO': 2200,
    'GAIL': 4500,
    'OIL': 2200,
    
    // Chemicals & Fertilizers
    'UPL': 1450,
    'PIDILITIND': 300,
    'AARTI': 1250,
    'DEEPAKNTR': 400,
    'SRF': 350,
    'BALRAMCHIN': 1750,
    'CHAMBLFERT': 1750,
    'COROMANDEL': 500,
    
    // Diversified & Others
    'SIEMENS': 145,
    'ABB': 125,
    'HAVELLS': 500,
    'VOLTAS': 650,
    'WHIRLPOOL': 500,
    'CROMPTON': 2200,
    'POLYCAB': 145,
    'KEI': 225,
    'DIXON': 68,
    'AMBER': 175,
    'BLUESTAR': 500,
    'CUMMINSIND': 260,
    'THERMAX': 200,
    'SCHAEFFLER': 225,
    'TIMKEN': 250,
    
    // Additional F&O Stocks
    'IRCTC': 1075,
    'CONCOR': 1075,
    'GICRE': 2200,
    'DMART': 225,
    'RELAXO': 875,
    'BATA': 575,
    'VGUARD': 2200,
    'SYMPHONY': 650,
    'KALYANKJIL': 1750,
    'JUBLPHARMA': 875,
    'SYNGENE': 1075,
    'LALPATHLAB': 300,
    'KPITTECH': 575,
    'CYIENT': 500,
    'MASTEK': 300,
    'INTELLECT': 1075,
    'HAPPSTMNDS': 950,
    'ZENSARTECH': 1450,
    'MINDACORP': 1750,
    'ENDURANCE': 500,
    'SUPRAJIT': 1750,
    'FINCABLES': 875,
    'ATUL': 115,
    'NAVINFLUOR': 175,
    'CLEAN': 500,
    'TATACHEM': 775,
    'GNFC': 1250,
    'KANSAINER': 2200,
    'AKZOINDIA': 300,
    'BERGEPAINT': 1450,
    'INDIAMART': 300,
    'JUSTDIAL': 875,
    'NAUKRI': 145,
    'BIKAJI': 1450,
    'MRPL': 4500,
    'GSPL': 2200,
    'PETRONET': 2600,
    'IGL': 1750,
    'MGL': 650,
    'GUJGASLTD': 1450,
    'AEGISLOG': 2200,
    'BLUEDART': 108,
    'DELHIVERY': 2200,
    'VRL': 1450,
    'MAHLOG': 1750,
    'TIINDIA': 225,
    'CRISIL': 175,
    'CDSL': 500,
    'MAZDOCK': 300,
    'HAL': 200,
    'BEL': 3000,
    'COCHINSHIP': 500,
    'GRSE': 650,
    'BEML': 300,
    'SOLARINDS': 108,
    'EIDPARRY': 1250,
    'BAJAJHLDNG': 95,
    'PRAJIND': 1450,
    'KALPATPOWR': 650,
    'KEC': 1250,
    'JKPAPER': 1750,
    'CENTURYPLY': 1075,
    'ASTRAL': 500,
    'SUPREMEIND': 175,
    'NILKAMAL': 350,
    'JYOTHYLAB': 1750,
    'HONAUT': 20,
    'SKFINDIA': 145,
    'FOSECOIND': 175,
    'WELCORP': 1450,
    'WELSPUNIND': 4500,
    'TRIDENT': 18750,
    'VARDHACRLC': 1750,
    'JKLAKSHMI': 1075,
    'ORIENTCEM': 4500,
    'STARCEMENT': 4500,
    'HEIDELBERG': 3000,
    'JSWENERGY': 1450,
    'CESC': 4500,
    'SUZLON': 18750,
    'INOXWIND': 4500,
    'ORIENTELEC': 3000,
    'MAITHANALL': 650,
    'GRAPHITE': 1450,
    'HEG': 500,
    'APARINDS': 108,
    'GUJALKALI': 1075,
    'DCMSHRIRAM': 875,
    'ALKYLAMINE': 300,
    'FINEORG': 145,
    'ROSSARI': 875,
    'ANANTRAJ': 1750,
    'PHOENIXLTD': 500,
    'MAHLIFE': 1750,
    'SOBHA': 650,
    'KOLTEPATIL': 2200,
    'SUNTECK': 1750,
    'MAHINDCIE': 2200,
    'JTEKTINDIA': 4500,
    'WABCOINDIA': 95,
    'GABRIEL': 2200,
    'FMGOETZE': 1750,
    'WHEELS': 875,
    'SWARAJENG': 300,
    'MAHSCOOTER': 108,
    'FORCEMOT': 175,
    'SML': 500,
    'TITAGARH': 875,
    'TEXRAIL': 4500,
    'ELECON': 1750,
    'TRIVENI': 1450,
    'KIRLOSENG': 650,
    'KIRLOSBROS': 500,
    'KIRLFER': 1750,
    'KIRLPNU': 875,
    'WABAG': 875,
    'AIAENG': 225
};

// Generate Dynamic Derivatives (Futures & Options)
function generateDerivatives() {
    const derivatives = [];
    const today = new Date();
    const monthlyExpiry = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of next month
    const expiryStr = monthlyExpiry.toISOString().split('T')[0];
    
    // Add index futures
    derivatives.push(
        { 
            symbol: 'NIFTY50-FUT', 
            name: 'Nifty 50 Future', 
            basePrice: 21850.50, 
            type: 'Future', 
            expiry: expiryStr,
            lotSize: LOT_SIZES['NIFTY50'],
            underlying: 'NIFTY50'
        },
        { 
            symbol: 'BANKNIFTY-FUT', 
            name: 'Bank Nifty Future', 
            basePrice: 47250.75, 
            type: 'Future', 
            expiry: expiryStr,
            lotSize: LOT_SIZES['BANKNIFTY'],
            underlying: 'BANKNIFTY'
        }
    );
    
    // Generate options for all stocks
    stocksData.forEach(stock => {
        const basePrice = stock.basePrice;
        
        // Calculate strike prices (5 strikes: 2 below, ATM, 2 above)
        const strikeInterval = Math.round(basePrice * 0.025); // 2.5% intervals
        const strikes = [
            Math.round((basePrice - strikeInterval * 2) / 10) * 10,
            Math.round((basePrice - strikeInterval) / 10) * 10,
            Math.round(basePrice / 10) * 10, // ATM
            Math.round((basePrice + strikeInterval) / 10) * 10,
            Math.round((basePrice + strikeInterval * 2) / 10) * 10
        ];
        
        strikes.forEach(strike => {
            // Calculate option premium (simplified Black-Scholes approximation)
            const moneyness = basePrice / strike;
            
            // Call Option
            const callPremium = moneyness > 1 
                ? (basePrice - strike) + (basePrice * 0.02) // ITM
                : (basePrice * 0.02 * Math.exp(-(1 - moneyness) * 2)); // OTM
            
            // Get lot size for this stock (default to 100 if not defined)
            const lotSize = LOT_SIZES[stock.symbol] || 100;
            
            derivatives.push({
                symbol: `${stock.symbol}-${strike}-CE`,
                name: `${stock.name} ${strike} Call`,
                basePrice: Math.max(1, callPremium),
                type: 'Call Option',
                strike: strike,
                underlying: stock.symbol,
                expiry: expiryStr,
                lotSize: lotSize
            });
            
            // Put Option
            const putPremium = moneyness < 1 
                ? (strike - basePrice) + (basePrice * 0.02) // ITM
                : (basePrice * 0.02 * Math.exp(-(moneyness - 1) * 2)); // OTM
            
            derivatives.push({
                symbol: `${stock.symbol}-${strike}-PE`,
                name: `${stock.name} ${strike} Put`,
                basePrice: Math.max(1, putPremium),
                type: 'Put Option',
                strike: strike,
                underlying: stock.symbol,
                expiry: expiryStr,
                lotSize: lotSize
            });
        });
    });
    
    return derivatives;
}

// Generate derivatives on load
const derivativesData = generateDerivatives();
console.log(`Generated ${derivativesData.length} derivatives (Futures + Options)`);

// Initialize Market Data
function initializeMarketData() {
    // Try to load saved market data from localStorage
    const savedMarketData = localStorage.getItem('marketData');
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('marketDataDate');
    const dataVersion = localStorage.getItem('marketDataVersion');
    const CURRENT_VERSION = '2.0'; // Increment this to force regeneration
    
    // If we have saved data from today AND correct version, use it
    if (savedMarketData && savedDate === today && dataVersion === CURRENT_VERSION) {
        try {
            marketData = JSON.parse(savedMarketData);
            console.log('✅ Loaded market data from localStorage (same day, version ' + CURRENT_VERSION + ')');
            return;
        } catch (error) {
            console.warn('Failed to load saved market data:', error);
        }
    }
    
    console.log('🔄 Regenerating market data (version ' + CURRENT_VERSION + ')...');
    
    // Otherwise, initialize fresh data
    stocksData.forEach(stock => {
        marketData[stock.symbol] = {
            ...stock,
            currentPrice: stock.basePrice,
            previousClose: stock.basePrice,
            change: 0,
            changePercent: 0,
            high: stock.basePrice,
            low: stock.basePrice
        };
    });
    
    derivativesData.forEach(derivative => {
        marketData[derivative.symbol] = {
            ...derivative,
            currentPrice: derivative.basePrice,
            previousClose: derivative.basePrice,
            change: 0,
            changePercent: 0,
            high: derivative.basePrice,
            low: derivative.basePrice,
            lotSize: derivative.lotSize || 1 // Ensure lotSize is copied
        };
    });
    
    // Save the initial data
    saveMarketData();
    console.log('✅ Initialized fresh market data');
}

// Save market data to localStorage
function saveMarketData() {
    try {
        localStorage.setItem('marketData', JSON.stringify(marketData));
        localStorage.setItem('marketDataDate', new Date().toDateString());
        localStorage.setItem('marketDataVersion', '2.0'); // Save version
    } catch (error) {
        console.warn('Failed to save market data:', error);
    }
}

// Authentication Functions
function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

function showLogin() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

function register() {
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    const name = document.getElementById('reg-name').value.trim();
    
    console.log('Registration attempt for username:', username);
    
    if (!username || !password || !name) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    // Reload users to check for existing username
    users = JSON.parse(localStorage.getItem('tradingUsers')) || {};
    
    if (users[username]) {
        alert('Username already exists. Please choose a different username.');
        return;
    }
    
    users[username] = {
        username,
        password,
        name,
        balance: 100000, // Starting with ₹1,00,000
        portfolio: {},
        orders: [],
        transactions: [],
        realizedPnL: 0, // Track realized profit/loss from completed trades
        watchlist: {
            stocks: ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'], // Default watchlist
            derivatives: ['NIFTY50-FUT', 'BANKNIFTY-FUT']
        },
        createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('tradingUsers', JSON.stringify(users));
    console.log('User registered successfully:', username);
    console.log('Total users now:', Object.keys(users).length);
    
    // Clear form fields
    document.getElementById('reg-username').value = '';
    document.getElementById('reg-password').value = '';
    document.getElementById('reg-confirm-password').value = '';
    document.getElementById('reg-name').value = '';
    
    alert(`Account created successfully for "${username}"!\n\nYou can now login with:\nUsername: ${username}\nPassword: (the password you just entered)`);
    showLogin();
    
    // Pre-fill username in login form
    document.getElementById('login-username').value = username;
}

function login() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    
    console.log('Login attempt for username:', username);
    
    if (!username || !password) {
        alert('Please enter username and password');
        return;
    }
    
    // Reload users from localStorage to ensure we have the latest data
    users = JSON.parse(localStorage.getItem('tradingUsers')) || {};
    
    console.log('Available users:', Object.keys(users));
    console.log('User exists:', !!users[username]);
    
    if (!users[username]) {
        alert(`Username "${username}" not found. Please register first or check your username.`);
        return;
    }
    
    if (users[username].password !== password) {
        alert('Incorrect password. Please try again.');
        return;
    }
    
    console.log('Login successful!');
    currentUser = username;
    localStorage.setItem('currentUser', username);
    showDashboard();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    stopPriceUpdates();
    
    // Hide dashboard
    const dashboardScreen = document.getElementById('dashboard-screen');
    dashboardScreen.style.display = 'none';
    dashboardScreen.classList.remove('active');
    
    // Show auth screen
    const authScreen = document.getElementById('auth-screen');
    authScreen.style.display = 'flex';
    authScreen.classList.add('active');
    
    showLogin();
}

function showDashboard() {
    console.log('Showing dashboard...');
    
    const authScreen = document.getElementById('auth-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    
    console.log('Auth screen:', authScreen);
    console.log('Dashboard screen:', dashboardScreen);
    
    // Hide auth screen
    authScreen.style.display = 'none';
    authScreen.classList.remove('active');
    
    // Show dashboard screen
    dashboardScreen.style.display = 'block';
    dashboardScreen.classList.add('active');
    
    console.log('Dashboard display:', dashboardScreen.style.display);
    
    document.getElementById('user-name').textContent = users[currentUser].name;
    
    updateAccountSummary();
    renderStocksList();
    renderDerivativesList();
    renderHoldings();
    renderPositions();
    renderDashboard();
    renderOrders();
    renderTransactions();
    startPriceUpdates();
    
    console.log('Dashboard loaded successfully!');
}

// Navigation Functions
function showSection(section) {
    // Update menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update content sections
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(`${section}-section`).classList.add('active');
    
    // Refresh data for the section
    if (section === 'holdings') renderHoldings();
    if (section === 'positions') renderPositions();
    if (section === 'dashboard') renderDashboard();
    if (section === 'orders') renderOrders();
    if (section === 'pnl') renderPnLReport();
    if (section === 'funds') renderTransactions();
}

function showMarketTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    document.querySelectorAll('.market-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tab}-tab`).classList.add('active');
}

// Account Summary
function updateAccountSummary() {
    const user = users[currentUser];
    
    // Initialize realizedPnL if it doesn't exist (for old accounts)
    if (user.realizedPnL === undefined) {
        user.realizedPnL = 0;
    }
    
    const portfolioValue = calculatePortfolioValue();
    const unrealizedPnL = calculateTotalPnL(); // P&L from current holdings
    const totalPnL = unrealizedPnL + user.realizedPnL; // Total = unrealized + realized
    const dayPnL = calculateDayPnL();
    
    document.getElementById('available-balance').textContent = `₹${user.balance.toFixed(2)}`;
    document.getElementById('portfolio-value').textContent = `₹${portfolioValue.toFixed(2)}`;
    
    const totalPnLElement = document.getElementById('total-pnl');
    totalPnLElement.textContent = `₹${totalPnL.toFixed(2)}`;
    totalPnLElement.className = 'summary-value ' + (totalPnL >= 0 ? 'positive' : 'negative');
    
    const dayPnLElement = document.getElementById('day-pnl');
    dayPnLElement.textContent = `₹${dayPnL.toFixed(2)}`;
    dayPnLElement.className = 'summary-value ' + (dayPnL >= 0 ? 'positive' : 'negative');
}

function calculatePortfolioValue() {
    const user = users[currentUser];
    let total = 0;
    
    for (const symbol in user.portfolio) {
        const holding = user.portfolio[symbol];
        const currentPrice = marketData[symbol].currentPrice;
        
        // For portfolio value, we want the absolute value of holdings
        // Short positions (negative quantity) represent a liability, but the value is still positive
        total += Math.abs(holding.quantity) * currentPrice;
    }
    
    return total;
}

function calculateTotalPnL() {
    const user = users[currentUser];
    let totalPnL = 0;
    
    for (const symbol in user.portfolio) {
        const holding = user.portfolio[symbol];
        const currentPrice = marketData[symbol].currentPrice;
        const invested = holding.quantity * holding.avgPrice;
        const current = holding.quantity * currentPrice;
        totalPnL += (current - invested);
    }
    
    return totalPnL;
}

function calculateDayPnL() {
    const user = users[currentUser];
    let dayPnL = 0;
    
    for (const symbol in user.portfolio) {
        const holding = user.portfolio[symbol];
        const currentPrice = marketData[symbol].currentPrice;
        const previousClose = marketData[symbol].previousClose;
        dayPnL += holding.quantity * (currentPrice - previousClose);
    }
    
    return dayPnL;
}

// Market Data Rendering
function renderStocksList() {
    const user = users[currentUser];
    const container = document.getElementById('stocks-list');
    container.innerHTML = '';
    
    // Initialize watchlist if it doesn't exist
    if (!user.watchlist) {
        user.watchlist = {
            stocks: ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'],
            derivatives: ['NIFTY50-FUT', 'BANKNIFTY-FUT']
        };
        saveUserData();
    }
    
    // Only show stocks in watchlist
    const watchlistStocks = stocksData.filter(stock => user.watchlist.stocks.includes(stock.symbol));
    
    if (watchlistStocks.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No stocks in watchlist. Click "+ Add to Watchlist" to add stocks.</p></div>';
        return;
    }
    
    // Add header row
    const header = document.createElement('div');
    header.className = 'stock-item';
    header.style.fontWeight = 'bold';
    header.style.background = '#f5f7fa';
    header.style.borderBottom = '2px solid #dee2e6';
    header.innerHTML = `
        <div>Stock</div>
        <div>Price</div>
        <div>Change (₹)</div>
        <div>Change (%)</div>
        <div>Actions</div>
        <div></div>
    `;
    container.appendChild(header);
    
    watchlistStocks.forEach(stock => {
        const data = marketData[stock.symbol];
        const item = document.createElement('div');
        item.className = 'stock-item';
        
        const changeClass = data.change >= 0 ? 'positive' : 'negative';
        const changeSymbol = data.change >= 0 ? '+' : '';
        
        item.innerHTML = `
            <div>
                <div class="stock-name">${data.name}</div>
                <div class="stock-symbol">${data.symbol}</div>
            </div>
            <div class="stock-price">₹${data.currentPrice.toFixed(2)}</div>
            <div class="stock-change ${changeClass}">
                ${changeSymbol}₹${data.change.toFixed(2)}
            </div>
            <div class="stock-change ${changeClass}">
                ${changeSymbol}${data.changePercent.toFixed(2)}%
            </div>
            <button class="btn-trade" onclick="openTradeModal('${data.symbol}')">Trade</button>
            <button class="btn-remove" onclick="removeFromWatchlist('stocks', '${data.symbol}')">×</button>
        `;
        
        container.appendChild(item);
    });
}

function renderDerivativesList() {
    const user = users[currentUser];
    const container = document.getElementById('derivatives-list');
    container.innerHTML = '';
    
    // Initialize watchlist if it doesn't exist
    if (!user.watchlist) {
        user.watchlist = {
            stocks: ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'],
            derivatives: ['NIFTY50-FUT', 'BANKNIFTY-FUT']
        };
        saveUserData();
    }
    
    // Only show derivatives in watchlist
    const watchlistDerivatives = derivativesData.filter(derivative => user.watchlist.derivatives.includes(derivative.symbol));
    
    if (watchlistDerivatives.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No derivatives in watchlist. Click "+ Add to Watchlist" to add derivatives.</p></div>';
        return;
    }
    
    // Add header row
    const header = document.createElement('div');
    header.className = 'stock-item';
    header.style.fontWeight = 'bold';
    header.style.background = '#f5f7fa';
    header.style.borderBottom = '2px solid #dee2e6';
    header.innerHTML = `
        <div>Derivative</div>
        <div>Price</div>
        <div>Change (₹)</div>
        <div>Change (%)</div>
        <div>Actions</div>
        <div></div>
    `;
    container.appendChild(header);
    
    watchlistDerivatives.forEach(derivative => {
        const data = marketData[derivative.symbol];
        const item = document.createElement('div');
        item.className = 'stock-item';
        
        const changeClass = data.change >= 0 ? 'positive' : 'negative';
        const changeSymbol = data.change >= 0 ? '+' : '';
        
        item.innerHTML = `
            <div>
                <div class="stock-name">${data.name}</div>
                <div class="stock-symbol">${data.symbol} ${data.type}</div>
            </div>
            <div class="stock-price">₹${data.currentPrice.toFixed(2)}</div>
            <div class="stock-change ${changeClass}">
                ${changeSymbol}₹${data.change.toFixed(2)}
            </div>
            <div class="stock-change ${changeClass}">
                ${changeSymbol}${data.changePercent.toFixed(2)}%
            </div>
            <button class="btn-trade" onclick="openTradeModal('${data.symbol}')">Trade</button>
            <button class="btn-remove" onclick="removeFromWatchlist('derivatives', '${data.symbol}')">×</button>
        `;
        
        container.appendChild(item);
    });
}

// Holdings (Only cash/delivery stocks, NOT derivatives)
function renderHoldings() {
    const user = users[currentUser];
    const container = document.getElementById('holdings-container');
    
    // Filter only stocks (not derivatives)
    const stockHoldings = {};
    for (const symbol in user.portfolio) {
        const stock = marketData[symbol];
        const isDerivative = stock.type && (stock.type.includes('Option') || stock.type === 'Future');
        if (!isDerivative) {
            stockHoldings[symbol] = user.portfolio[symbol];
        }
    }
    
    if (Object.keys(stockHoldings).length === 0) {
        container.innerHTML = '<div class="empty-state"><p>You don\'t have any holdings yet. Holdings show only delivery stocks (not options/futures).</p></div>';
        return;
    }
    
    container.innerHTML = '<div class="holdings-table"></div>';
    const table = container.querySelector('.holdings-table');
    
    // Add header row
    const header = document.createElement('div');
    header.className = 'holding-item';
    header.style.fontWeight = 'bold';
    header.style.background = '#f5f7fa';
    header.innerHTML = `
        <div>Stock</div>
        <div>Qty</div>
        <div>Avg Price</div>
        <div>Current</div>
        <div>P&L</div>
        <div>P&L %</div>
        <div>Actions</div>
    `;
    table.appendChild(header);
    
    for (const symbol in stockHoldings) {
        const holding = stockHoldings[symbol];
        const currentPrice = marketData[symbol].currentPrice;
        
        const invested = holding.quantity * holding.avgPrice;
        const current = holding.quantity * currentPrice;
        const pnl = current - invested;
        const pnlPercent = Math.abs(invested) > 0 ? (pnl / Math.abs(invested)) * 100 : 0;
        
        const item = document.createElement('div');
        item.className = 'holding-item';
        
        const pnlClass = pnl >= 0 ? 'positive' : 'negative';
        const pnlSymbol = pnl >= 0 ? '+' : '';
        
        item.innerHTML = `
            <div>
                <div class="stock-name">${marketData[symbol].name}</div>
                <div class="stock-symbol">${symbol}</div>
            </div>
            <div>${holding.quantity}</div>
            <div>₹${holding.avgPrice.toFixed(2)}</div>
            <div>₹${currentPrice.toFixed(2)}</div>
            <div class="${pnlClass}">${pnlSymbol}₹${pnl.toFixed(2)}</div>
            <div class="${pnlClass}">${pnlSymbol}${pnlPercent.toFixed(2)}%</div>
            <div class="holding-actions">
                <button class="btn-buy-small" onclick="event.stopPropagation(); openTradeModal('${symbol}', 'buy')">+</button>
                <button class="btn-sell-small" onclick="event.stopPropagation(); openTradeModal('${symbol}', 'sell')">-</button>
            </div>
        `;
        
        table.appendChild(item);
    }
}

// Positions (Derivatives: Options, Futures, and Intraday trades)
function renderPositions() {
    const user = users[currentUser];
    const container = document.getElementById('positions-container');
    
    // Filter only derivatives (options, futures)
    const derivativePositions = {};
    for (const symbol in user.portfolio) {
        const stock = marketData[symbol];
        const isDerivative = stock.type && (stock.type.includes('Option') || stock.type === 'Future');
        if (isDerivative) {
            derivativePositions[symbol] = user.portfolio[symbol];
        }
    }
    
    if (Object.keys(derivativePositions).length === 0) {
        container.innerHTML = '<div class="empty-state"><p>You don\'t have any open positions. Positions show derivatives (options/futures) only.</p></div>';
        return;
    }
    
    container.innerHTML = '<div class="positions-table"></div>';
    const table = container.querySelector('.positions-table');
    
    // Add header row
    const header = document.createElement('div');
    header.className = 'position-item';
    header.style.fontWeight = 'bold';
    header.style.background = '#f5f7fa';
    header.innerHTML = `
        <div>Stock</div>
        <div>Qty</div>
        <div>Prev Close</div>
        <div>Current</div>
        <div>Day P&L</div>
        <div>Day P&L %</div>
        <div>Time</div>
        <div>Actions</div>
    `;
    table.appendChild(header);
    
    for (const symbol in derivativePositions) {
        const holding = derivativePositions[symbol];
        const currentPrice = marketData[symbol].currentPrice;
        const previousClose = marketData[symbol].previousClose;
        
        // Calculate P&L correctly for both long and short positions
        const isShort = holding.quantity < 0;
        let pnl, pnlPercent;
        
        if (isShort) {
            // For short positions: profit when price goes down
            // P&L = (avgPrice - currentPrice) * abs(quantity)
            pnl = (holding.avgPrice - currentPrice) * Math.abs(holding.quantity);
            pnlPercent = holding.avgPrice > 0 ? (pnl / (holding.avgPrice * Math.abs(holding.quantity))) * 100 : 0;
        } else {
            // For long positions: profit when price goes up
            const invested = holding.quantity * holding.avgPrice;
            const current = holding.quantity * currentPrice;
            pnl = current - invested;
            pnlPercent = Math.abs(invested) > 0 ? (pnl / Math.abs(invested)) * 100 : 0;
        }
        
        // Format purchase time
        const purchaseTime = holding.purchaseTime ? new Date(holding.purchaseTime) : null;
        const timeStr = purchaseTime ? purchaseTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'N/A';
        
        const item = document.createElement('div');
        item.className = 'position-item';
        
        const pnlClass = pnl >= 0 ? 'positive' : 'negative';
        const pnlSymbol = pnl >= 0 ? '+' : '';
        
        const positionType = isShort ? ' (SHORT)' : ' (LONG)';
        
        item.innerHTML = `
            <div>
                <div class="stock-name">${marketData[symbol].name}${positionType}</div>
                <div class="stock-symbol">${symbol}</div>
                <div class="position-time">Opened: ${timeStr}</div>
            </div>
            <div>${holding.quantity}</div>
            <div>₹${holding.avgPrice.toFixed(2)}</div>
            <div>₹${currentPrice.toFixed(2)}</div>
            <div class="${pnlClass}">${pnlSymbol}₹${pnl.toFixed(2)}</div>
            <div class="${pnlClass}">${pnlSymbol}${pnlPercent.toFixed(2)}%</div>
            <div class="position-time">${timeStr}</div>
            <div class="holding-actions">
                <button class="btn-buy-small" onclick="openTradeModal('${symbol}', 'buy')">+</button>
                <button class="btn-sell-small" onclick="openTradeModal('${symbol}', 'sell')">-</button>
            </div>
        `;
        
        table.appendChild(item);
    }
}

// Dashboard
function renderDashboard() {
    const user = users[currentUser];
    
    // Initialize realizedPnL if it doesn't exist (for old accounts)
    if (user.realizedPnL === undefined) {
        user.realizedPnL = 0;
    }
    
    const portfolioValue = calculatePortfolioValue();
    const unrealizedPnL = calculateTotalPnL(); // P&L from current holdings
    const totalPnL = unrealizedPnL + user.realizedPnL; // Total = unrealized + realized
    const marginsUsed = portfolioValue;
    
    document.getElementById('dash-margin').textContent = `₹${user.balance.toFixed(2)}`;
    document.getElementById('dash-used').textContent = `₹${marginsUsed.toFixed(2)}`;
    document.getElementById('dash-holdings-value').textContent = `₹${portfolioValue.toFixed(2)}`;
    
    const pnlElement = document.getElementById('dash-holdings-pnl');
    pnlElement.textContent = `₹${totalPnL.toFixed(2)}`;
    pnlElement.className = 'stat-value ' + (totalPnL >= 0 ? 'positive' : 'negative');
}

// Orders
function renderOrders() {
    const user = users[currentUser];
    const container = document.getElementById('orders-container');
    
    if (user.orders.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No orders yet. Place your first trade!</p></div>';
        return;
    }
    
    container.innerHTML = '<div class="orders-table"></div>';
    const table = container.querySelector('.orders-table');
    
    // Add header row
    const header = document.createElement('div');
    header.className = 'order-item';
    header.style.fontWeight = 'bold';
    header.style.background = '#f5f7fa';
    header.innerHTML = `
        <div>Time</div>
        <div>Stock</div>
        <div>Type</div>
        <div>Qty</div>
        <div>Price</div>
        <div>Total</div>
        <div>Status</div>
    `;
    table.appendChild(header);
    
    // Show most recent orders first
    const sortedOrders = [...user.orders].reverse();
    
    sortedOrders.forEach(order => {
        const item = document.createElement('div');
        item.className = 'order-item';
        
        const date = new Date(order.timestamp);
        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        
        item.innerHTML = `
            <div>${dateStr}</div>
            <div>
                <div class="stock-name">${marketData[order.symbol].name}</div>
                <div class="stock-symbol">${order.symbol}</div>
            </div>
            <div class="order-type-${order.type}">${order.type.toUpperCase()}</div>
            <div>${order.quantity}</div>
            <div>₹${order.price.toFixed(2)}</div>
            <div>₹${order.total.toFixed(2)}</div>
            <div><span class="order-status completed">Completed</span></div>
        `;
        
        table.appendChild(item);
    });
}

// Funds Management
function addFunds() {
    const amount = parseFloat(document.getElementById('add-amount').value);
    
    if (!amount || amount < 100) {
        alert('Please enter a valid amount (minimum ₹100)');
        return;
    }
    
    const user = users[currentUser];
    user.balance += amount;
    
    user.transactions.push({
        type: 'credit',
        amount: amount,
        description: 'Funds Added',
        timestamp: new Date().toISOString()
    });
    
    saveUserData();
    updateAccountSummary();
    renderTransactions();
    
    document.getElementById('add-amount').value = '';
    alert(`₹${amount.toFixed(2)} added successfully!`);
}

function withdrawFunds() {
    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    const user = users[currentUser];
    
    if (!amount || amount < 100) {
        alert('Please enter a valid amount (minimum ₹100)');
        return;
    }
    
    if (amount > user.balance) {
        alert('Insufficient balance');
        return;
    }
    
    user.balance -= amount;
    
    user.transactions.push({
        type: 'debit',
        amount: amount,
        description: 'Funds Withdrawn',
        timestamp: new Date().toISOString()
    });
    
    saveUserData();
    updateAccountSummary();
    renderTransactions();
    
    document.getElementById('withdraw-amount').value = '';
    alert(`₹${amount.toFixed(2)} withdrawn successfully!`);
}

function renderTransactions() {
    const user = users[currentUser];
    const container = document.getElementById('transactions-container');
    
    if (user.transactions.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No transactions yet.</p></div>';
        return;
    }
    
    container.innerHTML = '<div class="transactions-table"></div>';
    const table = container.querySelector('.transactions-table');
    
    // Show most recent transactions first
    const sortedTransactions = [...user.transactions].reverse();
    
    sortedTransactions.forEach(transaction => {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        
        const date = new Date(transaction.timestamp);
        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        
        const typeClass = transaction.type === 'credit' ? 'transaction-type-credit' : 'transaction-type-debit';
        const symbol = transaction.type === 'credit' ? '+' : '-';
        
        item.innerHTML = `
            <div>${dateStr}</div>
            <div>${transaction.description}</div>
            <div class="${typeClass}">${transaction.type.toUpperCase()}</div>
            <div class="${typeClass}">${symbol}₹${transaction.amount.toFixed(2)}</div>
        `;
        
        table.appendChild(item);
    });
}

// Trading Modal
function openTradeModal(symbol, type = 'buy') {
    currentTradeStock = symbol;
    currentTradeType = type;
    const stock = marketData[symbol];
    const user = users[currentUser];
    const isDerivative = stock.type && (stock.type.includes('Option') || stock.type === 'Future');
    const lotSize = stock.lotSize || 1;
    
    console.log('Opening trade modal for:', symbol);
    console.log('Stock data:', stock);
    console.log('Is derivative:', isDerivative);
    console.log('Lot size:', lotSize);
    
    // Update modal title with lot info for derivatives
    let modalTitle = stock.name;
    if (isDerivative && lotSize > 1) {
        modalTitle += ` (Lot Size: ${lotSize})`;
    }
    document.getElementById('modal-stock-name').textContent = modalTitle;
    document.getElementById('modal-stock-price').textContent = stock.currentPrice.toFixed(2);
    
    // Set default quantity based on trade type
    if (type === 'sell' && user.portfolio[symbol]) {
        // For derivatives, show number of lots
        const totalQuantity = user.portfolio[symbol].quantity;
        const lots = isDerivative ? Math.abs(totalQuantity / lotSize) : totalQuantity;
        document.getElementById('trade-quantity').value = lots;
    } else {
        document.getElementById('trade-quantity').value = 1;
    }
    
    document.getElementById('order-type').value = 'market';
    document.getElementById('limit-price-group').style.display = 'none';
    
    // Set the trade type buttons
    document.querySelectorAll('.trade-type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Wait for modal to be visible, then set button states
    document.getElementById('trade-modal').classList.add('active');
    
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
        const buyBtn = document.querySelector('.trade-type-btn:first-child');
        const sellBtn = document.querySelector('.trade-type-btn:last-child');
        
        if (buyBtn && sellBtn) {
            if (type === 'buy') {
                buyBtn.classList.add('active');
                sellBtn.classList.remove('active');
            } else {
                sellBtn.classList.add('active');
                buyBtn.classList.remove('active');
            }
        }
        
        const executeBtn = document.getElementById('execute-btn');
        if (executeBtn) {
            executeBtn.textContent = type.toUpperCase();
            executeBtn.className = 'btn-execute ' + (type === 'sell' ? 'sell' : '');
        }
        
        updateTradeTotal();
    }, 50);
}

function closeTradeModal() {
    document.getElementById('trade-modal').classList.remove('active');
    currentTradeStock = null;
}

function setTradeType(type) {
    currentTradeType = type;
    const user = users[currentUser];
    
    document.querySelectorAll('.trade-type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update quantity based on type
    if (type === 'sell' && user.portfolio[currentTradeStock]) {
        document.getElementById('trade-quantity').value = user.portfolio[currentTradeStock].quantity;
    } else {
        document.getElementById('trade-quantity').value = 1;
    }
    
    const executeBtn = document.getElementById('execute-btn');
    executeBtn.textContent = type.toUpperCase();
    executeBtn.className = 'btn-execute ' + (type === 'sell' ? 'sell' : '');
    
    updateTradeTotal();
}

function updateTradeTotal() {
    const quantity = parseInt(document.getElementById('trade-quantity').value) || 0;
    const stock = marketData[currentTradeStock];
    const price = stock.currentPrice;
    const lotSize = stock.lotSize || 1;
    
    // For derivatives, multiply by lot size
    const actualQuantity = quantity * lotSize;
    const total = actualQuantity * price;
    
    // Show lot info if applicable
    let displayText = total.toFixed(2);
    if (lotSize > 1) {
        displayText += ` (${quantity} lot${quantity > 1 ? 's' : ''} × ${lotSize} = ${actualQuantity} units)`;
    }
    
    document.getElementById('trade-total').textContent = displayText;
}

// Update total when quantity changes
document.addEventListener('DOMContentLoaded', function() {
    const quantityInput = document.getElementById('trade-quantity');
    if (quantityInput) {
        quantityInput.addEventListener('input', updateTradeTotal);
    }
    
    const orderTypeSelect = document.getElementById('order-type');
    if (orderTypeSelect) {
        orderTypeSelect.addEventListener('change', function() {
            const limitPriceGroup = document.getElementById('limit-price-group');
            if (this.value === 'limit') {
                limitPriceGroup.style.display = 'block';
                document.getElementById('limit-price').value = marketData[currentTradeStock].currentPrice.toFixed(2);
            } else {
                limitPriceGroup.style.display = 'none';
            }
        });
    }
});

function executeTrade() {
    const user = users[currentUser];
    const lotsOrQuantity = parseInt(document.getElementById('trade-quantity').value);
    const orderType = document.getElementById('order-type').value;
    const stockData = marketData[currentTradeStock];
    const price = stockData.currentPrice;
    const isDerivative = stockData.type && (stockData.type.includes('Option') || stockData.type === 'Future');
    const lotSize = stockData.lotSize || 1;
    
    // For derivatives, convert lots to actual quantity
    const quantity = isDerivative ? lotsOrQuantity * lotSize : lotsOrQuantity;
    const total = quantity * price;
    
    if (!quantity || quantity < 1) {
        alert('Please enter a valid quantity');
        return;
    }
    
    // Initialize realizedPnL if it doesn't exist (for old accounts)
    if (user.realizedPnL === undefined) {
        user.realizedPnL = 0;
    }
    
    if (currentTradeType === 'buy') {
        if (total > user.balance) {
            alert('Insufficient balance');
            return;
        }
        
        user.balance -= total;
        
        if (user.portfolio[currentTradeStock]) {
            const holding = user.portfolio[currentTradeStock];
            const oldQuantity = holding.quantity;
            const newQuantity = oldQuantity + quantity;
            
            // Check if we're closing a short position
            if (oldQuantity < 0 && newQuantity <= 0) {
                // Still short or closing short position
                if (Math.abs(newQuantity) < 0.01) {
                    // Position fully closed
                    const realizedPnLForTrade = (holding.avgPrice - price) * Math.abs(oldQuantity);
                    user.realizedPnL += realizedPnLForTrade;
                    delete user.portfolio[currentTradeStock];
                    
                    const pnlMessage = realizedPnLForTrade >= 0 
                        ? `Profit: ₹${realizedPnLForTrade.toFixed(2)}` 
                        : `Loss: ₹${Math.abs(realizedPnLForTrade).toFixed(2)}`;
                    alert(`Successfully closed short position by buying back\n${pnlMessage}`);
                } else {
                    // Partially closing short position
                    const closedQuantity = quantity;
                    const realizedPnLForTrade = (holding.avgPrice - price) * closedQuantity;
                    user.realizedPnL += realizedPnLForTrade;
                    holding.quantity = newQuantity;
                    
                    const pnlMessage = realizedPnLForTrade >= 0 
                        ? `Profit: ₹${realizedPnLForTrade.toFixed(2)}` 
                        : `Loss: ₹${Math.abs(realizedPnLForTrade).toFixed(2)}`;
                    alert(`Partially closed short position\nRemaining short: ${Math.abs(newQuantity)} contracts\n${pnlMessage}`);
                }
            } else if (oldQuantity < 0 && newQuantity > 0) {
                // Closing short and going long
                const shortQuantity = Math.abs(oldQuantity);
                const realizedPnLForTrade = (holding.avgPrice - price) * shortQuantity;
                user.realizedPnL += realizedPnLForTrade;
                
                // Now create new long position with remaining quantity
                holding.quantity = newQuantity;
                holding.avgPrice = price;
                holding.purchaseTime = new Date().toISOString();
                
                const pnlMessage = realizedPnLForTrade >= 0 
                    ? `Profit: ₹${realizedPnLForTrade.toFixed(2)}` 
                    : `Loss: ₹${Math.abs(realizedPnLForTrade).toFixed(2)}`;
                alert(`Closed short position and opened long position\nShort P&L: ${pnlMessage}\nNew long position: ${newQuantity} contracts`);
            } else {
                // Adding to existing long position
                const totalInvested = (holding.quantity * holding.avgPrice) + total;
                holding.avgPrice = totalInvested / newQuantity;
                holding.quantity = newQuantity;
                
                const contractOrShares = isDerivative ? 'contracts' : 'shares';
                alert(`Successfully bought ${quantity} ${contractOrShares} of ${stockData.name}`);
            }
        } else {
            user.portfolio[currentTradeStock] = {
                quantity: quantity,
                avgPrice: price,
                purchaseTime: new Date().toISOString()
            };
            
            const contractOrShares = isDerivative ? 'contracts' : 'shares';
            alert(`Successfully bought ${quantity} ${contractOrShares} of ${stockData.name}`);
        }
    } else {
        // Sell - Different logic for derivatives vs stocks
        if (isDerivative) {
            // OPTIONS: Can sell without owning (writing options)
            if (user.portfolio[currentTradeStock] && user.portfolio[currentTradeStock].quantity > 0) {
                // Selling owned options (closing long position)
                if (user.portfolio[currentTradeStock].quantity < quantity) {
                    alert('Insufficient contracts to sell');
                    return;
                }
                
                const avgBuyPrice = user.portfolio[currentTradeStock].avgPrice;
                const sellPrice = price;
                const realizedPnLForTrade = (sellPrice - avgBuyPrice) * quantity;
                user.realizedPnL += realizedPnLForTrade;
                
                user.balance += total;
                user.portfolio[currentTradeStock].quantity -= quantity;
                
                if (user.portfolio[currentTradeStock].quantity === 0) {
                    delete user.portfolio[currentTradeStock];
                }
                
                const pnlMessage = realizedPnLForTrade >= 0 
                    ? `Profit: ₹${realizedPnLForTrade.toFixed(2)}` 
                    : `Loss: ₹${Math.abs(realizedPnLForTrade).toFixed(2)}`;
                alert(`Successfully sold ${quantity} contracts\n${pnlMessage}`);
            } else {
                // Writing options (selling without owning - short position)
                user.balance += total; // Receive premium
                
                if (user.portfolio[currentTradeStock]) {
                    // Calculate new average price for short position
                    const oldQuantity = user.portfolio[currentTradeStock].quantity;
                    const oldAvgPrice = user.portfolio[currentTradeStock].avgPrice;
                    const newQuantity = oldQuantity - quantity;
                    
                    if (Math.abs(newQuantity) < 0.01) {
                        // Position closed completely (accounting for floating point errors)
                        // Calculate realized P&L for closing short position
                        const realizedPnLForTrade = (oldAvgPrice - price) * Math.abs(oldQuantity);
                        user.realizedPnL += realizedPnLForTrade;
                        
                        delete user.portfolio[currentTradeStock];
                        
                        const pnlMessage = realizedPnLForTrade >= 0 
                            ? `Profit: ₹${realizedPnLForTrade.toFixed(2)}` 
                            : `Loss: ₹${Math.abs(realizedPnLForTrade).toFixed(2)}`;
                        alert(`Successfully closed short position\n${pnlMessage}`);
                    } else {
                        // Weighted average for short positions
                        const oldValue = Math.abs(oldQuantity) * oldAvgPrice;
                        const newValue = quantity * price;
                        user.portfolio[currentTradeStock].avgPrice = (oldValue + newValue) / Math.abs(newQuantity);
                        user.portfolio[currentTradeStock].quantity = newQuantity;
                        
                        alert(`Successfully wrote (sold) ${quantity} ${stockData.type} contracts\nPremium received: ₹${total.toFixed(2)}\n\nNote: This is a short position. You'll profit if the option price decreases.`);
                    }
                } else {
                    user.portfolio[currentTradeStock] = {
                        quantity: -quantity, // Negative = short position
                        avgPrice: price,
                        purchaseTime: new Date().toISOString()
                    };
                    
                    alert(`Successfully wrote (sold) ${quantity} ${stockData.type} contracts\nPremium received: ₹${total.toFixed(2)}\n\nNote: This is a short position. You'll profit if the option price decreases.`);
                }
            }
        } else {
            // STOCKS: Must own to sell
            if (!user.portfolio[currentTradeStock] || user.portfolio[currentTradeStock].quantity < quantity) {
                alert('Insufficient shares to sell');
                return;
            }
            
            // Calculate realized P&L for this sale
            const avgBuyPrice = user.portfolio[currentTradeStock].avgPrice;
            const sellPrice = price;
            const realizedPnLForTrade = (sellPrice - avgBuyPrice) * quantity;
            user.realizedPnL += realizedPnLForTrade;
            
            user.balance += total;
            user.portfolio[currentTradeStock].quantity -= quantity;
            
            if (user.portfolio[currentTradeStock].quantity === 0) {
                delete user.portfolio[currentTradeStock];
            }
            
            const pnlMessage = realizedPnLForTrade >= 0 
                ? `Profit: ₹${realizedPnLForTrade.toFixed(2)}` 
                : `Loss: ₹${Math.abs(realizedPnLForTrade).toFixed(2)}`;
            alert(`Successfully sold ${quantity} shares of ${stockData.name}\n${pnlMessage}`);
        }
    }
    
    // Record order
    user.orders.push({
        symbol: currentTradeStock,
        type: currentTradeType,
        quantity: quantity,
        price: price,
        total: total,
        orderType: orderType,
        timestamp: new Date().toISOString()
    });
    
    saveUserData();
    updateAccountSummary();
    renderHoldings();
    renderPositions();
    renderOrders();
    renderDashboard();
    closeTradeModal();
}

// Market Hours & Holiday Calendar
const MARKET_HOLIDAYS_2026 = [
    '2026-01-26', // Republic Day
    '2026-03-14', // Holi
    '2026-03-30', // Ram Navami
    '2026-04-02', // Mahavir Jayanti
    '2026-04-10', // Good Friday
    '2026-05-01', // Maharashtra Day
    '2026-08-15', // Independence Day
    '2026-08-19', // Janmashtami
    '2026-10-02', // Gandhi Jayanti
    '2026-10-24', // Dussehra
    '2026-11-13', // Diwali
    '2026-11-14', // Diwali (Balipratipada)
    '2026-11-30', // Guru Nanak Jayanti
    '2026-12-25'  // Christmas
];

function isMarketOpen() {
    const now = new Date();
    const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    
    // Check if weekend (Saturday = 6, Sunday = 0)
    const day = istTime.getDay();
    if (day === 0 || day === 6) {
        return { open: false, reason: 'Weekend - Market Closed' };
    }
    
    // Check if holiday
    const dateStr = istTime.toISOString().split('T')[0];
    if (MARKET_HOLIDAYS_2026.includes(dateStr)) {
        return { open: false, reason: 'Market Holiday' };
    }
    
    // Check market hours (9:15 AM to 3:30 PM IST)
    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();
    const timeInMinutes = hours * 60 + minutes;
    
    const marketOpen = 9 * 60 + 15;  // 9:15 AM
    const marketClose = 15 * 60 + 30; // 3:30 PM
    
    if (timeInMinutes < marketOpen) {
        return { open: false, reason: 'Pre-Market - Opens at 9:15 AM' };
    }
    
    if (timeInMinutes > marketClose) {
        return { open: false, reason: 'Market Closed - Opens tomorrow at 9:15 AM' };
    }
    
    return { open: true, reason: 'Market Open' };
}

function showMarketStatus() {
    const status = isMarketOpen();
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) {
        console.warn('Navbar not found');
        return;
    }
    
    const navRight = navbar.querySelector('.nav-right');
    if (!navRight) {
        console.warn('Nav-right not found');
        return;
    }
    
    // Add test mode button only for admin user
    let testModeBtn = document.getElementById('test-mode-btn');
    if (currentUser === 'admin') {
        if (!testModeBtn) {
            testModeBtn = document.createElement('button');
            testModeBtn.id = 'test-mode-btn';
            testModeBtn.textContent = testMode ? '🧪 TEST MODE ON' : '🧪 Test Mode';
            testModeBtn.style.cssText = 'padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-right: 15px; border: none; cursor: pointer; transition: all 0.3s;';
            testModeBtn.style.background = testMode ? '#ffc107' : '#6c757d';
            testModeBtn.style.color = testMode ? '#000' : '#fff';
            testModeBtn.onclick = toggleTestMode;
            
            // Insert before user name
            const userName = document.getElementById('user-name');
            if (userName) {
                navRight.insertBefore(testModeBtn, userName);
            }
        }
    } else {
        // Remove test mode button if user is not admin
        if (testModeBtn) {
            testModeBtn.remove();
        }
    }
    
    // Add or update market status indicator
    let statusElement = document.getElementById('market-status');
    if (!statusElement) {
        statusElement = document.createElement('div');
        statusElement.id = 'market-status';
        statusElement.style.cssText = 'padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-right: 15px;';
        
        // Insert before user name
        const userName = document.getElementById('user-name');
        if (userName) {
            navRight.insertBefore(statusElement, userName);
        }
    }
    
    if (testMode) {
        statusElement.textContent = '🧪 TEST MODE ACTIVE';
        statusElement.style.background = '#fff3cd';
        statusElement.style.color = '#856404';
    } else if (status.open) {
        statusElement.textContent = '🟢 ' + status.reason;
        statusElement.style.background = '#d4edda';
        statusElement.style.color = '#155724';
    } else {
        statusElement.textContent = '🔴 ' + status.reason;
        statusElement.style.background = '#f8d7da';
        statusElement.style.color = '#721c24';
    }
    
    console.log('✅ Market status indicator added:', statusElement.textContent);
}

function toggleTestMode() {
    testMode = !testMode;
    
    const btn = document.getElementById('test-mode-btn');
    btn.textContent = testMode ? '🧪 TEST MODE ON' : '🧪 Test Mode';
    btn.style.background = testMode ? '#ffc107' : '#6c757d';
    btn.style.color = testMode ? '#000' : '#fff';
    
    showMarketStatus();
    
    if (testMode) {
        addAPIDebugLog('🧪 Test mode enabled - bypassing market hours', 'info');
        alert('🧪 Test Mode Enabled!\n\nMarket hours check bypassed.\nAPI will fetch prices even when market is closed.\n\nClick again to disable.');
        
        // Trigger immediate price fetch
        fetchRealPricesAndInitialize();
    } else {
        addAPIDebugLog('Test mode disabled - normal operation', 'info');
        alert('Test Mode Disabled\n\nReturned to normal operation.');
    }
}

// Real-time Price Fetching
let lastPriceUpdate = null;
let isUsingLiveData = false;
const PRICE_UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes
let testMode = false; // Test mode to bypass market hours

async function fetchRealPrices() {
    try {
        console.log('Fetching real-time prices from Yahoo Finance...');
        
        // Fetch prices in batches to avoid rate limits
        const batchSize = 10;
        const symbols = stocksData.map(stock => stock.symbol + '.NS'); // NSE symbols
        
        for (let i = 0; i < symbols.length; i += batchSize) {
            const batch = symbols.slice(i, i + batchSize);
            await fetchBatchPrices(batch);
            
            // Small delay between batches
            if (i + batchSize < symbols.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
        isUsingLiveData = true;
        lastPriceUpdate = new Date();
        console.log('Successfully fetched real-time prices');
        updateDataSourceIndicator();
        
    } catch (error) {
        console.error('Error fetching real prices:', error);
        console.log('Falling back to simulated prices');
        isUsingLiveData = false;
        updateDataSourceIndicator();
    }
}

async function fetchBatchPrices(symbols) {
    const symbolsQuery = symbols.join(',');
    
    // Using Yahoo Finance API via CORS proxy
    const corsProxy = 'https://api.allorigins.win/raw?url=';
    const yahooUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbolsQuery}`;
    
    try {
        const response = await fetch(corsProxy + encodeURIComponent(yahooUrl));
        const data = await response.json();
        
        if (data.quoteResponse && data.quoteResponse.result) {
            data.quoteResponse.result.forEach(quote => {
                const symbol = quote.symbol.replace('.NS', '');
                
                if (marketData[symbol]) {
                    const newPrice = quote.regularMarketPrice || quote.currentPrice;
                    const prevClose = quote.regularMarketPreviousClose;
                    
                    if (newPrice && prevClose) {
                        marketData[symbol].currentPrice = newPrice;
                        marketData[symbol].previousClose = prevClose;
                        marketData[symbol].change = newPrice - prevClose;
                        marketData[symbol].changePercent = ((newPrice - prevClose) / prevClose) * 100;
                        marketData[symbol].high = quote.regularMarketDayHigh || newPrice;
                        marketData[symbol].low = quote.regularMarketDayLow || newPrice;
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error fetching batch:', error);
        throw error;
    }
}

function updateDataSourceIndicator() {
    // Only show indicator for admin users
    if (currentUser !== 'admin') {
        // Remove indicator if it exists for non-admin users
        const indicator = document.getElementById('data-source-indicator');
        if (indicator) {
            indicator.remove();
        }
        return;
    }
    
    const navbar = document.querySelector('.navbar');
    let indicator = document.getElementById('data-source-indicator');
    
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'data-source-indicator';
        indicator.style.cssText = 'padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-right: 15px; cursor: pointer;';
        
        // Add click handler to show debug info
        indicator.addEventListener('click', showAPIDebugInfo);
        
        const statusElement = document.getElementById('market-status');
        if (statusElement) {
            navbar.querySelector('.nav-right').insertBefore(indicator, statusElement);
        } else {
            navbar.querySelector('.nav-right').insertBefore(indicator, navbar.querySelector('.nav-right').firstChild);
        }
    }
    
    if (isUsingLiveData) {
        const updateTime = lastPriceUpdate ? lastPriceUpdate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '';
        indicator.textContent = `📡 LIVE DATA (Updated: ${updateTime})`;
        indicator.style.background = '#d1ecf1';
        indicator.style.color = '#0c5460';
        indicator.title = 'Click to see API debug info';
    } else {
        indicator.textContent = '🔄 SIMULATED DATA (Click for details)';
        indicator.style.background = '#fff3cd';
        indicator.style.color = '#856404';
        indicator.title = 'Click to see why API failed';
    }
}

// Store API debug logs
let apiDebugLogs = [];

function addAPIDebugLog(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString('en-IN');
    apiDebugLogs.push({ timestamp, message, type });
    
    // Keep only last 20 logs
    if (apiDebugLogs.length > 20) {
        apiDebugLogs.shift();
    }
    
    console.log(`[${timestamp}] ${message}`);
}

function showAPIDebugInfo() {
    const logs = apiDebugLogs.map(log => {
        const icon = log.type === 'error' ? '❌' : log.type === 'success' ? '✅' : 'ℹ️';
        return `${icon} [${log.timestamp}] ${log.message}`;
    }).join('\n');
    
    const message = logs || 'No API logs yet. Waiting for first fetch...';
    alert(`API Debug Information:\n\n${message}\n\nCheck browser console (F12) for detailed logs.`);
}

// Price Simulation (fallback)
let realPricesLoaded = false;
let simulationStarted = false;

async function startPriceUpdates() {
    if (priceUpdateInterval) return;
    
    console.log('🚀 Starting price updates...');
    
    // Initialize sentiment immediately
    initializeSectorSentiment();
    
    // Mark as ready to simulate
    realPricesLoaded = true;
    
    // Show market status
    showMarketStatus();
    updateDataSourceIndicator();
    
    // Try to fetch real prices immediately if market is open
    const marketStatus = isMarketOpen();
    if (marketStatus.open) {
        console.log('🔄 Market is open - Fetching real prices...');
        fetchRealPricesAndInitialize();
    } else {
        console.log('⏸️ Market is closed - Starting simulation with base prices');
    }
    
    priceUpdateInterval = setInterval(() => {
        const marketStatus = isMarketOpen();
        showMarketStatus();
        
        console.log('=== Price Update Cycle ===');
        console.log('Market Status:', marketStatus);
        console.log('Real Prices Loaded:', realPricesLoaded);
        
        // Check if we need to fetch real prices (only if market is actually open)
        if (marketStatus.open) {
            const now = new Date();
            const timeSinceLastUpdate = lastPriceUpdate ? now - lastPriceUpdate : PRICE_UPDATE_INTERVAL + 1;
            
            if (timeSinceLastUpdate > PRICE_UPDATE_INTERVAL) {
                console.log('Fetching real prices from API...');
                fetchRealPricesAndInitialize();
            }
        }
        
        // ALWAYS run simulation
        console.log('Running sentiment-based simulation...');
        updatePrices();
        
        // Always update UI
        console.log('Updating UI...');
        renderStocksList();
        renderDerivativesList();
        updateAccountSummary();
        
        // ALWAYS update holdings and positions
        renderHoldings();
        renderPositions();
        renderDashboard();
        
        console.log('✅ Update cycle complete!');
    }, 3000); // Update every 3 seconds
}

async function fetchRealPricesAndInitialize() {
    try {
        console.log('📡 Fetching real-time prices from Alpha Vantage...');
        
        // Get all unique symbols from watchlist and portfolio
        const user = users[currentUser];
        const watchlistSymbols = user.watchlist ? user.watchlist.stocks : [];
        const portfolioSymbols = Object.keys(user.portfolio);
        const allSymbols = [...new Set([...watchlistSymbols, ...portfolioSymbols])];
        
        console.log('Fetching prices for:', allSymbols);
        
        // Fetch prices in batches
        const batchSize = 10;
        let successCount = 0;
        
        for (let i = 0; i < allSymbols.length; i += batchSize) {
            const batch = allSymbols.slice(i, i + batchSize).map(s => s + '.NS');
            const success = await fetchBatchPricesAndSetSentiment(batch);
            if (success) successCount++;
            
            // Small delay between batches
            if (i + batchSize < allSymbols.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
        if (successCount > 0) {
            isUsingLiveData = true;
            realPricesLoaded = true;
            lastPriceUpdate = new Date();
            
            // Initialize sentiment based on real market data
            initializeSentimentFromRealData();
            
            console.log('✅ Real prices loaded successfully!');
            console.log('📊 Market sentiment initialized from real data');
            
            // IMPORTANT: Update UI immediately after fetching prices
            renderStocksList();
            renderDerivativesList();
            updateAccountSummary();
            
            if (document.getElementById('holdings-section').classList.contains('active')) {
                renderHoldings();
            }
            if (document.getElementById('positions-section').classList.contains('active')) {
                renderPositions();
            }
            if (document.getElementById('dashboard-section').classList.contains('active')) {
                renderDashboard();
            }
            
            console.log('✅ UI updated with real prices!');
        } else {
            throw new Error('Failed to fetch any real prices');
        }
        
        updateDataSourceIndicator();
        
    } catch (error) {
        console.error('❌ Error fetching real prices:', error);
        console.log('🔄 Falling back to simulated prices');
        isUsingLiveData = false;
        realPricesLoaded = true; // Allow simulation to start
        initializeSectorSentiment(); // Use random sentiment
        updateDataSourceIndicator();
    }
}

async function fetchBatchPricesAndSetSentiment(symbols) {
    const ALPHA_VANTAGE_API_KEY = 'IBR2ZOARKOZ1O8XZ';
    
    addAPIDebugLog(`Fetching batch: ${symbols.map(s => s.replace('.NS', '')).join(', ')}`);
    addAPIDebugLog('Using Alpha Vantage API (no CORS issues!)');
    
    let pricesUpdated = 0;
    
    // Alpha Vantage allows 5 requests per minute, 25 per day
    // Fetch one stock at a time with delay
    for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i].replace('.NS', '');
        
        try {
            // Alpha Vantage Global Quote endpoint
            const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}.BSE&apikey=${ALPHA_VANTAGE_API_KEY}`;
            
            addAPIDebugLog(`Fetching ${symbol} from Alpha Vantage...`);
            console.log(`Fetching ${symbol} from Alpha Vantage...`);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorMsg = `HTTP ${response.status} for ${symbol}`;
                addAPIDebugLog(errorMsg, 'error');
                console.warn(errorMsg);
                continue;
            }
            
            const data = await response.json();
            
            // Check for API limit
            if (data.Note) {
                addAPIDebugLog('⚠️ API limit reached (25/day). Using simulation.', 'error');
                console.warn('Alpha Vantage API limit reached');
                return false;
            }
            
            // Check for error
            if (data['Error Message']) {
                addAPIDebugLog(`Error for ${symbol}: ${data['Error Message']}`, 'error');
                console.warn(`Error for ${symbol}:`, data['Error Message']);
                continue;
            }
            
            const quote = data['Global Quote'];
            
            if (quote && quote['05. price']) {
                const newPrice = parseFloat(quote['05. price']);
                const prevClose = parseFloat(quote['08. previous close']);
                const change = parseFloat(quote['09. change']);
                const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));
                
                if (marketData[symbol]) {
                    // Set real prices
                    marketData[symbol].currentPrice = newPrice;
                    marketData[symbol].previousClose = prevClose;
                    marketData[symbol].change = change;
                    marketData[symbol].changePercent = changePercent;
                    marketData[symbol].high = parseFloat(quote['03. high']) || newPrice;
                    marketData[symbol].low = parseFloat(quote['04. low']) || newPrice;
                    
                    // Store real sentiment (bullish or bearish)
                    marketData[symbol].realSentiment = changePercent > 0 ? 'bullish' : 'bearish';
                    marketData[symbol].realMomentum = Math.abs(changePercent) / 5; // Normalize to 0-1
                    
                    pricesUpdated++;
                    const priceLog = `${symbol}: ₹${newPrice.toFixed(2)} (${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%)`;
                    addAPIDebugLog(priceLog, 'success');
                    console.log(`${symbol}: ₹${newPrice.toFixed(2)} (${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%) - ${marketData[symbol].realSentiment}`);
                }
            } else {
                addAPIDebugLog(`No data for ${symbol}`, 'error');
                console.warn(`No data for ${symbol}`);
            }
            
            // Delay between requests (Alpha Vantage: 5 req/min = 12 sec between)
            // Use shorter delay for faster initial load
            if (i < symbols.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds instead of 12
            }
            
        } catch (error) {
            const errorMsg = `Error fetching ${symbol}: ${error.message}`;
            addAPIDebugLog(errorMsg, 'error');
            console.error(errorMsg);
        }
    }
    
    if (pricesUpdated > 0) {
        addAPIDebugLog(`✅ Updated ${pricesUpdated} stock prices from Alpha Vantage`, 'success');
        return true;
    } else {
        addAPIDebugLog('❌ No prices updated - using simulation', 'error');
        return false;
    }
}

function initializeSentimentFromRealData() {
    const sectors = ['IT', 'Banking', 'Energy', 'FMCG', 'Pharma', 'Auto', 'Finance', 'Telecom', 'Infrastructure', 'Metals', 'Cement'];
    
    sectors.forEach(sector => {
        // Find all stocks in this sector
        const sectorStocks = Object.values(marketData).filter(stock => stock.sector === sector && stock.realSentiment);
        
        if (sectorStocks.length > 0) {
            // Calculate average sentiment for sector
            const avgChange = sectorStocks.reduce((sum, stock) => sum + stock.changePercent, 0) / sectorStocks.length;
            const avgMomentum = sectorStocks.reduce((sum, stock) => sum + (stock.realMomentum || 0), 0) / sectorStocks.length;
            
            sectorSentiment[sector] = {
                trend: Math.max(-1, Math.min(1, avgChange / 5)), // Normalize to -1 to +1
                momentum: Math.max(0.3, Math.min(1, avgMomentum)),
                lastUpdate: Date.now(),
                source: 'real' // Mark as derived from real data
            };
            
            console.log(`${sector} Sector: ${avgChange > 0 ? '📈 Bullish' : '📉 Bearish'} (${avgChange.toFixed(2)}%)`);
        } else {
            // Fallback to random if no real data
            sectorSentiment[sector] = {
                trend: (Math.random() - 0.5) * 2,
                momentum: Math.random() * 0.5 + 0.5,
                lastUpdate: Date.now(),
                source: 'simulated'
            };
        }
    });
    
    lastSentimentUpdate = Date.now();
    console.log('📊 Sector sentiment initialized:', sectorSentiment);
}

function stopPriceUpdates() {
    if (priceUpdateInterval) {
        clearInterval(priceUpdateInterval);
        priceUpdateInterval = null;
    }
}

// Enhanced Simulation with Sector Sentiment
let sectorSentiment = {};
let lastSentimentUpdate = Date.now();

function initializeSectorSentiment() {
    const sectors = ['IT', 'Banking', 'Energy', 'FMCG', 'Pharma', 'Auto', 'Finance', 'Telecom', 'Infrastructure', 'Metals', 'Cement'];
    
    sectors.forEach(sector => {
        sectorSentiment[sector] = {
            trend: (Math.random() - 0.5) * 2, // -1 to +1 (bearish to bullish)
            momentum: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
            lastUpdate: Date.now()
        };
    });
}

function updateSectorSentiment() {
    const now = Date.now();
    
    // Update sentiment every 2 minutes
    if (now - lastSentimentUpdate > 120000) {
        for (const sector in sectorSentiment) {
            const sentiment = sectorSentiment[sector];
            
            // Gradually shift sentiment (momentum-based)
            const shift = (Math.random() - 0.5) * 0.3;
            sentiment.trend = Math.max(-1, Math.min(1, sentiment.trend + shift));
            
            // Update momentum
            sentiment.momentum = Math.random() * 0.5 + 0.5;
            sentiment.lastUpdate = now;
        }
        
        lastSentimentUpdate = now;
        console.log('Sector sentiment updated:', sectorSentiment);
    }
}

function updatePrices() {
    const now = new Date();
    const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();
    
    // Initialize sentiment if not done
    if (Object.keys(sectorSentiment).length === 0) {
        initializeSectorSentiment();
    }
    
    // Update sector sentiment periodically (but smoothly)
    updateSectorSentiment();
    
    // More volatile in opening hour (9:15-10:15) and closing hour (2:30-3:30)
    const isOpeningHour = (hours === 9 && minutes >= 15) || hours === 10;
    const isClosingHour = hours === 14 || (hours === 15 && minutes <= 30);
    
    for (const symbol in marketData) {
        const stock = marketData[symbol];
        
        // Skip if this is an option (will be updated separately)
        if (stock.underlying) continue;
        
        // Get sector sentiment
        const sector = stock.sector || 'Diversified';
        const sentiment = sectorSentiment[sector] || { trend: 0, momentum: 1 };
        
        // Use real sentiment if available, otherwise use sector sentiment
        let trendDirection = sentiment.trend;
        let trendStrength = sentiment.momentum;
        
        if (stock.realSentiment) {
            // Stock has real market data - follow that trend
            trendDirection = stock.realSentiment === 'bullish' ? 1 : -1;
            trendStrength = stock.realMomentum || 0.5;
            
            // Smooth transition: 70% real trend, 30% random variation
            trendDirection = trendDirection * 0.7 + (Math.random() - 0.5) * 0.3;
        }
        
        // Base volatility - much smaller for smooth movement
        let volatility = 0.05; // Base 0.05% per update (smooth movement)
        
        // Adjust volatility based on time
        if (isOpeningHour || isClosingHour) {
            volatility = 0.12; // Higher volatility during opening/closing
        }
        
        // Calculate price change following the trend
        // Trend-based movement (80%) + small random noise (20%)
        const trendMovement = trendDirection * trendStrength * volatility * 0.8;
        const randomNoise = (Math.random() - 0.5) * volatility * 0.2;
        const totalChange = trendMovement + randomNoise;
        
        // Apply price change
        const changeAmount = stock.currentPrice * (totalChange / 100);
        stock.currentPrice += changeAmount;
        
        // Realistic bounds (±10% from previous close per day)
        const maxPrice = stock.previousClose * 1.10;
        const minPrice = stock.previousClose * 0.90;
        stock.currentPrice = Math.max(stock.currentPrice, minPrice);
        stock.currentPrice = Math.min(stock.currentPrice, maxPrice);
        
        // Update change metrics
        stock.change = stock.currentPrice - stock.previousClose;
        stock.changePercent = (stock.change / stock.previousClose) * 100;
        
        // Update high/low
        stock.high = Math.max(stock.high, stock.currentPrice);
        stock.low = Math.min(stock.low, stock.currentPrice);
    }
    
    // Update options prices based on underlying stocks
    updateOptionsPrices();
    
    // Save market data to localStorage after each update
    saveMarketData();
    
    // Update dashboard and positions if they're visible
    updateAccountSummary();
    if (document.getElementById('dashboard-section').classList.contains('active')) {
        renderDashboard();
    }
}

function updateOptionsPrices() {
    // Update options based on their underlying stock prices
    for (const symbol in marketData) {
        const option = marketData[symbol];
        
        if (option.underlying) {
            const underlyingStock = marketData[option.underlying];
            
            if (underlyingStock) {
                const underlyingPrice = underlyingStock.currentPrice;
                const strike = option.strike;
                const moneyness = underlyingPrice / strike;
                
                // Recalculate option premium
                if (option.type === 'Call Option') {
                    const intrinsicValue = Math.max(0, underlyingPrice - strike);
                    const timeValue = underlyingPrice * 0.02 * Math.exp(-(1 - moneyness) * 2);
                    option.currentPrice = Math.max(1, intrinsicValue + timeValue);
                } else if (option.type === 'Put Option') {
                    const intrinsicValue = Math.max(0, strike - underlyingPrice);
                    const timeValue = underlyingPrice * 0.02 * Math.exp(-(moneyness - 1) * 2);
                    option.currentPrice = Math.max(1, intrinsicValue + timeValue);
                }
                
                // Update change metrics
                option.change = option.currentPrice - option.previousClose;
                option.changePercent = (option.change / option.previousClose) * 100;
                option.high = Math.max(option.high, option.currentPrice);
                option.low = Math.min(option.low, option.currentPrice);
            }
        }
    }
}

// Reset prices at market open (9:15 AM)
function checkMarketOpen() {
    const now = new Date();
    const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();
    
    // If it's 9:15 AM, reset previous close to current price
    if (hours === 9 && minutes === 15) {
        for (const symbol in marketData) {
            marketData[symbol].previousClose = marketData[symbol].currentPrice;
            marketData[symbol].high = marketData[symbol].currentPrice;
            marketData[symbol].low = marketData[symbol].currentPrice;
        }
    }
}

// Check market open every minute
setInterval(checkMarketOpen, 60000);

// Save user data
function saveUserData() {
    users[currentUser] = users[currentUser];
    localStorage.setItem('tradingUsers', JSON.stringify(users));
}

// Ensure admin user always exists
function ensureAdminUser() {
    users = JSON.parse(localStorage.getItem('tradingUsers')) || {};
    
    if (!users['admin']) {
        users['admin'] = {
            username: 'admin',
            password: 'admin',
            name: 'Administrator',
            balance: 100000,
            portfolio: {},
            orders: [],
            transactions: [],
            realizedPnL: 0,
            watchlist: {
                stocks: ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'],
                derivatives: ['NIFTY50-FUT', 'BANKNIFTY-FUT']
            },
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('tradingUsers', JSON.stringify(users));
        console.log('✅ Admin user created automatically');
    }
}

// Initialize on page load
window.addEventListener('load', function() {
    initializeMarketData();
    
    // Ensure admin user exists
    ensureAdminUser();
    
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser && users[savedUser]) {
        currentUser = savedUser;
        showDashboard();
    }
});

// Watchlist Functions
function openAddStockModal() {
    renderAvailableStocks();
    renderAvailableDerivatives();
    document.getElementById('add-stock-modal').classList.add('active');
}

function closeAddStockModal() {
    document.getElementById('add-stock-modal').classList.remove('active');
}

function showAddStockTab(tab) {
    document.querySelectorAll('.add-stock-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    document.querySelectorAll('.add-stock-list').forEach(list => {
        list.classList.remove('active');
    });
    document.getElementById(`add-${tab}-list`).classList.add('active');
}

function renderAvailableStocks() {
    const user = users[currentUser];
    const container = document.getElementById('available-stocks');
    container.innerHTML = '';
    
    if (!user.watchlist) {
        user.watchlist = {
            stocks: ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'],
            derivatives: ['NIFTY50-FUT', 'BANKNIFTY-FUT']
        };
    }
    
    stocksData.forEach(stock => {
        const isInWatchlist = user.watchlist.stocks.includes(stock.symbol);
        const item = document.createElement('div');
        item.className = 'available-item';
        
        item.innerHTML = `
            <div class="available-info">
                <div class="stock-name">${stock.name}</div>
                <div class="stock-symbol">${stock.symbol}</div>
            </div>
            <button class="btn-add-to-watchlist ${isInWatchlist ? 'added' : ''}" 
                    onclick="toggleWatchlist('stocks', '${stock.symbol}')"
                    ${isInWatchlist ? 'disabled' : ''}>
                ${isInWatchlist ? '✓ Added' : '+ Add'}
            </button>
        `;
        
        container.appendChild(item);
    });
}

function renderAvailableDerivatives() {
    const user = users[currentUser];
    const container = document.getElementById('available-derivatives');
    container.innerHTML = '';
    
    if (!user.watchlist) {
        user.watchlist = {
            stocks: ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'],
            derivatives: ['NIFTY50-FUT', 'BANKNIFTY-FUT']
        };
    }
    
    derivativesData.forEach(derivative => {
        const isInWatchlist = user.watchlist.derivatives.includes(derivative.symbol);
        const item = document.createElement('div');
        item.className = 'available-item';
        
        item.innerHTML = `
            <div class="available-info">
                <div class="stock-name">${derivative.name}</div>
                <div class="stock-symbol">${derivative.symbol}</div>
            </div>
            <button class="btn-add-to-watchlist ${isInWatchlist ? 'added' : ''}" 
                    onclick="toggleWatchlist('derivatives', '${derivative.symbol}')"
                    ${isInWatchlist ? 'disabled' : ''}>
                ${isInWatchlist ? '✓ Added' : '+ Add'}
            </button>
        `;
        
        container.appendChild(item);
    });
}

function toggleWatchlist(type, symbol) {
    const user = users[currentUser];
    
    if (!user.watchlist[type].includes(symbol)) {
        user.watchlist[type].push(symbol);
        saveUserData();
        
        if (type === 'stocks') {
            renderAvailableStocks();
            renderStocksList();
        } else {
            renderAvailableDerivatives();
            renderDerivativesList();
        }
    }
}

function removeFromWatchlist(type, symbol) {
    const user = users[currentUser];
    const index = user.watchlist[type].indexOf(symbol);
    
    if (index > -1) {
        user.watchlist[type].splice(index, 1);
        saveUserData();
        
        if (type === 'stocks') {
            renderStocksList();
        } else {
            renderDerivativesList();
        }
    }
}

function filterStocks(type) {
    const searchTerm = document.getElementById(`search-${type}`).value.toLowerCase();
    const container = document.getElementById(`available-${type}`);
    const items = container.getElementsByClassName('available-item');
    
    Array.from(items).forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// P&L Report
function renderPnLReport() {
    const user = users[currentUser];
    
    // Initialize realizedPnL if it doesn't exist
    if (user.realizedPnL === undefined) {
        user.realizedPnL = 0;
    }
    
    // Calculate unrealized P&L
    const unrealizedPnL = calculateTotalPnL();
    const realizedPnL = user.realizedPnL;
    const totalPnL = unrealizedPnL + realizedPnL;
    
    // Update summary cards
    const unrealizedElement = document.getElementById('unrealized-pnl');
    unrealizedElement.textContent = `₹${unrealizedPnL.toFixed(2)}`;
    unrealizedElement.className = 'pnl-value ' + (unrealizedPnL >= 0 ? 'positive' : 'negative');
    
    const realizedElement = document.getElementById('realized-pnl');
    realizedElement.textContent = `₹${realizedPnL.toFixed(2)}`;
    realizedElement.className = 'pnl-value ' + (realizedPnL >= 0 ? 'positive' : 'negative');
    
    const totalElement = document.getElementById('total-pnl-report');
    totalElement.textContent = `₹${totalPnL.toFixed(2)}`;
    totalElement.className = 'pnl-value ' + (totalPnL >= 0 ? 'positive' : 'negative');
    
    // Render unrealized P&L table
    const unrealizedTable = document.getElementById('unrealized-pnl-table');
    if (Object.keys(user.portfolio).length === 0) {
        unrealizedTable.innerHTML = '<div class="empty-state"><p>No current holdings</p></div>';
    } else {
        unrealizedTable.innerHTML = '<div class="holdings-table"></div>';
        const table = unrealizedTable.querySelector('.holdings-table');
        
        // Add header
        const header = document.createElement('div');
        header.className = 'holding-item';
        header.style.fontWeight = 'bold';
        header.style.background = '#f5f7fa';
        header.innerHTML = `
            <div>Stock</div>
            <div>Qty</div>
            <div>Avg Price</div>
            <div>Current</div>
            <div>P&L</div>
            <div>P&L %</div>
            <div></div>
        `;
        table.appendChild(header);
        
        // Add holdings
        for (const symbol in user.portfolio) {
            const holding = user.portfolio[symbol];
            const currentPrice = marketData[symbol].currentPrice;
            const invested = holding.quantity * holding.avgPrice;
            const current = holding.quantity * currentPrice;
            const pnl = current - invested;
            const pnlPercent = Math.abs(invested) > 0 ? (pnl / Math.abs(invested)) * 100 : 0;
            
            const item = document.createElement('div');
            item.className = 'holding-item';
            
            const pnlClass = pnl >= 0 ? 'positive' : 'negative';
            const pnlSymbol = pnl >= 0 ? '+' : '';
            
            item.innerHTML = `
                <div>
                    <div class="stock-name">${marketData[symbol].name}</div>
                    <div class="stock-symbol">${symbol}</div>
                </div>
                <div>${holding.quantity}</div>
                <div>₹${holding.avgPrice.toFixed(2)}</div>
                <div>₹${currentPrice.toFixed(2)}</div>
                <div class="${pnlClass}">${pnlSymbol}₹${pnl.toFixed(2)}</div>
                <div class="${pnlClass}">${pnlSymbol}${pnlPercent.toFixed(2)}%</div>
                <div></div>
            `;
            
            table.appendChild(item);
        }
    }
    
    // Render realized P&L table (from completed trades)
    const realizedTable = document.getElementById('realized-pnl-table');
    
    // Filter sell orders to show realized P&L
    const sellOrders = user.orders.filter(order => order.type === 'sell');
    
    if (sellOrders.length === 0) {
        realizedTable.innerHTML = '<div class="empty-state"><p>No completed trades yet</p></div>';
    } else {
        realizedTable.innerHTML = '<div class="orders-table"></div>';
        const table = realizedTable.querySelector('.orders-table');
        
        // Add header
        const header = document.createElement('div');
        header.className = 'order-item';
        header.style.fontWeight = 'bold';
        header.style.background = '#f5f7fa';
        header.innerHTML = `
            <div>Date</div>
            <div>Stock</div>
            <div>Qty</div>
            <div>Sell Price</div>
            <div>Total</div>
            <div>Status</div>
            <div></div>
        `;
        table.appendChild(header);
        
        // Show most recent first
        const sortedOrders = [...sellOrders].reverse();
        
        sortedOrders.forEach(order => {
            const item = document.createElement('div');
            item.className = 'order-item';
            
            const date = new Date(order.timestamp);
            const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            
            item.innerHTML = `
                <div>${dateStr}</div>
                <div>
                    <div class="stock-name">${marketData[order.symbol].name}</div>
                    <div class="stock-symbol">${order.symbol}</div>
                </div>
                <div>${order.quantity}</div>
                <div>₹${order.price.toFixed(2)}</div>
                <div>₹${order.total.toFixed(2)}</div>
                <div><span class="order-status completed">Completed</span></div>
                <div></div>
            `;
            
            table.appendChild(item);
        });
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const tradeModal = document.getElementById('trade-modal');
    const addStockModal = document.getElementById('add-stock-modal');
    
    if (event.target === tradeModal) {
        closeTradeModal();
    }
    if (event.target === addStockModal) {
        closeAddStockModal();
    }
});
