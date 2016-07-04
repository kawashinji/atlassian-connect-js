import EventDispatcher from 'dispatchers/event_dispatcher';
import AnalyticsDispatcher from 'dispatchers/analytics_dispatcher';

const EVENT_NAME_PREFIX = 'jsapi.';

function _track(name, data) {
  AnalyticsDispatcher.dispatch(`${EVENT_NAME_PREFIX}${name}`, data);
}

function trackUseOfDeprecatedMethod(data, extension) {
  _track('deprecated', {
    addonKey: extension.addon_key,
    moduleKey: extension.key,
    methodUsed: data.methodUsed
  });
}

EventDispatcher.register('analytics-deprecated-method-used', function(data) {
  trackUseOfDeprecatedMethod(data.data, data.extension);
});