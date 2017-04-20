import EventDispatcher from '../dispatchers/event_dispatcher';

export default {
  refresh: function($el){
    EventDispatcher.dispatch('inline-dialog-refresh', {$el});
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
