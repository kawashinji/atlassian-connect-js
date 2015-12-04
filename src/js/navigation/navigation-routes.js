(function(define){
    "use strict";
    define("ac/navigation/navigation-routes", function() {

        // Confluence only at the moment because JIRA navigation is not implemented yet.
        var confluence_routes = {
            "dashboard"    : "",
            "contentview"  : "/pages/viewpage.action?pageId={contentId}",
            "contentedit"  : "/pages/resumedraft.action?draftId={draftId}&draftShareId={shareToken}",
            "spaceadmin"   : "/spaces/viewspacesummary.action?key={spaceKey}",
            "spaceview"    : "/display/{spaceKey}",
            "userprofile"  : "/display/~{username}"
        };

        return {
            routes: confluence_routes
        };

    });
})(define);

