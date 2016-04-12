(function(){

  // grab data-toggle buttons
  let btns = $$('[data-overlay-toggle]');

  // attach eventlisteners to the buttons
  Array.prototype.map.call(btns, (btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // grab reference to overlay based on data-attribute
      let overlay = $(`[data-overlay=${btn.dataset.overlayToggle}]`)

      // toggle the visibility CSS class
      overlay.classList.toggle('overlay-visible');

      // run open/close logic based on presence visibility class
      let visible = overlay.classList.contains('overlay-visible');
      if (visible) {
        showOverlay.call(overlay);
      } else {
        closeOverlay.call(overlay);
      }

    });
  });

  // overlay is closed
  function closeOverlay() {
    this.classList.remove('overlay-visible');
    document.removeEventListener('keydown', escapePressed);
    document.removeEventListener('click', closeOverlay);
  }

  // overlay is shown
  function showOverlay() {
    // both esc or close button closes the overlay
    document.addEventListener('keydown', escapePressed.bind(this));
    this.querySelector('a.overlay-close').addEventListener('click', closeOverlay.bind(this));
  }

  function escapePressed(e) {
    // if escape is pressed
    if ( e.keyCode === 27 ) {
      closeOverlay.call(this);
    }
  }

})();
