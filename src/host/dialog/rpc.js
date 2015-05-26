import dialog from './api';
import dialogFactory from './factory';
import $ from '../dollar';

var thisXdm;
$(function(jq){
    jq('body').on('click', '.ap-aui-dialog2', function(e){
        if(thisXdm){
            var buttonName;
            if(e.target.classList.contains('ap-dialog-submit')){
                buttonName = '"submit';
            }
            else if(e.target.classList.contains("ap-dialog-cancel")){
                buttonName = 'cancel';
            }
            var button = dialog.getButton(buttonName);
            if(button && button.isEnabled()){
                if(thisXdm.isActive() && thisXdm.buttonListenerBound){
                    thisXdm.dialogMessage(buttonName, button.dispatch);
                }
                else {
                    button.dispatch(true);
                }
            }
        }
    });
});

export default function () {
    return {
        stubs: ['dialogMessage'],

        init(state, xdm) {
            // fallback for old connect p2 plugin.
            if (state.dlg === '1') {
                xdm.uiParams.isDialog = true;
            }
            thisXdm = xdm;
        },

        internals: {
            dialogListenerBound() {
                this.buttonListenerBound = true;
            },

            setDialogButtonEnabled(name, enabled) {
                dialog.getButton(name).setEnabled(enabled);
            },

            isDialogButtonEnabled(name, callback) {
                var button = dialog.getButton(name);
                callback(button ? button.isEnabled() : void 0);
            },

            createDialog(dialogOptions) {
                var xdmOptions = {
                    key: this.addonKey
                };

                //open by key or url. This can be simplified when opening via url is removed.
                if (dialogOptions.key) {
                    xdmOptions.moduleKey = dialogOptions.key;
                } else if (dialogOptions.url) {
                    throw new Error('Cannot open dialog by URL, please use module key');
                }

                if ($('.aui-dialog2 :visible').length !== 0) {
                    throw new Error('Cannot open dialog when a layer is already visible');
                }

                dialogFactory(xdmOptions, dialogOptions, this.productContext);

            },
            closeDialog() {
                this.events.emit('ra.iframe.destroy');
                dialog.close();
            }
        }
    };
}