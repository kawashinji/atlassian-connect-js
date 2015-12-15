import dialogFactory from 'src/host/dialog/factory'

QUnit.module("Dialog Factory", {
    setup: function(){
        this.server = sinon.fakeServer.create();
        // content resolver that would usually be implemented by the product.
        // returns the same as the p2 plugin rest api response
        var contentResolverPromise = this.contentResolverPromise = $.Deferred().promise(function(options){
            var d = $.Deferred();
            var fullKey = options.addonKey + '__' + options.moduleKey;
            var container = AJS.$('<div class="ap-container" id="ap-' + fullKey + '">');
            container.append('<div class="ap-content" data-test="testing" id="embedded-' + fullKey + '">');
            d.resolve(container);
            return d.promise();
        });
        this.contentResolverSpy = sinon.spy(this, 'contentResolverPromise');
        this.store = {};
        window._AP = window._AP || {};
        this.store.contentResolver = window._AP.contentResolver;

        window._AP.contentResolver = {
            resolveByParameters: this.contentResolverSpy
        };

    },
    teardown: function(){
        window._AP.contentResolver = this.store.contentResolver;
        this.server.restore();
        AJS.$(".ap-aui-dialog2").remove();
        AJS.$(".aui-blanket").remove();
    }
});

QUnit.test("open a dialog by key launches an xhr", function(assert){
    this.server.respondWith("GET", /.*somekey\/somemodulekey/,
    [200, { "Content-Type": "text/html" }, 'This is the <span id="my-span">content</span>']);
    var id = 'dialogid';
    dialogFactory({
        key: 'somekey',
        moduleKey: 'somemodulekey',
        id: id
    },
    {}, "");
    var dialog = AJS.$("#" + id);
    assert.equal(dialog.attr('id'), "dialogid", "Dialog element was created");
});


QUnit.test("content resolver is passed addon key", function(assert){
    dialogFactory({
        key: 'somekey',
        moduleKey: 'somemodulekey',
        id: 'dialogid'
    },
    {}, "");
    assert.equal(this.contentResolverSpy.args[0][0].addonKey, 'somekey');
});


QUnit.test("content resolver is passed module key", function(assert){
    dialogFactory({
        key: 'somekey',
        moduleKey: 'somemodulekey',
        id: 'dialogid'
    },
    {}, "");

    assert.equal(window._AP.contentResolver.resolveByParameters.args[0][0].moduleKey, 'somemodulekey');
});

QUnit.test("content resolver is passed product Context", function(assert){
    var productContext = {a: 'a'};
    dialogFactory({
        key: 'somekey',
        moduleKey: 'somemodulekey',
        id: 'dialogid'
    },
    {}, productContext);

    assert.deepEqual(window._AP.contentResolver.resolveByParameters.args[0][0].productContext, productContext);
});

QUnit.test("content resolver is passed uiParams", function(assert){
    dialogFactory({
        key: 'somekey',
        moduleKey: 'somemodulekey',
        id: 'dialogid'
    },
    {}, "");

    assert.ok(typeof window._AP.contentResolver.resolveByParameters.args[0][0].uiParams === "object");
});

QUnit.test("dialog factory mounts content resolver response to the dom", function(assert){
    dialogFactory({
        key: 'somekey',
        moduleKey: 'somemodulekey',
        id: 'dialogid'
    },
    {}, "");

    var content = AJS.$("#embedded-somekey__somemodulekey");
    assert.equal(content.length, 1);
    assert.equal(content.data('test'), 'testing');
});
