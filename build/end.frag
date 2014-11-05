    //The modules for your project will be inlined above
    //this snippet. Ask almond to synchronously require the
    //module value for 'main' here and return it as the
    //value to use for the public API for the built file.

    var rpc = require("_rpc");

    var returnVal = {
        extend: rpc.extend,
        init: rpc.init,
        create: require("host/create")
    };

    AJS.$.extend(_AP, returnVal);
    return returnVal;
}));