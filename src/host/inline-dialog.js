import EventDispatcher from './event-dispatcher';
import util from './util';

function hideInlineDialog(data){
  var iframe = util.getIframeByExtensionId(data.extension_id);
  iframe.closest('.aui-inline-dialog2')[0].hide();
}

EventDispatcher.register("inline-dialog-hide", hideInlineDialog);

export default {
  hide: function(callback){
    EventDispatcher.dispatch("inline-dialog-hide", {extension_id: callback._context.extension_id});
  }
};