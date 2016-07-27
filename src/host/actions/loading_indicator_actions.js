import EventDispatcher from '../dispatchers/event_dispatcher';

export default {
  timeout($el, extension) {
    EventDispatcher.dispatch('iframe-bridge-timeout', {$el, extension});
  },
  cancelled($el, extension) {
    EventDispatcher.dispatch('iframe-bridge-cancelled', {$el, extension});
  }
};