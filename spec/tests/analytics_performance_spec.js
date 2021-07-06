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
    expect(firstCallArg.connectionTime).toEqual(jasmine.any(Number));
    expect(firstCallArg.decodedBodySize).toEqual(jasmine.any(Number));
    expect(firstCallArg.domContentLoadedTime).toEqual(jasmine.any(Number));
    expect(firstCallArg.domainLookupTime).toEqual(jasmine.any(Number));
    expect(firstCallArg.fetchTime).toEqual(jasmine.any(Number));
  });
});
