import AP from 'simple-xdm/combined';

function getMetrics() {
  if (window.performance && window.performance.getEntries) {
    let navigationEntries = window.performance.getEntriesByType('navigation');
    if (navigationEntries && navigationEntries[0]) {
      let timingInfo = navigationEntries[0];
      // dns loookup time
      let domainLookupTime = timingInfo.domainLookupEnd - timingInfo.domainLookupStart;
      let connectStart = timingInfo.connectStart;
      // if it's a tls connection, use the secure connection start instead
      if (timingInfo.secureConnectionStart > 0) {
        connectStart = timingInfo.secureConnectionStart;
      }
      // connection negotiation time
      let connectionTime = timingInfo.connectEnd - connectStart;
      // page body size
      let decodedBodySize = timingInfo.decodedBodySize;
      // time to load dom
      let domContentLoadedTime = timingInfo.domContentLoadedEventEnd - timingInfo.domContentLoadedEventStart;
      // time to download the page
      let fetchTime = timingInfo.responseEnd - timingInfo.fetchStart;

      return {
        domainLookupTime,
        connectionTime,
        decodedBodySize,
        domContentLoadedTime,
        fetchTime
      }
    }
  }
}

function sendMetrics() {
  let metrics = getMetrics();
  if (AP._analytics && AP._analytics.trackIframePerformanceMetrics) {
    AP._analytics.trackIframePerformanceMetrics(metrics);
  }
}

export default {
  sendMetrics
}