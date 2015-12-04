(function(define){
    "use strict";
    define("ac/navigator/navigator-routes", function() {

        /*
        Confluence only at the moment because JIRA navigation is not implemented yet.
        In future we also will pull this Confluence specific routing information out of Connect, and instead have the
        method call delegate directly to the product. Tracked in CONFDEV-38620.
         */
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

