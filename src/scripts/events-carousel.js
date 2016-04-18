(function () {
  let currentIndex = 0;

  const carousel = $('.events-carousel .card-container');
  const eventCards = $('.events-carousel .card');
  const nextBtn = $('.events-carousel-btn--next');
  const prevBtn = $('.events-carousel-btn--prev');

  if(!carousel) return;

  prevBtn.css('display', 'none'); // Hide prev button initially

  nextBtn.on('click', () => {
    if (currentIndex === eventCards.length) return;

    const card = eventCards[currentIndex];
    const margin = getCardMargin(card) * (currentIndex + 1);
    const offset = card.offsetWidth * (currentIndex + 1);

    carousel.css('transform', `translateX(${-offset - margin}px)`);

    currentIndex++;

    showHideButtons();
  });

  prevBtn.on('click', () => {
    if (currentIndex === 0) return;

    const card = eventCards[currentIndex - 1];
    const margin = getCardMargin(card) * (currentIndex - 1);
    const offset = card.offsetWidth * (currentIndex - 1);

    carousel.css('transform', `translateX(${-offset - margin}px)`);

    currentIndex--;

    showHideButtons();
  });

  // Helpers

  function getCardMargin (card) {
    return parseInt(window.getComputedStyle(card).margin, 10) * 2
  }

  function showHideButtons () {
    if (eventCards[currentIndex + 1] === undefined) {
      nextBtn.hide();
    } else {
      nextBtn.show();
    }

    if (eventCards[currentIndex - 1] === undefined) {
      prevBtn.hide();
    } else {
      prevBtn.show();
    }
  }
})();
