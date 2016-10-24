(function(define, AJS){
    "use strict";
    define('ac/scrollPosition', ['connect-host'], function(_AP){
        function getScrollTop() {
            return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        }

        function getScrollLeft() {
            return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
        }

        var internals = {
            /**
             * Returns the calculated scrollX & scrollY relative to the viewport
             * @returns {{host: {scrollY: number, scrollX: number, width: Number, height: Number}}}
             */
            getPosition: function () {
                if(this.uiParams.isGeneral){
                    var rect = this.iframe.getBoundingClientRect();
                    var iframeTop = rect.top + getScrollTop();
                    var iframeLeft = rect.left + getScrollLeft();

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
        };

        _AP.extend(function(){
            return {
                internals: internals
            };
        });

        return internals;
    });
})(define, AJS);
