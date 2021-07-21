import EventDispatcher from '../dispatchers/event_dispatcher';

export default {
  trackDeprecatedMethodUsed(methodUsed, extension) {
    EventDispatcher.dispatch('analytics-deprecated-method-used', {methodUsed, extension});
  },
  trackMacroCombination: function trackMacroCombination(parentExtensionId, childExtension) {
    EventDispatcher.dispatch('analytics-macro-combination', {
      parentExtensionId: parentExtensionId,
      childExtension: childExtension
    });
  },
  trackIframeBridgeStart(extension) {
    EventDispatcher.dispatch('iframe-bridge-start', {extension});
  },
  trackExternalEvent(name, values){
    EventDispatcher.dispatch('analytics-external-event-track', {
      eventName: name,
      values: values
    });
  },
  trackIframePerformanceMetrics(metrics, extension) {
    if(metrics && Object.getOwnPropertyNames(metrics).length > 0) {
      EventDispatcher.dispatch('analytics-iframe-performance', {metrics, extension});
    }
  },
};