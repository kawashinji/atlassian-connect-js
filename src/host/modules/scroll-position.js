import util from '../util';
import $ from '../dollar';

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
      var $el = util.getIframeByExtensionId(callback._context.extension_id);
      var offset = $el.offset();
      var $window = $(window);

      callback({
        scrollY: $window.scrollTop() - offset.top,
        scrollX: $window.scrollLeft() - offset.left,
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
  },
  /**
   * Sets the vertical scroll position relative to the add-on
   *
   * @param y {Number} The new vertical scroll position in pixels
   * @noDemo
   * @example
   * AP.scrollPosition.setVerticalPosition(200);
   */
  setVerticalPosition: function(y, callback) {
    callback = util.last(arguments);
    if (callback._context.extension.options && callback._context.extension.options.isFullPage) {
      var $el = util.getIframeByExtensionId(callback._context.extension_id);
      var offset = $el.offset();
      if(typeof y === 'number') {
        document.documentElement.scrollTop = offset.top + y;
      }
    }
  }
};