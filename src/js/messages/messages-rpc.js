(function(require){
    "use strict";
    require(["ac/messages/main", 'connect-host'], function(messages, _AP) {
        _AP.extend(function () {
            return {
                internals: {
                    showMessage: function (name, title, body, options) {
                        return messages.showMessage(name, title, body, options);
                    },
                    clearMessage: function (id) {
                        return messages.clearMessage(id);
                    }
                }
            };
        });
    });
})(require);