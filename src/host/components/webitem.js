import $ from '../dollar';
import _ from '../underscore';
import EventDispatcher from '../dispatchers/event_dispatcher';
import WebItemActions from '../actions/webitem_actions';
import WebItemUtils from '../utils/webitem';

class WebItem {

  constructor() {
    this._webitems = {};
    this._contentResolver = function noop(){};
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
    return _.find(this._webitems, function(obj) {
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

  _addTriggers (webitem) {
    var onTriggers = WebItemUtils.sanitizeTriggers(webitem.triggers);
    webitem._on = (event) => {
      event.preventDefault();
      var $target = $(event.target).closest(webitem.selector);
      var extension = {
        addon_key: WebItemUtils.getExtensionKey($target),
        key: WebItemUtils.getKey($target),
        options: WebItemUtils.getOptionsForWebItem($target)
      };

      WebItemActions.webitemInvoked(webitem, event, extension);
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

document.addEventListener('aui-responsive-menu-item-created', (e) => {
  var oldWebItem = e.detail.originalItem.querySelector('a[class*="ap-"]');
  if (oldWebItem) {
    var newWebItem = e.detail.newItem.querySelector('a');
    _.each(oldWebItem.classList, cls => {
      if (/^ap-/.test(cls)) {
        newWebItem.classList.add(cls);
      }
    });
  }
});

export default webItemInstance;