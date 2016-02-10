(function(){
    require(["ac/request"], function(request) {
        test("defineSetExperimentalHeader fails when not passed a function", function() {
            var f = 'foo';
            throws(function() {
                request.setExperimentify(f);
            }, new Error("func must be a function"), "An error was raised");
        });

        test("defineSetExperimentalHeader does not fail when passed a function", function() {
            var f = function(headers) {
                headers["XExperimental"] = "opt-in";
                return headers;
            }

            request.setExperimentify(f);
            ok(true, "Should pass without throwing an error.");
        })
    });
})();
