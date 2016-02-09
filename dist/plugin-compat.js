(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.APCompat = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _dollar = _dereq_('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var ConsumerOptions = (function () {
  function ConsumerOptions() {
    _classCallCheck(this, ConsumerOptions);
  }

  _createClass(ConsumerOptions, [{
    key: "_getConsumerOptions",
    value: function _getConsumerOptions() {
      var options = {},
          $script = (0, _dollar2["default"])("script[src*='/atlassian-connect/all']");

      if (!($script && /\/atlassian-connect\/all(-debug)?\.js($|\?)/.test($script.attr("src")))) {
        $script = (0, _dollar2["default"])("#ac-iframe-options");
      }

      if ($script && $script.length > 0) {
        // get its data-options attribute, if any
        var optStr = $script.attr("data-options");
        if (optStr) {
          // if found, parse the value into kv pairs following the format of a style element
          optStr.split(";").forEach(function (nvpair) {
            nvpair = nvpair.trim();
            if (nvpair) {
              var nv = nvpair.split(":"),
                  k = nv[0].trim(),
                  v = nv[1].trim();
              if (k && v != null) {
                options[k] = v === "true" || v === "false" ? v === "true" : v;
              }
            }
          });
        }
      }

      return options;
    }
  }, {
    key: "_flush",
    value: function _flush() {
      delete this._options;
    }
  }, {
    key: "get",
    value: function get(key) {
      if (!this._options) {
        this._options = this._getConsumerOptions();
      }
      if (key) {
        return this._options[key];
      }
      return this._options;
    }
  }]);

  return ConsumerOptions;
})();

module.exports = new ConsumerOptions();

},{"./dollar":2}],2:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _util = _dereq_('./util');

var _util2 = _interopRequireDefault(_util);

var _each = _util2['default'].each,
    document = window.document;

function $(sel, context) {

  context = context || document;

  var els = [];
  if (sel) {
    if (typeof sel === 'string') {
      var results = context.querySelectorAll(sel),
          arr_results = Array.prototype.slice.call(results);
      Array.prototype.push.apply(els, arr_results);
    } else if (sel.nodeType === 1) {
      els.push(sel);
    } else if (sel === window) {
      els.push(sel);
    } else if (typeof sel === 'function') {
      onDomLoad(sel);
    }
  }

  _util2['default'].extend(els, {
    each: function each(it) {
      _each(this, it);
      return this;
    },
    bind: function bind(name, callback) {
      this.each(function (i, el) {
        this.bind(el, name, callback);
      });
    },
    attr: function attr(k) {
      var v;
      this.each(function (i, el) {
        v = el[k] || el.getAttribute && el.getAttribute(k);
        return !v;
      });
      return v;
    },
    removeClass: function removeClass(className) {
      return this.each(function (i, el) {
        if (el.className) {
          el.className = el.className.replace(new RegExp('(^|\\s)' + className + '(\\s|$)'), ' ');
        }
      });
    },
    html: function html(_html) {
      return this.each(function (i, el) {
        el.innerHTML = _html;
      });
    },
    append: function append(spec) {
      return this.each(function (i, to) {
        var el = context.createElement(spec.tag);
        _each(spec, function (k, v) {
          if (k === '$text') {
            if (el.styleSheet) {
              // style tags in ie
              el.styleSheet.cssText = v;
            } else {
              el.appendChild(context.createTextNode(v));
            }
          } else if (k !== 'tag') {
            el[k] = v;
          }
        });
        to.appendChild(el);
      });
    }
  });

  return els;
}

function binder(std, odd) {
  std += 'EventListener';
  odd += 'Event';
  return function (el, e, fn) {
    if (el[std]) {
      el[std](e, fn, false);
    } else if (el[odd]) {
      el[odd]('on' + e, fn);
    }
  };
}

$.bind = binder('add', 'attach');
$.unbind = binder('remove', 'detach');

function onDomLoad(func) {
  var w = window,
      readyState = w.document.readyState;

  if (readyState === "interactive" || readyState === "complete") {
    func.call(w);
  } else {
    $.bind(w, "load", function () {
      func.call(w);
    });
  }
}

