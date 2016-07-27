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
  }
};