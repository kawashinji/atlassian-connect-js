import EventDispatcher from '../dispatchers/event_dispatcher';
import SimpleXDM from 'simple-xdm/host';
import SimpleXDMUtil from 'simple-xdm/src/common/util';
import getBooleanFeatureFlag from '../utils/feature-flag';

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

    const { contextJwt, origin, ...filteredOptions } = sender.options || {};
    const options = getBooleanFeatureFlag('com.atlassian.connect.event-public.jwt-filter') ? filteredOptions : sender.options
    SimpleXDM.dispatch(type, {}, {
      sender: {
        addonKey: sender.addon_key,
        key: sender.key,
        options: SimpleXDMUtil.sanitizeStructuredClone(options)
      },
      event: event
    });
  }
};