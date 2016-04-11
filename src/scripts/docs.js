(function() {
  fetch('/docs/test.html')
    .then(function(response) {
      return response.text()
    }).then(function(body) {
      $('.card-container').innerHTML = body
      // document.body.innerHTML = body
    })

})();