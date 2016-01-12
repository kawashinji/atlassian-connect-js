import $ from './dollar';
import simpleXDM from 'simple-xdm/dist/host';
import EventDispatcher from 'dispatchers/event_dispatcher';
import LoadingIndicator from 'components/loading_indicator';

function create(extension, creationCallback) {
  var simpleXdmExtension = {
    addon_key: extension.addon_key,
    key: extension.key,
    url: extension.url,
    options: extension.options
  };
  var $container = $("<div />").addClass("ap-container");
  var iframeAttributes = simpleXDM.create(simpleXdmExtension, function(extension_id){
    EventDispatcher.dispatch("iframe-bridge-estabilshed", $.extend({
      $el: $container,
      extension_id,
    }, simpleXdmExtension));
  });

  var $el = $("<iframe />").attr(iframeAttributes);
  $container.append($el);

  EventDispatcher.dispatch("create-iframe", $.extend({$el: $container, extension_id: iframeAttributes.id}, simpleXdmExtension));
  return $container;
}

module.exports = create;