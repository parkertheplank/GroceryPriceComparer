const puppeteer = require('puppeteer');

async function printHTML(url) {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        console.log(`Navigating to ${url}...`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        
        // Grab the HTML body
        const html = await page.content();
        await browser.close();
        return html;
    } catch (error) {
        console.error(`Error fetching HTML from ${url}:`, error);
        return null;
    }
}

const stores = {
    'Sprouts': 'https://shop.sprouts.com/landing?product_id=25446&region_id=2887106004',
    'Safeway': 'https://www.safeway.com/shop/product-details.111010341.html',
    'Walmart': 'https://www.walmart.com/ip/Bear-Naked-Vanilla-Almond-Crisp-Granola-Cereal-Mega-Pack-16-5-oz-Bag/961171366'
};

(async () => {
    for (const [store, url] of Object.entries(stores)) {
        try {
            console.log(`Fetching HTML for ${store}...`);
            const html = await printHTML(url);
            console.log(`${store} HTML:`, html);
        } catch (error) {
            console.error(`${store} failed completely:`, error);
        }
    }
})();
