(function () {
  var IDENTIFIER = 'insertion-detection-iframe-script';

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

  function createDetectionCssStyle(identifier) {
    var detection = document.getElementById(identifier);
    if (detection == null) {
      detection = document.createElement('style');
      detection.id = identifier;
      var css = '.' + identifier + ' { animation-duration: 1ms; animation-name: ' + identifier + '; }\n';
      ['', '-webkit-', '-moz-', '-o-'].forEach(function(prefix) {
        css += '@' + prefix + 'keyframes ' + identifier + ' { from { opacity: 0.99; } to { opacity: 1; } }\n';
      });
      detection.innerHTML = css;
    }

    document.getElementsByTagName('head')[0].appendChild(detection);
  }

  function onInserted(identifier, callback) {
    createDetectionCssStyle(identifier);

    document.addEventListener('animationstart', function(event) {
      if (event.animationName === identifier) {
        callback(event.target);
      }
    }, true);
  }

  // Bootstrap all scrips that statically and dynamically added.
  // We added an animation to the element and detect the insertion by "animationstart".
  onInserted(IDENTIFIER, bootstrap);
})();