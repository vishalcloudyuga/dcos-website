(function () {
  let currentIndex = 0;

  const container = $('.container--case-study');
  const caseStudies = Array.prototype.slice.call(container.querySelectorAll('.case-study-item'));
  const bulletList = container.querySelector('.bullet-list');

  function init () {
    caseStudies.forEach((el, index) => {
      el.querySelector('.copy-wrapper').classList.add('animated');
      el.querySelector('.image-wrapper').classList.add('animated');

      const listEl = document.createElement('li');
      const bullet = document.createElement('a');

      listEl.classList.add('bullet-list__item');
      bullet.classList.add('bullet-list__bullet');

      listEl.appendChild(bullet);
      bulletList.appendChild(listEl);

      bullet.addEventListener('click', () => navigate(index));
    });

    // make first bullet active
    bulletList.querySelectorAll('.bullet-list__bullet')[0].classList.add('active');
  }

  function navigate (index) {
    if (currentIndex === index) return;

    let bullets =  bulletList.querySelectorAll('.bullet-list__bullet');
    let previousCase = caseStudies[currentIndex];
    let currentCase = caseStudies[index];

    bullets[currentIndex].classList.remove('active');
    bullets[index].classList.add('active');

    previousCase.classList.remove('active');
    currentCase.classList.add('active');

    previousCase.querySelector('.copy-wrapper').classList.remove('fadeInUp');
    currentCase.querySelector('.copy-wrapper').classList.add('fadeInUp');

    previousCase.querySelector('.image-wrapper').classList.remove('fadeIn');
    currentCase.querySelector('.image-wrapper').classList.add('fadeIn');

    currentIndex = index;
  }

  init();
})();
