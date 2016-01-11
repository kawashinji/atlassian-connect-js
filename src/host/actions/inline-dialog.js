import EventDispatcher from '../event-dispatcher';

module.exports = {
  hide: function(extension_id){
    EventDispatcher.dispatch("inline-dialog-hide", {extension_id});
  }
};
