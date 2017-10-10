import EventDispatcher from '../dispatchers/event_dispatcher';
import WebItemComponent from '../components/webitem';

export default {
  addWebItem: (potentialWebItem) => {
    let webitem;
    let existing = WebItemComponent.getWebItemsBySelector(potentialWebItem.selector);

    if(existing) {
      return false;
    } else {
      webitem = WebItemComponent.setWebItem(potentialWebItem);
      EventDispatcher.dispatch('webitem-added', {webitem});
    }

  },

  webitemInvoked: (webitem, event, extension) => {
    EventDispatcher.dispatch('webitem-invoked', {webitem, event, extension});
    EventDispatcher.dispatch('webitem-invoked:' + webitem.name, {webitem, event, extension});
  },

  webitemDestroy: (name, $target, extension) => {
    EventDispatcher.dispatch('webitem-destroy', {$target, extension});
    EventDispatcher.dispatch('webitem-destroy:' + name, {$target, extension});
  }
};