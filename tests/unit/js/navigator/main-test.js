AJS.General = {};
AJS.General.getBaseUrl = sinon.stub().returns("http://test.com/wiki");
AJS.Confluence = sinon.stub().returns(true);

require(['ac/navigator', 'ac/navigator-browser'], function (navigator, browser) {

    module("Main Navigator", {
        setup: function () {
            browser.reloadBrowserPage = sinon.stub();
            browser.goToUrl = sinon.stub();
        }
    });

    test("Page refresh", function () {
        navigator.reload();

        ok(browser.reloadBrowserPage.called, "Page was refreshed");
    });

    test("Navigate to dashboard", function () {
        navigator.go("dashboard");

        ok(browser.goToUrl.called, "Tried to navigate");
        ok(browser.goToUrl.calledWith("http://test.com/wiki"), "Navigated to dashboard");
    });

    test("Navigate to page", function () {
        navigator.go("contentview", {contentId: 1234});

        ok(browser.goToUrl.called, "Tried to navigate");
        ok(browser.goToUrl.calledWith("http://test.com/wiki/pages/viewpage.action?pageId=1234"), "Navigated to content view");
    });

    test("Navigate to edit page", function () {
        navigator.go("contentedit", {draftId: 1234, shareToken: 5678});

        ok(browser.goToUrl.called, "Tried to navigate");
        ok(browser.goToUrl.calledWith("http://test.com/wiki/pages/resumedraft.action?draftId=1234&draftShareId=5678"), "Navigated to content view");
    });

    test("Navigate to space", function () {
        navigator.go("spaceview", {spaceKey: "DS"});

        ok(browser.goToUrl.called, "Tried to navigate");
        ok(browser.goToUrl.calledWith("http://test.com/wiki/display/DS"), "Navigated to space view");
    });

    test("Navigate to admin view of space", function () {
        navigator.go("spaceadmin", {spaceKey: "DS"});

        ok(browser.goToUrl.called, "Tried to navigate");
        ok(browser.goToUrl.calledWith("http://test.com/wiki/spaces/viewspacesummary.action?key=DS"), "Navigated to space admin");
    });

    test("Navigate to user profile", function () {
        navigator.go("userprofile", {username: "admin"});

        ok(browser.goToUrl.called, "Tried to navigate");
        ok(browser.goToUrl.calledWith("http://test.com/wiki/display/~admin"), "Navigated to user profile");
    });

    test("Unrecognised target", function () {
        try {
            navigator.go("blah", {id: 1234});
        } catch(error) {
            equal(error, "Unrecognised url target")
        }
    });
});
