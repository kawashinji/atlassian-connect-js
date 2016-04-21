import DialogModule from 'src/host/modules/dialog';
import DialogComponent from 'src/host/components/dialog';
import EventActions from 'src/host/actions/event_actions';
import baseDialogComponentTests from 'fixtures/base_dialog_component_tests';

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


  it('button click dispatches an event', () => {
    var extension = {
      addon_key: 'my-addon-key'
    };
    var $dialog = DialogComponent.render({
      extension: extension
    });
    spyOn(EventActions, 'broadcast');
    $dialog.find('button').first().click();
    expect(EventActions.broadcast.calls.count()).toEqual(1);
    expect(EventActions.broadcast.calls.first().args[1]).toEqual(extension);
  });
});