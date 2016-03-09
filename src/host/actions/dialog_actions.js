import EventDispatcher from 'dispatchers/event_dispatcher';

module.exports = {
  open: () => {
    EventDispatcher.dispatch('dialog-open');
  },
  close: (data) => {
    EventDispatcher.dispatch('dialog-close', data);
  },
  closeActive: (data) => {
    EventDispatcher.dispatch('dialog-close-active', data);
  },
  buttonClick: ($el, extension) => {
    EventDispatcher.dispatch('dialog-button-click', {$el, extension});
  }
};
