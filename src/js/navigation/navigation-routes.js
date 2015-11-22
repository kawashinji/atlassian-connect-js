(function(define){
    "use strict";
    define("ac/navigation/navigation-routes", [], function() {

        // Confluence only at the moment because JIRA navigation is not implemented yet.
        var confluence_routes = {
            "dashboard"    : "",
            "contentview"  : "/pages/viewpage.action?pageId={id}",
            "contentedit"  : "/pages/resumedraft.action?draftId={id}&draftShareId={shareToken}",
            "spaceadmin"   : "/spaces/viewspacesummary.action?key={key}",
            "spaceview"    : "/display/{key}",
            "userprofile"  : "/display/~{username}"
        };

        return {
            routes: confluence_routes
        };

    });
})(define);

