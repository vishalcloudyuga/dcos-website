(function(){
  if(window.outerWidth >= 414) {
    let heights = Array.prototype.map.call($('.hero-list__item'), el => {
      return Array.prototype.map.call($(el).find('p'), p => p.offsetHeight);
    }).reduce((a, b) => {
      a[0].push(b[0]);
      a[1].push(b[1]);
      return a;
    }, [[], []]).map(h => Math.max(...h));

    Array.prototype.forEach.call($('.hero-list__item'), el => {
      let index = 0;
      Array.prototype.forEach.call($(el).find('p'), p => {
        p.setAttribute('style', `height: ${heights[index]}px;`);
        index++;
      });
    });
  }
})();
