(function() {
    require(['ac/navigation'], function (navigation) {

        module("Main Navigation", {
            setup: function () {
                AJS = {};
                AJS.General = {};
                AJS.Confluence = sinon.stub().returns(true);
                AJS.General.getBaseUrl = sinon.stub().returns("http://test.com/wiki");

                this.location = {};
                this.location.reload = sinon.spy();

                this.document = {};
                this.document.location = sinon.spy();

            }
        });

        test("Page refresh", function () {
            navigation.reload();
            ok(location.reload.called, "Page was refreshed");
        });

        test("Navigate to dashboard", function () {
            navigation.to("dashboard");

            ok(document.location.called, "Tried to navigate");
            ok(document.location.calledWith("http://test.com/wiki"), "Navigated to dashboard")
        });

        test("Navigate to page", function () {
            navigation.to("contentview", {contentId: 1234});

            ok(document.location.called, "Tried to navigate");
            ok(document.location.calledWith("http://test.com/wiki/pages/viewpage.action?pageId=1234"), "Navigated to content view")
        });

        test("Navigate to edit page", function () {
            navigation.to("contentedit", {draftId: 1234, shareToken: 5678});

            ok(document.location.called, "Tried to navigate");
            ok(document.location.calledWith("http://test.com/wiki/pages/resumedraft.action?draftId=1234&draftShareId=5678"), "Navigated to content view")
        });

        test("Navigate to space", function () {
            navigation.to("spaceview", {spaceKey: "DS"});

            ok(document.location.called, "Tried to navigate");
            ok(document.location.calledWith("http://test.com/wiki/display/DS"), "Navigated to space view")
        });

        test("Navigate to admin view of space", function () {
            navigation.to("spaceadmin", {spaceKey: "DS"});

            ok(document.location.called, "Tried to navigate");
            ok(document.location.calledWith("http://test.com/wiki/spaces/viewspacesummary.action?key=DS"), "Navigated to space admin")
        });

        test("Navigate to user profile", function () {
            navigation.to("userprofile", {username: "admin"});

            ok(document.location.called, "Tried to navigate");
            ok(document.location.calledWith("/display/~admin"), "Navigated to user profile")
        });

        //test("Unrecognised target", function () {
        //    navigation.to("blah", {id: 1234});
        //
        //    // confirm it threw a console.error here
        //});

        //test("Incorrect context variables", function () {
        //    navigation.to("contentview", {username: 1234});
        //
        //    // confirm it threw a console.error here
        //});

    });
})();