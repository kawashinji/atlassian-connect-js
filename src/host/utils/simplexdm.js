import iframeUtils from './iframe';
import simpleXDM from 'simple-xdm/host';
import IframeActions from '../actions/iframe_actions';
import util from '../util';
import $ from '../dollar';
import ExtensionConfigurationOptionStore from '../stores/extension_configuration_options_store';

// nowhere better to put this. Wires an extension for oldschool and new enviroments
function createSimpleXdmExtension(extension){
  const extensionConfig = extensionConfigSanitizer(extension);
  const systemExtensionConfigOptions = ExtensionConfigurationOptionStore.get();
  extension.options = extensionConfig.options = util.extend({}, extensionConfig.options);
  extension.options.globalOptions = systemExtensionConfigOptions;
  const iframeAttributes = simpleXDM.create(extensionConfig, () => {
    if(!extension.options.noDOM){
      extension.$el = $(document.getElementById(extension.id));
    }
    IframeActions.notifyBridgeEstablished(extension.$el, extension);
  }, () => {
    IframeActions.notifyUnloaded(extension.$el, extension);
  });
  // HostApi destroy is relying on previous behaviour of the
  // iframe component wherein it would call simpleXDM.create(extension)
  // and then mutate the extension object with the id returned from the
  // iframeAttributes see changes made in ACJS-760 and ACJS-807
  extensionConfig.id = iframeAttributes.id;
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