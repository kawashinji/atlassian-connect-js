AP.define("messages", ["_dollar", "_rpc"],

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
* @exports messages
*/

function ($, rpc) {
    "use strict";

    var messageId = 0;

    function getMessageId(){
        messageId++;
        return 'ap-message-' + messageId;
    }

    return rpc.extend(function (remote) {

        var apis = {};
        $.each(["generic", "error", "warning", "success", "info", "hint"], function (_, name) {
            apis[name] = function (title, body, options) {
                options = options || {};
                options.id = getMessageId();
                remote.showMessage(name, title, body, options);
                return options.id;
            };
        });

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

        apis.clear = function(id){
            remote.clearMessage(id);
        }

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

        apis.onClose = function (id, callback) {
            remote.onClose(id, callback);
        }

        return {
            /**
            * Show a generic message
            * @name generic
            * @method
            * @memberof module:messages#
            * @param    {String}            title       Sets the title text of the message.
            * @param    {String}            body        The main content of the message.
            * @param    {MessageOptions}    options     Message Options
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
            * @param    {MessageOptions}    options     Message Options
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
            * @param    {MessageOptions}    options     Message Options
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
            * @param    {MessageOptions}    options     Message Options
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
            * @param    {MessageOptions}    options     Message Options
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
            * @param    {String}            title       Sets the title text of the message.
            * @param    {String}            body        The main content of the message.
            * @param    {MessageOptions}    options     Message Options
            * @returns  {String}    The id to be used when clearing the message
            * @example
            * AP.require("messages", function(messages){
            *   //create a message
            *   var message = messages.hint('title', 'hint message example');
            * });
            */

            apis: apis,
            stubs: ['showMessage', 'clearMessage', 'onClose']
        };
    });

});

/**
* @name MessageOptions
* @class
* @property {Boolean}   closeable   Adds a control allowing the user to close the message, removing it from the page.
* @property {Boolean}   fadeout     Toggles the fade away on the message
* @property {Number}    delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
* @property {Number}    duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
*/
