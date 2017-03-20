import IframeContainerComponent from './components/iframe_container';
import HostApi from './host-api';

function create(extension) {
  var simpleXdmExtension = {
    addon_key: extension.addon_key,
    key: extension.key,
    url: extension.url,
    options: extension.options
  };
  let addonProvider = HostApi.getProvider('addon');
  if (addonProvider) {
    // return addonProvider.createExtension(simpleXdmExtension);
    let extension = IframeContainerComponent.createExtension(simpleXdmExtension);
    addonProvider.registerExtension(extension);
    return return;
  } else {
    return IframeContainerComponent.createExtension(simpleXdmExtension);
  }
}

export default create;