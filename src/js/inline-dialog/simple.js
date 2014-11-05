define("inline-dialog/simple", ["_dollar", "host/_status_helper", "host/_util", "host/content"], function($, statusHelper, util, hostContentUtilities) {
    return function (contentUrl, options) {
        var $inlineDialog;

        // Find the web-item that was clicked, we'll be needing its ID.
        if (!options.bindTo || !options.bindTo.jquery) {
            return;
        }

        var webItem = options.bindTo.hasClass("ap-inline-dialog") ? options.bindTo : options.bindTo.closest(".ap-inline-dialog");
        var itemId = webItem.attr("id");
        if (!itemId) {
            return;
        }

        var displayInlineDialog = function(content, trigger, showInlineDialog) {

            trigger = $(trigger); // sometimes it's not jQuery. Lets make it jQuery.
            content.data('inlineDialog', $inlineDialog);
            var pluginKey = hostContentUtilities.getWebItemPluginKey(trigger),
                moduleKey = hostContentUtilities.getWebItemModuleKey(trigger),
                promise = window._AP.contentResolver.resolveByParameters({
                    addonKey: pluginKey,
                    moduleKey: moduleKey,
                    isInlineDialog: true,
                    productContext: options.productContext
                });

            promise.done(function(data) {
                content.empty().append(data);
                // if target options contain width and height. set it.
                if(options.width || options.height){
                    content.css({width: options.width, height: options.height});
                }
            })
            .fail(function(xhr, status, ex) {
                var title = $("<p class='title' />").text("Unable to load add-on content. Please try again later.");
                content.html("<div class='aui-message error ap-aui-message'></div>");
                content.find(".error").append(title);
                var msg = status + (ex ? ": " + ex.toString() : "");
                content.find(".error").text(msg);
                AJS.log(msg);
            })
            .always(function(){
                showInlineDialog();
            });

        };

        var dialogElementIdentifier = "ap-inline-dialog-content-" + itemId;

        $inlineDialog = $("#inline-dialog-" + util.escapeSelector(dialogElementIdentifier));

        if($inlineDialog.length !== 0){
            $inlineDialog.remove();
        }

        //Create the AUI inline dialog with a unique ID.
        $inlineDialog = AJS.InlineDialog(
            options.bindTo,
            //assign unique id to inline Dialog
            dialogElementIdentifier,
            displayInlineDialog,
            options
        );

        return {
            id: $inlineDialog.attr('id'),
            show: function() {
                $inlineDialog.show();
            },
            hide: function() {
                $inlineDialog.hide();
            }
        };

    };

});
