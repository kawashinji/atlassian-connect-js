import AnalyticsDispatcher from 'src/host/dispatchers/analytics_dispatcher';
import IframeActions from 'src/host/actions/iframe_actions';
import LoadingIndicatorActions from 'src/host/actions/loading_indicator_actions';

const extension = {
  id: 'xxxewjkd',
  addon_key: 'some-addon-key',
  key: 'some-module-key'
};



describe('Analytics Dispatcher', () => {
  beforeEach(() => {
    window.requestIdleCallback = (callback) => setTimeout(callback);
  });

  it('trackLoadingStarted stores the time', () => {
    expect(AnalyticsDispatcher._addons).toEqual({});
    AnalyticsDispatcher.trackLoadingStarted(extension);
    expect(AnalyticsDispatcher._addons[extension.id].startLoading).toEqual(jasmine.any(Number));
  });
  it('trackLoadingEnded triggers iframe.performance.load', (done) => {
    spyOn(AnalyticsDispatcher, '_track');
    AnalyticsDispatcher.trackLoadingEnded(extension);

    setTimeout(() => {
      expect(AnalyticsDispatcher._track).toHaveBeenCalled();
      expect(AnalyticsDispatcher._track).toHaveBeenCalledWith('iframe.performance.load', {
        addonKey: extension.addon_key,
        moduleKey: extension.key,
        moduleLocation: undefined,
        moduleType: undefined,
        pearApp: 'false',
        iframeLoadMillis: jasmine.any(Number),
        iframeLoadApdex: jasmine.any(Number),
        iframeIsCacheable: jasmine.any(Boolean),
        value: jasmine.any(Number),
        api: jasmine.any(String)
      });
      done();
    })
  });

  it('trackLoadingCancel triggers iframe.performance.cancel', () => {
    spyOn(AnalyticsDispatcher, '_track');
    AnalyticsDispatcher.trackLoadingCancel(extension);
    expect(AnalyticsDispatcher._track).toHaveBeenCalled();
    expect(AnalyticsDispatcher._track).toHaveBeenCalledWith('iframe.performance.cancel', {
      addonKey: extension.addon_key,
      moduleKey: extension.key,
      moduleLocation: undefined,
      moduleType: undefined,
      pearApp: 'false'
    });
  });

  it('trackLoadingEnded triggers iframe.performance.load with pearApp info', (done) => {
    spyOn(AnalyticsDispatcher, '_track');
    AnalyticsDispatcher.trackLoadingEnded({...extension, options: { pearApp: 'true' }});

    setTimeout(() => {
      expect(AnalyticsDispatcher._track).toHaveBeenCalled();
      expect(AnalyticsDispatcher._track).toHaveBeenCalledWith('iframe.performance.load', {
        addonKey: extension.addon_key,
        moduleKey: extension.key,
        moduleLocation: undefined,
        moduleType: undefined,
        pearApp: 'true',
        iframeLoadMillis: jasmine.any(Number),
        iframeLoadApdex: jasmine.any(Number),
        iframeIsCacheable: jasmine.any(Boolean),
        value: jasmine.any(Number),
        api: jasmine.any(String)
      });
      done();
    })
  });

  it('trackLoadingTimeout triggers iframe.performance.timeout with pearApp info', () => {
    spyOn(AnalyticsDispatcher, '_track');
    AnalyticsDispatcher.trackLoadingTimeout({...extension, options: { pearApp: 'true' }});
    expect(AnalyticsDispatcher._track).toHaveBeenCalled();
    expect(AnalyticsDispatcher._track).toHaveBeenCalledWith('iframe.performance.timeout', {
      addonKey: extension.addon_key,
      moduleKey: extension.key,
      moduleLocation: undefined,
      moduleType: undefined,
      pearApp: 'true',
      connectedStatus: 'true'
    });
  });

  it('trackLoadingTimeout triggers iframe.performance.timeout', () => {
    spyOn(AnalyticsDispatcher, '_track');
    AnalyticsDispatcher.trackLoadingTimeout(extension);
    expect(AnalyticsDispatcher._track).toHaveBeenCalled();
    expect(AnalyticsDispatcher._track).toHaveBeenCalledWith('iframe.performance.timeout', {
      addonKey: extension.addon_key,
      moduleKey: extension.key,
      moduleLocation: undefined,
      moduleType: undefined,
      pearApp: 'false',
      connectedStatus: 'true'
    });
  });

  it('trackLoadingCancel triggers iframe.performance.cancel with pearApp info', () => {
    spyOn(AnalyticsDispatcher, '_track');
    AnalyticsDispatcher.trackLoadingCancel({...extension, options: { pearApp: 'true' }});
    expect(AnalyticsDispatcher._track).toHaveBeenCalled();
    expect(AnalyticsDispatcher._track).toHaveBeenCalledWith('iframe.performance.cancel', {
      addonKey: extension.addon_key,
      moduleKey: extension.key,
      moduleLocation: undefined,
      moduleType: undefined,
      pearApp: 'true'
    });
  });

  it('trackIsVisible triggers iframe.performance.is_visible with pearApp info', () => {
    spyOn(AnalyticsDispatcher, '_track');
    AnalyticsDispatcher.trackVisible({...extension, options: { pearApp: 'true' }});
    expect(AnalyticsDispatcher._track).toHaveBeenCalled();
    expect(AnalyticsDispatcher._track).toHaveBeenCalledWith('iframe.is_visible', {
      addonKey: extension.addon_key,
      moduleKey: extension.key,
      moduleType: undefined,
      pearApp: 'true'
    });
  });

  it('trackUseOfDeprecatedMethod triggers jsapi.deprecated', () => {
    spyOn(AnalyticsDispatcher, '_track');
    var methodUsed = 'someDeprecatedMethodName';
    AnalyticsDispatcher.trackUseOfDeprecatedMethod(methodUsed, extension);
    expect(AnalyticsDispatcher._track).toHaveBeenCalled();
    expect(AnalyticsDispatcher._track).toHaveBeenCalledWith('jsapi.deprecated', {
      addonKey: extension.addon_key,
      moduleKey: extension.key,
      methodUsed: methodUsed
    });
  });

  it('dispatch runs _track', () => {
    spyOn(AnalyticsDispatcher, '_track');
    var eventName = 'event.name';
    var eventValue = {
      addonKey: extension.addon_key,
      moduleKey: extension.key,
      value: 'something'
    };
    AnalyticsDispatcher.dispatch(eventName, eventValue);
    expect(AnalyticsDispatcher._track).toHaveBeenCalledWith(eventName, eventValue);

  });

  it('trackExternal triggers _track', () => {
    spyOn(AnalyticsDispatcher, '_track');
    var analyticsValue = { some: 'value' };
    var analyticsName = 'aname';
    AnalyticsDispatcher.trackExternal(analyticsName, analyticsValue);
    expect(AnalyticsDispatcher._track).toHaveBeenCalled();
    expect(AnalyticsDispatcher._track).toHaveBeenCalledWith(analyticsName, analyticsValue);
  });

  it('removes the timeout when the entry is removed from addon store', () => {
    AnalyticsDispatcher.trackLoadingStarted(extension);
    expect(AnalyticsDispatcher._addons[extension.id]).toBeDefined();
    let TimeoutId = AnalyticsDispatcher._addons[extension.id];
    spyOn(window, 'clearTimeout');

    AnalyticsDispatcher._resetAnalyticsDueToUnreliable(extension.id);
    expect(AnalyticsDispatcher._addons[extension.id]).toBeUndefined();
    expect(window.clearTimeout).toHaveBeenCalledWith(TimeoutId);
  });

  it('trackIframePerformanceMetrics triggers _analytics.trackIframePerformanceMetrics', () => {
    spyOn(AnalyticsDispatcher, '_trackGasV3');
    var metrics = {
      domainLookupTime: 111,
      connectionTime: 2222,
      decodedBodySize: 333,
      domContentLoadedTime: 444,
      fetchTime: 555
    };
    AnalyticsDispatcher.trackIframePerformance(metrics, Object.assign({}, extension, {options: {
      pearApp: 'true',
      moduleLocation: 'some-module-location',
      moduleType: 'some-module-type'
    }}));
    expect(AnalyticsDispatcher._trackGasV3).toHaveBeenCalled();
    expect(AnalyticsDispatcher._trackGasV3).toHaveBeenCalledWith('operational', {
      source: 'page',
      action: 'rendered',
      actionSubject: 'connectIframe',
      attributes: {
        addonKey: extension['addon_key'],
        key: extension['key'],
        PearApp: 'true',
        domainLookupTime: metrics.domainLookupTime,
        connectionTime: metrics.connectionTime,
        decodedBodySize: metrics.decodedBodySize,
        domContentLoadedTime: metrics.domContentLoadedTime,
        fetchTime: metrics.fetchTime,
        moduleLocation: 'some-module-location',
        moduleType: 'some-module-type',
        iframeIsCacheable: false
      }
    });
  });

  it('on iframe viewed trigger a gasv3 analytics call', () => {
    spyOn(AnalyticsDispatcher, '_trackGasV3');
    const extension = {
      addon_key: 'some-addon-key',
      key: 'some-module-key',
      options: {
        moduleType: 'some-module-type',
        pearApp: 'true',
        moduleLocation: 'some-module-location'
      },
      id: 'some-addon-key__some-module-key_1y28nd',
      startLoading: Date.now()
    };
    AnalyticsDispatcher.trackGasV3Visible(extension);

    expect(AnalyticsDispatcher._trackGasV3).toHaveBeenCalledWith('operational', {
      source: 'page',
      action: 'rendered',
      actionSubject: 'moduleViewed',
      actionSubjectId: 'some-addon-key',
      attributes: {
        iframeIsCacheable: false,
        moduleType: 'some-module-type',
        moduleKey: 'some-module-key',
        moduleLocation: 'some-module-location',
        PearApp: 'true'
      }
    });
  });

  it('on iframe-bridge-established trigger a gasv3 analytics call', () => {
    spyOn(AnalyticsDispatcher, '_trackGasV3');
    const extension = {
      addon_key: 'some-addon-key',
      key: 'some-module-key',
      options: {
        moduleType: 'some-module-type',
        pearApp: 'true',
        moduleLocation: 'some-module-location'
      },
      id: 'some-addon-key__some-module-key_1y28nd',
      startLoading: Date.now()
    };
    AnalyticsDispatcher._addons[extension.id] = extension;

    IframeActions.notifyBridgeEstablished(document.createElement('div'), extension);

    expect(AnalyticsDispatcher._trackGasV3).toHaveBeenCalledWith('operational', {
      source: 'page',
      action: 'rendered',
      actionSubject: 'ModuleLoaded',
      actionSubjectId: 'some-addon-key',
      attributes: {
        iframeIsCacheable: false,
        iframeLoadMillis: jasmine.any(Number),
        moduleType: 'some-module-type',
        moduleKey: 'some-module-key',
        moduleLocation: 'some-module-location',
        PearApp: 'true'
      }
    });
  });

  it('on iframe-bridge-timeout trigger a gasv3 analytics call', () => {
    spyOn(AnalyticsDispatcher, '_trackGasV3');
    const extension = {
      addon_key: 'some-addon-key',
      key: 'some-module-key',
      options: {
        moduleType: 'some-module-type',
        pearApp: 'true',
        moduleLocation: 'some-module-location'
      },
      id: 'some-addon-key__some-module-key_1d28nd'
    };

    LoadingIndicatorActions.timeout(document.createElement('div'), extension);

    expect(AnalyticsDispatcher._trackGasV3).toHaveBeenCalledWith('operational', {
      source: 'page',
      action: 'rendered',
      actionSubject: 'ModuleTimeout',
      actionSubjectId: 'some-addon-key',
      attributes: {
        iframeIsCacheable: false,
        moduleType: 'some-module-type',
        moduleKey: 'some-module-key',
        moduleLocation: 'some-module-location',
        PearApp: 'true'
      }
    });
  });

});
