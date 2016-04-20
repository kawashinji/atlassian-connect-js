import EventDispatcher from 'dispatchers/event_dispatcher';

module.exports = {
  open: (extension, options) => {
    EventDispatcher.dispatch('dialog-extension-open', {
      extension: extension,
      options: options
    });
  },
  close: () => {
    EventDispatcher.dispatch('dialog-close-active', {});
  }
};