exports['default'] = $;
module.exports = exports['default'];

},{"./util":4}],3:[function(_dereq_,module,exports){
//INSERT AMD STUBBER HERE!
// import amd from './amd';
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _util = _dereq_('./util');

var _util2 = _interopRequireDefault(_util);

var _dollar = _dereq_('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _consumerOptions = _dereq_('./consumer-options');

var _consumerOptions2 = _interopRequireDefault(_consumerOptions);

//map AP.env.getUser to AP.user.getUser for compatibility.
if (AP._hostModules.user) {
  AP._hostModules.env.getUser = AP._hostModules.user.getUser;
}
AP._hostModules._dollar = _dollar2['default'];

(0, _dollar2['default'])(function () {
  console.log('sizetoparent?', _consumerOptions2['default'].get('sizeToParent'));
  if (_consumerOptions2['default'].get('sizeToParent') === true) {
    AP.env.sizeToParent();
  }
});

},{"./consumer-options":1,"./dollar":2,"./util":4}],4:[function(_dereq_,module,exports){
// universal iterator utility
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function each(o, it) {
  var l;
  var k;
  if (o) {
    l = o.length;
    if (l != null && typeof o !== 'function') {
      k = 0;
      while (k < l) {
        if (it.call(o[k], k, o[k]) === false) {
          break;
        }
        k += 1;
      }
    } else {
      for (k in o) {
        if (o.hasOwnProperty(k)) {
          if (it.call(o[k], k, o[k]) === false) {
            break;
          }
        }
      }
    }
  }
}

function binder(std, odd) {
  std += 'EventListener';
  odd += 'Event';
  return function (el, e, fn) {
    if (el[std]) {
      el[std](e, fn, false);
    } else if (el[odd]) {
      el[odd]('on' + e, fn);
    }
  };
}

function log() {
  var console = this.console;
  if (console && console.log) {
    var args = [].slice.call(arguments);
    if (console.log.apply) {
      console.log.apply(console, args);
    } else {
      for (var i = 0, l = args.length; i < l; i += 1) {
        args[i] = JSON.stringify(args[i]);
      }
      console.log(args.join(' '));
    }
    return true;
  }
}

function decodeQueryComponent(encodedURI) {
  return encodedURI == null ? null : decodeURIComponent(encodedURI.replace(/\+/g, '%20'));
}

exports['default'] = {
  each: each,
  log: log,
  decodeQueryComponent: decodeQueryComponent,
  bind: binder('add', 'attach'),
  unbind: binder('remove', 'detach'),

  extend: function extend(dest) {
    var args = arguments;
    var srcs = [].slice.call(args, 1, args.length);
    each(srcs, function (i, src) {
      each(src, function (k, v) {
        dest[k] = v;
      });
    });
    return dest;
  },

  trim: function trim(s) {
    return s && s.replace(/^\s+|\s+$/g, '');
  },

  debounce: function debounce(fn, wait) {
    var timeout;
    return function () {
      var ctx = this;
      var args = [].slice.call(arguments);
      function later() {
        timeout = null;
        fn.apply(ctx, args);
      }
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(later, wait || 50);
    };
  },

  inArray: function inArray(value, array, fromIndex) {
    //optimisation for all browsers after IE8
    if (Array.prototype.indexOf) {
      return Array.prototype.indexOf.call(array, value, fromIndex);
    }

    var k = fromIndex >>> 0;
    var len = array.length >>> 0;
    for (; k < len; k += 1) {
      if (array[k] === value) {
        return k;
      }
    }
    return -1;
  },

  isFunction: function isFunction(fn) {
    return typeof fn === 'function';
  },

  handleError: function handleError(err) {
    if (!log.apply(this, err && err.message ? [err, err.message] : [err])) {
      throw err;
    }
  }
};
module.exports = exports['default'];

},{}]},{},[3])(3)
});


//# sourceMappingURL=plugin-compat.js.map
