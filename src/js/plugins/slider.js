function Slider(options) {
  this.$slidesContainer = options.$slidesContainer
  this.$btnNext = options.$btnNext
  this.$btnPrev = options.$btnPrev
  this.$slides = this.$slidesContainer.children
  this.slideWidth = this.$slides[0].clientWidth

  this.nextSlide = function () {
    if (this.stopInfiniteSlider) {
      this.stopInfiniteSlider()
    }

    const $firstSlideClone = this.$slides[0].cloneNode(true)
    this.$btnNext.disabled = true
    this.$btnPrev.disabled = true
    this.$slidesContainer.insertAdjacentElement('beforeend', $firstSlideClone)

    const animation = this.$slidesContainer.animate([
      { transform: `translateX(-${this.slideWidth}px)` }
    ],
      { duration: 600 }
    )

    animation.onfinish = () => {
      this.$slides[0].remove()
      this.$btnNext.disabled = false
      this.$btnPrev.disabled = false
    }

    if (this.startInfiniteSlider) {
      this.startInfiniteSlider()
    }
  }

  this.previousSlide = function () {
    if (this.stopInfiniteSlider) {
      this.stopInfiniteSlider()
    }
    
    const lastSlideClone = this.$slides[this.$slides.length - 1].cloneNode(true)
    this.$btnNext.disabled = true
    this.$btnPrev.disabled = true
    this.$slidesContainer.insertAdjacentElement('afterbegin', lastSlideClone)
    this.$slidesContainer.style.transform = `translateX(-${this.slideWidth}px)`
    const animation = this.$slidesContainer.animate([
      { transform: `translateX(0px)` },
    ],
      { duration: 600 }
    )
    animation.onfinish = () => {
      this.$slidesContainer.style.transform = `translate(0px)`
      this.$slides[this.$slides.length - 1].remove()
      this.$btnNext.disabled = false
      this.$btnPrev.disabled = false
    }

    if (this.startInfiniteSlider) {
      this.startInfiniteSlider()
    }
  }

  this.updateSlideSize = function () {
    this.slideWidth = this.$slides[0].clientWidth
  }

  this.bindItems = function () {
    window.addEventListener('resize', () => this.updateSlideSize()) 
    this.$btnNext.addEventListener('click', () => this.nextSlide())
    this.$btnPrev.addEventListener('click', () => this.previousSlide())
  }

  this.bindItems()
}

function InfiniteSlider(options) {
  Slider.call(this, options)
  this.delay = options.delay
  this.toPrevious = options.toPrevious
  this.sliderInterval = null

  this.startInfiniteSlider = function () {
    this.sliderInterval = setInterval(() => {
      if (!document.hidden) {
        this.toPrevious ? this.previousSlide() : this.nextSlide()
        this.$btnPrev.disabled = false
      }
    }, this.delay)
  }

  this.stopInfiniteSlider = function () {
    clearInterval(this.sliderInterval)
  }

  this.bindItems = function () {
    this.$slidesContainer.addEventListener('mouseover', () => this.stopInfiniteSlider())
    this.$slidesContainer.addEventListener('mouseout', () => this.startInfiniteSlider())
  }

  this.startInfiniteSlider()
  this.bindItems()
}

function SliderWithSwipe(options) {
  Slider.call(this, options)
  this.swipeTouch = {
    coords: null,
    time: null
  }
  this.swipeRelease = {
    coords: null,
    time: null
  }
 
  this.bindItems = function () {
    this.$slidesContainer.addEventListener('mousedown', event => this.updateSlideOnSwipe(event))
    this.$slidesContainer.addEventListener('mouseup', event => this.updateSlideOnSwipe(event))
  }

  this.updateSlideOnSwipe = function (event) {
    if (event.type === 'mousedown') {
      this.swipeTouch.coords = event.clientX
      this.swipeTouch.time = Date.now()
    } else {
      this.swipeRelease.coords = event.clientX
      this.swipeRelease.time = Date.now()

      const swipeTime = (this.swipeRelease.time - this.swipeTouch.time) / 1000
      const swipeDistancePrevious = this.swipeRelease.coords - this.swipeTouch.coords
      const swipeDistanceNext = this.swipeTouch.coords - this.swipeRelease.coords
      let validSwipeDistance = this.slideWidth / 3.5
      if (swipeTime < 0.35) {
        if (swipeDistanceNext >= validSwipeDistance) {
          this.nextSlide()
        } else if (swipeDistancePrevious >= validSwipeDistance) {
          this.previousSlide(true)
        }
      }
    }
  }

  this.bindItems()
} 

export {Slider, InfiniteSlider, SliderWithSwipe}
