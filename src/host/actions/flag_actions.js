import EventDispatcher from '../dispatchers/event_dispatcher';

export default {
  // called on action click
  actionInvoked: function (actionId, flagId) {
    EventDispatcher.dispatch('flag-action-invoked', {
      id: flagId,
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
