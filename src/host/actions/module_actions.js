import EventDispatcher from '../dispatchers/event_dispatcher';
import * as ModuleActionTypes from '../actions/module_action_types';

export default {
  intercepted: [],
  defineCustomModule: function(name, methods){
    var data = {};
    if(!methods){
      data.methods = name;
    } else {
      data.methods = methods;
      data.name = name;
    }
    EventDispatcher.dispatch('module-define-custom', data);
  },
  isIntercepted: function(name) {
    return (this.intercepted.indexOf(name) > -1);
  },
  setInterceptor: function(name, callback) {
    this.intercepted.push(name);
    EventDispatcher.on(name, callback);
  }
}