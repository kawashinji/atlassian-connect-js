import AnalyticsDispatcher from 'dispatchers/analytics_dispatcher';
import EventDispatcher from 'dispatchers/event_dispatcher';
import simpleXDM from 'simple-xdm/dist/host';
import jwtActions from 'actions/jwt_actions';
import events from './modules/events';
import create from './create';
import dialog from './modules/dialog';
import env from './modules/env';
import loadingIndicator from './components/loading_indicator';
import messages from './modules/messages';
import ModuleActions from 'actions/module_actions';
import DomEventActions from 'actions/dom_event_actions';
import _ from 'underscore';
import EventActions from 'actions/event_actions';
import IframeActions from 'actions/iframe_actions';

import InlineDialogWebItemComponent from 'components/inline_dialog_webitem';
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

// rpc.extend(propagator);

EventDispatcher.register('module-define-custom', function(data){
  simpleXDM.defineModule(data.name, data.methods);
});

simpleXDM.registerRequestNotifier(function(data){
  AnalyticsDispatcher.dispatch('bridge.invokemethod', {
    module: data.module,
    fn: data.fn,
    addonKey: data.addon_key,
    moduleKey: data.key
  });
});

export default {
  onKeyEvent: (extension_id, key, modifiers, callback) => {
    DomEventActions.registerKeyEvent({extension_id, key, modifiers, callback});
  },
  offKeyEvent: (extension_id, key, modifiers, callback) => {
    DomEventActions.unregisterKeyEvent({extension_id, key, modifiers, callback});
  },
  onIframeEstablished: (callback) => {
    EventDispatcher.register('after:iframe-bridge-estabilshed', function(data) {
      callback.call(null, {
        $el: data.$el,
        extension: _.pick(data.extension, ['id', 'addon_key', 'id', 'key', 'options', 'url'])
      });
    });
  },
  destroy: function(extension_id){
    IframeActions.notifyIframeDestroyed({extension_id: extension_id});
  },
  registerContentResolver: {
    resolveByExtension: (callback) => {
      jwtActions.registerContentResolver({callback: callback});
    }
  },
  defineModule: (name, methods) => {
    ModuleActions.defineCustomModule(name, methods);
  },
  broadcastEvent: (type, targetSpec, event) => {
    EventActions.broadcast(type, targetSpec, event);
  },
  create
};