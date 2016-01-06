import $ from './dollar';
import _ from './underscore';

var MESSAGE_BAR_ID = 'ac-message-container';
var MESSAGE_TYPES = ['generic', 'error', 'warning', 'success', 'info', 'hint'];
var messageId = 0;

function validateMessageId(msgId) {
  return msgId.search(/^ap\-message\-[0-9]+$/) === 0;
}

function getMessageBar() {
  var msgBar = $('#' + MESSAGE_BAR_ID);

  if (msgBar.length < 1) {
    msgBar = $('<div id="' + MESSAGE_BAR_ID + '" />').appendTo('body');
  }
  return msgBar;
}

function filterMessageOptions(options) {
  var i;
  var key;
  var copy = {};
  var allowed = ['closeable', 'fadeout', 'delay', 'duration', 'id'];
  if(_.isObject(options)){
    for (i in allowed) {
      key = allowed[i];
      if (key in options) {
        copy[key] = options[key];
      }
    }
  }
  return copy;
}

function showMessage(name, title, bodyHTML, options) {
  var msgBar = getMessageBar();
  options = filterMessageOptions(options);
  $.extend(options, {
    title: title,
    body: AJS.escapeHtml(bodyHTML)
  });

  if ($.inArray(name, MESSAGE_TYPES) < 0) {
    throw 'Invalid message type. Must be: ' + MESSAGE_TYPES.join(', ');
  }
  if (validateMessageId(options.id)) {
    AJS.messages[name](msgBar, options);
    // Calculate the left offset based on the content width.
    // This ensures the message always stays in the centre of the window.
    msgBar.css('margin-left', '-' + msgBar.innerWidth() / 2 + 'px');
  }
}

var toExport = {
  clear(id) {
    if (validateMessageId(id)) {
      $('#' + id).remove();
    }
  }
};

MESSAGE_TYPES.forEach((messageType) => {
  toExport[messageType] = function(title, body, options, callback) {
    if(options._context) {
      options = {};
    }
    messageId++;
    options.id = 'ap-message-' + messageId;
    return showMessage(messageType, title, body, options);
  };
}, this);


export default toExport;