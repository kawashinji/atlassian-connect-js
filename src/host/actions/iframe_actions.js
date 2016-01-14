import EventDispatcher from 'dispatchers/event_dispatcher';
import util from '../util';

// EventDispatcher.register('iframe-resize', function(data){
//   util.getIframeByExtensionId(data.context.extension_id).css({
//     width: util.stringToDimension(data.width),
//     height: util.stringToDimension(data.height)
//   });
// });

module.exports = {
  createIframe: function(extension){
    EventDispatcher.dispatch('iframe-requested', {extension});
  },
  notifyIframeCreated: function($el, extension_id, extension) {
    EventDispatcher.dispatch('iframe-create', {$el, extension_id, extension});
  }
};