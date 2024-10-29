const puppeteer = require('puppeteer');

async function fetchPrice(url, cssSelector) {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });

        // Wait for a more stable parent container that ensures the price will eventually load
        await page.waitForSelector(cssSelector, { timeout: 20000 });

        const price = await page.$eval(cssSelector, el => el.textContent.trim());
        await browser.close();
        return price;
    } catch (error) {
        console.error(`Error fetching price from ${url}:`, error);
        return null;
    }
}

async function searchForPrice(url) {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });

        // Look for elements containing '$'
        await page.waitForTimeout(5000); // Wait for the content to load
        const price = await page.$eval("body", body => {
            const elements = body.querySelectorAll('*');
            for (let element of elements) {
                if (element.textContent.includes('$')) {
                    return element.textContent.trim();
                }
            }
            return null;
        });
        await browser.close();
        return price;
    } catch (error) {
        console.error(`Error fetching price from ${url}:`, error);
        return null;
    }
}

const stores = {
    'Walmart': 'https://www.walmart.com/ip/Bear-Naked-Vanilla-Almond-Crisp-Granola-Cereal-Mega-Pack-16-5-oz-Bag/961171366',
    'Safeway': 'https://www.safeway.com/shop/product-details.111010341.html',
    'Sprouts': 'https://shop.sprouts.com/landing?product_id=25446&region_id=2887106004'
};

(async () => {
    for (const [store, url] of Object.entries(stores)) {
        let price = await fetchPrice(url, '.price-characteristic'); // Attempt with specific selector
        if (!price) {
            console.error(`Specific selector failed for ${store}, trying general search.`);
            price = await searchForPrice(url); // Fallback to general search
        }
        console.log(`${store}: ${price}`);
    }
})();
