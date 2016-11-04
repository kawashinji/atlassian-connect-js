(function(define, require, AJS, $){
    "use strict";
    define("ac/dialog", [
        "connect-host",
        "ac/dialog/button",
        "ac/dialog/header-controls"], function(
        connect,
        dialogButton,
        headerControls) {

        var $global = $(window);
        var idSeq = 0;

        // Stack of dialogs. The classic scenario is opening a full-screen editor dialog from a
        // smaller modal dialog. Stacking overlapping dialogs is not encouraged, design-wise.
        var dialogs = [];

        // References for the currently-active dialog, cached in this scope to avoid having to pass them
        // around from function to function.
        var $nexus;
        var dialog;
        var buttons;

        function createButtons() {
            return {
                submit: dialogButton.submit({
                    done: closeDialog
                }),
                cancel: dialogButton.cancel({
                    done: closeDialog
                })
            };
        }

        var keyPressListener = function(e){
            if(e.keyCode === 27 && dialog && dialog.hide){
                dialog.hide();
                $(document).unbind("keydown", keyPressListener);
            }
        };
        function headerFromOptions(options){
            // If header hasn't been specified in the DialogOptions, use the default header text from a
            // web-item binding.
            var header = options.header || options.defaultHeader;
            // The header is an I18nProperty from DialogOptions and not a String - extract the i18n value.
            if(typeof header === "object") {
                header = header.value;
            }
            return header;
        }
        function createDialogElement(options){
            var $el,
            extraClasses = ['ap-aui-dialog2'];

            // Fullscreen dialogs always have chrome.
            var chromeless = options.size !== 'fullscreen' && !options.chrome;
            if(chromeless){
                extraClasses.push('ap-aui-dialog2-chromeless');
            }

            var auiSize = options.size;
            if (auiSize === 'fullscreen') {
                // Fullscreen delegates to 'maximum' CSS styles for the correct height/width and top settings.
                auiSize = 'maximum';
            }

            $el = $(aui.dialog.dialog2({
                id: options.id,
                titleText: headerFromOptions(options),
                titleId: options.titleId,
                size: auiSize,
                extraClasses: extraClasses,
                removeOnHide: true,
                footerActionContent: true,
                modal: true
            }));

            if(chromeless){
                $el.find('header, footer').remove();
            } else {
                buttons.submit.setText(options.submitText);
                buttons.cancel.setText(options.cancelText);

                // TODO - once the API for pluggable buttons is supported we'll delegate to it here. dT
                // The buttonContainer will probably end up being the 'controlBar.$el' element.
                var $buttonContainer;

                if (options.size === 'fullscreen') {
                    // Replace the default AUI dialog header with the markup required for a File-Viewer-like L&F.

                    // The dialog itself needs an extra class so that the top and margin-top styles can be overridden.
                    $el.addClass('ap-header-controls');

                    var hc = headerControls.create(options);
                    var $container = $el.find('header');
                    $container.addClass('aui-group').empty().append(hc.$el);
                    $buttonContainer = $container.find('.header-control-panel');

                    buttons.submit.$el.addClass('aui-icon aui-icon-small aui-iconfont-success');
                    buttons.cancel.$el.addClass('aui-icon aui-icon-small aui-iconfont-close-dialog');
                }
                else {
                    //soy templates don't support sending objects, so make the template and bind them.
                    $buttonContainer = $el.find('.aui-dialog2-footer-actions');
                    $buttonContainer.empty();
                }

                $buttonContainer.append(buttons.submit.$el, buttons.cancel.$el);
            }

            $el.find('.aui-dialog2-content').append($nexus);
            $nexus.data('ra.dialog.buttons', buttons);

            function handler(button) {
                // ignore clicks on disabled links
                if(button.isEnabled()){
                    button.$el.trigger("ra.dialog.click", button.dispatch);
                }
            }

            $.each(buttons, function(i, button) {
                button.$el.click(function(){
                    handler(button);
                });
            });

            return $el;
        }

        function displayDialogContent($container, options){
            $container.append('<div id="embedded-' + options.ns + '" class="ap-dialog-container ap-content" />');
        }


        function parseDimension(value, viewport) {
            if (typeof value === "string") {
                var percent = value.indexOf("%") === value.length - 1;
                value = parseInt(value, 10);
                if (percent) value = value / 100 * viewport;
            }
            return value;
        }

        function closeDialog() {
            if (!dialog || dialogs.length === 0) {
                throw Error("Can't close dialog: no dialogs are currently open");
            }

            // Stop this callback being re-invoked from the hide binding when dialog.hide() is called below.
            if (dialog.isClosing) {
                return;
            }
            dialog.isClosing = true;

            // Unbind and unassign singletons.
            if ($nexus) {
                // Signal the XdmRpc for the dialog's iframe to clean up
                $nexus.trigger("ra.iframe.destroy")
                .removeData("ra.dialog.buttons")
                .unbind();
                // Clear the nexus handle to allow subsequent dialogs to open
                $nexus = null;
            }
            buttons = null;

            dialog.hide();

            var closedDialog = dialogs.pop();
            if (dialog !== closedDialog) {
                throw Error('The dialog being closed must be the last dialog to be opened.')
            }

            // The new class-level dialog var will be the next dialog in the stack.
            dialog = dialogs[dialogs.length - 1];
            if (dialog) {
                // Re-assign singletons.
                $nexus = dialog.$el.find('.ap-servlet-placeholder');
                buttons = $nexus.data('ra.dialog.buttons');
            }
        }

        return {
            _getActiveDialog: function () {
                return dialog;
            },
            isCloseOnEscape: function () {
                return $nexus && $nexus.data('ra.dialog.closeOnEscape');
            },
            getButton: function (name) {
                var buttons = $nexus && $nexus.data('ra.dialog.buttons') || {};
                return name ? buttons[name] : buttons;
            },
            createButton: function(name, options) {
                var button = new dialogButton.button({
                    type: 'secondary',
                    text: name,
                    additionalClasses: 'ap-dialog-custom-button'
                });

                dialog.$el.find('.aui-dialog2-footer-actions').prepend(button.$el);

                buttons[name] = button;

                button.$el.click(function() {
                    if (button.isEnabled()) {
                        button.$el.trigger("ra.dialog.click", button.dispatch);
                    }
                });

                return button;
            },

            /**
            * Constructs a new AUI dialog. The dialog has a single content panel containing a single iframe.
            * The iframe's content is either created by loading [options.src] as the iframe url. Or fetching the content from the server by add-on key + module key.
            *
            * @param {Object} options Options to configure the behaviour and appearance of the dialog.
            * @param {String} [options.header="Remotable Plugins Dialog Title"]  Dialog header.
            * @param {String} [options.headerClass="ap-dialog-header"] CSS class to apply to dialog header.
            * @param {String|Number} [options.width="50%"] width of the dialog, expressed as either absolute pixels (eg 800) or percent (eg 50%)
            * @param {String|Number} [options.height="50%"] height of the dialog, expressed as either absolute pixels (eg 600) or percent (eg 50%)
            * @param {String} [options.id] ID attribute to assign to the dialog. Default to "ap-dialog-n" where n is an autoincrementing id.
            */
            create: function(options, showLoadingIndicator) {
                // We don't support multiple copies of the same dialog being open at the same time.
                var nexusId = 'ap-' + options.ns;
                // This is a workaround because just using $('#' + nexusId) doesn't work in unit tests. :/
                dialogs.forEach(function (dialog) {
                    if (dialog.$el.find('#' + nexusId).length > 0) {
                        throw new Error("Can't create dialog. A dialog is already open with namespace: " + options.ns);
                    }
                });

                var defaultOptions = {
                        // These options really _should_ be provided by the caller, or else the dialog is pretty pointless
                        width: "50%",
                        height: "50%",

                        // default values
                        closeOnEscape: true
                    },
                    dialogId = options.id || "ap-dialog-" + (idSeq += 1),
                    mergedOptions = $.extend({id: dialogId}, defaultOptions, options, {dlg: 1}),
                    $dialogEl;

                // patch for an old workaround where people would make 100% height / width dialogs.
                if(mergedOptions.width === "100%" && mergedOptions.height === "100%"){
                    mergedOptions.size = "maximum";
                }

                if (mergedOptions.size === 'maximum' &&
                    typeof mergedOptions.chrome === 'undefined') {
                    // ACJS-129 This default will be set to true in a future release and then, depending on design intention,
                    // it might be hard-coded to be true (with no opt-out by setting chrome:false in the dialog options)
                    mergedOptions.chrome = false;
                }

                // Assign the singleton $nexus and buttons vars.
                $nexus = $("<div />")
                                .addClass("ap-servlet-placeholder ap-container")
                                .attr('id', nexusId)
                                .bind("ra.dialog.close", closeDialog);

                buttons = createButtons();

                $dialogEl = createDialogElement(mergedOptions);
                $dialogEl.find('.aui-dialog2-content').append($nexus);

                // Set the mergedOptions.w and h properties in case they're needed in the _AP.create call below.
                // See iframe/host/create.js for how w and h are used.
                if (options.size) {
                    mergedOptions.w = "100%";
                    mergedOptions.h = "100%";
                } else {
                    mergedOptions.w = parseDimension(mergedOptions.width, $global.width());
                    mergedOptions.h = parseDimension(mergedOptions.height, $global.height());

                    AJS.layer($dialogEl).changeSize(mergedOptions.w, mergedOptions.h);
                    $dialogEl.removeClass('aui-dialog2-medium'); // this class has a min-height so must be removed.
                }

                dialog = AJS.dialog2($dialogEl);
                dialogs.push(dialog);
                dialog.on("hide", closeDialog);

                // store it here so the client side handler can also check this value
                $nexus.data('ra.dialog.closeOnEscape', mergedOptions.closeOnEscape);

                if(mergedOptions.closeOnEscape) {
                    // ESC key closes the dialog
                    $(document).on("keydown", function (event) {
                        keyPressListener(event);
                    });
                }

                $.each(buttons, function(name, button) {
                    button.click(function () {
                        button.dispatch(true);
                    });
                });

                displayDialogContent($nexus, mergedOptions);

                $nexus.append('<pre>' + JSON.stringify(showLoadingIndicator) + '</pre>');
                $nexus.append('<pre>' + JSON.stringify(connect) + '</pre>');
                if(showLoadingIndicator !== false){
                    $nexus.append(connect._statusHelper.createStatusMessages());
                }

                //difference between a webitem and opening from js.
                $nexus.append('<pre>' + JSON.stringify(options) + '</pre>');
                $nexus.append('<pre>' + JSON.stringify(mergedOptions) + '</pre>');
                if(options.src){
                    _AP.create(mergedOptions);
                }

                // give the dialog iframe focus so it can capture keypress events, etc.
                // the 'iframe' selector needs to be specified, otherwise Firefox won't focus the iframe
                $dialogEl.on('ra.iframe.create', 'iframe', function () {
                    this.focus();
                });

                dialog.show();

                return dialog;
            },
            close: closeDialog
        };

    });
})(define, require, AJS, AJS.$);

AJS.toInit(function ($) {

    (function (require, AJS) {
        if (typeof window._AP !== "undefined") {
            //_AP.dialog global fallback.
            require(['ac/dialog'], function (dialog) {
                _AP.Dialog = dialog;
            });
        }
    })(require, AJS);
});
