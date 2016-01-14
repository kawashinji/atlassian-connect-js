import InlineDialogWebitem from 'src/host/components/inline_dialog_webitem';
import WebItem from 'src/host/components/webitem';
import WebItemActions from 'src/host/actions/webitem_actions';

import EventDispatcher from 'src/host/dispatchers/event_dispatcher';


describe("Inline Dialog Webitem", () => {
  var webitemButton;

  beforeEach(() => {
    webitemButton = $("<span />").addClass("ap-inline-dialog").text("i am a webitem");
    webitemButton.appendTo('body');
  });
  
  afterEach(() => {
    webitemButton.remove();
    // WebItem._removeTriggers();
  });

  describe("triggers", () => {
    it("is set to be triggered by hover and click", () => {
      expect(InlineDialogWebitem.getWebItem().triggers).toEqual(["click", "hover"]);
    });

    it("responds to a click event", (done) => {
      var spy = jasmine.createSpy('spy');
      spyOn(WebItemActions, 'webitemInvoked');
      $(function(){
        $(".ap-inline-dialog").click();
        expect(WebItemActions.webitemInvoked.calls.count()).toEqual(1);
        done();
      });
    });

    it("responds to a hover event", (done) => {
      var spy = jasmine.createSpy('spy');
      spyOn(WebItemActions, 'webitemInvoked');
      $(function(){
        $(".ap-inline-dialog").trigger('hover');
        expect(WebItemActions.webitemInvoked.calls.count()).toEqual(1);
        done();
      });
    });

  });

  it("creates an inline dialog", (done) => {
    
  });

});
