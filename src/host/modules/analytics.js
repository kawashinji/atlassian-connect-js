import AnalyticsAction from '../actions/analytics_action';
import util from '../util';

export default {
  trackDeprecatedMethodUsed: function (methodUsed, callback) {
    callback = util.last(arguments);
    AnalyticsAction.trackDeprecatedMethodUsed(methodUsed, callback._context.extension);
  },
  trackMacroCombination: function trackMacroCombination(parentExtensionId, childExtension) {
    if(parentExtensionId && childExtension) {
      AnalyticsAction.trackMacroCombination(parentExtensionId, childExtension);
    }
  },
  trackIframePerformanceMetrics: function trackIframePerformanceMetrics(metrics, callback) {
    callback = util.last(arguments);
    AnalyticsAction.trackIframePerformanceMetrics(metrics, callback._context.extension);
  }

}
