import _ from '../underscore';
import EventActions from '../actions/event_actions';

export default {
  emit: function(name, ...args) {
    var extension = _.last(args)._context.extension;
    args = _.first(args, -1);
    EventActions.broadcast(name, {
      addon_key: extension.addon_key
    }, args, false, extension);
  },

  emitPublic: function(name, targets, ...args) {
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

    var extension = _.last(args)._context.extension;
    args = _.first(args, -1);
    targets.forEach(target => {
      EventActions.broadcast(name, target, args, true, extension);
    });
  }
};