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
      }
      throw TypeError('Uncaught, unspecified "error" event.');
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
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.host = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _dereq_=="function"&&_dereq_;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof _dereq_=="function"&&_dereq_;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _xdmrpc = _dereq_('./xdmrpc');

var _xdmrpc2 = _interopRequireDefault(_xdmrpc);

var _commonUtil = _dereq_('../common/util');

var _commonUtil2 = _interopRequireDefault(_commonUtil);

var Connect = (function () {
  function Connect() {
    _classCallCheck(this, Connect);

    this._xdm = new _xdmrpc2['default']();
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
      return extension.addon_key + '__' + extension.key + '__' + _commonUtil2['default'].randomString();
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
        origin: _commonUtil2['default'].locationOrigin(),
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
    value: function registerExtension(extension, initCallback) {
      var extension_id = this._createId(extension);
      this._xdm.registerExtension(extension_id, {
        extension: extension,
        initCallback: initCallback
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
})();

module.exports = new Connect();

},{"../common/util":3,"./xdmrpc":4}],2:[function(_dereq_,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _util = _dereq_('./util');

var _util2 = _interopRequireDefault(_util);

var PostMessage = (function () {
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
      listenOn.addEventListener("message", _util2["default"]._bind(this, this._receiveMessage), false);
    }
  }, {
    key: "_receiveMessage",
    value: function _receiveMessage(event) {
      var extensionId = event.data.eid,
          reg = undefined;

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
})();

module.exports = PostMessage;

},{"./util":3}],3:[function(_dereq_,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LOG_PREFIX = "[Simple-XDM] ";

var Util = (function () {
  function Util() {
    _classCallCheck(this, Util);
  }

  _createClass(Util, [{
    key: "locationOrigin",
    value: function locationOrigin() {
      if (!window.location.origin) {
        return window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
      } else {
        return window.location.origin;
      }
    }
  }, {
    key: "randomString",
    value: function randomString() {
      return Math.floor(Math.random() * 1000000000).toString(16);
    }
  }, {
    key: "isString",
    value: function isString(str) {
      return typeof str === "string" || str instanceof String;
    }
  }, {
    key: "argumentsToArray",
    value: function argumentsToArray(arrayLike) {
      return Array.prototype.slice.call(arrayLike);
    }
  }, {
    key: "argumentNames",
    value: function argumentNames(fn) {
      return fn.toString().replace(/((\/\/.*$)|(\/\*[^]*?\*\/))/mg, '') // strip comments
      .replace(/[^(]+\(([^)]*)[^]+/, '$1') // get signature
      .match(/([^\s,]+)/g) || [];
    }
  }, {
    key: "hasCallback",
    value: function hasCallback(args) {
      var length = args.length;
      return length > 0 && typeof args[length - 1] === 'function';
    }
  }, {
    key: "error",
    value: function error(msg) {
      if (window.console) {
        console.error(LOG_PREFIX + msg);
      }
    }
  }, {
    key: "warn",
    value: function warn(msg) {
      if (window.console) {
        console.warn(LOG_PREFIX + msg);
      }
    }
  }, {
    key: "_bind",
    value: function _bind(thisp, fn) {
      if (Function.prototype.bind) {
        return fn.bind(thisp);
      }
      return function () {
        return fn.apply(thisp, arguments);
      };
    }
  }, {
    key: "each",
    value: function each(o, it) {
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
  }, {
    key: "extend",
    value: function extend(dest) {
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
    }
  }]);

  return Util;
})();

module.exports = new Util();

},{}],4:[function(_dereq_,module,exports){
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

'use strict';

var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _commonUtil = _dereq_('../common/util');

var _commonUtil2 = _interopRequireDefault(_commonUtil);

var _commonPostmessage = _dereq_('../common/postmessage');

var _commonPostmessage2 = _interopRequireDefault(_commonPostmessage);

var VALID_EVENT_TIME_MS = 30000; //30 seconds

var XDMRPC = (function (_PostMessage) {
  _inherits(XDMRPC, _PostMessage);

  function XDMRPC(config) {
    _classCallCheck(this, XDMRPC);

    config = config || {};
    _get(Object.getPrototypeOf(XDMRPC.prototype), 'constructor', this).call(this, config);
    this._registeredExtensions = config.extensions || {};
    this._registeredAPIModules = {};
    this._pendingCallbacks = {};
    this._keycodeCallbacks = {};
    this._pendingEvents = {};
    this._messageHandlers = {
      init: this._handleInit,
      req: this._handleRequest,
      resp: this._handleResponse,
      event_query: this._handleEventQuery,
      broadcast: this._handleBroadcast,
      key_listen: this._handleKeyListen
    };
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
        var args = _commonUtil2['default'].argumentsToArray(arguments);
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

                  var inst = new (_bind.apply(Cls.constructor, [null].concat(args)))();
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
        this._registeredAPIModules._globals = _commonUtil2['default'].extend({}, this._registeredAPIModules._globals, module);
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
          uid: _commonUtil2['default'].randomString()
        };
      }
    }
  }, {
    key: '_handleEventQuery',
    value: function _handleEventQuery(message, extension) {
      var _this = this;

      var executed = {};
      var now = new Date().getTime();
      var keys = Object.keys(this._pendingEvents);
      keys.forEach(function (index) {
        var element = _this._pendingEvents[index];
        var eventIsValid = now - element.time <= VALID_EVENT_TIME_MS;
        var isSameTarget = !element.targetSpec || _this._findRegistrations(element.targetSpec).length !== 0;

        if (eventIsValid && isSameTarget) {
          executed[index] = element;
          element.targetSpec = element.targetSpec || {};
          element.targetSpec.addon_key = extension.extension.addon_key;
          element.targetSpec.key = extension.extension.key;
          _this.dispatch(element.type, element.targetSpec, element.event, element.callback, message.source);
        } else if (!eventIsValid) {
          delete _this._pendingEvents[index];
        }
      });

      this._registeredExtensions[extension.extension_id].registered_events = message.data.args;

      return executed;
    }
  }, {
    key: 'dispatch',
    value: function dispatch(type, targetSpec, event, callback, source) {
      function sendEvent(reg, evnt) {
        if (reg.source) {
          var mid;
          if (callback) {
            mid = _commonUtil2['default'].randomString();
            this._pendingCallbacks[mid] = callback;
          }

          reg.source.postMessage({
            type: 'evt',
            mid: mid,
            etyp: type,
            evnt: evnt
          }, reg.extension.url);
        } else {
          throw "Cannot send post message without a source";
        }
      }

      var registrations = this._findRegistrations(targetSpec || {});
      registrations.forEach(function (reg) {
        if (source) {
          reg.source = source;
        }
        _commonUtil2['default']._bind(this, sendEvent)(reg, event);
      }, this);
    }
  }, {
    key: '_findRegistrations',
    value: function _findRegistrations(targetSpec) {
      var _this2 = this;

      if (this._registeredExtensions.length === 0) {
        _commonUtil2['default'].error('no registered extensions', this._registeredExtensions);
        return [];
      }
      var keys = Object.getOwnPropertyNames(targetSpec);
      var registrations = Object.getOwnPropertyNames(this._registeredExtensions).map(function (key) {
        return _this2._registeredExtensions[key];
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
      var extension = this._registeredExtensions[extension_id];
      var keycodeEntry = this._keycodeKey(key, modifiers, extension_id);
      if (!this._keycodeCallbacks[keycodeEntry]) {
        this._keycodeCallbacks[keycodeEntry] = [];
        extension.source.postMessage({
          type: 'key_listen',
          keycode: key,
          modifiers: modifiers,
          action: 'add'
        }, extension.source.location.href);
      }
      this._keycodeCallbacks[keycodeEntry].push(callback);
    }
  }, {
    key: 'unregisterKeyListener',
    value: function unregisterKeyListener(extension_id, key, modifiers, callback) {
      var keycodeEntry = this._keycodeKey(key, modifiers, extension_id);
      var potentialCallbacks = this._keycodeCallbacks[keycodeEntry];
      var extension = this._registeredExtensions[extension_id];

      if (potentialCallbacks) {
        if (callback) {
          var index = potentialCallbacks.indexOf(callback);
          this._keycodeCallbacks[keycodeEntry].splice(index, 1);
        } else {
          delete this._keycodeCallbacks[keycodeEntry];
        }

        extension.source.postMessage({
          type: 'key_listen',
          keycode: key,
          modifiers: modifiers,
          action: 'remove'
        }, extension.source.location.href);
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
            switch (typeof member) {
              case 'function':
                accumulator[memberName] = {
                  args: _commonUtil2['default'].argumentNames(member)
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
      if (!isValidOrigin) {
        _commonUtil2['default'].warn("Failed to validate origin: " + event.origin);
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
          var _this3 = this;

          var keys = Object.keys(this._pendingEvents);
          keys.forEach(function (index) {
            var element = _this3._pendingEvents[index];
            var targetSpec = element.targetSpec || {};

            if (targetSpec.addon_key === registration.extension.addon_key) {
              delete _this3._pendingEvents[index];
            }
          });

          delete this._registeredExtensions[registration.extension_id];
        }, this);
      }
    }
  }]);

  return XDMRPC;
})(_commonPostmessage2['default']);

module.exports = XDMRPC;

},{"../common/postmessage":2,"../common/util":3}]},{},[1])(1)
});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],5:[function(_dereq_,module,exports){
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

},{}],6:[function(_dereq_,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dispatchersEvent_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _dispatchersEvent_dispatcher2 = _interopRequireDefault(_dispatchersEvent_dispatcher);

var _simpleXdmDistHost = _dereq_('simple-xdm/dist/host');

var _simpleXdmDistHost2 = _interopRequireDefault(_simpleXdmDistHost);

module.exports = {
  registerKeyEvent: function registerKeyEvent(data) {
    _simpleXdmDistHost2['default'].registerKeyListener(data.extension_id, data.key, data.modifiers, data.callback);
    _dispatchersEvent_dispatcher2['default'].dispatch('dom-event-register', data);
  },
  unregisterKeyEvent: function unregisterKeyEvent(data) {
    _simpleXdmDistHost2['default'].unregisterKeyListener(data.extension_id, data.key, data.modifiers, data.callback);
    _dispatchersEvent_dispatcher2['default'].dispatch('dom-event-unregister', data);
  }
};

},{"dispatchers/event_dispatcher":26,"simple-xdm/dist/host":4}],7:[function(_dereq_,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dispatchersEvent_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _dispatchersEvent_dispatcher2 = _interopRequireDefault(_dispatchersEvent_dispatcher);

var _util = _dereq_('../util');

var _util2 = _interopRequireDefault(_util);

var _componentsIframe = _dereq_('components/iframe');

var _componentsIframe2 = _interopRequireDefault(_componentsIframe);

_dispatchersEvent_dispatcher2['default'].register('iframe-resize', function (data) {
  _componentsIframe2['default'].resize(data.width, data.height, data.$el);
});

_dispatchersEvent_dispatcher2['default'].register('iframe-size-to-parent', function (data) {
  var height = AJS.$(document).height() - AJS.$('#header > nav').outerHeight() - AJS.$('#footer').outerHeight() - 20;
  var $el = _util2['default'].getIframeByExtensionId(data.context.extension_id);
  _dispatchersEvent_dispatcher2['default'].dispatch('iframe-resize', { width: '100%', height: height + 'px', $el: $el });
});

AJS.$(window).on('resize', function (e) {
  _dispatchersEvent_dispatcher2['default'].dispatch('host-window-resize', e);
});

module.exports = {
  iframeResize: function iframeResize(width, height, context) {
    var $el;
    if (context.extension_id) {
      $el = _util2['default'].getIframeByExtensionId(context.extension_id);
    } else {
      $el = context;
    }

    _dispatchersEvent_dispatcher2['default'].dispatch('iframe-resize', { width: width, height: height, $el: $el, extension: context.extension });
  },
  sizeToParent: function sizeToParent(context) {
    _dispatchersEvent_dispatcher2['default'].dispatch('iframe-size-to-parent', { context: context });
  }
};

},{"../util":35,"components/iframe":18,"dispatchers/event_dispatcher":26}],8:[function(_dereq_,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dispatchersEvent_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _dispatchersEvent_dispatcher2 = _interopRequireDefault(_dispatchersEvent_dispatcher);

var _simpleXdmDistHost = _dereq_('simple-xdm/dist/host');

var _simpleXdmDistHost2 = _interopRequireDefault(_simpleXdmDistHost);

module.exports = {
  broadcast: function broadcast(type, targetSpec, event) {
    _simpleXdmDistHost2['default'].dispatch(type, targetSpec, event);
    _dispatchersEvent_dispatcher2['default'].dispatch('event-dispatch', {
      type: type,
      targetSpec: targetSpec,
      event: event
    });
  }
};

},{"dispatchers/event_dispatcher":26,"simple-xdm/dist/host":4}],9:[function(_dereq_,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dispatchersEvent_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _dispatchersEvent_dispatcher2 = _interopRequireDefault(_dispatchersEvent_dispatcher);

module.exports = {
  open: function open(flagId) {
    _dispatchersEvent_dispatcher2['default'].dispatch('flag-open', { id: flagId });
  },
  //called to close a flag
  close: function close(flagId) {
    _dispatchersEvent_dispatcher2['default'].dispatch('flag-close', { id: flagId });
  },
  //called by AUI when closed
  closed: function closed(flagId) {
    _dispatchersEvent_dispatcher2['default'].dispatch('flag-closed', { id: flagId });
  }
};

},{"dispatchers/event_dispatcher":26}],10:[function(_dereq_,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dispatchersEvent_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _dispatchersEvent_dispatcher2 = _interopRequireDefault(_dispatchersEvent_dispatcher);

var _simpleXdmDistHost = _dereq_('simple-xdm/dist/host');

var _simpleXdmDistHost2 = _interopRequireDefault(_simpleXdmDistHost);

module.exports = {
  notifyIframeCreated: function notifyIframeCreated($el, extension) {
    _dispatchersEvent_dispatcher2['default'].dispatch('iframe-create', { $el: $el, extension: extension });
  },
  notifyIframeDestroyed: function notifyIframeDestroyed(extension_id) {
    var extension = _simpleXdmDistHost2['default'].getExtensions({
      extension_id: extension_id
    });
    if (extension.length === 1) {
      extension = extension[0];
    }
    _dispatchersEvent_dispatcher2['default'].dispatch('iframe-destroyed', { extension: extension });
    _simpleXdmDistHost2['default'].unregisterExtension({ extension_id: extension_id });
  }
};

},{"dispatchers/event_dispatcher":26,"simple-xdm/dist/host":4}],11:[function(_dereq_,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dispatchersEvent_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _dispatchersEvent_dispatcher2 = _interopRequireDefault(_dispatchersEvent_dispatcher);

module.exports = {
  hide: function hide(extension_id) {
    _dispatchersEvent_dispatcher2['default'].dispatch('inline-dialog-hide', { extension_id: extension_id });
  },
  refresh: function refresh($el) {
    _dispatchersEvent_dispatcher2['default'].dispatch('inline-dialog-refresh', { $el: $el });
  },
  hideTriggered: function hideTriggered(extension_id, $el) {
    _dispatchersEvent_dispatcher2['default'].dispatch('inline-dialog-hidden', { extension_id: extension_id, $el: $el });
  },
  created: function created(data) {
    _dispatchersEvent_dispatcher2['default'].dispatch('inline-dialog-opened', {
      $el: data.$el,
      trigger: data.trigger,
      extension: data.extension
    });
  }
};

},{"dispatchers/event_dispatcher":26}],12:[function(_dereq_,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dispatchersEvent_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _dispatchersEvent_dispatcher2 = _interopRequireDefault(_dispatchersEvent_dispatcher);

var _underscore = _dereq_('../underscore');

var _underscore2 = _interopRequireDefault(_underscore);

module.exports = {
  registerContentResolver: function registerContentResolver(data) {
    _dispatchersEvent_dispatcher2['default'].dispatch('content-resolver-register-by-extension', data);
  },
  requestRefreshUrl: function requestRefreshUrl(data) {
    if (!data.resolver) {
      throw Error('ACJS: No content resolver supplied');
    }
    var promise = data.resolver.call(null, _underscore2['default'].extend({ classifier: 'json' }, data.extension));
    promise.done(function (promiseData) {
      var values = {};
      if (_underscore2['default'].isObject(promiseData)) {
        values = promiseData;
      } else if (_underscore2['default'].isString(promiseData)) {
        try {
          values = JSON.parse(promiseData);
        } catch (e) {
          console.error('ACJS: invalid response from content resolver');
        }
      }
      _dispatchersEvent_dispatcher2['default'].dispatch('jwt-url-refreshed', { extension: data.extension, url: values.url });
    });
    _dispatchersEvent_dispatcher2['default'].dispatch('jwt-url-refresh-request', { data: data });
  }

};

},{"../underscore":34,"dispatchers/event_dispatcher":26}],13:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dispatchersEvent_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _dispatchersEvent_dispatcher2 = _interopRequireDefault(_dispatchersEvent_dispatcher);

