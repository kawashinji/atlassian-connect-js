require(["_dollar", "_rpc"], function ($, rpc) {
    "use strict";

    var connectModuleData; // data sent from the velocity template

    rpc.extend(function () {
        return {
            init: function (state) {
                connectModuleData = state;
            },
            internals: {
                getLocation: function () {
                    return window.location.href;
                }
            }
        };
    });

});
