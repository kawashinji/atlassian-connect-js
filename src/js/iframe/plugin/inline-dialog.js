AP.define("inline-dialog", ["_dollar", "_rpc"],

/**
* The inline dialog is a wrapper for secondary content/controls to be displayed on user request. Consider this component as displayed in context to the triggering control with the dialog overlaying the page content.
* A inline dialog should be preferred over a modal dialog when a connection between the action has a clear benefit versus having a lower user focus.
*
* Inline dialogs can be shown via a [web item target](../modules/common/web-item.html#target).
*
* For more information, read about the Atlassian User Interface [inline dialog component](https://docs.atlassian.com/aui/latest/docs/inline-dialog.html).
* @exports inline-dialog
*/

function ($, rpc) {
    "use strict";

    var exports;

    rpc.extend(function (remote) {
        exports = {
            /**
            * Hide the inline dialog that contains the iframe where this method is called from.
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

    return exports;

});
