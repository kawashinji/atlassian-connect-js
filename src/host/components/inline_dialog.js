import EventDispatcher from 'dispatchers/event_dispatcher';
import InlineDialogActions from 'actions/inline_dialog_actions';
import $ from '../dollar';

class InlineDialog {
  constructor () {
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

export default InlineDialogComponent;