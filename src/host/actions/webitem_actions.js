import EventDispatcher from 'dispatchers/event_dispatcher';
import WebItemComponent from 'components/webitem';
import Creator from '../create';

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
   EventDispatcher.dispatch("webitem-invoked:" + webitem.name, {webitem, event});
  },
  createIframe: ($el) => {
    var simpleXdmExtension = {
      addon_key: 'some-addon-key',
      key: 'some-key',
      url: 'http://www.example.com',
      options: {}
    };

    var iframeContainer = Creator(simpleXdmExtension);
    urgh.appendTo($el);
  }

};