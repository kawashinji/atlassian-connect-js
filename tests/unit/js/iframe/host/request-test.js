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
        });

        test("setAddFileUploadHandler fails when not passed a function", function() {
            var f = 'foo';
            throws(function() {
                request.setAddFileUploadHeader(f);
            }, new Error("func must be a function"), "An error was raised");
        });

        test("setAddFileUploadHandler does not fail when passed a function", function() {
            var f = function(headers) {
                headers["XAtlassian-token"] = "no-check";
                return headers;
            }

            request.setAddFileUploadHeader(f);
            ok(true, "Should pass without throwing an error.");
        });
    });
})();
