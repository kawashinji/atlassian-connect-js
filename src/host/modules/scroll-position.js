import util from '../util';

export default {
  /**
   * Get's the scroll position relative to the browser viewport
   *
   * @param callback {Function} callback to pass the scroll position
   * @noDemo
   * @example
   * AP.scrollPosition.getPosition(function(obj) { console.log(obj); });
   */
  getPosition: function (callback) {
    callback = util.last(arguments);
    // scrollPosition.getPosition is only available for general-pages
    if (callback._context.extension.options.isFullPage) {
      var el = document.getElementById(callback._context.extension_id);
      var rect = el.getBoundingClientRect();
      var win = el.ownerDocument.defaultView;

      var offset = {
        top: rect.top + win.pageYOffset,
        left: rect.left + win.pageXOffset
      };

      callback({
        scrollY: document.documentElement.scrollTop - offset.top,
        scrollX: document.documentElement.scrollLeft - offset.left,
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
  }
};
