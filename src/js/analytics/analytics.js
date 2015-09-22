define("analytics/analytics", ["_dollar"], function($){
    "use strict";

    /**
     * Blacklist certain bridge functions from being sent to analytics
     * @const
     * @type {Array}
     */
    var BRIDGEMETHODBLACKLIST = [
        "resize",
        "init"
    ];

    /**
     * Timings beyond 20 seconds (connect's load timeout) will be clipped to an X.
     * @const
     * @type {int}
     */
    var THRESHOLD = 20000;

    /**
     * Trim extra zeros from the load time.
     * @const
     * @type {int}
     */
    var TRIMPPRECISION = 100;

    function time() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    }

    /**
     * Initialises Connect analytics module. This module provides events for iframe performance (loaded, timed out, canceled).
     *
     * @param viewData.addonKey - addon's key
     * @param viewData.moduleKey - module's key.
     * @param viewData.userKeyHash - hash value of the currently logged in user. Null if anonymous.
     */
    function Analytics(viewData) {
        var metrics = {};
        this.addonKey = viewData.addonKey;
        this.moduleKey = viewData.moduleKey;
        this.userKeyHash = viewData.userKeyHash;
        this.iframePerformance = {
            start: function(){
                metrics.startLoading = time();
            },
            end: function(){
                var value = time() - metrics.startLoading;
                proto.track('iframe.performance.load', {
                    addonKey: viewData.addonKey,
                    moduleKey: viewData.moduleKey,
                    value: value > THRESHOLD ? 'x' : Math.ceil((value) / TRIMPPRECISION),
                    userKeyHash: viewData.userKeyHash
                });
                delete metrics.startLoading;
            },
            timeout: function(){
                proto.track('iframe.performance.timeout', {
                    addonKey: viewData.addonKey,
                    moduleKey: viewData.moduleKey
                });
                //track an end event during a timeout so we always have complete start / end data.
                this.end();
            },
            // User clicked cancel button during loading
            cancel: function(){
                proto.track('iframe.performance.cancel', {
                    addonKey: viewData.addonKey,
                    moduleKey: viewData.moduleKey
                });
            }
        };

    }

    var proto = Analytics.prototype;

    proto.getKey = function () {
        return this.addonKey + ':' + this.moduleKey;
    };

    proto.track = function (name, data) {
        var prefixedName = "connect.addon." + name;
        if(AJS.Analytics){
            AJS.Analytics.triggerPrivacyPolicySafeEvent(prefixedName, data);
        } else if(AJS.trigger) {
            // BTF fallback
            AJS.trigger('analyticsEvent', {
                name: prefixedName,
                data: data
            });
        } else {
            return false;
        }

        return true;
    };

    proto.trackBridgeMethod = function(name){
        if($.inArray(name, BRIDGEMETHODBLACKLIST) !== -1){
            return false;
        }
        this.track('bridge.invokemethod', {
            name: name,
            addonKey: this.addonKey,
            moduleKey: this.moduleKey
        });
    };

    return {
        get: function (viewData) {
            return new Analytics(viewData);
        }
    };

});
