(function () {
  function bootstrap(element) {
    try {
      var iFrameData = JSON.parse(element.getAttribute('data-json').trim());
    } finally {
      // Remove the blob so we don't initialise it twice
      element.remove();
    }

    if (typeof AP === 'object') {
      //If we are a plugin frame
      AP.require('_create-inner-frame', function (createInnerFrame) {
        createInnerFrame(iFrameData);
      });
    } else {
      _AP.addonOriginMap = iFrameData.addonOriginMap || {};
      // We don't want the dependency checking on build
      // The require here should be lazy
      window.require(['connect-host', 'ac/cookie', 'ac/env', 'ac/inline-dialog', 'ac/dialog', 'ac/messages', 'ac/request', 'ac/history', 'ac/scrollPosition'], function (host) {
        host.create(iFrameData);
      });
    }
  }

  function getScripts() {
    return Array.prototype.slice.call(document.getElementsByClassName('ap-iframe-body-script'), 0);
  }

  if (typeof AP === 'object') {
    // Bootstrap any iframe body script being added to the DOM
    // It can be:
    // - JSON blob being placed on the page
    // - JSON dynamically inserted on page by dialog
    // - Macro rendered by an iframe
    var observer = new MutationObserver(function (mutations) {
      var addedNode = false;
      mutations.forEach(function (mutation) {
        if (mutation.addedNodes.length) {
          addedNode = true;
          return false;
        }
      });

      if (addedNode) {
        getScripts().forEach(bootstrap);
      }
    });
    observer.observe(document, {childList: true, subtree: true});
  } else {
    // We don't need observer on host level
    AJS.$(function() {
      getScripts().forEach(bootstrap);
    });
  }
})();