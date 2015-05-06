'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = require('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _commonXdmRpc = require('../common/xdm-rpc');

var _commonXdmRpc2 = _interopRequireDefault(_commonXdmRpc);

var _jwtKeepAlive = require('./jwt-keep-alive');

var _jwtKeepAlive2 = _interopRequireDefault(_jwtKeepAlive);

var _commonUri = require('../common/uri');

var _commonUri2 = _interopRequireDefault(_commonUri);

var each = _dollar2['default'].each;
var _extend = _dollar2['default'].extend;
var isFn = _dollar2['default'].isFunction;
var rpcCollection = [];
var apis = {};
var stubs = [];
var internals = {};
var inits = [];

exports['default'] = {
    extend: function extend(config) {
        if (isFn(config)) {
            config = config();
        }

        _extend(apis, config.apis);
        _extend(internals, config.internals);
        stubs = stubs.concat(config.stubs || []);

        var init = config.init;

        if (isFn(init)) {
            inits.push(init);
        }

        return config.apis;
    },

    // init connect host side
    // options = things that go to all init functions
    init: function init(options, xdmConfig) {
        var remoteUrl = new Uri.init(xdmConfig.remote);
        var remoteJwt = remoteUrl.getQueryParamValue('jwt');
        var promise;

        options = options || {};
        // add stubs for each public api
        each(apis, function (method) {
            stubs.push(method);
        });

        // refresh JWT tokens as required.
        if (remoteJwt && _jwtKeepAlive2['default'].isExpired(remoteJwt)) {
            promise = _jwtKeepAlive2['default'].updateUrl({
                addonKey: xdmConfig.remoteKey,
                moduleKey: options.ns,
                productContext: options.productContext || {},
                uiParams: xdmConfig.uiParams,
                width: xdmConfig.props.width,
                height: xdmConfig.props.height
            });
        }

        _dollar2['default'].when(promise).always(function (src) {
            // if the promise resolves to a new url. update it.
            if (src) {
                xdmConfig.remote = src;
            }
            // TODO: stop copying internals and fix references instead (fix for events going across add-ons when they shouldn't)
            var rpc = new _commonXdmRpc2['default'](_dollar2['default'], xdmConfig, { remote: stubs, local: _dollar2['default'].extend({}, internals) });

            rpcCollection[rpc.id] = rpc;
            each(inits, function (_, init) {
                try {
                    init(_extend({}, options), rpc);
                } catch (ex) {
                    console.log(ex);
                }
            });
        });
    }
};
module.exports = exports['default'];