define("host/jwt-keepalive", ["_dollar", "_jwt"], function($, jwt){
    "use strict";

    function updateUrl (config){
        var promise = $.Deferred(function(defer){
            var contentPromise = window._AP.contentResolver.resolveByParameters({
                addonKey: config.addonKey,
                moduleKey: config.moduleKey,
                productContext: config.productContext,
                uiParams: config.uiParams,
                width: config.width,
                height: config.height,
                classifier: 'json'
            });

            contentPromise.done(function(data){
                var values = JSON.parse(data);
                defer.resolve(values.src);
            });
        });

        return promise;
    }

    return {
        updateUrl: updateUrl,
        isExpired: jwt.isJwtExpired
    };

});