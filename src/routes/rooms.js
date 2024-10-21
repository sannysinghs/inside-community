const express = require('express')
const config = require('config')
const router = express.Router()
const cralwer = require('../crawlers/article_crawlers')

router.post('/crawl', async (req, res) => {
    try {
        const results = await cralwer.crawl(config.get('shwerooms.url'))
        res.json({
            message: "Crawling completed",
            results
        })
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).send('Error crawling the URL')
    }
})

module.exports = router