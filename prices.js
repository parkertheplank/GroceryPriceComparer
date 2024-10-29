const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

async function fetchPrice(url, cssSelector) {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();

        // Set user agent and proxies
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        // Uncomment and set these lines if you're using proxies
        // await page.authenticate({ username: 'your-proxy-username', password: 'your-proxy-password' });

        console.log(`Navigating to ${url}...`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        console.log('Waiting for selector...');
        await page.waitForSelector(cssSelector, { timeout: 60000 });

        console.log('Evaluating selector...');
        const price = await page.$eval(cssSelector, el => el.textContent.trim());
        await browser.close();
        console.log(`Fetched price: ${price}`);
        return price;
    } catch (error) {
        console.error(`Error fetching price from ${url}:`, error);
        return null;
    }
}

const stores = {
    'Walmart': { 
        url: 'https://www.walmart.com/ip/Bear-Naked-Vanilla-Almond-Crisp-Granola-Cereal-Mega-Pack-16-5-oz-Bag/961171366', 
        selector: '[itemprop="price"]'
    },
    'Safeway': { 
        url: 'https://www.safeway.com/shop/product-details.111010341.html', 
        selector: '.price-xl'
    }
};

(async () => {
    for (const [store, info] of Object.entries(stores)) {
        try {
            const price = await fetchPrice(info.url, info.selector);
            console.log(`${store}: ${price}`);
        } catch (error) {
            console.error(`${store} failed completely:`, error);
        }
    }
})();
