import EventDispatcher from 'dispatchers/event_dispatcher';
import DialogComponent from 'components/dialog';
import DialogActions from 'actions/dialog_actions';
import EventActions from 'actions/event_actions';
import IframeContainer from 'components/iframe_container';

const _dialogs = {};

EventDispatcher.register('dialog-close', function (data) {
  const dialog = data.dialog;
  if (dialog) {
    EventActions.broadcast('dialog.close', {
      addon_key: data.extension.addon_key
    }, data.customData);
  }
});

EventDispatcher.register('dialog-message', (data) => {
  EventActions.broadcast(`dialog.${data.name}`, {
    addon_key: data.extension.addon_key
  });
});

class Dialog {
  constructor(options, callback) {
    const _id = callback._id;
    const extension = callback._context.extension;
    const $iframeContainer = IframeContainer.createExtension({
      addon_key: extension.addon_key,
      key: options.key,
      url: options.url,
      options: {
        dialogId: options.id,
        // ACJS-185: the following is a really bad idea but we need it
        // for compat until AP.dialog.customData has been deprecated
        customData: options.customData
      }
    });
    DialogComponent.render({
      extension,
      id: _id,
      $content: $iframeContainer,
      size: options.size,
      width: options.width,
      height: options.height,
      chrome: !!options.chrome,
      header: options.header,
      hint: options.hint,
      actions: options.actions
    });
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