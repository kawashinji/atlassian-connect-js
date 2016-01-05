import messages from './api';

var MESSAGE_TYPES = ['generic', 'error', 'warning', 'success', 'info', 'hint'];
var messageId = 0;

export default function () {

  var toExport = {
    clear: function(id) {
      messages.clearMessage(id);
    }
  };

  MESSAGE_TYPES.forEach((messageType) => {
    toExport[messageType] = function(title, body, options, callback) {
      if(options._context) {
        options = {};
      }
      messageId++;
      options.id = 'ap-message-' + messageId;
      return messages.showMessage(messageType, title, body, options);
    };
  }, this);

  return {
    internals: {
      messages: toExport
    }
  };
}