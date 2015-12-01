(function(define, $){
    "use strict";

    /**
     * A modified Header for the AUI Dialog when its size is set to 'maximum' (fullscreen).
     *
     * The header's design is based on the File Viewer (https://extranet.atlassian.com/display/ADG/File+viewer+1.0).
     */
    define("ac/dialog/header-controls", [], function() {

        return {

            // This method is not intended for the public API - it's only in a separate JS file to split some code out
            // of main.js.
            create: function(options) {

                // TODO This should use Soy and eventually move to AUI. dT
                var markup =
                    '<div class="header-title-container" class="aui-item expanded">' +
                        '<div>' +
                            '<span class="header-title"></span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="header-control-panel" class="aui-item"></div>';

                var $header = $(markup);
                $header.find('.header-title').text(options.header || '');

                return {
                    $el: $header
                };
            }
        };

    });
})(define, AJS.$);