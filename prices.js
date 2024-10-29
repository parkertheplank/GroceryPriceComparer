const puppeteer = require('puppeteer');

async function fetchPrice(url, cssSelector) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'load', timeout: 0 });

        const price = await page.$eval(cssSelector, el => el.textContent);
        await browser.close();
        return price.trim();
    } catch (error) {
        console.error(`Error fetching price from ${url}:`, error);
        return null;
    }
}

const stores = {
    'Safeway': { url: 'https://www.safeway.com/shop/product-details.111010341.html', selector: '.product-details__product-price' },
    'Sprouts': { url: 'https://shop.sprouts.com/landing?product_id=25446&region_id=2887106004', selector: '.regular_price' },
    'Walmart': { url: 'https://www.walmart.com/ip/Bear-Naked-Vanilla-Almond-Crisp-Granola-Cereal-Mega-Pack-16-5-oz-Bag/961171366', selector: '.price' }
};

(async () => {
    for (const [store, info] of Object.entries(stores)) {
        const price = await fetchPrice(info.url, info.selector);
        console.log(`${store}: ${price}`);
    }
})();
