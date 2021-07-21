import $ from 'jquery'

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec'
]

class Post {
  constructor(options) {
    this.reviewDetails = options.reviewDetails
    this.filmDetails = options.filmDetails
    this.halfStarMockup = '<span class="list-item__rate-star list-item__rate-star--half"></span>'
    this.fullStarMockup = '<span class="list-item__rate-star list-item__rate-star--full"></span>'
    this.emptyStarMockup = '<span class="list-item__rate-star list-item__rate-star--empty"></span>'
    this.$postItem = null
    
    Post.allPosts.push(this)
  }

  static bindDeleteBtn($postsContainer) {
    $('.post-content__btn-delete').modalWindow({
      cancelBtn: true,
      textContent: 'Are you sure you want to delete this post?',
      type: 'info',
      trigger: 'click',
      onConfirm() {
        const $currentPostItem = this.closest('.post-item')
        Post.allPosts = Post.allPosts.filter(post => post.$postItem !== $currentPostItem)
        Post.fillPage($postsContainer)
      }
    })
  }

  static fillPage($postsContainer) {
    $postsContainer.innerHTML = ''
    this.allPosts.forEach(post => {
      $postsContainer.insertAdjacentHTML('beforeend', post.postMockup)
      post.$postItem = $postsContainer.querySelector(`.post-item--${post._type}-post`)
      post.bindPostBtns($postsContainer)
      if (post._type === 'video') {
        post.bindPlayBtn($postsContainer)
      }
    })
    this.bindDeleteBtn($postsContainer)
  }

  static fillPageBySearch($postsContainer) {
    $postsContainer.innerHTML = ''
    this.searchedPosts.forEach(post => {
      $postsContainer.insertAdjacentHTML('beforeend', post.postMockup)
      post.$postItem = $postsContainer.querySelector(`.post-item--${post._type}-post`)
    })
  }

  getReadTime() {
    const SIGNS_PER_MINUTE = 1500
    const readTime = Math.ceil(this.reviewDetails.review.length / SIGNS_PER_MINUTE)
    return readTime
  }

  getDate() {
    return `
      ${this.reviewDetails.date.getDate()} 
      ${MONTHS[this.reviewDetails.date.getMonth()]}, 
      ${this.reviewDetails.date.getFullYear()}
    `
  }

  getAuthorRatingStars() {
    const rating = this.reviewDetails.rating / 2
    let rateOutput = ''
    for (let i = 1; i <= Math.floor(rating); i++) {
      rateOutput += this.fullStarMockup
    }

    if (rating !== 5) {
      if (rating + 0.5 >= Math.floor(rating) + 1) {
        rateOutput += this.halfStarMockup

        for (let i = 1; i <= 5 - Math.ceil(rating); i++) {
          rateOutput += this.emptyStarMockup
        }
      } else {
        for (let i = 1; i <= 5 - Math.floor(rating); i++) {
          rateOutput += this.emptyStarMockup
        }
      }
    }

    return rateOutput
  }

  showReadMoreField(event) {
    const $btn = event.target
    const $btnHide = event.target.nextElementSibling
    const $readMoreField = event.target.parentElement.previousElementSibling
    $btnHide.onclick = toggleReadMoreField

    function toggleReadMoreField() {
      $btnHide.hidden = !$btnHide.hidden
      $btn.hidden = !$btn.hidden
      $readMoreField.hidden = !$readMoreField.hidden
    }
    toggleReadMoreField()
  }

  bindPostBtns($postsContainer) {
    const $postItem = $postsContainer.querySelector(`.post-item--${this._type}-post`)
    const $btnReadMore = $postItem.querySelector('.post-content__btn-read-more')
    $btnReadMore.addEventListener('click', this.showReadMoreField)
  }

  get authorDetailsSection() {
    return `
      <div class="post-head">
        <img src="${this.reviewDetails.authorAvatar}" class="post-head__user-img" alt="user photo" />
        <div class="post-info-container">
          <p class="post-head__user-name">${this.reviewDetails.authorName}</p>
          <ul class="post-info">
            <li class="post-info__list-item">${this.getDate()}</li>
            <li class="post-info__list-item"><span
              class="post-info__list-item--dot"></span></li>
            <li class="post-info__list-item">${this.getReadTime()} min read</li>
            <li class="post-info__list-item"><span
              class="post-info__list-item--dot"></span></li>
            <li class="post-info__list-item">
              <span class="list-item__icon list-item__icon--comments"></span>19
            </li>
            <li class="post-info__list-item">
              ${this.getAuthorRatingStars()}
            </li>
          </ul>
        </div>
      </div>
    `
  }

