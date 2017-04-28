import EventDispatcher from '../dispatchers/event_dispatcher';
import InlineDialogActions from '../actions/inline_dialog_actions';
import $ from '../dollar';
import util from '../util';

class InlineDialog {

  resize(width, height, context){
    var $el = util.getIframeByContext(context);
    var container = $el.parents('.aui-inline-dialog');
    if(container.length === 1) {
      var newWidth = util.stringToDimension(width);
      var newHeight = util.stringToDimension(height);
      var $content = $el.find('.contents');
      $content.css({
        width: newWidth,
        height: newHeight
      });
      InlineDialogActions.refresh($el);
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

EventDispatcher.register('inline-dialog-refresh', function(data){
  InlineDialogComponent.refresh(data.$el);
});

EventDispatcher.register('inline-dialog-hide', function(data) {
  InlineDialogComponent.hideInlineDialog(data.$el);
});

export default InlineDialogComponent;