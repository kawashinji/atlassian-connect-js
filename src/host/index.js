import EventDispatcher from 'dispatchers/event_dispatcher';
import simpleXDM from 'simple-xdm/dist/host';
import jwtActions from 'actions/jwt_actions';

import events from './extensions/events';
// import content from './content';
import create from './create';
import dialog from './extensions/dialog';
import env from './extensions/env';
// import dialogBinder from './dialog/binder';
// import dialogRpc from './dialog/rpc';
// import inlineDialog from './inline-dialog/rpc';
// import inlineDialogBinder from './inline-dialog/binder';
import loadingIndicator from './components/loading_indicator';
import messages from './extensions/messages';
import ExtensionActions from 'actions/extension_actions';
// import resize from './resize';
// import uiParams from '../common/ui-params';
// import uri from '../common/uri';
// import propagator from './propagate/rpc';

/**
 * Private namespace for host-side code.
 * @type {*|{}}
 * @private
 * @deprecated use AMD instead of global namespaces. The only thing that should be on _AP is _AP.define and _AP.require.
 */
if (!window._AP) {
  window._AP = {};
}

simpleXDM.defineModule('messages', messages);
simpleXDM.defineModule('dialog', dialog);
simpleXDM.defineModule('env', env);
simpleXDM.defineModule('events', events);

// rpc.extend(addons);
// rpc.extend(dialogRpc);
// rpc.extend(env);
// rpc.extend(inlineDialog);
// rpc.extend(loadingIndicator);
// rpc.extend(messages);
// rpc.extend(resize);
// rpc.extend(propagator);

EventDispatcher.register("extension-define-custom", function(data){
  simpleXDM.defineModule(data.name, data.methods);
});

export default {
  registerContentResolver: {
    resolveByExtension: (callback) => {
      jwtActions.registerContentResolver({callback: callback});
    }
  },
  defineExtension: (name, methods) => {
    ExtensionActions.defineCustomExtension(name, methods);
  },
  // extend: rpc.extend,
  // init: rpc.init,
  // uiParams,
  create
  // _uriHelper: uri,
  // _statusHelper: statusHelper,
  // webItemHelper: content,
  // dialog: dialog
};