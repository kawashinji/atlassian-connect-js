import DialogModule from 'src/host/modules/dialog';
import DialogComponent from 'src/host/components/dialog';
import DialogExtensionComponent from 'src/host/components/dialog_extension';
import EventActions from 'src/host/actions/event_actions';
import baseDialogComponentTests from 'fixtures/base_dialog_component_tests';
import IframeActions from 'src/host/actions/iframe_actions';
import EventDispatcher from 'src/host/dispatchers/event_dispatcher';

describe('Dialog module', () => {

  afterEach(() => {
    $('.aui-dialog2').remove();
    $('.aui-blanket').remove();
  });

  it('defaults to chromeless', () => {
    var options = {
      key: 'anykey'
    };
    var callback = function(){};
    callback._id = 'cbc123';
    callback._context = {
      extension: {
        addon_key: 'some.addon_key',
        key: 'some.different_module',
        options: {}
      }
    };
    new DialogModule.create.constructor(options, callback);
    expect($('.aui-dialog2').hasClass('aui-dialog2-chromeless')).toEqual(true);
  });

  it('defaults to chrome in a dialogModule', () => {
    window._AP = {
      dialogModules: {
        someaddon_key: {
          dialogmodulekey: {
            options: {}
          }
        }
      }
    }
    var options = {
      key: 'dialogmodulekey'
    };
    var callback = function(){};
    callback._id = 'abdc123';
    callback._context = {
      extension: {
        addon_key: 'someaddon_key',
        key: 'some.different_module',
        options: {}
      }
    };
    new DialogModule.create.constructor(options, callback);
    expect($('.aui-dialog2').hasClass('aui-dialog2-chromeless')).toEqual(false);
    expect($('.aui-dialog2').hasClass('aui-dialog2')).toEqual(true);
  });

  it('renders a chromed dialog', () => {
    var options = baseDialogComponentTests.getChromeOptions();
    options.key = 'some.module_key';
    var callback = function(){};
    callback._id = 'abc123';
    callback._context = {
      extension: {
        addon_key: 'some.addon_key',
        key: 'some.different_module',
        options: {}
      }
    };
    new DialogModule.create.constructor(options, callback);
    baseDialogComponentTests.testChrome(options);
  });

  it('renders a chromed dialog with productContext', (done) => {
    var options = baseDialogComponentTests.getChromeOptions();
    options.key = 'some.module_key';
    var callback = function(){};
    callback._id = 'abc123';
    callback._context = {
      extension: {
        addon_key: 'some.addon_key',
        key: 'some.different_module',
        options: {
          productContext: {
            'some': 'context'
          }
        }
      }
    };

    EventDispatcher.registerOnce('dialog-extension-open', function(data){
      expect(data.extension.options.productContext).toEqual(callback._context.extension.options.productContext);
      done();
    });
    new DialogModule.create.constructor(options, callback);
  });


  it('renders a chromed dialog with dimensions', () => {
    var options = baseDialogComponentTests.getChromeOptions();
    delete options.size;
    options.width = '123px';
    options.height = '100px';
    options.key = 'some.module_key';
    var callback = function(){};
    callback._id = 'abc123';
    callback._context = {
      extension: {
        addon_key: 'some.addon_key',
        key: 'some.different_module',
        options: {}
      }
    };
    new DialogModule.create.constructor(options, callback);
    baseDialogComponentTests.testChrome(options);
  });

  it('renders a chromeless dialog', () => {
    var options = baseDialogComponentTests.getChromelessOptions();
    options.key = 'some.module_key';
    var callback = function(){};
    callback._id = 'abc123';
    callback._context = {
      extension: {
        addon_key: 'some.addon_key',
        key: 'some.different_module',
        options: {}
      }
    };
    new DialogModule.create.constructor(options, callback);
    baseDialogComponentTests.testChromeless(options);
  });

  it('renders a chromeless dialog with dimensions', () => {
    var options = baseDialogComponentTests.getChromelessOptions();
    delete options.size;
    options.width = '123px';
    options.height = '100px';
    options.key = 'some.module_key';
    var callback = function(){};
    callback._id = 'abc123';
    callback._context = {
      extension: {
        addon_key: 'some.addon_key',
        key: 'some.different_module',
        options: {}
      }
    };
    new DialogModule.create.constructor(options, callback);
    baseDialogComponentTests.testChromeless(options);
  });

  it('closes on AP.dialog.close()', () => {
    var extension = {
      addon_key: 'some-key',
      key: 'module-key',
      url: 'http://www.example.com',
      options: {
        isDialog: true
      }
    };
    var options = baseDialogComponentTests.getChromeOptions();
    var $dialogExtension = DialogExtensionComponent.render(extension, options);
    $dialogExtension.find('iframe')[0].bridgeEstablished = true;
    var callback = function(){};
    callback._context = {
      extension: extension
    };
    expect($('.aui-dialog2').length).toEqual(1);
    DialogModule.close(callback);
    expect($('.aui-dialog2').length).toEqual(0);
  });

  it('button click dispatches an event', (done) => {
    var extension = {
      addon_key: 'some-key',
      key: 'module-key',
      url: 'http://www.example.com'
    };

    var options = baseDialogComponentTests.getChromeOptions();
    var $dialogExtension = DialogExtensionComponent.render(extension, options);
    $dialogExtension.find('iframe')[0].bridgeEstablished = true;
    spyOn(EventActions, 'broadcast');
    $dialogExtension.find('iframe').load(function(){
      let cancelButton = $dialogExtension.find('button')[1];
      cancelButton.click();
      expect(EventActions.broadcast.calls.count()).toEqual(2);
      expect(EventActions.broadcast.calls.first().args).toEqual([
        'dialog.cancel',
        jasmine.objectContaining({
          addon_key: extension.addon_key,
          key: extension.key
        }),
        {
          button: {
            name: 'cancel',
            identifier: 'cancel',
            text: 'some cancel text'
          }
        }
      ]);
      expect(EventActions.broadcast.calls.all()[1].args).toEqual([
        'dialog.button.click',
        jasmine.objectContaining({
          addon_key: extension.addon_key,
          key: extension.key
        }),
        {
          button: {
            name: 'cancel',
            identifier: 'cancel',
            text: 'some cancel text'
          }
        }
      ]);

      done();
    });
  });

  it('closeOnEscape false button click dispatches an event', (done) => {
    var extension = {
      addon_key: 'some-key',
      key: 'module-key',
      url: 'http://www.example.com',
      options: {
        preventDialogCloseOnEscape: true
      }
    };

    var options = baseDialogComponentTests.getChromeOptions();
    options.closeOnEscape = false;
    var $dialogExtension = DialogExtensionComponent.render(extension, options);
    expect($dialogExtension.find('button.aui-button-primary')[0].getAttribute('aria-disabled')).toEqual('true');
    EventDispatcher.registerOnce('after:iframe-bridge-established', (data) => {
      expect($dialogExtension.find('button.aui-button-primary')[0].getAttribute('aria-disabled')).toEqual('false');
      done();
    });
    EventDispatcher.dispatch('iframe-bridge-established', {
      extension: extension,
      $el: $dialogExtension.find('iframe')
    });
  });

  it('creates a custom button', () => {
    var extension = {
      addon_key: 'some-key',
      key: 'module-key',
      url: 'http://www.example.com',
      options: {
        isDialog: true
      }
    };
    var options = baseDialogComponentTests.getChromeOptions();
    var $dialogExtension = DialogExtensionComponent.render(extension, options);
    $dialogExtension.find('iframe')[0].bridgeEstablished = true;
    var callback = function(){};
    callback._context = {
      extension: extension
    };
    expect($('.aui-dialog2').length).toEqual(1);
    new DialogModule.createButton.constructor({text: 'abc123'}, callback);
    expect($('.aui-dialog2 button').filter((i, button) => {
      return button.innerHTML === 'abc123';
    }).length).toEqual(1);
  });

  it('button click is ignored if iframe has not loaded', () => {
    var extension = {
      addon_key: 'some-key',
      key: 'module-key',
      url: 'http://www.example.com'
    };

    var options = baseDialogComponentTests.getChromeOptions();
    var $dialogExtension = DialogExtensionComponent.render(extension, options);
    spyOn(EventActions, 'broadcast');
    $dialogExtension.find('button').first().click();
    expect(EventActions.broadcast.calls.count()).toEqual(0);
  });

  describe('button modifier', () => {
    it('hide dispatches an event', (done) => {
      var extension = {
        addon_key: 'some-key',
        key: 'module-key',
        url: 'http://www.example.com'
      };
      var options = baseDialogComponentTests.getChromeOptions();
      DialogExtensionComponent.render(extension, options);

      EventDispatcher.registerOnce('button-toggle-visibility', (data) => {
        expect(data.hidden).toEqual(true);
        expect(data.$el).not.toBeUndefined();
        done();
      });

      var button = new DialogModule.getButton.constructor('submit');
      button.hide();
    });

    it('show dispatches an event', (done) => {
      var extension = {
        addon_key: 'some-key',
        key: 'module-key',
        url: 'http://www.example.com'
      };

      var options = baseDialogComponentTests.getChromeOptions();
      DialogExtensionComponent.render(extension, options);
      EventDispatcher.registerOnce('button-toggle-visibility', (data) => {
        expect(data.hidden).toEqual(false);
        expect(data.$el).not.toBeUndefined();
        done();
      });
      var button = new DialogModule.getButton.constructor('submit');
      button.show();
    });

    it('enable dispatches an event', (done) => {
      var extension = {
        addon_key: 'some-key',
        key: 'module-key',
        url: 'http://www.example.com'
      };

      var options = baseDialogComponentTests.getChromeOptions();
      DialogExtensionComponent.render(extension, options);
      EventDispatcher.registerOnce('button-toggle', (data) => {
        expect(data.disabled).toEqual(false);
        expect(data.$el).not.toBeUndefined();
        done();
      });
      var button = new DialogModule.getButton.constructor('submit');
      button.enable();
    });

    it('disable dispatches an event', (done) => {
      var extension = {
        addon_key: 'some-key',
        key: 'module-key',
        url: 'http://www.example.com'
      };

      var options = baseDialogComponentTests.getChromeOptions();
      DialogExtensionComponent.render(extension, options);
      EventDispatcher.registerOnce('button-toggle', (data) => {
        expect(data.disabled).toEqual(true);
        expect(data.$el).not.toBeUndefined();
        done();
      });
      var button = new DialogModule.getButton.constructor('submit');
      button.disable();
    });
  });

  describe('dialog custom data', () => {
    it('is set in dialog module', () => {
      var options = baseDialogComponentTests.getChromelessOptions();
      options.key = 'some.module_key';
      options.customData = {
        someKey: 'some.value'
      };
      var callback = function(){};
      callback._id = 'abc123';
      callback._context = {
        extension: {
          addon_key: 'some.addon_key',
          key: 'some.different_module',
          options: {}
        }
      };
      var dialog = new DialogModule.create.constructor(options, callback);
      expect(dialog.customData).toEqual(options.customData);
    });

    it('callback runs even when no dialog is set', (done) => {
      var cb = function(data){
        expect(data).toEqual(undefined);
        done();
      };
      cb._context = {
        extension: {
          addon_key: 'some.addon_key',
          key: 'some.module_key',
          options: { }
        }
      };
      DialogModule.getCustomData(cb);
    });
  });
});