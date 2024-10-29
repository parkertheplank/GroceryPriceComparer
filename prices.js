const puppeteer = require('puppeteer');

async function searchForPrice(url) {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });

        // Look for elements containing '$' followed by numbers
        await page.waitForTimeout(5000); // Wait for the content to load
        const price = await page.evaluate(() => {
            const elements = document.querySelectorAll('*');
            for (let element of elements) {
                if (element.textContent && /\$\d+/.test(element.textContent)) {
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
        try {
            const price = await searchForPrice(url);
            console.log(`${store}: ${price}`);
        } catch (error) {
            console.error(`${store} failed completely:`, error);
        }
    }
})();
