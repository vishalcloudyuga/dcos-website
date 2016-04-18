(function () {
  let currentIndex = 0;

  const nextSlideTimeout = 12000;
  const container = $('.container--case-study');

  const caseStudies = Array.prototype.slice.call(container.find('.case-study-item'));
  const bulletList = container.find('.bullet-list');

  let interval = setInterval(() => navigate(currentIndex + 1), nextSlideTimeout);

  function init () {
    caseStudies.forEach((el, index) => {
      el = $(el);
      el.find('.copy-wrapper').addClass('animated');
      el.find('.image-wrapper').addClass('animated');

      const listEl = $('<li />');
      const bullet = $('<a />');

      listEl.addClass('bullet-list__item');
      bullet.addClass('bullet-list__bullet');

      listEl.append(bullet);
      bulletList.append(listEl);

      bullet.on('click', () => navigate(index));
    });

    // make first bullet active
    $(bulletList.find('.bullet-list__bullet')[0]).addClass('active');
  }

  function navigate (index) {
    if (index === currentIndex) return;
    else if (index >= caseStudies.length) index = 0;

    let bullets =  bulletList.find('.bullet-list__bullet');
    let previousCase = $(caseStudies[currentIndex]);
    let currentCase = $(caseStudies[index]);

    $(bullets[currentIndex]).removeClass('active');
    $(bullets[index]).addClass('active');

    previousCase.removeClass('active');
    currentCase.addClass('active');

    previousCase.find('.copy-wrapper').removeClass('fadeInUp').attr('style', 'z-index: 1;');
    currentCase.find('.copy-wrapper').addClass('fadeInUp').attr('style', 'z-index: 2;');

    previousCase.find('.image-wrapper').removeClass('fadeIn');
    currentCase.find('.image-wrapper').addClass('fadeIn');

    currentIndex = index;

    clearInterval(interval);
    interval = setInterval(() => navigate(currentIndex + 1), nextSlideTimeout);
  }

  init();
})();
