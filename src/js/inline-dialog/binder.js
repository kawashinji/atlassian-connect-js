AJS.toInit(function ($) {
    (function(require, AJS){
        "use strict";
            require(["ac/inline-dialog/simple", "connect-host"], function(simpleInlineDialog, _AP) {

            var inlineDialogTrigger = '.ap-inline-dialog';
            var action = "click mouseover mouseout",
                callback = function(href, options, eventType){
                    var webItemOptions = _AP.webItemHelper.getOptionsForWebItem(options.bindTo);
                    $.extend(options, webItemOptions);
                    var onHover = options.onHover === true;
                    if (!onHover && eventType !== 'click') {
                        // onClick binding only and not a click - do nothing
                        return;
                    }

                    // don't repeatedly open if already visible as dozens of mouse-over events are fired in quick succession
                    if (onHover && options.bindTo.hasClass('active')) {
                        return;
                    }
                    simpleInlineDialog(href, options).show();
                };
            _AP.webItemHelper.eventHandler(action, inlineDialogTrigger, callback);
        });
    })(require, AJS);
});
