import $ from '../dollar';

function getInlineDialog($content) {
    return $content.closest('.contents').data('inlineDialog');
}

function showInlineDialog($content) {
    getInlineDialog($content).show();
}

function resizeInlineDialog($content, width, height) {
    $content.closest('.contents').css({
        width: width,
        height: height
    });
    refreshInlineDialog($content);
}

function refreshInlineDialog($content) {
    getInlineDialog($content).refresh();
}

function hideInlineDialog($content) {
    getInlineDialog($content).hide();
}

export default function () {
    return {
        init(state, xdm) {
            if (xdm.uiParams.isInlineDialog) {
                $(xdm.iframe).closest('.ap-container').on('resized', function (e, dimensions) {
                    resizeInlineDialog($(xdm.iframe), dimensions.width, dimensions.height);
                });
            }
        },
        internals: {
            hideInlineDialog() {
                hideInlineDialog($(this.iframe));
            }
        }
    };
}