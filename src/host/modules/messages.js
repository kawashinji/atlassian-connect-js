/**
* Messages are the primary method for providing system feedback in the product user interface.
* Messages include notifications of various kinds: alerts, confirmations, notices, warnings, info and errors.
* For visual examples of each kind please see the [Design guide](https://developer.atlassian.com/design/latest/communicators/messages/).
* ### Example ###
* ```
* //create a message
* var message = AP.messages.info('plain text title', 'plain text body');
* ```
* @deprecated after August 2017 | Please use the Flag module instead.
* @name messages
* @module
*/

import $ from '../dollar';
import { acjsFrameworkAdaptor } from '../ACJSFrameworkAdaptor';
import util from '../util';
import AnalyticsAction from '../actions/analytics_action';

const MESSAGE_BAR_ID = 'ac-message-container';
const MESSAGE_TYPES = ['generic', 'error', 'warning', 'success', 'info', 'hint'];
const MSGID_PREFIX = 'ap-message-';
const MSGID_REGEXP = new RegExp(`^${MSGID_PREFIX}[0-9A-fa-f]+$`);
const _messages = {};

function validateMessageId(msgId) {
  return MSGID_REGEXP.test(msgId);
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
  if(typeof options === 'object'){
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

  if (MESSAGE_TYPES.indexOf(name) < 0) {
    throw 'Invalid message type. Must be: ' + MESSAGE_TYPES.join(', ');
  }
  if (validateMessageId(options.id)) {
    AJS.messages[name]($msgBar, options);
    // Calculate the left offset based on the content width.
    // This ensures the message always stays in the centre of the window.
    $msgBar.css('margin-left', '-' + $msgBar.innerWidth() / 2 + 'px');
  }
}

function deprecatedShowMessage(name, title, body, options, callback) {
  const methodUsed = `AP.messages.${name}`;
  console.warn(`DEPRECATED API - AP.messages.${name} has been deprecated since ACJS 5.0 and will be removed in a future release. Use AP.flag.create instead.`);
  AnalyticsAction.trackDeprecatedMethodUsed(methodUsed, callback._context.extension);
  const messageProvider = acjsFrameworkAdaptor.getProviderByModuleName('messages');
  if (messageProvider) {
    const messageType = name;
    if (messageType === 'hint') {
      messageProvider.hint(title, body, options);
    } else if (messageType === 'info') {
      messageProvider.info(title, body, options);
    } else if (messageType === 'success') {
      messageProvider.success(title, body, options);
    } else if (messageType === 'warning') {
      messageProvider.warning(title, body, options);
    } else if (messageType === 'error') {
      messageProvider.error(title, body, options);
    } else {
      messageProvider.generic(title, body, options);
    }
  } else {
    showMessage(name, title, body, options);
  }
}

$(document).on('aui-message-close', function (e, $msg) {
  const _id = $msg.attr('id').replace(MSGID_PREFIX, '');
  if (_messages[_id]) {
    if ($.isFunction(_messages[_id].onCloseTrigger)) {
      _messages[_id].onCloseTrigger();
    }
    _messages[_id]._destroy();
  }
});

function messageModule(messageType) {
  return {
    constructor: function(title, body, options, callback) {
      callback = util.last(arguments);
      const _id = callback._id;
      if (typeof title !== 'string') {
        title = '';
      }
      if (typeof body !== 'string') {
        body = '';
      }
      if (typeof options !== 'object') {
        options = {};
      }
      options.id = MSGID_PREFIX + _id;
      deprecatedShowMessage(messageType, title, body, options, callback);
      _messages[_id] = this;
    }
  }
}

export default {
  /**
  * Close a message
  * @deprecated after August 2017 | Please use the Flag module instead.
  * @name clear
  * @method
  * @memberof module:messages#
  * @param    {String}    id  The id that was returned when the message was created.
  * @example
  * //create a message
  * var message = AP.messages.info('title', 'body');
  * setTimeout(function(){
  *   AP.messages.clear(message);
  * }, 2000);
  */
  clear: function (msg) {
    const id = MSGID_PREFIX + msg._id;
    if (validateMessageId(id)) {
      const messageProvider = acjsFrameworkAdaptor.getProviderByModuleName('messages');
      if (messageProvider) {
        messageProvider.clear(id);
      } else {
        $('#' + id).closeMessage();
      }
    }
  },

  /**
  * Trigger an event when a message is closed
  * @deprecated after August 2017 | Please use the Flag module instead.
  * @name onClose
  * @method
  * @memberof module:messages#
  * @param    {String}    id  The id that was returned when the message was created.
  * @param    {Function}  callback  The function that is run when the event is triggered
  * @example
  * //create a message
  * var message = AP.messages.info('title', 'body');
  * AP.messages.onClose(message, function() {
  *   console.log(message, ' has been closed!');
  * });
  */
  onClose: function (msg, callback) {
    callback = util.last(arguments);
    const id = msg._id;
    const messageProvider = acjsFrameworkAdaptor.getProviderByModuleName('messages');
    if (messageProvider) {
      const fullId = MSGID_PREFIX + msg._id;
      messageProvider.onClose(fullId, callback);
    } else {
      if (_messages[id]) {
        _messages[id].onCloseTrigger = callback;
      }
    }
  },

  /**
  * Show a generic message
  * @deprecated after August 2017 | Please use the Flag module instead.
  * @name generic
  * @method
  * @memberof module:messages#
  * @param    {String}            title       Sets the title text of the message.
  * @param    {String}            body        The main content of the message.
  * @param    {Object}            options             Message Options
  * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
  * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
  * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
  * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
  * @returns  {String}    The id to be used when clearing the message
  * @example
  * //create a message
  * var message = AP.messages.generic('title', 'generic message example');
  */
  generic: messageModule('generic'),

  /**
  * Show an error message
  * @deprecated after August 2017 | Please use the Flag module instead.
  * @name error
  * @method
  * @memberof module:messages#
  * @param    {String}            title       Sets the title text of the message.
  * @param    {String}            body        The main content of the message.
  * @param    {Object}            options             Message Options
  * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
  * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
  * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
  * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
  * @returns  {String}    The id to be used when clearing the message
  * @example
  * //create a message
  * var message = AP.messages.error('title', 'error message example');
  */
  error: messageModule('error'),

  /**
  * Show a warning message
  * @deprecated after August 2017 | Please use the Flag module instead.
  * @name warning
  * @method
  * @memberof module:messages#
  * @param    {String}            title       Sets the title text of the message.
  * @param    {String}            body        The main content of the message.
  * @param    {Object}            options             Message Options
  * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
  * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
  * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
  * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
  * @returns  {String}    The id to be used when clearing the message
  * @example
  * //create a message
  * var message = AP.messages.warning('title', 'warning message example');
  */
  warning: messageModule('warning'),

  /**
  * Show a success message
  * @deprecated after August 2017 | Please use the Flag module instead.
  * @name success
  * @method
  * @memberof module:messages#
  * @param    {String}            title       Sets the title text of the message.
  * @param    {String}            body        The main content of the message.
  * @param    {Object}            options             Message Options
  * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
  * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
  * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
  * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
  * @returns  {String}    The id to be used when clearing the message
  * @example
  * //create a message
  * var message = AP.messages.success('title', 'success message example');
  */
  success: messageModule('success'),

  /**
  * Show an info message
  * @deprecated after August 2017 | Please use the Flag module instead.
  * @name info
  * @method
  * @memberof module:messages#
  * @param    {String}            title       Sets the title text of the message.
  * @param    {String}            body        The main content of the message.
  * @param    {Object}            options             Message Options
  * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
  * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
  * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
  * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
  * @returns  {String}    The id to be used when clearing the message
  * @example
  * //create a message
  * var message = AP.messages.info('title', 'info message example');
  */
  info: messageModule('info'),

  /**
  * Show a hint message
  * @deprecated after August 2017 | Please use the Flag module instead.
  * @name hint
  * @method
  * @memberof module:messages#
  * @param    {String}            title               Sets the title text of the message.
  * @param    {String}            body                The main content of the message.
  * @param    {Object}            options             Message Options
  * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
  * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
  * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
  * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
  * @returns  {String}    The id to be used when clearing the message
  * @example
  * //create a message
  * var message = AP.messages.hint('title', 'hint message example');
  */
  hint: messageModule('hint')
};
