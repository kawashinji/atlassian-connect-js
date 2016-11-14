import _ from '../underscore';
import EventActions from '../actions/event_actions';

export default {
  emit: function(name, ...args) {
    var callback = _.last(args);
    args = _.first(args, -1);
    EventActions.broadcast(name, {
      addon_key: callback._context.extension.addon_key
    }, args);
  },

  emitPublic: function(name, ...args) {
    var callback = _.last(args);
    var extension = callback._context.extension;
    args = _.first(args, -1);
    EventActions.broadcastPublic(name, args, extension);
  }
};