AJS.toInit(function ($) {
    (function(require, AJS){
        "use strict";
            require(["ac/inline-dialog/simple", "connect-host"], function(simpleInlineDialog, _AP) {

            var inlineDialogTrigger = '.ap-inline-dialog';
            var action = "click mouseover mouseout",
                callback = function(href, options, eventType){
                    var webItemOptions = _AP.webItemHelper.getOptionsForWebItem(options.bindTo);
                    $.extend(options, webItemOptions);
                    if(options.onHover !== "true" && eventType !== 'click'){
                        return;
                    }

                    // don't repeatedly open if already visible as dozens of mouse-over events are fired in quick succession
                    if (options.onHover === true && options.bindTo.hasClass('active')) {
                        return;
                    }
                    simpleInlineDialog(href, options).show();
                };
            _AP.webItemHelper.eventHandler(action, inlineDialogTrigger, callback);
        });
    })(require, AJS);
});
