import $ from './dollar';
import rpc from './rpc';

var exports;

rpc.extend(function (remote) {
    exports = {
        /**
        * Hide the inline dialog that contains your connect add-on.
        * @noDemo
        * @example
        * AP.require('inline-dialog', function(inlineDialog){
        *   inlineDialog.hide();
        * });
        */
        hide: function () {
            remote.hideInlineDialog();
        }
    };
    return {
        stubs: ['hideInlineDialog']
    }
});

export default exports;