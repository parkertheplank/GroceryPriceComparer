const puppeteer = require('puppeteer');

const stores = {
    'Sprouts': { 
        url: 'https://shop.sprouts.com/landing?product_id=25446&region_id=2887106004', 
        selector: '#regular_price'
    },
    'Safeway': { 
        url: 'https://www.safeway.com/shop/product-details.111010341.html', 
        selector: 'body' 
    },
    'Walmart': { 
        url: 'https://www.walmart.com/ip/Bear-Naked-Vanilla-Almond-Crisp-Granola-Cereal-Mega-Pack-16-5-oz-Bag/961171366', 
        selector: 'body' 
    }
};

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    try {
        for (const [store, info] of Object.entries(stores)) {
            console.log(`Processing ${store}...`);
            const page = await browser.newPage();
            await page.goto(info.url, { waitUntil: 'domcontentloaded', timeout: 60000 });

            console.log('Waiting for selector...');
            await page.waitForSelector(info.selector, { timeout: 60000 });

            console.log('Evaluating selector...');
            const el = await page.$eval(info.selector);
            const price = await el.evaluate(e => e.innerHTML);
            
            console.log(`${store});
            console.log('${price}`);
            await page.close();
        }
    } catch (error) {
        console.error('General error:', error);
    } finally {
        await browser.close();
        console.log('Browser closed.');
    }
})();
