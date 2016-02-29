import EventDispatcher from 'dispatchers/event_dispatcher';
import DialogComponent from 'components/dialog';
import DialogActions from 'actions/dialog_actions';
import IframeContainer from 'components/iframe_container';

const DLGID_PREFIX = 'ap-dialog-';
const DLGID_REXEXP = new RegExp(`^${DLGID_PREFIX}[0-9A-fa-f]+$`);
const _dialogs = {};

function getActiveDialog() {
  const $el = AJS.LayerManager.global.getTopLayer();
  if ($el && DLGID_REXEXP.test($el.attr('id'))) {
    return AJS.dialog2($el);
  }
}

function keyPressListener(e) {
  if(e.keyCode === 27) {
    DialogActions.close();
  }
}

// $(document).on('keydown', keyPressListener);

EventDispatcher.register('dialog-button-click', function ($el) {
  const buttonOptions = $el.data('options');
  console.log('button options?', buttonOptions, $el);
  DialogActions.close();
});

function closeDialog(data) {
  const dialog = getActiveDialog();
  if (dialog) {
    const _id = dialog.$el.attr('id').replace(DLGID_PREFIX, '');
    _dialogs[_id]._destroy();
    delete _dialogs[_id];
    if (!data.isHiding) {
      dialog.off('hide');
      dialog.hide();
    }
  }
}

EventDispatcher.register('dialog-close', closeDialog);

function dialogIframe(options, context) {
  return IframeContainer.createExtension({
    addon_key: context.extension.addon_key,
    key: options.key,
    url: options.url,
    options: {
      customData: options.customData
    }
  });
}

class Dialog {
  constructor(options, callback) {
    const _id = callback._id;
    options.id = DLGID_PREFIX + _id;
    const $iframeContainer = dialogIframe(options, callback._context);
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
      $content: $iframeContainer,
      size: options.size,
      chrome: options.chrome,
      header: options.header,
      hint: options.hint,
      actions: actions,
      id: options.id
    });
    $el.find('.aui-dialog2-footer-actions .aui-button').click(function (e) {
      EventDispatcher.dispatch('dialog-button-click', $(e.target));
    });
    const dialog = AJS.dialog2($el);
    if (!options.size || options.size === 'fullscreen') {
      AJS.layer($el).changeSize(options.width, options.height);
    }
    dialog.show();
    DialogActions.open();
    dialog.on('hide', function () {
      DialogActions.close({isHiding: true});
    });
    _dialogs[_id] = this;
  }
  on(event, callback) {
    EventDispatcher.register('dialog-' + event, callback);
  }
}

class Button {
  constructor (name) {
    const dialog = getActiveDialog();
    if (dialog) {
      this.$el = dialog.$el.find('.aui-dialog2-footer-actions .aui-button').filter(function () {
        return $(this).data('name') === name;
      });
    }
  }
  bind (callback) {
    this.$el && this.$el.click(callback);
  }
  enable () {
    this.$el && this.$el.attr('aria-disabled', false);
  }
  disable () {
    this.$el && this.$el.attr('aria-disabled', true);
  }
  isEnabled (callback) {
    callback(this.$el && this.$el.attr('aria-disabled'));
  }
  toggle () {
    this.$el && this.$el.attr('aria-disabled', this.$el.attr('aria-disabled') !== 'true');
  }
  trigger () {
    this.$el && this.$el.click();
  }
}

module.exports = {
  create: {
    constructor: Dialog,
    on: Dialog.prototype.on
  },
  close: function (data) {
    DialogActions.close(data);
  },
  onDialogMessage: function (message, listener) {

  },
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