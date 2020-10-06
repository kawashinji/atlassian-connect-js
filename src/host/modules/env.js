import EnvActions from '../actions/env_actions';
import EventDispatcher from '../dispatchers/event_dispatcher';
import util from '../util';
import ModuleProviders from '../module-providers';

var debounce = util.debounce;
var resizeFuncHolder = {};
// ignore resize events for iframes that use sizeToParent
var ignoreResizeForExtension = [];
var sizeToParentExtension = {};

/**
 * Enables apps to resize their iframe and show or hide the iframe footer.
 * @exports iframe
 */
export default {
  /**
   * Get the location of the current page of the host product.
   *
   * @param {Function} callback function (location) {...} The callback to pass the location to.
   * @example
   * AP.getLocation(function(location){
   *   alert(location);
   * });
   */
  getLocation: function(callback) {
    callback = util.last(arguments);
    let pageLocationProvider = ModuleProviders.getProvider('get-location');
    if (typeof pageLocationProvider === 'function') {
      callback(pageLocationProvider());
    } else {
      callback(window.location.href);
    }
  },
  /**
   * Resize the iframe to a width and height.
   *
   * Only content within an element with the class `ac-content` is resized automatically.
   * Content without this identifier is sized according to the `body` element, and
   * is *not* dynamically resized. The recommended DOM layout for your app is:
   * 
   * ``` html
   * <div class="ac-content">
   *     <p>Hello World</p>
   *     <div id="your-id-here">
   *         <p>Addon content goes here</p>
   *     </div>
   * 
   *     ...this area reserved for our resize sensor divs
   * </div>
   * ```
   * 
   * The resize sensor div is added on the iframe's [load event](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event).
   * Removing the `ac-content` element after this, prevents resizing from working correctly.
   * 
   ,* This method cannot be used in dialogs.
   *
   * @method
   * @param {String} width   The desired width.
   * @param {String} height  The desired height.
   */
  resize: function(width, height, callback) {
    callback = util.last(arguments);
    let addon = ModuleProviders.getProvider('addon');
    if (addon) {
      addon.resize(width, height, callback._context);
    } else {
      var iframeId = callback._context.extension.id;
      var options = callback._context.extension.options;
      if (ignoreResizeForExtension.indexOf(iframeId) !== -1 || (options && options.isDialog)) {
        return false;
      }

      if (!resizeFuncHolder[iframeId]) {
        resizeFuncHolder[iframeId] = debounce(function(dwidth, dheight, dcallback) {
          EnvActions.iframeResize(dwidth, dheight, dcallback._context);
        }, 50);
      }

      resizeFuncHolder[iframeId](width, height, callback);
    }
    return true;
  },
  /**
   * Resize the iframe so that it takes the entire page and, optionally, hide the footer.
   *
   * This method is only available for general page modules.
   *
   * @method
   * @param {boolean} hideFooter Whether the footer should be hidden.
   */
  sizeToParent: debounce(function(hideFooter, callback) {
    callback = util.last(arguments);
    let addon = ModuleProviders.getProvider('addon');
    if (addon) {
      addon.sizeToParent(hideFooter, callback._context);
    } else {
      // sizeToParent is only available for general-pages
      if (callback._context.extension.options.isFullPage) {
        // This adds border between the iframe and the page footer as the connect addon has scrolling content and can't do this
        util.getIframeByExtensionId(callback._context.extension_id).addClass('full-size-general-page');
        EnvActions.sizeToParent(callback._context.extension_id, hideFooter);
        sizeToParentExtension[callback._context.extension_id] = { hideFooter: hideFooter };
      } else {
        // This is only here to support integration testing
        // see com.atlassian.plugin.connect.test.pageobjects.RemotePage#isNotFullSize()
        util.getIframeByExtensionId(callback._context.extension_id).addClass('full-size-general-page-fail');
      }
    }
  }),
   /**
   * Hide the footer.
   *
   * @method
   * @param {boolean} hideFooter Whether the footer should be hidden.
   */
  hideFooter: function(hideFooter) {
    if (hideFooter) {
      EnvActions.hideFooter(hideFooter);
    }
  }
};

EventDispatcher.register('host-window-resize', data => {
  Object.getOwnPropertyNames(sizeToParentExtension).forEach(extensionId => {
    EnvActions.sizeToParent(extensionId, sizeToParentExtension[extensionId].hideFooter);
  });
});

EventDispatcher.register('after:iframe-unload', function(data) {
  delete resizeFuncHolder[data.extension.id];
  delete sizeToParentExtension[data.extension.id];
  if (ignoreResizeForExtension.indexOf(data.extension.id) !== -1) {
    ignoreResizeForExtension.splice(ignoreResizeForExtension.indexOf(data.extension.id), 1);
  }
});

EventDispatcher.register('before:iframe-size-to-parent', function(data) {
  if (ignoreResizeForExtension.indexOf(data.extensionId) === -1) {
    ignoreResizeForExtension.push(data.extensionId);
  }
});
