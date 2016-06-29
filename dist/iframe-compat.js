(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.APCompat = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

var modules = {};

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
    exports: (function () {
      function exports() {
        var target = exports.__target__;
        if (target) {
          return target.apply(window, arguments);
        }
      }
      return exports;
    })()
  };
}

// define(name, objOrFn)
// define(name, deps, fn(dep1, dep2, ...))
module.exports = function (AP) {
  // populate modules with existing ACJS modules
  if (AP) {
    Object.keys(AP._hostModules).forEach(function (key) {
      if (key[0] !== '_') {
        modules[key] = {
          name: key,
          exports: AP._hostModules[key]
        };
      }
    });
  }
  return {
    define: function define(name, deps, exports) {
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
    require: function _dereq_(deps, callback) {
      reqAll(typeof deps === 'string' ? [deps] : deps, callback);
    }
  };
};

},{}],2:[function(_dereq_,module,exports){
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

},{"./dollar":4}],3:[function(_dereq_,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _util = _dereq_('./util');

var _util2 = _interopRequireDefault(_util);

var _events = _dereq_('./events');

var _events2 = _interopRequireDefault(_events);

var customButtonIncrement = 1;

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

_events2['default'].onAny(eventDelegator);
function eventDelegator(name, args) {
  var dialogEventMatch = name.match(/^dialog\.(\w+)/);
  if (!dialogEventMatch) {
    return;
  }
  if (name === 'dialog.button.click') {
    customButtonEvent(args.button.identifier, args);
  } else {
    submitOrCancelEvent(dialogEventMatch[1], args);
  }
}

function customButtonEvent(buttonIdentifier, args) {
  var callbacks = dialogHandlers[buttonIdentifier];
  if (callbacks && callbacks.length !== 0) {
    try {
      callbacks.forEach(function (callback) {
        callback.call(null, args);
      });
    } catch (err) {
      console.error(err);
    }
  }
}

function submitOrCancelEvent(name, args) {
  var handlers = dialogHandlers[name];
  var shouldClose = name !== 'close';
  try {
    if (handlers) {
      shouldClose = handlers.reduce(function (result, cb) {
        return cb(args) && result;
      }, shouldClose);
    }
  } catch (err) {
    console.error(err);
  } finally {
    delete dialogHandlers[name];
  }
  if (shouldClose) {
    AP.dialog.close();
  }
}

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
  /**
   * Allows the add-on to register a callback function for the given event. The listener is only called once and must be re-registered if needed.
   * @memberOf Dialog~Dialog
   * @method on
   * @param {String} event name of the event to listen for, such as 'close'.
   * @param {Function} callback function to receive the event callback.
   * @noDemo
   * @example
   * AP.require('dialog', function(dialog){
   *   dialog.create(opts).on("close", callbackFunc);
   * });
   */
  dialog.on = _util2['default'].deprecateApi(registerHandler, 'AP.dialog.on("close", callback)', 'AP.events.on("dialog.close", callback)', '5.0');
  return dialog;
};

var original_dialogGetButton = AP.dialog.getButton.prototype.constructor.bind({});

AP.dialog.getButton = AP._hostModules.dialog.getButton = function (name) {
  try {
    var button = original_dialogGetButton(name);
    /**
     * Registers a function to be called when the button is clicked.
     * @method bind
     * @memberOf Dialog~DialogButton
     * @param {Function} callback function to be triggered on click or programatically.
     * @noDemo
     * @example
     * AP.require('dialog', function(dialog){
     *   dialog.getButton('submit').bind(function(){
     *     alert('clicked!');
     *   });
     * });
     */
    button.bind = _util2['default'].deprecateApi(function (callback) {
      return registerHandler(name, callback);
    }, 'AP.dialog.getDialogButton().bind()', 'AP.events.on("dialog.message", callback)', '5.0');

    return button;
  } catch (e) {
    return {};
  }
};

var original_dialogCreateButton = AP.dialog.createButton.prototype.constructor.bind({});

AP.dialog.createButton = AP._hostModules.dialog.createButton = function (options) {
  var buttonProperties = {};
  if (typeof options !== "object") {
    buttonProperties.text = options;
    buttonProperties.identifier = options;
  } else {
    buttonProperties = options;
  }
  if (!buttonProperties.identifier) {
    buttonProperties.identifier = 'user.button.' + customButtonIncrement++;
  }
  var createButton = original_dialogCreateButton(buttonProperties);
  return AP.dialog.getButton(buttonProperties.identifier);
};

AP.dialog.onDialogMessage = AP._hostModules.dialog.onDialogMessage = _util2['default'].deprecateApi(registerHandler, 'AP.dialog.onDialogMessage()', 'AP.events.on("dialog.message", callback)', '5.0');

if (!AP.Dialog) {
  AP.Dialog = AP._hostModules.Dialog = AP.dialog;
}

},{"./events":5,"./util":7}],4:[function(_dereq_,module,exports){
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

},{"./util":7}],5:[function(_dereq_,module,exports){
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
if (window.AP && window.AP.registerAny) {
  window.AP.registerAny(function (data, callback) {
    var eventName = callback._context.eventName;
    var any = events[ANY_PREFIX] || [];
    var byName = events[eventName] || [];

    if (!Array.isArray(data)) {
      data = [data];
    }

    any.forEach(function (handler) {
      //clone data before modifying
      var args = data.slice(0);
      args.unshift(eventName);
      args.push({
        args: data,
        name: eventName
      });
      handler.apply(null, args);
    });

    byName.forEach(function (handler) {
      handler.apply(null, data);
    });
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

},{"./dollar":4}],6:[function(_dereq_,module,exports){
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

var _amd = _dereq_('./amd');

var _amd2 = _interopRequireDefault(_amd);

var AMD = (0, _amd2['default'])(AP);
AP._hostModules._dollar = _dollar2['default'];

if (_consumerOptions2['default'].get('sizeToParent') === true) {
  AP.env.sizeToParent();
}

_dollar2['default'].each(_events2['default'], function (i, method) {
  AP._hostModules.events[i] = AP.events[i] = method;
});

AP.define = _util2['default'].deprecateApi(function () {
  return AMD.define.apply(AMD, arguments);
}, 'AP.define()', null, '5.0');

AP.require = _util2['default'].deprecateApi(function () {
  return AMD.require.apply(AMD, arguments);
}, 'AP.require()', null, '5.0');

},{"./amd":1,"./consumer-options":2,"./dialog":3,"./dollar":4,"./events":5,"./util":7}],7:[function(_dereq_,module,exports){
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
      console.warn('DEPRECATED API - ' + name + ' has been deprecated since ACJS ' + sinceVersion + (' and will be removed in a future release. ' + (alternate ? 'Use ' + alternate + ' instead.' : '')));
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

},{}]},{},[6])(6)
});


//# sourceMappingURL=iframe-compat.js.map
