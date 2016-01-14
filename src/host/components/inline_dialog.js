import EventDispatcher from 'dispatchers/event_dispatcher';
import $ from '../dollar';

class InlineDialog {
  constructor () {
  }

  render(attributes){
    return $("<aui-inline-dialog />").attr(attributes || {});
  }

}

var InlineDialogComponent = new InlineDialog();

export default InlineDialogComponent;