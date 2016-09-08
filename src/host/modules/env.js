import $ from '../dollar';
import EnvActions from '../actions/env_actions';
import EventDispatcher from '../dispatchers/event_dispatcher';
import util from '../util';
import _ from '../underscore';

var debounce = AJS.debounce || $.debounce;
var resizeFuncHolder = {};
/**
 * Utility methods that are available without requiring additional modules.
 * @exports AP
 */
export default {
  /**
   * Get the location of the current page of the host product.
   *
   * @param {Function} callback function (location) {...}
   * @example
   * AP.getLocation(function(location){
   *   alert(location);
   * });
   */
  getLocation: function (callback) {
    callback = _.last(arguments);
    callback(window.location.href);
  },
  /**
   * Resize the iframe to a specified width and height.
   *
   * Only content within an element with the class `ac-content` will be resized automatically.
   * Content without this identifier is sized according to the `body` element, and will dynamically grow, but not shrink.
   * ```
   * <div class="ac-content">
     * <p>Hello World</p>
   * </div>
   * ```
   * Note that this method cannot be used in dialogs.
   *
   * @method
   * @param {String} width   the desired width
   * @param {String} height  the desired height
   */
  resize: function(width, height, callback) {
    callback = _.last(arguments);
    var iframeId = callback._context.extension.id;
    var options = callback._context.extension.options;
    if(options && options.isDialog) {
      return;
    }

    if(!resizeFuncHolder[iframeId]){
      resizeFuncHolder[iframeId] = debounce(function(dwidth, dheight, dcallback){
        EnvActions.iframeResize(dwidth, dheight, dcallback._context);
      });
    }

    resizeFuncHolder[iframeId](width, height, callback);
  },
  /**
   * Resize the iframe, so that it takes the entire page. Add-on may define to hide the footer using data-options.
   *
   * Note that this method is only available for general page modules.
   *
   * @method
   * @param {boolean} hideFooter true if the footer is supposed to be hidden
   */
  sizeToParent: debounce(function (callback) {
    callback = _.last(arguments);
    // sizeToParent is only available for general-pages
    if (callback._context.extension.options.isFullPage) {
      // This adds border between the iframe and the page footer as the connect addon has scrolling content and can't do this
      util.getIframeByExtensionId(callback._context.extension_id).addClass('full-size-general-page');
      EventDispatcher.register('host-window-resize', (data) => {
        EnvActions.sizeToParent(callback._context);
      });
      EnvActions.sizeToParent(callback._context);
    } else {
      // This is only here to support integration testing
      // see com.atlassian.plugin.connect.test.pageobjects.RemotePage#isNotFullSize()
      util.getIframeByExtensionId(callback._context.extension_id).addClass('full-size-general-page-fail');
    }
  })
};

EventDispatcher.register('after:iframe-unload', function(data){
  delete resizeFuncHolder[data.extension.id];
});