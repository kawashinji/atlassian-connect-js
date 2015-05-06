'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = require('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _commonJwt = require('../common/jwt');

var _commonJwt2 = _interopRequireDefault(_commonJwt);

function updateUrl(config) {
    var promise = _dollar2['default'].Deferred(function (defer) {
        var contentPromise = window._AP.contentResolver.resolveByParameters({
            addonKey: config.addonKey,
            moduleKey: config.moduleKey,
            productContext: config.productContext,
            uiParams: config.uiParams,
            width: config.width,
            height: config.height,
            classifier: 'json'
        });

        contentPromise.done(function (data) {
            var values = JSON.parse(data);
            defer.resolve(values.src);
        });
    });

    return promise;
}

exports['default'] = {
    updateUrl: updateUrl,
    isExpired: _commonJwt2['default'].isJwtExpired
};
module.exports = exports['default'];