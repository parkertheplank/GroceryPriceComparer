const axios = require('axios');
const cheerio = require('cheerio');

const stores = {
    'Walmart': { url: 'https://www.walmart.com/ip/Bear-Naked-Vanilla-Almond-Crisp-Granola-Cereal-Mega-Pack-16-5-oz-Bag/961171366', selector: '.price-characteristic' },
    'Safeway': { url: 'https://www.safeway.com/shop/product-details.111010341.html', selector: '.product-price' },
    'Sprouts': { url: 'https://shop.sprouts.com/landing?product_id=25446&region_id=2887106004', selector: '.current-price' }
};

async function fetchPrice(url, cssSelector) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const price = $(cssSelector).text();
        return price.trim();
    } catch (error) {
        console.error(`Error fetching price from ${url}:`, error);
        return null;
    }
}

(async () => {
    for (const [store, info] of Object.entries(stores)) {
        const price = await fetchPrice(info.url, info.selector);
        console.log(`${store}: ${price}`);
    }
})();

