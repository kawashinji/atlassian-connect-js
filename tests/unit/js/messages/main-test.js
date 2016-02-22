(function(){
    require(['ac/messages/main'], function(messages) {

        module("Messages Main", {
            setup: function() {
                AJS.contextPath = function() { return ""; };
                $('<div id="qunit-fixture-messages" />').appendTo('body');
            },
            teardown: function() {
                $('#qunit-fixture-messages').remove();
                $(document).off();
            }
        });

        test("showMessage calls to AUI", function() {
            window.AJS.messages = {info: sinon.spy()};
            var msg = messages.showMessage("info", "my title", "some body", {id: 'ap-message-2'});
            ok(window.AJS.messages.info.calledOnce,"AJS.messages.info called");
            delete AJS.messages;
        });

        test("clearMessage removes valid elements from the dom", function () {
            var messageId = "ap-message-222";
            $("#qunit-fixture-messages").append('<div id="' + messageId + '" />');
            messages.clearMessage(messageId);
            equal($('#' + messageId).length, 0);

        });

        test("clearMessage only removes valid messages", function () {
            var messageId = "somethinginvalid";
            $("#qunit-fixture-messages").append('<div id="' + messageId + '" />');
            messages.clearMessage(messageId);
            equal($('#' + messageId).length, 1);

        });

        test("onClose callback is run when event is triggered", function () {
            var messageId = "ap-message-222";
            $("#qunit-fixture-messages").append('<div id="' + messageId + '" />');

            messages.onClose(messageId, function() {
                $("#" + messageId).text("closed event triggered");
            });

            $(document).trigger('aui-message-close', [$("#" + messageId)]);
            equal($('#' + messageId).text(), "closed event triggered");
        });

        test("onClose callback is not run when event has not triggered", function () {
            var messageId = "ap-message-222";
            $("#qunit-fixture-messages").append('<div id="' + messageId + '" />');

            messages.onClose(messageId, function() {
                $("#" + messageId).text("closed event triggered");
            });

            equal($('#' + messageId).text(), "");
        });

        test("onClose callback triggers for the correct message", function () {
            var messageId = "ap-message-222";
            var otherMessageId = "ap-message-666";
            $("#qunit-fixture-messages").append('<div id="' + messageId + '" />');
            $("#qunit-fixture-messages").append('<div id="' + otherMessageId  + '" />');

            messages.onClose(messageId, function() {
                $("#" + messageId).text("closed event triggered");
            });

            $(document).trigger('aui-message-close', [$("#" + messageId)]);
            equal($('#' + messageId).text(), "closed event triggered");
            equal($('#' + otherMessageId ).text(), "");
        });

        test("onClose does not run when callback is not a function", function () {
            var messageId = "ap-message-222";
            $("#qunit-fixture-messages").append('<div id="' + messageId + '" />');

            messages.onClose(messageId, 'not a function');
            $(document).trigger('aui-message-close', [$("#" + messageId)]);
            equal($('#' + messageId).text(), "");
        });

    });

})();
