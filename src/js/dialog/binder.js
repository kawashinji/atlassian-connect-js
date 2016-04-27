/**
 * Binds all elements with the class "ap-dialog" to open dialogs.
 * TODO: document options
 */
AJS.toInit(function ($) {

    (function(require, AJS){
        "use strict";
        require(["ac/dialog", "ac/dialog/dialog-factory", "connect-host"], function(dialog, dialogFactory, connect) {

            var action = "click",
                selector = ".ap-dialog",
                callback = function(href, options){

                    var webItemOptions = connect.webItemHelper.getOptionsForWebItem(options.bindTo),
                    moduleKey = connect.webItemHelper.getWebItemModuleKey(options.bindTo),
                    addonKey = connect.webItemHelper.getWebItemPluginKey(options.bindTo),
                    dialogModuleKey = connect.webItemHelper.getWebItemTargetKey(options.bindTo);

                    $.extend(options, webItemOptions, {
                        // The key of the common dialog module this item targets - may be blank
                        dialogModuleKey: dialogModuleKey
                    });

                    if (!options.ns) {
                        options.ns = addonKey + "__" + moduleKey;
                    }
                    if(!options.container){
                        options.container = options.ns;
                    }

                    // webitem target options can sometimes be sent as strings.
                    if(typeof options.chrome === "string"){
                        options.chrome = (options.chrome.toLowerCase() === "false") ? false : true;
                    }

                    //default chrome to be true for backwards compatibility with webitems
                    // ACJS-129 Keep chrome as opt-in for 'maximum' dialogs.
                    if(options.chrome === undefined && options.size !== 'maximum'){
                      options.chrome = true;
                    }

                    // The incoming header here is hard-coded to the web-item text that has the "ap-dialog" class.
                    // Options received by the dialogFactory are always respected, so don't force this hard-coded
                    // value to be used.
                    if (options.header) {
                        options.defaultHeader = options.header;
                    }

                    dialogFactory({
                        key: addonKey,
                        moduleKey: moduleKey
                    }, options,
                    options.productContext);
                };

            connect.webItemHelper.eventHandler(action, selector, callback);
        });
    })(require, AJS);
});
