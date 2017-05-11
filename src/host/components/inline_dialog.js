import EventDispatcher from '../dispatchers/event_dispatcher';
import InlineDialogActions from '../actions/inline_dialog_actions';
import $ from '../dollar';
import util from '../util';

class InlineDialog {

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

  hide(context) {
    InlineDialogActions.close();
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
  var $el = util.getIframeByContext(data.context);
  var container = $el.parents('.aui-inline-dialog');
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


export default InlineDialogComponent;