import {searchPosts, fillSearchFilters} from './search.js'
import {generatePosts, getUrl} from './postsCreating.js'
import modalWindow from '../plugins/modal.js'
import $ from 'jquery'
import '../../assets/scss/blog.scss'

$.fn.modalWindow = modalWindow
let currentPage = 1

const $mainSection = document.querySelector('#main')
const $readMoreBtn = $mainSection.querySelector('#post-section__btn-read-more')
const $searchForm = $mainSection.querySelector('#search-form')

$(document).modalWindow({
  cancelBtn: true,
  textContent: 'Subscribe to this blog and get new updates first!',
  type: 'success',
  trigger: 'ready',
  delay: 10000,
  onConfirm: () => console.log('subscription confirmed'),
  onReject: () => console.log('subscription reejected')
})
window.addEventListener('load', fillSearchFilters)
$searchForm.addEventListener('submit', searchPosts)
$readMoreBtn.addEventListener('click', () => getNextPage())

function getNextPage() {
  currentPage++
  generatePosts(getUrl('popular', currentPage))
}

generatePosts(getUrl('popular', currentPage))