exports['default'] = {
  timeout: function timeout($el, extension) {
    _dispatchersEvent_dispatcher2['default'].dispatch('iframe-bridge-timeout', { $el: $el, extension: extension });
  },
  cancelled: function cancelled($el, extension) {
    _dispatchersEvent_dispatcher2['default'].dispatch('iframe-bridge-cancelled', { $el: $el, extension: extension });
  }
};
module.exports = exports['default'];

},{"dispatchers/event_dispatcher":26}],14:[function(_dereq_,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dispatchersEvent_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _dispatchersEvent_dispatcher2 = _interopRequireDefault(_dispatchersEvent_dispatcher);

module.exports = {
  defineCustomModule: function defineCustomModule(name, methods) {
    var data = {};
    if (!methods) {
      data.methods = name;
    } else {
      data.methods = methods;
      data.name = name;
    }
    _dispatchersEvent_dispatcher2['default'].dispatch('module-define-custom', data);
  }
};

},{"dispatchers/event_dispatcher":26}],15:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dispatchersEvent_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _dispatchersEvent_dispatcher2 = _interopRequireDefault(_dispatchersEvent_dispatcher);

var _componentsWebitem = _dereq_('components/webitem');

var _componentsWebitem2 = _interopRequireDefault(_componentsWebitem);

