import EventDispatcher from '../dispatchers/event_dispatcher';
import DialogExtensionActions from '../actions/dialog_extension_actions';
import DialogActions from '../actions/dialog_actions';
import EventActions from '../actions/event_actions';
import DialogExtensionComponent from '../components/dialog_extension';
import ButtonComponent from '../components/button';
import DialogUtils from '../utils/dialog';
import HostApi from '../host-api';
import Util from '../util';
import dialogUtils from '../utils/dialog';

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
      identifier: ButtonComponent.getIdentifier(data.$el),
      text: ButtonComponent.getText(data.$el)
    }
  };
  var eventName = 'dialog.button.click';

  var buttonEventFilter = {
    addon_key: data.extension.addon_key,
    key: data.extension.key
  };

  buttonEventFilter.id = data.extension.id;

  // Old buttons, (submit and cancel) use old events
  if(!data.$el.hasClass('ap-dialog-custom-button')) {
    EventActions.broadcast(`dialog.${eventData.button.name}`,
      buttonEventFilter,
      eventData
    );
  }

  EventActions.broadcast(eventName,
    buttonEventFilter,
    eventData
  );
});

/**
 * @class Dialog~Dialog
 * @description A dialog object that is returned when a dialog is created using the [dialog module](module-Dialog.html).
 */
class Dialog {
  constructor(options, callback) {
    callback = Util.last(arguments);
    const _id = callback._id;
    const extension = callback._context.extension;
    let dialogExtension = {
      addon_key: extension.addon_key,
      key: options.key,
      options: Util.pick(extension.options, ['customData', 'productContext'])
    };

    // ACJS-185: the following is a really bad idea but we need it
    // for compat until AP.dialog.customData has been deprecated
    dialogExtension.options.customData = options.customData;
    // terrible idea! - we need to remove this from p2 ASAP!
    var dialogModuleOptions = DialogUtils.moduleOptionsFromGlobal(dialogExtension.addon_key, dialogExtension.key);

    // There is a hostFrameOffset configuration available
    // for modals (window._AP.dialogOptions) and inline modals (window._AP.inlineDialogOptions)
    // which is taken into account during the iframe insertion (inside the dialog).
    // The change below injects hostFrameOffset value from the global module options (window._AP.dialogModules)
    // which is required for establishing a contact with a correct host (solves spa iframe problem).
    if (typeof (dialogModuleOptions || {}).hostFrameOffset === 'number') {
      dialogExtension.options.hostFrameOffset = dialogModuleOptions.hostFrameOffset;
    }

    options = Util.extend({}, dialogModuleOptions || {}, options);
    options.id = _id;
    dialogUtils.trackMultipleDialogOpening(dialogExtension, options);
    DialogExtensionActions.open(dialogExtension, options);

    this.customData = options.customData;
    _dialogs[_id] = this;
  }

  /**
   * Registers a callback for a dialog event.
   * @method on
   * @memberOf Dialog~Dialog
   * @param {String} event The dialog event to listen for. Valid options are "close".
   * @param {Function} callback The function to be invoked.
   * @noDemo
   * @example
   * AP.dialog.create({
   *   key: 'my-module-key'
   * }).on("close", function() {
   *   console.log("Dialog was closed");
   * });
   */
}

/**
 * @class Dialog~DialogButton
 * @description A dialog button that can be controlled with JavaScript
 */
