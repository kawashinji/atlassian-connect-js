import $ from './dollar';
import rpc from './rpc';
import statusHelper from './status-helper';

export default function () {
  return {
    init(state, xdm) {
      var $home = $(xdm.iframe).closest('.ap-container');
      statusHelper.showLoadingStatus($home, 0);

      $home.find('.ap-load-timeout a.ap-btn-cancel').click(function () {
        statusHelper.showLoadErrorStatus($home);
        if (xdm.analytics && xdm.analytics.iframePerformance) {
          xdm.analytics.iframePerformance.cancel();
        }
      });

      xdm.timeout = setTimeout(function () {
        xdm.timeout = null;
        statusHelper.showloadTimeoutStatus($home);
        // if inactive, the iframe has been destroyed by the product.
        if (xdm.isActive() && xdm.analytics && xdm.analytics.iframePerformance) {
          xdm.analytics.iframePerformance.timeout();
        }
      }, 20000);
    },

    internals: {
      init() {
        if (this.analytics && this.analytics.iframePerformance) {
          this.analytics.iframePerformance.end();
        }
        var $home = $(this.iframe).closest('.ap-container');
        statusHelper.showLoadedStatus($home);

        clearTimeout(this.timeout);
        // Let the integration tests know the iframe has loaded.
        $home.find('.ap-content').addClass('iframe-init');
      }
    }
  };
}