var _utilsWebitem = _dereq_('utils/webitem');

var _utilsWebitem2 = _interopRequireDefault(_utilsWebitem);

exports['default'] = {
  addWebItem: function addWebItem(potentialWebItem) {

    var webitem = undefined;
    var existing = _componentsWebitem2['default'].getWebItemsBySelector(potentialWebItem.selector);

    if (existing) {
      return false;
    } else {
      webitem = _componentsWebitem2['default'].setWebItem(potentialWebItem);
      _dispatchersEvent_dispatcher2['default'].dispatch('webitem-added', { webitem: webitem });
    }
  },

  webitemInvoked: function webitemInvoked(webitem, event) {
    var $target = $(event.target);
    var extension = {
      addon_key: _utilsWebitem2['default'].getExtensionKey($target),
      key: _utilsWebitem2['default'].getKey($target),
      url: $target.attr('href'),
      options: _utilsWebitem2['default'].getOptionsForWebItem($target)
    };

    _dispatchersEvent_dispatcher2['default'].dispatch('webitem-invoked:' + webitem.name, { webitem: webitem, event: event, extension: extension });
  }

};
module.exports = exports['default'];

},{"components/webitem":23,"dispatchers/event_dispatcher":26,"utils/webitem":38}],16:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _dispatchersEvent_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _dispatchersEvent_dispatcher2 = _interopRequireDefault(_dispatchersEvent_dispatcher);

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _underscore = _dereq_('../underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var Dialog = (function () {
  function Dialog() {
    _classCallCheck(this, Dialog);
  }

  _createClass(Dialog, [{
    key: '_renderHeaderCloseBtn',
    value: function _renderHeaderCloseBtn(options) {
      var $close = (0, _dollar2['default'])('<a />').addClass('aui-dialog2-header-close');
      var $closeBtn = (0, _dollar2['default'])('<span />').addClass('aui-icon aui-icon-small aui-iconfont-close-dialog').text('Close');
      $close.append($closeBtn);
      return $close;
    }
  }, {
    key: '_renderHeader',
    value: function _renderHeader(options) {
      var $header;
      var $title;
      var $secondary;

      $header = (0, _dollar2['default'])('<header />').addClass('aui-dialog2-header');
      if (options.title) {
        $title = (0, _dollar2['default'])('<h2 />').addClass('aui-dialog2-header-main');
        $title.text(options.title);
        $header.append($title);
      }
      $header.append(this._renderHeaderCloseBtn());
      return $header;
    }
  }, {
    key: '_renderContent',
    value: function _renderContent($content) {
      var $el = (0, _dollar2['default'])('<div />').addClass('aui-dialog2-content');
      if ($content) {
        $el.append($content);
      }
      return $el;
    }
  }, {
    key: '_renderFooter',
    value: function _renderFooter(options) {
      var $actions;
      var $footer;
      var $hint;
      $footer = (0, _dollar2['default'])('<footer />').addClass('aui-dialog2-footer');
      if (options.actions) {
        $actions = this._renderFooterActions(options.actions);
        $footer.append($actions);
      }
      if (options.hint) {
        $hint = (0, _dollar2['default'])('<div />').addClass('aui-dialog2-footer-hint').text(options.hint);
        $footer.append($hint);
      }
      return $footer;
    }
  }, {
    key: '_renderFooterActions',
    value: function _renderFooterActions(actions) {
      //either an array or object (for 1 button)
      if (!_underscore2['default'].isArray(actions)) {
        actions = [actions];
      }
      return actions.map(function (action) {
        return (0, _dollar2['default'])('<button />').text(action);
      });
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
      var $dialog = (0, _dollar2['default'])('<section />').attr({
        role: 'dialog',
        id: options.id });
      $dialog.addClass('aui-layer aui-dialog2 aui-dialog2-medium');

      //header
      $dialog.append(this._renderHeader({
        title: options.title
      }));
      //content
      $dialog.append(this._renderContent(options.$content));
      //footer
      $dialog.append(this._renderFooter({
        actions: options.actions,
        hint: options.hint
      }));
      return $dialog;
    }
  }]);

  return Dialog;
})();

var DialogComponent = new Dialog();

exports['default'] = DialogComponent;
module.exports = exports['default'];

},{"../dollar":27,"../underscore":34,"dispatchers/event_dispatcher":26}],17:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _actionsFlag_actions = _dereq_('actions/flag_actions');

var _actionsFlag_actions2 = _interopRequireDefault(_actionsFlag_actions);

var _dispatchersEvent_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _dispatchersEvent_dispatcher2 = _interopRequireDefault(_dispatchersEvent_dispatcher);

var FLAGID_PREFIX = 'ap-flag-';
var AUI_FLAG = undefined;

window.require(['aui/flag'], function (f) {
  AUI_FLAG = f;
});

