//first skeleton

const cheerio = require("cheerio");
const axios = require("axios");

const url = "https://www.walmart.com/ip/Great-Value-Long-Grain-Enriched-Rice-32-oz/10315394?classType=REGULAR&athbdg=L1200&from=/search";

async function getPrice(){
  try{
    const response = await axios.get(url);
    const $=cheerio.load(response.data);
    const price = $("placeholder").text();

    console.log(genre)
  }
  catch(error){
    console.error(error);
  }
}

getPrice();
