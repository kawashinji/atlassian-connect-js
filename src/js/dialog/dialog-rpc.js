(function(require, $){
    "use strict";
    require(["connect-host", "ac/dialog/dialog-factory", "ac/dialog"], function (connect, dialogFactory, dialogMain) {

        var thisXdm;
        
        function performClick(buttonName) {
            if(thisXdm){
                var button = dialogMain.getButton(buttonName);
                if(button && button.isEnabled()){
                    if(thisXdm.isActive() && thisXdm.buttonListenerBound){
                        thisXdm.dialogMessage(buttonName, button.dispatch);
                    }
                    else {
                        button.dispatch(true);
                    }
                }

            }
        }
        
        $("body").on('click', '.ap-dialog-cancel', function(){
            performClick('cancel');
        });

        $("body").on('click', '.ap-dialog-submit', function(){
            performClick('submit');
        });
        
        connect.extend(function () {
            return {
                stubs: ["dialogMessage"],
                init: function(state, xdm){
                    // fallback for old connect p2 plugin.
                    if(state.dlg === "1"){
                        xdm.uiParams.isDialog = true;
                    }
                    thisXdm = xdm;
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
})(require, AJS.$);
