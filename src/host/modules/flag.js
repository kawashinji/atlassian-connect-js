import $ from '../dollar';
import EventDispatcher from 'dispatchers/event_dispatcher';
import FlagComponent from 'components/flag';
import FlagActions from 'actions/flag_actions';

const FLAGID_PREFIX = 'ap-flag-';
const _flags = {};

class Flag extends FlagComponent {
  constructor(options, callback) {
    super(options, callback, FLAGID_PREFIX);
    _flags[this.flag.id] = this;
  }
}

$(document).on('aui-flag-close', (e) => {
  const _id = e.target.id;
  if (_flags[_id]) {
    FlagActions.close(_id);
    _flags[_id]._destroy();
    delete _flags[_id];
  }
});

export default {
  create: {
    constructor: Flag,
    on: Flag.prototype.on,
    close: Flag.prototype.close
  }
}