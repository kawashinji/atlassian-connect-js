import EventDispatcher from '../event-dispatcher';

export default {
  timeout($el, extension_id) {
    EventDispatcher.dispatch('iframe-bridge-timeout', {$el, extension_id});
  },
  cancelled($el, extension_id) {
    EventDispatcher.dispatch('iframe-bridge-cancelled', {$el, extension_id});
  }
};