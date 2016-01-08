/**
* pub/sub for extension state (created, destroyed, initialized)
* taken from hipchat webcore
**/
import _ from './underscore';
import {EventEmitter} from 'events';

class EventDispatcher extends EventEmitter {

  constructor() {
    super();
    this.setMaxListeners(20);
  }

  dispatch(action, ...args) {
    this.emit.apply(this, ["before:" + action].concat(args));
    this.emit.apply(this, arguments);
    this.emit.apply(this, ["after:" + action].concat(args));
  }

  registerOnce(action, callback) {
    if (_.isString(action)) {
      this.once(action, callback);
    } else if (_.isObject(action)) {
      _.keys(action).forEach((val, key) => {
        this.once(key, val);
      }, this);
    }
  }

  register(action, callback) {
    if (_.isString(action)) {
      this.on(action, callback);
    } else if (_.isObject(action)) {
      _.keys(action).forEach((val, key) => {
        this.on(key, val);
      }, this);
    }
  }

  unregister(action, callback) {
    if (_.isString(action)) {
      this.removeListener(action, callback);
    } else if (_.isObject(action)) {
      _.keys(action).forEach((val, key) => {
        this.removeListener(key, val);
      }, this);
    }
  }
}

module.exports = new EventDispatcher();