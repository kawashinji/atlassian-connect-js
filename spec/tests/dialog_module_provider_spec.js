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

const providerSpy = jasmine.createSpyObj('moduleProvider', [
  'create',
  'close',
  'createButton',
  'setButtonDisabled',
  'isButtonDisabled',
  'toggleButton',
  'setButtonHidden',
  'isButtonHidden'
]);

class DialogModuleSpy {
  constructor() {
    this.providerSpy = providerSpy;
  }
  getModuleRegistrationName() {
    return 'dialog';
  }
  getProvider() {
    return this.providerSpy
  };
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
    closeOnEscape: true,
    buttons: [{identifier: 'someButtonIdentifier', text: 'someButtonText'}]
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
          header: undefined,
          buttons: [
            jasmine.objectContaining({
              id: 'submit',
              key: 'submit',
              name: 'submit',
              text: 'Submit',
              disabled: false,
              hidden: false
            }),
            jasmine.objectContaining({
              id: 'cancel',
              key: 'cancel',
              name: 'cancel',
              text: 'Cancel',
              disabled: false,
              hidden: false
            })
          ],
          customData: undefined,
          closeOnEscape: false
        }
      },
      {
        it: 'provides custom height and widths over default',
        javaScriptAPIOptions: extend({}, minOptions, {
          height: 'some-height',
          width: 'some-width'
        }),
        dialogProviderOptions: {
          height: 'some-height',
          width: 'some-width'
        }
      },
      {
        it: 'provides size over custom height and widths',
        javaScriptAPIOptions: maxOptions,
        dialogProviderOptions: {
          height: 'xlarge',
          width: 'xlarge'
        }
      },
      {
        it: 'provides empty header and footer when chrome is undefined',
        javaScriptAPIOptions: extend({}, maxOptions, {
          chrome: undefined
        }),
        dialogProviderOptions: {
          header: null,
          buttons: []
        }
      },
      {
        it: 'provides empty header and footer when chrome is false',
        javaScriptAPIOptions: extend({}, maxOptions, {
          chrome: false
        }),
        dialogProviderOptions: {
          header: null,
          buttons: []
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
          buttons: [
            jasmine.anything(),
            jasmine.objectContaining({
              id: 'submit',
              key: 'submit',
              name: 'submit',
              text: 'some-submit-text'
            }),
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
          buttons: [
            jasmine.objectContaining({
              identifier: 'button1-id',
              text: 'button1-text',
              disabled: false,
              hidden: false
            }),
            jasmine.objectContaining({
              identifier: 'button2-id',
              text: 'button2-text',
              disabled: false,
              hidden: false
            }),
            jasmine.objectContaining({
              identifier: 'button3-id',
              text: 'button3-text',
              disabled: false,
              hidden: false
            }),
            jasmine.anything(),
            jasmine.anything()
          ]
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

  describe('.close()', () => {

    it('provides close function', () => {
      DialogModule.close(callback);
      expect(providerSpy.close).toHaveBeenCalled();
    });

    it('provides dialog.close event and data', () => {
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
      });
      expect(providerSpy.createButton).toHaveBeenCalledWith(
        jasmine.objectContaining(
          {
            id: 'some-button-identifier',
            key: 'some-button-identifier',
            text: 'some-button-text',
            hidden: false,
            disabled: false
          }
        )
      );
    });

    it('provides a new button with custom disabled value', () => {
      new DialogModule.createButton.constructor({
        identifier: 'some-button-identifier',
        text: 'some-button-text',
        disabled: true
      });
      expect(providerSpy.createButton).toHaveBeenCalledWith(
        jasmine.objectContaining({disabled: true})
      );
    });

  });

  describe('.getButton()', () => {

    it('provides setButtonDisabled for the submit button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true}, callback);
      new DialogModule.getButton.constructor('submit').disable();
      expect(providerSpy.setButtonDisabled).toHaveBeenCalledWith('submit', true);
      new DialogModule.getButton.constructor('submit').enable();
      expect(providerSpy.setButtonDisabled).toHaveBeenCalledWith('submit', false);
    });

    it('provides toggleButton for the submit button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true}, callback);
      new DialogModule.getButton.constructor('submit').toggle();
      expect(providerSpy.toggleButton).toHaveBeenCalledWith('submit');
    });

    it('provides isButtonDisabled for the submit button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true}, callback);
      new DialogModule.getButton.constructor('submit').isEnabled(val => {});
      expect(providerSpy.isButtonDisabled).toHaveBeenCalledWith('submit');
    });

    it('provides setButtonDisabled for the cancel button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true}, callback);
      new DialogModule.getButton.constructor('cancel').disable();
      expect(providerSpy.setButtonDisabled).toHaveBeenCalledWith('cancel', true);
      new DialogModule.getButton.constructor('cancel').enable();
      expect(providerSpy.setButtonDisabled).toHaveBeenCalledWith('cancel', false);
    });

    it('provides toggleButton for the cancel button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true}, callback);
      new DialogModule.getButton.constructor('cancel').toggle();
      expect(providerSpy.toggleButton).toHaveBeenCalledWith('cancel');
    });

    it('provides isButtonDisabled for the cancel button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true}, callback);
      new DialogModule.getButton.constructor('cancel').isEnabled(val => {});
      expect(providerSpy.isButtonDisabled).toHaveBeenCalledWith('cancel');
    });

    it('provides setButtonDisabled for a user button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true, buttons: [{identifier: 'user', text: 'user'}]}, callback);
      new DialogModule.getButton.constructor('user').disable();
      expect(providerSpy.setButtonDisabled).toHaveBeenCalledWith('user', true);
      new DialogModule.getButton.constructor('user').enable();
      expect(providerSpy.setButtonDisabled).toHaveBeenCalledWith('user', false);
    });

    it('provides toggleButton for a user button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true, buttons: [{identifier: 'user', text: 'user'}]}, callback);
      new DialogModule.getButton.constructor('user').toggle();
      expect(providerSpy.toggleButton).toHaveBeenCalledWith('user');
    });

    it('provides isButtonDisabled for a user button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true, buttons: [{identifier: 'user', text: 'user'}]}, callback);
      new DialogModule.getButton.constructor('user').isEnabled(val => {});
      expect(providerSpy.isButtonDisabled).toHaveBeenCalledWith('user');
    });

    it('provides setButtonHidden for the submit button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true}, callback);
      new DialogModule.getButton.constructor('submit').hide();
      expect(providerSpy.setButtonHidden).toHaveBeenCalledWith('submit', true);
      new DialogModule.getButton.constructor('submit').enable();
      expect(providerSpy.setButtonDisabled).toHaveBeenCalledWith('submit', false);
    });

    it('provides isButtonHidden for the submit button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true}, callback);
      new DialogModule.getButton.constructor('submit').isHidden(val => {});
      expect(providerSpy.isButtonHidden).toHaveBeenCalledWith('submit');
    });

    it('provides setButtonHidden for the cancel button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true}, callback);
      new DialogModule.getButton.constructor('cancel').hide();
      expect(providerSpy.setButtonHidden).toHaveBeenCalledWith('cancel', true);
      new DialogModule.getButton.constructor('cancel').enable();
      expect(providerSpy.setButtonDisabled).toHaveBeenCalledWith('cancel', false);
    });

    it('provides isButtonHidden for the cancel button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true}, callback);
      new DialogModule.getButton.constructor('cancel').isHidden(val => {});
      expect(providerSpy.isButtonHidden).toHaveBeenCalledWith('cancel');
    });

    it('provides setButtonHidden for a user button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true, buttons: [{identifier: 'user', text: 'user'}]}, callback);
      new DialogModule.getButton.constructor('user').hide();
      expect(providerSpy.setButtonHidden).toHaveBeenCalledWith('user', true);
      new DialogModule.getButton.constructor('user').enable();
      expect(providerSpy.setButtonDisabled).toHaveBeenCalledWith('user', false);
    });

    it('provides isButtonHidden for the user button', () => {
      new DialogModule.create.constructor({key: 'some-module-key', chrome:true, buttons: [{identifier: 'user', text: 'user'}]}, callback);
      new DialogModule.getButton.constructor('user').isHidden(val => {});
      expect(providerSpy.isButtonHidden).toHaveBeenCalledWith('user');
    });

  });

});