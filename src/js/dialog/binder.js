(function(require, AJS){
    "use strict";
    require(["ac/dialog", "ac/dialog/dialog-factory", "connect-host"], function(dialog, dialogFactory, connect) {
      /**
       * Binds all elements with the class "ap-dialog" to open dialogs.
       * TODO: document options
       */
        AJS.toInit(function ($) {

            var action = "click",
                selector = ".ap-dialog",
                callback = function(href, options){

                    var webItemOptions = connect.webItemHelper.getOptionsForWebItem(options.bindTo),
                    moduleKey = connect.webItemHelper.getWebItemModuleKey(options.bindTo),
                    addonKey = connect.webItemHelper.getWebItemPluginKey(options.bindTo);

                    $.extend(options, webItemOptions);

                    if (!options.ns) {
                        options.ns = moduleKey;
                    }
                    if(!options.container){
                        options.container = options.ns;
                    }

                    // webitem target options can sometimes be sent as strings.
                    if(typeof options.chrome === "string"){
                        options.chrome = (options.chrome.toLowerCase() === "false") ? false : true;
                    }

                    //default chrome to be true for backwards compatibility with webitems
                    if(options.chrome === undefined){
                      options.chrome = true;
                    }

                    dialogFactory({
                        key: addonKey,
                        moduleKey: moduleKey
                    }, options,
                    options.productContext);
                };

            connect.webItemHelper.eventHandler(action, selector, callback);

        });

    });
})(require, AJS);