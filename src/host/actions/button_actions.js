import EventDispatcher from '../dispatchers/event_dispatcher';

export default {
  clicked: ($el) => {
    EventDispatcher.dispatch('button-clicked', {
      $el
    });
  },
  toggle: ($el, disabled) => {
    EventDispatcher.dispatch('button-toggle', {
      $el,
      disabled
    });
  },
  toggleVisibility: ($el, hidden) => {
    EventDispatcher.dispatch('button-toggle-visibility', {
      $el,
      hidden
    });
  }
};
