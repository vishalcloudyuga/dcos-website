(function () {
  let currentIndex = 0;

  const nextSlideTimeout = 1200000;
  const container = $('.container--case-study');
  const caseStudies = Array.prototype.slice.call(container.querySelectorAll('.case-study-item'));
  const bulletList = container.querySelector('.bullet-list');

  let interval = setInterval(() => navigate(currentIndex + 1), nextSlideTimeout);

  function init () {
    caseStudies.forEach((el, index) => {
      el.querySelector('.copy-wrapper').addClassName('animated');
      el.querySelector('.image-wrapper').addClassName('animated');

      const listEl = document.createElement('li');
      const bullet = document.createElement('a');

      listEl.addClassName('bullet-list__item');
      bullet.addClassName('bullet-list__bullet');

      listEl.appendChild(bullet);
      bulletList.appendChild(listEl);

      bullet.addEventListener('click', () => navigate(index));
    });

    // make first bullet active
    bulletList.querySelectorAll('.bullet-list__bullet')[0].addClassName('active');
  }

  function navigate (index) {
    if (index === currentIndex) return;
    else if (index >= caseStudies.length) index = 0;

    let bullets =  bulletList.querySelectorAll('.bullet-list__bullet');
    let previousCase = caseStudies[currentIndex];
    let currentCase = caseStudies[index];

    bullets[currentIndex].removeClassName('active');
    bullets[index].addClassName('active');

    previousCase.removeClassName('active');
    currentCase.addClassName('active');

    previousCase.querySelector('.copy-wrapper').removeClassName('fadeInUp').setAttribute('style', 'z-index: 1;');
    currentCase.querySelector('.copy-wrapper').addClassName('fadeInUp').setAttribute('style', 'z-index: 2;');

    previousCase.querySelector('.image-wrapper').removeClassName('fadeIn');
    currentCase.querySelector('.image-wrapper').addClassName('fadeIn');

    currentIndex = index;

    clearInterval(interval);
    interval = setInterval(() => navigate(currentIndex + 1), nextSlideTimeout);
  }

  init();
})();
