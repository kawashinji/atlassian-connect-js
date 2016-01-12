import $ from '../dollar';
import _ from '../underscore';
import EventDispatcher from 'dispatchers/event_dispatcher';
import WebItemActions from 'actions/webitem_actions';

class WebItem {

  constructor() {
    this._webitems = {};
  }

  getWebItemsBySelector(selector) {
    _.find(this._webitems, function(obj) {
      if(obj.selector){
        return obj.selector.trim() === selector.trim();
      }
      return false;
    });
  }

  setWebItem(name, selector, triggers, callback) {
    this._webitems[name] = {
      name,
      selector,
      triggers,
      callback
    };

  }

  _addTriggers (webitem) {
    var onTriggers = "";
    if(_.isArray(webitem.triggers)) {
      onTriggers = webitem.triggers.join(" ");
    } else if (_.isString(webitem.triggers)) {
      onTriggers = webitem.triggers.trim();
    }

    $(() => {
      $(selector).on(onTriggers, (e) => {
        WebItemActions.webitemInvoked(webitem, e);
      });
    });
  }

}

var webItemInstance = new WebItem();

EventDispatcher.register("webitem-added", webItemInstance._addTriggers);

module.exports = webItemInstance;