import EventDispatcher from 'dispatchers/event_dispatcher';
import DialogExtensionActions from 'actions/dialog_extension_actions';
import DialogActions from 'actions/dialog_actions';
import EventActions from 'actions/event_actions';
import DialogExtensionComponent from 'components/dialog_extension';
import util from '../util';

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
  EventActions.broadcast(`dialog.${data.name}`, {
    addon_key: data.extension.addon_key
  });
});

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
      cancelText: options.cancelText
    };

    DialogExtensionActions.open(dialogExtension, dialogOptions);
    this.customData = options.customData;
    _dialogs[_id] = this;
  }
}

class Button {
  constructor(name) {
    this.name = name;
    this.enabled = true;
  }
  enable() {
    this.setState({
      enabled: true
    });
  }
  disable() {
    this.setState({
      enabled: false
    });
  }
  isEnabled(callback) {
    callback(this.enabled);
  }
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

module.exports = {
  create: {
    constructor: Dialog
  },
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
  getCustomData: (callback) => {
    const dialog = getDialogFromContext(callback._context);
    if (dialog) {
      callback(dialog.customData);
    }
  },
  getButton: {
    constructor: Button,
    enable: Button.prototype.enable,
    disable: Button.prototype.disable,
    toggle: Button.prototype.toggle,
    isEnabled: Button.prototype.isEnabled,
    trigger: Button.prototype.trigger
  }
};