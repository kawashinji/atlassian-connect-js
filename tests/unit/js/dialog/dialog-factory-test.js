
define(['dialog/dialog-factory'], function(dialogFactory) {

    module("Dialog Factory", {
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

            AJS.dialog2 = sinon.stub().returns(this.dialogSpy);
            AJS.layer = sinon.stub().returns(this.layerSpy);
            this.server = sinon.fakeServer.create();
            AJS.contextPath = sinon.stub().returns("");

            // content resolver that would usually be implemented by the product.
            var contentResolverPromise = this.contentResolverPromise =  {
                done: sinon.stub().returns($.Deferred().promise()),
                fail: sinon.stub().returns($.Deferred().promise())
            };
            window._AP.contentResolver = {
                resolveByParameters: sinon.stub().returns(this.contentResolverPromise)
            };

        },
        teardown: function(){
            delete window._AP.contentResolver;
            this.server.restore();
            // clean up mock
            _AP.AJS = null;
            AJS.dialog2 = null;
            AJS.layer = null;
            AJS.contextPath = null;
        }
    });

    test("open a dialog by key launches an xhr", function(){
        this.server.respondWith("GET", /.*somekey\/somemodulekey/,
        [200, { "Content-Type": "text/html" }, 'This is the <span id="my-span">content</span>']);

        dialogFactory({
            key: 'somekey',
            moduleKey: 'somemodulekey',
            id: 'dialogid'
        },
        {}, "");

        equal(AJS.dialog2.args[0][0].attr('id'), "dialogid", "Dialog element was created");
        ok(this.dialogSpy.show.calledOnce, "Dialog was shown");

    });


    test("content resolver is passed addon key", function(){
        dialogFactory({
            key: 'somekey',
            moduleKey: 'somemodulekey',
            id: 'dialogid'
        },
        {}, "");
        equal(window._AP.contentResolver.resolveByParameters.args[0][0].addonKey, 'somekey');

    });


    test("content resolver is passed module key", function(){
        dialogFactory({
            key: 'somekey',
            moduleKey: 'somemodulekey',
            id: 'dialogid'
        },
        {}, "");
        equal(window._AP.contentResolver.resolveByParameters.args[0][0].moduleKey, 'somemodulekey');

    });

    test("content resolver is passed product Context", function(){
        var productContext = {a: 'a'};
        dialogFactory({
            key: 'somekey',
            moduleKey: 'somemodulekey',
            id: 'dialogid'
        },
        {}, productContext);
        deepEqual(window._AP.contentResolver.resolveByParameters.args[0][0].productContext, productContext);


    });

    test("content resolver is passed uiParams", function(){
        dialogFactory({
            key: 'somekey',
            moduleKey: 'somemodulekey',
            id: 'dialogid'
        },
        {}, "");
        ok(typeof window._AP.contentResolver.resolveByParameters.args[0][0].uiParams === "object");


    });

});
