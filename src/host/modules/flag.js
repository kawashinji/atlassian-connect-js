import $ from '../dollar';
import EventDispatcher from 'dispatchers/event_dispatcher';
import FlagActions from 'actions/flag_actions';

const FLAGID_PREFIX = 'ap-flag-';
const _flags = {};

class Flag {
  constructor(options, callback) {
    const _id = FLAGID_PREFIX + callback._id;

    this.flag = AJS.flag({
      type: options.type,
      title: options.title,
      body: AJS.escapeHtml(options.body),
      close: options.close
    });

    this.onTriggers= {};

    $(this.flag).attr('id', _id);
    _flags[_id] = this;
  }

  on(event, callback) {
    const id = this.flag.id;
    if ($.isFunction(callback)) {
      this.onTriggers[event] = callback;
    }
  }

  close() {
    this.flag.close();
  }
}

$(document).on('aui-flag-close', (e) => {
  const _id = e.target.id;
  FlagActions.close(_id);
  if (_flags[_id]) {
    _flags[_id]._destroy();
    delete _flags[_id];
  }
});

EventDispatcher.register('flag-close', (data) => {
  if (_flags[data.id] && $.isFunction(_flags[data.id].onTriggers['close'])) {
    _flags[data.id].onTriggers['close']();
  }
});

export default {
  create: {
    constructor: Flag,
    on: Flag.prototype.on,
    close: Flag.prototype.close
  }
}