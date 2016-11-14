import _ from './underscore';
import EventDispatcher from './dispatchers/event_dispatcher';
import DialogExtensionActions from './actions/dialog_extension_actions';
import DomEventActions from './actions/dom_event_actions';
import create from './create';
import jwtActions from './actions/jwt_actions';
import ModuleActions from './actions/module_actions';
import EventActions from './actions/event_actions';
import simpleXDM from 'simple-xdm/host';
import IframeActions from './actions/iframe_actions';


class HostApi {
  constructor(){
    this._increment = 1;
    this._callbacks = {};
    this.create = create;
    this.dialog = {
      create: (extension, dialogOptions) => {
        DialogExtensionActions.open(extension, dialogOptions);
      },
      close: () => {
        DialogExtensionActions.close();
      }
    }
    this.registerContentResolver = {
      resolveByExtension: (callback) => {
        jwtActions.registerContentResolver({callback: callback});
      }
    }
  }

  _cleanExtension($el, extension){
    extension = _.pick(extension, ['id', 'addon_key', 'key', 'options', 'url']);
    return {$el, extension};
  }

  // tags a callback for later.
  _tagCallback(callback){
    callback._id = this._increment++;
  }

  onIframeEstablished (callback) {
    this._tagCallback(callback);
    this._callbacks[callback._id] = callback;
    EventDispatcher.register('after:iframe-bridge-established', (data) => {
      this._callbacks[callback._id].call({}, this._cleanExtension(data.$el, data.extension));
    });
  }

  onIframeUnload(callback){
    this._tagCallback(callback);
    this._callbacks[callback._id] = callback;
    EventDispatcher.register('after:iframe-unload', (data) => {
      this._callbacks[callback._id].call({}, this._cleanExtension(data.$el, data.extension));
    });
  }

  onPublicEventDispatched(callback) {
    this._tagCallback(callback);
    this._callbacks[callback._id] = callback;
    EventDispatcher.register('after:event-public-dispatch', (data) => {
      this._callbacks[callback._id].call({}, {
        type: data.type,
        event: data.event,
        extension: this._cleanExtension(data.sender.$el, data.sender)
      });
    });
  }

  offPublicEventDispatched(callback) {
    if(callback._id){
      EventDispatcher.unregister('after:event-public-dispatch', this._callbacks[callback._id]);
      delete this._callbacks[callback._id];
    } else {
      throw new Error('cannot unregister event dispatch listener without _id reference');
    }
  }

  onKeyEvent (extension_id, key, modifiers, callback) {
    DomEventActions.registerKeyEvent({extension_id, key, modifiers, callback});
  }

  offKeyEvent (extension_id, key, modifiers, callback) {
    DomEventActions.unregisterKeyEvent({extension_id, key, modifiers, callback});
  }

  destroy (extension_id){
    IframeActions.notifyIframeDestroyed({extension_id: extension_id});
  }

  defineModule (name, methods) {
    ModuleActions.defineCustomModule(name, methods);
  }

  broadcastEvent (type, targetSpec, event) {
    EventActions.broadcast(type, targetSpec, event);
  }

  getExtensions (filter) {
    return simpleXDM.getExtensions(filter);
  }

}

export default new HostApi();