const config = require('config');
const exampleCrawler = require('./crawlers/article_crawlers');

async function main() {
  try {
    await exampleCrawler.crawl(config.get('shwerooms.url'), 1);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
