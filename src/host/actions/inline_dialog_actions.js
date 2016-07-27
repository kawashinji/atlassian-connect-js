import EventDispatcher from '../dispatchers/event_dispatcher';

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
  close: function(){
    EventDispatcher.dispatch('inline-dialog-close', {
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
