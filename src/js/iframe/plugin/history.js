AP.define("history", ["_dollar", "_rpc", "_ui-params"],

/**
* The History API allows your add-on to manipulate the current page URL for use in navigation. When using
* the history module only the page anchor is modified and not the entire window location.
*
* Note: This is only enabled for page modules (Admin page, General page, Configure page, User profile page).
* It cannot be used if the page module is launched as a dialog.
* ### Example ###
* ```
* AP.require(["history"], function(history){
*
*    // Register a function to run when state is changed.
*    // You should use this to update your UI to show the state.
*    history.popState(function(e){
*        alert("The URL has changed from: " + e.oldURL + "to: " + e.newURL);
*    });
*
*    // Adds a new entry to the history and changes the url in the browser.
*    history.pushState("page2");
*
*    // Changes the URL back and invokes any registered popState callbacks.
*    history.back();
*
* });
* ```
* @exports history
*/

function ($, rpc, uiParams) {
    "use strict";

    var popStateCallbacks = [];
    var state = uiParams.fromWindowName(null, "historyState");
    return rpc.extend(function (remote) {
        var exports = {
            /**
            * Retrieves the current state of the history stack and returns the value. The returned value is the same as what was set with the pushState method.
            * @return {String} The current url anchor
            * @noDemo
            * @example
            * AP.require(["history"], function(history){
            *    history.pushState("page5");
            *    history.getState(); // returns "page5";
            * });
            */
            getState: function(){
                return state;
            },

            /**
            * Moves the page history back or forward the specified number of steps.
            * A zero delta will reload the current page.
            * If the delta is out of range, does nothing.
            * This call invoke the popState callback.
            * @param {Integer} delta - Number of places to move in the history
            * @noDemo
            * @example
            * AP.require(["history"], function(history){
            *    history.go(-2); // go back by 2 entries in the browser history.
            * });
            */
            go: function(delta){
                remote.historyGo(delta);
            },
            /**
            * Goes back one step in the joint session history.
            * Will invoke the popState callback.
            * @noDemo
            * @example
            * AP.require(["history"], function(history){
            *    history.back(); // go back by 1 entry in the browser history.
            * });
            */
            back: function(){
                return this.go(-1);
            },
            /**
            * Goes back one step in the joint session history.
            * Will invoke the popState callback.
            * @noDemo
            * @example
            * AP.require(["history"], function(history){
            *    history.forward(); // go forward by 1 entry in the browser history.
            * });
            */
            forward: function(){
                return this.go(1);
            },
            /**
            * Updates the location's anchor with the specified value and pushes the given data onto the session history.
            * Does not invoke popState callback.
            * @param {String} url - URL to add to history
            */
            pushState: function(url){
                state = url;
                remote.historyPushState(url);
            },
            /**
            * Updates the current entry in the session history.
            * Updates the location's anchor with the specified value but does not change the session history.
            * Does not invoke popState callback.
            * @param {String} url - URL to update current history value with
            */
            replaceState: function(url){
                state = url;
                remote.historyReplaceState(url);
            },
            /**
            * Register a function to be executed on state change.
            * @param {Function} callback - Callback method to be executed on state change.
            */
            popState: function(callback){
                popStateCallbacks.push(callback);
            }
        };

        return {
            apis: exports,
            internals: {
                historyMessage: function(e){
                    state = e.newURL;
                    for(var i in popStateCallbacks){
                        try {
                            popStateCallbacks[i](e);
                        } catch (err) {
                            $.log("History popstate callback exception: " + err.message);
                        }
                    }
                }
            },
            stubs: ["historyPushState", "historyGo", "historyReplaceState"]
        };

    });

});
