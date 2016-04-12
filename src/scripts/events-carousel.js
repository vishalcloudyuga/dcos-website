(function () {
  let currentIndex = 0;

  const carousel = $$('.events-carousel .card-container')[0];
  const eventCards = $$('.events-carousel .card');
  const nextBtn = $$('.events-carousel-btn--next')[0];
  const prevBtn = $$('.events-carousel-btn--prev')[0];

  prevBtn.style.display = 'none'; // Hide prev button initially

  nextBtn.addEventListener('click', () => {
    if (currentIndex === eventCards.length) return;

    const card = eventCards[currentIndex];
    const margin = getCardMargin(card) * (currentIndex + 1);
    const offset = card.offsetWidth * (currentIndex + 1);

    carousel.style.transform = `translateX(${-offset - margin}px)`;

    currentIndex++;

    showHideButtons();
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex === 0) return;

    const card = eventCards[currentIndex - 1];
    const margin = getCardMargin(card) * (currentIndex - 1);
    const offset = card.offsetWidth * (currentIndex - 1);

    carousel.style.transform = `translateX(${-offset - margin}px)`;

    currentIndex--;

    showHideButtons();
  });

  // Helpers

  function getCardMargin (card) {
    return parseInt(window.getComputedStyle(card).margin, 10) * 2
  }

  function showHideButtons () {
    if (eventCards[currentIndex + 1] === undefined) {
      nextBtn.style.display = 'none'
    } else {
      nextBtn.style.display = 'block'
    }

    if (eventCards[currentIndex - 1] === undefined) {
      prevBtn.style.display = 'none'
    } else {
      prevBtn.style.display = 'block'
    }
  }
})();