(function (require) {
    "use strict";
    require(["connect-host", "ac/navigator"], function (connect, navigator) {
        connect.extend(function () {
            return {
                internals: {
                    go: function (target, context) {
                        navigator.go(target, context);
                    },
                    reload: function () {
                        navigator.reload();
                    },
                    getContext: function (callback) {
                        navigator.getContext(callback);
                    }
                },
                stubs: ["go", "reload", "getContext"]
            };
        });
    });

}(require));