
    var rpc = require("_rpc");

    return {
        extend: rpc.extend,
        init: rpc.init,
        uiParams: require("_ui-params"),
        create: require('host/create'),
        _uriHelper: require('_uri'),
        _statusHelper: require('host/_status_helper'),
        _addons: require('host/_addons'),
        webItemHelper: require('host/content')
    };
}));