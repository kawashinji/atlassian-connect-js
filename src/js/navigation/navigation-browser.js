(function(define){
    "use strict";
    define("ac/navigation-browser", function() {
        /*
        This module decouples the low level browser actions from the navigation API.
         */

        var reloadBrowserPage = function() {
            location.reload();
        };

        var goToUrl = function(location) {
            document.location = location;
        };

        return {
            reloadBrowserPage: reloadBrowserPage,
            goToUrl: goToUrl
        };
    });
})(define);