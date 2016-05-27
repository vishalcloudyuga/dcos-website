window.blog = (function ($) {
  class BlogController {

    constructor (containerEl, params) {
      this.params = $.extend({
        offset: 0,
        limit: 6,
        category: null
      }, params)

      this.lunrIndex = null

      this.$container = $(containerEl)
      this.$postsContainer = this.$container.find('.posts')
      this.$featuredPost = this.$container.find('.latest-post')
      this.$loadMoreButton = this.$container.find('.load-more')
      this.$categorySelect = this.$container.find('.categories')
      this.$searchForm = this.$container.find('.search-container')
      this.$searchInput = this.$container.find('.search')
      this.$noResultsContainer = this.$container.find('.not-found')
      this.$showAllLink = this.$container.find('.show-all-posts')
      this.$filterBar = this.$container.find('.filter-bar')

      this.getPosts = memoize(() => $.get('/blog/posts.json').then(data => $.when(data.result)))

      equalHeight(this.$postsContainer)

      this.bindEventHandlers()
      this.initLunr()
    }

    bindEventHandlers () {
      this.$loadMoreButton.on('click', this.loadMorePosts.bind(this))

      this.$categorySelect.on('change', e => {
        const $el = $(e.currentTarget)
        const category = $el.val()

        if (category === 'all') return this.showAllPosts()

        this.params.category = category
        this.params.offset = 0

        this.showCategoryPosts(category)
      })

      this.$searchForm.on('submit', (e) => {
        e.preventDefault()
        if (!this.lunrIndex) return // TODO

        const searchTerms = this.$searchInput.val()

        this.showSearchResults(searchTerms)
      })

      this.$showAllLink.on('click', () => {
        this.showAllPosts()
      })
    }

    loadMorePosts (e) {
      const $el = $(e.currentTarget)

      $el.addClass('is-loading')

      this.getPosts().then(posts => {
        $el.removeClass('is-loading')
        const {offset, limit, category} = this.params

        const postElements = posts
          .filter(filterProp('category', category))
          .slice(offset, (offset + limit))
          .map(this.createPostElement)

        this.render(this.$postsContainer, postElements, false)

        this.params.offset += this.params.limit
        equalHeight(this.$postsContainer)
      })
    }

    showAllPosts () {
      this.hideNoResults()
      this.showFeaturedPost()
      this.resetSearch()
      this.resetCategoryFilter()
      this.hideFilterBar()

      this.$loadMoreButton.addClass('is-loading')

      this.params.offset = 1 // account for featured post

      this.getPosts().then(posts => {
        const results = posts.slice(this.params.offset, (this.params.offset + this.params.limit))

        this.render(this.$postsContainer, results.map(this.createPostElement), true)
        equalHeight(this.$postsContainer)

        if (results.length < this.params.limit) this.hideLoadMoreButton()
        else this.showLoadMoreButton()

        this.$loadMoreButton.removeClass('is-loading')

        this.params.offset += results.length

        if (results.length === 0) this.showNoResults()
      })
    }

    showCategoryPosts (category) {
      this.hideNoResults()
      this.hideFeaturedPost()
      this.resetSearch()
      this.hideFilterBar()

      this.$loadMoreButton.addClass('is-loading')

      this.params.offset = 0

      this.getPosts().then(posts => {
        const results = posts.filter(filterProp('category', category))
        const paginatedResults = results.slice(this.params.offset, (this.params.offset + 8))

        console.log(results)

        this.render(this.$postsContainer, results.map(this.createPostElement), true)
        equalHeight(this.$postsContainer)

        if (results.length < this.params.limit) this.hideLoadMoreButton()
        else this.showLoadMoreButton()

        this.$loadMoreButton.removeClass('is-loading')

        this.showFilterBar(results.length, category)

        this.params.offset += paginatedResults.length

        if (results.length === 0) this.showNoResults()
      })
    }

    showSearchResults (searchTerms) {
      this.hideFeaturedPost()
      this.hideNoResults()
      this.resetCategoryFilter()
      this.hideFilterBar()

      const refs = this.lunrIndex.search(searchTerms)

      this.$loadMoreButton.addClass('is-loading')

      this.params.offset = 0

      this.getPosts().then(posts => {
        const results = refs.sort(sortProp('score')).reverse().map(item => this.getPostFromRef(posts, item.ref))

        const restore = this.render(this.$postsContainer, results.map(this.createPostElement), true)
        equalHeight(this.$postsContainer)

        if (results.length < this.params.limit) this.hideLoadMoreButton()
        else this.showLoadMoreButton()

        this.$loadMoreButton.removeClass('is-loading')

        this.showFilterBar(results.length, searchTerms)

        this.params.offset += results.length

        if (results.length === 0) this.showNoResults()
      })
    }

    resetSearch () {
      this.$searchInput.val('')
    }

    resetCategoryFilter () {
      this.params.category = null
      this.$categorySelect.val('all').attr('selected', 'selected')
    }

    showLoadMoreButton () {
      this.$loadMoreButton.show()
    }

    hideLoadMoreButton () {
      this.$loadMoreButton.hide()
    }

    showNoResults () {
      this.$postsContainer.hide()
      this.$noResultsContainer.show()
    }

    hideNoResults () {
      this.$postsContainer.show()
      this.$noResultsContainer.hide()
    }

    showFilterBar (resultCount, filter) {
      this.$filterBar.find('.result-text').remove()
      this.$filterBar.prepend(`<p class='result-text'>${resultCount} ${resultCount > 1 ? 'results' : 'result'} for <strong>${filter}</strong></p>`)
      this.$filterBar.show()
    }

    hideFilterBar () {
      this.$filterBar.hide()
    }

    showFeaturedPost () {
      this.$featuredPost.show()
    }

    hideFeaturedPost () {
      this.$featuredPost.hide()
    }

    createPostElement (post) {
      return `<a class="post"><div class="post__meta"><div class="post__category">${post.category}</div><div class="post__date">${post.formattedDate}</div></div><h2 class="post__title">${ellipsis(52, post.title)}</h2><div class="post__readmore cta cta--text">Read more &rarr;</div></a>`
    }

    render ($parentEl, elements, replaceContent = true) {
      let _this = this
      let $oldElements = $parentEl.clone().children()
      if (replaceContent) $parentEl.empty()

      $parentEl.append(...elements)

      return function restore () {
        _this.render($parentEl, $oldElements)
      }
    }

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
    return (a, b) => {
      if (a[prop] > b[prop]) return 1
      if (a[prop] < b[prop]) return -1
      return 0
    }
  }

  function filterProp (prop, value) {
    return item => value ? item[prop] === value : true
  }

  return {
    init: function (containerEl, params) {
      new BlogController(containerEl, params)
    }
  }
})(window.jQuery)
