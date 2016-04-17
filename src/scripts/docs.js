(function() {

  // Search
  const version = 'latest';

  let debounce = function (fn) {
    let timeout;
    return function () {
      let args  = Array.prototype.slice.call(arguments);
      let ctx   = this;

      clearTimeout(timeout)
      timeout = setTimeout(() => { fn.apply(ctx, args) }, 100)
    }
  }

  const searchInput = $('.docs-search__input');
  searchInput.setAttribute('disabled', 'disabled');

  // Navigation
  Array.prototype.forEach.call($$('.docs-nav__item_folder a'), el => {
    el.addEventListener('click', function(e) {
      docsMenu.style.maxHeight = null; // remove max-height set by mobile docs menu

      if(e.currentTarget.hasClassName('docs-nav__item__arrow')) e.preventDefault();
      else if(!e.currentTarget.getAttribute('data-path')) return;
      let parent = e.currentTarget.parentNode.parentNode;
      let img = e.currentTarget.querySelector('img');

      parent.hasClassName('docs-nav__item--closed') ? parent.removeClassName('docs-nav__item--closed') : parent.addClassName('docs-nav__item--closed')
      if(parent.hasClassName('docs-nav__item--closed')) {
        parent.querySelector('.docs-nav__item__title').hasClassName('active') ? img.setAttribute('src', '/assets/images/icons/arrow-right-docs-selected.svg') : img.setAttribute('src', '/assets/images/icons/arrow-right-docs.svg');
      } else {
        parent.querySelector('.docs-nav__item__title').hasClassName('active') ? img.setAttribute('src', '/assets/images/icons/arrow-down-docs.svg') : img.setAttribute('src', '/assets/images/icons/arrow-down-docs-unselected.svg');
      }

      Stickyfill.rebuild();
    });
  });

  // Mobile docs menu
  let mobileDocsMenu = $('.docs-menu-mobile');
  let docsMenu = mobileDocsMenu.querySelector('.docs-menu-mobile-container');
  let docsMenuButton = mobileDocsMenu.querySelector('.open-docs-menu');
  let docsMenuHeight;
  let docsMenuActive;
  initDocsMenu();

  function initDocsMenu () {
    docsMenuHeight = docsMenu.offsetHeight;
    docsMenuActive = false;

    docsMenu.classList.add('hidden');
  }

  docsMenuButton.addEventListener('click', () => {
    if (docsMenuActive) docsMenuHeight = docsMenu.offsetHeight;

    docsMenu.style.maxHeight = `${docsMenuHeight}px`;

    setTimeout(() => {
      docsMenu.classList.toggle('hidden');
      docsMenu.classList.toggle('active');
      docsMenuButton.classList.toggle('active');

      docsMenuActive = !docsMenuActive;
    });
  });

  // Highlight.js
  Array.prototype.forEach.call($$('pre code'), el => {
    hljs.highlightBlock(el);
  });

  // Feedback
  Array.prototype.forEach.call($$('#submit-feedback'), el => {
    el.href = `https://github.com/dcos/dcos-docs/issues/new?body=${encodeURI(window.location.href)}`;
  });

})()
