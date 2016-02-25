import $ from '../dollar';
import _ from '../underscore';
import EventDispatcher from 'dispatchers/event_dispatcher';

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

    $(this.flag).attr('id', _id);

    _flags[_id] = this;

    $(document).on('aui-flag-close', (e) => {
      if (e.target.id === _id) {
        EventDispatcher.dispatch('flag-close', {id: _id});
        _flags[_id]._destroy();
        delete _flags[_id];
      }
    })
  }

  on(event, callback) {
    const id = this.flag.id;
    EventDispatcher.register('flag-' + event, (data) => {
      if (data.id === id) {
        callback();
      }
    });
  }

  close() {
    this.flag.close();
  }
}

export default {
  create: {
    constructor: Flag,
    on: Flag.prototype.on,
    close: Flag.prototype.close
  }
}