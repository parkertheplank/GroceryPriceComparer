const puppeteer = require('puppeteer');

async function fetchPrice(url, cssSelector) {
    try {
        const browser = await puppeteer.launch({headless: 'new' });
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
    'Safeway': { url: 'https://www.safeway.com/shop/product-details.111010341.html', selector: 'body > main > div > div > div > div > div.row.product-details-container.desktop.mt-5 > div.col-12.col-sm-12.col-md-12.col-lg-6.col-xl-6.product-details > div > div.product-details > div.product-details__product-price' },
    'Sprouts': { url: 'https://shop.sprouts.com/landing?product_id=25446&region_id=2887106004', selector: '#regular_price' },
    'Walmart': { url: 'https://www.walmart.com/ip/Bear-Naked-Vanilla-Almond-Crisp-Granola-Cereal-Mega-Pack-16-5-oz-Bag/961171366', selector: '#maincontent > section > main > div.flex.flex-column.h-100 > div:nth-child(2) > div > div.w_aoqv.w_wRee.w_b_WN > div > div:nth-child(1) > div > div > span.b.lh-copy.dark-gray.f1.mr2 > span.inline-flex.flex-column' }
};

(async () => {
    for (const [store, info] of Object.entries(stores)) {
        const price = await fetchPrice(info.url, info.selector);
        console.log(`${store}: ${price}`);
    }
})();
