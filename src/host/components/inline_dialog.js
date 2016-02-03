import EventDispatcher from 'dispatchers/event_dispatcher';
import $ from '../dollar';

class InlineDialog {
  constructor () {
  }
  _renderContainer(){
    return $("<div />").addClass("aui-inline-dialog-contents");
  }
  render(attributes){
    var $el = $('<aui-inline-dialog />');
    $el.attr(attributes || {});
    $el.addClass('ap-inline-dialog-container');
    $el.append(this._renderContainer());
    return $el;
  }

}

var InlineDialogComponent = new InlineDialog();

export default InlineDialogComponent;