import $ from './dollar';
import EventDispatcher from 'dispatchers/event_dispatcher';
import IframeComponent from 'components/iframe';

function create(extension) {
  var simpleXdmExtension = {
    addon_key: extension.addon_key,
    key: extension.key,
    url: extension.url,
    options: extension.options
  };

  return IframeComponent.simpleXdmExtension(simpleXdmExtension);

}

module.exports = create;