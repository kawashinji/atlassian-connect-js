import EventDispatcher from 'dispatchers/event_dispatcher';
import util from '../util';
import IframeComponent from 'components/iframe';

EventDispatcher.register('iframe-resize', function(data){
  IframeComponent.resize(width, height, data.$el);
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
    var $el;
    if(context.extension_id){
      $el = util.getIframeByExtensionId(context.extension_id);
    } else {
      $el = context;
    }

    EventDispatcher.dispatch('iframe-resize', {width, height, $el, extension: context.extension});
  },
  sizeToParent: function(context){
    EventDispatcher.dispatch('iframe-size-to-parent', {context});
  }
}