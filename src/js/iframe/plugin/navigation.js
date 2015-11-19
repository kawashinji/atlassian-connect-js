AP.define("navigation", ["_dollar", "_rpc"],
function ($, rpc) {
    "use strict";
    return rpc.extend(function (remote) {
        var exports = {

            to: function(target, context){
                remote.to(target, context);
            }

        };

        return {
            apis: exports,
            stubs: ["to"]
        };

    });

});