var Flag = (function () {
  function Flag() {
    _classCallCheck(this, Flag);
  }

  _createClass(Flag, [{
    key: '_toHtmlString',
    value: function _toHtmlString(str) {
      if (_dollar2['default'].type(str) === 'string') {
        return str;
      } else if (_dollar2['default'].type(str) === 'object' && str instanceof _dollar2['default']) {
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
      var $auiFlag = (0, _dollar2['default'])(auiFlag);
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
})();

var FlagComponent = new Flag();

(0, _dollar2['default'])(document).on('aui-flag-close', function (e) {
  var _id = e.target.id;
  _actionsFlag_actions2['default'].closed(_id);
});

_dispatchersEvent_dispatcher2['default'].register('flag-close', function (data) {
  FlagComponent.close(data.id);
});

exports['default'] = FlagComponent;
module.exports = exports['default'];

},{"../dollar":27,"actions/flag_actions":9,"dispatchers/event_dispatcher":26}],18:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _dispatchersEvent_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _dispatchersEvent_dispatcher2 = _interopRequireDefault(_dispatchersEvent_dispatcher);

var _actionsIframe_actions = _dereq_('actions/iframe_actions');

var _actionsIframe_actions2 = _interopRequireDefault(_actionsIframe_actions);

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _util = _dereq_('../util');

var _util2 = _interopRequireDefault(_util);

var _simpleXdmDistHost = _dereq_('simple-xdm/dist/host');

var _simpleXdmDistHost2 = _interopRequireDefault(_simpleXdmDistHost);

var _utilsUrl = _dereq_('utils/url');

var _utilsUrl2 = _interopRequireDefault(_utilsUrl);

var CONTAINER_CLASSES = ['ap-container'];

var Iframe = (function () {
  function Iframe() {
    _classCallCheck(this, Iframe);
  }

  _createClass(Iframe, [{
    key: 'resize',
    value: function resize(width, height, $el) {
      width = _util2['default'].stringToDimension(width);
      height = _util2['default'].stringToDimension(height);
      $el.css({
        width: width,
        height: height
      });
      $el.trigger('resized', { width: width, height: height });
    }
  }, {
    key: '_bridgeEstablishedCallback',
    value: function _bridgeEstablishedCallback($iframe, extension) {
      return function () {
        _dispatchersEvent_dispatcher2['default'].dispatch('iframe-bridge-estabilshed', {
          $el: $iframe,
          extension: extension
        });
      };
    }
  }, {
    key: 'simpleXdmExtension',
    value: function simpleXdmExtension(extension) {
      var $iframe;
      var iframeAttributes = _simpleXdmDistHost2['default'].create(extension, this._bridgeEstablishedCallback($iframe, extension));
      extension.id = iframeAttributes.id;
      $iframe = this._renderIframe(iframeAttributes);
      return { $el: $iframe, extension: extension };
    }
  }, {
    key: '_renderIframe',
    value: function _renderIframe(attributes) {
      return (0, _dollar2['default'])('<iframe />').attr(attributes);
    }
  }]);

  return Iframe;
})();

var IframeComponent = new Iframe();

_dispatchersEvent_dispatcher2['default'].register('iframe-resize', function (data) {
  IframeComponent.resize(data.width, data.height, data.$el);
});

exports['default'] = IframeComponent;
module.exports = exports['default'];

},{"../dollar":27,"../util":35,"actions/iframe_actions":10,"dispatchers/event_dispatcher":26,"simple-xdm/dist/host":4,"utils/url":37}],19:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _dispatchersEvent_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _dispatchersEvent_dispatcher2 = _interopRequireDefault(_dispatchersEvent_dispatcher);

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _utilsUrl = _dereq_('utils/url');

var _utilsUrl2 = _interopRequireDefault(_utilsUrl);

var _actionsJwt_actions = _dereq_('actions/jwt_actions');

var _actionsJwt_actions2 = _interopRequireDefault(_actionsJwt_actions);

var _actionsIframe_actions = _dereq_('actions/iframe_actions');

var _actionsIframe_actions2 = _interopRequireDefault(_actionsIframe_actions);

var _componentsIframe = _dereq_('components/iframe');

var _componentsIframe2 = _interopRequireDefault(_componentsIframe);

var CONTAINER_CLASSES = ['ap-container'];

var IframeContainer = (function () {
  function IframeContainer() {
    _classCallCheck(this, IframeContainer);

    this._urlContainerRegistry = {};
    this._contentResolver = false;
  }

  _createClass(IframeContainer, [{
    key: 'setContentResolver',
    value: function setContentResolver(callback) {
      this._contentResolver = callback;
    }
  }, {
    key: '_insertIframe',
    value: function _insertIframe($container, extension) {
      var simpleExtension = _componentsIframe2['default'].simpleXdmExtension(extension);
      $container.append(simpleExtension.$el);
      if (extension.srcdoc) {
        simpleExtension.$el.attr('srcdoc', extension.srcdoc);
      }
      if (extension.options) {
        if (extension.options.width) {
          simpleExtension.$el.css('width', extension.options.width);
        }
        if (extension.options.height) {
          simpleExtension.$el.css('height', extension.options.height);
        }
      }
      _actionsIframe_actions2['default'].notifyIframeCreated(simpleExtension.$el, simpleExtension.extension);
      return simpleExtension;
    }
  }, {
    key: 'createExtension',
    value: function createExtension(extension) {
      var $container = this._renderContainer();
      if (!extension.url || _utilsUrl2['default'].hasJwt(extension.url) && _utilsUrl2['default'].isJwtExpired(extension.url)) {
        this._urlContainerRegistry[extension.id] = $container;
        if (this._contentResolver) {
          _actionsJwt_actions2['default'].requestRefreshUrl({ extension: extension, resolver: this._contentResolver });
        } else {
          console.error('JWT is expired and no content resolver was specified');
        }
      } else {
        this._insertIframe($container, extension);
      }
      return $container;
    }
  }, {
    key: 'resolverResponse',
    value: function resolverResponse(data) {
      var extension = data.extension;
      var $container = this._urlContainerRegistry[extension.id];
      if ($container) {
        extension.url = data.url;
        this._insertIframe($container, extension);
      }
      delete this._urlContainerRegistry[extension.id];
    }
  }, {
    key: '_renderContainer',
    value: function _renderContainer(attributes) {
      var container = (0, _dollar2['default'])('<div />').attr(attributes || {});
      container.addClass(CONTAINER_CLASSES.join(' '));
      return container;
    }
  }]);

  return IframeContainer;
})();

var IframeContainerComponent = new IframeContainer();
_dispatchersEvent_dispatcher2['default'].register('content-resolver-register-by-extension', function (data) {
  IframeContainerComponent.setContentResolver(data.callback);
});

_dispatchersEvent_dispatcher2['default'].register('jwt-url-refreshed', function (data) {
  IframeContainerComponent.resolverResponse(data);
});

exports['default'] = IframeContainerComponent;
module.exports = exports['default'];

},{"../dollar":27,"actions/iframe_actions":10,"actions/jwt_actions":12,"components/iframe":18,"dispatchers/event_dispatcher":26,"utils/url":37}],20:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _dispatchersEvent_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _dispatchersEvent_dispatcher2 = _interopRequireDefault(_dispatchersEvent_dispatcher);

var _actionsInline_dialog_actions = _dereq_('actions/inline_dialog_actions');

var _actionsInline_dialog_actions2 = _interopRequireDefault(_actionsInline_dialog_actions);

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _util = _dereq_('../util');

var _util2 = _interopRequireDefault(_util);

