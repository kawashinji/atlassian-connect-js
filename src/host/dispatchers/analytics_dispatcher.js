import EventDispatcher from './event_dispatcher';
import $ from '../dollar';

const EVENT_NAME_PREFIX = 'connect.addon.';

/**
 * Timings beyond 20 seconds (connect's load timeout) will be clipped to an X.
 * @const
 * @type {int}
 */
const LOADING_TIME_THRESHOLD = 20000;

/**
 * Trim extra zeros from the load time.
 * @const
 * @type {int}
 */
const LOADING_TIME_TRIMP_PRECISION = 100;


class AnalyticsDispatcher {

  constructor() {
    this._addons = {};
  }

  _track(name, data) {
    var w = window;
    var prefixedName = EVENT_NAME_PREFIX + name;
    data = data || {};
    data.version = (w._AP && w._AP.version) ? w._AP.version : undefined;
    data.userAgent = w.navigator.userAgent;
    if(!w.AJS) {
      return false;
    }
    if(w.AJS.Analytics){
      w.AJS.Analytics.triggerPrivacyPolicySafeEvent(prefixedName, data);
    } else if(w.AJS.trigger) {
      // BTF fallback
      AJS.trigger('analyticsEvent', {
        name: prefixedName,
        data: data
      });
    } else {
      return false;
    }
    return true;
  }

  _time() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
  }

  trackLoadingStarted(extension) {
    if(this._addons && extension && extension.id) {
      extension.startLoading = this._time();
      this._addons[extension.id] = extension;
    } else {
      console.error('ACJS: cannot track loading analytics', this._addons, extension);
    }
  }

  trackLoadingEnded(extension) {
    if(this._addons && extension && this._addons[extension.id]) {
      var href = window && window.location && window.location.href ? window.location.href : '';
      var iframeIsCacheable = href && href.indexOf('xdm_e=') === -1;
      var value = this._time() - this._addons[extension.id].startLoading;
      var iframeLoadApdex = this.getIframeLoadApedex();
      this._track('iframe.performance.load', {
        addonKey: extension.addon_key,
        moduleKey: extension.key,
        iframeLoadMillis: value,
        iframeLoadApdex: iframeLoadApdex,
        iframeIsCacheable: iframeIsCacheable,
        value: value > LOADING_TIME_THRESHOLD ? 'x' : Math.ceil((value) / LOADING_TIME_TRIMP_PRECISION)
      });
    } else {
      console.error('ACJS: cannot track loading end analytics', this._addons, extension);
    }
  }

  getIframeLoadApedex(iframeLoadMilliseconds) {
    var apdexSatisfiedThresholdMilliseconds = 300;
    var iframeLoadApdex =
      iframeLoadMilliseconds <= apdexSatisfiedThresholdMilliseconds ? 1 :
      iframeLoadMilliseconds <= 4 * apdexSatisfiedThresholdMilliseconds ? 0.5 : 0;
    return iframeLoadApdex;
  }

  trackLoadingTimeout(extension) {
    this._track('iframe.performance.timeout', {
      addonKey: extension.addon_key,
      moduleKey: extension.key
    });
    //track an end event during a timeout so we always have complete start / end data.
    this.trackLoadingEnded(extension);
  }

  trackLoadingCancel(extension) {
    this._track('iframe.performance.cancel', {
      addonKey: extension.addon_key,
      moduleKey: extension.key
    });
  }

  trackUseOfDeprecatedMethod(methodUsed, extension) {
    this._track('jsapi.deprecated', {
      addonKey: extension.addon_key,
      moduleKey: extension.key,
      methodUsed: methodUsed
    });
  }

  trackMultipleDialogOpening(dialogType, extension) {
    this._track('jsapi.dialog.multiple', {
      addonKey: extension.addon_key,
      moduleKey: extension.key,
      dialogType: dialogType
    });
  }

  dispatch(name, data) {
    this._track(name, data);
  }
}

var analytics = new AnalyticsDispatcher();
if($.fn) {
  EventDispatcher.register('iframe-create', function(data) {
    analytics.trackLoadingStarted(data.extension);
  });
}

EventDispatcher.register('iframe-bridge-start', function (data){
  analytics.trackLoadingStarted(data.extension);
});
EventDispatcher.register('iframe-bridge-established', function(data) {
  analytics.trackLoadingEnded(data.extension);
});
EventDispatcher.register('iframe-bridge-timeout', function (data) {
  analytics.trackLoadingTimeout(data.extension);
});
EventDispatcher.register('iframe-bridge-cancelled', function(data) {
  analytics.trackLoadingCancel(data.extension);
});
EventDispatcher.register('analytics-deprecated-method-used', function(data) {
  analytics.trackUseOfDeprecatedMethod(data.methodUsed, data.extension);
});

EventDispatcher.register('iframe-destroyed', function(data) {
  delete analytics._addons[data.extension.extension_id];
});


export default analytics;