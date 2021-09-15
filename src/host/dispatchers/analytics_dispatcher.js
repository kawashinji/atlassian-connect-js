import EventDispatcher from './event_dispatcher';
import $ from '../dollar';
import observe from '../utils/observe';
import getBooleanFeatureFlag from '../utils/feature-flag';

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
    if (!w.AJS) {
      return false;
    }
    if (w.AJS.Analytics) {
      w.AJS.Analytics.triggerPrivacyPolicySafeEvent(prefixedName, data);
    } else if (w.AJS.trigger) {
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

  _trackGasV3(eventType, event) {
    try {
      const analyticsCrossProduct = window.require('ac/analytics');
      analyticsCrossProduct.emitGasV3(eventType, event);
    } catch (e) {
      console.error('Connect GasV3 Error', e);
    }
  }

  _time() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
  }

  trackLoadingStarted(extension) {
    if (this._addons && extension && extension.id) {
      extension.startLoading = this._time();
      this._addons[extension.id] = extension;
    } else {
      console.error('ACJS: cannot track loading analytics', this._addons, extension);
    }
  }

  trackLoadingEnded(extension) {
    if (this._addons && extension && this._addons[extension.id]) {
      var href = extension.url;
      var iframeIsCacheable = href !== undefined && href.indexOf('xdm_e=') === -1;
      var value = this._time() - this._addons[extension.id].startLoading;
      var iframeLoadApdex = this.getIframeLoadApdex(value);
      var api = 'untracked';
      if (getBooleanFeatureFlag('com.atlassian.connect.acjs-track-api')) {
        api = Object.keys(JSON.parse(this._addons[extension.id].$el[0].name).api)
          .sort()
          .toString();
      }
      var eventPayload = {
        addonKey: extension.addon_key,
        moduleKey: extension.key,
        moduleType: extension.options ? extension.options.moduleType : undefined,
        moduleLocation: extension.options ? extension.options.moduleLocation : undefined,
        pearApp: (extension.options && extension.options.pearApp === 'true') ? 'true' : 'false',
        iframeLoadMillis: value,
        iframeLoadApdex: iframeLoadApdex,
        iframeIsCacheable: iframeIsCacheable,
        value: value > LOADING_TIME_THRESHOLD ? 'x' : Math.ceil((value) / LOADING_TIME_TRIMP_PRECISION),
        api
      };

      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(() => this._track('iframe.performance.load', eventPayload), { timeout: 100 });
      } else {
        this._track('iframe.performance.load', eventPayload);
      }
    } else {
      console.error('ACJS: cannot track loading end analytics', this._addons, extension);
    }
  }

  getIframeLoadApdex(iframeLoadMilliseconds) {
    var apdexSatisfiedThresholdMilliseconds = 300;
    var iframeLoadApdex =
      iframeLoadMilliseconds <= apdexSatisfiedThresholdMilliseconds ? 1 :
        iframeLoadMilliseconds <= 4 * apdexSatisfiedThresholdMilliseconds ? 0.5 : 0;
    return iframeLoadApdex;
  }

  trackLoadingTimeout(extension) {
    var connectedStatus = window.navigator.onLine;
    if (typeof connectedStatus !== 'boolean') {
      connectedStatus = 'not-supported';
    }
    this._track('iframe.performance.timeout', {
      addonKey: extension.addon_key,
      moduleKey: extension.key,
      moduleType: extension.options ? extension.options.moduleType : undefined,
      moduleLocation: extension.options ? extension.options.moduleLocation : undefined,
      pearApp: (extension.options && extension.options.pearApp === 'true') ? 'true' : 'false',
      connectedStatus: connectedStatus.toString() // convert boolean to string
    });
    //track an end event during a timeout so we always have complete start / end data.
    this.trackLoadingEnded(extension);
  }

  trackLoadingCancel(extension) {
    this._track('iframe.performance.cancel', {
      addonKey: extension.addon_key,
      moduleKey: extension.key,
      moduleType: extension.options ? extension.options.moduleType : undefined,
      moduleLocation: extension.options ? extension.options.moduleLocation : undefined,
      pearApp: (extension.options && extension.options.pearApp === 'true') ? 'true' : 'false',
    });
  }

  trackUseOfDeprecatedMethod(methodUsed, extension) {
    this._track('jsapi.deprecated', {
      addonKey: extension.addon_key,
      moduleKey: extension.key,
      methodUsed: methodUsed
    });
  }

  trackMacroCombination(parentExtensionId, childExtension) {
    if (!getBooleanFeatureFlag('com.atlassian.connect.track-macro-combination')) {
      return;
    }

    var partsOfParentExtensionId = parentExtensionId.split('__');
    if(partsOfParentExtensionId.length !== 3) {
      // this case shouldn't happen generally, adding this just in case
      this._trackGasV3('operational', {
        source: 'page',
        action: 'rendered',
        actionSubject: 'nestedBodyMacro',
        objectType: childExtension.options.structuredContext.confluence.content.type,
        objectId: childExtension.options.structuredContext.confluence.content.id,
        attributes: {
          parentExtensionId: parentExtensionId,
          childAddonKey: childExtension['addon_key'],
          childKey: childExtension['key'],
        }
      });

      return;
    }

    var parentAddonKey = partsOfParentExtensionId[0];
    var parentKey = partsOfParentExtensionId[1];
    this._trackGasV3('operational', {
      source: 'viewPageScreen',
      action: 'rendered',
      actionSubject: 'nestedBodyMacro',
      objectType: childExtension.options.structuredContext.confluence.content.type,
      objectId: childExtension.options.structuredContext.confluence.content.id,
      attributes: {
        parentAddonKey: parentAddonKey,
        parentKey: parentKey,
        childAddonKey: childExtension['addon_key'],
        childKey: childExtension['key']
      }
    });
  };

  trackMultipleDialogOpening(dialogType, extension) {
    this._track('jsapi.dialog.multiple', {
      addonKey: extension.addon_key,
      moduleKey: extension.key,
      dialogType: dialogType
    });
  }

  trackVisible(extension) {
    this._track('iframe.is_visible', {
      addonKey: extension.addon_key,
      moduleKey: extension.key,
      moduleType: extension.options ? extension.options.moduleType : undefined,
      pearApp: (extension.options && extension.options.pearApp === 'true') ? 'true' : 'false',
    });
  }

  trackIframePerformance(metrics, extension) {
    this._trackGasV3('operational', {
      source: 'page',
      action: 'rendered',
      actionSubject: 'connectIframe',
      attributes: {
        addonKey: extension['addon_key'],
        key: extension['key'],
        PearApp: this._getPearApp(extension),
        moduleType: this._getModuleType(extension),
        iframeIsCacheable: this._isCacheable(extension),
        moduleLocation: this._getModuleLocation(extension),
        domainLookupTime: metrics.domainLookupTime,
        connectionTime: metrics.connectionTime,
        decodedBodySize: metrics.decodedBodySize,
        domContentLoadedTime: metrics.domContentLoadedTime,
        fetchTime: metrics.fetchTime
      }
    });

  }

  dispatch(name, data) {
    this._track(name, data);
  }

  trackExternal(name, data) {
    this._track(name, data);
  }

  /**
  * method called when an iframe's loading metrics gets corrupted
  * to destroy the analytics as they cannot be reliable
  * this should be called when:
  * 1. the product calls iframe creation multiple times for the same connect addon
  * 2. the iframe is moved / repainted causing a window.reload event
  * 3. user right clicks iframe and reloads it
  */
  _resetAnalyticsDueToUnreliable(extensionId) {
    if(!extensionId) {
      throw new Error('Cannot reset analytics due to no extension id');
    }
    if(this._addons[extensionId]) {
      clearTimeout(this._addons[extensionId]);
      delete this._addons[extensionId];
    } else {
      console.info('Cannot clear analytics, cache does not contain extension id');
    }
  }

  _isCacheable(extension) {
    const href = extension.url;
    return href !== undefined && href.indexOf('xdm_e=') === -1;
  }

  _getModuleType(extension) {
    return extension.options ? extension.options.moduleType : undefined;
  }

  _getModuleLocation(extension) {
    return extension.options ? extension.options.moduleLocation : undefined;
  }

  _getPearApp(extension) {
    return (extension.options && extension.options.pearApp === 'true') ? 'true' : 'false';
  }

  trackGasV3Visible (extension) {
    this._trackGasV3('operational', {
      action: 'rendered',
      actionSubject: 'moduleViewed',
      actionSubjectId: extension['addon_key'],
      attributes: {
        moduleType: this._getModuleType(extension),
        iframeIsCacheable: this._isCacheable(extension),
        moduleKey: extension.key,
        moduleLocation: this._getModuleLocation(extension),
        PearApp: this._getPearApp(extension)
      },
      source: 'page'
    });
  }

  trackGasV3LoadingEnded (extension) {
    var iframeLoadMillis = this._time() - this._addons[extension.id].startLoading;
    this._trackGasV3('operational', {
      action: 'rendered',
      actionSubject: 'ModuleLoaded',
      actionSubjectId: extension['addon_key'],
      attributes: {
        moduleType: this._getModuleType(extension),
        iframeIsCacheable: this._isCacheable(extension),
        iframeLoadMillis: iframeLoadMillis,
        moduleKey: extension.key,
        moduleLocation: this._getModuleLocation(extension),
        PearApp: this._getPearApp(extension)
      },
      source: 'page'
    });
  }

  trackGasV3LoadingTimeout (extension) {
    this._trackGasV3('operational', {
      action: 'rendered',
      actionSubject: 'ModuleTimeout',
      actionSubjectId: extension['addon_key'],
      attributes: {
        moduleType: this._getModuleType(extension),
        iframeIsCacheable: this._isCacheable(extension),
        moduleKey: extension.key,
        moduleLocation: this._getModuleLocation(extension),
        PearApp: this._getPearApp(extension)
      },
      source: 'page'
    });
  }

}

