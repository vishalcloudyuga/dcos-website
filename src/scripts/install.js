(function(){
  if($(window).outerWidth() >= 414) {
    let heights = Array.prototype.map.call($('.install-columns .hero-list__item'), el => {
      return Array.prototype.map.call($(el).find('p'), p => p.offsetHeight);
    }).reduce((a, b) => {
      a[0].push(b[0]);
      a[1].push(b[1]);
      return a;
    }, [[], []]).map(h => Math.max(...h));

    Array.prototype.forEach.call($('.install-columns .hero-list__item'), el => {
      let index = 0;
      Array.prototype.forEach.call($(el).find('p'), p => {
        p.setAttribute('style', `height: ${heights[index]}px;`);
        index++;
      });
    });
  }

  // Create equal heights for cards
  let createEqualHeight = function(items) {
    let maxHeight = Math.max(...Array.prototype.map.call(items, el => el.offsetHeight));
    Array.prototype.map.call(items, el => el.setAttribute('style', `height: ${maxHeight}px;`));
  };
  createEqualHeight($('.container__content.install-columns .card'));
})();
