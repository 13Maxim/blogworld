import {Post} from './posts.js'

const $searchForm = document.querySelector('#search-form')
const $searchInput = $searchForm.querySelector('#search__input')
const $searchList = $searchForm.querySelector('#search__list')
const $searchMessage = $searchForm.querySelector('#search-message')
const $postsContainer = document.querySelector('#posts-container')

const getResultsByTitle = () => {
  return Post.allPosts.filter(el => el.reviewDetails.authorName === $searchInput.value)
}

const getResultsByAuthor = () => {
  return Post.allPosts.filter(el => el.filmDetails.title === $searchInput.value)
}

function searchPosts(event) {
  event.preventDefault()

  const searchValue = $searchInput.value
  const searchResults = 
    getResultsByTitle().length ? getResultsByTitle()
    : getResultsByAuthor().length ? getResultsByAuthor()
    : null

  $searchInput.value = ''
  if (!localStorage.getItem('userSearches')) {
    localStorage.setItem('userSearches', JSON.stringify([]))
  }

  if (searchResults) {
    const userSearches = JSON.parse(localStorage.getItem('userSearches'))
    
    if (!userSearches.includes(searchValue)) {
      userSearches.push(searchValue)
      localStorage.setItem('userSearches', JSON.stringify(userSearches))
      $searchList.insertAdjacentHTML('beforeend', `<option value="${searchValue}"></option>`)
    }
    Post.searchedPosts = searchResults

    Post.fillPageBySearch($postsContainer)
  } else {
    getSearchMessage(searchValue)
    Post.fillPage($postsContainer)
  }
}

function getSearchMessage(searchValue) {
  $searchMessage.textContent = `Ooops... There is no results with ${searchValue} :(`
  $searchMessage.hidden = false
  const animate = $searchMessage.animate([
    { transform: 'translateY(0)' },
    { transform: 'translateY(160px)' },
    { transform: 'translateY(140px)' },
    { transform: 'translateY(160px)' },
    { transform: 'translateY(150px)' },
    { transform: 'translateY(160px)' },
  ],
    { duration: 1000 }
  )

  animate.onfinish = () => {
    $searchMessage.style.transform = 'translateY(160px)'

    setTimeout(() => {
      const animate = $searchMessage.animate([
        { opacity: 1 },
        { opacity: 0 }
      ],
        { duration: 300 }
      )
      animate.onfinish = () => $searchMessage.hidden = true
    }, 3000)
  }
}

function fillSearchFilters() {
  const userSearches = JSON.parse(localStorage.getItem('userSearches'))
  if (userSearches) {
    userSearches.forEach(el => {
      $searchList.insertAdjacentHTML('beforeend', `<option value="${el}"></option>`)
    })
  }
}

function validate(title) {
  const regExp = /^[A-Z](?=.*[a-z])[\w\-\.?,!:\s]{5,59}$/g
  return regExp.test(title)
}

export {searchPosts, fillSearchFilters}