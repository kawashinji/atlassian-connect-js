import util from './util';
import $ from './dollar';
import _events from '../common/events';
import base64 from '../common/base64';
import uri from '../common/uri';
import uiParams from '../common/ui-params';
import xdm from '../common/xdm-rpc';
import rpc from './rpc';
import events from './events';
import env from './env';

import messages from './messages';
import dialog from './dialog';
import inlineDialog from './inline-dialog';
import resize_listener from './resize_listener';
// pre-populate all the old core modules for the old AP.require syntax.

var modules = {
  '_util': {exports: util},
  '_dollar': {exports: $},
  '_events': {exports: _events},
  '_base64': {exports: base64},
  '_uri': {exports: uri},
  '_ui-params': {exports: uiParams},
  '_xdm': {exports: xdm},
  '_rpc': {exports: rpc},
  'events': {exports: events},
  'env': {exports: env},
  'messages': {exports: messages},
  'dialog': {exports: dialog},
  'inline-dialog': {exports: inlineDialog},
  '_resize_listener': {exports: resize_listener}
};

function reqAll(deps, callback) {
  var mods = [];
  var i = 0;
  var len = deps.length;
  function addOne(mod) {
    mods.push(mod);
    if (mods.length === len) {
      var exports = [];
      var i = 0;
      for (; i < len; i += 1) {
        exports[i] = mods[i].exports;
      }
      if (callback) {
        callback.apply(window, exports);
      }
    }
  }
  if (deps && deps.length > 0) {
    for (; i < len; i += 1) {
      reqOne(deps[i], addOne);
    }
  } else {
    if (callback) {
      callback();
    }
  }
}

function reqOne(name, callback) {
  // naive impl that assumes all modules are already loaded
  callback(getOrCreate(name));
}

function getOrCreate(name) {
  return modules[name] = modules[name] || {
    name: name,
    exports: function () {
      function exports() {
        var target = exports.__target__;
        if (target) {
          return target.apply(window, arguments);
        }
      }
      return exports;
    }()
  };
}

// define(name, objOrFn)
// define(name, deps, fn(dep1, dep2, ...))
export default {
  define: function (name, deps, exports) {
    var mod = getOrCreate(name);
    var factory;
    if (!exports) {
      exports = deps;
      deps = [];
    }
    if (exports) {
      factory = typeof exports !== 'function' ? function () {
        return exports;
      } : exports;
      reqAll(deps, function () {
        var exports = factory.apply(window, arguments);
        if (exports) {
          if (typeof exports === 'function') {
            mod.exports.__target__ = exports;
          }
          for (var k in exports) {
            if (exports.hasOwnProperty(k)) {
              mod.exports[k] = exports[k];
            }
          }
        }
      });
    }
  },
  require: function (deps, callback) {

    reqAll(typeof deps === 'string' ? [deps] : deps, callback);
  }
};
