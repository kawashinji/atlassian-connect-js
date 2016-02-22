(function(define){
    "use strict";
    define('ac/messages', ["ac/messages/main", 'connect-host'], function(messages, _AP) {
        _AP.extend(function () {
            return {
                internals: {
                    showMessage: function (name, title, body, options) {
                        return messages.showMessage(name, title, body, options);
                    },
                    clearMessage: function (id) {
                        return messages.clearMessage(id);
                    },
                    onClose: function (id, callback) {
                        return messages.onClose(id, callback);
                    }
                }
            };
        });
    });
})(define);