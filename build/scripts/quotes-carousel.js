'use strict';

// logic for quote carousel
(function () {
  var slideSwitchTimeout = 5000;

  var currentIndex = 0;
  var quotes = $$('.partner-quote-block');
  var logos = $$('.partner-quote-logo-list__partner-quote-logo');
  var links = $$('[data-activate-quote]');
  var interval = void 0;

  // setup listeners for logos
  Array.prototype.map.call(links, function (link) {
    link.addEventListener('click', logoClicked);
  });

  function logoClicked(e) {
    e.preventDefault();
    showQuoteWithIndex(this.dataset.activateQuote);
    clearInterval(interval);
  }

  function showQuoteWithIndex(index) {
    // hide current quote
    var hidingQuote = quotes[currentIndex];
    var hidingLogo = logos[currentIndex];
    hidingQuote.classList.remove('active');
    hidingLogo.classList.remove('active');

    setTimeout(function () {
      hidingQuote.classList.add('hidden');

      // select next quote
      // new index passed?
      if (index) {
        currentIndex = index;
      } else {
        // nope; just increment
        if (currentIndex < quotes.length - 1) {
          currentIndex++;
        } else {
          currentIndex = 0;
        }
      }

      // activate new quote
      var showingQuote = quotes[currentIndex];
      showingQuote.classList.remove('hidden');
      showingQuote.classList.add('active');

      // activate new logo
      var showingLogo = logos[currentIndex];
      showingLogo.classList.add('active');
    }, 200);
  }

  interval = setInterval(showQuoteWithIndex, slideSwitchTimeout);
})();