import EventDispatcher from 'dispatchers/event_dispatcher';

module.exports = {
  close: function(flagId){
    EventDispatcher.dispatch('flag-close', {id: flagId});
  }
};
