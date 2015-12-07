import connectHistory from 'src/host/history/api'

QUnit.module("History", {
    setup: function() {
    },
    teardown: function() {
        window.location.replace("#"); //reset the anchor.
    }
});


QUnit.test("pushState updates the url of the page", function(assert){
    connectHistory.pushState("mystate");
    assert.ok(window.location.hash.match(/^\#\!mystate$/));
});

QUnit.test("pushState adds an additional entry to the browser history", function(assert){
    var lengthBefore = window.history.length;
    connectHistory.pushState("foo");
    assert.equal(window.history.length, lengthBefore +1);
});

QUnit.test("replaceState updates the url of the page", function(assert){
    connectHistory.replaceState("myreplacedstate");
    assert.ok(window.location.hash.match(/^\#\!myreplacedstate$/));
});

QUnit.test("replaceState does not add to the length of the browser history object", function(assert){
    var lengthBefore = window.history.length;
    connectHistory.replaceState("bar");
    assert.equal(window.history.length, lengthBefore);
});

QUnit.test("hashchange invokes the callback when the url changes", function(assert){
    var dummyEvent = {
        newURL: "http://www.google.com/#!abc",
        oldURL: "http://www.google.com/#!foobar"
    },
    callback = sinon.spy();
    connectHistory.hashChange(dummyEvent, callback);
    assert.ok(callback.calledOnce);
});

QUnit.test("hashchange is ignored when the url does not change", function(assert){
    var dummyEvent = {
        newURL: "http://www.google.com/#!abc",
        oldURL: "http://www.google.com/#!abc"
    },
    callback = sinon.spy();
    connectHistory.hashChange(dummyEvent, callback);
    assert.equal(callback.calledOnce, false);
});

QUnit.test("hashchange is ignored when the url is changed by pushState", function(assert){
    connectHistory.pushState("foobar");
    var dummyEvent = {
        newURL: "http://www.google.com/#!foobar",
        oldURL: "http://www.google.com/#!abc"
    },
    callback = sinon.spy();
    connectHistory.hashChange(dummyEvent, callback);
    assert.equal(callback.calledOnce, false);
});

QUnit.test("hashchange is ignored when the url is changed by replaceState", function(assert){
    connectHistory.replaceState("foobar");
    var dummyEvent = {
        newURL: "http://www.google.com/#!foobar",
        oldURL: "http://www.google.com/#!abc"
    },
    callback = sinon.spy();
    connectHistory.hashChange(dummyEvent, callback);
    assert.equal(callback.calledOnce, false);
});

QUnit.test("getState returns the current url anchor without prefix", function(assert){
    var state = "foobar";
    connectHistory.pushState(state);
    assert.equal(connectHistory.getState(), state);
});
