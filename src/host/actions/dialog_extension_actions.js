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
  },
  addUserButton: (options, extension) => {
    EventDispatcher.dispatch('dialog-button-add', {
      button: {
        text: options.text,
        identifier: options.identifier,
        data: {
          userButton: true
        }
      },
      extension: extension
    });
  }
};