  get postText() {
    let review = null
    if (this.reviewDetails.review.length >= 300) {
      review = this.reviewDetails.review.slice(0, 300) + '...'
    } else {
      review = this.reviewDetails.review
    }
    return `
    <p class="post-content__text">
      ${review}
    </p>
    `
  }

  get textBox() {
    return `
    <div class="post-item__text-box">
      <div class="post-item__post-icon"></div>
      ${this.authorDetailsSection}
      <div class="post-content">
        <h3 class="post-content__title">${this.filmDetails.title}</h3>
        ${this.postText}
          <div class="post-content__readmore-field">
            <div class="post-content__hidden-info" hidden>
              <a class="post-content__readmore-link" 
                href="${this.reviewDetails.reviewLink || this.filmDetails.filmUrl}" 
                target="_blanc"
              >
                ${this.reviewDetails.reviewLink || this.filmDetails.filmUrl}
              </a>
            </div>
            <div class="post-content__btns-container">
              <button class="post-content__btn-read-more btn--secondary">Read more</button>
              <button class="post-content__btn-hide btn--primary" hidden>Hide</button>
              <button class="post-content__btn-delete btn--primary">Delete</button>
            </div>
          </div>
      </div>
    </div>
    `
  }

  get postMockup() {
    return `
      <article class="post-item post-item--${this._type}-post">
        ${this.mediaBox || ''}
        ${this.textBox}
      </article>
    `
  }
}
Post.allPosts = []
Post.searchedPosts = []

class VideoPost extends Post {
  constructor(options) {
    super(options)
    this._type = 'video'
  }

  playVideo() {
    console.log('video was started...')
  }

  bindPlayBtn($postsContainer) {
    const $post = $postsContainer.querySelector(`.post-item--${this._type}-post`)
    const $playBtn = $post.querySelector('.post-item__play-btn')
    $playBtn.addEventListener('click', () => this.playVideo())
  }

  get mediaBox() {
    return `
    <div class="post-item__media-box">
      <video src="#" class="post-item__video"
        poster="${this.filmDetails.poster}">
      </video>
      <button class="post-item__play-btn"></button>
    </div>`
  }
}

class AudioPost extends Post {
  constructor(options) {
    super(options)
    this.audioSrc = '#'
    this._type = 'audio'
  }

  get textBox() {
    return `
    <div class="post-item__text-box">
      <div class="post-item__post-icon"></div>
      ${this.authorDetailsSection}
      <div class="post-content">
      <h3 class="post-content__title">${this.filmDetails.title}</h3>
      <div class="post-content__post-audio-container">
        <audio class="post-content__post-audio" controls></audio>
      </div>
      ${this.reviewSection}
        <div class="post-content__read-more-field">
          <div class="post-content__hidden-info" hidden>
            <a class="hidden-info__link" href="${this.reviewDetails.reviewLink || this.filmDetails.filmUrl}" target="_blanc">
              ${this.reviewDetails.reviewLink || this.filmDetails.filmUrl}
            </a>
          </div>
          <div class="post-content__btns-container">
            <button class="post-content__btn-read-more btn--secondary">Read more</button>
            <button class="post-content__btn-hide btn--primary" hidden>Hide</button>
            <button class="post-content__btn-delete btn--primary">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `
  }

  get mediaBox() {
    return `
    <div class="post-item__media-box">
      <img 
        src="${this.filmDetails.poster}" 
        class="post-item__poster"
        alt="post image" 
      />
    </div>
    `
  }

  get reviewSection() {
    let review = null
    if (this.reviewDetails.review.length >= 100) {
      review = this.reviewDetails.review.slice(0, 100) + '...'
    } else {
      review = this.reviewDetails.review
    }

    return `
    <p class="post-content__text">
      ${review}
    </p>
    `
  }
}

class ImagePost extends Post {
  constructor(options) {
    super(options)
    this._type = 'img'
  }

  get mediaBox() {
    return `
    <div class="post-item__media-box">
      <img src="${this.filmDetails.poster}" class="post-item__poster"
        alt="post image" />
    </div>
    `
  }
}

class TextPost extends Post {
  constructor(options) {
    super(options)
    this._type = 'text'
  }

  get postText() {
    let review = null
    if (this.reviewDetails.review.length > 450) {
      review = this.reviewDetails.review.slice(0, 450) + '...'
    } else {
      review = this.reviewDetails.review
    }

    return `
    <p class="post-content__text">
      ${review}
    </p>
    `
  }
}

export {Post, VideoPost, AudioPost, ImagePost, TextPost}