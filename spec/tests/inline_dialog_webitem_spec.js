import InlineDialogWebitem from 'src/host/components/inline_dialog_webitem';
import WebItem from 'src/host/components/webitem';
import WebItemActions from 'src/host/actions/webitem_actions';

import EventDispatcher from 'src/host/dispatchers/event_dispatcher';


describe("Inline Dialog Webitem", () => {
  var webitemButton;

  beforeEach(() => {
    $("aui-inline-dialog").remove();
    webitemButton = $("<a />").attr('href', "https://www.example.com");
    webitemButton.text("i am a webitem");
    webitemButton.addClass("ap-inline-dialog ap-plugin-key-my-plugin ap-module-key-key");
    webitemButton.appendTo('body');
  });
  
  afterEach(() => {
    webitemButton.remove();
  });

  describe("rendering", () => {

    beforeEach((done) => {
      $(function(){
        $(".ap-inline-dialog").click();
        done();
      });
    });

    it("renders an inline dialog", () => {
      expect($("aui-inline-dialog").length).toBe(1);
      expect($(".ap-inline-dialog-container").length).toEqual(1);
    });

    it("contains and iframe", () => {
      expect($("aui-inline-dialog iframe").length).toBe(1);
    });

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


});
