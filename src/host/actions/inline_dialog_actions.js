import EventDispatcher from 'dispatchers/event_dispatcher';

module.exports = {
  hide: function(extension_id){
    EventDispatcher.dispatch('inline-dialog-hide', {extension_id});
  },
  refresh: function($el){
    EventDispatcher.dispatch('inline-dialog-refresh', {$el});
  },
  hideTriggered: function(extension_id, $el){
    EventDispatcher.dispatch('inline-dialog-hidden', {extension_id, $el});
  },
  created: function(data) {
    EventDispatcher.dispatch('inline-dialog-opened', {
      $el: data.$el,
      trigger: data.trigger,
      extension: data.extension
    });
  }
};
