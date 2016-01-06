import $ from './dollar';
import simpleXDM from 'simple-xdm/dist/host';
import EventDispatcher from './event-dispatcher';

function create(options, creationCallback) {
  var extension = {
    addon_key: options.addon_key,
    key: options.key,
    url: options.url
  };

  var iframeAttributes = simpleXDM.create(extension, function(extension_id){
    EventDispatcher.dispatch("create-extension", $.extend({
      extension_id
    }, extension));
  });

  var $el = $("<iframe />").attr(iframeAttributes);
  EventDispatcher.dispatch("create-iframe", $.extend({$el}, extension));
  return $el;
}

module.exports = create;