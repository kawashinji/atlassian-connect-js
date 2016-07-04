import AnalyticsAction from 'actions/analytics_action';

export default {
  trackDeprecatedMethodUsed: (data, callback) => {
    AnalyticsAction.trackDeprecatedMethodUsed(data, callback._context.extension);
  }
}
