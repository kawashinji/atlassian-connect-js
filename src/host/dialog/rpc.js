import dialog from './api';
import dialogFactory from './factory';
import $ from '../dollar';

export default function () {
    return {
        stubs: ['dialogMessage'],

        init(state, xdm) {
            // fallback for old connect p2 plugin.
            if (state.dlg === '1') {
                xdm.uiParams.isDialog = true;
            }

            if(xdm.uiParams.isDialog){
                var buttons = dialog.getButton();
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
                dialog.close();
            }
        }
    };
}