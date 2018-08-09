const QUERY = 'puppies'
const MAX_INDEX = 29

const fetchImageList = async function() {
  const queryString = `https://api.unsplash.com/search/photos?query=${QUERY}&page=1&per_page=${MAX_INDEX + 1}`
  
  const response = await fetch(queryString, {
    method: 'GET',
    headers: {
      'Authorization': 'Client-ID 1ede7d21e12dcd4fe1216d67c394365e46bbc4b00fcb2a65aa92639a75e337c4',
    },
  })
  const json = await response.json()
  return json
}

const setImage = async function(imageDomNode, captionDomNode, imageList, index, w, h) {
  if (imageList.results && Array.isArray(imageList.results) && imageList.results.length > index) {
    const image = imageList.results[index]
    const tags = image.tags.map(tag => tag.title).join(' ')
    imageDomNode.innerHTML = `
      <img id="lightbox-image-img" src="${image.urls.full || image.urls.regular}" alt="${tags}" />
    `
    document.getElementById('lightbox-image-img').style.maxWidth = `${w - 108}px`
    document.getElementById('lightbox-image-img').style.maxHeight = `${h - 80}px`
    captionDomNode.innerHTML = `
      <span>${tags}</span>
    `
    // preload next 2 images
    if (document.images && index < (MAX_INDEX - 1)) {
      const preloadImg1 = new Image()
      preloadImg1.src = imageList.results[index + 1].urls.full || imageList.results[index + 1].urls.regular
      const preloadImg2 = new Image()
      preloadImg2.src = imageList.results[index + 2].urls.full || imageList.results[index + 2].urls.regular
    }
  }
}

document.addEventListener("DOMContentLoaded", async function() {
  let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
  let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

  const imageList = await fetchImageList()

  let index = 0
  const lightboxImage = document.getElementById('lightbox-image')
  const lightboxCaption = document.getElementById('lightbox-caption')
  setImage(lightboxImage, lightboxCaption, imageList, index, w, h)

  const navLeft = document.getElementById('lightbox-nav-left')
  const navRight = document.getElementById('lightbox-nav-right')

  const goBack = () => {
    if (index > 0) {
      index -= 1
      setImage(lightboxImage, lightboxCaption, imageList, index, w, h)
    }
  }

  const goForward = () => {
    if (index < MAX_INDEX) {
      index += 1
      setImage(lightboxImage, lightboxCaption, imageList, index, w, h)
    }
  }

  navLeft.addEventListener('click', goBack)
  window.addEventListener('keydown', (e) => {
    if (e.keyCode === 37) {
      goBack()
    }
  })

  navRight.addEventListener('click', goForward)
  window.addEventListener('keydown', (e) => {
    if (e.keyCode === 39) {
      goForward()
    }
  })

  window.addEventListener('resize', () => {
    w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
    h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    setImage(lightboxImage, lightboxCaption, imageList, index, w, h)
  })
})
