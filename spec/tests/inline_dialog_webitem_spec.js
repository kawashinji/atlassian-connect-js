import InlineDialogWebitem from 'src/host/components/inline_dialog_webitem';
import WebItemActions from 'src/host/actions/webitem_actions';
import EventDispatcher from 'src/host/dispatchers/event_dispatcher';

describe('Inline Dialog Webitem', () => {
  var webitemButton;

  beforeEach(() => {
    $('.aui-inline-dialog').remove();
    webitemButton = $('<a />').attr('href', 'https://www.example.com');
    webitemButton.text('i am a webitem');
    webitemButton.addClass('ap-inline-dialog ap-plugin-key-my-plugin ap-module-key-key');
    webitemButton.appendTo('body');
  });

  afterEach(() => {
    webitemButton.remove();
  });

  it("getWebItem returns a webitem compatible object", function(){
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
        expect($('.ap-container').length).toEqual(1);
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