import analytics from '../../src/host/analytics'
import $ from '../../src/common/dollar'

QUnit.module("Analytics", {

    setup: function() {
        this.triggerSpy = sinon.spy();
        AJS.Analytics = {
            triggerPrivacyPolicySafeEvent: this.triggerSpy
        };
        this.clock = sinon.useFakeTimers();
        this.addonKey = "myaddonkey";
        this.moduleKey = "myModulekey";
        this.analytics = analytics.get(this.addonKey, this.moduleKey);
    },
    teardown: function() {
        this.triggerSpy.reset();
        delete AJS.Analytics;
        this.clock.restore();
    }
});


QUnit.test("getKey returns addonKey$$moduleKey", function(assert) {
    var response = this.analytics.getKey(this.addonKey, this.moduleKey);
    assert.equal(response, this.addonKey + ':' + this.moduleKey);
});

QUnit.test("trackBridgeMethod triggers an analytics event", function(assert) {
    var functionName = "bridgeFunction";

    this.analytics.trackBridgeMethod(functionName);
    assert.ok(this.triggerSpy.calledOnce);
});

QUnit.test("trackBridgeMethod sends the method name", function(assert) {
    var functionName = "bridgeFunction";

    this.analytics.trackBridgeMethod(functionName);
    assert.equal(this.triggerSpy.args[0][1].name, functionName);
});

QUnit.test("iframePerformance end triggers an analytics event", function(assert) {
    this.analytics.iframePerformance.start();
    this.analytics.iframePerformance.end();
    assert.ok(this.triggerSpy.calledOnce);
});

QUnit.test("iframePerformance end analytics event includes addon / module keys", function(assert) {
    this.analytics.iframePerformance.start();
    this.analytics.iframePerformance.end();
    assert.equal(this.triggerSpy.args[0][1].addonKey, this.addonKey);
    assert.equal(this.triggerSpy.args[0][1].moduleKey, this.moduleKey);
});

QUnit.test("iframePerformance end analytics event includes time value", function(assert) {
    this.analytics.iframePerformance.start();
    this.analytics.iframePerformance.end();
    assert.ok(this.triggerSpy.args[0][1].value > 0);
    assert.ok(Number.isFinite(this.triggerSpy.args[0][1].value), "performance value must be a number");
});


QUnit.test("iframePerformance timeout triggers timeout and end analytics events", function(assert) {
    this.analytics.iframePerformance.start();
    this.analytics.iframePerformance.timeout();
    assert.ok(this.triggerSpy.calledTwice);
});

QUnit.test("iframePerformance timeout analytics event includes addon / module keys", function(assert) {
    this.analytics.iframePerformance.start();
    this.analytics.iframePerformance.timeout();
    assert.equal(this.triggerSpy.args[0][1].addonKey, this.addonKey);
    assert.equal(this.triggerSpy.args[0][1].moduleKey, this.moduleKey);
});
