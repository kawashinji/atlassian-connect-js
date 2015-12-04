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

        var to = function (target, context) {
            if (target in routes) {
                context = (typeof context === 'undefined') ? {} : context;
                browser.goToUrl(buildUrl(routes[target], context));
            } else {
                console.error("Unrecognised url target");
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
                concreteUrl = baseUrl + urlTemplate;
            }

            if (concreteUrl.indexOf('{') < -1 || concreteUrl.indexOf('}') < -1) {
                console.error("Incorrect parameters to url " + urlTemplate);
                return;
            }

            return concreteUrl;
        };

        return {
            to: to,
            reload: reload
        };
    });
})(define, AJS);

