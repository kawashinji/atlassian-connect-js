import AnalyticsDispatcher from 'src/host/dispatchers/analytics_dispatcher';

const extension = {
  id: 'xxxewjkd',
  addon_key: 'some-addon-key',
  key: 'some-module-key',
  version: "%%GULP_INJECT_VERSION%%"
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
      value: jasmine.any(Number),
      version: extension.version
    });
  });

  it('trackLoadingTimeout triggers iframe.performance.timeout', () => {
    spyOn(AnalyticsDispatcher, '_track');
    AnalyticsDispatcher.trackLoadingTimeout(extension);
    expect(AnalyticsDispatcher._track).toHaveBeenCalled();
    expect(AnalyticsDispatcher._track).toHaveBeenCalledWith('iframe.performance.timeout', {
      addonKey: extension.addon_key,
      moduleKey: extension.key,
      version: extension.version
    });
  });
  it('trackLoadingCancel triggers iframe.performance.cancel', () => {
    spyOn(AnalyticsDispatcher, '_track');
    AnalyticsDispatcher.trackLoadingCancel(extension);
    expect(AnalyticsDispatcher._track).toHaveBeenCalled();
    expect(AnalyticsDispatcher._track).toHaveBeenCalledWith('iframe.performance.cancel', {
      addonKey: extension.addon_key,
      moduleKey: extension.key,
      version: extension.version
    });
  });

  it('dispatch runs _track', () => {
    spyOn(AnalyticsDispatcher, '_track');
    var eventName = 'event.name';
    var eventValue = {
      addonKey: extension.addon_key,
      moduleKey: extension.key,
      value: 'something',
      version: extension.version
    };
    AnalyticsDispatcher.dispatch(eventName, eventValue);
    expect(AnalyticsDispatcher._track).toHaveBeenCalledWith(eventName, eventValue);

  });

});
