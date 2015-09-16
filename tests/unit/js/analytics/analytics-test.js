
(function(){
    require(["analytics/analytics", "_dollar"], function(analytics) {
        module("Analytics", {

            setup: function() {
                this.triggerSpy = sinon.spy();
                AJS.Analytics = {
                    triggerPrivacyPolicySafeEvent: this.triggerSpy
                };
                this.clock = sinon.useFakeTimers();
                this.addonKey = "myaddonkey";
                this.moduleKey = "myModulekey";
                this.userKeyHash = "myUserKeyHash";
                this.analytics = analytics.get({addonKey: this.addonKey, moduleKey: this.moduleKey, userKeyHash: this.userKeyHash});
            },
            teardown: function() {
                this.triggerSpy.reset();
                delete AJS.Analytics;
                this.clock.restore();
            }
        });


        test("getKey returns addonKey$$moduleKey", function() {
            var response = this.analytics.getKey(this.addonKey, this.moduleKey);
            equal(response, this.addonKey + ':' + this.moduleKey);
        });

        test("trackBridgeMethod triggers an analytics event", function() {
            var functionName = "bridgeFunction";

            this.analytics.trackBridgeMethod(functionName);
            ok(this.triggerSpy.calledOnce);
        });

        test("trackBridgeMethod sends the method name", function() {
            var functionName = "bridgeFunction";

            this.analytics.trackBridgeMethod(functionName);
            equal(this.triggerSpy.args[0][1].name, functionName);
        });

        test("iframePerformance end triggers an analytics event", function() {
            this.analytics.iframePerformance.start();
            this.analytics.iframePerformance.end();
            ok(this.triggerSpy.calledOnce);
        });

        test("iframePerformance end analytics event includes addon / module keys", function() {
            this.analytics.iframePerformance.start();
            this.analytics.iframePerformance.end();
            equal(this.triggerSpy.args[0][1].addonKey, this.addonKey);
            equal(this.triggerSpy.args[0][1].moduleKey, this.moduleKey);
            equal(this.triggerSpy.args[0][1].userKeyHash, this.userKeyHash);
        });

        test("iframePerformance end analytics event includes time value", function() {
            this.analytics.iframePerformance.start();
            this.analytics.iframePerformance.end();
            ok(this.triggerSpy.args[0][1].value > 0);
            ok(Number.isFinite(this.triggerSpy.args[0][1].value), "performance value must be a number");
        });


        test("iframePerformance timeout triggers timeout and end analytics events", function() {
            this.analytics.iframePerformance.start();
            this.analytics.iframePerformance.timeout();
            ok(this.triggerSpy.calledTwice);
        });

        test("iframePerformance timeout analytics event includes addon / module keys", function() {
            this.analytics.iframePerformance.start();
            this.analytics.iframePerformance.timeout();
            equal(this.triggerSpy.args[0][1].addonKey, this.addonKey);
            equal(this.triggerSpy.args[0][1].moduleKey, this.moduleKey);
        });

    });

})();
