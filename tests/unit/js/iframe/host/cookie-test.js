(function(){
    require(["ac/cookie/main"], function(cookie) {
        var SEPARATOR = '$$';

        module("Cookie", {
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

        test("saveCookie calls AJS.Cookie.save", function(){
            cookie.saveCookie('addonKey', 'name', 'value', 1);
            ok(window.AJS.Cookie.save.calledOnce);
        });

        test("saveCookie prefixes the cookie with the add-on key", function(){
            var cookieName = "myCookie",
                cookieValue = "some value";

            cookie.saveCookie('addonKey', cookieName, cookieValue);
            equal(window.AJS.Cookie.save.args[0][0], 'addonKey' + SEPARATOR + cookieName);
        });

        test("readCookie calls AJS.Cookie.read", function(){
            cookie.readCookie('addonKey', "something");
            ok(window.AJS.Cookie.read.calledOnce);
        });

        test("readCookie prefixes the cookie with the add-on key", function(){
            var cookieName = "myCookie",
                cookieValue = "some value";
                cookie.readCookie('addonKey', cookieName);
            ok(window.AJS.Cookie.read.args[0][0], 'addonKey' + SEPARATOR + cookieName);
        });

        test("readCookie runs the callback function", function(){
            var cookieName = "myCookie",
                cookieValue = "some value",
                callback = sinon.spy();

            cookie.readCookie('addonKey', cookieName, callback);
            ok(callback.calledOnce);
        });

        test("readCookie callback contains cookie value", function(){
            var cookieName = "myCookie",
                cookieValue = "some value",
                callback = sinon.spy();

            // mock away AJS.Cookie as we assume AUI works.
            window.AJS.Cookie.read = sinon.stub()
                .withArgs('addonKey' + SEPARATOR + cookieName)
                .returns(cookieValue);

            cookie.readCookie('addonKey', cookieName, callback);
            equal(callback.args[0][0], cookieValue);
        });

        test("eraseCookie calls JS.Cookie.erase", function(){
            cookie.eraseCookie('addonKey', "abc");
            ok(window.AJS.Cookie.erase.calledOnce);
        });

        test("eraseCookie prefixes the cookie with the add-on key", function(){
            var cookieName = "myCookie",
                cookieValue = "some value";

            cookie.eraseCookie('addonKey', cookieName);
            equal(window.AJS.Cookie.erase.args[0], 'addonKey' + SEPARATOR + cookieName);
        });

    });

})();
