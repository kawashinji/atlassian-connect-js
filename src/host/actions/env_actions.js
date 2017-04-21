import EventDispatcher from '../dispatchers/event_dispatcher';
import util from '../util';
import IframeComponent from '../components/iframe';
import $ from '../dollar';
import Providers from '../providers';

EventDispatcher.register('iframe-resize', function(data){
  Providers.getProvider('addon').resize(data.width, data.height, data.context);
});

EventDispatcher.register('iframe-size-to-parent', function(data){
  Providers.getProvider('addon').sizeToParent(data.context, data.hideFooter);
});

AJS.$(window).on('resize', function (e) {
  EventDispatcher.dispatch('host-window-resize', e);
});

export default {
  iframeResize: function(width, height, context){
    EventDispatcher.dispatch('iframe-resize', {width, height, context});
  },
  sizeToParent: function(context, hideFooter){
    EventDispatcher.dispatch('iframe-size-to-parent', {context, hideFooter});
  }
}