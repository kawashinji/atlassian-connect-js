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
import UrlUtils from './utils/url';
import ExtensionConfigurationOptionsStore from './stores/extension_configuration_options_store';
import jwtUtil from './utils/jwt';
import dialogUtils from './utils/dialog';

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
      close: (addon_key, closeData) => {
        const frameworkAdaptor = this.getFrameworkAdaptor();
        const dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');
        if (dialogProvider) {
          dialogUtils.assertActiveDialogOrThrow(dialogProvider, addon_key);
          EventActions.broadcast('dialog.close', {
            addon_key: addon_key
          }, closeData);
          dialogProvider.close();
        } else {
          DialogExtensionActions.close();
        }
      }
    }
    this.registerContentResolver = {
      resolveByExtension: (callback) => {
        this._contentResolver = callback;
        jwtActions.registerContentResolver({callback: callback});
      }
    }
    this.getContentResolver = () => {
      return this._contentResolver;
    };
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

  trackAnalyticsEvent(name, values) {
    AnalyticsAction.trackExternalEvent(name, values);
  }

  setJwtClockSkew(skew) {
    jwtActions.setClockSkew(skew);
  }

  isJwtExpired(jwtString, tokenOnly) {
    if(tokenOnly) {
      return jwtUtil.isJwtExpired(jwtString);
    }
    return UrlUtils.isJwtExpired(jwtString);
  }

  hasJwt(url) {
    return UrlUtils.hasJwt(url);
  }

  // set configuration option system wide for all extensions
  // can be either key,value or an object
  setExtensionConfigurationOptions(obj, value) {
    ExtensionConfigurationOptionsStore.set(obj, value);
  }

  getExtensionConfigurationOption(val) {
    return ExtensionConfigurationOptionsStore.get(val);
  }
}

export default new HostApi();
