import EventDispatcher from '../dispatchers/event_dispatcher';
import SimpleXDM from 'simple-xdm/host';

export default {
  broadcast: function(type, targetSpec, event){
    SimpleXDM.dispatch(type, targetSpec, {event});
    EventDispatcher.dispatch('event-dispatch', {
      type: type,
      targetSpec: targetSpec,
      event: event
    });
  },

  broadcastPublic: function(type, targetSpec, event, extension){
    var emitterData = {
      addonKey: extension.addon_key,
      key: extension.key
    };
    SimpleXDM.dispatch(type, targetSpec, {emitterData, event});
    EventDispatcher.dispatch('event-dispatch', {
      isPublicEvent: true,
      type,
      targetSpec,
      event,
      extension
    });
  }
};