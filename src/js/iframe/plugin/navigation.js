AP.define("navigation", ["_dollar", "_rpc"],
function ($, rpc) {
    "use strict";
    return rpc.extend(function (remote) {
        console.log("navigation in plugin dir is running");
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
