import addons from './addons';
import content from './content';
// import cookie from './cookie/rpc';
import create from './create';
// import dialog from './dialog/api';
// import dialogBinder from './dialog/binder';
// import dialogRpc from './dialog/rpc';
// import env from './env';
// import history from './history/rpc';
// import inlineDialog from './inline-dialog/rpc';
// import inlineDialogBinder from './inline-dialog/binder';
import loadingIndicator from './loading-indicator';
// import messages from './messages/rpc';
// import request from './request';
import resize from './resize';
import rpc from './rpc';
import statusHelper from './status-helper';
import uiParams from '../common/ui-params';
import uri from '../common/uri';

/**
 * Private namespace for host-side code.
 * @type {*|{}}
 * @private
 * @deprecated use AMD instead of global namespaces. The only thing that should be on _AP is _AP.define and _AP.require.
 */
if (!window._AP) {
    window._AP = {};
}

AJS.toInit(function () {
    if (typeof window._AP !== 'undefined') {
        window._AP.Dialog = dialog;
    }
});

// AJS.toInit(dialogBinder);
// AJS.toInit(inlineDialogBinder);

rpc.extend(addons);
// rpc.extend(cookie);
// rpc.extend(dialogRpc);
// rpc.extend(env);
// rpc.extend(history);
// rpc.extend(inlineDialog);
rpc.extend(loadingIndicator);
// rpc.extend(messages);
rpc.extend(resize);
// rpc.extend(request);

export default {
    extend: rpc.extend,
    init: rpc.init,
    uiParams,
    create,
    _uriHelper: uri,
    _statusHelper: statusHelper,
    webItemHelper: content
}