import EventDispatcher from 'dispatchers/event_dispatcher';

export default {
  trackDeprecatedMethodUsed(methodUsed, extension) {
    EventDispatcher.dispatch('analytics-deprecated-method-used', {methodUsed, extension});
  }
};