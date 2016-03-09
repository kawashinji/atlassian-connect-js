import EventDispatcher from 'dispatchers/event_dispatcher';
import DialogComponent from 'components/dialog';
import IframeContainer from 'components/iframe_container';

const DLGID_PREFIX = 'ap-dialog-';
const _dialogs = {};

function isConnectDialog($el) {
  return ($el && $el.hasClass('ap-aui-dialog2'));
}

function keyPressListener(e) {
  if(e.keyCode === 27) {
    let topLayer = AJS.LayerManager.global.getTopLayer();
    if(isConnectDialog(topLayer)) {
      getActiveDialog().hide();
    }
  }
}

// $(document).on('keydown', keyPressListener);

EventDispatcher.on('dialog-button-click', function($el){
  const buttonOptions = $el.data('options');
  console.log('button options?', buttonOptions, $el);
  getActiveDialog().hide();
});

function getActiveDialog(){
  return AJS.dialog2(AJS.LayerManager.global.getTopLayer());
}

function closeDialog(data){
  EventDispatcher.dispatch('dialog-close', data);
  const dialog = getActiveDialog();
  const _id = dialog.$el.attr('id').replace(DLGID_PREFIX, '');
  _dialogs[_id]._destroy();
  dialog.hide();
}

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
    const dialogDOM = DialogComponent.render({
      $content: $iframeContainer,
      title: options.title,
      hint: options.hint,
      actions: ['submit', 'cancel'],
      id: options.id
    });
    const dialog = AJS.dialog2(dialogDOM);
    dialog.show();
    EventDispatcher.dispatch('dialog-open', {
      $el: $iframeContainer,
      $dialog: dialog
    });
    dialog.on('hide', function () {
      closeDialog();
    });
    _dialogs[_id] = this;
  }
  on(event, callback) {
    EventDispatcher.register('dialog-' + event, callback);
  }
}

module.exports = {
  create: {
    constructor: Dialog,
    on: Dialog.prototype.on
  },
  close: closeDialog,
  isDialog: true,
  onDialogMessage: function (message, listener) {

  },
  getButton: function(name, callback){
    callback({
      name: name
      // bind: function(){
      //   console.log('called!');
      // },
      // disable: function(){}
    });
  }
};