import EventDispatcher from '../dispatchers/event_dispatcher';

export default {
  create: function(options) {
    EventDispatcher.dispatch('flag-create', {options});
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
