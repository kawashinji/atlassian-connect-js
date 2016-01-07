AP.define("dialog", ["_dollar", "_rpc", "_ui-params", "_uri"],

  /**
   * The Dialog module provides a mechanism for launching an add-on's modules as modal dialogs from within an add-on's iframe.
   * A modal dialog displays information without requiring the user to leave the current page.
   * The dialog is opened over the entire window, rather than within the iframe itself.
   * 
   * <h3>Styling your dialog to look like a standard Atlassian dialog</h3>
   * 
   * By default the dialog iframe is undecorated. It's up to you to style the dialog.
   * <img src="../assets/images/connectdialogchromelessexample.jpeg" width="100%" />
   *
   * In order to maintain a consistent look and feel between the host application and the add-on,
   * we encourage you to style your dialogs to match Atlassian's Design Guidelines for modal dialogs.
   * To do that, you'll need to add the AUI styles to your dialog.
   *
   * For more information, read about the Atlassian User Interface [dialog component](https://docs.atlassian.com/aui/latest/docs/dialog.html).
   * @exports Dialog
   */

  function($, rpc, UiParams, Uri) {
    "use strict";

    var uiParams = UiParams.fromUrl(window.location.toString()),
      isDialog = Boolean(uiParams.dlg) || Boolean(uiParams.isDialog),
      exports,
      url = new Uri.init(window.location.toString());

    // if it has been set to a dialog on the server.
    if (url.getQueryParamValue("dialog") === "1") {
      isDialog = true;
    }

    rpc.extend(function(remote) {

      // dialog-related sub-api for use when the remote plugin is running as the content of a host dialog

      var listeners = {};


      exports = {
        /**
         * Returns the data Object passed to the dialog at creation.
         * @noDemo
         * @example
         * AP.require('dialog', function(dialog){
         *   var myDataVariable = dialog.customData.myDataVariable;
         * });
         *
         * @return {Object} Data Object passed to the dialog on creation.
         */        
        data: uiParams.customData,
        /**
         * @class Dialog~DialogOptions
         * @property {String}        key         The module key of the page you want to open as a dialog
         * @property {String}        size        Opens the dialog at a preset size: small, medium, large, x-large or maximum (full screen).
         * @property {Number|String} width       overrides size, define the width as a percentage (append a % to the number) or pixels.
         * @property {Number|String} height      overrides size, define the height as a percentage (append a % to the number) or pixels.
         * @property {Boolean}       chrome      (optional) opens the dialog with heading and buttons.
         * @property {String}        header      (optional) text to display in the header if opening a dialog with chrome.
         * @property {String}        submitText  (optional) text for the submit button if opening a dialog with chrome.
         * @property {String}        cancelText  (optional) text for the cancel button if opening a dialog with chrome.
         * @property {Object}        customData  (optional) custom data object that can be accessed from the actual dialog iFrame.
         */

        /**
         * Creates a dialog for a web-item or page module key.
         * @param {Dialog~DialogOptions} options configuration object of dialog options.
         * @noDemo
         * @example
         * AP.require('dialog', function(dialog){
         *   dialog.create({
         *     key: 'my-module-key',
         *     width: '500px',
         *     height: '200px',
         *     chrome: true
         *   }).on("close", callbackFunc);
         * });
         *
         * @return {Dialog~Dialog} Dialog object allowing for callback registrations
         */
        create: function(options) {
          remote.createDialog(options);

          /**
           * @class Dialog~Dialog
           * @description A dialog object
           */
          return {

            /**
             * Allows the add-on to register a callback function for the given event. The listener is only called once and must be
             * re-registered if needed.
             * @memberOf Dialog~Dialog
             * @param {String} event name of the event to listen for, such as 'close'.
             * @param {Function} callback function to receive the event callback.
             * @noDemo
             * @example
             * AP.require('dialog', function(dialog){
             *   dialog.create(opts).on("close", callbackFunc);
             * });
             */
            on: function(event, callback) {
              // HACK: Note this is a "once" as it's assumed the only event is "close", and close is only fired
              // once per dialog. If we changed this to "on", then it would be fired when *any* dialog is closed,
              // meaning that if say two dialog were opened, closed, opened, then closed, then the callback
              // registered for the first dialog would be issued when the second was closed.
              remote.events.once("dialog." + event, callback);
            }
          }
        },
        /**
         * Closes the currently open dialog. Optionally pass data to listeners of the `dialog.close` event.
         * This will only close a dialog that has been opened by your add-on.
         * You can register for close events using the `dialog.close` event and the [events module](module-Events.html).
         * @param {Object} data An object to be emitted on dialog close.
         * @noDemo
         * @example
         * AP.require('dialog', function(dialog){
         *   dialog.close({foo: 'bar'});
         * });
         */
        close: function(data) {
          remote.events.emit("dialog.close", data);
          remote.closeDialog();
        },

        isDialog: isDialog,

        /**
         * Register callbacks responding to messages from the host dialog, such as "submit" or "cancel"
         * @param {String} buttonName - button either "cancel" or "submit"
         * @param {Function} listener - callback function invoked when the requested button is pressed
         * @deprecated
         */
        onDialogMessage: function(buttonName, listener) {
          this.getButton(buttonName).bind(listener);
        },
        /**
         * Returns the button that was requested (either cancel or submit)
         * @returns {Dialog~DialogButton}
         * @noDemo
         * @example
         * AP.require('dialog', function(dialog){
         *   dialog.getButton('submit');
         * });
         */
        getButton: function(name) {
          /**
           * @class Dialog~DialogButton
           * @description A dialog button that can be controlled with javascript
           */
          return {
            name: name,

            /**
             * Sets the button state to enabled
             * @memberOf Dialog~DialogButton
             * @noDemo
             * @example
             * AP.require('dialog', function(dialog){
             *   dialog.getButton('submit').enable();
             * });
             */
            enable: function() {
              remote.setDialogButtonEnabled(name, true);
            },
            /**
             * Sets the button state to disabled
             * @memberOf Dialog~DialogButton
             * @noDemo
             * @example
             * AP.require('dialog', function(dialog){
             *   dialog.getButton('submit').disable();
             * });
             */
            disable: function() {
              remote.setDialogButtonEnabled(name, false);
            },
            /**
             * Toggle the button state between enabled and disabled.
             * @memberOf Dialog~DialogButton
             * @noDemo
             * @example
             * AP.require('dialog', function(dialog){
             *   dialog.getButton('submit').toggle();
             * });
             */
            toggle: function() {
              var self = this;
              self.isEnabled(function(enabled) {
                self[enabled ? "disable" : "enable"](name);
              });
            },
            /**
             * Query a button for it's current state.
             * @memberOf Dialog~DialogButton
             * @param {Function} callback function to receive the button state.
             * @noDemo
             * @example
             * AP.require('dialog', function(dialog){
             *   dialog.getButton('submit').isEnabled(function(enabled){
             *     if(enabled){
             *       //button is enabled
             *     }
             *   });
             * });
             */
            isEnabled: function(callback) {
              remote.isDialogButtonEnabled(name, callback);
            },
            /**
             * Registers a function to be called when the button is clicked.
             * @memberOf Dialog~DialogButton
             * @param {Function} callback function to be triggered on click or programatically.
             * @noDemo
             * @example
             * AP.require('dialog', function(dialog){
             *   dialog.getButton('submit').bind(function(){
             *     alert('clicked!');
             *   });
             * });
             */
            bind: function(listener) {
              remote.dialogListenerBound();
              var list = listeners[name];
              if (!list) {
                list = listeners[name] = [];
              }
              list.push(listener);
            },
            /**
             * Trigger a callback bound to a button.
             * @memberOf Dialog~DialogButton
             * @noDemo
             * @example
             * AP.require('dialog', function(dialog){
             *   dialog.getButton('submit').bind(function(){
             *     alert('clicked!');
             *   });
             *   dialog.getButton('submit').trigger();
             * });
             */
            trigger: function() {
              var self = this,
                cont = true,
                result = true,
                list = listeners[name];
              $.each(list, function(i, listener) {
                result = listener.call(self, {
                  button: self,
                  stopPropagation: function() {
                    cont = false;
                  }
                });
                return cont;
              });
              return !!result;
            }
          };
        },
        /**
         * @class Dialog~DialogButton
         * @description Creates a dialog button that can be controlled with javascript
         */
        createButton: function(name, options) {
          remote.createButton(name, options);
          return this.getButton(name);
        }
      };

      return {

        internals: {

          // forwards dialog event messages from the host application to locally registered handlers
          dialogMessage: function(name) {
            var result = true;
            try {
              if (isDialog) {
                result = exports.getButton(name).trigger();
              } else {
                $.handleError("Received unexpected dialog button event from host:", name);
              }
            } catch (e) {
              $.handleError(e);
            }
            return result;
          }

        },

        stubs: [
          "dialogListenerBound",
          "setDialogButtonEnabled",
          "isDialogButtonEnabled",
          "createDialog",
          "closeDialog",
          "createButton"
        ],

        init: function() {
          if (isDialog) {
            window.addEventListener('keydown', function(event) {
              if (event.keyCode === 27) {
                exports.close();
              }
            });
          }
        }

      };

    });

    return exports;

  });