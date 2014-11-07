
    var rpc = require("_rpc");

    var returnVal = {
        extend: rpc.extend,
        init: rpc.init,
        uiParams: require("_ui-params"),
        Dialog: require("dialog/main")
    };

    AJS.$.extend(_AP, returnVal);
    return returnVal;
}));