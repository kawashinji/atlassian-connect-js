AP.require(["_dollar", "_rpc"], function ($, rpc) {
    "use strict";

    function debounce(func, wait) {
        var timeout;
        var result;
        return function () {
            var args = arguments;
            var context = this;
            var later = function () {
                result = func.apply(context, args);
                context = args = null;
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            return result;
        };
    }

    rpc.extend(function () {
        return {
            initForFrame: function (config, xdm) {
                if (xdm) {
                    xdm.resize = debounce(function resize ($, width, height) {
                        $(this.iframe).each(function(i, el) {
                            el.style.width = width;
                            el.style.height = height;
                        });
                        //TODO: Understand consequences of removing this trigger.
                        // var nexus = $(this.iframe).closest('.ap-container');
                        // nexus.trigger('resized', {width: width, height: height});
                    });
                }
            },
            internalsForFrame: {
                resize: function(width, height) {
                    if(!this.uiParams.isDialog){
                        this.resize($, width, height);
                    }
                }
            }
        };
    });

});
