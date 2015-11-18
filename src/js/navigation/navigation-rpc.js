(function(require){
    "use strict";
    require(["connect-host", "ac/navigation"], function(connect, navigation) {
        connect.extend(function () {
            return {
                internals: {
                    to: function (target, context) {
                        navigation.to(target, context);
                    }
                },
                stubs: ["to"]
            };
        });
    });

}(require));