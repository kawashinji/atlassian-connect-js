import EventDispatcher from 'dispatchers/event_dispatcher';
import util from '../util';

function hideInlineDialog(data){
  var iframe = util.getIframeByExtensionId(data.extension_id);
  iframe.closest('.aui-inline-dialog2')[0].hide();
}

EventDispatcher.register("inline-dialog-hide", hideInlineDialog);

export default {
  hide: function(callback){
    InlineDialogActions.hide(callback._context.extension_id);
  }
};