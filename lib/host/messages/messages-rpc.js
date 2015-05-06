"use strict";

(function (define) {
    "use strict";
    define("ac/messages", ["ac/messages/main", "connect-host"], function (messages, _AP) {
        _AP.extend(function () {
            return {
                internals: {
                    showMessage: function showMessage(name, title, body, options) {
                        return messages.showMessage(name, title, body, options);
                    },
                    clearMessage: function clearMessage(id) {
                        return messages.clearMessage(id);
                    }
                }
            };
        });
    });
})(define);