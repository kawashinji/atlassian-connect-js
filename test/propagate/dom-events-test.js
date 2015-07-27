import events from "../../src/common/dom-events";

QUnit.module("Propagate", {
    setup: function () {
    },
    teardown: function () {
    }
});

QUnit.test("keyboard event modifier string with no flags set", function (assert) {
    var eventData = {};
    var result = events.constructLegacyModifierString(eventData);
    assert.equal(result, "");
});

QUnit.test("keyboard event modifier string with all flags set", function (assert) {
    var eventData = {
        ctrlKey: true,
        shiftKey: true,
        metaKey: true,
        altKey: true
    };
    var result = events.constructLegacyModifierString(eventData);
    assert.equal(result, "Shift,Ctrl,Meta,Alt");
});

QUnit.test("only ESC is allowed as key press", function (assert) {
    assert.ok(events.isAllowedKeyCode(AJS.keyCode.ESCAPE));

    for (var i = 0; i < 222; i++) {
        if (i != AJS.keyCode.ESCAPE) {
            assert.notOk(events.isAllowedKeyCode(i));
        }
    }
})

QUnit.test("bound listeners only propagate supported events", function (assert) {
    assert.expect(1);
    events.bindListeners("test-channel", function (key, name, data) {
        assert.ok(name, "click");
    });

    document.dispatchEvent(new MouseEvent("click"));
});

QUnit.test("bound listeners only propagate events to other channels", function (assert) {

    events.bindListeners("test-channel", function (key, name, data) {
        assert.ok(name, "click");
    });

    var event = new MouseEvent("click");

    // Same channel - expect no propagation (+0)
    event["channelKey"] = "test-channel";
    document.dispatchEvent(event);

    // Different channel - expect propagation (+1)
    event["channelKey"] = "another-channel";
    document.dispatchEvent(event);

    // No channel (native event) - expect propagation (+1)
    delete event["channelKey"];
    document.dispatchEvent(event);

    assert.expect(2);
});

QUnit.test("bound listeners with multiple channels", function (assert) {

    var tester = function (key, name, data) {
        assert.ok(name, "click")
    };

    events.bindListeners("test-channel-1", tester);
    events.bindListeners("test-channel-2", tester);

    var event = new MouseEvent("click");

    // No match - expect propagation to all channels (+2)
    event["channelKey"] = "test-channel";
    document.dispatchEvent(event);

    // Matched channel - expect propagation to other channels (+1)
    event["channelKey"] = "test-channel-1";
    document.dispatchEvent(event);

    // No channel (native event) - expect propagation to all channels (+2)
    delete event["channelKey"];
    document.dispatchEvent(event);

    assert.expect(5);
});

QUnit.test("create event with supported mouse event type", function (assert) {
    var result = events.createEvent("key", "click", {
        button: 1
    });

    assert.ok(result != null);
    assert.strictEqual(result.button, 1);
    assert.strictEqual(result.type, "click");
    assert.strictEqual(result["channelKey"], "key");
});

QUnit.test("create event with unsupported mouse event type", function (assert) {
    var result = events.createEvent("key", "mousedown", {
        button: 1
    });

    assert.ok(result == null);
});

QUnit.test("create event with supported keyboard event type", function (assert) {
    var result = events.createEvent("key", "keydown", {
        keyCode: 27
    });

    assert.ok(result != null);
    assert.strictEqual(result.type, "keydown");
});

QUnit.test("create event with unsupported keyboard event type", function (assert) {
    var result = events.createEvent("key", "keypress", {
        keyCode: 27
    });

    assert.ok(result == null);
});