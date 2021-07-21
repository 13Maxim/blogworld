import eventMediator from '../plugins/mediator.js'

const API_KEY = '7090f0a8db14161515d84cb5303a2c9e'
const authorsContent = {}

const $mainSection = document.querySelector('#main')
const $postText = document.querySelector('#post-text')

const $mainAuthorsList = document.querySelector('#authors-list-main')
const $mainPostsList = document.querySelector('#post-names-main')

const $asideAuthorsList = document.querySelector('#authors-list-aside')
const $asidePostsList = document.createElement('ul')
$asidePostsList.classList.add('post-names-list')

const getUrl = (type) => {
  return `https://api.themoviedb.org/3/movie/${type}?api_key=${API_KEY}&language=en-US&page=1`
}

const getAuthorsContent = async () => {
  $mainSection.classList.add('main-loading')

  await fetch(getUrl('popular'))
    .then(res => res.json())
    .then(async data => {
      const films = data.results

      for (const film of films) {
        await fetch(getUrl(`${film.id}/reviews`))
          .then(res => res.json())
          .then(data => {
            const reviews = data.results

            if (reviews.length) {
              for (const review of reviews) {
                const author = review.author.toLowerCase().replace(/[^0-9a-z-A-Z ]/g, "")
                authorsContent[author] = authorsContent[author] || []
                authorsContent[author].push({
                  name: film.title,
                  content: review.content
                })
              }
            }
          })
          .catch(er => console.log(er))
      }
    })
    .catch(er => console.log(er))
    .finally(() => $mainSection.classList.remove('main-loading'))
}

const generateAuthorsLists = async () => {
  await getAuthorsContent()

  createMainAuthorsList()
  subscribeMainPostsList()

  createAsideAuthorsList()
  subscribeAsidePostsList()

  subscribePostText()
}

function createMainAuthorsList() {
  fillAuthors($mainAuthorsList)
  
  const highlightAuthorMain = authorName => {
    highlightAuthor(authorName, $mainAuthorsList)
  }

  eventMediator.subscribe('authorSelected', highlightAuthorMain)
}

function subscribeMainPostsList() {
  const generatePostNamesMain = authorName => {
    $mainPostsList.textContent = 'Reviews:'
    fillPosts(authorName, $mainPostsList)
  }

  const highlightPostMain = ({ post, allPosts }) => {
    highlightPost(post, allPosts, $mainPostsList)
  }

  eventMediator.subscribe('postSelected', highlightPostMain)
  eventMediator.subscribe('authorSelected', generatePostNamesMain)
}

function createAsideAuthorsList() {
  fillAuthors($asideAuthorsList)

  const highlightAuthorAside = authorName => {
    highlightAuthor(authorName, $asideAuthorsList)
  }

  eventMediator.subscribe('authorSelected', highlightAuthorAside)
}

function subscribeAsidePostsList() {
  const generatePostNamesAside = authorName => {
    const $allListItems = Array.from($asideAuthorsList.children).filter(el => el.tagName === 'LI')
    const $selectedListItem = $allListItems[Object.keys(authorsContent).indexOf(authorName)]
    $asidePostsList.innerHTML = ''
    fillPosts(authorName, $asidePostsList)

    $selectedListItem.insertAdjacentElement('afterend', $asidePostsList)
  }

  const highlightPostAside = ({ post, allPosts }) => {
    highlightPost(post, allPosts, $asidePostsList)
  }

  eventMediator.subscribe('postSelected', highlightPostAside)
  eventMediator.subscribe('authorSelected', generatePostNamesAside)
}

function subscribePostText() {
  const showPostText = ({ post }) => {
    $postText.textContent = post.content
  }

  eventMediator.subscribe('postSelected', showPostText)
}

function fillAuthors($list) {
  Object.keys(authorsContent).forEach(authorName => {
    const $listItem = document.createElement('li')
    $listItem.classList.add('authors-list__list-item')
    $listItem.textContent = authorName
    $listItem.addEventListener('click', () => eventMediator.trigger('authorSelected', authorName))
    $list.append($listItem)
  })
}

function fillPosts(authorName, $list) {
  authorsContent[authorName].forEach(post => {
    const $listItem = document.createElement('li')
    $listItem.classList.add('post-names-list__list-item')
    $listItem.textContent = post.name

    $listItem.addEventListener('click', () => {
      eventMediator.trigger('postSelected', { post, allPosts: authorsContent[authorName] })
    })
    $list.append($listItem)
  })
}

function highlightAuthor(authorName, $list) {
  const $allListItems = Array.from($list.children).filter(el => el.tagName === 'LI')
  const $selectedListItem = $allListItems[Object.keys(authorsContent).indexOf(authorName)]

  $allListItems.forEach($listItem => {
    $listItem.classList.remove('authors-list__list-item--active')
  })
  $selectedListItem.classList.add('authors-list__list-item--active')
}

function highlightPost(post, allPosts, $list) {
  const $selectedListItem = $list.children[allPosts.indexOf(post)]

  Array.from($list.children).forEach($listItem => {
    $listItem.classList.remove('post-names-list__list-item--active')
  })
  $selectedListItem.classList.add('post-names-list__list-item--active')
}

export default generateAuthorsLists