(function (define, AJS) {
    "use strict";
    define("ac/navigator", ["connect-host", "ac/navigator-browser", "_uritemplate"], function (connect, browser, uri) {
        // ACJS-77: Migrate _uriTemplateHelper to use urijs.
        var routes = undefined;

        var contextFunction = function () {
            throw new Error("context api not yet implemented for this product")
        };

        var go = function (target, context) {

            if(!routes) {
                throw new Error("navigation api not yet implemented for this product")
            }

            if (Object.getOwnPropertyNames(routes).length === 0) {
                throw new Error("No routes defined");
            }
            if (target in routes) {
                context = context || {};
                browser.goToUrl(buildUrl(routes[target], context));
            } else {
                throw new Error("The URL target " + target + " is not available. Valid targets are: " + Object.keys(routes).toString());
            }
        };

        var reload = function () {
            browser.reloadBrowserPage();
        };

        var buildUrl = function (urlTemplate, context) {
            if (urlTemplate.indexOf("/") !== 0) {
                urlTemplate = "/" + urlTemplate;
            }

            return AJS.contextPath() + uri.parse(urlTemplate).expand(context);
        };

        var setRoutes = function (newRoutes) {
            routes = newRoutes;
        };

        var setContextFunction = function (newContextFunction) {
            if (typeof newContextFunction === 'function') {
                contextFunction = newContextFunction;
            } else {
                throw new Error("invalid context function specified");
            }
        };

        var getLocation = function (callback) {
            if (typeof callback !== "function") {
                throw new Error("invalid callback function specified")
            }
            callback(contextFunction());
        };

        return {
            go: go,
            reload: reload,
            setRoutes: setRoutes,
            getLocation: getLocation,
            setContextFunction: setContextFunction
        };
    });
})(define, AJS);

