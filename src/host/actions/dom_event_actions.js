import EventDispatcher from '../dispatchers/event_dispatcher';
import SimpleXDM from 'simple-xdm/host';
import util from '../util';

export default {
  registerKeyEvent: function(data){
    SimpleXDM.registerKeyListener(data.extension_id, data.key, data.modifiers, data.callback);
    EventDispatcher.dispatch('dom-event-register', data);
  },
  unregisterKeyEvent: function(data){
    SimpleXDM.unregisterKeyListener(data.extension_id, data.key, data.modifiers, data.callback);
    EventDispatcher.dispatch('dom-event-unregister', data);
  },
  registerWindowKeyEvent: function(data){
    window.addEventListener('keydown', (event) => {
      if (event.keyCode === data.keyCode) {
        data.callback();
      }
    });
  },
  registerClickHandler: function(handleIframeClick) {
    SimpleXDM.registerClickHandler(function(data) {
      var iframe = document.getElementById(data.extension_id);
      if (iframe) {
        handleIframeClick(iframe);
      }
    });
  },
  unregisterClickHandler: function() {
    SimpleXDM.unregisterClickHandler();
  }
};