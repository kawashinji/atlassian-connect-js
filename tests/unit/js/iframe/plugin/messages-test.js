var xdmMockMessages;
(function(){
    var context = require.config({
        context: Math.floor(Math.random() * 1000000),
        baseUrl: '/base/src/js/iframe/plugin',
        map: {
            '*': {
                '_xdm': '_xdmMockMessagesTest'
            }
        },
        paths: {
            '_xdmMockMessagesTest': '/base/tests/unit/js/iframe/plugin/_xdmMockMessagesTest',
            '_ui-params': '../_ui-params',
            '_base64': '../_base64',
            '_uri': '../_uri',
            '_dispatch-custom-event': '../_dispatch-custom-event',
            '_create-iframe': '../_create-iframe'
        }
    });

    xdmMockMessages = {
        init: function() {},
        clearMessage: sinon.spy(),
        showMessage: sinon.spy(),
        onClose: sinon.spy()
    };

    context(["_rpc", "messages"], function(_rpc, messages) {
        _rpc.init();

        module("Messages plugin", {
            setup: function(){
                xdmMockMessages.clearMessage.reset();
                xdmMockMessages.showMessage.reset();
            }
        });

        var MESSAGE_TYPES = ["generic", "error", "warning", "success", "info", "hint"];

        test('Each message type calls remote showMessage', function () {
            for(var i in MESSAGE_TYPES){
                messages[ MESSAGE_TYPES[i] ]('my title', 'mybody');
            }
            ok(xdmMockMessages.showMessage.args.length === 6);

        });

        test('creating a message returns the message id', function () {
            var id = messages.info('title','body');
            ok(typeof id === "string");
        });

        test('clear calls remote clearMessage', function () {
            messages.clear();
            ok(xdmMockMessages.clearMessage.calledOnce);
        });

        test('onClose calls remote onClose', function () {
            var message = messages.generic('my title', 'mybody');
            messages.onClose(message, function() {
                console.log('test');
            });
            ok(xdmMockMessages.onClose.calledOnce);
        })


    });

})();
