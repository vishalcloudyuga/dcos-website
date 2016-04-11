Element.prototype.hasClassName = function(name) {
  return new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)").test(this.className);
};

Element.prototype.addClassName = function(name) {
  if (!this.hasClassName(name)) {
    this.className = this.className ? [this.className, name].join(' ') : name;
  }
};

Element.prototype.removeClassName = function(name) {
  if (this.hasClassName(name)) {
    var c = this.className;
    this.className = c.replace(new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)", "g"), "");
  }
};

(function() {
  let currentService, currentPlatform;

  const serviceLinks = $$('.service-select a');
  const platformLinks = $$('.platform-select a');

  // Header animation
  setInterval(function() {
    let serviceLink = serviceLinks[Math.floor(Math.random()*serviceLinks.length)];
    let platformLink = platformLinks[Math.floor(Math.random()*platformLinks.length)];
    $('.getstarted-heading__service').innerHTML = serviceLink.getAttribute('data-name');
    $('.getstarted-heading__platform').innerHTML = platformLink.getAttribute('data-name');
  }, 1000)

  // Steps with Markdown docs
  let addClickHandlers = function(links, type) {
    for (let i = links.length - 1; i >= 0; i--) {
      links[i].addEventListener('click', function (e) {
        e.preventDefault();
        if(type === 'service') currentService = {name: e.currentTarget.getAttribute('data-name'), doc: e.currentTarget.getAttribute('data-doc')};
        if(type === 'platform') currentPlatform = {name: e.currentTarget.getAttribute('data-name'), doc: e.currentTarget.getAttribute('data-doc')};
        nextStep();
      });
    }
  }

  addClickHandlers(serviceLinks, 'service');
  addClickHandlers(platformLinks, 'platform');
  $('.step1').setAttribute('style', 'pointer-events: none;');
  $('.step2').setAttribute('style', 'pointer-events: none;');

  let findItemIn = function(links, term) {
    for (let i = links.length - 1; i >= 0; i--) {
      if(links[i].getAttribute('data-name').toLowerCase() === term) {
        return links[i];
      } else {
        return undefined;
      }
    }
  }

  $('.step1').addEventListener('click', function(e) {
    e.preventDefault();
    $('.step1').setAttribute('style', 'pointer-events: none;');
    $('.step2').setAttribute('style', 'pointer-events: none;');
    $('.step1 h3').innerHTML = 'Select a service';
    $('.step2 h3').innerHTML = 'Select a platform';

    $('.service-select').removeAttribute('style');
    $('.platform-select').setAttribute('style', 'display: none;');
    $('.install').setAttribute('style', 'display: none;');

    $('.step1').removeClassName('step-inactive');
    $('.step2').addClassName('step-inactive');
    $('.step3').addClassName('step-inactive');

    currentService = undefined;
    currentPlatform = undefined;
    window.location.hash = '!';
  });

  $('.step2').addEventListener('click', function(e) {
    e.preventDefault();
    $('.step2').setAttribute('style', 'pointer-events: none;');
    $('.step2 h3').innerHTML = 'Select a platform';

    $('.platform-select').removeAttribute('style');
    $('.install').setAttribute('style', 'display: none;');

    $('.step2').removeClassName('step-inactive');
    $('.step3').addClassName('step-inactive');

    currentPlatform = undefined;

    window.location.hash = `${currentService.name}`.toLowerCase();
  });

  let getDocs = function(servicePath, platformPath) {
    return new Promise(function(resolve, reject) {
      let serviceDoc, platformDoc;
      let gotADoc = function () {
        if(serviceDoc != undefined && platformDoc != undefined) resolve({service: serviceDoc, platform: platformDoc});
      }

      fetch(`/docs/${servicePath}`)
        .then(response => response.text())
        .then(body => {
          serviceDoc = body;
          gotADoc()
        })

      fetch(`/docs/${platformPath}`)
        .then(response => response.text())
        .then(body => {
          platformDoc = body;
          gotADoc()
        })
    })
  }

  let step = function(c) {
    if(c === 1) {
      // show platform
      $('.service-select').setAttribute('style', 'display: none;');
      $('.platform-select').removeAttribute('style');
      $('.install').setAttribute('style', 'display: none;');
      $('.step1').removeAttribute('style');

      $('.step1').addClassName('step-inactive');
      $('.step2').removeClassName('step-inactive');

      $('.step1 h3').innerHTML = currentService.name;
      window.location.hash = `${currentService.name}`.toLowerCase();
    } else if(c === 2) {
      // show docs
      $('.service-select').setAttribute('style', 'display: none;');
      $('.platform-select').setAttribute('style', 'display: none;');
      $('.install').removeAttribute('style');
      $('.step2').removeAttribute('style');

      $('.step1').addClassName('step-inactive');
      $('.step2').addClassName('step-inactive');
      $('.step3').removeClassName('step-inactive');

      $('.step1 h3').innerHTML = currentService.name;
      $('.step2 h3').innerHTML = currentPlatform.name;
      window.location.hash = `${currentService.name}#${currentPlatform.name}`.toLowerCase();

      getDocs(currentService.doc, currentPlatform.doc)
        .then(docs => {
          $('.install').innerHTML = `${docs.service}\n${docs.platform}`;
        })
    }
  }

  let nextStep = function () {
    if(currentService != undefined && currentPlatform === undefined) {
      step(1);
    } else if(currentService != undefined && currentPlatform != undefined) {
      step(2);
    }
  }

  if(window.location.hash != "") {
    let serviceHash = window.location.hash.split('#')[1];
    let platformHash = window.location.hash.split('#')[2];
    if(serviceHash) {
      let result = findItemIn(serviceLinks, serviceHash);
      if(result) currentService = {name: result.getAttribute('data-name'), doc: result.getAttribute('data-doc')};
      $('.step1').removeAttribute('style');
    }
    if(platformHash) {
       let result = findItemIn(platformLinks, platformHash);
       if(result) currentPlatform = {name: result.getAttribute('data-name'), doc: result.getAttribute('data-doc')};
       $('.step2').removeAttribute('style');
    }
    nextStep();
  }

})();