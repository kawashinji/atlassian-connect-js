import $ from '../dollar';
import _ from '../underscore';

const MESSAGE_BAR_ID = 'ac-message-container';
const MESSAGE_TYPES = ['generic', 'error', 'warning', 'success', 'info', 'hint'];
const MSGID_PREFIX = 'ap-message-';
const _messages = {};

function validateMessageId(msgId) {
  return msgId.search(/^ap\-message\-[0-9A-Fa-f]+$/) === 0;
}

function getMessageBar() {
  let $msgBar = $('#' + MESSAGE_BAR_ID);

  if ($msgBar.length < 1) {
    $msgBar = $('<div id="' + MESSAGE_BAR_ID + '" />').appendTo('body');
  }
  return $msgBar;
}

function filterMessageOptions(options) {
  const copy = {};
  const allowed = ['closeable', 'fadeout', 'delay', 'duration', 'id'];
  if(_.isObject(options)){
    allowed.forEach(key => {
      if (key in options) {
        copy[key] = options[key];
      }
    })
  }
  return copy;
}

function showMessage(name, title, body, options) {
  const $msgBar = getMessageBar();
  options = filterMessageOptions(options);
  $.extend(options, {
    title: title,
    body: AJS.escapeHtml(body)
  });

  if ($.inArray(name, MESSAGE_TYPES) < 0) {
    throw 'Invalid message type. Must be: ' + MESSAGE_TYPES.join(', ');
  }
  if (validateMessageId(options.id)) {
    AJS.messages[name]($msgBar, options);
    // Calculate the left offset based on the content width.
    // This ensures the message always stays in the centre of the window.
    $msgBar.css('margin-left', '-' + $msgBar.innerWidth() / 2 + 'px');
  }
}

const deprecatedShowMessage = AJS.deprecate.fn(showMessage, 'AP.messages', {
  deprecationType: 'API',
  alternativeName:'AP.flag',
  sinceVersion:'ACJS 5.0'
});

$(document).on('aui-message-close', function (e, $msg) {
  const _id = $msg.attr('id').replace(MSGID_PREFIX, '');
  if (_messages[_id]) {
    if ($.isFunction(_messages[_id].onCloseTrigger)) {
      _messages[_id].onCloseTrigger();
    }
    _messages[_id]._destroy();
  }
});

var toExport = {
  clear(msg) {
    const id = MSGID_PREFIX + msg._id;
    if (validateMessageId(id)) {
      $('#' + id).closeMessage();
    }
  },
  onClose(msg, callback) {
    const id = msg._id;
    if (_messages[id]) {
      _messages[id].onCloseTrigger = callback;
    }
  }
};

MESSAGE_TYPES.forEach((messageType) => {
  toExport[messageType] = {
    constructor: function(title, body, options, callback) {
      if(options._context) {
        callback = options;
        options = {};
      }
      const _id = callback._id;
      options.id = MSGID_PREFIX + _id;
      deprecatedShowMessage(messageType, title, body, options);
      _messages[_id] = this;
    }
  };
}, this);

export default toExport;
