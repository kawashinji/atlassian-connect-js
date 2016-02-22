import EventDispatcher from 'dispatchers/event_dispatcher';
import dialogRenderer from '../dialog/renderer';
import create from '../create';

function isConnectDialog($el) {
  return ($el && $el.hasClass('ap-aui-dialog2'));
}

function keyPressListener(e) {
  var topLayer;
  if(e.keyCode === 27) {
    topLayer = AJS.LayerManager.global.getTopLayer();
    if(isConnectDialog(topLayer)) {
      getActiveDialog().hide();
    }
  }
}

// $(document).on('keydown', keyPressListener);

EventDispatcher.on('dialog-button-click', function($el){
  var buttonOptions = $el.data('options');
  console.log('button options?', buttonOptions, $el);
  getActiveDialog().hide();
});

function getActiveDialog(){
  return AJS.dialog2(AJS.LayerManager.global.getTopLayer());
}

function closeDialog(data){
  EventDispatcher.dispatch('dialog-close', data);
}

function dialogIframe(options, context) {
  return create({
    addon_key: context.extension.addon_key,
    key: options.key,
    // url: options.url
    url: 'http://cwhittington:8000/iframe-dialog-content.html'
  });
}

module.exports = {
  create: function(options, callback) {
    var iframe = dialogIframe(options, callback._context);
    var dialogDOM = dialogRenderer.render(iframe, options, options.chrome);

    var dialog = AJS.dialog2(dialogDOM);
    dialog.show();
    EventDispatcher.dispatch('dialog-open', {
      $el: iframe,
      $dialog: dialog
    });

    dialog.on('hide', closeDialog);
  },
  close: function(data){
    closeDialog();
  },
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