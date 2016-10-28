import EventDispatcher from '../dispatchers/event_dispatcher';
import SimpleXDM from 'simple-xdm/host';

export default {
  broadcast: function(type, targetSpec, event, isPublicEvent, extension){
    // Context that will be passed to subscriber's filter function
    var publisherContext = extension ? {
      isPublicEvent: isPublicEvent,
      addonKey: extension.addon_key,
      key: extension.key
    } : {};
    SimpleXDM.dispatch(type, targetSpec, event, null, publisherContext);
    EventDispatcher.dispatch('event-dispatch', {
      type,
      isPublicEvent,
      targetSpec,
      event,
      extension
    });
  }
};