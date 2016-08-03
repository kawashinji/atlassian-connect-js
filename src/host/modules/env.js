import $ from '../dollar';
import EnvActions from '../actions/env_actions';
import EventDispatcher from '../dispatchers/event_dispatcher';
import util from '../util';
import _ from '../underscore';

var debounce = AJS.debounce || $.debounce;
/**
 * Utility methods that are available without requiring additional modules.
 * @exports AP
 */
export default {
  /**
   * get the location of the host page
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
   * resize this iframe
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
  resize: debounce(function(width, height, callback) {
    callback = _.last(arguments);
    var options = callback._context.extension.options;
    if (options && !options.isDialog){
      EnvActions.iframeResize(width, height, callback._context);
    }
  }),
  /**
   * Resizes the iframe, so it takes the entire page. Add-on may define to hide footer using data-options.
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