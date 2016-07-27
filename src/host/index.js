import AnalyticsDispatcher from './dispatchers/analytics_dispatcher';
import EventDispatcher from './dispatchers/event_dispatcher';
import simpleXDM from 'simple-xdm/host';
import jwtActions from './actions/jwt_actions';
import events from './modules/events';
import create from './create';
import dialog from './modules/dialog';
import env from './modules/env';
import inlineDialog from './modules/inline-dialog';
import loadingIndicator from './components/loading_indicator';
import messages from './modules/messages';
import flag from './modules/flag';
import analytics from './modules/analytics';
import ModuleActions from './actions/module_actions';
import DomEventActions from './actions/dom_event_actions';
import _ from './underscore';
import EventActions from './actions/event_actions';
import IframeActions from './actions/iframe_actions';
import DialogExtensionActions from './actions/dialog_extension_actions';

import InlineDialogWebItemComponent from './components/inline_dialog_webitem';
import DialogWebItemComponent from './components/dialog_webitem';
import DialogExtensionComponent from './components/dialog_extension';

/**
 * Private namespace for host-side code.
 * @type {*|{}}
 * @private
 * @deprecated use AMD instead of global namespaces. The only thing that should be on _AP is _AP.define and _AP.require.
 */
if (!window._AP) {
  window._AP = {};
}

/*
 * Add version
 */
if (!window._AP.version) {
  window._AP.version = '%%GULP_INJECT_VERSION%%';
}

simpleXDM.defineModule('messages', messages);
simpleXDM.defineModule('flag', flag);
simpleXDM.defineModule('dialog', dialog);
simpleXDM.defineModule('inlineDialog', inlineDialog);
simpleXDM.defineModule('env', env);
simpleXDM.defineModule('events', events);
simpleXDM.defineModule('_analytics', analytics);

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
  dialog: {
    create: (extension, dialogOptions) => {
      DialogExtensionActions.open(extension, dialogOptions);
    },
    close: () => {
      DialogExtensionActions.close();
    }
  },
  onKeyEvent: (extension_id, key, modifiers, callback) => {
    DomEventActions.registerKeyEvent({extension_id, key, modifiers, callback});
  },
  offKeyEvent: (extension_id, key, modifiers, callback) => {
    DomEventActions.unregisterKeyEvent({extension_id, key, modifiers, callback});
  },
  onIframeEstablished: (callback) => {
    EventDispatcher.register('after:iframe-bridge-established', function(data) {
      callback.call(null, {
        $el: data.$el,
        extension: _.pick(data.extension, ['id', 'addon_key', 'key', 'options', 'url'])
      });
    });
  },
  onIframeUnload: (callback) => {
    EventDispatcher.register('after:iframe-unload', function(data) {
      callback.call(null, {
        $el: data.$el,
        extension: _.pick(data.extension, ['id', 'addon_key', 'key', 'options', 'url'])
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
  create: create,
  getExtensions: (filter) => {
    return simpleXDM.getExtensions(filter);
  }
};