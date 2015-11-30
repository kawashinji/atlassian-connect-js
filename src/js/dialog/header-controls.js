(function(define, $){
    "use strict";

    /**
     * A modified Header for the AUI Dialog when its size is set to 'maximum' (fullscreen).
     *
     * The header's design is based on the File Viewer (https://extranet.atlassian.com/display/ADG/File+viewer+1.0).
     */
    define("ac/dialog/header-controls", [], function() {

        return {

            // TODO Trivial implementation, should use Soy and eventually move to AUI. dT
            headerMarkup: function(options) {

                var title = options.header || 'dT forgot to fix this';

                var markup =
                    '<div class="header-title-container" class="aui-item expanded">' +
                    '<div>' +
                    '<span class="header-title">' + title + '</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="control-panel" class="aui-item">' +
                    '<span><a href="#" class="close header-icon" original-title="Close"></a></span>' +
                    '</div>';

                return markup;
            }
        };

    });
})(define, AJS.$);