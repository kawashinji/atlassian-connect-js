AP.define("scrollPosition", ["_dollar", "_rpc"],

/**
* Allows absolute position of elements inside a connect add-on iframe relative to the browser viewport
* @exports scroll-position
*/

function ($, rpc) {
    "use strict";

    var exports;

    rpc.extend(function (remote) {
        exports = {
            /**
            * Get's the scroll position relative to the browser viewport
            *
            * @param callback {Function} callback to pass the scroll position
            * @noDemo
            * @example
            * AP.require("scrollPosition", function(scrollPosition){
            *   scrollPosition.getPosition(function(obj) { console.log(obj); });
            * });
            */
            getPosition:function(callback){
                remote.getPosition(callback);
            }
        };
        return {
            stubs: ['getPosition']
        };
    });

    return exports;

});
