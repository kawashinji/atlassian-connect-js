import EventDispatcher from 'dispatchers/event_dispatcher';
import simpleXDM from 'simple-xdm/dist/host';

module.exports = {
  notifyIframeCreated: function($el, extension) {
    EventDispatcher.dispatch('iframe-create', {$el, extension});
  },

  notifyBridgeEstablished: function($el, extension){
    EventDispatcher.dispatch('iframe-bridge-established', {$el, extension});
  },

  notifyIframeDestroyed: function(extension_id){
    var extension = simpleXDM.getExtensions({
      extension_id: extension_id
    });
    if(extension.length === 1){
      extension = extension[0];
    }
    EventDispatcher.dispatch('iframe-destroyed', {extension});
    simpleXDM.unregisterExtension({extension_id: extension_id});
  },

  notifyUnloaded: function($el, extension){
    EventDispatcher.dispatch('iframe-unload', {$el, extension});
  }
};