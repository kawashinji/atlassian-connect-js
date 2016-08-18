(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('connectHost', factory) :
	(global.connectHost = factory());
}(this, (function () { 'use strict';

	// AUI includes underscore and exposes it globally.
	var _ = window._;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	  return typeof obj;
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
	};

	var classCallCheck = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	var createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

	var inherits = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	};

	var possibleConstructorReturn = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && (typeof call === "object" || typeof call === "function") ? call : self;
	};

	var toConsumableArray = function (arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

	    return arr2;
	  } else {
	    return Array.from(arr);
	  }
	};

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function (n) {
	  if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function (type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events) this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler)) return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++) {
	      listeners[i].apply(this, args);
	    }
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function (type, listener) {
	  var m;

	  if (!isFunction(listener)) throw TypeError('listener must be a function');

	  if (!this._events) this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener) this.emit('newListener', type, isFunction(listener.listener) ? listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function (type, listener) {
	  if (!isFunction(listener)) throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function (type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener)) throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type]) return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener || isFunction(list.listener) && list.listener === listener) {
	    delete this._events[type];
	    if (this._events.removeListener) this.emit('removeListener', type, listener);
	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener || list[i].listener && list[i].listener === listener) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0) return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener) this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function (type) {
	  var key, listeners;

	  if (!this._events) return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0) this._events = {};else if (this._events[type]) delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length) {
	      this.removeListener(type, listeners[listeners.length - 1]);
	    }
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function (type) {
	  var ret;
	  if (!this._events || !this._events[type]) ret = [];else if (isFunction(this._events[type])) ret = [this._events[type]];else ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function (type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener)) return 1;else if (evlistener) return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function (emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}

	/**
	* pub/sub for extension state (created, destroyed, initialized)
	* taken from hipchat webcore
	**/
	var EventDispatcher = function (_EventEmitter) {
	  inherits(EventDispatcher, _EventEmitter);

	  function EventDispatcher() {
	    classCallCheck(this, EventDispatcher);

	    var _this = possibleConstructorReturn(this, Object.getPrototypeOf(EventDispatcher).call(this));

	    _this.setMaxListeners(20);
	    return _this;
	  }

	  createClass(EventDispatcher, [{
	    key: 'dispatch',
	    value: function dispatch(action) {
	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      this.emit.apply(this, ['before:' + action].concat(args));
	      this.emit.apply(this, arguments);
	      this.emit.apply(this, ['after:' + action].concat(args));
	    }
	  }, {
	    key: 'registerOnce',
	    value: function registerOnce(action, callback) {
	      var _this2 = this;

	      if (_.isString(action)) {
	        this.once(action, callback);
	      } else if (_.isObject(action)) {
	        _.keys(action).forEach(function (val, key) {
	          _this2.once(key, val);
	        }, this);
	      }
	    }
	  }, {
	    key: 'register',
	    value: function register(action, callback) {
	      var _this3 = this;

	      if (_.isString(action)) {
	        this.on(action, callback);
	      } else if (_.isObject(action)) {
	        _.keys(action).forEach(function (val, key) {
	          _this3.on(key, val);
	        }, this);
	      }
	    }
	  }, {
	    key: 'unregister',
	    value: function unregister(action, callback) {
	      var _this4 = this;

	      if (_.isString(action)) {
	        this.removeListener(action, callback);
	      } else if (_.isObject(action)) {
	        _.keys(action).forEach(function (val, key) {
	          _this4.removeListener(key, val);
	        }, this);
	      }
	    }
	  }]);
	  return EventDispatcher;
	}(EventEmitter);

	var EventDispatcher$1 = new EventDispatcher();

	var EVENT_NAME_PREFIX = 'connect.addon.';

	/**
	 * Timings beyond 20 seconds (connect's load timeout) will be clipped to an X.
	 * @const
	 * @type {int}
	 */
	var LOADING_TIME_THRESHOLD = 20000;

	/**
	 * Trim extra zeros from the load time.
	 * @const
	 * @type {int}
	 */
	var LOADING_TIME_TRIMP_PRECISION = 100;

	var AnalyticsDispatcher = function () {
	  function AnalyticsDispatcher() {
	    classCallCheck(this, AnalyticsDispatcher);

	    this._addons = {};
	  }

	  createClass(AnalyticsDispatcher, [{
	    key: '_track',
	    value: function _track(name, data) {
	      var w = window;
	      var prefixedName = EVENT_NAME_PREFIX + name;
	      data.version = w._AP.version;

	      if (w.AJS.Analytics) {
	        w.AJS.Analytics.triggerPrivacyPolicySafeEvent(prefixedName, data);
	      } else if (w.AJS.trigger) {
	        // BTF fallback
	        AJS.trigger('analyticsEvent', {
	          name: prefixedName,
	          data: data
	        });
	      } else {
	        return false;
	      }
	      return true;
	    }
	  }, {
	    key: '_time',
	    value: function _time() {
	      return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
	    }
	  }, {
	    key: 'trackLoadingStarted',
	    value: function trackLoadingStarted(extension) {
	      extension.startLoading = this._time();
	      this._addons[extension.id] = extension;
	    }
	  }, {
	    key: 'trackLoadingEnded',
	    value: function trackLoadingEnded(extension) {
	      var value = this._time() - this._addons[extension.id].startLoading;
	      this._track('iframe.performance.load', {
	        addonKey: extension.addon_key,
	        moduleKey: extension.key,
	        value: value > LOADING_TIME_THRESHOLD ? 'x' : Math.ceil(value / LOADING_TIME_TRIMP_PRECISION)
	      });
	    }
	  }, {
	    key: 'trackLoadingTimeout',
	    value: function trackLoadingTimeout(extension) {
	      this._track('iframe.performance.timeout', {
	        addonKey: extension.addon_key,
	        moduleKey: extension.key
	      });
	      //track an end event during a timeout so we always have complete start / end data.
	      this.trackLoadingEnded(extension);
	    }
	  }, {
	    key: 'trackLoadingCancel',
	    value: function trackLoadingCancel(extension) {
	      this._track('iframe.performance.cancel', {
	        addonKey: extension.addon_key,
	        moduleKey: extension.key
	      });
	    }
	  }, {
	    key: 'trackUseOfDeprecatedMethod',
	    value: function trackUseOfDeprecatedMethod(methodUsed, extension) {
	      this._track('jsapi.deprecated', {
	        addonKey: extension.addon_key,
	        moduleKey: extension.key,
	        methodUsed: methodUsed
	      });
	    }
	  }, {
	    key: 'dispatch',
	    value: function dispatch(name, data) {
	      this._track(name, data);
	    }
	  }]);
	  return AnalyticsDispatcher;
	}();

	var analytics = new AnalyticsDispatcher();
	EventDispatcher$1.register('iframe-create', function (data) {
	  analytics.trackLoadingStarted(data.extension);
	});
	EventDispatcher$1.register('iframe-bridge-established', function (data) {
	  analytics.trackLoadingEnded(data.extension);
	});
	EventDispatcher$1.register('iframe-bridge-timeout', function (data) {
	  analytics.trackLoadingTimeout(data.extension);
	});
	EventDispatcher$1.register('iframe-bridge-cancelled', function (data) {
	  analytics.trackLoadingCancel(data.extension);
	});
	EventDispatcher$1.register('analytics-deprecated-method-used', function (data) {
	  analytics.trackUseOfDeprecatedMethod(data.methodUsed, data.extension);
	});

	var LOG_PREFIX = "[Simple-XDM] ";

	var util = {
	  locationOrigin: function locationOrigin() {
	    if (!window.location.origin) {
	      return window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
	    } else {
	      return window.location.origin;
	    }
	  },
	  randomString: function randomString() {
	    return Math.floor(Math.random() * 1000000000).toString(16);
	  },
	  isString: function isString(str) {
	    return typeof str === "string" || str instanceof String;
	  },
	  argumentsToArray: function argumentsToArray(arrayLike) {
	    return Array.prototype.slice.call(arrayLike);
	  },
	  argumentNames: function argumentNames(fn) {
	    return fn.toString().replace(/((\/\/.*$)|(\/\*[^]*?\*\/))/mg, '') // strip comments
	    .replace(/[^(]+\(([^)]*)[^]+/, '$1') // get signature
	    .match(/([^\s,]+)/g) || [];
	  },
	  hasCallback: function hasCallback(args) {
	    var length = args.length;
	    return length > 0 && typeof args[length - 1] === 'function';
	  },
	  error: function error(msg) {
	    if (window.console) {
	      console.error(LOG_PREFIX + msg);
	    }
	  },
	  warn: function warn(msg) {
	    if (window.console) {
	      console.warn(LOG_PREFIX + msg);
	    }
	  },
	  _bind: function _bind(thisp, fn) {
	    if (Function.prototype.bind) {
	      return fn.bind(thisp);
	    }
	    return function () {
	      return fn.apply(thisp, arguments);
	    };
	  },
	  each: function each(list, iteratee) {
	    var length;
	    var key;
	    if (list) {
	      length = list.length;
	      if (length != null && typeof list !== 'function') {
	        key = 0;
	        while (key < length) {
	          if (iteratee.call(list[key], key, list[key]) === false) {
	            break;
	          }
	          key += 1;
	        }
	      } else {
	        for (key in list) {
	          if (list.hasOwnProperty(key)) {
	            if (iteratee.call(list[key], key, list[key]) === false) {
	              break;
	            }
	          }
	        }
	      }
	    }
	  },
	  extend: function extend(dest) {
	    var args = arguments;
	    var srcs = [].slice.call(args, 1, args.length);
	    srcs.forEach(function (source) {
	      if ((typeof source === "undefined" ? "undefined" : _typeof(source)) === "object") {
	        Object.getOwnPropertyNames(source).forEach(function (name) {
	          dest[name] = source[name];
	        });
	      }
	    });
	    return dest;
	  },
	  sanitizeStructuredClone: function sanitizeStructuredClone(object) {
	    var whiteList = [Boolean, String, Date, RegExp, Blob, File, FileList, ArrayBuffer];
	    var blackList = [Error, Node];
	    var warn = util.warn;
	    var visitedObjects = [];

	    function _clone(value) {
	      if (typeof value === 'function') {
	        warn("A function was detected and removed from the message.");
	        return null;
	      }

	      if (blackList.some(function (t) {
	        if (value instanceof t) {
	          warn(t.name + " object was detected and removed from the message.");
	          return true;
	        }
	        return false;
	      })) {
	        return {};
	      }

	      if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === 'object' && whiteList.every(function (t) {
	        return !(value instanceof t);
	      })) {
	        if (visitedObjects.indexOf(value) > -1) {
	          warn("A circular reference was detected and removed from the message.");
	          return null;
	        }

	        visitedObjects.push(value);

	        var newValue = void 0;

	        if (Array.isArray(value)) {
	          newValue = value.map(function (element) {
	            return _clone(element);
	          });
	        } else {
	          newValue = {};
	          for (var name in value) {
	            if (value.hasOwnProperty(name)) {
	              var clonedValue = _clone(value[name]);
	              if (clonedValue !== null) {
	                newValue[name] = clonedValue;
	              }
	            }
	          }
	        }
	        return newValue;
	      }
	      return value;
	    }

	    return _clone(object);
	  }
	};

	var PostMessage = function () {
	  function PostMessage(data) {
	    classCallCheck(this, PostMessage);

	    var d = data || {};
	    this._registerListener(d.listenOn);
	  }

	  // listen for postMessage events (defaults to window).


	  createClass(PostMessage, [{
	    key: "_registerListener",
	    value: function _registerListener(listenOn) {
	      if (!listenOn || !listenOn.addEventListener) {
	        listenOn = window;
	      }
	      listenOn.addEventListener("message", util._bind(this, this._receiveMessage), false);
	    }
	  }, {
	    key: "_receiveMessage",
	    value: function _receiveMessage(event) {
	      var extensionId = event.data.eid,
	          reg = void 0;

	      if (extensionId && this._registeredExtensions) {
	        reg = this._registeredExtensions[extensionId];
	      }

	      if (!this._checkOrigin(event, reg)) {
	        return false;
	      }

	      var handler = this._messageHandlers[event.data.type];
	      if (handler) {
	        handler.call(this, event, reg);
	      }
	    }
	  }]);
	  return PostMessage;
	}();

	/**
	* Postmessage format:
	*
	* Initialization
	* --------------
	* {
	*   type: 'init',
	*   eid: 'my-addon__my-module-xyz'  // the extension identifier, unique across iframes
	* }
	*
	* Request
	* -------
	* {
	*   type: 'req',
	*   eid: 'my-addon__my-module-xyz',  // the extension identifier, unique for iframe
	*   mid: 'xyz',  // a unique message identifier, required for callbacks
	*   mod: 'cookie',  // the module name
	*   fn: 'read',  // the method name
	*   args: [arguments]  // the method arguments
	* }
	*
	* Response
	* --------
	* {
	*   type: 'resp'
	*   eid: 'my-addon__my-module-xyz',  // the extension identifier, unique for iframe
	*   mid: 'xyz',  // a unique message identifier, obtained from the request
	*   args: [arguments]  // the callback arguments
	* }
	*
	* Event
	* -----
	* {
	*   type: 'evt',
	*   etyp: 'some-event',
	*   evnt: { ... }  // the event data
	*   mid: 'xyz', // a unique message identifier for the event
	* }
	**/

	var VALID_EVENT_TIME_MS = 30000; //30 seconds

	var XDMRPC = function (_PostMessage) {
	  inherits(XDMRPC, _PostMessage);
	  createClass(XDMRPC, [{
	    key: '_padUndefinedArguments',
	    value: function _padUndefinedArguments(array, length) {
	      return array.length >= length ? array : array.concat(new Array(length - array.length));
	    }
	  }]);

	  function XDMRPC(config) {
	    classCallCheck(this, XDMRPC);

	    config = config || {};

	    var _this = possibleConstructorReturn(this, Object.getPrototypeOf(XDMRPC).call(this, config));

	    _this._registeredExtensions = config.extensions || {};
	    _this._registeredAPIModules = {};
	    _this._pendingCallbacks = {};
	    _this._keycodeCallbacks = {};
	    _this._pendingEvents = {};
	    _this._messageHandlers = {
	      init: _this._handleInit,
	      req: _this._handleRequest,
	      resp: _this._handleResponse,
	      event_query: _this._handleEventQuery,
	      broadcast: _this._handleBroadcast,
	      key_listen: _this._handleKeyListen,
	      unload: _this._handleUnload
	    };
	    return _this;
	  }

	  createClass(XDMRPC, [{
	    key: '_handleInit',
	    value: function _handleInit(event, reg) {
	      this._registeredExtensions[reg.extension_id].source = event.source;
	      if (reg.initCallback) {
	        reg.initCallback(event.data.eid);
	        delete reg.initCallback;
	      }
	    }
	  }, {
	    key: '_handleResponse',
	    value: function _handleResponse(event) {
	      var data = event.data;
	      var pendingCallback = this._pendingCallbacks[data.mid];
	      if (pendingCallback) {
	        delete this._pendingCallbacks[data.mid];
	        pendingCallback.apply(window, data.args);
	      }
	    }
	  }, {
	    key: 'registerRequestNotifier',
	    value: function registerRequestNotifier(cb) {
	      this._registeredRequestNotifier = cb;
	    }
	  }, {
	    key: '_handleRequest',
	    value: function _handleRequest(event, reg) {
	      function sendResponse() {
	        var args = util.sanitizeStructuredClone(util.argumentsToArray(arguments));
	        event.source.postMessage({
	          mid: event.data.mid,
	          type: 'resp',
	          args: args
	        }, reg.extension.url);
	      }

	      var data = event.data;
	      var module = this._registeredAPIModules[data.mod];
	      var extension = this.getRegisteredExtensions(reg.extension)[0];
	      if (module) {
	        var fnName = data.fn;
	        if (data._cls) {
	          (function () {
	            var Cls = module[data._cls];
	            var ns = data.mod + '-' + data._cls + '-';
	            sendResponse._id = data._id;
	            if (fnName === 'constructor') {
	              if (!Cls._construct) {
	                Cls.constructor.prototype._destroy = function () {
	                  delete this._context._proxies[ns + this._id];
	                };
	                Cls._construct = function () {
	                  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	                    args[_key] = arguments[_key];
	                  }

	                  var inst = new (Function.prototype.bind.apply(Cls.constructor, [null].concat(args)))();
	                  var callback = args[args.length - 1];
	                  inst._id = callback._id;
	                  inst._context = callback._context;
	                  inst._context._proxies[ns + inst._id] = inst;
	                  return inst;
	                };
	              }
	              module = Cls;
	              fnName = '_construct';
	            } else {
	              module = extension._proxies[ns + data._id];
	            }
	          })();
	        }
	        var method = module[fnName];
	        if (method) {
	          var methodArgs = data.args;
	          sendResponse._context = extension;
	          methodArgs = this._padUndefinedArguments(methodArgs, method.length - 1);
	          methodArgs.push(sendResponse);
	          method.apply(module, methodArgs);
	          if (this._registeredRequestNotifier) {
	            this._registeredRequestNotifier.call(null, {
	              module: data.mod,
	              fn: data.fn,
	              type: data.type,
	              addon_key: reg.extension.addon_key,
	              key: reg.extension.key,
	              extension_id: reg.extension_id
	            });
	          }
	        }
	      }
	    }
	  }, {
	    key: '_handleBroadcast',
	    value: function _handleBroadcast(event, reg) {
	      var event_data = event.data;
	      var targetSpec = function targetSpec(r) {
	        return r.extension.addon_key === reg.extension.addon_key && r.extension_id !== reg.extension_id;
	      };
	      this.dispatch(event_data.etyp, targetSpec, event_data.evnt, null, null);
	    }
	  }, {
	    key: '_handleKeyListen',
	    value: function _handleKeyListen(event, reg) {
	      var eventData = event.data;
	      var keycodeEntry = this._keycodeKey(eventData.keycode, eventData.modifiers, reg.extension_id);
	      var listeners = this._keycodeCallbacks[keycodeEntry];
	      if (listeners) {
	        listeners.forEach(function (listener) {
	          listener.call(null, {
	            addon_key: reg.extension.addon_key,
	            key: reg.extension.key,
	            extension_id: reg.extension_id,
	            keycode: eventData.keycode,
	            modifiers: eventData.modifiers
	          });
	        }, this);
	      }
	    }
	  }, {
	    key: 'defineAPIModule',
	    value: function defineAPIModule(module, moduleName) {
	      if (moduleName) {
	        this._registeredAPIModules[moduleName] = module;
	      } else {
	        this._registeredAPIModules._globals = util.extend({}, this._registeredAPIModules._globals, module);
	      }
	      return this._registeredAPIModules;
	    }
	  }, {
	    key: '_fullKey',
	    value: function _fullKey(targetSpec) {
	      var key = targetSpec.addon_key || 'global';
	      if (targetSpec.key) {
	        key = key + '@@' + targetSpec.key;
	      }

	      return key;
	    }
	  }, {
	    key: 'queueEvent',
	    value: function queueEvent(type, targetSpec, event, callback) {
	      var loaded_frame,
	          targets = this._findRegistrations(targetSpec);

	      loaded_frame = targets.some(function (target) {
	        return target.registered_events !== undefined;
	      }, this);

	      if (loaded_frame) {
	        this.dispatch(type, targetSpec, event, callback);
	      } else {
	        this._pendingEvents[this._fullKey(targetSpec)] = {
	          type: type,
	          targetSpec: targetSpec,
	          event: event,
	          callback: callback,
	          time: new Date().getTime(),
	          uid: util.randomString()
	        };
	      }
	    }
	  }, {
	    key: '_handleEventQuery',
	    value: function _handleEventQuery(message, extension) {
	      var _this2 = this;

	      var executed = {};
	      var now = new Date().getTime();
	      var keys = Object.keys(this._pendingEvents);
	      keys.forEach(function (index) {
	        var element = _this2._pendingEvents[index];
	        var eventIsValid = now - element.time <= VALID_EVENT_TIME_MS;
	        var isSameTarget = !element.targetSpec || _this2._findRegistrations(element.targetSpec).length !== 0;

	        if (eventIsValid && isSameTarget) {
	          executed[index] = element;
	          element.targetSpec = element.targetSpec || {};
	          element.targetSpec.addon_key = extension.extension.addon_key;
	          element.targetSpec.key = extension.extension.key;
	          _this2.dispatch(element.type, element.targetSpec, element.event, element.callback, message.source);
	        } else if (!eventIsValid) {
	          delete _this2._pendingEvents[index];
	        }
	      });

	      this._registeredExtensions[extension.extension_id].registered_events = message.data.args;

	      return executed;
	    }
	  }, {
	    key: '_handleUnload',
	    value: function _handleUnload(event, reg) {
	      delete this._registeredExtensions[reg.extension_id].source;
	      if (reg.unloadCallback) {
	        reg.unloadCallback(event.data.eid);
	      }
	    }
	  }, {
	    key: 'dispatch',
	    value: function dispatch(type, targetSpec, event, callback, source) {
	      function sendEvent(reg, evnt) {
	        if (reg.source) {
	          var mid;
	          if (callback) {
	            mid = util.randomString();
	            this._pendingCallbacks[mid] = callback;
	          }

	          reg.source.postMessage({
	            type: 'evt',
	            mid: mid,
	            etyp: type,
	            evnt: evnt
	          }, reg.extension.url);
	        }
	      }

	      var registrations = this._findRegistrations(targetSpec || {});
	      registrations.forEach(function (reg) {
	        if (source) {
	          reg.source = source;
	        }

	        if (reg.source) {
	          util._bind(this, sendEvent)(reg, event);
	        }
	      }, this);
	    }
	  }, {
	    key: '_findRegistrations',
	    value: function _findRegistrations(targetSpec) {
	      var _this3 = this;

	      if (this._registeredExtensions.length === 0) {
	        util.error('no registered extensions', this._registeredExtensions);
	        return [];
	      }
	      var keys = Object.getOwnPropertyNames(targetSpec);
	      var registrations = Object.getOwnPropertyNames(this._registeredExtensions).map(function (key) {
	        return _this3._registeredExtensions[key];
	      });

	      if (targetSpec instanceof Function) {
	        return registrations.filter(targetSpec);
	      } else {
	        return registrations.filter(function (reg) {
	          return keys.every(function (key) {
	            return reg.extension[key] === targetSpec[key];
	          });
	        });
	      }
	    }
	  }, {
	    key: 'registerExtension',
	    value: function registerExtension(extension_id, data) {
	      // delete duplicate registrations
	      if (data.extension.addon_key && data.extension.key) {
	        var existingView = this._findRegistrations({
	          addon_key: data.extension.addon_key,
	          key: data.extension.key
	        });
	        if (existingView.length !== 0) {
	          delete this._registeredExtensions[existingView[0].extension_id];
	        }
	      }
	      data._proxies = {};
	      data.extension_id = extension_id;
	      this._registeredExtensions[extension_id] = data;
	    }
	  }, {
	    key: '_keycodeKey',
	    value: function _keycodeKey(key, modifiers, extension_id) {
	      var code = key;

	      if (modifiers) {
	        if (typeof modifiers === "string") {
	          modifiers = [modifiers];
	        }
	        modifiers.sort();
	        modifiers.forEach(function (modifier) {
	          code += '$$' + modifier;
	        }, this);
	      }

	      return code + '__' + extension_id;
	    }
	  }, {
	    key: 'registerKeyListener',
	    value: function registerKeyListener(extension_id, key, modifiers, callback) {
	      if (typeof modifiers === "string") {
	        modifiers = [modifiers];
	      }
	      var reg = this._registeredExtensions[extension_id];
	      var keycodeEntry = this._keycodeKey(key, modifiers, extension_id);
	      if (!this._keycodeCallbacks[keycodeEntry]) {
	        this._keycodeCallbacks[keycodeEntry] = [];
	        reg.source.postMessage({
	          type: 'key_listen',
	          keycode: key,
	          modifiers: modifiers,
	          action: 'add'
	        }, reg.extension.url);
	      }
	      this._keycodeCallbacks[keycodeEntry].push(callback);
	    }
	  }, {
	    key: 'unregisterKeyListener',
	    value: function unregisterKeyListener(extension_id, key, modifiers, callback) {
	      var keycodeEntry = this._keycodeKey(key, modifiers, extension_id);
	      var potentialCallbacks = this._keycodeCallbacks[keycodeEntry];
	      var reg = this._registeredExtensions[extension_id];

	      if (potentialCallbacks) {
	        if (callback) {
	          var index = potentialCallbacks.indexOf(callback);
	          this._keycodeCallbacks[keycodeEntry].splice(index, 1);
	        } else {
	          delete this._keycodeCallbacks[keycodeEntry];
	        }

	        reg.source.postMessage({
	          type: 'key_listen',
	          keycode: key,
	          modifiers: modifiers,
	          action: 'remove'
	        }, reg.extension.url);
	      }
	    }
	  }, {
	    key: 'getApiSpec',
	    value: function getApiSpec() {
	      var that = this;
	      function createModule(moduleName) {
	        var module = that._registeredAPIModules[moduleName];
	        if (!module) {
	          throw new Error("unregistered API module: " + moduleName);
	        }
	        function getModuleDefinition(mod) {
	          return Object.getOwnPropertyNames(mod).reduce(function (accumulator, memberName) {
	            var member = mod[memberName];
	            switch (typeof member === 'undefined' ? 'undefined' : _typeof(member)) {
	              case 'function':
	                accumulator[memberName] = {
	                  args: util.argumentNames(member)
	                };
	                break;
	              case 'object':
	                if (member.hasOwnProperty('constructor')) {
	                  accumulator[memberName] = getModuleDefinition(member);
	                }
	                break;
	            }
	            return accumulator;
	          }, {});
	        }
	        return getModuleDefinition(module);
	      }
	      return Object.getOwnPropertyNames(this._registeredAPIModules).reduce(function (accumulator, moduleName) {
	        accumulator[moduleName] = createModule(moduleName);
	        return accumulator;
	      }, {});
	    }

	    // validate origin of postMessage

	  }, {
	    key: '_checkOrigin',
	    value: function _checkOrigin(event, reg) {
	      var no_source_types = ['init', 'event_query'];
	      var isNoSourceType = reg && !reg.source && no_source_types.indexOf(event.data.type) > -1;
	      var sourceTypeMatches = reg && event.source === reg.source;
	      var hasExtensionUrl = reg && reg.extension.url.indexOf(event.origin) === 0;
	      var isValidOrigin = hasExtensionUrl && (isNoSourceType || sourceTypeMatches);

	      // check undefined for chromium (Issue 395010)
	      if (event.data.type === 'unload' && (sourceTypeMatches || event.source === undefined)) {
	        isValidOrigin = true;
	      }

	      if (!isValidOrigin) {
	        util.warn("Failed to validate origin: " + event.origin);
	      }
	      return isValidOrigin;
	    }
	  }, {
	    key: 'getRegisteredExtensions',
	    value: function getRegisteredExtensions(filter) {
	      if (filter) {
	        return this._findRegistrations(filter);
	      }
	      return this._registeredExtensions;
	    }
	  }, {
	    key: 'unregisterExtension',
	    value: function unregisterExtension(filter) {
	      var registrations = this._findRegistrations(filter);
	      if (registrations.length !== 0) {
	        registrations.forEach(function (registration) {
	          var _this4 = this;

	          var keys = Object.keys(this._pendingEvents);
	          keys.forEach(function (index) {
	            var element = _this4._pendingEvents[index];
	            var targetSpec = element.targetSpec || {};

	            if (targetSpec.addon_key === registration.extension.addon_key) {
	              delete _this4._pendingEvents[index];
	            }
	          });

	          delete this._registeredExtensions[registration.extension_id];
	        }, this);
	      }
	    }
	  }]);
	  return XDMRPC;
	}(PostMessage);

	var Connect = function () {
	  function Connect() {
	    classCallCheck(this, Connect);

	    this._xdm = new XDMRPC();
	  }

	  /**
	   * Send a message to iframes matching the targetSpec. This message is added to
	   *  a message queue for delivery to ensure the message is received if an iframe
	   *  has not yet loaded
	   *
	   * @param type The name of the event type
	   * @param targetSpec The spec to match against extensions when sending this event
	   * @param event The event payload
	   * @param callback A callback to be executed when the remote iframe calls its callback
	   */


	  createClass(Connect, [{
	    key: 'dispatch',
	    value: function dispatch(type, targetSpec, event, callback) {
	      this._xdm.queueEvent(type, targetSpec, event, callback);
	      return this.getExtensions(targetSpec);
	    }

	    /**
	     * Send a message to iframes matching the targetSpec immediately. This message will
	     *  only be sent to iframes that are already open, and will not be delivered if none
	     *  are currently open.
	     *
	     * @param type The name of the event type
	     * @param targetSpec The spec to match against extensions when sending this event
	     * @param event The event payload
	     */

	  }, {
	    key: 'broadcast',
	    value: function broadcast(type, targetSpec, event) {
	      this._xdm.dispatch(type, targetSpec, event, null, null);
	      return this.getExtensions(targetSpec);
	    }
	  }, {
	    key: '_createId',
	    value: function _createId(extension) {
	      if (!extension.addon_key || !extension.key) {
	        throw Error('Extensions require addon_key and key');
	      }
	      return extension.addon_key + '__' + extension.key + '__' + util.randomString();
	    }
	    /**
	    * Creates a new iframed module, without actually creating the DOM element.
	    * The iframe attributes are passed to the 'setupCallback', which is responsible for creating
	    * the DOM element and returning the window reference.
	    *
	    * @param extension The extension definition. Example:
	    *   {
	    *     addon_key: 'my-addon',
	    *     key: 'my-module',
	    *     url: 'https://example.com/my-module',
	    *     options: { autoresize: false }
	    *   }
	    *
	    * @param initCallback The optional initCallback is called when the bridge between host and iframe is established.
	    **/

	  }, {
	    key: 'create',
	    value: function create(extension, initCallback) {
	      var extension_id = this.registerExtension(extension, initCallback);

	      var data = {
	        extension_id: extension_id,
	        api: this._xdm.getApiSpec(),
	        origin: util.locationOrigin(),
	        options: extension.options || {}
	      };

	      return {
	        id: extension_id,
	        name: JSON.stringify(data),
	        src: extension.url
	      };
	    }
	  }, {
	    key: 'registerRequestNotifier',
	    value: function registerRequestNotifier(callback) {
	      this._xdm.registerRequestNotifier(callback);
	    }
	  }, {
	    key: 'registerExtension',
	    value: function registerExtension(extension, initCallback, unloadCallback) {
	      var extension_id = this._createId(extension);
	      this._xdm.registerExtension(extension_id, {
	        extension: extension,
	        initCallback: initCallback,
	        unloadCallback: unloadCallback
	      });
	      return extension_id;
	    }
	  }, {
	    key: 'registerKeyListener',
	    value: function registerKeyListener(extension_id, key, modifiers, callback) {
	      this._xdm.registerKeyListener(extension_id, key, modifiers, callback);
	    }
	  }, {
	    key: 'unregisterKeyListener',
	    value: function unregisterKeyListener(extension_id, key, modifiers, callback) {
	      this._xdm.unregisterKeyListener(extension_id, key, modifiers, callback);
	    }
	  }, {
	    key: 'defineModule',
	    value: function defineModule(moduleName, module) {
	      this._xdm.defineAPIModule(module, moduleName);
	    }
	  }, {
	    key: 'defineGlobals',
	    value: function defineGlobals(module) {
	      this._xdm.defineAPIModule(module);
	    }
	  }, {
	    key: 'getExtensions',
	    value: function getExtensions(filter) {
	      return this._xdm.getRegisteredExtensions(filter);
	    }
	  }, {
	    key: 'unregisterExtension',
	    value: function unregisterExtension(filter) {
	      return this._xdm.unregisterExtension(filter);
	    }
	  }]);
	  return Connect;
	}();

	var host = new Connect();

	var JwtActions = {
	  registerContentResolver: function registerContentResolver(data) {
	    EventDispatcher$1.dispatch('content-resolver-register-by-extension', data);
	  },
	  requestRefreshUrl: function requestRefreshUrl(data) {
	    if (!data.resolver) {
	      throw Error('ACJS: No content resolver supplied');
	    }
	    var promise = data.resolver.call(null, _.extend({ classifier: 'json' }, data.extension));
	    promise.done(function (promiseData) {
	      var newExtensionConfiguration = {};
	      if (_.isObject(promiseData)) {
	        newExtensionConfiguration = promiseData;
	      } else if (_.isString(promiseData)) {
	        try {
	          newExtensionConfiguration = JSON.parse(promiseData);
	        } catch (e) {
	          console.error('ACJS: invalid response from content resolver');
	        }
	      }
	      data.extension.url = newExtensionConfiguration.url;
	      _.extend(data.extension.options, newExtensionConfiguration.options);
	      EventDispatcher$1.dispatch('jwt-url-refreshed', {
	        extension: data.extension,
	        $container: data.$container,
	        url: data.extension.url
	      });
	    });
	    EventDispatcher$1.dispatch('jwt-url-refresh-request', { data: data });
	  }

	};

	var EventActions = {
	  broadcast: function broadcast(type, targetSpec, event) {
	    host.dispatch(type, targetSpec, event);
	    EventDispatcher$1.dispatch('event-dispatch', {
	      type: type,
	      targetSpec: targetSpec,
	      event: event
	    });
	  }
	};

	var events = {
	  emit: function emit(name) {
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key];
	    }

	    var callback = _.last(args);
	    args = _.first(args, -1);
	    EventActions.broadcast(name, {
	      addon_key: callback._context.extension.addon_key
	    }, args);
	  }
	};

	/**
	 * The iframe-side code exposes a jquery-like implementation via _dollar.
	 * This runs on the product side to provide AJS.$ under a _dollar module to provide a consistent interface
	 * to code that runs on host and iframe.
	 */
	var $$1 = AJS.$;

	var IframeActions = {
	  notifyIframeCreated: function notifyIframeCreated($el, extension) {
	    EventDispatcher$1.dispatch('iframe-create', { $el: $el, extension: extension });
	  },

	  notifyBridgeEstablished: function notifyBridgeEstablished($el, extension) {
	    EventDispatcher$1.dispatch('iframe-bridge-established', { $el: $el, extension: extension });
	  },

	  notifyIframeDestroyed: function notifyIframeDestroyed(extension_id) {
	    var extension = host.getExtensions({
	      extension_id: extension_id
	    });
	    if (extension.length === 1) {
	      extension = extension[0];
	    }
	    EventDispatcher$1.dispatch('iframe-destroyed', { extension: extension });
	    host.unregisterExtension({ extension_id: extension_id });
	  },

	  notifyUnloaded: function notifyUnloaded($el, extension) {
	    EventDispatcher$1.dispatch('iframe-unload', { $el: $el, extension: extension });
	  }
	};

	function escapeSelector(s) {
	  if (!s) {
	    throw new Error('No selector to escape');
	  }
	  return s.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, '\\$&');
	}

	function stringToDimension(value) {
	  var percent = false;
	  var unit = 'px';

	  if (_.isString(value)) {
	    percent = value.indexOf('%') === value.length - 1;
	    value = parseInt(value, 10);
	    if (percent) {
	      unit = '%';
	    }
	  }

	  if (!isNaN(value)) {
	    return value + unit;
	  }
	}

	function getIframeByExtensionId(id) {
	  return AJS.$('iframe#' + escapeSelector(id));
	}

	var util$1 = {
	  escapeSelector: escapeSelector,
	  stringToDimension: stringToDimension,
	  getIframeByExtensionId: getIframeByExtensionId
	};

	function interopDefault(ex) {
		return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var Uri = createCommonjsModule(function (module) {
	/*!
	 * jsUri
	 * https://github.com/derek-watson/jsUri
	 *
	 * Copyright 2013, Derek Watson
	 * Released under the MIT license.
	 *
	 * Includes parseUri regular expressions
	 * http://blog.stevenlevithan.com/archives/parseuri
	 * Copyright 2007, Steven Levithan
	 * Released under the MIT license.
	 */

	/*globals define, module */

	(function (global) {

	  var re = {
	    starts_with_slashes: /^\/+/,
	    ends_with_slashes: /\/+$/,
	    pluses: /\+/g,
	    query_separator: /[&;]/,
	    uri_parser: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@\/]*)(?::([^:@]*))?)?@)?(\[[0-9a-fA-F:.]+\]|[^:\/?#]*)(?::(\d+|(?=:)))?(:)?)((((?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	  };

	  /**
	   * Define forEach for older js environments
	   * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach#Compatibility
	   */
	  if (!Array.prototype.forEach) {
	    Array.prototype.forEach = function (callback, thisArg) {
	      var T, k;

	      if (this == null) {
	        throw new TypeError(' this is null or not defined');
	      }

	      var O = Object(this);
	      var len = O.length >>> 0;

	      if (typeof callback !== "function") {
	        throw new TypeError(callback + ' is not a function');
	      }

	      if (arguments.length > 1) {
	        T = thisArg;
	      }

	      k = 0;

	      while (k < len) {
	        var kValue;
	        if (k in O) {
	          kValue = O[k];
	          callback.call(T, kValue, k, O);
	        }
	        k++;
	      }
	    };
	  }

	  /**
	   * unescape a query param value
	   * @param  {string} s encoded value
	   * @return {string}   decoded value
	   */
	  function decode(s) {
	    if (s) {
	      s = s.toString().replace(re.pluses, '%20');
	      s = decodeURIComponent(s);
	    }
	    return s;
	  }

	  /**
	   * Breaks a uri string down into its individual parts
	   * @param  {string} str uri
	   * @return {object}     parts
	   */
	  function parseUri(str) {
	    var parser = re.uri_parser;
	    var parserKeys = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "isColonUri", "relative", "path", "directory", "file", "query", "anchor"];
	    var m = parser.exec(str || '');
	    var parts = {};

	    parserKeys.forEach(function (key, i) {
	      parts[key] = m[i] || '';
	    });

	    return parts;
	  }

	  /**
	   * Breaks a query string down into an array of key/value pairs
	   * @param  {string} str query
	   * @return {array}      array of arrays (key/value pairs)
	   */
	  function parseQuery(str) {
	    var i, ps, p, n, k, v, l;
	    var pairs = [];

	    if (typeof str === 'undefined' || str === null || str === '') {
	      return pairs;
	    }

	    if (str.indexOf('?') === 0) {
	      str = str.substring(1);
	    }

	    ps = str.toString().split(re.query_separator);

	    for (i = 0, l = ps.length; i < l; i++) {
	      p = ps[i];
	      n = p.indexOf('=');

	      if (n !== 0) {
	        k = decode(p.substring(0, n));
	        v = decode(p.substring(n + 1));
	        pairs.push(n === -1 ? [p, null] : [k, v]);
	      }
	    }
	    return pairs;
	  }

	  /**
	   * Creates a new Uri object
	   * @constructor
	   * @param {string} str
	   */
	  function Uri(str) {
	    this.uriParts = parseUri(str);
	    this.queryPairs = parseQuery(this.uriParts.query);
	    this.hasAuthorityPrefixUserPref = null;
	  }

	  /**
	   * Define getter/setter methods
	   */
	  ['protocol', 'userInfo', 'host', 'port', 'path', 'anchor'].forEach(function (key) {
	    Uri.prototype[key] = function (val) {
	      if (typeof val !== 'undefined') {
	        this.uriParts[key] = val;
	      }
	      return this.uriParts[key];
	    };
	  });

	  /**
	   * if there is no protocol, the leading // can be enabled or disabled
	   * @param  {Boolean}  val
	   * @return {Boolean}
	   */
	  Uri.prototype.hasAuthorityPrefix = function (val) {
	    if (typeof val !== 'undefined') {
	      this.hasAuthorityPrefixUserPref = val;
	    }

	    if (this.hasAuthorityPrefixUserPref === null) {
	      return this.uriParts.source.indexOf('//') !== -1;
	    } else {
	      return this.hasAuthorityPrefixUserPref;
	    }
	  };

	  Uri.prototype.isColonUri = function (val) {
	    if (typeof val !== 'undefined') {
	      this.uriParts.isColonUri = !!val;
	    } else {
	      return !!this.uriParts.isColonUri;
	    }
	  };

	  /**
	   * Serializes the internal state of the query pairs
	   * @param  {string} [val]   set a new query string
	   * @return {string}         query string
	   */
	  Uri.prototype.query = function (val) {
	    var s = '',
	        i,
	        param,
	        l;

	    if (typeof val !== 'undefined') {
	      this.queryPairs = parseQuery(val);
	    }

	    for (i = 0, l = this.queryPairs.length; i < l; i++) {
	      param = this.queryPairs[i];
	      if (s.length > 0) {
	        s += '&';
	      }
	      if (param[1] === null) {
	        s += param[0];
	      } else {
	        s += param[0];
	        s += '=';
	        if (typeof param[1] !== 'undefined') {
	          s += encodeURIComponent(param[1]);
	        }
	      }
	    }
	    return s.length > 0 ? '?' + s : s;
	  };

	  /**
	   * returns the first query param value found for the key
	   * @param  {string} key query key
	   * @return {string}     first value found for key
	   */
	  Uri.prototype.getQueryParamValue = function (key) {
	    var param, i, l;
	    for (i = 0, l = this.queryPairs.length; i < l; i++) {
	      param = this.queryPairs[i];
	      if (key === param[0]) {
	        return param[1];
	      }
	    }
	  };

	  /**
	   * returns an array of query param values for the key
	   * @param  {string} key query key
	   * @return {array}      array of values
	   */
	  Uri.prototype.getQueryParamValues = function (key) {
	    var arr = [],
	        i,
	        param,
	        l;
	    for (i = 0, l = this.queryPairs.length; i < l; i++) {
	      param = this.queryPairs[i];
	      if (key === param[0]) {
	        arr.push(param[1]);
	      }
	    }
	    return arr;
	  };

	  /**
	   * removes query parameters
	   * @param  {string} key     remove values for key
	   * @param  {val}    [val]   remove a specific value, otherwise removes all
	   * @return {Uri}            returns self for fluent chaining
	   */
	  Uri.prototype.deleteQueryParam = function (key, val) {
	    var arr = [],
	        i,
	        param,
	        keyMatchesFilter,
	        valMatchesFilter,
	        l;

	    for (i = 0, l = this.queryPairs.length; i < l; i++) {

	      param = this.queryPairs[i];
	      keyMatchesFilter = decode(param[0]) === decode(key);
	      valMatchesFilter = param[1] === val;

	      if (arguments.length === 1 && !keyMatchesFilter || arguments.length === 2 && (!keyMatchesFilter || !valMatchesFilter)) {
	        arr.push(param);
	      }
	    }

	    this.queryPairs = arr;

	    return this;
	  };

	  /**
	   * adds a query parameter
	   * @param  {string}  key        add values for key
	   * @param  {string}  val        value to add
	   * @param  {integer} [index]    specific index to add the value at
	   * @return {Uri}                returns self for fluent chaining
	   */
	  Uri.prototype.addQueryParam = function (key, val, index) {
	    if (arguments.length === 3 && index !== -1) {
	      index = Math.min(index, this.queryPairs.length);
	      this.queryPairs.splice(index, 0, [key, val]);
	    } else if (arguments.length > 0) {
	      this.queryPairs.push([key, val]);
	    }
	    return this;
	  };

	  /**
	   * test for the existence of a query parameter
	   * @param  {string}  key        add values for key
	   * @param  {string}  val        value to add
	   * @param  {integer} [index]    specific index to add the value at
	   * @return {Uri}                returns self for fluent chaining
	   */
	  Uri.prototype.hasQueryParam = function (key) {
	    var i,
	        len = this.queryPairs.length;
	    for (i = 0; i < len; i++) {
	      if (this.queryPairs[i][0] == key) return true;
	    }
	    return false;
	  };

	  /**
	   * replaces query param values
	   * @param  {string} key         key to replace value for
	   * @param  {string} newVal      new value
	   * @param  {string} [oldVal]    replace only one specific value (otherwise replaces all)
	   * @return {Uri}                returns self for fluent chaining
	   */
	  Uri.prototype.replaceQueryParam = function (key, newVal, oldVal) {
	    var index = -1,
	        len = this.queryPairs.length,
	        i,
	        param;

	    if (arguments.length === 3) {
	      for (i = 0; i < len; i++) {
	        param = this.queryPairs[i];
	        if (decode(param[0]) === decode(key) && decodeURIComponent(param[1]) === decode(oldVal)) {
	          index = i;
	          break;
	        }
	      }
	      if (index >= 0) {
	        this.deleteQueryParam(key, decode(oldVal)).addQueryParam(key, newVal, index);
	      }
	    } else {
	      for (i = 0; i < len; i++) {
	        param = this.queryPairs[i];
	        if (decode(param[0]) === decode(key)) {
	          index = i;
	          break;
	        }
	      }
	      this.deleteQueryParam(key);
	      this.addQueryParam(key, newVal, index);
	    }
	    return this;
	  };

	  /**
	   * Define fluent setter methods (setProtocol, setHasAuthorityPrefix, etc)
	   */
	  ['protocol', 'hasAuthorityPrefix', 'isColonUri', 'userInfo', 'host', 'port', 'path', 'query', 'anchor'].forEach(function (key) {
	    var method = 'set' + key.charAt(0).toUpperCase() + key.slice(1);
	    Uri.prototype[method] = function (val) {
	      this[key](val);
	      return this;
	    };
	  });

	  /**
	   * Scheme name, colon and doubleslash, as required
	   * @return {string} http:// or possibly just //
	   */
	  Uri.prototype.scheme = function () {
	    var s = '';

	    if (this.protocol()) {
	      s += this.protocol();
	      if (this.protocol().indexOf(':') !== this.protocol().length - 1) {
	        s += ':';
	      }
	      s += '//';
	    } else {
	      if (this.hasAuthorityPrefix() && this.host()) {
	        s += '//';
	      }
	    }

	    return s;
	  };

	  /**
	   * Same as Mozilla nsIURI.prePath
	   * @return {string} scheme://user:password@host:port
	   * @see  https://developer.mozilla.org/en/nsIURI
	   */
	  Uri.prototype.origin = function () {
	    var s = this.scheme();

	    if (this.userInfo() && this.host()) {
	      s += this.userInfo();
	      if (this.userInfo().indexOf('@') !== this.userInfo().length - 1) {
	        s += '@';
	      }
	    }

	    if (this.host()) {
	      s += this.host();
	      if (this.port() || this.path() && this.path().substr(0, 1).match(/[0-9]/)) {
	        s += ':' + this.port();
	      }
	    }

	    return s;
	  };

	  /**
	   * Adds a trailing slash to the path
	   */
	  Uri.prototype.addTrailingSlash = function () {
	    var path = this.path() || '';

	    if (path.substr(-1) !== '/') {
	      this.path(path + '/');
	    }

	    return this;
	  };

	  /**
	   * Serializes the internal state of the Uri object
	   * @return {string}
	   */
	  Uri.prototype.toString = function () {
	    var path,
	        s = this.origin();

	    if (this.isColonUri()) {
	      if (this.path()) {
	        s += ':' + this.path();
	      }
	    } else if (this.path()) {
	      path = this.path();
	      if (!(re.ends_with_slashes.test(s) || re.starts_with_slashes.test(path))) {
	        s += '/';
	      } else {
	        if (s) {
	          s.replace(re.ends_with_slashes, '/');
	        }
	        path = path.replace(re.starts_with_slashes, '/');
	      }
	      s += path;
	    } else {
	      if (this.host() && (this.query().toString() || this.anchor())) {
	        s += '/';
	      }
	    }
	    if (this.query().toString()) {
	      s += this.query().toString();
	    }

	    if (this.anchor()) {
	      if (this.anchor().indexOf('#') !== 0) {
	        s += '#';
	      }
	      s += this.anchor();
	    }

	    return s;
	  };

	  /**
	   * Clone a Uri object
	   * @return {Uri} duplicate copy of the Uri
	   */
	  Uri.prototype.clone = function () {
	    return new Uri(this.toString());
	  };

	  /**
	   * export via AMD or CommonJS, otherwise leak a global
	   */
	  if (typeof define === 'function' && define.amd) {
	    define(function () {
	      return Uri;
	    });
	  } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	    module.exports = Uri;
	  } else {
	    global.Uri = Uri;
	  }
	})(this);
	});

	var jsuri = interopDefault(Uri);

	var b64 = createCommonjsModule(function (module, exports) {
	'use strict';

	exports.toByteArray = toByteArray;
	exports.fromByteArray = fromByteArray;

	var lookup = [];
	var revLookup = [];
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

	function init() {
	  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	  for (var i = 0, len = code.length; i < len; ++i) {
	    lookup[i] = code[i];
	    revLookup[code.charCodeAt(i)] = i;
	  }

	  revLookup['-'.charCodeAt(0)] = 62;
	  revLookup['_'.charCodeAt(0)] = 63;
	}

	init();

	function toByteArray(b64) {
	  var i, j, l, tmp, placeHolders, arr;
	  var len = b64.length;

	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4');
	  }

	  // the number of equal signs (place holders)
	  // if there are two placeholders, than the two characters before it
	  // represent one byte
	  // if there is only one, then the three characters before it represent 2 bytes
	  // this is just a cheap hack to not do indexOf twice
	  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

	  // base64 is 4/3 + up to two characters of the original data
	  arr = new Arr(len * 3 / 4 - placeHolders);

	  // if there are placeholders, only get up to the last complete 4 chars
	  l = placeHolders > 0 ? len - 4 : len;

	  var L = 0;

	  for (i = 0, j = 0; i < l; i += 4, j += 3) {
	    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
	    arr[L++] = tmp >> 16 & 0xFF;
	    arr[L++] = tmp >> 8 & 0xFF;
	    arr[L++] = tmp & 0xFF;
	  }

	  if (placeHolders === 2) {
	    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
	    arr[L++] = tmp & 0xFF;
	  } else if (placeHolders === 1) {
	    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
	    arr[L++] = tmp >> 8 & 0xFF;
	    arr[L++] = tmp & 0xFF;
	  }

	  return arr;
	}

	function tripletToBase64(num) {
	  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
	}

	function encodeChunk(uint8, start, end) {
	  var tmp;
	  var output = [];
	  for (var i = start; i < end; i += 3) {
	    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
	    output.push(tripletToBase64(tmp));
	  }
	  return output.join('');
	}

	function fromByteArray(uint8) {
	  var tmp;
	  var len = uint8.length;
	  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
	  var output = '';
	  var parts = [];
	  var maxChunkLength = 16383; // must be multiple of 3

	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
	  }

	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1];
	    output += lookup[tmp >> 2];
	    output += lookup[tmp << 4 & 0x3F];
	    output += '==';
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
	    output += lookup[tmp >> 10];
	    output += lookup[tmp >> 4 & 0x3F];
	    output += lookup[tmp << 2 & 0x3F];
	    output += '=';
	  }

	  parts.push(output);

	  return parts.join('');
	}
	});

	interopDefault(b64);
	var fromByteArray = b64.fromByteArray;
	var toByteArray = b64.toByteArray;

	// This is free and unencumbered software released into the public domain.
	// See LICENSE.md for more information.

	//
	// Utilities
	//

	/**
	 * @param {number} a The number to test.
	 * @param {number} min The minimum value in the range, inclusive.
	 * @param {number} max The maximum value in the range, inclusive.
	 * @return {boolean} True if a >= min and a <= max.
	 */

	function inRange(a, min, max) {
	  return min <= a && a <= max;
	}

	/**
	 * @param {*} o
	 * @return {Object}
	 */
	function ToDictionary(o) {
	  if (o === undefined) return {};
	  if (o === Object(o)) return o;
	  throw TypeError('Could not convert argument to dictionary');
	}

	/**
	 * @param {string} string Input string of UTF-16 code units.
	 * @return {!Array.<number>} Code points.
	 */
	function stringToCodePoints(string) {
	  // https://heycam.github.io/webidl/#dfn-obtain-unicode

	  // 1. Let S be the DOMString value.
	  var s = String(string);

	  // 2. Let n be the length of S.
	  var n = s.length;

	  // 3. Initialize i to 0.
	  var i = 0;

	  // 4. Initialize U to be an empty sequence of Unicode characters.
	  var u = [];

	  // 5. While i < n:
	  while (i < n) {

	    // 1. Let c be the code unit in S at index i.
	    var c = s.charCodeAt(i);

	    // 2. Depending on the value of c:

	    // c < 0xD800 or c > 0xDFFF
	    if (c < 0xD800 || c > 0xDFFF) {
	      // Append to U the Unicode character with code point c.
	      u.push(c);
	    }

	    // 0xDC00 ≤ c ≤ 0xDFFF
	    else if (0xDC00 <= c && c <= 0xDFFF) {
	        // Append to U a U+FFFD REPLACEMENT CHARACTER.
	        u.push(0xFFFD);
	      }

	      // 0xD800 ≤ c ≤ 0xDBFF
	      else if (0xD800 <= c && c <= 0xDBFF) {
	          // 1. If i = n−1, then append to U a U+FFFD REPLACEMENT
	          // CHARACTER.
	          if (i === n - 1) {
	            u.push(0xFFFD);
	          }
	          // 2. Otherwise, i < n−1:
	          else {
	              // 1. Let d be the code unit in S at index i+1.
	              var d = string.charCodeAt(i + 1);

	              // 2. If 0xDC00 ≤ d ≤ 0xDFFF, then:
	              if (0xDC00 <= d && d <= 0xDFFF) {
	                // 1. Let a be c & 0x3FF.
	                var a = c & 0x3FF;

	                // 2. Let b be d & 0x3FF.
	                var b = d & 0x3FF;

	                // 3. Append to U the Unicode character with code point
	                // 2^16+2^10*a+b.
	                u.push(0x10000 + (a << 10) + b);

	                // 4. Set i to i+1.
	                i += 1;
	              }

	              // 3. Otherwise, d < 0xDC00 or d > 0xDFFF. Append to U a
	              // U+FFFD REPLACEMENT CHARACTER.
	              else {
	                  u.push(0xFFFD);
	                }
	            }
	        }

	    // 3. Set i to i+1.
	    i += 1;
	  }

	  // 6. Return U.
	  return u;
	}

	/**
	 * @param {!Array.<number>} code_points Array of code points.
	 * @return {string} string String of UTF-16 code units.
	 */
	function codePointsToString(code_points) {
	  var s = '';
	  for (var i = 0; i < code_points.length; ++i) {
	    var cp = code_points[i];
	    if (cp <= 0xFFFF) {
	      s += String.fromCharCode(cp);
	    } else {
	      cp -= 0x10000;
	      s += String.fromCharCode((cp >> 10) + 0xD800, (cp & 0x3FF) + 0xDC00);
	    }
	  }
	  return s;
	}

	//
	// Implementation of Encoding specification
	// https://encoding.spec.whatwg.org/
	//

	//
	// 3. Terminology
	//

	/**
	 * End-of-stream is a special token that signifies no more tokens
	 * are in the stream.
	 * @const
	 */var end_of_stream = -1;

	/**
	 * A stream represents an ordered sequence of tokens.
	 *
	 * @constructor
	 * @param {!(Array.<number>|Uint8Array)} tokens Array of tokens that provide the
	 * stream.
	 */
	function Stream(tokens) {
	  /** @type {!Array.<number>} */
	  this.tokens = [].slice.call(tokens);
	}

	Stream.prototype = {
	  /**
	   * @return {boolean} True if end-of-stream has been hit.
	   */
	  endOfStream: function endOfStream() {
	    return !this.tokens.length;
	  },

	  /**
	   * When a token is read from a stream, the first token in the
	   * stream must be returned and subsequently removed, and
	   * end-of-stream must be returned otherwise.
	   *
	   * @return {number} Get the next token from the stream, or
	   * end_of_stream.
	   */
	  read: function read() {
	    if (!this.tokens.length) return end_of_stream;
	    return this.tokens.shift();
	  },

	  /**
	   * When one or more tokens are prepended to a stream, those tokens
	   * must be inserted, in given order, before the first token in the
	   * stream.
	   *
	   * @param {(number|!Array.<number>)} token The token(s) to prepend to the stream.
	   */
	  prepend: function prepend(token) {
	    if (Array.isArray(token)) {
	      var tokens = /**@type {!Array.<number>}*/token;
	      while (tokens.length) {
	        this.tokens.unshift(tokens.pop());
	      }
	    } else {
	      this.tokens.unshift(token);
	    }
	  },

	  /**
	   * When one or more tokens are pushed to a stream, those tokens
	   * must be inserted, in given order, after the last token in the
	   * stream.
	   *
	   * @param {(number|!Array.<number>)} token The tokens(s) to prepend to the stream.
	   */
	  push: function push(token) {
	    if (Array.isArray(token)) {
	      var tokens = /**@type {!Array.<number>}*/token;
	      while (tokens.length) {
	        this.tokens.push(tokens.shift());
	      }
	    } else {
	      this.tokens.push(token);
	    }
	  }
	};

	//
	// 4. Encodings
	//

	// 4.1 Encoders and decoders

	/** @const */
	var finished = -1;

	/**
	 * @param {boolean} fatal If true, decoding errors raise an exception.
	 * @param {number=} opt_code_point Override the standard fallback code point.
	 * @return {number} The code point to insert on a decoding error.
	 */
	function decoderError(fatal, opt_code_point) {
	  if (fatal) throw TypeError('Decoder error');
	  return opt_code_point || 0xFFFD;
	}

	//
	// 7. API
	//

	/** @const */var DEFAULT_ENCODING = 'utf-8';

	// 7.1 Interface TextDecoder

	/**
	 * @constructor
	 * @param {string=} encoding The label of the encoding;
	 *     defaults to 'utf-8'.
	 * @param {Object=} options
	 */
	function TextDecoder(encoding, options) {
	  if (!(this instanceof TextDecoder)) {
	    return new TextDecoder(encoding, options);
	  }
	  encoding = encoding !== undefined ? String(encoding).toLowerCase() : DEFAULT_ENCODING;
	  if (encoding !== DEFAULT_ENCODING) {
	    throw new Error('Encoding not supported. Only utf-8 is supported');
	  }
	  options = ToDictionary(options);

	  /** @private @type {boolean} */
	  this._streaming = false;
	  /** @private @type {boolean} */
	  this._BOMseen = false;
	  /** @private @type {?Decoder} */
	  this._decoder = null;
	  /** @private @type {boolean} */
	  this._fatal = Boolean(options['fatal']);
	  /** @private @type {boolean} */
	  this._ignoreBOM = Boolean(options['ignoreBOM']);

	  Object.defineProperty(this, 'encoding', { value: 'utf-8' });
	  Object.defineProperty(this, 'fatal', { value: this._fatal });
	  Object.defineProperty(this, 'ignoreBOM', { value: this._ignoreBOM });
	}

	TextDecoder.prototype = {
	  /**
	   * @param {ArrayBufferView=} input The buffer of bytes to decode.
	   * @param {Object=} options
	   * @return {string} The decoded string.
	   */
	  decode: function decode(input, options) {
	    var bytes;
	    if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object' && input instanceof ArrayBuffer) {
	      bytes = new Uint8Array(input);
	    } else if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object' && 'buffer' in input && input.buffer instanceof ArrayBuffer) {
	      bytes = new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
	    } else {
	      bytes = new Uint8Array(0);
	    }

	    options = ToDictionary(options);

	    if (!this._streaming) {
	      this._decoder = new UTF8Decoder({ fatal: this._fatal });
	      this._BOMseen = false;
	    }
	    this._streaming = Boolean(options['stream']);

	    var input_stream = new Stream(bytes);

	    var code_points = [];

	    /** @type {?(number|!Array.<number>)} */
	    var result;

	    while (!input_stream.endOfStream()) {
	      result = this._decoder.handler(input_stream, input_stream.read());
	      if (result === finished) break;
	      if (result === null) continue;
	      if (Array.isArray(result)) code_points.push.apply(code_points, /**@type {!Array.<number>}*/result);else code_points.push(result);
	    }
	    if (!this._streaming) {
	      do {
	        result = this._decoder.handler(input_stream, input_stream.read());
	        if (result === finished) break;
	        if (result === null) continue;
	        if (Array.isArray(result)) code_points.push.apply(code_points, /**@type {!Array.<number>}*/result);else code_points.push(result);
	      } while (!input_stream.endOfStream());
	      this._decoder = null;
	    }

	    if (code_points.length) {
	      // If encoding is one of utf-8, utf-16be, and utf-16le, and
	      // ignore BOM flag and BOM seen flag are unset, run these
	      // subsubsteps:
	      if (['utf-8'].indexOf(this.encoding) !== -1 && !this._ignoreBOM && !this._BOMseen) {
	        // If token is U+FEFF, set BOM seen flag.
	        if (code_points[0] === 0xFEFF) {
	          this._BOMseen = true;
	          code_points.shift();
	        } else {
	          // Otherwise, if token is not end-of-stream, set BOM seen
	          // flag and append token to output.
	          this._BOMseen = true;
	        }
	      }
	    }

	    return codePointsToString(code_points);
	  }
	};

	// 7.2 Interface TextEncoder

	/**
	 * @constructor
	 * @param {string=} encoding The label of the encoding;
	 *     defaults to 'utf-8'.
	 * @param {Object=} options
	 */
	function TextEncoder(encoding, options) {
	  if (!(this instanceof TextEncoder)) return new TextEncoder(encoding, options);
	  encoding = encoding !== undefined ? String(encoding).toLowerCase() : DEFAULT_ENCODING;
	  if (encoding !== DEFAULT_ENCODING) {
	    throw new Error('Encoding not supported. Only utf-8 is supported');
	  }
	  options = ToDictionary(options);

	  /** @private @type {boolean} */
	  this._streaming = false;
	  /** @private @type {?Encoder} */
	  this._encoder = null;
	  /** @private @type {{fatal: boolean}} */
	  this._options = { fatal: Boolean(options['fatal']) };

	  Object.defineProperty(this, 'encoding', { value: 'utf-8' });
	}

	TextEncoder.prototype = {
	  /**
	   * @param {string=} opt_string The string to encode.
	   * @param {Object=} options
	   * @return {Uint8Array} Encoded bytes, as a Uint8Array.
	   */
	  encode: function encode(opt_string, options) {
	    opt_string = opt_string ? String(opt_string) : '';
	    options = ToDictionary(options);

	    // NOTE: This option is nonstandard. None of the encodings
	    // permitted for encoding (i.e. UTF-8, UTF-16) are stateful,
	    // so streaming is not necessary.
	    if (!this._streaming) this._encoder = new UTF8Encoder(this._options);
	    this._streaming = Boolean(options['stream']);

	    var bytes = [];
	    var input_stream = new Stream(stringToCodePoints(opt_string));
	    /** @type {?(number|!Array.<number>)} */
	    var result;
	    while (!input_stream.endOfStream()) {
	      result = this._encoder.handler(input_stream, input_stream.read());
	      if (result === finished) break;
	      if (Array.isArray(result)) bytes.push.apply(bytes, /**@type {!Array.<number>}*/result);else bytes.push(result);
	    }
	    if (!this._streaming) {
	      while (true) {
	        result = this._encoder.handler(input_stream, input_stream.read());
	        if (result === finished) break;
	        if (Array.isArray(result)) bytes.push.apply(bytes, /**@type {!Array.<number>}*/result);else bytes.push(result);
	      }
	      this._encoder = null;
	    }
	    return new Uint8Array(bytes);
	  }
	};

	//
	// 8. The encoding
	//

	// 8.1 utf-8

	/**
	 * @constructor
	 * @implements {Decoder}
	 * @param {{fatal: boolean}} options
	 */
	function UTF8Decoder(options) {
	  var fatal = options.fatal;

	  // utf-8's decoder's has an associated utf-8 code point, utf-8
	  // bytes seen, and utf-8 bytes needed (all initially 0), a utf-8
	  // lower boundary (initially 0x80), and a utf-8 upper boundary
	  // (initially 0xBF).
	  var /** @type {number} */utf8_code_point = 0,

	  /** @type {number} */utf8_bytes_seen = 0,

	  /** @type {number} */utf8_bytes_needed = 0,

	  /** @type {number} */utf8_lower_boundary = 0x80,

	  /** @type {number} */utf8_upper_boundary = 0xBF;

	  /**
	   * @param {Stream} stream The stream of bytes being decoded.
	   * @param {number} bite The next byte read from the stream.
	   * @return {?(number|!Array.<number>)} The next code point(s)
	   *     decoded, or null if not enough data exists in the input
	   *     stream to decode a complete code point.
	   */
	  this.handler = function (stream, bite) {
	    // 1. If byte is end-of-stream and utf-8 bytes needed is not 0,
	    // set utf-8 bytes needed to 0 and return error.
	    if (bite === end_of_stream && utf8_bytes_needed !== 0) {
	      utf8_bytes_needed = 0;
	      return decoderError(fatal);
	    }

	    // 2. If byte is end-of-stream, return finished.
	    if (bite === end_of_stream) return finished;

	    // 3. If utf-8 bytes needed is 0, based on byte:
	    if (utf8_bytes_needed === 0) {

	      // 0x00 to 0x7F
	      if (inRange(bite, 0x00, 0x7F)) {
	        // Return a code point whose value is byte.
	        return bite;
	      }

	      // 0xC2 to 0xDF
	      if (inRange(bite, 0xC2, 0xDF)) {
	        // Set utf-8 bytes needed to 1 and utf-8 code point to byte
	        // − 0xC0.
	        utf8_bytes_needed = 1;
	        utf8_code_point = bite - 0xC0;
	      }

	      // 0xE0 to 0xEF
	      else if (inRange(bite, 0xE0, 0xEF)) {
	          // 1. If byte is 0xE0, set utf-8 lower boundary to 0xA0.
	          if (bite === 0xE0) utf8_lower_boundary = 0xA0;
	          // 2. If byte is 0xED, set utf-8 upper boundary to 0x9F.
	          if (bite === 0xED) utf8_upper_boundary = 0x9F;
	          // 3. Set utf-8 bytes needed to 2 and utf-8 code point to
	          // byte − 0xE0.
	          utf8_bytes_needed = 2;
	          utf8_code_point = bite - 0xE0;
	        }

	        // 0xF0 to 0xF4
	        else if (inRange(bite, 0xF0, 0xF4)) {
	            // 1. If byte is 0xF0, set utf-8 lower boundary to 0x90.
	            if (bite === 0xF0) utf8_lower_boundary = 0x90;
	            // 2. If byte is 0xF4, set utf-8 upper boundary to 0x8F.
	            if (bite === 0xF4) utf8_upper_boundary = 0x8F;
	            // 3. Set utf-8 bytes needed to 3 and utf-8 code point to
	            // byte − 0xF0.
	            utf8_bytes_needed = 3;
	            utf8_code_point = bite - 0xF0;
	          }

	          // Otherwise
	          else {
	              // Return error.
	              return decoderError(fatal);
	            }

	      // Then (byte is in the range 0xC2 to 0xF4) set utf-8 code
	      // point to utf-8 code point << (6 × utf-8 bytes needed) and
	      // return continue.
	      utf8_code_point = utf8_code_point << 6 * utf8_bytes_needed;
	      return null;
	    }

	    // 4. If byte is not in the range utf-8 lower boundary to utf-8
	    // upper boundary, run these substeps:
	    if (!inRange(bite, utf8_lower_boundary, utf8_upper_boundary)) {

	      // 1. Set utf-8 code point, utf-8 bytes needed, and utf-8
	      // bytes seen to 0, set utf-8 lower boundary to 0x80, and set
	      // utf-8 upper boundary to 0xBF.
	      utf8_code_point = utf8_bytes_needed = utf8_bytes_seen = 0;
	      utf8_lower_boundary = 0x80;
	      utf8_upper_boundary = 0xBF;

	      // 2. Prepend byte to stream.
	      stream.prepend(bite);

	      // 3. Return error.
	      return decoderError(fatal);
	    }

	    // 5. Set utf-8 lower boundary to 0x80 and utf-8 upper boundary
	    // to 0xBF.
	    utf8_lower_boundary = 0x80;
	    utf8_upper_boundary = 0xBF;

	    // 6. Increase utf-8 bytes seen by one and set utf-8 code point
	    // to utf-8 code point + (byte − 0x80) << (6 × (utf-8 bytes
	    // needed − utf-8 bytes seen)).
	    utf8_bytes_seen += 1;
	    utf8_code_point += bite - 0x80 << 6 * (utf8_bytes_needed - utf8_bytes_seen);

	    // 7. If utf-8 bytes seen is not equal to utf-8 bytes needed,
	    // continue.
	    if (utf8_bytes_seen !== utf8_bytes_needed) return null;

	    // 8. Let code point be utf-8 code point.
	    var code_point = utf8_code_point;

	    // 9. Set utf-8 code point, utf-8 bytes needed, and utf-8 bytes
	    // seen to 0.
	    utf8_code_point = utf8_bytes_needed = utf8_bytes_seen = 0;

	    // 10. Return a code point whose value is code point.
	    return code_point;
	  };
	}

	/**
	 * @constructor
	 * @implements {Encoder}
	 * @param {{fatal: boolean}} options
	 */
	function UTF8Encoder(options) {
	  var fatal = options.fatal;
	  /**
	   * @param {Stream} stream Input stream.
	   * @param {number} code_point Next code point read from the stream.
	   * @return {(number|!Array.<number>)} Byte(s) to emit.
	   */
	  this.handler = function (stream, code_point) {
	    // 1. If code point is end-of-stream, return finished.
	    if (code_point === end_of_stream) return finished;

	    // 2. If code point is in the range U+0000 to U+007F, return a
	    // byte whose value is code point.
	    if (inRange(code_point, 0x0000, 0x007f)) return code_point;

	    // 3. Set count and offset based on the range code point is in:
	    var count, offset;
	    // U+0080 to U+07FF:    1 and 0xC0
	    if (inRange(code_point, 0x0080, 0x07FF)) {
	      count = 1;
	      offset = 0xC0;
	    }
	    // U+0800 to U+FFFF:    2 and 0xE0
	    else if (inRange(code_point, 0x0800, 0xFFFF)) {
	        count = 2;
	        offset = 0xE0;
	      }
	      // U+10000 to U+10FFFF: 3 and 0xF0
	      else if (inRange(code_point, 0x10000, 0x10FFFF)) {
	          count = 3;
	          offset = 0xF0;
	        }

	    // 4.Let bytes be a byte sequence whose first byte is (code
	    // point >> (6 × count)) + offset.
	    var bytes = [(code_point >> 6 * count) + offset];

	    // 5. Run these substeps while count is greater than 0:
	    while (count > 0) {

	      // 1. Set temp to code point >> (6 × (count − 1)).
	      var temp = code_point >> 6 * (count - 1);

	      // 2. Append to bytes 0x80 | (temp & 0x3F).
	      bytes.push(0x80 | temp & 0x3F);

	      // 3. Decrease count by one.
	      count -= 1;
	    }

	    // 6. Return bytes bytes, in order.
	    return bytes;
	  };
	}

	var base64 = {
	  encode: function encode(string) {
	    return fromByteArray(TextEncoder('utf-8').encode(string));
	  },
	  decode: function decode(string) {
	    var padding = 4 - string.length % 4;
	    if (padding === 1) {
	      string += '=';
	    } else if (padding === 2) {
	      string += '==';
	    }
	    return TextDecoder('utf-8').decode(toByteArray(string));
	  }
	};

	function parseJwtIssuer(jwt) {
	  return parseJwtClaims(jwt)['iss'];
	}

	function parseJwtClaims(jwt) {

	  if (null === jwt || '' === jwt) {
	    throw 'Invalid JWT: must be neither null nor empty-string.';
	  }

	  var firstPeriodIndex = jwt.indexOf('.');
	  var secondPeriodIndex = jwt.indexOf('.', firstPeriodIndex + 1);

	  if (firstPeriodIndex < 0 || secondPeriodIndex <= firstPeriodIndex) {
	    throw 'Invalid JWT: must contain 2 period (".") characters.';
	  }

	  var encodedClaims = jwt.substring(firstPeriodIndex + 1, secondPeriodIndex);

	  if (null === encodedClaims || '' === encodedClaims) {
	    throw 'Invalid JWT: encoded claims must be neither null nor empty-string.';
	  }

	  var claimsString = base64.decode.call(window, encodedClaims);
	  return JSON.parse(claimsString);
	}

	function isJwtExpired$1(jwtString, skew) {
	  if (skew === undefined) {
	    skew = 60; // give a minute of leeway to allow clock skew
	  }
	  var claims = parseJwtClaims(jwtString);
	  var expires = 0;
	  var now = Math.floor(Date.now() / 1000); // UTC timestamp now

	  if (claims && claims.exp) {
	    expires = claims.exp;
	  }

	  if (expires - now < skew) {
	    return true;
	  }

	  return false;
	}

	var jwtUtil = {
	  parseJwtIssuer: parseJwtIssuer,
	  parseJwtClaims: parseJwtClaims,
	  isJwtExpired: isJwtExpired$1
	};

	function isJwtExpired(urlStr) {
	  var jwtStr = _getJwt(urlStr);
	  return jwtUtil.isJwtExpired(jwtStr);
	}

	function _getJwt(urlStr) {
	  var url = new jsuri(urlStr);
	  return url.getQueryParamValue('jwt');
	}

	function hasJwt(url) {
	  var jwt = _getJwt(url);
	  return jwt && _getJwt(url).length !== 0;
	}

	var urlUtil = {
	  hasJwt: hasJwt,
	  isJwtExpired: isJwtExpired
	};

	var iframeUtils = {
	  optionsToAttributes: function optionsToAttributes(options) {
	    var sanitized = {};
	    if (options && (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
	      if (options.width) {
	        sanitized.width = util$1.stringToDimension(options.width);
	      }
	      if (options.height) {
	        sanitized.height = util$1.stringToDimension(options.height);
	      }
	    }
	    return sanitized;
	  }
	};

	var Iframe = function () {
	  function Iframe() {
	    classCallCheck(this, Iframe);

	    this._contentResolver = false;
	  }

	  createClass(Iframe, [{
	    key: 'setContentResolver',
	    value: function setContentResolver(callback) {
	      this._contentResolver = callback;
	    }
	  }, {
	    key: 'resize',
	    value: function resize(width, height, $el) {
	      width = util$1.stringToDimension(width);
	      height = util$1.stringToDimension(height);
	      $el.css({
	        width: width,
	        height: height
	      });
	      $el.trigger('resized', { width: width, height: height });
	    }
	  }, {
	    key: 'simpleXdmExtension',
	    value: function simpleXdmExtension(extension, $container) {
	      if (!extension.url || urlUtil.hasJwt(extension.url) && urlUtil.isJwtExpired(extension.url)) {
	        if (this._contentResolver) {
	          JwtActions.requestRefreshUrl({
	            extension: extension,
	            resolver: this._contentResolver,
	            $container: $container
	          });
	        } else {
	          console.error('JWT is expired and no content resolver was specified');
	        }
	      } else {
	        this._appendExtension($container, this._simpleXdmCreate(extension));
	      }
	    }
	  }, {
	    key: '_simpleXdmCreate',
	    value: function _simpleXdmCreate(extension) {
	      var iframeAttributes = host.create(extension, function () {
	        if (!extension.options) {
	          extension.options = {};
	        }
	        IframeActions.notifyBridgeEstablished(extension.$el, extension);
	      }, function () {
	        IframeActions.notifyUnloaded(extension.$el, extension);
	      });
	      extension.id = iframeAttributes.id;
	      $$1.extend(iframeAttributes, iframeUtils.optionsToAttributes(extension.options));
	      extension.$el = this.render(iframeAttributes);
	      return extension;
	    }
	  }, {
	    key: '_appendExtension',
	    value: function _appendExtension($container, extension) {
	      var existingFrame = $container.find('iframe');
	      if (existingFrame.length > 0) {
	        existingFrame.destroy();
	      }
	      $container.prepend(extension.$el);
	      IframeActions.notifyIframeCreated(extension.$el, extension);
	    }
	  }, {
	    key: 'resolverResponse',
	    value: function resolverResponse(data) {
	      var simpleExtension = this._simpleXdmCreate(data.extension);
	      this._appendExtension(data.$container, simpleExtension);
	    }
	  }, {
	    key: 'render',
	    value: function render(attributes) {
	      return $$1('<iframe />').attr(attributes).addClass('ap-iframe');
	    }
	  }]);
	  return Iframe;
	}();

	var IframeComponent = new Iframe();

	EventDispatcher$1.register('iframe-resize', function (data) {
	  IframeComponent.resize(data.width, data.height, data.$el);
	});

	EventDispatcher$1.register('content-resolver-register-by-extension', function (data) {
	  IframeComponent.setContentResolver(data.callback);
	});

	EventDispatcher$1.register('jwt-url-refreshed', function (data) {
	  IframeComponent.resolverResponse(data);
	});

	EventDispatcher$1.register('after:iframe-bridge-established', function (data) {
	  data.$el[0].bridgeEstablished = true;
	});

	var LoadingIndicatorActions = {
	  timeout: function timeout($el, extension) {
	    EventDispatcher$1.dispatch('iframe-bridge-timeout', { $el: $el, extension: extension });
	  },
	  cancelled: function cancelled($el, extension) {
	    EventDispatcher$1.dispatch('iframe-bridge-cancelled', { $el: $el, extension: extension });
	  }
	};

	var LOADING_INDICATOR_CLASS = 'ap-status-indicator';

	var LOADING_STATUSES = {
	  loading: '<div class="ap-loading"><div class="small-spinner"></div>Loading add-on...</div>',
	  'load-timeout': '<div class="ap-load-timeout"><div class="small-spinner"></div>Add-on is not responding. Wait or <a href="#" class="ap-btn-cancel">cancel</a>?</div>',
	  'load-error': 'Add-on failed to load.'
	};

	var LOADING_TIMEOUT = 12000;

	var LoadingIndicator = function () {
	  function LoadingIndicator() {
	    classCallCheck(this, LoadingIndicator);

	    this._stateRegistry = {};
	  }

	  createClass(LoadingIndicator, [{
	    key: '_loadingContainer',
	    value: function _loadingContainer($iframeContainer) {
	      return $iframeContainer.find('.' + LOADING_INDICATOR_CLASS);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var $container = $$1('<div />').addClass(LOADING_INDICATOR_CLASS);
	      $container.append(LOADING_STATUSES.loading);
	      var spinner = $container.find('.small-spinner');
	      if (spinner.length && spinner.spin) {
	        spinner.spin({ lines: 12, length: 3, width: 2, radius: 3, trail: 60, speed: 1.5, zIndex: 1 });
	      }
	      return $container;
	    }
	  }, {
	    key: 'hide',
	    value: function hide($iframeContainer, extensionId) {
	      clearTimeout(this._stateRegistry[extensionId]);
	      delete this._stateRegistry[extensionId];
	      this._loadingContainer($iframeContainer).hide();
	    }
	  }, {
	    key: 'cancelled',
	    value: function cancelled($iframeContainer, extensionId) {
	      var status = LOADING_STATUSES['load-error'];
	      this._loadingContainer($iframeContainer).empty().text(status);
	    }
	  }, {
	    key: '_setupTimeout',
	    value: function _setupTimeout($container, extension) {
	      this._stateRegistry[extension.id] = setTimeout(function () {
	        LoadingIndicatorActions.timeout($container, extension);
	      }, LOADING_TIMEOUT);
	    }
	  }, {
	    key: 'timeout',
	    value: function timeout($iframeContainer, extensionId) {
	      var status = $$1(LOADING_STATUSES['load-timeout']);
	      var container = this._loadingContainer($iframeContainer);
	      container.empty().append(status);
	      $$1('a.ap-btn-cancel', container).click(function () {
	        LoadingIndicatorActions.cancelled($iframeContainer, extensionId);
	      });
	      delete this._stateRegistry[extensionId];
	      return container;
	    }
	  }]);
	  return LoadingIndicator;
	}();

	var LoadingComponent = new LoadingIndicator();

	EventDispatcher$1.register('iframe-create', function (data) {
	  LoadingComponent._setupTimeout(data.$el.parents('.ap-iframe-container'), data.extension);
	});

	EventDispatcher$1.register('iframe-bridge-established', function (data) {
	  LoadingComponent.hide(data.$el.parents('.ap-iframe-container'), data.extension.id);
	});

	EventDispatcher$1.register('iframe-bridge-timeout', function (data) {
	  LoadingComponent.timeout(data.$el, data.extension.id);
	});

	EventDispatcher$1.register('iframe-bridge-cancelled', function (data) {
	  LoadingComponent.cancelled(data.$el, data.extension.id);
	});

	var CONTAINER_CLASSES = ['ap-iframe-container'];

	var IframeContainer = function () {
	  function IframeContainer() {
	    classCallCheck(this, IframeContainer);
	  }

	  createClass(IframeContainer, [{
	    key: 'createExtension',
	    value: function createExtension(extension, options) {
	      var $container = this._renderContainer();
	      if (!options || options.loadingIndicator !== false) {
	        $container.append(this._renderLoadingIndicator());
	      }
	      IframeComponent.simpleXdmExtension(extension, $container);
	      return $container;
	    }
	  }, {
	    key: '_renderContainer',
	    value: function _renderContainer(attributes) {
	      var container = $$1('<div />').attr(attributes || {});
	      container.addClass(CONTAINER_CLASSES.join(' '));
	      return container;
	    }
	  }, {
	    key: '_renderLoadingIndicator',
	    value: function _renderLoadingIndicator() {
	      return LoadingComponent.render();
	    }
	  }]);
	  return IframeContainer;
	}();

	var IframeContainerComponent = new IframeContainer();

	EventDispatcher$1.register('iframe-create', function (data) {
	  var id = 'embedded-' + data.extension.id;
	  data.extension.$el.parents('.ap-iframe-container').attr('id', id);
	});

	function create(extension) {
	  var simpleXdmExtension = {
	    addon_key: extension.addon_key,
	    key: extension.key,
	    url: extension.url,
	    origin: extension.origin,
	    options: extension.options
	  };
	  return IframeContainerComponent.createExtension(simpleXdmExtension);
	}

	var DialogExtensionActions = {
	  open: function open(extension, options) {
	    EventDispatcher$1.dispatch('dialog-extension-open', {
	      extension: extension,
	      options: options
	    });
	  },
	  close: function close() {
	    EventDispatcher$1.dispatch('dialog-close-active', {});
	  },
	  addUserButton: function addUserButton(options, extension) {
	    EventDispatcher$1.dispatch('dialog-button-add', {
	      button: {
	        text: options.text,
	        identifier: options.identifier,
	        data: {
	          userButton: true
	        }
	      },
	      extension: extension
	    });
	  }
	};

	var DialogActions = {
	  close: function close(data) {
	    EventDispatcher$1.dispatch('dialog-close', {
	      dialog: data.dialog,
	      extension: data.extension,
	      customData: data.customData
	    });
	  },
	  closeActive: function closeActive(data) {
	    EventDispatcher$1.dispatch('dialog-close-active', data);
	  },
	  clickButton: function clickButton(identifier, $el, extension) {
	    EventDispatcher$1.dispatch('dialog-button-click', {
	      identifier: identifier,
	      $el: $el,
	      extension: extension
	    });
	  },
	  toggleButton: function toggleButton(data) {
	    EventDispatcher$1.dispatch('dialog-button-toggle', data);
	  },
	  toggleButtonVisibility: function toggleButtonVisibility(data) {
	    EventDispatcher$1.dispatch('dialog-button-toggle-visibility', data);
	  }
	};

	var DomEventActions = {
	  registerKeyEvent: function registerKeyEvent(data) {
	    host.registerKeyListener(data.extension_id, data.key, data.modifiers, data.callback);
	    EventDispatcher$1.dispatch('dom-event-register', data);
	  },
	  unregisterKeyEvent: function unregisterKeyEvent(data) {
	    host.unregisterKeyListener(data.extension_id, data.key, data.modifiers, data.callback);
	    EventDispatcher$1.dispatch('dom-event-unregister', data);
	  },
	  registerWindowKeyEvent: function registerWindowKeyEvent(data) {
	    window.addEventListener('keydown', function (event) {
	      if (event.keyCode === data.keyCode) {
	        data.callback();
	      }
	    });
	  }
	};

	var ButtonUtils = function () {
	  function ButtonUtils() {
	    classCallCheck(this, ButtonUtils);
	  }

	  createClass(ButtonUtils, [{
	    key: "randomIdentifier",

	    // button identifier for XDM. NOT an id attribute
	    value: function randomIdentifier() {
	      return Math.random().toString(16).substring(7);
	    }
	  }]);
	  return ButtonUtils;
	}();

	var buttonUtilsInstance = new ButtonUtils();

	var DialogUtils = function () {
	  function DialogUtils() {
	    classCallCheck(this, DialogUtils);
	  }

	  createClass(DialogUtils, [{
	    key: '_size',
	    value: function _size(options) {
	      var size = options.size;
	      if (options.size === 'x-large') {
	        size = 'xlarge';
	      }
	      if (options.width === '100%' && options.height === '100%') {
	        size = 'fullscreen';
	      }
	      if (!options.size && !options.width && !options.height) {
	        size = 'medium';
	      }
	      return size;
	    }
	  }, {
	    key: '_header',
	    value: function _header(text) {
	      var headerText = '';
	      switch (typeof text === 'undefined' ? 'undefined' : _typeof(text)) {
	        case 'string':
	          headerText = text;
	          break;

	        case 'object':
	          headerText = text.value;
	          break;
	      }

	      return headerText;
	    }
	  }, {
	    key: '_hint',
	    value: function _hint(text) {
	      if (typeof text === 'string') {
	        return text;
	      }
	      return '';
	    }
	  }, {
	    key: '_chrome',
	    value: function _chrome(options) {
	      var returnval = false;
	      if (typeof options.chrome === 'boolean') {
	        returnval = options.chrome;
	      }
	      if (options.size === 'fullscreen') {
	        returnval = true;
	      }
	      return returnval;
	    }
	  }, {
	    key: '_width',
	    value: function _width(options) {
	      if (options.size) {
	        return undefined;
	      }
	      return util$1.stringToDimension(options.width);
	    }
	  }, {
	    key: '_height',
	    value: function _height(options) {
	      if (options.size) {
	        return undefined;
	      }
	      return util$1.stringToDimension(options.height);
	    }
	  }, {
	    key: '_actions',
	    value: function _actions(options) {
	      var sanitizedActions = [];
	      options = options || {};
	      if (!options.actions) {

	        sanitizedActions = [{
	          name: 'submit',
	          identifier: 'submit',
	          text: options.submitText || 'Submit',
	          type: 'primary'
	        }, {
	          name: 'cancel',
	          identifier: 'cancel',
	          text: options.cancelText || 'Cancel',
	          type: 'link',
	          immutable: true
	        }];
	      }

	      if (options.buttons) {
	        sanitizedActions = sanitizedActions.concat(this._buttons(options));
	      }

	      return sanitizedActions;
	    }
	  }, {
	    key: '_id',
	    value: function _id(str) {
	      if (typeof str !== 'string') {
	        str = Math.random().toString(36).substring(2, 8);
	      }
	      return str;
	    }
	    // user defined action buttons

	  }, {
	    key: '_buttons',
	    value: function _buttons(options) {
	      var buttons = [];
	      if (options.buttons && Array.isArray(options.buttons)) {
	        options.buttons.forEach(function (button) {
	          var text;
	          var identifier;
	          var disabled = false;
	          if (button.text && typeof button.text === 'string') {
	            text = button.text;
	          }
	          if (button.identifier && typeof button.identifier === 'string') {
	            identifier = button.identifier;
	          } else {
	            identifier = buttonUtilsInstance.randomIdentifier();
	          }
	          if (button.disabled && button.disabled === true) {
	            disabled === true;
	          }

	          buttons.push({
	            text: text,
	            identifier: identifier,
	            type: 'secondary',
	            custom: true,
	            disabled: disabled
	          });
	        });
	      }
	      return buttons;
	    }
	  }, {
	    key: 'sanitizeOptions',
	    value: function sanitizeOptions(options) {
	      options = options || {};
	      var sanitized = {
	        chrome: this._chrome(options),
	        header: this._header(options.header),
	        hint: this._hint(options.hint),
	        width: this._width(options),
	        height: this._height(options),
	        $content: options.$content,
	        extension: options.extension,
	        actions: this._actions(options),
	        id: this._id(options.id),
	        size: options.size
	      };
	      sanitized.size = this._size(sanitized);

	      return sanitized;
	    }
	    // such a bad idea! this entire concept needs rewriting in the p2 plugin.

	  }, {
	    key: 'moduleOptionsFromGlobal',
	    value: function moduleOptionsFromGlobal(addon_key, key) {
	      if (window._AP && window._AP.dialogModules && window._AP.dialogModules[addon_key] && window._AP.dialogModules[addon_key][key]) {
	        return window._AP.dialogModules[addon_key][key].options;
	      }
	      return false;
	    }
	  }]);
	  return DialogUtils;
	}();

	var dialogUtilsInstance = new DialogUtils();

	var ButtonActions = {
	  clicked: function clicked($el) {
	    EventDispatcher$1.dispatch('button-clicked', {
	      $el: $el
	    });
	  },
	  toggle: function toggle($el, disabled) {
	    EventDispatcher$1.dispatch('button-toggle', {
	      $el: $el,
	      disabled: disabled
	    });
	  },
	  toggleVisibility: function toggleVisibility($el, hidden) {
	    EventDispatcher$1.dispatch('button-toggle-visibility', {
	      $el: $el,
	      hidden: hidden
	    });
	  }
	};

	var BUTTON_TYPES = ['primary', 'link', 'secondary'];
	var buttonId = 0;

	var Button$1 = function () {
	  function Button() {
	    classCallCheck(this, Button);

	    this.AP_BUTTON_CLASS = 'ap-aui-button';
	  }

	  createClass(Button, [{
	    key: 'setType',
	    value: function setType($button, type) {
	      if (type && _.contains(BUTTON_TYPES, type)) {
	        $button.addClass('aui-button-' + type);
	      }
	      return $button;
	    }
	  }, {
	    key: 'setDisabled',
	    value: function setDisabled($button, disabled) {
	      if (typeof disabled !== 'undefined' && !$button.data('immutable')) {
	        $button.attr('aria-disabled', disabled);
	      }
	      return $button;
	    }
	  }, {
	    key: 'setHidden',
	    value: function setHidden($button, hidden) {
	      if (typeof hidden !== 'undefined' && !$button.data('immutable')) {
	        $button.toggle(!hidden);
	      }
	      return $button;
	    }
	  }, {
	    key: '_setId',
	    value: function _setId($button, id) {
	      if (!id) {
	        id = 'ap-button-' + buttonId;
	        buttonId++;
	      }
	      $button.attr('id', id);
	      return $button;
	    }
	  }, {
	    key: '_additionalClasses',
	    value: function _additionalClasses($button, classes) {
	      if (classes) {
	        if (typeof classes !== 'string') {
	          classes = classes.join(' ');
	        }
	        $button.addClass(classes);
	      }
	      return $button;
	    }
	  }, {
	    key: 'getName',
	    value: function getName($button) {
	      return $$1($button).data('name');
	    }
	  }, {
	    key: 'getText',
	    value: function getText($button) {
	      return $$1($button).text();
	    }
	  }, {
	    key: 'getIdentifier',
	    value: function getIdentifier($button) {
	      return $$1($button).data('identifier');
	    }
	  }, {
	    key: 'isVisible',
	    value: function isVisible($button) {
	      return $$1($button).is(':visible');
	    }
	  }, {
	    key: 'isEnabled',
	    value: function isEnabled($button) {
	      return !($$1($button).attr('aria-disabled') === 'true');
	    }
	  }, {
	    key: 'render',
	    value: function render(options) {
	      var $button = $$1('<button />');
	      options = options || {};
	      $button.addClass('aui-button ' + this.AP_BUTTON_CLASS);
	      $button.text(options.text);
	      $button.data(options.data);
	      $button.data({
	        name: options.name || options.identifier,
	        identifier: options.identifier || buttonUtilsInstance.randomIdentifier(),
	        immutable: options.immutable || false
	      });
	      this._additionalClasses($button, options.additionalClasses);
	      this.setType($button, options.type);
	      this.setDisabled($button, options.disabled || false);
	      this._setId($button, options.id);
	      return $button;
	    }
	  }]);
	  return Button;
	}();

	var ButtonComponent = new Button$1();
	// register 1 button listener globally on dom load
	$$1(function () {
	  $$1('body').on('click', '.' + ButtonComponent.AP_BUTTON_CLASS, function (e) {
	    var $button = $$1(e.target).closest('.' + ButtonComponent.AP_BUTTON_CLASS);
	    if ($button.attr('aria-disabled') !== 'true') {
	      ButtonActions.clicked($button);
	    }
	  });
	});

	EventDispatcher$1.register('button-toggle', function (data) {
	  ButtonComponent.setDisabled(data.$el, data.disabled);
	});

	EventDispatcher$1.register('button-toggle-visibility', function (data) {
	  ButtonComponent.setHidden(data.$el, data.hidden);
	});

	var DLGID_PREFIX = 'ap-dialog-';
	var DIALOG_CLASS = 'ap-aui-dialog2';
	var DLGID_REGEXP = new RegExp('^' + DLGID_PREFIX + '[0-9A-Za-z]+$');
	var DIALOG_SIZES = ['small', 'medium', 'large', 'xlarge', 'fullscreen'];
	var DIALOG_BUTTON_CLASS = 'ap-aui-dialog-button';
	var DIALOG_BUTTON_CUSTOM_CLASS = 'ap-dialog-custom-button';
	var DIALOG_FOOTER_CLASS = 'aui-dialog2-footer';
	var DIALOG_FOOTER_ACTIONS_CLASS = 'aui-dialog2-footer-actions';
	var DIALOG_HEADER_ACTIONS_CLASS = 'header-control-panel';

	function getActiveDialog() {
	  var $el = AJS.LayerManager.global.getTopLayer();
	  if ($el && DLGID_REGEXP.test($el.attr('id'))) {
	    var dialog = AJS.dialog2($el);
	    dialog._id = dialog.$el.attr('id').replace(DLGID_PREFIX, '');
	    return dialog;
	  }
	}

	function getActionBar($dialog) {
	  var $actionBar = $dialog.find('.' + DIALOG_HEADER_ACTIONS_CLASS);
	  if (!$actionBar.length) {
	    $actionBar = $dialog.find('.' + DIALOG_FOOTER_ACTIONS_CLASS);
	  }
	  return $actionBar;
	}

	function getButtonByIdentifier(id, $dialog) {
	  var $actionBar = getActionBar($dialog);
	  return $actionBar.find('.aui-button').filter(function () {
	    return ButtonComponent.getIdentifier(this) === id;
	  });
	}

	var Dialog$1 = function () {
	  function Dialog() {
	    classCallCheck(this, Dialog);
	  }

	  createClass(Dialog, [{
	    key: '_renderHeaderCloseBtn',
	    value: function _renderHeaderCloseBtn() {
	      var $close = $$1('<a />').addClass('aui-dialog2-header-close');
	      var $closeBtn = $$1('<span />').addClass('aui-icon aui-icon-small aui-iconfont-close-dialog').text('Close');
	      $close.append($closeBtn);
	      return $close;
	    }
	    //v3 ask DT about this DOM.

	  }, {
	    key: '_renderFullScreenHeader',
	    value: function _renderFullScreenHeader($header, options) {
	      var $titleContainer = $$1('<div />').addClass('header-title-container aui-item expanded');
	      var $title = $$1('<div />').append($$1('<span />').addClass('header-title').text(options.header || ''));
	      $titleContainer.append($title);
	      $header.append($titleContainer).append(this._renderHeaderActions(options.actions, options.extension));
	      return $header;
	    }
	  }, {
	    key: '_renderHeader',
	    value: function _renderHeader(options) {
	      var $header = $$1('<header />').addClass('aui-dialog2-header');
	      if (options.size === 'fullscreen') {
	        return this._renderFullScreenHeader($header, options);
	      }
	      if (options.header) {
	        var $title = $$1('<h2 />').addClass('aui-dialog2-header-main').text(options.header);
	        $header.append($title);
	      }
	      $header.append(this._renderHeaderCloseBtn());
	      return $header;
	    }
	  }, {
	    key: '_renderHeaderActions',
	    value: function _renderHeaderActions(actions, extension) {
	      var $headerControls = $$1('<div />').addClass('aui-item ' + DIALOG_HEADER_ACTIONS_CLASS);
	      actions[0].additionalClasses = ['aui-icon', 'aui-icon-small', 'aui-iconfont-success'];
	      actions[1].additionalClasses = ['aui-icon', 'aui-icon-small', 'aui-iconfont-close-dialog'];
	      var $actions = this._renderActionButtons(actions, extension);
	      $actions.forEach(function ($action) {
	        $headerControls.append($action);
	      });
	      return $headerControls;
	    }
	  }, {
	    key: '_renderContent',
	    value: function _renderContent($content) {
	      var $el = $$1('<div />').addClass('aui-dialog2-content');
	      if ($content) {
	        $el.append($content);
	      }
	      return $el;
	    }
	  }, {
	    key: '_renderFooter',
	    value: function _renderFooter(options) {
	      var $footer = $$1('<footer />').addClass(DIALOG_FOOTER_CLASS);
	      if (options.size !== 'fullscreen') {
	        var $actions = this._renderFooterActions(options.actions, options.extension);
	        $footer.append($actions);
	      }
	      if (options.hint) {
	        var $hint = $$1('<div />').addClass('aui-dialog2-footer-hint').text(options.hint);
	        $footer.append($hint);
	      }
	      return $footer;
	    }
	  }, {
	    key: '_renderActionButtons',
	    value: function _renderActionButtons(actions, extension) {
	      var _this = this;

	      var actionButtons = [];
	      [].concat(toConsumableArray(actions)).forEach(function (action) {
	        actionButtons.push(_this._renderDialogButton({
	          text: action.text,
	          name: action.name,
	          type: action.type,
	          additionalClasses: action.additionalClasses,
	          custom: action.custom || false,
	          identifier: action.identifier,
	          immutable: action.immutable
	        }, extension));
	      });
	      return actionButtons;
	    }
	  }, {
	    key: '_renderFooterActions',
	    value: function _renderFooterActions(actions, extension) {
	      var $actions = $$1('<div />').addClass(DIALOG_FOOTER_ACTIONS_CLASS);
	      var $buttons = this._renderActionButtons(actions, extension);
	      $buttons.forEach(function ($button) {
	        $actions.append($button);
	      });
	      return $actions;
	    }
	  }, {
	    key: '_renderDialogButton',
	    value: function _renderDialogButton(options, extension) {
	      options.additionalClasses = options.additionalClasses || [];
	      options.additionalClasses.push(DIALOG_BUTTON_CLASS);
	      if (options.custom) {
	        options.additionalClasses.push(DIALOG_BUTTON_CUSTOM_CLASS);
	      }
	      var $button = ButtonComponent.render(options);
	      $button.extension = extension;
	      return $button;
	    }

	    /**
	    {
	      id: 'some-dialog-id',
	      title: 'some header',
	      hint: 'some footer hint',
	      $content: $(<div />).text('my content'),
	      actions: []
	    }
	    **/

	  }, {
	    key: 'render',
	    value: function render(options) {
	      var sanitizedOptions = dialogUtilsInstance.sanitizeOptions(options);
	      var $dialog = $$1('<section />').attr({
	        role: 'dialog',
	        id: DLGID_PREFIX + sanitizedOptions.id
	      });
	      $dialog.attr('data-aui-modal', 'true');
	      $dialog.data({
	        'aui-remove-on-hide': true,
	        'extension': sanitizedOptions.extension
	      });
	      $dialog.addClass('aui-layer aui-dialog2 ' + DIALOG_CLASS);

	      if (_.contains(DIALOG_SIZES, sanitizedOptions.size)) {
	        $dialog.addClass('aui-dialog2-' + sanitizedOptions.size);
	      }

	      if (sanitizedOptions.size === 'fullscreen') {
	        $dialog.addClass('ap-header-controls');
	        $dialog.addClass('aui-dialog2-maximum');
	      }

	      $dialog.append(this._renderContent(sanitizedOptions.$content));

	      if (sanitizedOptions.chrome) {
	        $dialog.prepend(this._renderHeader({
	          header: sanitizedOptions.header,
	          actions: sanitizedOptions.actions,
	          size: sanitizedOptions.size
	        }));

	        $dialog.append(this._renderFooter({
	          extension: sanitizedOptions.extension,
	          actions: sanitizedOptions.actions,
	          hint: sanitizedOptions.hint,
	          size: sanitizedOptions.size
	        }));
	      } else {
	        $dialog.addClass('aui-dialog2-chromeless');
	      }

	      var dialog = AJS.dialog2($dialog);
	      dialog._id = sanitizedOptions.id;
	      if (sanitizedOptions.size === 'fullscreen') {
	        sanitizedOptions.height = sanitizedOptions.width = '100%';
	      }
	      if (!sanitizedOptions.size || sanitizedOptions.size === 'fullscreen') {
	        AJS.layer($dialog).changeSize(sanitizedOptions.width, sanitizedOptions.height);
	      }
	      dialog.show();
	      dialog.$el.data('extension', sanitizedOptions.extension);
	      return $dialog;
	    }
	  }, {
	    key: 'setIframeDimensions',
	    value: function setIframeDimensions($iframe) {
	      IframeComponent.resize('100%', '100%', $iframe);
	    }
	  }, {
	    key: 'getActive',
	    value: function getActive() {
	      return getActiveDialog();
	    }
	  }, {
	    key: 'buttonIsEnabled',
	    value: function buttonIsEnabled(identifier) {
	      var dialog = getActiveDialog();
	      if (dialog) {
	        var $button = getButtonByIdentifier(identifier, dialog.$el);
	        return ButtonComponent.isEnabled($button);
	      }
	    }
	  }, {
	    key: 'buttonIsVisible',
	    value: function buttonIsVisible(identifier) {
	      var dialog = getActiveDialog();
	      if (dialog) {
	        var $button = getButtonByIdentifier(identifier, dialog.$el);
	        return ButtonComponent.isVisible($button);
	      }
	    }

	    /**
	    * takes either a target spec or a filter function
	    * returns all matching dialogs
	    */

	  }, {
	    key: 'getByExtension',
	    value: function getByExtension(extension) {
	      var filterFunction;
	      if (typeof extension === 'function') {
	        filterFunction = extension;
	      } else {
	        var keys = Object.getOwnPropertyNames(extension);
	        filterFunction = function filterFunction(dialog) {
	          var dialogData = $$1(dialog).data('extension');
	          return keys.every(function (key) {
	            return dialogData[key] === extension[key];
	          });
	        };
	      }

	      return $$1('.' + DIALOG_CLASS).toArray().filter(filterFunction).map(function ($el) {
	        return AJS.dialog2($el);
	      });
	    }

	    // add user defined button to an existing dialog

	  }, {
	    key: 'addButton',
	    value: function addButton(extension, options) {
	      options.custom = true;
	      var $button = this._renderDialogButton(options, extension);
	      var $dialog = this.getByExtension({
	        addon_key: extension.addon_key,
	        key: extension.key
	      })[0].$el;
	      var $actionBar = getActionBar($dialog);
	      $actionBar.append($button);
	      return $dialog;
	    }
	  }]);
	  return Dialog;
	}();

	var DialogComponent = new Dialog$1();

	EventDispatcher$1.register('iframe-bridge-established', function (data) {
	  if (data.extension.options.isDialog && !data.extension.options.preventDialogCloseOnEscape) {
	    DomEventActions.registerKeyEvent({
	      extension_id: data.extension.id,
	      key: 27,
	      callback: function callback() {
	        DialogActions.close({
	          dialog: getActiveDialog(),
	          extension: data.extension
	        });
	      }
	    });

	    EventDispatcher$1.registerOnce('dialog-close', function (d) {
	      DomEventActions.unregisterKeyEvent({
	        extension_id: data.extension.id,
	        key: 27
	      });
	    });
	  }
	});

	EventDispatcher$1.register('dialog-close-active', function (data) {
	  var activeDialog = getActiveDialog();
	  if (activeDialog) {
	    DialogActions.close({
	      customData: data.customData,
	      dialog: activeDialog,
	      extension: data.extension
	    });
	  }
	});

	EventDispatcher$1.register('dialog-close', function (data) {
	  data.dialog.hide();
	});

	EventDispatcher$1.register('dialog-button-toggle', function (data) {
	  var dialog = getActiveDialog();
	  if (dialog) {
	    var $button = getButtonByIdentifier(data.identifier, dialog.$el);
	    ButtonActions.toggle($button, !data.enabled);
	  }
	});

	EventDispatcher$1.register('dialog-button-toggle-visibility', function (data) {
	  var dialog = getActiveDialog();
	  if (dialog) {
	    var $button = getButtonByIdentifier(data.identifier, dialog.$el);
	    ButtonActions.toggleVisibility($button, data.hidden);
	  }
	});

	EventDispatcher$1.register('button-clicked', function (data) {
	  var $button = data.$el;
	  if ($button.hasClass(DIALOG_BUTTON_CLASS)) {
	    var $dialog = $button.parents('.' + DIALOG_CLASS);
	    var $iframe = $dialog.find('iframe');
	    if ($iframe.length && $iframe[0].bridgeEstablished) {
	      DialogActions.clickButton(ButtonComponent.getIdentifier($button), $button, $dialog.data('extension'));
	    } else {
	      DialogActions.close({
	        dialog: getActiveDialog(),
	        extension: $button.extension
	      });
	    }
	  }
	});

	EventDispatcher$1.register('iframe-create', function (data) {
	  if (data.extension.options && data.extension.options.isDialog) {
	    DialogComponent.setIframeDimensions(data.extension.$el);
	  }
	});

	EventDispatcher$1.register('dialog-button-add', function (data) {
	  DialogComponent.addButton(data.extension, data.button);
	});

	DomEventActions.registerWindowKeyEvent({
	  keyCode: 27,
	  callback: function callback() {
	    DialogActions.closeActive({
	      customData: {},
	      extension: null
	    });
	  }
	});

	var DialogExtension = function () {
	  function DialogExtension() {
	    classCallCheck(this, DialogExtension);
	  }

	  createClass(DialogExtension, [{
	    key: 'render',
	    value: function render(extension, dialogOptions) {
	      extension.options = extension.options || {};
	      dialogOptions = dialogOptions || {};
	      extension.options.isDialog = true;
	      extension.options.dialogId = dialogOptions.id;
	      extension.options.preventDialogCloseOnEscape = dialogOptions.closeOnEscape === false;
	      var $iframeContainer = IframeContainerComponent.createExtension(extension);
	      var $dialog = DialogComponent.render({
	        extension: extension,
	        $content: $iframeContainer,
	        chrome: dialogOptions.chrome,
	        width: dialogOptions.width,
	        height: dialogOptions.height,
	        size: dialogOptions.size,
	        header: dialogOptions.header,
	        hint: dialogOptions.hint,
	        submitText: dialogOptions.submitText,
	        cancelText: dialogOptions.cancelText,
	        buttons: dialogOptions.buttons
	      });
	      return $dialog;
	    }
	  }, {
	    key: 'getActiveDialog',
	    value: function getActiveDialog() {
	      return DialogComponent.getActive();
	    }
	  }, {
	    key: 'buttonIsEnabled',
	    value: function buttonIsEnabled(identifier) {
	      return DialogComponent.buttonIsEnabled(identifier);
	    }
	  }, {
	    key: 'buttonIsVisible',
	    value: function buttonIsVisible(identifier) {
	      return DialogComponent.buttonIsVisible(identifier);
	    }
	  }, {
	    key: 'getByExtension',
	    value: function getByExtension(extension) {
	      if (typeof extension === 'string') {
	        extension = {
	          id: extension
	        };
	      }
	      return DialogComponent.getByExtension(extension);
	    }
	  }]);
	  return DialogExtension;
	}();

	var DialogExtensionComponent = new DialogExtension();
	EventDispatcher$1.register('dialog-extension-open', function (data) {
	  DialogExtensionComponent.render(data.extension, data.options);
	});

	var _dialogs = {};

	EventDispatcher$1.register('dialog-close', function (data) {
	  var dialog = data.dialog;
	  if (dialog && data.extension) {
	    EventActions.broadcast('dialog.close', {
	      addon_key: data.extension.addon_key
	    }, data.customData);
	  }
	});

	EventDispatcher$1.register('dialog-button-click', function (data) {
	  var eventData = {
	    button: {
	      name: ButtonComponent.getName(data.$el),
	      identifier: ButtonComponent.getIdentifier(data.$el),
	      text: ButtonComponent.getText(data.$el)
	    }
	  };
	  var eventName = 'dialog.button.click';

	  // Old buttons, (submit and cancel) use old events
	  if (!data.$el.hasClass('ap-dialog-custom-button')) {
	    eventName = 'dialog.' + eventData.button.name;
	  }

	  EventActions.broadcast(eventName, {
	    addon_key: data.extension.addon_key,
	    key: data.extension.key
	  }, eventData);
	});

	/**
	 * @class Dialog~Dialog
	 * @description A dialog object that is returned when a dialog is created using the [dialog module](module-Dialog.html).
	 */

	var Dialog = function Dialog(options, callback) {
	  classCallCheck(this, Dialog);

	  callback = _.last(arguments);
	  var _id = callback._id;
	  var extension = callback._context.extension;

	  var dialogExtension = {
	    addon_key: extension.addon_key,
	    key: options.key,
	    options: _.pick(callback._context.extension.options, ['customData', 'productContext'])
	  };

	  // ACJS-185: the following is a really bad idea but we need it
	  // for compat until AP.dialog.customData has been deprecated
	  dialogExtension.options.customData = options.customData;
	  // terrible idea! - we need to remove this from p2 ASAP!
	  var dialogModuleOptions = dialogUtilsInstance.moduleOptionsFromGlobal(dialogExtension.addon_key, dialogExtension.key);
	  options = _.extend({}, dialogModuleOptions || {}, options);
	  options.id = _id;

	  DialogExtensionActions.open(dialogExtension, options);
	  this.customData = options.customData;
	  _dialogs[_id] = this;
	};

	/**
	 * @class Dialog~DialogButton
	 * @description A dialog button that can be controlled with JavaScript
	 */


	var Button = function () {
	  function Button(identifier) {
	    classCallCheck(this, Button);

	    if (!DialogExtensionComponent.getActiveDialog()) {
	      throw new Error('Failed to find an active dialog.');
	    }
	    this.name = identifier;
	    this.identifier = identifier;
	    this.enabled = DialogExtensionComponent.buttonIsEnabled(identifier);
	    this.hidden = !DialogExtensionComponent.buttonIsVisible(identifier);
	  }
	  /**
	   * Sets the button state to enabled
	   * @method enable
	   * @memberOf Dialog~DialogButton
	   * @noDemo
	   * @example
	   * AP.require('dialog', function(dialog){
	   *   dialog.getButton('submit').enable();
	   * });
	   */


	  createClass(Button, [{
	    key: 'enable',
	    value: function enable() {
	      this.setState({
	        enabled: true
	      });
	    }
	    /**
	     * Sets the button state to disabled. A disabled button cannot be clicked and emits no events.
	     * @method disable
	     * @memberOf Dialog~DialogButton
	     * @noDemo
	     * @example
	     * AP.require('dialog', function(dialog){
	     *   dialog.getButton('submit').disable();
	     * });
	     */

	  }, {
	    key: 'disable',
	    value: function disable() {
	      this.setState({
	        enabled: false
	      });
	    }
	    /**
	     * Query a button for its current state.
	     * @method isEnabled
	     * @memberOf Dialog~DialogButton
	     * @param {Function} callback function to receive the button state.
	     * @noDemo
	     * @example
	     * AP.require('dialog', function(dialog){
	     *   dialog.getButton('submit').isEnabled(function(enabled){
	     *     if(enabled){
	     *       //button is enabled
	     *     }
	     *   });
	     * });
	     */

	  }, {
	    key: 'isEnabled',
	    value: function isEnabled(callback) {
	      callback = _.last(arguments);
	      callback(this.enabled);
	    }
	    /**
	     * Toggle the button state between enabled and disabled.
	     * @method toggle
	     * @memberOf Dialog~DialogButton
	     * @noDemo
	     * @example
	     * AP.require('dialog', function(dialog){
	     *   dialog.getButton('submit').toggle();
	     * });
	     */

	  }, {
	    key: 'toggle',
	    value: function toggle() {
	      this.setState({
	        enabled: !this.enabled
	      });
	    }
	  }, {
	    key: 'setState',
	    value: function setState(state) {
	      this.enabled = state.enabled;
	      DialogActions.toggleButton({
	        identifier: this.identifier,
	        enabled: this.enabled
	      });
	    }
	    /**
	     * Trigger a callback bound to a button.
	     * @method trigger
	     * @memberOf Dialog~DialogButton
	     * @noDemo
	     * @example
	     * AP.require('dialog', function(dialog){
	     *   dialog.getButton('submit').bind(function(){
	     *     alert('clicked!');
	     *   });
	     *   dialog.getButton('submit').trigger();
	     * });
	     */

	  }, {
	    key: 'trigger',
	    value: function trigger(callback) {
	      callback = _.last(arguments);
	      if (this.enabled) {
	        DialogActions.dialogMessage({
	          name: this.name,
	          extension: callback._context.extension
	        });
	      }
	    }

	    /**
	     * Query a button for its current hidden/visible state.
	     * @method isHidden
	     * @memberOf Dialog~DialogButton
	     * @param {Function} callback function to receive the button state.
	     * @noDemo
	     * @example
	     * AP.require('dialog', function(dialog){
	     *   dialog.getButton('submit').isHidden(function(hidden){
	     *     if(hidden){
	     *       //button is hidden
	     *     }
	     *   });
	     * });
	     */

	  }, {
	    key: 'isHidden',
	    value: function isHidden(callback) {
	      callback = _.last(arguments);
	      callback(this.hidden);
	    }
	    /**
	     * Sets the button state to hidden
	     * @method hide
	     * @memberOf Dialog~DialogButton
	     * @noDemo
	     * @example
	     * AP.require('dialog', function(dialog){
	     *   dialog.getButton('submit').hide();
	     * });
	     */

	  }, {
	    key: 'hide',
	    value: function hide() {
	      this.setHidden(true);
	    }
	    /**
	     * Sets the button state to visible
	     * @method show
	     * @memberOf Dialog~DialogButton
	     * @noDemo
	     * @example
	     * AP.require('dialog', function(dialog){
	     *   dialog.getButton('submit').show();
	     * });
	     */

	  }, {
	    key: 'show',
	    value: function show() {
	      this.setHidden(false);
	    }
	  }, {
	    key: 'setHidden',
	    value: function setHidden(hidden) {
	      this.hidden = hidden;
	      DialogActions.toggleButtonVisibility({
	        identifier: this.identifier,
	        hidden: this.hidden
	      });
	    }
	  }]);
	  return Button;
	}();

	function getDialogFromContext(context) {
	  return _dialogs[context.extension.options.dialogId];
	}

	var CreateButton = function CreateButton(options, callback) {
	  classCallCheck(this, CreateButton);

	  callback = _.last(arguments);
	  DialogExtensionActions.addUserButton({
	    identifier: options.identifier,
	    text: options.text
	  }, callback._context.extension);
	};

	/**
	 * The Dialog module provides a mechanism for launching an add-on's modules as modal dialogs from within an add-on's iframe.
	 *
	 * A modal dialog displays information without requiring the user to leave the current page.
	 *
	 * The dialog is opened over the entire window, rather than within the iframe itself.
	 *
	 * <h3>Styling your dialog to look like a standard Atlassian dialog</h3>
	 *
	 * By default the dialog iframe is undecorated. It's up to you to style the dialog.
	 * <img src="../assets/images/connectdialogchromelessexample.jpeg" width="100%" />
	 *
	 * In order to maintain a consistent look and feel between the host application and the add-on, we encourage you to style your dialogs to match Atlassian's Design Guidelines for modal dialogs.
	 *
	 * To do that, you'll need to add the AUI styles to your dialog.
	 *
	 * For more information, read about the Atlassian User Interface [dialog component](https://docs.atlassian.com/aui/latest/docs/dialog.html).
	 * @exports Dialog
	 */


	var dialog = {
	  /**
	   * @class Dialog~DialogOptions
	   * @description The options supplied to a [dialog.create()](module-Dialog.html) call.
	   *
	   * @property {String}        key         The module key of a dialog, or the key of a page or web-item that you want to open as a dialog.
	   * @property {String}        size        Opens the dialog at a preset size: small, medium, large, x-large or fullscreen (with chrome).
	   * @property {Number|String} width       if size is not set, define the width as a percentage (append a % to the number) or pixels.
	   * @property {Number|String} height      if size is not set, define the height as a percentage (append a % to the number) or pixels.
	   * @property {Boolean}       chrome      (optional) opens the dialog with heading and buttons.
	   * @property {String}        header      (optional) text to display in the header if opening a dialog with chrome.
	   * @property {String}        submitText  (optional) text for the submit button if opening a dialog with chrome.
	   * @property {String}        cancelText  (optional) text for the cancel button if opening a dialog with chrome.
	   * @property {Object}        customData  (optional) custom data object that can be accessed from the actual dialog iFrame.
	   * @property {Boolean}       closeOnEscape (optional) if true, pressing ESC will close the dialog (default is true).
	   * @property {Array}         buttons     (optional) an array of custom buttons to be added to the dialog if opening a dialog with chrome.
	   */

	  /**
	   * Creates a dialog for a common dialog, page or web-item module key.
	   * @param {Dialog~DialogOptions} options configuration object of dialog options.
	   * @method create
	   * @noDemo
	   * @example
	   * AP.require('dialog', function(dialog){
	   *   dialog.create({
	   *     key: 'my-module-key',
	   *     width: '500px',
	   *     height: '200px',
	   *     chrome: true,
	   *     buttons: [
	   *      {
	   *        text: 'my button',
	   *        identifier: 'my_unique_identifier'
	   *      }
	   *     ]
	   *   }).on("close", callbackFunc);
	   * });
	   *
	   * @return {Dialog~Dialog} Dialog object allowing for callback registrations
	   */
	  create: {
	    constructor: Dialog
	  },
	  /**
	   * Closes the currently open dialog. Optionally pass data to listeners of the `dialog.close` event.
	   * This will only close a dialog that has been opened by your add-on.
	   * You can register for close events using the `dialog.close` event and the [events module](module-Events.html).
	   * @param {Object} data An object to be emitted on dialog close.
	   * @noDemo
	   * @example
	   * AP.require('dialog', function(dialog){
	         *   dialog.close({foo: 'bar'});
	         * });
	   */
	  close: function close(data, callback) {
	    callback = _.last(arguments);
	    var dialogToClose;
	    if (callback._context.extension.options.isDialog) {
	      dialogToClose = DialogExtensionComponent.getByExtension(callback._context.extension.id)[0];
	    } else {
	      dialogToClose = DialogExtensionComponent.getActiveDialog();
	    }

	    DialogActions.close({
	      customData: data,
	      dialog: dialogToClose,
	      extension: callback._context.extension
	    });
	  },
	  /**
	   * Passes the custom data Object to the specified callback function.
	   * @noDemo
	   * @name getCustomData
	   * @method
	   * @param {Function} callback - Callback method to be executed with the custom data.
	   * @example
	   * AP.require('dialog', function(dialog){
	   *   dialog.getCustomData(function (customData) {
	   *     console.log(customData);
	   *   });
	   * });
	   *
	   */
	  getCustomData: function getCustomData(callback) {
	    callback = _.last(arguments);
	    var dialog = getDialogFromContext(callback._context);
	    if (dialog) {
	      callback(dialog.customData);
	    }
	  },
	  /**
	   * Returns the button that was requested (either cancel or submit). If the requested button does not exist, an empty Object will be returned instead.
	   * @method getButton
	   * @returns {Dialog~DialogButton}
	   * @noDemo
	   * @example
	   * AP.require('dialog', function(dialog){
	   *   dialog.getButton('submit');
	   * });
	   */
	  getButton: {
	    constructor: Button,
	    enable: Button.prototype.enable,
	    disable: Button.prototype.disable,
	    toggle: Button.prototype.toggle,
	    isEnabled: Button.prototype.isEnabled,
	    trigger: Button.prototype.trigger,
	    hide: Button.prototype.hide,
	    show: Button.prototype.show,
	    isHidden: Button.prototype.isHidden
	  },
	  /**
	   * Creates a dialog button that can be controlled with javascript
	   * @method createButton
	   * @returns {Dialog~DialogButton}
	   * @noDemo
	   * @example
	   * AP.require('dialog', function(dialog){
	   *   dialog.createButton({
	   *     text: 'button text',
	   *     identifier: 'button.1'
	   *   }).bind(function mycallback(){});
	   * });
	   */
	  createButton: {
	    constructor: CreateButton
	  }
	};

	EventDispatcher$1.register('iframe-resize', function (data) {
	  IframeComponent.resize(data.width, data.height, data.$el);
	});

	EventDispatcher$1.register('iframe-size-to-parent', function (data) {
	  var height = AJS.$(document).height() - AJS.$('#header > nav').outerHeight() - AJS.$('#footer').outerHeight() - 20;
	  var $el = util$1.getIframeByExtensionId(data.context.extension_id);
	  EventDispatcher$1.dispatch('iframe-resize', { width: '100%', height: height + 'px', $el: $el });
	});

	AJS.$(window).on('resize', function (e) {
	  EventDispatcher$1.dispatch('host-window-resize', e);
	});

	var EnvActions = {
	  iframeResize: function iframeResize(width, height, context) {
	    var $el;
	    if (context.extension_id) {
	      $el = util$1.getIframeByExtensionId(context.extension_id);
	    } else {
	      $el = context;
	    }

	    EventDispatcher$1.dispatch('iframe-resize', { width: width, height: height, $el: $el, extension: context.extension });
	  },
	  sizeToParent: function sizeToParent(context) {
	    EventDispatcher$1.dispatch('iframe-size-to-parent', { context: context });
	  }
	};

	var debounce = AJS.debounce || $$1.debounce;
	/**
	 * Utility methods that are available without requiring additional modules.
	 * @exports AP
	 */
	var env = {
	  /**
	   * Get the location of the current page of the host product.
	   *
	   * @param {Function} callback function (location) {...}
	   * @example
	   * AP.getLocation(function(location){
	   *   alert(location);
	   * });
	   */
	  getLocation: function getLocation(callback) {
	    callback = _.last(arguments);
	    callback(window.location.href);
	  },
	  /**
	   * Resize the iframe to a specified width and height.
	   *
	   * Only content within an element with the class `ac-content` will be resized automatically.
	   * Content without this identifier is sized according to the `body` element, and will dynamically grow, but not shrink.
	   * ```
	   * <div class="ac-content">
	     * <p>Hello World</p>
	   * </div>
	   * ```
	   * Note that this method cannot be used in dialogs.
	   *
	   * @method
	   * @param {String} width   the desired width
	   * @param {String} height  the desired height
	   */
	  resize: debounce(function (width, height, callback) {
	    callback = _.last(arguments);
	    var options = callback._context.extension.options;
	    if (options && !options.isDialog) {
	      EnvActions.iframeResize(width, height, callback._context);
	    }
	  }),
	  /**
	   * Resize the iframe, so that it takes the entire page. Add-on may define to hide the footer using data-options.
	   *
	   * Note that this method is only available for general page modules.
	   *
	   * @method
	   * @param {boolean} hideFooter true if the footer is supposed to be hidden
	   */
	  sizeToParent: debounce(function (callback) {
	    callback = _.last(arguments);
	    // sizeToParent is only available for general-pages
	    if (callback._context.extension.options.isFullPage) {
	      // This adds border between the iframe and the page footer as the connect addon has scrolling content and can't do this
	      util$1.getIframeByExtensionId(callback._context.extension_id).addClass('full-size-general-page');
	      EventDispatcher$1.register('host-window-resize', function (data) {
	        EnvActions.sizeToParent(callback._context);
	      });
	      EnvActions.sizeToParent(callback._context);
	    } else {
	      // This is only here to support integration testing
	      // see com.atlassian.plugin.connect.test.pageobjects.RemotePage#isNotFullSize()
	      util$1.getIframeByExtensionId(callback._context.extension_id).addClass('full-size-general-page-fail');
	    }
	  })
	};

	var InlineDialogActions = {
	  hide: function hide($el) {
	    EventDispatcher$1.dispatch('inline-dialog-hide', {
	      $el: $el
	    });
	  },
	  refresh: function refresh($el) {
	    EventDispatcher$1.dispatch('inline-dialog-refresh', { $el: $el });
	  },
	  hideTriggered: function hideTriggered(extension_id, $el) {
	    EventDispatcher$1.dispatch('inline-dialog-hidden', { extension_id: extension_id, $el: $el });
	  },
	  close: function close() {
	    EventDispatcher$1.dispatch('inline-dialog-close', {});
	  },
	  created: function created(data) {
	    EventDispatcher$1.dispatch('inline-dialog-opened', {
	      $el: data.$el,
	      trigger: data.trigger,
	      extension: data.extension
	    });
	  }
	};

	/**
	 * The inline dialog is a wrapper for secondary content/controls to be displayed on user request. Consider this component as displayed in context to the triggering control with the dialog overlaying the page content.
	 * A inline dialog should be preferred over a modal dialog when a connection between the action has a clear benefit versus having a lower user focus.
	 *
	 * Inline dialogs can be shown via a [web item target](../modules/common/web-item.html#target).
	 *
	 * For more information, read about the Atlassian User Interface [inline dialog component](https://docs.atlassian.com/aui/latest/docs/inline-dialog.html).
	 * @module inline-dialog
	 */

	var inlineDialog = {
	  /**
	   * Hide the inline dialog that contains the iframe where this method is called from.
	   * @memberOf module:inline-dialog
	   * @method hide
	   * @noDemo
	   * @example
	   * AP.require('inline-dialog', function(inlineDialog){
	   *   inlineDialog.hide();
	   * });
	   */
	  hide: function hide(callback) {
	    InlineDialogActions.close();
	  }
	};

	var AnalyticsAction = {
	  trackDeprecatedMethodUsed: function trackDeprecatedMethodUsed(methodUsed, extension) {
	    EventDispatcher$1.dispatch('analytics-deprecated-method-used', { methodUsed: methodUsed, extension: extension });
	  }
	};

	/**
	* Messages are the primary method for providing system feedback in the product user interface.
	* Messages include notifications of various kinds: alerts, confirmations, notices, warnings, info and errors.
	* For visual examples of each kind please see the [Design guide](https://developer.atlassian.com/design/latest/communicators/messages/).
	* ### Example ###
	* ```
	* AP.require("messages", function(messages){
	*   //create a message
	*   var message = messages.info('plain text title', 'plain text body');
	* });
	* ```
	* @deprecated Please use the [Flag module](module-Flag.html) instead.
	* @name messages
	* @module
	*/

	var MESSAGE_BAR_ID = 'ac-message-container';
	var MESSAGE_TYPES = ['generic', 'error', 'warning', 'success', 'info', 'hint'];
	var MSGID_PREFIX = 'ap-message-';
	var MSGID_REGEXP = new RegExp('^' + MSGID_PREFIX + '[0-9A-fa-f]+$');
	var _messages = {};

	function validateMessageId(msgId) {
	  return MSGID_REGEXP.test(msgId);
	}

	function getMessageBar() {
	  var $msgBar = $$1('#' + MESSAGE_BAR_ID);

	  if ($msgBar.length < 1) {
	    $msgBar = $$1('<div id="' + MESSAGE_BAR_ID + '" />').appendTo('body');
	  }
	  return $msgBar;
	}

	function filterMessageOptions(options) {
	  var copy = {};
	  var allowed = ['closeable', 'fadeout', 'delay', 'duration', 'id'];
	  if (_.isObject(options)) {
	    allowed.forEach(function (key) {
	      if (key in options) {
	        copy[key] = options[key];
	      }
	    });
	  }
	  return copy;
	}

	function showMessage(name, title, body, options) {
	  var $msgBar = getMessageBar();
	  options = filterMessageOptions(options);
	  $$1.extend(options, {
	    title: title,
	    body: AJS.escapeHtml(body)
	  });

	  if (MESSAGE_TYPES.indexOf(name) < 0) {
	    throw 'Invalid message type. Must be: ' + MESSAGE_TYPES.join(', ');
	  }
	  if (validateMessageId(options.id)) {
	    AJS.messages[name]($msgBar, options);
	    // Calculate the left offset based on the content width.
	    // This ensures the message always stays in the centre of the window.
	    $msgBar.css('margin-left', '-' + $msgBar.innerWidth() / 2 + 'px');
	  }
	}

	function deprecatedShowMessage(name, title, body, options, callback) {
	  var methodUsed = 'AP.messages.' + name;
	  console.warn('DEPRECATED API - AP.messages.' + name + ' has been deprecated since ACJS 5.0 and will be removed in a future release. Use AP.flag.create instead.');
	  AnalyticsAction.trackDeprecatedMethodUsed(methodUsed, callback._context.extension);
	  showMessage(name, title, body, options);
	}

	$$1(document).on('aui-message-close', function (e, $msg) {
	  var _id = $msg.attr('id').replace(MSGID_PREFIX, '');
	  if (_messages[_id]) {
	    if ($$1.isFunction(_messages[_id].onCloseTrigger)) {
	      _messages[_id].onCloseTrigger();
	    }
	    _messages[_id]._destroy();
	  }
	});

	function messageModule(messageType) {
	  return {
	    constructor: function constructor(title, body, options, callback) {
	      callback = _.last(arguments);
	      var _id = callback._id;
	      options.id = MSGID_PREFIX + _id;
	      deprecatedShowMessage(messageType, title, body, options, callback);
	      _messages[_id] = this;
	    }
	  };
	}

	var messages = {
	  /**
	  * Close a message
	  * @deprecated Please use the [Flag module](module-Flag.html) instead.
	  * @name clear
	  * @method
	  * @memberof module:messages#
	  * @param    {String}    id  The id that was returned when the message was created.
	  * @example
	  * AP.require("messages", function(messages){
	  *   //create a message
	  *   var message = messages.info('title', 'body');
	  *   setTimeout(function(){
	  *     messages.clear(message);
	  *   }, 2000);
	  * });
	  */
	  clear: function clear(msg) {
	    var id = MSGID_PREFIX + msg._id;
	    if (validateMessageId(id)) {
	      $$1('#' + id).closeMessage();
	    }
	  },

	  /**
	  * Trigger an event when a message is closed
	  * @deprecated Please use the [Flag module](module-Flag.html) instead.
	  * @name onClose
	  * @method
	  * @memberof module:messages#
	  * @param    {String}    id  The id that was returned when the message was created.
	  * @param    {Function}  callback  The function that is run when the event is triggered
	  * @example
	  * AP.require("messages", function(messages){
	  *   //create a message
	  *   var message = messages.info('title', 'body');
	  *   messages.onClose(message, function() {
	  *       console.log(message, ' has been closed!');
	  *   });
	  * });
	  */
	  onClose: function onClose(msg, callback) {
	    callback = _.last(arguments);
	    var id = msg._id;
	    if (_messages[id]) {
	      _messages[id].onCloseTrigger = callback;
	    }
	  },

	  /**
	  * Show a generic message
	  * @deprecated Please use the [Flag module](module-Flag.html) instead.
	  * @name generic
	  * @method
	  * @memberof module:messages#
	  * @param    {String}            title       Sets the title text of the message.
	  * @param    {String}            body        The main content of the message.
	  * @param    {Object}            options             Message Options
	  * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
	  * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
	  * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
	  * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
	  * @returns  {String}    The id to be used when clearing the message
	  * @example
	  * AP.require("messages", function(messages){
	  *   //create a message
	  *   var message = messages.generic('title', 'generic message example');
	  * });
	  */
	  generic: messageModule('generic'),

	  /**
	  * Show an error message
	  * @deprecated Please use the [Flag module](module-Flag.html) instead.
	  * @name error
	  * @method
	  * @memberof module:messages#
	  * @param    {String}            title       Sets the title text of the message.
	  * @param    {String}            body        The main content of the message.
	  * @param    {Object}            options             Message Options
	  * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
	  * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
	  * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
	  * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
	  * @returns  {String}    The id to be used when clearing the message
	  * @example
	  * AP.require("messages", function(messages){
	  *   //create a message
	  *   var message = messages.error('title', 'error message example');
	  * });
	  */
	  error: messageModule('error'),

	  /**
	  * Show a warning message
	  * @deprecated Please use the [Flag module](module-Flag.html) instead.
	  * @name warning
	  * @method
	  * @memberof module:messages#
	  * @param    {String}            title       Sets the title text of the message.
	  * @param    {String}            body        The main content of the message.
	  * @param    {Object}            options             Message Options
	  * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
	  * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
	  * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
	  * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
	  * @returns  {String}    The id to be used when clearing the message
	  * @example
	  * AP.require("messages", function(messages){
	  *   //create a message
	  *   var message = messages.warning('title', 'warning message example');
	  * });
	  */
	  warning: messageModule('warning'),

	  /**
	  * Show a success message
	  * @deprecated Please use the [Flag module](module-Flag.html) instead.
	  * @name success
	  * @method
	  * @memberof module:messages#
	  * @param    {String}            title       Sets the title text of the message.
	  * @param    {String}            body        The main content of the message.
	  * @param    {Object}            options             Message Options
	  * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
	  * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
	  * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
	  * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
	  * @returns  {String}    The id to be used when clearing the message
	  * @example
	  * AP.require("messages", function(messages){
	  *   //create a message
	  *   var message = messages.success('title', 'success message example');
	  * });
	  */
	  success: messageModule('success'),

	  /**
	  * Show an info message
	  * @deprecated Please use the [Flag module](module-Flag.html) instead.
	  * @name info
	  * @method
	  * @memberof module:messages#
	  * @param    {String}            title       Sets the title text of the message.
	  * @param    {String}            body        The main content of the message.
	  * @param    {Object}            options             Message Options
	  * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
	  * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
	  * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
	  * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
	  * @returns  {String}    The id to be used when clearing the message
	  * @example
	  * AP.require("messages", function(messages){
	  *   //create a message
	  *   var message = messages.info('title', 'info message example');
	  * });
	  */
	  info: messageModule('info'),

	  /**
	  * Show a hint message
	  * @deprecated Please use the [Flag module](module-Flag.html) instead.
	  * @name hint
	  * @method
	  * @memberof module:messages#
	  * @param    {String}            title               Sets the title text of the message.
	  * @param    {String}            body                The main content of the message.
	  * @param    {Object}            options             Message Options
	  * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
	  * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
	  * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
	  * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
	  * @returns  {String}    The id to be used when clearing the message
	  * @example
	  * AP.require("messages", function(messages){
	  *   //create a message
	  *   var message = messages.hint('title', 'hint message example');
	  * });
	  */
	  hint: messageModule('hint')
	};

	var FlagActions = {
	  open: function open(flagId) {
	    EventDispatcher$1.dispatch('flag-open', { id: flagId });
	  },
	  //called to close a flag
	  close: function close(flagId) {
	    EventDispatcher$1.dispatch('flag-close', { id: flagId });
	  },
	  //called by AUI when closed
	  closed: function closed(flagId) {
	    EventDispatcher$1.dispatch('flag-closed', { id: flagId });
	  }
	};

	var FLAGID_PREFIX = 'ap-flag-';
	var AUI_FLAG = undefined;

	window.require(['aui/flag'], function (f) {
	  AUI_FLAG = f;
	});

	var Flag$1 = function () {
	  function Flag() {
	    classCallCheck(this, Flag);
	  }

	  createClass(Flag, [{
	    key: '_toHtmlString',
	    value: function _toHtmlString(str) {
	      if ($$1.type(str) === 'string') {
	        return str;
	      } else if ($$1.type(str) === 'object' && str instanceof $$1) {
	        return str.html();
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render(options) {
	      var _id = FLAGID_PREFIX + options.id;
	      var auiFlag = AUI_FLAG({
	        type: options.type,
	        title: options.title,
	        body: this._toHtmlString(options.body),
	        close: options.close
	      });
	      auiFlag.setAttribute('id', _id);
	      var $auiFlag = $$1(auiFlag);
	      $auiFlag.close = auiFlag.close;

	      return $auiFlag;
	    }
	  }, {
	    key: 'close',
	    value: function close(id) {
	      var f = document.getElementById(id);
	      f.close();
	    }
	  }]);
	  return Flag;
	}();

	var FlagComponent = new Flag$1();

	$$1(document).on('aui-flag-close', function (e) {
	  var _id = e.target.id;
	  FlagActions.closed(_id);
	});

	EventDispatcher$1.register('flag-close', function (data) {
	  FlagComponent.close(data.id);
	});

	/**
	* Flags are the primary method for providing system feedback in the product user interface. Messages include notifications of various kinds: alerts, confirmations, notices, warnings, info and errors.
	* @module Flag
	*/

	var _flags = {};

	/**
	* @class Flag~Flag
	* @description A flag object created by the [AP.flag]{@link module:Flag} module.
	*/

	var Flag = function () {
	  function Flag(options, callback) {
	    classCallCheck(this, Flag);

	    callback = _.last(arguments);
	    this.flag = FlagComponent.render({
	      type: options.type,
	      title: options.title,
	      body: AJS.escapeHtml(options.body),
	      close: options.close,
	      id: callback._id
	    });

	    FlagActions.open(this.flag.attr('id'));

	    this.onTriggers = {};

	    _flags[this.flag.attr('id')] = this;
	  }

	  /**
	  * @name on
	  * @memberof Flag~Flag
	  * @method
	  * @description Binds a callback function to an event that is triggered by the Flag.
	  * @param {Event} event A flag event; currently, the only valid option is 'close'.
	  * @param {Function} callback The function that runs when the event occurs.
	  * @example
	  * // Display a nice green flag using the Flags JavaScript API.
	  * var flag = AP.flag.create({
	  *   title: 'Successfully created a flag.',
	  *   body: 'This is a flag.',
	  *   type: 'info'
	  * });
	  *
	  * // Log a message to the console when the flag has closed.
	  * flag.on('close', function (data) {
	  *   console.log('Flag has been closed!');
	  * })
	  *
	  */


	  createClass(Flag, [{
	    key: 'on',
	    value: function on(event, callback) {
	      var id = this.flag.id;
	      if ($$1.isFunction(callback)) {
	        this.onTriggers[event] = callback;
	      }
	    }

	    /**
	    * @name close
	    * @memberof Flag~Flag
	    * @method
	    * @description Closes the Flag.
	    * @example
	    * // Display a nice green flag using the Flags JavaScript API.
	    * var flag = AP.flag.create({
	    *   title: 'Successfully created a flag.',
	    *   body: 'This is a flag.',
	    *   type: 'info'
	    * });
	    *
	    * // Close the flag.
	    * flag.close()
	    *
	    */

	  }, {
	    key: 'close',
	    value: function close() {
	      this.flag.close();
	    }
	  }]);
	  return Flag;
	}();

	EventDispatcher$1.register('flag-closed', function (data) {
	  if (_flags[data.id] && $$1.isFunction(_flags[data.id].onTriggers['close'])) {
	    _flags[data.id].onTriggers['close']();
	  }
	  if (_flags[data.id]) {
	    delete _flags[data.id];
	  }
	});

	var flag = {
	  /**
	  * @name create
	  * @method
	  * @description Creates a new flag.
	  * @param {Object} options           Options of the flag.
	  * @param {String} options.title     The title text of the flag.
	  * @param {String} options.body      The body text of the flag.
	  * @param {String} options.type=info Sets the type of the message. Valid options are "info", "success", "warning" and "error".
	  * @param {String} options.close     The closing behaviour that this flag has. Valid options are "manual", "auto" and "never".
	  * @returns {Flag~Flag}
	  * @example
	  * // Display a nice green flag using the Flags JavaScript API.
	  * var flag = AP.flag.create({
	  *   title: 'Successfully created a flag.',
	  *   body: 'This is a flag.',
	  *   type: 'success'
	  * });
	  */
	  create: {
	    constructor: Flag,
	    on: Flag.prototype.on,
	    close: Flag.prototype.close
	  }
	};

	var analytics$1 = {
	  trackDeprecatedMethodUsed: function trackDeprecatedMethodUsed(methodUsed, callback) {
	    callback = _.last(arguments);
	    AnalyticsAction.trackDeprecatedMethodUsed(methodUsed, callback._context.extension);
	  }
	};

	var ModuleActions = {
	  defineCustomModule: function defineCustomModule(name, methods) {
	    var data = {};
	    if (!methods) {
	      data.methods = name;
	    } else {
	      data.methods = methods;
	      data.name = name;
	    }
	    EventDispatcher$1.dispatch('module-define-custom', data);
	  }
	};

	function sanitizeTriggers(triggers) {
	  var onTriggers;
	  if (_.isArray(triggers)) {
	    onTriggers = triggers.join(' ');
	  } else if (_.isString(triggers)) {
	    onTriggers = triggers.trim();
	  }
	  return onTriggers;
	}

	function uniqueId() {
	  return 'webitem-' + Math.floor(Math.random() * 1000000000).toString(16);
	}

	// LEGACY: get addon key by webitem for p2
	function getExtensionKey($target) {
	  var cssClass = $target.attr('class');
	  var m = cssClass ? cssClass.match(/ap-plugin-key-([^\s]*)/) : null;
	  return _.isArray(m) ? m[1] : false;
	}

	// LEGACY: get module key by webitem for p2
	function getKey($target) {
	  var cssClass = $target.attr('class');
	  var m = cssClass ? cssClass.match(/ap-module-key-([^\s]*)/) : null;
	  return _.isArray(m) ? m[1] : false;
	}

	function getTargetKey($target) {
	  var cssClass = $target.attr('class');
	  var m = cssClass ? cssClass.match(/ap-target-key-([^\s]*)/) : null;
	  return _.isArray(m) ? m[1] : false;
	}

	function getFullKey($target) {
	  return getExtensionKey($target) + '__' + getKey($target);
	}

	function getModuleOptionsForWebitem(type, $target) {
	  var addon_key = getExtensionKey($target);
	  var targetKey = getTargetKey($target);
	  var moduleType = type + 'Modules';
	  if (window._AP && window._AP[moduleType] && window._AP[moduleType][addon_key] && window._AP[moduleType][addon_key][targetKey]) {
	    return _.clone(window._AP[moduleType][addon_key][targetKey].options);
	  }
	}

	// LEGACY - method for handling webitem options for p2
	function getOptionsForWebItem($target) {
	  var fullKey = getFullKey($target);

	  var type = $target.hasClass('ap-inline-dialog') ? 'inlineDialog' : 'dialog';
	  var options = getModuleOptionsForWebitem(type, $target);
	  if (!options && window._AP && window._AP[type + 'Options']) {
	    options = _.clone(window._AP[type + 'Options'][fullKey]) || {};
	  }
	  if (!options) {
	    options = {};
	    console.warn('no webitem ' + type + 'Options for ' + fullKey);
	  }
	  options.productContext = options.productContext || {};
	  // create product context from url params
	  new jsuri($target.attr('href')).queryPairs.forEach(function (param) {
	    options.productContext[param[0]] = param[1];
	  });

	  return options;
	}

	var WebItemUtils = {
	  sanitizeTriggers: sanitizeTriggers,
	  uniqueId: uniqueId,
	  getExtensionKey: getExtensionKey,
	  getKey: getKey,
	  getOptionsForWebItem: getOptionsForWebItem
	};

	var WebItem = function () {
	  function WebItem() {
	    classCallCheck(this, WebItem);

	    this._webitems = {};
	    this._contentResolver = function noop() {};
	  }

	  createClass(WebItem, [{
	    key: 'setContentResolver',
	    value: function setContentResolver(resolver) {
	      this._contentResolver = resolver;
	    }
	  }, {
	    key: 'requestContent',
	    value: function requestContent(extension) {
	      if (extension.addon_key && extension.key) {
	        return this._contentResolver.call(null, _.extend({ classifier: 'json' }, extension));
	      }
	    }
	  }, {
	    key: 'getWebItemsBySelector',
	    value: function getWebItemsBySelector(selector) {
	      return _.find(this._webitems, function (obj) {
	        if (obj.selector) {
	          return obj.selector.trim() === selector.trim();
	        }
	        return false;
	      });
	    }
	  }, {
	    key: 'setWebItem',
	    value: function setWebItem(potentialWebItem) {
	      return this._webitems[potentialWebItem.name] = {
	        name: potentialWebItem.name,
	        selector: potentialWebItem.selector,
	        triggers: potentialWebItem.triggers
	      };
	    }
	  }, {
	    key: '_removeTriggers',
	    value: function _removeTriggers(webitem) {
	      var _this = this;

	      var onTriggers = WebItemUtils.sanitizeTriggers(webitem.triggers);
	      $$1(function () {
	        $$1('body').off(onTriggers, webitem.selector, _this._webitems[webitem.name]._on);
	      });
	      delete this._webitems[webitem.name]._on;
	    }
	  }, {
	    key: '_addTriggers',
	    value: function _addTriggers(webitem) {
	      var onTriggers = WebItemUtils.sanitizeTriggers(webitem.triggers);
	      webitem._on = function (event) {
	        event.preventDefault();
	        var $target = $$1(event.target).closest(webitem.selector);
	        var extension = {
	          addon_key: WebItemUtils.getExtensionKey($target),
	          key: WebItemUtils.getKey($target),
	          options: WebItemUtils.getOptionsForWebItem($target)
	        };

	        WebItemActions.webitemInvoked(webitem, event, extension);
	      };
	      $$1(function () {
	        $$1('body').on(onTriggers, webitem.selector, webitem._on);
	      });
	    }
	  }]);
	  return WebItem;
	}();

	var webItemInstance = new WebItem();

	EventDispatcher$1.register('webitem-added', function (data) {
	  webItemInstance._addTriggers(data.webitem);
	});

	EventDispatcher$1.register('content-resolver-register-by-extension', function (data) {
	  webItemInstance.setContentResolver(data.callback);
	});

	var WebItemActions = {
	  addWebItem: function addWebItem(potentialWebItem) {
	    var webitem = void 0;
	    var existing = webItemInstance.getWebItemsBySelector(potentialWebItem.selector);

	    if (existing) {
	      return false;
	    } else {
	      webitem = webItemInstance.setWebItem(potentialWebItem);
	      EventDispatcher$1.dispatch('webitem-added', { webitem: webitem });
	    }
	  },

	  webitemInvoked: function webitemInvoked(webitem, event, extension) {
	    EventDispatcher$1.dispatch('webitem-invoked:' + webitem.name, { webitem: webitem, event: event, extension: extension });
	  }

	};

	var InlineDialog = function () {
	  function InlineDialog() {
	    classCallCheck(this, InlineDialog);
	  }

	  createClass(InlineDialog, [{
	    key: 'resize',
	    value: function resize(data) {
	      var width = util$1.stringToDimension(data.width);
	      var height = util$1.stringToDimension(data.height);
	      var $content = data.$el.find('.contents');
	      if ($content.length === 1) {
	        $content.css({
	          width: width,
	          height: height
	        });
	        InlineDialogActions.refresh(data.$el);
	      }
	    }
	  }, {
	    key: 'refresh',
	    value: function refresh($el) {
	      $el[0].popup.reset();
	    }
	  }, {
	    key: '_getInlineDialog',
	    value: function _getInlineDialog($el) {
	      return AJS.InlineDialog($el);
	    }
	  }, {
	    key: '_renderContainer',
	    value: function _renderContainer() {
	      return $$1('<div />').addClass('aui-inline-dialog-contents');
	    }
	  }, {
	    key: '_displayInlineDialog',
	    value: function _displayInlineDialog(data) {
	      InlineDialogActions.created({
	        $el: data.$el,
	        trigger: data.trigger,
	        extension: data.extension
	      });
	    }
	  }, {
	    key: 'hideInlineDialog',
	    value: function hideInlineDialog($el) {
	      $el.hide();
	    }
	  }, {
	    key: 'closeInlineDialog',
	    value: function closeInlineDialog() {
	      $$1('.aui-inline-dialog').filter(function () {
	        return $$1(this).find('.ap-iframe-container').length > 0;
	      }).hide();
	    }
	  }, {
	    key: 'render',
	    value: function render(data) {
	      var _this = this;

	      var $inlineDialog = $$1(document.getElementById('inline-dialog-' + data.id));

	      if ($inlineDialog.length !== 0) {
	        $inlineDialog.remove();
	      }

	      var $el = AJS.InlineDialog(data.bindTo,
	      //assign unique id to inline Dialog
	      data.id, function ($placeholder, trigger, showInlineDialog) {
	        $placeholder.append(data.$content);
	        _this._displayInlineDialog({
	          extension: data.extension,
	          $el: $placeholder,
	          trigger: trigger
	        });
	        showInlineDialog();
	      }, data.dialogOptions);
	      return $el;
	    }
	  }]);
	  return InlineDialog;
	}();

	var InlineDialogComponent = new InlineDialog();

	EventDispatcher$1.register('iframe-resize', function (data) {
	  var container = data.$el.parents('.aui-inline-dialog');
	  if (container.length === 1) {
	    InlineDialogComponent.resize({
	      width: data.width,
	      height: data.height,
	      $el: container
	    });
	  }
	});

	EventDispatcher$1.register('inline-dialog-refresh', function (data) {
	  InlineDialogComponent.refresh(data.$el);
	});

	EventDispatcher$1.register('inline-dialog-hide', function (data) {
	  InlineDialogComponent.hideInlineDialog(data.$el);
	});

	EventDispatcher$1.register('inline-dialog-close', function (data) {
	  InlineDialogComponent.closeInlineDialog();
	});

	var ITEM_NAME = 'inline-dialog';
	var SELECTOR = '.ap-inline-dialog';
	var TRIGGERS = ['mouseover', 'click'];
	var WEBITEM_UID_KEY = 'inline-dialog-target-uid';

	var InlineDialogWebItem = function () {
	  function InlineDialogWebItem() {
	    classCallCheck(this, InlineDialogWebItem);

	    this._inlineDialogWebItemSpec = {
	      name: ITEM_NAME,
	      selector: SELECTOR,
	      triggers: TRIGGERS
	    };
	    this._inlineDialogWebItems = {};
	  }

	  createClass(InlineDialogWebItem, [{
	    key: 'getWebItem',
	    value: function getWebItem() {
	      return this._inlineDialogWebItemSpec;
	    }
	  }, {
	    key: '_createInlineDialog',
	    value: function _createInlineDialog(data) {
	      var $iframeContainer = IframeContainerComponent.createExtension(data.extension);
	      var $inlineDialog = InlineDialogComponent.render({
	        extension: data.extension,
	        id: data.id,
	        bindTo: data.$target,
	        $content: $iframeContainer,
	        dialogOptions: {} // fill this with dialog options.
	      });

	      return $inlineDialog;
	    }
	  }, {
	    key: 'triggered',
	    value: function triggered(data) {
	      // don't trigger on hover, when hover is not specified.
	      if (data.event.type !== 'click' && !data.extension.options.onHover) {
	        return;
	      }
	      var $target = $$1(data.event.currentTarget);
	      var webitemId = $target.data(WEBITEM_UID_KEY);

	      var $inlineDialog = this._createInlineDialog({
	        id: webitemId,
	        extension: data.extension,
	        $target: $target,
	        options: data.options || {}
	      });

	      $inlineDialog.show();
	    }
	  }, {
	    key: 'opened',
	    value: function opened(data) {
	      var contentRequest = webItemInstance.requestContent(data.extension);
	      if (!contentRequest) {
	        console.warn('no content resolver found');
	        return false;
	      }
	      contentRequest.then(function (content) {
	        content.options = {
	          autoresize: true,
	          widthinpx: true
	        };
	        var addon = create(content);
	        data.$el.empty().append(addon);
	      });
	    }
	  }, {
	    key: 'createIfNotExists',
	    value: function createIfNotExists(data) {
	      var $target = $$1(data.event.currentTarget);
	      var uid = $target.data(WEBITEM_UID_KEY);

	      if (!uid) {
	        uid = WebItemUtils.uniqueId();
	        $target.data(WEBITEM_UID_KEY, uid);
	      }
	    }
	  }]);
	  return InlineDialogWebItem;
	}();

	var inlineDialogInstance = new InlineDialogWebItem();
	var webitem = inlineDialogInstance.getWebItem();
	EventDispatcher$1.register('before:webitem-invoked:' + webitem.name, function (data) {
	  inlineDialogInstance.createIfNotExists(data);
	});
	EventDispatcher$1.register('webitem-invoked:' + webitem.name, function (data) {
	  inlineDialogInstance.triggered(data);
	});
	EventDispatcher$1.register('inline-dialog-opened', function (data) {
	  inlineDialogInstance.opened(data);
	});
	WebItemActions.addWebItem(webitem);

	var ITEM_NAME$1 = 'dialog';
	var SELECTOR$1 = '.ap-dialog';
	var TRIGGERS$1 = ['click'];
	var WEBITEM_UID_KEY$1 = 'dialog-target-uid';
	var DEFAULT_WEBITEM_OPTIONS = {
	  chrome: true
	};

	var DialogWebItem = function () {
	  function DialogWebItem() {
	    classCallCheck(this, DialogWebItem);

	    this._dialogWebItem = {
	      name: ITEM_NAME$1,
	      selector: SELECTOR$1,
	      triggers: TRIGGERS$1
	    };
	  }

	  createClass(DialogWebItem, [{
	    key: 'getWebItem',
	    value: function getWebItem() {
	      return this._dialogWebItem;
	    }
	  }, {
	    key: '_dialogOptions',
	    value: function _dialogOptions(options) {
	      return _.extend({}, DEFAULT_WEBITEM_OPTIONS, options || {});
	    }
	  }, {
	    key: 'triggered',
	    value: function triggered(data) {
	      var $target = $(data.event.currentTarget);
	      var webitemId = $target.data(WEBITEM_UID_KEY$1);
	      var dialogOptions = this._dialogOptions(data.extension.options);
	      dialogOptions.id = webitemId;
	      DialogExtensionActions.open(data.extension, dialogOptions);
	    }
	  }, {
	    key: 'createIfNotExists',
	    value: function createIfNotExists(data) {
	      var $target = $(data.event.currentTarget);
	      var uid = $target.data(WEBITEM_UID_KEY$1);

	      if (!uid) {
	        uid = WebItemUtils.uniqueId();
	        $target.data(WEBITEM_UID_KEY$1, uid);
	      }
	    }
	  }]);
	  return DialogWebItem;
	}();

	var dialogInstance = new DialogWebItem();
	var webitem$1 = dialogInstance.getWebItem();
	EventDispatcher$1.register('webitem-invoked:' + webitem$1.name, function (data) {
	  dialogInstance.triggered(data);
	});
	EventDispatcher$1.register('before:webitem-invoked:' + webitem$1.name, dialogInstance.createIfNotExists);

	WebItemActions.addWebItem(webitem$1);

	/**
	 * Private namespace for host-side code.
	 * @type {*|{}}
	 * @private
	 * @deprecated use AMD instead of global namespaces. The only thing that should be on _AP is _AP.define and _AP.require.
	 */
	if (!window._AP) {
	  window._AP = {};
	}

	/*
	 * Add version
	 */
	if (!window._AP.version) {
	  window._AP.version = '5.0.0-beta.5';
	}

	host.defineModule('messages', messages);
	host.defineModule('flag', flag);
	host.defineModule('dialog', dialog);
	host.defineModule('inlineDialog', inlineDialog);
	host.defineModule('env', env);
	host.defineModule('events', events);
	host.defineModule('_analytics', analytics$1);

	EventDispatcher$1.register('module-define-custom', function (data) {
	  host.defineModule(data.name, data.methods);
	});

	host.registerRequestNotifier(function (data) {
	  analytics.dispatch('bridge.invokemethod', {
	    module: data.module,
	    fn: data.fn,
	    addonKey: data.addon_key,
	    moduleKey: data.key
	  });
	});

	var index = {
	  dialog: {
	    create: function create(extension, dialogOptions) {
	      DialogExtensionActions.open(extension, dialogOptions);
	    },
	    close: function close() {
	      DialogExtensionActions.close();
	    }
	  },
	  onKeyEvent: function onKeyEvent(extension_id, key, modifiers, callback) {
	    DomEventActions.registerKeyEvent({ extension_id: extension_id, key: key, modifiers: modifiers, callback: callback });
	  },
	  offKeyEvent: function offKeyEvent(extension_id, key, modifiers, callback) {
	    DomEventActions.unregisterKeyEvent({ extension_id: extension_id, key: key, modifiers: modifiers, callback: callback });
	  },
	  onIframeEstablished: function onIframeEstablished(callback) {
	    EventDispatcher$1.register('after:iframe-bridge-established', function (data) {
	      callback.call(null, {
	        $el: data.$el,
	        extension: _.pick(data.extension, ['id', 'addon_key', 'key', 'options', 'url'])
	      });
	    });
	  },
	  onIframeUnload: function onIframeUnload(callback) {
	    EventDispatcher$1.register('after:iframe-unload', function (data) {
	      callback.call(null, {
	        $el: data.$el,
	        extension: _.pick(data.extension, ['id', 'addon_key', 'key', 'options', 'url'])
	      });
	    });
	  },
	  destroy: function destroy(extension_id) {
	    IframeActions.notifyIframeDestroyed({ extension_id: extension_id });
	  },
	  registerContentResolver: {
	    resolveByExtension: function resolveByExtension(callback) {
	      JwtActions.registerContentResolver({ callback: callback });
	    }
	  },
	  defineModule: function defineModule(name, methods) {
	    ModuleActions.defineCustomModule(name, methods);
	  },
	  broadcastEvent: function broadcastEvent(type, targetSpec, event) {
	    EventActions.broadcast(type, targetSpec, event);
	  },
	  create: create,
	  getExtensions: function getExtensions(filter) {
	    return host.getExtensions(filter);
	  }
	};

	return index;

})));