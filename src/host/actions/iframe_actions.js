import EventDispatcher from '../dispatchers/event_dispatcher';
import simpleXDM from 'simple-xdm/host';

export default {
  notifyIframeCreated: function(el, extension) {
    EventDispatcher.dispatch('iframe-create', {el, extension});
  },

  notifyBridgeEstablished: function($el, extension){
    EventDispatcher.dispatch('iframe-bridge-established', {$el, extension});
  },

  notifyIframeDestroyed: function(filter){
    if(typeof filter === 'string') {
      filter = {id: filter};
    }
    var extensions = simpleXDM.getExtensions(filter);
    extensions.forEach((extension) => {
      EventDispatcher.dispatch('iframe-destroyed', {extension});
      simpleXDM.unregisterExtension({id: extension.extension_id});
    }, this);
  },

  notifyUnloaded: function($el, extension){
    EventDispatcher.dispatch('iframe-unload', {$el, extension});
  }
};