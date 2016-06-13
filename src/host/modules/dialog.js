import EventDispatcher from 'dispatchers/event_dispatcher';
import DialogExtensionActions from 'actions/dialog_extension_actions';
import DialogActions from 'actions/dialog_actions';
import EventActions from 'actions/event_actions';
import DialogExtensionComponent from 'components/dialog_extension';
import util from '../util';
import ButtonComponent from 'components/button';
import DialogUtils from 'utils/dialog';
import _ from '../underscore';

const _dialogs = {};

EventDispatcher.register('dialog-close', function (data) {
  const dialog = data.dialog;
  if (dialog && data.extension) {
    EventActions.broadcast('dialog.close', {
      addon_key: data.extension.addon_key
    }, data.customData);
  }
});

EventDispatcher.register('dialog-button-click', (data) => {
  var eventData = {
    button: {
      name: ButtonComponent.getName(data.$el),
      id: data.identifier,
      text: ButtonComponent.getText(data.$el)
    }
  };

  // Old buttons, (submit and cancel) use old events
  if(!data.$el.hasClass('ap-dialog-custom-button')) {
    EventActions.broadcast(`dialog.${eventData.button.name}`, {
      addon_key: data.extension.addon_key
    }, eventData);

  } else {
    // new buttons only target the dialog
    EventActions.broadcast('dialog.button.click', {
      addon_key: data.extension.addon_key,
      key: data.extension.key
    }, eventData);
  }
});

/**
 * @class Dialog~Dialog
 * @description A dialog object that is returned when a dialog is created using the [dialog module](module-Dialog.html).
 */
class Dialog {
  constructor(options, callback) {
    const _id = callback._id;
    const extension = callback._context.extension;

    var dialogExtension = {
      addon_key: extension.addon_key,
      key: options.key,
      options: extension.options
    };

    // ACJS-185: the following is a really bad idea but we need it
    // for compat until AP.dialog.customData has been deprecated
    dialogExtension.options.customData = options.customData;

    // terrible idea! - we need to remove this from p2 ASAP!
    var dialogModuleOptions = DialogUtils.moduleOptionsFromGlobal(dialogExtension.addon_key, dialogExtension.key);
    options = _.extend({}, dialogModuleOptions || {}, options);

    var dialogOptions = {
      id: _id,
      size: options.size,
      width: options.width,
      height: options.height,
      chrome: !!options.chrome,
      header: options.header,
      hint: options.hint,
      actions: options.actions,
      submitText: options.submitText,
      cancelText: options.cancelText,
      buttons: options.buttons
    };

    DialogExtensionActions.open(dialogExtension, dialogOptions);
    this.customData = options.customData;
    _dialogs[_id] = this;
  }
}

/**
 * @class Dialog~DialogButton
 * @description A dialog button that can be controlled with JavaScript
 */
