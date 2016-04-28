AJS.Confluence = sinon.stub().returns(true);

require(['ac/navigator', 'ac/navigator-browser'], function (navigator, browser) {

    module("Main Navigator", {
        setup: function () {
            AJS.contextPath = sinon.stub().returns('/wiki');
            browser.reloadBrowserPage = sinon.stub();
            browser.goToUrl = sinon.stub();

            // this dependency is usually set by the confluence specific code in the Atlassian-Connect project
            navigator.setRoutes({
                "dashboard"    : "",
                "contentview"  : "/pages/viewpage.action?pageId={contentId}",
                "contentedit"  : "/pages/edit{contentType}.action?pageId={contentId}",
                "spacetools"   : "/spaces/viewspacesummary.action?key={spaceKey}",
                "spaceview"    : "/display/{spaceKey}",
                "userprofile"  : "/display/~{username}"
            });
        }
    });

    test("Page refresh", function () {
        navigator.reload();

        ok(browser.reloadBrowserPage.called, "Page was refreshed");
    });

    test("Navigate to dashboard", function () {
        navigator.go("dashboard");

        ok(browser.goToUrl.called, "Tried to navigate");
        ok(browser.goToUrl.calledWith("/wiki/"), "Navigated to dashboard");
    });

    test("Navigate to page", function () {
        navigator.go("contentview", {contentId: 1234});

        ok(browser.goToUrl.called, "Tried to navigate");
        ok(browser.goToUrl.calledWith("/wiki/pages/viewpage.action?pageId=1234"), "Navigated to content view");
    });

    test("Navigate to edit page", function () {
        navigator.go("contentedit", {contentType: "page", contentId: 1234});

        ok(browser.goToUrl.called, "Tried to navigate");
        ok(browser.goToUrl.calledWith("/wiki/pages/editpage.action?pageId=1234"), "Navigated to content edit");
    });

    test("Navigate to space", function () {
        navigator.go("spaceview", {spaceKey: "DS"});

        ok(browser.goToUrl.called, "Tried to navigate");
        ok(browser.goToUrl.calledWith("/wiki/display/DS"), "Navigated to space view");
    });

    test("Navigate to admin view of space", function () {
        navigator.go("spacetools", {spaceKey: "DS"});

        ok(browser.goToUrl.called, "Tried to navigate");
        ok(browser.goToUrl.calledWith("/wiki/spaces/viewspacesummary.action?key=DS"), "Navigated to space tools");
    });

    test("Navigate to user profile", function () {
        navigator.go("userprofile", {username: "admin"});

        ok(browser.goToUrl.called, "Tried to navigate");
        ok(browser.goToUrl.calledWith("/wiki/display/~admin"), "Navigated to user profile");
    });

    test("Unrecognised target", function () {
        try {
            navigator.go("blah", {id: 1234});
        } catch(error) {
            equal(error, "Error: The URL target blah is not available. Valid targets are: dashboard,contentview,contentedit,spacetools,spaceview,userprofile")
        }
    });
});
