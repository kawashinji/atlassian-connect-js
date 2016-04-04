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
  toggleButton: (data) => {
    EventDispatcher.dispatch('dialog-button-toggle', data);
  },
  dialogMessage: (data) => {
    EventDispatcher.dispatch('dialog-message', data);
  }
};
