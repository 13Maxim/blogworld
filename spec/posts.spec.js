import { Post, VideoPost, AudioPost, ImagePost, TextPost } from '../src/js/blogPage/posts.js'
import modalWindow from '../src/js/plugins/modal.js'
import $ from 'jquery'
$.fn.modalWindow = modalWindow

describe('posts.js', () => {
  const options = {
    reviewDetails: {
      authorAvatar: '',
      authorName: 'test name',
      review: `
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea quam modi quo cumque 
        et fugiat aliquam laudantium nulla quidem consequatur omnis excepturi alias distinctio 
        animi dolore, eligendi inventore aspernatur laborum expedita harum atque quas dolor 
        porro. Exercitationem nemo rem quia quasi maxime velit, excepturi at, alias necessitatibus 
        quis fugit aperiam temporibus aliquid deleniti culpa impedit. Corporis amet repellat, 
        assumenda quae fugit vel eos pariatur modi facilis harum, deleniti cum dignissimos illum 
        natus facere fugiat? Maiores similique quam ea quod, reprehenderit labore doloribus iure. 
        Natus laudantium vitae eveniet. Aperiam distinctio vel quos quam hic ullam ratione eos 
        vero dicta laudantium quasi necessitatibus veritatis ducimus dolor, fuga suscipit. 
        Voluptas corporis, nisi enim, totam inventore in, libero ad placeat excepturi rem at 
        perspiciatis ea aliquid quis et? Voluptatum doloremque sed dicta sint earum aspernatur 
        cum blanditiis vitae pariatur saepe, eveniet eum minima animi, deserunt consectetur magnam 
        nobis deleniti odit, dolore eligendi? Autem numquam quibusdam voluptatum voluptatibus 
        explicabo porro nam quis, sequi possimus pariatur quae neque esse, quam temporibus. 
        Perspiciatis blanditiis suscipit est nesciunt consequatur laboriosam sunt aliquam ratione, 
        dolorem saepe quos, aperiam, ut ex omnis accusantium debitis cumque doloremque inventore 
        dolores. Perferendis dolorum sed, laboriosam consequuntur praesentium repellat dicta 
        blanditiis. Optio quia quisquam dolor. Nobis optio voluptatibus vitae.
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. dddQuidem, culpa, nisi quis reiciendis 
        aliquid reprehenderit necessitatibus animi perferendis odio quia, facere unde! Ipsa labore 
        dolores cum nobis excepturi animi, odio doloremque quia? Eveniet nesciunt minima quaerat 
        repudiandae omnis sequi ad vitae ut harum, voluptatibus placeat dignissimos consequuntur inventore 
        enim perspiciatis sunt exercitationem blanditiis neque. Modi atque sunt itaque odio ullam 
        explicabo? Esse, consequatur dolore? Cumque at dolor, soluta, facilis laudantium hic sunt 
        distinctio error voluptates aliquid deleniti praesentium quas voluptatum vitae? Dolorem perspiciatis
        molestiae blanditiis quibusdam mollitia, quis quo vitae laboriosam porro ut, cumque inventore 
        atque laborum consectetur eaque. Debitis inventore assumenda eius soluta necessitatibus quasi 
        unde aut, officia quisquam quidem ea nihil sequi itaque magni voluptatibus quia! Pariatur esse 
        molestias minus dolorum facilis ullam, necessitatibus aspernatur vitae. Consequatur adipisci, 
        assumenda dolor facilis nisi ipsum corporis excepturi accusamus? Molestias provident dolores 
        voluptate beatae vel libero quod similique, non doloremque quae est, hic veritatis eos accusamus 
        voluptatem deleniti natus nemo ad officia esse! Fugiat minus expedita sequi. Hic quidem magni 
        voluptatibus, ipsa facere nihil aspernatur facilis unde iusto quis quaerat, dolores iure esse 
        dicta aut assumenda velit reprehenderit similique quisquam suscipit necessitatibus sint. Nostrum 
        dicta, voluptas iure libero ipsum ratione dolore ducimus reprehenderit, dolor tenetur officiis 
        dolorem repellendus! Aspernatur recusandae nam numquam officiis, fugit iste autem? Necessitatibus 
        sapiente consequuntur earum voluptate?
      `,
      reviewLink: 'https://test-review-url.com',
      date: new Date(),
      rating: 7,
    },
    filmDetails: {
      title: 'test title',
    }
  }


  describe('Post', () => {
    let post = null
    let $container = null

    beforeEach(() => {
      Post.allPosts = []
      post = new Post(options)
      $container = document.createElement('div')
      document.body.append($container)

      Post.fillPage($container)
    })

    afterEach(() => {
      $container.innerHTML = ''
      $container.remove()
    })

    describe('testing post data', () => {

      it('author name', () => {
        const userName = document.querySelector('.post-head__user-name').textContent
        expect(userName).toBe(options.reviewDetails.authorName)
      })

      it('review should be no more than 300 symbols', () => {
        const review = document.querySelector('.post-content__text').textContent
        expect(review.trim()).toBe(post.reviewDetails.review.slice(1, 300).trim() + '...')
      })  

      it('title', () => {
        const title = document.querySelector('.post-content__title').textContent
        expect(title.trim()).toBe(options.filmDetails.title.trim())
      })
    })

    describe('bindPostBtns()', () => {
      it('function should be called on filling page', () => {
        const newPost = new Post(options)
        const newContainer = document.createElement('div')
        document.body.append(newContainer)

        const spy = spyOn(newPost, 'bindPostBtns')
        Post.fillPage(newContainer)
        expect(spy).toHaveBeenCalled()

        newContainer.innerHTML = ''
        newContainer.remove()
      })
    })

    describe('static bindDeleteBtn()', () => {
      it('function should be called on filling page', () => {
        const newPost = new Post(options)
        const newContainer = document.createElement('div')
        document.body.append(newContainer)

        const spy = spyOn(Post, 'bindDeleteBtn')
        Post.fillPage(newContainer)
        expect(spy).toHaveBeenCalled()

        newContainer.innerHTML = ''
        newContainer.remove()
      })
    })

    describe('post-deleting', () => {
      let $modalOkBtn = null
      
      beforeEach(() => {
        const $deleteBtn = document.querySelector('.post-content__btn-delete')
        $deleteBtn.click()

        $modalOkBtn = document.querySelector('#modal-ok')
      })

      it('on click delete-btn modal window should be shown', () => {
        expect(document.querySelector('#modal')).toBeDefined()        
        $modalOkBtn.click()
      })

      it('on click ok-btn post should be deleted', () => {
        $modalOkBtn.click()
        expect(Post.allPosts.includes(post)).toBeFalse()
      })
    })

    describe('static fillPageBySearch', () => {
      it('page should be filled correct', () => {
        const newPost = new VideoPost(options)
        Post.searchedPosts.push(newPost)

        Post.fillPageBySearch($container)
        expect(document.querySelector('.post-item--video-post')).toEqual(newPost.$postItem)
      })
    })

    describe('showReadMoreField()', () => {
      it('readmore field should be shown and link should be correct', () => {
        const $readMoreBtn = document.querySelector('.post-content__btn-read-more')
        const $hiddenInfo = document.querySelector('.post-content__hidden-info')
        const reviewLink = document.querySelector('.post-content__readmore-link').textContent
        $readMoreBtn.click()

        expect($hiddenInfo.hidden).toBeFalse()
        expect(reviewLink.trim()).toBe(options.reviewDetails.reviewLink.trim())

        $container.innerHTML = ''
        $container.remove()
      })
    })

    describe('getAuthorRatingStars()', () => {
      it('function should be called', () => {
        const newPost = new Post(options)
        const newContainer = document.createElement('div')
        document.body.append(newContainer)

        const spy = spyOn(newPost, 'getAuthorRatingStars')
        Post.fillPage(newContainer)

        expect(spy).toHaveBeenCalled()

        newContainer.innerHTML = ''
        newContainer.remove()
      })

      it('should be correct rating stars if rating !== 5', () => {
        const $stars = document.querySelectorAll('.post-info__list-item')[5].children
        const starsClasses = Array.from($stars).map(star => star.classList[1]).join('')
        const rating = post.reviewDetails.rating / 2
        let starsClassesToBe = ''

        for (let i = 1; i <= Math.floor(rating); i++) {
          starsClassesToBe += 'list-item__rate-star--full'
        }

        if (rating + 0.5 >= Math.floor(rating) + 1) {
          starsClassesToBe += 'list-item__rate-star--half'

          for (let i = 1; i <= 5 - Math.ceil(rating); i++) {
            starsClassesToBe += 'list-item__rate-star--empty'
          }
        } else {
          for (let i = 1; i <= 5 - Math.floor(rating); i++) {
            starsClassesToBe += 'list-item__rate-star--empty'
          }
        }
        expect(starsClasses).toBe(starsClassesToBe)
      })

      it('should be correct rating stars if rating == 5', () => {
        post.reviewDetails.rating = 10
        Post.fillPage($container)

        const $stars = document.querySelectorAll('.post-info__list-item')[5].children
        const starsClasses = Array.from($stars).map(star => star.classList[1]).join('')
        let starsClassesToBe = ''
        for (let i = 1; i <= 5; i++) {
          starsClassesToBe += 'list-item__rate-star--full'
        }

        expect(starsClasses).toBe(starsClassesToBe)
      })
    })

    describe('getReadTime()', () => {
      it('read time should be correct', () => {
        const readTime = parseInt(document.querySelectorAll('.post-info__list-item')[2].textContent)
        expect(readTime).toBe(Math.ceil(options.reviewDetails.review.length / 1500))
      })
    })

    describe('get authorDetailsSection', () => {
      it('getDate() should be called ', () => {
        const spy = spyOn(post, 'getDate')
        post.authorDetailsSection
        expect(spy).toHaveBeenCalled()
      })

      it('getReadTime() should be called', () => {
        const spy = spyOn(post, 'getReadTime')
        post.authorDetailsSection
        expect(spy).toHaveBeenCalled()
      })

      it('getAuthorRatingStars() should be called', () => {
        const spy = spyOn(post, 'getAuthorRatingStars')
        post.authorDetailsSection
        expect(spy).toHaveBeenCalled()
      })
    })
  })

  describe('VideoPost', () => {
    let post = null
    let $container = null
    const options = {
      reviewDetails: {
        authorAvatar: '',
        authorName: 'test name',
        review: 'test review',
        reviewLink: 'https://test-review-url.com',
        date: new Date(),
        rating: 8,
      },
      filmDetails: {
        title: 'test title',
        poster: ''
      }
    }

    beforeEach(() => {
      post = new VideoPost(options)
      $container = document.createElement('div')
      document.body.append($container)

      Post.fillPage($container)
    })

    afterEach(() => {
      $container.innerHTML = ''
      $container.remove()
    })

    it('should be inherited from Post class', () => {
      expect(VideoPost.__proto__).toBe(Post)
    })

    it('type should be correct', () => {
      expect(post._type).toBe('video')
    })

    describe('bindPlayBtn()', () => {
      it('should be called on filling page', () => {
        const newPost = new VideoPost(options)
        const newContainer = document.createElement('div')
        document.body.append(newContainer)

        const spy = spyOn(newPost, 'bindPlayBtn')
        Post.fillPage(newContainer)

        expect(spy).toHaveBeenCalled()

        newContainer.innerHTML = ''
        newContainer.remove()
      })
    })

    describe('playVideo()', () => {
      it('should be called on click play btn', () => {
        const $playBtn = document.querySelector('.post-item__play-btn')
        const spy = spyOn(post, 'playVideo')

        $playBtn.click()
        expect(spy).toHaveBeenCalled()
      })
    })
  })

  describe('AudioPost', () => {
    let post = null
    let $container = null

    beforeEach(() => {
      Post.allPosts = []
      post = new AudioPost(options)
      $container = document.createElement('div')
      document.body.append($container)
      Post.fillPage($container)
    })

    afterEach(() => {
      $container.innerHTML = ''
      $container.remove()
    })

    it('should be inherited from Post class', () => {
      expect(AudioPost.__proto__).toBe(Post)
    })

    it('type should be correct', () => {
      expect(post._type).toBe('audio')
    })

    it('review should be no more than 100 symblos', () => {
      const review = document.querySelector('.post-content__text').textContent
      expect(review.trim()).toBe(post.reviewDetails.review.slice(0, 100).trim() + '...')
    })
  })

  describe('ImagePost', () => {
    const options = {
      reviewDetails: {
        authorAvatar: '',
        authorName: 'test name',
        review: 'test review',
        reviewLink: 'https://test-review-url.com',
        date: new Date(),
        rating: 8,
      },
      filmDetails: {
        title: 'test title',
        poster: ''
      }
    }

    const post = new ImagePost(options)
    const $container = document.createElement('div')
    document.body.append($container)
    Post.fillPage($container)

    it('should be inherited from Post class', () => {
      expect(ImagePost.__proto__).toBe(Post)
    })

    it('type should be correct', () => {
      expect(post._type).toBe('img')
    })

    $container.innerHTML = ''
    $container.remove()
  })

  describe('TextPost', () => {
    let post = null
    let $container = null

    beforeEach(() => {
      Post.allPosts = []
      post = new TextPost(options)
      $container = document.createElement('div')
      document.body.append($container)

      Post.fillPage($container)
    })

    afterEach(() => {
      $container.innerHTML = ''
      $container.remove()
    })

    it('should be inherited from Post class', () => {
      expect(TextPost.__proto__).toBe(Post)
    })

    it('type should be correct', () => {
      expect(post._type).toBe('text')
    })

    it('review should be no more than 450 symbols', () => {
      const review = document.querySelector('.post-content__text').textContent
      expect(review.trim()).toBe((post.reviewDetails.review.slice(0, 450) + '...').trim())
    })
  })
})