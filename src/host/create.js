import $ from './dollar';
import EventDispatcher from 'dispatchers/event_dispatcher';
import IframeContainerComponent from 'components/iframe_container';

function create(extension) {
  var simpleXdmExtension = {
    addon_key: extension.addon_key,
    key: extension.key,
    url: extension.url,
    options: extension.options
  };
  return IframeContainerComponent.createExtension(simpleXdmExtension);

  // return IframeComponent.simpleXdmExtension(simpleXdmExtension);

}

module.exports = create;