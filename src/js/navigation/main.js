(function(define, AJS){
    "use strict";
    define("ac/navigation", ["connect-host"], function(connect) {

        if(!AJS.Confluence) {
            console.error('The navigation API is currently only implemented in Confluence.');
            return;
        }

        var Uri = connect._uriHelper;

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
            var concreteUrl = new Uri.init(urlTemplate);
            var key;

            for (key in context.keys) {
                concreteUrl = concreteUrl.replaceQueryParam(key, context[key]);
            }
            var stringUrl = concreteUrl.toString();

            if (stringUrl.contains('{') || stringUrl.contains('}')) {
                console.log("error expanding url");
                // error condition because incorrect parameters, return expected
            }

            return concreteUrl.toString();
        };

        return {
            to: to
        };
    });
})(define, AJS);

