(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.connectHost = factory());
})(this, (function () { 'use strict';

  var domain; // This constructor is used to store event handlers. Instantiating this is
  // faster than explicitly calling `Object.create(null)` to get a "clean" empty
  // object (tested with v8 v4.9).

  function EventHandlers() {}

  EventHandlers.prototype = Object.create(null);

  function EventEmitter() {
    EventEmitter.init.call(this);
  }
  // require('events') === require('events').EventEmitter

  EventEmitter.EventEmitter = EventEmitter;
  EventEmitter.usingDomains = false;
  EventEmitter.prototype.domain = undefined;
  EventEmitter.prototype._events = undefined;
  EventEmitter.prototype._maxListeners = undefined; // By default EventEmitters will print a warning if more than 10 listeners are
  // added to it. This is a useful default which helps finding memory leaks.

  EventEmitter.defaultMaxListeners = 10;

  EventEmitter.init = function () {
    this.domain = null;

    if (EventEmitter.usingDomains) {
      // if there is an active domain, then attach to it.
      if (domain.active ) ;
    }

    if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
      this._events = new EventHandlers();
      this._eventsCount = 0;
    }

    this._maxListeners = this._maxListeners || undefined;
  }; // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.


  EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
    if (typeof n !== 'number' || n < 0 || isNaN(n)) throw new TypeError('"n" argument must be a positive number');
    this._maxListeners = n;
    return this;
  };

  function $getMaxListeners(that) {
    if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
    return that._maxListeners;
  }

  EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
    return $getMaxListeners(this);
  }; // These standalone emit* functions are used to optimize calling of event
  // handlers for fast cases because emit() itself often has a variable number of
  // arguments and can be deoptimized because of that. These functions always have
  // the same number of arguments and thus do not get deoptimized, so the code
  // inside them can execute faster.


  function emitNone(handler, isFn, self) {
    if (isFn) handler.call(self);else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);

      for (var i = 0; i < len; ++i) listeners[i].call(self);
    }
  }

  function emitOne(handler, isFn, self, arg1) {
    if (isFn) handler.call(self, arg1);else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);

      for (var i = 0; i < len; ++i) listeners[i].call(self, arg1);
    }
  }

  function emitTwo(handler, isFn, self, arg1, arg2) {
    if (isFn) handler.call(self, arg1, arg2);else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);

      for (var i = 0; i < len; ++i) listeners[i].call(self, arg1, arg2);
    }
  }

  function emitThree(handler, isFn, self, arg1, arg2, arg3) {
    if (isFn) handler.call(self, arg1, arg2, arg3);else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);

      for (var i = 0; i < len; ++i) listeners[i].call(self, arg1, arg2, arg3);
    }
  }

  function emitMany(handler, isFn, self, args) {
    if (isFn) handler.apply(self, args);else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);

      for (var i = 0; i < len; ++i) listeners[i].apply(self, args);
    }
  }

  EventEmitter.prototype.emit = function emit(type) {
    var er, handler, len, args, i, events, domain;
    var doError = type === 'error';
    events = this._events;
    if (events) doError = doError && events.error == null;else if (!doError) return false;
    domain = this.domain; // If there is no 'error' event listener then throw.

    if (doError) {
      er = arguments[1];

      if (domain) {
        if (!er) er = new Error('Uncaught, unspecified "error" event');
        er.domainEmitter = this;
        er.domain = domain;
        er.domainThrown = false;
        domain.emit('error', er);
      } else if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }

      return false;
    }

    handler = events[type];
    if (!handler) return false;
    var isFn = typeof handler === 'function';
    len = arguments.length;

    switch (len) {
      // fast cases
      case 1:
        emitNone(handler, isFn, this);
        break;

      case 2:
        emitOne(handler, isFn, this, arguments[1]);
        break;

      case 3:
        emitTwo(handler, isFn, this, arguments[1], arguments[2]);
        break;

      case 4:
        emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
        break;
      // slower

      default:
        args = new Array(len - 1);

        for (i = 1; i < len; i++) args[i - 1] = arguments[i];

        emitMany(handler, isFn, this, args);
    }
    return true;
  };

  function _addListener(target, type, listener, prepend) {
    var m;
    var events;
    var existing;
    if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
    events = target._events;

    if (!events) {
      events = target._events = new EventHandlers();
      target._eventsCount = 0;
    } else {
      // To avoid recursion in the case that type === "newListener"! Before
      // adding it to the listeners, first emit "newListener".
      if (events.newListener) {
        target.emit('newListener', type, listener.listener ? listener.listener : listener); // Re-assign `events` because a newListener handler could have caused the
        // this._events to be assigned to a new object

        events = target._events;
      }

      existing = events[type];
    }

    if (!existing) {
      // Optimize the case of one listener. Don't need the extra array object.
      existing = events[type] = listener;
      ++target._eventsCount;
    } else {
      if (typeof existing === 'function') {
        // Adding the second element, need to change to array.
        existing = events[type] = prepend ? [listener, existing] : [existing, listener];
      } else {
        // If we've already got an array, just append.
        if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }
      } // Check for listener leak


      if (!existing.warned) {
        m = $getMaxListeners(target);

        if (m && m > 0 && existing.length > m) {
          existing.warned = true;
          var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + type + ' listeners added. ' + 'Use emitter.setMaxListeners() to increase limit');
          w.name = 'MaxListenersExceededWarning';
          w.emitter = target;
          w.type = type;
          w.count = existing.length;
          emitWarning(w);
        }
      }
    }

    return target;
  }

  function emitWarning(e) {
    typeof console.warn === 'function' ? console.warn(e) : console.log(e);
  }

  EventEmitter.prototype.addListener = function addListener(type, listener) {
    return _addListener(this, type, listener, false);
  };

  EventEmitter.prototype.on = EventEmitter.prototype.addListener;

  EventEmitter.prototype.prependListener = function prependListener(type, listener) {
    return _addListener(this, type, listener, true);
  };

  function _onceWrap(target, type, listener) {
    var fired = false;

    function g() {
      target.removeListener(type, g);

      if (!fired) {
        fired = true;
        listener.apply(target, arguments);
      }
    }

    g.listener = listener;
    return g;
  }

  EventEmitter.prototype.once = function once(type, listener) {
    if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
    this.on(type, _onceWrap(this, type, listener));
    return this;
  };

  EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
    if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
    this.prependListener(type, _onceWrap(this, type, listener));
    return this;
  }; // emits a 'removeListener' event iff the listener was removed


  EventEmitter.prototype.removeListener = function removeListener(type, listener) {
    var list, events, position, i, originalListener;
    if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
    events = this._events;
    if (!events) return this;
    list = events[type];
    if (!list) return this;

    if (list === listener || list.listener && list.listener === listener) {
      if (--this._eventsCount === 0) this._events = new EventHandlers();else {
        delete events[type];
        if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
      }
    } else if (typeof list !== 'function') {
      position = -1;

      for (i = list.length; i-- > 0;) {
        if (list[i] === listener || list[i].listener && list[i].listener === listener) {
          originalListener = list[i].listener;
          position = i;
          break;
        }
      }

      if (position < 0) return this;

      if (list.length === 1) {
        list[0] = undefined;

        if (--this._eventsCount === 0) {
          this._events = new EventHandlers();
          return this;
        } else {
          delete events[type];
        }
      } else {
        spliceOne(list, position);
      }

      if (events.removeListener) this.emit('removeListener', type, originalListener || listener);
    }

    return this;
  };

  EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
    var listeners, events;
    events = this._events;
    if (!events) return this; // not listening for removeListener, no need to emit

    if (!events.removeListener) {
      if (arguments.length === 0) {
        this._events = new EventHandlers();
        this._eventsCount = 0;
      } else if (events[type]) {
        if (--this._eventsCount === 0) this._events = new EventHandlers();else delete events[type];
      }

      return this;
    } // emit removeListener for all listeners on all events


    if (arguments.length === 0) {
      var keys = Object.keys(events);

      for (var i = 0, key; i < keys.length; ++i) {
        key = keys[i];
        if (key === 'removeListener') continue;
        this.removeAllListeners(key);
      }

      this.removeAllListeners('removeListener');
      this._events = new EventHandlers();
      this._eventsCount = 0;
      return this;
    }

    listeners = events[type];

    if (typeof listeners === 'function') {
      this.removeListener(type, listeners);
    } else if (listeners) {
      // LIFO order
      do {
        this.removeListener(type, listeners[listeners.length - 1]);
      } while (listeners[0]);
    }

    return this;
  };

  EventEmitter.prototype.listeners = function listeners(type) {
    var evlistener;
    var ret;
    var events = this._events;
    if (!events) ret = [];else {
      evlistener = events[type];
      if (!evlistener) ret = [];else if (typeof evlistener === 'function') ret = [evlistener.listener || evlistener];else ret = unwrapListeners(evlistener);
    }
    return ret;
  };

  EventEmitter.listenerCount = function (emitter, type) {
    if (typeof emitter.listenerCount === 'function') {
      return emitter.listenerCount(type);
    } else {
      return listenerCount.call(emitter, type);
    }
  };

  EventEmitter.prototype.listenerCount = listenerCount;

  function listenerCount(type) {
    var events = this._events;

    if (events) {
      var evlistener = events[type];

      if (typeof evlistener === 'function') {
        return 1;
      } else if (evlistener) {
        return evlistener.length;
      }
    }

    return 0;
  }

  EventEmitter.prototype.eventNames = function eventNames() {
    return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
  }; // About 1.5x faster than the two-arg version of Array#splice().


  function spliceOne(list, index) {
    for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) list[i] = list[k];

    list.pop();
  }

  function arrayClone(arr, i) {
    var copy = new Array(i);

    while (i--) copy[i] = arr[i];

    return copy;
  }

  function unwrapListeners(arr) {
    var ret = new Array(arr.length);

    for (var i = 0; i < ret.length; ++i) {
      ret[i] = arr[i].listener || arr[i];
    }

    return ret;
  }

  /**
  * pub/sub for extension state (created, destroyed, initialized)
  * taken from hipchat webcore
  **/

  class EventDispatcher extends EventEmitter {
    constructor() {
      super();
      this.setMaxListeners(20);
    }

    dispatch(action) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      this.emit.apply(this, ['before:' + action].concat(args));
      this.emit.apply(this, arguments);
      this.emit.apply(this, ['after:' + action].concat(args));
    }

    registerOnce(action, callback) {
      if (typeof action === 'string') {
        this.once(action, callback);
      } else {
        throw 'ACJS: event name must be string';
      }
    }

    register(action, callback) {
      if (typeof action === 'string') {
        this.on(action, callback);
      } else {
        throw 'ACJS: event name must be string';
      }
    }

    unregister(action, callback) {
      if (typeof action === 'string') {
        this.removeListener(action, callback);
      } else {
        throw 'ACJS: event name must be string';
      }
    }

  }

  var EventDispatcher$1 = new EventDispatcher();

  /**
   * The iframe-side code exposes a jquery-like implementation via _dollar.
   * This runs on the product side to provide AJS.$ under a _dollar module to provide a consistent interface
   * to code that runs on host and iframe.
   */
  var $$1 = window.AJS && window.AJS.$ || function () {};

  const threshold = 0.25;
  let targets = [];
  let observe;

  const observed = target => {
    targets = targets.filter(_ref => {
      let {
        element,
        callback
      } = _ref;

      if (element === target) {
        callback();
        return false;
      }

      return true;
    });
  };

  if ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(_ref2 => {
        let {
          intersectionRatio,
          target
        } = _ref2;

        if (intersectionRatio > 0) {
          observer.unobserve(target);
          observed(target);
        }
      });
    }, {
      threshold
    });
    observe = observer.observe.bind(observer);
  }

  var observe$1 = ((element, callback) => {
    if (typeof callback === 'function' && element instanceof Element) {
      targets.push({
        element,
        callback
      });
      observe(element);
    }
  });

  function getBooleanFeatureFlag(flagName) {
    if (AJS && AJS.DarkFeatures && AJS.DarkFeatures.isEnabled && AJS.DarkFeatures.isEnabled(flagName)) {
      return true;
    }

    const flagContent = window.featureFlags || AJS && AJS.Meta && AJS.Meta.get && AJS.Meta.get('fe-feature-flags');

    if (!flagContent) {
      return false;
    }

    let flagJson = {};

    try {
      flagJson = typeof flagContent === 'object' ? flagContent : JSON.parse(flagContent);
    } catch (err) {
      return false;
    }

    if (!flagJson[flagName] || typeof flagJson[flagName].value !== 'boolean') {
      return false;
    }

    return flagJson[flagName].value;
  }

  function isInlineDialogStickyFixFlagEnabled() {
    return getBooleanFeatureFlag('com.atlassian.connect.acjs-oc-1684-inline-dialog-sticky-fix');
  }

  function isFeatureFlagNativeTextEncoder() {
    return getBooleanFeatureFlag('com.atlassian.connect.acjs-oc-1779-use-native-textencoder');
  }

  const Flags = {
    getBooleanFeatureFlag,
    isInlineDialogStickyFixFlagEnabled,
    isFeatureFlagNativeTextEncoder
  };

  const EVENT_NAME_PREFIX = 'connect.addon.';
  /**
   * Timings beyond 20 seconds (connect's load timeout) will be clipped to an X.
   * @const
   * @type {int}
   */

  const LOADING_TIME_THRESHOLD = 20000;
  /**
   * Trim extra zeros from the load time.
   * @const
   * @type {int}
   */

  const LOADING_TIME_TRIMP_PRECISION = 100;

  class AnalyticsDispatcher {
    constructor() {
      this._addons = {};
    }

    _track(name, data) {
      var w = window;
      var prefixedName = EVENT_NAME_PREFIX + name;
      data = data || {};
      data.version = w._AP && w._AP.version ? w._AP.version : undefined;
      data.userAgent = w.navigator.userAgent;

      if (!w.AJS) {
        return false;
      }

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

    _trackGasV3(eventType, event) {
      try {
        const analyticsCrossProduct = window.require('ac/analytics');

        analyticsCrossProduct.emitGasV3(eventType, event);
      } catch (e) {
        // this is not serious. It usually means the product is doing analytics using another mechanism
        console.info('Connect GasV3 catch', e);
      }
    }

    _time() {
      return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    }

    trackLoadingStarted(extension) {
      if (this._addons && extension && extension.id) {
        extension.startLoading = this._time();
        this._addons[extension.id] = extension;
      } else {
        console.error('ACJS: cannot track loading analytics', this._addons, extension);
      }
    }

    trackLoadingEnded(extension) {
      if (this._addons && extension && this._addons[extension.id]) {
        var href = extension.url;
        var iframeIsCacheable = href !== undefined && href.indexOf('xdm_e=') === -1;

        var value = this._time() - this._addons[extension.id].startLoading;

        var iframeLoadApdex = this.getIframeLoadApdex(value);
        var api;

        try {
          api = Object.keys(JSON.parse(this._addons[extension.id].$el[0].name).api).sort().toString();
        } catch (e) {
          api = 'error';
        }

        var eventPayload = {
          addonKey: extension.addon_key,
          moduleKey: extension.key,
          moduleType: extension.options ? extension.options.moduleType : undefined,
          moduleLocation: extension.options ? extension.options.moduleLocation : undefined,
          pearApp: extension.options && extension.options.pearApp === 'true' ? 'true' : 'false',
          iframeLoadMillis: value,
          iframeLoadApdex: iframeLoadApdex,
          iframeIsCacheable: iframeIsCacheable,
          value: value > LOADING_TIME_THRESHOLD ? 'x' : Math.ceil(value / LOADING_TIME_TRIMP_PRECISION),
          api
        };

        if (typeof window.requestIdleCallback === 'function') {
          window.requestIdleCallback(() => this._track('iframe.performance.load', eventPayload), {
            timeout: 100
          });
        } else {
          this._track('iframe.performance.load', eventPayload);
        }
      } else {
        console.error('ACJS: cannot track loading end analytics', this._addons, extension);
      }
    }

    getIframeLoadApdex(iframeLoadMilliseconds) {
      var apdexSatisfiedThresholdMilliseconds = 300;
      var iframeLoadApdex = iframeLoadMilliseconds <= apdexSatisfiedThresholdMilliseconds ? 1 : iframeLoadMilliseconds <= 4 * apdexSatisfiedThresholdMilliseconds ? 0.5 : 0;
      return iframeLoadApdex;
    }

    trackLoadingTimeout(extension) {
      var connectedStatus = window.navigator.onLine;

      if (typeof connectedStatus !== 'boolean') {
        connectedStatus = 'not-supported';
      }

      this._track('iframe.performance.timeout', {
        addonKey: extension.addon_key,
        moduleKey: extension.key,
        moduleType: extension.options ? extension.options.moduleType : undefined,
        moduleLocation: extension.options ? extension.options.moduleLocation : undefined,
        pearApp: extension.options && extension.options.pearApp === 'true' ? 'true' : 'false',
        connectedStatus: connectedStatus.toString() // convert boolean to string

      }); //track an end event during a timeout so we always have complete start / end data.


      this.trackLoadingEnded(extension);
    }

    trackLoadingCancel(extension) {
      this._track('iframe.performance.cancel', {
        addonKey: extension.addon_key,
        moduleKey: extension.key,
        moduleType: extension.options ? extension.options.moduleType : undefined,
        moduleLocation: extension.options ? extension.options.moduleLocation : undefined,
        pearApp: extension.options && extension.options.pearApp === 'true' ? 'true' : 'false'
      });
    }

    trackUseOfDeprecatedMethod(methodUsed, extension) {
      this._track('jsapi.deprecated', {
        addonKey: extension.addon_key,
        moduleKey: extension.key,
        methodUsed: methodUsed
      });
    }

    trackMacroCombination(parentExtensionId, childExtension) {
      var partsOfParentExtensionId = parentExtensionId.split('__');

      if (partsOfParentExtensionId.length !== 3) {
        // this case shouldn't happen generally, adding this just in case
        this._trackGasV3('operational', {
          source: 'page',
          action: 'rendered',
          actionSubject: 'nestedBodyMacro',
          objectType: childExtension.options.structuredContext.confluence.content.type,
          objectId: childExtension.options.structuredContext.confluence.content.id,
          attributes: {
            parentExtensionId: parentExtensionId,
            childAddonKey: childExtension['addon_key'],
            childKey: childExtension['key']
          }
        });

        return;
      }

      var parentAddonKey = partsOfParentExtensionId[0];
      var parentKey = partsOfParentExtensionId[1];

      this._trackGasV3('operational', {
        source: 'viewPageScreen',
        action: 'rendered',
        actionSubject: 'nestedBodyMacro',
        objectType: childExtension.options.structuredContext.confluence.content.type,
        objectId: childExtension.options.structuredContext.confluence.content.id,
        attributes: {
          parentAddonKey: parentAddonKey,
          parentKey: parentKey,
          childAddonKey: childExtension['addon_key'],
          childKey: childExtension['key']
        }
      });
    }

    trackMultipleDialogOpening(dialogType, extension) {
      this._track('jsapi.dialog.multiple', {
        addonKey: extension.addon_key,
        moduleKey: extension.key,
        dialogType: dialogType
      });
    }

    trackVisible(extension) {
      this._track('iframe.is_visible', {
        addonKey: extension.addon_key,
        moduleKey: extension.key,
        moduleType: extension.options ? extension.options.moduleType : undefined,
        pearApp: extension.options && extension.options.pearApp === 'true' ? 'true' : 'false'
      });
    }

    trackIframePerformance(metrics, extension) {
      this._trackGasV3('operational', {
        source: extension.addon_key,
        action: 'iframeRendered',
        actionSubject: 'connectAddon',
        actionSubjectId: extension.addon_key,
        attributes: {
          key: extension['key'],
          pearApp: this._getPearApp(extension),
          moduleType: this._getModuleType(extension),
          iframeIsCacheable: this._isCacheable(extension),
          moduleLocation: this._getModuleLocation(extension),
          domainLookupTime: metrics.domainLookupTime,
          connectionTime: metrics.connectionTime,
          decodedBodySize: metrics.decodedBodySize,
          domContentLoadedTime: metrics.domContentLoadedTime,
          fetchTime: metrics.fetchTime
        }
      });
    }

    dispatch(name, data) {
      this._track(name, data);
    }

    trackExternal(name, data) {
      this._track(name, data);
    }
    /**
    * method called when an iframe's loading metrics gets corrupted
    * to destroy the analytics as they cannot be reliable
    * this should be called when:
    * 1. the product calls iframe creation multiple times for the same connect addon
    * 2. the iframe is moved / repainted causing a window.reload event
    * 3. user right clicks iframe and reloads it
    */


    _resetAnalyticsDueToUnreliable(extensionId) {
      if (!extensionId) {
        throw new Error('Cannot reset analytics due to no extension id');
      }

      if (this._addons[extensionId]) {
        clearTimeout(this._addons[extensionId]);
        delete this._addons[extensionId];
      } else {
        console.info('Cannot clear analytics, cache does not contain extension id');
      }
    }

    _isCacheable(extension) {
      const href = extension.url;
      return href !== undefined && href.indexOf('xdm_e=') === -1;
    }

    _getModuleType(extension) {
      return extension.options ? extension.options.moduleType : undefined;
    }

    _getModuleLocation(extension) {
      return extension.options ? extension.options.moduleLocation : undefined;
    }

    _getPearApp(extension) {
      return extension.options && extension.options.pearApp === 'true';
    }

    trackGasV3Visible(extension) {
      this._trackGasV3('operational', {
        action: 'iframeViewed',
        actionSubject: 'connectAddon',
        actionSubjectId: extension['addon_key'],
        attributes: {
          moduleType: this._getModuleType(extension),
          iframeIsCacheable: this._isCacheable(extension),
          moduleKey: extension.key,
          moduleLocation: this._getModuleLocation(extension),
          pearApp: this._getPearApp(extension)
        },
        source: extension.addon_key
      });
    }

    trackGasV3LoadingEnded(extension) {
      var iframeLoadMillis = this._time() - this._addons[extension.id].startLoading;

      this._trackGasV3('operational', {
        action: 'iframeLoaded',
        actionSubject: 'connectAddon',
        actionSubjectId: extension['addon_key'],
        attributes: {
          moduleType: this._getModuleType(extension),
          iframeIsCacheable: this._isCacheable(extension),
          iframeLoadMillis: iframeLoadMillis,
          moduleKey: extension.key,
          moduleLocation: this._getModuleLocation(extension),
          pearApp: this._getPearApp(extension)
        },
        source: extension.addon_key
      });
    }

    trackGasV3LoadingTimeout(extension) {
      this._trackGasV3('operational', {
        action: 'iframeTimeout',
        actionSubject: 'connectAddon',
        actionSubjectId: extension['addon_key'],
        attributes: {
          moduleType: this._getModuleType(extension),
          iframeIsCacheable: this._isCacheable(extension),
          moduleKey: extension.key,
          moduleLocation: this._getModuleLocation(extension),
          pearApp: this._getPearApp(extension)
        },
        source: extension.addon_key
      });
    }

  }

  var analytics$1 = new AnalyticsDispatcher();

  if ($$1.fn) {
    EventDispatcher$1.register('iframe-create', function (data) {
      analytics$1.trackLoadingStarted(data.extension);
    });
  }

  EventDispatcher$1.register('iframe-bridge-start', function (data) {
    analytics$1.trackLoadingStarted(data.extension);
  });
  EventDispatcher$1.register('iframe-bridge-established', function (data) {
    analytics$1.trackLoadingEnded(data.extension);
    observe$1(document.getElementById(data.extension.id), () => {
      EventDispatcher$1.dispatch('iframe-visible', data.extension);
      analytics$1.trackVisible(data.extension);
      analytics$1.trackGasV3Visible(data.extension);
    });
  });
  EventDispatcher$1.register('iframe-bridge-established', function (data) {
    analytics$1.trackGasV3LoadingEnded(data.extension);
  });
  EventDispatcher$1.register('iframe-bridge-timeout', function (data) {
    analytics$1.trackLoadingTimeout(data.extension);
  });
  EventDispatcher$1.register('iframe-bridge-cancelled', function (data) {
    analytics$1.trackLoadingCancel(data.extension);
  });
  EventDispatcher$1.register('analytics-deprecated-method-used', function (data) {
    analytics$1.trackUseOfDeprecatedMethod(data.methodUsed, data.extension);
  });
  EventDispatcher$1.register('analytics-macro-combination', function (data) {
    analytics$1.trackMacroCombination(data.parentExtensionId, data.childExtension);
  });
  EventDispatcher$1.register('analytics-iframe-performance', function (data) {
    analytics$1.trackIframePerformance(data.metrics, data.extension);
  });
  EventDispatcher$1.register('iframe-destroyed', function (data) {
    analytics$1._resetAnalyticsDueToUnreliable(data.extension.extension_id);
  });
  EventDispatcher$1.register('analytics-external-event-track', function (data) {
    analytics$1.trackExternal(data.eventName, data.values);
  });
  EventDispatcher$1.register('iframe-bridge-timeout', function (data) {
    analytics$1.trackGasV3LoadingTimeout(data.extension);
  });

  var LoadingIndicatorActions = {
    timeout($el, extension) {
      EventDispatcher$1.dispatch('iframe-bridge-timeout', {
        $el,
        extension
      });
    },

    cancelled($el, extension) {
      EventDispatcher$1.dispatch('iframe-bridge-cancelled', {
        $el,
        extension
      });
    }

  };

  const LOADING_INDICATOR_CLASS = 'ap-status-indicator';
  const LOADING_STATUSES = {
    loading: '<div class="ap-loading"><div class="small-spinner"></div>Loading app...</div>',
    'load-timeout': '<div class="ap-load-timeout"><div class="small-spinner"></div>App is not responding. Wait or <a href="#" class="ap-btn-cancel">cancel</a>?</div>',
    'load-error': 'App failed to load.'
  };
  const LOADING_TIMEOUT = 12000;

  class LoadingIndicator {
    constructor() {
      this._stateRegistry = {};
    }

    _loadingContainer($iframeContainer) {
      return $iframeContainer.find('.' + LOADING_INDICATOR_CLASS);
    }

    render() {
      var container = document.createElement('div');
      container.classList.add(LOADING_INDICATOR_CLASS);
      container.innerHTML = LOADING_STATUSES.loading;
      var $container = $$1(container);

      this._startSpinner($container);

      return $container;
    }

    _startSpinner($container) {
      // TODO: AUI or spin.js broke something. This is bad but ironically matches v3's implementation.
      setTimeout(() => {
        var spinner = $container.find('.small-spinner');

        if (spinner.length && spinner.spin) {
          spinner.spin({
            lines: 12,
            length: 3,
            width: 2,
            radius: 3,
            trail: 60,
            speed: 1.5,
            zIndex: 1
          });
        }
      }, 10);
    }

    hide($iframeContainer, extensionId) {
      this._clearTimeout(extensionId);

      this._loadingContainer($iframeContainer)[0].style.display = 'none';
    }

    cancelled($iframeContainer, extensionId) {
      var status = LOADING_STATUSES['load-error'];

      this._loadingContainer($iframeContainer).empty().text(status);
    }

    _setupTimeout($container, extension) {
      this._stateRegistry[extension.id] = setTimeout(() => {
        LoadingIndicatorActions.timeout($container, extension);
      }, LOADING_TIMEOUT);
    }

    _clearTimeout(extensionId) {
      if (this._stateRegistry[extensionId]) {
        clearTimeout(this._stateRegistry[extensionId]);
        delete this._stateRegistry[extensionId];
      }
    }

    timeout($iframeContainer, extensionId) {
      var status = $$1(LOADING_STATUSES['load-timeout']);

      var container = this._loadingContainer($iframeContainer);

      container.empty().append(status);

      this._startSpinner(container);

      $$1('a.ap-btn-cancel', container).click(function () {
        LoadingIndicatorActions.cancelled($iframeContainer, extensionId);
      });

      this._clearTimeout(extensionId);

      return container;
    }

  }

  var LoadingComponent = new LoadingIndicator();
  EventDispatcher$1.register('iframe-create', data => {
    if (!data.extension.options.noDom) {
      LoadingComponent._setupTimeout(data.$el.parents('.ap-iframe-container'), data.extension);
    }
  });
  EventDispatcher$1.register('iframe-bridge-established', data => {
    if (!data.extension.options.noDom) {
      LoadingComponent.hide(data.$el.parents('.ap-iframe-container'), data.extension.id);
    }
  });
  EventDispatcher$1.register('iframe-bridge-timeout', data => {
    if (!data.extension.options.noDom) {
      LoadingComponent.timeout(data.$el, data.extension.id);
    }
  });
  EventDispatcher$1.register('iframe-bridge-cancelled', data => {
    if (!data.extension.options.noDom) {
      LoadingComponent.cancelled(data.$el, data.extension.id);
    }
  });
  EventDispatcher$1.register('iframe-destroyed', function (data) {
    LoadingComponent._clearTimeout(data.extension.extension_id);
  });

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  var objectWithoutPropertiesLoose$1 = _objectWithoutPropertiesLoose;

  var objectWithoutPropertiesLoose = objectWithoutPropertiesLoose$1;

  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = objectWithoutPropertiesLoose(source, excluded);
    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }

  var objectWithoutProperties = _objectWithoutProperties;

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

  var host$1 = new Connect();

  const _excluded = ["contextJwt", "url"];
  var EventActions = {
    broadcast: function (type, targetSpec, event) {
      host$1.dispatch(type, targetSpec, event);
      EventDispatcher$1.dispatch('event-dispatch', {
        type: type,
        targetSpec: targetSpec,
        event: event
      });
    },
    broadcastPublic: function (type, event, sender) {
      EventDispatcher$1.dispatch('event-public-dispatch', {
        type,
        event,
        sender
      });

      const _ref = sender.options || {},
            filteredOptions = objectWithoutProperties(_ref, _excluded);

      host$1.dispatch(type, {}, {
        sender: {
          addonKey: sender.addon_key,
          key: sender.key,
          options: util.sanitizeStructuredClone(filteredOptions)
        },
        event: event
      });
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

    if (typeof value === 'string') {
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
    return $$1('iframe#' + escapeSelector(id));
  }

  function first(arr, numb) {
    if (numb) {
      return arr.slice(0, numb);
    }

    return arr[0];
  }

  function last(arr) {
    return arr[arr.length - 1];
  }

  function pick(obj, keys) {
    if (typeof obj !== 'object') {
      return {};
    }

    return Object.keys(obj).filter(key => keys.indexOf(key) >= 0).reduce((newObj, key) => Object.assign(newObj, {
      [key]: obj[key]
    }), {});
  }

  function debounce$1(fn, wait) {
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
  }

  function isSupported(domElem, attr, value, defaultValue) {
    if (domElem && domElem[attr] && domElem[attr].supports) {
      return domElem[attr].supports(value);
    } else {
      return defaultValue;
    }
  }

  var Util = {
    escapeSelector,
    stringToDimension,
    getIframeByExtensionId,
    first,
    last,
    pick,
    debounce: debounce$1,
    isSupported,
    extend: Object.assign
  };

  var events = {
    emit: function (name) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var callback = Util.last(args);
      args = Util.first(args, -1);
      EventActions.broadcast(name, {
        addon_key: callback._context.extension.addon_key
      }, args);
    },
    emitPublic: function (name) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      var callback = Util.last(args);
      var extension = callback._context.extension;
      args = Util.first(args, -1);
      EventActions.broadcastPublic(name, args, extension);
    },
    emitToDataProvider: function () {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      var callback = Util.last(args);
      callback._context.extension;
      args = Util.first(args, -1);
      EventActions.broadcast('dataProviderEvent', {
        addon_key: callback._context.extension.addon_key
      }, args);
    }
  };

  var DialogExtensionActions = {
    open: (extension, options) => {
      EventDispatcher$1.dispatch('dialog-extension-open', {
        extension: extension,
        options: options
      });
    },
    close: () => {
      EventDispatcher$1.dispatch('dialog-close-active', {});
    },
    addUserButton: (options, extension) => {
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
    close: data => {
      EventDispatcher$1.dispatch('dialog-close', {
        dialog: data.dialog,
        extension: data.extension,
        customData: data.customData
      });
    },
    closeActive: data => {
      EventDispatcher$1.dispatch('dialog-close-active', data);
    },
    clickButton: (identifier, $el, extension) => {
      EventDispatcher$1.dispatch('dialog-button-click', {
        identifier,
        $el,
        extension
      });
    },
    toggleButton: data => {
      EventDispatcher$1.dispatch('dialog-button-toggle', data);
    },
    toggleButtonVisibility: data => {
      EventDispatcher$1.dispatch('dialog-button-toggle-visibility', data);
    }
  };

  var DomEventActions = {
    registerKeyEvent: function (data) {
      host$1.registerKeyListener(data.extension_id, data.key, data.modifiers, data.callback);
      EventDispatcher$1.dispatch('dom-event-register', data);
    },
    unregisterKeyEvent: function (data) {
      host$1.unregisterKeyListener(data.extension_id, data.key, data.modifiers, data.callback);
      EventDispatcher$1.dispatch('dom-event-unregister', data);
    },
    registerWindowKeyEvent: function (data) {
      window.addEventListener('keydown', event => {
        if (event.keyCode === data.keyCode) {
          data.callback();
        }
      });
    },
    registerClickHandler: function (handleIframeClick) {
      host$1.registerClickHandler(function (data) {
        var iframe = document.getElementById(data.extension_id);

        if (iframe) {
          handleIframeClick(iframe);
        }
      });
    },
    unregisterClickHandler: function () {
      host$1.unregisterClickHandler();
    }
  };

  class ButtonUtils {
    // button identifier for XDM. NOT an id attribute
    randomIdentifier() {
      return Math.random().toString(16).substring(7);
    }

  }

  var buttonUtilsInstance = new ButtonUtils();

  class DialogUtils {
    _maxDimension(val, maxPxVal) {
      var parsed = Util.stringToDimension(val);
      var parsedInt = parseInt(parsed, 10);
      var parsedMaxPxVal = parseInt(maxPxVal, 10);

      if (parsed.indexOf('%') > -1 && parsedInt >= 100 // %
      || parsedInt > parsedMaxPxVal) {
        // px
        return '100%';
      }

      return parsed;
    }

    _closeOnEscape(options) {
      if (options.closeOnEscape === false) {
        return false;
      } else {
        return true;
      }
    }

    _size(options) {
      var size = options.size;

      if (options.size === 'x-large') {
        size = 'xlarge';
      }

      if (options.size !== 'maximum' && options.width === '100%' && options.height === '100%') {
        size = 'fullscreen';
      }

      return size;
    }

    _header(text) {
      var headerText = '';

      switch (typeof text) {
        case 'string':
          headerText = text;
          break;

        case 'object':
          headerText = text.value;
          break;
      }

      return headerText;
    }

    _hint(text) {
      if (typeof text === 'string') {
        return text;
      }

      return '';
    }

    _chrome(options) {
      var returnval = false;

      if (typeof options.chrome === 'boolean') {
        returnval = options.chrome;
      }

      if (options.size === 'fullscreen') {
        returnval = true;
      }

      if (options.size === 'maximum') {
        returnval = false;
      }

      return returnval;
    }

    _width(options) {
      if (options.size) {
        return undefined;
      }

      if (options.width) {
        return this._maxDimension(options.width, $$1(window).width());
      }

      return '50%';
    }

    _height(options) {
      if (options.size) {
        return undefined;
      }

      if (options.height) {
        return this._maxDimension(options.height, $$1(window).height());
      }

      return '50%';
    }

    _actions(options) {
      var sanitizedActions = [];
      options = options || {};

      if (!options.actions) {
        sanitizedActions = [{
          name: 'submit',
          identifier: 'submit',
          text: options.submitText || 'Submit',
          type: 'primary',
          disabled: true // disable submit button by default (until the dialog has loaded).

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

    _id(str) {
      if (typeof str !== 'string') {
        str = Math.random().toString(36).substring(2, 8);
      }

      return str;
    } // user defined action buttons


    _buttons(options) {
      var buttons = [];

      if (options.buttons && Array.isArray(options.buttons)) {
        options.buttons.forEach(button => {
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
            disabled = true;
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

    _onHide(options) {
      var noop = function () {};

      if (typeof options.onHide === 'function') {
        return options.onHide;
      } else {
        return noop;
      }
    }

    sanitizeOptions(options) {
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
        size: options.size,
        closeOnEscape: this._closeOnEscape(options),
        onHide: this._onHide(options)
      };
      sanitized.size = this._size(sanitized);
      return sanitized;
    } // such a bad idea! this entire concept needs rewriting in the p2 plugin.


    moduleOptionsFromGlobal(addon_key, key) {
      var defaultOptions = {
        chrome: true
      };

      if (window._AP && window._AP.dialogModules && window._AP.dialogModules[addon_key] && window._AP.dialogModules[addon_key][key]) {
        return Util.extend({}, defaultOptions, window._AP.dialogModules[addon_key][key].options);
      }

      return false;
    } // determines information about dialogs that are about to open and are already open


    trackMultipleDialogOpening(dialogExtension, options) {
      // check for dialogs that are already open
      let trackingDescription;

      let size = this._size(options);

      if ($$1('.ap-aui-dialog2:visible').length) {
        // am i in the confluence editor? first check for macro dialogs opened through macro browser, second is editing an existing macro
        if ($$1('#macro-browser-dialog').length || AJS.Confluence && AJS.Confluence.Editor && AJS.Confluence.Editor.currentEditMode) {
          if (size === 'fullscreen') {
            trackingDescription = 'connect-macro-multiple-fullscreen';
          } else {
            trackingDescription = 'connect-macro-multiple';
          }
        } else {
          trackingDescription = 'connect-multiple';
        }

        analytics$1.trackMultipleDialogOpening(trackingDescription, dialogExtension);
      }
    } // abstracts and handles a failure to find active dialog


    assertActiveDialogOrThrow(dialogProvider, addon_key) {
      if (!dialogProvider.isActiveDialog(addon_key)) {
        throw new Error('Failed to find an active dialog for: ' + addon_key);
      }
    }

  }

  var dialogUtilsInstance = new DialogUtils();

  var IframeActions = {
    notifyIframeCreated: function ($el, extension) {
      EventDispatcher$1.dispatch('iframe-create', {
        $el,
        extension
      });
    },
    notifyBridgeEstablished: function ($el, extension) {
      EventDispatcher$1.dispatch('iframe-bridge-established', {
        $el,
        extension
      });
    },
    notifyIframeDestroyed: function (filter) {
      if (typeof filter === 'string') {
        filter = {
          id: filter
        };
      }

      var extensions = host$1.getExtensions(filter);
      extensions.forEach(extension => {
        EventDispatcher$1.dispatch('iframe-destroyed', {
          extension
        });
        host$1.unregisterExtension({
          id: extension.extension_id
        });
      }, this);
    },
    notifyUnloaded: function ($el, extension) {
      EventDispatcher$1.dispatch('iframe-unload', {
        $el,
        extension
      });
    }
  };

  var queryString = {};

  var strictUriEncode = str => encodeURIComponent(str).replace(/[!'()*]/g, x => "%".concat(x.charCodeAt(0).toString(16).toUpperCase()));

  var token = '%[a-f0-9]{2}';
  var singleMatcher = new RegExp(token, 'gi');
  var multiMatcher = new RegExp('(' + token + ')+', 'gi');

  function decodeComponents(components, split) {
    try {
      // Try to decode the entire string first
      return decodeURIComponent(components.join(''));
    } catch (err) {// Do nothing
    }

    if (components.length === 1) {
      return components;
    }

    split = split || 1; // Split the array in 2 parts

    var left = components.slice(0, split);
    var right = components.slice(split);
    return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
  }

  function decode$1(input) {
    try {
      return decodeURIComponent(input);
    } catch (err) {
      var tokens = input.match(singleMatcher);

      for (var i = 1; i < tokens.length; i++) {
        input = decodeComponents(tokens, i).join('');
        tokens = input.match(singleMatcher);
      }

      return input;
    }
  }

  function customDecodeURIComponent(input) {
    // Keep track of all the replacements and prefill the map with the `BOM`
    var replaceMap = {
      '%FE%FF': '\uFFFD\uFFFD',
      '%FF%FE': '\uFFFD\uFFFD'
    };
    var match = multiMatcher.exec(input);

    while (match) {
      try {
        // Decode as big chunks as possible
        replaceMap[match[0]] = decodeURIComponent(match[0]);
      } catch (err) {
        var result = decode$1(match[0]);

        if (result !== match[0]) {
          replaceMap[match[0]] = result;
        }
      }

      match = multiMatcher.exec(input);
    } // Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else


    replaceMap['%C2'] = '\uFFFD';
    var entries = Object.keys(replaceMap);

    for (var i = 0; i < entries.length; i++) {
      // Replace all decoded components
      var key = entries[i];
      input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
    }

    return input;
  }

  var decodeUriComponent = function (encodedURI) {
    if (typeof encodedURI !== 'string') {
      throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
    }

    try {
      encodedURI = encodedURI.replace(/\+/g, ' '); // Try the built in decoder first

      return decodeURIComponent(encodedURI);
    } catch (err) {
      // Fallback to a more advanced decoder
      return customDecodeURIComponent(encodedURI);
    }
  };

  var splitOnFirst = (string, separator) => {
    if (!(typeof string === 'string' && typeof separator === 'string')) {
      throw new TypeError('Expected the arguments to be of type `string`');
    }

    if (separator === '') {
      return [string];
    }

    const separatorIndex = string.indexOf(separator);

    if (separatorIndex === -1) {
      return [string];
    }

    return [string.slice(0, separatorIndex), string.slice(separatorIndex + separator.length)];
  };

  var filterObj = function (obj, predicate) {
    var ret = {};
    var keys = Object.keys(obj);
    var isArr = Array.isArray(predicate);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var val = obj[key];

      if (isArr ? predicate.indexOf(key) !== -1 : predicate(key, val, obj)) {
        ret[key] = val;
      }
    }

    return ret;
  };

  (function (exports) {
  const strictUriEncode$1 = strictUriEncode;
  const decodeComponent = decodeUriComponent;
  const splitOnFirst$1 = splitOnFirst;
  const filterObject = filterObj;

  const isNullOrUndefined = value => value === null || value === undefined;

  const encodeFragmentIdentifier = Symbol('encodeFragmentIdentifier');

  function encoderForArrayFormat(options) {
  	switch (options.arrayFormat) {
  		case 'index':
  			return key => (result, value) => {
  				const index = result.length;

  				if (
  					value === undefined ||
  					(options.skipNull && value === null) ||
  					(options.skipEmptyString && value === '')
  				) {
  					return result;
  				}

  				if (value === null) {
  					return [...result, [encode(key, options), '[', index, ']'].join('')];
  				}

  				return [
  					...result,
  					[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')
  				];
  			};

  		case 'bracket':
  			return key => (result, value) => {
  				if (
  					value === undefined ||
  					(options.skipNull && value === null) ||
  					(options.skipEmptyString && value === '')
  				) {
  					return result;
  				}

  				if (value === null) {
  					return [...result, [encode(key, options), '[]'].join('')];
  				}

  				return [...result, [encode(key, options), '[]=', encode(value, options)].join('')];
  			};

  		case 'comma':
  		case 'separator':
  		case 'bracket-separator': {
  			const keyValueSep = options.arrayFormat === 'bracket-separator' ?
  				'[]=' :
  				'=';

  			return key => (result, value) => {
  				if (
  					value === undefined ||
  					(options.skipNull && value === null) ||
  					(options.skipEmptyString && value === '')
  				) {
  					return result;
  				}

  				// Translate null to an empty string so that it doesn't serialize as 'null'
  				value = value === null ? '' : value;

  				if (result.length === 0) {
  					return [[encode(key, options), keyValueSep, encode(value, options)].join('')];
  				}

  				return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
  			};
  		}

  		default:
  			return key => (result, value) => {
  				if (
  					value === undefined ||
  					(options.skipNull && value === null) ||
  					(options.skipEmptyString && value === '')
  				) {
  					return result;
  				}

  				if (value === null) {
  					return [...result, encode(key, options)];
  				}

  				return [...result, [encode(key, options), '=', encode(value, options)].join('')];
  			};
  	}
  }

  function parserForArrayFormat(options) {
  	let result;

  	switch (options.arrayFormat) {
  		case 'index':
  			return (key, value, accumulator) => {
  				result = /\[(\d*)\]$/.exec(key);

  				key = key.replace(/\[\d*\]$/, '');

  				if (!result) {
  					accumulator[key] = value;
  					return;
  				}

  				if (accumulator[key] === undefined) {
  					accumulator[key] = {};
  				}

  				accumulator[key][result[1]] = value;
  			};

  		case 'bracket':
  			return (key, value, accumulator) => {
  				result = /(\[\])$/.exec(key);
  				key = key.replace(/\[\]$/, '');

  				if (!result) {
  					accumulator[key] = value;
  					return;
  				}

  				if (accumulator[key] === undefined) {
  					accumulator[key] = [value];
  					return;
  				}

  				accumulator[key] = [].concat(accumulator[key], value);
  			};

  		case 'comma':
  		case 'separator':
  			return (key, value, accumulator) => {
  				const isArray = typeof value === 'string' && value.includes(options.arrayFormatSeparator);
  				const isEncodedArray = (typeof value === 'string' && !isArray && decode(value, options).includes(options.arrayFormatSeparator));
  				value = isEncodedArray ? decode(value, options) : value;
  				const newValue = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map(item => decode(item, options)) : value === null ? value : decode(value, options);
  				accumulator[key] = newValue;
  			};

  		case 'bracket-separator':
  			return (key, value, accumulator) => {
  				const isArray = /(\[\])$/.test(key);
  				key = key.replace(/\[\]$/, '');

  				if (!isArray) {
  					accumulator[key] = value ? decode(value, options) : value;
  					return;
  				}

  				const arrayValue = value === null ?
  					[] :
  					value.split(options.arrayFormatSeparator).map(item => decode(item, options));

  				if (accumulator[key] === undefined) {
  					accumulator[key] = arrayValue;
  					return;
  				}

  				accumulator[key] = [].concat(accumulator[key], arrayValue);
  			};

  		default:
  			return (key, value, accumulator) => {
  				if (accumulator[key] === undefined) {
  					accumulator[key] = value;
  					return;
  				}

  				accumulator[key] = [].concat(accumulator[key], value);
  			};
  	}
  }

  function validateArrayFormatSeparator(value) {
  	if (typeof value !== 'string' || value.length !== 1) {
  		throw new TypeError('arrayFormatSeparator must be single character string');
  	}
  }

  function encode(value, options) {
  	if (options.encode) {
  		return options.strict ? strictUriEncode$1(value) : encodeURIComponent(value);
  	}

  	return value;
  }

  function decode(value, options) {
  	if (options.decode) {
  		return decodeComponent(value);
  	}

  	return value;
  }

  function keysSorter(input) {
  	if (Array.isArray(input)) {
  		return input.sort();
  	}

  	if (typeof input === 'object') {
  		return keysSorter(Object.keys(input))
  			.sort((a, b) => Number(a) - Number(b))
  			.map(key => input[key]);
  	}

  	return input;
  }

  function removeHash(input) {
  	const hashStart = input.indexOf('#');
  	if (hashStart !== -1) {
  		input = input.slice(0, hashStart);
  	}

  	return input;
  }

  function getHash(url) {
  	let hash = '';
  	const hashStart = url.indexOf('#');
  	if (hashStart !== -1) {
  		hash = url.slice(hashStart);
  	}

  	return hash;
  }

  function extract(input) {
  	input = removeHash(input);
  	const queryStart = input.indexOf('?');
  	if (queryStart === -1) {
  		return '';
  	}

  	return input.slice(queryStart + 1);
  }

  function parseValue(value, options) {
  	if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === 'string' && value.trim() !== '')) {
  		value = Number(value);
  	} else if (options.parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
  		value = value.toLowerCase() === 'true';
  	}

  	return value;
  }

  function parse(query, options) {
  	options = Object.assign({
  		decode: true,
  		sort: true,
  		arrayFormat: 'none',
  		arrayFormatSeparator: ',',
  		parseNumbers: false,
  		parseBooleans: false
  	}, options);

  	validateArrayFormatSeparator(options.arrayFormatSeparator);

  	const formatter = parserForArrayFormat(options);

  	// Create an object with no prototype
  	const ret = Object.create(null);

  	if (typeof query !== 'string') {
  		return ret;
  	}

  	query = query.trim().replace(/^[?#&]/, '');

  	if (!query) {
  		return ret;
  	}

  	for (const param of query.split('&')) {
  		if (param === '') {
  			continue;
  		}

  		let [key, value] = splitOnFirst$1(options.decode ? param.replace(/\+/g, ' ') : param, '=');

  		// Missing `=` should be `null`:
  		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
  		value = value === undefined ? null : ['comma', 'separator', 'bracket-separator'].includes(options.arrayFormat) ? value : decode(value, options);
  		formatter(decode(key, options), value, ret);
  	}

  	for (const key of Object.keys(ret)) {
  		const value = ret[key];
  		if (typeof value === 'object' && value !== null) {
  			for (const k of Object.keys(value)) {
  				value[k] = parseValue(value[k], options);
  			}
  		} else {
  			ret[key] = parseValue(value, options);
  		}
  	}

  	if (options.sort === false) {
  		return ret;
  	}

  	return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce((result, key) => {
  		const value = ret[key];
  		if (Boolean(value) && typeof value === 'object' && !Array.isArray(value)) {
  			// Sort object keys, not values
  			result[key] = keysSorter(value);
  		} else {
  			result[key] = value;
  		}

  		return result;
  	}, Object.create(null));
  }

  exports.extract = extract;
  exports.parse = parse;

  exports.stringify = (object, options) => {
  	if (!object) {
  		return '';
  	}

  	options = Object.assign({
  		encode: true,
  		strict: true,
  		arrayFormat: 'none',
  		arrayFormatSeparator: ','
  	}, options);

  	validateArrayFormatSeparator(options.arrayFormatSeparator);

  	const shouldFilter = key => (
  		(options.skipNull && isNullOrUndefined(object[key])) ||
  		(options.skipEmptyString && object[key] === '')
  	);

  	const formatter = encoderForArrayFormat(options);

  	const objectCopy = {};

  	for (const key of Object.keys(object)) {
  		if (!shouldFilter(key)) {
  			objectCopy[key] = object[key];
  		}
  	}

  	const keys = Object.keys(objectCopy);

  	if (options.sort !== false) {
  		keys.sort(options.sort);
  	}

  	return keys.map(key => {
  		const value = object[key];

  		if (value === undefined) {
  			return '';
  		}

  		if (value === null) {
  			return encode(key, options);
  		}

  		if (Array.isArray(value)) {
  			if (value.length === 0 && options.arrayFormat === 'bracket-separator') {
  				return encode(key, options) + '[]';
  			}

  			return value
  				.reduce(formatter(key), [])
  				.join('&');
  		}

  		return encode(key, options) + '=' + encode(value, options);
  	}).filter(x => x.length > 0).join('&');
  };

  exports.parseUrl = (url, options) => {
  	options = Object.assign({
  		decode: true
  	}, options);

  	const [url_, hash] = splitOnFirst$1(url, '#');

  	return Object.assign(
  		{
  			url: url_.split('?')[0] || '',
  			query: parse(extract(url), options)
  		},
  		options && options.parseFragmentIdentifier && hash ? {fragmentIdentifier: decode(hash, options)} : {}
  	);
  };

  exports.stringifyUrl = (object, options) => {
  	options = Object.assign({
  		encode: true,
  		strict: true,
  		[encodeFragmentIdentifier]: true
  	}, options);

  	const url = removeHash(object.url).split('?')[0] || '';
  	const queryFromUrl = exports.extract(object.url);
  	const parsedQueryFromUrl = exports.parse(queryFromUrl, {sort: false});

  	const query = Object.assign(parsedQueryFromUrl, object.query);
  	let queryString = exports.stringify(query, options);
  	if (queryString) {
  		queryString = `?${queryString}`;
  	}

  	let hash = getHash(object.url);
  	if (object.fragmentIdentifier) {
  		hash = `#${options[encodeFragmentIdentifier] ? encode(object.fragmentIdentifier, options) : object.fragmentIdentifier}`;
  	}

  	return `${url}${queryString}${hash}`;
  };

  exports.pick = (input, filter, options) => {
  	options = Object.assign({
  		parseFragmentIdentifier: true,
  		[encodeFragmentIdentifier]: false
  	}, options);

  	const {url, query, fragmentIdentifier} = exports.parseUrl(input, options);
  	return exports.stringifyUrl({
  		url,
  		query: filterObject(query, filter),
  		fragmentIdentifier
  	}, options);
  };

  exports.exclude = (input, filter, options) => {
  	const exclusionFilter = Array.isArray(filter) ? key => !filter.includes(key) : (key, value) => !filter(key, value);

  	return exports.pick(input, exclusionFilter, options);
  };
  }(queryString));

  var toByteArray_1 = toByteArray;
  var lookup = [];
  var revLookup = [];
  var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  } // Support decoding URL-safe base64 strings, as Node.js does.
  // See: https://en.wikipedia.org/wiki/Base64#URL_applications


  revLookup['-'.charCodeAt(0)] = 62;
  revLookup['_'.charCodeAt(0)] = 63;

  function getLens(b64) {
    var len = b64.length;

    if (len % 4 > 0) {
      throw new Error('Invalid string. Length must be a multiple of 4');
    } // Trim off extra bytes after placeholder bytes are found
    // See: https://github.com/beatgammit/base64-js/issues/42


    var validLen = b64.indexOf('=');
    if (validLen === -1) validLen = len;
    var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
    return [validLen, placeHoldersLen];
  } // base64 is 4/3 + up to two characters of the original data

  function _byteLength(b64, validLen, placeHoldersLen) {
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
  }

  function toByteArray(b64) {
    var tmp;
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
    var curByte = 0; // if there are placeholders, only get up to the last complete 4 chars

    var len = placeHoldersLen > 0 ? validLen - 4 : validLen;

    for (var i = 0; i < len; i += 4) {
      tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
      arr[curByte++] = tmp >> 16 & 0xFF;
      arr[curByte++] = tmp >> 8 & 0xFF;
      arr[curByte++] = tmp & 0xFF;
    }

    if (placeHoldersLen === 2) {
      tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
      arr[curByte++] = tmp & 0xFF;
    }

    if (placeHoldersLen === 1) {
      tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
      arr[curByte++] = tmp >> 8 & 0xFF;
      arr[curByte++] = tmp & 0xFF;
    }

    return arr;
  }

  var textEncoderLite = {exports: {}};

  (function (module) {
  function TextEncoderLite() {}

  function TextDecoderLite() {}

  (function () {
    // Thanks Feross et al! :-)

    function utf8ToBytes(string, units) {
      units = units || Infinity;
      var codePoint;
      var length = string.length;
      var leadSurrogate = null;
      var bytes = [];
      var i = 0;

      for (; i < length; i++) {
        codePoint = string.charCodeAt(i); // is surrogate component

        if (codePoint > 0xD7FF && codePoint < 0xE000) {
          // last char was a lead
          if (leadSurrogate) {
            // 2 leads in a row
            if (codePoint < 0xDC00) {
              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
              leadSurrogate = codePoint;
              continue;
            } else {
              // valid surrogate pair
              codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000;
              leadSurrogate = null;
            }
          } else {
            // no lead yet
            if (codePoint > 0xDBFF) {
              // unexpected trail
              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
              continue;
            } else if (i + 1 === length) {
              // unpaired lead
              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
              continue;
            } else {
              // valid lead
              leadSurrogate = codePoint;
              continue;
            }
          }
        } else if (leadSurrogate) {
          // valid bmp char, but last char was a lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          leadSurrogate = null;
        } // encode utf8


        if (codePoint < 0x80) {
          if ((units -= 1) < 0) break;
          bytes.push(codePoint);
        } else if (codePoint < 0x800) {
          if ((units -= 2) < 0) break;
          bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
        } else if (codePoint < 0x10000) {
          if ((units -= 3) < 0) break;
          bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
        } else if (codePoint < 0x200000) {
          if ((units -= 4) < 0) break;
          bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
        } else {
          throw new Error('Invalid code point');
        }
      }

      return bytes;
    }

    function utf8Slice(buf, start, end) {
      var res = '';
      var tmp = '';
      end = Math.min(buf.length, end || Infinity);
      start = start || 0;

      for (var i = start; i < end; i++) {
        if (buf[i] <= 0x7F) {
          res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i]);
          tmp = '';
        } else {
          tmp += '%' + buf[i].toString(16);
        }
      }

      return res + decodeUtf8Char(tmp);
    }

    function decodeUtf8Char(str) {
      try {
        return decodeURIComponent(str);
      } catch (err) {
        return String.fromCharCode(0xFFFD); // UTF 8 invalid char
      }
    }

    TextEncoderLite.prototype.encode = function (str) {
      var result;

      if ('undefined' === typeof Uint8Array) {
        result = utf8ToBytes(str);
      } else {
        result = new Uint8Array(utf8ToBytes(str));
      }

      return result;
    };

    TextDecoderLite.prototype.decode = function (bytes) {
      return utf8Slice(bytes, 0, bytes.length);
    };
  })();

  if (module) {
    module.exports.TextDecoderLite = TextDecoderLite;
    module.exports.TextEncoderLite = TextEncoderLite;
  }
  }(textEncoderLite));

  function decode(string) {
    var padding = 4 - string.length % 4;

    if (padding === 1) {
      string += '=';
    } else if (padding === 2) {
      string += '==';
    }

    return Flags.isFeatureFlagNativeTextEncoder() ? new TextDecoder().decode(toByteArray_1(string)) : textEncoderLite.exports.TextDecoderLite.prototype.decode(toByteArray_1(string));
  }

  var JWT_SKEW = 60; // in seconds.

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

    var claimsString = decode.call(window, encodedClaims);
    return JSON.parse(claimsString);
  }

  function isJwtExpired$1(jwtString, skew) {
    if (skew === undefined) {
      skew = JWT_SKEW;
    }

    var claims = parseJwtClaims(jwtString);
    var expires = 0;
    var now = Math.floor(Date.now() / 1000); // UTC timestamp now

    if (claims && claims.exp) {
      expires = claims.exp;
    }

    if (expires - skew < now) {
      return true;
    }

    return false;
  }

  EventDispatcher$1.register('jwt-skew-set', function (data) {
    JWT_SKEW = data.skew;
  });
  var jwtUtil = {
    parseJwtIssuer,
    parseJwtClaims,
    isJwtExpired: isJwtExpired$1
  };

  function isJwtExpired(urlStr) {
    var jwtStr = _getJwt(urlStr);

    return jwtUtil.isJwtExpired(jwtStr);
  }

  function _getJwt(urlStr) {
    var query = queryString.parse(queryString.extract(urlStr));
    return query['jwt'];
  }

  function hasJwt(url) {
    var jwt = _getJwt(url);

    return jwt && _getJwt(url).length !== 0;
  }

  var urlUtils = {
    hasJwt,
    isJwtExpired
  };

  var jwtActions = {
    registerContentResolver: function (data) {
      EventDispatcher$1.dispatch('content-resolver-register-by-extension', data);
    },
    requestRefreshUrl: function (data) {
      if (!data.resolver) {
        throw Error('ACJS: No content resolver supplied');
      }

      var promise = data.resolver.call(null, Util.extend({
        classifier: 'json'
      }, data.extension));
      promise.fail(function (promiseData, error) {
        EventDispatcher$1.dispatch('jwt-url-refreshed-failed', {
          extension: data.extension,
          $container: data.$container,
          errorText: error.text
        });
      });
      promise.done(function (promiseData) {
        var newExtensionConfiguration = {};

        if (typeof promiseData === 'object') {
          newExtensionConfiguration = promiseData;
        } else if (typeof promiseData === 'string') {
          try {
            newExtensionConfiguration = JSON.parse(promiseData);
          } catch (e) {
            console.error('ACJS: invalid response from content resolver');
          }
        }

        data.extension.url = newExtensionConfiguration.url;
        Util.extend(data.extension.options, newExtensionConfiguration.options);
        EventDispatcher$1.dispatch('jwt-url-refreshed', {
          extension: data.extension,
          $container: data.$container,
          url: data.extension.url
        });
      });
      EventDispatcher$1.dispatch('jwt-url-refresh-request', {
        data
      });
    },
    setClockSkew: function (skew) {
      if (typeof skew === 'number') {
        EventDispatcher$1.dispatch('jwt-skew-set', {
          skew
        });
      } else {
        console.error('ACJS: invalid JWT clock skew set');
      }
    }
  };

  var iframeUtils = {
    optionsToAttributes: function (options) {
      var sanitized = {};

      if (options && typeof options === 'object') {
        if (options.width) {
          sanitized.width = Util.stringToDimension(options.width);
        }

        if (options.height) {
          sanitized.height = Util.stringToDimension(options.height);
        }

        if (typeof options.sandbox === 'string') {
          var domElem = document.createElement('iframe');
          sanitized.sandbox = options.sandbox.split(' ').filter(value => Util.isSupported(domElem, 'sandbox', value, true)).join(' ');
        }
      }

      return sanitized;
    }
  };

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

      Util.extend(this.store, toSet);
    }

    get(key) {
      if (key) {
        return this.store[key];
      }

      return Util.extend({}, this.store); //clone
    }

  }

  var ExtensionConfigurationOptionsStore$1 = new ExtensionConfigurationOptionsStore();

  let performanceModuleDefined = false;
  const ADDON_KEY_CODEBARREL = 'com.codebarrel.addons.automation';
  /**
   * This is a temporary module for Code Barrel that will be removed when no longer needed.
   */

  function definePerformanceModule() {
    if (performanceModuleDefined) {
      return;
    }

    performanceModuleDefined = true;

    function isPerformanceModuleAllowed(cb) {
      return cb._context.extension.addon_key === ADDON_KEY_CODEBARREL;
    }

    const performanceModule = {
      /**
       * @see https://developer.mozilla.org/en-US/docs/web/api/performance/timing
       * @returns {Promise<PerformanceTiming>}
       */
      getPerformanceTiming(cb) {
        return new Promise((resolve, reject) => {
          if (!isPerformanceModuleAllowed(cb)) {
            reject(new Error('This is a restricted API'));
          } // We need to parse + stringify otherwise we get an empty object


          resolve(JSON.parse(JSON.stringify(window.performance.timing)));
        });
      },

      /**
       * @see https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming
       * @returns {Promise<PerformanceNavigationTiming[] | void>}
       */
      getPerformanceNavigationTiming(cb) {
        return new Promise((resolve, reject) => {
          if (!isPerformanceModuleAllowed(cb)) {
            reject(new Error('This is a restricted API'));
          }

          if (!window.PerformanceNavigationTiming) {
            resolve(undefined);
          }

          const timing = window.performance.getEntriesByType('navigation');
          resolve(JSON.parse(JSON.stringify(timing)));
        });
      }

    };
    host$1.returnsPromise(performanceModule.getPerformanceTiming);
    host$1.returnsPromise(performanceModule.getPerformanceNavigationTiming);
    host$1.defineModule('_performance', performanceModule);
  }

  function createSimpleXdmExtension(extension) {
    const extensionConfig = extensionConfigSanitizer(extension);
    const systemExtensionConfigOptions = ExtensionConfigurationOptionsStore$1.get();
    extension.options = extensionConfig.options = Util.extend({}, extensionConfig.options);
    extension.options.globalOptions = systemExtensionConfigOptions;
    loadConditionalModules(extension.addon_key);
    const iframeAttributes = host$1.create(extensionConfig, () => {
      if (!extension.options.noDOM) {
        extension.$el = $$1(document.getElementById(extension.id));
      }

      IframeActions.notifyBridgeEstablished(extension.$el, extension);
    }, () => {
      IframeActions.notifyUnloaded(extension.$el, extension);
    }); // HostApi destroy is relying on previous behaviour of the
    // iframe component wherein it would call simpleXDM.create(extension)
    // and then mutate the extension object with the id returned from the
    // iframeAttributes see changes made in ACJS-760 and ACJS-807

    extensionConfig.id = iframeAttributes.id;
    extension.id = iframeAttributes.id;
    Util.extend(iframeAttributes, iframeUtils.optionsToAttributes(extension.options));
    return {
      iframeAttributes,
      extension
    };
  }

  function extensionConfigSanitizer(extension) {
    return {
      addon_key: extension.addon_key,
      key: extension.key,
      url: extension.url,
      options: extension.options
    };
  }

  function loadConditionalModules(addonKey) {
    if (getBooleanFeatureFlag('com.atlassian.connect.acjs-oc-1657-add-performance-timing-api') && addonKey === ADDON_KEY_CODEBARREL) {
      definePerformanceModule();
    }
  }

  var simpleXdmUtils = {
    createSimpleXdmExtension,
    extensionConfigSanitizer
  };

  class Iframe {
    constructor() {
      this._contentResolver = false;
    }

    setContentResolver(callback) {
      this._contentResolver = callback;
    }

    resize(width, height, $el) {
      width = Util.stringToDimension(width);
      height = Util.stringToDimension(height);
      $el.css({
        width: width,
        height: height
      });
      $el.trigger('resized', {
        width: width,
        height: height
      });
    }

    simpleXdmExtension(extension, $container) {
      if (!extension.url || urlUtils.hasJwt(extension.url) && urlUtils.isJwtExpired(extension.url)) {
        if (this._contentResolver) {
          jwtActions.requestRefreshUrl({
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

    _simpleXdmCreate(extension) {
      var simpleXdmAttributes = simpleXdmUtils.createSimpleXdmExtension(extension);
      extension.id = simpleXdmAttributes.iframeAttributes.id;
      extension.$el = this.render(simpleXdmAttributes.iframeAttributes);
      return extension;
    }

    _appendExtension($container, extension) {
      var existingFrame = $container.find('iframe');

      if (existingFrame.length > 0) {
        existingFrame.destroy();
      }

      if (extension.options.hideIframeUntilLoad) {
        extension.$el.css({
          visibility: 'hidden'
        }).load(() => {
          extension.$el.css({
            visibility: ''
          });
        });
      }

      $container.prepend(extension.$el);
      IframeActions.notifyIframeCreated(extension.$el, extension);
    }

    _appendExtensionError($container, text) {
      var $error = $$1('<div class="connect-resolve-error"></div>');
      var $additionalText = $$1('<p />').text(text);
      $error.append('<p class="error">Error: The content resolver threw the following error:</p>');
      $error.append($additionalText);
      $container.prepend($error);
    }

    resolverResponse(data) {
      var simpleExtension = this._simpleXdmCreate(data.extension);

      this._appendExtension(data.$container, simpleExtension);
    }

    resolverFailResponse(data) {
      this._appendExtensionError(data.$container, data.errorText);
    }

    render(attributes) {
      attributes = attributes || {};
      attributes.referrerpolicy = 'no-referrer';
      return $$1('<iframe />').attr(attributes).addClass('ap-iframe');
    }

  }

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
  EventDispatcher$1.register('jwt-url-refreshed-failed', function (data) {
    IframeComponent.resolverFailResponse(data);
  });
  EventDispatcher$1.register('after:iframe-bridge-established', function (data) {
    if (!data.extension.options.noDom) {
      data.$el[0].bridgeEstablished = true;
    } else {
      data.extension.options.bridgeEstablished = true;
    }
  });

  var ButtonActions = {
    clicked: $el => {
      EventDispatcher$1.dispatch('button-clicked', {
        $el
      });
    },
    toggle: ($el, disabled) => {
      EventDispatcher$1.dispatch('button-toggle', {
        $el,
        disabled
      });
    },
    toggleVisibility: ($el, hidden) => {
      EventDispatcher$1.dispatch('button-toggle-visibility', {
        $el,
        hidden
      });
    }
  };

  const BUTTON_TYPES = ['primary', 'link', 'secondary'];
  var buttonId = 0;

  class Button$1 {
    constructor() {
      this.AP_BUTTON_CLASS = 'ap-aui-button';
    }

    setType($button, type) {
      if (type && BUTTON_TYPES.indexOf(type) >= 0) {
        $button.addClass('aui-button-' + type);
      }

      return $button;
    }

    setDisabled($button, disabled) {
      if (typeof disabled !== 'undefined' && !$button.data('immutable')) {
        $button.attr('aria-disabled', disabled);
      }

      return $button;
    }

    setHidden($button, hidden) {
      if (typeof hidden !== 'undefined' && !$button.data('immutable')) {
        $button.toggle(!hidden);
      }

      return $button;
    }

    _setId($button, id) {
      if (!id) {
        id = 'ap-button-' + buttonId;
        buttonId++;
      }

      $button.attr('id', id);
      return $button;
    }

    _additionalClasses($button, classes) {
      if (classes) {
        if (typeof classes !== 'string') {
          classes = classes.join(' ');
        }

        $button.addClass(classes);
      }

      return $button;
    }

    getName($button) {
      return $$1($button).data('name');
    }

    getText($button) {
      return $$1($button).text();
    }

    getIdentifier($button) {
      return $$1($button).data('identifier');
    }

    isVisible($button) {
      return $$1($button).is(':visible');
    }

    isEnabled($button) {
      return !($$1($button).attr('aria-disabled') === 'true');
    }

    render(options) {
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

  }

  var ButtonComponent = new Button$1(); // register 1 button listener globally on dom load

  $$1(function () {
    $$1('body').on('click', '.' + ButtonComponent.AP_BUTTON_CLASS, function (e) {
      var $button = $$1(e.target).closest('.' + ButtonComponent.AP_BUTTON_CLASS);

      if ($button.attr('aria-disabled') !== 'true') {
        ButtonActions.clicked($button);
      }
    });
  });
  EventDispatcher$1.register('button-toggle', data => {
    ButtonComponent.setDisabled(data.$el, data.disabled);
  });
  EventDispatcher$1.register('button-toggle-visibility', data => {
    ButtonComponent.setHidden(data.$el, data.hidden);
  });

  const CONTAINER_CLASSES = ['ap-iframe-container'];

  class IframeContainer {
    createExtension(extension, options) {
      var $container = this._renderContainer();

      if (!options || options.loadingIndicator !== false) {
        $container.append(this._renderLoadingIndicator());
      }

      IframeComponent.simpleXdmExtension(extension, $container);
      return $container;
    }

    _renderContainer(attributes) {
      var container = $$1('<div />').attr(attributes || {});
      container.addClass(CONTAINER_CLASSES.join(' '));
      return container;
    }

    _renderLoadingIndicator() {
      return LoadingComponent.render();
    }

  }

  var IframeContainerComponent = new IframeContainer();
  EventDispatcher$1.register('iframe-create', data => {
    var id = 'embedded-' + data.extension.id;
    data.extension.$el.parents('.ap-iframe-container').attr('id', id);
  });

  function create(extension) {
    return IframeContainerComponent.createExtension(extension);
  }

  var ModuleActions = {
    defineCustomModule: function (name, methods) {
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

  var AnalyticsAction = {
    trackDeprecatedMethodUsed(methodUsed, extension) {
      EventDispatcher$1.dispatch('analytics-deprecated-method-used', {
        methodUsed,
        extension
      });
    },

    trackMacroCombination: function trackMacroCombination(parentExtensionId, childExtension) {
      EventDispatcher$1.dispatch('analytics-macro-combination', {
        parentExtensionId: parentExtensionId,
        childExtension: childExtension
      });
    },

    trackIframeBridgeStart(extension) {
      EventDispatcher$1.dispatch('iframe-bridge-start', {
        extension
      });
    },

    trackExternalEvent(name, values) {
      EventDispatcher$1.dispatch('analytics-external-event-track', {
        eventName: name,
        values: values
      });
    },

    trackIframePerformanceMetrics(metrics, extension) {
      if (metrics && Object.getOwnPropertyNames(metrics).length > 0) {
        EventDispatcher$1.dispatch('analytics-iframe-performance', {
          metrics,
          extension
        });
      }
    }

  };

  function sanitizeTriggers(triggers) {
    var onTriggers;

    if (Array.isArray(triggers)) {
      onTriggers = triggers.join(' ');
    } else if (typeof triggers === 'string') {
      onTriggers = triggers.trim();
    }

    return onTriggers;
  }

  function uniqueId() {
    return 'webitem-' + Math.floor(Math.random() * 1000000000).toString(16);
  } // LEGACY: get addon key by webitem for p2


  function getExtensionKey($target) {
    var cssClass = $target.attr('class');
    var m = cssClass ? cssClass.match(/ap-plugin-key-([^\s]*)/) : null;
    return Array.isArray(m) ? m[1] : false;
  } // LEGACY: get module key by webitem for p2


  function getKey($target) {
    var cssClass = $target.attr('class');
    var m = cssClass ? cssClass.match(/ap-module-key-([^\s]*)/) : null;
    return Array.isArray(m) ? m[1] : false;
  }

  function getTargetKey($target) {
    var cssClass = $target.attr('class');
    var m = cssClass ? cssClass.match(/ap-target-key-([^\s]*)/) : null;
    return Array.isArray(m) ? m[1] : false;
  }

  function getFullKey($target) {
    return getExtensionKey($target) + '__' + getKey($target);
  }

  function getModuleOptionsByAddonAndModuleKey(type, addonKey, moduleKey) {
    var moduleType = type + 'Modules';

    if (window._AP && window._AP[moduleType] && window._AP[moduleType][addonKey] && window._AP[moduleType][addonKey][moduleKey]) {
      return Util.extend({}, window._AP[moduleType][addonKey][moduleKey].options);
    }
  }

  function getModuleOptionsForWebitem(type, $target) {
    var addon_key = getExtensionKey($target);
    var targetKey = getTargetKey($target);
    return getModuleOptionsByAddonAndModuleKey(type, addon_key, targetKey);
  } //gets the connect config from the encoded webitem target (via the url)


  function getConfigFromTarget($target) {
    var url = $target.attr('href');
    var convertedOptions = {};
    var iframeData; // adg3 has classes outside of a tag so look for href inside the a

    if (!url) {
      url = $target.find('a').attr('href');
    }

    if (url) {
      var hashIndex = url.indexOf('#');

      if (hashIndex >= 0) {
        var hash = url.substring(hashIndex + 1);

        try {
          iframeData = JSON.parse(decodeURI(hash));
        } catch (e) {
          console.error('ACJS: cannot decode webitem anchor');
        }

        if (iframeData && window._AP && window._AP._convertConnectOptions) {
          convertedOptions = window._AP._convertConnectOptions(iframeData);
        } else {
          console.error('ACJS: cannot convert webitem url to connect iframe options');
        }
      } else {
        // The URL has no hash component so fall back to the old behaviour of providing:
        // add-on key, module key, dialog module options and product context (from the webitem url).
        // This may be the case for web items that were persisted prior to the new storage format whereby a hash
        // fragment is added into the URL detailing the target module info. If this info is
        // not present, the content resolver will be used to resolve the module after the web
        // item is clicked.
        // Old URL format detected. Falling back to old functionality
        var fullKey = getFullKey($target);
        var type = $target.hasClass('ap-inline-dialog') ? 'inlineDialog' : 'dialog';
        var options = getModuleOptionsForWebitem(type, $target);

        if (!options && window._AP && window._AP[type + 'Options']) {
          options = Util.extend({}, window._AP[type + 'Options'][fullKey]) || {};
        }

        if (!options) {
          options = {};
          console.warn('no webitem ' + type + 'Options for ' + fullKey);
        }

        options.productContext = options.productContext || {};
        var query = queryString.parse(queryString.extract(url));
        Util.extend(options.productContext, query);
        convertedOptions = {
          addon_key: getExtensionKey($target),
          key: getKey($target),
          options: options
        };
      }
    }

    return convertedOptions;
  } // LEGACY - method for handling webitem options for p2


  function getOptionsForWebItem($target) {
    var fullKey = getFullKey($target);
    var type = $target.hasClass('ap-inline-dialog') ? 'inlineDialog' : 'dialog';
    var options = getModuleOptionsForWebitem(type, $target);

    if (!options && window._AP && window._AP[type + 'Options']) {
      options = Util.extend({}, window._AP[type + 'Options'][fullKey]) || {};
    }

    if (!options) {
      options = {};
      console.warn('no webitem ' + type + 'Options for ' + fullKey);
    }

    options.productContext = options.productContext || {};
    options.structuredContext = options.structuredContext || {}; // create product context from url params

    var convertedConfig = getConfigFromTarget($target);

    if (convertedConfig && convertedConfig.options) {
      Util.extend(options.productContext, convertedConfig.options.productContext);
      Util.extend(options.structuredContext, convertedConfig.options.structuredContext);
      options.contextJwt = convertedConfig.options.contextJwt;
    }

    return options;
  }

  var WebItemUtils = {
    sanitizeTriggers,
    uniqueId,
    getExtensionKey,
    getKey,
    getOptionsForWebItem,
    getModuleOptionsByAddonAndModuleKey,
    getConfigFromTarget
  };

  class ModuleProviders {
    constructor() {
      this._providers = {};

      this.registerProvider = (name, provider) => {
        this._providers[name] = provider;
      };

      this.getProvider = name => {
        return this._providers[name];
      };
    }

  }

  var ModuleProviders$1 = new ModuleProviders();

  // This is essentially a copy of the ACJSFrameworkAdaptor/BaseFrameworkAdaptor implementation generated
  // by compiling the connect-module-core typescript implementations of the equivalent classes.

  /**
   * This class provides common behaviour relating to the adaption of functionality to a
   * particular Connect client framework. This is necessary for an interim period during which
   * we have multiple Connect client frameworks that we need to support: ACJS and CaaS Client.
   */
  var ACJSFrameworkAdaptor = function () {
    function ACJSFrameworkAdaptor() {
      this.moduleNamesToModules = new Map();
    }
    /**
     * This method registers a module with the Connect client framework relating to this adaptor instance.
     * @param moduleDefinition the definition of the module.
     */


    ACJSFrameworkAdaptor.prototype.registerModule = function (module, props) {
      var moduleRegistrationName = module.getModuleRegistrationName();
      this.moduleNamesToModules.set(moduleRegistrationName, module); // This adaptor implementation doesn't need to register the SimpleXDM definition so the following is
      // commented out.
      //
      // var simpleXdmDefinition = module.getSimpleXdmDefinition(props);
      // this.registerModuleWithHost(moduleRegistrationName, simpleXdmDefinition);
    };

    ACJSFrameworkAdaptor.prototype.getModuleByName = function (moduleName) {
      return this.moduleNamesToModules.get(moduleName);
    };

    ACJSFrameworkAdaptor.prototype.getProviderByModuleName = function (moduleName) {
      var module = this.moduleNamesToModules.get(moduleName);

      if (module && module.isEnabled()) {
        return module.getProvider();
      } else {
        return undefined;
      }
    };

    return ACJSFrameworkAdaptor;
  }();

  const acjsFrameworkAdaptor = new ACJSFrameworkAdaptor();

  class HostApi {
    constructor() {
      this.create = extension => {
        return create(simpleXdmUtils.extensionConfigSanitizer(extension));
      };

      this.dialog = {
        create: (extension, dialogOptions) => {
          var dialogBeanOptions = WebItemUtils.getModuleOptionsByAddonAndModuleKey('dialog', extension.addon_key, extension.key);
          var completeOptions = Util.extend({}, dialogBeanOptions || {}, dialogOptions);
          DialogExtensionActions.open(extension, completeOptions);
        },
        close: (addon_key, closeData) => {
          const frameworkAdaptor = this.getFrameworkAdaptor();
          const dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');

          if (dialogProvider) {
            dialogUtilsInstance.assertActiveDialogOrThrow(dialogProvider, addon_key);
            EventActions.broadcast('dialog.close', {
              addon_key: addon_key
            }, closeData);
            dialogProvider.close();
          } else {
            DialogExtensionActions.close();
          }
        }
      };
      this.registerContentResolver = {
        resolveByExtension: callback => {
          this._contentResolver = callback;
          jwtActions.registerContentResolver({
            callback: callback
          });
        }
      };

      this.getContentResolver = () => {
        return this._contentResolver;
      };

      this.registerProvider = (componentName, component) => {
        ModuleProviders$1.registerProvider(componentName, component);
      };

      this.getProvider = componentName => {
        return ModuleProviders$1.getProvider(componentName);
      }; // We are attaching an instance of ACJSAdaptor to the host so that products are able
      // to retrieve the identical instance of ACJSAdaptor that ACJS is using.
      // The product can override the framework adaptor by calling setFrameworkAdaptor().


      this.frameworkAdaptor = acjsFrameworkAdaptor;
    }
    /**
    * creates an extension
    * returns an object with extension and iframe attributes
    * designed for use with non DOM implementations such as react.
    */


    createExtension(extension) {
      extension.options = extension.options || {};
      extension.options.noDom = true;
      let createdExtension = simpleXdmUtils.createSimpleXdmExtension(extension);
      AnalyticsAction.trackIframeBridgeStart(createdExtension.extension);
      return createdExtension;
    }
    /**
     * registers an existing extension with this host
     * Used when the extension has been created by a sub host
     */


    registerExistingExtension(extension_id, data) {
      return host$1.registerExistingExtension(extension_id, data);
    }
    /**
     * The product is responsible for setting the framework adaptor.
     * @param frameworkAdaptor the framework adaptor to use.
     */


    setFrameworkAdaptor(frameworkAdaptor) {
      this.frameworkAdaptor = frameworkAdaptor;
    }

    getFrameworkAdaptor() {
      return this.frameworkAdaptor;
    }

    _cleanExtension(extension) {
      return Util.pick(extension, ['id', 'addon_key', 'key', 'options', 'url']);
    }

    onIframeEstablished(callback) {
      var wrapper = function (data) {
        callback.call({}, {
          $el: data.$el,
          extension: this._cleanExtension(data.extension)
        });
      };

      callback._wrapper = wrapper.bind(this);
      EventDispatcher$1.register('after:iframe-bridge-established', callback._wrapper);
    }

    offIframeEstablished(callback) {
      if (callback._wrapper) {
        EventDispatcher$1.unregister('after:iframe-bridge-established', callback._wrapper);
      } else {
        throw new Error('cannot unregister event dispatch listener without _wrapper reference');
      }
    }

    onIframeUnload(callback) {
      EventDispatcher$1.register('after:iframe-unload', data => {
        callback.call({}, {
          $el: data.$el,
          extension: this._cleanExtension(data.extension)
        });
      });
    }

    onPublicEventDispatched(callback) {
      var wrapper = function (data) {
        callback.call({}, {
          type: data.type,
          event: data.event,
          extension: this._cleanExtension(data.sender)
        });
      };

      callback._wrapper = wrapper.bind(this);
      EventDispatcher$1.register('after:event-public-dispatch', callback._wrapper);
    }

    offPublicEventDispatched(callback) {
      if (callback._wrapper) {
        EventDispatcher$1.unregister('after:event-public-dispatch', callback._wrapper);
      } else {
        throw new Error('cannot unregister event dispatch listener without _wrapper reference');
      }
    }

    onKeyEvent(extension_id, key, modifiers, callback) {
      DomEventActions.registerKeyEvent({
        extension_id,
        key,
        modifiers,
        callback
      });
    }

    offKeyEvent(extension_id, key, modifiers, callback) {
      DomEventActions.unregisterKeyEvent({
        extension_id,
        key,
        modifiers,
        callback
      });
    }

    onFrameClick(handleIframeClick) {
      if (typeof handleIframeClick !== 'function') {
        throw new Error('handleIframeClick must be a function');
      }

      DomEventActions.registerClickHandler(handleIframeClick);
    }

    offFrameClick() {
      DomEventActions.unregisterClickHandler();
    }

    destroy(extension_id) {
      IframeActions.notifyIframeDestroyed({
        id: extension_id
      });
    }

    defineModule(name, methods) {
      ModuleActions.defineCustomModule(name, methods);
    }

    isModuleDefined(moduleName) {
      return host$1.isModuleDefined(moduleName);
    }

    broadcastEvent(type, targetSpec, event) {
      EventActions.broadcast(type, targetSpec, event);
    }

    getExtensions(filter) {
      return host$1.getExtensions(filter);
    }

    trackDeprecatedMethodUsed(methodUsed, extension) {
      AnalyticsAction.trackDeprecatedMethodUsed(methodUsed, extension);
    }

    trackMacroCombination(parentExtensionId, childExtension) {
      AnalyticsAction.trackMacroCombination(parentExtensionId, childExtension);
    }

    trackAnalyticsEvent(name, values) {
      AnalyticsAction.trackExternalEvent(name, values);
    }

    setJwtClockSkew(skew) {
      jwtActions.setClockSkew(skew);
    }

    isJwtExpired(jwtString, tokenOnly) {
      if (tokenOnly) {
        return jwtUtil.isJwtExpired(jwtString);
      }

      return urlUtils.isJwtExpired(jwtString);
    }

    hasJwt(url) {
      return urlUtils.hasJwt(url);
    }

    getBooleanFeatureFlag(flagName) {
      return getBooleanFeatureFlag(flagName);
    } // set configuration option system wide for all extensions
    // can be either key,value or an object


    setExtensionConfigurationOptions(obj, value) {
      ExtensionConfigurationOptionsStore$1.set(obj, value);
    }

    getExtensionConfigurationOption(val) {
      return ExtensionConfigurationOptionsStore$1.get(val);
    }

    onIframeTimeout(callback) {
      var wrapper = function (data) {
        callback.call({}, {
          extension: this._cleanExtension(data.extension)
        });
      };

      callback._wrapper = wrapper.bind(this);
      EventDispatcher$1.register('after:iframe-bridge-timeout', callback._wrapper);
    }

    offIframeTimeout(callback) {
      if (callback._wrapper) {
        EventDispatcher$1.unregister('after:iframe-bridge-timeout', callback._wrapper);
      } else {
        throw new Error('cannot unregister event dispatch listener without _wrapper reference');
      }
    }

    onIframePerformanceTelemetry(callback) {
      var wrapper = function (data) {
        callback.call({}, {
          metrics: data.metrics,
          extension: this._cleanExtension(data.extension)
        });
      };

      callback._wrapper = wrapper.bind(this);
      EventDispatcher$1.register('after:analytics-iframe-performance', callback._wrapper);
    }

    offIframePerformanceTelemetry(callback) {
      if (callback._wrapper) {
        EventDispatcher$1.unregister('after:analytics-iframe-performance', callback._wrapper);
      } else {
        throw new Error('cannot unregister event dispatch listener without _wrapper reference');
      }
    }

    onIframeVisible(callback) {
      var wrapper = function (extension) {
        callback.call({}, {
          extension: this._cleanExtension(extension)
        });
      };

      callback._wrapper = wrapper.bind(this);
      EventDispatcher$1.register('after:iframe-visible', callback._wrapper);
    }

    offIframeVisible(callback) {
      if (callback._wrapper) {
        EventDispatcher$1.unregister('after:iframe-visible', callback._wrapper);
      } else {
        throw new Error('cannot unregister event dispatch listener without _wrapper reference');
      }
    }

  }

  var HostApi$1 = new HostApi();

  const DLGID_PREFIX = 'ap-dialog-';
  const DIALOG_CLASS = 'ap-aui-dialog2';
  const DLGID_REGEXP = new RegExp("^".concat(DLGID_PREFIX, "[0-9A-Za-z]+$"));
  const DIALOG_SIZES = ['small', 'medium', 'large', 'xlarge', 'fullscreen', 'maximum'];
  const DIALOG_BUTTON_CLASS = 'ap-aui-dialog-button';
  const DIALOG_BUTTON_CUSTOM_CLASS = 'ap-dialog-custom-button';
  const DIALOG_FOOTER_CLASS = 'aui-dialog2-footer';
  const DIALOG_FOOTER_ACTIONS_CLASS = 'aui-dialog2-footer-actions';
  const DIALOG_HEADER_ACTIONS_CLASS = 'header-control-panel';

  function getActiveDialog() {
    const $el = AJS.LayerManager.global.getTopLayer();

    if ($el && DLGID_REGEXP.test($el.attr('id'))) {
      const dialog = AJS.dialog2($el);
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
    const $actionBar = getActionBar($dialog);
    return $actionBar.find('.aui-button').filter(function () {
      return ButtonComponent.getIdentifier(this) === id;
    });
  }

  class Dialog$1 {
    constructor() {}

    _renderHeaderCloseBtn() {
      const $close = $$1('<a />').addClass('aui-dialog2-header-close');
      const $closeBtn = $$1('<span />').addClass('aui-icon aui-icon-small aui-iconfont-close-dialog').text('Close');
      $close.append($closeBtn);
      return $close;
    } //v3 ask DT about this DOM.


    _renderFullScreenHeader($header, options) {
      var $titleContainer = $$1('<div />').addClass('header-title-container aui-item expanded');
      var $title = $$1('<div />').append($$1('<span />').addClass('header-title').text(options.header || ''));
      $titleContainer.append($title);
      $header.append($titleContainer).append(this._renderHeaderActions(options.actions, options.extension));
      return $header;
    }

    _renderHeader(options) {
      const $header = $$1('<header />').addClass('aui-dialog2-header');

      if (options.size === 'fullscreen') {
        return this._renderFullScreenHeader($header, options);
      }

      if (options.header) {
        const $title = $$1('<h2 />').addClass('aui-dialog2-header-main').text(options.header);
        $header.append($title);
      }

      $header.append(this._renderHeaderCloseBtn());
      return $header;
    }

    _renderHeaderActions(actions, extension) {
      const $headerControls = $$1('<div />').addClass('aui-item ' + DIALOG_HEADER_ACTIONS_CLASS);
      actions[0].additionalClasses = ['aui-icon', 'aui-icon-small', 'aui-iconfont-success'];
      actions[1].additionalClasses = ['aui-icon', 'aui-icon-small', 'aui-iconfont-close-dialog'];

      const $actions = this._renderActionButtons(actions, extension);

      $actions.forEach($action => {
        $headerControls.append($action);
      });
      return $headerControls;
    }

    _renderContent($content) {
      const $el = $$1('<div />').addClass('aui-dialog2-content');

      if ($content) {
        $el.append($content);
      }

      return $el;
    }

    _renderFooter(options) {
      const $footer = $$1('<footer />').addClass(DIALOG_FOOTER_CLASS);

      if (options.size !== 'fullscreen') {
        const $actions = this._renderFooterActions(options.actions, options.extension);

        $footer.append($actions);
      }

      if (options.hint) {
        const $hint = $$1('<div />').addClass('aui-dialog2-footer-hint').text(options.hint);
        $footer.append($hint);
      }

      return $footer;
    }

    _renderActionButtons(actions, extension) {
      var actionButtons = [];
      [...actions].forEach(action => {
        actionButtons.push(this._renderDialogButton({
          text: action.text,
          name: action.name,
          type: action.type,
          additionalClasses: action.additionalClasses,
          custom: action.custom || false,
          identifier: action.identifier,
          immutable: action.immutable,
          disabled: action.disabled || false
        }, extension));
      });
      return actionButtons;
    }

    _renderFooterActions(actions, extension) {
      const $actions = $$1('<div />').addClass(DIALOG_FOOTER_ACTIONS_CLASS);

      const $buttons = this._renderActionButtons(actions, extension);

      $buttons.forEach($button => {
        $actions.append($button);
      });
      return $actions;
    }

    _renderDialogButton(options, extension) {
      options.additionalClasses = options.additionalClasses || [];
      options.additionalClasses.push(DIALOG_BUTTON_CLASS);

      if (options.custom) {
        options.additionalClasses.push(DIALOG_BUTTON_CUSTOM_CLASS);
      }

      const $button = ButtonComponent.render(options);
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


    render(options) {
      var originalOptions = Util.extend({}, options);
      var sanitizedOptions = dialogUtilsInstance.sanitizeOptions(options);
      const $dialog = $$1('<section />').attr({
        role: 'dialog',
        id: DLGID_PREFIX + sanitizedOptions.id
      });
      $dialog.attr('data-aui-modal', 'true');
      $dialog.data({
        'aui-remove-on-hide': true,
        'extension': sanitizedOptions.extension
      });
      $dialog.addClass('aui-layer aui-dialog2 ' + DIALOG_CLASS);

      if (DIALOG_SIZES.indexOf(sanitizedOptions.size) >= 0) {
        $dialog.addClass('aui-dialog2-' + sanitizedOptions.size);
      }

      if (sanitizedOptions.size === 'fullscreen' || sanitizedOptions.size === 'maximum') {
        if (sanitizedOptions.chrome) {
          $dialog.addClass('ap-header-controls');
        }

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

      const dialog = AJS.dialog2($dialog);
      dialog._id = sanitizedOptions.id;

      if (sanitizedOptions.size === 'fullscreen') {
        sanitizedOptions.height = sanitizedOptions.width = '100%';
      }

      if (!sanitizedOptions.size || sanitizedOptions.size === 'fullscreen') {
        AJS.layer($dialog).changeSize(sanitizedOptions.width, sanitizedOptions.height);
      }

      if (sanitizedOptions.onHide) {
        dialog.on('hide', sanitizedOptions.onHide);
      }

      dialog.show();
      dialog.$el.data('extension', sanitizedOptions.extension);
      dialog.$el.data('originalOptions', originalOptions);
      return $dialog;
    }

    setIframeDimensions($iframe) {
      IframeComponent.resize('100%', '100%', $iframe);
    }

    getActive() {
      return getActiveDialog();
    }

    buttonIsEnabled(identifier) {
      const dialog = getActiveDialog();

      if (dialog) {
        const $button = getButtonByIdentifier(identifier, dialog.$el);
        return ButtonComponent.isEnabled($button);
      }
    }

    buttonIsVisible(identifier) {
      const dialog = getActiveDialog();

      if (dialog) {
        const $button = getButtonByIdentifier(identifier, dialog.$el);
        return ButtonComponent.isVisible($button);
      }
    }
    /**
    * takes either a target spec or a filter function
    * returns all matching dialogs
    */


    getByExtension(extension) {
      var filterFunction;

      if (typeof extension === 'function') {
        filterFunction = extension;
      } else {
        var keys = Object.getOwnPropertyNames(extension);

        filterFunction = function (dialog) {
          var dialogData = $$1(dialog).data('extension');
          return keys.every(key => {
            return dialogData[key] === extension[key];
          });
        };
      }

      return $$1('.' + DIALOG_CLASS).toArray().filter(filterFunction).map($el => {
        return AJS.dialog2($el);
      });
    } // add user defined button to an existing dialog


    addButton(extension, options) {
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

  }

  const DialogComponent = new Dialog$1();
  EventDispatcher$1.register('iframe-bridge-established', data => {
    if (data.extension.options.isDialog) {
      let callback;
      const frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      const dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');

      if (dialogProvider) {
        callback = dialogProvider.close;
        dialogProvider.setButtonDisabled('submit', false);
      } else {
        DialogActions.toggleButton({
          identifier: 'submit',
          enabled: true
        });

        callback = () => {
          DialogActions.close({
            dialog: getActiveDialog(),
            extension: data.extension
          });
        };
      }

      if (!data.extension.options.preventDialogCloseOnEscape) {
        DomEventActions.registerKeyEvent({
          extension_id: data.extension.id,
          key: 27,
          callback
        });
        EventDispatcher$1.registerOnce('dialog-close', d => {
          DomEventActions.unregisterKeyEvent({
            extension_id: data.extension.id,
            key: 27
          });
        });
      }
    }
  });
  EventDispatcher$1.register('dialog-close-active', data => {
    var activeDialog = getActiveDialog();

    if (activeDialog) {
      DialogActions.close({
        customData: data.customData,
        dialog: activeDialog,
        extension: data.extension
      });
    }
  });
  EventDispatcher$1.register('dialog-close', data => {
    if (data.dialog) {
      data.dialog.hide();
    }
  });
  EventDispatcher$1.register('dialog-button-toggle', data => {
    const dialog = getActiveDialog();

    if (dialog) {
      const $button = getButtonByIdentifier(data.identifier, dialog.$el);
      ButtonActions.toggle($button, !data.enabled);
    }
  });
  EventDispatcher$1.register('dialog-button-toggle-visibility', data => {
    const dialog = getActiveDialog();

    if (dialog) {
      const $button = getButtonByIdentifier(data.identifier, dialog.$el);
      ButtonActions.toggleVisibility($button, data.hidden);
    }
  });
  EventDispatcher$1.register('button-clicked', data => {
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

  if ($$1.fn) {
    EventDispatcher$1.register('iframe-create', data => {
      if (data.extension.options && data.extension.options.isDialog) {
        DialogComponent.setIframeDimensions(data.extension.$el);
      }
    });
    EventDispatcher$1.register('dialog-button-add', data => {
      DialogComponent.addButton(data.extension, data.button);
    });
    EventDispatcher$1.register('host-window-resize', Util.debounce(() => {
      $$1('.' + DIALOG_CLASS).each((i, dialog) => {
        var $dialog = $$1(dialog);
        var sanitizedOptions = dialogUtilsInstance.sanitizeOptions($dialog.data('originalOptions'));
        dialog.style.width = sanitizedOptions.width;
        dialog.style.height = sanitizedOptions.height;
      });
    }, 100));
  }

  DomEventActions.registerWindowKeyEvent({
    keyCode: 27,
    callback: () => {
      DialogActions.closeActive({
        customData: {},
        extension: null
      });
    }
  });

  class DialogExtension {
    render(extension, dialogOptions) {
      extension.options = extension.options || {};
      dialogOptions = dialogOptions || {};
      extension.options.isDialog = true;
      extension.options.dialogId = dialogOptions.id;
      extension.options.preventDialogCloseOnEscape = dialogOptions.closeOnEscape === false;
      extension.options.hostFrameOffset = dialogOptions.hostFrameOffset;
      extension.options.hideIframeUntilLoad = true;
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
        buttons: dialogOptions.buttons,
        onHide: dialogOptions.onHide
      });
      return $dialog;
    }

    getActiveDialog() {
      return DialogComponent.getActive();
    }

    buttonIsEnabled(identifier) {
      return DialogComponent.buttonIsEnabled(identifier);
    }

    buttonIsVisible(identifier) {
      return DialogComponent.buttonIsVisible(identifier);
    }

    getByExtension(extension) {
      if (typeof extension === 'string') {
        extension = {
          id: extension
        };
      }

      return DialogComponent.getByExtension(extension);
    }

  }

  var DialogExtensionComponent = new DialogExtension();
  EventDispatcher$1.register('dialog-extension-open', function (data) {
    const dialogExtension = data.extension;
    let dialogOptions = dialogUtilsInstance.sanitizeOptions(data.options);
    const frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
    const dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');

    if (dialogProvider) {
      // this function should move.
      const getOnClickFunction = action => {
        const key = dialogExtension.key;
        const addon_key = dialogExtension.addon_key;
        const eventData = {
          button: {
            identifier: action.identifier,
            name: action.identifier,
            text: action.text
          }
        };

        if (['submit', 'cancel'].indexOf(action.identifier) >= 0) {
          EventActions.broadcast("dialog.".concat(action.identifier), {
            addon_key,
            key
          }, eventData);
        }

        EventActions.broadcast('dialog.button.click', {
          addon_key,
          key
        }, eventData);
      };

      dialogExtension.options.preventDialogCloseOnEscape = dialogOptions.closeOnEscape === false;
      dialogOptions.actions.map(action => action.onClick = getOnClickFunction.bind(null, action));
      dialogProvider.create(dialogOptions, dialogExtension);
    } else {
      DialogExtensionComponent.render(data.extension, data.options);
    }
  });

  const _dialogs = {};
  EventDispatcher$1.register('dialog-close', function (data) {
    const dialog = data.dialog;

    if (dialog && data.extension) {
      EventActions.broadcast('dialog.close', {
        addon_key: data.extension.addon_key
      }, data.customData);
    }
  });
  EventDispatcher$1.register('dialog-button-click', data => {
    var eventData = {
      button: {
        name: ButtonComponent.getName(data.$el),
        identifier: ButtonComponent.getIdentifier(data.$el),
        text: ButtonComponent.getText(data.$el)
      }
    };
    var eventName = 'dialog.button.click';
    var buttonEventFilter = {
      addon_key: data.extension.addon_key,
      key: data.extension.key
    };
    buttonEventFilter.id = data.extension.id; // Old buttons, (submit and cancel) use old events

    if (!data.$el.hasClass('ap-dialog-custom-button')) {
      EventActions.broadcast("dialog.".concat(eventData.button.name), buttonEventFilter, eventData);
    }

    EventActions.broadcast(eventName, buttonEventFilter, eventData);
  });
  /**
   * @class Dialog~Dialog
   * @description A dialog object that is returned when a dialog is created using the [dialog module](module-Dialog.html).
   */

  class Dialog {
    constructor(options, callback) {
      callback = Util.last(arguments);
      const _id = callback._id;
      const extension = callback._context.extension;
      let dialogExtension = {
        addon_key: extension.addon_key,
        key: options.key,
        options: Util.pick(extension.options, ['customData', 'productContext'])
      }; // ACJS-185: the following is a really bad idea but we need it
      // for compat until AP.dialog.customData has been deprecated

      dialogExtension.options.customData = options.customData; // terrible idea! - we need to remove this from p2 ASAP!

      var dialogModuleOptions = dialogUtilsInstance.moduleOptionsFromGlobal(dialogExtension.addon_key, dialogExtension.key); // There is a hostFrameOffset configuration available
      // for modals (window._AP.dialogOptions) and inline modals (window._AP.inlineDialogOptions)
      // which is taken into account during the iframe insertion (inside the dialog).
      // The change below injects hostFrameOffset value from the global module options (window._AP.dialogModules)
      // which is required for establishing a contact with a correct host (solves spa iframe problem).

      if (typeof (dialogModuleOptions || {}).hostFrameOffset === 'number') {
        dialogExtension.options.hostFrameOffset = dialogModuleOptions.hostFrameOffset;
      }

      options = Util.extend({}, dialogModuleOptions || {}, options);
      options.id = _id;
      dialogUtilsInstance.trackMultipleDialogOpening(dialogExtension, options);
      DialogExtensionActions.open(dialogExtension, options);
      this.customData = options.customData;
      _dialogs[_id] = this;
    }
    /**
     * Registers a callback for a dialog event.
     * @method on
     * @memberOf Dialog~Dialog
     * @param {String} event The dialog event to listen for. Valid options are "close".
     * @param {Function} callback The function to be invoked.
     * @noDemo
     * @example
     * AP.dialog.create({
     *   key: 'my-module-key'
     * }).on("close", function() {
     *   console.log("Dialog was closed");
     * });
     */


  }
  /**
   * @class Dialog~DialogButton
   * @description A dialog button that can be controlled with JavaScript
   */


  class Button {
    constructor(identifier, callback) {
      callback = Util.last(arguments);
      const frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      const dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');

      if (dialogProvider) {
        dialogUtilsInstance.assertActiveDialogOrThrow(dialogProvider, callback._context.extension.addon_key);
        this.name = identifier;
        this.identifier = identifier;
      } else {
        if (!DialogExtensionComponent.getActiveDialog()) {
          throw new Error('Failed to find an active dialog.');
        }

        this.name = identifier;
        this.identifier = identifier;
        this.enabled = DialogExtensionComponent.buttonIsEnabled(identifier);
        this.hidden = !DialogExtensionComponent.buttonIsVisible(identifier);
      }
    }
    /**
     * Sets the button state to enabled
     * @method enable
     * @memberOf Dialog~DialogButton
     * @noDemo
     * @example
     * AP.dialog.getButton('submit').enable();
     */


    enable() {
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
     * AP.dialog.getButton('submit').disable();
     */


    disable() {
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
     * AP.dialog.getButton('submit').isEnabled(function(enabled){
     *   if(enabled){
     *     //button is enabled
     *   }
     * });
     */


    isEnabled(callback) {
      callback = Util.last(arguments);
      const frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      const dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');

      if (dialogProvider) {
        callback(!dialogProvider.isButtonDisabled(this.identifier));
      } else {
        callback(this.enabled);
      }
    }
    /**
     * Toggle the button state between enabled and disabled.
     * @method toggle
     * @memberOf Dialog~DialogButton
     * @noDemo
     * @example
     * AP.dialog.getButton('submit').toggle();
     */


    toggle() {
      const frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      const dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');

      if (dialogProvider) {
        dialogProvider.toggleButton(this.identifier);
      } else {
        this.setState({
          enabled: !this.enabled
        });
      }
    }

    setState(state) {
      const frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      const dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');

      if (dialogProvider) {
        dialogProvider.setButtonDisabled(this.identifier, !state.enabled);
      } else {
        this.enabled = state.enabled;
        DialogActions.toggleButton({
          identifier: this.identifier,
          enabled: this.enabled
        });
      }
    }
    /**
     * Trigger a callback bound to a button.
     * @method trigger
     * @memberOf Dialog~DialogButton
     * @noDemo
     * @example
     * AP.dialog.getButton('submit').bind(function(){
     *   alert('clicked!');
     * });
     * AP.dialog.getButton('submit').trigger();
     */


    trigger(callback) {
      callback = Util.last(arguments);

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
     * AP.dialog.getButton('submit').isHidden(function(hidden){
     *   if(hidden){
     *     //button is hidden
     *   }
     * });
     */


    isHidden(callback) {
      callback = Util.last(arguments);
      const frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      const dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');

      if (dialogProvider) {
        callback(dialogProvider.isButtonHidden(this.identifier));
      } else {
        callback(this.hidden);
      }
    }
    /**
     * Sets the button state to hidden
     * @method hide
     * @memberOf Dialog~DialogButton
     * @noDemo
     * @example
     * AP.dialog.getButton('submit').hide();
     */


    hide() {
      this.setHidden(true);
    }
    /**
     * Sets the button state to visible
     * @method show
     * @memberOf Dialog~DialogButton
     * @noDemo
     * @example
     * AP.dialog.getButton('submit').show();
     */


    show() {
      this.setHidden(false);
    }

    setHidden(hidden) {
      const frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      const dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');

      if (dialogProvider) {
        dialogProvider.setButtonHidden(this.identifier, hidden);
      } else {
        this.hidden = hidden;
        DialogActions.toggleButtonVisibility({
          identifier: this.identifier,
          hidden: this.hidden
        });
      }
    }

  }

  function getDialogFromContext(context) {
    return _dialogs[context.extension.options.dialogId];
  }

  class CreateButton {
    constructor(options, callback) {
      callback = Util.last(arguments);
      const frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      const dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');

      if (dialogProvider) {
        dialogUtilsInstance.assertActiveDialogOrThrow(dialogProvider, callback._context.extension.addon_key);
        dialogProvider.createButton({
          identifier: options.identifier,
          text: options.text,
          hidden: false,
          disabled: options.disabled || false,
          onClick: () => {
            EventActions.broadcast('dialog.button.click', {
              addon_key: callback._context.extension.addon_key,
              key: callback._context.extension.key
            }, {
              button: {
                identifier: options.identifier,
                text: options.text
              }
            });
          }
        });
      } else {
        DialogExtensionActions.addUserButton({
          identifier: options.identifier,
          text: options.text
        }, callback._context.extension);
      }
    }

  }
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
   * <img src="/cloud/connect/images/connectdialogchromelessexample.jpeg" width="100%" />
   *
   * In order to maintain a consistent look and feel between the host application and the add-on, we encourage you to style your dialogs to match Atlassian's Design Guidelines for modal dialogs.
   *
   * To do that, you'll need to add the AUI styles to your dialog.
   *
   * For more information, read about the Atlassian User Interface [dialog component](https://docs.atlassian.com/aui/latest/docs/dialog2.html).
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
     * @property {Boolean}       closeOnEscape (optional) if true, pressing ESC inside the dialog will close the dialog (default is true).
     * @property {Array}         buttons     (optional) an array of custom buttons to be added to the dialog if opening a dialog with chrome.
     * @property {String}        hint        (optional) Suggested actions or helpful info that will be added to the dialog if opening with chrome.
     */

    /**
     * Creates a dialog for a common dialog, page or web-item module key.
     * @param {Dialog~DialogOptions} options configuration object of dialog options.
     * @method create
     * @noDemo
     * @example
     * AP.dialog.create({
     *   key: 'my-module-key',
     *   width: '500px',
     *   height: '200px',
     *   chrome: true,
     *   buttons: [
     *     {
     *       text: 'my button',
     *       identifier: 'my_unique_identifier'
     *     }
     *   ]
     * }).on("close", callbackFunc);
     *
     * @return {Dialog~Dialog} Dialog object allowing for callback registrations
     */
    create: {
      constructor: Dialog
    },

    /**
     * Closes the currently open dialog. Optionally pass data to listeners of the `dialog.close` event.
     * This will only close a dialog that has been opened by your add-on.
     * You can register for close events using the `dialog.close` event and the [events module](../events/).
     * @param {Object} data An object to be emitted on dialog close.
     * @noDemo
     * @example
     * AP.dialog.close({foo: 'bar'});
     */
    close: function (data, callback) {
      callback = Util.last(arguments);
      const frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      const dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');

      if (dialogProvider) {
        dialogUtilsInstance.assertActiveDialogOrThrow(dialogProvider, callback._context.extension.addon_key);
        EventActions.broadcast('dialog.close', {
          addon_key: callback._context.extension.addon_key
        }, data);
        dialogProvider.close();
      } else {
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
      }
    },

    /**
     * Passes the custom data Object to the specified callback function.
     * @noDemo
     * @name getCustomData
     * @method
     * @param {Function} callback - Callback method to be executed with the custom data.
     * @example
     * AP.dialog.getCustomData(function (customData) {
     *   console.log(customData);
     * });
     *
     */
    getCustomData: function (callback) {
      callback = Util.last(arguments);
      const dialog = getDialogFromContext(callback._context);

      if (dialog) {
        callback(dialog.customData);
      } else {
        callback(undefined);
      }
    },

    /**
    * Stop the dialog from closing when the submit button is clicked
    * @method disableCloseOnSubmit
    * @noDemo
    * @example
    * AP.dialog.disableCloseOnSubmit();
    * AP.events.on('dialog.button.click', function(data){
    *   if(data.button.name === 'submit') {
    *     console.log('submit button pressed');
    *   }
    * }
    */

    /**
     * Returns the button that was requested (either cancel or submit). If the requested button does not exist, an empty Object will be returned instead.
     * @method getButton
     * @returns {Dialog~DialogButton}
     * @noDemo
     * @example
     * AP.dialog.getButton('submit');
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
     * AP.dialog.createButton({
     *   text: 'button text',
     *   identifier: 'button.1'
     * }).bind(function mycallback(){});
     */
    createButton: {
      constructor: CreateButton
    }
  };

  EventDispatcher$1.register('iframe-resize', function (data) {
    IframeComponent.resize(data.width, data.height, data.$el);
  });
  EventDispatcher$1.register('iframe-size-to-parent', function (data) {
    var height;
    var $el = Util.getIframeByExtensionId(data.extensionId);
    height = $$1(window).height() - $el.offset().top - 1; //1px comes from margin given by full-size-general-page

    EventDispatcher$1.dispatch('iframe-resize', {
      width: '100%',
      height: height + 'px',
      $el
    });
  });
  EventDispatcher$1.register('hide-footer', function (hideFooter) {
    if (hideFooter) {
      $$1('#footer').css({
        display: 'none'
      });
    }
  });
  window.addEventListener('resize', function (e) {
    EventDispatcher$1.dispatch('host-window-resize', e);
  }, true);
  var EnvActions = {
    iframeResize: function (width, height, context) {
      var $el;

      if (context.extension_id) {
        $el = Util.getIframeByExtensionId(context.extension_id);
      } else {
        $el = context;
      }

      EventDispatcher$1.dispatch('iframe-resize', {
        width,
        height,
        $el,
        extension: context.extension
      });
    },
    sizeToParent: function (extensionId, hideFooter) {
      EventDispatcher$1.dispatch('iframe-size-to-parent', {
        hideFooter: hideFooter,
        extensionId: extensionId
      });
    },
    hideFooter: function (hideFooter) {
      EventDispatcher$1.dispatch('hide-footer', hideFooter);
    }
  };

  var debounce = Util.debounce;
  var resizeFuncHolder = {}; // ignore resize events for iframes that use sizeToParent

  var ignoreResizeForExtension = [];
  var sizeToParentExtension = {};
  /**
   * Enables apps to resize their iframes.
   * @exports iframe
   */

  var env = {
    /**
     * Get the location of the current page of the host product.
     *
     * @param {Function} callback function (location) {...} The callback to pass the location to.
     * @example
     * AP.getLocation(function(location){
     *   alert(location);
     * });
     */
    getLocation: function (callback) {
      callback = Util.last(arguments);
      let pageLocationProvider = ModuleProviders$1.getProvider('get-location');

      if (typeof pageLocationProvider === 'function') {
        callback(pageLocationProvider());
      } else {
        callback(window.location.href);
      }
    },

    /**
     * Resize the iframe to a width and height.
     *
     * Only content within an element with the class `ac-content` is resized automatically.
     * Content without this identifier is sized according to the `body` element, and
     * is *not* dynamically resized. The recommended DOM layout for your app is:
     *
     * ``` html
     * <div class="ac-content">
     *     <p>Hello World</p>
     *     <div id="your-id-here">
     *         <p>App content goes here</p>
     *     </div>
     *
     *     ...this area reserved for the resize sensor divs
     * </div>
     * ```
     *
     * The resize sensor div is added on the iframe's [load event](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event).
     * Removing the `ac-content` element after this, prevents resizing from working correctly.
     *
     * This method cannot be used in dialogs.
     *
     * @method
     * @param {String} width   The desired width in pixels or percentage.
     * @param {String} height  The desired height in pixels or percentage.
     * @example
     * AP.resize('400','400');
     */
    resize: function (width, height, callback) {
      callback = Util.last(arguments);
      let addon = ModuleProviders$1.getProvider('addon');

      if (addon) {
        addon.resize(width, height, callback._context);
      } else {
        var iframeId = callback._context.extension.id;
        var options = callback._context.extension.options;

        if (ignoreResizeForExtension.indexOf(iframeId) !== -1 || options && options.isDialog) {
          return false;
        }

        if (!resizeFuncHolder[iframeId]) {
          resizeFuncHolder[iframeId] = debounce(function (dwidth, dheight, dcallback) {
            EnvActions.iframeResize(dwidth, dheight, dcallback._context);
          }, 50);
        }

        resizeFuncHolder[iframeId](width, height, callback);
      }

      return true;
    },

    /**
     * Resize the iframe so that it takes up the entire page.
     *
     * This method is only available for general page modules.
     *
     * @method
     * @example
     * AP.sizeToParent();
     */
    sizeToParent: debounce(function (hideFooter, callback) {
      callback = Util.last(arguments);
      let addon = ModuleProviders$1.getProvider('addon');

      if (addon) {
        addon.sizeToParent(hideFooter, callback._context);
      } else {
        // sizeToParent is only available for general-pages
        if (callback._context.extension.options.isFullPage) {
          // This adds border between the iframe and the page footer as the connect addon has scrolling content and can't do this
          Util.getIframeByExtensionId(callback._context.extension_id).addClass('full-size-general-page');
          EnvActions.sizeToParent(callback._context.extension_id, hideFooter);
          sizeToParentExtension[callback._context.extension_id] = {
            hideFooter: hideFooter
          };
        } else {
          // This is only here to support integration testing
          // see com.atlassian.plugin.connect.test.pageobjects.RemotePage#isNotFullSize()
          Util.getIframeByExtensionId(callback._context.extension_id).addClass('full-size-general-page-fail');
        }
      }
    }),

    /**
    * Hide the footer.
    *
    * @method
    * @param {boolean} hideFooter Whether the footer should be hidden.
    * @ignore
    */
    hideFooter: function (hideFooter) {
      if (hideFooter) {
        EnvActions.hideFooter(hideFooter);
      }
    }
  };

  const _removeIframeReferenceAfterUnloadAndDestroyed = extensionId => {
    delete resizeFuncHolder[extensionId];
    delete sizeToParentExtension[extensionId];

    if (ignoreResizeForExtension.indexOf(extensionId) !== -1) {
      ignoreResizeForExtension.splice(ignoreResizeForExtension.indexOf(extensionId), 1);
    }
  };

  EventDispatcher$1.register('host-window-resize', data => {
    Object.getOwnPropertyNames(sizeToParentExtension).forEach(extensionId => {
      EnvActions.sizeToParent(extensionId, sizeToParentExtension[extensionId].hideFooter);
    });
  });
  EventDispatcher$1.register('after:iframe-unload', function (data) {
    _removeIframeReferenceAfterUnloadAndDestroyed(data.extension.id);
  });
  EventDispatcher$1.register('after:iframe-destroyed', function (data) {
    if (getBooleanFeatureFlag('com.atlassian.connect.acjs-oc-1869-remove-extension-id-references-after-iframe-destroyed')) {
      _removeIframeReferenceAfterUnloadAndDestroyed(data.extension.extension.id);
    }
  });
  EventDispatcher$1.register('before:iframe-size-to-parent', function (data) {
    if (ignoreResizeForExtension.indexOf(data.extensionId) === -1) {
      ignoreResizeForExtension.push(data.extensionId);
    }
  });

  var InlineDialogActions = {
    hide: function ($el) {
      EventDispatcher$1.dispatch('inline-dialog-hide', {
        $el: $el
      });
    },
    refresh: function ($el) {
      EventDispatcher$1.dispatch('inline-dialog-refresh', {
        $el
      });
    },
    hideTriggered: function (extension_id, $el) {
      EventDispatcher$1.dispatch('inline-dialog-hidden', {
        extension_id,
        $el
      });
    },
    close: function () {
      EventDispatcher$1.dispatch('inline-dialog-close', {});
    },
    created: function (data) {
      EventDispatcher$1.dispatch('inline-dialog-opened', {
        $el: data.$el,
        trigger: data.trigger,
        extension: data.extension
      });
    }
  };

  /**
   * The inline dialog is a wrapper for secondary content/controls to be displayed on user request. Consider this component as displayed in context to the triggering control with the dialog overlaying the page content.
   * An inline dialog should be preferred over a modal dialog when a connection between the action has a clear benefit versus having a lower user focus.
   *
   * Inline dialogs can be shown via a [web item target](../../modules/web-item/#target).
   *
   * For more information, read about the Atlassian User Interface [inline dialog component](https://docs.atlassian.com/aui/latest/docs/inline-dialog.html).
   * @module Inline-dialog
   */
  var inlineDialog = {
    /**
     * Hide the inline dialog that contains the iframe where this method is called from.
     * @memberOf module:Inline-dialog
     * @method hide
     * @noDemo
     * @example
     * AP.inlineDialog.hide();
     */
    hide: function (callback) {
      callback = Util.last(arguments);
      const frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      const inlineDialogProvider = frameworkAdaptor.getProviderByModuleName('inlineDialog');

      if (inlineDialogProvider) {
        inlineDialogProvider.hide(callback._context);
      } else {
        InlineDialogActions.close();
      }
    }
  };

  /**
  * Messages are the primary method for providing system feedback in the product user interface.
  * Messages include notifications of various kinds: alerts, confirmations, notices, warnings, info and errors.
  * For visual examples of each kind please see the [Design guide](https://docs.atlassian.com/aui/latest/docs/messages.html).
  * ### Example ###
  * ```
  * //create a message
  * var message = AP.messages.info('plain text title', 'plain text body');
  * ```
  * @deprecated after August 2017 | Please use the Flag module instead.
  * @name Messages
  * @module
  * @ignore
  */
  const MESSAGE_BAR_ID = 'ac-message-container';
  const MESSAGE_TYPES = ['generic', 'error', 'warning', 'success', 'info', 'hint'];
  const MSGID_PREFIX = 'ap-message-';
  const MSGID_REGEXP = new RegExp("^".concat(MSGID_PREFIX, "[0-9A-fa-f]+$"));
  const _messages = {};

  function validateMessageId(msgId) {
    return MSGID_REGEXP.test(msgId);
  }

  function getMessageBar() {
    let $msgBar = $$1('#' + MESSAGE_BAR_ID);

    if ($msgBar.length < 1) {
      $msgBar = $$1('<div id="' + MESSAGE_BAR_ID + '" />').appendTo('body');
    }

    return $msgBar;
  }

  function filterMessageOptions(options) {
    const copy = {};
    const allowed = ['closeable', 'fadeout', 'delay', 'duration', 'id'];

    if (typeof options === 'object') {
      allowed.forEach(key => {
        if (key in options) {
          copy[key] = options[key];
        }
      });
    }

    return copy;
  }

  var messageCloseListenerCreated = false;

  function showMessage(name, title, body, options) {
    if (!messageCloseListenerCreated) {
      createMessageCloseListener();
      messageCloseListenerCreated = true;
    }

    const $msgBar = getMessageBar();
    options = filterMessageOptions(options);
    $$1.extend(options, {
      title: title,
      body: AJS.escapeHtml(body)
    });

    if (MESSAGE_TYPES.indexOf(name) < 0) {
      throw 'Invalid message type. Must be: ' + MESSAGE_TYPES.join(', ');
    }

    if (validateMessageId(options.id)) {
      AJS.messages[name]($msgBar, options); // Calculate the left offset based on the content width.
      // This ensures the message always stays in the centre of the window.

      $msgBar.css('margin-left', '-' + $msgBar.innerWidth() / 2 + 'px');
    }
  }

  function deprecatedShowMessage(name, title, body, options, callback) {
    const methodUsed = "AP.messages.".concat(name);
    console.warn("DEPRECATED API - AP.messages.".concat(name, " has been deprecated since ACJS 5.0 and will be removed in a future release. Use AP.flag.create instead."));
    AnalyticsAction.trackDeprecatedMethodUsed(methodUsed, callback._context.extension);
    const frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
    const messageProvider = frameworkAdaptor.getProviderByModuleName('messages');

    if (messageProvider) {
      const messageType = name;
      let createMessage = messageProvider[messageType];

      if (!createMessage) {
        messageProvider[messageType] = messageProvider.generic;
      }

      createMessage(title, body, options);
    } else {
      showMessage(name, title, body, options);
    }
  }

  function createMessageCloseListener() {
    $$1(document).on('aui-message-close', function (e, $msg) {
      const _id = $msg.attr('id').replace(MSGID_PREFIX, '');

      if (_messages[_id]) {
        if ($$1.isFunction(_messages[_id].onCloseTrigger)) {
          _messages[_id].onCloseTrigger();
        }

        _messages[_id]._destroy();
      }
    });
  }

  function messageModule(messageType) {
    return {
      constructor: function (title, body, options, callback) {
        callback = Util.last(arguments);
        const _id = callback._id;

        if (typeof title !== 'string') {
          title = '';
        }

        if (typeof body !== 'string') {
          body = '';
        }

        if (typeof options !== 'object') {
          options = {};
        }

        options.id = MSGID_PREFIX + _id;
        deprecatedShowMessage(messageType, title, body, options, callback);
        _messages[_id] = this;
      }
    };
  }

  var messages = {
    /**
    * Close a message
    * @deprecated after August 2017 | Please use the Flag module instead.
    * @name clear
    * @method
    * @memberof module:Messages#
    * @param    {String}    id  The id that was returned when the message was created.
    * @example
    * //create a message
    * var message = AP.messages.info('title', 'body');
    * setTimeout(function(){
    *   AP.messages.clear(message);
    * }, 2000);
    */
    clear: function (msg) {
      const id = MSGID_PREFIX + msg._id;

      if (validateMessageId(id)) {
        const frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
        const messageProvider = frameworkAdaptor.getProviderByModuleName('messages');

        if (messageProvider) {
          messageProvider.clear(id);
        } else {
          $$1('#' + id).closeMessage();
        }
      }
    },

    /**
    * Trigger an event when a message is closed
    * @deprecated after August 2017 | Please use the Flag module instead.
    * @name onClose
    * @method
    * @memberof module:Messages#
    * @param    {String}    id  The id that was returned when the message was created.
    * @param    {Function}  callback  The function that is run when the event is triggered
    * @example
    * //create a message
    * var message = AP.messages.info('title', 'body');
    * AP.messages.onClose(message, function() {
    *   console.log(message, ' has been closed!');
    * });
    */
    onClose: function (msg, callback) {
      callback = Util.last(arguments);
      const id = msg._id;
      const frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      const messageProvider = frameworkAdaptor.getProviderByModuleName('messages');

      if (messageProvider) {
        const fullId = MSGID_PREFIX + msg._id;
        messageProvider.onClose(fullId, callback);
      } else {
        if (_messages[id]) {
          _messages[id].onCloseTrigger = callback;
        }
      }
    },

    /**
    * Show a generic message
    * @deprecated after August 2017 | Please use the Flag module instead.
    * @name generic
    * @method
    * @memberof module:Messages#
    * @param    {String}            title       Sets the title text of the message.
    * @param    {String}            body        The main content of the message.
    * @param    {Object}            options             Message Options
    * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
    * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
    * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
    * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
    * @returns  {String}    The id to be used when clearing the message
    * @example
    * //create a message
    * var message = AP.messages.generic('title', 'generic message example');
    */
    generic: messageModule('generic'),

    /**
    * Show an error message
    * @deprecated after August 2017 | Please use the Flag module instead.
    * @name error
    * @method
    * @memberof module:Messages#
    * @param    {String}            title       Sets the title text of the message.
    * @param    {String}            body        The main content of the message.
    * @param    {Object}            options             Message Options
    * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
    * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
    * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
    * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
    * @returns  {String}    The id to be used when clearing the message
    * @example
    * //create a message
    * var message = AP.messages.error('title', 'error message example');
    */
    error: messageModule('error'),

    /**
    * Show a warning message
    * @deprecated after August 2017 | Please use the Flag module instead.
    * @name warning
    * @method
    * @memberof module:Messages#
    * @param    {String}            title       Sets the title text of the message.
    * @param    {String}            body        The main content of the message.
    * @param    {Object}            options             Message Options
    * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
    * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
    * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
    * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
    * @returns  {String}    The id to be used when clearing the message
    * @example
    * //create a message
    * var message = AP.messages.warning('title', 'warning message example');
    */
    warning: messageModule('warning'),

    /**
    * Show a success message
    * @deprecated after August 2017 | Please use the Flag module instead.
    * @name success
    * @method
    * @memberof module:Messages#
    * @param    {String}            title       Sets the title text of the message.
    * @param    {String}            body        The main content of the message.
    * @param    {Object}            options             Message Options
    * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
    * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
    * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
    * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
    * @returns  {String}    The id to be used when clearing the message
    * @example
    * //create a message
    * var message = AP.messages.success('title', 'success message example');
    */
    success: messageModule('success'),

    /**
    * Show an info message
    * @deprecated after August 2017 | Please use the Flag module instead.
    * @name info
    * @method
    * @memberof module:Messages#
    * @param    {String}            title       Sets the title text of the message.
    * @param    {String}            body        The main content of the message.
    * @param    {Object}            options             Message Options
    * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
    * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
    * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
    * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
    * @returns  {String}    The id to be used when clearing the message
    * @example
    * //create a message
    * var message = AP.messages.info('title', 'info message example');
    */
    info: messageModule('info'),

    /**
    * Show a hint message
    * @deprecated after August 2017 | Please use the Flag module instead.
    * @name hint
    * @method
    * @memberof module:Messages#
    * @param    {String}            title               Sets the title text of the message.
    * @param    {String}            body                The main content of the message.
    * @param    {Object}            options             Message Options
    * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
    * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
    * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
    * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
    * @returns  {String}    The id to be used when clearing the message
    * @example
    * //create a message
    * var message = AP.messages.hint('title', 'hint message example');
    */
    hint: messageModule('hint')
  };

  var FlagActions = {
    // called on action click
    actionInvoked: function (actionId, flagId) {
      EventDispatcher$1.dispatch('flag-action-invoked', {
        id: flagId,
        actionId: actionId
      });
    },
    open: function (flagId) {
      EventDispatcher$1.dispatch('flag-open', {
        id: flagId
      });
    },
    //called to close a flag
    close: function (flagId) {
      EventDispatcher$1.dispatch('flag-close', {
        id: flagId
      });
    },
    //called by AUI when closed
    closed: function (flagId) {
      EventDispatcher$1.dispatch('flag-closed', {
        id: flagId
      });
    }
  };

  const FLAGID_PREFIX = 'ap-flag-';
  const FLAG_CLASS = 'ac-aui-flag';
  const FLAG_ACTION_CLASS = 'ac-flag-actions';

  class Flag$1 {
    cleanKey(dirtyKey) {
      var cleanFlagKeyRegExp = new RegExp('^' + FLAGID_PREFIX + '(.+)$');
      var matches = dirtyKey.match(cleanFlagKeyRegExp);

      if (matches && matches[1]) {
        return matches[1];
      }

      return null;
    }

    _toHtmlString(str) {
      if ($$1.type(str) === 'string') {
        return str;
      } else if ($$1.type(str) === 'object' && str instanceof $$1) {
        return str.html();
      }
    }

    _renderBody(body) {
      var body = this._toHtmlString(body);

      var $body = $$1('<div />').html(body);
      $$1('<p />').addClass(FLAG_ACTION_CLASS).appendTo($body);
      return $body.html();
    }

    _renderActions($flag, flagId, actions) {
      var $actionContainer = $flag.find('.' + FLAG_ACTION_CLASS);
      actions = actions || {};
      var $action;
      Object.getOwnPropertyNames(actions).forEach(key => {
        $action = $$1('<a />').attr('href', '#').data({
          'key': key,
          'flag_id': flagId
        }).text(actions[key]);
        $actionContainer.append($action);
      }, this);
      return $flag;
    }

    render(options) {
      bindFlagDomEvents();

      var _id = FLAGID_PREFIX + options.id;

      var auiFlag = AJS.flag({
        type: options.type,
        title: options.title,
        body: this._renderBody(options.body),
        close: options.close
      });
      auiFlag.setAttribute('id', _id);
      var $auiFlag = $$1(auiFlag);

      this._renderActions($auiFlag, options.id, options.actions);

      $auiFlag.addClass(FLAG_CLASS);
      $auiFlag.close = auiFlag.close;
      return $auiFlag;
    }

    close(id) {
      var f = document.getElementById(id);
      f.close();
    }

  }

  var FlagComponent = new Flag$1();
  var flagDomEventsBound = false;

  function bindFlagDomEvents() {
    if (flagDomEventsBound) {
      return;
    }

    $$1(document).on('aui-flag-close', e => {
      const _id = e.target.id;
      var cleanFlagId = FlagComponent.cleanKey(_id);
      FlagActions.closed(cleanFlagId);
    });
    $$1(document).on('click', '.' + FLAG_ACTION_CLASS, e => {
      var $target = $$1(e.target);
      var actionKey = $target.data('key');
      var flagId = $target.data('flag_id');
      FlagActions.actionInvoked(actionKey, flagId);
    });
    flagDomEventsBound = true;
  }

  EventDispatcher$1.register('flag-close', data => {
    FlagComponent.close(data.id);
  });

  /**
  * Flags are the primary method for providing system feedback in the product user interface. Messages include notifications of various kinds: alerts, confirmations, notices, warnings, info and errors.
  * @module Flag
  */
  const _flags = {};
  /**
  * @class Flag~Flag
  * @description A flag object created by the [AP.flag]{@link module:Flag} module.
  * @example
  * // complete flag API example:
  * var outFlagId;
  * var flag = AP.flag.create({
  *   title: 'Successfully created a flag.',
  *   body: 'This is a flag.',
  *   type: 'info',
  *   actions: {
  *     'actionOne': 'action name'
  *   }
  * }, function(identifier) {
  * // Each flag will have a unique id. Save it for later.
  *   ourFlagId = identifier;
  * });
  *
  * // listen to flag events
  * AP.events.on('flag.close', function(data) {
  * // a flag was closed. data.flagIdentifier should match ourFlagId
  *   console.log('flag id: ', data.flagIdentifier);
  * });
  * AP.events.on('flag.action', function(data) {
  * // a flag action was clicked. data.actionIdentifier will be 'actionOne'
  * // data.flagIdentifier will equal ourFlagId
  *   console.log('flag id: ', data.flagIdentifier, 'flag action id', data.actionIdentifier);
  * });
  */

  class Flag {
    constructor(options, callback) {
      callback = Util.last(arguments);

      if (typeof options !== 'object') {
        return;
      }

      const flagId = callback._id;
      const frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      const flagProvider = frameworkAdaptor.getProviderByModuleName('flag');

      if (flagProvider) {
        let actions = [];

        if (typeof options.actions === 'object') {
          actions = Object.getOwnPropertyNames(options.actions).map(key => {
            return {
              actionKey: key,
              actionText: options.actions[key],
              executeAction: FlagActions.actionInvoked.bind(null, key, flagId)
            };
          });
        }

        let type = options.type || 'info';
        let flagOptions = {
          id: flagId,
          title: options.title,
          body: options.body,
          actions: actions,
          onClose: FlagActions.closed,
          close: options.close,
          type: type.toLowerCase()
        };
        this.flag = flagProvider.create(flagOptions);
        let addonProvider = ModuleProviders$1.getProvider('addon');

        if (addonProvider && addonProvider.registerUnmountCallback) {
          addonProvider.registerUnmountCallback(this.close.bind(this), callback._context);
        }
      } else {
        this.flag = FlagComponent.render({
          type: options.type,
          title: options.title,
          body: AJS.escapeHtml(options.body),
          actions: options.actions,
          close: options.close,
          id: flagId
        });
        FlagActions.open(this.flag.attr('id'));
      }

      this.onTriggers = {};
      this.extension = callback._context.extension;
      _flags[callback._id] = this;
      callback.call(null, callback._id);
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


    close() {
      this.flag.close();
    }

  }

  function invokeTrigger(id, eventName, data) {
    if (_flags[id]) {
      let extension = _flags[id].extension;
      data = data || {};
      data.flagIdentifier = id;
      EventActions.broadcast(eventName, {
        extension_id: extension.extension_id
      }, data);
    }
  }

  EventDispatcher$1.register('flag-closed', data => {
    invokeTrigger(data.id, 'flag.close');

    if (_flags[data.id]) {
      delete _flags[data.id];
    }
  });
  EventDispatcher$1.register('flag-action-invoked', data => {
    invokeTrigger(data.id, 'flag.action', {
      actionIdentifier: data.actionId
    });
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
    * @param {String} options.close     The closing behaviour that this flag has. Valid options are "manual", and "auto".
    * @param {Object} options.actions   Map of {actionIdentifier: 'Action link text'} to add to the flag. The actionIdentifier will be passed to a 'flag.action' event if the link is clicked.
    * @returns {Flag~Flag}
    * @example
    * // Display a nice green flag using the Flags JavaScript API.
    * var flag = AP.flag.create({
    *   title: 'Successfully created a flag.',
    *   body: 'This is a flag.',
    *   type: 'success',
    *   actions: {
    *     'actionkey': 'Click me'
    *   }
    * });
    */
    create: {
      constructor: Flag,
      close: Flag.prototype.close
    }
  };

  var analytics = {
    trackDeprecatedMethodUsed: function (methodUsed, callback) {
      callback = Util.last(arguments);
      AnalyticsAction.trackDeprecatedMethodUsed(methodUsed, callback._context.extension);
    },
    trackMacroCombination: function trackMacroCombination(parentExtensionId, childExtension) {
      if (parentExtensionId && childExtension) {
        AnalyticsAction.trackMacroCombination(parentExtensionId, childExtension);
      }
    },
    trackIframePerformanceMetrics: function trackIframePerformanceMetrics(metrics, callback) {
      callback = Util.last(arguments);
      AnalyticsAction.trackIframePerformanceMetrics(metrics, callback._context.extension);
    }
  };

  const TRIGGER_PERCENTAGE = 10; //% before scroll events are fired

  let activeGeneralPageAddon;
  let lastScrollEventTriggered; //top or bottom

  EventDispatcher$1.register('iframe-bridge-established', function (data) {
    if (data.extension.options.isFullPage) {
      window.addEventListener('scroll', scrollEventHandler);
      activeGeneralPageAddon = data.extension.id;
    }
  });
  EventDispatcher$1.register('iframe-destroyed', function (extension) {
    removeScrollEvent();
  });
  EventDispatcher$1.register('iframe-unload', function (extension) {
    removeScrollEvent();
  });

  function removeScrollEvent() {
    window.removeEventListener('scroll', scrollEventHandler);
    activeGeneralPageAddon = undefined;
    lastScrollEventTriggered = undefined;
  }

  function scrollEventHandler() {
    var documentHeight = document.documentElement.scrollHeight;
    var windowHeight = window.innerHeight;
    var boundary = documentHeight * (TRIGGER_PERCENTAGE / 100);

    if (window.pageYOffset <= boundary) {
      triggerEvent('nearTop');
    } else if (windowHeight + window.pageYOffset + boundary >= documentHeight) {
      triggerEvent('nearBottom');
    } else {
      lastScrollEventTriggered = undefined;
    }
  }

  function triggerEvent(type) {
    if (lastScrollEventTriggered === type) {
      return; // only once per scroll.
    }

    EventActions.broadcast('scroll.' + type, {
      id: activeGeneralPageAddon
    }, {});
    lastScrollEventTriggered = type;
  }

  var scrollPosition = {
    /**
     * Get's the scroll position relative to the browser viewport
     *
     * @param callback {Function} callback to pass the scroll position
     * @noDemo
     * @example
     * AP.scrollPosition.getPosition(function(obj) { console.log(obj); });
     */
    getPosition: function (callback) {
      callback = Util.last(arguments); // scrollPosition.getPosition is only available for general-pages

      if (callback._context.extension.options.isFullPage) {
        var $el = Util.getIframeByExtensionId(callback._context.extension_id);
        var offset = $el.offset();
        var $window = $$1(window);
        callback({
          scrollY: $window.scrollTop() - offset.top,
          scrollX: $window.scrollLeft() - offset.left,
          width: window.innerWidth,
          height: window.innerHeight
        });
      }
    },
    setVerticalPosition: function (y, callback) {
      callback = Util.last(arguments);

      if (callback._context.extension.options && callback._context.extension.options.isFullPage) {
        var $el = Util.getIframeByExtensionId(callback._context.extension_id);
        var offset = $el.offset();

        if (typeof y === 'number') {
          document.documentElement.scrollTop = offset.top + y;
        }
      }
    }
  };

  var DropdownActions = {
    // called on action click
    itemSelected: function (dropdown_id, item, extension) {
      EventDispatcher$1.dispatch('dropdown-item-selected', {
        id: dropdown_id,
        item,
        extension
      });
    }
  };

  /**
  * DO NOT INCLUDE ME IN THE PUBLIC DOCUMENTATION
  * there is no AUI implementation of this
  */

  function buildListItem(listItem) {
    let finishedListItem = {};

    if (typeof listItem === 'string') {
      finishedListItem.content = listItem;
    } else if (listItem.text && typeof listItem.text === 'string') {
      finishedListItem.content = listItem.text;

      if (typeof listItem.disabled === 'boolean') {
        finishedListItem.disabled = listItem.disabled;
      }

      if (typeof listItem.itemId !== 'undefined') {
        finishedListItem.itemId = listItem.itemId;
      }
    } else {
      throw new Error('Unknown dropdown list item format.');
    }

    return finishedListItem;
  }

  function moduleListToApiList(list) {
    return list.map(item => {
      if (item.list && Array.isArray(item.list)) {
        let returnval = {
          heading: item.heading
        };
        returnval.items = item.list.map(listitem => {
          return buildListItem(listitem);
        });
        return returnval;
      }
    });
  }
  /**
  * @class DropdownItem
  * A single item in a dropdown menu can be a string or an object
  * @param {String} itemId The id of a single dropdown item
  * @param {String} text    The text to display in the dropdown item
  */

  /**
  * @module Dropdown
  * @description Dropdown menu that can go outside the iframe bounds.
  * @example
  * // create a dropdown menu with 1 section and 2 items
  * var mydropdown = {
  *   dropdownId: 'my-dropdown',
  *   list: [{
  *     heading: 'section heading',
  *     list: [
  *       {text: 'one'},
  *       {text: 'two'}
  *     ]
  *   }]
  * };
  *
  * AP.events.on('dropdown-item-selected', (data) =>{
  *   console.log('dropdown item selected', data.dropdownId, data.item);
  * });
  *
  * AP.dropdown.create(mydropdown);
  * // button is an element in our document that triggered the dropdown
  * let rect = document.querySelector('button').getBoundingClientRect();
  * AP.dropdown.showAt('my-dropdown', rect.left, rect.top, rect.width);
  *
  */


  var dropdown = {
    /**
    * @name create
    * @method
    * @description Creates a new dropdown.
    * @param {Object} options             Options of the dropdown.
    * @param {String} options.dropdownId A unique identifier for the dropdown that will be referenced in events.
    * @param {String} options.list        An array containing dropdown items {Dropdown~DropdownItem}
    * @example
    * // create a dropdown menu with 1 section and 2 items
    * var mydropdown = {
    *   dropdownId: 'my-dropdown',
    *   list: [{
    *     heading: 'section heading',
    *     list: [
    *       {text: 'one'},
    *       {text: 'two'}
    *     ]
    *   }]
    * };
    *
    * AP.dropdown.create(mydropdown);
    */
    create(options, callback) {
      callback = Util.last(arguments);

      if (typeof options !== 'object') {
        return;
      }

      const frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      const dropdownProvider = frameworkAdaptor.getProviderByModuleName('dropdown');

      if (dropdownProvider) {
        const dropdownGroups = moduleListToApiList(options.list);
        const dropdownProviderOptions = {
          dropdownId: options.dropdownId,
          dropdownGroups: dropdownGroups,
          dropdownItemNotifier: data => {
            DropdownActions.itemSelected(data.dropdownId, data.item, callback._context.extension);
          }
        };
        dropdownProvider.create(dropdownProviderOptions, callback._context);
        return dropdownProviderOptions;
      }
    },

    /**
    * @name showAt
    * @method
    * @description Displays a created dropdown menu.
    * @param {String} dropdownId   Id used when creating the dropdown
    * @param {String} x             x position from the edge of your iframe to display
    * @param {String} y             y position from the edge of your iframe to display
    * @param {String} width         Optionally enforce a width for the dropdown menu
    * @example
    * // create a dropdown menu with 1 section and 2 items
    * var mydropdown = {
    *   dropdownId: 'my-dropdown',
    *   list: [{
    *     list:['one', 'two']
    *   }]
    * };
    *
    * AP.dropdown.create(mydropdown);
    * // Get the button that activated the dropdown
    * let rect = document.querySelector('button').getBoundingClientRect();
    * AP.dropdown.showAt('my-dropdown', rect.left, rect.top, rect.width);
    */
    showAt(dropdownId, x, y, width) {
      let callback = Util.last(arguments);
      let rect = {
        left: 0,
        top: 0
      };
      let iframe = document.getElementById(callback._context.extension_id);

      if (iframe) {
        rect = iframe.getBoundingClientRect();
      } else {
        console.error('ACJS: no iframe found for dropdown');
      }

      const frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      const dropdownProvider = frameworkAdaptor.getProviderByModuleName('dropdown');

      if (dropdownProvider) {
        const dropdownProviderArgs = {
          dropdownId: dropdownId,
          x: x,
          y: y,
          width: width
        };
        dropdownProvider.showAt(dropdownProviderArgs, {
          iframeDimensions: rect,
          onItemSelection: (dropdownId, item) => {
            DropdownActions.itemSelected(dropdownId, item, callback._context.extension);
          }
        });
      }
    },

    /**
    * @name hide
    * @method
    * @description Hide a dropdown menu
    * @param {String} dropdownId The id of the dropdown to hide
    * @example
    * AP.dropdown.create('my-dropdown');
    * AP.dropdown.hide('my-dropdown');
    */
    hide(id) {
      const frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      const dropdownProvider = frameworkAdaptor.getProviderByModuleName('dropdown');

      if (dropdownProvider) {
        dropdownProvider.hide(id);
      }
    },

    /**
    * @name itemDisable
    * @method
    * @description Disable an item in the dropdown menu
    * @param {String} dropdownId The id of the dropdown
    * @param {String} itemId     The dropdown item to disable
    * @example
    * AP.dropdown.create('my-dropdown');
    * AP.dropdown.itemDisable('my-dropdown', 'item-id');
    */
    itemDisable(dropdownId, itemId) {
      const frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      const dropdownProvider = frameworkAdaptor.getProviderByModuleName('dropdown');

      if (dropdownProvider) {
        dropdownProvider.itemDisable(dropdownId, itemId);
      }
    },

    /**
    * @name itemEnable
    * @method
    * @description Hide a dropdown menu
    * @param {String} dropdownId The id of the dropdown
    * @param {String} itemId The id of the dropdown item to enable
    * @example
    * AP.dropdown.create('my-dropdown');
    * AP.dropdown.itemEnable('my-dropdown', 'item-id');
    */
    itemEnable(dropdownId, itemId) {
      const frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      const dropdownProvider = frameworkAdaptor.getProviderByModuleName('dropdown');

      if (dropdownProvider) {
        dropdownProvider.itemEnable(dropdownId, itemId);
      }
    }

  };
  EventDispatcher$1.register('dropdown-item-selected', data => {
    EventActions.broadcast('dropdown-item-selected', {
      addon_key: data.extension.addon_key,
      key: data.extension.key
    }, {
      dropdownId: data.id,
      item: data.item
    });
  }); // friendly unload with connectHost.destroy

  EventDispatcher$1.register('iframe-destroyed', data => {
    const frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
    const dropdownProvider = frameworkAdaptor.getProviderByModuleName('dropdown');

    if (dropdownProvider) {
      dropdownProvider.destroyByExtension(data.extension.extension_id);
    }
  }); // unfriendly unload by removing the iframe from the DOM

  EventDispatcher$1.register('after:iframe-unload', data => {
    const frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
    const dropdownProvider = frameworkAdaptor.getProviderByModuleName('dropdown');

    if (dropdownProvider) {
      dropdownProvider.destroyByExtension(data.extension.extension_id);
    }
  });

  function _defineProperty(obj, key, value) {
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
  }

  var defineProperty = _defineProperty;

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

  var each = util.each,
      document$1 = window.document;

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
      each: function (it) {
        each(this, it);
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
          $optionElement = $("#ac-iframe-options"),
          $scriptElement = $("script[src*='/atlassian-connect/all']"),
          $cdnScriptElement = $("script[src*='/connect-cdn.atl-paas.net/all']");

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

  var ConsumerOptions$1 = new ConsumerOptions();

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
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
      this._version = "5.3.47";
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
      $(util._bind(this, this._autoResizer));
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
      $.bind(window, 'unload', util._bind(this, function () {
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
        $.bind(window, 'keydown', util._bind(this, this._handleKeyDownDomEvent));
        this._isKeyDownBound = true;
      }
    }

    _autoResizer() {
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
        this._eventHandlers = _objectSpread(_objectSpread({}, this._eventHandlers), handlers) || {};

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
        console.warn("DEPRECATED API - ".concat(name, " has been deprecated ").concat(sinceVersion ? "since ACJS ".concat(sinceVersion) : 'in ACJS') + " and will be removed in a future release. ".concat(alternate ? "Use ".concat(alternate, " instead.") : 'No alternative will be provided.'));

        if (combined._analytics) {
          combined._analytics.trackDeprecatedMethodUsed(name);
        }
      }

      return fn(...arguments);
    };
  }

  /**
  * Hosts are the primary method for Connect apps to interact with the page.
  * @module Host
  */
  const TEXT_NODE_TYPE = 3;
  var host = {
    /*
     This function could be used in Connect app for moving focus to Host app.
     As Connect App - iframe app, it can get control. When it's happen - host app events such short-cuts
     stop working. This function could help in this case.
    */
    focus: () => {
      window.document.querySelector('a').focus({
        preventScroll: true
      });
      window.document.querySelector('a').blur();
    },

    /**
     * Gets the selected text on the page.
     * @noDemo
     * @deprecated This feature is no longer supported, for security and privacy reasons.
     * @name getSelectedText
     * @method
     * @param {Function} callback - Callback method to be executed with the selected text.
     * @example
     * AP.host.getSelectedText(function (selection) {
     *   console.log(selection);
     * });
     *
     */
    getSelectedText: deprecate(function (callback) {
      if (getBooleanFeatureFlag('com.atlassian.connect.acjs-vuln-610109-deprecate-getselectedtext')) {
        callback('');
        return;
      }

      let text = '';
      const selection = window.document.getSelection();

      if (selection && selection.anchorNode && selection.anchorNode.nodeType === TEXT_NODE_TYPE) {
        text = selection.toString();
      }

      callback(text);
    }, 'AP.host.getSelectedText()')
  };

  class WebItem {
    constructor() {
      this._webitems = {};

      this._contentResolver = function noop() {};
    }

    setContentResolver(resolver) {
      this._contentResolver = resolver;
    }

    requestContent(extension) {
      if (extension.addon_key && extension.key) {
        return this._contentResolver.call(null, Util.extend({
          classifier: 'json'
        }, extension));
      }
    } // originally i had this written nicely with Object.values but
    // ie11 didn't like it and i couldn't find a nice pollyfill


    getWebItemsBySelector(selector) {
      let returnVal;
      Object.getOwnPropertyNames(this._webitems).some(key => {
        let obj = this._webitems[key];

        if (obj.selector) {
          if (obj.selector.trim() === selector.trim()) {
            returnVal = obj;
            return true;
          }
        }
        return false;
      });
      return returnVal;
    }

    setWebItem(potentialWebItem) {
      return this._webitems[potentialWebItem.name] = {
        name: potentialWebItem.name,
        selector: potentialWebItem.selector,
        triggers: potentialWebItem.triggers
      };
    }

    _removeTriggers(webitem) {
      var onTriggers = WebItemUtils.sanitizeTriggers(webitem.triggers);
      $$1(() => {
        $$1('body').off(onTriggers, webitem.selector, this._webitems[webitem.name]._on);
      });
      delete this._webitems[webitem.name]._on;
    }

    _addTriggers(webitem) {
      var onTriggers = WebItemUtils.sanitizeTriggers(webitem.triggers);

      webitem._on = event => {
        event.preventDefault();
        var $target = $$1(event.target).closest(webitem.selector);
        var convertedOptions = WebItemUtils.getConfigFromTarget($target);
        var extensionUrl = convertedOptions && convertedOptions.url ? convertedOptions.url : undefined;
        var extension = {
          addon_key: WebItemUtils.getExtensionKey($target),
          key: WebItemUtils.getKey($target),
          options: WebItemUtils.getOptionsForWebItem($target),
          url: extensionUrl
        };

        if (extension.addon_key === 'com.addonengine.analytics' && !HostApi$1.isModuleDefined('analytics')) {
          console.log("ACJS-1164 Dropping event ".concat(event.type, " for plugin ").concat(extension.addon_key, " until AP.analytics loads..."));
          return;
        }

        WebItemActions.webitemInvoked(webitem, event, extension);
      };

      $$1(() => {
        $$1('body').on(onTriggers, webitem.selector, webitem._on);
        $$1('head').append("<style type=\"text/css\">".concat(webitem.selector, ".ap-link-webitem {pointer-events: auto;}</style>"));
      });
    }

  }

  var webItemInstance = new WebItem();
  EventDispatcher$1.register('webitem-added', data => {
    webItemInstance._addTriggers(data.webitem);
  });
  EventDispatcher$1.register('content-resolver-register-by-extension', function (data) {
    webItemInstance.setContentResolver(data.callback);
  });
  document.addEventListener('aui-responsive-menu-item-created', e => {
    var oldWebItem = e.detail.originalItem.querySelector('a[class*="ap-"]');

    if (oldWebItem) {
      var newWebItem = e.detail.newItem.querySelector('a');
      let classList = [].slice.call(oldWebItem.classList);
      classList.forEach(cls => {
        if (/^ap-/.test(cls)) {
          newWebItem.classList.add(cls);
        }
      });
    }
  });

  var WebItemActions = {
    addWebItem: potentialWebItem => {
      let webitem;
      let existing = webItemInstance.getWebItemsBySelector(potentialWebItem.selector);

      if (existing) {
        return false;
      } else {
        webitem = webItemInstance.setWebItem(potentialWebItem);
        EventDispatcher$1.dispatch('webitem-added', {
          webitem
        });
      }
    },
    webitemInvoked: (webitem, event, extension) => {
      EventDispatcher$1.dispatch('webitem-invoked:' + webitem.name, {
        webitem,
        event,
        extension
      });
    }
  };

  var InlineDialogWebItemActions = {
    addExtension: function (data) {
      EventDispatcher$1.dispatch('inline-dialog-extension', {
        $el: data.$el,
        extension: data.extension
      });
    }
  };

  class InlineDialog {
    resize(data) {
      var width = Util.stringToDimension(data.width);
      var height = Util.stringToDimension(data.height);
      var $content = data.$el.find('.contents');

      if ($content.length === 1) {
        $content.css({
          width: width,
          height: height
        });
        InlineDialogActions.refresh(data.$el);
      }
    }

    refresh($el) {
      if (Flags.isInlineDialogStickyFixFlagEnabled() && !$el.is(':visible')) {
        return;
      }

      $el[0].popup.reset();
    }

    _getInlineDialog($el) {
      return AJS.InlineDialog($el);
    }

    _renderContainer() {
      return $$1('<div />').addClass('aui-inline-dialog-contents');
    }

    _displayInlineDialog(data) {
      InlineDialogActions.created({
        $el: data.$el,
        trigger: data.trigger,
        extension: data.extension
      });
    }

    hideInlineDialog($el) {
      $el.hide();
    }

    closeInlineDialog() {
      $$1('.aui-inline-dialog').filter(function () {
        return $$1(this).find('.ap-iframe-container').length > 0;
      }).hide();
    }

    render(data) {
      var $inlineDialog = $$1(document.getElementById('inline-dialog-' + data.id));

      if ($inlineDialog.length !== 0) {
        $inlineDialog.remove();
      }

      var $el = AJS.InlineDialog(data.bindTo, //assign unique id to inline Dialog
      data.id, ($placeholder, trigger, showInlineDialog) => {
        $placeholder.append(data.$content);

        this._displayInlineDialog({
          extension: data.extension,
          $el: $placeholder,
          trigger: trigger
        });

        showInlineDialog();
      }, data.inlineDialogOptions);
      return $el;
    }

  }

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

  const ITEM_NAME$1 = 'inline-dialog';
  const SELECTOR$1 = '.ap-inline-dialog';
  const WEBITEM_UID_KEY$1 = 'inline-dialog-target-uid';
  class InlineDialogWebItem {
    constructor() {
      this._inlineDialogWebItemSpec = {
        name: ITEM_NAME$1,
        selector: SELECTOR$1,
        triggers: [Flags.isInlineDialogStickyFixFlagEnabled() ? 'mouseenter' : 'mouseover', 'click']
      };
      this._inlineDialogWebItems = {};
    }

    getWebItem() {
      return this._inlineDialogWebItemSpec;
    }

    _createInlineDialog(data) {
      var $inlineDialog = InlineDialogComponent.render({
        extension: data.extension,
        id: data.id,
        bindTo: data.$target,
        $content: $$1('<div />'),
        inlineDialogOptions: data.extension.options
      });
      return $inlineDialog;
    }

    triggered(data) {
      // don't trigger on hover, when hover is not specified.
      if (data.event.type !== 'click' && !data.extension.options.onHover) {
        return;
      }

      var $target = $$1(data.event.currentTarget);
      var webitemId = $target.data(WEBITEM_UID_KEY$1);

      var $inlineDialog = this._createInlineDialog({
        id: webitemId,
        extension: data.extension,
        $target: $target,
        options: data.extension.options || {}
      });

      $inlineDialog.show();
    }

    opened(data) {
      var $existingFrame = data.$el.find('iframe');
      var isExistingFrame = $existingFrame && $existingFrame.length === 1; // existing iframe is already present and src is still valid (either no jwt or jwt has not expired).

      if (isExistingFrame) {
        const src = $existingFrame.attr('src');
        const srcPresent = src.length > 0;

        if (srcPresent) {
          const srcHasJWT = urlUtils.hasJwt(src);
          const srcHasValidJWT = srcHasJWT && !urlUtils.isJwtExpired(src);

          if (srcHasValidJWT || !srcHasJWT) {
            return false;
          }
        }
      }

      var contentRequest = webItemInstance.requestContent(data.extension);

      if (!contentRequest) {
        console.warn('no content resolver found');
        return false;
      }

      contentRequest.then(function (content) {
        content.options = content.options || {};
        Util.extend(content.options, {
          autoresize: true,
          widthinpx: true
        });
        InlineDialogWebItemActions.addExtension({
          $el: data.$el,
          extension: content
        });
      });
      return true;
    }

    addExtension(data) {
      var addon = create(data.extension);
      data.$el.empty().append(addon);
    }

    createIfNotExists(data) {
      var $target = $$1(data.event.currentTarget);
      var uid = $target.data(WEBITEM_UID_KEY$1);

      if (!uid) {
        uid = WebItemUtils.uniqueId();
        $target.data(WEBITEM_UID_KEY$1, uid);
      }
    }

  }
  let inlineDialogInstance = new InlineDialogWebItem();
  let webitem$1 = inlineDialogInstance.getWebItem();
  EventDispatcher$1.register('before:webitem-invoked:' + webitem$1.name, function (data) {
    inlineDialogInstance.createIfNotExists(data);
  });
  EventDispatcher$1.register('webitem-invoked:' + webitem$1.name, function (data) {
    inlineDialogInstance.triggered(data);
  });
  EventDispatcher$1.register('inline-dialog-opened', function (data) {
    inlineDialogInstance.opened(data);
  });
  EventDispatcher$1.register('inline-dialog-extension', function (data) {
    inlineDialogInstance.addExtension(data);
  });
  WebItemActions.addWebItem(webitem$1);

  const ITEM_NAME = 'dialog';
  const SELECTOR = '.ap-dialog';
  const TRIGGERS = ['click'];
  const WEBITEM_UID_KEY = 'dialog-target-uid';
  const DEFAULT_WEBITEM_OPTIONS = {
    chrome: true
  };

  class DialogWebItem {
    constructor() {
      this._dialogWebItem = {
        name: ITEM_NAME,
        selector: SELECTOR,
        triggers: TRIGGERS
      };
    }

    getWebItem() {
      return this._dialogWebItem;
    }

    _dialogOptions(options) {
      return Util.extend({}, DEFAULT_WEBITEM_OPTIONS, options || {});
    }

    triggered(data) {
      var $target = $$1(data.event.currentTarget);
      var webitemId = $target.data(WEBITEM_UID_KEY);

      var dialogOptions = this._dialogOptions(data.extension.options);

      dialogOptions.id = webitemId;
      DialogExtensionActions.open(data.extension, dialogOptions);
    }

    createIfNotExists(data) {
      var $target = $$1(data.event.currentTarget);
      var uid = $target.data(WEBITEM_UID_KEY);

      if (!uid) {
        uid = WebItemUtils.uniqueId();
        $target.data(WEBITEM_UID_KEY, uid);
      }
    }

  }

  let dialogInstance = new DialogWebItem();
  let webitem = dialogInstance.getWebItem();
  EventDispatcher$1.register('webitem-invoked:' + webitem.name, function (data) {
    dialogInstance.triggered(data);
  });
  EventDispatcher$1.register('before:webitem-invoked:' + webitem.name, dialogInstance.createIfNotExists);
  WebItemActions.addWebItem(webitem);

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
    window._AP.version = '5.3.47';
  }

  host$1.defineModule('messages', messages);
  host$1.defineModule('flag', flag);
  host$1.defineModule('dialog', dialog);
  host$1.defineModule('inlineDialog', inlineDialog);
  host$1.defineModule('env', env);
  host$1.defineModule('events', events);
  host$1.defineModule('_analytics', analytics);
  host$1.defineModule('scrollPosition', scrollPosition);
  host$1.defineModule('dropdown', dropdown);
  host$1.defineModule('host', host);
  EventDispatcher$1.register('module-define-custom', function (data) {
    host$1.defineModule(data.name, data.methods);
  });
  host$1.registerRequestNotifier(function (data) {
    var dispatchEvent = () => {
      if (data.type === 'req') {
        analytics$1.dispatch('bridge.invokemethod', {
          module: data.module,
          fn: data.fn,
          addonKey: data.addon_key,
          moduleKey: data.key
        });
      } else if (data.type === 'sub') {
        analytics$1.dispatch('bridge.register-sub', {
          subAddonKey: data.sub.addon_key,
          subModuleKey: data.sub.key,
          addonKey: data.addon_key,
          moduleKey: data.key,
          blocked: data.blocked
        });
      }
    };

    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(dispatchEvent, {
        timeout: 1000
      });
    } else {
      dispatchEvent();
    }
  });
  host$1.setFeatureFlagGetter(getBooleanFeatureFlag);

  return HostApi$1;

}));
