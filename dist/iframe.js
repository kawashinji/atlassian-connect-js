var AP = (function () {
  'use strict';

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

  var defineProperty = function (obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  };

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

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

  var _each = util.each;
var   document$1 = window.document;
  function $(sel, context) {

    context = context || document$1;

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

    util.extend(els, {
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

    if (readyState === "complete") {
      func.call(w);
    } else {
      $.bind(w, "load", function () {
        func.call(w);
      });
    }
  }

  function getContainer() {
    // Look for these two selectors first... you need these to allow for the auto-shrink to work
    // Otherwise, it'll default to document.body which can't auto-grow or auto-shrink
    var container = $('.ac-content, #content');
    return container.length > 0 ? container[0] : document.body;
  }

  /**
  * Extension wide configuration values
  */
  var ConfigurationOptions = function () {
    function ConfigurationOptions() {
      classCallCheck(this, ConfigurationOptions);

      this.options = {};
    }

    createClass(ConfigurationOptions, [{
      key: "_flush",
      value: function _flush() {
        this.options = {};
      }
    }, {
      key: "get",
      value: function get(item) {
        return item ? this.options[item] : this.options;
      }
    }, {
      key: "set",
      value: function set(data, value) {
        var _this = this;

        if (!data) {
          return;
        }

        if (value) {
          data = defineProperty({}, data, value);
        }
        var keys = Object.getOwnPropertyNames(data);
        keys.forEach(function (key) {
          _this.options[key] = data[key];
        }, this);
      }
    }]);
    return ConfigurationOptions;
  }();

  var ConfigurationOptions$1 = new ConfigurationOptions();

  var size = function size(width, height, container) {
    var w = width == null ? '100%' : width,
        h,
        docHeight;
    var widthInPx = Boolean(ConfigurationOptions$1.get('widthinpx'));

    if (!container) {
      container = getContainer();
    }
    if (widthInPx && typeof w === "string" && w.search('%') !== -1) {
      w = Math.max(container.scrollWidth, container.offsetWidth, container.clientWidth);
    }
    if (height) {
      h = height;
    } else {
      // Determine height
      docHeight = Math.max(container.scrollHeight, document.documentElement.scrollHeight, container.offsetHeight, document.documentElement.offsetHeight, container.clientHeight, document.documentElement.clientHeight);

      if (container === document.body) {
        h = docHeight;
      } else {
        // Started with http://james.padolsey.com/javascript/get-document-height-cross-browser/
        // to determine page height across browsers. Turns out that in our case, we can get by with
        // document.body.offsetHeight and document.body.clientHeight. Those two return the proper
        // height even when the dom shrinks. Tested on Chrome, Safari, IE8/9/10, and Firefox
        h = Math.max(container.offsetHeight, container.clientHeight);
        if (h === 0) {
          h = docHeight;
        }
      }
    }
    return { w: w, h: h };
  };

  function EventQueue() {
    this.q = [];
    this.add = function (ev) {
      this.q.push(ev);
    };

    var i, j;
    this.call = function () {
      for (i = 0, j = this.q.length; i < j; i++) {
        this.q[i].call();
      }
    };
  }

  function attachResizeEvent(element, resized) {
    if (!element.resizedAttached) {
      element.resizedAttached = new EventQueue();
      element.resizedAttached.add(resized);
    } else if (element.resizedAttached) {
      element.resizedAttached.add(resized);
      return;
    }

    element.resizeSensor = document.createElement('div');
    element.resizeSensor.className = 'ac-resize-sensor';
    var style = 'position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: scroll; z-index: -1; visibility: hidden;';
    var styleChild = 'position: absolute; left: 0; top: 0;';

    element.resizeSensor.style.cssText = style;
    element.resizeSensor.innerHTML = '<div class="ac-resize-sensor-expand" style="' + style + '">' + '<div style="' + styleChild + '"></div>' + '</div>' + '<div class="ac-resize-sensor-shrink" style="' + style + '">' + '<div style="' + styleChild + ' width: 200%; height: 200%"></div>' + '</div>';
    element.appendChild(element.resizeSensor);

    if (getComputedStyle(element).position === 'static') {
      element.style.position = 'relative';
    }

    var expand = element.resizeSensor.childNodes[0];
    var expandChild = expand.childNodes[0];
    var shrink = element.resizeSensor.childNodes[1];

    var lastWidth, lastHeight;

    var reset = function reset() {
      expandChild.style.width = expand.offsetWidth + 10 + 'px';
      expandChild.style.height = expand.offsetHeight + 10 + 'px';
      expand.scrollLeft = expand.scrollWidth;
      expand.scrollTop = expand.scrollHeight;
      shrink.scrollLeft = shrink.scrollWidth;
      shrink.scrollTop = shrink.scrollHeight;
      lastWidth = element.offsetWidth;
      lastHeight = element.offsetHeight;
    };

    reset();

    var changed = function changed() {
      if (element.resizedAttached) {
        element.resizedAttached.call();
      }
    };

    var onScroll = function onScroll() {
      if (element.offsetWidth !== lastWidth || element.offsetHeight !== lastHeight) {
        changed();
      }
      reset();
    };

    expand.addEventListener('scroll', onScroll);
    shrink.addEventListener('scroll', onScroll);
  }

  var resizeListener = {
    add: function add(fn) {
      var container = getContainer();
      attachResizeEvent(container, fn);
    },
    remove: function remove() {
      var container = getContainer();
      if (container.resizeSensor) {
        container.removeChild(container.resizeSensor);
        delete container.resizeSensor;
        delete container.resizedAttached;
      }
    }
  };

  var ConsumerOptions = function () {
    function ConsumerOptions() {
      classCallCheck(this, ConsumerOptions);
    }

    createClass(ConsumerOptions, [{
      key: "_getConsumerOptions",
      value: function _getConsumerOptions() {
        var options = {},
            $script = $("script[src*='/atlassian-connect/all']");

        if (!($script && /\/atlassian-connect\/all(-debug)?\.js($|\?)/.test($script.attr("src")))) {
          $script = $("#ac-iframe-options");
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
  }();

  var ConsumerOptions$1 = new ConsumerOptions();

  var POSSIBLE_MODIFIER_KEYS = ['ctrl', 'shift', 'alt', 'meta'];

  var AP = function (_PostMessage) {
    inherits(AP, _PostMessage);

    function AP(options) {
      classCallCheck(this, AP);

      var _this = possibleConstructorReturn(this, (AP.__proto__ || Object.getPrototypeOf(AP)).call(this));

      ConfigurationOptions$1.set(options);
      _this._data = _this._parseInitData();
      ConfigurationOptions$1.set(_this._data.options);
      _this._host = window.parent || window;
      _this._isKeyDownBound = false;
      _this._hostModules = {};
      _this._eventHandlers = {};
      _this._pendingCallbacks = {};
      _this._keyListeners = [];
      _this._version = "5.0.0-beta.6";
      if (_this._data.api) {
        _this._setupAPI(_this._data.api);
        _this._setupAPIWithoutRequire(_this._data.api);
      }
      _this._messageHandlers = {
        resp: _this._handleResponse,
        evt: _this._handleEvent,
        key_listen: _this._handleKeyListen
      };
      if (_this._data.origin) {
        _this._sendInit();
      }
      _this._registerOnUnload();
      $(util._bind(_this, _this._autoResizer));
      return _this;
    }

    createClass(AP, [{
      key: '_registerOnUnload',
      value: function _registerOnUnload() {
        $.bind(window, 'unload', util._bind(this, function () {
          this._host.postMessage({
            eid: this._data.extension_id,
            type: 'unload'
          }, this._data.origin);
        }));
      }
    }, {
      key: '_bindKeyDown',
      value: function _bindKeyDown() {
        if (!this._isKeyDownBound) {
          $.bind(window, 'keydown', util._bind(this, this._handleKeyDownDomEvent));
          this._isKeyDownBound = true;
        }
      }
    }, {
      key: '_autoResizer',
      value: function _autoResizer() {
        this._enableAutoResize = Boolean(ConfigurationOptions$1.get('autoresize'));
        if (ConsumerOptions$1.get('resize') === false) {
          this._enableAutoResize = false;
        }
        if (this._enableAutoResize) {
          this._initResize();
        }
      }

      /**
      * The initialization data is passed in when the iframe is created as its 'name' attribute.
      * Example:
      * {
      *   extension_id: The ID of this iframe as defined by the host
      *   origin: 'https://example.org'  // The parent's window origin
      *   api: {
      *     _globals: { ... },
      *     messages = {
      *       clear: {},
      *       ...
      *     },
      *     ...
      *   }
      * }
      **/

    }, {
      key: '_parseInitData',
      value: function _parseInitData(data) {
        try {
          return JSON.parse(data || window.name);
        } catch (e) {
          return {};
        }
      }
    }, {
      key: '_createModule',
      value: function _createModule(moduleName, api) {
        var _this2 = this;

        return Object.getOwnPropertyNames(api).reduce(function (accumulator, memberName) {
          var member = api[memberName];
          if (member.hasOwnProperty('constructor')) {
            accumulator[memberName] = _this2._createProxy(moduleName, member, memberName);
          } else {
            accumulator[memberName] = _this2._createMethodHandler({
              mod: moduleName,
              fn: memberName
            });
          }
          return accumulator;
        }, {});
      }
    }, {
      key: '_setupAPI',
      value: function _setupAPI(api) {
        var _this3 = this;

        this._hostModules = Object.getOwnPropertyNames(api).reduce(function (accumulator, moduleName) {
          accumulator[moduleName] = _this3._createModule(moduleName, api[moduleName]);
          return accumulator;
        }, {});

        Object.getOwnPropertyNames(this._hostModules._globals || {}).forEach(function (global) {
          _this3[global] = _this3._hostModules._globals[global];
        });
      }
    }, {
      key: '_setupAPIWithoutRequire',
      value: function _setupAPIWithoutRequire(api) {
        var _this4 = this;

        Object.getOwnPropertyNames(api).forEach(function (moduleName) {
          if (typeof _this4[moduleName] !== "undefined") {
            throw new Error('XDM module: ' + moduleName + ' will collide with existing variable');
          }
          _this4[moduleName] = _this4._createModule(moduleName, api[moduleName]);
        }, this);
      }
    }, {
      key: '_pendingCallback',
      value: function _pendingCallback(mid, fn) {
        this._pendingCallbacks[mid] = fn;
      }
    }, {
      key: '_createProxy',
      value: function _createProxy(moduleName, api, className) {
        var module = this._createModule(moduleName, api);
        function Cls(args) {
          if (!(this instanceof Cls)) {
            return new Cls(arguments);
          }
          this._cls = className;
          this._id = util.randomString();
          module.constructor.apply(this, args);
          return this;
        }
        Object.getOwnPropertyNames(module).forEach(function (methodName) {
          if (methodName !== 'constructor') {
            Cls.prototype[methodName] = module[methodName];
          }
        });
        return Cls;
      }
    }, {
      key: '_createMethodHandler',
      value: function _createMethodHandler(methodData) {
        var that = this;
        return function () {
          var args = util.argumentsToArray(arguments);
          var data = {
            eid: that._data.extension_id,
            type: 'req',
            mod: methodData.mod,
            fn: methodData.fn
          };
          if (util.hasCallback(args)) {
            data.mid = util.randomString();
            that._pendingCallback(data.mid, args.pop());
          }
          if (this && this._cls) {
            data._cls = this._cls;
            data._id = this._id;
          }
          data.args = util.sanitizeStructuredClone(args);
          that._host.postMessage(data, that._data.origin);
        };
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
      key: '_handleEvent',
      value: function _handleEvent(event) {
        var sendResponse = function sendResponse() {
          var args = util.argumentsToArray(arguments);
          event.source.postMessage({
            eid: this._data.extension_id,
            mid: event.data.mid,
            type: 'resp',
            args: args
          }, this._data.origin);
        };
        var data = event.data;
        sendResponse = util._bind(this, sendResponse);
        sendResponse._context = {
          eventName: data.etyp
        };
        function toArray(handlers) {
          if (handlers) {
            if (!Array.isArray(handlers)) {
              handlers = [handlers];
            }
            return handlers;
          }
          return [];
        }
        var handlers = toArray(this._eventHandlers[data.etyp]);
        handlers = handlers.concat(toArray(this._eventHandlers._any));
        handlers.forEach(function (handler) {
          handler(data.evnt, sendResponse);
        }, this);
        if (data.mid) {
          sendResponse();
        }
      }
    }, {
      key: '_handleKeyDownDomEvent',
      value: function _handleKeyDownDomEvent(event) {
        var modifiers = [];
        POSSIBLE_MODIFIER_KEYS.forEach(function (modifierKey) {
          if (event[modifierKey + 'Key']) {
            modifiers.push(modifierKey);
          }
        }, this);
        var keyListenerId = this._keyListenerId(event.keyCode, modifiers);
        var requestedKey = this._keyListeners.indexOf(keyListenerId);
        if (requestedKey >= 0) {
          this._host.postMessage({
            eid: this._data.extension_id,
            keycode: event.keyCode,
            modifiers: modifiers,
            type: 'key_listen'
          }, this._data.origin);
        }
      }
    }, {
      key: '_keyListenerId',
      value: function _keyListenerId(keycode, modifiers) {
        var keyListenerId = keycode;
        if (modifiers) {
          if (typeof modifiers === "string") {
            modifiers = [modifiers];
          }
          modifiers.sort();
          modifiers.forEach(function (modifier) {
            keyListenerId += '$$' + modifier;
          }, this);
        }
        return keyListenerId;
      }
    }, {
      key: '_handleKeyListen',
      value: function _handleKeyListen(postMessageEvent) {
        var keyListenerId = this._keyListenerId(postMessageEvent.data.keycode, postMessageEvent.data.modifiers);
        if (postMessageEvent.data.action === "remove") {
          var index = this._keyListeners.indexOf(keyListenerId);
          this._keyListeners.splice(index, 1);
        } else if (postMessageEvent.data.action === "add") {
          // only bind onKeyDown once a key is registered.
          this._bindKeyDown();
          this._keyListeners.push(keyListenerId);
        }
      }
    }, {
      key: '_checkOrigin',
      value: function _checkOrigin(event) {
        return event.origin === this._data.origin && event.source === this._host;
      }
    }, {
      key: '_sendInit',
      value: function _sendInit() {
        this._host.postMessage({
          eid: this._data.extension_id,
          type: 'init'
        }, this._data.origin);
      }
    }, {
      key: 'broadcast',
      value: function broadcast(event, evnt) {
        if (!util.isString(event)) {
          throw new Error("Event type must be string");
        }

        this._host.postMessage({
          eid: this._data.extension_id,
          type: 'broadcast',
          etyp: event,
          evnt: evnt
        }, this._data.origin);
      }
    }, {
      key: 'require',
      value: function require(modules, callback) {
        var _this5 = this;

        var requiredModules = Array.isArray(modules) ? modules : [modules],
            args = requiredModules.map(function (module) {
          return _this5._hostModules[module] || _this5._hostModules._globals[module];
        });
        callback.apply(window, args);
      }
    }, {
      key: 'register',
      value: function register(handlers) {
        if ((typeof handlers === 'undefined' ? 'undefined' : _typeof(handlers)) === "object") {
          this._eventHandlers = _extends({}, this._eventHandlers, handlers) || {};
          this._host.postMessage({
            eid: this._data.extension_id,
            type: 'event_query',
            args: Object.getOwnPropertyNames(handlers)
          }, this._data.origin);
        }
      }
    }, {
      key: 'registerAny',
      value: function registerAny(handlers) {
        this.register({ '_any': handlers });
      }
    }, {
      key: '_initResize',
      value: function _initResize() {
        this.resize();
        resizeListener.add(util._bind(this, this.resize));
      }
    }, {
      key: 'resize',
      value: function resize(width, height) {
        if (!width || !height) {
          var dimensions = size();
          width = dimensions.w;
          height = dimensions.h;
        }
        this.require('env', function (env) {
          if (env && env.resize) {
            env.resize(width, height);
          }
        });
      }
    }]);
    return AP;
  }(PostMessage);

  var plugin = new AP();

  function deprecate (fn, name, alternate, sinceVersion) {
    var called = false;
    return function () {
      if (!called && typeof console !== 'undefined' && console.warn) {
        called = true;
        console.warn('DEPRECATED API - ' + name + ' has been deprecated since ACJS ' + sinceVersion + (' and will be removed in a future release. ' + (alternate ? 'Use ' + alternate + ' instead.' : 'No alternative will be provided.')));
        plugin._analytics.trackDeprecatedMethodUsed(name);
      }
      return fn.apply(undefined, arguments);
    };
  };

  // universal iterator utility
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
          if (o.hasOwnProperty(k) && it.call(o[k], k, o[k]) === false) {
            break;
          }
        }
      }
    }
  }

  function binder$1(std, odd) {
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

  var util$1 = {
    each: each,
    log: log,
    decodeQueryComponent: decodeQueryComponent,
    bind: binder$1('add', 'attach'),
    unbind: binder$1('remove', 'detach'),

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

    isFunction: function isFunction(fn) {
      return typeof fn === 'function';
    },

    handleError: function handleError(err) {
      if (!log.apply(this, err && err.message ? [err, err.message] : [err])) {
        throw err;
      }
    }
  };

  var _each$1 = util$1.each;
  var extend = util$1.extend;
  var document$2 = window.document;

  function $$1(sel, context) {

    context = context || document$2;

    var els = [];
    if (sel) {
      if (typeof sel === 'string') {
        var results = context.querySelectorAll(sel);
        _each$1(results, function (i, v) {
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
        _each$1(this, it);
        return this;
      },
      bind: function bind(name, callback) {
        this.each(function (i, el) {
          util$1.bind(el, name, callback);
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
          _each$1(spec, function (k, v) {
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

  var $$2 = extend($$1, util$1);

  var ConsumerOptions$2 = function () {
    function ConsumerOptions() {
      classCallCheck(this, ConsumerOptions);
    }

    createClass(ConsumerOptions, [{
      key: '_getConsumerOptions',
      value: function _getConsumerOptions() {
        var options = {};
        var $script = $$2('script[src*=\'/atlassian-connect/all\']');

        if (!($script && /\/atlassian-connect\/all(-debug)?\.js($|\?)/.test($script.attr('src')))) {
          $script = $$2('#ac-iframe-options');
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
  }();

  var consumerOptions = new ConsumerOptions$2();

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
  plugin.registerAny(function (data, callback) {
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

  var events$1 = {
    off: function off(name, listener) {
      if (events[name]) {
        var index = events[name].indexOf(listener);
        if (index > -1) {
          events[name].splice(index, 1);
        }
      }
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
      var eventsRef = this;
      this.on(name, function () {
        listener.apply(null, arguments);
        eventsRef.off(name, listener);
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

  var customButtonIncrement = 1;

  var getCustomData = deprecate(function () {
    return plugin._data.options.customData;
  }, 'AP.dialog.customData', 'AP.dialog.getCustomData()', '5.0');

  /**
   * Returns the custom data Object passed to the dialog at creation.
   * @noDemo
   * @deprecated Please use the `dialog.getCustomData(callback)` instead.
   * @name customData
   * @memberOf module:Dialog
   * @example
   * AP.require('dialog', function(dialog){
   *   var myDataVariable = dialog.customData.myDataVariable;
   * });
   *
   * @return {Object} Data Object passed to the dialog on creation.
   */
  Object.defineProperty(plugin._hostModules.dialog, 'customData', {
    get: getCustomData
  });
  Object.defineProperty(plugin.dialog, 'customData', {
    get: getCustomData
  });

  var dialogHandlers = {};

  events$1.onAny(eventDelegator);
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

    // ignore events that are triggered by button clicks
    // allow dialog.close through for close on ESC
    if (shouldClose && typeof args.button === 'undefined') {
      return;
    }

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
      plugin.dialog.close();
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

  var original_dialogCreate = plugin.dialog.create.prototype.constructor.bind({});

  plugin.dialog.create = plugin._hostModules.dialog.create = function () {
    var dialog = original_dialogCreate.apply(undefined, arguments);
    /**
     * Allows the add-on to register a callback function for the given event. The listener is only called once and must be re-registered if needed.
     * @deprecated Please use `AP.events.on("dialog.close", callback)` instead.
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
    dialog.on = deprecate(registerHandler, 'AP.dialog.on("close", callback)', 'AP.events.on("dialog.close", callback)', '5.0');
    return dialog;
  };

  var original_dialogGetButton = plugin.dialog.getButton.prototype.constructor.bind({});

  plugin.dialog.getButton = plugin._hostModules.dialog.getButton = function (name) {
    try {
      var button = original_dialogGetButton(name);
      /**
       * Registers a function to be called when the button is clicked.
       * @deprecated Please use `AP.events.on("dialog.message", callback)` instead.
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
      button.bind = deprecate(function (callback) {
        return registerHandler(name, callback);
      }, 'AP.dialog.getDialogButton().bind()', 'AP.events.on("dialog.message", callback)', '5.0');

      return button;
    } catch (e) {
      return {};
    }
  };

  var original_dialogCreateButton = plugin.dialog.createButton.prototype.constructor.bind({});

  plugin.dialog.createButton = plugin._hostModules.dialog.createButton = function (options) {
    var buttonProperties = {};
    if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
      buttonProperties.text = options;
      buttonProperties.identifier = options;
    } else {
      buttonProperties = options;
    }
    if (!buttonProperties.identifier) {
      buttonProperties.identifier = 'user.button.' + customButtonIncrement++;
    }
    var createButton = original_dialogCreateButton(buttonProperties);
    return plugin.dialog.getButton(buttonProperties.identifier);
  };

  /**
   * Register callbacks responding to messages from the host dialog, such as "submit" or "cancel"
   * @deprecated Please use `AP.events.on("dialog.message", callback)` instead.
   * @memberOf module:Dialog
   * @method onDialogMessage
   * @param {String} buttonName - button either "cancel" or "submit"
   * @param {Function} listener - callback function invoked when the requested button is pressed
   */
  plugin.dialog.onDialogMessage = plugin._hostModules.dialog.onDialogMessage = deprecate(registerHandler, 'AP.dialog.onDialogMessage()', 'AP.events.on("dialog.message", callback)', '5.0');

  if (!plugin.Dialog) {
    plugin.Dialog = plugin._hostModules.Dialog = plugin.dialog;
  }

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
    // get defined module
    if (modules[name]) {
      return modules[name];
    }

    // get a host module
    var hostModule = getFromHostModules(name);
    if (hostModule) {
      return modules[name] = hostModule;
    }

    // create a new module
    return modules[name] = {
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

  function getFromHostModules(name) {
    var module;
    if (plugin._hostModules) {
      if (plugin._hostModules[name]) {
        module = plugin._hostModules[name];
      }
      if (plugin._hostModules._globals && plugin._hostModules._globals[name]) {
        module = plugin._hostModules._globals[name];
      }
      if (module) {
        return {
          name: name,
          exports: module
        };
      }
    }
  }

  // define(name, objOrFn)
  // define(name, deps, fn(dep1, dep2, ...))
  var AMD = {
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
    require: function require(deps, callback) {
      reqAll(typeof deps === 'string' ? [deps] : deps, callback);
    }
  };

  function getMeta(name) {
    return $$2('meta[name=\'ap-' + name + '\']').attr('content');
  }

  var Meta = {
    getMeta: getMeta,

    localUrl: function localUrl(path) {
      var url = getMeta('local-base-url');
      return typeof url === 'undefined' || typeof path === 'undefined' ? url : '' + url + path;
    }
  };

  plugin._hostModules._dollar = $$2;
  plugin._hostModules['inline-dialog'] = plugin._hostModules.inlineDialog;

  if (consumerOptions.get('sizeToParent') === true) {
    plugin.env.sizeToParent();
  }

  if (consumerOptions.get('base') === true) {
    plugin.env.getLocation(function (loc) {
      $$2('head').append({ tag: 'base', href: loc, target: '_parent' });
    });
  }

  $$2.each(events$1, function (i, method) {
    plugin._hostModules.events[i] = plugin.events[i] = method;
  });

  plugin.define = deprecate(function () {
    return AMD.define.apply(AMD, arguments);
  }, 'AP.define()', null, '5.0');

  plugin.require = deprecate(function () {
    return AMD.require.apply(AMD, arguments);
  }, 'AP.require()', null, '5.0');

  var margin = plugin._data.options.isDialog ? '10px 10px 0 10px' : '0';
  if (consumerOptions.get('margin') !== false) {
    $$2('head').append({ tag: 'style', type: 'text/css', $text: 'body {margin: ' + margin + ' !important;}' });
  }

  plugin.Meta = {
    get: Meta.getMeta
  };
  plugin.meta = Meta.getMeta;
  plugin.localUrl = Meta.localUrl;

  plugin._hostModules._util = plugin._util = {
    each: util$1.each,
    log: util$1.log,
    decodeQueryComponent: util$1.decodeQueryComponent,
    bind: util$1.bind,
    unbind: util$1.unbind,
    extend: util$1.extend,
    trim: util$1.trim,
    debounce: util$1.debounce,
    isFunction: util$1.isFunction,
    handleError: util$1.handleError
  };

  return plugin;

}());