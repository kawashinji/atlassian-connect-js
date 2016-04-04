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
                if (typeof routes[target] === "function") {
                    routes[target](context, browser.goToUrl);
                } else if (typeof routes[target] === "string") {
                    browser.goToUrl(buildUrl(routes[target], context));
                }
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


        /*
            setRoutes allows you to specify a json list of routes to use in a particular product for use with Navigator.go.
            There are two ways of defining each route.

            The straightforward method is to provide a relative url templated string, where the variables will be
            populated from the context object passed in by the add-on developer. For example:

            "myroutename" : "/my/relative/url/string?someVar={someVar}&someOtherVar={someOtherVar}"

            Alternatively, if you need more control over where to send the url, routing can be performed manually by
            defining a routing function, which takes a context variable and a callback. When the url is calculated,
            your code must call the callback function with the absolute url to navigate to. For example:

            "myroutename" :
                function (context, callback) {
                    // ...
                    // work out the absolute url here

                    callback(url);
                }
         */
        var setRoutes = function (newRoutes) {
            routes = newRoutes;
        };

        /*
            setContext allows you to specify a function to return the current context of the current page for use with
            Navigator.getLocation.

            When called from a page in the host product, the function should return a properly formatted json object
            consisting of a target and context object. For example:

            {
                 "target": "contentcreate",
                 "context": {
                     "contentId": 1234,
                     "contentType": "page"
                 }
            }
         */
        var setContextFunction = function (newContextFunction) {
            if (typeof newContextFunction === 'function') {
                contextFunction = newContextFunction;
            } else {
                throw new Error("invalid context function specified");
            }
        };

        var getContext = function (callback) {
            if (typeof callback !== "function") {
                throw new Error("invalid callback function specified")
            }
            callback(contextFunction());
        };

        return {
            go: go,
            reload: reload,
            setRoutes: setRoutes,
            getContext: getContext,
            setContextFunction: setContextFunction
        };
    });
})(define, AJS);

