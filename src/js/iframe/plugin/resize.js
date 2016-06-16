AP.require(["_rpc", "_util", "_dispatch_custom_event"], function (rpc, util, dispatchCustomEvent) {
    "use strict";

    /**
     * If the given dimension is a Number it adds px to the end of it.
     *
     * @param dimension {String|Number} The dimension to convert
     * @returns {String} the css dimension
     */
    function convertDimension(dimension) {
        if(isNaN(dimension)) {
           return dimension;
        }
        return dimension + 'px';
    }

    /**
     * Looks for a parent with the given className
     *
     * @param target {Object} The target for which to find the parent for
     * @param className {String} The className for which to look
     * @returns {Object} the parent with the className
     */
    function getParentWithClass(target, className) {
        if(target === document.body) {
            return;
        }

        if (target.className.split(' ').indexOf(className) > -1) {
            return target;
        }

        return getParentWithClass(target.parentNode, className)
    }

    rpc.extend(function () {
        return {
            initForFrame: function (config, xdm) {
                if (!xdm) {
                    return;
                }

                xdm.resize = util.debounce(function resize (width, height) {
                    var nexus = getParentWithClass(this.iframe, 'ap-container');

                    dispatchCustomEvent(nexus, 'resized', {width: width, height: height});

                    this.iframe.style.width = convertDimension(width);
                    this.iframe.style.height = convertDimension(height);
                });
            },
            internalsForFrame: {
                resize: function(width, height) {
                    if(this.uiParams.isDialog){
                        return;
                    }

                    this.resize(width, height);
                }
            }
        };
    });

});
