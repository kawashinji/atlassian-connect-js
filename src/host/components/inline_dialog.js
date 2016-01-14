import EventDispatcher from 'dispatchers/event_dispatcher';
import $ from '../dollar';

class InlineDialog {
  constructor () {
  }

  render(attributes){
    var $el = $("<aui-inline-dialog />");
    $el.attr(attributes || {});
    $el.addClass("ap-inline-dialog-container");
    return $el;
  }

}

var InlineDialogComponent = new InlineDialog();

export default InlineDialogComponent;