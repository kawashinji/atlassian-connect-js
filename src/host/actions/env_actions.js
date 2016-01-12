import EventDispatcher from 'dispatchers/event_dispatcher';
import util from '../util';

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

module.exports = {
  iframeResize: function(width, height, context){
    EventDispatcher.dispatch('iframe-resize', {width, height, context});
  },
  sizeToParent: function(context){
    EventDispatcher.dispatch('iframe-size-to-parent', {context});
  }
}