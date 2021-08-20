import EventActions from '../actions/event_actions';
import Util from '../util';

export default {
  emit: function(name, ...args) {
    var callback = Util.last(args);
    args = Util.first(args, -1);
    EventActions.broadcast(name, {
      addon_key: callback._context.extension.addon_key
    }, args);
  },

  emitPublic: function(name, ...args) {
    var callback = Util.last(args);
    var extension = callback._context.extension;
    args = Util.first(args, -1);
    EventActions.broadcastPublic(name, args, extension);
  },

  emitToDataProvider: function(...args) {
    var callback = Util.last(args);
    var extension = callback._context.extension;
    args = Util.first(args, -1);
    var payload = {
      productContext: extension.options.productContext,
      data: args,
    };

    EventActions.broadcast('dataProviderEvent', {
      addon_key: ''
    }, payload);
  },
};