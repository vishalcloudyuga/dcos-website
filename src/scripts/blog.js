window.blog = (function ($) {
  class BlogController {

    constructor (containerEl) {
      this.params = {
        offset: 7,
        limit: 6,
        category: null
      }

      this.posts = []
      this.lunrIndex = null

      this.$container = $(containerEl)
      this.$postsContainer = this.$container.find('.posts')
      this.$loadMoreButton = this.$container.find('.load-more')
      this.$categorySelect = this.$container.find('.categories')
      this.$searchForm = this.$container.find('.search-container')
      this.$searchInput = this.$container.find('.search')

      this.getPosts = memoize(() => $.get('/blog/posts.json').then(data => $.when(data.result)))

      equalHeight(this.$postsContainer)

      this.bindEventHandlers()
      this.initLunr()
    }

    bindEventHandlers () {
      this.$loadMoreButton.on('click', this.loadMorePosts.bind(this))

      this.$categorySelect.on('change', function () {
        const category = $(this).val()
        window.location.href = category === 'all'
          ? `${window.location.origin}/blog` // 'all' should redirect to blog index
          : `${window.location.origin}/blog/category/${category}`
      })

      this.$searchForm.on('submit', (e) => {
        e.preventDefault()
        if (!this.lunrIndex) return // TODO
        const searchTerms = this.$searchInput.val()
        const refs = this.lunrIndex.search(searchTerms)

        this.getPosts().then(posts => {
          const results = refs.sort(sortProp('score')).reverse().map(item => this.getPostFromRef(posts, item.ref))
          const restore = this.render(this.$postsContainer, results.map(this.createPostElement), true)
        })
      })
    }

    filterPosts (posts, offset, limit, category) {
      return posts
        .filter(post => category ? post.category === category : true)
        .slice(offset, (offset + limit))
    }

    loadMorePosts (e) {
      const $el = $(e.currentTarget)

      $el.addClass('is-loading')

      this.getPosts().then(posts => {
        $el.removeClass('is-loading')
        const {offset, limit, category} = this.params

        const filteredPosts = this.filterPosts(posts, offset, limit, category)
          .map(this.createPostElement)

        this.render(this.$postsContainer, filteredPosts)
        this.params.offset += this.params.limit
        equalHeight(this.$postsContainer)
      })
    }

    createPostElement (post) {
      return `<a class="post"><div class="post__meta"><div class="post__category">${post.category}</div><div class="post__date">${post.formattedDate}</div></div><h2 class="post__title">${ellipsis(52, post.title)}</h2><div class="post__readmore cta cta--text">Read more &rarr;</div></a>`
    }

    render ($parentEl, elements, replaceContent = false) {
      let _this = this
      let $oldElements = $parentEl.clone().children()
      if (replaceContent) $parentEl.empty()

      $parentEl.append(...elements)

      return function restore () {
        _this.render($parentEl, $oldElements, true)
      }
    }

    hideFeaturedPost () {}

    showFeaturedPost () {}

    // Lunr

    initLunr () {
      return $.get('/blog/search-index.json', index => {
        this.lunrIndex = window.lunr.Index.load(index)
      })
    }

    getPostFromRef (posts, ref) {
      return posts.filter(post => ref.indexOf(post.path) > -1)[0]
    }

  }

  // Utility functions

  function ellipsis (maxLength, text) {
    return text.length > maxLength ? text.slice(0, maxLength).trim() + '...' : text
  }

  function equalHeight ($container) {
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

  function memoize (func) {
    const memo = {}
    const slice = Array.prototype.slice

    return function () {
      const args = slice.call(arguments)

      if (args in memo) return memo[args]
      else return (memo[args] = func.apply(this, args))
    }
  }

  function sortProp (prop) {
    return function (a, b) {
      if (a[prop] > b[prop]) return 1
      if (a[prop] < b[prop]) return -1
      return 0
    }
  }

  return {
    init: function (containerEl) {
      new BlogController(containerEl)
    }
  }
})(window.jQuery)
