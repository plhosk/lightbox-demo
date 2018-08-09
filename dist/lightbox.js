const fetchImageList = async function() {
  const query = 'puppies'
  const queryString = `https://api.unsplash.com/search/photos?query=${query}&page=1&per_page=200`
  
  const response = await fetch(queryString, {
    method: 'GET',
    headers: {
      'Authorization': 'Client-ID 1ede7d21e12dcd4fe1216d67c394365e46bbc4b00fcb2a65aa92639a75e337c4',
    },
  })
  const json = await response.json()
  return json
}

const setImage = async function(imageDomNode, captionDomNode, imageList, index) {
  if (imageList.results && Array.isArray(imageList.results) && imageList.results.length > index) {
    const image = imageList.results[index]
    console.log(image)
    const tags = image.tags.map(tag => tag.title).join(' ')
    imageDomNode.innerHTML = `
      <img id="lightbox-image-img" src="${image.urls.regular || image.urls.full}" alt="${tags}" />
    `
    captionDomNode.innerHTML = `
      <span>${tags}</span>
    `
  }
}

document.addEventListener("DOMContentLoaded", async function() {
  const imageList = await fetchImageList()

  let index = 0
  const lightboxImage = document.getElementById('lightbox-image')
  const lightboxCaption = document.getElementById('lightbox-caption')
  setImage(lightboxImage, lightboxCaption, imageList, index)

  const navLeft = document.getElementById('lightbox-nav-left')
  const navRight = document.getElementById('lightbox-nav-right')

  navLeft.addEventListener('click', function (event) {
    if (index > 0) {
      index -= 1
      setImage(lightboxImage, lightboxCaption, imageList, index)
    }
  })

  navRight.addEventListener('click', function (event) {
    if (index < 200) {
      index += 1
      setImage(lightboxImage, lightboxCaption, imageList, index)
    }
  })
})
