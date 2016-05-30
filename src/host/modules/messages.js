/**
* Messages are the primary method for providing system feedback in the product user interface.
* Messages include notifications of various kinds: alerts, confirmations, notices, warnings, info and errors.
* For visual examples of each kind please see the [Design guide](https://developer.atlassian.com/design/latest/communicators/messages/).
* ### Example ###
* ```
* AP.require("messages", function(messages){
*   //create a message
*   var message = messages.info('plain text title', 'plain text body');
* });
* ```
* This module has been deprecated and may be removed in future releases. Please use the [Flag module](module-Flag.html) instead.
* @name messages
* @module
*/

import $ from '../dollar';
import _ from '../underscore';

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
  /**
  * clear a message
  * @name clear
  * @method
  * @memberof module:messages#
  * @param    {String}    id  The id that was returned when the message was created.
  * @example
  * AP.require("messages", function(messages){
  *   //create a message
  *   var message = messages.info('title', 'body');
  *   setTimeout(function(){
  *     messages.clear(message);
  *   }, 2000);
  * });
  */
  clear: function (msg) {
    const id = MSGID_PREFIX + msg._id;
    if (validateMessageId(id)) {
      $('#' + id).closeMessage();
    }
  },

  /**
  * Trigger an event when a message is closed
  * @name onClose
  * @method
  * @memberof module:messages#
  * @param    {String}    id  The id that was returned when the message was created.
  * @param    {Function}  callback  The function that is run when the event is triggered
  * @example
  * AP.require("messages", function(messages){
  *   //create a message
  *   var message = messages.info('title', 'body');
  *   messages.onClose(message, function() {
  *       console.log(message, ' has been closed!');
  *   });
  * });
  */
  onClose: function (msg, callback) {
    const id = msg._id;
    if (_messages[id]) {
      _messages[id].onCloseTrigger = callback;
    }
  }
};

/**
* Show a generic message
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
* AP.require("messages", function(messages){
*   //create a message
*   var message = messages.generic('title', 'generic message example');
* });
*/

/**
* Show an error message
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
* AP.require("messages", function(messages){
*   //create a message
*   var message = messages.error('title', 'error message example');
* });
*/

/**
* Show a warning message
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
* AP.require("messages", function(messages){
*   //create a message
*   var message = messages.warning('title', 'warning message example');
* });
*/

/**
* Show a success message
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
* AP.require("messages", function(messages){
*   //create a message
*   var message = messages.success('title', 'success message example');
* });
*/

/**
* Show an info message
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
* AP.require("messages", function(messages){
*   //create a message
*   var message = messages.info('title', 'info message example');
* });
*/

/**
* Show a hint message
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
* AP.require("messages", function(messages){
*   //create a message
*   var message = messages.hint('title', 'hint message example');
* });
*/
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
