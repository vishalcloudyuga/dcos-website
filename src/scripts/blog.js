const Blog = (function($) {

  function init (containerEl) {

    // Initial params
    let offset = 7
    let limit = 6

    const $container = $(containerEl)
    const postsContainer = $container.find('.posts')
    const $loadMoreButton = $('.load-more')

    const loadMoreCallback = () => equalHeight(postsContainer)
    const getPostsFromCache = getPosts()

    equalHeight(postsContainer)

    $loadMoreButton.on('click', function () {
      loadMore.bind(this)(postsContainer, getPostsFromCache(), offset, limit, loadMoreCallback)
        .then(() => offset += limit)
    })
  }

  function equalHeight (container) {
    const $container = $(container)
    let maxHeight = 0

    $container.children().each(function () {
      const $el = $(this)
      const height = $el.innerHeight()
      if (height > maxHeight) maxHeight = height
    })

    $container.children().each(function () {
      $(this).css('height', maxHeight)
    })
  }

  function loadMore (container, posts, offset, limit, cb) {
    const $el = $(this)
    $el.addClass('is-loading')

    return posts.then(_posts => {
      $el.removeClass('is-loading')

      if (_posts.length < (offset + limit)) $el.remove()

      _posts
        .slice(offset, (offset + limit))
        .map(preparePostElement)
        .map(addPostToDom(container))

      if (typeof cb === 'function') cb(_posts)
    })
  }

  function getPosts () {
    let cache = []

    return function () {
      return cache.length > 0
        ? $.when(cache)
        : $.get('/posts/posts.json').then(data => {
          cache = data.result
          return $.when(cache)
        })
    }
  }

  function ellipsis (maxLength, text) {
    return text.length > maxLength ? text.slice(0, maxLength).trim() + '...' : text
  }

  function preparePostElement (post) {
    return `<a class="post"><div class="post__meta"><div class="post__category">${post.category}</div><div class="post__date">${post.formattedDate}</div></div><h2 class="post__title">${ellipsis(52, post.title)}</h2><div class="post__readmore cta cta--text">Read more &rarr;</div></a>`
  }

  function addPostToDom ($containerEl) {
    return function(post) {
      $containerEl.append(post)
    }
  }

  return {
    init
  }

})(jQuery)

window.Blog = Blog
