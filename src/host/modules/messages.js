import $ from '../dollar';
import EventDispatcher from 'dispatchers/event_dispatcher';
import FlagComponent from 'components/flag';
import FlagActions from 'actions/flag_actions';

const MESSAGE_TYPES = ['generic', 'error', 'warning', 'success', 'info', 'hint'];
const _messages = {};
const MSGID_PREFIX = 'ap-message-';
const AUTO_CLOSE_TIME = 5000;


let messageClasses = {};

$(document).on('aui-flag-close', (e) => {
  const _id = e.target.id;
  if (_messages[_id]) {
    FlagActions.close(_id);
    _messages[_id]._destroy();
    delete _messages[_id];
  }
});

var toExport = {
  clear(msg) {
    const id = MSGID_PREFIX + msg._id;
    if (_messages[id])
      _messages[id].close();
  },
  onClose(msg, callback) {
    const id = MSGID_PREFIX + msg._id;
    if (_messages[id])
      _messages[id].on('close', callback);
  }
};

MESSAGE_TYPES.forEach((messageType) => {
  messageClasses[messageType] = class extends FlagComponent{
    constructor(title, body, options, callback) {
      if(options._context) {
        callback = options;
        options = {};
      }

      let flagOptions = {
        type: messageType,
        title: title,
        body: AJS.escapeHtml(body)
      };

      if (options.closeable === false) {
        flagOptions.close = 'never';
      }

      super(flagOptions, callback, MSGID_PREFIX);
      _messages[this.flag.id] = this;

      if (options.fadeout) {
        const delay = isNaN(options.delay) ? AUTO_CLOSE_TIME : options.delay;
        this.setFadeOut(delay);
      }
    }

    setFadeOut(delay) {
      const thisMessage = this;
      $(thisMessage.flag).addClass('aui-will-close');

      setTimeout(function() {
        thisMessage.close();
      }, delay)
    }
  };

  const deprecatedMessageConstructor = AJS.deprecate.construct(messageClasses[messageType], 'AP.messages',
    {
      alternativeName:'AP.flag',
      removeInVersion: 'ACJS 5.x',
      sinceVersion:'ACJS 5.0'
    }
  );

  toExport[messageType] = {
    constructor: deprecatedMessageConstructor
  };
}, this);

export default toExport;
