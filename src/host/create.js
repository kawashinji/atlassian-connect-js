import $ from './dollar';
import simpleXDM from 'simple-xdm/dist/host';
import EventDispatcher from './event-dispatcher';

function create(extension, creationCallback) {
  var simpleXdmExtension = {
    addon_key: extension.addon_key,
    key: extension.key,
    url: extension.url,
    options: extension.options
  };

  var iframeAttributes = simpleXDM.create(simpleXdmExtension, function(extension_id){
    EventDispatcher.dispatch("create-extension", $.extend({
      extension_id
    }, simpleXdmExtension));
  });

  var $el = $("<iframe />").attr(iframeAttributes);
  EventDispatcher.dispatch("create-iframe", $.extend({$el}, simpleXdmExtension));
  return $el;
}

module.exports = create;