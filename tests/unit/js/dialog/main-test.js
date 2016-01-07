require(['ac/dialog'], function(simpleDialog) {

    var localDialogSpy;

    module("Main Dialog", {
        setup: function(){
            localDialogSpy = this.dialogSpy = {
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

            // Until ac/dialog gets refactored, we need dialog.$el to be set.
            AJS.dialog2 = function($el) {
                localDialogSpy.$el = $el;
                return localDialogSpy;
            };
            AJS.layer = sinon.stub().returns(this.layerSpy);

        },
        teardown: function(){
            // clean up mock
            window.AJS.dialog2 = this.store.dialog2;
            window.AJS.layer = this.store.layer;
        }
    });
    
    function dialogElement() {
        return localDialogSpy.$el;
    }

    test("dialog options.id sets the dialog id", function() {
        var dialogId = "abc123";
        simpleDialog.create({
            id: dialogId
        });

        equal(dialogElement().attr('id'), dialogId);
    });

    test("dialog options.width sets the dialog width", function(){
        var dialogId = "foobar";
        simpleDialog.create({
            id: dialogId,
            width: 345,
            chrome: false
        });

        equal(this.layerSpy.changeSize.args[0][0], 345);
    });

    test("dialog options.height sets the dialog height", function(){
        var dialogId = "batman";
        simpleDialog.create({
            id: dialogId,
            height: 315,
            chrome: false
        });

        equal(this.layerSpy.changeSize.args[0][1], 315);
    });

    test("dialog options.size sets the size of the dialog", function(){
        simpleDialog.create({
            id: "my-dialog",
            size: 'large',
            chrome: false
        });

        ok(dialogElement().is(".aui-dialog2-large"), "Size argument was passed to dialog");
    });

    test("dialog options.header sets the dialog title", function(){
        var text = "my title text";
        simpleDialog.create({
            id: "my-dialog",
            header: text,
            chrome: true
        });

        equal(dialogElement().find('h1').text(), text);
    });


    test("Dialog create takes a titleId argument", function() {
        simpleDialog.create({
            id: "my-dialog",
            titleId: "my-dialog",
            chrome: true
        });
        // aui appends "dialog-title" to the end of your dialog titles.
        equal(dialogElement().attr("aria-labelledby"), "my-dialog-dialog-title", "TitleId attribute was passed to dialog");
    });

    test("Dialog close", function(){
        simpleDialog.create({
            id: "my-dialog",
            chrome: true
        });
        simpleDialog.close();

        ok(this.dialogSpy.hide.calledOnce, "Dialog close was called");
    });

    test("Focuses on iframe creation", function() {
        simpleDialog.create({
            id: "my-dialog",
            chrome: true
        });
        var iframe = document.createElement('iframe');
        iframe.focus = sinon.spy();
        dialogElement().append(iframe);
        $(iframe).trigger('ra.iframe.create');
        ok(iframe.focus.calledOnce, 'iframe was focused');
    });

    test("chromeless opens a chromeless dialog", function(){
        simpleDialog.create({
            id: "my-dialog",
            chrome: false
        });

        equal(dialogElement().find(".aui-dialog2-header").length, 0);
    });

    test("by default, dialogs are chromeless", function(){
        simpleDialog.create({
            id: "my-dialog"
        });

        equal(dialogElement().find(".aui-dialog2-header").length, 0);
    });

    test("options.chrome opens a dialog with chrome", function(){
        simpleDialog.create({
            id: "my-dialog",
            chrome: true
        });

        equal(dialogElement().find(".aui-dialog2-header").length, 1);
    });

    test("dialogs with chrome contain a submit button", function(){
        simpleDialog.create({
            id: "my-dialog",
            chrome: true
        });

        equal(dialogElement().find(".ap-dialog-submit").length, 1);
    });

    test("dialogs with chrome contain a cancel button", function(){
        simpleDialog.create({
            id: "my-dialog",
            chrome: true
        });

        equal(dialogElement().find(".ap-dialog-cancel").length, 1);
    });

    test("fullscreen dialogs contain submit and cancel buttons in the header", function(){
        simpleDialog.create({
            id: "my-dialog",
            size: 'fullscreen'
        });

        equal(dialogElement().find("header .ap-dialog-submit").length, 1);
        equal(dialogElement().find("header .ap-dialog-cancel").length, 1);
    });

    test("dialog with a submit button can set the text", function(){
        simpleDialog.create({
            id: "my-dialog",
            chrome: true,
            submitText: "some submit text"
        });
        equal(dialogElement().find(".ap-dialog-submit").text(), "some submit text");
    });

    test("dialog with a cancel button can set the text", function(){
        simpleDialog.create({
            id: "my-dialog",
            chrome: true,
            cancelText: "some cancel text"
        });
        equal(dialogElement().find(".ap-dialog-cancel").text(), "some cancel text");
    });


});
