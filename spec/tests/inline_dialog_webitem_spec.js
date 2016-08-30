import InlineDialogWebitem from 'src/host/components/inline_dialog_webitem';
import InlineDialogActions from 'src/host/actions/inline_dialog_actions';
import InlineDialogComponent from 'src/host/components/inline_dialog';
import WebItemActions from 'src/host/actions/webitem_actions';
import EventDispatcher from 'src/host/dispatchers/event_dispatcher';

describe('Inline Dialog Webitem', () => {
  var webitemButton;

  beforeEach(() => {
    $('.aui-inline-dialog').remove();
    webitemButton = $('<a />').attr('href', 'https://www.example.com');
    webitemButton.text('i am a webitem');
    webitemButton.addClass('ap-inline-dialog ap-plugin-key-my-plugin ap-module-key-key ap-target-key-key');
    webitemButton.appendTo('body');
  });

  afterEach(() => {
    webitemButton.remove();
    delete window._AP.inlineDialogModules;
  });

  it('getWebItem returns a webitem compatible object', function(){
    var inlineDialogWebitemSpec = InlineDialogWebitem.getWebItem();
    expect(inlineDialogWebitemSpec).toEqual({
      name: 'inline-dialog',
      selector: '.ap-inline-dialog',
      triggers: [ 'mouseover', 'click' ]
    });
  });

  describe('rendering', () => {

    it('renders an inline dialog', (done) => {
      EventDispatcher.registerOnce('after:webitem-invoked:inline-dialog', function(){
        expect($('.aui-inline-dialog').length).toBe(1);
        expect($('.ap-iframe-container').length).toEqual(1);
        done();
      });
      $(function(){
        $('.ap-inline-dialog').click();
      });
    });

    it('does not render multiple times for the same extension', (done) => {
      $(function(){
        $('.ap-inline-dialog').click();
        expect($('.aui-inline-dialog').length).toBe(1);
        expect($('.ap-iframe-container').length).toEqual(1);
        $('.ap-inline-dialog').click();
        expect($('.aui-inline-dialog').length).toBe(1);
        expect($('.ap-iframe-container').length).toEqual(1);
        done();
      });
    });


    it('passes inline dialog options to component', (done) => {
      var allPossibleOptions = {
        closeOthers: true,
        isRelativeToMouse: true,
        offsetX: '1px',
        offsetY: '1px',
        onHover: true,
        onTop: true,
        persistent: true,
        showDelay: true,
        width: '100px'
      };

      window._AP.inlineDialogModules = {};
      window._AP.inlineDialogModules['my-plugin'] = {
        key: {
          options: allPossibleOptions
        }
      };

      EventDispatcher.registerOnce('inline-dialog-opened', function(data){
        Object.getOwnPropertyNames(allPossibleOptions).forEach(function(name){
          expect(data.extension.options[name]).toEqual(allPossibleOptions[name]);
        });
        done();
      });
      $(function(){
        $('.ap-inline-dialog').click();
      });
    });

  });

  describe('triggers', () => {
    it('is set to be triggered by hover and click', () => {
      expect(InlineDialogWebitem.getWebItem().triggers).toEqual(['mouseover', 'click']);
    });

    it('responds to a click event', (done) => {
      var spy = jasmine.createSpy('spy');
      spyOn(WebItemActions, 'webitemInvoked');
      $(function(){
        $('.ap-inline-dialog').click();
        expect(WebItemActions.webitemInvoked.calls.count()).toEqual(1);
        done();
      });
    });

    it('responds to a mouseover event', (done) => {
      var spy = jasmine.createSpy('spy');
      spyOn(WebItemActions, 'webitemInvoked');
      $(function(){
        $('.ap-inline-dialog').trigger('mouseover');
        expect(WebItemActions.webitemInvoked.calls.count()).toEqual(1);
        done();
      });
    });

  });

});