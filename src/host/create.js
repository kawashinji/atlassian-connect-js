import IframeContainerComponent from './components/iframe_container';

function create(extension) {
  var simpleXdmExtension = {
    addon_key: extension.addon_key,
    key: extension.key,
    url: extension.url,
    options: extension.options,
    hostOrigin: extension.hostOrigin
  };
  return IframeContainerComponent.createExtension(simpleXdmExtension);
}

export default create;