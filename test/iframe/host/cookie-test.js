import cookie from '../../../src/host/cookie/api'

var SEPARATOR = '$$';

QUnit.module("Cookie", {
    setup: function() {
        this.default_AJSCookie = window.AJS.Cookie;
        window.AJS.Cookie = {
            save: sinon.spy(),
            read: sinon.spy(),
            erase: sinon.spy()
        };
    },
    teardown: function() {
        window.AJS.Cookie = this.default_AJSCookie;
        document.cookie = "";
    },
});

QUnit.test("saveCookie calls AJS.Cookie.save", function(assert){
    cookie.saveCookie('addonKey', 'name', 'value', 1);
    assert.ok(window.AJS.Cookie.save.calledOnce);
});

QUnit.test("saveCookie prefixes the cookie with the add-on key", function(assert){
    var cookieName = "myCookie",
        cookieValue = "some value";

    cookie.saveCookie('addonKey', cookieName, cookieValue);
    assert.equal(window.AJS.Cookie.save.args[0][0], 'addonKey' + SEPARATOR + cookieName);
});

QUnit.test("readCookie calls AJS.Cookie.read", function(assert){
    cookie.readCookie('addonKey', "something");
    assert.ok(window.AJS.Cookie.read.calledOnce);
});

QUnit.test("readCookie prefixes the cookie with the add-on key", function(assert){
    var cookieName = "myCookie",
        cookieValue = "some value";
        cookie.readCookie('addonKey', cookieName);
    assert.ok(window.AJS.Cookie.read.args[0][0], 'addonKey' + SEPARATOR + cookieName);
});

QUnit.test("readCookie runs the callback function", function(assert){
    var cookieName = "myCookie",
        cookieValue = "some value",
        callback = sinon.spy();

    cookie.readCookie('addonKey', cookieName, callback);
    assert.ok(callback.calledOnce);
});

QUnit.test("readCookie callback contains cookie value", function(assert){
    var cookieName = "myCookie",
        cookieValue = "some value",
        callback = sinon.spy();

    // mock away AJS.Cookie as we assume AUI works.
    window.AJS.Cookie.read = sinon.stub()
        .withArgs('addonKey' + SEPARATOR + cookieName)
        .returns(cookieValue);

    cookie.readCookie('addonKey', cookieName, callback);
    assert.equal(callback.args[0][0], cookieValue);
});

QUnit.test("eraseCookie calls JS.Cookie.erase", function(assert){
    cookie.eraseCookie('addonKey', "abc");
    assert.ok(window.AJS.Cookie.erase.calledOnce);
});

QUnit.test("eraseCookie prefixes the cookie with the add-on key", function(assert){
    var cookieName = "myCookie",
        cookieValue = "some value";

    cookie.eraseCookie('addonKey', cookieName);
    assert.equal(window.AJS.Cookie.erase.args[0], 'addonKey' + SEPARATOR + cookieName);
});
