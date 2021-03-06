import EventDispatcher from '../dispatchers/event_dispatcher';
import util from '../util';
import IframeComponent from '../components/iframe';
import $ from '../dollar';

EventDispatcher.register('iframe-resize', function(data) {
  IframeComponent.resize(data.width, data.height, data.$el);
});

EventDispatcher.register('iframe-size-to-parent', function(data) {
  var height;
  var $el = util.getIframeByExtensionId(data.extensionId);
  height = $(window).height() - $el.offset().top - 1; //1px comes from margin given by full-size-general-page

  EventDispatcher.dispatch('iframe-resize', {
    width: '100%',
    height: height + 'px',
    $el
  });
});

EventDispatcher.register('hide-footer', function(hideFooter) {
  if (hideFooter) {
    $('#footer').css({ display: 'none' });
  }
});


window.addEventListener('resize', function(e){
  EventDispatcher.dispatch('host-window-resize', e);
}, true);

export default {
  iframeResize: function(width, height, context) {
    var $el;
    if (context.extension_id) {
      $el = util.getIframeByExtensionId(context.extension_id);
    } else {
      $el = context;
    }

    EventDispatcher.dispatch('iframe-resize', { width, height, $el, extension: context.extension });
  },
  sizeToParent: function(extensionId, hideFooter) {
    EventDispatcher.dispatch('iframe-size-to-parent', {
      hideFooter: hideFooter,
      extensionId: extensionId
    });
  },
  hideFooter: function(hideFooter) {
    EventDispatcher.dispatch('hide-footer', hideFooter);
  }
};
