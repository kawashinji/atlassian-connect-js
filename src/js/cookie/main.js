(function(define, AJS){
    "use strict";
    define("ac/cookie/main", [], function () {

        function prefixCookie (addonKey, name){
            if (!addonKey || addonKey.length === 0) {
                throw new Error('addon key must be defined on cookies');
            }

            if (!name || name.length === 0) {
                throw new Error('Name must be defined');
            }
            return addonKey + '$$' + name;
        }

        return {
            saveCookie: function(addonKey, name, value, expires){
                AJS.Cookie.save(prefixCookie(addonKey, name), value, expires);
            },
            readCookie: function(addonKey, name, callback){
                var value = AJS.Cookie.read(prefixCookie(addonKey, name));
                if (typeof callback === "function") {
                    callback(value);
                }
            },
            eraseCookie: function(addonKey, name){
                 AJS.Cookie.erase(prefixCookie(addonKey, name));
            }
        };
    });
})(define, AJS);