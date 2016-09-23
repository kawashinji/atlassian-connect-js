(function(define, AJS){
    "use strict";
    define('ac/scroll-position', ['connect-host'], function(_AP){
        _AP.extend(function(){
            return {
                internals: {
                    getPosition: function () {
                        if(this.uiParams.isGeneral){
                            return {
                                scrollX: window.scrollX,
                                scrollY: window.scrollY,
                                width: window.innerWidth,
                                height: window.innerHeight

                            };
                        } else {
                            AJS.log("ScrollPosition is only available to page modules");
                        }
                    }
                }
            };
        });

    });
})(define, AJS);
