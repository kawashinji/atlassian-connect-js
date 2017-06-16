import EventDispatcher from '../dispatchers/event_dispatcher';
import SimpleXDM from 'simple-xdm/host';

export default {
  broadcast: function(type, targetSpec, event){
    SimpleXDM.dispatch(type, targetSpec, event);
    EventDispatcher.dispatch('event-dispatch', {
      type: type,
      targetSpec: targetSpec,
      event: event
    });
  },

  broadcastPublic: function(type, event, sender){
    EventDispatcher.dispatch('event-public-dispatch', {
      type,
      event,
      sender
    });

    SimpleXDM.dispatch(type, {}, {
      sender: {
        addonKey: sender.addon_key,
        key: sender.key,
        options: sender.options
      },
      event: event
    });

  }
};