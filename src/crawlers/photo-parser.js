async function getPhotos(id) {
    const response = await axios.get(`${photo_url}&i=${id}`)
    const $ = cheerio.load(response.data)
  
    $('.view_wrapper_body').find('img.image_wrapper').each((index, element) => {
      photos.push($(element).attr('src'))
    })
  
    return photos
  }

  module.exports = { getPhotos}