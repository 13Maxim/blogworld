import {Post, VideoPost, AudioPost, ImagePost, TextPost} from './posts.js'

const API_KEY = '7090f0a8db14161515d84cb5303a2c9e'
const IMG_URL = 'https://image.tmdb.org/t/p/w533_and_h300_bestv2'
const FILM_URL = 'https://www.themoviedb.org/movie/'

const initReviewDetails = {
  authorAvatar: '../src/assets/img/user-1.png',
  authorName: 'Neil Richards',
  date: new Date('2019-11-09'),
  rating: 8,
  review: `
    The thing you’re doing now, reading prose on a screen, is going out of fashion.
    The defining narrative of our online moment concerns the decline of text,
    and the exploding reach and power of audio and video …
  `
}

let videoPost = null
let audioPost = null
let imagePost = null
let textPost = null

const $mainSection = document.querySelector('#main')
const $postsContainer = $mainSection.querySelector('#posts-container')

const getUrl = (type, page) => {
  return `https://api.themoviedb.org/3/movie/${type}?api_key=${API_KEY}&language=en-US&page=${page}`
}

const generatePosts = url => {
  $mainSection.classList.add('main-loading')
  Post.allPosts = []
  const options = {
    video: {},
    audio: {},
    image: {},
    text: {},
  }

  fetch(url)
    .then(res => res.json())
    .then(async data => {
      const filmsList = data.results

      for (let i = 0; i < 4; i++) {
        const currentProp = Object.keys(options)[i]

        saveFilmDetails(options[currentProp], filmsList[i])
        await getReviewData(getUrl(`${filmsList[i].id}/reviews`, 1), options[currentProp])
      }

      videoPost = new VideoPost(options.video)
      audioPost = new AudioPost(options.audio)
      imagePost = new ImagePost(options.image)
      textPost = new TextPost(options.text)

      Post.fillPage($postsContainer)
    })
    .finally(() => $mainSection.classList.remove('main-loading'))
    .catch(er => console.log(er))
}

async function getReviewData(url, saveObj) {
  await fetch(url)
    .then(res => res.json())
    .then(review => {
      saveReviewDetails(saveObj, review.results[0])
    })
}

function saveFilmDetails(options, film) {
  options.filmDetails = {}

  options.filmDetails.title = film.title
  options.filmDetails.poster = IMG_URL + film.poster_path
  options.filmDetails.filmUrl = FILM_URL + film.id
}

function saveReviewDetails(options, review) {
  options.reviewDetails = {}

  if (review) {
    if (review.author_details.avatar_path) {
      if (review.author_details.avatar_path.slice(1, 6) === 'https') {
        options.reviewDetails.authorAvatar = review.author_details.avatar_path.slice(1)
      } else {
        options.reviewDetails.authorAvatar = IMG_URL + review.author_details.avatar_path
      }
    } else {
      options.reviewDetails.authorAvatar = '../assets/img/user-1.png'
    }
    options.reviewDetails.authorName = review.author
    options.reviewDetails.date = new Date(review.created_at)
    options.reviewDetails.rating = review.author_details.rating
    options.reviewDetails.review = review.content
    options.reviewDetails.reviewLink = review.url
  } else {
    options.reviewDetails = initReviewDetails
  }
}

export {generatePosts, getUrl}