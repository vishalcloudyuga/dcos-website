(function() {
  function scrollToTop (scrollDuration) {
    const scrollHeight = window.scrollY,
      scrollStep = Math.PI / ( scrollDuration / 15 ),
      cosParameter = scrollHeight / 2;
    var scrollCount = 0,
      scrollMargin,
      scrollInterval = setInterval(function() {
        if (window.scrollY !== 0) {
          scrollCount = scrollCount + 1;
          scrollMargin = cosParameter - cosParameter * Math.cos(scrollCount * scrollStep);
          window.scrollTo(0, (scrollHeight - scrollMargin));
        }
        else clearInterval(scrollInterval);
      }, 15);
  }

  // Create equal heights for cards
  let createEqualHeight = function(items) {
    if(window.outerWidth >= 414) {
      let maxHeight = Math.max(...Array.prototype.map.call(items, el => el.offsetHeight));
      Array.prototype.map.call(items, el => el.setAttribute('style', `height: ${maxHeight}px;`));
    }
  };
  createEqualHeight($('.service-select .card'));
  createEqualHeight($('.platform-select .card'));

  $('.platform-select').attr('style', 'display: none')

  let currentService, currentPlatform;

  const serviceLinks = $('.service-select a[data-doc]');
  const platformLinks = $('.platform-select a[data-doc]');

  if(!serviceLinks.length) return;

  // Header animation
  let createServiceElement = function(link) {
    return `
      <div class="service-name" data-current="false">
        <div class="service-name-content"><img src="${$(link).find('img').attr('src')}"/><span>${$(link).attr('data-name')}</span></div>
      </div>
    `
  }

  $('.services-list').html(Array.prototype.map.call(serviceLinks, createServiceElement).join(''));
  $('.platform-list').html(Array.prototype.map.call(platformLinks, createServiceElement).join(''));
  if($('.services-list .service-name').length) $('.services-list .service-name').first().attr('data-current', 'true')
  if($('.platform-list .service-name').length) $('.platform-list .service-name').first().attr('data-current', 'true')

  // Fadeout current, and fadein random item by changing data-current
  let animateItem = function(options) {
    let item;
    let getRandomItem = function() {
      item = options.list[Math.floor(Math.random()*options.list.length)];
      if($(item).find('span').text().replace(/\n|\s/g,'') === options.current.text().replace(/\n|\s/g,'')) getRandomItem(options);
    }
    getRandomItem();

    let removeClasses = `animated fadeIn${options.direction} fadeOut${options.direction} fadeOut fadeIn`;
    options.current.attr('data-current', 'false').removeClass(removeClasses).addClass(`animated fadeOut${options.direction}`);
    $(item).attr('data-current', 'true').removeClass(removeClasses).addClass(`animated fadeIn${options.direction}`);
  }

  setInterval(() => {
    animateItem({list: $('.services-list .service-name'), current: $('.services-list .service-name[data-current="true"]'), direction: (window.matchMedia("(min-width: 736px)").matches ? 'Up' : '')});
    animateItem({list: $('.platform-list .service-name'), current: $('.platform-list .service-name[data-current="true"]'), direction: (window.matchMedia("(min-width: 736px)").matches ? 'Down' : '')});
  }, 4000)

  // Click handlers for services/platforms
  let addClickHandlers = function(links, type) {
    Array.prototype.forEach.call(links, link => {
      $(link).on('click', function (e) {
        e.preventDefault();
        scrollToTop(1000);
        if(type === 'service') currentService = {name: e.currentTarget.getAttribute('data-name'), doc: e.currentTarget.getAttribute('data-doc')};
        if(type === 'platform') currentPlatform = {name: e.currentTarget.getAttribute('data-name'), doc: e.currentTarget.getAttribute('data-doc')};
        nextStep();
      });
    })
  }

  // Setup initial values
  addClickHandlers(serviceLinks, 'service');
  addClickHandlers(platformLinks, 'platform');
  $('.step1').attr('style', 'pointer-events: none;');
  $('.step2').attr('style', 'pointer-events: none;');

  // Convenience method to find a link
  let findItemIn = function(links, term) {
    return Array.prototype.find.call(links, link => { return link.getAttribute('data-name').toLowerCase() === term});
  }

  // Set values back when you click on the first step
  $('.step1').on('click', function(e) {
    e.preventDefault();
    $('.step1').attr('style', 'pointer-events: none;');
    $('.step2').attr('style', 'pointer-events: none;');
    $('.step1 h3').html('Select a service');
    $('.step2 h3').html('Select a platform');

    $('.service-select').removeAttr('style');
    $('.platform-select').attr('style', 'display: none;');
    $('.install').attr('style', 'display: none;');

    $('.step1').removeClass('step-inactive');
    $('.step2').addClass('step-inactive');
    $('.step3').addClass('step-inactive');

    $('.arrow-container').removeClass('step2').removeClass('step3').addClass('step1')

    currentService = undefined;
    currentPlatform = undefined;
    window.location.hash = '!';
  });

  // Set values back when you click on the second step
  $('.step2').on('click', function(e) {
    e.preventDefault();
    $('.step2').attr('style', 'pointer-events: none;');
    $('.step2 h3').html('Select a platform');

    $('.platform-select').removeAttr('style');
    $('.install').attr('style', 'display: none;');

    $('.step2').removeClass('step-inactive');
    $('.step3').addClass('step-inactive');

    $('.arrow-container').removeClass('step3').addClass('step2')

    currentPlatform = undefined;

    window.location.hash = `${currentService.name}`.toLowerCase();
  });

  // Returns the actual md files
  let getDocs = function(servicePath, platformPath) {
    return new Promise(function(resolve, reject) {
      let serviceDoc, platformDoc;
      let gotADoc = function () {
        if(serviceDoc != undefined && platformDoc != undefined) resolve({service: serviceDoc, platform: platformDoc});
      }

      fetch(`/get-started-docs/${servicePath}/`)
        .then(response => response.text())
        .then(body => {
          serviceDoc = body;
          gotADoc()
        })

      fetch(`/get-started-docs/${platformPath}/`)
        .then(response => response.text())
        .then(body => {
          platformDoc = body;
          gotADoc()
        })
    })
  }

  // Go to a specific step
  let step = function(cur) {
    if(cur === 1) {
      // show platform
      $('.service-select').attr('style', 'display: none;');
      $('.platform-select').removeAttr('style');
      $('.install').attr('style', 'display: none;');
      $('.step1').removeAttr('style');

      $('.step1').addClass('step-inactive');
      $('.step2').removeClass('step-inactive');

      $('.arrow-container').removeClass('step1').addClass('step2')

      $('.step1 h3').html(currentService.name);
      window.location.hash = `${currentService.name}`.toLowerCase();
    } else if(cur === 2) {
      // show docs
      $('.service-select').attr('style', 'display: none;');
      $('.platform-select').attr('style', 'display: none;');
      $('.install').removeAttr('style');
      $('.install').addClass('loading');
      $('.step2').removeAttr('style');

      $('.step1').addClass('step-inactive');
      $('.step2').addClass('step-inactive');
      $('.step3').removeClass('step-inactive');

      $('.arrow-container').removeClass('step2').addClass('step3')

      $('.step1 h3').html(currentService.name);
      $('.step2 h3').html(currentPlatform.name);
      window.location.hash = `${currentService.name}+${currentPlatform.name}`.toLowerCase();

      getDocs(currentService.doc, currentPlatform.doc)
        .then(docs => {
          $('.install').html(`${docs.platform}<img src='/assets/images/icons/line.svg' class='getstarted-arrow'>${docs.service}`);
          $('.install').removeClass('loading');
        })
    }
  }

  // Set the next step depending on what has been selected
  let nextStep = function () {
    if(currentService != undefined && currentPlatform === undefined) {
      step(1);
    } else if(currentService != undefined && currentPlatform != undefined) {
      step(2);
    }
  }

  // Set the steps according to the location hash
  if(window.location.hash != "") {
    let serviceHash = window.location.hash.split('+')[0].substr(1);
    let platformHash = window.location.hash.split('+')[1];
    if(serviceHash) {
      let result = findItemIn(serviceLinks, serviceHash);
      if(result) currentService = {name: result.getAttribute('data-name'), doc: result.getAttribute('data-doc')};
      $('.step1').removeAttr('style');
    }
    if(platformHash) {
       let result = findItemIn(platformLinks, platformHash);
       if(result) currentPlatform = {name: result.getAttribute('data-name'), doc: result.getAttribute('data-doc')};
       $('.step2').removeAttr('style');
    }
    nextStep();
  }

})();
