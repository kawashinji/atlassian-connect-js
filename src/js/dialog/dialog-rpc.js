(function(require, $){
    "use strict";
    require(["connect-host", "ac/dialog/dialog-factory", "ac/dialog"], function (connect, dialogFactory, dialogMain) {

        function initializeButtonCallback(name, button) {
            // Assumes that button events are only triggered on the currently-active dialog.
            var xdm = dialogMain._getActiveDialog().xdm;
            button.click(function (e, callback) {
                if (xdm.isActive() && xdm.buttonListenerBound) {
                    xdm.dialogMessage(name, callback);
                } else {
                    callback(true);
                }
            });
        }

        connect.extend(function () {
            return {
                stubs: ["dialogMessage"],
                init: function(state, xdm){
                    // fallback for old connect p2 plugin.
                    if(state.dlg === "1"){
                        xdm.uiParams.isDialog = true;
                    }

                    // This init method gets invoked from various Connect contexts and not solely when a dialog is
                    // invoked. If there's no active dialog, there's nothing to init here.
                    var activeDialog = dialogMain._getActiveDialog();
                    if (!activeDialog) {
                        return;
                    }

                    // We cache the xdm in the active dialog so that it's available for button bindings.
                    activeDialog.xdm = xdm;

                    $.each(dialogMain.getButton(), function(name, button) {
                        initializeButtonCallback(name, button);
                    });
                },
                internals: {
                    dialogListenerBound: function(){
                        this.buttonListenerBound = true;
                    },
                    setDialogButtonEnabled: function (name, enabled) {
                        dialogMain.getButton(name).setEnabled(enabled);
                    },
                    setDialogButtonHidden: function (name, hidden) {
                        dialogMain.getButton(name).setHidden(hidden);
                    },                    
                    isDialogButtonEnabled: function (name, callback) {
                        var button =  dialogMain.getButton(name);
                        callback(button ? button.isEnabled() : void 0);
                    },
                    isDialogButtonHidden: function (name, callback) {
                        var button =  dialogMain.getButton(name);
                        callback(button ? button.isHidden() : void 0);
                    },                    
                    createButton: function(name, options) {
                        var button = dialogMain.createButton(name, options);
                        initializeButtonCallback(name, button);
                    },
                    isCloseOnEscape: function (callback) {
                        callback(dialogMain.isCloseOnEscape());
                    },
                    createDialog: function (dialogOptions) {
                        var xdmOptions = {
                            key: this.addonKey
                        };
                        console.log('opening dialog with', dialogOptions);

                        //open by key or url. This can be simplified when opening via url is removed.
                        if(dialogOptions.key) {
                            xdmOptions.moduleKey = dialogOptions.key;
                        } else if(dialogOptions.url) {
                            throw new Error('Cannot open dialog by URL, please use module key');
                        }

                        // For looking up common dialog modules.
                        dialogOptions.dialogModuleKey = dialogOptions.key;

                        dialogFactory(xdmOptions, dialogOptions, this.productContext);

                    },
                    closeDialog: function() {
                        this.events.emit('ra.iframe.destroy');
                        dialogMain.close();
                    }
                }
            };
        });

    });
})(require, AJS.$);
