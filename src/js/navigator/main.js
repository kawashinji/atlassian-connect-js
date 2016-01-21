(function (define, AJS) {
    "use strict";
    define("ac/navigator", ["connect-host", "ac/navigator-browser", "_uritemplate"], function (connect, browser, uri) {
        // ACJS-77: Migrate _uriTemplateHelper to use urijs.
        var routes = {};
        var contextFunction = function () {
            return {"target": "unknown"}
        };

        var go = function (target, context) {
            if(Object.getOwnPropertyNames(routes).length === 0) {
                AJS.error("No routes defined");
                return;
            }
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
            if (urlTemplate.indexOf("/") !== 0) {
                urlTemplate = "/" + urlTemplate;
            }

            return AJS.contextPath() + uri.parse(urlTemplate).expand(context);
        };

        var setRoutes = function (newRoutes) {
            routes = newRoutes;
        };

        var setContextFunction = function (newContextFunction) {
            contextFunction = newContextFunction;
        };

        var getCurrent = function (callback) {
            if (!callback || typeof callback !== "function") {
                throw new Error("callback function not specified")
            }

            if (typeof contextFunction === "function") {
                callback(contextFunction());
            } else {
                callback({"target": "unknown", "context": {}})
            }
        };

        return {
            go: go,
            reload: reload,
            setRoutes: setRoutes,
            getCurrent: getCurrent,
            setContextFunction: setContextFunction
        };
    });
})(define, AJS);

