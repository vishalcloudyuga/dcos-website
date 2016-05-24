const Blog = (function ($) {
  function init (containerEl) {

    // Initial params
    let offset = 7
    let limit = 6

    let postsCache = []

    const $container = $(containerEl)
    const $postsContainer = $container.find('.posts')
    const $loadMoreButton = $('.load-more')

    $loadMoreButton.on('click', function () {
      const $el = $(this)
      $el.addClass('is-loading')

      if (postsCache.length === 0) postsCache = getPosts()

      postsCache.then(posts => {
        $el.removeClass('is-loading')

        if (posts.length < offset + limit) $el.remove()

        posts
          .slice(offset, (offset + limit))
          .map(preparePostElement)
          .map(addPostToDom($postsContainer))

        offset += limit
      })
    })
  }

  function getPosts (cache, offset, limit) {
    return $.get('/posts/posts.json').then(data => data.result)
  }

  function ellipsis (maxLength, text) {
    return text.length > maxLength ? text.slice(0, maxLength).trim() + '...' : text
  }

  function preparePostElement (post) {
    return `<a class="post"><div class="post__meta"><div class="post__category">${post.category}</div><div class="post__date">${post.formattedDate}</div></div><h2 class="post__title">${ellipsis(52, post.title)}</h2><div class="post__readmore cta cta--text">Read more &rarr;</div></a>`
  }

  function addPostToDom ($containerEl) {
    return function (post) {
      $containerEl.append(post)
    }
  }

  return {
    init
  }
})(jQuery)

window.Blog = Blog
