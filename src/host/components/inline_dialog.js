import EventDispatcher from 'dispatchers/event_dispatcher';
import InlineDialogActions from 'actions/inline_dialog_actions';
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
    $el.on("aui-layer-show", function(e){
      console.log('aui layer show', e);
    });
    // $el.on("aui-layer-hide", function(e) {
    //   if(e.currentTarget.id === attributes.id){
    //     e.preventDefault();
    //   }
    //   // 
    //   console.log('aui layer hide', e);
    //   // InlineDialogActions.hideTriggered(extension_id, $el);
    // });
    // $el.append(this._renderContainer());
    return $el;
  }

}

var InlineDialogComponent = new InlineDialog();

export default InlineDialogComponent;