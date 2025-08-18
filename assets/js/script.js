const body = document.querySelector('body')
const modeBtn = document.querySelector('.header-modeBtn')
const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MTc5ODMxYTg1YzJmZTE3ZGQ2YjE4ZmQ4OTM2YzBlOCIsIm5iZiI6MTc1NTEwMjc5NS4zOTY5OTk4LCJzdWIiOiI2ODljYmU0YmNiZWE2NjUwN2E4ZGI3MDQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.KFrUmZRLzLe5mfNm5sIhtJ1oIqmzkE1anXCx1JMBAM8'
const clmMainSlider = document.querySelector('.sec-slide_list')
const clmTrending = document.querySelector('.trending-all')
const clmMovies = document.querySelector('.popular-movies')
const clmTvShows = document.querySelector('.popular-tvshows')
const clmUpcomingMovies = document.querySelector('.upcoming-movies')

// switch mode
modeBtn.addEventListener('click', function(){
  body.classList.toggle('mode-light')
})

// load data
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${apiKey}`
  }
}

// clmMainSlider (Now Playing)
const getPlayingMovies = async () => {
  try {
    const res = await fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', options)
    const data = await res.json()
    return data.results
  } catch (err) {
    console.error(err)
  }
}
const slidePrevBtn = document.querySelector('.btn-prev')
const slideNextBtn = document.querySelector('.btn-next')
const slideNav = document.querySelector('.sec-slide_nav')

let currentIndex = 0;
let slideCount = 0;
let autoplayTimer;
const slideDuration = 3600;

function buildPlayingMovies(movies){
  clmMainSlider.innerHTML = ''
  slideNav.innerHTML = ''

  movies.forEach((movie, index) => {
    const movieItem = document.createElement('div')
    movieItem.classList.add('sec-slide_item', 'modal-item')
    movieItem.setAttribute('data-id', movie.id)
    movieItem.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w1920${movie.backdrop_path}" alt="${movie.title}" class="sec-slide_thumb">
      <div class="sec-slide_txt">
        <h2 class="sec-slide_ttl">${movie.title}</h2>
        <p class="sec-slide_desc">${movie.overview}</p>
      </div>
    `
    clmMainSlider.appendChild(movieItem)

    const dot = document.createElement('li')
    if(index === 0){
      dot.classList.add('active')
    } 
    dot.addEventListener('click', () => {
      goToSlide(index)
      restartAutoplay()
    })
    slideNav.appendChild(dot)
  })

  slideCount = movies.length
  currentIndex = 0
  initSlider()
}

function initSlider(){
  clmMainSlider.style.width = `${slideCount * 100}%`
  updateSlide()

  slidePrevBtn.addEventListener('click', () => {
    prevSlide()
    restartAutoplay()
  })
  slideNextBtn.addEventListener('click', () => {
    nextSlide()
    restartAutoplay()
  })
  startAutoplay()
}

function updateSlide() {
  clmMainSlider.style.transform = `translateX(-${currentIndex * (100 / slideCount)}%)`
  const dots = slideNav.querySelectorAll('li')
  dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex))
}
function nextSlide() {
  currentIndex = (currentIndex + 1) % slideCount
  updateSlide()
}
function prevSlide() {
  currentIndex = (currentIndex - 1 + slideCount) % slideCount
  updateSlide()
}
function goToSlide(index) {
  currentIndex = index
  updateSlide()
}

function startAutoplay() {
  autoplayTimer = setInterval(nextSlide, slideDuration)
}
function stopAutoplay() {
  clearInterval(autoplayTimer)
}
function restartAutoplay() {
  stopAutoplay()
  startAutoplay()
}


