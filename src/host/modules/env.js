import $ from '../dollar';
import EnvActions from 'actions/env_actions';
import EventDispatcher from 'dispatchers/event_dispatcher';
import util from '../util';

var debounce = AJS.debounce || $.debounce;

export default {
  getLocation: function (callback) {
    callback(window.location.href);
  },
  resize: debounce(function(width, height, callback) {
    EnvActions.iframeResize(width, height, callback._context);
  }),

  sizeToParent: debounce(function (callback) {
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
      $(this.iframe).addClass('full-size-general-page-fail');
    }
  })
};