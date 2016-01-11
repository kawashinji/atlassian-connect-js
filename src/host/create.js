import $ from './dollar';
import simpleXDM from 'simple-xdm/dist/host';
import EventDispatcher from './event-dispatcher';
import LoadingIndicator from './components/loading-indicator';

function create(extension, creationCallback) {
  var simpleXdmExtension = {
    addon_key: extension.addon_key,
    key: extension.key,
    url: extension.url,
    options: extension.options
  };

  var iframeAttributes = simpleXDM.create(simpleXdmExtension, function(extension_id){
    EventDispatcher.dispatch("iframe-bridge-estabilshed", $.extend({
      extension_id,
    }, simpleXdmExtension));
  });

  var $el = $("<iframe />").attr(iframeAttributes);
  var $container = $("<div />").addClass("ap-container").append($el);

  EventDispatcher.dispatch("create-iframe", $.extend({$el: $container, extension_id: iframeAttributes.id}, simpleXdmExtension));
  return $container;
}

module.exports = create;