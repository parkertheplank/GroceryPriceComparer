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
        url: 'https://shop.sprouts.com/store/sprouts/products/25446-bear-naked-fit-granola-cereal-vegan-vanilla-almond-12-oz', 
        selector: '.e-0'
    },
    'Walmart': { 
        url: 'https://www.walmart.com/ip/Bear-Naked-Fit-Vanilla-Almond-Crisp-Granola-Cereal-12-oz-Bag/12444772?wmlspartner=wlpa&selectedSellerId=101620557&gclsrc=aw.ds&&adid=2222222222712444772_101620557_171709135088_21568604359&wl0=&wl1=g&wl2=c&wl3=709531972444&wl4=pla-2335753979702&wl5=9221267&wl6=&wl7=&wl8=&wl9=pla&wl10=5340306903&wl11=online&wl12=12444772_101620557&veh=sem&gad_source=1&gclid=Cj0KCQjwj4K5BhDYARIsAD1Ly2p-tByVDaTYnk7jrD-eu8dAOFxev3nRgw87zx7LoJeo4b3hpx9PUzAaAgH-EALw_wcB', 
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
