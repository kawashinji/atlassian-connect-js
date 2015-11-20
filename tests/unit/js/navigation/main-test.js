require(['ac/navigation'], function(navigation) {

    module("Main Navigation", {
        setup: function () {
            var buildUrl = sinon.spy();
            var to = sinon.spy();
            var AJS = sinon.stub();

            var location = {};
            location.reload = sinon.spy();

        }
    });

    test("Page refresh", function () {
        navigation.to("currentPage");
        ok(location.reload.called, "Page was refreshed");
    });

    test("Navigate to dashboard", function () {
    });

    test("Navigate to page", function () {
    });

    test("Navigate to edit page", function () {
    });

    test("Navigate to space", function () {
    });

    test("Navigate to admin view of space", function () {
    });

    test("Navigate to user profile", function () {
    });

    test("Unrecognised target", function () {
    });

    test("Incorrect context variables", function () {
    });

});