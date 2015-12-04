(function(define, AJS){
    "use strict";
    define("ac/navigator", ["connect-host", "ac/navigator/navigator-routes", "ac/navigator-browser", "_uritemplate"], function(connect, navigatorRoutes, browser, uri) {

        if(!AJS.Confluence) {
            console.error('The navigator API is currently only implemented in Confluence.');
            return;
        }

        // ACJS-77: Migrate _uriTemplateHelper to use urijs.
        var baseUrl = AJS.General.getBaseUrl(),
            routes = navigatorRoutes.routes;

        var go = function (target, context) {
            if (target in routes) {
                context = (typeof context === 'undefined') ? {} : context;
                browser.goToUrl(buildUrl(routes[target], context));
            } else {
                throw "Unrecognised url target";
            }
        };

        var reload = function() {
            browser.reloadBrowserPage();
        };

        var buildUrl = function (urlTemplate, context) {
            var concreteUrl;

            if (context) {
                concreteUrl = baseUrl + uri.parse(urlTemplate).expand(context);
            } else {
                // some locations don't need any context, eg to go to the dashboard
                concreteUrl = baseUrl + urlTemplate;
            }

            return concreteUrl;
        };

        return {
            go: go,
            reload: reload
        };
    });
})(define, AJS);

