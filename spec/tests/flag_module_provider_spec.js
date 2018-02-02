import extend from 'object-assign';
import FlagModule from 'src/host/modules/flag';
import ModuleProviders from 'src/host/module-providers';
import EventActions from 'src/host/actions/event_actions';
import { acjsFrameworkAdaptor } from 'src/host/ACJSFrameworkAdaptor';

const callback = () => {};
callback._id = 'some-extension-id';
callback._context = {
  extension: {
    addon_key: 'some-addon-key',
    key: 'some-module-key',
    options: jasmine.objectContaining({})
  }
};

const appProviderSpy = {
  registerUnmountCallback: jasmine.createSpy('registerUnmountCallback')
};

const flagProviderSpy = {
  create: jasmine.createSpy('create'),
  close: jasmine.createSpy('close')
};

class FlagModuleSpy {
  constructor(providerSpy) {
    this.providerSpy = flagProviderSpy;
  }
  isEnabled() {
    return true;
  }
  getModuleRegistrationName() {
    return 'flag';
  }
  getProvider() {
    return this.providerSpy;
  }
};

acjsFrameworkAdaptor.registerModule(new FlagModuleSpy(flagProviderSpy));

describe('AP.flag', () => {

  const flagOptions = {
    type: 'some type',
    title: 'some title',
    body: 'some body',
    actions: {
      key: 'some action text'
    }
  };

  beforeEach(() => {
    flagProviderSpy.create.calls.reset();
    flagProviderSpy.close.calls.reset();
    appProviderSpy.registerUnmountCallback.calls.reset();
  });

  describe('.create()', () => {
    it('does not invoke registerUnmountCallback if provider not registered', () => {
      ModuleProviders.registerProvider('addon', null);
      new FlagModule.create.constructor(flagOptions, callback);
      expect(appProviderSpy.registerUnmountCallback).not.toHaveBeenCalled();
    });

    it('does not invoke registerUnmountCallback if not implemented in provider', () => {
      ModuleProviders.registerProvider('addon', {});
      new FlagModule.create.constructor(flagOptions, callback);
      expect(appProviderSpy.registerUnmountCallback).not.toHaveBeenCalled();
    });

    it('invokes registerUnmountCallback if available', () => {
      ModuleProviders.registerProvider('addon', appProviderSpy);
      new FlagModule.create.constructor(flagOptions, callback);
      expect(appProviderSpy.registerUnmountCallback.calls.count()).toEqual(1);
    });
  });

});