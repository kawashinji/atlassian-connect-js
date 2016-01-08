require(['ac/dialog'], function(simpleDialog) {

    var dialogSpy;

    module("Main Dialog", {
        setup: function(){
            this.layerSpy = {
                changeSize: sinon.spy()
            };

            this.store = {
                layer: window.AJS.layer,
                dialog2: window.AJS.dialog2
            };

            // Until ac/dialog gets refactored, we need dialog.$el to be set.
            AJS.dialog2 = function($el) {
                dialogSpy = {
                    show: sinon.spy(),
                    on: sinon.spy(),
                    remove: sinon.spy(),
                    hide: sinon.spy(),
                    $el: $el
                };
                return dialogSpy;
            };
            AJS.layer = sinon.stub().returns(this.layerSpy);

        },
        teardown: function(){
            // clean up mock
            window.AJS.dialog2 = this.store.dialog2;
            window.AJS.layer = this.store.layer;

            // Ensure that the dialog stack is cleared after each test.
            var dialogsRemain = true;
            while (dialogsRemain) {
                try {
                    simpleDialog.close();
                } catch (e) {
                    dialogsRemain = false;
                }
            }
        }
    });
    
    function dialogElement() {
        return dialogSpy.$el;
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

        ok(dialogSpy.hide.calledOnce, "Dialog close was called");
    });

    test("Dialog close before dialog created throws error", function(){
        try {
            simpleDialog.close();
            ok(false, 'Error should be thrown when calling close before any dialogs created.');
        } catch (e) {
            // Expected to be thrown.
            ok(true, 'Error was thrown as expected.')
        }
    });

    test("Dialog close after dialog stack empty throws error", function(){
        simpleDialog.create({
            id: "my-dialog",
            chrome: true
        });
        simpleDialog.close();

        try {
            simpleDialog.close();
            ok(false, 'Error should be thrown when calling close after last dialog closed.');
        } catch (e) {
            // Expected to be thrown.
            ok(true, 'Error was thrown as expected.')
        }
    });

    test("Dialog opened multiple times without closing", function(){
        simpleDialog.create({
            id: "my-dialog"
        });

        try {
            simpleDialog.create({
                id: "my-dialog"
            });
            ok(false, 'Error should be thrown when opening same dialog multiple times.');
        } catch (e) {
            // Expected to be thrown.
            ok(true, 'Error was thrown as expected.')
        }
    });

    test("Multiple dialogs can be opened", function(){
        simpleDialog.create({
            ns: "my-dialog-1"
        });
        simpleDialog.create({
            ns: "my-dialog-2"
        });

        // Close and reopen the second dialog
        simpleDialog.close();
        simpleDialog.create({
            ns: "my-dialog-2"
        });

        // Close two dialogs - this would throw if two dialogs were not open.
        simpleDialog.close();
        simpleDialog.close();

        ok(true, 'Dialogs should be opened and closed without errors');
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

    test("new button can be added to dialog", function(){
        simpleDialog.create({
            id: "my-dialog"
        });
        var createdButton = simpleDialog.createButton('Click me');
        var $el = createdButton.$el;
        equal($el.text(), 'Click me');
        ok($el.hasClass('aui-button-secondary'));
        ok($el.hasClass('ap-dialog-custom-button'));

        var foundButton = simpleDialog.getButton('Click me');
        equal(createdButton, foundButton, "The created button should be present in the dialog's button collection.");
    });

});
