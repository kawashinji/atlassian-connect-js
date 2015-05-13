import messages from '../../src/host/messages/api'

QUnit.module("Messages Main", {
    setup: function() {
        AJS.contextPath = function() { return ""; };
        $('<div id="qunit-fixture-messages" />').appendTo('body');
    },
    teardown: function() {
        $('#qunit-fixture-messages').remove();
    }
});

QUnit.test("showMessage calls to AUI", function(assert) {
    window.AJS.messages = {info: sinon.spy()};
    var msg = messages.showMessage("info", "my title", "some body", {id: 'ap-message-2'});
    assert.ok(window.AJS.messages.info.calledOnce,"AJS.messages.info called");
    delete AJS.messages;
});

QUnit.test("clearMessage removes valid elements from the dom", function (assert) {
    var messageId = "ap-message-222";
    $("#qunit-fixture-messages").append('<div id="' + messageId + '" />');
    messages.clearMessage(messageId);
    assert.equal($('#' + messageId).length, 0);
});

QUnit.test("clearMessage only removes valid messages", function (assert) {
    var messageId = "somethinginvalid";
    $("#qunit-fixture-messages").append('<div id="' + messageId + '" />');
    messages.clearMessage(messageId);
    assert.equal($('#' + messageId).length, 1);
});
