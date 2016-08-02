import AnalyticsAction from '../actions/analytics_action';
import _ from '../underscore';

export default {
  trackDeprecatedMethodUsed: function (methodUsed, callback) {
    callback = _.last(arguments);
    AnalyticsAction.trackDeprecatedMethodUsed(methodUsed, callback._context.extension);
  }
}
