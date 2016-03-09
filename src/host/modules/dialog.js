import EventDispatcher from 'dispatchers/event_dispatcher';
import DialogComponent from 'components/dialog';
import DialogActions from 'actions/dialog_actions';

const _dialogs = {};

EventDispatcher.register('before:dialog-button-click', function ($el) {
  const callbacks = $el.data('callbacks');
  if ($.isArray(callbacks)) {
    callbacks.forEach(cb => cb());
  }
});

EventDispatcher.register('dialog-close', function (data) {
  const dialog = data.dialog;
  if (dialog) {
    _dialogs[dialog._id].onClose.forEach(cb => cb(data.customData));
    _dialogs[dialog._id]._destroy();
    delete _dialogs[dialog._id];
  }
});

class Dialog {
  constructor(options, callback) {
    const _id = callback._id;
    this.onClose = [];
    const actions = [
      {
        name: 'submit',
        text: options.submitText || 'submit',
        type: 'primary'
      },
      {
        name: 'cancel',
        text: options.cancelText || 'cancel',
        type: 'link'
      }
    ];
    if (options.size === 'x-large') {
      options.size = 'xlarge';
    } else if (options.width === '100%' && options.height === '100%') {
      options.size = 'fullscreen';
    } else if (!options.width && !options.height) {
      options.size = 'medium';
    }
    DialogComponent.render({
      extension: callback._context.extension,
      key: options.key,
      url: options.url,
      size: options.size,
      width: options.width,
      height: options.height,
      chrome: options.chrome,
      header: options.header,
      hint: options.hint,
      actions: actions,
      id: _id,
      customData: options.customData
    });
    _dialogs[_id] = this;
  }
  on(event, callback) {
    if (event === 'close') {
      if ($.isFunction(callback)) {
        this.onClose.push(callback);
      }
    }
  }
}

class Button {
  constructor(name) {
    this.name = name;
    this.$el = $();
    //const dialog = getActiveDialog();
    //if (dialog) {
    //  this.$el = dialog.$el.find('.aui-dialog2-footer-actions .aui-button').filter(function () {
    //    return $(this).data('name') === name;
    //  });
    //}
  }
  bind(callback) {
    if ($.isFunction(callback)) {
      let callbacks = this.$el.data('callbacks');
      if (!callbacks) {
        callbacks = [];
        this.$el.data('callbacks', callbacks);
      }
      callbacks.push(callback);
    }
  }
  enable() {
    this.$el && this.$el.attr('aria-disabled', false);
  }
  disable() {
    this.$el && this.$el.attr('aria-disabled', true);
  }
  isEnabled(callback) {
    callback(this.$el && this.$el.attr('aria-disabled'));
  }
  toggle() {
    this.$el && this.$el.attr('aria-disabled', this.$el.attr('aria-disabled') !== 'true');
  }
  trigger() {
    this.$el && this.$el.click();
  }
}

module.exports = {
  create: {
    constructor: Dialog,
    on: Dialog.prototype.on
  },
  close: (data, callback) => {
    DialogActions.closeActive({
      customData: data,
      extension: callback._context.extension
    });
  },
  onDialogMessage: AJS.deprecate.fn(
    (buttonName, callback) => {
      const button = new Button(buttonName);
      button.bind(callback);
    },
    'AP.dialog.onDialogMessage()',
    {
      deprecationType: 'API',
      alternativeName:'AP.dialog.getButton().bind()',
      sinceVersion:'ACJS 5.0'
    }
  ),
  getButton: {
    constructor: Button,
    enable: Button.prototype.enable,
    disable: Button.prototype.disable,
    toggle: Button.prototype.toggle,
    isEnabled: Button.prototype.isEnabled,
    bind: Button.prototype.bind,
    trigger: Button.prototype.trigger
  }
};