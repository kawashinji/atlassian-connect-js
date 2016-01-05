import $ from './dollar';
import XdmRpc from '../common/xdm-rpc';
import jwtKeepAlive from './jwt-keep-alive';
import uri from '../common/uri';

var each = $.each;
var extend = $.extend;
var isFn = $.isFunction;
var rpcCollection = [];
var apis = {};
var stubs = [];
var internals = {};
var inits = [];

export default {
  extend(config) {
    if (isFn(config)) {
      config = config();
    }

    extend(apis, config.apis);
    extend(internals, config.internals);
    stubs = stubs.concat(config.stubs || []);

    var init = config.init;

    if (isFn(init)) {
      inits.push(init);
    }

    return config.apis;
  },

  // init connect host side
  // options = things that go to all init functions
  init(options, xdmConfig) {
    var remoteUrl = new uri.init(xdmConfig.remote);
    var remoteJwt = remoteUrl.getQueryParamValue('jwt');
    var promise;

    options = options || {};
    // add stubs for each public api
    each(apis, function (method) {
      stubs.push(method);
    });

    // refresh JWT tokens as required.
    if (remoteJwt && jwtKeepAlive.isExpired(remoteJwt)) {
      promise = jwtKeepAlive.updateUrl({
        addonKey: xdmConfig.remoteKey,
        moduleKey: options.ns,
        productContext: options.productContext || {},
        uiParams: xdmConfig.uiParams,
        width: xdmConfig.props.width,
        height: xdmConfig.props.height
      });
    }

    $.when(promise).always(function (src) {
      // if the promise resolves to a new url. update it.
      if (src) {
        xdmConfig.remote = src;
      }
      xdmConfig.moduleKey = options.ns;
      // TODO: stop copying internals and fix references instead (fix for events going across add-ons when they shouldn't)
      var rpc = new XdmRpc($, xdmConfig, {remote: stubs, local: $.extend({}, internals)});

      rpcCollection[rpc.id] = rpc;
      each(inits, function (_, init) {
        try {
          init(extend({}, options), rpc);
        } catch (ex) {
          console.log(ex);
        }
      });
    });
  }
}