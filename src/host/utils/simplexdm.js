import iframeUtils from './iframe';
import simpleXDM from 'simple-xdm/host';
import IframeActions from '../actions/iframe_actions';
import util from '../util';

// nowhere better to put this. Wires an extension for oldschool and new enviroments
function createSimpleXdmExtension(extension){
  extension = extensionConfigSanitizer(extension);
  if(!extension.options){
    extension.options = {};
  }
  var iframeAttributes = simpleXDM.create(extension, () => {
    IframeActions.notifyBridgeEstablished(extension.$el || extension.el, extension);
  }, () => {
    IframeActions.notifyUnloaded(extension.$el || extension.el, extension);
  });
  extension.id = iframeAttributes.id;
  util.extend(iframeAttributes, iframeUtils.optionsToAttributes(extension.options));
  return {
    iframeAttributes,
    extension
  }
}

function extensionConfigSanitizer(extension) {
  return {
    addon_key: extension.addon_key,
    key: extension.key,
    url: extension.url,
    options: extension.options
  };

}


export default {
  createSimpleXdmExtension,
  extensionConfigSanitizer
}