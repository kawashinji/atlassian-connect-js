import EventDispatcher from '../dispatchers/event_dispatcher';

export default {
  close: (data) => {
    EventDispatcher.dispatch('dialog-close', {
      dialog: data.dialog,
      extension: data.extension,
      customData: data.customData
    });
  },
  closeActive: (data) => {
    EventDispatcher.dispatch('dialog-close-active', data);
  },
  clickButton: (identifier, $el, extension) => {
    EventDispatcher.dispatch('dialog-button-click', {
      identifier,
      $el,
      extension
    });
  },
  toggleButton: (data) => {
    EventDispatcher.dispatch('dialog-button-toggle', data);
  },
  toggleButtonVisibility: (data) => {
    EventDispatcher.dispatch('dialog-button-toggle-visibility', data);
  }
};
