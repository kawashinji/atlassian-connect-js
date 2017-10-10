import $ from '../dollar';
import EventDispatcher from '../dispatchers/event_dispatcher';
import WebItemActions from '../actions/webitem_actions';
import WebItemUtils from '../utils/webitem';
import Util from '../util';

class WebItem {

  constructor() {
    this._webitems = {};
    this._contentResolver = function noop(){};
    this._observerStore = {};
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
      var extension = {
        addon_key: WebItemUtils.getExtensionKey($target),
        key: WebItemUtils.getKey($target),
        options: WebItemUtils.getOptionsForWebItem($target),
      };

      WebItemActions.webitemInvoked(webitem, event, extension);
    };
    $(() => {
      $('body').on(onTriggers, webitem.selector, webitem._on);
    });
  }
  // takes a webitem link and removes it's mutation observer
  _cleanUpObserver(id){
    this._observerStore[id].disconnect();
    delete this._observerStore[id];
    console.log('AFTER DESTRUCTION OBSERVER LENGTH', id, this._observerStore);
  }
  // method to clean up webitems when their trigger has been modified
  // eg: a byline inline dialog for the confluence SPA
  _destroyOnMutation(name, $target, extension){
    // select the target node
    // create an observer instance
    var observer = new MutationObserver(function(mutations) {
      WebItemActions.webitemDestroy(name, $target, extension);
      mutations.forEach(function(mutation) {
        console.log('MUTATION OBSERVRED', mutation);
      });
    });
    // looking for a change in href
    observer.observe($target[0], {
      attributes: true
    });
    this._observerStore[$target.attr('id')] = observer;
  }


}

var webItemInstance = new WebItem();

EventDispatcher.register('webitem-added', (data) => {
  webItemInstance._addTriggers(data.webitem);
});

EventDispatcher.register('content-resolver-register-by-extension', function(data){
  webItemInstance.setContentResolver(data.callback);
});

EventDispatcher.register('webitem-invoked', function(data){
  var $target = $(data.event.target).closest(data.webitem.selector);
  this._destroyOnMutation(webitem.name, $target, data.extension);
});

EventDispatcher.register('webitem-destroy', function(data){
  var $target = $(data.event.target).closest(data.webitem.selector);
  webItemInstance._cleanUpObserver($target.attr('id'));
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