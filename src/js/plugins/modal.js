import $ from 'jquery'

export default function modalWindow(options) {
  const modalMockup = `
    <div class="modal modal--${options.type}" id="modal">
      <div class="modal__wrapper" id="modal__wrapper">
        <div class="modal__content">
          <button class="modal__close-btn" id="modal-close">&#10006;</button>
          <p class="modal__text">${options.textContent}</p>
          <div class="modal__btns-container">
            <button class="modal__btn modal__btn--ok" id="modal-ok">Ok</button>
          </div>
        </div>
      </div>
    </div>
  `
  const cancelBtnMockup = '<button class="modal__btn modal__btn--cancel" id="modal-cancel">Cancel</button>'

  const closeModal = () => {
    $('#modal').remove()
    $('body').css('overflow', '')
  }

  const confirmModal = (target) => {
    if (options.onConfirm) {
      options.onConfirm.call(target)
    }
    closeModal()
  }

  const rejectModal = (target) => {
    if (options.onReject) {
      options.onReject(target)
    }
    closeModal()
  }

  const openModal = (event) => {
    if ($('#modal').length) {
      closeModal()
    }
    
    $('body').append(modalMockup).css('overflow', 'hidden')
    if (options.cancelBtn) {
      $('.modal__btns-container').append(cancelBtnMockup)
      $('#modal-cancel').on('click', rejectModal)
    }
    if (options.lightBg) {
      $('.modal__wrapper').addClass('modal__wrapper--light')
    }

    $('#modal-ok').on('click', confirmModal.bind(null, event.target))
    $('#modal-close').on('click', closeModal.bind(null, event.target))
  }
  options.delay 
  ? this[options.trigger](event => setTimeout(openModal.bind(null, event), options.delay))
  : this[options.trigger](openModal)
}