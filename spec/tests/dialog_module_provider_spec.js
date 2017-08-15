import extend from 'object-assign';
import DialogModule from 'src/host/modules/dialog';
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
const otherAddonCallback = extend({}, callback, {_context: {extension: {addon_key: 'some-other-addon-key'}}});

const providerSpy = {
  create: jasmine.createSpy('create'),
  close: jasmine.createSpy('close'),
  createButton: jasmine.createSpy('createButton'),
  setButtonDisabled: jasmine.createSpy('setButtonDisabled'),
  isButtonDisabled: jasmine.createSpy('isButtonDisabled'),
  toggleButton: jasmine.createSpy('toggleButton'),
  setButtonHidden: jasmine.createSpy('setButtonHidden'),
  isButtonHidden: jasmine.createSpy('isButtonHidden'),
  isActiveDialog: jasmine.createSpy('isActiveDialog').and.callFake(function(addon_key){
    return addon_key === 'some-addon-key'
  })
};

class DialogModuleSpy {
  constructor() {
    this.providerSpy = providerSpy;
  }
  getModuleRegistrationName() {
    return 'dialog';
  }
  getProvider() {
    return this.providerSpy;
  }
};

acjsFrameworkAdaptor.registerModule(new DialogModuleSpy(providerSpy));

describe('AP.dialog', () => {

  const minOptions = {
    key: 'some-module-key'
  };
  const maxOptions = {
    key: 'some-module-key',
    size: 'xlarge',
    width: '100%',
    height: '100%',
    chrome: true,
    header: 'some-header-text',
    submitText: 'some-submit-text',
    cancelText: 'some-cancel-text',
    customData: {someCustomKey: 'someCustomData'},
    closeOnEscape: false,
    buttons: [{identifier: 'someButtonIdentifier', text: 'someButtonText'}],
    hint: 'some-hint-text'
  };

  beforeEach(() => {
    providerSpy.create.calls.reset();
    providerSpy.close.calls.reset();
    providerSpy.createButton.calls.reset();
    providerSpy.setButtonDisabled.calls.reset();
    providerSpy.isButtonDisabled.calls.reset();
    providerSpy.toggleButton.calls.reset();
    providerSpy.setButtonHidden.calls.reset();
    providerSpy.isButtonHidden.calls.reset();
    providerSpy.isActiveDialog.calls.reset();
  });

  describe('.create()', () => {

    const tests = [
      {
        it: 'provides expected default values',
        javaScriptAPIOptions: {
          key: 'some-module-key',
          chrome: true
        },
        dialogProviderOptions: {
          id: 'some-extension-id',
          width: '50%',
          height: '50%',
          header: '',
          actions: [
            jasmine.objectContaining({
              identifier: 'submit',
              name: 'submit',
              text: 'Submit'
            }),
            jasmine.objectContaining({
              identifier: 'cancel',
              name: 'cancel',
              text: 'Cancel'
            })
          ],
          closeOnEscape: true
        }
      },
      {
        it: 'provides custom height and widths over default',
        javaScriptAPIOptions: extend({}, minOptions, {
          height: '111px',
          width: '222px'
        }),
        dialogProviderOptions: {
          height: '111px',
          width: '222px'
        }
      },
      {
        it: 'provides size over custom height and widths',
        javaScriptAPIOptions: maxOptions,
        dialogProviderOptions: {
          size: 'xlarge',
          height: undefined,
          width: undefined
        }
      },
      {
        it: 'provides custom header text',
        javaScriptAPIOptions: maxOptions,
        dialogProviderOptions: {
          header: maxOptions.header
        }
      },
      {
        it: 'provides custom submit button text',
        javaScriptAPIOptions: maxOptions,
        dialogProviderOptions: {
          actions: [
            jasmine.objectContaining({
              identifier: 'submit',
              name: 'submit',
              text: 'some-submit-text'
            }),
            jasmine.anything(),
            jasmine.anything()
          ]
        }
      },
      {
        it: 'provides custom value for close on escape',
        javaScriptAPIOptions: extend({}, maxOptions, {
          closeOnEscape: false
        }),
        dialogProviderOptions: {
          closeOnEscape: false
        }
      },
      {
        it: 'provides multiple user buttons',
        javaScriptAPIOptions: extend({}, maxOptions, {
          buttons: [
            {
              identifier: 'button1-id',
              text: 'button1-text'
            },
            {
              identifier: 'button2-id',
              text: 'button2-text'
            },
            {
              identifier: 'button3-id',
              text: 'button3-text'
            }
          ]
        }),
        dialogProviderOptions: {
          actions: [
            jasmine.anything(),
            jasmine.anything(),
            jasmine.objectContaining({
              identifier: 'button1-id',
              text: 'button1-text'
            }),
            jasmine.objectContaining({
              identifier: 'button2-id',
              text: 'button2-text'
            }),
            jasmine.objectContaining({
              identifier: 'button3-id',
              text: 'button3-text'
            })
          ]
        }
      },
      {
        it: 'provides hint text',
        javaScriptAPIOptions: maxOptions,
        dialogProviderOptions: {
          hint: 'some-hint-text'
        }
      }
    ];

    tests.forEach(test => {
      it(test.it, () => {
        new DialogModule.create.constructor(test.javaScriptAPIOptions, callback);
        expect(providerSpy.create).toHaveBeenCalledWith(
          jasmine.objectContaining(test.dialogProviderOptions),
          jasmine.objectContaining(callback._context.extension)
        );
      });
    });
  });

  describe('.create()', () => {

    it('triggers correct AP.events when submit is clicked', () => {
      new DialogModule.create.constructor(maxOptions, callback);
      spyOn(EventActions, 'broadcast');
      providerSpy.create.calls.argsFor(0)[0].actions[0].onClick();
      expect(EventActions.broadcast.calls.count()).toEqual(2);
      expect(EventActions.broadcast.calls.first().args).toEqual([
        'dialog.submit',
        jasmine.objectContaining({
          addon_key: callback._context.extension.addon_key,
          key: callback._context.extension.key
        }),
        jasmine.objectContaining({
          button: {
            name: 'submit',
            identifier: 'submit',
            text: 'some-submit-text'
          }
        })
      ]);
      expect(EventActions.broadcast.calls.all()[1].args).toEqual([
        'dialog.button.click',
        jasmine.objectContaining({
          addon_key: callback._context.extension.addon_key,
          key: callback._context.extension.key
        }),
        jasmine.objectContaining({
          button: {
            name: 'submit',
            identifier: 'submit',
            text: 'some-submit-text'
          }
        })
      ]);

      it('triggers correct AP.events when cancel is clicked', () => {
        new DialogModule.create.constructor(maxOptions, callback);
        spyOn(EventActions, 'broadcast');
        providerSpy.create.calls.argsFor(0)[0].actions[0].onClick();
        expect(EventActions.broadcast.calls.count()).toEqual(2);
        expect(EventActions.broadcast.calls.first().args).toEqual([
          'dialog.cancel',
          jasmine.objectContaining({
            addon_key: callback._context.extension.addon_key,
            key: callback._context.extension.key
          }),
          jasmine.objectContaining({
            button: {
              name: 'cancel',
              identifier: 'cancel',
              text: 'some-cancel-text'
            }
          })
        ]);
        expect(EventActions.broadcast.calls.all()[1].args).toEqual([
          'dialog.button.click',
          jasmine.objectContaining({
            addon_key: callback._context.extension.addon_key,
            key: callback._context.extension.key
          }),
          jasmine.objectContaining({
            button: {
              name: 'cancel',
              identifier: 'cancel',
              text: 'some-cancel-text'
            }
          })
        ]);
      });

      it('triggers correct AP.events when user button is clicked', () => {
        new DialogModule.create.constructor(maxOptions, callback);
        spyOn(EventActions, 'broadcast');
        providerSpy.create.calls.argsFor(0)[0].actions[0].onClick();
        expect(EventActions.broadcast.calls.count()).toEqual(1);
        expect(EventActions.broadcast.calls.first().args).toEqual([
          'dialog.button.click',
          jasmine.objectContaining({
            addon_key: callback._context.extension.addon_key,
            key: callback._context.extension.key
          }),
          jasmine.objectContaining({
            button: {
              name: 'someButtonIdentifiersomeButtonIdentifier',
              identifier: 'someButtonIdentifier',
              text: 'someButtonText'
            }
          })
        ]);
      });

    });

  });

  describe('.close()', () => {

    it('provides close function', () => {
      new DialogModule.create.constructor(minOptions, callback);
      DialogModule.close(callback);
      expect(providerSpy.close).toHaveBeenCalled();
    });

    it('does not provide close function for other addons', () => {
      new DialogModule.create.constructor(minOptions, callback);
      expect(function(){
        DialogModule.close(otherAddonCallback)
      }).toThrow(new Error('Failed to find an active dialog.'));
      expect(providerSpy.close).not.toHaveBeenCalled();
    });

    it('provides dialog.close event and data', () => {
      new DialogModule.create.constructor(minOptions, callback);
      let data = {someKey: 'someValue'};
      spyOn(EventActions, 'broadcast');
      DialogModule.close(data, callback);
      expect(EventActions.broadcast).toHaveBeenCalledWith(
        'dialog.close',
        jasmine.objectContaining({addon_key: callback._context.extension.addon_key}),
        jasmine.objectContaining(data)
      );
    });


  });

  describe('.createButton()', () => {

    it('provides a new button with expected default values', () => {
      new DialogModule.createButton.constructor({
        identifier: 'some-button-identifier',
        text: 'some-button-text'
      }, callback);
      expect(providerSpy.createButton).toHaveBeenCalledWith(
        jasmine.objectContaining(
          {
            identifier: 'some-button-identifier',
            text: 'some-button-text'
          }
        )
      );
    });

    it('does not provide a new button for other addons', () => {
      expect(function(){
        new DialogModule.createButton.constructor(
          {
            identifier: 'some-button-identifier',
            text: 'some-button-text'
          },
          otherAddonCallback
        )
      }).toThrow(new Error('Failed to find an active dialog.'));
      expect(providerSpy.createButton).not.toHaveBeenCalled();
    });

    it('provides a new button with custom disabled value', () => {
      new DialogModule.createButton.constructor({
        identifier: 'some-button-identifier',
        text: 'some-button-text',
        disabled: true
      }, callback);
      expect(providerSpy.createButton).toHaveBeenCalledWith(
        jasmine.objectContaining({disabled: true})
      );
    });

  });

  describe('.getButton()', () => {

    it('does not provide a button for other addons', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true}, callback);
      expect(function(){
        new DialogModule.getButton.constructor('submit', otherAddonCallback)
      }).toThrow(new Error('Failed to find an active dialog.'));
    });

    it('provides setButtonDisabled for the submit button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true}, callback);
      new DialogModule.getButton.constructor('submit', callback).disable();
      expect(providerSpy.setButtonDisabled).toHaveBeenCalledWith('submit', true);
      new DialogModule.getButton.constructor('submit', callback).enable();
      expect(providerSpy.setButtonDisabled).toHaveBeenCalledWith('submit', false);
    });

    it('provides toggleButton for the submit button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true}, callback);
      new DialogModule.getButton.constructor('submit', callback).toggle();
      expect(providerSpy.toggleButton).toHaveBeenCalledWith('submit');
    });

    it('provides isButtonDisabled for the submit button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true}, callback);
      new DialogModule.getButton.constructor('submit', callback).isEnabled(val => {});
      expect(providerSpy.isButtonDisabled).toHaveBeenCalledWith('submit');
    });

    it('provides setButtonDisabled for the cancel button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true}, callback);
      new DialogModule.getButton.constructor('cancel', callback).disable();
      expect(providerSpy.setButtonDisabled).toHaveBeenCalledWith('cancel', true);
      new DialogModule.getButton.constructor('cancel', callback).enable();
      expect(providerSpy.setButtonDisabled).toHaveBeenCalledWith('cancel', false);
    });

    it('provides toggleButton for the cancel button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true}, callback);
      new DialogModule.getButton.constructor('cancel', callback).toggle();
      expect(providerSpy.toggleButton).toHaveBeenCalledWith('cancel');
    });

    it('provides isButtonDisabled for the cancel button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true}, callback);
      new DialogModule.getButton.constructor('cancel', callback).isEnabled(val => {});
      expect(providerSpy.isButtonDisabled).toHaveBeenCalledWith('cancel');
    });

    it('provides setButtonDisabled for a user button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true, buttons: [{identifier: 'user', text: 'user'}]}, callback);
      new DialogModule.getButton.constructor('user', callback).disable();
      expect(providerSpy.setButtonDisabled).toHaveBeenCalledWith('user', true);
      new DialogModule.getButton.constructor('user', callback).enable();
      expect(providerSpy.setButtonDisabled).toHaveBeenCalledWith('user', false);
    });

    it('provides toggleButton for a user button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true, buttons: [{identifier: 'user', text: 'user'}]}, callback);
      new DialogModule.getButton.constructor('user', callback).toggle();
      expect(providerSpy.toggleButton).toHaveBeenCalledWith('user');
    });

    it('provides isButtonDisabled for a user button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true, buttons: [{identifier: 'user', text: 'user'}]}, callback);
      new DialogModule.getButton.constructor('user', callback).isEnabled(val => {});
      expect(providerSpy.isButtonDisabled).toHaveBeenCalledWith('user');
    });

    it('provides setButtonHidden for the submit button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true}, callback);
      new DialogModule.getButton.constructor('submit', callback).hide();
      expect(providerSpy.setButtonHidden).toHaveBeenCalledWith('submit', true);
      new DialogModule.getButton.constructor('submit', callback).enable();
      expect(providerSpy.setButtonDisabled).toHaveBeenCalledWith('submit', false);
    });

    it('provides isButtonHidden for the submit button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true}, callback);
      new DialogModule.getButton.constructor('submit', callback).isHidden(val => {});
      expect(providerSpy.isButtonHidden).toHaveBeenCalledWith('submit');
    });

    it('provides setButtonHidden for the cancel button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true}, callback);
      new DialogModule.getButton.constructor('cancel', callback).hide();
      expect(providerSpy.setButtonHidden).toHaveBeenCalledWith('cancel', true);
      new DialogModule.getButton.constructor('cancel', callback).enable();
      expect(providerSpy.setButtonDisabled).toHaveBeenCalledWith('cancel', false);
    });

    it('provides isButtonHidden for the cancel button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true}, callback);
      new DialogModule.getButton.constructor('cancel', callback).isHidden(val => {});
      expect(providerSpy.isButtonHidden).toHaveBeenCalledWith('cancel');
    });

    it('provides setButtonHidden for a user button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true, buttons: [{identifier: 'user', text: 'user'}]}, callback);
      new DialogModule.getButton.constructor('user', callback).hide();
      expect(providerSpy.setButtonHidden).toHaveBeenCalledWith('user', true);
      new DialogModule.getButton.constructor('user', callback).enable();
      expect(providerSpy.setButtonDisabled).toHaveBeenCalledWith('user', false);
    });

    it('provides isButtonHidden for the user button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true, buttons: [{identifier: 'user', text: 'user'}]}, callback);
      new DialogModule.getButton.constructor('user', callback).isHidden(val => {});
      expect(providerSpy.isButtonHidden).toHaveBeenCalledWith('user');
    });

  });

});