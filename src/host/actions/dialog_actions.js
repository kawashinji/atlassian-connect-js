import EventDispatcher from 'dispatchers/event_dispatcher';

module.exports = {
  close: (data) => {
    EventDispatcher.dispatch('dialog-close', data);
  },
  closeActive: (data) => {
    EventDispatcher.dispatch('dialog-close-active', data);
  },
  clickButton: (name, $el, extension) => {  
    EventDispatcher.dispatch('dialog-button-click', {
      name,
      $el,
      extension
    });
  },
  toggleButton: (data) => {
    EventDispatcher.dispatch('dialog-button-toggle', data);
  }
};
