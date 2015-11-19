(function(define, AJS){
    "use strict";
    define("ac/navigation", ["connect-host"], function(connect) {

        if(!AJS.Confluence) {
            console.error('The navigation API is currently only implemented in Confluence.');
            return;
        }

        // ACJS-77: Migrate _uriTemplateHelper to use urijs.
        var urijs   = connect._uriTemplateHelper,
            baseUrl = AJS.General.getBaseUrl(),

            // TODO move these out to a json file
            routes  = {
                "dashboard"    : "",
                "contentview"  : "/pages/viewpage.action?pageId={id}",
                "contentedit"  : "/pages/resumedraft.action?draftId={id}&draftShareId={shareToken}",
                "spaceview"    : "/display/CP/{id}",
                "spaceadmin"   : "/spaces/viewspacesummary.action?key={id}",
                "userprofile"  : "wiki/display/~{id}"
                // TODO currentpage
            };

        var to = function (target, context) {
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
                concreteUrl = baseUrl + urijs.parse(urlTemplate).expand(context);
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

