import $ from '../dollar';
import content from '../content';

export default function (contentUrl, options) {
    var $inlineDialog;

    // Find the web-item that was clicked, we'll be needing its ID.
    if (!options.bindTo || !options.bindTo.jquery) {
        return;
    }

    var webItem = options.bindTo.hasClass('ap-inline-dialog') ? options.bindTo : options.bindTo.closest('.ap-inline-dialog');
    var itemId = webItem.attr('id');
    if (!itemId) {
        return;
    }

    function displayInlineDialog(content, trigger, showInlineDialog) {
        trigger = $(trigger); // sometimes it's not jQuery. Lets make it jQuery.
        content.data('inlineDialog', $inlineDialog);
        var pluginKey = content.getWebItemPluginKey(trigger);
        var moduleKey = content.getWebItemModuleKey(trigger);
        var promise = window._AP.contentResolver.resolveByParameters({
            addonKey: pluginKey,
            moduleKey,
            isInlineDialog: true,
            productContext: options.productContext,
            uiParams: {
                isInlineDialog: true
            }
        });

        promise
            .done(function (data) {
                content.empty().append(data);
                // if target options contain width and height. set it.
                if (options.width || options.height) {
                    content.css({
                        width: options.width,
                        height: options.height
                    });
                }
            })
            .fail(function (xhr, status, ex) {
                var title = $('<p class="title" />').text('Unable to load add-on content. Please try again later.');
                content.html('<div class="aui-message error ap-aui-message"></div>');
                content.find('.error').append(title);
                var msg = status + (ex ? ': ' + ex.toString() : '');
                content.find('.error').text(msg);
                AJS.log(msg);
            })
            .always(function () {
                showInlineDialog();
            });
    }

    var dialogElementIdentifier = 'ap-inline-dialog-content-' + itemId;

    $inlineDialog = $(document.getElementById('inline-dialog-' + dialogElementIdentifier));

    if ($inlineDialog.length !== 0) {
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

        show() {
            $inlineDialog.show();
        },

        hide() {
            $inlineDialog.hide();
        }
    };
}