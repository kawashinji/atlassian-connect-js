
    var rpc = require("_rpc");

    return {
        extend: rpc.extend,
        init: rpc.init,
        uiParams: require("_ui-params"),
        Dialog: require("dialog/main"),
        create: require('host/create'),
        _uriHelper: require('_uri')
    };
}));