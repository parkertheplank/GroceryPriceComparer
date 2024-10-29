const puppeteer = require('puppeteer');

async function fetchPrice(url, cssSelector) {
    console.log(`Fetching price from ${url} with selector ${cssSelector}`);
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        console.log('Navigating to page...');
        
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        
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
        selector: '#regular_price'
    },
    'Safeway': { 
        url: 'https://www.safeway.com/shop/product-details.111010341.html', 
        selector: '.body > main > div > div > div > div > div.row.product-details-container.desktop.mt-5 > div.col-12.col-sm-12.col-md-12.col-lg-6.col-xl-6.product-details > div > div.product-details > div.product-details__product-price > div > span:nth-child(1)' 
    },
    'Walmart': { 
        url: 'https://www.walmart.com/ip/Bear-Naked-Vanilla-Almond-Crisp-Granola-Cereal-Mega-Pack-16-5-oz-Bag/961171366', 
        selector: '#maincontent > section > main > div.flex.flex-column.h-100 > div:nth-child(2) > div > div.w_aoqv.w_wRee.w_b_WN > div > div:nth-child(1) > div > div > span.b.lh-copy.dark-gray.f1.mr2 > span.inline-flex.flex-column > span' 
    }
};

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    try {
        for (const [store, info] of Object.entries(stores)) {
            console.log(`Processing ${store}...`);
            const page = await browser.newPage();
            await page.goto(info.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
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
