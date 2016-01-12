
require(['ac/dialog/dialog-factory'], function(dialogFactory) {

    var dialog;
    var dialogSpy;

    module("Dialog Factory", {
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

            this.server = sinon.fakeServer.create();
            AJS.contextPath = sinon.stub().returns("");

            // content resolver that would usually be implemented by the product.
            var contentResolverPromise = this.contentResolverPromise =  {
                done: sinon.stub().returns($.Deferred().promise()),
                fail: sinon.stub().returns($.Deferred().promise())
            };
            this.store.contentResolver = window._AP.contentResolver;

            window._AP.contentResolver = {
                resolveByParameters: sinon.stub().returns(this.contentResolverPromise)
            };

        },
        teardown: function(){
            window._AP.contentResolver = this.store.contentResolver;
            this.server.restore();
            window.AJS.dialog2 = this.store.dialog2;
            window.AJS.layer = this.store.layer;
            AJS.contextPath = null;

            // Ensure that the dialog stack is cleared after each test.
            var dialogsRemain = true;
            while (dialogsRemain) {
                try {
                    dialog.close();
                } catch (e) {
                    dialogsRemain = false;
                }
            }
        }
    });

    test("open a dialog by key launches an xhr", function(){
        this.server.respondWith("GET", /.*somekey\/somemodulekey/,
        [200, { "Content-Type": "text/html" }, 'This is the <span id="my-span">content</span>']);

        dialog = dialogFactory({
            key: 'somekey',
            moduleKey: 'somemodulekey',
            id: 'dialogid'
        },
        {}, "");

        equal(dialogSpy.$el.attr('id'), "dialogid", "Dialog element was created");
        ok(dialogSpy.show.calledOnce, "Dialog was shown");

    });


    test("content resolver is passed addon key", function(){
        dialog = dialogFactory({
            key: 'somekey',
            moduleKey: 'somemodulekey',
            id: 'dialogid'
        },
        {}, "");
        equal(window._AP.contentResolver.resolveByParameters.args[0][0].addonKey, 'somekey');

    });


    test("content resolver is passed module key", function(){
        dialog = dialogFactory({
            key: 'somekey',
            moduleKey: 'somemodulekey',
            id: 'dialogid'
        },
        {}, "");
        equal(window._AP.contentResolver.resolveByParameters.args[0][0].moduleKey, 'somemodulekey');

    });

    test("content resolver is passed product Context", function(){
        var productContext = {a: 'a'};
        dialog = dialogFactory({
            key: 'somekey',
            moduleKey: 'somemodulekey',
            id: 'dialogid'
        },
        {}, productContext);
        deepEqual(window._AP.contentResolver.resolveByParameters.args[0][0].productContext, productContext);


    });

    test("content resolver is passed uiParams", function(){
        dialog = dialogFactory({
            key: 'somekey',
            moduleKey: 'somemodulekey',
            id: 'dialogid'
        },
        {}, "");
        ok(typeof window._AP.contentResolver.resolveByParameters.args[0][0].uiParams === "object");
    });

    test("customOptions is passed uiParams", function(){
        var customData = {
            settings: {
                id: 123,
                user: 'Some User'
            },
            key: 'value'
        };
        dialog = dialogFactory({
            key: 'somekey',
            moduleKey: 'somemodulekey',
            id: 'dialogid'
        },
        {
            customData: customData
        }, "");
        deepEqual(window._AP.contentResolver.resolveByParameters.args[0][0].uiParams.customData, customData)
    });

    test("chrome: false option is honoured for fullscreen dialogs", function(){
        this.server.respondWith("GET", /.*somekey\/somemodulekey/,
            [200, { "Content-Type": "text/html" }, 'This is the <span id="my-span">content</span>']);

        dialog = dialogFactory({
                key: 'somekey',
                moduleKey: 'somemodulekey',
                id: 'dialogid',
                size: "fullscreen",
                chrome: false
            },
            {}, "");

        ok(dialogSpy.$el.hasClass('ap-aui-dialog2-chromeless'));
    });

    test("chrome: true option is honoured for fullscreen dialogs", function(){
        this.server.respondWith("GET", /.*somekey\/somemodulekey/,
            [200, { "Content-Type": "text/html" }, 'This is the <span id="my-span">content</span>']);

        dialog = dialogFactory({
                key: 'somekey',
                moduleKey: 'somemodulekey',
                id: 'dialogid',
                size: "fullscreen",
                chrome: true
            },
            {}, "");

        ok(!dialogSpy.$el.hasClass('ap-aui-dialog2-chromeless'));
    });

    test("chrome: undefined option defaults to false for fullscreen dialogs", function(){
        this.server.respondWith("GET", /.*somekey\/somemodulekey/,
            [200, { "Content-Type": "text/html" }, 'This is the <span id="my-span">content</span>']);

        dialog = dialogFactory({
                key: 'somekey',
                moduleKey: 'somemodulekey',
                id: 'dialogid',
                size: "fullscreen"
            },
            {}, "");

        ok(dialogSpy.$el.hasClass('ap-aui-dialog2-chromeless'));
    });

});