class Button {
  constructor(name) {
    if (!DialogExtensionComponent.getActiveDialog()) {
      throw new Error('Failed to find an active dialog.');
    }
    this.name = name;
    this.enabled = true;
  }
  /**
   * Sets the button state to enabled
   * @method enable
   * @memberOf Dialog~DialogButton
   * @noDemo
   * @example
   * AP.require('dialog', function(dialog){
   *   dialog.getButton('submit').enable();
   * });
   */
  enable() {
    this.setState({
      enabled: true
    });
  }
  /**
   * Sets the button state to disabled. A disabled button cannot be clicked and emits no events.
   * @method disable
   * @memberOf Dialog~DialogButton
   * @noDemo
   * @example
   * AP.require('dialog', function(dialog){
   *   dialog.getButton('submit').disable();
   * });
   */
  disable() {
    this.setState({
      enabled: false
    });
  }
  /**
   * Query a button for its current state.
   * @method isEnabled
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
  isEnabled(callback) {
    callback(this.enabled);
  }
  /**
   * Toggle the button state between enabled and disabled.
   * @method toggle
   * @memberOf Dialog~DialogButton
   * @noDemo
   * @example
   * AP.require('dialog', function(dialog){
   *   dialog.getButton('submit').toggle();
   * });
   */
  toggle() {
    this.setState({
      enabled: !this.enabled
    });
  }
  setState(state) {
    this.enabled = state.enabled;
    DialogActions.toggleButton({
      name: this.name,
      enabled: this.enabled
    });
  }
  /**
   * Trigger a callback bound to a button.
   * @method trigger
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
  trigger(callback) {
    if (this.enabled) {
      DialogActions.dialogMessage({
        name: this.name,
        extension: callback._context.extension
      });
    }
  }
}

function getDialogFromContext(context) {
  return  _dialogs[context.extension.options.dialogId];
}

class CreateButton {
  constructor(options, callback) {
    DialogExtensionActions.addUserButton({
      identifier: options.id,
      text: options.text
    }, callback._context.extension);
  }
}

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
module.exports = {
  /**
   * @class Dialog~DialogOptions
   * @description The options supplied to a [dialog.create()](module-Dialog.html) call.
   *
   * @property {String}        key         The module key of a dialog, or the key of a page or web-item that you want to open as a dialog.
   * @property {String}        size        Opens the dialog at a preset size: small, medium, large, x-large or fullscreen (with chrome).
   * @property {Number|String} width       if size is not set, define the width as a percentage (append a % to the number) or pixels.
   * @property {Number|String} height      if size is not set, define the height as a percentage (append a % to the number) or pixels.
   * @property {Boolean}       chrome      (optional) opens the dialog with heading and buttons.
   * @property {String}        header      (optional) text to display in the header if opening a dialog with chrome.
   * @property {String}        submitText  (optional) text for the submit button if opening a dialog with chrome.
   * @property {String}        cancelText  (optional) text for the cancel button if opening a dialog with chrome.
   * @property {Object}        customData  (optional) custom data object that can be accessed from the actual dialog iFrame.
   * @property {Boolean}       closeOnEscape (optional) if true, pressing ESC will close the dialog (default is true).
   * @property {Array}         buttons     (optional) an array of custom buttons to be added to the dialog if opening a dialog with chrome.
   */

  /**
   * Creates a dialog for a common dialog, page or web-item module key.
   * @param {Dialog~DialogOptions} options configuration object of dialog options.
   * @method create
   * @noDemo
   * @example
   * AP.require('dialog', function(dialog){
   *   dialog.create({
   *     key: 'my-module-key',
   *     width: '500px',
   *     height: '200px',
   *     chrome: true,
   *     buttons: [
   *      {
   *        text: 'my button',
   *        identifier: 'my_unique_identifier'
   *      }
   *     ]
   *   }).on("close", callbackFunc);
   * });
   *
   * @return {Dialog~Dialog} Dialog object allowing for callback registrations
   */
  create: {
    constructor: Dialog
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
  close: (data, callback) => {
    if (!$.isFunction(callback)) {
      callback = data;
      data = {};
    }
    DialogActions.closeActive({
      customData: data,
      extension: callback._context.extension
    });
  },
  /**
   * Returns the data Object passed to the dialog at creation.
   * @noDemo
   * @name customData
   * @method
   * @param {Function} callback - Callback method to be executed with the custom data.
   * @example
   * AP.require('dialog', function(dialog){
   *   var myDataVariable = dialog.customData.myDataVariable;
   * });
   *
   * @return {Object} Data Object passed to the dialog on creation.
   */
  getCustomData: (callback) => {
    const dialog = getDialogFromContext(callback._context);
    if (dialog) {
      callback(dialog.customData);
    }
  },
  /**
   * Returns the button that was requested (either cancel or submit). If the requested button does not exist, an empty Object will be returned instead.
   * @method getButton
   * @returns {Dialog~DialogButton}
   * @noDemo
   * @example
   * AP.require('dialog', function(dialog){
   *   dialog.getButton('submit');
   * });
   */
  getButton: {
    constructor: Button,
    enable: Button.prototype.enable,
    disable: Button.prototype.disable,
    toggle: Button.prototype.toggle,
    isEnabled: Button.prototype.isEnabled,
    trigger: Button.prototype.trigger
  },
  /**
   * Creates a dialog button that can be controlled with javascript
   * @method getButton
   * @returns {Dialog~DialogButton}
   * @noDemo
   * @example
   * AP.require('dialog', function(dialog){
   *   dialog.createButton({
   *     text: 'button text',
   *     identifier: 'button.1'
   *   }).bind(function mycallback(){});
   * });
   */
  createButton: {
    constructor: CreateButton
  }
};