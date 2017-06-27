import DropdownModule from 'src/host/modules/dropdown';
import EventDispatcher from 'src/host/dispatchers/event_dispatcher';
import EventActions from 'src/host/actions/event_actions';
import ModuleProviders from 'src/host/module-providers';
import extend from 'object-assign';

describe('dropdown api module', () => {
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

  ModuleProviders.registerProvider('dropdown', providerSpy);
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
        dropdown_id: 'some-dropdown-id',
        list: [{
          heading: 'section heading',
          list: [
            {text: 'one'},
            {text: 'two'}
          ]
        }]
      };
      let formattedOptions = DropdownModule.create(extend({}, options), fakeCallback);

      expect(formattedOptions).toEqual({
        dropdown_id: options.dropdown_id,
        list: [{
          heading: options.list[0].heading,
          items: [
            {content: options.list[0].list[0].text},
            {content: options.list[0].list[1].text}
          ]
        }]
      });

    });

  });

});