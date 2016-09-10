import EventDispatcher from '../dispatchers/event_dispatcher';

export default {
  addExtension: function(data){
    EventDispatcher.dispatch('inline-dialog-extension', {
      $el: data.$el,
      extension: data.extension
    });
  }
};
