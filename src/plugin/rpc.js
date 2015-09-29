import $ from './dollar';
import XdmRpc from '../common/xdm-rpc';

var each = $.each;
var extend = $.extend;
var isFn = $.isFunction;
var proxy = {};
var rpc;
var apis = {};
var stubs = ['init'];
var internals = {};
var inits = [];
var isInited;

export default {

  extend: function (config) {
    if (isFn(config)) config = config(proxy);
    extend(apis, config.apis);
    extend(internals, config.internals);
    stubs = stubs.concat(config.stubs || []);
    var init = config.init;
    if (isFn(init)) inits.push(init);
    return config.apis;
  },

  // inits the connect add-on on iframe content load
  init: function (options) {
    options = options || {};
    if (!isInited) {
      // add stubs for each public api
      each(apis, function (method) { stubs.push(method); });
      // empty config for add-on-side ctor
      rpc = this.rpc = new XdmRpc($, {}, {remote: stubs, local: internals});
      rpc.init();
      extend(proxy, rpc);
      each(inits, function (_, init) {
        try { init(extend({}, options)); }
        catch (ex) { $.handleError(ex); }
      });
      isInited = true;
    }
  }

};