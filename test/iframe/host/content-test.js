import contentUtilities from '../../../src/host/content'

var pluginKey = "foo-plugin-key",
capability = {
    key: "bar-capability-key"
},
productContextJson = "",
contentPath = "/plugins/servlet/ac/" + pluginKey + "/" + capability.key,
FIXTUREID = "content-qunit-fixture";

QUnit.module("Content Utilities", {
    setup: function() {
        AJS.contextPath = function(){ return "https://www.example.com"; };
        this.container = $("<div />").attr("id", "qunit-container").appendTo("body");
        this.server = sinon.fakeServer.create();
        this.server.respondWith("GET", new RegExp(".*" + contentPath + ".*"),
            [200, { "Content-Type": "text/html" }, 'This is the <span id="my-span">content</span>']);
        this.linkFixure = $('<a id="' + FIXTUREID + '" href="http://foo.com/?width=101&height=200&cp=%2Fconfluence" class="ap-plugin-key-my-plugin ap-module-key-my-module" />');
        this.linkFixure.appendTo('body');
    },
    teardown: function() {
        this.container.remove();
        delete AJS.contextPath;
        this.server.restore();
        this.linkFixure.remove();
    },
});

QUnit.test("eventHandler assigns an event handler to the dom node", function(assert){
    var spy = sinon.spy();

    contentUtilities.eventHandler("click", '#' + FIXTUREID, spy);
    this.linkFixure.trigger('click');

    assert.ok(spy.calledOnce);
});

QUnit.test("eventHandler callback includes the width", function(assert){
    var spy = sinon.spy();

    contentUtilities.eventHandler("click", '#' + FIXTUREID, spy);
    this.linkFixure.trigger('click');
    assert.equal(spy.firstCall.args[1]['width'], '101');
});

QUnit.test("eventHandler callback includes the height", function(assert){
    var spy = sinon.spy();

    contentUtilities.eventHandler("click", '#' + FIXTUREID, spy);
    this.linkFixure.trigger('click');

    assert.equal(spy.firstCall.args[1]['height'], '200');
});

QUnit.test("eventHandler callback includes the context path", function(assert){
    var spy = sinon.spy();

    contentUtilities.eventHandler("click", '#' + FIXTUREID, spy);
    this.linkFixure.trigger('click');

    assert.equal(spy.firstCall.args[1]['cp'], '/confluence');

});
