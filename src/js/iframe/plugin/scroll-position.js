AP.define("scroll-position", ["_dollar", "_rpc"],

/**
* Allows add-ons to store, retrieve and erased cookies against the host JIRA / Confluence. These cannot be seen by other add-ons.
* @exports cookie
*/

function ($, rpc) {
    "use strict";

    var exports;

    rpc.extend(function (remote) {
        exports = {
            /**
            * Get's the scroll position
             * @param callback {Function} callback to pass the scroll position
            * @noDemo
            * @example
            * AP.require("scroll-position", function(scrollPosition){
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
