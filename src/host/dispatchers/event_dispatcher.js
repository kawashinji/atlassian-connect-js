/**
* pub/sub for extension state (created, destroyed, initialized)
* taken from hipchat webcore
**/

import EventEmitter from 'events';

class EventDispatcher extends EventEmitter {

  constructor() {
    super();
    this.setMaxListeners(20);
  }

  dispatch(action, ...args) {
    this.emit.apply(this, ['before:' + action].concat(args));
    this.emit.apply(this, arguments);
    this.emit.apply(this, ['after:' + action].concat(args));
  }

  registerOnce(action, callback) {
    if (typeof action === 'string') {
      this.once(action, callback);
    } else {
      throw 'ACJS: event name must be string';
    }
  }

  register(action, callback) {
    if (typeof action === 'string') {
      this.on(action, callback);
    } else {
      throw 'ACJS: event name must be string';
    }
  }

  unregister(action, callback) {
    if (typeof action === 'string') {
      this.removeListener(action, callback);
    } else {
      throw 'ACJS: event name must be string';
    }
  }
}

export default new EventDispatcher();