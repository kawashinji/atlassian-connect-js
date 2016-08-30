import DialogWebitem from 'src/host/components/dialog_webitem';
import WebItem from 'src/host/components/webitem';
import WebItemActions from 'src/host/actions/webitem_actions';
import DialogExtension from 'src/host/components/dialog_extension';
import EventDispatcher from 'src/host/dispatchers/event_dispatcher';
import baseDialogComponentTests from 'fixtures/base_dialog_component_tests';

describe('Dialog Webitem', () => {
  afterEach(() => {
    $('.aui-dialog2').remove();
    $('.aui-blanket').remove();
  });

  var webitemButton;

  beforeEach(() => {
    window._AP = {
      dialogOptions: {}
    };

    $('.aui-dialog2').remove();
    webitemButton = $('<a />').attr('href', 'https://www.example.com');
    webitemButton.text('i am a webitem');
    webitemButton.addClass('ap-dialog ap-plugin-key-my-plugin ap-module-key-key');
    webitemButton.appendTo('body');
  });

  afterEach(() => {
    window._AP = {};
    webitemButton.remove();
  });

  describe('rendering', () => {

    it('renders a dialog', (done) => {
      EventDispatcher.registerOnce('after:webitem-invoked:dialog', function(){
        expect($('.aui-dialog2').length).toBe(1);
        done();
      });
      $(function(){
        $('.ap-dialog').click();
      });
    });

    it('contains and iframe container', (done) => {
      EventDispatcher.registerOnce('after:webitem-invoked:dialog', function(){
        expect($('.aui-dialog2 .ap-iframe-container').length).toBe(1);
        done();
      });
      $(function(){
        $('.ap-dialog').click();
      });
    });

    it('chromed dialog', (done) => {
      var extension = {
        addon_key: 'my-plugin',
        key: 'key'
      };
      var options = baseDialogComponentTests.getChromeOptions();
      window._AP.dialogOptions[extension.addon_key + '__' + extension.key] = options;
      EventDispatcher.registerOnce('after:webitem-invoked:dialog', function(){
        baseDialogComponentTests.testChrome(options);
        done();
      });
      $(function(){
        $('.ap-dialog').click();
      });
    });

    it('renders a chromed dialog with dimensions', (done) => {
      var extension = {
        addon_key: 'my-plugin',
        key: 'key'
      };
      var options = baseDialogComponentTests.getChromeOptions();
      delete options.size;
      options.width = '123px';
      options.height = '100px';
      window._AP.dialogOptions[extension.addon_key + '__' + extension.key] = options;
      EventDispatcher.registerOnce('after:webitem-invoked:dialog', function(){
        baseDialogComponentTests.testChrome(options);
        done();
      });
      $(function(){
        $('.ap-dialog').click();
      });
    });

    it('renders a chromeless dialog', (done) => {
      var extension = {
        addon_key: 'my-plugin',
        key: 'key'
      };
      var options = baseDialogComponentTests.getChromelessOptions();
      window._AP.dialogOptions[extension.addon_key + '__' + extension.key] = options;
      EventDispatcher.registerOnce('after:webitem-invoked:dialog', function(){
        baseDialogComponentTests.testChromeless(options);
        done();
      });
      $(function(){
        $('.ap-dialog').click();
      });
    });

    it('renders a chromeless dialog with dimensions', (done) => {
      var extension = {
        addon_key: 'my-plugin',
        key: 'key'
      };
      var options = baseDialogComponentTests.getChromelessOptions();
      delete options.size;
      options.width = '123px';
      options.height = '100px';
      window._AP.dialogOptions[extension.addon_key + '__' + extension.key] = options;
      EventDispatcher.registerOnce('after:webitem-invoked:dialog', function(){
        baseDialogComponentTests.testChromeless(options);
        done();
      });
      $(function(){
        $('.ap-dialog').click();
      });
    });

    it('renders a dialog without changing original dialog options', (done) => {
      var extension = {
        addon_key: 'my-plugin',
        key: 'key'
      };
      var options = baseDialogComponentTests.getChromeOptions();
      delete options.size;
      options.width = '123px';
      options.height = '100px';
      window._AP.dialogOptions[extension.addon_key + '__' + extension.key] = options;
      EventDispatcher.registerOnce('after:webitem-invoked:dialog', function(){
        expect(window._AP.dialogOptions['my-plugin__key']).toEqual(options);
        done();
      });
      $(function(){
        $('.ap-dialog').click();
      });
    });

  });

  describe('triggers', () => {
    it('is set to be triggered by click', () => {
      expect(DialogWebitem.getWebItem().triggers).toEqual(['click']);
    });

    it('responds to a click event', (done) => {
      var spy = jasmine.createSpy('spy');
      spyOn(WebItemActions, 'webitemInvoked');
      $(function(){
        $('.ap-dialog').click();
        expect(WebItemActions.webitemInvoked.calls.count()).toEqual(1);
        done();
      });
    });

  });


});
