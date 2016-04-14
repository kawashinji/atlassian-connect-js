import $ from '../dollar';
import EventDispatcher from 'dispatchers/event_dispatcher';
import FlagActions from 'actions/flag_actions';
import FlagComponent from 'components/flag';

const _flags = {};

class Flag {
  constructor(options, callback) {

    this.flag = FlagComponent.render({
      type: options.type,
      title: options.title,
      body: AJS.escapeHtml(options.body),
      close: options.close,
      id: callback._id
    });

    FlagActions.open(this.flag.attr('id'));

    this.onTriggers= {};

    _flags[this.flag.attr('id')] = this;
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

EventDispatcher.register('flag-closed', (data) => {
  if (_flags[data.id] && $.isFunction(_flags[data.id].onTriggers['close'])) {
    _flags[data.id].onTriggers['close']();
  }
  if (_flags[data.id]) {
    delete _flags[data.id];
  }
});

export default {
  create: {
    constructor: Flag,
    on: Flag.prototype.on,
    close: Flag.prototype.close
  }
}