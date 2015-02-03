(function(define){
    "use strict";
    define('ac/cookie', ['ac/cookie/main', 'connect-host'], function(cookie, _AP){
        _AP.extend(function () {
            return {
                internals: {
                    saveCookie: function(name, value, expires){
                        cookie.saveCookie(this.addonKey, name, value, expires);
                    },
                    readCookie: function(name, callback){
                        cookie.readCookie(this.addonKey, name, callback);
                    },
                    eraseCookie: function(name){
                        cookie.eraseCookie(this.addonKey, name);
                    }
                }
            };
        });
    });
})(define);