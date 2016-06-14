import DialogModule from 'src/host/modules/dialog';
import DialogComponent from 'src/host/components/dialog';
import DialogExtensionComponent from 'src/host/components/dialog_extension';
import EventActions from 'src/host/actions/event_actions';
import baseDialogComponentTests from 'fixtures/base_dialog_component_tests';
import IframeActions from 'src/host/actions/iframe_actions';

describe('Dialog module', () => {

  afterEach(() => {
    $('.aui-dialog2').remove();
    $('.aui-blanket').remove();
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
      $dialogExtension.find('button').first().click();
      expect(EventActions.broadcast.calls.count()).toEqual(1);
      expect(EventActions.broadcast.calls.first().args[1]).toEqual({
        addon_key: extension.addon_key
      });
      done();
    });
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
});