(function(define, require, AJS, $){
    "use strict";
    define("ac/navigation", function() {
        console.log("navigation main is loaded");

        if(!AJS.Confluence) {
            console.warn('The navigation API is currently only implemented in Confluence.');
            return;
        }

        require('urijs', function(urijs) {
            /**
             * limitations of the spike:
             * 1. No final decision on the external representation of the API yet
             * 2. Only handles a single wildcard in the url (so no create page yet) // solved with npm library
             * 3. Needs the routes list pushed out to an external file
             * 4. Doesn't handle a single parameter eg navigateTo("dashboard")
             **/
            var baseUrl = AJS.General.getBaseUrl();

            var routes = {
                "contentview": "/pages/viewpage.action?pageId={id}",
                "contentedit": "/pages/resumedraft.action?draftId={id}&draftShareId={shareToken}",
                "dashboard"  : ""
            };

            var to = function (target, context) {
                if (target in routes) {
                    context = (typeof context === 'undefined') ? {} : context;
                    document.location = buildUrl(routes[target], context);
                } else {
                    // error thing goes here
                }
            };

            var buildUrl = function (urlTemplate, context) {
                //console.log("context = "+ context);
                //console.log("urlTemplate = "+ urlTemplate);
                var concreteUrl = urijs.URI.expand(urlTemplate, context);
                console.log("concreteUrl = " + concreteUrl);

                if (concreteUrl.contains('{') || concreteUrl.contains('}')) {
                    console.log("error expanding url");
                    // error condition because incorrect parameters, return expected
                }
            };

            return {
                to: to
            };
        });
    });
})(define, require, AJS, AJS.$);
