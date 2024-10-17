const axios = require('axios');
const cheerio = require('cheerio');

async function crawl(url) {
  try {
    let page = 0
    let results = []

    do {
      const response = await axios.get(`${url}?page=${page}`);
      results.push(...(await parseJobs(response)))
      page++
    } while (page < 3)

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
    const link = $(head).find('a').attr('href') || ""
    const title = $(head).find('a').attr('title') || ""

    const body = $(element).find('.post_box_body')
    const desc = $(body).text() || ""
    const img = $(body).find('img').attr('src') || "/default.png"

    jobs.push({
      title: title,
      url: link,
      description: desc,
      image: img
    });
  });

  return jobs

}

module.exports = { crawl };