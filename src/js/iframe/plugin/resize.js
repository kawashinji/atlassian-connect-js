AP.require(["_dollar", "_rpc", "_util"], function ($, rpc, util) {
    "use strict";
    
    rpc.extend(function () {
        return {
            initForFrame: function (config, xdm) {
                if (xdm) {
                    xdm.resize = util.debounce(function resize ($, width, height) {
                        $(this.iframe).each(function(i, el) {
                            el.style.width = width;
                            el.style.height = height + 'px';
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
