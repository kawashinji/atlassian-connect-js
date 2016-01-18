import EventDispatcher from 'dispatchers/event_dispatcher';

module.exports = {
  defineCustomExtension: function(name, methods){
    EventDispatcher.dispatch('extension-define-custom', {name, methods});
  }
}