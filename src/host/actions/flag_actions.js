import EventDispatcher from '../dispatchers/event_dispatcher';
import {FLAG_OPEN} from '../actions/module_action_types';

export default {
  open: function(options) {
    EventDispatcher.dispatch(FLAG_OPEN, options);
  },
  // open: function(flagId){
  //   EventDispatcher.dispatch('flag-open', {id: flagId});
  // },
  //called to close a flag
  close: function(flagId){
    EventDispatcher.dispatch('flag-close', {id: flagId});
  },
  //called by AUI when closed
  closed: function(flagId){
    EventDispatcher.dispatch('flag-closed', {id: flagId});
  }
};
