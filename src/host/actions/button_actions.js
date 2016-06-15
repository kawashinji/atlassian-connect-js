import EventDispatcher from 'dispatchers/event_dispatcher';

module.exports = {
  clicked: ($el) => {
    EventDispatcher.dispatch("button-clicked", {
      $el
    });
  },
  toggle: ($el, disabled) => {
    EventDispatcher.dispatch("button-toggle", {
      $el,
      disabled
    });
  }
};
