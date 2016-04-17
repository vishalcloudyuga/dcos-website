(function(){

  let isTriggered = false;
  let el = $('.stack-diagram');
  let topEl = $('.stack-diagram__top');
  let midEl = $('.stack-diagram__middle');
  let btmEl = $('.stack-diagram__bottom');

  let topElPos = -34;
  let btmElPos = 63;

  window.addEventListener('scroll', function(e) {
    if((window.scrollY||window.pageYOffset)+window.outerHeight >= $('.stack-diagram').offsetTop+450 && !isTriggered) {
      isTriggered = true;

      topEl.addClassName('animate');

      setTimeout(function() {
        $('.stack-diagram__top-info').removeClassName('hide');

        setTimeout(function() {
          $('.stack-diagram__middle-info').removeClassName('hide');
          setTimeout(function() {
            btmEl.addClassName('animate');

            setTimeout(function() {
              $('.stack-diagram__bottom-info').removeClassName('hide');
            }, 1000)

          }, 500)
        }, 1000)
      }, 750)
    }
  });

})();
