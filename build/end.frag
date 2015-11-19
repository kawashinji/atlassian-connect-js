
    var rpc = require("_rpc");

    return {
        extend: rpc.extend,
        init: rpc.init,
        uiParams: require("_ui-params"),
        create: require('host/create'),
        _uriHelper: require('_uri'),
        _uriTemplateHelper: require('_uritemplate'),
        _statusHelper: require('host/_status_helper'),
        webItemHelper: require('host/content')
    };
}));