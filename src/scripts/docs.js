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
  searchInput.attr('disabled', 'disabled');

  // Navigation
  Array.prototype.forEach.call($('.docs-nav__item_folder a'), el => {
    $(el).on('click', function(e) {
      docsMenu.css('maxHeight', null); // remove max-height set by mobile docs menu

      if($(e.currentTarget).hasClass('docs-nav__item__arrow')) e.preventDefault();
      else if(!$(e.currentTarget).attr('data-path')) return;

      let parent = $($(e.currentTarget).parent());
      let img = $($(e.currentTarget).find('img'));

      parent.hasClass('docs-nav__item--closed') ? parent.removeClass('docs-nav__item--closed') : parent.addClass('docs-nav__item--closed')
      let isActive = $(parent.find('.docs-nav__item__title')).hasClass('active');
      let isClosed = parent.hasClass('docs-nav__item--closed');

      if(isActive) {
        isClosed ? img.attr('src', '/assets/images/icons/arrow-right-docs-selected.svg') : img.attr('src', '/assets/images/icons/arrow-down-docs.svg');
      } else {
        isClosed ? img.attr('src', '/assets/images/icons/arrow-right-docs.svg') : img.attr('src', '/assets/images/icons/arrow-down-docs-unselected.svg');
      }
    });
  });

  // Mobile docs menu
  let mobileDocsMenu = $('.docs-menu-mobile');
  let docsMenu = $(mobileDocsMenu.find('.docs-menu-mobile-container'));
  let docsMenuButton = $(mobileDocsMenu.find('.open-docs-menu'));
  let docsMenuHeight;
  let docsMenuActive;

  if(!docsMenu) return;
  initDocsMenu();

  function initDocsMenu () {
    docsMenuHeight = docsMenu.offsetHeight;
    docsMenuActive = false;

    docsMenu.addClass('hidden');
  }

  docsMenuButton.on('click', () => {
    if (docsMenuActive) docsMenuHeight = docsMenu.offsetHeight;

    $(docsMenu).css('maxHeight', `${docsMenuHeight}px`);

    setTimeout(() => {
      docsMenu.toggleClass('hidden');
      docsMenu.toggleClass('active');
      docsMenuButton.toggleClass('active');

      docsMenuActive = !docsMenuActive;
    });
  });

  // Highlight.js
  Array.prototype.forEach.call($('pre code'), el => {
    hljs.highlightBlock(el);
  });

  // Feedback
  Array.prototype.forEach.call($('#submit-feedback'), el => {
    $(el).href = `https://github.com/dcos/dcos-docs/issues/new?body=${encodeURI(window.location.href)}`;
  });

})()
