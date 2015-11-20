(function(define, AJS){
    "use strict";
    define("ac/navigation", ["connect-host", "ac/navigation/navigation-routes"], function(connect, navigationRoutes) {

        if(!AJS.Confluence) {
            console.error('The navigation API is currently only implemented in Confluence.');
            return;
        }

        // ACJS-77: Migrate _uriTemplateHelper to use urijs.
        var uri = connect._uriTemplateHelper,
            baseUrl = AJS.General.getBaseUrl(),
            routes = navigationRoutes.routes;

        var to = function (target, context) {
            if (target === "currentpage") {
                location.reload();
                return;
            }

            if (target in routes) {
                context = (typeof context === 'undefined') ? {} : context;
                document.location = buildUrl(routes[target], context);
            } else {
                console.error("Unrecognised url target");
            }
        };

        var buildUrl = function (urlTemplate, context) {
            var concreteUrl;

            if (context) {
                concreteUrl = baseUrl + uri.parse(urlTemplate).expand(context);
            } else {
                concreteUrl = baseUrl + urlTemplate;
            }

            if (concreteUrl.indexOf('{') < -1 || concreteUrl.indexOf('}') < -1) {
                console.error("Incorrect parameters to url " + urlTemplate);
                return;
            }

            return concreteUrl;
        };

        return {
            to: to
        };
    });
})(define, AJS);

