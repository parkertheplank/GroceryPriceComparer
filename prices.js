const axios = require('axios');
const cheerio = require('cheerio');

async function fetchPrice(url, cssSelector) {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive'
            }
        });
        const $ = cheerio.load(data);
        const price = $(cssSelector).text();
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

