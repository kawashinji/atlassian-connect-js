(function(define, $){
    "use strict";

    /**
     * A modified Header for the AUI Dialog when its size is set to 'maximum' (fullscreen).
     *
     * The header's design is based on the File Viewer (https://extranet.atlassian.com/display/ADG/File+viewer+1.0).
     */
    define("ac/dialog/header-controls", [], function() {

        // Note: This can use Soy if it eventually moves to AUI. dT
        var markup =
            '<div class="header-title-container" class="aui-item expanded">' +
                '<div>' +
                    '<span class="header-title"></span>' +
                '</div>' +
            '</div>' +
            '<div class="header-control-panel" class="aui-item"></div>';

        return {

            // This method is not intended for the public API - it's only in a separate JS file to split some code out
            // of main.js.
            create: function(options) {

                var $header = $(markup);

                // Using .text() here escapes any HTML in the header string.
                $header.find('.header-title').text(options.header || '');

                return {
                    $el: $header
                };
            }
        };

    });
})(define, AJS.$);