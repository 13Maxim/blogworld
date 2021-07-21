import { Slider, InfiniteSlider, SliderWithSwipe } from '../src/js/plugins/slider.js'

describe('slider.js', () => {
  let slider = null
  let $slides = null
  let slideWidth = null
  let $btnPrev = null
  let $btnNext = null
  let $slidesContainer = null
  let delay = 1000
  let sliderPrev = false

  beforeEach(() => {
    const sliderMockup = `
        <div class="container">
          <div class="slides-container">
            <div class="slide" style="width: 500px" id="1"></div>
            <div class="slide" style="width: 500px" id="2"></div>
          </div>
          <button class="btn-prev"></button>
          <button class="btn-next"></button>
        </div>
      `
    document.body.insertAdjacentHTML('beforeend', sliderMockup)
  })

  afterEach(() => {
    document.querySelector('.container').innerHTML = null
    document.querySelector('.container').remove()
  })

  describe('Slider', () => {
    beforeEach(() => {
      $slidesContainer = document.querySelector('.slides-container')
      $btnPrev = document.querySelector('.btn-prev')
      $btnNext = document.querySelector('.btn-next')
      $slides = $slidesContainer.children
      slideWidth = $slides[0].clientWidth

      slider = new Slider({
        $slidesContainer,
        $btnNext,
        $btnPrev
      })
    })

    it('slides amount should be correct', () => {
      expect(slider.$slides.length).toBe($slides.length)
    })

    it('slideWidth should be correct', () => {
      expect(slider.slideWidth).toBe(slideWidth)
    })

    describe('updateSlideSize()', () => {
      it('should update size correctly', () => {
        slider.updateSlideSize()
        expect(slider.slideWidth).toBe($slides[0].clientWidth)
      })
    })

    describe('slide updating', () => {
      it('slide should update on click next-btn', () => {
        const updateSlideSpy = spyOn(slider, 'nextSlide')
        $btnNext.click()

        expect($btnNext.disabled).toBeTrue
        expect($btnPrev.disabled).toBeTrue
        expect(updateSlideSpy).toHaveBeenCalled()
      })

      it('slide should update on click prev-btn', () => {
        const updateSlideSpy = spyOn(slider, 'previousSlide')
        $btnPrev.click()

        expect($btnNext.disabled).toBeTrue
        expect($btnPrev.disabled).toBeTrue
        expect(updateSlideSpy).toHaveBeenCalled()
      })
    })
  })

  describe('Infinite Slider', () => {
    beforeEach(() => {
      $slidesContainer = document.querySelector('.slides-container')
      $btnPrev = document.querySelector('.btn-prev')
      $btnNext = document.querySelector('.btn-next')
      $slides = $slidesContainer.children

      slider = new InfiniteSlider({
        $slidesContainer,
        $btnNext,
        $btnPrev,
        sliderPrev,
        delay
      })
    })

    describe('stopInfiniteSlider()', () => {
      it('should call clearInterval function', () => {
        const spy = spyOn(window, 'clearInterval')
        slider.stopInfiniteSlider()
        expect(spy).toHaveBeenCalled()
      })

      it('should called on mouseover', () => {
        const mouseoverEvent = new Event('mouseover')
        const spy = spyOn(slider, 'stopInfiniteSlider')
        $slidesContainer.dispatchEvent(mouseoverEvent)

        expect(spy).toHaveBeenCalled()
      })

      it('should called on click btn-next', () => {
        const spy = spyOn(slider, 'stopInfiniteSlider')
        $btnNext.click()
        expect(spy).toHaveBeenCalled()
      })

      it('should called on click btn-prev', () => {
        const spy = spyOn(slider, 'stopInfiniteSlider')
        $btnPrev.click()
        expect(spy).toHaveBeenCalled()
      })
    })

    describe('startInfiniteSlider()', () => {
      it('should called on mouseout', () => {
        const mouseoutEvent = new Event('mouseout')
        const spy = spyOn(slider, 'startInfiniteSlider')
        $slidesContainer.dispatchEvent(mouseoutEvent)

        expect(spy).toHaveBeenCalled()
      })
    })
  })

  describe('SliderWithSwipe', () => {
    beforeEach(() => {
      $slidesContainer = document.querySelector('.slides-container')
      $btnPrev = document.querySelector('.btn-prev')
      $btnNext = document.querySelector('.btn-next')
      $slides = $slidesContainer.children
      slideWidth = $slides[0].clientWidth

      slider = new SliderWithSwipe({
        $slidesContainer,
        $btnNext,
        $btnPrev,
        sliderPrev,
        delay
      })
    })

    it('should call function updateSlideOnSwipe on mousedown', () => {
      const mousedownEvent = new Event('mousedown')
      const spy = spyOn(slider, 'updateSlideOnSwipe')
      $slidesContainer.dispatchEvent(mousedownEvent)
      expect(spy).toHaveBeenCalled()
    })

    it('should call function updateSlideOnSwipe on mouseup', () => {
      const mouseupEvent = new Event('mouseup')
      const spy = spyOn(slider, 'updateSlideOnSwipe')
      $slidesContainer.dispatchEvent(mouseupEvent)
      expect(spy).toHaveBeenCalled()
    })

    describe('updateSlideOnSwipe', () => {
      it('should write swipe touch coordinates on mousedown', () => {
        const event = {
          type: 'mousedown',
          clientX: 200,
        }
        slider.updateSlideOnSwipe(event)
        expect(slider.swipeTouch.coords).toBe(event.clientX)
      })

      it('should write swipe release coordinates on mouseup', () => {
        const event = {
          type: 'mouseup',
          clientX: 500,
        }

        slider.updateSlideOnSwipe(event)
        expect(slider.swipeRelease.coords).toBe(event.clientX)
      })

      it('should call next slide', () => {
        const eventSwipeTouch = {
          type: 'mousedown',
          clientX: 300
        }
        const eventSwipeRelease = {
          type: 'mouseup',
          clientX: 100
        }

        const spy = spyOn(slider, 'nextSlide')

        slider.updateSlideOnSwipe(eventSwipeTouch)
        slider.updateSlideOnSwipe(eventSwipeRelease)
        expect(spy).toHaveBeenCalled()
      })

      it('should call previous slide', () => {
        const eventSwipeTouch = {
          type: 'mousedown',
          clientX: 100
        }
        const eventSwipeRelease = {
          type: 'mouseup',
          clientX: 300
        }

        const spy = spyOn(slider, 'previousSlide')

        slider.updateSlideOnSwipe(eventSwipeTouch)
        slider.updateSlideOnSwipe(eventSwipeRelease)
        expect(spy).toHaveBeenCalled()
      })
    })
  })
})