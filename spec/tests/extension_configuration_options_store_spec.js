import ExtensionConfigurationOptionsStore from 'src/host/stores/extension_configuration_options_store';
import SimpleXdmUtils from 'src/host/utils/simplexdm';

describe('Extension Configuration Options Store', () => {

  beforeEach(() => {
    ExtensionConfigurationOptionsStore.store = {};
  });

  it('sets an option that is added to the iframe', () => {
    ExtensionConfigurationOptionsStore.set('crev', '1.2.3.4.5');
    var simpleXdmExtension = SimpleXdmUtils.createSimpleXdmExtension({
      addon_key: 'abc123',
      key: 'some-module-key',
      url: 'http://www.example.com',
      options: {
        noDOM: true
      }
    });
    expect(simpleXdmExtension.extension.options.globalOptions).toEqual({'crev': '1.2.3.4.5'});
    var parsedIframeName = JSON.parse(simpleXdmExtension.iframeAttributes.name);
    expect(parsedIframeName.options.globalOptions.crev).toEqual('1.2.3.4.5');
  });

});