'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = require('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _commonXdmRpc = require('../common/xdm-rpc');

var _commonXdmRpc2 = _interopRequireDefault(_commonXdmRpc);

var each = _dollar2['default'].each,
    _extend = _dollar2['default'].extend,
    isFn = _dollar2['default'].isFunction,
    proxy = {},
    rpc,
    apis = {},
    stubs = ['init'],
    internals = {},
    inits = [],
    isInited;

exports['default'] = {

  extend: function extend(config) {
    if (isFn(config)) config = config(proxy);
    _extend(apis, config.apis);
    _extend(internals, config.internals);
    stubs = stubs.concat(config.stubs || []);
    var init = config.init;
    if (isFn(init)) inits.push(init);
    return config.apis;
  },

  // inits the connect add-on on iframe content load
  init: function init(options) {
    options = options || {};
    if (!isInited) {
      // add stubs for each public api
      each(apis, function (method) {
        stubs.push(method);
      });
      // empty config for add-on-side ctor
      rpc = this.rpc = new _commonXdmRpc2['default'](_dollar2['default'], {}, { remote: stubs, local: internals });
      rpc.init();
      _extend(proxy, rpc);
      each(inits, function (_, init) {
        try {
          init(_extend({}, options));
        } catch (ex) {
          _dollar2['default'].handleError(ex);
        }
      });
      isInited = true;
    }
  }

};
module.exports = exports['default'];