(function(define, AJS, $){
    "use strict";
    define('ac/history', ['ac/history/main', 'connect-host'], function(cHistory, _AP){

        _AP.extend(function(){
            return {
                init: function (state, xdm) {
                    if(state.uiParams.isGeneral){
                        // register for url hash changes to invoking history.popstate callbacks.
                        $(window).on("hashchange", function(e){
                            cHistory.hashChange(e.originalEvent, xdm.historyMessage);
                        });
                    }
                },
                internals: {
                    historyPushState: function (url) {
                        if(this.uiParams.isGeneral){
                            return cHistory.pushState(url);
                        } else {
                            AJS.log("History is only available to page modules");
                        }
                    },
                    historyReplaceState: function (url) {
                        if(this.uiParams.isGeneral){
                            return cHistory.replaceState(url);
                        } else {
                            AJS.log("History is only available to page modules");
                        }
                    },
                    historyGo: function (delta) {
                        if(this.uiParams.isGeneral){
                            return cHistory.go(delta);
                        } else {
                            AJS.log("History is only available to page modules");
                        }
                    }
                },
                stubs: ["historyMessage"]
            };
        });

    });
})(define, AJS, AJS.$);