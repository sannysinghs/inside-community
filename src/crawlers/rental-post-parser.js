const axios = require('axios');
const cheerio = require('cheerio');
const { urls } = require('./urls')

async function parseRentalListing(res) {
  const $ = cheerio.load(res);
  const promises = [];

  $('.post_box').each(async (index, element) => {
    const headDiv = $(element).find('.post_box_head')
    const link = urls.domain + $(headDiv).find('a').attr('href') || ""
    const postID = link.slice(link.indexOf("i=") + 2)

    promises.push(parseRentalDetail(postID, link))
  });

  const rentals = await Promise.all(promises)
  return rentals.filter(rental => rental !== null)
}

async function parseRentalDetail(postID, link) {
  const promise = axios.get(`${urls.detail}?i=${postID}`)
    .then(res => {
      $ = cheerio.load(res.data)
      const detail = {}
      detail['title'] = $('.new-view-title01').text() || ""

      const rText = (tag) => $(tag).text().trim()
      $('.new-view-table tr').each(async (_, row) => {
        const [rKey, rValue] = $(row).children()

        switch ($(rKey).text().trim()) {
          case 'Nearest MRT/LRT:':
            detail['mrt'] = rText(rValue)
            break;
          case 'MRT/LRT Line:':
            detail['mrt_line'] = rText(rValue)
            break;
          case 'Price:':
            detail['price'] = rText(rValue)
            break;
          case 'For gender:':
            detail['gender'] = rText(rValue)
            break;
          case 'Cooking allowed:':
            detail['cooking'] = rText(rValue)
            break;
          case 'Available from:':
            detail['available_from'] = rText(rValue)
            break;
          case 'Contact no.:':
            detail['contact_no'] = rText(rValue)
            break;
          case 'Email:':
            detail['email'] = rText(rValue)
            break;
          case 'Location map:':
            let postalCode = $(rValue).find('a').attr('href') || ""
            detail['postal_code'] = postalCode.slice(postalCode.indexOf("=") + 1) || ""
            break;
          case 'Description:':
            detail['description'] = rText(rValue)
            break;

          default:
            break;
        }
      })

      detail ['postID'] = postID 
      detail ['url'] = link
      
      return detail

    }).catch(error => {
      console.log(error)
      return null
    })

  return promise
}

module.exports = { parseRentalListing }