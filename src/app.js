const config = require('config');
const exampleCrawler = require('./crawlers/exampleCrawler');

async function main() {
  try {
    console.log('Starting job crawler...');
    const jobs = await exampleCrawler.crawl(config.get('exampleCompany.url'));

    console.log('Crawled jobs:', jobs);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
