import DropdownModule from 'src/host/modules/dropdown';
import EventDispatcher from 'src/host/dispatchers/event_dispatcher';
import EventActions from 'src/host/actions/event_actions';
import HostApi from 'src/host/host-api';

describe('dropdown api module', () => {
  const frameworkAdaptor = HostApi.getFrameworkAdaptor();

  const fakeCallback = function(){};
  fakeCallback._context = {
    extension: {
      extension_id: 'some-extension-id'
    }
  };

  const providerSpy = jasmine.createSpyObj('moduleProvider', [
    'registerItemNotifier',
    'create',
    'hide',
    'showAt',
    'itemActivated',
    'itemDisabled'
  ]);

  let dropdownProvider = {
    getModuleRegistrationName: function() {
      return 'dropdown';
    },
    isEnabled: function() {
      return true;
    },
    getProvider: function(){
      return providerSpy;
    }
  };
  frameworkAdaptor.registerModule(dropdownProvider);

  beforeEach(() => {
    providerSpy.registerItemNotifier.calls.reset();
    providerSpy.create.calls.reset();
    providerSpy.hide.calls.reset();
    providerSpy.showAt.calls.reset();
    providerSpy.itemActivated.calls.reset();
    providerSpy.itemDisabled.calls.reset();
  });

  describe('create', () => {

    it('formats sections', () => {
      let options = {
        dropdownId: 'some-dropdown-id',
        list: [{
          heading: 'section heading',
          list: [
            {text: 'one'},
            {text: 'two'}
          ]
        }]
      };
      let formattedOptions = DropdownModule.create(Object.assign({}, options), fakeCallback);
      expect(formattedOptions).toEqual({
        dropdownId: options.dropdownId,
        dropdownGroups: [{
          heading: options.list[0].heading,
          items: [
            {content: options.list[0].list[0].text},
            {content: options.list[0].list[1].text}
          ]
        }],
        dropdownItemNotifier: jasmine.any(Function)
      });

    });

  });

});