class Button {
  constructor(identifier, callback) {
    callback = Util.last(arguments);
    const frameworkAdaptor = HostApi.getFrameworkAdaptor();
    const dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');
    if (dialogProvider) {
      dialogUtils.assertActiveDialogOrThrow(dialogProvider, callback._context.extension.addon_key);
      this.name = identifier;
      this.identifier = identifier;
    } else {
      if (!DialogExtensionComponent.getActiveDialog()) {
        throw new Error('Failed to find an active dialog.');
      }
      this.name = identifier;
      this.identifier = identifier;
      this.enabled = DialogExtensionComponent.buttonIsEnabled(identifier);
      this.hidden = !DialogExtensionComponent.buttonIsVisible(identifier);
    }
  }
  /**
   * Sets the button state to enabled
   * @method enable
   * @memberOf Dialog~DialogButton
   * @noDemo
   * @example
   * AP.dialog.getButton('submit').enable();
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
   * AP.dialog.getButton('submit').disable();
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
   * AP.dialog.getButton('submit').isEnabled(function(enabled){
   *   if(enabled){
   *     //button is enabled
   *   }
   * });
   */
  isEnabled(callback) {
    callback = Util.last(arguments);
    const frameworkAdaptor = HostApi.getFrameworkAdaptor();
    const dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');
    if (dialogProvider) {
      callback(!dialogProvider.isButtonDisabled(this.identifier));
    } else {
      callback(this.enabled);
    }
  }
  /**
   * Toggle the button state between enabled and disabled.
   * @method toggle
   * @memberOf Dialog~DialogButton
   * @noDemo
   * @example
   * AP.dialog.getButton('submit').toggle();
   */
  toggle() {
    const frameworkAdaptor = HostApi.getFrameworkAdaptor();
    const dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');
    if (dialogProvider) {
      dialogProvider.toggleButton(this.identifier);
    } else {
      this.setState({
        enabled: !this.enabled
      });
    }
  }
  setState(state) {
    const frameworkAdaptor = HostApi.getFrameworkAdaptor();
    const dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');
    if (dialogProvider) {
      dialogProvider.setButtonDisabled(this.identifier, !state.enabled);
    } else {
      this.enabled = state.enabled;
      DialogActions.toggleButton({
        identifier: this.identifier,
        enabled: this.enabled
      });
    }
  }
  /**
   * Trigger a callback bound to a button.
   * @method trigger
   * @memberOf Dialog~DialogButton
   * @noDemo
   * @example
   * AP.dialog.getButton('submit').bind(function(){
   *   alert('clicked!');
   * });
   * AP.dialog.getButton('submit').trigger();
   */
  trigger(callback) {
    callback = Util.last(arguments);
    if (this.enabled) {
      DialogActions.dialogMessage({
        name: this.name,
        extension: callback._context.extension
      });
    }
  }

  /**
   * Query a button for its current hidden/visible state.
   * @method isHidden
   * @memberOf Dialog~DialogButton
   * @param {Function} callback function to receive the button state.
   * @noDemo
   * @example
   * AP.dialog.getButton('submit').isHidden(function(hidden){
   *   if(hidden){
   *     //button is hidden
   *   }
   * });
   */
  isHidden(callback) {
    callback = Util.last(arguments);
    const frameworkAdaptor = HostApi.getFrameworkAdaptor();
    const dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');
    if (dialogProvider) {
      callback(dialogProvider.isButtonHidden(this.identifier));
    } else {
      callback(this.hidden);
    }
  }
  /**
   * Sets the button state to hidden
   * @method hide
   * @memberOf Dialog~DialogButton
   * @noDemo
   * @example
   * AP.dialog.getButton('submit').hide();
   */
  hide() {
    this.setHidden(true);
  }
  /**
   * Sets the button state to visible
   * @method show
   * @memberOf Dialog~DialogButton
   * @noDemo
   * @example
   * AP.dialog.getButton('submit').show();
   */
  show() {
    this.setHidden(false);
  }

  setHidden(hidden) {
    const frameworkAdaptor = HostApi.getFrameworkAdaptor();
    const dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');
    if (dialogProvider) {
      dialogProvider.setButtonHidden(this.identifier, hidden);
    } else {
      this.hidden = hidden;
      DialogActions.toggleButtonVisibility({
        identifier: this.identifier,
        hidden: this.hidden
      });
    }
  }
}

function getDialogFromContext(context) {
  return  _dialogs[context.extension.options.dialogId];
}

class CreateButton {
  constructor(options, callback) {
    callback = Util.last(arguments);
    const frameworkAdaptor = HostApi.getFrameworkAdaptor();
    const dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');
    if (dialogProvider) {
      dialogUtils.assertActiveDialogOrThrow(dialogProvider, callback._context.extension.addon_key);
      dialogProvider.createButton({
        identifier: options.identifier,
        text: options.text,
        hidden: false,
        disabled: options.disabled || false,
        onClick: () => {
          EventActions.broadcast('dialog.button.click', {
            addon_key: callback._context.extension.addon_key,
            key: callback._context.extension.key
          }, {
            button: {
              identifier: options.identifier,
              text: options.text
            }
          });
        }
      });
    } else {
      DialogExtensionActions.addUserButton({
        identifier: options.identifier,
        text: options.text
      }, callback._context.extension);
    }
  }
}

/**
 * The Dialog module provides a mechanism for launching an add-on's modules as modal dialogs from within an add-on's iframe.
 *
 * A modal dialog displays information without requiring the user to leave the current page.
 *
 * The dialog is opened over the entire window, rather than within the iframe itself.
 *
 * <h3>Styling your dialog to look like a standard Atlassian dialog</h3>
 *
 * By default the dialog iframe is undecorated. It's up to you to style the dialog.
 * <img src="/cloud/connect/images/connectdialogchromelessexample.jpeg" width="100%" />
 *
 * In order to maintain a consistent look and feel between the host application and the add-on, we encourage you to style your dialogs to match Atlassian's Design Guidelines for modal dialogs.
 *
 * To do that, you'll need to add the AUI styles to your dialog.
 *
 * For more information, read about the Atlassian User Interface [dialog component](https://docs.atlassian.com/aui/latest/docs/dialog2.html).
 * @exports Dialog
 */