// other movie tvshows lists
const fetchData = async (url) => {
  try {
    const res = await fetch(url, options)
    const data = await res.json()
    return data.results
  } catch (err) {
    console.error(err)
  }
}
const buildList = (container, items) => {
  container.innerHTML = ''
  const isTvList = container.classList.contains('popular-tvshows')

  items.forEach(item => {
    const li = document.createElement('li')
    if(item.media_type === 'tv' || isTvList){
      li.classList.add('sec-clm_item', 'modal-tv-item')
    } else {
      li.classList.add('sec-clm_item', 'modal-item')
    }
    li.setAttribute('data-id', item.id)
    const title = item.name || item.title || 'No title'
    const imgPath = item.poster_path || item.backdrop_path
    const rating = item.vote_average ?? '-'
    li.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${imgPath}" alt="${title}" class="sec-clm_thumb">
      <h4 class="sec-clm_ttl">${title}</h4>
      <p class="sec-clm_time">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
          <path d="M341.5 45.1C337.4 37.1 329.1 32 320.1 32C311.1 32 302.8 37.1 298.7 45.1L225.1 189.3L65.2 214.7C56.3 216.1 48.9 222.4 46.1 231C43.3 239.6 45.6 249 51.9 255.4L166.3 369.9L141.1 529.8C139.7 538.7 143.4 547.7 150.7 553C158 558.3 167.6 559.1 175.7 555L320.1 481.6L464.4 555C472.4 559.1 482.1 558.3 489.4 553C496.7 547.7 500.4 538.8 499 529.8L473.7 369.9L588.1 255.4C594.5 249 596.7 239.6 593.9 231C591.1 222.4 583.8 216.1 574.8 214.7L415 189.3L341.5 45.1z"/>
        </svg>${rating}
      </p>
    `
    container.appendChild(li)
  })
}
const endpoints = {
  trending: 'https://api.themoviedb.org/3/trending/all/day?language=en-US',
  popularMovies: 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
  popularTvShows: 'https://api.themoviedb.org/3/tv/popular?language=en-US&page=1',
  upcomingMovies: 'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1'
}

document.addEventListener('DOMContentLoaded', async () => {
  const playingMovies = await getPlayingMovies()
  buildPlayingMovies(playingMovies)

  const trending = await fetchData(endpoints.trending)
  buildList(clmTrending, trending)

  const movies = await fetchData(endpoints.popularMovies)
  buildList(clmMovies, movies)

  const tvShows = await fetchData(endpoints.popularTvShows)
  buildList(clmTvShows, tvShows)

  const upcomingMovies = await fetchData(endpoints.upcomingMovies)
  buildList(clmUpcomingMovies, upcomingMovies)
})


// search
const searchForm = document.querySelector('.header-search')
const searchInput = document.querySelector('.search-input')
const searchSubmit = document.querySelector('.search-submit')
const secMain = document.querySelector('main')
searchForm.addEventListener('submit', function(e){
  e.preventDefault()
  const query = searchInput.value.trim()
  if(query){
    searchMovies(query)
  }
})
const searchMovies = async (query) => {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&language=en-US`, options)
    const data = await res.json()
    if(data.results.length > 0){
      buildSearchResults(data.results)
    } else {
      alert('No results found.')
    }
  } catch (err) {
    console.error(err)
  }
}
const buildSearchResults = (results) => {
  secMain.innerHTML = `
    <section class="sec-clm">
      <h3 class="sec-clm_category">Results for</h3>
      <ul class="sec-clm_list search-results"></ul>
    </section>
  `
  results.forEach((item) => {
    const itemType = item.media_type === 'tv' ? 'modal-tv-item' : 'modal-item'
    const li = document.createElement('li')
    li.classList.add('sec-clm_item', itemType)
    li.setAttribute('data-id', item.id)
    const title = item.name || item.title || 'No title'
    const imgPath = item.poster_path || item.backdrop_path
    const noimgPath = '/assets/img/noimage.webp'
    const imgSrc = imgPath ? `https://image.tmdb.org/t/p/w500${imgPath}` : noimgPath
    li.innerHTML = `
      <img src="${imgSrc}" alt="${title}" class="sec-clm_thumb">
      <h4 class="sec-clm_ttl">${title}</h4>
      <p class="sec-clm_time">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
          <path d="M341.5 45.1C337.4 37.1 329.1 32 320.1 32C311.1 32 302.8 37.1 298.7 45.1L225.1 189.3L65.2 214.7C56.3 216.1 48.9 222.4 46.1 231C43.3 239.6 45.6 249 51.9 255.4L166.3 369.9L141.1 529.8C139.7 538.7 143.4 547.7 150.7 553C158 558.3 167.6 559.1 175.7 555L320.1 481.6L464.4 555C472.4 559.1 482.1 558.3 489.4 553C496.7 547.7 500.4 538.8 499 529.8L473.7 369.9L588.1 255.4C594.5 249 596.7 239.6 593.9 231C591.1 222.4 583.8 216.1 574.8 214.7L415 189.3L341.5 45.1z"/>
        </svg>${item.vote_average ?? '-'}
      </p>
    `
    secMain.querySelector('.search-results').appendChild(li)
  })
}


// modal
const modal = document.querySelector('.modal')
const modalContent = document.querySelector('.modal-content')

document.addEventListener('click', function(e){
  console.log(e.target)
  const item = e.target.closest('.modal-item, .modal-tv-item')
  if(item){
    const itemId = item.dataset.id
    const type = item.classList.contains('modal-tv-item') ? 'tv' : 'movie'
    modal.classList.add('open')
    body.style.overflow = 'hidden'
    modalContent.innerHTML = ''

    getDetails(type,itemId).then(data => {
      buildModalContent(data)
    })
  }
  const modalBg = document.querySelector('.modal-bg')
  if(e.target === modalBg){
    modal.classList.remove('open')
    body.style.overflow = ''
  }
})

const getDetails = async (type, itemId) => {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/${type}/${itemId}?language=en-US`, options)
    const data = await res.json()
    return data
  } catch (err) {
    console.error(err)
  }
}

function buildModalContent(data) {
  const title = data.name || data.title || 'No title'
  const imgPath = data.backdrop_path || data.poster_path
  const noimgPath = '/assets/img/noimage.webp'
  const imgSrc = imgPath ? `https://image.tmdb.org/t/p/w1280${imgPath}` : noimgPath

  modalContent.innerHTML = `
    <img src="${imgSrc}" class="modal-thumb" alt="${title}">
    <div class="modal-box">
      <p class="modal-ttl">${title}</p>
      <p class="modal-time">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
          <path d="M341.5 45.1C337.4 37.1 329.1 32 320.1 32C311.1 32 302.8 37.1 298.7 45.1L225.1 189.3L65.2 214.7C56.3 216.1 48.9 222.4 46.1 231C43.3 239.6 45.6 249 51.9 255.4L166.3 369.9L141.1 529.8C139.7 538.7 143.4 547.7 150.7 553C158 558.3 167.6 559.1 175.7 555L320.1 481.6L464.4 555C472.4 559.1 482.1 558.3 489.4 553C496.7 547.7 500.4 538.8 499 529.8L473.7 369.9L588.1 255.4C594.5 249 596.7 239.6 593.9 231C591.1 222.4 583.8 216.1 574.8 214.7L415 189.3L341.5 45.1z"/>
        </svg>${data.vote_average ?? '-'}
      </p>
      <div class="modal-btn"><a href="#">Play</a></div>
      <p class="modal-desc">${data.overview}</p>
    </div>
  `
}