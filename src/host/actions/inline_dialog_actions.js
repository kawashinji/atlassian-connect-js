import EventDispatcher from '../dispatchers/event_dispatcher';
import Providers from '../providers';

EventDispatcher.register('inline-dialog-close', function(data){
  Providers.getProvider('inlineDialog').closeInlineDialog(data.context);
});

export default {
  hide: function($el){
    EventDispatcher.dispatch('inline-dialog-hide', {
      $el: $el
    });
  },
  refresh: function($el){
    EventDispatcher.dispatch('inline-dialog-refresh', {$el});
  },
  hideTriggered: function(extension_id, $el){
    EventDispatcher.dispatch('inline-dialog-hidden', {extension_id, $el});
  },
  close: function(data){
    EventDispatcher.dispatch('inline-dialog-close', {
      context: data.context
    });
  },
  created: function(data) {
    EventDispatcher.dispatch('inline-dialog-opened', {
      $el: data.$el,
      trigger: data.trigger,
      extension: data.extension
    });
  }
};
