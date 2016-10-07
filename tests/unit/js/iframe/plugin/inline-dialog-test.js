var xdmMockInlineDialog;
(function(){
    var context = require.config({
        context: Math.floor(Math.random() * 1000000),
        baseUrl: '/base/src/js/iframe/plugin',
        map: {
            '*': {
                '_xdm': '_xdmMockInlineDialogTest'
            }
        },
        paths: {
            '_xdmMockInlineDialogTest': '/base/tests/unit/js/iframe/plugin/_xdmMockInlineDialogTest',
            '_dispatch-custom-event': '../_dispatch-custom-event',
            '_ui-params': '../_ui-params',
            '_base64': '../_base64',
            '_uri': '../_uri',
            '_create-iframe-form': '../_create-iframe-form',
            '_create-iframe': '../_create-iframe'
        }
    });

    xdmMockInlineDialog = {
        hideInlineDialog: sinon.spy(),
        init: function() {}
    };

    context(["_rpc", "inline-dialog"], function(_rpc, inlineDialog) {
        _rpc.init();

        module("Inline Dialog plugin", {
            setup: function(){
                xdmMockInlineDialog.hideInlineDialog.reset();
            }
        });

        test('hide calls remote hideInlineDialog', function(){
            inlineDialog.hide();
            ok(xdmMockInlineDialog.hideInlineDialog.calledOnce);
        });
    });

})();
