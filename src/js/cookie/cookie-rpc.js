require(['cookie', '_rpc'], function(cookie, rpc){
    "use strict";

    rpc.extend(function () {
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