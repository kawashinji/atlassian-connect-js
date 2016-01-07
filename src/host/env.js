import $ from './dollar';
import EventDispatcher from './event-dispatcher';
import util from './util';

var debounce = AJS.debounce || $.debounce;

EventDispatcher.register('iframe-resize', function(data){
  util.getIframeByExtensionId(data.context.extension_id).css({
    width: util.stringToDimension(data.width),
    height: util.stringToDimension(data.height)
  });
});

EventDispatcher.register('iframe-size-to-parent', function(data){
  var height = $(document).height() - $('#header > nav').outerHeight() - $('#footer').outerHeight() - 20;
  EventDispatcher.dispatch('iframe-resize', {width: '100%', height: height + 'px', context: data.context});
});

$(window).on('resize', function (e) {
  EventDispatcher.dispatch('host-window-resize', e);
});

export default {
  getLocation: function (callback) {
    callback(window.location.href);
  },
  resize: debounce(function(width, height, callback) {
    EventDispatcher.dispatch('iframe-resize', {width, height, context: callback._context});
  }),

  sizeToParent: debounce(function (callback) {
    // sizeToParent is only available for general-pages
    if (callback._context.extension.options.isGeneral) {
      // This adds border between the iframe and the page footer as the connect addon has scrolling content and can't do this
      util.getIframeByExtensionId(callback._context.extension_id).addClass('full-size-general-page');
      EventDispatcher.register('host-window-resize', (data) => {
        EventDispatcher.dispatch('iframe-size-to-parent', {context: callback._context});
      });
      EventDispatcher.dispatch('iframe-size-to-parent', {context: callback._context});
    } else {
      // This is only here to support integration testing
      // see com.atlassian.plugin.connect.test.pageobjects.RemotePage#isNotFullSize()
      $(this.iframe).addClass('full-size-general-page-fail');
    }
  })
};