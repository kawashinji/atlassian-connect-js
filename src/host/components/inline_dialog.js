import EventDispatcher from '../dispatchers/event_dispatcher';
import InlineDialogActions from '../actions/inline_dialog_actions';
import $ from '../dollar';
import util from '../util';

class InlineDialog {

  resize(data){
    var width = util.stringToDimension(data.width);
    var height = util.stringToDimension(data.height);
    var $content = data.$el.find('.aui-inline-dialog-contents');
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

  hideInlineDialog(el){
    el.open = false;
  }

  closeInlineDialog(){
    document.querySelectorAll('.ac-inline-dialog').forEach((el) => {
      el.open = false;
    });
  }

  render(data){
    const inlineDialogId = 'inline-dialog-' + data.id;
    var inlineDialogEl = document.getElementById(inlineDialogId);

    if (inlineDialogEl) {
      return inlineDialogEl;
    }
    if(data.bindTo){
      data.bindTo.dataset.auiTrigger = true;
      data.bindTo.setAttribute('aria-controls', inlineDialogId);
    }
    inlineDialogEl = document.createElement('aui-inline-dialog');
    inlineDialogEl.id = inlineDialogId;
    inlineDialogEl.classList.add('ac-inline-dialog');
    inlineDialogEl.addEventListener('aui-show', function(e){
      console.log("AUI SHOW", e, data);
      InlineDialogActions.opened({
        el: e.target,
        trigger: data.bindTo,
        extension: data.extension
      });
    });

    return inlineDialogEl;
    //responds-to="hover"
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


export default InlineDialogComponent;