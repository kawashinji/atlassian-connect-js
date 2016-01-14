import EventDispatcher from 'dispatchers/event_dispatcher';
import WebItemComponent from 'components/webitem';
import WebItemUtils from 'utils/webitem';

export default {
  addWebItem: (potentialWebItem) => {

    let webitem,
      existing = WebItemComponent.getWebItemsBySelector(potentialWebItem.selector);

    if(existing) {
      return false;
    } else {
      webitem = WebItemComponent.setWebItem(potentialWebItem);
      EventDispatcher.dispatch("webitem-added", {webitem});
    }

  },

  webitemInvoked: (webitem, event) => {
    var $target = $(event.target),
    extension = {
      addon_key: WebItemUtils.getExtensionKey($target),
      key: WebItemUtils.getKey($target),
      url: $target.attr('href')
    };

    EventDispatcher.dispatch("webitem-invoked:" + webitem.name, {webitem, event, extension});
  }

};