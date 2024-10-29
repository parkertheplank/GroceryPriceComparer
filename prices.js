const puppeteer = require('puppeteer');

async function fetchPrice(url, cssSelector) {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'load', timeout: 0 });

        // Wait for the price element to load
        await page.waitForSelector(cssSelector, { timeout: 10000 });

        // Log the HTML to see the structure
        const pageHTML = await page.content();
        console.log(`HTML from ${url}:`, pageHTML);

        const price = await page.$eval(cssSelector, el => el.textContent.trim());
        await browser.close();
        return price;
    } catch (error) {
        console.error(`Error fetching price from ${url}:`, error);
        return null;
    }
}

const stores = {
    'Walmart': { url: 'https://www.walmart.com/ip/Bear-Naked-Vanilla-Almond-Crisp-Granola-Cereal-Mega-Pack-16-5-oz-Bag/961171366', selector: '.price-characteristic' },
    'Safeway': { url: 'https://www.safeway.com/shop/product-details.111010341.html', selector: '.product-price' },
    'Sprouts': { url: 'https://shop.sprouts.com/landing?product_id=25446&region_id=2887106004', selector: '.current-price' }
};

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    try {
        for (const [store, info] of Object.entries(stores)) {
            const page = await browser.newPage();
            await page.goto(info.url, { waitUntil: 'load', timeout: 0 });
            await page.waitForSelector(info.selector, { timeout: 10000 });
            const price = await page.$eval(info.selector, el => el.textContent.trim());
            console.log(`${store}: ${price}`);
            await page.close();
        }
    } catch (error) {
        console.error(error);
    } finally {
        await browser.close();
    }
})();