var InlineDialog = (function () {
  function InlineDialog() {
    _classCallCheck(this, InlineDialog);
  }

  _createClass(InlineDialog, [{
    key: 'resize',
    value: function resize(data) {
      var width = _util2['default'].stringToDimension(data.width);
      var height = _util2['default'].stringToDimension(data.height);
      var $content = data.$el.find('.contents');
      if ($content.length === 1) {
        $content.css({
          width: width,
          height: height
        });
        _actionsInline_dialog_actions2['default'].refresh(data.$el);
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
      return (0, _dollar2['default'])("<div />").addClass("aui-inline-dialog-contents");
    }
  }, {
    key: '_displayInlineDialog',
    value: function _displayInlineDialog(data) {
      _actionsInline_dialog_actions2['default'].created({
        $el: data.$el,
        trigger: data.trigger,
        extension: data.extension
      });
    }
  }, {
    key: 'render',
    value: function render(data) {
      var _this = this;

      var $inlineDialog = (0, _dollar2['default'])(document.getElementById('inline-dialog-' + data.id));

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
})();

var InlineDialogComponent = new InlineDialog();

_dispatchersEvent_dispatcher2['default'].register('iframe-resize', function (data) {
  var container = data.$el.parents(".aui-inline-dialog");
  if (container.length === 1) {
    InlineDialogComponent.resize({
      width: data.width,
      height: data.height,
      $el: container
    });
  }
});

_dispatchersEvent_dispatcher2['default'].register('inline-dialog-refresh', function (data) {
  InlineDialogComponent.refresh(data.$el);
});

exports['default'] = InlineDialogComponent;
module.exports = exports['default'];

},{"../dollar":27,"../util":35,"actions/inline_dialog_actions":11,"dispatchers/event_dispatcher":26}],21:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _actionsWebitem_actions = _dereq_('actions/webitem_actions');

var _actionsWebitem_actions2 = _interopRequireDefault(_actionsWebitem_actions);

var _dispatchersEvent_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _dispatchersEvent_dispatcher2 = _interopRequireDefault(_dispatchersEvent_dispatcher);

var _componentsInline_dialog = _dereq_('components/inline_dialog');

var _componentsInline_dialog2 = _interopRequireDefault(_componentsInline_dialog);

var _componentsWebitem = _dereq_('components/webitem');

var _componentsWebitem2 = _interopRequireDefault(_componentsWebitem);

var _utilsWebitem = _dereq_('utils/webitem');

var _utilsWebitem2 = _interopRequireDefault(_utilsWebitem);

var _componentsIframe_container = _dereq_('components/iframe_container');

var _componentsIframe_container2 = _interopRequireDefault(_componentsIframe_container);

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _create = _dereq_('../create');

var _create2 = _interopRequireDefault(_create);

var ITEM_NAME = 'inline-dialog';
var SELECTOR = '.ap-inline-dialog';
var TRIGGERS = ['mouseover', 'click'];
var WEBITEM_UID_KEY = 'inline-dialog-target-uid';

var InlineDialogWebItem = (function () {
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
      var $iframeContainer = _componentsIframe_container2['default'].createExtension(data.extension);
      var $inlineDialog = _componentsInline_dialog2['default'].render({
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
      var $target = (0, _dollar2['default'])(data.event.target);
      if (!$target.hasClass('ap-inline-dialog')) {
        $target = $target.closest('.ap-inline-dialog');
      }
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
      var contentRequest = _componentsWebitem2['default'].requestContent(data.extension);
      if (!contentRequest) {
        console.warn('no content resolver found');
        return false;
      }
      contentRequest.then(function (content) {
        var contentData = JSON.parse(content);
        contentData.options = {
          autoresize: true,
          widthinpx: true
        };
        var addon = (0, _create2['default'])(contentData);
        data.$el.empty().append(addon);
      });
    }
  }, {
    key: 'createIfNotExists',
    value: function createIfNotExists(data) {
      var $target = (0, _dollar2['default'])(data.event.target);
      var uid = $target.data(WEBITEM_UID_KEY);

      if (!uid) {
        uid = _utilsWebitem2['default'].uniqueId();
        $target.data(WEBITEM_UID_KEY, uid);
      }
    }
  }]);

  return InlineDialogWebItem;
})();

var inlineDialogInstance = new InlineDialogWebItem();
var webitem = inlineDialogInstance.getWebItem();
_dispatchersEvent_dispatcher2['default'].register('before:webitem-invoked:' + webitem.name, function (data) {
  inlineDialogInstance.createIfNotExists(data);
});
_dispatchersEvent_dispatcher2['default'].register('webitem-invoked:' + webitem.name, function (data) {
  inlineDialogInstance.triggered(data);
});
_dispatchersEvent_dispatcher2['default'].register('inline-dialog-opened', function (data) {
  inlineDialogInstance.opened(data);
});
_actionsWebitem_actions2['default'].addWebItem(webitem);

exports['default'] = inlineDialogInstance;
module.exports = exports['default'];

},{"../create":24,"../dollar":27,"actions/webitem_actions":15,"components/iframe_container":19,"components/inline_dialog":20,"components/webitem":23,"dispatchers/event_dispatcher":26,"utils/webitem":38}],22:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _dispatchersEvent_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _dispatchersEvent_dispatcher2 = _interopRequireDefault(_dispatchersEvent_dispatcher);

var _actionsLoading_indicator_actions = _dereq_('actions/loading_indicator_actions');

var _actionsLoading_indicator_actions2 = _interopRequireDefault(_actionsLoading_indicator_actions);

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _util = _dereq_('../util');

var _util2 = _interopRequireDefault(_util);

var LOADING_INDICATOR_CLASS = 'ap-status-indicator';

var LOADING_STATUSES = {
  loading: '<div class="ap-loading"><div class="small-spinner"></div>Loading add-on...</div>',
  'load-timeout': '<div class="ap-load-timeout><div class="small-spinner"></div>Add-on is not responding. Wait or <a href="#" class="ap-btn-cancel">cancel</a>?</div>',
  'load-error': 'Add-on failed to load.'
};

var LOADING_TIMEOUT = 12000;

var LoadingIndicator = (function () {
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
    key: 'show',
    value: function show($iframeContainer, extension) {
      this._stateRegistry[extension.id] = setTimeout(function () {
        _actionsLoading_indicator_actions2['default'].timeout($iframeContainer, extension);
      }, LOADING_TIMEOUT);
      var container = this._loadingContainer($iframeContainer);
      if (!container.length) {
        container = (0, _dollar2['default'])('<div />').addClass(LOADING_INDICATOR_CLASS);
        container.appendTo($iframeContainer);
      }
      container.append(LOADING_STATUSES.loading);
      var spinner = container.find('.small-spinner');
      if (spinner.length && spinner.spin) {
        spinner.spin({ lines: 12, length: 3, width: 2, radius: 3, trail: 60, speed: 1.5, zIndex: 1 });
      }
      return container;
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
    key: 'timeout',
    value: function timeout($iframeContainer, extensionId) {
      var status = (0, _dollar2['default'])(LOADING_STATUSES['load-timeout']);
      var container = this._loadingContainer($iframeContainer);
      container.empty().append(status);
      (0, _dollar2['default'])('a.ap-btn-cancel', container).click(function () {
        _actionsLoading_indicator_actions2['default'].cancelled($iframeContainer, extensionId);
      });
      delete this._stateRegistry[extensionId];
      return container;
    }
  }]);

  return LoadingIndicator;
})();

var LoadingComponent = new LoadingIndicator();

_dispatchersEvent_dispatcher2['default'].register('iframe-create', function (data) {
  LoadingComponent.show(data.$el, data.extension);
});
_dispatchersEvent_dispatcher2['default'].register('iframe-bridge-estabilshed', function (data) {
  LoadingComponent.hide(data.$el, data.extension.id);
});
_dispatchersEvent_dispatcher2['default'].register('iframe-bridge-timeout', function (data) {
  LoadingComponent.timeout(data.$el, data.extension.id);
});
_dispatchersEvent_dispatcher2['default'].register('iframe-bridge-cancelled', function (data) {
  LoadingComponent.cancelled(data.$el, data.extension.id);
});

exports['default'] = LoadingComponent;
module.exports = exports['default'];

},{"../dollar":27,"../util":35,"actions/loading_indicator_actions":13,"dispatchers/event_dispatcher":26}],23:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _underscore = _dereq_('../underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _dispatchersEvent_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _dispatchersEvent_dispatcher2 = _interopRequireDefault(_dispatchersEvent_dispatcher);

var _actionsWebitem_actions = _dereq_('actions/webitem_actions');

var _actionsWebitem_actions2 = _interopRequireDefault(_actionsWebitem_actions);

var _utilsWebitem = _dereq_('utils/webitem');

var _utilsWebitem2 = _interopRequireDefault(_utilsWebitem);

var WebItem = (function () {
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
        return this._contentResolver.call(null, _underscore2['default'].extend({ classifier: 'json' }, extension));
      }
    }
  }, {
    key: 'getWebItemsBySelector',
    value: function getWebItemsBySelector(selector) {
      return _underscore2['default'].find(this._webitems, function (obj) {
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

      var onTriggers = _utilsWebitem2['default'].sanitizeTriggers(webitem.triggers);
      (0, _dollar2['default'])(function () {
        (0, _dollar2['default'])('body').off(onTriggers, webitem.selector, _this._webitems[webitem.name]._on);
      });
      delete this._webitems[webitem.name]._on;
    }
  }, {
    key: '_addTriggers',
    value: function _addTriggers(webitem) {
      var onTriggers = _utilsWebitem2['default'].sanitizeTriggers(webitem.triggers);
      webitem._on = function (e) {
        _actionsWebitem_actions2['default'].webitemInvoked(webitem, e);
        e.preventDefault();
      };
      (0, _dollar2['default'])(function () {
        (0, _dollar2['default'])('body').on(onTriggers, webitem.selector, webitem._on);
      });
    }
  }]);

  return WebItem;
})();

