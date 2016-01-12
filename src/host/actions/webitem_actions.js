import EventDispatcher from 'dispatchers/event_dispatcher';
import WebItemComponent from 'components/webitem';

export default {
  addWebItem: (potentialWebItem) => {
    let webitem,
      existing = WebItemComponent.getWebItemsBySelector(potentialWebItem.selector);

    if(existing) {
      return false;
    } else {
      webitem = WebItemComponent.setWebItem({name, selector, triggers});
      EventDispatcher.dispatch("webitem-added", {webitem});
    }

  },

  webitemInvoked: (webitem, event) => {
   EventDispatcher.dispatch("webitem-invoked:" + webitem.name, {webitem, event});
  }

};