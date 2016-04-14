/*
* Usage in HTML:
* Button: <button data-modal="#my-modal"></button>
* Modal content <div id="my-modal">content here...<div>
*
* Usage in JS:
* new Modal({ element, content, closeButtonImage})
* - element (required) - DOM element
* - content (required) - DOM element
* - closeButtonImage (required) - image url
* */

(function () {
  class Modal {
    /* Possible options:
    * - button (required) - DOM element
    * - content (required) - DOM element
    * - closeButtonImage (required) - image url
    * */
    constructor (options = {}) {
      this.modal, this.overlay, this.closeButton, this.fragment;

      this.options = options;
      this.content = this.options.content;

      this.options.button.addEventListener('click', this.open.bind(this));
    }

    open () {
      this._buildModal();
      this._initEvents();

      $('body').classList.add('modal-open');
    }

    close () {
      this.modal.parentNode.removeChild(this.modal);
      this.overlay.parentNode.removeChild(this.overlay);

      $('body').classList.remove('modal-open');
    }

    // private
    _buildModal () {
      this.fragment = document.createDocumentFragment();

      this.modal = document.createElement('div');
      this.modal.classList.add('modal', 'modal-open');

      const container = document.createElement('div');
      container.classList.add('modal-content');
      container.appendChild(this.content);

      this.modal.appendChild(container);

      // close button
      const closeButtonImage = new Image();
      closeButtonImage.src = this.options.closeButtonImage;

      this.closeButton = document.createElement('div');
      this.closeButton.classList.add('close');
      this.closeButton.appendChild(closeButtonImage);

      // overlay
      this.overlay = document.createElement('div');
      this.overlay.classList.add('modal-overlay', 'modal-overlay-visible');
      this.overlay.appendChild(this.closeButton);

      this.fragment.appendChild(this.overlay);
      this.fragment.appendChild(this.modal);

      document.body.appendChild(this.fragment);
    }

    _initEvents () {
      this.overlay.addEventListener('click', this.close.bind(this));
      this.closeButton.addEventListener('click', this.close.bind(this));
    }
  }

  // init modals
  const modals = Array.prototype.slice.call(document.querySelectorAll('[data-modal]'));

  modals.forEach(button => {
    const content = $(button.dataset.modal);
    const parent  = $(button.dataset.modal).parentNode;

    parent.removeChild(content);

    const modal = new Modal({button, content, closeButtonImage: '/assets/images/icons/cancel.svg'})
  });
})();
