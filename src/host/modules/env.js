import $ from '../dollar';
import EnvActions from '../actions/env_actions';
import EventDispatcher from '../dispatchers/event_dispatcher';
import util from '../util';
import _ from '../underscore';
import Providers from '../providers';

var debounce = AJS.debounce || $.debounce;
var resizeFuncHolder = {};
// ignore resize events for iframes that use sizeToParent
var ignoreResizeForExtension = [];
var sizeToParentExtension = {};

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
    let addon = Providers.getProvider('addon');
    if (addon) {
      addon.resize(width, height, callback._context);
    }
    else {
      var iframeId = callback._context.extension.id;
      var options = callback._context.extension.options;
      if(ignoreResizeForExtension.indexOf(iframeId) !== -1 || (options && options.isDialog)) {
        return false;
      }

      if(!resizeFuncHolder[iframeId]){
        resizeFuncHolder[iframeId] = debounce(function(dwidth, dheight, dcallback){
          EnvActions.iframeResize(dwidth, dheight, dcallback._context);
        }, 50);
      }

      resizeFuncHolder[iframeId](width, height, callback);
    }
    return true;
  },
  /**
   * Resize the iframe, so that it takes the entire page. Add-on may define to hide the footer using data-options.
   *
   * Note that this method is only available for general page modules.
   *
   * @method
   * @param {boolean} hideFooter true if the footer is supposed to be hidden
   */
  sizeToParent: debounce(function (hideFooter, callback) {
    callback = _.last(arguments);
    let addon = Providers.getProvider('addon');
    if (addon) {
      addon.sizeToParent(hideFooter, callback._context);
    } else {
      // sizeToParent is only available for general-pages
      if (callback._context.extension.options.isFullPage) {
        // This adds border between the iframe and the page footer as the connect addon has scrolling content and can't do this
        util.getIframeByExtensionId(callback._context.extension_id).addClass('full-size-general-page');
        EnvActions.sizeToParent(callback._context.extension_id, hideFooter);
        sizeToParentExtension[callback._context.extension_id] = {hideFooter: hideFooter};
      } else {
        // This is only here to support integration testing
        // see com.atlassian.plugin.connect.test.pageobjects.RemotePage#isNotFullSize()
        util.getIframeByExtensionId(callback._context.extension_id).addClass('full-size-general-page-fail');
      }
    }
  })
};

EventDispatcher.register('host-window-resize', (data) => {
  Object.getOwnPropertyNames(sizeToParentExtension).forEach((extensionId) => {
    EnvActions.sizeToParent(extensionId, sizeToParentExtension[extensionId].hideFooter);
  });
});

EventDispatcher.register('after:iframe-unload', function(data){
  delete resizeFuncHolder[data.extension.id];
  delete sizeToParentExtension[data.extension.id];
  if(ignoreResizeForExtension.indexOf(data.extension.id) !== -1) {
    ignoreResizeForExtension.splice(ignoreResizeForExtension.indexOf(data.extension.id), 1);
  }
});

EventDispatcher.register('before:iframe-size-to-parent', function(data){
  if(ignoreResizeForExtension.indexOf(data.extensionId) === -1) {
    ignoreResizeForExtension.push(data.extensionId);
  }
});

