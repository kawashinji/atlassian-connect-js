import EventDispatcher from 'dispatchers/event_dispatcher';

module.exports = {
  open: function () {
    EventDispatcher.dispatch('dialog-open');
  },
  close: function (data, extension) {
    EventDispatcher.dispatch('dialog-close', data, extension);
  },
  buttonClick: function ($el, extension) {
    EventDispatcher.dispatch('dialog-button-click', $el, extension);
  }
};
