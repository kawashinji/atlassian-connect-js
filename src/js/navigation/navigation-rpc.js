(function($, require){
    "use strict";
    require(["ac/navigate", 'connect-host'], function(navigate, _AP) {
        _AP.extend(function () {
            return {
                internals: {
                    to: function (target, context) {
                        console.log("navigation rpc is loaded");
                        navigate.to(target, context);
                    }
                }
            };
        });
    });

}(AJS.$, require));