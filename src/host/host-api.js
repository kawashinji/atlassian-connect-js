import util from './util';
import EventDispatcher from './dispatchers/event_dispatcher';
import DialogExtensionActions from './actions/dialog_extension_actions';
import DomEventActions from './actions/dom_event_actions';
import IframeCreate from './iframe-create';
import jwtActions from './actions/jwt_actions';
import ModuleActions from './actions/module_actions';
import EventActions from './actions/event_actions';
import simpleXDM from 'simple-xdm/host';
import IframeActions from './actions/iframe_actions';
import AnalyticsAction from './actions/analytics_action';
import WebItemUtils from './utils/webitem';
import ModuleProviders from './module-providers';
import { acjsFrameworkAdaptor } from './ACJSFrameworkAdaptor';
import Util from './util';
import simpleXdmUtils from './utils/simplexdm';

class HostApi {
  constructor(){
    this.create = (extension) => {
      return IframeCreate(simpleXdmUtils.extensionConfigSanitizer(extension));
    }
    this.dialog = {
      create: (extension, dialogOptions) => {
        var dialogBeanOptions = WebItemUtils.getModuleOptionsByAddonAndModuleKey('dialog', extension.addon_key, extension.key);
        var completeOptions = Util.extend({}, dialogBeanOptions || {}, dialogOptions);
        DialogExtensionActions.open(extension, completeOptions);
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
    this.registerProvider = (componentName, component) => {
      ModuleProviders.registerProvider(componentName, component);
    };
    this.getProvider = (componentName) => {
      return ModuleProviders.getProvider(componentName);
    };
    // We are attaching an instance of ACJSAdaptor to the host so that products are able
    // to retrieve the identical instance of ACJSAdaptor that ACJS is using.
    // The product can override the framework adaptor by calling setFrameworkAdaptor().
    this.frameworkAdaptor = acjsFrameworkAdaptor;
  }
  /**
  * creates an extension
  * returns an object with extension and iframe attributes
  * designed for use with non DOM implementations such as react.
  */
  createExtension(extension) {
    extension.options = extension.options || {};
    extension.options.noDom = true;
    let createdExtension = simpleXdmUtils.createSimpleXdmExtension(extension);
    AnalyticsAction.trackIframeBridgeStart(createdExtension.extension);
    return createdExtension;
  }

  /**
   * The product is responsible for setting the framework adaptor.
   * @param frameworkAdaptor the framework adaptor to use.
   */
  setFrameworkAdaptor(frameworkAdaptor) {
    this.frameworkAdaptor = frameworkAdaptor;
  }

  getFrameworkAdaptor() {
    return this.frameworkAdaptor;
  }

  _cleanExtension(extension){
    return util.pick(extension, ['id', 'addon_key', 'key', 'options', 'url']);
  }

  onIframeEstablished (callback) {
    var wrapper = function(data){
      callback.call({}, {
        $el: data.$el,
        extension: this._cleanExtension(data.extension)
      });
    };
    callback._wrapper = wrapper.bind(this);
    EventDispatcher.register('after:iframe-bridge-established', callback._wrapper);
  }

  offIframeEstablished (callback) {
    if(callback._wrapper){
      EventDispatcher.unregister('after:iframe-bridge-established', callback._wrapper);
    } else {
      throw new Error('cannot unregister event dispatch listener without _wrapper reference');
    }
  }

  onIframeUnload(callback){
    EventDispatcher.register('after:iframe-unload', (data) => {
      callback.call({}, {
        $el: data.$el,
        extension: this._cleanExtension(data.extension)
      });
    });
  }

  onPublicEventDispatched(callback) {
    var wrapper = function(data){
      callback.call({}, {
        type: data.type,
        event: data.event,
        extension: this._cleanExtension(data.sender)
      });
    };
    callback._wrapper = wrapper.bind(this);
    EventDispatcher.register('after:event-public-dispatch', callback._wrapper);
  }

  offPublicEventDispatched(callback) {
    if(callback._wrapper){
      EventDispatcher.unregister('after:event-public-dispatch', callback._wrapper);
    } else {
      throw new Error('cannot unregister event dispatch listener without _wrapper reference');
    }
  }

  onKeyEvent (extension_id, key, modifiers, callback) {
    DomEventActions.registerKeyEvent({extension_id, key, modifiers, callback});
  }

  offKeyEvent (extension_id, key, modifiers, callback) {
    DomEventActions.unregisterKeyEvent({extension_id, key, modifiers, callback});
  }

  onFrameClick (handleIframeClick) {
    if (typeof handleIframeClick !== 'function') {
      throw new Error('handleIframeClick must be a function');
    }
    DomEventActions.registerClickHandler(handleIframeClick);
  }

  offFrameClick () {
    DomEventActions.unregisterClickHandler();
  }

  destroy (extension_id){
    IframeActions.notifyIframeDestroyed({id: extension_id});
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

  trackDeprecatedMethodUsed(methodUsed, extension) {
    AnalyticsAction.trackDeprecatedMethodUsed(methodUsed, extension);
  }

  setJwtClockSkew(skew) {
    jwtActions.setClockSkew(skew);
  }
}

export default new HostApi();