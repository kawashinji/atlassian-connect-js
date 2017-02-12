var AP = (function () {
  'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };





  var asyncGenerator = function () {
    function AwaitValue(value) {
      this.value = value;
    }

    function AsyncGenerator(gen) {
      var front, back;

      function send(key, arg) {
        return new Promise(function (resolve, reject) {
          var request = {
            key: key,
            arg: arg,
            resolve: resolve,
            reject: reject,
            next: null
          };

          if (back) {
            back = back.next = request;
          } else {
            front = back = request;
            resume(key, arg);
          }
        });
      }

      function resume(key, arg) {
        try {
          var result = gen[key](arg);
          var value = result.value;

          if (value instanceof AwaitValue) {
            Promise.resolve(value.value).then(function (arg) {
              resume("next", arg);
            }, function (arg) {
              resume("throw", arg);
            });
          } else {
            settle(result.done ? "return" : "normal", result.value);
          }
        } catch (err) {
          settle("throw", err);
        }
      }

      function settle(type, value) {
        switch (type) {
          case "return":
            front.resolve({
              value: value,
              done: true
            });
            break;

          case "throw":
            front.reject(value);
            break;

          default:
            front.resolve({
              value: value,
              done: false
            });
            break;
        }

        front = front.next;

        if (front) {
          resume(front.key, front.arg);
        } else {
          back = null;
        }
      }

      this._invoke = send;

      if (typeof gen.return !== "function") {
        this.return = undefined;
      }
    }

    if (typeof Symbol === "function" && Symbol.asyncIterator) {
      AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
        return this;
      };
    }

    AsyncGenerator.prototype.next = function (arg) {
      return this._invoke("next", arg);
    };

    AsyncGenerator.prototype.throw = function (arg) {
      return this._invoke("throw", arg);
    };

    AsyncGenerator.prototype.return = function (arg) {
      return this._invoke("return", arg);
    };

    return {
      wrap: function (fn) {
        return function () {
          return new AsyncGenerator(fn.apply(this, arguments));
        };
      },
      await: function (value) {
        return new AwaitValue(value);
      }
    };
  }();





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

  var get$1 = function get$1(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get$1(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
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



  var set$1 = function set$1(object, property, value, receiver) {
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent !== null) {
        set$1(parent, property, value, receiver);
      }
    } else if ("value" in desc && desc.writable) {
      desc.value = value;
    } else {
      var setter = desc.set;

      if (setter !== undefined) {
        setter.call(receiver, value);
      }
    }

    return value;
  };

  var LOG_PREFIX = "[Simple-XDM] ";
  var nativeBind = Function.prototype.bind;
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
      if (window.console && window.console.error) {
        var outputError = [];

        if (typeof msg === "string") {
          outputError.push(LOG_PREFIX + msg);
          outputError = outputError.concat(Array.prototype.slice.call(arguments, 1));
        } else {
          outputError.push(LOG_PREFIX);
          outputError = outputError.concat(Array.prototype.slice.call(arguments));
        }
        window.console.error.apply(null, outputError);
      }
    },
    warn: function warn(msg) {
      if (window.console) {
        console.warn(LOG_PREFIX + msg);
      }
    },
    _bind: function _bind(thisp, fn) {
      if (nativeBind && fn.bind === nativeBind) {
        return fn.bind(thisp);
      }
      return function () {
        return fn.apply(thisp, arguments);
      };
    },
    throttle: function throttle(func, wait, context) {
      var previous = 0;
      return function () {
        var now = Date.now();
        if (now - previous > wait) {
          previous = now;
          func.apply(context, arguments);
        }
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

        var handler = this._messageHandlers[event.data.type],
            extensionId = event.data.eid,
            reg = void 0;

        if (extensionId && this._registeredExtensions) {
          reg = this._registeredExtensions[extensionId];
        }

        if (!handler || !this._checkOrigin(event, reg)) {
          return false;
        }

        handler.call(this, event, reg);
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

      var _this = possibleConstructorReturn(this, (XDMRPC.__proto__ || Object.getPrototypeOf(XDMRPC)).call(this, config));

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
        key_triggered: _this._handleKeyTriggered,
        get_host_offset: _this._getHostOffset,
        unload: _this._handleUnload,
        sub: _this._handleSubInit
      };
      return _this;
    }

    createClass(XDMRPC, [{
      key: '_verifyAPI',
      value: function _verifyAPI(event, reg) {
        var untrustedTargets = event.data.targets;
        if (!untrustedTargets) {
          return;
        }
        var trustedSpec = this.getApiSpec();
        var tampered = false;

        function check(trusted, untrusted) {
          Object.getOwnPropertyNames(untrusted).forEach(function (name) {
            if (_typeof(untrusted[name]) === 'object' && trusted[name]) {
              check(trusted[name], untrusted[name]);
            } else {
              if (untrusted[name] === 'parent' && trusted[name]) {
                tampered = true;
              }
            }
          });
        }
        check(trustedSpec, untrustedTargets);
        event.source.postMessage({
          type: 'api_tamper',
          tampered: tampered
        }, reg.extension.url);
      }
    }, {
      key: '_handleInit',
      value: function _handleInit(event, reg) {
        this._registeredExtensions[reg.extension_id].source = event.source;
        if (reg.initCallback) {
          reg.initCallback(event.data.eid);
          delete reg.initCallback;
        }
        if (event.data.targets) {
          this._verifyAPI(event, reg);
        }
      }
      // postMessage method to do registerExtension

    }, {
      key: '_handleSubInit',
      value: function _handleSubInit(event, reg) {
        this.registerExtension(event.data.ext.id, {
          extension: event.data.ext
        });
      }
    }, {
      key: '_getHostOffset',
      value: function _getHostOffset(event) {
        var hostWindow = event.source;
        var hostFrameOffset = 0;
        while (!this._hasSameOrigin(hostWindow)) {
          // Climb up the iframe tree 1 layer
          hostFrameOffset++;
          hostWindow = hostWindow.parent;
        }
        event.source.postMessage({
          hostFrameOffset: hostFrameOffset
        }, event.origin);
      }
    }, {
      key: '_hasSameOrigin',
      value: function _hasSameOrigin(window) {
        if (window === window.top) {
          return true;
        }

        try {
          // Try set & read a variable on the given window
          // If we can successfully read the value then it means the given window has the same origin
          // as the window that is currently executing the script
          var testVariableName = 'test_var_' + Math.random().toString(16).substr(2);
          window[testVariableName] = true;
          return window[testVariableName];
        } catch (e) {
          // A exception will be thrown if the windows doesn't have the same origin
        }

        return false;
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
            type: 'presp',
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
            var padLength = method.length - 1;
            if (fnName === '_construct') {
              padLength = module.constructor.length - 1;
            }
            sendResponse._context = extension;
            methodArgs = this._padUndefinedArguments(methodArgs, padLength);
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
      key: '_handleKeyTriggered',
      value: function _handleKeyTriggered(event, reg) {
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
        moduleName = moduleName || '_globals';
        this._registeredAPIModules[moduleName] = util.extend({}, this._registeredAPIModules[moduleName] || {}, module);
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

          if (isSameTarget && element.targetSpec.key) {
            isSameTarget = element.targetSpec.addon_key === extension.extension.addon_key && element.targetSpec.key === extension.extension.key;
          }

          if (eventIsValid && isSameTarget) {
            executed[index] = element;
            element.targetSpec = element.targetSpec || {};
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
          if (source && !reg.source) {
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

        // get_host_offset fires before init
        if (event.data.type === 'get_host_offset' && window === window.top) {
          isValidOrigin = true;
        }

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
      *     options: {
      *         autoresize: false,
      *         hostOrigin: 'https://connect-host.example.com/'
      *     }
      *   }
      *
      * @param initCallback The optional initCallback is called when the bridge between host and iframe is established.
      **/

    }, {
      key: 'create',
      value: function create(extension, initCallback) {
        var extension_id = this.registerExtension(extension, initCallback);
        var options = extension.options || {};

        var data = {
          extension_id: extension_id,
          api: this._xdm.getApiSpec(),
          origin: util.locationOrigin(),
          options: options
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
      value: function defineModule(moduleName, module, options) {
        this._xdm.defineAPIModule(module, moduleName, options);
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

  var _each = util.each;
  var document$1 = window.document;

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
        $.onDomLoad(sel);
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

  $.onDomLoad = function (func) {
    var w = window,
        readyState = w.document.readyState;

    if (readyState === "complete") {
      func.call(w);
    } else {
      $.bind(w, "load", function () {
        func.call(w);
      });
    }
  };

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
    container = container || getContainer();
    if (!container) {
      util.warn('size called before container or body appeared, ignoring');
    }

    if (widthInPx && typeof w === "string" && w.search('%') !== -1) {
      w = Math.max(container.scrollWidth, container.offsetWidth, container.clientWidth);
    }
    if (height) {
      h = height;
    } else {
      // Determine height of document element
      docHeight = Math.max(container.scrollHeight, document.documentElement.scrollHeight, container.offsetHeight, document.documentElement.offsetHeight, container.clientHeight, document.documentElement.clientHeight);

      if (container === document.body) {
        h = docHeight;
      } else {
        var computed = window.getComputedStyle(container);
        h = container.getBoundingClientRect().height;
        if (h === 0) {
          h = docHeight;
        } else {
          var additionalProperties = ['margin-top', 'margin-bottom'];
          additionalProperties.forEach(function (property) {
            var floated = parseFloat(computed[property]);
            h += floated;
          });
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

    // padding / margins on the body causes numerous resizing bugs.
    if (element.nodeName === 'BODY') {
      ['padding', 'margin'].forEach(function (attr) {
        element.style[attr + '-bottom'] = '0px';
        element.style[attr + '-top'] = '0px';
      }, this);
    }

    element.resizeSensor = document.createElement('div');
    element.resizeSensor.className = 'ac-resize-sensor';
    var style = 'position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: scroll; z-index: -1; visibility: hidden;';
    var styleChild = 'position: absolute; left: 0; top: 0;';

    element.resizeSensor.style.cssText = style;
    element.resizeSensor.innerHTML = '<div class="ac-resize-sensor-expand" style="' + style + '">' + '<div style="' + styleChild + '"></div>' + '</div>' + '<div class="ac-resize-sensor-shrink" style="' + style + '">' + '<div style="' + styleChild + ' width: 200%; height: 200%"></div>' + '</div>';
    element.appendChild(element.resizeSensor);

    // https://bugzilla.mozilla.org/show_bug.cgi?id=548397
    // do not set body to relative
    if (element.nodeName !== 'BODY' && window.getComputedStyle && window.getComputedStyle(element).position === 'static') {
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

    var observerConfig = {
      attributes: true,
      attributeFilter: ['style']
    };

    var observer = new MutationObserver(onScroll);
    element.resizeObserver = observer;
    observer.observe(element, observerConfig);
  }

  var resizeListener = {
    add: function add(fn) {
      var container = getContainer();
      attachResizeEvent(container, fn);
    },
    remove: function remove() {
      var container = getContainer();
      if (container.resizeSensor) {
        container.resizeObserver.disconnect();
        container.removeChild(container.resizeSensor);
        delete container.resizeSensor;
        delete container.resizedAttached;
      }
    }
  };

  var AutoResizeAction = function () {
    function AutoResizeAction(callback) {
      classCallCheck(this, AutoResizeAction);

      this.resizeError = util.throttle(function (msg) {
        console.info(msg);
      }, 1000);

      this.dimensionStores = {
        width: [],
        height: []
      };
      this.callback = callback;
    }

    createClass(AutoResizeAction, [{
      key: '_setVal',
      value: function _setVal(val, type, time) {
        this.dimensionStores[type] = this.dimensionStores[type].filter(function (entry) {
          return time - entry.setAt < 400;
        });
        this.dimensionStores[type].push({
          val: parseInt(val, 10),
          setAt: time
        });
      }
    }, {
      key: '_isFlicker',
      value: function _isFlicker(val, type) {
        return this.dimensionStores[type].length >= 5;
      }
    }, {
      key: 'triggered',
      value: function triggered(dimensions) {
        dimensions = dimensions || size();
        var now = Date.now();
        this._setVal(dimensions.w, 'width', now);
        this._setVal(dimensions.h, 'height', now);
        var isFlickerWidth = this._isFlicker(dimensions.w, 'width', now);
        var isFlickerHeight = this._isFlicker(dimensions.h, 'height', now);
        if (isFlickerWidth) {
          dimensions.w = "100%";
          this.resizeError("SIMPLE XDM: auto resize flickering width detected, setting to 100%");
        }
        if (isFlickerHeight) {
          var vals = this.dimensionStores['height'].map(function (x) {
            return x.val;
          });
          dimensions.h = Math.max.apply(null, vals) + 'px';
          this.resizeError("SIMPLE XDM: auto resize flickering height detected, setting to: " + dimensions.h);
        }
        this.callback(dimensions.w, dimensions.h);
      }
    }]);
    return AutoResizeAction;
  }();

  var ConsumerOptions = function () {
    function ConsumerOptions() {
      classCallCheck(this, ConsumerOptions);
    }

    createClass(ConsumerOptions, [{
      key: "_elementExists",
      value: function _elementExists($el) {
        return $el && $el.length === 1;
      }
    }, {
      key: "_elementOptions",
      value: function _elementOptions($el) {
        return $el.attr("data-options");
      }
    }, {
      key: "_getConsumerOptions",
      value: function _getConsumerOptions() {
        var options = {},
            $optionElement = $("#ac-iframe-options"),
            $scriptElement = $("script[src*='/atlassian-connect/all']");

        if (!this._elementExists($optionElement) || !this._elementOptions($optionElement)) {
          if (this._elementExists($scriptElement)) {
            $optionElement = $scriptElement;
          }
        }

        if (this._elementExists($optionElement)) {
          // get its data-options attribute, if any
          var optStr = this._elementOptions($optionElement);
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

  var AP$3 = function (_PostMessage) {
    inherits(AP, _PostMessage);

    function AP(options) {
      classCallCheck(this, AP);

      var _this = possibleConstructorReturn(this, (AP.__proto__ || Object.getPrototypeOf(AP)).call(this));

      ConfigurationOptions$1.set(options);
      _this._data = _this._parseInitData();
      ConfigurationOptions$1.set(_this._data.options);
      _this._data.options = _this._data.options || {};
      _this._hostOrigin = _this._data.options.hostOrigin || '*';
      _this._top = window.top;
      _this._host = window.parent || window;
      _this._topHost = _this._getHostFrame(_this._data.options.hostFrameOffset);
      if (_this._topHost !== _this._top) {
        _this._verifyHostFrameOffset();
      }
      _this._isKeyDownBound = false;
      _this._hostModules = {};
      _this._eventHandlers = {};
      _this._pendingCallbacks = {};
      _this._keyListeners = [];
      _this._version = "5.0.0-beta.35";
      _this._apiTampered = undefined;
      _this._isSubIframe = _this._topHost !== window.parent;
      _this._onConfirmedFns = [];
      if (_this._data.api) {
        _this._setupAPI(_this._data.api);
        _this._setupAPIWithoutRequire(_this._data.api);
      }

      _this._messageHandlers = {
        presp: _this._handleResponse,
        evt: _this._handleEvent,
        key_listen: _this._handleKeyListen,
        api_tamper: _this._handleApiTamper
      };

      if (_this._data.origin) {
        _this._sendInit(_this._host, _this._data.origin);
        if (_this._isSubIframe) {
          _this._sendInit(_this._topHost, _this._hostOrigin);
        }
      }
      _this._registerOnUnload();
      _this.resize = util._bind(_this, function (width, height) {
        if (!getContainer()) {
          util.warn('resize called before container or body appeared, ignoring');
          return;
        }
        var dimensions = size();
        if (!width) {
          width = dimensions.w;
        }
        if (!height) {
          height = dimensions.h;
        }
        if (_this._hostModules.env && _this._hostModules.env.resize) {
          _this._hostModules.env.resize(width, height);
        }
      });
      $(util._bind(_this, _this._autoResizer));
      _this.container = getContainer;
      _this.size = size;
      return _this;
    }

    createClass(AP, [{
      key: '_getHostFrame',
      value: function _getHostFrame(offset) {
        // Climb up the iframe tree to find the real host
        if (offset && typeof offset === 'number') {
          var hostFrame = window;
          for (var i = 0; i < offset; i++) {
            hostFrame = hostFrame.parent;
          }
          return hostFrame;
        } else {
          return this._top;
        }
      }
    }, {
      key: '_verifyHostFrameOffset',
      value: function _verifyHostFrameOffset() {
        var _this2 = this;

        // Asynchronously verify the host frame option with this._top
        var callback = function callback(e) {
          if (e.source === _this2._top && e.data && typeof e.data.hostFrameOffset === 'number') {
            window.removeEventListener('message', callback);

            if (_this2._getHostFrame(e.data.hostFrameOffset) !== _this2._topHost) {
              util.error('hostFrameOffset tampering detected, setting host frame to top window');
              _this2._topHost = _this2._top;
            }
          }
        };
        window.addEventListener('message', callback);

        this._top.postMessage({
          type: 'get_host_offset'
        }, this._hostOrigin);
      }
    }, {
      key: '_handleApiTamper',
      value: function _handleApiTamper(event) {
        if (event.data.tampered !== false) {
          this._host = undefined;
          this._apiTampered = true;
          util.error('XDM API tampering detected, api disabled');
        } else {
          this._apiTampered = false;
          this._onConfirmedFns.forEach(function (cb) {
            cb.apply(null);
          });
        }
        this._onConfirmedFns = [];
      }
    }, {
      key: '_registerOnUnload',
      value: function _registerOnUnload() {
        $.bind(window, 'unload', util._bind(this, function () {
          this._sendUnload(this._host, this._data.origin);
          this._sendUnload(this._topHost, this._hostOrigin);
        }));
      }
    }, {
      key: '_sendUnload',
      value: function _sendUnload(frame, origin) {
        frame.postMessage({
          eid: this._data.extension_id,
          type: 'unload'
        }, origin || '*');
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
        if (ConsumerOptions$1.get('resize') === false || ConsumerOptions$1.get('sizeToParent') === true) {
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
      key: '_findTarget',
      value: function _findTarget(moduleName, methodName) {
        return this._data.options && this._data.options.targets && this._data.options.targets[moduleName] && this._data.options.targets[moduleName][methodName] ? this._data.options.targets[moduleName][methodName] : 'top';
      }
    }, {
      key: '_createModule',
      value: function _createModule(moduleName, api) {
        var _this3 = this;

        return Object.getOwnPropertyNames(api).reduce(function (accumulator, memberName) {
          var member = api[memberName];
          if (member.hasOwnProperty('constructor')) {
            accumulator[memberName] = _this3._createProxy(moduleName, member, memberName);
          } else {
            accumulator[memberName] = _this3._createMethodHandler({
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
        var _this4 = this;

        this._hostModules = Object.getOwnPropertyNames(api).reduce(function (accumulator, moduleName) {
          accumulator[moduleName] = _this4._createModule(moduleName, api[moduleName], api[moduleName]._options);
          return accumulator;
        }, {});

        Object.getOwnPropertyNames(this._hostModules._globals || {}).forEach(function (global) {
          _this4[global] = _this4._hostModules._globals[global];
        });
      }
    }, {
      key: '_setupAPIWithoutRequire',
      value: function _setupAPIWithoutRequire(api) {
        var _this5 = this;

        Object.getOwnPropertyNames(api).forEach(function (moduleName) {
          if (typeof _this5[moduleName] !== "undefined") {
            throw new Error('XDM module: ' + moduleName + ' will collide with existing variable');
          }
          _this5[moduleName] = _this5._createModule(moduleName, api[moduleName]);
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

          var targetOrigin;
          var target;
          if (that._findTarget(methodData.mod, methodData.fn) === 'top') {
            target = that._topHost;
            targetOrigin = that._hostOrigin;
          } else {
            target = that._host;
            targetOrigin = that._data.origin;
          }
          if (util.hasCallback(args)) {
            data.mid = util.randomString();
            that._pendingCallback(data.mid, args.pop());
          }
          if (this && this._cls) {
            data._cls = this._cls;
            data._id = this._id;
          }
          data.args = util.sanitizeStructuredClone(args);

          if (that._isSubIframe && typeof that._apiTampered === 'undefined') {
            that._onConfirmedFns.push(function () {
              target.postMessage(data, targetOrigin);
            });
          } else {
            target.postMessage(data, targetOrigin);
          }
        };
      }
    }, {
      key: '_handleResponse',
      value: function _handleResponse(event) {
        var data = event.data;
        var pendingCallback = this._pendingCallbacks[data.mid];
        if (pendingCallback) {
          delete this._pendingCallbacks[data.mid];
          try {
            pendingCallback.apply(window, data.args);
          } catch (e) {
            util.error(e.message, e.stack);
          }
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
        function toArray$$1(handlers) {
          if (handlers) {
            if (!Array.isArray(handlers)) {
              handlers = [handlers];
            }
            return handlers;
          }
          return [];
        }
        var handlers = toArray$$1(this._eventHandlers[data.etyp]);
        handlers = handlers.concat(toArray$$1(this._eventHandlers._any));
        handlers.forEach(function (handler) {
          try {
            handler(data.evnt, sendResponse);
          } catch (e) {
            util.error('exception thrown in event callback for:' + data.etyp);
          }
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
            type: 'key_triggered'
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
        var no_source_types = ['api_tamper'];
        if (event.data && no_source_types.indexOf(event.data.type) > -1) {
          return true;
        }

        if (this._isSubIframe && event.source === this._topHost) {
          return true;
        }

        return event.origin === this._data.origin && event.source === this._host;
      }
    }, {
      key: '_sendInit',
      value: function _sendInit(frame, origin) {
        var targets;
        if (frame === this._topHost && this._topHost !== window.parent) {
          targets = ConfigurationOptions$1.get('targets');
        }

        frame.postMessage({
          eid: this._data.extension_id,
          type: 'init',
          targets: targets
        }, origin || '*');
      }
    }, {
      key: 'sendSubCreate',
      value: function sendSubCreate(extension_id, options) {
        options.id = extension_id;
        this._topHost.postMessage({
          eid: this._data.extension_id,
          type: 'sub',
          ext: options
        }, this._hostOrigin);
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
        var _this6 = this;

        var requiredModules = Array.isArray(modules) ? modules : [modules],
            args = requiredModules.map(function (module) {
          return _this6._hostModules[module] || _this6._hostModules._globals[module];
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
        var autoresize = new AutoResizeAction(this.resize);
        resizeListener.add(util._bind(autoresize, autoresize.triggered));
      }
    }]);
    return AP;
  }(PostMessage);

  var Combined = function (_Host) {
    inherits(Combined, _Host);

    function Combined() {
      classCallCheck(this, Combined);

      var _this = possibleConstructorReturn(this, (Combined.__proto__ || Object.getPrototypeOf(Combined)).call(this));

      _this.parentTargets = { _globals: {} };
      var plugin = new AP$3();
      // export options from plugin to host.
      Object.getOwnPropertyNames(plugin).forEach(function (prop) {
        if (['_hostModules', '_globals'].indexOf(prop) === -1 && this[prop] === undefined) {
          this[prop] = plugin[prop];
        }
      }, _this);

      ['registerAny', 'register'].forEach(function (prop) {
        this[prop] = Object.getPrototypeOf(plugin)[prop].bind(plugin);
      }, _this);

      //write plugin modules to host.
      var moduleSpec = plugin._data.api;
      if ((typeof moduleSpec === 'undefined' ? 'undefined' : _typeof(moduleSpec)) === 'object') {
        Object.getOwnPropertyNames(moduleSpec).forEach(function (moduleName) {
          var accumulator = {};
          Object.getOwnPropertyNames(moduleSpec[moduleName]).forEach(function (methodName) {
            if (moduleSpec[moduleName][methodName].hasOwnProperty('constructor')) {
              accumulator[methodName] = {
                constructor: plugin._hostModules[moduleName][methodName]
              };
            } else {
              accumulator[methodName] = plugin._hostModules[moduleName][methodName];
            }
          }, this);
          this._xdm.defineAPIModule(accumulator, moduleName);
        }, _this);
      }

      _this._hostModules = plugin._hostModules;

      _this.defineGlobal = function (module) {
        this.parentTargets['_globals'] = util.extend({}, this.parentTargets['_globals'], module);
        this._xdm.defineAPIModule(module);
      };

      _this.defineModule = function (moduleName, module) {
        this._xdm.defineAPIModule(module, moduleName);
        this.parentTargets[moduleName] = {};
        Object.getOwnPropertyNames(module).forEach(function (name) {
          this.parentTargets[moduleName][name] = 'parent';
        }, this);
      };

      _this.subCreate = function (extensionOptions, initCallback) {
        extensionOptions.options = extensionOptions.options || {};
        extensionOptions.options.targets = util.extend({}, this.parentTargets, extensionOptions.options.targets);
        var extension = this.create(extensionOptions, initCallback);
        plugin.sendSubCreate(extension.id, extensionOptions);
        return extension;
      };
      return _this;
    }

    return Combined;
  }(Connect);

  var AP$2 = new Combined();

  var deprecate = function (fn, name, alternate, sinceVersion) {
    var called = false;
    return function () {
      if (!called && typeof console !== 'undefined' && console.warn) {
        called = true;
        console.warn('DEPRECATED API - ' + name + ' has been deprecated since ACJS ' + sinceVersion + (' and will be removed in a future release. ' + (alternate ? 'Use ' + alternate + ' instead.' : 'No alternative will be provided.')));
        AP$2._analytics.trackDeprecatedMethodUsed(name);
      }
      return fn.apply(undefined, arguments);
    };
  };

  // universal iterator utility
  function each$1(o, it) {
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
    each: each$1,
    log: log,
    decodeQueryComponent: decodeQueryComponent,
    bind: binder$1('add', 'attach'),
    unbind: binder$1('remove', 'detach'),

    extend: function extend(dest) {
      var args = arguments;
      var srcs = [].slice.call(args, 1, args.length);
      each$1(srcs, function (i, src) {
        each$1(src, function (k, v) {
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
  var extend$1 = util$1.extend;
  var document$2 = window.document;

  function $$2(sel, context) {

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

    extend$1(els, {
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

  var $$3 = extend$1($$2, util$1);

  /**
   * The Events module provides a mechanism for emitting and receiving events.<br>
   *
   * A event emitted by `emit` method will only be received by the modules defined in the same add-on.<br>
   * Public events that emitted by `emitPublic` are used for cross add-on communication.
   * They can be received by any add-on modules that are currently presented on the page.
   *
   * <h3>Basic example</h3>
   * Add-on A:
   * ```
   * // The following will create an alert message every time the event `customEvent` is triggered.
   * AP.events.on('customEvent', function(){
   *   alert('event fired');
   * });
   *
   *
   * AP.events.emit('customEvent');
   * AP.events.emitPublic('customPublicEvent');
   * ```
   *
   *
   * Add-on B:
   * ```
   * // The following will create an alert message every time the event `customPublicEvent` is triggered by add-on A.
   * AP.events.onPublic('customPublicEvent', function(){
   *   alert('public event fired');
   * });
   * ```
   *
   * @name Events
   * @module
   */

  var Events = function () {
    function Events() {
      classCallCheck(this, Events);

      this._events = {};
      this.ANY_PREFIX = '_any';
      this.methods = ['off', 'offAll', 'offAny', 'on', 'onAny', 'once'];
    }

    createClass(Events, [{
      key: '_anyListener',
      value: function _anyListener(data, callback) {
        var eventName = callback._context.eventName;
        var any = this._events[this.ANY_PREFIX] || [];
        var byName = this._events[eventName] || [];

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
      }
    }, {
      key: 'off',
      value: function off(name, listener) {
        if (this._events[name]) {
          var index = this._events[name].indexOf(listener);
          if (index > -1) {
            this._events[name].splice(index, 1);
          }
          if (this._events[name].length === 0) {
            delete this._events[name];
          }
        }
      }
    }, {
      key: 'offAll',
      value: function offAll(name) {
        delete this._events[name];
      }
    }, {
      key: 'offAny',
      value: function offAny(listener) {
        this.off(this.ANY_PREFIX, listener);
      }
    }, {
      key: 'on',
      value: function on(name, listener) {
        if (!this._events[name]) {
          this._events[name] = [];
        }
        this._events[name].push(listener);
      }
    }, {
      key: 'onAny',
      value: function onAny(listener) {
        this.on(this.ANY_PREFIX, listener);
      }
    }, {
      key: 'once',
      value: function once(name, listener) {
        var _that = this;
        function runOnce() {
          listener.apply(null, arguments);
          _that.off(name, runOnce);
        }
        this.on(name, runOnce);
      }
      /**
       * Adds a listener for all occurrences of an event of a particular name.<br>
       * Listener arguments include any arguments passed to `events.emit`, followed by an object describing the complete event information.
       * @name on
       * @method
       * @memberof module:Events#
       * @param {String} name The event name to subscribe the listener to
       * @param {Function} listener A listener callback to subscribe to the event name
       */

      /**
       * Adds a listener for all occurrences of a public event of a particular name.<br>
       * Listener arguments include any arguments passed to `events.emitPublic`, followed by an object describing the complete event information.<br>
       * Event emitter's information will be passed to the first argument of the filter function. The listener callback will only be called when filter function returns `true`.
       * @name onPublic
       * @method
       * @memberof module:Events#
       * @param {String} name The event name to subscribe the listener to
       * @param {Function} listener A listener callback to subscribe to the event name
       * @param {Function} [filter] A filter function to filter the events. Callback will always be called when a matching event occurs if the filter is unspecified
       */

      /**
       * Adds a listener for one occurrence of an event of a particular name.<br>
       * Listener arguments include any argument passed to `events.emit`, followed by an object describing the complete event information.
       * @name once
       * @method
       * @memberof module:Events#
       * @param {String} name The event name to subscribe the listener to
       * @param {Function} listener A listener callback to subscribe to the event name
       */

      /**
       * Adds a listener for one occurrence of a public event of a particular name.<br>
       * Listener arguments include any argument passed to `events.emit`, followed by an object describing the complete event information.<br>
       * Event emitter's information will be passed to the first argument of the filter function. The listener callback will only be called when filter function returns `true`.
       * @name oncePublic
       * @method
       * @memberof module:Events#
       * @param {String} name The event name to subscribe the listener to
       * @param {Function}listener A listener callback to subscribe to the event name
       * @param {Function} [filter] A filter function to filter the events. Callback will always be called when a matching event occurs if the filter is unspecified
       */

      /**
       * Adds a listener for all occurrences of any event, regardless of name.<br>
       * Listener arguments begin with the event name, followed by any arguments passed to `events.emit`, followed by an object describing the complete event information.
       * @name onAny
       * @method
       * @memberof module:Events#
       * @param {Function} listener A listener callback to subscribe for any event name
       */

      /**
       * Adds a listener for all occurrences of any event, regardless of name.<br>
       * Listener arguments begin with the event name, followed by any arguments passed to `events.emit`, followed by an object describing the complete event information.<br>
       * Event emitter's information will be passed to the first argument of the filter function. The listener callback will only be called when filter function returns `true`.
       * @name onAnyPublic
       * @method
       * @memberof module:Events#
       * @param {Function} listener A listener callback to subscribe for any event name
       * @param {Function} [filter] A filter function to filter the events. Callback will always be called when a matching event occurs if the filter is unspecified
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
       * Removes a particular listener for a public event.
       * @name offPublic
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
       * Removes all listeners from a public event name, or unsubscribes all event-name-specific listeners for public events
       * if no name if given.
       * @name offAllPublic
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
       * Removes an `anyPublic` event listener.
       * @name offAnyPublic
       * @method
       * @memberof module:Events#
       * @param {Function} listener A listener callback to unsubscribe from any event name
       */

      /**
       * Emits an event on this bus, firing listeners by name as well as all 'any' listeners.<br>
       * Arguments following the name parameter are captured and passed to listeners.
       * @name emit
       * @method
       * @memberof module:Events#
       * @param {String} name The name of event to emit
       * @param {String[]} args 0 or more additional data arguments to deliver with the event
       */

      /**
       * Emits a public event on this bus, firing listeners by name as well as all 'anyPublic' listeners.<br>
       * The event can be received by any add-on modules that are currently presented on the page.<br>
       * Arguments following the name parameter are captured and passed to listeners.
       * @name emitPublic
       * @method
       * @memberof module:Events#
       * @param {String} name The name of event to emit
       * @param {String[]} args 0 or more additional data arguments to deliver with the event
       */

    }]);
    return Events;
  }();

  var EventsInstance = new Events();

  var PublicEvents = function (_Events) {
    inherits(PublicEvents, _Events);

    function PublicEvents() {
      classCallCheck(this, PublicEvents);

      var _this = possibleConstructorReturn(this, (PublicEvents.__proto__ || Object.getPrototypeOf(PublicEvents)).call(this));

      _this.methods = ['offPublic', 'offAllPublic', 'offAnyPublic', 'onPublic', 'onAnyPublic', 'oncePublic'];
      return _this;
    }

    createClass(PublicEvents, [{
      key: '_filterEval',
      value: function _filterEval(filter, toCompare) {
        var value = true;
        if (!filter) {
          return value;
        }
        switch (typeof filter === 'undefined' ? 'undefined' : _typeof(filter)) {
          case 'function':
            value = Boolean(filter.call(null, toCompare));
            break;
          case 'object':
            value = Object.getOwnPropertyNames(filter).every(function (prop) {
              return toCompare[prop] === filter[prop];
            });
            break;
        }
        return value;
      }
    }, {
      key: 'once',
      value: function once(name, listener, filter) {
        var that = this;
        function runOnce(data) {
          listener.apply(null, data);
          that.off(name, runOnce);
        }
        this.on(name, runOnce, filter);
      }
    }, {
      key: 'on',
      value: function on(name, listener, filter) {
        listener._wrapped = function (data) {
          if (this._filterEval(filter, data.sender)) {
            listener.apply(null, data.event);
          }
        }.bind(this);
        get$1(PublicEvents.prototype.__proto__ || Object.getPrototypeOf(PublicEvents.prototype), 'on', this).call(this, name, listener._wrapped);
      }
    }, {
      key: 'off',
      value: function off(name, listener) {
        if (listener._wrapped) {
          get$1(PublicEvents.prototype.__proto__ || Object.getPrototypeOf(PublicEvents.prototype), 'off', this).call(this, name, listener._wrapped);
        } else {
          get$1(PublicEvents.prototype.__proto__ || Object.getPrototypeOf(PublicEvents.prototype), 'off', this).call(this, name, listener);
        }
      }
    }, {
      key: 'onAny',
      value: function onAny(listener, filter) {
        listener._wrapped = function (data) {
          if (data.sender && this._filterEval(filter, data.sender)) {
            listener.apply(null, data.event);
          }
        };
        get$1(PublicEvents.prototype.__proto__ || Object.getPrototypeOf(PublicEvents.prototype), 'onAny', this).call(this, listener._wrapped);
      }
    }, {
      key: 'offAny',
      value: function offAny(listener) {
        if (listener._wrapped) {
          get$1(PublicEvents.prototype.__proto__ || Object.getPrototypeOf(PublicEvents.prototype), 'offAny', this).call(this, name, listener._wrapped);
        } else {
          get$1(PublicEvents.prototype.__proto__ || Object.getPrototypeOf(PublicEvents.prototype), 'offAny', this).call(this, name, listener);
        }
      }
    }]);
    return PublicEvents;
  }(Events);

  var PublicEventsInstance = new PublicEvents();

  var customButtonIncrement = 1;

  var getCustomData = deprecate(function () {
    return AP$2._data.options.customData;
  }, 'AP.dialog.customData', 'AP.dialog.getCustomData()', '5.0');

  /**
   * Returns the custom data Object passed to the dialog at creation.
   * @noDemo
   * @deprecated Please use the `dialog.getCustomData(callback)` instead.
   * @name customData
   * @memberOf module:Dialog
   * @example
   * var myDataVariable = AP.dialog.customData.myDataVariable;
   *
   * @return {Object} Data Object passed to the dialog on creation.
   */
  Object.defineProperty(AP$2._hostModules.dialog, 'customData', {
    get: getCustomData
  });
  Object.defineProperty(AP$2.dialog, 'customData', {
    get: getCustomData
  });

  var dialogHandlers = {};

  EventsInstance.onAny(eventDelegator);
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
    var context = null;
    // ignore events that are triggered by button clicks
    // allow dialog.close through for close on ESC
    if (shouldClose && typeof args.button === 'undefined') {
      return;
    }
    if (args && args.button && args.button.name) {
      context = AP$2.dialog.getButton(args.button.name);
    }

    try {
      if (handlers) {
        shouldClose = handlers.reduce(function (result, cb) {
          return cb.call(context, args) && result;
        }, shouldClose);
      }
    } catch (err) {
      console.error(err);
    } finally {
      delete dialogHandlers[name];
    }
    if (shouldClose) {
      AP$2.dialog.close();
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

  var original_dialogCreate = AP$2.dialog.create.prototype.constructor.bind({});

  AP$2.dialog.create = AP$2._hostModules.dialog.create = function () {
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
     * AP.dialog.create(opts).on("close", callbackFunc);
     */
    dialog.on = deprecate(registerHandler, 'AP.dialog.on("close", callback)', 'AP.events.on("dialog.close", callback)', '5.0');
    return dialog;
  };

  var original_dialogGetButton = AP$2.dialog.getButton.prototype.constructor.bind({});

  AP$2.dialog.getButton = AP$2._hostModules.dialog.getButton = function (name) {
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
       * AP.dialog.getButton('submit').bind(function(){
       *   alert('clicked!');
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

  var original_dialogCreateButton = AP$2.dialog.createButton.prototype.constructor.bind({});

  AP$2.dialog.createButton = AP$2._hostModules.dialog.createButton = function (options) {
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
    return AP$2.dialog.getButton(buttonProperties.identifier);
  };

  /**
   * Register callbacks responding to messages from the host dialog, such as "submit" or "cancel"
   * @deprecated Please use `AP.events.on("dialog.message", callback)` instead.
   * @memberOf module:Dialog
   * @method onDialogMessage
   * @param {String} buttonName - button either "cancel" or "submit"
   * @param {Function} listener - callback function invoked when the requested button is pressed
   */
  AP$2.dialog.onDialogMessage = AP$2._hostModules.dialog.onDialogMessage = deprecate(registerHandler, 'AP.dialog.onDialogMessage()', 'AP.events.on("dialog.message", callback)', '5.0');

  if (!AP$2.Dialog) {
    AP$2.Dialog = AP$2._hostModules.Dialog = AP$2.dialog;
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
    if (AP$2._hostModules) {
      if (AP$2._hostModules[name]) {
        module = AP$2._hostModules[name];
      }
      if (AP$2._hostModules._globals && AP$2._hostModules._globals[name]) {
        module = AP$2._hostModules._globals[name];
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
    return $$3('meta[name=\'ap-' + name + '\']').attr('content');
  }

  var Meta = {
    getMeta: getMeta,

    localUrl: function localUrl(path) {
      var url = getMeta('local-base-url');
      return typeof url === 'undefined' || typeof path === 'undefined' ? url : '' + url + path;
    }
  };

  AP$2._hostModules._dollar = $$3;
  AP$2._hostModules['inline-dialog'] = AP$2._hostModules.inlineDialog;

  if (ConsumerOptions$1.get('sizeToParent') === true) {
    AP$2.env.sizeToParent(ConsumerOptions$1.get('hideFooter') === true);
  }

  if (ConsumerOptions$1.get('base') === true) {
    AP$2.env.getLocation(function (loc) {
      $$3('head').append({ tag: 'base', href: loc, target: '_parent' });
    });
  }

  $$3.each(EventsInstance.methods, function (i, method) {
    AP$2._hostModules.events[method] = AP$2.events[method] = EventsInstance[method].bind(EventsInstance);
    AP$2._hostModules.events[method + 'Public'] = AP$2.events[method + 'Public'] = PublicEventsInstance[method].bind(PublicEventsInstance);
  });

  AP$2.define = deprecate(function () {
    return AMD.define.apply(AMD, arguments);
  }, 'AP.define()', null, '5.0');

  AP$2.require = deprecate(function () {
    return AMD.require.apply(AMD, arguments);
  }, 'AP.require()', null, '5.0');

  var margin = AP$2._data.options.isDialog ? '10px 10px 0 10px' : '0';
  if (ConsumerOptions$1.get('margin') !== false) {
    $$3('head').append({ tag: 'style', type: 'text/css', $text: 'body {margin: ' + margin + ' !important;}' });
  }

  AP$2.Meta = {
    get: Meta.getMeta
  };
  AP$2.meta = Meta.getMeta;
  AP$2.localUrl = Meta.localUrl;

  AP$2._hostModules._util = AP$2._util = {
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

  if (AP$2.defineModule) {
    AP$2.defineModule('env', { resize: function resize(w, h, callback) {
        var iframe = document.getElementById(callback._context.extension_id);
        iframe.style.width = w + (typeof w === 'number' ? 'px' : '');
        iframe.style.height = h + (typeof h === 'number' ? 'px' : '');
      } });
  }

  if (AP$2._data && AP$2._data.origin) {
    AP$2.registerAny(function (data, callback) {
      // dialog.close event doesn't have event data
      if (data && data.event && data.sender) {
        PublicEventsInstance._anyListener(data, callback);
      } else {
        EventsInstance._anyListener(data, callback);
      }
    });
  }

  return AP$2;

}());
