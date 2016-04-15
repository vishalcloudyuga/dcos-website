(function(){

  let isTriggered = false;
  let el = $('.stack-diagram');
  let topEl = $('.stack-diagram__top');
  let midEl = $('.stack-diagram__middle');
  let btmEl = $('.stack-diagram__bottom');

  let topElPos = -34;
  let btmElPos = 63;

  window.addEventListener('scroll', function(e) {
    if(window.scrollY+window.outerHeight >= $('.stack-diagram').offsetTop+450 && !isTriggered) {
      isTriggered = true;

      let topTimer = setInterval(() => {
        if(topElPos <= -50) clearInterval(topTimer);
        topElPos -= 2;
        topEl.style.top = `${topElPos}px`;
      }, 15);

      setTimeout(function() {
        $('.stack-diagram__top-info').removeClassName('hide');

        setTimeout(function() {
          $('.stack-diagram__middle-info').removeClassName('hide');
          setTimeout(function() {
            let btmTimer = setInterval(() => {
              if(btmElPos >= 80) clearInterval(btmTimer);
              btmElPos += 2;
              btmEl.style.top = `${btmElPos}px`;
            }, 15);

            setTimeout(function() {
              $('.stack-diagram__bottom-info').removeClassName('hide');
            }, 250)

          }, 500)
        }, 500)
      }, 500)
    }
  });

})();
