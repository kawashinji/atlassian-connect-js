/*! atlassian-connect-js - v0.0.1 - 2014-07-07 */

(function (window) {

  var AP = window._AP ? _AP : (window.RA = window.AP = {}); // RA is deprecated

  var modules = {};

  // define(name, objOrFn)
  // define(name, deps, fn(dep1, dep2, ...))
  AP.define = function (name, deps, exports) {
    var mod = getOrCreate(name),
        factory;
    if (!exports) {
      exports = deps;
      deps = [];
    }
    if (exports) {
      factory = typeof exports !== "function" ? function () { return exports; } : exports;
      reqAll(deps, function () {
        var exports = factory.apply(window, arguments);
        if (exports) {
          if (typeof exports === "function") {
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
  };

  AP.require = function(deps, callback) {
    reqAll(typeof deps === "string" ? [deps] : deps, callback);
  };

  function reqAll(deps, callback) {
    var mods = [], i = 0, len = deps.length;
    function addOne(mod) {
      mods.push(mod);
      if (mods.length === len) {
        var exports = [], i = 0;
        for (; i < len; i += 1) {
          exports[i] = mods[i].exports;
        }
        if (callback) callback.apply(window, exports);
      }
    }
    if (deps && deps.length > 0) {
      for (; i < len; i += 1) {
        reqOne(deps[i], addOne);
      }
    }
    else {
      if (callback) callback();
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

}(this));

AP.define("_util", function () {

  "use strict";

  // universal iterator utility
  function each(o, it) {
    var l, k;
    if (o) {
      l = o.length;
      if (l != null && typeof o !== "function") {
        k = 0;
        while (k < l) {
          if (it.call(o[k], k, o[k]) === false) break;
          k += 1;
        }
      }
      else {
        for (k in o) {
          if (o.hasOwnProperty(k)) {
            if (it.call(o[k], k, o[k]) === false) break;
          }
        }
      }
    }
  }

  function binder(std, odd) {
    std += "EventListener";
    odd += "Event";
    return function (el, e, fn) {
      if (el[std]) {
        el[std](e, fn, false);
      }
      else if (el[odd]) {
        el[odd]("on" + e, fn);
      }
    };
  }

  function log() {
    var console = this.console;
    if (console && console.log) {
      var args = [].slice.call(arguments);
      if (console.log.apply) {
        console.log.apply(console, args);
      }
      else {
        for (var i = 0, l = args.length; i < l; i += 1) {
          args[i] = JSON.stringify(args[i]);
        }
        console.log(args.join(" "));
      }
      return true;
    }
  }

  function decodeQueryComponent(encodedURI) {
    return encodedURI == null ? null : decodeURIComponent( encodedURI.replace(/\+/g, '%20') );
  }

  return {

    each: each,

    extend: function (dest) {
      var args = arguments,
          srcs = [].slice.call(args, 1, args.length);
      each(srcs, function (i, src) {
        each(src, function (k, v) {
          dest[k] = v;
        });
      });
      return dest;
    },

    bind: binder("add", "attach"),

    unbind: binder("remove", "detach"),

    trim: function (s) {
      return s && s.replace(/^\s+|\s+$/g, "");
    },

    debounce: function (fn, wait) {
      var timeout;
      return function () {
        var ctx = this,
          args = [].slice.call(arguments);
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

    inArray: function (value, array, fromIndex) {
      //optimisation for all browsers after IE8
      if (Array.prototype.indexOf) {
        return Array.prototype.indexOf.call(array, value, fromIndex);
      }

      var k = fromIndex >>> 0, len = array.length >>> 0;
      for (; k < len; k += 1) {
        if (array[k] === value) return k;
      }
      return -1;
    },

    isFunction: function (fn) {
      return typeof fn === "function";
    },

    log: log,

    handleError: function (err) {
      if (!log.apply(this, err && err.message ? [err, err.message] : [err])) {
        throw err;
      }
    },

    decodeQueryComponent: decodeQueryComponent
  };

});

AP.define("_dollar", ["_util"], function (util) {

  "use strict";

  var each = util.each,
      extend = util.extend,
      document = window.document;

  function $(sel, context) {

    context = context || document;

    var els = [];
    if (sel) {
      if (typeof sel === "string") {
        var results = context.querySelectorAll(sel);
        each(results, function (i, v) { els.push(v); });
      }
      else if (sel.nodeType === 1) {
        els.push(sel);
      }
      else if (sel === window) {
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
          util.bind(el, name, callback);
        });
      },
      attr: function (k) {
        var v;
        this.each(function (i, el) {
          v = el[k] || (el.getAttribute && el.getAttribute(k));
          return !v;
        });
        return v;
      },
      removeClass: function (className) {
        return this.each(function (i, el) {
          if (el.className) {
            el.className = el.className.replace(new RegExp("(^|\\s)" + className + "(\\s|$)"), " ");
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
            if (k === "$text") {
              if (el.styleSheet) { // style tags in ie
                el.styleSheet.cssText = v;
              }
              else {
                el.appendChild(context.createTextNode(v));
              }
            }
            else if (k !== "tag") {
              el[k] = v;
            }
          });
          to.appendChild(el);
        });
      }
    });

    return els;
  }

  return extend($, util);

});

(window.AP || window._AP).define("_events", ["_dollar"], function ($) {

  "use strict";

  var w = window,
      log = (w.AJS && w.AJS.log) || (w.console && w.console.log) || (function() {});

  /**
   * A simple pub/sub event bus capable of running on either side of the XDM bridge with no external
   * JS lib dependencies.
   *
   * @param {String} key The key of the event source
   * @param {String} origin The origin of the event source
   * @constructor
   */
  function Events(key, origin) {
    this._key = key;
    this._origin = origin;
    this._events = {};
    this._any = [];
  }

  var proto = Events.prototype;

  /**
   * Subscribes a callback to an event name.
   *
   * @param {String} name The event name to subscribe the listener to
   * @param {Function} listener A listener callback to subscribe to the event name
   * @returns {Events} This Events instance
   */
  proto.on = function (name, listener) {
    if (name && listener) {
      this._listeners(name).push(listener);
    }
    return this;
  };

  /**
   * Subscribes a callback to an event name, removing the it once fired.
   *
   * @param {String} name The event name to subscribe the listener to
   * @param {Function}listener A listener callback to subscribe to the event name
   * @returns {Events} This Events instance
   */
  proto.once = function (name, listener) {
    var self = this;
    var interceptor = function () {
      self.off(name, interceptor);
      listener.apply(null, arguments);
    };
    this.on(name, interceptor);
    return this;
  };

  /**
   * Subscribes a callback to all events, regardless of name.
   *
   * @param {Function} listener A listener callback to subscribe for any event name
   * @returns {Events} This Events instance
   */
  proto.onAny = function (listener) {
    this._any.push(listener);
    return this;
  };

  /**
   * Unsubscribes a callback to an event name.
   *
   * @param {String} name The event name to unsubscribe the listener from
   * @param {Function} listener The listener callback to unsubscribe from the event name
   * @returns {Events} This Events instance
   */
  proto.off = function (name, listener) {
    var all = this._events[name];
    if (all) {
      var i = $.inArray(listener, all);
      if (i >= 0) {
        all.splice(i, 1);
      }
      if (all.length === 0) {
        delete this._events[name];
      }
    }
    return this;
  };

  /**
   * Unsubscribes all callbacks from an event name, or unsubscribes all event-name-specific listeners
   * if no name if given.
   *
   * @param {String} [name] The event name to unsubscribe all listeners from
   * @returns {Events} This Events instance
   */
  proto.offAll = function (name) {
    if (name) {
      delete this._events[name];
    } else {
      this._events = {};
    }
    return this;
  };

  /**
   * Unsubscribes a callback from the set of 'any' event listeners.
   *
   * @param {Function} listener A listener callback to unsubscribe from any event name
   * @returns {Events} This Events instance
   */
  proto.offAny = function (listener) {
    var any = this._any;
    var i = $.inArray(listener, any);
    if (i >= 0) {
      any.splice(i, 1);
    }
    return this;
  };

  /**
   * Emits an event on this bus, firing listeners by name as well as all 'any' listeners. Arguments following the
   * name parameter are captured and passed to listeners.  The last argument received by all listeners after the
   * unpacked arguments array will be the fired event object itself, which can be useful for reacting to event
   * metadata (e.g. the bus's namespace).
   *
   * @param {String} name The name of event to emit
   * @param {String[]} args 0 or more additional data arguments to deliver with the event
   * @returns {Events} This Events instance
   */
  proto.emit = function (name) {
    return this._emitEvent(this._event.apply(this, arguments));
  };

  /**
   * Creates an opaque event object from an argument list containing at least a name, and optionally additional
   * event payload arguments.
   *
   * @param {String} name The name of event to emit
   * @param {String[]} args 0 or more additional data arguments to deliver with the event
   * @returns {Object} A new event object
   * @private
   */
  proto._event = function (name) {
    return {
      name: name,
      args: [].slice.call(arguments, 1),
      attrs: {},
      source: {
        key: this._key,
        origin: this._origin
      }
    };
  };

  /**
   * Emits a previously-constructed event object to all listeners.
   *
   * @param {Object} event The event object to emit
   * @param {String} event.name The name of the event
   * @param {Object} event.source Metadata about the original source of the event, containing key and origin
   * @param {Array} event.args The args passed to emit, to be delivered to listeners
   * @returns {Events} This Events instance
   * @private
   */
  proto._emitEvent = function (event) {
    var args = event.args.concat(event);
    fire(this._listeners(event.name), args);
    fire(this._any, [event.name].concat(args));
    return this;
  };

  /**
   * Returns an array of listeners by event name, creating a new name array if none are found.
   *
   * @param {String} name The event name for which listeners should be returned
   * @returns {Array} An array of listeners; empty if none are registered
   * @private
   */
  proto._listeners = function (name) {
    return this._events[name] = this._events[name] || [];
  };

  // Internal helper for firing an event to an array of listeners
  function fire(listeners, args) {
    for (var i = 0; i < listeners.length; ++i) {
      try {
        listeners[i].apply(null, args);
      } catch (e) {
        log(e.stack || e.message || e);
      }
    }
  }

  return {
    Events: Events
  };

});

(window.AP || window._AP).define("_base64", ["_dollar"], function ($) {

    "use strict";


    function StringBuffer()
    {
        this.buffer = [];
    }

    StringBuffer.prototype.append = function append(string)
    {
        this.buffer.push(string);
        return this;
    };

    StringBuffer.prototype.toString = function toString()
    {
        return this.buffer.join("");
    };

    var Base64 =
    {
        codex : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        encode : function (input)
        {
            var output = new StringBuffer();

            var enumerator = new Utf8EncodeEnumerator(input);
            while (enumerator.moveNext())
            {
                var chr1 = enumerator.current;

                enumerator.moveNext();
                var chr2 = enumerator.current;

                enumerator.moveNext();
                var chr3 = enumerator.current;

                var enc1 = chr1 >> 2;
                var enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                var enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                var enc4 = chr3 & 63;

                if (isNaN(chr2))
                {
                    enc3 = enc4 = 64;
                }
                else if (isNaN(chr3))
                {
                    enc4 = 64;
                }

                output.append(this.codex.charAt(enc1) + this.codex.charAt(enc2) + this.codex.charAt(enc3) + this.codex.charAt(enc4));
            }

            return output.toString();
        },

        decode : function (input)
        {
            var output = new StringBuffer();

            var enumerator = new Base64DecodeEnumerator(input);
            while (enumerator.moveNext())
            {
                var charCode = enumerator.current;

                if (charCode < 128)
                    output.append(String.fromCharCode(charCode));
                else if ((charCode > 191) && (charCode < 224))
                {
                    enumerator.moveNext();
                    var charCode2 = enumerator.current;

                    output.append(String.fromCharCode(((charCode & 31) << 6) | (charCode2 & 63)));
                }
                else
                {
                    enumerator.moveNext();
                    var charCode2 = enumerator.current;

                    enumerator.moveNext();
                    var charCode3 = enumerator.current;

                    output.append(String.fromCharCode(((charCode & 15) << 12) | ((charCode2 & 63) << 6) | (charCode3 & 63)));
                }
            }

            return output.toString();
        }
    }


    function Utf8EncodeEnumerator(input)
    {
        this._input = input;
        this._index = -1;
        this._buffer = [];
    }

    Utf8EncodeEnumerator.prototype =
    {
        current: Number.NaN,

        moveNext: function()
        {
            if (this._buffer.length > 0)
            {
                this.current = this._buffer.shift();
                return true;
            }
            else if (this._index >= (this._input.length - 1))
            {
                this.current = Number.NaN;
                return false;
            }
            else
            {
                var charCode = this._input.charCodeAt(++this._index);

                // "\r\n" -> "\n"
                //
                if ((charCode == 13) && (this._input.charCodeAt(this._index + 1) == 10))
                {
                    charCode = 10;
                    this._index += 2;
                }

                if (charCode < 128)
                {
                    this.current = charCode;
                }
                else if ((charCode > 127) && (charCode < 2048))
                {
                    this.current = (charCode >> 6) | 192;
                    this._buffer.push((charCode & 63) | 128);
                }
                else
                {
                    this.current = (charCode >> 12) | 224;
                    this._buffer.push(((charCode >> 6) & 63) | 128);
                    this._buffer.push((charCode & 63) | 128);
                }

                return true;
            }
        }
    }

    function Base64DecodeEnumerator(input)
    {
        this._input = input;
        this._index = -1;
        this._buffer = [];
    }

    Base64DecodeEnumerator.prototype =
    {
        current: 64,

        moveNext: function()
        {
            if (this._buffer.length > 0)
            {
                this.current = this._buffer.shift();
                return true;
            }
            else if (this._index >= (this._input.length - 1))
            {
                this.current = 64;
                return false;
            }
            else
            {
                var enc1 = Base64.codex.indexOf(this._input.charAt(++this._index));
                var enc2 = Base64.codex.indexOf(this._input.charAt(++this._index));
                var enc3 = Base64.codex.indexOf(this._input.charAt(++this._index));
                var enc4 = Base64.codex.indexOf(this._input.charAt(++this._index));

                var chr1 = (enc1 << 2) | (enc2 >> 4);
                var chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                var chr3 = ((enc3 & 3) << 6) | enc4;

                this.current = chr1;

                if (enc3 != 64)
                    this._buffer.push(chr2);

                if (enc4 != 64)
                    this._buffer.push(chr3);

                return true;
            }
        }
    };

    function encode(plainText) {
        return window.btoa ? window.btoa(plainText) : Base64.encode(plainText);
    }

    function decode(encodedText) {
        return window.atob ? window.atob(encodedText) : Base64.decode(encodedText);
    }

    return {
        encode: encode,
        decode: decode
    };

});

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
(this.AP || this._AP).define("_uri", [], function () {

  var re = {
    starts_with_slashes: /^\/+/,
    ends_with_slashes: /\/+$/,
    pluses: /\+/g,
    query_separator: /[&;]/,
    uri_parser: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  };

  /**
   * Define forEach for older js environments
   * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach#Compatibility
   */
  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(fn, scope) {
      for (var i = 0, len = this.length; i < len; ++i) {
        fn.call(scope || this, this[i], i, this);
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
      s = decodeURIComponent(s);
      s = s.replace(re.pluses, ' ');
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
    var parserKeys = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
    var m = parser.exec(str || '');
    var parts = {};

    parserKeys.forEach(function(key, i) {
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
    var i, ps, p, n, k, v;
    var pairs = [];

    if (typeof(str) === 'undefined' || str === null || str === '') {
      return pairs;
    }

    if (str.indexOf('?') === 0) {
      str = str.substring(1);
    }

    ps = str.toString().split(re.query_separator);

    for (i = 0; i < ps.length; i++) {
      p = ps[i];
      n = p.indexOf('=');

      if (n !== 0) {
        k = decodeURIComponent(p.substring(0, n));
        v = decodeURIComponent(p.substring(n + 1).replace(/\+/g, " "));
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
  ['protocol', 'userInfo', 'host', 'port', 'path', 'anchor'].forEach(function(key) {
    Uri.prototype[key] = function(val) {
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
  Uri.prototype.hasAuthorityPrefix = function(val) {
    if (typeof val !== 'undefined') {
      this.hasAuthorityPrefixUserPref = val;
    }

    if (this.hasAuthorityPrefixUserPref === null) {
      return (this.uriParts.source.indexOf('//') !== -1);
    } else {
      return this.hasAuthorityPrefixUserPref;
    }
  };

  /**
   * Serializes the internal state of the query pairs
   * @param  {string} [val]   set a new query string
   * @return {string}         query string
   */
  Uri.prototype.query = function(val) {
    var s = '', i, param;

    if (typeof val !== 'undefined') {
      this.queryPairs = parseQuery(val);
    }

    for (i = 0; i < this.queryPairs.length; i++) {
      param = this.queryPairs[i];
      if (s.length > 0) {
        s += '&';
      }
      if (param[1] === null) {
        s += param[0];
      } else {
        s += param[0];
        s += '=';
        if (param[1]) {
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
    var param, i;
    for (i = 0; i < this.queryPairs.length; i++) {
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
    var arr = [], i, param;
    for (i = 0; i < this.queryPairs.length; i++) {
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
    var arr = [], i, param, keyMatchesFilter, valMatchesFilter;

    for (i = 0; i < this.queryPairs.length; i++) {

      param = this.queryPairs[i];
      keyMatchesFilter = decode(param[0]) === decode(key);
      valMatchesFilter = param[1] === val;

      if ((arguments.length === 1 && !keyMatchesFilter) || (arguments.length === 2 && (!keyMatchesFilter || !valMatchesFilter))) {
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
   * replaces query param values
   * @param  {string} key         key to replace value for
   * @param  {string} newVal      new value
   * @param  {string} [oldVal]    replace only one specific value (otherwise replaces all)
   * @return {Uri}                returns self for fluent chaining
   */
  Uri.prototype.replaceQueryParam = function (key, newVal, oldVal) {
    var index = -1, i, param;

    if (arguments.length === 3) {
      for (i = 0; i < this.queryPairs.length; i++) {
        param = this.queryPairs[i];
        if (decode(param[0]) === decode(key) && decodeURIComponent(param[1]) === decode(oldVal)) {
          index = i;
          break;
        }
      }
      this.deleteQueryParam(key, oldVal).addQueryParam(key, newVal, index);
    } else {
      for (i = 0; i < this.queryPairs.length; i++) {
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
  ['protocol', 'hasAuthorityPrefix', 'userInfo', 'host', 'port', 'path', 'query', 'anchor'].forEach(function(key) {
    var method = 'set' + key.charAt(0).toUpperCase() + key.slice(1);
    Uri.prototype[method] = function(val) {
      this[key](val);
      return this;
    };
  });

  /**
   * Scheme name, colon and doubleslash, as required
   * @return {string} http:// or possibly just //
   */
  Uri.prototype.scheme = function() {
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
  Uri.prototype.origin = function() {
    var s = this.scheme();

    if (s == 'file://') {
      return s + this.uriParts.authority;
    }

    if (this.userInfo() && this.host()) {
      s += this.userInfo();
      if (this.userInfo().indexOf('@') !== this.userInfo().length - 1) {
        s += '@';
      }
    }

    if (this.host()) {
      s += this.host();
      if (this.port()) {
        s += ':' + this.port();
      }
    }

    return s;
  };

  /**
   * Adds a trailing slash to the path
   */
  Uri.prototype.addTrailingSlash = function() {
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
  Uri.prototype.toString = function() {
    var path, s = this.origin();

    if (this.path()) {
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
      if (this.query().toString().indexOf('?') !== 0) {
        s += '?';
      }
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
  Uri.prototype.clone = function() {
    return new Uri(this.toString());
  };

  return {
    init: Uri
  };

});
(this.AP || this._AP).define("_ui-params", ["_dollar", "_base64", "_uri"], function($, base64, Uri) {

    /**
    * These are passed into the main host create statement and can override
    * any options inside the velocity template.
    * Additionally these are accessed by the js inside the client iframe to check if we are in a dialog.
    */

    return {
        /**
        * Encode options for transport
        */
        encode: function(options){
            return base64.encode(JSON.stringify(options));
        },
        /**
        * return ui params from a Url
        **/
        fromUrl: function(url){
            var url = new Uri.init(url),
            params = url.getQueryParamValue('ui-params');
            return this.decode(params);
        },
        /**
        * returns ui params from window.name
        */
        fromWindowName: function(w, param){
            w = w || window;
            var decoded = this.decode(w.name);

            if(!param){
                return decoded;
            }
            return (decoded) ? decoded[param] : undefined;
        },
        /**
        * Decode a base64 encoded json string containing ui params
        */
        decode: function(params){
            var obj = {};
            if(params && params.length > 0){
                try {
                    obj = JSON.parse(base64.decode(params));
                } catch(e) {
                    if(console && console.log){
                        console.log("Cannot decode passed ui params", params);
                    }
                }
            }
            return obj;
        }
    };

});

(this.AP || this._AP).define("_xdm", ["_events", "_base64", "_uri",  "_ui-params", "host/analytics", "host/_util"], function (events, base64, uri, uiParams, analytics, util) {

  "use strict";

  // Capture some common values and symbol aliases
  var count = 0;

  /**
   * Sets up cross-iframe remote procedure calls.
   * If this is called from a parent window, iframe is created and an RPC interface for communicating with it is set up.
   * If this is called from within the iframe, an RPC interface for communicating with the parent is set up.
   *
   * Calling a remote function is done with the signature:
   *     fn(data..., doneCallback, failCallback)
   * doneCallback is called after the remote function executed successfully.
   * failCallback is called after the remote function throws an exception.
   * doneCallback and failCallback are optional.
   *
   * @param {Object} $ jquery or jquery-like utility
   * @param {Object} config Configuration parameters
   * @param {String} config.remoteKey The remote peer's add-on key (host only)
   * @param {String} config.remote The src of remote iframe (host only)
   * @param {String} config.container The id of element to which the generated iframe is appended (host only)
   * @param {Object} config.props Additional attributes to add to iframe element (host only)
   * @param {String} config.channel Channel (host only); deprecated
   * @param {Object} bindings RPC method stubs and implementations
   * @param {Object} bindings.local Local function implementations - functions that exist in the current context.
   *    XdmRpc exposes these functions so that they can be invoked by code running in the other side of the iframe.
   * @param {Array} bindings.remote Names of functions which exist on the other side of the iframe.
   *    XdmRpc creates stubs to these functions that can be invoked from the current page.
   * @returns XdmRpc instance
   * @constructor
   */
  function XdmRpc($, config, bindings) {

    var self, id, target, remoteOrigin, channel, mixin,
        localKey, remoteKey, addonKey,
        w = window,
        loc = w.location.toString(),
        locals = bindings.local || {},
        remotes = bindings.remote || [],
        localOrigin = getBaseUrl(loc);

    // A hub through which all async callbacks for remote requests are parked until invoked from a response
    var nexus = function () {
      var callbacks = {};
      return {
        // Registers a callback of a given type by uid
        add: function (uid, done, fail) {
          callbacks[uid] = {
            done: done || null,
            fail: fail || null,
            async: !!done
          };
        },
        // Invokes callbacks for a response of a given type by uid if registered, then removes all handlers for the uid
        invoke: function (type, uid, arg) {
          var handled;
          if (callbacks[uid]) {
            if (callbacks[uid][type]) {
              // If the intended callback exists, invoke it and mark the response as handled
              callbacks[uid][type](arg);
              handled = true;
            } else {
              // Only mark other calls as handled if they weren't expecting a callback and didn't fail
              handled = !callbacks[uid].async && type !== "fail";
            }
            delete callbacks[uid];
          }
          return handled;
        }
      };
    }();

    // Use the config and enviroment to construct the core of the new XdmRpc instance.
    //
    // Note: The xdm_e|c|p variables that appear in an iframe URL are used to pass message to the XdmRpc bridge
    // when running inside an add-on iframe.  Their names are holdovers from easyXDM, which was used prior
    // to building this proprietary library (which was done both to greatly reduce the total amount of JS
    // needed to drive the postMessage-based RPC communication, and to allow us to extend its capabilities).
    //
    // AC-451 describes how we can reduce/improve these (and other) iframe url parameters, but until that is
    // addressed, here's a brief description of each:
    //
    //  - xdm_e contains the base url of the host app; it's presence indicates that the XdmRpc is running in
    //    an add-on iframe
    //  - xdm_c contains a unique channel name; this is a holdover from easyXDM that was used to distinguish
    //    postMessage events between multiple iframes with identical xdm_e values, though this may now be
    //    redundant with the current internal implementation of the XdmRpc and should be considered for removal
    if (!/xdm_e/.test(loc)) {
      // Host-side constructor branch
      var iframe = createIframe(config);
      target = iframe.contentWindow;
      localKey = param(config.remote, "oauth_consumer_key") || param(config.remote, "jwt");
      remoteKey = config.remoteKey;
      addonKey = remoteKey;
      remoteOrigin = getBaseUrl(config.remote).toLowerCase();
      channel = config.channel;
      // Define the host-side mixin
      mixin = {
        isHost: true,
        iframe: iframe,
        uiParams: config.uiParams,
        destroy: function () {
          // Unbind postMessage handler when destroyed
          unbind();
          // Then remove the iframe, if it still exists
          if (self.iframe) {
            $(self.iframe).remove();
            delete self.iframe;
          }
        },
        isActive: function () {
          // Host-side instances are only active as long as the iframe they communicate with still exists in the DOM
          return $.contains(document.documentElement, self.iframe);
        }
      };
      $(iframe).on('ra.iframe.destroy', mixin.destroy);
    } else {
      // Add-on-side constructor branch
      target = w.parent;
      localKey = "local"; // Would be better to make this the add-on key, but it's not readily available at this time

      // identify the add-on by unique key: first try JWT issuer claim and fall back to OAuth1 consumer key
      var jwt = param(loc, "jwt");
      remoteKey = jwt ? parseJwtIssuer(jwt) : param(loc, "oauth_consumer_key");

      // if the authentication method is "none" then it is valid to have no jwt and no oauth in the url
      // but equally we don't trust this iframe as far as we can throw it, so assign it a random id
      // in order to prevent it from talking to any other iframe
      if (null === remoteKey) {
          remoteKey = Math.random(); // unpredictable and unsecured, like an oauth consumer key
      }

      addonKey = localKey;
      remoteOrigin = param(loc, "xdm_e").toLowerCase();
      channel = param(loc, "xdm_c");
      // Define the add-on-side mixin
      mixin = {
        isHost: false,
        isActive: function () {
          // Add-on-side instances are always active, as they must always have a parent window peer
          return true;
        }
      };
    }

    id = addonKey + "|" + (count += 1);

    // Create the actual XdmRpc instance, and apply the context-sensitive mixin
    self = $.extend({
      id: id,
      remoteOrigin: remoteOrigin,
      channel: channel,
      addonKey: addonKey
    }, mixin);

    // Sends a message of a specific type to the remote peer via a post-message event
    function send(sid, type, message) {
      try {
        target.postMessage(JSON.stringify({
          c: channel,
          i: sid,
          t: type,
          m: message
        }), remoteOrigin);
      } catch (ex) {
        log(errmsg(ex));
      }
    }

    // Sends a request with a specific remote method name, args, and optional callbacks
    function sendRequest(methodName, args, done, fail) {
      // Generate a random ID for this remote invocation
      var sid = Math.floor(Math.random() * 1000000000).toString(16);
      // Register any callbacks with the nexus so they can be invoked when a response is received
      nexus.add(sid, done, fail);
      // Send a request to the remote, where:
      //  - n is the name of the remote function
      //  - a is an array of the (hopefully) serializable, non-callback arguments to this method
      send(sid, "request", {n: methodName, a: args});
    }

    function sendDone(sid, message) {
      send(sid, "done", message);
    }

    function sendFail(sid, message) {
      send(sid, "fail", message);
    }

    // Handles an normalized, incoming post-message event
    function receive(e) {
      try {
        // Extract message payload from the event
        var payload = JSON.parse(e.data),
            pid = payload.i, pchannel = payload.c, ptype = payload.t, pmessage = payload.m;

        // if the iframe has potentially been reloaded. re-attach the source contentWindow object
        if (e.source !== target && e.origin.toLowerCase() === remoteOrigin && pchannel === channel) {
          target = e.source;
        }

        // If the payload doesn't match our expected event signature, assume its not part of the xdm-rpc protocol
        if (e.source !== target || e.origin.toLowerCase() !== remoteOrigin || pchannel !== channel){
          return;
        }

        if (ptype === "request") {
          // If the payload type is request, this is an incoming method invocation
          var name = pmessage.n, args = pmessage.a,
              local = locals[name], done, fail, async;
          if (local) {
            // The message name matches a locally defined RPC method, so inspect and invoke it according
            // Create responders for each response type
            done = function (message) { sendDone(pid, message); };
            fail = function (message) { sendFail(pid, message); };
            // The local method is considered async if it accepts more arguments than the message has sent;
            // the additional arguments are filled in with the above async responder callbacks;
            // TODO: consider specifying args somehow in the remote stubs so that non-callback args can be
            //       verified before sending a request to fail fast at the callsite
            async = (args ? args.length : 0) < local.length;
            var context = locals;
            if(self.isHost === true){
                context = self;
                if(context.analytics){
                  context.analytics.trackBridgeMethod(name);
                }
            } else {
              context.isHost = false;
            }
            try {
              if (async) {
                // If async, apply the method with the responders added to the args list
                local.apply(context, args.concat([done, fail]));
              } else {
                // Otherwise, immediately respond with the result
                done(local.apply(context, args));
              }
            } catch (ex) {
              // If the invocation threw an error, invoke the fail responder callback with it
              fail(errmsg(ex));
            }
          } else {
            // No such local rpc method name found
            debug("Unhandled request:", payload);
          }
        } else if (ptype === "done" || ptype === "fail") {
          // The payload is of a response type, so try to invoke the appropriate callback via the nexus registry
          if (!nexus.invoke(ptype, pid, pmessage)) {
            // The nexus didn't find an appropriate reponse callback to invoke
            debug("Unhandled response:", ptype, pid, pmessage);
          }
        }
      } catch (ex) {
        log(errmsg(ex));
      }
    }

    // Creates a bridging invocation function for a remote method
    function bridge(methodName) {
      // Add a method to this instance that will convert from 'rpc.method(args..., done?, fail?)'-style
      // invocations to a postMessage event via the 'send' function
      return function () {
        var args = [].slice.call(arguments), done, fail;
        // Pops the last arg off the args list if it's a function
        function popFn() {
          if ($.isFunction(args[args.length - 1])) {
            return args.pop();
          }
        }
        // Remove done/fail callbacks from the args list
        fail = popFn();
        done = popFn();
        if (!done) {
          // Set the done cb to the value of the fail cb if only one callback fn was given
          done = fail;
          fail = undefined;
        }
        sendRequest(methodName, args, done, fail);
      };
    }

    // For each remote method, generate a like-named interceptor on this instance that converts invocations to
    // post-message request events, tracking async callbacks as necessary.
    $.each(remotes, function (methodName, v) {
      // If remotes were specified as an array rather than a map, promote v to methodName
      if (typeof methodName === "number") methodName = v;
      self[methodName] = bridge(methodName);
    });

    // Create and attach a local event emitter for bridged pub/sub
    var bus = self.events = new events.Events(localKey, localOrigin);
    // Attach an any-listener to forward all locally-originating events to the remote peer
    bus.onAny(function () {
      // The actual event object is the last argument passed to any listener
      var event = arguments[arguments.length - 1];
      var trace = event.trace = event.trace || {};
      var traceKey = self.id + "|xdm";
      if ((self.isHost && !trace[traceKey] && event.source.channel !== self.id)
          || (!self.isHost && event.source.key === localKey)) {
        // Only forward an event once in this listener
        trace[traceKey] = true;
        // Clone the event and forward without tracing info, to avoid leaking host-side iframe topology to add-ons
        event = $.extend({}, event);
        delete event.trace;
        debug("Forwarding " + (self.isHost ? "host" : "addon") + " event:", event);
        sendRequest("_event", [event]);
      }
    });
    // Define our own reserved local to receive remote events
    locals._event = function (event) {
      // Reset/ignore any tracing info that may have come across the bridge
      delete event.trace;
      if (this.isHost) {
        // When the running on the host-side, forcibly reset the event's key and origin fields, to prevent spoofing by
        // untrusted add-ons; also include the host-side XdmRpc instance id to tag the event with this particular
        // instance of the host/add-on relationship
        event.source = {
          channel: this.id || id, // Note: the term channel here != the deprecated xdm channel param
          key: this.addonKey,
          origin: this.remoteOrigin || remoteOrigin
        };
      }
      debug("Receiving as " + (this.isHost ? "host" : "addon") + " event:", event);
      // Emit the event on the local bus
      bus._emitEvent(event);
    };

    // Handles incoming postMessages from this XdmRpc instance's remote peer
    function postMessageHandler(e) {
      if (self.isActive()) {
        // Normalize and forward the event message to the receiver logic
        receive(e.originalEvent ? e.originalEvent : e);
      } else {
        // If inactive (due to the iframe element having disappeared from the DOM), force cleanup of this callback
        unbind();
      }
    }

    // Starts listening for window messaging events
    function bind() {
      $(window).bind("message", postMessageHandler);
    }

    // Stops listening for window messaging events
    function unbind() {
      $(window).unbind("message", postMessageHandler);
    }

    // Crudely extracts a query param value from a url by name
    function param(url, name) {
      return new uri.init(url).getQueryParamValue(name);
    }

    // Determines a base url consisting of protocol+domain+port from a given url string
    function getBaseUrl(url) {
      return new uri.init(url).origin();
    }

    // Appends a map of query parameters to a base url
    function toUrl(base, params) {
      var url = new uri.init(base);
      $.each(params, function (k, v) {
        url.addQueryParam(k,v);
      });
      return url.toString();
    }

    // Creates an iframe element from a config option consisting of the following values:
    //  - container:  the parent element of the new iframe
    //  - remote:     the src url of the new iframe
    //  - props:      a map of additional HTML attributes for the new iframe
    //  - channel:    deprecated
    function createIframe(config) {
      if(!config.container){
        throw new Error("config.container must be defined");
      }
      var iframe = document.createElement("iframe"),
        id = "easyXDM_" + config.container + "_provider",
        windowName = "";

      if(config.uiParams){
        windowName = uiParams.encode(config.uiParams);
      }
      $.extend(iframe, {id: id, name: windowName, frameBorder: "0"}, config.props);
      //$.extend will not add the attribute rel.
      iframe.setAttribute('rel', 'nofollow');
      $("#" + util.escapeSelector(config.container)).append(iframe);
      iframe.src = config.remote;
      return iframe;
    }

    function errmsg(ex) {
      return ex.message || ex.toString();
    }

    function debug() {
      if (XdmRpc.debug) log.apply(w, ["DEBUG:"].concat([].slice.call(arguments)));
    }

    function log() {
      var log = $.log || (w.AJS && w.AJS.log);
      if (log) log.apply(w, arguments);
    }

    function parseJwtIssuer(jwt) {
      return parseJwtClaims(jwt)['iss'];
    }

    function parseJwtClaims(jwt) {

      if (null === jwt || '' === jwt) {
        throw('Invalid JWT: must be neither null nor empty-string.');
      }

      var firstPeriodIndex = jwt.indexOf('.');
      var secondPeriodIndex = jwt.indexOf('.', firstPeriodIndex + 1);

      if (firstPeriodIndex < 0 || secondPeriodIndex <= firstPeriodIndex) {
        throw('Invalid JWT: must contain 2 period (".") characters.');
      }

      var encodedClaims = jwt.substring(firstPeriodIndex + 1, secondPeriodIndex);

      if (null === encodedClaims || '' === encodedClaims) {
        throw('Invalid JWT: encoded claims must be neither null nor empty-string.');
      }

      var claimsString = base64.decode(encodedClaims);
      return JSON.parse(claimsString);
    }

    // Immediately start listening for events
    bind();

    return self;
  }

//  XdmRpc.debug = true;

  return XdmRpc;

});

AP.define("_rpc", ["_dollar", "_xdm"], function ($, XdmRpc) {

  "use strict";

  var each = $.each,
      extend = $.extend,
      isFn = $.isFunction,
      proxy = {},
      rpc,
      apis = {},
      stubs = ["init"],
      internals = {},
      inits = [],
      isInited;

  return {

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

});

AP.define("events", ["_dollar", "_rpc"], 
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

    function ($, rpc) {

    "use strict";

    return rpc.extend(function (remote) {
    // Expose an Events API that delegates the to the underlying XdmRpc events bus; this is necessary since the bus
    // itself isn't actually created until the XdmRpc object is constructed, which hasn't happened yet at this point;
    // see the jsdoc in ../_events.js for API docs
    var apis = {};
    $.each(["on", "once", "onAny", "off", "offAll", "offAny", "emit"], function (_, name) {
      apis[name] = function () {
        var events = remote.events;
        events[name].apply(events, arguments);
        return apis;
      };
    });

// TODO: Experimental cross-addon eventing
//    // Add additional methods that tag the event as being globally-distributable to all addons.
//
//    apis.emitGlobal = function (name) {
//      return apis.emitWhitelist.apply(apis, [/.*/].concat([].slice.call(arguments, 1)));
//    };
//
//    apis.emitWhitelist = function (regex, name) {
//      var events = remote.events;
//      var event = events._event.apply(events, arguments);
//      event.attrs._acAllow = regex.toString();
//      events._emitEvent(event);
//      return apis;
//    };

    return {
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
      apis: apis
    };
  });

});

AP.define("env", ["_dollar", "_rpc"], function ($, rpc) {

  "use strict";

  var apis = rpc.extend(function (remote) {

    return {
      /**
      * @exports AP
      * Utility methods that are available without requiring additional modules.
      */
      apis: {

        /**
        * get the location of the host page
        *
        * @param {Function} callback function (location) {...}
        * @example
        * AP.getLocation(function(location){
        *   alert(location); 
        * });
        */
        getLocation: function (callback) {
          remote.getLocation(callback);
        },

        /**
        * get a user object containing the user's id and full name
        *
        * @param {Function} callback  function (user) {...}
        * @example
        * AP.getUser(function(user){ 
        *   console.log(user);
        * });
        */
        getUser: function (callback) {
          remote.getUser(callback);
        },

        /**
        * get current timezone - if user is logged in then this will retrieve user's timezone
        * the default (application/server) timezone will be used for unauthorized user
        *
        * @param {Function} callback  function (user) {...}
        * @example
        * AP.getTimeZone(function(timezone){
        *   console.log(timezone);
        * });
        */
        getTimeZone: function (callback) {
          remote.getTimeZone(callback);
        },

        /**
        * fire an analytics event
        *
        * @param id  the event id.  Will be prepended with the prefix "p3.iframe."
        * @param props the event properties
        * @deprecated
        */
        fireEvent: function (id, props) {
          console.log("AP.fireEvent deprecated; will be removed in future version");
        },
        /**
        * resize this iframe
        * @method
        * @param {String} width   the desired width
        * @param {String} height  the desired height
        */
        resize: $.debounce(function (width, height) {
          var dim = apis.size(width, height, apis.container());
          remote.resize(dim.w, dim.h);
        }, 50),

        sizeToParent: $.debounce(function() {
          remote.sizeToParent();
        }, 50)
      }

    };

  });

  return $.extend(apis, {

    meta: function (name) {
      //IE8 fallback: querySelectorAll will never find nodes by name.
      if(navigator.userAgent.indexOf('MSIE 8') >= 0){
        var i,
        metas = document.getElementsByTagName('meta');

        for (i=0; i<metas.length; i++) {
          if(metas[i].getAttribute("name") === 'ap-' + name) {
             return metas[i].getAttribute("content");
          }
        }
      } else {
        return $("meta[name='ap-" + name + "']").attr("content");
      }
    },

    container: function(){
      // Look for these two selectors first... you need these to allow for the auto-shrink to work
      // Otherwise, it'll default to document.body which can't auto-grow or auto-shrink
      var container = $('.ac-content, #content');
      return container.length>0 ? container[0]: document.body;
    },

    localUrl: function (path) {
      return this.meta("local-base-url") + (path == null ? "" : path);
    },

    size: function (width, height, container) {
      var w = width == null ? "100%" : width, h, docHeight;
      if(!container){
        container = this.container();
      }
      if (height) {
        h = height;
      } else {
        // Determine height
        docHeight = Math.max(
          container.scrollHeight, document.documentElement.scrollHeight,
          container.offsetHeight, document.documentElement.offsetHeight,
          container.clientHeight, document.documentElement.clientHeight
        );
        if(container === document.body){
          h = docHeight;
        } else {
          // Started with http://james.padolsey.com/javascript/get-document-height-cross-browser/
          // to determine page height across browsers. Turns out that in our case, we can get by with
          // document.body.offsetHeight and document.body.clientHeight. Those two return the proper
          // height even when the dom shrinks. Tested on Chrome, Safari, IE8/9/10, and Firefox
          h = Math.max(container.offsetHeight, container.clientHeight);
          if(h===0){
              h = docHeight;
          }
        }
      }
      return {w: w, h: h};
    }
  });
});

AP.define("request", ["_dollar", "_rpc"], function ($, rpc) {

  "use strict";

  var each = $.each,
      extend = $.extend;

  // internal maker that converts bridged xhr data into an xhr-like object
  function Xhr(data) {
    // copy the xhr data into a new xhr instance
    var xhr = extend({}, data);
    // store header data privately
    var headers = data.headers || {};
    // clear the headers map from the new instance
    delete xhr.headers;
    return extend(xhr, {
      // get header by name, case-insensitively
      getResponseHeader: function (key) {
        var value = null;
        if (key) {
          key = key.toLowerCase();
          each(headers, function (k, v) {
            if (k.toLowerCase() === key) {
              value = v;
              return false;
            }
          });
        }
        return value;
      },
      // get all headers as a formatted string
      getAllResponseHeaders: function () {
        var str = "";
        each(headers, function (k, v) {
          // prepend crlf if not the first line
          str += (str ? "\r\n" : "") + k + ": " + v;
        });
        return str;
      }
    });
  }

  /**
  * @name RequestProperties
  * @description An object containing the options of a {@link Request}
  * @class
  * @property {String}    url         the url to request from the host application, relative to the host's context path
  * @property {String}    type        the HTTP method name; defaults to 'GET'
  * @property {String}    data        the string entity body of the request; required if type is 'POST' or 'PUT'
  * @property {String}    contentType the content-type string value of the entity body, above; required when data is supplied
  * @property {Object}    headers     an object containing headers to set; supported headers are: Accept
  * @property {Function}  success     a callback function executed on a 200 success status code
  * @property {Function}  error       a callback function executed when a HTTP status error code is returned
  */


  var apis = rpc.extend(function (remote) {

    return {

      /**
      * @exports request
      */
      apis: {

        /**
        * execute an XMLHttpRequest in the context of the host application
        *
        * @param {String} url either the URI to request or an options object (as below) containing at least a 'url' property;<br />
        *                     this value should be relative to the context path of the host application.
        * @param {RequestProperties} options an RequestProperties object.
        * @example
        * // Display an alert box with a list of JIRA dashboards using the JIRA REST API.
        * AP.require('request', function(request){
        *   request({
        *     url: '/rest/api/2/dashboard',
        *     success: function(responseText){
        *       alert(responseText);
        *     }
        *   });
        * });
        */

        request: function (url, options) {
          var success, error;
          // unpacks bridged success args into local success args
          function done(args) {
            return success(args[0], args[1], Xhr(args[2]));
          }
          // unpacks bridged error args into local error args
          function fail(args) {
            return error(Xhr(args[0]), args[1], args[2]);
          }
          // normalize method arguments
          if (typeof url === "object") {
            options = url;
          }
          else if (!options) {
            options = {url: url};
          }
          else {
            options.url = url;
          }
          // no-op
          function nop() {}
          // extract done/fail handlers from options and clean up for serialization
          success = options.success || nop;
          delete options.success;
          error = options.error || nop;
          delete options.error;
          // execute the request
          remote.request(options, done, fail);
        }

      }

    };

  });

  return apis.request;

});

AP.define("dialog", ["_dollar", "_rpc", "_ui-params", "_uri"],

  /**
   * The Dialog module provides a mechanism for launching an add-on's modules as modal dialogs from within an add-on's iframe.
   * A modal dialog displays information without requiring the user to leave the current page.
   * The dialog is opened over the entire window, rather than within the iframe itself.
   * ###Styling your dialog to look like a standard Atlassian dialog
   * By default the dialog iframe is undecorated. It's up to the developer to style the dialog.
   * <img src="../assets/images/connectdialogchromelessexample.jpeg" width="100%" />
   *
   * In order to maintain a consistent look and feel between the host application and the add-on,
   * we encourage add-on developers to style their dialogs to match Atlassian's Design Guidelines for modal dialogs.
   * To do that, you'll need to add the AUI styles to your dialog.
   *
   * For more information, read about the Atlassian User Interface [dialog component](https://docs.atlassian.com/aui/latest/docs/dialog.html).
   * @exports Dialog
   */

  function ($, rpc, UiParams, Uri) {
  "use strict";

    var isDialog = Boolean(UiParams.fromUrl(window.location.toString()).dlg),
      exports,
      url = new Uri.init(window.location.toString());

    // if it has been set to a dialog on the server.
    if(url.getQueryParamValue("dialog") === "1"){
      isDialog = true;
    }

  rpc.extend(function (remote) {

    // dialog-related sub-api for use when the remote plugin is running as the content of a host dialog

    var listeners = {};

    exports = {
      /**
      * Creates a dialog for a web-item, web-panel or page module key.
      * @param {DialogOptions} options configuration object of dialog options.
      * @example
      * AP.require('dialog', function(dialog){
      *   dialog.create({
      *     key: 'my-module-key',
      *     width: '500px',
      *     height: '200px'
      *   });
      * });
      */
      create: function(options) {
        /**
        * @name DialogOptions
        * @class
        * @property {String}        key         The module key of the page you want to open as a dialog
        * @property {String}        size        Opens the dialog at a preset size: small, medium, large, x-large or maximum (full screen).
        * @property {Number|String} width       overrides size, define the width as a percentage (append a % to the number) or pixels.
        * @property {Number|String} height      overrides size, define the height as a percentage (append a % to the number) or pixels.
        * @property {Boolean}       chrome      (optional) opens the dialog with heading and buttons.
        * @property {String}        header      (optional) text to display in the header if opening a dialog with chrome.
        * @property {String}        submitText  (optional) text for the submit button if opening a dialog with chrome.
        * @property {String}        cancelText  (optional) text for the cancel button if opening a dialog with chrome.
        */
        remote.createDialog(options);
        return {
          on: function (event, callback) {
            // HACK: Note this is a "once" as it's assumed the only event is "close", and close is only fired
            // once per dialog. If we changed this to "on", then it would be fired when *any* dialog is closed,
            // meaning that if say two dialog were opened, closed, opened, then closed, then the callback
            // registered for the first dialog would be issued when the second was closed.
            remote.events.once("dialog." + event, callback);
          }
        };
      },
      /**
      * Closes the currently open dialog. Optionally pass data to listeners of the `dialog.close` event.
      * This will only close a dialog that has been opened by your add-on.
      * You can register for close events using the `dialog.close` event and the [events module](module-Event.html)
      * @param {Object} data An object to be emitted on dialog close.
      * @example
      * AP.require('dialog', function(dialog){
      *   dialog.close({foo: 'bar'});
      * });
      */
      close: function(data) {
        remote.events.emit("dialog.close", data);
        remote.closeDialog();
      },

      isDialog: isDialog,

      /**
      * register callbacks responding to messages from the host dialog, such as "submit" or "cancel"
      * @param String button either "cancel" or "submit"
      * @param Function callback function
      * @deprecated
      */
      onDialogMessage: function (message, listener) {
        this.getButton(message).bind(listener);
      },
      /**
      * Returns the button that was requested (either cancel or submit)
      * @returns {DialogButton}
      * @example
      * AP.require('dialog', function(dialog){
      *   dialog.getButton('submit');
      * });
      */
      getButton: function (name) {
        /**
        * @class DialogButton
        * @description A dialog button that can be controlled with javascript
        */
        return {
          name: name,

          /**
          * Sets the button state to enabled
          * @memberOf DialogButton
          * @example
          * AP.require('dialog', function(dialog){
          *   dialog.getButton('submit').enable();
          * });
          */
          enable: function () {
            remote.setDialogButtonEnabled(name, true);
          },
          /**
          * Sets the button state to disabled
          * @memberOf DialogButton
          * @example
          * AP.require('dialog', function(dialog){
          *   dialog.getButton('submit').disable();
          * });
          */
          disable: function () {
            remote.setDialogButtonEnabled(name, false);
          },
          /**
          * Toggle the button state between enabled and disabled.
          * @memberOf DialogButton
          * @example
          * AP.require('dialog', function(dialog){
          *   dialog.getButton('submit').toggle();
          * });
          */
          toggle: function () {
            var self = this;
            self.isEnabled(function (enabled) {
              self[enabled ? "disable" : "enable"](name);
            });
          },
          /**
          * Query a button for it's current state.
          * @memberOf DialogButton
          * @param {Function} callback function to receive the button state.
          * @example
          * AP.require('dialog', function(dialog){
          *   dialog.getButton('submit').isEnabled(function(enabled){
          *     if(enabled){
          *       //button is enabled
          *     }
          *   });
          * });
          */
          isEnabled: function (callback) {
            remote.isDialogButtonEnabled(name, callback);
          },
          /**
          * Registers a function to be called when the button is clicked.
          * @memberOf DialogButton
          * @param {Function} callback function to be triggered on click or programatically.
          * @example
          * AP.require('dialog', function(dialog){
          *   dialog.getButton('submit').bind(function(){
          *     alert('clicked!');
          *   });
          * });
          */
          bind: function (listener) {
            var list = listeners[name];
            if (!list) {
              list = listeners[name] = [];
            }
            list.push(listener);
          },
          /**
          * Trigger a callback bound to a button.
          * @memberOf DialogButton
          * @example
          * AP.require('dialog', function(dialog){
          *   dialog.getButton('submit').bind(function(){
          *     alert('clicked!');
          *   });
          *   dialog.getButton('submit').trigger();
          * });
          */
          trigger: function () {
            var self = this,
                cont = true,
                result = true,
                list = listeners[name];
            $.each(list, function (i, listener) {
              result = listener.call(self, {
                button: self,
                stopPropagation: function () { cont = false; }
              });
              return cont;
            });
            return !!result;
          }
        };
      }

    };

    return {

      internals: {

        // forwards dialog event messages from the host application to locally registered handlers
        dialogMessage: function (name) {
          var result = true;
          try {
            if (isDialog) {
              result = exports.getButton(name).trigger();
            }
            else {
              $.handleError("Received unexpected dialog button event from host:", name);
            }
          }
          catch (e) {
            $.handleError(e);
          }
          return result;
        }

      },

      stubs: [
        "setDialogButtonEnabled",
        "isDialogButtonEnabled",
        "createDialog",
        "closeDialog"
      ]

    };

  });

  return exports;

});

AP.define("inline-dialog", ["_dollar", "_rpc"],

/**
* The inline dialog is a wrapper for secondary content/controls to be displayed on user request. Consider this component as displayed in context to the triggering control with the dialog overlaying the page content.
* A inline dialog should be preferred over a modal dialog when a connection between the action has a clear benefit versus having a lower user focus.
*
* For more information, read about the Atlassian User Interface [inline dialog component](https://docs.atlassian.com/aui/latest/docs/inlineDialog.html).
* @exports inline-dialog
*/

function ($, rpc) {
    "use strict";

    var exports;

    rpc.extend(function (remote) {
        exports = {
            /**
            * Hide the inline dialog that contains your connect add-on.
            * @example
            * AP.require('inline-dialog', function(inlineDialog){
            *   inlineDialog.hide();
            * });
            */
            hide: function () {
                remote.hideInlineDialog();
            }
        };
        return {
            stubs: ['hideInlineDialog']
        }
    });

    return exports;

});

AP.define("messages", ["_dollar", "_rpc"],

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
* @exports messages
*/

function ($, rpc) {
    "use strict";

    var messageId = 0;

    function getMessageId(){
        messageId++;
        return 'ap-message-' + messageId;
    }

    return rpc.extend(function (remote) {

        var apis = {};
        $.each(["generic", "error", "warning", "success", "info", "hint"], function (_, name) {
            apis[name] = function (title, body, options) {
                options = options || {};
                options.id = getMessageId();
                remote.showMessage(name, title, body, options);
                return options.id;
            };
        });

        /**
        * clear a message
        * @name clear
        * @method
        * @memberof module:messages#
        * @param    {String}    id  The id that was returned when the message was created.
        * @example
        * AP.require("messages", function(messages){
        *   //create a message
        *   var message = messages.info('title', 'body');
        *   messages.clear(message);
        * });
        */

        apis.clear = function(id){
            remote.clearMessage(id);
        }

        return {
            /**
            * Show a generic message
            * @name generic
            * @method
            * @memberof module:messages#
            * @param    {String}            title       Sets the title text of the message.
            * @param    {String}            body        The main content of the message.
            * @param    {MessageOptions}    options     Message Options
            * @returns  {String}    The id to be used when clearing the message
            */

            /**
            * Show an error message
            * @name error
            * @method
            * @memberof module:messages#
            * @param    {String}            title       Sets the title text of the message.
            * @param    {String}            body        The main content of the message.
            * @param    {MessageOptions}    options     Message Options
            * @returns  {String}    The id to be used when clearing the message
            */

            /**
            * Show a warning message
            * @name warning
            * @method
            * @memberof module:messages#
            * @param    {String}            title       Sets the title text of the message.
            * @param    {String}            body        The main content of the message.
            * @param    {MessageOptions}    options     Message Options
            * @returns  {String}    The id to be used when clearing the message
            */

            /**
            * Show a success message
            * @name success
            * @method
            * @memberof module:messages#
            * @param    {String}            title       Sets the title text of the message.
            * @param    {String}            body        The main content of the message.
            * @param    {MessageOptions}    options     Message Options
            * @returns  {String}    The id to be used when clearing the message
            */

            /**
            * Show an info message
            * @name info
            * @method
            * @memberof module:messages#
            * @param    {String}            title       Sets the title text of the message.
            * @param    {String}            body        The main content of the message.
            * @param    {MessageOptions}    options     Message Options
            * @returns  {String}    The id to be used when clearing the message
            */

            /**
            * Show a hint message
            * @name hint
            * @method
            * @memberof module:messages#
            * @param    {String}            title       Sets the title text of the message.
            * @param    {String}            body        The main content of the message.
            * @param    {MessageOptions}    options     Message Options
            * @returns  {String}    The id to be used when clearing the message
            */

            apis: apis,
            stubs: ['showMessage', 'clearMessage']
        };
    });

});

/**
* @name MessageOptions
* @class
* @property {Boolean}   closeable   Adds a control allowing the user to close the message, removing it from the page.
* @property {Boolean}   fadeout     Toggles the fade away on the message
* @property {Number}    delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
* @property {Number}    duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
*/

AP.define("cookie", ["_dollar", "_rpc"],

/**
* Allows add-ons to store, retrieve and erased cookies against the host JIRA / Confluence. These cannot be seen by other add-ons.
* @exports cookie
*/

function ($, rpc) {
    "use strict";

    var exports;

    rpc.extend(function (remote) {
        exports = {

            /**
            * Save a cookie.
            * @param name {String} name of cookie
            * @param value {String} value of cookie
            * @param expires {Number} number of days before cookie expires
            */
            save:function(name, value, expires){
                remote.saveCookie(name, value, expires);
            },

            /**
            * Get the value of a cookie.
            * @param name {String} name of cookie to read
            * @param callback {Function} callback to pass cookie data
            */
            read:function(name, callback){
                remote.readCookie(name, callback);
            },

            /**
            * Remove the given cookie.
            * @param name {String} the name of the cookie to remove
            */
            erase:function(name){
                remote.eraseCookie(name);
            }
        };
        return {
            stubs: ['saveCookie', 'readCookie', 'eraseCookie']
        };
    });

    return exports;

});

AP.define("history", ["_dollar", "_rpc", "_ui-params"],

/**
* History API
* Changing the URL of the host product, allowing manipulation of the browser history.
* Note: This is only enabled for page modules (Admin page, General page, Configure page, User profile page).
* ### Example ###
* ```
* AP.require(["history"], function(history){
*
*    // Register a function to run when state is changed.
*    // You should use this to update your UI to show the state.
*    history.popState(function(e){
*        alert("The URL has changed from: " + e.oldURL + "to: " + e.newURL);
*    });
*
*    // Adds a new entry to the history and changes the url in the browser.
*    history.pushState("page2");
*
*    // Changes the URL back and invokes any registered popState callbacks.
*    history.back();
*
* });
* ```
* @exports history
*/

function ($, rpc, uiParams) {
    "use strict";

    var popStateCallbacks = [];
    var state = uiParams.fromWindowName(null, "historyState");
    return rpc.extend(function (remote) {
        var exports = {
            /**
            * The current url anchor.
            * @return String
            * @example
            * AP.require(["history"], function(history){
            *    history.pushState("page5");
            *    history.getState(); // returns "page5";
            * });
            */
            getState: function(){
                return state;
            },

            /**
            * Goes back or forward the specified number of steps
            * A zero delta will reload the current page.
            * If the delta is out of range, does nothing.
            * Will invoke the popstate callback
            * @param int delta
            * @example
            * AP.require(["history"], function(history){
            *    history.go(-2); // go back by 2 entries in the browser history.
            * });
            */
            go: function(delta){
                remote.historyGo(delta);
            },
            /**
            * Goes back one step in the joint session history.
            * Will invoke the popstate callback
            * @example
            * AP.require(["history"], function(history){
            *    history.back(); // go back by 1 entry in the browser history.
            * });
            */
            back: function(){
                return this.go(-1);
            },
            /**
            * Goes back one step in the joint session history.
            * Will invoke the popstate callback
            * @example
            * AP.require(["history"], function(history){
            *    history.forward(); // go forward by 1 entry in the browser history.
            * });
            */
            forward: function(){
                return this.go(1);
            },
            /**
            * Pushes the given data onto the session history.
            * Does NOT invoke popState callback
            * @param String url to add to history
            */
            pushState: function(url){
                state = url;
                remote.historyPushState(url);
            },
            /**
            * Updates the current entry in the session history.
            * Does NOT invoke popState callback
            * @param String url to add to history
            */
            replaceState: function(url){
                state = url;
                remote.historyReplaceState(url);
            },
            /**
            * Register a function to be executed on state change
            * @param Function callback to be executed on state change.
            */
            popState: function(callback){
                popStateCallbacks.push(callback);
            }
        };

        return {
            apis: exports,
            internals: {
                historyMessage: function(e){
                    state = e.newURL;
                    for(var i in popStateCallbacks){
                        try {
                            popStateCallbacks[i](e);
                        } catch (err) {
                            $.log("History popstate callback exception: " + err.message);
                        }
                    }
                }
            },
            stubs: ["historyPushState", "historyGo", "historyReplaceState"]
        };

    });

});

(window.AP || window._AP).define("_resize_listener", ["_dollar"], function ($) {

    "use strict";

    // Normalize overflow/underflow events across browsers
    // http://www.backalleycoder.com/2013/03/14/oft-overlooked-overflow-and-underflow-events/
    function addFlowListener(element, type, fn){
        var flow = type == 'over';
        element.addEventListener('OverflowEvent' in window ? 'overflowchanged' : type + 'flow', function(e){
            if (e.type == (type + 'flow') ||
                ((e.orient == 0 && e.horizontalOverflow == flow) ||
                    (e.orient == 1 && e.verticalOverflow == flow) ||
                    (e.orient == 2 && e.horizontalOverflow == flow && e.verticalOverflow == flow))) {
                e.flow = type;
                return fn.call(this, e);
            }
        }, false);
    };

    // Adds a resize listener to a DOM element (other within <body>). It first adds a set of invisible
    // "sensor" divs to the bottom of the selected element. Those sensor divs serve as over/underflow
    // detectors using the addFlowLister. The flowListener triggers the over/underflow within the div
    // which tells us that the element has resized. We compare the previous and current size. If it's
    // changed, we trigger the resize event.
    //
    // This listener is initiated during the page load event in _init.js. The callback function is
    // the actual iframe resize function in env.js.
    function addListener(element, fn){
        var resize = 'onresize' in element;
        if (!resize && !element._resizeSensor) {
            $("head").append({tag: "style", type: "text/css", $text: ".ac-resize-sensor,.ac-resize-sensor>div {position: absolute;top: 0;left: 0;width: 100%;height: 100%;overflow: hidden;z-index: -1;}"});
            var sensor = element._resizeSensor = document.createElement('div');
            sensor.className = 'ac-resize-sensor';
            sensor.innerHTML = '<div class="ac-resize-overflow"><div></div></div><div class="ac-resize-underflow"><div></div></div>';

            var x = 0, y = 0,
            first = sensor.firstElementChild.firstChild,
            last = sensor.lastElementChild.firstChild,
            matchFlow = function(event){
                var change = false,
                width = element.offsetWidth;
                if (x != width) {
                    first.style.width = width - 1 + 'px';
                    last.style.width = width + 1 + 'px';
                    change = true;
                    x = width;
                }
                var height = element.offsetHeight;
                if (y != height) {
                    first.style.height = height - 1 + 'px';
                    last.style.height = height + 1 + 'px';
                    change = true;
                    y = height;
                }
                if (change && event.currentTarget != element) {
                    var event = document.createEvent('Event');
                    event.initEvent('resize', true, true);
                    element.dispatchEvent(event);
                }
            };

            if (getComputedStyle(element).position === 'static'){
                element.style.position = 'relative';
                element._resizeSensor._resetPosition = true;
            }
            addFlowListener(sensor, 'over', matchFlow);
            addFlowListener(sensor, 'under', matchFlow);
            addFlowListener(sensor.firstElementChild, 'over', matchFlow);
            addFlowListener(sensor.lastElementChild, 'under', matchFlow);
            element.appendChild(sensor);
            matchFlow({});
        }
        var events = element._flowEvents || (element._flowEvents = []);
        if ($.inArray(fn, events) == -1) events.push(fn);
        if (!resize) element.addEventListener('resize', fn, false);
        element.onresize = function(e){
            $.each(events,function(idx,fn){
                fn.call(element, e);
            });
        };
    };

    return {
      addListener: addListener
    };

});

AP.define("jira", ["_dollar", "_rpc"], function ($, rpc) {

    "use strict";

    var workflowListener,
        validationListener;

    /**
    * @class WorkflowConfiguration
    */
    var WorkflowConfiguration = {
        /**
        * Validate a workflow configuration before saving
        * @memberOf WorkflowConfiguration
        * @param {Function} listener called on validation. Return false to indicate that validation has not passed and the workflow cannot be saved.
        */
        onSaveValidation: function (listener) {
            validationListener = listener;
        },
        /**
        * Attach a callback function to run when a workflow is saved
        * @memberOf WorkflowConfiguration
        * @param {Function} listener called on save.
        */
        onSave: function (listener) {
            workflowListener = listener;
        },
        /**
        * Save a workflow configuration if valid.
        * @memberOf WorkflowConfiguration
        * @returns {WorkflowConfigurationTriggerResponse} An object Containing `{valid, value}` properties.valid (the result of the validation listener) and value (result of onSave listener) properties.
        */
        trigger: function () {
            var valid = true;
            if($.isFunction(validationListener)){
                valid = validationListener.call();
            }
            /**
            * An object returned when the {@link WorkflowConfiguration} trigger method is invoked.
            * @name WorkflowConfigurationTriggerResponse
            * @class
            * @property {Boolean} valid The result of the validation listener {@link WorkflowConfiguration.onSaveValidation}
            * @property {*} value The result of the {@link WorkflowConfiguration.onSave}
            */
            return {
                valid: valid,
                value: valid ? "" + workflowListener.call() :  undefined
            };
        }
    };

    var apis = rpc.extend(function (remote) {

        return {

            /**
            * Allows custom validation and save callback functions for jira workflow configurations.
            * @see {WorkflowConfiguration}
            * @exports jira
            */
            apis: {
                /**
                * get a workflow configuration object
                *
                * @param {WorkflowConfiguration} callback - the callback that handles the response
                */
                getWorkflowConfiguration: function (callback) {
                    remote.getWorkflowConfiguration(callback);
                },
                /**
                * Refresh an issue page without reloading the browser.
                * This is helpful when your add-on updates information about an issue in the background.
                * @example
                * AP.require('jira', function(jira){
                *   jira.refreshIssuePage();
                * });
                */
                refreshIssuePage: function () {
                    remote.triggerJiraEvent('refreshIssuePage');
                }
            },

            internals: {

                setWorkflowConfigurationMessage: function () {
                    return WorkflowConfiguration.trigger();
                }

            },
            stubs: ["triggerJiraEvent"]

        };

    });

    return $.extend(apis, {
        WorkflowConfiguration: WorkflowConfiguration
    });

});

AP.define("confluence", ["_dollar", "_rpc"],
    function ($, rpc) {
    "use strict";

    return rpc.extend(function (remote) {
        return {
            /**
            * Interact with the confluence macro editor.
            * @exports confluence
            */
            apis: {
                /**
                * Save a macro with data that can be accessed when viewing the confluence page.
                * @param {Object} data to be saved with the macro.
                * @param {String} the macro body to be saved with the macro. If omitted, the existing body will remain untouched.
                * @example
                * AP.require('confluence', function(confluence){
                *   confluence.saveMacro({foo: 'bar'});
                * });
                *
                * AP.require('confluence', function(confluence){
                *   confluence.saveMacro({foo: 'bar'}, "a new macro body");
                * });
                */
                saveMacro: function (macroParameters, macroBody) {
                    remote.saveMacro(macroParameters, macroBody);
                },
                /**
                * Get the data saved in the saveMacro method.
                * @param {Function} callback to be passed the macro data.
                * @example
                * AP.require('confluence', function(confluence){
                *   confluence.getMacroData(function(data){
                *       alert(data);
                *   });
                * });
                */
                getMacroData: function (callback) {
                    remote.getMacroData(callback);
                },

                /**
                 * Get the body saved in the saveMacro method.
                 * @param {Function} callback to be passed the macro data.
                 * @example
                 * AP.require('confluence', function(confluence){
                  *   confluence.getMacroBody(function(body){
                  *       alert(body);
                  *   });
                  * });
                 */
                getMacroBody: function (callback) {
                  remote.getMacroBody(callback);
                },

                /**
                * Closes the macro editor, if it is open.
                * This call does not save any modified parameters to the macro, and saveMacro should be called first if necessary.
                * @example
                * AP.require('confluence', function(confluence){
                *   confluence.closeMacroEditor();
                * });
                */
                closeMacroEditor: function () {
                    remote.closeMacroEditor();
                }
            }
        };
    });

});

// @todo make product-specific inclusions (e.g. jira) dynamic
AP.require(
  ["_dollar", "_rpc", "_resize_listener", "env", "request", "dialog", "jira"],

  function ($, rpc, resizeListener, env, request, dialog, jira) {

  "use strict";

  function injectBase() {
    // set the url base
    env.getLocation(function (loc) {
      $("head").append({tag: "base", href: loc, target: "_parent"});
    });
  }

  // This is required for connect to work correctly in IE8
  function injectRenderModeMeta(){
    var meta = document.createElement("meta"),
      head = document.head || document.getElementsByTagName("head")[0],
      tagExists = false;

    //don't stomp on existing meta tag.
    $("meta").each(function(i, m){
      if(m.getAttribute('http-equiv') === 'X-UA-Compatible'){
        tagExists = true;
        return false;
      }
    });

    if(tagExists === false){
      meta.setAttribute("http-equiv","X-UA-Compatible");
      meta.setAttribute("content","IE=edge");
      head.appendChild(meta);
    }
  }

  function injectMargin() {
    // set a context-sensitive margin value
    var margin = dialog.isDialog ? "10px 10px 0 10px" : "0";
    // @todo stylesheet injection here is rather heavy handed -- switch to setting body style
    $("head").append({tag: "style", type: "text/css", $text: "body {margin: " + margin + " !important;}"});
  }

  rpc.extend({

    init: function (options) {
      // integrate the iframe with the host document
      if (options.margin !== false) {
        // inject an appropriate margin value
        injectMargin(options);
      }
      if (options.base === true) {
        // inject an appropriate base tag
        injectBase(options);
      }

      //JSON is undefined if you're in IE8 without the meta tag.
      if(options.injectRenderModeMeta !== false || this.JSON === undefined){
        // sets IE's render mode. It is required for connect and IE8.
        injectRenderModeMeta();
      }

      if (options.sizeToParent) {
        env.sizeToParent();
      }
      else if (options.resize !== false) {
        var rate = options.resize;
        if(options.resize === undefined){
          rate = "auto";
        }
        rate = rate === "auto" ? 125 : +rate;
        // force rate to an acceptable minimum if it's a number
        if (rate >= 0 && rate < 60) rate = 60;
        if (!dialog.isDialog && rate > 0) {
          // auto-resize when size changes are detected
          $.bind(window, "load", function () {
            var last;
            setInterval(function () {
              var curr = env.size();
              if (!last || last.w !== curr.w || last.h !== curr.h) {
                env.resize(curr.w, curr.h);
                last = curr;
              }
            }, rate);
          });
        }
        else {
          // resize the parent iframe for the size of this document on load
          $.bind(window, "load", function () {
              env.resize();
              var rootElem = env.container();
              if(rootElem) {
                  resizeListener.addListener(rootElem, function(){
                      env.resize();
                  });
              } else {
                  $.log("Your page should have a root block element with an ID called #content or class called .ac-content if you want your page to dynamically resize after the initial load.");
              }
          });
        }
      }
    }

  });

  // @todo remove this before final release once all clients have had a chance to move to AMD
  // deprecated, backward-compatibility extension of AP for pre-AMD plugins
  $.extend(AP, env, jira, {
    Meta: {get: env.meta},
    request: request,
    Dialog: dialog
  });

  // initialization

  // find the script element that imported this code
  var options = {},
      $script = $("script[src*='/atlassian-connect/all']");
  if ($script && /\/atlassian-connect\/all(-debug)?\.js($|\?)/.test($script.attr("src"))) {
    // get its data-options attribute, if any
    var optStr = $script.attr("data-options");
    if (optStr) {
      // if found, parse the value into kv pairs following the format of a style element
      $.each(optStr.split(";"), function (i, nvpair) {
        var trim = $.trim;
        nvpair = trim(nvpair);
        if (nvpair) {
          var nv = nvpair.split(":"), k = trim(nv[0]), v = trim(nv[1]);
          if (k && v != null) options[k] = v === "true" || v === "false" ? v === "true" : v;
        }
      });
    }
  }

  rpc.init(options);

});
