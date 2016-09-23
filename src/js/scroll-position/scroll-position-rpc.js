(function(define, AJS){
    "use strict";
    define('ac/scrollPosition', ['connect-host'], function(_AP){
        _AP.extend(function(){
            return {
                internals: {
                    /**
                     * Returns the calculated scrollX & scrollY relative to the viewport
                     * @returns {{host: {scrollY: number, scrollX: number, width: Number, height: Number}}}
                     */
                    getPosition: function () {
                        if(this.uiParams.isGeneral){
                            var rect = this.iframe.getBoundingClientRect();
                            var iframeTop = rect.top + document.body.scrollTop;
                            var iframeLeft = rect.left + document.body.scrollLeft;

                            return {
                                scrollY: window.scrollY - iframeTop,
                                scrollX: window.scrollX - iframeLeft,
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
