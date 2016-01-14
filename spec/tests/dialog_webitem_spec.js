import DialogWebitem from 'src/host/components/dialog_webitem';
import WebItem from 'src/host/components/webitem';
import WebItemActions from 'src/host/actions/webitem_actions';

import EventDispatcher from 'src/host/dispatchers/event_dispatcher';


describe("Dialog Webitem", () => {
  var webitemButton;

  beforeEach(() => {
    $(".aui-dialog2").remove();
    webitemButton = $("<a />").attr('href', "https://www.example.com");
    webitemButton.text("i am a webitem");
    webitemButton.addClass("ap-dialog ap-plugin-key-my-plugin ap-module-key-key");
    webitemButton.appendTo('body');
  });
  
  afterEach(() => {
    webitemButton.remove();
  });

  describe("rendering", () => {

    beforeEach((done) => {
      $(function(){
        $(".ap-dialog").click();
        done();
      });
    });

    it("renders a dialog", () => {
      expect($(".aui-dialog2").length).toBe(1);
    });

    it("contains and iframe", () => {
      expect($(".aui-dialog2 iframe").length).toBe(1);
    });

  });

  describe("triggers", () => {
    it("is set to be triggered by click", () => {
      expect(DialogWebitem.getWebItem().triggers).toEqual(["click"]);
    });

    it("responds to a click event", (done) => {
      var spy = jasmine.createSpy('spy');
      spyOn(WebItemActions, 'webitemInvoked');
      $(function(){
        $(".ap-dialog").click();
        expect(WebItemActions.webitemInvoked.calls.count()).toEqual(1);
        done();
      });
    });

  });


});
