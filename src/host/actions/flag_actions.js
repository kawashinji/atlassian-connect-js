import EventDispatcher from '../dispatchers/event_dispatcher';

export default {
  actionInvoked: function (actionId, cleanFlagId, flagId) {
    EventDispatcher.dispatch('flag-action-invoked', {
      id: flagId,
      cleanFlagId: cleanFlagId,
      actionId: actionId
    });
  },
  open: function(flagId){
    EventDispatcher.dispatch('flag-open', {id: flagId});
  },
  //called to close a flag
  close: function(flagId){
    EventDispatcher.dispatch('flag-close', {id: flagId});
  },
  //called by AUI when closed
  closed: function(flagId){
    EventDispatcher.dispatch('flag-closed', {id: flagId});
  }
};