var analytics = new AnalyticsDispatcher();
if ($.fn) {
  EventDispatcher.register('iframe-create', function (data) {
    analytics.trackLoadingStarted(data.extension);
  });
}

EventDispatcher.register('iframe-bridge-start', function (data) {
  analytics.trackLoadingStarted(data.extension);
});
EventDispatcher.register('iframe-bridge-established', function (data) {
  analytics.trackLoadingEnded(data.extension);
  observe(document.getElementById(data.extension.id), () => {
    EventDispatcher.emit('iframe-visible', data.extension);
    analytics.trackVisible(data.extension);
    analytics.trackGasV3Visible(data.extension);
  });
});

EventDispatcher.register('iframe-bridge-established', function (data) {
  analytics.trackGasV3LoadingEnded(data.extension);
});

EventDispatcher.register('iframe-bridge-timeout', function (data) {
  analytics.trackLoadingTimeout(data.extension);
});
EventDispatcher.register('iframe-bridge-cancelled', function (data) {
  analytics.trackLoadingCancel(data.extension);
});
EventDispatcher.register('analytics-deprecated-method-used', function (data) {
  analytics.trackUseOfDeprecatedMethod(data.methodUsed, data.extension);
});
EventDispatcher.register('analytics-macro-combination', function (data) {
  analytics.trackMacroCombination(data.parentExtensionId, data.childExtension);
});
EventDispatcher.register('analytics-iframe-performance', function (data) {
  analytics.trackIframePerformance(data.metrics, data.extension);
});

EventDispatcher.register('iframe-destroyed', function (data) {
  analytics._resetAnalyticsDueToUnreliable(data.extension.extension_id);
});

EventDispatcher.register('analytics-external-event-track', function (data) {
  analytics.trackExternal(data.eventName, data.values);
});

EventDispatcher.register('iframe-bridge-timeout', function (data) {
  analytics.trackGasV3LoadingTimeout(data.extension);
});


export default analytics;
