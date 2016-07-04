import EventDispatcher from 'dispatchers/event_dispatcher';

export default {
  trackDeprecatedMethodUsed(data, extension) {
    EventDispatcher.dispatch('analytics-deprecated-method-used', {data, extension});
  }
};