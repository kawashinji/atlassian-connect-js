(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.APCompat = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _dollar = _dereq_('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var ConsumerOptions = (function () {
  function ConsumerOptions() {
    _classCallCheck(this, ConsumerOptions);
  }

  _createClass(ConsumerOptions, [{
    key: '_getConsumerOptions',
    value: function _getConsumerOptions() {
      var options = {};
      var $script = (0, _dollar2['default'])('script[src*=\'/atlassian-connect/all\']');

      if (!($script && /\/atlassian-connect\/all(-debug)?\.js($|\?)/.test($script.attr('src')))) {
        $script = (0, _dollar2['default'])('#ac-iframe-options');
      }

      if ($script && $script.length > 0) {
        // get its data-options attribute, if any
        var optStr = $script.attr('data-options');
        if (optStr) {
          // if found, parse the value into kv pairs following the format of a style element
          optStr.split(';').forEach(function (nvpair) {
            nvpair = nvpair.trim();
            if (nvpair) {
              var nv = nvpair.split(':');
              var k = nv[0].trim();
              var v = nv[1].trim();
              if (k && v != null) {
                options[k] = v === 'true' || v === 'false' ? v === 'true' : v;
              }
            }
          });
        }
      }

      return options;
    }
  }, {
    key: '_flush',
    value: function _flush() {
      delete this._options;
    }
  }, {
    key: 'get',
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

},{"./dollar":3}],2:[function(_dereq_,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _util = _dereq_('./util');

var _util2 = _interopRequireDefault(_util);

var _events = _dereq_('./events');

var _events2 = _interopRequireDefault(_events);

var getCustomData = _util2['default'].deprecateApi(function () {
  return AP._data.options.customData;
}, 'AP.dialog.customData', 'AP.dialog.getCustomData()', '5.0');

Object.defineProperty(AP._hostModules.dialog, 'customData', {
  get: getCustomData
});
Object.defineProperty(AP.dialog, 'customData', {
  get: getCustomData
});

var dialogHandlers = {};

_events2['default'].onAny(function (name, args) {
  var dialogEventMatch = name.match(/^dialog\.(\w+)$/);
  if (dialogEventMatch) {
    var dialogEvent = dialogEventMatch[1];
    var handlers = dialogHandlers[dialogEvent];
    if (handlers) {
      handlers.forEach(function (cb) {
        return cb(args);
      });
    } else if (dialogEvent !== 'close') {
      AP.dialog.close();
    }
  }
});

function registerHandler(event, callback) {
  if (typeof callback === 'function') {
    if (!dialogHandlers[event]) {
      dialogHandlers[event] = [];
    }
    dialogHandlers[event].push(callback);
  }
}

var original_dialogCreate = AP._hostModules.dialog.create;

AP.dialog.create = AP._hostModules.dialog.create = function () {
  var dialog = original_dialogCreate.apply(undefined, arguments);
  dialog.on = _util2['default'].deprecateApi(registerHandler, 'AP.dialog.on("close", callback)', 'AP.events.on("dialog.close", callback)', '5.0');
  return dialog;
};

var original_dialogGetButton = AP._hostModules.dialog.getButton;

AP.dialog.getButton = AP._hostModules.dialog.getButton = function () {
  var button = original_dialogGetButton.apply(undefined, arguments);
  var name = arguments[0];
  button.bind = _util2['default'].deprecateApi(function (callback) {
    return registerHandler(name, callback);
  }, 'AP.dialog.getDialogButton().bind()', 'AP.events.on("dialog.message", callback)', '5.0');
  return button;
};

AP.dialog.onDialogMessage = AP._hostModules.dialog.onDialogMessage = _util2['default'].deprecateApi(registerHandler, 'AP.dialog.onDialogMessage()', 'AP.events.on("dialog.message", callback)', '0.5');

if (!AP.Dialog) {
  AP.Dialog = AP._hostModules.Dialog = AP.dialog;
}

},{"./events":4,"./util":6}],3:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _util = _dereq_('./util');

var _util2 = _interopRequireDefault(_util);

var _each = _util2['default'].each,
    extend = _util2['default'].extend,
    document = window.document;

function $(sel, context) {

  context = context || document;

  var els = [];
  if (sel) {
    if (typeof sel === 'string') {
      var results = context.querySelectorAll(sel);
      _each(results, function (i, v) {
        els.push(v);
      });
    } else if (sel.nodeType === 1) {
      els.push(sel);
    } else if (sel === window) {
      els.push(sel);
    }
  }

  extend(els, {
    each: function each(it) {
      _each(this, it);
      return this;
    },
    bind: function bind(name, callback) {
      this.each(function (i, el) {
        _util2['default'].bind(el, name, callback);
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

exports['default'] = extend($, _util2['default']);
module.exports = exports['default'];

},{"./util":6}],4:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = _dereq_('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

/**
 * The Events module provides a mechanism for emitting and receiving events.
 * <h3>Basic example</h3>
 * ```
 * //The following will create an alert message every time the event `customEvent` is triggered.
 * AP.require('events', function(events){
*   events.on('customEvent', function(){
*       alert('event fired');
*   });
*   events.emit('customEvent');
* });
 * ```
 * @name Events
 * @module
 */
var events = {};
var ANY_PREFIX = '_any';
if (window.AP && window.AP.register) {
  window.AP.register({
    _any: function _any(data, callback) {
      var eventName = callback._context.eventName;
      var any = events[ANY_PREFIX] || [];
      var byName = events[eventName] || [];

      any.forEach(function (handler) {
        //clone data before modifying
        var args = [];
        if (data) {
          if (data.unshift) {
            args = data.slice(0);
            args.unshift(eventName);
          } else {
            args = [data];
          }
        }

        args.push({
          args: data,
          name: eventName
        });
        handler.apply(null, args);
      });
      byName.forEach(function (handler) {
        handler.apply(null, data);
      });
    }
  });
}

exports['default'] = {
  off: function off(name, listener) {
    var index = events[name].indexOf(listener);
    events[name].splice(index, 1);
  },
  offAll: function offAll(name) {
    delete events[name];
  },
  offAny: function offAny(listener) {
    this.off(ANY_PREFIX, listener);
  },
  on: function on(name, listener) {
    if (!events[name]) {
      events[name] = [];
    }
    events[name].push(listener);
  },
  onAny: function onAny(listener) {
    this.on(ANY_PREFIX, listener);
  },
  once: function once(name, listener) {
    this.on(name, function () {
      listener.call(null, arguments);
      this.off(name, listener);
    });
  }
  /**
   * Adds a listener for all occurrences of an event of a particular name.
   * Listener arguments include any arguments passed to `events.emit`, followed by an object describing the complete event information.
   * @name on
   * @method
   * @memberof module:Events#
   * @param {String} name The event name to subscribe the listener to
   * @param {Function} listener A listener callback to subscribe to the event name
   */

  /**
   * Adds a listener for one occurrence of an event of a particular name.
   * Listener arguments include any argument passed to `events.emit`, followed by an object describing the complete event information.
   * @name once
   * @method
   * @memberof module:Events#
   * @param {String} name The event name to subscribe the listener to
   * @param {Function}listener A listener callback to subscribe to the event name
   */

  /**
   * Adds a listener for all occurrences of any event, regardless of name.
   * Listener arguments begin with the event name, followed by any arguments passed to `events.emit`, followed by an object describing the complete event information.
   * @name onAny
   * @method
   * @memberof module:Events#
   * @param {Function} listener A listener callback to subscribe for any event name
   */

  /**
   * Removes a particular listener for an event.
   * @name off
   * @method
   * @memberof module:Events#
   * @param {String} name The event name to unsubscribe the listener from
   * @param {Function} listener The listener callback to unsubscribe from the event name
   */

  /**
   * Removes all listeners from an event name, or unsubscribes all event-name-specific listeners
   * if no name if given.
   * @name offAll
   * @method
   * @memberof module:Events#
   * @param {String} [name] The event name to unsubscribe all listeners from
   */

  /**
   * Removes an `any` event listener.
   * @name offAny
   * @method
   * @memberof module:Events#
   * @param {Function} listener A listener callback to unsubscribe from any event name
   */

  /**
   * Emits an event on this bus, firing listeners by name as well as all 'any' listeners. Arguments following the
   * name parameter are captured and passed to listeners.
   * @name emit
   * @method
   * @memberof module:Events#
   * @param {String} name The name of event to emit
   * @param {String[]} args 0 or more additional data arguments to deliver with the event
   */
};
module.exports = exports['default'];

},{"./dollar":3}],5:[function(_dereq_,module,exports){
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

var _events = _dereq_('./events');

var _events2 = _interopRequireDefault(_events);

var _dialog = _dereq_('./dialog');

var _dialog2 = _interopRequireDefault(_dialog);

AP._hostModules._dollar = _dollar2['default'];

if (_consumerOptions2['default'].get('sizeToParent') === true) {
  AP.env.sizeToParent();
}

_dollar2['default'].each(_events2['default'], function (i, method) {
  AP._hostModules.events[i] = AP.events[i] = method;
});

},{"./consumer-options":1,"./dialog":2,"./dollar":3,"./events":4,"./util":6}],6:[function(_dereq_,module,exports){
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
        if (it.call(o[k], k, o[k]) === false) break;
        k += 1;
      }
    } else {
      for (k in o) {
        if (o.hasOwnProperty(k)) {
          if (it.call(o[k], k, o[k]) === false) break;
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

function deprecateApi(fn, name, alternate, sinceVersion) {
  var called = false;
  return function () {
    if (!called && typeof console !== 'undefined' && console.warn) {
      called = true;
      console.warn('DEPRECATED API - ' + name + ' has been deprecated since ACJS ' + sinceVersion + (' and will be removed in a future release. Use ' + alternate + ' instead.'));
    }
    fn.apply(undefined, arguments);
  };
}

exports['default'] = {
  each: each,
  log: log,
  decodeQueryComponent: decodeQueryComponent,
  deprecateApi: deprecateApi,
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

    var k = fromIndex >>> 0,
        len = array.length >>> 0;
    for (; k < len; k += 1) {
      if (array[k] === value) return k;
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

},{}]},{},[5])(5)
});


//# sourceMappingURL=iframe-compat.js.map
