import {InfiniteSlider, Slider, SliderWithSwipe} from '../plugins/slider.js'
import '../../assets/scss/main.scss'

const $testimonialsSection = document.getElementById('testimonials')
const $portfoliosSection = document.getElementById('portfolios')

const testimonialsSlider = new InfiniteSlider({
  $slidesContainer: $testimonialsSection.querySelector('#testimonials-slider__slides-container'),
  $btnNext: $testimonialsSection.querySelector('#testimonials-slider__btn--next'),
  $btnPrev: $testimonialsSection.querySelector('#testimonials-slider__btn--prev'),
  delay: 5000,
})

const portfoliosSlider = new InfiniteSlider({
  $slidesContainer: $portfoliosSection.querySelector('#portfolios-slider__slides-container'),
  $btnNext: $portfoliosSection.querySelector('#portfolios-slider__slider-btn--next'),
  $btnPrev: $portfoliosSection.querySelector('#portfolios-slider__slider-btn--prev'),
  delay: 6000,
})