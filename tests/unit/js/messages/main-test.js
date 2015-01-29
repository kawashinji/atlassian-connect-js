(function(){
    require(['ac/messages/main'], function(messages) {

        module("Messages Main", {
            setup: function() {
                AJS.contextPath = function() { return ""; };
                $('<div id="qunit-fixture-messages" />').appendTo('body');
            },
            teardown: function() {
                $('#qunit-fixture-messages').remove();
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


    });

})();
