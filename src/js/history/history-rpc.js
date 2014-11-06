require(["_dollar", "history/history", "_rpc"], function($, history, rpc){
    "use strict";

    rpc.extend(function(){
        return {
            init: function (state, xdm) {
                if(state.uiParams.isGeneral){
                    // register for url hash changes to invoking history.popstate callbacks.
                    $(window).on("hashchange", function(e){
                        history.hashChange(e.originalEvent, xdm.historyMessage);
                    });
                }
            },
            internals: {
                historyPushState: function (url) {
                    if(this.uiParams.isGeneral){
                        return history.pushState(url);
                    } else {
                        $.log("History is only available to page modules");
                    }
                },
                historyReplaceState: function (url) {
                    if(this.uiParams.isGeneral){
                        return history.replaceState(url);
                    } else {
                        $.log("History is only available to page modules");
                    }
                },
                historyGo: function (delta) {
                    if(this.uiParams.isGeneral){
                        return history.go(delta);
                    } else {
                        $.log("History is only available to page modules");
                    }
                }
            },
            stubs: ["historyMessage"] 
        };
    });

});
