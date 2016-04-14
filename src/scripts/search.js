(function() {
  const version = 'latest';

  let debounce = function (fn) {
    let timeout;
    return function () {
      let args  = Array.prototype.slice.call(arguments);
      let ctx   = this;

      clearTimeout(timeout)
      timeout = setTimeout(() => { fn.apply(ctx, args) }, 100)
    }
  }

  const searchInput = $('.docs-search__input');
  searchInput.setAttribute('disabled', 'disabled');

  fetch(`/docs/${version}/lunr.json`)
    .then(response => response.text())
    .then(body => {
      searchInput.removeAttribute('disabled');
      const idx = lunr.Index.load(JSON.parse(body));

      searchInput.addEventListener('keyup', debounce(function (event) {
        var query = searchInput.value;
        if (query < 2) return;

        let results = idx.search(query);
        console.log(results);

        // compare results with bootstrapped data
      }))
    })

})()
