(function() {
    require(['ac/navigation'], function (navigation) {

        module("Main Navigation", {
            setup: function () {
                var buildUrl = sinon.spy();
                var to = sinon.spy();
                var AJS = {};
                AJS.Confluence = sinon.stub().returns(true);

                var location = {};
                location.reload = sinon.spy();

            }
        });

        test("Page refresh", function () {
            navigation.reload();
            ok(location.reload.called, "Page was refreshed");
        });

        //test("Navigate to dashboard", function () {
        //    navigation.to("dashboard");
        //
        //    // TODO
        //});
        //
        //test("Navigate to page", function () {
        //    navigation.to("contentview", {id: 1234});
        //
        //    // TODO
        //});
        //
        //test("Navigate to edit page", function () {
        //    navigation.to("TODO", {id: 1234, shareToken: 5678});
        //
        //    // TODO
        //});
        //
        //test("Navigate to space", function () {
        //    navigation.to("spaceview", {key: "DS"});
        //
        //    // TODO
        //});
        //
        //test("Navigate to admin view of space", function () {
        //
        //    // TODO
        //});
        //
        //test("Navigate to user profile", function () {
        //
        //    // TODO
        //});
        //
        //test("Unrecognised target", function () {
        //
        //    // TODO
        //});
        //
        //test("Incorrect context variables", function () {
        //
        //    // TODO
        //});

    });
})();