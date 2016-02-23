import EventDispatcher from 'dispatchers/event_dispatcher';
import util from '../util';

EventDispatcher.register('iframe-resize', function(data){
  var width = util.stringToDimension(data.width);
  var height = util.stringToDimension(data.height);
  data.$el.css({
    width: width,
    height: height
  });
  data.$el.trigger('resized', {width: width, height: height});
});

EventDispatcher.register('iframe-size-to-parent', function(data){
  var height = AJS.$(document).height() - AJS.$('#header > nav').outerHeight() - AJS.$('#footer').outerHeight() - 20;
  var $el = util.getIframeByExtensionId(data.context.extension_id);
  EventDispatcher.dispatch('iframe-resize', {width: '100%', height: height + 'px', $el});
});

AJS.$(window).on('resize', function (e) {
  EventDispatcher.dispatch('host-window-resize', e);
});

module.exports = {
  iframeResize: function(width, height, context){
    var $el = util.getIframeByExtensionId(context.extension_id);
    EventDispatcher.dispatch('iframe-resize', {width, height, $el});
  },
  sizeToParent: function(context){
    EventDispatcher.dispatch('iframe-size-to-parent', {context});
  }
}