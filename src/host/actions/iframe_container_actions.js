import EventDispatcher from '../dispatchers/event_dispatcher';

export default {
  notifyAppended: function($el, extension) {
    EventDispatcher.dispatch('iframe-container-appended', {$el, extension});
  }
};