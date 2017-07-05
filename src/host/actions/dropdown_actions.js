import EventDispatcher from '../dispatchers/event_dispatcher';

export default {
  // called on action click
  itemSelected: function (dropdown_id, item, extension) {
    EventDispatcher.dispatch('dropdown-item-selected', {
      id: dropdown_id,
      item,
      extension
    });
  }
};
