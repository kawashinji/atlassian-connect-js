(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.connectHost = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){
/*! http://mths.be/base64 v0.1.0 by @mathias | MIT license */
;(function(root) {

	// Detect free variables `exports`.
	var freeExports = typeof exports == 'object' && exports;

	// Detect free variable `module`.
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code, and use
	// it as `root`.
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var InvalidCharacterError = function(message) {
		this.message = message;
	};
	InvalidCharacterError.prototype = new Error;
	InvalidCharacterError.prototype.name = 'InvalidCharacterError';

	var error = function(message) {
		// Note: the error messages used throughout this file match those used by
		// the native `atob`/`btoa` implementation in Chromium.
		throw new InvalidCharacterError(message);
	};

	var TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	// http://whatwg.org/html/common-microsyntaxes.html#space-character
	var REGEX_SPACE_CHARACTERS = /[\t\n\f\r ]/g;

	// `decode` is designed to be fully compatible with `atob` as described in the
	// HTML Standard. http://whatwg.org/html/webappapis.html#dom-windowbase64-atob
	// The optimized base64-decoding algorithm used is based on @atk’s excellent
	// implementation. https://gist.github.com/atk/1020396
	var decode = function(input) {
		input = String(input)
			.replace(REGEX_SPACE_CHARACTERS, '');
		var length = input.length;
		if (length % 4 == 0) {
			input = input.replace(/==?$/, '');
			length = input.length;
		}
		if (
			length % 4 == 1 ||
			// http://whatwg.org/C#alphanumeric-ascii-characters
			/[^+a-zA-Z0-9/]/.test(input)
		) {
			error(
				'Invalid character: the string to be decoded is not correctly encoded.'
			);
		}
		var bitCounter = 0;
		var bitStorage;
		var buffer;
		var output = '';
		var position = -1;
		while (++position < length) {
			buffer = TABLE.indexOf(input.charAt(position));
			bitStorage = bitCounter % 4 ? bitStorage * 64 + buffer : buffer;
			// Unless this is the first of a group of 4 characters…
			if (bitCounter++ % 4) {
				// …convert the first 8 bits to a single ASCII character.
				output += String.fromCharCode(
					0xFF & bitStorage >> (-2 * bitCounter & 6)
				);
			}
		}
		return output;
	};

	// `encode` is designed to be fully compatible with `btoa` as described in the
	// HTML Standard: http://whatwg.org/html/webappapis.html#dom-windowbase64-btoa
	var encode = function(input) {
		input = String(input);
		if (/[^\0-\xFF]/.test(input)) {
			// Note: no need to special-case astral symbols here, as surrogates are
			// matched, and the input is supposed to only contain ASCII anyway.
			error(
				'The string to be encoded contains characters outside of the ' +
				'Latin1 range.'
			);
		}
		var padding = input.length % 3;
		var output = '';
		var position = -1;
		var a;
		var b;
		var c;
		var d;
		var buffer;
		// Make sure any padding is handled outside of the loop.
		var length = input.length - padding;

		while (++position < length) {
			// Read three bytes, i.e. 24 bits.
			a = input.charCodeAt(position) << 16;
			b = input.charCodeAt(++position) << 8;
			c = input.charCodeAt(++position);
			buffer = a + b + c;
			// Turn the 24 bits into four chunks of 6 bits each, and append the
			// matching character for each of them to the output.
			output += (
				TABLE.charAt(buffer >> 18 & 0x3F) +
				TABLE.charAt(buffer >> 12 & 0x3F) +
				TABLE.charAt(buffer >> 6 & 0x3F) +
				TABLE.charAt(buffer & 0x3F)
			);
		}

		if (padding == 2) {
			a = input.charCodeAt(position) << 8;
			b = input.charCodeAt(++position);
			buffer = a + b;
			output += (
				TABLE.charAt(buffer >> 10) +
				TABLE.charAt((buffer >> 4) & 0x3F) +
				TABLE.charAt((buffer << 2) & 0x3F) +
				'='
			);
		} else if (padding == 1) {
			buffer = input.charCodeAt(position);
			output += (
				TABLE.charAt(buffer >> 2) +
				TABLE.charAt((buffer << 4) & 0x3F) +
				'=='
			);
		}

		return output;
	};

	var base64 = {
		'encode': encode,
		'decode': decode,
		'version': '0.1.0'
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define(function() {
			return base64;
		});
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = base64;
		} else { // in Narwhal or RingoJS v0.7.0-
			for (var key in base64) {
				base64.hasOwnProperty(key) && (freeExports[key] = base64[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.base64 = base64;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(_dereq_,module,exports){
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
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

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
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
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
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

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
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
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
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],3:[function(_dereq_,module,exports){
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

(function(global) {

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
    Array.prototype.forEach = function(callback, thisArg) {
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
    var i, ps, p, n, k, v, l;
    var pairs = [];

    if (typeof(str) === 'undefined' || str === null || str === '') {
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
  Uri.prototype.query = function(val) {
    var s = '', i, param, l;

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
    var arr = [], i, param, l;
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
    var arr = [], i, param, keyMatchesFilter, valMatchesFilter, l;

    for (i = 0, l = this.queryPairs.length; i < l; i++) {

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
   * test for the existence of a query parameter
   * @param  {string}  key        add values for key
   * @param  {string}  val        value to add
   * @param  {integer} [index]    specific index to add the value at
   * @return {Uri}                returns self for fluent chaining
   */
  Uri.prototype.hasQueryParam = function (key) {
    var i, len = this.queryPairs.length;
    for (i = 0; i < len; i++) {
      if (this.queryPairs[i][0] == key)
        return true;
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
    var index = -1, len = this.queryPairs.length, i, param;

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
  ['protocol', 'hasAuthorityPrefix', 'isColonUri', 'userInfo', 'host', 'port', 'path', 'query', 'anchor'].forEach(function(key) {
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

    if (this.userInfo() && this.host()) {
      s += this.userInfo();
      if (this.userInfo().indexOf('@') !== this.userInfo().length - 1) {
        s += '@';
      }
    }

    if (this.host()) {
      s += this.host();
      if (this.port() || (this.path() && this.path().substr(0, 1).match(/[0-9]/))) {
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

    if (this.isColonUri()) {
      if (this.path()) {
        s += ':'+this.path();
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
  Uri.prototype.clone = function() {
    return new Uri(this.toString());
  };

  /**
   * export via AMD or CommonJS, otherwise leak a global
   */
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return Uri;
    });
  } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Uri;
  } else {
    global.Uri = Uri;
  }
}(this));

},{}],4:[function(_dereq_,module,exports){
'use strict';

var _index = _dereq_('./src/host/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _index2.default;

},{"./src/host/index":7}],5:[function(_dereq_,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = _dereq_("./util");

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PostMessage = function () {
  function PostMessage(data) {
    _classCallCheck(this, PostMessage);

    var d = data || {};
    this._registerListener(d.listenOn);
  }

  // listen for postMessage events (defaults to window).


  _createClass(PostMessage, [{
    key: "_registerListener",
    value: function _registerListener(listenOn) {
      if (!listenOn || !listenOn.addEventListener) {
        listenOn = window;
      }
      listenOn.addEventListener("message", _util2.default._bind(this, this._receiveMessage), false);
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

module.exports = PostMessage;

},{"./util":6}],6:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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

exports.default = util;

},{}],7:[function(_dereq_,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _xdmrpc = _dereq_('./xdmrpc');

var _xdmrpc2 = _interopRequireDefault(_xdmrpc);

var _util = _dereq_('../common/util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Connect = function () {
  function Connect() {
    _classCallCheck(this, Connect);

    this._xdm = new _xdmrpc2.default();
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


  _createClass(Connect, [{
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
      return extension.addon_key + '__' + extension.key + '__' + _util2.default.randomString();
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
        origin: _util2.default.locationOrigin(),
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

module.exports = new Connect();

},{"../common/util":6,"./xdmrpc":8}],8:[function(_dereq_,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = _dereq_('../common/util');

var _util2 = _interopRequireDefault(_util);

var _postmessage = _dereq_('../common/postmessage');

var _postmessage2 = _interopRequireDefault(_postmessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
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
  _inherits(XDMRPC, _PostMessage);

  _createClass(XDMRPC, [{
    key: '_padUndefinedArguments',
    value: function _padUndefinedArguments(array, length) {
      return array.length >= length ? array : array.concat(new Array(length - array.length));
    }
  }]);

  function XDMRPC(config) {
    _classCallCheck(this, XDMRPC);

    config = config || {};

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(XDMRPC).call(this, config));

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

  _createClass(XDMRPC, [{
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
        var args = _util2.default.sanitizeStructuredClone(_util2.default.argumentsToArray(arguments));
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
        this._registeredAPIModules._globals = _util2.default.extend({}, this._registeredAPIModules._globals, module);
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
          uid: _util2.default.randomString()
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
            mid = _util2.default.randomString();
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
          _util2.default._bind(this, sendEvent)(reg, event);
        }
      }, this);
    }
  }, {
    key: '_findRegistrations',
    value: function _findRegistrations(targetSpec) {
      var _this3 = this;

      if (this._registeredExtensions.length === 0) {
        _util2.default.error('no registered extensions', this._registeredExtensions);
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
                  args: _util2.default.argumentNames(member)
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
        _util2.default.warn("Failed to validate origin: " + event.origin);
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
}(_postmessage2.default);

module.exports = XDMRPC;

},{"../common/postmessage":5,"../common/util":6}],9:[function(_dereq_,module,exports){
(function (global){
/*! https://mths.be/utf8js v2.0.0 by @mathias */
;(function(root) {

	// Detect free variables `exports`
	var freeExports = typeof exports == 'object' && exports;

	// Detect free variable `module`
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code,
	// and use it as `root`
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var stringFromCharCode = String.fromCharCode;

	// Taken from https://mths.be/punycode
	function ucs2decode(string) {
		var output = [];
		var counter = 0;
		var length = string.length;
		var value;
		var extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	// Taken from https://mths.be/punycode
	function ucs2encode(array) {
		var length = array.length;
		var index = -1;
		var value;
		var output = '';
		while (++index < length) {
			value = array[index];
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
		}
		return output;
	}

	function checkScalarValue(codePoint) {
		if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
			throw Error(
				'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
				' is not a scalar value'
			);
		}
	}
	/*--------------------------------------------------------------------------*/

	function createByte(codePoint, shift) {
		return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
	}

	function encodeCodePoint(codePoint) {
		if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
			return stringFromCharCode(codePoint);
		}
		var symbol = '';
		if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
			symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
		}
		else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
			checkScalarValue(codePoint);
			symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
			symbol += createByte(codePoint, 6);
		}
		else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
			symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
			symbol += createByte(codePoint, 12);
			symbol += createByte(codePoint, 6);
		}
		symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
		return symbol;
	}

	function utf8encode(string) {
		var codePoints = ucs2decode(string);
		var length = codePoints.length;
		var index = -1;
		var codePoint;
		var byteString = '';
		while (++index < length) {
			codePoint = codePoints[index];
			byteString += encodeCodePoint(codePoint);
		}
		return byteString;
	}

	/*--------------------------------------------------------------------------*/

	function readContinuationByte() {
		if (byteIndex >= byteCount) {
			throw Error('Invalid byte index');
		}

		var continuationByte = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		if ((continuationByte & 0xC0) == 0x80) {
			return continuationByte & 0x3F;
		}

		// If we end up here, it’s not a continuation byte
		throw Error('Invalid continuation byte');
	}

	function decodeSymbol() {
		var byte1;
		var byte2;
		var byte3;
		var byte4;
		var codePoint;

		if (byteIndex > byteCount) {
			throw Error('Invalid byte index');
		}

		if (byteIndex == byteCount) {
			return false;
		}

		// Read first byte
		byte1 = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		// 1-byte sequence (no continuation bytes)
		if ((byte1 & 0x80) == 0) {
			return byte1;
		}

		// 2-byte sequence
		if ((byte1 & 0xE0) == 0xC0) {
			var byte2 = readContinuationByte();
			codePoint = ((byte1 & 0x1F) << 6) | byte2;
			if (codePoint >= 0x80) {
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 3-byte sequence (may include unpaired surrogates)
		if ((byte1 & 0xF0) == 0xE0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
			if (codePoint >= 0x0800) {
				checkScalarValue(codePoint);
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 4-byte sequence
		if ((byte1 & 0xF8) == 0xF0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			byte4 = readContinuationByte();
			codePoint = ((byte1 & 0x0F) << 0x12) | (byte2 << 0x0C) |
				(byte3 << 0x06) | byte4;
			if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
				return codePoint;
			}
		}

		throw Error('Invalid UTF-8 detected');
	}

	var byteArray;
	var byteCount;
	var byteIndex;
	function utf8decode(byteString) {
		byteArray = ucs2decode(byteString);
		byteCount = byteArray.length;
		byteIndex = 0;
		var codePoints = [];
		var tmp;
		while ((tmp = decodeSymbol()) !== false) {
			codePoints.push(tmp);
		}
		return ucs2encode(codePoints);
	}

	/*--------------------------------------------------------------------------*/

	var utf8 = {
		'version': '2.0.0',
		'encode': utf8encode,
		'decode': utf8decode
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define(function() {
			return utf8;
		});
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = utf8;
		} else { // in Narwhal or RingoJS v0.7.0-
			var object = {};
			var hasOwnProperty = object.hasOwnProperty;
			for (var key in utf8) {
				hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.utf8 = utf8;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],10:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  trackDeprecatedMethodUsed: function trackDeprecatedMethodUsed(methodUsed, extension) {
    _event_dispatcher2.default.dispatch('analytics-deprecated-method-used', { methodUsed: methodUsed, extension: extension });
  }
};

},{"dispatchers/event_dispatcher":37}],11:[function(_dereq_,module,exports){
'use strict';

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  clicked: function clicked($el) {
    _event_dispatcher2.default.dispatch('button-clicked', {
      $el: $el
    });
  },
  toggle: function toggle($el, disabled) {
    _event_dispatcher2.default.dispatch('button-toggle', {
      $el: $el,
      disabled: disabled
    });
  },
  toggleVisibility: function toggleVisibility($el, hidden) {
    _event_dispatcher2.default.dispatch('button-toggle-visibility', {
      $el: $el,
      hidden: hidden
    });
  }
};

},{"dispatchers/event_dispatcher":37}],12:[function(_dereq_,module,exports){
'use strict';

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  close: function close(data) {
    _event_dispatcher2.default.dispatch('dialog-close', {
      dialog: data.dialog,
      extension: data.extension,
      customData: data.customData
    });
  },
  closeActive: function closeActive(data) {
    _event_dispatcher2.default.dispatch('dialog-close-active', data);
  },
  clickButton: function clickButton(identifier, $el, extension) {
    _event_dispatcher2.default.dispatch('dialog-button-click', {
      identifier: identifier,
      $el: $el,
      extension: extension
    });
  },
  toggleButton: function toggleButton(data) {
    _event_dispatcher2.default.dispatch('dialog-button-toggle', data);
  },
  toggleButtonVisibility: function toggleButtonVisibility(data) {
    _event_dispatcher2.default.dispatch('dialog-button-toggle-visibility', data);
  }
};

},{"dispatchers/event_dispatcher":37}],13:[function(_dereq_,module,exports){
'use strict';

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  open: function open(extension, options) {
    _event_dispatcher2.default.dispatch('dialog-extension-open', {
      extension: extension,
      options: options
    });
  },
  close: function close() {
    _event_dispatcher2.default.dispatch('dialog-close-active', {});
  },
  addUserButton: function addUserButton(options, extension) {
    _event_dispatcher2.default.dispatch('dialog-button-add', {
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

},{"dispatchers/event_dispatcher":37}],14:[function(_dereq_,module,exports){
'use strict';

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

var _host = _dereq_('simple-xdm/host');

var _host2 = _interopRequireDefault(_host);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  registerKeyEvent: function registerKeyEvent(data) {
    _host2.default.registerKeyListener(data.extension_id, data.key, data.modifiers, data.callback);
    _event_dispatcher2.default.dispatch('dom-event-register', data);
  },
  unregisterKeyEvent: function unregisterKeyEvent(data) {
    _host2.default.unregisterKeyListener(data.extension_id, data.key, data.modifiers, data.callback);
    _event_dispatcher2.default.dispatch('dom-event-unregister', data);
  },
  registerWindowKeyEvent: function registerWindowKeyEvent(data) {
    window.addEventListener('keydown', function (event) {
      if (event.keyCode === data.keyCode) {
        data.callback();
      }
    });
  }
};

},{"dispatchers/event_dispatcher":37,"simple-xdm/host":4}],15:[function(_dereq_,module,exports){
'use strict';

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

var _util = _dereq_('../util');

var _util2 = _interopRequireDefault(_util);

var _iframe = _dereq_('components/iframe');

var _iframe2 = _interopRequireDefault(_iframe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_event_dispatcher2.default.register('iframe-resize', function (data) {
  _iframe2.default.resize(data.width, data.height, data.$el);
});

_event_dispatcher2.default.register('iframe-size-to-parent', function (data) {
  var height = AJS.$(document).height() - AJS.$('#header > nav').outerHeight() - AJS.$('#footer').outerHeight() - 20;
  var $el = _util2.default.getIframeByExtensionId(data.context.extension_id);
  _event_dispatcher2.default.dispatch('iframe-resize', { width: '100%', height: height + 'px', $el: $el });
});

AJS.$(window).on('resize', function (e) {
  _event_dispatcher2.default.dispatch('host-window-resize', e);
});

module.exports = {
  iframeResize: function iframeResize(width, height, context) {
    var $el;
    if (context.extension_id) {
      $el = _util2.default.getIframeByExtensionId(context.extension_id);
    } else {
      $el = context;
    }

    _event_dispatcher2.default.dispatch('iframe-resize', { width: width, height: height, $el: $el, extension: context.extension });
  },
  sizeToParent: function sizeToParent(context) {
    _event_dispatcher2.default.dispatch('iframe-size-to-parent', { context: context });
  }
};

},{"../util":48,"components/iframe":29,"dispatchers/event_dispatcher":37}],16:[function(_dereq_,module,exports){
'use strict';

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

var _host = _dereq_('simple-xdm/host');

var _host2 = _interopRequireDefault(_host);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  broadcast: function broadcast(type, targetSpec, event) {
    _host2.default.dispatch(type, targetSpec, event);
    _event_dispatcher2.default.dispatch('event-dispatch', {
      type: type,
      targetSpec: targetSpec,
      event: event
    });
  }
};

},{"dispatchers/event_dispatcher":37,"simple-xdm/host":4}],17:[function(_dereq_,module,exports){
'use strict';

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  open: function open(flagId) {
    _event_dispatcher2.default.dispatch('flag-open', { id: flagId });
  },
  //called to close a flag
  close: function close(flagId) {
    _event_dispatcher2.default.dispatch('flag-close', { id: flagId });
  },
  //called by AUI when closed
  closed: function closed(flagId) {
    _event_dispatcher2.default.dispatch('flag-closed', { id: flagId });
  }
};

},{"dispatchers/event_dispatcher":37}],18:[function(_dereq_,module,exports){
'use strict';

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

var _host = _dereq_('simple-xdm/host');

var _host2 = _interopRequireDefault(_host);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  notifyIframeCreated: function notifyIframeCreated($el, extension) {
    _event_dispatcher2.default.dispatch('iframe-create', { $el: $el, extension: extension });
  },

  notifyBridgeEstablished: function notifyBridgeEstablished($el, extension) {
    _event_dispatcher2.default.dispatch('iframe-bridge-established', { $el: $el, extension: extension });
  },

  notifyIframeDestroyed: function notifyIframeDestroyed(extension_id) {
    var extension = _host2.default.getExtensions({
      extension_id: extension_id
    });
    if (extension.length === 1) {
      extension = extension[0];
    }
    _event_dispatcher2.default.dispatch('iframe-destroyed', { extension: extension });
    _host2.default.unregisterExtension({ extension_id: extension_id });
  },

  notifyUnloaded: function notifyUnloaded($el, extension) {
    _event_dispatcher2.default.dispatch('iframe-unload', { $el: $el, extension: extension });
  }
};

},{"dispatchers/event_dispatcher":37,"simple-xdm/host":4}],19:[function(_dereq_,module,exports){
'use strict';

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  hide: function hide($el) {
    _event_dispatcher2.default.dispatch('inline-dialog-hide', {
      $el: $el
    });
  },
  refresh: function refresh($el) {
    _event_dispatcher2.default.dispatch('inline-dialog-refresh', { $el: $el });
  },
  hideTriggered: function hideTriggered(extension_id, $el) {
    _event_dispatcher2.default.dispatch('inline-dialog-hidden', { extension_id: extension_id, $el: $el });
  },
  close: function close() {
    _event_dispatcher2.default.dispatch('inline-dialog-close', {});
  },
  created: function created(data) {
    _event_dispatcher2.default.dispatch('inline-dialog-opened', {
      $el: data.$el,
      trigger: data.trigger,
      extension: data.extension
    });
  }
};

},{"dispatchers/event_dispatcher":37}],20:[function(_dereq_,module,exports){
'use strict';

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

var _underscore = _dereq_('../underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  registerContentResolver: function registerContentResolver(data) {
    _event_dispatcher2.default.dispatch('content-resolver-register-by-extension', data);
  },
  requestRefreshUrl: function requestRefreshUrl(data) {
    if (!data.resolver) {
      throw Error('ACJS: No content resolver supplied');
    }
    var promise = data.resolver.call(null, _underscore2.default.extend({ classifier: 'json' }, data.extension));
    promise.done(function (promiseData) {
      var newExtensionConfiguration = {};
      if (_underscore2.default.isObject(promiseData)) {
        newExtensionConfiguration = promiseData;
      } else if (_underscore2.default.isString(promiseData)) {
        try {
          newExtensionConfiguration = JSON.parse(promiseData);
        } catch (e) {
          console.error('ACJS: invalid response from content resolver');
        }
      }
      data.extension.url = newExtensionConfiguration.url;
      _underscore2.default.extend(data.extension.options, newExtensionConfiguration.options);
      _event_dispatcher2.default.dispatch('jwt-url-refreshed', {
        extension: data.extension,
        $container: data.$container,
        url: data.extension.url
      });
    });
    _event_dispatcher2.default.dispatch('jwt-url-refresh-request', { data: data });
  }

};

},{"../underscore":47,"dispatchers/event_dispatcher":37}],21:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  timeout: function timeout($el, extension) {
    _event_dispatcher2.default.dispatch('iframe-bridge-timeout', { $el: $el, extension: extension });
  },
  cancelled: function cancelled($el, extension) {
    _event_dispatcher2.default.dispatch('iframe-bridge-cancelled', { $el: $el, extension: extension });
  }
};

},{"dispatchers/event_dispatcher":37}],22:[function(_dereq_,module,exports){
'use strict';

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  defineCustomModule: function defineCustomModule(name, methods) {
    var data = {};
    if (!methods) {
      data.methods = name;
    } else {
      data.methods = methods;
      data.name = name;
    }
    _event_dispatcher2.default.dispatch('module-define-custom', data);
  }
};

},{"dispatchers/event_dispatcher":37}],23:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

var _webitem = _dereq_('components/webitem');

var _webitem2 = _interopRequireDefault(_webitem);

var _webitem3 = _dereq_('utils/webitem');

var _webitem4 = _interopRequireDefault(_webitem3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  addWebItem: function addWebItem(potentialWebItem) {
    var webitem = void 0;
    var existing = _webitem2.default.getWebItemsBySelector(potentialWebItem.selector);

    if (existing) {
      return false;
    } else {
      webitem = _webitem2.default.setWebItem(potentialWebItem);
      _event_dispatcher2.default.dispatch('webitem-added', { webitem: webitem });
    }
  },

  webitemInvoked: function webitemInvoked(webitem, event, extension) {
    _event_dispatcher2.default.dispatch('webitem-invoked:' + webitem.name, { webitem: webitem, event: event, extension: extension });
  }

};

},{"components/webitem":34,"dispatchers/event_dispatcher":37,"utils/webitem":54}],24:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _underscore = _dereq_('../underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _button_actions = _dereq_('actions/button_actions');

var _button_actions2 = _interopRequireDefault(_button_actions);

var _button = _dereq_('utils/button');

var _button2 = _interopRequireDefault(_button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BUTTON_TYPES = ['primary', 'link', 'secondary'];
var buttonId = 0;

var Button = function () {
  function Button() {
    _classCallCheck(this, Button);

    this.AP_BUTTON_CLASS = 'ap-aui-button';
  }

  _createClass(Button, [{
    key: 'setType',
    value: function setType($button, type) {
      if (type && _underscore2.default.contains(BUTTON_TYPES, type)) {
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
      return (0, _dollar2.default)($button).data('name');
    }
  }, {
    key: 'getText',
    value: function getText($button) {
      return (0, _dollar2.default)($button).text();
    }
  }, {
    key: 'getIdentifier',
    value: function getIdentifier($button) {
      return (0, _dollar2.default)($button).data('identifier');
    }
  }, {
    key: 'isVisible',
    value: function isVisible($button) {
      return (0, _dollar2.default)($button).is(':visible');
    }
  }, {
    key: 'isEnabled',
    value: function isEnabled($button) {
      return !((0, _dollar2.default)($button).attr('aria-disabled') === 'true');
    }
  }, {
    key: 'render',
    value: function render(options) {
      var $button = (0, _dollar2.default)('<button />');
      options = options || {};
      $button.addClass('aui-button ' + this.AP_BUTTON_CLASS);
      $button.text(options.text);
      $button.data(options.data);
      $button.data({
        name: options.name || options.identifier,
        identifier: options.identifier || _button2.default.randomIdentifier(),
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

var ButtonComponent = new Button();
// register 1 button listener globally on dom load
(0, _dollar2.default)(function () {
  (0, _dollar2.default)('body').on('click', '.' + ButtonComponent.AP_BUTTON_CLASS, function (e) {
    var $button = (0, _dollar2.default)(e.target).closest('.' + ButtonComponent.AP_BUTTON_CLASS);
    if ($button.attr('aria-disabled') !== 'true') {
      _button_actions2.default.clicked($button);
    }
  });
});

_event_dispatcher2.default.register('button-toggle', function (data) {
  ButtonComponent.setDisabled(data.$el, data.disabled);
});

_event_dispatcher2.default.register('button-toggle-visibility', function (data) {
  ButtonComponent.setHidden(data.$el, data.hidden);
});

exports.default = ButtonComponent;

},{"../dollar":38,"../underscore":47,"actions/button_actions":11,"dispatchers/event_dispatcher":37,"utils/button":49}],25:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

var _dom_event_actions = _dereq_('actions/dom_event_actions');

var _dom_event_actions2 = _interopRequireDefault(_dom_event_actions);

var _dialog_actions = _dereq_('actions/dialog_actions');

var _dialog_actions2 = _interopRequireDefault(_dialog_actions);

var _dialog = _dereq_('utils/dialog');

var _dialog2 = _interopRequireDefault(_dialog);

var _iframe = _dereq_('components/iframe');

var _iframe2 = _interopRequireDefault(_iframe);

var _button = _dereq_('components/button');

var _button2 = _interopRequireDefault(_button);

var _button_actions = _dereq_('actions/button_actions');

var _button_actions2 = _interopRequireDefault(_button_actions);

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _underscore = _dereq_('../underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
    return _button2.default.getIdentifier(this) === id;
  });
}

var Dialog = function () {
  function Dialog() {
    _classCallCheck(this, Dialog);
  }

  _createClass(Dialog, [{
    key: '_renderHeaderCloseBtn',
    value: function _renderHeaderCloseBtn() {
      var $close = (0, _dollar2.default)('<a />').addClass('aui-dialog2-header-close');
      var $closeBtn = (0, _dollar2.default)('<span />').addClass('aui-icon aui-icon-small aui-iconfont-close-dialog').text('Close');
      $close.append($closeBtn);
      return $close;
    }
    //v3 ask DT about this DOM.

  }, {
    key: '_renderFullScreenHeader',
    value: function _renderFullScreenHeader($header, options) {
      var $titleContainer = (0, _dollar2.default)('<div />').addClass('header-title-container aui-item expanded');
      var $title = (0, _dollar2.default)('<div />').append((0, _dollar2.default)('<span />').addClass('header-title').text(options.header || ''));
      $titleContainer.append($title);
      $header.append($titleContainer).append(this._renderHeaderActions(options.actions, options.extension));
      return $header;
    }
  }, {
    key: '_renderHeader',
    value: function _renderHeader(options) {
      var $header = (0, _dollar2.default)('<header />').addClass('aui-dialog2-header');
      if (options.size === 'fullscreen') {
        return this._renderFullScreenHeader($header, options);
      }
      if (options.header) {
        var $title = (0, _dollar2.default)('<h2 />').addClass('aui-dialog2-header-main').text(options.header);
        $header.append($title);
      }
      $header.append(this._renderHeaderCloseBtn());
      return $header;
    }
  }, {
    key: '_renderHeaderActions',
    value: function _renderHeaderActions(actions, extension) {
      var $headerControls = (0, _dollar2.default)('<div />').addClass('aui-item ' + DIALOG_HEADER_ACTIONS_CLASS);
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
      var $el = (0, _dollar2.default)('<div />').addClass('aui-dialog2-content');
      if ($content) {
        $el.append($content);
      }
      return $el;
    }
  }, {
    key: '_renderFooter',
    value: function _renderFooter(options) {
      var $footer = (0, _dollar2.default)('<footer />').addClass(DIALOG_FOOTER_CLASS);
      if (options.size !== 'fullscreen') {
        var $actions = this._renderFooterActions(options.actions, options.extension);
        $footer.append($actions);
      }
      if (options.hint) {
        var $hint = (0, _dollar2.default)('<div />').addClass('aui-dialog2-footer-hint').text(options.hint);
        $footer.append($hint);
      }
      return $footer;
    }
  }, {
    key: '_renderActionButtons',
    value: function _renderActionButtons(actions, extension) {
      var _this = this;

      var actionButtons = [];
      [].concat(_toConsumableArray(actions)).forEach(function (action) {
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
      var $actions = (0, _dollar2.default)('<div />').addClass(DIALOG_FOOTER_ACTIONS_CLASS);
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
      var $button = _button2.default.render(options);
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
      var sanitizedOptions = _dialog2.default.sanitizeOptions(options);
      var $dialog = (0, _dollar2.default)('<section />').attr({
        role: 'dialog',
        id: DLGID_PREFIX + sanitizedOptions.id
      });
      $dialog.attr('data-aui-modal', 'true');
      $dialog.data({
        'aui-remove-on-hide': true,
        'extension': sanitizedOptions.extension
      });
      $dialog.addClass('aui-layer aui-dialog2 ' + DIALOG_CLASS);

      if (_underscore2.default.contains(DIALOG_SIZES, sanitizedOptions.size)) {
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
      _iframe2.default.resize('100%', '100%', $iframe);
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
        return _button2.default.isEnabled($button);
      }
    }
  }, {
    key: 'buttonIsVisible',
    value: function buttonIsVisible(identifier) {
      var dialog = getActiveDialog();
      if (dialog) {
        var $button = getButtonByIdentifier(identifier, dialog.$el);
        return _button2.default.isVisible($button);
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
          var dialogData = (0, _dollar2.default)(dialog).data('extension');
          return keys.every(function (key) {
            return dialogData[key] === extension[key];
          });
        };
      }

      return (0, _dollar2.default)('.' + DIALOG_CLASS).toArray().filter(filterFunction).map(function ($el) {
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

var DialogComponent = new Dialog();

_event_dispatcher2.default.register('iframe-bridge-established', function (data) {
  if (data.extension.options.isDialog && !data.extension.options.preventDialogCloseOnEscape) {
    _dom_event_actions2.default.registerKeyEvent({
      extension_id: data.extension.id,
      key: 27,
      callback: function callback() {
        _dialog_actions2.default.close({
          dialog: getActiveDialog(),
          extension: data.extension
        });
      }
    });

    _event_dispatcher2.default.registerOnce('dialog-close', function (d) {
      _dom_event_actions2.default.unregisterKeyEvent({
        extension_id: data.extension.id,
        key: 27
      });
    });
  }
});

_event_dispatcher2.default.register('dialog-close-active', function (data) {
  var activeDialog = getActiveDialog();
  if (activeDialog) {
    _dialog_actions2.default.close({
      customData: data.customData,
      dialog: activeDialog,
      extension: data.extension
    });
  }
});

_event_dispatcher2.default.register('dialog-close', function (data) {
  data.dialog.hide();
});

_event_dispatcher2.default.register('dialog-button-toggle', function (data) {
  var dialog = getActiveDialog();
  if (dialog) {
    var $button = getButtonByIdentifier(data.identifier, dialog.$el);
    _button_actions2.default.toggle($button, !data.enabled);
  }
});

_event_dispatcher2.default.register('dialog-button-toggle-visibility', function (data) {
  var dialog = getActiveDialog();
  if (dialog) {
    var $button = getButtonByIdentifier(data.identifier, dialog.$el);
    _button_actions2.default.toggleVisibility($button, data.hidden);
  }
});

_event_dispatcher2.default.register('button-clicked', function (data) {
  var $button = data.$el;
  if ($button.hasClass(DIALOG_BUTTON_CLASS)) {
    var $dialog = $button.parents('.' + DIALOG_CLASS);
    var $iframe = $dialog.find('iframe');
    if ($iframe.length && $iframe[0].bridgeEstablished) {
      _dialog_actions2.default.clickButton(_button2.default.getIdentifier($button), $button, $dialog.data('extension'));
    } else {
      _dialog_actions2.default.close({
        dialog: getActiveDialog(),
        extension: $button.extension
      });
    }
  }
});

_event_dispatcher2.default.register('iframe-create', function (data) {
  if (data.extension.options && data.extension.options.isDialog) {
    DialogComponent.setIframeDimensions(data.extension.$el);
  }
});

_event_dispatcher2.default.register('dialog-button-add', function (data) {
  DialogComponent.addButton(data.extension, data.button);
});

_dom_event_actions2.default.registerWindowKeyEvent({
  keyCode: 27,
  callback: function callback() {
    _dialog_actions2.default.closeActive({
      customData: {},
      extension: null
    });
  }
});

exports.default = DialogComponent;

},{"../dollar":38,"../underscore":47,"actions/button_actions":11,"actions/dialog_actions":12,"actions/dom_event_actions":14,"components/button":24,"components/iframe":29,"dispatchers/event_dispatcher":37,"utils/dialog":50}],26:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dialog = _dereq_('components/dialog');

var _dialog2 = _interopRequireDefault(_dialog);

var _iframe_container = _dereq_('components/iframe_container');

var _iframe_container2 = _interopRequireDefault(_iframe_container);

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DialogExtension = function () {
  function DialogExtension() {
    _classCallCheck(this, DialogExtension);
  }

  _createClass(DialogExtension, [{
    key: 'render',
    value: function render(extension, dialogOptions) {
      extension.options = extension.options || {};
      dialogOptions = dialogOptions || {};
      extension.options.isDialog = true;
      extension.options.preventDialogCloseOnEscape = dialogOptions.closeOnEscape === false;
      var $iframeContainer = _iframe_container2.default.createExtension(extension);
      var $dialog = _dialog2.default.render({
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
      return _dialog2.default.getActive();
    }
  }, {
    key: 'buttonIsEnabled',
    value: function buttonIsEnabled(identifier) {
      return _dialog2.default.buttonIsEnabled(identifier);
    }
  }, {
    key: 'buttonIsVisible',
    value: function buttonIsVisible(identifier) {
      return _dialog2.default.buttonIsVisible(identifier);
    }
  }, {
    key: 'getByExtension',
    value: function getByExtension(extension) {
      if (typeof extension === 'string') {
        extension = {
          id: extension
        };
      }
      return _dialog2.default.getByExtension(extension);
    }
  }]);

  return DialogExtension;
}();

var DialogExtensionComponent = new DialogExtension();
_event_dispatcher2.default.register('dialog-extension-open', function (data) {
  DialogExtensionComponent.render(data.extension, data.options);
});

exports.default = DialogExtensionComponent;

},{"components/dialog":25,"components/iframe_container":30,"dispatchers/event_dispatcher":37}],27:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _webitem_actions = _dereq_('actions/webitem_actions');

var _webitem_actions2 = _interopRequireDefault(_webitem_actions);

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

var _webitem = _dereq_('utils/webitem');

var _webitem2 = _interopRequireDefault(_webitem);

var _dialog = _dereq_('utils/dialog');

var _dialog2 = _interopRequireDefault(_dialog);

var _dialog_extension_actions = _dereq_('actions/dialog_extension_actions');

var _dialog_extension_actions2 = _interopRequireDefault(_dialog_extension_actions);

var _underscore = _dereq_('../underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ITEM_NAME = 'dialog';
var SELECTOR = '.ap-dialog';
var TRIGGERS = ['click'];
var WEBITEM_UID_KEY = 'dialog-target-uid';
var DEFAULT_WEBITEM_OPTIONS = {
  chrome: true
};

var DialogWebItem = function () {
  function DialogWebItem() {
    _classCallCheck(this, DialogWebItem);

    this._dialogWebItem = {
      name: ITEM_NAME,
      selector: SELECTOR,
      triggers: TRIGGERS
    };
  }

  _createClass(DialogWebItem, [{
    key: 'getWebItem',
    value: function getWebItem() {
      return this._dialogWebItem;
    }
  }, {
    key: '_dialogOptions',
    value: function _dialogOptions(options) {
      return _underscore2.default.extend({}, DEFAULT_WEBITEM_OPTIONS, options || {});
    }
  }, {
    key: 'triggered',
    value: function triggered(data) {
      var $target = $(data.event.currentTarget);
      var webitemId = $target.data(WEBITEM_UID_KEY);
      var dialogOptions = this._dialogOptions(data.extension.options);
      dialogOptions.id = webitemId;
      _dialog_extension_actions2.default.open(data.extension, dialogOptions);
    }
  }, {
    key: 'createIfNotExists',
    value: function createIfNotExists(data) {
      var $target = $(data.event.currentTarget);
      var uid = $target.data(WEBITEM_UID_KEY);

      if (!uid) {
        uid = _webitem2.default.uniqueId();
        $target.data(WEBITEM_UID_KEY, uid);
      }
    }
  }]);

  return DialogWebItem;
}();

var dialogInstance = new DialogWebItem();
var webitem = dialogInstance.getWebItem();
_event_dispatcher2.default.register('webitem-invoked:' + webitem.name, function (data) {
  dialogInstance.triggered(data);
});
_event_dispatcher2.default.register('before:webitem-invoked:' + webitem.name, dialogInstance.createIfNotExists);

_webitem_actions2.default.addWebItem(webitem);
exports.default = dialogInstance;

},{"../underscore":47,"actions/dialog_extension_actions":13,"actions/webitem_actions":23,"dispatchers/event_dispatcher":37,"utils/dialog":50,"utils/webitem":54}],28:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _flag_actions = _dereq_('actions/flag_actions');

var _flag_actions2 = _interopRequireDefault(_flag_actions);

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FLAGID_PREFIX = 'ap-flag-';
var AUI_FLAG = undefined;

window.require(['aui/flag'], function (f) {
  AUI_FLAG = f;
});

var Flag = function () {
  function Flag() {
    _classCallCheck(this, Flag);
  }

  _createClass(Flag, [{
    key: '_toHtmlString',
    value: function _toHtmlString(str) {
      if (_dollar2.default.type(str) === 'string') {
        return str;
      } else if (_dollar2.default.type(str) === 'object' && str instanceof _dollar2.default) {
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
      var $auiFlag = (0, _dollar2.default)(auiFlag);
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

var FlagComponent = new Flag();

(0, _dollar2.default)(document).on('aui-flag-close', function (e) {
  var _id = e.target.id;
  _flag_actions2.default.closed(_id);
});

_event_dispatcher2.default.register('flag-close', function (data) {
  FlagComponent.close(data.id);
});

exports.default = FlagComponent;

},{"../dollar":38,"actions/flag_actions":17,"dispatchers/event_dispatcher":37}],29:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

var _iframe_actions = _dereq_('actions/iframe_actions');

var _iframe_actions2 = _interopRequireDefault(_iframe_actions);

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _util = _dereq_('../util');

var _util2 = _interopRequireDefault(_util);

var _host = _dereq_('simple-xdm/host');

var _host2 = _interopRequireDefault(_host);

var _url = _dereq_('utils/url');

var _url2 = _interopRequireDefault(_url);

var _jwt_actions = _dereq_('actions/jwt_actions');

var _jwt_actions2 = _interopRequireDefault(_jwt_actions);

var _iframe = _dereq_('utils/iframe');

var _iframe2 = _interopRequireDefault(_iframe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CONTAINER_CLASSES = ['ap-container'];

var Iframe = function () {
  function Iframe() {
    _classCallCheck(this, Iframe);

    this._contentResolver = false;
  }

  _createClass(Iframe, [{
    key: 'setContentResolver',
    value: function setContentResolver(callback) {
      this._contentResolver = callback;
    }
  }, {
    key: 'resize',
    value: function resize(width, height, $el) {
      width = _util2.default.stringToDimension(width);
      height = _util2.default.stringToDimension(height);
      $el.css({
        width: width,
        height: height
      });
      $el.trigger('resized', { width: width, height: height });
    }
  }, {
    key: 'simpleXdmExtension',
    value: function simpleXdmExtension(extension, $container) {
      if (!extension.url || _url2.default.hasJwt(extension.url) && _url2.default.isJwtExpired(extension.url)) {
        if (this._contentResolver) {
          _jwt_actions2.default.requestRefreshUrl({
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
      var iframeAttributes = _host2.default.create(extension, function () {
        if (!extension.options) {
          extension.options = {};
        }
        _iframe_actions2.default.notifyBridgeEstablished(extension.$el, extension);
      }, function () {
        _iframe_actions2.default.notifyUnloaded(extension.$el, extension);
      });
      extension.id = iframeAttributes.id;
      _dollar2.default.extend(iframeAttributes, _iframe2.default.optionsToAttributes(extension.options));
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
      _iframe_actions2.default.notifyIframeCreated(extension.$el, extension);
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
      return (0, _dollar2.default)('<iframe />').attr(attributes).addClass('ap-iframe');
    }
  }]);

  return Iframe;
}();

var IframeComponent = new Iframe();

_event_dispatcher2.default.register('iframe-resize', function (data) {
  IframeComponent.resize(data.width, data.height, data.$el);
});

_event_dispatcher2.default.register('content-resolver-register-by-extension', function (data) {
  IframeComponent.setContentResolver(data.callback);
});

_event_dispatcher2.default.register('jwt-url-refreshed', function (data) {
  IframeComponent.resolverResponse(data);
});

_event_dispatcher2.default.register('after:iframe-bridge-established', function (data) {
  data.$el[0].bridgeEstablished = true;
});

exports.default = IframeComponent;

},{"../dollar":38,"../util":48,"actions/iframe_actions":18,"actions/jwt_actions":20,"dispatchers/event_dispatcher":37,"simple-xdm/host":4,"utils/iframe":51,"utils/url":53}],30:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _iframe = _dereq_('components/iframe');

var _iframe2 = _interopRequireDefault(_iframe);

var _loading_indicator = _dereq_('components/loading_indicator');

var _loading_indicator2 = _interopRequireDefault(_loading_indicator);

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CONTAINER_CLASSES = ['ap-iframe-container'];

var IframeContainer = function () {
  function IframeContainer() {
    _classCallCheck(this, IframeContainer);
  }

  _createClass(IframeContainer, [{
    key: 'createExtension',
    value: function createExtension(extension, options) {
      var $container = this._renderContainer();
      if (!options || options.loadingIndicator !== false) {
        $container.append(this._renderLoadingIndicator());
      }
      _iframe2.default.simpleXdmExtension(extension, $container);
      return $container;
    }
  }, {
    key: '_renderContainer',
    value: function _renderContainer(attributes) {
      var container = (0, _dollar2.default)('<div />').attr(attributes || {});
      container.addClass(CONTAINER_CLASSES.join(' '));
      return container;
    }
  }, {
    key: '_renderLoadingIndicator',
    value: function _renderLoadingIndicator() {
      return _loading_indicator2.default.render();
    }
  }]);

  return IframeContainer;
}();

var IframeContainerComponent = new IframeContainer();

_event_dispatcher2.default.register('iframe-create', function (data) {
  var id = 'embedded-' + data.extension.id;
  data.extension.$el.parents('.ap-iframe-container').attr('id', id);
});

exports.default = IframeContainerComponent;

},{"../dollar":38,"components/iframe":29,"components/loading_indicator":33,"dispatchers/event_dispatcher":37}],31:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

var _inline_dialog_actions = _dereq_('actions/inline_dialog_actions');

var _inline_dialog_actions2 = _interopRequireDefault(_inline_dialog_actions);

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _util = _dereq_('../util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InlineDialog = function () {
  function InlineDialog() {
    _classCallCheck(this, InlineDialog);
  }

  _createClass(InlineDialog, [{
    key: 'resize',
    value: function resize(data) {
      var width = _util2.default.stringToDimension(data.width);
      var height = _util2.default.stringToDimension(data.height);
      var $content = data.$el.find('.contents');
      if ($content.length === 1) {
        $content.css({
          width: width,
          height: height
        });
        _inline_dialog_actions2.default.refresh(data.$el);
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
      return (0, _dollar2.default)('<div />').addClass('aui-inline-dialog-contents');
    }
  }, {
    key: '_displayInlineDialog',
    value: function _displayInlineDialog(data) {
      _inline_dialog_actions2.default.created({
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
      (0, _dollar2.default)('.aui-inline-dialog').filter(function () {
        return (0, _dollar2.default)(this).find('.ap-iframe-container').length > 0;
      }).hide();
    }
  }, {
    key: 'render',
    value: function render(data) {
      var _this = this;

      var $inlineDialog = (0, _dollar2.default)(document.getElementById('inline-dialog-' + data.id));

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

_event_dispatcher2.default.register('iframe-resize', function (data) {
  var container = data.$el.parents('.aui-inline-dialog');
  if (container.length === 1) {
    InlineDialogComponent.resize({
      width: data.width,
      height: data.height,
      $el: container
    });
  }
});

_event_dispatcher2.default.register('inline-dialog-refresh', function (data) {
  InlineDialogComponent.refresh(data.$el);
});

_event_dispatcher2.default.register('inline-dialog-hide', function (data) {
  InlineDialogComponent.hideInlineDialog(data.$el);
});

_event_dispatcher2.default.register('inline-dialog-close', function (data) {
  InlineDialogComponent.closeInlineDialog();
});

exports.default = InlineDialogComponent;

},{"../dollar":38,"../util":48,"actions/inline_dialog_actions":19,"dispatchers/event_dispatcher":37}],32:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _webitem_actions = _dereq_('actions/webitem_actions');

var _webitem_actions2 = _interopRequireDefault(_webitem_actions);

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

var _inline_dialog = _dereq_('components/inline_dialog');

var _inline_dialog2 = _interopRequireDefault(_inline_dialog);

var _webitem = _dereq_('components/webitem');

var _webitem2 = _interopRequireDefault(_webitem);

var _webitem3 = _dereq_('utils/webitem');

var _webitem4 = _interopRequireDefault(_webitem3);

var _iframe_container = _dereq_('components/iframe_container');

var _iframe_container2 = _interopRequireDefault(_iframe_container);

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _create = _dereq_('../create');

var _create2 = _interopRequireDefault(_create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ITEM_NAME = 'inline-dialog';
var SELECTOR = '.ap-inline-dialog';
var TRIGGERS = ['mouseover', 'click'];
var WEBITEM_UID_KEY = 'inline-dialog-target-uid';

var InlineDialogWebItem = function () {
  function InlineDialogWebItem() {
    _classCallCheck(this, InlineDialogWebItem);

    this._inlineDialogWebItemSpec = {
      name: ITEM_NAME,
      selector: SELECTOR,
      triggers: TRIGGERS
    };
    this._inlineDialogWebItems = {};
  }

  _createClass(InlineDialogWebItem, [{
    key: 'getWebItem',
    value: function getWebItem() {
      return this._inlineDialogWebItemSpec;
    }
  }, {
    key: '_createInlineDialog',
    value: function _createInlineDialog(data) {
      var $iframeContainer = _iframe_container2.default.createExtension(data.extension);
      var $inlineDialog = _inline_dialog2.default.render({
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
      var $target = (0, _dollar2.default)(data.event.currentTarget);
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
      var contentRequest = _webitem2.default.requestContent(data.extension);
      if (!contentRequest) {
        console.warn('no content resolver found');
        return false;
      }
      contentRequest.then(function (content) {
        content.options = {
          autoresize: true,
          widthinpx: true
        };
        var addon = (0, _create2.default)(content);
        data.$el.empty().append(addon);
      });
    }
  }, {
    key: 'createIfNotExists',
    value: function createIfNotExists(data) {
      var $target = (0, _dollar2.default)(data.event.currentTarget);
      var uid = $target.data(WEBITEM_UID_KEY);

      if (!uid) {
        uid = _webitem4.default.uniqueId();
        $target.data(WEBITEM_UID_KEY, uid);
      }
    }
  }]);

  return InlineDialogWebItem;
}();

var inlineDialogInstance = new InlineDialogWebItem();
var webitem = inlineDialogInstance.getWebItem();
_event_dispatcher2.default.register('before:webitem-invoked:' + webitem.name, function (data) {
  inlineDialogInstance.createIfNotExists(data);
});
_event_dispatcher2.default.register('webitem-invoked:' + webitem.name, function (data) {
  inlineDialogInstance.triggered(data);
});
_event_dispatcher2.default.register('inline-dialog-opened', function (data) {
  inlineDialogInstance.opened(data);
});
_webitem_actions2.default.addWebItem(webitem);

exports.default = inlineDialogInstance;

},{"../create":35,"../dollar":38,"actions/webitem_actions":23,"components/iframe_container":30,"components/inline_dialog":31,"components/webitem":34,"dispatchers/event_dispatcher":37,"utils/webitem":54}],33:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

var _loading_indicator_actions = _dereq_('actions/loading_indicator_actions');

var _loading_indicator_actions2 = _interopRequireDefault(_loading_indicator_actions);

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _util = _dereq_('../util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LOADING_INDICATOR_CLASS = 'ap-status-indicator';

var LOADING_STATUSES = {
  loading: '<div class="ap-loading"><div class="small-spinner"></div>Loading add-on...</div>',
  'load-timeout': '<div class="ap-load-timeout"><div class="small-spinner"></div>Add-on is not responding. Wait or <a href="#" class="ap-btn-cancel">cancel</a>?</div>',
  'load-error': 'Add-on failed to load.'
};

var LOADING_TIMEOUT = 12000;

var LoadingIndicator = function () {
  function LoadingIndicator() {
    _classCallCheck(this, LoadingIndicator);

    this._stateRegistry = {};
  }

  _createClass(LoadingIndicator, [{
    key: '_loadingContainer',
    value: function _loadingContainer($iframeContainer) {
      return $iframeContainer.find('.' + LOADING_INDICATOR_CLASS);
    }
  }, {
    key: 'render',
    value: function render() {
      var $container = (0, _dollar2.default)('<div />').addClass(LOADING_INDICATOR_CLASS);
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
        _loading_indicator_actions2.default.timeout($container, extension);
      }, LOADING_TIMEOUT);
    }
  }, {
    key: 'timeout',
    value: function timeout($iframeContainer, extensionId) {
      var status = (0, _dollar2.default)(LOADING_STATUSES['load-timeout']);
      var container = this._loadingContainer($iframeContainer);
      container.empty().append(status);
      (0, _dollar2.default)('a.ap-btn-cancel', container).click(function () {
        _loading_indicator_actions2.default.cancelled($iframeContainer, extensionId);
      });
      delete this._stateRegistry[extensionId];
      return container;
    }
  }]);

  return LoadingIndicator;
}();

var LoadingComponent = new LoadingIndicator();

_event_dispatcher2.default.register('iframe-create', function (data) {
  LoadingComponent._setupTimeout(data.$el.parents('.ap-iframe-container'), data.extension);
});

_event_dispatcher2.default.register('iframe-bridge-established', function (data) {
  LoadingComponent.hide(data.$el.parents('.ap-iframe-container'), data.extension.id);
});

_event_dispatcher2.default.register('iframe-bridge-timeout', function (data) {
  LoadingComponent.timeout(data.$el, data.extension.id);
});

_event_dispatcher2.default.register('iframe-bridge-cancelled', function (data) {
  LoadingComponent.cancelled(data.$el, data.extension.id);
});

exports.default = LoadingComponent;

},{"../dollar":38,"../util":48,"actions/loading_indicator_actions":21,"dispatchers/event_dispatcher":37}],34:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _underscore = _dereq_('../underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

var _webitem_actions = _dereq_('actions/webitem_actions');

var _webitem_actions2 = _interopRequireDefault(_webitem_actions);

var _webitem = _dereq_('utils/webitem');

var _webitem2 = _interopRequireDefault(_webitem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebItem = function () {
  function WebItem() {
    _classCallCheck(this, WebItem);

    this._webitems = {};
    this._contentResolver = function noop() {};
  }

  _createClass(WebItem, [{
    key: 'setContentResolver',
    value: function setContentResolver(resolver) {
      this._contentResolver = resolver;
    }
  }, {
    key: 'requestContent',
    value: function requestContent(extension) {
      if (extension.addon_key && extension.key) {
        return this._contentResolver.call(null, _underscore2.default.extend({ classifier: 'json' }, extension));
      }
    }
  }, {
    key: 'getWebItemsBySelector',
    value: function getWebItemsBySelector(selector) {
      return _underscore2.default.find(this._webitems, function (obj) {
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

      var onTriggers = _webitem2.default.sanitizeTriggers(webitem.triggers);
      (0, _dollar2.default)(function () {
        (0, _dollar2.default)('body').off(onTriggers, webitem.selector, _this._webitems[webitem.name]._on);
      });
      delete this._webitems[webitem.name]._on;
    }
  }, {
    key: '_addTriggers',
    value: function _addTriggers(webitem) {
      var onTriggers = _webitem2.default.sanitizeTriggers(webitem.triggers);
      webitem._on = function (event) {
        event.preventDefault();
        var $target = (0, _dollar2.default)(event.target).closest(webitem.selector);
        var extension = {
          addon_key: _webitem2.default.getExtensionKey($target),
          key: _webitem2.default.getKey($target),
          options: _webitem2.default.getOptionsForWebItem($target)
        };

        _webitem_actions2.default.webitemInvoked(webitem, event, extension);
      };
      (0, _dollar2.default)(function () {
        (0, _dollar2.default)('body').on(onTriggers, webitem.selector, webitem._on);
      });
    }
  }]);

  return WebItem;
}();

var webItemInstance = new WebItem();

_event_dispatcher2.default.register('webitem-added', function (data) {
  webItemInstance._addTriggers(data.webitem);
});

_event_dispatcher2.default.register('content-resolver-register-by-extension', function (data) {
  webItemInstance.setContentResolver(data.callback);
});

exports.default = webItemInstance;

},{"../dollar":38,"../underscore":47,"actions/webitem_actions":23,"dispatchers/event_dispatcher":37,"utils/webitem":54}],35:[function(_dereq_,module,exports){
'use strict';

var _dollar = _dereq_('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

var _iframe_container = _dereq_('components/iframe_container');

var _iframe_container2 = _interopRequireDefault(_iframe_container);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function create(extension) {
  var simpleXdmExtension = {
    addon_key: extension.addon_key,
    key: extension.key,
    url: extension.url,
    options: extension.options
  };
  return _iframe_container2.default.createExtension(simpleXdmExtension);

  // return IframeComponent.simpleXdmExtension(simpleXdmExtension);
}

module.exports = create;

},{"./dollar":38,"components/iframe_container":30,"dispatchers/event_dispatcher":37}],36:[function(_dereq_,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
    _classCallCheck(this, AnalyticsDispatcher);

    this._addons = {};
  }

  _createClass(AnalyticsDispatcher, [{
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
_event_dispatcher2.default.register('iframe-create', function (data) {
  analytics.trackLoadingStarted(data.extension);
});
_event_dispatcher2.default.register('iframe-bridge-established', function (data) {
  analytics.trackLoadingEnded(data.extension);
});
_event_dispatcher2.default.register('iframe-bridge-timeout', function (data) {
  analytics.trackLoadingTimeout(data.extension);
});
_event_dispatcher2.default.register('iframe-bridge-cancelled', function (data) {
  analytics.trackLoadingCancel(data.extension);
});
_event_dispatcher2.default.register('analytics-deprecated-method-used', function (data) {
  analytics.trackUseOfDeprecatedMethod(data.methodUsed, data.extension);
});

module.exports = analytics;

},{"dispatchers/event_dispatcher":37}],37:[function(_dereq_,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _underscore = _dereq_('../underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _events = _dereq_('events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * pub/sub for extension state (created, destroyed, initialized)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * taken from hipchat webcore
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               **/


var EventDispatcher = function (_EventEmitter) {
  _inherits(EventDispatcher, _EventEmitter);

  function EventDispatcher() {
    _classCallCheck(this, EventDispatcher);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EventDispatcher).call(this));

    _this.setMaxListeners(20);
    return _this;
  }

  _createClass(EventDispatcher, [{
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

      if (_underscore2.default.isString(action)) {
        this.once(action, callback);
      } else if (_underscore2.default.isObject(action)) {
        _underscore2.default.keys(action).forEach(function (val, key) {
          _this2.once(key, val);
        }, this);
      }
    }
  }, {
    key: 'register',
    value: function register(action, callback) {
      var _this3 = this;

      if (_underscore2.default.isString(action)) {
        this.on(action, callback);
      } else if (_underscore2.default.isObject(action)) {
        _underscore2.default.keys(action).forEach(function (val, key) {
          _this3.on(key, val);
        }, this);
      }
    }
  }, {
    key: 'unregister',
    value: function unregister(action, callback) {
      var _this4 = this;

      if (_underscore2.default.isString(action)) {
        this.removeListener(action, callback);
      } else if (_underscore2.default.isObject(action)) {
        _underscore2.default.keys(action).forEach(function (val, key) {
          _this4.removeListener(key, val);
        }, this);
      }
    }
  }]);

  return EventDispatcher;
}(_events.EventEmitter);

module.exports = new EventDispatcher();

},{"../underscore":47,"events":2}],38:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * The iframe-side code exposes a jquery-like implementation via _dollar.
 * This runs on the product side to provide AJS.$ under a _dollar module to provide a consistent interface
 * to code that runs on host and iframe.
 */
exports.default = AJS.$;

},{}],39:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _analytics_dispatcher = _dereq_('dispatchers/analytics_dispatcher');

var _analytics_dispatcher2 = _interopRequireDefault(_analytics_dispatcher);

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

var _host = _dereq_('simple-xdm/host');

var _host2 = _interopRequireDefault(_host);

var _jwt_actions = _dereq_('actions/jwt_actions');

var _jwt_actions2 = _interopRequireDefault(_jwt_actions);

var _events = _dereq_('./modules/events');

var _events2 = _interopRequireDefault(_events);

var _create = _dereq_('./create');

var _create2 = _interopRequireDefault(_create);

var _dialog = _dereq_('./modules/dialog');

var _dialog2 = _interopRequireDefault(_dialog);

var _env = _dereq_('./modules/env');

var _env2 = _interopRequireDefault(_env);

var _inlineDialog = _dereq_('./modules/inline-dialog');

var _inlineDialog2 = _interopRequireDefault(_inlineDialog);

var _loading_indicator = _dereq_('./components/loading_indicator');

var _loading_indicator2 = _interopRequireDefault(_loading_indicator);

var _messages = _dereq_('./modules/messages');

var _messages2 = _interopRequireDefault(_messages);

var _flag = _dereq_('./modules/flag');

var _flag2 = _interopRequireDefault(_flag);

var _analytics = _dereq_('./modules/analytics');

var _analytics2 = _interopRequireDefault(_analytics);

var _module_actions = _dereq_('actions/module_actions');

var _module_actions2 = _interopRequireDefault(_module_actions);

var _dom_event_actions = _dereq_('actions/dom_event_actions');

var _dom_event_actions2 = _interopRequireDefault(_dom_event_actions);

var _underscore = _dereq_('./underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _event_actions = _dereq_('actions/event_actions');

var _event_actions2 = _interopRequireDefault(_event_actions);

var _iframe_actions = _dereq_('actions/iframe_actions');

var _iframe_actions2 = _interopRequireDefault(_iframe_actions);

var _dialog_extension_actions = _dereq_('actions/dialog_extension_actions');

var _dialog_extension_actions2 = _interopRequireDefault(_dialog_extension_actions);

var _inline_dialog_webitem = _dereq_('components/inline_dialog_webitem');

var _inline_dialog_webitem2 = _interopRequireDefault(_inline_dialog_webitem);

var _dialog_webitem = _dereq_('components/dialog_webitem');

var _dialog_webitem2 = _interopRequireDefault(_dialog_webitem);

var _dialog_extension = _dereq_('components/dialog_extension');

var _dialog_extension2 = _interopRequireDefault(_dialog_extension);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  window._AP.version = 'v5.0.0-alpha.5';
}

_host2.default.defineModule('messages', _messages2.default);
_host2.default.defineModule('flag', _flag2.default);
_host2.default.defineModule('dialog', _dialog2.default);
_host2.default.defineModule('inlineDialog', _inlineDialog2.default);
_host2.default.defineModule('env', _env2.default);
_host2.default.defineModule('events', _events2.default);
_host2.default.defineModule('_analytics', _analytics2.default);

// rpc.extend(propagator);

_event_dispatcher2.default.register('module-define-custom', function (data) {
  _host2.default.defineModule(data.name, data.methods);
});

_host2.default.registerRequestNotifier(function (data) {
  _analytics_dispatcher2.default.dispatch('bridge.invokemethod', {
    module: data.module,
    fn: data.fn,
    addonKey: data.addon_key,
    moduleKey: data.key
  });
});

exports.default = {
  dialog: {
    create: function create(extension, dialogOptions) {
      _dialog_extension_actions2.default.open(extension, dialogOptions);
    },
    close: function close() {
      _dialog_extension_actions2.default.close();
    }
  },
  onKeyEvent: function onKeyEvent(extension_id, key, modifiers, callback) {
    _dom_event_actions2.default.registerKeyEvent({ extension_id: extension_id, key: key, modifiers: modifiers, callback: callback });
  },
  offKeyEvent: function offKeyEvent(extension_id, key, modifiers, callback) {
    _dom_event_actions2.default.unregisterKeyEvent({ extension_id: extension_id, key: key, modifiers: modifiers, callback: callback });
  },
  onIframeEstablished: function onIframeEstablished(callback) {
    _event_dispatcher2.default.register('after:iframe-bridge-established', function (data) {
      callback.call(null, {
        $el: data.$el,
        extension: _underscore2.default.pick(data.extension, ['id', 'addon_key', 'key', 'options', 'url'])
      });
    });
  },
  onIframeUnload: function onIframeUnload(callback) {
    _event_dispatcher2.default.register('after:iframe-unload', function (data) {
      callback.call(null, {
        $el: data.$el,
        extension: _underscore2.default.pick(data.extension, ['id', 'addon_key', 'key', 'options', 'url'])
      });
    });
  },
  destroy: function destroy(extension_id) {
    _iframe_actions2.default.notifyIframeDestroyed({ extension_id: extension_id });
  },
  registerContentResolver: {
    resolveByExtension: function resolveByExtension(callback) {
      _jwt_actions2.default.registerContentResolver({ callback: callback });
    }
  },
  defineModule: function defineModule(name, methods) {
    _module_actions2.default.defineCustomModule(name, methods);
  },
  broadcastEvent: function broadcastEvent(type, targetSpec, event) {
    _event_actions2.default.broadcast(type, targetSpec, event);
  },
  create: _create2.default,
  getExtensions: function getExtensions(filter) {
    return _host2.default.getExtensions(filter);
  }
};

},{"./components/loading_indicator":33,"./create":35,"./modules/analytics":40,"./modules/dialog":41,"./modules/env":42,"./modules/events":43,"./modules/flag":44,"./modules/inline-dialog":45,"./modules/messages":46,"./underscore":47,"actions/dialog_extension_actions":13,"actions/dom_event_actions":14,"actions/event_actions":16,"actions/iframe_actions":18,"actions/jwt_actions":20,"actions/module_actions":22,"components/dialog_extension":26,"components/dialog_webitem":27,"components/inline_dialog_webitem":32,"dispatchers/analytics_dispatcher":36,"dispatchers/event_dispatcher":37,"simple-xdm/host":4}],40:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _analytics_action = _dereq_('actions/analytics_action');

var _analytics_action2 = _interopRequireDefault(_analytics_action);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  trackDeprecatedMethodUsed: function trackDeprecatedMethodUsed(methodUsed, callback) {
    _analytics_action2.default.trackDeprecatedMethodUsed(methodUsed, callback._context.extension);
  }
};

},{"actions/analytics_action":10}],41:[function(_dereq_,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

var _dialog_extension_actions = _dereq_('actions/dialog_extension_actions');

var _dialog_extension_actions2 = _interopRequireDefault(_dialog_extension_actions);

var _dialog_actions = _dereq_('actions/dialog_actions');

var _dialog_actions2 = _interopRequireDefault(_dialog_actions);

var _event_actions = _dereq_('actions/event_actions');

var _event_actions2 = _interopRequireDefault(_event_actions);

var _dialog_extension = _dereq_('components/dialog_extension');

var _dialog_extension2 = _interopRequireDefault(_dialog_extension);

var _util = _dereq_('../util');

var _util2 = _interopRequireDefault(_util);

var _button = _dereq_('components/button');

var _button2 = _interopRequireDefault(_button);

var _dialog = _dereq_('utils/dialog');

var _dialog2 = _interopRequireDefault(_dialog);

var _underscore = _dereq_('../underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _dialogs = {};

_event_dispatcher2.default.register('dialog-close', function (data) {
  var dialog = data.dialog;
  if (dialog && data.extension) {
    _event_actions2.default.broadcast('dialog.close', {
      addon_key: data.extension.addon_key
    }, data.customData);
  }
});

_event_dispatcher2.default.register('dialog-button-click', function (data) {
  var eventData = {
    button: {
      name: _button2.default.getName(data.$el),
      identifier: _button2.default.getIdentifier(data.$el),
      text: _button2.default.getText(data.$el)
    }
  };
  var eventName = 'dialog.button.click';

  // Old buttons, (submit and cancel) use old events
  if (!data.$el.hasClass('ap-dialog-custom-button')) {
    eventName = 'dialog.' + eventData.button.name;
  }

  _event_actions2.default.broadcast(eventName, {
    addon_key: data.extension.addon_key,
    key: data.extension.key
  }, eventData);
});

/**
 * @class Dialog~Dialog
 * @description A dialog object that is returned when a dialog is created using the [dialog module](module-Dialog.html).
 */

var Dialog = function Dialog(options, callback) {
  _classCallCheck(this, Dialog);

  var _id = callback._id;
  var extension = callback._context.extension;

  var dialogExtension = {
    addon_key: extension.addon_key,
    key: options.key,
    options: _underscore2.default.pick(callback._context.extension.options, ['customData', 'productContext'])
  };

  // ACJS-185: the following is a really bad idea but we need it
  // for compat until AP.dialog.customData has been deprecated
  dialogExtension.options.customData = options.customData;
  // terrible idea! - we need to remove this from p2 ASAP!
  var dialogModuleOptions = _dialog2.default.moduleOptionsFromGlobal(dialogExtension.addon_key, dialogExtension.key);
  options = _underscore2.default.extend({}, dialogModuleOptions || {}, options);
  options.id = _id;

  _dialog_extension_actions2.default.open(dialogExtension, options);
  this.customData = options.customData;
  _dialogs[_id] = this;
};

/**
 * @class Dialog~DialogButton
 * @description A dialog button that can be controlled with JavaScript
 */


var Button = function () {
  function Button(identifier) {
    _classCallCheck(this, Button);

    if (!_dialog_extension2.default.getActiveDialog()) {
      throw new Error('Failed to find an active dialog.');
    }
    this.name = identifier;
    this.identifier = identifier;
    this.enabled = _dialog_extension2.default.buttonIsEnabled(identifier);
    this.hidden = !_dialog_extension2.default.buttonIsVisible(identifier);
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


  _createClass(Button, [{
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
      _dialog_actions2.default.toggleButton({
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
      if (this.enabled) {
        _dialog_actions2.default.dialogMessage({
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
      _dialog_actions2.default.toggleButtonVisibility({
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
  _classCallCheck(this, CreateButton);

  _dialog_extension_actions2.default.addUserButton({
    identifier: options.identifier,
    text: options.text
  }, callback._context.extension);
};

/**
 * The Dialog module provides a mechanism for launching an add-on's modules as modal dialogs from within an add-on's iframe.
 * A modal dialog displays information without requiring the user to leave the current page.
 * The dialog is opened over the entire window, rather than within the iframe itself.
 *
 * <h3>Styling your dialog to look like a standard Atlassian dialog</h3>
 *
 * By default the dialog iframe is undecorated. It's up to you to style the dialog.
 * <img src="../assets/images/connectdialogchromelessexample.jpeg" width="100%" />
 *
 * In order to maintain a consistent look and feel between the host application and the add-on,
 * we encourage you to style your dialogs to match Atlassian's Design Guidelines for modal dialogs.
 * To do that, you'll need to add the AUI styles to your dialog.
 *
 * For more information, read about the Atlassian User Interface [dialog component](https://docs.atlassian.com/aui/latest/docs/dialog.html).
 * @exports Dialog
 */


module.exports = {
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
    if (!$.isFunction(callback)) {
      callback = data;
      data = {};
    }
    var dialogToClose;
    if (callback._context.extension.options.isDialog) {
      dialogToClose = _dialog_extension2.default.getByExtension(callback._context.extension.id)[0];
    } else {
      dialogToClose = _dialog_extension2.default.getActiveDialog();
    }

    _dialog_actions2.default.close({
      customData: data,
      dialog: dialogToClose,
      extension: callback._context.extension
    });
  },
  /**
   * Returns the data Object passed to the dialog at creation.
   * @noDemo
   * @name customData
   * @method
   * @param {Function} callback - Callback method to be executed with the custom data.
   * @example
   * AP.require('dialog', function(dialog){
   *   var myDataVariable = dialog.customData.myDataVariable;
   * });
   *
   * @return {Object} Data Object passed to the dialog on creation.
   */
  getCustomData: function getCustomData(callback) {
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

},{"../underscore":47,"../util":48,"actions/dialog_actions":12,"actions/dialog_extension_actions":13,"actions/event_actions":16,"components/button":24,"components/dialog_extension":26,"dispatchers/event_dispatcher":37,"utils/dialog":50}],42:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _env_actions = _dereq_('actions/env_actions');

var _env_actions2 = _interopRequireDefault(_env_actions);

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

var _util = _dereq_('../util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debounce = AJS.debounce || _dollar2.default.debounce;

exports.default = {
  getLocation: function getLocation(callback) {
    callback(window.location.href);
  },
  resize: debounce(function (width, height, callback) {
    var options = callback._context.extension.options;
    if (options && !options.isDialog) {
      _env_actions2.default.iframeResize(width, height, callback._context);
    }
  }),

  sizeToParent: debounce(function (callback) {
    // sizeToParent is only available for general-pages
    if (callback._context.extension.options.isFullPage) {
      // This adds border between the iframe and the page footer as the connect addon has scrolling content and can't do this
      _util2.default.getIframeByExtensionId(callback._context.extension_id).addClass('full-size-general-page');
      _event_dispatcher2.default.register('host-window-resize', function (data) {
        _env_actions2.default.sizeToParent(callback._context);
      });
      _env_actions2.default.sizeToParent(callback._context);
    } else {
      // This is only here to support integration testing
      // see com.atlassian.plugin.connect.test.pageobjects.RemotePage#isNotFullSize()
      _util2.default.getIframeByExtensionId(callback._context.extension_id).addClass('full-size-general-page-fail');
    }
  })
};

},{"../dollar":38,"../util":48,"actions/env_actions":15,"dispatchers/event_dispatcher":37}],43:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _underscore = _dereq_('../underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _event_actions = _dereq_('actions/event_actions');

var _event_actions2 = _interopRequireDefault(_event_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  emit: function emit(name) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var callback = _underscore2.default.last(args);
    args = _underscore2.default.first(args, -1);
    _event_actions2.default.broadcast(name, {
      addon_key: callback._context.extension.addon_key
    }, args);
  }
};

},{"../underscore":47,"actions/event_actions":16}],44:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * Flags are the primary method for providing system feedback in the product user interface. Messages include notifications of various kinds: alerts, confirmations, notices, warnings, info and errors.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * @module Flag
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _event_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

var _flag_actions = _dereq_('actions/flag_actions');

var _flag_actions2 = _interopRequireDefault(_flag_actions);

var _flag = _dereq_('components/flag');

var _flag2 = _interopRequireDefault(_flag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _flags = {};

/**
* @class Flag~Flag
* @description A flag object created by the [AP.flag]{@link module:Flag} module.
*/

var Flag = function () {
  function Flag(options, callback) {
    _classCallCheck(this, Flag);

    this.flag = _flag2.default.render({
      type: options.type,
      title: options.title,
      body: AJS.escapeHtml(options.body),
      close: options.close,
      id: callback._id
    });

    _flag_actions2.default.open(this.flag.attr('id'));

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


  _createClass(Flag, [{
    key: 'on',
    value: function on(event, callback) {
      var id = this.flag.id;
      if (_dollar2.default.isFunction(callback)) {
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

_event_dispatcher2.default.register('flag-closed', function (data) {
  if (_flags[data.id] && _dollar2.default.isFunction(_flags[data.id].onTriggers['close'])) {
    _flags[data.id].onTriggers['close']();
  }
  if (_flags[data.id]) {
    delete _flags[data.id];
  }
});

exports.default = {
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

},{"../dollar":38,"actions/flag_actions":17,"components/flag":28,"dispatchers/event_dispatcher":37}],45:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _inline_dialog_actions = _dereq_('actions/inline_dialog_actions');

var _inline_dialog_actions2 = _interopRequireDefault(_inline_dialog_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
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
    _inline_dialog_actions2.default.close();
  }
}; /**
    * The inline dialog is a wrapper for secondary content/controls to be displayed on user request. Consider this component as displayed in context to the triggering control with the dialog overlaying the page content.
    * A inline dialog should be preferred over a modal dialog when a connection between the action has a clear benefit versus having a lower user focus.
    *
    * Inline dialogs can be shown via a [web item target](../modules/common/web-item.html#target).
    *
    * For more information, read about the Atlassian User Interface [inline dialog component](https://docs.atlassian.com/aui/latest/docs/inline-dialog.html).
    * @module inline-dialog
    */

},{"actions/inline_dialog_actions":19}],46:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _underscore = _dereq_('../underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
* This module has been deprecated and may be removed in future releases. Please use the [Flag module](module-Flag.html) instead.
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
  var $msgBar = (0, _dollar2.default)('#' + MESSAGE_BAR_ID);

  if ($msgBar.length < 1) {
    $msgBar = (0, _dollar2.default)('<div id="' + MESSAGE_BAR_ID + '" />').appendTo('body');
  }
  return $msgBar;
}

function filterMessageOptions(options) {
  var copy = {};
  var allowed = ['closeable', 'fadeout', 'delay', 'duration', 'id'];
  if (_underscore2.default.isObject(options)) {
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
  _dollar2.default.extend(options, {
    title: title,
    body: AJS.escapeHtml(body)
  });

  if (_dollar2.default.inArray(name, MESSAGE_TYPES) < 0) {
    throw 'Invalid message type. Must be: ' + MESSAGE_TYPES.join(', ');
  }
  if (validateMessageId(options.id)) {
    AJS.messages[name]($msgBar, options);
    // Calculate the left offset based on the content width.
    // This ensures the message always stays in the centre of the window.
    $msgBar.css('margin-left', '-' + $msgBar.innerWidth() / 2 + 'px');
  }
}

var deprecatedShowMessage = AJS.deprecate.fn(showMessage, 'AP.messages', {
  deprecationType: 'API',
  alternativeName: 'AP.flag',
  sinceVersion: 'ACJS 5.0'
});

(0, _dollar2.default)(document).on('aui-message-close', function (e, $msg) {
  var _id = $msg.attr('id').replace(MSGID_PREFIX, '');
  if (_messages[_id]) {
    if (_dollar2.default.isFunction(_messages[_id].onCloseTrigger)) {
      _messages[_id].onCloseTrigger();
    }
    _messages[_id]._destroy();
  }
});

var toExport = {
  /**
  * Close a message
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
      (0, _dollar2.default)('#' + id).closeMessage();
    }
  },

  /**
  * Trigger an event when a message is closed
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
    var id = msg._id;
    if (_messages[id]) {
      _messages[id].onCloseTrigger = callback;
    }
  }
};

/**
* Show a generic message
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

/**
* Show an error message
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

/**
* Show a warning message
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

/**
* Show a success message
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

/**
* Show an info message
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

/**
* Show a hint message
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
MESSAGE_TYPES.forEach(function (messageType) {
  toExport[messageType] = {
    constructor: function constructor(title, body, options, callback) {
      if (options._context) {
        callback = options;
        options = {};
      }
      var _id = callback._id;
      options.id = MSGID_PREFIX + _id;
      deprecatedShowMessage(messageType, title, body, options);
      _messages[_id] = this;
    }
  };
}, undefined);

exports.default = toExport;

},{"../dollar":38,"../underscore":47}],47:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// AUI includes underscore and exposes it globally.
exports.default = window._;

},{}],48:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _underscore = _dereq_('./underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function escapeSelector(s) {
  if (!s) {
    throw new Error('No selector to escape');
  }
  return s.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, '\\$&');
}

function stringToDimension(value) {
  var percent = false;
  var unit = 'px';

  if (_underscore2.default.isString(value)) {
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

exports.default = {
  escapeSelector: escapeSelector,
  stringToDimension: stringToDimension,
  getIframeByExtensionId: getIframeByExtensionId
};

},{"./underscore":47}],49:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ButtonUtils = function () {
  function ButtonUtils() {
    _classCallCheck(this, ButtonUtils);
  }

  _createClass(ButtonUtils, [{
    key: "randomIdentifier",

    // button identifier for XDM. NOT an id attribute
    value: function randomIdentifier() {
      return Math.random().toString(16).substring(7);
    }
  }]);

  return ButtonUtils;
}();

var buttonUtilsInstance = new ButtonUtils();

exports.default = buttonUtilsInstance;

},{}],50:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _util = _dereq_('../util');

var _util2 = _interopRequireDefault(_util);

var _button = _dereq_('./button');

var _button2 = _interopRequireDefault(_button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DialogUtils = function () {
  function DialogUtils() {
    _classCallCheck(this, DialogUtils);
  }

  _createClass(DialogUtils, [{
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
      var returnval = true;
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
      return _util2.default.stringToDimension(options.width);
    }
  }, {
    key: '_height',
    value: function _height(options) {
      if (options.size) {
        return undefined;
      }
      return _util2.default.stringToDimension(options.height);
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
            identifier = _button2.default.randomIdentifier();
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

exports.default = dialogUtilsInstance;

},{"../dollar":38,"../util":48,"./button":49}],51:[function(_dereq_,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _util = _dereq_('../util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  optionsToAttributes: function optionsToAttributes(options) {
    var sanitized = {};
    if (options && (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
      if (options.width) {
        sanitized.width = _util2.default.stringToDimension(options.width);
      }
      if (options.height) {
        sanitized.height = _util2.default.stringToDimension(options.height);
      }
    }
    return sanitized;
  }
};

},{"../util":48}],52:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = _dereq_('base-64');

var _base2 = _interopRequireDefault(_base);

var _utf = _dereq_('utf8');

var _utf2 = _interopRequireDefault(_utf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  var claimsString = _utf2.default.decode(_base2.default.decode.call(window, encodedClaims));
  return JSON.parse(claimsString);
}

function isJwtExpired(jwtString, skew) {
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

exports.default = {
  parseJwtIssuer: parseJwtIssuer,
  parseJwtClaims: parseJwtClaims,
  isJwtExpired: isJwtExpired
};

},{"base-64":1,"utf8":9}],53:[function(_dereq_,module,exports){
'use strict';

var _jsuri = _dereq_('jsuri');

var _jsuri2 = _interopRequireDefault(_jsuri);

var _jwt = _dereq_('utils/jwt');

var _jwt2 = _interopRequireDefault(_jwt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isJwtExpired(urlStr) {
  var jwtStr = _getJwt(urlStr);
  return _jwt2.default.isJwtExpired(jwtStr);
}

function _getJwt(urlStr) {
  var url = new _jsuri2.default(urlStr);
  return url.getQueryParamValue('jwt');
}

function hasJwt(url) {
  var jwt = _getJwt(url);
  return jwt && _getJwt(url).length !== 0;
}

module.exports = {
  hasJwt: hasJwt,
  isJwtExpired: isJwtExpired
};

},{"jsuri":3,"utils/jwt":52}],54:[function(_dereq_,module,exports){
'use strict';

var _underscore = _dereq_('../underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _jsuri = _dereq_('jsuri');

var _jsuri2 = _interopRequireDefault(_jsuri);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sanitizeTriggers(triggers) {
  var onTriggers;
  if (_underscore2.default.isArray(triggers)) {
    onTriggers = triggers.join(' ');
  } else if (_underscore2.default.isString(triggers)) {
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
  return _underscore2.default.isArray(m) ? m[1] : false;
}

// LEGACY: get module key by webitem for p2
function getKey($target) {
  var cssClass = $target.attr('class');
  var m = cssClass ? cssClass.match(/ap-module-key-([^\s]*)/) : null;
  return _underscore2.default.isArray(m) ? m[1] : false;
}

function getTargetKey($target) {
  var cssClass = $target.attr('class');
  var m = cssClass ? cssClass.match(/ap-target-key-([^\s]*)/) : null;
  return _underscore2.default.isArray(m) ? m[1] : false;
}

function getFullKey($target) {
  return getExtensionKey($target) + '__' + getKey($target);
}

function getModuleOptionsForWebitem(type, $target) {
  var addon_key = getExtensionKey($target);
  var targetKey = getTargetKey($target);
  var moduleType = type + 'Modules';
  if (window._AP && window._AP[moduleType] && window._AP[moduleType][addon_key] && window._AP[moduleType][addon_key][targetKey]) {
    return window._AP[moduleType][addon_key][targetKey].options;
  }
}

// LEGACY - method for handling webitem options for p2
function getOptionsForWebItem($target) {
  var fullKey = getFullKey($target);

  var type = $target.hasClass('ap-inline-dialog') ? 'inlineDialog' : 'dialog';
  var options = getModuleOptionsForWebitem(type, $target);
  if (!options && window._AP && window._AP[type + 'Options']) {
    options = window._AP[type + 'Options'][fullKey] || {};
  }
  if (!options) {
    options = {};
    console.warn('no webitem ' + type + 'Options for ' + fullKey);
  }
  options.productContext = options.productContext || {};
  // create product context from url params
  new _jsuri2.default($target.attr('href')).queryPairs.forEach(function (param) {
    options.productContext[param[0]] = param[1];
  });

  return options;
}

module.exports = {
  sanitizeTriggers: sanitizeTriggers,
  uniqueId: uniqueId,
  getExtensionKey: getExtensionKey,
  getKey: getKey,
  getOptionsForWebItem: getOptionsForWebItem
};

},{"../underscore":47,"jsuri":3}]},{},[39])(39)
});