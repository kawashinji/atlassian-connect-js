import EventDispatcher from '../dispatchers/event_dispatcher';

export default {
  submit: ($container) => {
    EventDispatcher.dispatch('iframe-form-submit', $container);
  }
};
