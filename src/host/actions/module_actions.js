import EventDispatcher from 'dispatchers/event_dispatcher';

module.exports = {
  defineCustomModule: function(name, methods){
    var data = {};
    if(!methods){
      data.methods = name;
    } else {
      data.methods = methods;
      data.name = name;
    }
    EventDispatcher.dispatch('module-define-custom', data);
  }
}