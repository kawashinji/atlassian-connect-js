import AnalyticsDispatcher from './dispatchers/analytics_dispatcher';
import EventDispatcher from './dispatchers/event_dispatcher';
import loadingIndicator from './components/loading_indicator';
import events from './modules/events';
import dialog from './modules/dialog';
import env from './modules/env';
import inlineDialog from './modules/inline-dialog';
import messages from './modules/messages';
import flag from './modules/flag';
import analytics from './modules/analytics';
import scrollPosition from './modules/scroll-position';
import dropdown from './modules/dropdown';
import host from './modules/host';
import HostApi from './host-api';
import InlineDialogWebItemComponent from './components/inline_dialog_webitem';
import DialogWebItemComponent from './components/dialog_webitem';
import DialogExtensionComponent from './components/dialog_extension';
import simpleXDM from 'simple-xdm/host';
import getBooleanFeatureFlag from './utils/feature-flag';
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
simpleXDM.defineModule('scrollPosition', scrollPosition);
simpleXDM.defineModule('dropdown', dropdown);
simpleXDM.defineModule('host', host);

EventDispatcher.register('module-define-custom', function (data) {
  simpleXDM.defineModule(data.name, data.methods);
});

simpleXDM.registerRequestNotifier(function (data) {
  var dispatchEvent = () => {
    if (data.type === 'req') {
      AnalyticsDispatcher.dispatch('bridge.invokemethod', {
        module: data.module,
        fn: data.fn,
        addonKey: data.addon_key,
        moduleKey: data.key
      });
    } else if (data.type === 'sub') {
      AnalyticsDispatcher.dispatch('bridge.register-sub', {
        subAddonKey: data.sub.addon_key,
        subModuleKey: data.sub.key,
        addonKey: data.addon_key,
        moduleKey: data.key,
        blocked: data.blocked,
      });
    }
  }

  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(dispatchEvent, { timeout: 1000 });
  } else {
    dispatchEvent();
  }
});

simpleXDM.setFeatureFlagGetter(getBooleanFeatureFlag);

export default HostApi;
