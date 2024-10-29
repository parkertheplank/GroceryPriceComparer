const puppeteer = require('puppeteer');

async function fetchPrice(url, cssSelector) {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 }); // Increased timeout

        // Wait for the stable parent container
        await page.waitForSelector(cssSelector, { timeout: 60000 }); // Increased timeout

        const price = await page.$eval(cssSelector, el => el.textContent.trim());
        await browser.close();
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
    'Walmart': { 
        url: 'https://www.walmart.com/ip/Bear-Naked-Vanilla-Almond-Crisp-Granola-Cereal-Mega-Pack-16-5-oz-Bag/961171366', 
        selector: '[itemprop="price"]' // Trying a more general attribute-based selector
    },
    'Safeway': { 
        url: 'https://www.safeway.com/shop/product-details.111010341.html', 
        selector: '.price-xl' // Simplified selector
    }
};

(async () => {
    for (const [store, {url, selector}] of Object.entries(stores)) {
        try {
            const price = await fetchPrice(url, selector);
            console.log(`${store}: ${price}`);
        } catch (error) {
            console.error(`${store} failed completely:`, error);
        }
    }
})();
