import EventDispatcher from 'dispatchers/event_dispatcher';
import DialogComponent from 'components/dialog';
import DialogActions from 'actions/dialog_actions';

const DLGID_PREFIX = 'ap-dialog-';
const DLGID_REXEXP = new RegExp(`^${DLGID_PREFIX}[0-9A-fa-f]+$`);
const _dialogs = {};

function getActiveDialog() {
  const $el = AJS.LayerManager.global.getTopLayer();
  if ($el && DLGID_REXEXP.test($el.attr('id'))) {
    return AJS.dialog2($el);
  }
}

EventDispatcher.register('before:dialog-button-click', function ($el) {
  const callbacks = $el.data('callbacks');
  if ($.isArray(callbacks)) {
    callbacks.forEach(cb => cb());
  }
});

function closeDialog(data) {
  const dialog = getActiveDialog();
  if (dialog) {
    const _id = dialog.$el.attr('id').replace(DLGID_PREFIX, '');
    _dialogs[_id].onClose.forEach(cb => cb(data));
    _dialogs[_id]._destroy();
    delete _dialogs[_id];
    if (!data || !data.isHiding) {
      dialog.off('hide');
      dialog.hide();
    }
  }
}

EventDispatcher.register('dialog-close', closeDialog);

class Dialog {
  constructor(options, callback) {
    const _id = callback._id;
    options.id = DLGID_PREFIX + _id;
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
    const $el = DialogComponent.render({
      extension: callback._context.extension,
      key: options.key,
      url: options.url,
      size: options.size,
      chrome: options.chrome,
      header: options.header,
      hint: options.hint,
      actions: actions,
      id: options.id,
      customData: options.customData
    });
    const dialog = AJS.dialog2($el);
    if (!options.size || options.size === 'fullscreen') {
      AJS.layer($el).changeSize(options.width, options.height);
    }
    dialog.show();
    DialogActions.open();
    dialog.on('hide', function () {
      DialogActions.close({isHiding: true}, callback._context.extension);
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
    const dialog = getActiveDialog();
    if (dialog) {
      this.$el = dialog.$el.find('.aui-dialog2-footer-actions .aui-button').filter(function () {
        return $(this).data('name') === name;
      });
    }
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
  close: function (data, callback) {
    DialogActions.close(data, callback._context.extension);
  },
  onDialogMessage: AJS.deprecate.fn(
    function (buttonName, callback) {
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