import EventDispatcher from 'dispatchers/event_dispatcher';

module.exports = {
  open: function () {
    EventDispatcher.dispatch('dialog-open');
  },
  close: function (data) {
    EventDispatcher.dispatch('dialog-close', data);
  },
  buttonClick: function ($el) {
    EventDispatcher.dispatch('dialog-button-click', $el);
  }
};