var webItemInstance = new WebItem();

_dispatchersEvent_dispatcher2['default'].register('webitem-added', function (data) {
  webItemInstance._addTriggers(data.webitem);
});

_dispatchersEvent_dispatcher2['default'].register('content-resolver-register-by-extension', function (data) {
  webItemInstance.setContentResolver(data.callback);
});

exports['default'] = webItemInstance;
module.exports = exports['default'];

},{"../dollar":27,"../underscore":34,"actions/webitem_actions":15,"dispatchers/event_dispatcher":26,"utils/webitem":38}],24:[function(_dereq_,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = _dereq_('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _dispatchersEvent_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _dispatchersEvent_dispatcher2 = _interopRequireDefault(_dispatchersEvent_dispatcher);

var _componentsIframe_container = _dereq_('components/iframe_container');

var _componentsIframe_container2 = _interopRequireDefault(_componentsIframe_container);

function create(extension) {
  var simpleXdmExtension = {
    addon_key: extension.addon_key,
    key: extension.key,
    url: extension.url,
    options: extension.options
  };
  return _componentsIframe_container2['default'].createExtension(simpleXdmExtension);

  // return IframeComponent.simpleXdmExtension(simpleXdmExtension);
}

module.exports = create;

},{"./dollar":27,"components/iframe_container":19,"dispatchers/event_dispatcher":26}],25:[function(_dereq_,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _dispatchersEvent_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _dispatchersEvent_dispatcher2 = _interopRequireDefault(_dispatchersEvent_dispatcher);

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

var AnalyticsDispatcher = (function () {
  function AnalyticsDispatcher() {
    _classCallCheck(this, AnalyticsDispatcher);

    this._addons = {};
  }

  _createClass(AnalyticsDispatcher, [{
    key: '_track',
    value: function _track(name, data) {
      var w = window;
      var prefixedName = EVENT_NAME_PREFIX + name;

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
    key: 'dispatch',
    value: function dispatch(name, data) {
      this._track(name, data);
    }
  }]);

  return AnalyticsDispatcher;
})();

var analytics = new AnalyticsDispatcher();
_dispatchersEvent_dispatcher2['default'].register('iframe-create', function (data) {
  analytics.trackLoadingStarted(data.extension);
});
_dispatchersEvent_dispatcher2['default'].register('iframe-bridge-estabilshed', function (data) {
  analytics.trackLoadingEnded(data.extension);
});
_dispatchersEvent_dispatcher2['default'].register('iframe-bridge-timeout', function (data) {
  analytics.trackLoadingTimeout(data.extension);
});
_dispatchersEvent_dispatcher2['default'].register('iframe-bridge-cancelled', function (data) {
  analytics.trackLoadingCancel(data.extension);
});

module.exports = analytics;

},{"dispatchers/event_dispatcher":26}],26:[function(_dereq_,module,exports){
/**
* pub/sub for extension state (created, destroyed, initialized)
* taken from hipchat webcore
**/
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _underscore = _dereq_('../underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _events = _dereq_('events');

var EventDispatcher = (function (_EventEmitter) {
  _inherits(EventDispatcher, _EventEmitter);

  function EventDispatcher() {
    _classCallCheck(this, EventDispatcher);

    _get(Object.getPrototypeOf(EventDispatcher.prototype), 'constructor', this).call(this);
    this.setMaxListeners(20);
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
      var _this = this;

      if (_underscore2['default'].isString(action)) {
        this.once(action, callback);
      } else if (_underscore2['default'].isObject(action)) {
        _underscore2['default'].keys(action).forEach(function (val, key) {
          _this.once(key, val);
        }, this);
      }
    }
  }, {
    key: 'register',
    value: function register(action, callback) {
      var _this2 = this;

      if (_underscore2['default'].isString(action)) {
        this.on(action, callback);
      } else if (_underscore2['default'].isObject(action)) {
        _underscore2['default'].keys(action).forEach(function (val, key) {
          _this2.on(key, val);
        }, this);
      }
    }
  }, {
    key: 'unregister',
    value: function unregister(action, callback) {
      var _this3 = this;

      if (_underscore2['default'].isString(action)) {
        this.removeListener(action, callback);
      } else if (_underscore2['default'].isObject(action)) {
        _underscore2['default'].keys(action).forEach(function (val, key) {
          _this3.removeListener(key, val);
        }, this);
      }
    }
  }]);

  return EventDispatcher;
})(_events.EventEmitter);

module.exports = new EventDispatcher();

},{"../underscore":34,"events":2}],27:[function(_dereq_,module,exports){
/**
 * The iframe-side code exposes a jquery-like implementation via _dollar.
 * This runs on the product side to provide AJS.$ under a _dollar module to provide a consistent interface
 * to code that runs on host and iframe.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = AJS.$;
module.exports = exports["default"];

},{}],28:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dispatchersAnalytics_dispatcher = _dereq_('dispatchers/analytics_dispatcher');

var _dispatchersAnalytics_dispatcher2 = _interopRequireDefault(_dispatchersAnalytics_dispatcher);

var _dispatchersEvent_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _dispatchersEvent_dispatcher2 = _interopRequireDefault(_dispatchersEvent_dispatcher);

var _simpleXdmDistHost = _dereq_('simple-xdm/dist/host');

var _simpleXdmDistHost2 = _interopRequireDefault(_simpleXdmDistHost);

var _actionsJwt_actions = _dereq_('actions/jwt_actions');

var _actionsJwt_actions2 = _interopRequireDefault(_actionsJwt_actions);

var _modulesEvents = _dereq_('./modules/events');

var _modulesEvents2 = _interopRequireDefault(_modulesEvents);

var _create = _dereq_('./create');

var _create2 = _interopRequireDefault(_create);

var _modulesDialog = _dereq_('./modules/dialog');

var _modulesDialog2 = _interopRequireDefault(_modulesDialog);

var _modulesEnv = _dereq_('./modules/env');

var _modulesEnv2 = _interopRequireDefault(_modulesEnv);

var _componentsLoading_indicator = _dereq_('./components/loading_indicator');

var _componentsLoading_indicator2 = _interopRequireDefault(_componentsLoading_indicator);

var _modulesMessages = _dereq_('./modules/messages');

var _modulesMessages2 = _interopRequireDefault(_modulesMessages);

var _modulesFlag = _dereq_('./modules/flag');

var _modulesFlag2 = _interopRequireDefault(_modulesFlag);

var _actionsModule_actions = _dereq_('actions/module_actions');

var _actionsModule_actions2 = _interopRequireDefault(_actionsModule_actions);

var _actionsDom_event_actions = _dereq_('actions/dom_event_actions');

var _actionsDom_event_actions2 = _interopRequireDefault(_actionsDom_event_actions);

var _underscore = _dereq_('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _actionsEvent_actions = _dereq_('actions/event_actions');

var _actionsEvent_actions2 = _interopRequireDefault(_actionsEvent_actions);

var _actionsIframe_actions = _dereq_('actions/iframe_actions');

var _actionsIframe_actions2 = _interopRequireDefault(_actionsIframe_actions);

var _componentsInline_dialog_webitem = _dereq_('components/inline_dialog_webitem');

var _componentsInline_dialog_webitem2 = _interopRequireDefault(_componentsInline_dialog_webitem);

// import propagator from './propagate/rpc';

/**
 * Private namespace for host-side code.
 * @type {*|{}}
 * @private
 * @deprecated use AMD instead of global namespaces. The only thing that should be on _AP is _AP.define and _AP.require.
 */
if (!window._AP) {
  window._AP = {};
}

_simpleXdmDistHost2['default'].defineModule('messages', _modulesMessages2['default']);
_simpleXdmDistHost2['default'].defineModule('flag', _modulesFlag2['default']);
_simpleXdmDistHost2['default'].defineModule('dialog', _modulesDialog2['default']);
_simpleXdmDistHost2['default'].defineModule('env', _modulesEnv2['default']);
_simpleXdmDistHost2['default'].defineModule('events', _modulesEvents2['default']);

// rpc.extend(propagator);

_dispatchersEvent_dispatcher2['default'].register('module-define-custom', function (data) {
  _simpleXdmDistHost2['default'].defineModule(data.name, data.methods);
});

_simpleXdmDistHost2['default'].registerRequestNotifier(function (data) {
  _dispatchersAnalytics_dispatcher2['default'].dispatch('bridge.invokemethod', {
    module: data.module,
    fn: data.fn,
    addonKey: data.addon_key,
    moduleKey: data.key
  });
});

exports['default'] = {
  onKeyEvent: function onKeyEvent(extension_id, key, modifiers, callback) {
    _actionsDom_event_actions2['default'].registerKeyEvent({ extension_id: extension_id, key: key, modifiers: modifiers, callback: callback });
  },
  offKeyEvent: function offKeyEvent(extension_id, key, modifiers, callback) {
    _actionsDom_event_actions2['default'].unregisterKeyEvent({ extension_id: extension_id, key: key, modifiers: modifiers, callback: callback });
  },
  onIframeEstablished: function onIframeEstablished(callback) {
    _dispatchersEvent_dispatcher2['default'].register('after:iframe-bridge-estabilshed', function (data) {
      callback.call(null, {
        $el: data.$el,
        extension: _underscore2['default'].pick(data.extension, ['id', 'addon_key', 'id', 'key', 'options', 'url'])
      });
    });
  },
  destroy: function destroy(extension_id) {
    _actionsIframe_actions2['default'].notifyIframeDestroyed({ extension_id: extension_id });
  },
  registerContentResolver: {
    resolveByExtension: function resolveByExtension(callback) {
      _actionsJwt_actions2['default'].registerContentResolver({ callback: callback });
    }
  },
  defineModule: function defineModule(name, methods) {
    _actionsModule_actions2['default'].defineCustomModule(name, methods);
  },
  broadcastEvent: function broadcastEvent(type, targetSpec, event) {
    _actionsEvent_actions2['default'].broadcast(type, targetSpec, event);
  },
  create: _create2['default']
};
module.exports = exports['default'];

},{"./components/loading_indicator":22,"./create":24,"./modules/dialog":29,"./modules/env":30,"./modules/events":31,"./modules/flag":32,"./modules/messages":33,"actions/dom_event_actions":6,"actions/event_actions":8,"actions/iframe_actions":10,"actions/jwt_actions":12,"actions/module_actions":14,"components/inline_dialog_webitem":21,"dispatchers/analytics_dispatcher":25,"dispatchers/event_dispatcher":26,"simple-xdm/dist/host":4,"underscore":34}],29:[function(_dereq_,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _dispatchersEvent_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _dispatchersEvent_dispatcher2 = _interopRequireDefault(_dispatchersEvent_dispatcher);

var _componentsDialog = _dereq_('components/dialog');

var _componentsDialog2 = _interopRequireDefault(_componentsDialog);

var _componentsIframe_container = _dereq_('components/iframe_container');

var _componentsIframe_container2 = _interopRequireDefault(_componentsIframe_container);

var DLGID_PREFIX = 'ap-dialog-';
var _dialogs = {};

function isConnectDialog($el) {
  return $el && $el.hasClass('ap-aui-dialog2');
}

function keyPressListener(e) {
  if (e.keyCode === 27) {
    var topLayer = AJS.LayerManager.global.getTopLayer();
    if (isConnectDialog(topLayer)) {
      getActiveDialog().hide();
    }
  }
}

// $(document).on('keydown', keyPressListener);

_dispatchersEvent_dispatcher2['default'].on('dialog-button-click', function ($el) {
  var buttonOptions = $el.data('options');
  console.log('button options?', buttonOptions, $el);
  getActiveDialog().hide();
});

function getActiveDialog() {
  return AJS.dialog2(AJS.LayerManager.global.getTopLayer());
}

function closeDialog(data) {
  _dispatchersEvent_dispatcher2['default'].dispatch('dialog-close', data);
  var dialog = getActiveDialog();
  var _id = dialog.$el.attr('id').replace(DLGID_PREFIX, '');
  _dialogs[_id]._destroy();
  dialog.hide();
}

function dialogIframe(options, context) {
  return _componentsIframe_container2['default'].createExtension({
    addon_key: context.extension.addon_key,
    key: options.key,
    url: options.url,
    options: {
      customData: options.customData
    },
    srcdoc: options.srcdoc
  });
}

var Dialog = (function () {
  function Dialog(options, callback) {
    _classCallCheck(this, Dialog);

    var _id = callback._id;
    options.id = DLGID_PREFIX + _id;
    var $iframeContainer = dialogIframe(options, callback._context);
    var dialogDOM = _componentsDialog2['default'].render({
      $content: $iframeContainer,
      title: options.title,
      hint: options.hint,
      actions: ['submit', 'cancel'],
      id: options.id
    });
    var dialog = AJS.dialog2(dialogDOM);
    dialog.show();
    _dispatchersEvent_dispatcher2['default'].dispatch('dialog-open', {
      $el: $iframeContainer,
      $dialog: dialog
    });
    dialog.on('hide', function () {
      closeDialog();
    });
    _dialogs[_id] = this;
  }

  _createClass(Dialog, [{
    key: 'on',
    value: function on(event, callback) {
      _dispatchersEvent_dispatcher2['default'].register('dialog-' + event, callback);
    }
  }]);

  return Dialog;
})();

module.exports = {
  create: {
    constructor: Dialog,
    on: Dialog.prototype.on
  },
  close: closeDialog,
  isDialog: true,
  onDialogMessage: function onDialogMessage(message, listener) {},
  getButton: function getButton(name, callback) {
    callback({
      name: name
      // bind: function(){
      //   console.log('called!');
      // },
      // disable: function(){}
    });
  }
};

},{"components/dialog":16,"components/iframe_container":19,"dispatchers/event_dispatcher":26}],30:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _actionsEnv_actions = _dereq_('actions/env_actions');

