import simpleDialog from 'src/host/dialog/api'

QUnit.module("Main Dialog", {
    setup: function(){
    },
    teardown: function(){
        AJS.$(".ap-aui-dialog2").remove();
        AJS.$(".aui-blanket").remove();
    }
});

QUnit.test("dialog options.id sets the dialog id", function(assert) {
    var dialogId = "abc123";
    var dialog = simpleDialog.create({
        id: dialogId
    });
    assert.equal(dialog.$el.attr('id'), dialogId);
});

QUnit.test("dialog options.width sets the dialog width", function(assert){
    var dialogId = "foobar";
    var dialog = simpleDialog.create({
        id: dialogId,
        width: 345,
        chrome: false
    });

    assert.equal(dialog.$el.find('.ap-content').width(), 345);
});

QUnit.test("dialog options.height sets the dialog height", function(assert){
    var dialogId = "batman";
    var dialog = simpleDialog.create({
        id: dialogId,
        height: 315,
        chrome: false
    });

    assert.equal(dialog.$el.height(), 315);
});

QUnit.test("dialog options.size sets the size of the dialog", function(assert){
    var dialog = simpleDialog.create({
        id: "my-dialog",
        size: 'large',
        chrome: false
    });

    assert.ok(dialog.$el.hasClass("aui-dialog2-large"), "Size argument was passed to dialog");
});

QUnit.test("dialog options.header sets the dialog title", function(assert){
    var text = "my title text";
    var dialog = simpleDialog.create({
        id: "my-dialog",
        header: text,
        chrome: true
    });

    assert.equal(dialog.$el.find('.aui-dialog2-header-main').text(), text);
});


QUnit.test("Dialog create takes a titleId argument", function(assert) {
    var dialog = simpleDialog.create({
        id: "my-dialog",
        titleId: "my-dialog",
        chrome: true
    });
    // aui appends "dialog-title" to the end of your dialog titles.
    assert.equal(dialog.$el.attr("aria-labelledby"), "my-dialog-dialog-title", "TitleId attribute was passed to dialog");
});

QUnit.test("Dialog close", function(assert){
    var dialog = simpleDialog.create({
        id: "my-dialog",
        chrome: true
    });
    assert.equal(dialog.$el.attr('aria-hidden'), 'false');
    simpleDialog.close();
    assert.equal(AJS.$("#my-dialog").length, 0);
});

QUnit.test("Focuses on iframe creation", function(assert) {
    var dialog = simpleDialog.create({
        id: "my-dialog",
        chrome: true
    });
    var dialogElement = dialog.$el;

    var iframe = document.createElement('iframe');
    iframe.focus = sinon.spy();
    dialogElement.append(iframe);
    AJS.$(iframe).trigger('ra.iframe.create');
    assert.ok(iframe.focus.calledOnce, 'iframe was focused');
});


QUnit.test("chromeless opens a chromeless dialog", function(assert){
    var dialog = simpleDialog.create({
        id: "my-dialog",
        chrome: false
    });

    assert.equal(dialog.$el.find(".aui-dialog2-header:visible").length, 0);
});

QUnit.test("by default, dialogs are chromeless", function(assert){
    var dialog = simpleDialog.create({
        id: "my-dialog"
    });

    assert.equal(dialog.$el.find(".aui-dialog2-header:visible").length, 0);
});

QUnit.test("options.chrome opens a dialog with chrome", function(assert){
    var dialog = simpleDialog.create({
        id: "my-dialog",
        chrome: true
    });

    assert.equal(dialog.$el.find(".aui-dialog2-header").length, 1);
});

QUnit.test("dialogs with chrome contain a submit button", function(assert){
    var dialog = simpleDialog.create({
        id: "my-dialog",
        chrome: true
    });

    assert.equal(dialog.$el.find(".ap-dialog-submit").length, 1);
});

QUnit.test("dialogs with chrome contain a cancel button", function(assert){
    var dialog = simpleDialog.create({
        id: "my-dialog",
        chrome: true
    });

    assert.equal(dialog.$el.find(".ap-dialog-cancel").length, 1);
});

QUnit.test("dialog with a submit button can set the text", function(assert){
    var dialog = simpleDialog.create({
        id: "my-dialog",
        chrome: true,
        submitText: "some submit text"
    });
    assert.equal(dialog.$el.find(".ap-dialog-submit").text(), "some submit text");
});

QUnit.test("dialog with a cancel button can set the text", function(assert){
    var dialog = simpleDialog.create({
        id: "my-dialog",
        chrome: true,
        cancelText: "some cancel text"
    });
    assert.equal(dialog.$el.find(".ap-dialog-cancel").text(), "some cancel text");
});

QUnit.test("dialog buttons are refreshed between dialogs", function(assert) {
    var dialog1 = simpleDialog.create({
        id: "my-dialog",
        chrome: true,
        submitText: "Submit 1"
    });
    dialog1.$el.find(".ap-dialog-submit").data('some','something');
    assert.equal(dialog1.$el.find(".ap-dialog-submit").data('some'), 'something');
    simpleDialog.close();

    var dialog2 = simpleDialog.create({
        id: "my-dialog",
        chrome: true,
        submitText: "Submit 2"
    });
    assert.notEqual(dialog2.$el.find(".ap-dialog-submit").data('some'), 'something');
});