export default {
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
   * @property {Boolean}       closeOnEscape (optional) if true, pressing ESC inside the dialog will close the dialog (default is true).
   * @property {Array}         buttons     (optional) an array of custom buttons to be added to the dialog if opening a dialog with chrome.
   * @property {String}        hint        (optional) Suggested actions or helpful info that will be added to the dialog if opening with chrome.
   */

  /**
   * Creates a dialog for a common dialog, page or web-item module key.
   * @param {Dialog~DialogOptions} options configuration object of dialog options.
   * @method create
   * @noDemo
   * @example
   * AP.dialog.create({
   *   key: 'my-module-key',
   *   width: '500px',
   *   height: '200px',
   *   chrome: true,
   *   buttons: [
   *     {
   *       text: 'my button',
   *       identifier: 'my_unique_identifier'
   *     }
   *   ]
   * }).on("close", callbackFunc);
   *
   * @return {Dialog~Dialog} Dialog object allowing for callback registrations
   */
  create: {
    constructor: Dialog
  },
  /**
   * Closes the currently open dialog. Optionally pass data to listeners of the `dialog.close` event.
   * This will only close a dialog that has been opened by your add-on.
   * You can register for close events using the `dialog.close` event and the [events module](../events/).
   * @param {Object} data An object to be emitted on dialog close.
   * @noDemo
   * @example
   * AP.dialog.close({foo: 'bar'});
   */
  close: function (data, callback) {
    callback = Util.last(arguments);
    const frameworkAdaptor = HostApi.getFrameworkAdaptor();
    const dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');
    if (dialogProvider) {
      dialogUtils.assertActiveDialogOrThrow(dialogProvider, callback._context.extension.addon_key);
      EventActions.broadcast('dialog.close', {
        addon_key: callback._context.extension.addon_key
      }, data);
      dialogProvider.close();
    } else {
      var dialogToClose;
      if(callback._context.extension.options.isDialog){
        dialogToClose = DialogExtensionComponent.getByExtension(callback._context.extension.id)[0];
      } else {
        dialogToClose = DialogExtensionComponent.getActiveDialog();
      }

      DialogActions.close({
        customData: data,
        dialog: dialogToClose,
        extension: callback._context.extension
      });
    }
  },
  /**
   * Passes the custom data Object to the specified callback function.
   * @noDemo
   * @name getCustomData
   * @method
   * @param {Function} callback - Callback method to be executed with the custom data.
   * @example
   * AP.dialog.getCustomData(function (customData) {
   *   console.log(customData);
   * });
   *
   */
  getCustomData: function (callback) {
    callback = Util.last(arguments);
    const dialog = getDialogFromContext(callback._context);
    if (dialog) {
      callback(dialog.customData);
    } else {
      callback(undefined);
    }
  },
  /**
  * Stop the dialog from closing when the submit button is clicked
  * @method disableCloseOnSubmit
  * @noDemo
  * @example
  * AP.dialog.disableCloseOnSubmit();
  * AP.events.on('dialog.button.click', function(data){
  *   if(data.button.name === 'submit') {
  *     console.log('submit button pressed');
  *   }
  * }
  */

  /**
   * Returns the button that was requested (either cancel or submit). If the requested button does not exist, an empty Object will be returned instead.
   * @method getButton
   * @returns {Dialog~DialogButton}
   * @noDemo
   * @example
   * AP.dialog.getButton('submit');
   */
  getButton: {
    constructor: Button,
    enable: Button.prototype.enable,
    disable: Button.prototype.disable,
    toggle: Button.prototype.toggle,
    isEnabled: Button.prototype.isEnabled,
    trigger: Button.prototype.trigger,
    hide: Button.prototype.hide,
    show: Button.prototype.show,
    isHidden: Button.prototype.isHidden
  },
  /**
   * Creates a dialog button that can be controlled with javascript
   * @method createButton
   * @returns {Dialog~DialogButton}
   * @noDemo
   * @example
   * AP.dialog.createButton({
   *   text: 'button text',
   *   identifier: 'button.1'
   * }).bind(function mycallback(){});
   */
  createButton: {
    constructor: CreateButton
  }
};
