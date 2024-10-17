const axios = require('axios');
const cheerio = require('cheerio');
const { MongoClient } = require('mongodb')

const uri = "mongodb+srv://tixeonjobs:hu92UdzbZFJXrsM@room-rentals-1.5lxx2.mongodb.net/?retryWrites=true&w=majority&appName=room-rentals-1"
const MAX_PAGE_COUNT = 1
const client = new MongoClient(uri)
async function crawl(url) {
  try {
    await client.connect()
    const db = client.db('room_rentals')
    const rooms_collection = db.collection('rooms')
    let page = 0
    let results = []

    do {
      const response = await axios.get(`${url}?page=${page}`);
      results.push(...(await parseJobs(response)))

      if (results.length > 0) {
        await rooms_collection.insertMany(results.slice(0, 5))
      }
      page++
    } while (page < MAX_PAGE_COUNT)

    return results;
  } catch (error) {
    console.error(`Error crawling ${url} :`, error);
    return [];
  }
}

async function parseJobs(response) {
  const $ = cheerio.load(response.data);
  const jobs = [];

  $('.post_box').each((index, element) => {


    const head = $(element).find('.post_box_head')
    const title = $(head).find('a').attr('title') || ""
    const link = $(head).find('a').attr('href') || ""
    const postID = link.slice(link.indexOf("i=") + 2)

    const body = $(element).find('.post_box_body')
    const desc = $(body).text() || ""
    const img = $(body).find('img').attr('src') || "/default.png"

    jobs.push({
      postID: postID,
      title: title,
      url: link,
      description: desc,
      image: img
    });
  });

  return jobs

}

module.exports = { crawl };