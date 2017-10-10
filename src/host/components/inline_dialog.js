import EventDispatcher from '../dispatchers/event_dispatcher';
import InlineDialogActions from '../actions/inline_dialog_actions';
import IframeActions from '../actions/iframe_actions';
import $ from '../dollar';
import util from '../util';

const DESTROY_AFTER = 1000; // time after an inline dialog hides before it is destroyed (set to zero for instant).
class InlineDialog {

  destroy($el) {
    $el.remove();
  }

  resize(data){
    var width = util.stringToDimension(data.width);
    var height = util.stringToDimension(data.height);
    var $content = data.$el.find('.contents');
    if($content.length === 1){
      $content.css({
        width: width,
        height: height
      });
      InlineDialogActions.refresh(data.$el);
    }
  }

  refresh($el){
    $el[0].popup.reset();
  }

  _getInlineDialog($el){
    return AJS.InlineDialog($el);
  }
  _renderContainer(){
    return $('<div />').addClass('aui-inline-dialog-contents');
  }
  _displayInlineDialog(data){
    InlineDialogActions.created({
      $el: data.$el,
      trigger: data.trigger,
      extension: data.extension
    });
  }
  hideInlineDialog($el){
    $el.hide();
  }

  closeInlineDialog(){
    $('.aui-inline-dialog').filter(function(){
      return $(this).find('.ap-iframe-container').length > 0;
    }).hide();
  }

  render(data){
    var $inlineDialog = $(document.getElementById('inline-dialog-' + data.id));

    if ($inlineDialog.length !== 0) {
      $inlineDialog.remove();
    }

    var $el = AJS.InlineDialog(
      data.bindTo,
      //assign unique id to inline Dialog
      data.id,
      ($placeholder, trigger, showInlineDialog) => {
        $placeholder.append(data.$content);
        this._displayInlineDialog({
          extension: data.extension,
          $el: $placeholder,
          trigger: trigger
        });
        showInlineDialog();
      },
      data.inlineDialogOptions
    );
    return $el;
  }

}

var InlineDialogComponent = new InlineDialog();

EventDispatcher.register('iframe-resize', function(data) {
  var container = data.$el.parents('.aui-inline-dialog');
  if(container.length === 1) {
    InlineDialogComponent.resize({
      width: data.width,
      height: data.height,
      $el: container
    });
  }
});

EventDispatcher.register('inline-dialog-refresh', function(data){
  InlineDialogComponent.refresh(data.$el);
});

EventDispatcher.register('inline-dialog-hide', function(data) {
  InlineDialogComponent.hideInlineDialog(data.$el);
});

EventDispatcher.register('inline-dialog-close', function(data) {
  InlineDialogComponent.closeInlineDialog();
});

// EventDispatcher.register('inline-dialog-hidden', function(data){
//   setTimeout(function(){
//     if(!data.$el.is(':visible')) {
//       InlineDialogComponent.destroy(data.$el);
//       IframeActions.notifyIframeDestroyed(data.extension_id);
//     }
//   }, DESTROY_AFTER);
// });

// $(document).on('hideLayer', function (event, type, data) {
//   // ensure it's a connect inline dialog
//   if(type === 'inlineDialog' && data.popup.find('.ap-iframe')) {
//     let extensionId = data.popup.find('.ap-iframe').attr('id');
//     console.log("I WOULD REMOVE", extensionId, data.popup, arguments);
//     InlineDialogActions.hideTriggered(extensionId, data.popup)
//   }
// });

export default InlineDialogComponent;