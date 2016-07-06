import EventDispatcher from 'dispatchers/event_dispatcher';

module.exports = {
  close: function(extension_id){
    EventDispatcher.dispatch('inline-dialog-close', {
      extension_id: extension_id
    });
  }
};
