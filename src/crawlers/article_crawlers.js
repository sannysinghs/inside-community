require('dotenv').config()
const axios = require('axios');
const { connect } = require('./db_connection')
const { urls } = require('./urls')
const { parseRentalListing } = require('./rental-post-parser');


const isDebug = () => process.env.IS_DEBUG === 'true'
const MAX_PAGE_COUNT = isDebug() ? 1 : 10;

async function crawl(url) {
  try {
    const db = await connect()
    const roomsCollection = db.collection('rooms')

    let page = 1
    let line = 1
    let station = 0 // all stations
    let results = []

    do {
      const search_url = `${urls.search}?page=${page}&line=${line}&station=${station}`
      const listingRes = await axios.get(search_url);
      const rentalCollections = await parseRentalListing(listingRes.data)
      results.push(...rentalCollections)
      page++
    } while (page < MAX_PAGE_COUNT)

    if (!isDebug() && results.length > 0) {
      await roomsCollection.insertMany(results)
    }

    if (isDebug())
      console.log(results)
      
    return results;
  } catch (error) {
    console.error(`Error crawling ${url} :`, error);
    return [];
  }
}

module.exports = { crawl };