var _actionsEnv_actions2 = _interopRequireDefault(_actionsEnv_actions);

var _dispatchersEvent_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _dispatchersEvent_dispatcher2 = _interopRequireDefault(_dispatchersEvent_dispatcher);

var _util = _dereq_('../util');

var _util2 = _interopRequireDefault(_util);

var debounce = AJS.debounce || _dollar2['default'].debounce;

exports['default'] = {
  getLocation: function getLocation(callback) {
    callback(window.location.href);
  },
  resize: debounce(function (width, height, callback) {
    _actionsEnv_actions2['default'].iframeResize(width, height, callback._context);
  }),

  sizeToParent: debounce(function (callback) {
    // sizeToParent is only available for general-pages
    if (callback._context.extension.options.isFullPage) {
      // This adds border between the iframe and the page footer as the connect addon has scrolling content and can't do this
      _util2['default'].getIframeByExtensionId(callback._context.extension_id).addClass('full-size-general-page');
      _dispatchersEvent_dispatcher2['default'].register('host-window-resize', function (data) {
        _actionsEnv_actions2['default'].sizeToParent(callback._context);
      });
      _actionsEnv_actions2['default'].sizeToParent(callback._context);
    } else {
      // This is only here to support integration testing
      // see com.atlassian.plugin.connect.test.pageobjects.RemotePage#isNotFullSize()
      (0, _dollar2['default'])(this.iframe).addClass('full-size-general-page-fail');
    }
  })
};
module.exports = exports['default'];

},{"../dollar":27,"../util":35,"actions/env_actions":7,"dispatchers/event_dispatcher":26}],31:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _underscore = _dereq_('../underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _actionsEvent_actions = _dereq_('actions/event_actions');

var _actionsEvent_actions2 = _interopRequireDefault(_actionsEvent_actions);

exports['default'] = {
  emit: function emit(name) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var callback = _underscore2['default'].last(args);
    args = _underscore2['default'].first(args, -1);
    _actionsEvent_actions2['default'].broadcast(name, {
      addon_key: callback._context.extension.addon_key
    }, args);
  }
};
module.exports = exports['default'];

},{"../underscore":34,"actions/event_actions":8}],32:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _dispatchersEvent_dispatcher = _dereq_('dispatchers/event_dispatcher');

