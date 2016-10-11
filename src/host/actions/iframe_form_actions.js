import EventDispatcher from '../dispatchers/event_dispatcher';

export default {
  submit: (id, extension) => {
    EventDispatcher.dispatch('iframe-form-submit', {
      id: id,
      extension: extension
    });
  }
};
