import addons from './addons';
import content from './content';
import create from './create';
import dialog from './dialog/api';
import dialogBinder from './dialog/binder';
import dialogRpc from './dialog/rpc';
import env from './env';
import inlineDialog from './inline-dialog/rpc';
import inlineDialogBinder from './inline-dialog/binder';
import loadingIndicator from './loading-indicator';
import messages from './messages/rpc';
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

 AJS.toInit(dialogBinder);
 AJS.toInit(inlineDialogBinder);

rpc.extend(addons);
rpc.extend(dialogRpc);
rpc.extend(env);
rpc.extend(inlineDialog);
rpc.extend(loadingIndicator);
rpc.extend(messages);
rpc.extend(resize);

export default {
    extend: rpc.extend,
    init: rpc.init,
    uiParams,
    create,
    _uriHelper: uri,
    _statusHelper: statusHelper,
    webItemHelper: content,
    dialog: dialog
}