var _dispatchersEvent_dispatcher2 = _interopRequireDefault(_dispatchersEvent_dispatcher);

var _actionsFlag_actions = _dereq_('actions/flag_actions');

var _actionsFlag_actions2 = _interopRequireDefault(_actionsFlag_actions);

var _componentsFlag = _dereq_('components/flag');

var _componentsFlag2 = _interopRequireDefault(_componentsFlag);

var _flags = {};

var Flag = (function () {
  function Flag(options, callback) {
    _classCallCheck(this, Flag);

    this.flag = _componentsFlag2['default'].render({
      type: options.type,
      title: options.title,
      body: AJS.escapeHtml(options.body),
      close: options.close,
      id: callback._id
    });

    _actionsFlag_actions2['default'].open(this.flag.attr('id'));

    this.onTriggers = {};

    _flags[this.flag.attr('id')] = this;
  }

  _createClass(Flag, [{
    key: 'on',
    value: function on(event, callback) {
      var id = this.flag.id;
      if (_dollar2['default'].isFunction(callback)) {
        this.onTriggers[event] = callback;
      }
    }
  }, {
    key: 'close',
    value: function close() {
      this.flag.close();
    }
  }]);

  return Flag;
})();

_dispatchersEvent_dispatcher2['default'].register('flag-closed', function (data) {
  if (_flags[data.id] && _dollar2['default'].isFunction(_flags[data.id].onTriggers['close'])) {
    _flags[data.id].onTriggers['close']();
  }
  if (_flags[data.id]) {
    delete _flags[data.id];
  }
});

exports['default'] = {
  create: {
    constructor: Flag,
    on: Flag.prototype.on,
    close: Flag.prototype.close
  }
};
module.exports = exports['default'];

},{"../dollar":27,"actions/flag_actions":9,"components/flag":17,"dispatchers/event_dispatcher":26}],33:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _underscore = _dereq_('../underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var MESSAGE_BAR_ID = 'ac-message-container';
var MESSAGE_TYPES = ['generic', 'error', 'warning', 'success', 'info', 'hint'];
var MSGID_PREFIX = 'ap-message-';
var _messages = {};

function validateMessageId(msgId) {
  return msgId.search(/^ap\-message\-[0-9A-Fa-f]+$/) === 0;
}

function getMessageBar() {
  var $msgBar = (0, _dollar2['default'])('#' + MESSAGE_BAR_ID);

  if ($msgBar.length < 1) {
    $msgBar = (0, _dollar2['default'])('<div id="' + MESSAGE_BAR_ID + '" />').appendTo('body');
  }
  return $msgBar;
}

function filterMessageOptions(options) {
  var copy = {};
  var allowed = ['closeable', 'fadeout', 'delay', 'duration', 'id'];
  if (_underscore2['default'].isObject(options)) {
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
  _dollar2['default'].extend(options, {
    title: title,
    body: AJS.escapeHtml(body)
  });

  if (_dollar2['default'].inArray(name, MESSAGE_TYPES) < 0) {
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

(0, _dollar2['default'])(document).on('aui-message-close', function (e, $msg) {
  var _id = $msg.attr('id').replace(MSGID_PREFIX, '');
  if (_messages[_id]) {
    if (_dollar2['default'].isFunction(_messages[_id].onCloseTrigger)) {
      _messages[_id].onCloseTrigger();
    }
    _messages[_id]._destroy();
  }
});

var toExport = {
  clear: function clear(msg) {
    var id = MSGID_PREFIX + msg._id;
    if (validateMessageId(id)) {
      (0, _dollar2['default'])('#' + id).closeMessage();
    }
  },
  onClose: function onClose(msg, callback) {
    var id = msg._id;
    if (_messages[id]) {
      _messages[id].onCloseTrigger = callback;
    }
  }
};

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

exports['default'] = toExport;
module.exports = exports['default'];

},{"../dollar":27,"../underscore":34}],34:[function(_dereq_,module,exports){
// AUI includes underscore and exposes it globally.
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = window._;
module.exports = exports["default"];

},{}],35:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _underscore = _dereq_('./underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function escapeSelector(s) {
  if (!s) {
    throw new Error('No selector to escape');
  }
  return s.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, '\\$&');
}

function stringToDimension(value) {
  var percent = false;
  var unit = 'px';

  if (_underscore2['default'].isString(value)) {
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

exports['default'] = {
  escapeSelector: escapeSelector,
  stringToDimension: stringToDimension,
  getIframeByExtensionId: getIframeByExtensionId
};
module.exports = exports['default'];

},{"./underscore":34}],36:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _base64 = _dereq_('base-64');

var _base642 = _interopRequireDefault(_base64);

var _utf8 = _dereq_('utf8');

var _utf82 = _interopRequireDefault(_utf8);

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

  var claimsString = _utf82['default'].decode(_base642['default'].decode.call(window, encodedClaims));
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

exports['default'] = {
  parseJwtIssuer: parseJwtIssuer,
  parseJwtClaims: parseJwtClaims,
  isJwtExpired: isJwtExpired
};
module.exports = exports['default'];

},{"base-64":1,"utf8":5}],37:[function(_dereq_,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jsuri = _dereq_('jsuri');

var _jsuri2 = _interopRequireDefault(_jsuri);

var _utilsJwt = _dereq_('utils/jwt');

var _utilsJwt2 = _interopRequireDefault(_utilsJwt);

function isJwtExpired(urlStr) {
  var jwtStr = _getJwt(urlStr);
  return _utilsJwt2['default'].isJwtExpired(jwtStr);
}

function _getJwt(urlStr) {
  var url = new _jsuri2['default'](urlStr);
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

},{"jsuri":3,"utils/jwt":36}],38:[function(_dereq_,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _underscore = _dereq_('../underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function sanitizeTriggers(triggers) {
  var onTriggers;
  if (_underscore2['default'].isArray(triggers)) {
    onTriggers = triggers.join(' ');
  } else if (_underscore2['default'].isString(triggers)) {
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
  return _underscore2['default'].isArray(m) ? m[1] : false;
}

// LEGACY: get module key by webitem for p2
function getKey($target) {
  var cssClass = $target.attr('class');
  var m = cssClass ? cssClass.match(/ap-module-key-([^\s]*)/) : null;
  return _underscore2['default'].isArray(m) ? m[1] : false;
}

// LEGACY - method for handling webitem options for p2
function getOptionsForWebItem($target) {
  var moduleKey = getKey($target);
  var type = $target.hasClass('ap-inline-dialog') ? 'inlineDialog' : 'dialog';
  if (window._AP && window._AP[type + 'Options']) {
    return window._AP[type + 'Options'][moduleKey] || {};
  } else {
    console.warn('no webitem ' + type + 'Options for ' + moduleKey);
    return {};
  }
}

module.exports = {
  sanitizeTriggers: sanitizeTriggers,
  uniqueId: uniqueId,
  getExtensionKey: getExtensionKey,
  getKey: getKey,
  getOptionsForWebItem: getOptionsForWebItem
};

},{"../underscore":34}]},{},[28])(28)
});


//# sourceMappingURL=connect-host.js.map
