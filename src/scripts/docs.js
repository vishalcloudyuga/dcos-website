(function() {
    let currentService, currentPlatform;

    const serviceLinks = $$('.service-select a');
    const platformLinks = $$('.platform-select a');


    let initialSetup = function (links, type) {
      for (let i = links.length - 1; i >= 0; i--) {
        links[i].addEventListener('click', function (e) {
          e.preventDefault();
          if(type === 'service') currentService = e.currentTarget.getAttribute(`data-${type}`);
          if(type === 'platform') currentPlatform = e.currentTarget.getAttribute(`data-${type}`);
          nextStep();
        });
      }
    }

    initialSetup(serviceLinks, 'service');
    initialSetup(platformLinks, 'platform');

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

    let nextStep = function () {
      if(currentService != undefined && currentPlatform === undefined) {
        // show platform
        $('.service-select').setAttribute('style', 'display: none;')
        $('.platform-select').removeAttribute('style')
        $('.install').setAttribute('style', 'display: none;')
      } else if(currentService != undefined && currentPlatform != undefined) {
        // show docs
        $('.service-select').setAttribute('style', 'display: none;')
        $('.platform-select').setAttribute('style', 'display: none;')
        $('.install').removeAttribute('style')

        getDocs(`service/${currentService}`, `platform/${currentPlatform}`)
          .then(docs => {
            $('.install').innerHTML = `${docs.service}\n${docs.platform}`
          })

      }
    }

})();