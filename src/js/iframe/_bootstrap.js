// Bootstrap nested connect script inside connect iframe
(function() {
  function bootstrap(element) {
    var bootstrapData = element.innerHTML.replace(/^\s*\/\/<!\[CDATA\[/, '').replace(/\/\/]]>\s*$/, '').trim();
    var iFrameData = JSON.parse(bootstrapData);

    if(typeof AP === 'object') {
      //If we are a plugin frame
      AP.require('_create-inner-frame', function(createInnerFrame) {
        createInnerFrame(iFrameData);
      });
    } else {
      _AP.addonOriginMap = iFrameData.addonOriginMap || {};
      require(['connect-host', 'ac/cookie', 'ac/env', 'ac/inline-dialog', 'ac/dialog', 'ac/messages', 'ac/request', 'ac/history', 'ac/scrollPosition'], function(host){
        host.create(iFrameData);
      });
    }
  }

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length && mutation.addedNodes[0].className === 'ap-iframe-body-script') {
        bootstrap(mutation.addedNodes[0]);
      }
    });
  });
  observer.observe(document, { childList: true, subtree: true });
})();




