_AP.require(["dialog/main", "host/content", "_uri", "dialog/dialog-factory"], function(dialog, hostContentUtilities, uri, dialogFactory) {
    "use strict";
  /**
   * Binds all elements with the class "ap-dialog" to open dialogs.
   * TODO: document options
   */
    AJS.toInit(function ($) {

        var action = "click",
            selector = ".ap-dialog",
            callback = function(href, options){

                var webItemOptions = hostContentUtilities.getOptionsForWebItem(options.bindTo);

                $.extend(options, webItemOptions);
                options.src = href;

                var contentUrlObj = new uri.init(href);
                if (!options.ns) {
                    options.ns = contentUrlObj.getQueryParamValue('xdm_c').replace('channel-', '');
                }
                if(!options.container){
                    options.container = options.ns;
                }

                //default chrome to be false for backwards compatability with webitems
                if(options.chrome === undefined || options.chrome === ""){
                  options.chrome = true;
                }

                dialog.create(options);
            };

        hostContentUtilities.eventHandler(action, selector, callback);

    });

});
