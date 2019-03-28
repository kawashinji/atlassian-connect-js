import AnalyticsDispatcher from 'src/host/dispatchers/analytics_dispatcher';

const extension = {
  id: 'xxxewjkd',
  addon_key: 'some-addon-key',
  key: 'some-module-key'
};



describe('Analytics Dispatcher', () => {

  it('trackLoadingStarted stores the time', () => {
    expect(AnalyticsDispatcher._addons).toEqual({});
    AnalyticsDispatcher.trackLoadingStarted(extension);
    expect(AnalyticsDispatcher._addons[extension.id].startLoading).toEqual(jasmine.any(Number));
  });
  it('trackLoadingEnded triggers iframe.performance.load', () => {
    spyOn(AnalyticsDispatcher, '_track');
    AnalyticsDispatcher.trackLoadingEnded(extension);
    expect(AnalyticsDispatcher._track).toHaveBeenCalled();
    expect(AnalyticsDispatcher._track).toHaveBeenCalledWith('iframe.performance.load', {
      addonKey: extension.addon_key,
      moduleKey: extension.key,
      moduleLocation: undefined,
      moduleType: undefined,
      iframeLoadMillis: jasmine.any(Number),
      iframeLoadApdex: jasmine.any(Number),
      iframeIsCacheable: jasmine.any(Boolean),
      value: jasmine.any(Number)
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
      connectedStatus: 'true'
    });
  });

  it('trackLoadingCancel triggers iframe.performance.cancel', () => {
    spyOn(AnalyticsDispatcher, '_track');
    AnalyticsDispatcher.trackLoadingCancel(extension);
    expect(AnalyticsDispatcher._track).toHaveBeenCalled();
    expect(AnalyticsDispatcher._track).toHaveBeenCalledWith('iframe.performance.cancel', {
      addonKey: extension.addon_key,
      moduleKey: extension.key,
      moduleLocation: undefined,
      moduleType: undefined
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
    var analyticsValue = {some: 'value'};
    var analyticsName = 'aname';
    AnalyticsDispatcher.trackExternal(analyticsName, analyticsValue);
    expect(AnalyticsDispatcher._track).toHaveBeenCalled();
    expect(AnalyticsDispatcher._track).toHaveBeenCalledWith(analyticsName, analyticsValue);
  });

});
