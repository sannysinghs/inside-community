const config = require('config');
const exampleCrawler = require('./crawlers/article_crawlers');

async function main() {
  try {
    
    console.log('Starting job crawler...');
    const jobs = await exampleCrawler.crawl(config.get('shwerooms.url'), 1);
    
    console.log('Crawled jobs:', jobs);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
