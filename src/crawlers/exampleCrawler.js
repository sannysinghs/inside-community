const axios = require('axios');
const cheerio = require('cheerio');

const companyName = "Reddit"
async function crawl(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const jobs = [];

    $('.job').each((index, element) => {
      jobs.push({
        title: $(element).find('.job-title').text().trim(),
        location: $(element).find('.job-location').text().trim(),
        url: $(element).find('a').attr('href'),
      });
    });

    return jobs;
  } catch (error) {
    console.error(`Error crawling ${url}:`, error);
    return [];
  }
}

module.exports = { crawl };