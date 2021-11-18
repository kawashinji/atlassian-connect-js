var AP = (function () {
  'use strict';

  const LOG_PREFIX = "[Simple-XDM] ";
  const nativeBind = Function.prototype.bind;
  const util = {
    locationOrigin() {
      if (!window.location.origin) {
        return window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
      } else {
        return window.location.origin;
      }
    },

    randomString() {
      return Math.floor(Math.random() * 1000000000).toString(16);
    },

    isString(str) {
      return typeof str === "string" || str instanceof String;
    },

    argumentsToArray(arrayLike) {
      return Array.prototype.slice.call(arrayLike);
    },

    argumentNames(fn) {
      return fn.toString().replace(/((\/\/.*$)|(\/\*[^]*?\*\/))/mg, '') // strip comments
      .replace(/[^(]+\(([^)]*)[^]+/, '$1') // get signature
      .match(/([^\s,]+)/g) || [];
    },

    hasCallback(args) {
      var length = args.length;
      return length > 0 && typeof args[length - 1] === 'function';
    },

    error(msg) {
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

    warn(msg) {
      if (window.console) {
        console.warn(LOG_PREFIX + msg);
      }
    },

    log(msg) {
      if (window.console) {
        window.console.log(LOG_PREFIX + msg);
      }
    },

    _bind(thisp, fn) {
      if (nativeBind && fn.bind === nativeBind) {
        return fn.bind(thisp);
      }

      return function () {
        return fn.apply(thisp, arguments);
      };
    },

    throttle(func, wait, context) {
      var previous = 0;
      return function () {
        var now = Date.now();

        if (now - previous > wait) {
          previous = now;
          func.apply(context, arguments);
        }
      };
    },

    each(list, iteratee) {
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

    extend(dest) {
      var args = arguments;
      var srcs = [].slice.call(args, 1, args.length);
      srcs.forEach(function (source) {
        if (typeof source === "object") {
          Object.getOwnPropertyNames(source).forEach(function (name) {
            dest[name] = source[name];
          });
        }
      });
      return dest;
    },

    sanitizeStructuredClone(object) {
      const whiteList = [Boolean, String, Date, RegExp, Blob, File, FileList, ArrayBuffer];
      const blackList = [Error, Node];
      const warn = util.warn;
      var visitedObjects = [];

      function _clone(value) {
        if (typeof value === 'function') {
          warn("A function was detected and removed from the message.");
          return null;
        }

        if (blackList.some(t => {
          if (value instanceof t) {
            warn("".concat(t.name, " object was detected and removed from the message."));
            return true;
          }

          return false;
        })) {
          return {};
        }

        if (value && typeof value === 'object' && whiteList.every(t => !(value instanceof t))) {
          let newValue;

          if (Array.isArray(value)) {
            newValue = value.map(function (element) {
              return _clone(element);
            });
          } else {
            if (visitedObjects.indexOf(value) > -1) {
              warn("A circular reference was detected and removed from the message.");
              return null;
            }

            visitedObjects.push(value);
            newValue = {};

            for (let name in value) {
              if (value.hasOwnProperty(name)) {
                let clonedValue = _clone(value[name]);

                if (clonedValue !== null) {
                  newValue[name] = clonedValue;
                }
              }
            }

            visitedObjects.pop();
          }

          return newValue;
        }

        return value;
      }

      return _clone(object);
    },

    getOrigin(url, base) {
      // everything except IE11
      if (typeof URL === 'function') {
        try {
          return new URL(url, base).origin;
        } catch (e) {}
      } // ie11 + safari 10


      var doc = document.implementation.createHTMLDocument('');

      if (base) {
        var baseElement = doc.createElement('base');
        baseElement.href = base;
        doc.head.appendChild(baseElement);
      }

      var anchorElement = doc.createElement('a');
      anchorElement.href = url;
      doc.body.appendChild(anchorElement);
      var origin = anchorElement.protocol + '//' + anchorElement.hostname; //ie11, only include port if referenced in initial URL

      if (url.match(/\/\/[^/]+:[0-9]+\//)) {
        origin += anchorElement.port ? ':' + anchorElement.port : '';
      }

      return origin;
    }

  };

  class PostMessage {
    constructor(data) {
      let d = data || {};

      this._registerListener(d.listenOn);
    }

    _registerListener(listenOn) {
      if (!listenOn || !listenOn.addEventListener) {
        listenOn = window;
      }

      listenOn.addEventListener("message", util._bind(this, this._receiveMessage), false);
    }

    _receiveMessage(event) {
      let handler = this._messageHandlers[event.data.type],
          extensionId = event.data.eid,
          reg;

      if (extensionId && this._registeredExtensions) {
        reg = this._registeredExtensions[extensionId];
      }

      if (!handler || !this._checkOrigin(event, reg)) {
        return false;
      }

      handler.call(this, event, reg);
    }

  }

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
  let VALID_EVENT_TIME_MS = 30000; //30 seconds

  class XDMRPC extends PostMessage {
    _padUndefinedArguments(array, length) {
      return array.length >= length ? array : array.concat(new Array(length - array.length));
    }

    constructor(config) {
      config = config || {};
      super(config);
      this._registeredExtensions = config.extensions || {};
      this._registeredAPIModules = {};
      this._registeredAPIModules._globals = {};
      this._pendingCallbacks = {};
      this._keycodeCallbacks = {};
      this._clickHandler = null;
      this._pendingEvents = {};
      this._messageHandlers = {
        init: this._handleInit,
        req: this._handleRequest,
        resp: this._handleResponse,
        broadcast: this._handleBroadcast,
        event_query: this._handleEventQuery,
        key_triggered: this._handleKeyTriggered,
        addon_clicked: this._handleAddonClick,
        get_host_offset: this._getHostOffset,
        unload: this._handleUnload,
        sub: this._handleSubInit
      };
    }

    _verifyAPI(event, reg) {
      var untrustedTargets = event.data.targets;

      if (!untrustedTargets) {
        return;
      }

      var trustedSpec = this.getApiSpec();
      var tampered = false;

      function check(trusted, untrusted) {
        Object.getOwnPropertyNames(untrusted).forEach(function (name) {
          if (typeof untrusted[name] === 'object' && trusted[name]) {
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

    _handleInit(event, reg) {
      event.source.postMessage({
        type: 'init_received'
      }, reg.extension.url);
      this._registeredExtensions[reg.extension_id].source = event.source;

      if (reg.initCallback) {
        reg.initCallback(event.data.eid);
        delete reg.initCallback;
      }

      if (event.data.targets) {
        this._verifyAPI(event, reg);
      }
    } // postMessage method to do registerExtension


    _handleSubInit(event, reg) {
      var blocked = reg.extension.options.noSub || this._getBooleanFeatureFlag && this._getBooleanFeatureFlag('com.atlassian.connect.resolve_inner_iframe_url');

      var data = event.data;

      if (blocked) {
        util.error("Sub-Extension requested by [" + reg.extension.addon_key + "] but feature is disabled");
      } else {
        this.registerExtension(data.ext.id, {
          extension: data.ext
        });
      }

      if (this._registeredRequestNotifier) {
        this._registeredRequestNotifier.call(null, {
          sub: data.ext,
          type: data.type,
          addon_key: reg.extension.addon_key,
          key: reg.extension.key,
          extension_id: reg.extension_id,
          blocked: blocked
        });
      }
    }

    _getHostOffset(event, _window) {
      var hostWindow = event.source;
      var hostFrameOffset = null;
      var windowReference = _window || window; // For testing

      if (windowReference === windowReference.top && typeof windowReference.getHostOffsetFunctionOverride === 'function') {
        hostFrameOffset = windowReference.getHostOffsetFunctionOverride(hostWindow);
      }

      if (typeof hostFrameOffset !== 'number') {
        hostFrameOffset = 0; // Find the closest frame that has the same origin as event source

        while (!this._hasSameOrigin(hostWindow)) {
          // Climb up the iframe tree 1 layer
          hostFrameOffset++;
          hostWindow = hostWindow.parent;
        }
      }

      event.source.postMessage({
        hostFrameOffset: hostFrameOffset
      }, event.origin);
    }

    _hasSameOrigin(window) {
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
      } catch (e) {// A exception will be thrown if the windows doesn't have the same origin
      }

      return false;
    }

    _handleResponse(event) {
      var data = event.data;
      var pendingCallback = this._pendingCallbacks[data.mid];

      if (pendingCallback) {
        delete this._pendingCallbacks[data.mid];
        pendingCallback.apply(window, data.args);
      }
    }

    registerRequestNotifier(cb) {
      this._registeredRequestNotifier = cb;
    }

    _handleRequest(event, reg) {
      function sendResponse() {
        var args = util.sanitizeStructuredClone(util.argumentsToArray(arguments));
        event.source.postMessage({
          mid: event.data.mid,
          type: 'resp',
          forPlugin: true,
          args: args
        }, reg.extension.url);
      }

      var data = event.data;
      var module = this._registeredAPIModules[data.mod];
      const extension = this.getRegisteredExtensions(reg.extension)[0];

      if (module) {
        let fnName = data.fn;

        if (data._cls) {
          const Cls = module[data._cls];
          const ns = data.mod + '-' + data._cls + '-';
          sendResponse._id = data._id;

          if (fnName === 'constructor') {
            if (!Cls._construct) {
              Cls.constructor.prototype._destroy = function () {
                delete this._context._proxies[ns + this._id];
              };

              Cls._construct = function () {
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = arguments[_key];
                }

                const inst = new Cls.constructor(...args);
                const callback = args[args.length - 1];
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
        }

        let method = module[fnName];

        if (method) {
          var methodArgs = data.args;
          var padLength = method.length - 1;

          if (fnName === '_construct') {
            padLength = module.constructor.length - 1;
          }

          sendResponse._context = extension;
          methodArgs = this._padUndefinedArguments(methodArgs, padLength);
          methodArgs.push(sendResponse);
          const promiseResult = method.apply(module, methodArgs);

          if (method.returnsPromise) {
            if (!(typeof promiseResult === 'object' || typeof promiseResult === 'function') || typeof promiseResult.then !== 'function') {
              sendResponse('Defined module method did not return a promise.');
            } else {
              promiseResult.then(result => {
                sendResponse(undefined, result);
              }).catch(err => {
                err = err instanceof Error ? err.message : err;
                sendResponse(err);
              });
            }
          }

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

    _handleBroadcast(event, reg) {
      var event_data = event.data;

      var targetSpec = r => r.extension.addon_key === reg.extension.addon_key && r.extension_id !== reg.extension_id;

      this.dispatch(event_data.etyp, targetSpec, event_data.evnt, null, null);
    }

    _handleKeyTriggered(event, reg) {
      var eventData = event.data;

      var keycodeEntry = this._keycodeKey(eventData.keycode, eventData.modifiers, reg.extension_id);

      var listeners = this._keycodeCallbacks[keycodeEntry];

      if (listeners) {
        listeners.forEach(listener => {
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

    defineAPIModule(module, moduleName) {
      moduleName = moduleName || '_globals';
      this._registeredAPIModules[moduleName] = util.extend({}, this._registeredAPIModules[moduleName] || {}, module);
      return this._registeredAPIModules;
    }

    isAPIModuleDefined(moduleName) {
      return typeof this._registeredAPIModules[moduleName] !== 'undefined';
    }

    _pendingEventKey(targetSpec, time) {
      var key = targetSpec.addon_key || 'global';

      if (targetSpec.key) {
        key = "".concat(key, "@@").concat(targetSpec.key);
      }

      key = "".concat(key, "@@").concat(time);
      return key;
    }

    queueEvent(type, targetSpec, event, callback) {
      var loaded_frame,
          targets = this._findRegistrations(targetSpec);

      loaded_frame = targets.some(target => {
        return target.registered_events !== undefined;
      }, this);

      if (loaded_frame) {
        this.dispatch(type, targetSpec, event, callback);
      } else {
        this._cleanupInvalidEvents();

        var time = new Date().getTime();
        this._pendingEvents[this._pendingEventKey(targetSpec, time)] = {
          type,
          targetSpec,
          event,
          callback,
          time,
          uid: util.randomString()
        };
      }
    }

    _cleanupInvalidEvents() {
      let now = new Date().getTime();
      let keys = Object.keys(this._pendingEvents);
      keys.forEach(index => {
        let element = this._pendingEvents[index];
        let eventIsValid = now - element.time <= VALID_EVENT_TIME_MS;

        if (!eventIsValid) {
          delete this._pendingEvents[index];
        }
      });
    }

    _handleEventQuery(message, extension) {
      let executed = {};
      let now = new Date().getTime();
      let keys = Object.keys(this._pendingEvents);
      keys.forEach(index => {
        let element = this._pendingEvents[index];
        let eventIsValid = now - element.time <= VALID_EVENT_TIME_MS;
        let isSameTarget = !element.targetSpec || this._findRegistrations(element.targetSpec).length !== 0;

        if (isSameTarget && element.targetSpec.key) {
          isSameTarget = element.targetSpec.addon_key === extension.extension.addon_key && element.targetSpec.key === extension.extension.key;
        }

        if (eventIsValid && isSameTarget) {
          executed[index] = element;
          element.targetSpec = element.targetSpec || {};
          this.dispatch(element.type, element.targetSpec, element.event, element.callback, message.source);
        } else if (!eventIsValid) {
          delete this._pendingEvents[index];
        }
      });
      this._registeredExtensions[extension.extension_id].registered_events = message.data.args;
      return executed;
    }

    _handleUnload(event, reg) {
      if (!reg) {
        return;
      }

      if (reg.extension_id && this._registeredExtensions[reg.extension_id]) {
        delete this._registeredExtensions[reg.extension_id].source;
      }

      if (reg.unloadCallback) {
        reg.unloadCallback(event.data.eid);
      }
    }

    dispatch(type, targetSpec, event, callback, source) {
      function sendEvent(reg, evnt) {
        if (reg.source && reg.source.postMessage) {
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

    _findRegistrations(targetSpec) {
      if (this._registeredExtensions.length === 0) {
        util.error('no registered extensions', this._registeredExtensions);
        return [];
      }

      var keys = Object.getOwnPropertyNames(targetSpec);
      var registrations = Object.getOwnPropertyNames(this._registeredExtensions).map(key => {
        return this._registeredExtensions[key];
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

    registerExtension(extension_id, data) {
      data._proxies = {};
      data.extension_id = extension_id;
      this._registeredExtensions[extension_id] = data;
    }

    _keycodeKey(key, modifiers, extension_id) {
      var code = key;

      if (modifiers) {
        if (typeof modifiers === "string") {
          modifiers = [modifiers];
        }

        modifiers.sort();
        modifiers.forEach(modifier => {
          code += '$$' + modifier;
        }, this);
      }

      return code + '__' + extension_id;
    }

    registerKeyListener(extension_id, key, modifiers, callback) {
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

    unregisterKeyListener(extension_id, key, modifiers, callback) {
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

        if (reg.source && reg.source.postMessage) {
          reg.source.postMessage({
            type: 'key_listen',
            keycode: key,
            modifiers: modifiers,
            action: 'remove'
          }, reg.extension.url);
        }
      }
    }

    registerClickHandler(callback) {
      if (typeof callback !== 'function') {
        throw new Error('callback must be a function');
      }

      if (this._clickHandler !== null) {
        throw new Error('ClickHandler already registered');
      }

      this._clickHandler = callback;
    }

    _handleAddonClick(event, reg) {
      if (typeof this._clickHandler === 'function') {
        this._clickHandler({
          addon_key: reg.extension.addon_key,
          key: reg.extension.key,
          extension_id: reg.extension_id
        });
      }
    }

    unregisterClickHandler() {
      this._clickHandler = null;
    }

    getApiSpec(addonKey) {
      function getModuleDefinition(mod) {
        return Object.getOwnPropertyNames(mod).reduce((accumulator, memberName) => {
          const member = mod[memberName];

          switch (typeof member) {
            case 'function':
              accumulator[memberName] = {
                args: util.argumentNames(member),
                returnsPromise: member.returnsPromise || false
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

      return Object.getOwnPropertyNames(this._registeredAPIModules).reduce((accumulator, moduleName) => {
        var module = this._registeredAPIModules[moduleName];

        if (typeof module.addonKey === 'undefined' || module.addonKey === addonKey) {
          accumulator[moduleName] = getModuleDefinition(module);
        }

        return accumulator;
      }, {});
    }

    _originEqual(url, origin) {
      function strCheck(str) {
        return typeof str === 'string' && str.length > 0;
      }

      let urlOrigin = util.getOrigin(url); // check strings are strings and they contain something

      if (!strCheck(url) || !strCheck(origin) || !strCheck(urlOrigin)) {
        return false;
      }

      return origin === urlOrigin;
    } // validate origin of postMessage


    _checkOrigin(event, reg) {
      let no_source_types = ['init'];
      let isNoSourceType = reg && !reg.source && no_source_types.indexOf(event.data.type) > -1;
      let sourceTypeMatches = reg && event.source === reg.source;

      let hasExtensionUrl = reg && this._originEqual(reg.extension.url, event.origin);

      let isValidOrigin = hasExtensionUrl && (isNoSourceType || sourceTypeMatches); // get_host_offset fires before init

      if (event.data.type === 'get_host_offset' && window === window.top) {
        isValidOrigin = true;
      } // check undefined for chromium (Issue 395010)


      if (event.data.type === 'unload' && (sourceTypeMatches || event.source === undefined)) {
        isValidOrigin = true;
      }

      return isValidOrigin;
    }

    getRegisteredExtensions(filter) {
      if (filter) {
        return this._findRegistrations(filter);
      }

      return this._registeredExtensions;
    }

    unregisterExtension(filter) {
      let registrations = this._findRegistrations(filter);

      if (registrations.length !== 0) {
        registrations.forEach(function (registration) {
          let keys = Object.keys(this._pendingEvents);
          keys.forEach(index => {
            let element = this._pendingEvents[index];
            let targetSpec = element.targetSpec || {};

            if (targetSpec.addon_key === registration.extension.addon_key && targetSpec.key === registration.extension.key) {
              delete this._pendingEvents[index];
            }
          });
          delete this._registeredExtensions[registration.extension_id];
        }, this);
      }
    }

    setFeatureFlagGetter(getBooleanFeatureFlag) {
      this._getBooleanFeatureFlag = getBooleanFeatureFlag;
    }

  }

  class Connect {
    constructor() {
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


    dispatch(type, targetSpec, event, callback) {
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


    broadcast(type, targetSpec, event) {
      this._xdm.dispatch(type, targetSpec, event, null, null);

      return this.getExtensions(targetSpec);
    }

    _createId(extension) {
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


    create(extension, initCallback, unloadCallback) {
      let extension_id = this.registerExtension(extension, initCallback, unloadCallback);
      let options = extension.options || {};
      let data = {
        extension_id: extension_id,
        api: this._xdm.getApiSpec(extension.addon_key),
        origin: util.locationOrigin(),
        options: options
      };
      return {
        id: extension_id,
        name: JSON.stringify(data),
        src: extension.url
      };
    }

    registerRequestNotifier(callback) {
      this._xdm.registerRequestNotifier(callback);
    }

    registerExtension(extension, initCallback, unloadCallback) {
      let extension_id = this._createId(extension);

      this._xdm.registerExtension(extension_id, {
        extension: extension,
        initCallback: initCallback,
        unloadCallback: unloadCallback
      });

      return extension_id;
    }

    registerKeyListener(extension_id, key, modifiers, callback) {
      this._xdm.registerKeyListener(extension_id, key, modifiers, callback);
    }

    unregisterKeyListener(extension_id, key, modifiers, callback) {
      this._xdm.unregisterKeyListener(extension_id, key, modifiers, callback);
    }

    registerClickHandler(callback) {
      this._xdm.registerClickHandler(callback);
    }

    unregisterClickHandler() {
      this._xdm.unregisterClickHandler();
    }

    defineModule(moduleName, module, options) {
      this._xdm.defineAPIModule(module, moduleName, options);
    }

    isModuleDefined(moduleName) {
      return this._xdm.isAPIModuleDefined(moduleName);
    }

    defineGlobals(module) {
      this._xdm.defineAPIModule(module);
    }

    getExtensions(filter) {
      return this._xdm.getRegisteredExtensions(filter);
    }

    unregisterExtension(filter) {
      return this._xdm.unregisterExtension(filter);
    }

    returnsPromise(wrappedMethod) {
      wrappedMethod.returnsPromise = true;
    }

    setFeatureFlagGetter(getBooleanFeatureFlag) {
      this._xdm.setFeatureFlagGetter(getBooleanFeatureFlag);
    }

    registerExistingExtension(extension_id, data) {
      return this._xdm.registerExtension(extension_id, data);
    }

  }

  /**
   * @this {Promise}
   */
  function finallyConstructor(callback) {
    var constructor = this.constructor;
    return this.then(
      function(value) {
        return constructor.resolve(callback()).then(function() {
          return value;
        });
      },
      function(reason) {
        return constructor.resolve(callback()).then(function() {
          return constructor.reject(reason);
        });
      }
    );
  }

  // Store setTimeout reference so promise-polyfill will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var setTimeoutFunc = setTimeout;

  function noop() {}

  // Polyfill for Function.prototype.bind
  function bind(fn, thisArg) {
    return function() {
      fn.apply(thisArg, arguments);
    };
  }

  /**
   * @constructor
   * @param {Function} fn
   */
  function Promise$1(fn) {
    if (!(this instanceof Promise$1))
      throw new TypeError('Promises must be constructed via new');
    if (typeof fn !== 'function') throw new TypeError('not a function');
    /** @type {!number} */
    this._state = 0;
    /** @type {!boolean} */
    this._handled = false;
    /** @type {Promise|undefined} */
    this._value = undefined;
    /** @type {!Array<!Function>} */
    this._deferreds = [];

    doResolve(fn, this);
  }

  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }
    if (self._state === 0) {
      self._deferreds.push(deferred);
      return;
    }
    self._handled = true;
    Promise$1._immediateFn(function() {
      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
      if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
      }
      var ret;
      try {
        ret = cb(self._value);
      } catch (e) {
        reject(deferred.promise, e);
        return;
      }
      resolve(deferred.promise, ret);
    });
  }

  function resolve(self, newValue) {
    try {
      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self)
        throw new TypeError('A promise cannot be resolved with itself.');
      if (
        newValue &&
        (typeof newValue === 'object' || typeof newValue === 'function')
      ) {
        var then = newValue.then;
        if (newValue instanceof Promise$1) {
          self._state = 3;
          self._value = newValue;
          finale(self);
          return;
        } else if (typeof then === 'function') {
          doResolve(bind(then, newValue), self);
          return;
        }
      }
      self._state = 1;
      self._value = newValue;
      finale(self);
    } catch (e) {
      reject(self, e);
    }
  }

  function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
  }

  function finale(self) {
    if (self._state === 2 && self._deferreds.length === 0) {
      Promise$1._immediateFn(function() {
        if (!self._handled) {
          Promise$1._unhandledRejectionFn(self._value);
        }
      });
    }

    for (var i = 0, len = self._deferreds.length; i < len; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }

  /**
   * @constructor
   */
  function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
  }

  /**
   * Take a potentially misbehaving resolver function and make sure
   * onFulfilled and onRejected are only called once.
   *
   * Makes no guarantees about asynchrony.
   */
  function doResolve(fn, self) {
    var done = false;
    try {
      fn(
        function(value) {
          if (done) return;
          done = true;
          resolve(self, value);
        },
        function(reason) {
          if (done) return;
          done = true;
          reject(self, reason);
        }
      );
    } catch (ex) {
      if (done) return;
      done = true;
      reject(self, ex);
    }
  }

  Promise$1.prototype['catch'] = function(onRejected) {
    return this.then(null, onRejected);
  };

  Promise$1.prototype.then = function(onFulfilled, onRejected) {
    // @ts-ignore
    var prom = new this.constructor(noop);

    handle(this, new Handler(onFulfilled, onRejected, prom));
    return prom;
  };

  Promise$1.prototype['finally'] = finallyConstructor;

  Promise$1.all = function(arr) {
    return new Promise$1(function(resolve, reject) {
      if (!arr || typeof arr.length === 'undefined')
        throw new TypeError('Promise.all accepts an array');
      var args = Array.prototype.slice.call(arr);
      if (args.length === 0) return resolve([]);
      var remaining = args.length;

      function res(i, val) {
        try {
          if (val && (typeof val === 'object' || typeof val === 'function')) {
            var then = val.then;
            if (typeof then === 'function') {
              then.call(
                val,
                function(val) {
                  res(i, val);
                },
                reject
              );
              return;
            }
          }
          args[i] = val;
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  Promise$1.resolve = function(value) {
    if (value && typeof value === 'object' && value.constructor === Promise$1) {
      return value;
    }

    return new Promise$1(function(resolve) {
      resolve(value);
    });
  };

  Promise$1.reject = function(value) {
    return new Promise$1(function(resolve, reject) {
      reject(value);
    });
  };

  Promise$1.race = function(values) {
    return new Promise$1(function(resolve, reject) {
      for (var i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  };

  // Use polyfill for setImmediate for performance gains
  Promise$1._immediateFn =
    (typeof setImmediate === 'function' &&
      function(fn) {
        setImmediate(fn);
      }) ||
    function(fn) {
      setTimeoutFunc(fn, 0);
    };

  Promise$1._unhandledRejectionFn = function _unhandledRejectionFn(err) {
    if (typeof console !== 'undefined' && console) {
      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
    }
  };

  var each$2 = util.each,
      document$2 = window.document;

  function $$2(sel, context) {
    context = context || document$2;
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
        $$2.onDomLoad(sel);
      }
    }

    util.extend(els, {
      each: function (it) {
        each$2(this, it);
        return this;
      },
      bind: function (name, callback) {
        this.each(function (i, el) {
          this.bind(el, name, callback);
        });
      },
      attr: function (k) {
        var v;
        this.each(function (i, el) {
          v = el[k] || el.getAttribute && el.getAttribute(k);
          return !v;
        });
        return v;
      },
      removeClass: function (className) {
        return this.each(function (i, el) {
          if (el.className) {
            el.className = el.className.replace(new RegExp('(^|\\s)' + className + '(\\s|$)'), ' ');
          }
        });
      },
      html: function (html) {
        return this.each(function (i, el) {
          el.innerHTML = html;
        });
      },
      append: function (spec) {
        return this.each(function (i, to) {
          var el = context.createElement(spec.tag);
          each$2(spec, function (k, v) {
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

  $$2.bind = binder$1('add', 'attach');
  $$2.unbind = binder$1('remove', 'detach');

  $$2.onDomLoad = function (func) {
    var w = window,
        readyState = w.document.readyState;

    if (readyState === "complete") {
      func.call(w);
    } else {
      $$2.bind(w, "load", function () {
        func.call(w);
      });
    }
  };

  function getContainer() {
    // Look for these two selectors first... you need these to allow for the auto-shrink to work
    // Otherwise, it'll default to document.body which can't auto-grow or auto-shrink
    var container = $$2('.ac-content, #content');
    return container.length > 0 ? container[0] : document.body;
  }

  /**
  * Extension wide configuration values
  */
  class ConfigurationOptions {
    constructor() {
      this.options = {};
    }

    _flush() {
      this.options = {};
    }

    get(item) {
      return item ? this.options[item] : this.options;
    }

    set(data, value) {
      if (!data) {
        return;
      }

      if (value) {
        data = {
          [data]: value
        };
      }

      var keys = Object.getOwnPropertyNames(data);
      keys.forEach(key => {
        this.options[key] = data[key];
      }, this);
    }

  }

  var ConfigurationOptions$1 = new ConfigurationOptions();

  var size = function (width, height, container) {
    var verticalScrollbarWidth = function () {
      var sbWidth = window.innerWidth - container.clientWidth; // sanity check only

      sbWidth = sbWidth < 0 ? 0 : sbWidth;
      sbWidth = sbWidth > 50 ? 50 : sbWidth;
      return sbWidth;
    };

    var horizontalScrollbarHeight = function () {
      var sbHeight = window.innerHeight - Math.min(container.clientHeight, document.documentElement.clientHeight); // sanity check only

      sbHeight = sbHeight < 0 ? 0 : sbHeight;
      sbHeight = sbHeight > 50 ? 50 : sbHeight;
      return sbHeight;
    };

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
    } // Include iframe scroll bars if visible and using exact dimensions


    w = typeof w === 'number' && Math.min(container.scrollHeight, document.documentElement.scrollHeight) > Math.min(container.clientHeight, document.documentElement.clientHeight) ? w + verticalScrollbarWidth() : w;
    h = typeof h === 'number' && container.scrollWidth > container.clientWidth ? h + horizontalScrollbarHeight() : h;
    return {
      w: w,
      h: h
    };
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
    } // padding / margins on the body causes numerous resizing bugs.


    if (element.nodeName === 'BODY') {
      ['padding', 'margin'].forEach(attr => {
        element.style[attr + '-bottom'] = '0px';
        element.style[attr + '-top'] = '0px';
      }, this);
    }

    element.resizeSensor = document.createElement('div');
    element.resizeSensor.className = 'ac-resize-sensor';
    var style = 'position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: scroll; z-index: -1; visibility: hidden;';
    var styleChild = 'position: absolute; left: 0; top: 0;';
    element.resizeSensor.style.cssText = style;
    var expand = document.createElement('div');
    expand.className = "ac-resize-sensor-expand";
    expand.style.cssText = style;
    var expandChild = document.createElement('div');
    expand.appendChild(expandChild);
    expandChild.style.cssText = styleChild;
    var shrink = document.createElement('div');
    shrink.className = "ac-resize-sensor-shrink";
    shrink.style.cssText = style;
    var shrinkChild = document.createElement('div');
    shrink.appendChild(shrinkChild);
    shrinkChild.style.cssText = styleChild + ' width: 200%; height: 200%';
    element.resizeSensor.appendChild(expand);
    element.resizeSensor.appendChild(shrink);
    element.appendChild(element.resizeSensor); // https://bugzilla.mozilla.org/show_bug.cgi?id=548397
    // do not set body to relative

    if (element.nodeName !== 'BODY' && window.getComputedStyle && window.getComputedStyle(element).position === 'static') {
      element.style.position = 'relative';
    }

    var lastWidth, lastHeight;

    var reset = function () {
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

    var changed = function () {
      if (element.resizedAttached) {
        element.resizedAttached.call();
      }
    };

    var onScroll = function () {
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
    add: function (fn) {
      var container = getContainer();
      attachResizeEvent(container, fn);
    },
    remove: function () {
      var container = getContainer();

      if (container.resizeSensor) {
        container.resizeObserver.disconnect();
        container.removeChild(container.resizeSensor);
        delete container.resizeSensor;
        delete container.resizedAttached;
      }
    }
  };

  class AutoResizeAction {
    constructor(callback) {
      this.resizeError = util.throttle(function (msg) {
        console.info(msg);
      }, 1000);
      this.dimensionStores = {
        width: [],
        height: []
      };
      this.callback = callback;
    }

    _setVal(val, type, time) {
      this.dimensionStores[type] = this.dimensionStores[type].filter(function (entry) {
        return time - entry.setAt < 400;
      });
      this.dimensionStores[type].push({
        val: parseInt(val, 10),
        setAt: time
      });
    }

    _isFlicker(val, type) {
      return this.dimensionStores[type].length >= 5;
    }

    triggered(dimensions) {
      dimensions = dimensions || size();
      let now = Date.now();

      this._setVal(dimensions.w, 'width', now);

      this._setVal(dimensions.h, 'height', now);

      var isFlickerWidth = this._isFlicker(dimensions.w, 'width', now);

      var isFlickerHeight = this._isFlicker(dimensions.h, 'height', now);

      if (isFlickerWidth) {
        dimensions.w = "100%";
        this.resizeError("SIMPLE XDM: auto resize flickering width detected, setting to 100%");
      }

      if (isFlickerHeight) {
        var vals = this.dimensionStores['height'].map(x => {
          return x.val;
        });
        dimensions.h = Math.max.apply(null, vals) + 'px';
        this.resizeError("SIMPLE XDM: auto resize flickering height detected, setting to: " + dimensions.h);
      }

      this.callback(dimensions.w, dimensions.h);
    }

  }

  class ConsumerOptions {
    _elementExists($el) {
      return $el && $el.length === 1;
    }

    _elementOptions($el) {
      return $el.attr("data-options");
    }

    _getConsumerOptions() {
      var options = {},
          $optionElement = $$2("#ac-iframe-options"),
          $scriptElement = $$2("script[src*='/atlassian-connect/all']"),
          $cdnScriptElement = $$2("script[src*='/connect-cdn.atl-paas.net/all']");

      if (!this._elementExists($optionElement) || !this._elementOptions($optionElement)) {
        if (this._elementExists($scriptElement)) {
          $optionElement = $scriptElement;
        } else if (this._elementExists($cdnScriptElement)) {
          $optionElement = $cdnScriptElement;
        }
      }

      if (this._elementExists($optionElement)) {
        // get its data-options attribute, if any
        var optStr = this._elementOptions($optionElement);

        if (optStr) {
          // if found, parse the value into kv pairs following the format of a style element
          optStr.split(";").forEach(nvpair => {
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

    _flush() {
      delete this._options;
    }

    get(key) {
      if (!this._options) {
        this._options = this._getConsumerOptions();
      }

      if (key) {
        return this._options[key];
      }

      return this._options;
    }

  }

  var consumerOptions = new ConsumerOptions();

  const POSSIBLE_MODIFIER_KEYS = ['ctrl', 'shift', 'alt', 'meta'];

  class AP extends PostMessage {
    constructor(options) {
      let initCheck = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      super();
      ConfigurationOptions$1.set(options);
      this._data = this._parseInitData();
      ConfigurationOptions$1.set(this._data.options);
      this._data.options = this._data.options || {};
      this._hostOrigin = this._data.options.hostOrigin || '*';
      this._top = window.top;
      this._host = window.parent || window;
      this._topHost = this._getHostFrame(this._data.options.hostFrameOffset);

      if (this._topHost !== this._top) {
        this._verifyHostFrameOffset();
      }

      this._initTimeout = 5000;
      this._initReceived = false;
      this._initCheck = initCheck;
      this._isKeyDownBound = false;
      this._hostModules = {};
      this._eventHandlers = {};
      this._pendingCallbacks = {};
      this._keyListeners = [];
      this._version = "5.3.40";
      this._apiTampered = undefined;
      this._isSubIframe = this._topHost !== window.parent;
      this._onConfirmedFns = [];
      this._promise = Promise$1;

      if (this._data.api) {
        this._setupAPI(this._data.api);

        this._setupAPIWithoutRequire(this._data.api);
      }

      this._messageHandlers = {
        init_received: this._handleInitReceived,
        resp: this._handleResponse,
        evt: this._handleEvent,
        key_listen: this._handleKeyListen,
        api_tamper: this._handleApiTamper
      };

      if (this._data.origin) {
        this._sendInit(this._host, this._data.origin);

        if (this._isSubIframe) {
          this._sendInit(this._topHost, this._hostOrigin);
        }
      }

      this._registerOnUnload();

      this.resize = util._bind(this, (width, height) => {
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

        if (this._hostModules.env && this._hostModules.env.resize) {
          this._hostModules.env.resize(width, height);
        }
      });
      $$2(util._bind(this, this._autoResizer));
      this.container = getContainer;
      this.size = size;
      window.addEventListener('click', e => {
        this._host.postMessage({
          eid: this._data.extension_id,
          type: 'addon_clicked'
        }, this._hostOrigin);
      });
    }

    _getHostFrame(offset) {
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

    _verifyHostFrameOffset() {
      // Asynchronously verify the host frame option with this._top
      var callback = e => {
        if (e.source === this._top && e.data && typeof e.data.hostFrameOffset === 'number') {
          window.removeEventListener('message', callback);

          if (this._getHostFrame(e.data.hostFrameOffset) !== this._topHost) {
            util.error('hostFrameOffset tampering detected, setting host frame to top window');
            this._topHost = this._top;
          }
        }
      };

      window.addEventListener('message', callback);

      this._top.postMessage({
        type: 'get_host_offset'
      }, this._hostOrigin);
    }

    _handleApiTamper(event) {
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

    _registerOnUnload() {
      $$2.bind(window, 'unload', util._bind(this, function () {
        this._sendUnload(this._host, this._data.origin);

        if (this._isSubIframe) {
          this._sendUnload(this._topHost, this._hostOrigin);
        }
      }));
    }

    _sendUnload(frame, origin) {
      frame.postMessage({
        eid: this._data.extension_id,
        type: 'unload'
      }, origin || '*');
    }

    _bindKeyDown() {
      if (!this._isKeyDownBound) {
        $$2.bind(window, 'keydown', util._bind(this, this._handleKeyDownDomEvent));
        this._isKeyDownBound = true;
      }
    }

    _autoResizer() {
      this._enableAutoResize = Boolean(ConfigurationOptions$1.get('autoresize'));

      if (consumerOptions.get('resize') === false || consumerOptions.get('sizeToParent') === true) {
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


    _parseInitData(data) {
      try {
        return JSON.parse(data || window.name);
      } catch (e) {
        return {};
      }
    }

    _findTarget(moduleName, methodName) {
      return this._data.options && this._data.options.targets && this._data.options.targets[moduleName] && this._data.options.targets[moduleName][methodName] ? this._data.options.targets[moduleName][methodName] : 'top';
    }

    _createModule(moduleName, api) {
      return Object.getOwnPropertyNames(api).reduce((accumulator, memberName) => {
        const member = api[memberName];

        if (member.hasOwnProperty('constructor')) {
          accumulator[memberName] = this._createProxy(moduleName, member, memberName);
        } else {
          accumulator[memberName] = this._createMethodHandler({
            mod: moduleName,
            fn: memberName,
            returnsPromise: member.returnsPromise
          });
        }

        return accumulator;
      }, {});
    }

    _setupAPI(api) {
      this._hostModules = Object.getOwnPropertyNames(api).reduce((accumulator, moduleName) => {
        accumulator[moduleName] = this._createModule(moduleName, api[moduleName], api[moduleName]._options);
        return accumulator;
      }, {});
      Object.getOwnPropertyNames(this._hostModules._globals || {}).forEach(global => {
        this[global] = this._hostModules._globals[global];
      });
    }

    _setupAPIWithoutRequire(api) {
      Object.getOwnPropertyNames(api).forEach(moduleName => {
        if (typeof this[moduleName] !== "undefined") {
          throw new Error('XDM module: ' + moduleName + ' will collide with existing variable');
        }

        this[moduleName] = this._createModule(moduleName, api[moduleName]);
      }, this);
    }

    _pendingCallback(mid, fn, metaData) {
      if (metaData) {
        Object.getOwnPropertyNames(metaData).forEach(metaDataName => {
          fn[metaDataName] = metaData[metaDataName];
        });
      }

      this._pendingCallbacks[mid] = fn;
    }

    _createProxy(moduleName, api, className) {
      const module = this._createModule(moduleName, api);

      function Cls(args) {
        if (!(this instanceof Cls)) {
          return new Cls(arguments);
        }

        this._cls = className;
        this._id = util.randomString();
        module.constructor.apply(this, args);
        return this;
      }

      Object.getOwnPropertyNames(module).forEach(methodName => {
        if (methodName !== 'constructor') {
          Cls.prototype[methodName] = module[methodName];
        }
      });
      return Cls;
    }

    _createMethodHandler(methodData) {
      let that = this;
      return function () {
        const args = util.argumentsToArray(arguments);
        const data = {
          eid: that._data.extension_id,
          type: 'req',
          mod: methodData.mod,
          fn: methodData.fn
        };
        var targetOrigin;
        var target;
        let xdmPromise;
        const mid = util.randomString();

        if (that._findTarget(methodData.mod, methodData.fn) === 'top') {
          target = that._topHost;
          targetOrigin = that._hostOrigin;
        } else {
          target = that._host;
          targetOrigin = that._data.origin;
        }

        if (util.hasCallback(args)) {
          data.mid = mid;

          that._pendingCallback(data.mid, args.pop(), {
            useCallback: true,
            isPromiseMethod: Boolean(methodData.returnsPromise)
          });
        } else if (methodData.returnsPromise) {
          data.mid = mid;
          xdmPromise = new Promise$1((resolve, reject) => {
            that._pendingCallback(data.mid, function (err, result) {
              if (err || typeof result === 'undefined' && typeof err === 'undefined') {
                reject(err);
              } else {
                resolve(result);
              }
            }, {
              useCallback: false,
              isPromiseMethod: Boolean(methodData.returnsPromise)
            });
          });
          xdmPromise.catch(err => {
            util.warn("Failed promise: ".concat(err));
          });
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

        if (xdmPromise) {
          return xdmPromise;
        }
      };
    }

    _handleResponse(event) {
      var data = event.data;

      if (!data.forPlugin) {
        return;
      }

      var pendingCallback = this._pendingCallbacks[data.mid];

      if (pendingCallback) {
        delete this._pendingCallbacks[data.mid];

        try {
          // Promise methods always return error result as first arg
          // If a promise method is invoked using callbacks, strip first arg.
          if (pendingCallback.useCallback && pendingCallback.isPromiseMethod) {
            data.args.shift();
          }

          pendingCallback.apply(window, data.args);
        } catch (e) {
          util.error(e.message, e.stack);
        }
      }
    }

    _handleEvent(event) {
      var sendResponse = function () {
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
      handlers.forEach(handler => {
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

    _handleKeyDownDomEvent(event) {
      var modifiers = [];
      POSSIBLE_MODIFIER_KEYS.forEach(modifierKey => {
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

    _keyListenerId(keycode, modifiers) {
      var keyListenerId = keycode;

      if (modifiers) {
        if (typeof modifiers === "string") {
          modifiers = [modifiers];
        }

        modifiers.sort();
        modifiers.forEach(modifier => {
          keyListenerId += '$$' + modifier;
        }, this);
      }

      return keyListenerId;
    }

    _handleKeyListen(postMessageEvent) {
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

    _checkOrigin(event) {
      let no_source_types = ['api_tamper'];

      if (event.data && no_source_types.indexOf(event.data.type) > -1) {
        return true;
      }

      if (this._isSubIframe && event.source === this._topHost) {
        return true;
      }

      return event.origin === this._data.origin && event.source === this._host;
    }

    _handleInitReceived() {
      this._initReceived = true;
    }

    _sendInit(frame, origin) {
      var targets;

      if (frame === this._topHost && this._topHost !== window.parent) {
        targets = ConfigurationOptions$1.get('targets');
      }

      frame.postMessage({
        eid: this._data.extension_id,
        type: 'init',
        targets: targets
      }, origin || '*');
      this._initCheck && this._data.options.globalOptions.check_init && setTimeout(() => {
        if (!this._initReceived) {
          throw new Error("Initialization message not received");
        }
      }, this._initTimeout);
    }

    sendSubCreate(extension_id, options) {
      options.id = extension_id;

      this._topHost.postMessage({
        eid: this._data.extension_id,
        type: 'sub',
        ext: options
      }, this._hostOrigin);
    }

    broadcast(event, evnt) {
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

    require(modules, callback) {
      let requiredModules = Array.isArray(modules) ? modules : [modules],
          args = requiredModules.map(module => {
        return this._hostModules[module] || this._hostModules._globals[module];
      });
      callback.apply(window, args);
    }

    register(handlers) {
      if (typeof handlers === "object") {
        this._eventHandlers = { ...this._eventHandlers,
          ...handlers
        } || {};

        this._host.postMessage({
          eid: this._data.extension_id,
          type: 'event_query',
          args: Object.getOwnPropertyNames(handlers)
        }, this._data.origin);
      }
    }

    registerAny(handlers) {
      this.register({
        '_any': handlers
      });
    }

    _initResize() {
      this.resize();
      var autoresize = new AutoResizeAction(this.resize);
      resizeListener.add(util._bind(autoresize, autoresize.triggered));
    }

  }

  class Combined extends Connect {
    constructor(initCheck) {
      super();
      this.parentTargets = {
        _globals: {}
      };
      var plugin = new AP(undefined, initCheck); // export options from plugin to host.

      Object.getOwnPropertyNames(plugin).forEach(function (prop) {
        if (['_hostModules', '_globals'].indexOf(prop) === -1 && this[prop] === undefined) {
          this[prop] = plugin[prop];
        }
      }, this);
      ['registerAny', 'register'].forEach(function (prop) {
        this[prop] = Object.getPrototypeOf(plugin)[prop].bind(plugin);
      }, this); //write plugin modules to host.

      var moduleSpec = plugin._data.api;

      if (typeof moduleSpec === 'object') {
        Object.getOwnPropertyNames(moduleSpec).forEach(function (moduleName) {
          var accumulator = {};
          Object.getOwnPropertyNames(moduleSpec[moduleName]).forEach(function (methodName) {
            // class proxies
            if (moduleSpec[moduleName][methodName].hasOwnProperty('constructor')) {
              accumulator[methodName] = plugin._hostModules[moduleName][methodName].prototype;
            } else {
              // all other methods
              accumulator[methodName] = plugin._hostModules[moduleName][methodName];
              accumulator[methodName]['returnsPromise'] = moduleSpec[moduleName][methodName]['returnsPromise'] || false;
            }
          }, this);

          this._xdm.defineAPIModule(accumulator, moduleName);
        }, this);
      }

      this._hostModules = plugin._hostModules;

      this.defineGlobal = function (module) {
        this.parentTargets['_globals'] = util.extend({}, this.parentTargets['_globals'], module);

        this._xdm.defineAPIModule(module);
      };

      this.defineModule = function (moduleName, module) {
        this._xdm.defineAPIModule(module, moduleName);

        this.parentTargets[moduleName] = {};
        Object.getOwnPropertyNames(module).forEach(function (name) {
          this.parentTargets[moduleName][name] = 'parent';
        }, this);
      };

      this.subCreate = function (extensionOptions, initCallback) {
        extensionOptions.options = extensionOptions.options || {};
        extensionOptions.options.targets = util.extend({}, this.parentTargets, extensionOptions.options.targets);
        var extension = this.create(extensionOptions, initCallback);

        if (!this._data.options.globalOptions.resolve_inner_iframe_url) {
          plugin.sendSubCreate(extension.id, extensionOptions);
        }

        return extension;
      };
    }

  }

  var combined = new Combined();

  function deprecate (fn, name, alternate, sinceVersion) {
    let called = false;
    return function () {
      if (!called && typeof console !== 'undefined' && console.warn) {
        called = true;
        console.warn("DEPRECATED API - ".concat(name, " has been deprecated since ACJS ").concat(sinceVersion) + " and will be removed in a future release. ".concat(alternate ? "Use ".concat(alternate, " instead.") : 'No alternative will be provided.'));

        if (combined._analytics) {
          combined._analytics.trackDeprecatedMethodUsed(name);
        }
      }

      return fn(...arguments);
    };
  }

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

  var _util = {
    each: each$1,
    log,
    decodeQueryComponent,
    bind: binder('add', 'attach'),
    unbind: binder('remove', 'detach'),
    extend: function (dest) {
      var args = arguments;
      var srcs = [].slice.call(args, 1, args.length);
      each$1(srcs, function (i, src) {
        each$1(src, function (k, v) {
          dest[k] = v;
        });
      });
      return dest;
    },
    trim: function (s) {
      return s && s.replace(/^\s+|\s+$/g, '');
    },
    debounce: function (fn, wait) {
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
    isFunction: function (fn) {
      return typeof fn === 'function';
    },
    handleError: function (err) {
      if (!log.apply(this, err && err.message ? [err, err.message] : [err])) {
        throw err;
      }
    }
  };

  var each = _util.each;
  var extend = _util.extend;
  var document$1 = window.document;

  function $(sel, context) {
    context = context || document$1;
    var els = [];

    if (sel) {
      if (typeof sel === 'string') {
        var results = context.querySelectorAll(sel);
        each(results, function (i, v) {
          els.push(v);
        });
      } else if (sel.nodeType === 1) {
        els.push(sel);
      } else if (sel === window) {
        els.push(sel);
      }
    }

    extend(els, {
      each: function (it) {
        each(this, it);
        return this;
      },
      bind: function (name, callback) {
        this.each(function (i, el) {
          _util.bind(el, name, callback);
        });
      },
      attr: function (k) {
        var v;
        this.each(function (i, el) {
          v = el[k] || el.getAttribute && el.getAttribute(k);
          return !v;
        });
        return v;
      },
      removeClass: function (className) {
        return this.each(function (i, el) {
          if (el.className) {
            el.className = el.className.replace(new RegExp('(^|\\s)' + className + '(\\s|$)'), ' ');
          }
        });
      },
      html: function (html) {
        return this.each(function (i, el) {
          el.innerHTML = html;
        });
      },
      append: function (spec) {
        return this.each(function (i, to) {
          var el = context.createElement(spec.tag);
          each(spec, function (k, v) {
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

  var $$1 = extend($, _util);

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

  class Events {
    constructor() {
      this._events = {};
      this.ANY_PREFIX = '_any';
      this.methods = ['off', 'offAll', 'offAny', 'on', 'onAny', 'once'];
    }

    _anyListener(data, callback) {
      var eventName = callback._context.eventName;
      var any = this._events[this.ANY_PREFIX] || [];
      var byName = this._events[eventName] || [];

      if (!Array.isArray(data)) {
        data = [data];
      }

      any.forEach(handler => {
        //clone data before modifying
        var args = data.slice(0);
        args.unshift(eventName);
        args.push({
          args: data,
          name: eventName
        });
        handler.apply(null, args);
      });
      byName.forEach(handler => {
        handler.apply(null, data);
      });
    }

    off(name, listener) {
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

    offAll(name) {
      delete this._events[name];
    }

    offAny(listener) {
      this.off(this.ANY_PREFIX, listener);
    }

    on(name, listener) {
      if (!this._events[name]) {
        this._events[name] = [];
      }

      this._events[name].push(listener);
    }

    onAny(listener) {
      this.on(this.ANY_PREFIX, listener);
    }

    once(name, listener) {
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


  }

  var EventsInstance = new Events();

  class PublicEvents extends Events {
    constructor() {
      super();
      this.methods = ['offPublic', 'offAllPublic', 'offAnyPublic', 'onPublic', 'onAnyPublic', 'oncePublic'];
    }

    _filterEval(filter, toCompare) {
      var value = true;

      if (!filter) {
        return value;
      }

      switch (typeof filter) {
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

    once(name, listener, filter) {
      var that = this;

      function runOnce(data) {
        listener.apply(null, data);
        that.off(name, runOnce);
      }

      this.on(name, runOnce, filter);
    }

    on(name, listener, filter) {
      listener._wrapped = function (data) {
        if (this._filterEval(filter, data.sender)) {
          listener.apply(null, data.event);
        }
      }.bind(this);

      super.on(name, listener._wrapped);
    }

    off(name, listener) {
      if (listener._wrapped) {
        super.off(name, listener._wrapped);
      } else {
        super.off(name, listener);
      }
    }

    onAny(listener, filter) {
      listener._wrapped = function (data) {
        if (data.sender && this._filterEval(filter, data.sender)) {
          listener.apply(null, data.event);
        }
      };

      super.onAny(listener._wrapped);
    }

    offAny(listener) {
      if (listener._wrapped) {
        super.offAny(name, listener._wrapped);
      } else {
        super.offAny(name, listener);
      }
    }

  }

  var PublicEventsInstance = new PublicEvents();

  let customButtonIncrement = 1;
  const getCustomData = deprecate(() => {
    return combined._data.options.customData;
  }, 'AP.dialog.customData', 'AP.dialog.getCustomData()', '5.0');

  if (combined._hostModules && combined._hostModules.dialog) {
    /**
     * Returns the custom data Object passed to the dialog at creation.
     * @noDemo
     * @deprecated after August 2017 | Please use <code>dialog.getCustomData(callback)</code> instead.
     * @name customData
     * @memberOf module:Dialog
     * @ignore
     * @example
     * var myDataVariable = AP.dialog.customData.myDataVariable;
     *
     * @return {Object} Data Object passed to the dialog on creation.
     */
    Object.defineProperty(combined._hostModules.dialog, 'customData', {
      get: getCustomData
    });
    Object.defineProperty(combined.dialog, 'customData', {
      get: getCustomData
    });
    combined.dialog._disableCloseOnSubmit = false;

    combined.dialog.disableCloseOnSubmit = function () {
      combined.dialog._disableCloseOnSubmit = true;
    };
  }

  const dialogHandlers = {};
  EventsInstance.onAny(eventDelegator);

  function eventDelegator(name, args) {
    let dialogEventMatch = name.match(/^dialog\.(\w+)/);

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
        callbacks.forEach(callback => {
          callback.call(null, args);
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

  function submitOrCancelEvent(name, args) {
    let handlers = dialogHandlers[name];
    let shouldClose = name !== 'close';
    var context = null; // ignore events that are triggered by button clicks
    // allow dialog.close through for close on ESC

    if (shouldClose && typeof args.button === 'undefined') {
      return;
    } // if the submit button has been set to not close on click


    if (name === 'submit' && combined.dialog._disableCloseOnSubmit) {
      shouldClose = false;
    }

    try {
      if (handlers) {
        if (args && args.button && args.button.name) {
          context = combined.dialog.getButton(args.button.name);
        }

        shouldClose = handlers.reduce((result, cb) => cb.call(context, args) && result, shouldClose);
      }
    } catch (err) {
      console.error(err);
    } finally {
      delete dialogHandlers[name];
    }

    if (shouldClose) {
      combined.dialog.close();
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

  if (combined.dialog && combined.dialog.create) {
    const original_dialogCreate = combined.dialog.create.prototype.constructor.bind({});

    combined.dialog.create = combined._hostModules.dialog.create = function () {
      const dialog = original_dialogCreate(...arguments);
      /**
       * Allows the add-on to register a callback function for the given event. The listener is only called once and must be re-registered if needed.
       * @deprecated after August 2017 | Please use <code>AP.events.on("dialog.close", callback)</code> instead.
       * @memberOf Dialog~Dialog
       * @method on
       * @ignore
       * @param {String} event name of the event to listen for, such as 'close'.
       * @param {Function} callback function to receive the event callback.
       * @noDemo
       * @example
       * AP.dialog.create(opts).on("close", callbackFunc);
       */

      dialog.on = deprecate(registerHandler, 'AP.dialog.on("close", callback)', 'AP.events.on("dialog.close", callback)', '5.0');
      return dialog;
    };
  }

  if (combined.dialog && combined.dialog.getButton) {
    let original_dialogGetButton = combined.dialog.getButton.prototype.constructor.bind({});

    combined.dialog.getButton = combined._hostModules.dialog.getButton = function (name) {
      try {
        const button = original_dialogGetButton(name);
        /**
         * Registers a function to be called when the button is clicked.
         * @deprecated after August 2017 | Please use <code>AP.events.on("dialog.message", callback)</code> instead.
         * @method bind
         * @memberOf Dialog~DialogButton
         * @ignore
         * @param {Function} callback function to be triggered on click or programatically.
         * @noDemo
         * @example
         * AP.dialog.getButton('submit').bind(function(){
         *   alert('clicked!');
         * });
         */

        button.bind = deprecate(callback => registerHandler(name, callback), 'AP.dialog.getDialogButton().bind()', 'AP.events.on("dialog.message", callback)', '5.0');
        return button;
      } catch (e) {
        return {};
      }
    };
  }

  if (combined.dialog && combined.dialog.createButton) {
    let original_dialogCreateButton = combined.dialog.createButton.prototype.constructor.bind({});

    combined.dialog.createButton = combined._hostModules.dialog.createButton = function (options) {
      let buttonProperties = {};

      if (typeof options !== 'object') {
        buttonProperties.text = options;
        buttonProperties.identifier = options;
      } else {
        buttonProperties = options;
      }

      if (!buttonProperties.identifier) {
        buttonProperties.identifier = 'user.button.' + customButtonIncrement++;
      }

      original_dialogCreateButton(buttonProperties);
      return combined.dialog.getButton(buttonProperties.identifier);
    };
  }
  /**
   * Register callbacks responding to messages from the host dialog, such as "submit" or "cancel"
   * @deprecated after August 2017 | Please use <code>AP.events.on("dialog.message", callback)</code> instead.
   * @memberOf module:Dialog
   * @method onDialogMessage
   * @ignore
   * @param {String} buttonName - button either "cancel" or "submit"
   * @param {Function} listener - callback function invoked when the requested button is pressed
   */


  if (combined.dialog) {
    combined.dialog.onDialogMessage = combined._hostModules.dialog.onDialogMessage = deprecate(registerHandler, 'AP.dialog.onDialogMessage()', 'AP.events.on("dialog.message", callback)', '5.0');
  }

  if (!combined.Dialog) {
    combined.Dialog = combined._hostModules.Dialog = combined.dialog;
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
    } // get a host module


    var hostModule = getFromHostModules(name);

    if (hostModule) {
      return modules[name] = hostModule;
    } // create a new module


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

    if (combined._hostModules) {
      if (combined._hostModules[name]) {
        module = combined._hostModules[name];
      }

      if (combined._hostModules._globals && combined._hostModules._globals[name]) {
        module = combined._hostModules._globals[name];
      }

      if (module) {
        return {
          name: name,
          exports: module
        };
      }
    }
  } // define(name, objOrFn)
  // define(name, deps, fn(dep1, dep2, ...))


  var AMD = {
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

  function getMeta(name) {
    return $$1("meta[name='ap-".concat(name, "']")).attr('content');
  }

  var Meta = {
    getMeta: getMeta,
    localUrl: function (path) {
      const url = getMeta('local-base-url');
      return typeof url === 'undefined' || typeof path === 'undefined' ? url : "".concat(url).concat(path);
    }
  };

  // duplicated from ./host/stores/extension_configuration_options_store

  class ExtensionConfigurationOptionsStore {
    constructor() {
      this.store = {};
    }

    set(obj, val) {
      if (val) {
        var toSet = {};
        toSet[obj] = val;
      } else {
        toSet = obj;
      }

      _util.extend(this.store, toSet);
    }

    get(key) {
      if (key) {
        return this.store[key];
      }

      return _util.extend({}, this.store); //clone
    }

  }

  var ExtensionConfigurationOptionsStore$1 = new ExtensionConfigurationOptionsStore();

  function getMetrics() {
    if (window.performance && window.performance.getEntries) {
      let navigationEntries = window.performance.getEntriesByType('navigation');

      if (navigationEntries && navigationEntries[0]) {
        let timingInfo = navigationEntries[0]; // dns loookup time

        let domainLookupTime = timingInfo.domainLookupEnd - timingInfo.domainLookupStart;
        let connectStart = timingInfo.connectStart; // if it's a tls connection, use the secure connection start instead

        if (timingInfo.secureConnectionStart > 0) {
          connectStart = timingInfo.secureConnectionStart;
        } // connection negotiation time


        let connectionTime = timingInfo.connectEnd - connectStart; // page body size

        let decodedBodySize = timingInfo.decodedBodySize; // time to load dom

        let domContentLoadedTime = timingInfo.domContentLoadedEventEnd - timingInfo.domContentLoadedEventStart; // time to download the page

        let fetchTime = timingInfo.responseEnd - timingInfo.fetchStart;
        return {
          domainLookupTime,
          connectionTime,
          decodedBodySize,
          domContentLoadedTime,
          fetchTime
        };
      }
    }
  }

  function sendMetrics() {
    let metrics = getMetrics();

    if (combined._analytics && combined._analytics.trackIframePerformanceMetrics) {
      combined._analytics.trackIframePerformanceMetrics(metrics);
    }
  }

  var analytics = {
    sendMetrics
  };

  combined._hostModules._dollar = $$1;
  combined._hostModules['inline-dialog'] = combined._hostModules.inlineDialog;

  if (consumerOptions.get('sizeToParent') === true) {
    combined.env && combined.env.sizeToParent(consumerOptions.get('hideFooter') === true);
  } else {
    combined.env && combined.env.hideFooter(consumerOptions.get('hideFooter') === true);
  }

  if (consumerOptions.get('base') === true) {
    combined.env && combined.env.getLocation(loc => {
      $$1('head').append({
        tag: 'base',
        href: loc,
        target: '_parent'
      });
    });
  }

  $$1.each(EventsInstance.methods, (i, method) => {
    if (combined._hostModules && combined._hostModules.events) {
      combined._hostModules.events[method] = combined.events[method] = EventsInstance[method].bind(EventsInstance);
      combined._hostModules.events[method + 'Public'] = combined.events[method + 'Public'] = PublicEventsInstance[method].bind(PublicEventsInstance);
    }
  });
  combined.define = deprecate(function () {
    return AMD.define(...arguments);
  }, 'AP.define()', null, '5.0');
  combined.require = deprecate(function () {
    return AMD.require(...arguments);
  }, 'AP.require()', null, '5.0');
  var margin = combined._data.options.isDialog ? '10px 10px 0 10px' : '0';

  if (consumerOptions.get('margin') !== false) {
    var setBodyMargin = function () {
      if (document.body) {
        document.body.style.setProperty('margin', margin, 'important');
      }
    };

    setBodyMargin(); // Try to set it straight away

    window.addEventListener('DOMContentLoaded', setBodyMargin); // If it doesn't exist now (likely) we can set it later
  }

  combined.Meta = {
    get: Meta.getMeta
  };
  combined.meta = Meta.getMeta;
  combined.localUrl = Meta.localUrl;
  combined._hostModules._util = combined._util = {
    each: _util.each,
    log: _util.log,
    decodeQueryComponent: _util.decodeQueryComponent,
    bind: _util.bind,
    unbind: _util.unbind,
    extend: _util.extend,
    trim: _util.trim,
    debounce: _util.debounce,
    isFunction: _util.isFunction,
    handleError: _util.handleError
  };

  if (combined.defineModule) {
    combined.defineModule('env', {
      resize: function (w, h, callback) {
        var iframe = document.getElementById(callback._context.extension_id);
        iframe.style.width = w + (typeof w === 'number' ? 'px' : '');
        iframe.style.height = h + (typeof h === 'number' ? 'px' : '');
      }
    });
  }

  if (combined._data && combined._data.origin) {
    combined.registerAny(function (data, callback) {
      // dialog.close event doesn't have event data
      if (data && data.event && data.sender) {
        PublicEventsInstance._anyListener(data, callback);
      } else {
        EventsInstance._anyListener(data, callback);
      }
    });
  } // gets the global options from the parent iframe (if present) so they can propagate to future sub-iframes.


  ExtensionConfigurationOptionsStore$1.set(combined._data.options.globalOptions);

  if (document.readyState === 'complete') {
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(analytics.sendMetrics, {
        timeout: 1000
      });
    } else {
      analytics.sendMetrics();
    }
  } else {
    window.addEventListener('load', analytics.sendMetrics);
  }

  return combined;

})();
