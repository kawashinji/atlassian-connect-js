'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = require('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _rpc = require('./rpc');

var _rpc2 = _interopRequireDefault(_rpc);

var _statusHelper = require('./status-helper');

var _statusHelper2 = _interopRequireDefault(_statusHelper);

exports['default'] = function () {
    return {
        init: function init(state, xdm) {
            var $home = _dollar2['default'](xdm.iframe).closest('.ap-container');
            _statusHelper2['default'].showLoadingStatus($home, 0);

            $home.find('.ap-load-timeout a.ap-btn-cancel').click(function () {
                _statusHelper2['default'].showLoadErrorStatus($home);
                if (xdm.analytics && xdm.analytics.iframePerformance) {
                    xdm.analytics.iframePerformance.cancel();
                }
            });

            xdm.timeout = setTimeout(function () {
                xdm.timeout = null;
                _statusHelper2['default'].showloadTimeoutStatus($home);
                // if inactive, the iframe has been destroyed by the product.
                if (xdm.isActive() && xdm.analytics && xdm.analytics.iframePerformance) {
                    xdm.analytics.iframePerformance.timeout();
                }
            }, 20000);
        },

        internals: {
            init: function init() {
                if (this.analytics && this.analytics.iframePerformance) {
                    this.analytics.iframePerformance.end();
                }
                var $home = _dollar2['default'](this.iframe).closest('.ap-container');
                _statusHelper2['default'].showLoadedStatus($home);

                clearTimeout(this.timeout);
                // Let the integration tests know the iframe has loaded.
                $home.find('.ap-content').addClass('iframe-init');
            }
        }
    };
};

module.exports = exports['default'];