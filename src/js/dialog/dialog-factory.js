(function(define, $){
    "use strict";
    define("ac/dialog/dialog-factory", ["ac/dialog"], function(dialog) {

        //might rename this, it opens a dialog by first working out the url (used for javascript opening a dialog).
        /**
        * opens a dialog by sending the add-on and module keys back to the server for signing.
        * Used by dialog-pages, confluence macros and opening from javascript.
        * @param {Object} options for passing to AP.create
        * @param {Object} dialog options (width, height, etc)
        * @param {String} productContextJson pass context back to the server
        */
        return function(options, dialogOptions, productContext) {
            var promise,
            container,
            uiParams = $.extend({isDialog: 1}, options.uiParams, {data: dialogOptions.data});

            dialog.create({
                id: options.id,
                ns: options.moduleKey || options.key,
                chrome: dialogOptions.chrome || options.chrome,
                header: dialogOptions.header,
                width: dialogOptions.width,
                height: dialogOptions.height,
                size: dialogOptions.size,
                submitText: dialogOptions.submitText,
                cancelText: dialogOptions.cancelText
            }, false);

            container = $('.ap-dialog-container');
            if(options.url){
                throw new Error('Cannot retrieve dialog content by URL');
            }

            promise = window._AP.contentResolver.resolveByParameters({
                addonKey: options.key,
                moduleKey: options.moduleKey,
                productContext: productContext,
                uiParams: uiParams
            });

            promise
                .done(function(data) {
                    var dialogHtml = $(data);
                    dialogHtml.addClass('ap-dialog-container');
                    container.replaceWith(dialogHtml);
                })
                .fail(function(xhr, status, ex) {
                    var title = $("<p class='title' />").text("Unable to load add-on content. Please try again later.");
                    var msg = status + (ex ? ": " + ex.toString() : "");
                    container.html("<div class='aui-message error ap-aui-message'></div>");
                    container.find(".error").text(msg);
                    container.find(".error").prepend(title);
                    AJS.log(msg);
                });

            return dialog;
        };
    });
})(define, AJS.$);
