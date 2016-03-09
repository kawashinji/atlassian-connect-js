import EventDispatcher from 'dispatchers/event_dispatcher';
import InlineDialogActions from 'actions/inline_dialog_actions';
import $ from '../dollar';
import util from '../util';

class InlineDialog {
  constructor () {
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
      InlineDialogActions.refresh({
        $el: $content
      });
    }
  }

  refresh($el){
    this._getInlineDialog($el).refresh();
  }

  _getInineDialog($el) {
    return AJS.InlineDialog($el);
  }
  _renderContainer(){
    return $("<div />").addClass("aui-inline-dialog-contents");
  }
  _displayInlineDialog(data){
    InlineDialogActions.created({
      $el: data.$el,
      trigger: data.trigger,
      extension: data.extension
    });
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
        data.dialogOptions
    );
    return $el;
  }

}

var InlineDialogComponent = new InlineDialog();

EventDispatcher.register('iframe-resize', function(data) {
  var container = data.$el.parents(".aui-inline-dialog");
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

export default InlineDialogComponent;