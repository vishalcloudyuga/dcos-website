// logic for quote carousel
(function() {
  const slideSwitchTimeout = 5000;

  let currentIndex = 0;
  let quotes       = $('.partner-quote-block');
  let logos        = $('.partner-quote-logo-list__partner-quote-logo');
  let links        = $('[data-activate-quote]');
  let interval;

  if(!quotes.length) return;

  // setup listeners for logos

  if (window.matchMedia('(min-width: 768px)').matches) {
    Array.prototype.forEach.call(links, (link) => {
      $(link).on('click', logoClicked);
    });
  }

  let debounce = function (time, fn) {
    let timeout;
    return function () {
      let args  = Array.prototype.slice.call(arguments);
      let ctx   = this;

      clearTimeout(timeout)
      timeout = setTimeout(() => { fn.apply(ctx, args) }, time)
    }
  }

  let calculateQuoteHeight = function () {
    let maxHeight = Math.max(...Array.prototype.map.call(quotes, quote =>  quote.offsetHeight));
    $('.partner-quote-block-container').css('height', `${maxHeight + 20}px`);
  }

  $(window).resize(debounce(250, calculateQuoteHeight));
  calculateQuoteHeight();

  function logoClicked(e) {
    e.preventDefault();
    showQuoteWithIndex(this.dataset.activateQuote);
    clearInterval(interval);
  }

  function showQuoteWithIndex(index) {
    // hide current quote
    let hidingQuote = quotes[currentIndex];
    let hidingLogo  = logos[currentIndex];
    hidingQuote.classList.remove('active');
    hidingLogo.classList.remove('active');

    setTimeout(() => {
      hidingQuote.classList.add('hidden')

      // select next quote
      // new index passed?
      if( index ) {
        currentIndex = index
      } else {
        // nope; just increment
        if ( currentIndex < quotes.length-1 ) {
          currentIndex++
        } else {
          currentIndex = 0
        }
      }

      // activate new quote
      let showingQuote = quotes[currentIndex]
      showingQuote.classList.remove('hidden')
      showingQuote.classList.add('active')

      // activate new logo
      let showingLogo = logos[currentIndex]
      showingLogo.classList.add('active')
    }, 200);
  }


  interval = setInterval(showQuoteWithIndex, slideSwitchTimeout);

})();
