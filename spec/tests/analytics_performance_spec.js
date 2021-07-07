import AP from 'simple-xdm/combined';
import analytics from 'src/plugin/analytics';

describe('Plugin Performance Analytics', () => {
  beforeEach(() => {
    AP._analytics = {
      trackIframePerformanceMetrics: jasmine.createSpy('testFunction')
    };
  });

  afterEach(() => {
    window.AP = null;
  });

  it('sends metrics', () => {
    analytics.sendMetrics();
    expect(AP._analytics.trackIframePerformanceMetrics).toHaveBeenCalled();
    const firstCallArg = AP._analytics.trackIframePerformanceMetrics.calls.first().args[0];
    // We skip these assertions for the p2 plugin integration test version of chrome used in webdriver tests because the API does not exist in that version.
    // We also skip these in Safari because Safari does not support this API.
    if(navigator.appVersion.indexOf('Chrome/48.') === -1 && navigator.appVersion.indexOf('Safari') === -1) {
      expect(firstCallArg.connectionTime).toEqual(jasmine.any(Number));
      expect(firstCallArg.decodedBodySize).toEqual(jasmine.any(Number));
      expect(firstCallArg.domContentLoadedTime).toEqual(jasmine.any(Number));
      expect(firstCallArg.domainLookupTime).toEqual(jasmine.any(Number));
      expect(firstCallArg.fetchTime).toEqual(jasmine.any(Number));
    }
  });
});
