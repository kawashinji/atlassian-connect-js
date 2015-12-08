(function (define, AJS) {
    "use strict";
    define("ac/navigator", ["connect-host", "ac/navigator/navigator-routes", "ac/navigator-browser", "_uritemplate"], function (connect, navigatorRoutes, browser, uri) {

        if (!AJS.Confluence) {
            console.error('The navigator API is currently only implemented in Confluence.');
            return;
        }

        // ACJS-77: Migrate _uriTemplateHelper to use urijs.
        var baseUrl = AJS.General.getBaseUrl(),
            routes = navigatorRoutes.routes;

        var go = function (target, context) {
            if (target in routes) {
                context = context || {};
                browser.goToUrl(buildUrl(routes[target], context));
            } else {
                throw "The URL target " + target + " is not available. Valid targets are: " + Object.keys(routes).toString();
            }
        };

        var reload = function () {
            browser.reloadBrowserPage();
        };

        var buildUrl = function (urlTemplate, context) {
            if (!urlTemplate.startsWith("/")) {
                urlTemplate = "/" + urlTemplate;
            }

            return baseUrl + uri.parse(urlTemplate).expand(context);
        };

        return {
            go: go,
            reload: reload
        };
    });
})(define, AJS);

