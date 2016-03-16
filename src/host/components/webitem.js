import $ from '../dollar';
import _ from '../underscore';
import EventDispatcher from 'dispatchers/event_dispatcher';
import WebItemActions from 'actions/webitem_actions';
import WebItemUtils from 'utils/webitem';

class WebItem {

  constructor() {
    this._webitems = {};
    this._contentResolver = function(){};
  }

  setContentResolver(resolver) {
    this._contentResolver = resolver;
  }

  requestContent(extension) {
    if(extension.addon_key && extension.key) {
      return this._contentResolver.call(null, _.extend({classifier: 'json'}, extension));
    }
  }

  getWebItemsBySelector(selector) {
    _.find(this._webitems, function(obj) {
      if(obj.selector){
        return obj.selector.trim() === selector.trim();
      }
      return false;
    });
  }

  setWebItem(potentialWebItem) {
    return this._webitems[potentialWebItem.name] = {
      name: potentialWebItem.name,
      selector: potentialWebItem.selector,
      triggers: potentialWebItem.triggers
    };

  }

  _removeTriggers(webitem) {
    var onTriggers = WebItemUtils.sanitizeTriggers(webitem.triggers);
    $(() => {
      $('body').off(onTriggers, webitem.selector, this._webitems[webitem.name]._on);
    });
    delete this._webitems[webitem.name]._on;
  }

  _addTriggers (webitem) {
    var onTriggers = WebItemUtils.sanitizeTriggers(webitem.triggers);
    webitem._on = (e) => {
      e.preventDefault();
      WebItemActions.webitemInvoked(webitem, e);
    };
    $(() => {
      $('body').on(onTriggers, webitem.selector, webitem._on);
    });
  }

}

var webItemInstance = new WebItem();

EventDispatcher.register('webitem-added', (data) => {
  webItemInstance._addTriggers(data.webitem);
});

EventDispatcher.register('content-resolver-register-by-extension', function(data){
  webItemInstance.setContentResolver(data.callback);
});


export default webItemInstance;