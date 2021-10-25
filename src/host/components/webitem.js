import $ from '../dollar';
import EventDispatcher from '../dispatchers/event_dispatcher';
import WebItemActions from '../actions/webitem_actions';
import WebItemUtils from '../utils/webitem';
import Util from '../util';
import getBooleanFeatureFlag, {Flags} from '../utils/feature-flag';
import HostApi from '../host-api';

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
      return this._contentResolver.call(null, Util.extend({classifier: 'json'}, extension));
    }
  }
  // originally i had this written nicely with Object.values but
  // ie11 didn't like it and i couldn't find a nice pollyfill
  getWebItemsBySelector(selector) {
    let returnVal;
    const keys = Object.getOwnPropertyNames(this._webitems).some((key) => {
      let obj = this._webitems[key];
      if(obj.selector) {
        if(obj.selector.trim() === selector.trim()) {
          returnVal = obj;
          return true;
        }
      };
      return false;
    });
    return returnVal;
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
    webitem._on = (event) => {
      event.preventDefault();
      var $target = $(event.target).closest(webitem.selector);
      var convertedOptions = WebItemUtils.getConfigFromTarget($target);
      var extensionUrl = convertedOptions && convertedOptions.url ? convertedOptions.url : undefined;
      var extension = {
        addon_key: WebItemUtils.getExtensionKey($target),
        key: WebItemUtils.getKey($target),
        options: WebItemUtils.getOptionsForWebItem($target),
        url: extensionUrl
      };

      if (extension.addon_key === 'com.addonengine.analytics' && !HostApi.isModuleDefined('analytics')) {
        console.log(`ACJS-1164 Dropping event ${event.type} for plugin ${extension.addon_key} until AP.analytics loads...`);
        return;
      }
      WebItemActions.webitemInvoked(webitem, event, extension);
    };
    $(() => {
      $('body').on(onTriggers, webitem.selector, webitem._on);
      $('head').append(`<style type="text/css">${webitem.selector}.ap-link-webitem {pointer-events: auto;}</style>`);
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
    let classList = [].slice.call(oldWebItem.classList);
    classList.forEach(cls => {
      if (/^ap-/.test(cls)) {
        newWebItem.classList.add(cls);
      }
    });
  }
});

export default webItemInstance;