require(["_dollar", "_rpc", "dialog/dialog-factory", "dialog/main"], function ($, rpc, dialogFactory, dialogMain) {
    "use strict";

    rpc.extend(function () {
        return {
            stubs: ["dialogMessage"],
            init: function(state, xdm){
                if(xdm.uiParams.isDialog){
                    var buttons = dialogMain.getButton();
                    if(buttons){
                        $.each(buttons, function(name, button) {
                            button.click(function (e, callback) {
                                if(xdm.isActive() && xdm.buttonListenerBound){
                                    xdm.dialogMessage(name, callback);
                                } else {
                                    callback(true);
                                }
                            });
                        });
                    }
                }
            },
            internals: {
                dialogListenerBound: function(){
                    this.buttonListenerBound = true;
                },
                setDialogButtonEnabled: function (name, enabled) {
                    dialogMain.getButton(name).setEnabled(enabled);
                },
                isDialogButtonEnabled: function (name, callback) {
                    var button =  dialogMain.getButton(name);
                    callback(button ? button.isEnabled() : void 0);
                },
                createDialog: function (dialogOptions) {
                    var xdmOptions = {
                        key: this.addonKey
                    };

                    //open by key or url. This can be simplified when opening via url is removed.
                    if(dialogOptions.key) {
                        xdmOptions.moduleKey = dialogOptions.key;
                    } else if(dialogOptions.url) {
                        throw new Error('Cannot open dialog by URL, please use module key');
                    }

                    if($(".aui-dialog2 :visible").length !== 0) {
                        throw new Error('Cannot open dialog when a layer is already visible');
                    }

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
