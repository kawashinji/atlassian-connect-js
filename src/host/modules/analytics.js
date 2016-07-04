import AnalyticsAction from 'actions/analytics_action';

export default {
  trackDeprecatedMethodUsed: (methodUsed, callback) => {
    AnalyticsAction.trackDeprecatedMethodUsed(methodUsed, callback._context.extension);
  }
}
