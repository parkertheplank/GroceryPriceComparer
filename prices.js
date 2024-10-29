const puppeteer = require('puppeteer');

async function fetchPrice(url, cssSelector) {
    console.log(`Fetching price from ${url} with selector ${cssSelector}`);
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        console.log('Navigating to page...');
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
    'Sprouts': { 
        url: 'https://shop.sprouts.com/landing?product_id=25446&region_id=2887106004', 
        selector: '.current-price' 
    },
    'Safeway': { 
        url: 'https://www.safeway.com/shop/product-details.111010341.html', 
        selector: '.product-price' 
    },
    'Walmart': { 
        url: 'https://www.walmart.com/ip/Bear-Naked-Vanilla-Almond-Crisp-Granola-Cereal-Mega-Pack-16-5-oz-Bag/961171366', 
        selector: '.price-characteristic' 
    }
};

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    try {
        for (const [store, info] of Object.entries(stores)) {
            console.log(`Processing ${store}...`);
            const page = await browser.newPage();
            await page.goto(info.url, { waitUntil: 'networkidle2', timeout: 60000 });
            await page.waitForSelector(info.selector, { timeout: 60000 });
            const price = await page.$eval(info.selector, el => el.textContent.trim());
            console.log(`${store}: ${price}`);
            await page.close();
        }
    } catch (error) {
        console.error('General error:', error);
    } finally {
        await browser.close();
        console.log('Browser closed.');
    }
})();
