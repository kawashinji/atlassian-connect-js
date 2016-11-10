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

  emitPublic: function(name, targets, ...args) {
    var extension = _.last(args)._context.extension;
    args = _.first(args, -1);

    if(!Array.isArray(targets)){
      targets = [targets];
    }
    targets = targets.filter(target => {
      return target.addonKey !== undefined;
    }).map(target => {
      return {
        addon_key: target.addonKey
      };
    });

    if (targets.length) {
      targets.forEach(target => {
        EventActions.broadcastPublic(name, target, args, extension);
      });
    } else {
      EventActions.broadcastPublic(name, {}, args, extension);
    }
  }
};