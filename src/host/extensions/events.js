import $ from '../dollar';
import _ from '../underscore';
import EventDispatcher from 'dispatchers/event_dispatcher';

// Note that if it's desireable to publish host-level events to add-ons, this would be a good place to wire
// up host listeners and publish to each add-on, rather than using each XdmRpc.events object directly.

var _channels = {};

// create holding object under _channels.
EventDispatcher.register('iframe-bridge-estabilshed', (data) => {
  if(!_.isObject(_channels[data.addon_key])) {
    _channels[data.addon_key] = {
      _any: []
    };
  }

  if(!_.isObject(_channels[data.addon_key][data.extension_id])) {
    _channels[data.addon_key][data.extension_id] = {};
  }
});

export default {
  emit: function(name, ...args) {
    var callback = _.last(args);
    args = _.first(args, -1);

    let extensions = _channels[callback._context.extension.addon_key],
      extensionIds = _.without(_.keys(extensions), '_any'),
      events = [].concat(extensions._any);

    extensionIds.forEach((extensionId) => {
      var listeners = extensions[extensionId][name];
      if(_.isArray(listeners)) {
        events = events.concat(listeners);
      }
    }, this);

    events.forEach((event) => {
      try {
        event.apply(null, args);
      } catch (e) {
        console.error(e.stack || e.message || e);
      }
    }, this);
  },
  off: function(name, callback) {
    var all =  _channels[callback._context.extension.addon_key][callback._context.extension_id][name];
    if (all) {
      var i = $.inArray(callback, all);
      if (i >= 0) {
        all.splice(i, 1);
      }
    }
  },
  offAll: function(name){

  },
  offAny: function(name){

  },
  on: function (name, callback){
    var addonKey = callback._context.extension.addon_key,
      extensionId = callback._context.extension_id;

    if(!_.isArray(_channels[addonKey][extensionId][name])) {
      _channels[addonKey][extensionId][name] = [];
    }
    _channels[addonKey][extensionId][name].push(callback);
  },
  onAny: function(callback){
    _channels[addonKey]._any.push(callback);
  },
  once: function (name, callback){
    var interceptor = () => {
      this.off(name, interceptor);
      callback.apply(null, arguments);
    };
    interceptor._context = callback._context;
    this.on(name, interceptor);
  }

};