import EventDispatcher from 'dispatchers/event_dispatcher';

module.exports = {
  notifyIframeCreated: function($el, extension) {
    EventDispatcher.dispatch('iframe-create', {$el, extension});
  }
};