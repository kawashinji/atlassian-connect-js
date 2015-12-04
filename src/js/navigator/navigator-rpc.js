(function(require){
    "use strict";
    require(["connect-host", "ac/navigator"], function(connect, navigator) {
        connect.extend(function () {
            return {
                internals: {
                    to: function (target, context) {
                        navigator.to(target, context);
                    },
                    reload: function () {
                        navigator.reload();
                    }
                },
                stubs: ["to"]
            };
        });
    });

}(require));