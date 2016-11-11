export default {
  createDetectionCssStyle(identifier) {
    var detection = document.getElementById(identifier);
    if (detection == null) {
      detection = document.createElement('style');
      detection.id = identifier;
      var css = `.${identifier} { animation-duration: 1ms; animation-name: ${identifier}; }\n`;
      ['', '-webkit-', '-moz-', '-o-'].forEach(prefix => {
        css += `@${prefix}keyframes ${identifier} { from { opacity: 0.99; } to { opacity: 1; } }\n`;
      });
      detection.innerHTML = css;
    }

    document.getElementsByTagName('head')[0].appendChild(detection);
  },

  onceElementInserted(element, identifier, callback) {
    this.createDetectionCssStyle(identifier);

    var inserted = function (event) {
      if (event.animationName === identifier) {
        element.removeEventListener('animationstart', identifier);
        callback.call(event.target);
      }
    };

    element.addEventListener('animationstart', inserted);
  },

  onInserted(identifier, callback) {
    this.createDetectionCssStyle(identifier);

    document.addEventListener('animationstart', function(event) {
      if (event.animationName === identifier) {
        callback(event.target);
      }
    }, true);
  }
};