import simpleDialog from 'src/host/dialog/api'

QUnit.module("Main Dialog", {
    setup: function(){
        this.dialogSpy = {
            show: sinon.spy(),
            on: sinon.spy(),
            remove: sinon.spy(),
            hide: sinon.spy()
        };
        this.layerSpy = {
            changeSize: sinon.spy()
        };

        this.store = {
            layer: window.AJS.layer,
            dialog2: window.AJS.dialog2
        };

        AJS.dialog2 = sinon.stub().returns(this.dialogSpy);
        AJS.layer = sinon.stub().returns(this.layerSpy);

    },
    teardown: function(){
        // clean up mock
        window.AJS.dialog2 = this.store.dialog2;
        window.AJS.layer = this.store.layer;
    }
});

QUnit.test("dialog options.id sets the dialog id", function(assert) {
    var dialogId = "abc123";
    var dialog = simpleDialog.create({
        id: dialogId
    });

    assert.equal(AJS.dialog2.args[0][0].attr('id'), dialogId);
});

QUnit.test("dialog options.width sets the dialog width", function(assert){
    var dialogId = "foobar";
    simpleDialog.create({
        id: dialogId,
        width: 345,
        chrome: false
    });

    assert.equal(this.layerSpy.changeSize.args[0][0], 345);
});

QUnit.test("dialog options.height sets the dialog height", function(assert){
    var dialogId = "batman";
    simpleDialog.create({
        id: dialogId,
        height: 315,
        chrome: false
    });

    assert.equal(this.layerSpy.changeSize.args[0][1], 315);
});

QUnit.test("dialog options.size sets the size of the dialog", function(assert){
    simpleDialog.create({
        id: "my-dialog",
        size: 'large',
        chrome: false
    });

    assert.ok(AJS.dialog2.args[0][0].is(".aui-dialog2-large"), "Size argument was passed to dialog");
});

QUnit.test("dialog options.header sets the dialog title", function(assert){
    var text = "my title text";
    simpleDialog.create({
        id: "my-dialog",
        header: text,
        chrome: true
    });

    assert.equal(AJS.dialog2.args[0][0].find('.aui-dialog2-header-main').text(), text);
});


QUnit.test("Dialog create takes a titleId argument", function(assert) {
    simpleDialog.create({
        id: "my-dialog",
        titleId: "my-dialog",
        chrome: true
    });
    // aui appends "dialog-title" to the end of your dialog titles.
    assert.equal(AJS.dialog2.args[0][0].attr("aria-labelledby"), "my-dialog-dialog-title", "TitleId attribute was passed to dialog");
});

QUnit.test("Dialog close", function(assert){
    simpleDialog.create({
        id: "my-dialog",
        chrome: true
    });
    simpleDialog.close();

    assert.ok(this.dialogSpy.hide.calledOnce, "Dialog close was called");
});

QUnit.test("Focuses on iframe creation", function(assert) {
    simpleDialog.create({
        id: "my-dialog",
        chrome: true
    });
    var dialogElement = AJS.dialog2.args[0][0];

    var iframe = document.createElement('iframe');
    iframe.focus = sinon.spy();
    dialogElement.append(iframe);
    $(iframe).trigger('ra.iframe.create');
    assert.ok(iframe.focus.calledOnce, 'iframe was focused');
});


QUnit.test("chromeless opens a chromeless dialog", function(assert){
    simpleDialog.create({
        id: "my-dialog",
        chrome: false
    });

    assert.equal(AJS.dialog2.args[0][0].find(".aui-dialog2-header:visible").length, 0);
});

QUnit.test("by default, dialogs are chromeless", function(assert){
    simpleDialog.create({
        id: "my-dialog"
    });

    assert.equal(AJS.dialog2.args[0][0].find(".aui-dialog2-header:visible").length, 0);
});

QUnit.test("options.chrome opens a dialog with chrome", function(assert){
    simpleDialog.create({
        id: "my-dialog",
        chrome: true
    });

    assert.equal(AJS.dialog2.args[0][0].find(".aui-dialog2-header").length, 1);
});

QUnit.test("dialogs with chrome contain a submit button", function(assert){
    simpleDialog.create({
        id: "my-dialog",
        chrome: true
    });

    assert.equal(AJS.dialog2.args[0][0].find(".ap-dialog-submit").length, 1);
});

QUnit.test("dialogs with chrome contain a cancel button", function(assert){
    simpleDialog.create({
        id: "my-dialog",
        chrome: true
    });

    assert.equal(AJS.dialog2.args[0][0].find(".ap-dialog-cancel").length, 1);
});

QUnit.test("dialog with a submit button can set the text", function(assert){
    simpleDialog.create({
        id: "my-dialog",
        chrome: true,
        submitText: "some submit text"
    });
    assert.equal(AJS.dialog2.args[0][0].find(".ap-dialog-submit").text(), "some submit text");
});

QUnit.test("dialog with a cancel button can set the text", function(assert){
    simpleDialog.create({
        id: "my-dialog",
        chrome: true,
        cancelText: "some cancel text"
    });
    assert.equal(AJS.dialog2.args[0][0].find(".ap-dialog-cancel").text(), "some cancel text");
});
