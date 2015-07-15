(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.AP = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

//INSERT AMD STUBBER HERE!

var _amd = _dereq_('./amd');

var _amd2 = _interopRequireDefault(_amd);

var _util = _dereq_('./util');

var _util2 = _interopRequireDefault(_util);

var _dollar = _dereq_('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _commonEvents = _dereq_('../common/events');

var _commonEvents2 = _interopRequireDefault(_commonEvents);

var _commonBase64 = _dereq_('../common/base64');

var _commonBase642 = _interopRequireDefault(_commonBase64);

var _commonUri = _dereq_('../common/uri');

var _commonUri2 = _interopRequireDefault(_commonUri);

var _commonUiParams = _dereq_('../common/ui-params');

var _commonUiParams2 = _interopRequireDefault(_commonUiParams);

var _commonJwt = _dereq_('../common/jwt');

var _commonJwt2 = _interopRequireDefault(_commonJwt);

var _commonXdmRpc = _dereq_('../common/xdm-rpc');

var _commonXdmRpc2 = _interopRequireDefault(_commonXdmRpc);

var _rpc = _dereq_('./rpc');

var _rpc2 = _interopRequireDefault(_rpc);

var _events2 = _dereq_('./events');

var _events3 = _interopRequireDefault(_events2);

var _env = _dereq_('./env');

var _env2 = _interopRequireDefault(_env);

var _dialog = _dereq_('./dialog');

var _dialog2 = _interopRequireDefault(_dialog);

var _inlineDialog = _dereq_('./inline-dialog');

var _inlineDialog2 = _interopRequireDefault(_inlineDialog);

var _messages = _dereq_('./messages');

var _messages2 = _interopRequireDefault(_messages);

var AP = window.AP = {};

// import cookie from './cookie';
// import request from './request';

_dollar2['default'].extend(AP, _env2['default'], _amd2['default'], {
    rpc: { extend: _rpc2['default'].extend, init: _rpc2['default'].init },
    Meta: { get: _env2['default'].meta },
    //    request: request,
    Dialog: _dialog2['default']
});

window.AP = AP;
exports['default'] = AP;
module.exports = exports['default'];

},{"../common/base64":5,"../common/events":7,"../common/jwt":8,"../common/ui-params":9,"../common/uri":10,"../common/xdm-rpc":11,"./amd":13,"./dialog":14,"./dollar":15,"./env":16,"./events":17,"./inline-dialog":18,"./messages":19,"./rpc":21,"./util":22}],2:[function(_dereq_,module,exports){
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

},{}],5:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _base64 = _dereq_('base-64');

var _base642 = _interopRequireDefault(_base64);

var _utf8 = _dereq_('utf8');

var _utf82 = _interopRequireDefault(_utf8);

exports['default'] = {
    encode: function encode(string) {
        return _base642['default'].encode(_utf82['default'].encode(string));
    },
    decode: function decode(string) {
        return _utf82['default'].decode(_base642['default'].decode(string));
    }
};
module.exports = exports['default'];

},{"base-64":2,"utf8":4}],6:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var $;
{
    $ = _dereq_('../plugin/dollar');
}

exports['default'] = $;

module.exports = exports['default'];
},{"../plugin/dollar":15}],7:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = _dereq_('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var w = window,
    log = w.AJS && w.AJS.log || w.console && w.console.log || function () {};

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
  var interceptor = function interceptor() {
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
    var i = _dollar2['default'].inArray(listener, all);
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
  var i = _dollar2['default'].inArray(listener, any);
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
 * @param {Array.<String>} args 0 or more additional data arguments to deliver with the event
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
 * @param {Array.<String>} args 0 or more additional data arguments to deliver with the event
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

exports['default'] = { Events: Events };
module.exports = exports['default'];

},{"./dollar":6}],8:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _base64 = _dereq_('./base64');

var _base642 = _interopRequireDefault(_base64);

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

    var claimsString = _base642['default'].decode.call(window, encodedClaims);
    return JSON.parse(claimsString);
}

function isJwtExpired(jwtString, skew) {
    if (skew === undefined) {
        skew = 60; // give a minute of leeway to allow clock skew
    }
    var claims = parseJwtClaims(jwtString),
        expires = 0,
        now = Math.floor(Date.now() / 1000); // UTC timestamp now

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

},{"./base64":5}],9:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _base64 = _dereq_('./base64');

var _base642 = _interopRequireDefault(_base64);

var _uri = _dereq_('./uri');

var _uri2 = _interopRequireDefault(_uri);

/**
* These are passed into the main host create statement and can override
* any options inside the velocity template.
* Additionally these are accessed by the js inside the client iframe to check if we are in a dialog.
*/

exports['default'] = {
    /**
    * Encode options for transport
    */
    encode: function encode(options) {
        if (options) {
            var str = JSON.stringify(options);
            return _base642['default'].encode.call(window, str);
        }
    },
    /**
    * return ui params from a Url
    **/
    fromUrl: function fromUrl(url) {
        var params = new _uri2['default'].init(url).getQueryParamValue('ui-params');
        return this.decode(params);
    },
    /**
    * returns ui params from window.name
    */
    fromWindowName: function fromWindowName(w, param) {
        w = w || window;
        var decoded = this.decode(w.name);

        if (!param) {
            return decoded;
        }
        return decoded ? decoded[param] : undefined;
    },
    /**
    * Decode a base64 encoded json string containing ui params
    */
    decode: function decode(params) {
        var obj = {};
        if (params && params.length > 0) {
            try {
                obj = JSON.parse(_base642['default'].decode.call(window, params));
            } catch (e) {
                if (console && console.log) {
                    console.log('Cannot decode passed ui params', params);
                }
            }
        }
        return obj;
    }
};
module.exports = exports['default'];

},{"./base64":5,"./uri":10}],10:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jsuri = _dereq_('jsuri');

var _jsuri2 = _interopRequireDefault(_jsuri);

exports['default'] = { init: _jsuri2['default'] };
module.exports = exports['default'];

},{"jsuri":3}],11:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _events = _dereq_('./events');

var _events2 = _interopRequireDefault(_events);

var _jwt = _dereq_('./jwt');

var _jwt2 = _interopRequireDefault(_jwt);

var _uri = _dereq_('./uri');

var _uri2 = _interopRequireDefault(_uri);

var _uiParams = _dereq_('./ui-params');

var _uiParams2 = _interopRequireDefault(_uiParams);

var _hostUtil = _dereq_('../host/util');

var _hostUtil2 = _interopRequireDefault(_hostUtil);

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

  var self,
      id,
      target,
      remoteOrigin,
      channel,
      mixin,
      localKey,
      remoteKey,
      addonKey,
      w = window,
      loc = w.location.toString(),
      locals = bindings.local || {},
      remotes = bindings.remote || [],
      localOrigin = getBaseUrl(loc);

  // A hub through which all async callbacks for remote requests are parked until invoked from a response
  var nexus = (function () {
    var callbacks = {};
    return {
      // Registers a callback of a given type by uid
      add: function add(uid, done, fail) {
        callbacks[uid] = {
          done: done || null,
          fail: fail || null,
          async: !!done
        };
      },
      // Invokes callbacks for a response of a given type by uid if registered, then removes all handlers for the uid
      invoke: function invoke(type, uid, arg) {
        var handled;
        if (callbacks[uid]) {
          if (callbacks[uid][type]) {
            // If the intended callback exists, invoke it and mark the response as handled
            callbacks[uid][type](arg);
            handled = true;
          } else {
            // Only mark other calls as handled if they weren't expecting a callback and didn't fail
            handled = !callbacks[uid].async && type !== 'fail';
          }
          delete callbacks[uid];
        }
        return handled;
      }
    };
  })();

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

    // if there is already an iframe created. Destroy it. It's an old version.

    $(document.getElementById(config.container)).find('iframe').trigger('ra.iframe.destroy');

    var iframe = createIframe(config);
    target = iframe.contentWindow;
    localKey = param(config.remote, 'oauth_consumer_key') || param(config.remote, 'jwt');
    remoteKey = config.remoteKey;
    addonKey = remoteKey;
    remoteOrigin = getBaseUrl(config.remote).toLowerCase();
    channel = config.channel;
    // Define the host-side mixin
    mixin = {
      isHost: true,
      iframe: iframe,
      uiParams: config.uiParams,
      destroy: function destroy() {
        window.clearTimeout(self.timeout); //clear the iframe load time.
        // Unbind postMessage handler when destroyed
        unbind();
        // Then remove the iframe, if it still exists
        if (self.iframe) {
          $(self.iframe).remove();
          delete self.iframe;
        }
      },
      isActive: function isActive() {
        // Host-side instances are only active as long as the iframe they communicate with still exists in the DOM
        return $.contains(document.documentElement, self.iframe);
      }
    };
    $(iframe).on('ra.iframe.destroy', mixin.destroy);
  } else {
    // Add-on-side constructor branch
    target = w.parent;
    localKey = 'local'; // Would be better to make this the add-on key, but it's not readily available at this time

    // identify the add-on by unique key: first try JWT issuer claim and fall back to OAuth1 consumer key
    var jwtParam = param(loc, 'jwt');
    remoteKey = jwtParam ? _jwt2['default'].parseJwtIssuer(jwtParam) : param(loc, 'oauth_consumer_key');

    // if the authentication method is 'none' then it is valid to have no jwt and no oauth in the url
    // but equally we don't trust this iframe as far as we can throw it, so assign it a random id
    // in order to prevent it from talking to any other iframe
    if (null === remoteKey) {
      remoteKey = Math.random(); // unpredictable and unsecured, like an oauth consumer key
    }

    addonKey = localKey;
    remoteOrigin = param(loc, 'xdm_e').toLowerCase();
    channel = param(loc, 'xdm_c');
    // Define the add-on-side mixin
    mixin = {
      isHost: false,
      isActive: function isActive() {
        // Add-on-side instances are always active, as they must always have a parent window peer
        return true;
      }
    };
  }

  id = addonKey + '|' + (count += 1);

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
    send(sid, 'request', { n: methodName, a: args });
  }

  function sendDone(sid, message) {
    send(sid, 'done', message);
  }

  function sendFail(sid, message) {
    send(sid, 'fail', message);
  }

  // Handles an normalized, incoming post-message event
  function receive(e) {
    try {
      // Extract message payload from the event
      var payload = JSON.parse(e.data),
          pid = payload.i,
          pchannel = payload.c,
          ptype = payload.t,
          pmessage = payload.m;

      // if the iframe has potentially been reloaded. re-attach the source contentWindow object
      if (e.source !== target && e.origin.toLowerCase() === remoteOrigin && pchannel === channel) {
        target = e.source;
      }

      // If the payload doesn't match our expected event signature, assume its not part of the xdm-rpc protocol
      if (e.source !== target || e.origin.toLowerCase() !== remoteOrigin || pchannel !== channel) {
        return;
      }

      if (ptype === 'request') {
        // If the payload type is request, this is an incoming method invocation
        var name = pmessage.n,
            args = pmessage.a,
            local = locals[name],
            done,
            fail,
            async;
        if (local) {
          // The message name matches a locally defined RPC method, so inspect and invoke it according
          // Create responders for each response type
          done = function (message) {
            sendDone(pid, message);
          };
          fail = function (message) {
            sendFail(pid, message);
          };
          // The local method is considered async if it accepts more arguments than the message has sent;
          // the additional arguments are filled in with the above async responder callbacks;
          // TODO: consider specifying args somehow in the remote stubs so that non-callback args can be
          //       verified before sending a request to fail fast at the callsite
          async = (args ? args.length : 0) < local.length;
          var context = locals;
          if (self.isHost === true) {
            context = self;
            if (context.analytics) {
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
            logError(ex);
          }
        } else {
          // No such local rpc method name found
          debug('Unhandled request:', payload);
        }
      } else if (ptype === 'done' || ptype === 'fail') {
        // The payload is of a response type, so try to invoke the appropriate callback via the nexus registry
        if (!nexus.invoke(ptype, pid, pmessage)) {
          // The nexus didn't find an appropriate reponse callback to invoke
          debug('Unhandled response:', ptype, pid, pmessage);
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
      var args = [].slice.call(arguments),
          done,
          fail;
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
    if (typeof methodName === 'number') methodName = v;
    self[methodName] = bridge(methodName);
  });

  // Create and attach a local event emitter for bridged pub/sub
  var bus = self.events = new _events2['default'].Events(localKey, localOrigin);
  // Attach an any-listener to forward all locally-originating events to the remote peer
  bus.onAny(function () {
    // The actual event object is the last argument passed to any listener
    var event = arguments[arguments.length - 1];
    var trace = event.trace = event.trace || {};
    var traceKey = self.id + '|xdm';
    if (self.isHost && !trace[traceKey] && event.source.channel !== self.id || !self.isHost && event.source.key === localKey) {
      // Only forward an event once in this listener
      trace[traceKey] = true;
      // Clone the event and forward without tracing info, to avoid leaking host-side iframe topology to add-ons
      event = $.extend({}, event);
      delete event.trace;
      debug('Forwarding ' + (self.isHost ? 'host' : 'addon') + ' event:', event);
      sendRequest('_event', [event]);
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
    debug('Receiving as ' + (this.isHost ? 'host' : 'addon') + ' event:', event);
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
    $(window).bind('message', postMessageHandler);
  }

  // Stops listening for window messaging events
  function unbind() {
    $(window).unbind('message', postMessageHandler);
  }

  // Crudely extracts a query param value from a url by name
  function param(url, name) {
    return new _uri2['default'].init(url).getQueryParamValue(name);
  }

  // Determines a base url consisting of protocol+domain+port from a given url string
  function getBaseUrl(url) {
    return new _uri2['default'].init(url).origin();
  }

  // Appends a map of query parameters to a base url
  function toUrl(base, params) {
    var url = new _uri2['default'].init(base);
    $.each(params, function (k, v) {
      url.addQueryParam(k, v);
    });
    return url.toString();
  }

  // Creates an iframe element from a config option consisting of the following values:
  //  - container:  the parent element of the new iframe
  //  - remote:     the src url of the new iframe
  //  - props:      a map of additional HTML attributes for the new iframe
  //  - channel:    deprecated
  function createIframe(config) {
    if (!config.container) {
      throw new Error('config.container must be defined');
    }
    var iframe = document.createElement('iframe'),
        id = 'easyXDM_' + config.container + '_provider',
        windowName = '';

    if (config.uiParams) {
      windowName = _uiParams2['default'].encode(config.uiParams);
    }
    $.extend(iframe, { id: id, name: windowName, frameBorder: '0' }, config.props);
    //$.extend will not add the attribute rel.
    iframe.setAttribute('rel', 'nofollow');
    $(document.getElementById(config.container)).append(iframe);
    $(iframe).trigger('ra.iframe.create');
    iframe.src = config.remote;
    return iframe;
  }

  function errmsg(ex) {
    return ex.message || ex.toString();
  }

  function debug() {
    if (XdmRpc.debug) log.apply(w, ['DEBUG:'].concat([].slice.call(arguments)));
  }

  function log() {
    var log = $.log || w.AJS && w.AJS.log;
    if (log) log.apply(w, arguments);
  }

  function logError() {
    // $.error seems to do the same thing as $.log in client console
    var error = w.AJS && w.AJS.error;
    if (error) error.apply(w, arguments);
  }

  // Immediately start listening for events
  bind();

  return self;
}

//  XdmRpc.debug = true;

exports['default'] = XdmRpc;
module.exports = exports['default'];

},{"../host/util":12,"./events":7,"./jwt":8,"./ui-params":9,"./uri":10}],12:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
function escapeSelector(s) {
    if (!s) {
        throw new Error('No selector to escape');
    }
    return s.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, '\\$&');
}

exports['default'] = { escapeSelector: escapeSelector };
module.exports = exports['default'];

},{}],13:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _util = _dereq_('./util');

var _util2 = _interopRequireDefault(_util);

var _dollar = _dereq_('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _commonEvents = _dereq_('../common/events');

var _commonEvents2 = _interopRequireDefault(_commonEvents);

var _commonBase64 = _dereq_('../common/base64');

var _commonBase642 = _interopRequireDefault(_commonBase64);

var _commonUri = _dereq_('../common/uri');

var _commonUri2 = _interopRequireDefault(_commonUri);

var _commonUiParams = _dereq_('../common/ui-params');

var _commonUiParams2 = _interopRequireDefault(_commonUiParams);

var _commonXdmRpc = _dereq_('../common/xdm-rpc');

var _commonXdmRpc2 = _interopRequireDefault(_commonXdmRpc);

var _rpc = _dereq_('./rpc');

var _rpc2 = _interopRequireDefault(_rpc);

var _events2 = _dereq_('./events');

var _events3 = _interopRequireDefault(_events2);

var _env = _dereq_('./env');

var _env2 = _interopRequireDefault(_env);

var _messages = _dereq_('./messages');

var _messages2 = _interopRequireDefault(_messages);

var _dialog = _dereq_('./dialog');

var _dialog2 = _interopRequireDefault(_dialog);

var _inlineDialog = _dereq_('./inline-dialog');

var _inlineDialog2 = _interopRequireDefault(_inlineDialog);

var _resize_listener = _dereq_('./resize_listener');

var _resize_listener2 = _interopRequireDefault(_resize_listener);

// pre-populate all the old core modules for the old AP.require syntax.

var modules = {
  '_util': { exports: _util2['default'] },
  '_dollar': { exports: _dollar2['default'] },
  '_events': { exports: _commonEvents2['default'] },
  '_base64': { exports: _commonBase642['default'] },
  '_uri': { exports: _commonUri2['default'] },
  '_ui-params': { exports: _commonUiParams2['default'] },
  '_xdm': { exports: _commonXdmRpc2['default'] },
  '_rpc': { exports: _rpc2['default'] },
  'events': { exports: _events3['default'] },
  'env': { exports: _env2['default'] },
  'messages': { exports: _messages2['default'] },
  'dialog': { exports: _dialog2['default'] },
  'inline-dialog': { exports: _inlineDialog2['default'] },
  '_resize_listener': { exports: _resize_listener2['default'] }
};

function reqAll(deps, callback) {
  var mods = [],
      i = 0,
      len = deps.length;
  function addOne(mod) {
    mods.push(mod);
    if (mods.length === len) {
      var exports = [],
          i = 0;
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
  } else {
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
exports['default'] = {
  define: function define(name, deps, exports) {
    var mod = getOrCreate(name),
        factory;
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
module.exports = exports['default'];

},{"../common/base64":5,"../common/events":7,"../common/ui-params":9,"../common/uri":10,"../common/xdm-rpc":11,"./dialog":14,"./dollar":15,"./env":16,"./events":17,"./inline-dialog":18,"./messages":19,"./resize_listener":20,"./rpc":21,"./util":22}],14:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = _dereq_('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _rpc = _dereq_('./rpc');

var _rpc2 = _interopRequireDefault(_rpc);

var _commonUiParams = _dereq_('../common/ui-params');

var _commonUiParams2 = _interopRequireDefault(_commonUiParams);

var _commonUri = _dereq_('../common/uri');

var _commonUri2 = _interopRequireDefault(_commonUri);

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

var uiParams = _commonUiParams2['default'].fromUrl(window.location.toString()),
    isDialog = Boolean(uiParams.dlg) || Boolean(uiParams.isDialog),
    _exports,
    url = new _commonUri2['default'].init(window.location.toString());

// if it has been set to a dialog on the server.
if (url.getQueryParamValue('dialog') === '1') {
  isDialog = true;
}

_rpc2['default'].extend(function (remote) {

  // dialog-related sub-api for use when the remote plugin is running as the content of a host dialog

  var listeners = {};

  _exports = {
    /**
    * Creates a dialog for a web-item or page module key.
    * @name Dialog
    * @class
    * @property {function} on Takes parameters event name ({String}) and callback ({Function})
    * @param {DialogOptions} options configuration object of dialog options.
    * @example
    * AP.require('dialog', function(dialog){
    *   dialog.create({
    *     key: 'my-module-key',
    *     width: '500px',
    *     height: '200px',
    *     chrome: true
    *   }).on('close', callbackFunc);
    * });
    *
    * @return {Dialog} Dialog object allowing for callback registrations
    */
    create: function create(options) {
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
        on: function on(event, callback) {
          // HACK: Note this is a 'once' as it's assumed the only event is 'close', and close is only fired
          // once per dialog. If we changed this to 'on', then it would be fired when *any* dialog is closed,
          // meaning that if say two dialog were opened, closed, opened, then closed, then the callback
          // registered for the first dialog would be issued when the second was closed.
          remote.events.once('dialog.' + event, callback);
        }
      };
    },
    /**
    * Closes the currently open dialog. Optionally pass data to listeners of the `dialog.close` event.
    * This will only close a dialog that has been opened by your add-on.
    * You can register for close events using the `dialog.close` event and the [events module](module-Events.html)
    * @param {Object} data An object to be emitted on dialog close.
    * @noDemo
    * @example
    * AP.require('dialog', function(dialog){
    *   dialog.close({foo: 'bar'});
    * });
    */
    close: function close(data) {
      remote.events.emit('dialog.close', data);
      remote.closeDialog();
    },

    isDialog: isDialog,

    /**
    * register callbacks responding to messages from the host dialog, such as 'submit' or 'cancel'
    * @param String button either 'cancel' or 'submit'
    * @param Function callback function
    * @deprecated
    */
    onDialogMessage: function onDialogMessage(message, listener) {
      this.getButton(message).bind(listener);
    },
    /**
    * Returns the button that was requested (either cancel or submit)
    * @returns {DialogButton}
    * @noDemo
    * @example
    * AP.require('dialog', function(dialog){
    *   dialog.getButton('submit');
    * });
    */
    getButton: function getButton(name) {
      /**
      * @class DialogButton
      * @description A dialog button that can be controlled with javascript
      */
      return {
        name: name,

        /**
        * Sets the button state to enabled
        * @memberOf DialogButton
        * @noDemo
        * @example
        * AP.require('dialog', function(dialog){
        *   dialog.getButton('submit').enable();
        * });
        */
        enable: function enable() {
          remote.setDialogButtonEnabled(name, true);
        },
        /**
        * Sets the button state to disabled
        * @memberOf DialogButton
        * @noDemo
        * @example
        * AP.require('dialog', function(dialog){
        *   dialog.getButton('submit').disable();
        * });
        */
        disable: function disable() {
          remote.setDialogButtonEnabled(name, false);
        },
        /**
        * Toggle the button state between enabled and disabled.
        * @memberOf DialogButton
        * @noDemo
        * @example
        * AP.require('dialog', function(dialog){
        *   dialog.getButton('submit').toggle();
        * });
        */
        toggle: function toggle() {
          var self = this;
          self.isEnabled(function (enabled) {
            self[enabled ? 'disable' : 'enable'](name);
          });
        },
        /**
        * Query a button for it's current state.
        * @memberOf DialogButton
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
        isEnabled: function isEnabled(callback) {
          remote.isDialogButtonEnabled(name, callback);
        },
        /**
        * Registers a function to be called when the button is clicked.
        * @memberOf DialogButton
        * @param {Function} callback function to be triggered on click or programatically.
        * @noDemo
        * @example
        * AP.require('dialog', function(dialog){
        *   dialog.getButton('submit').bind(function(){
        *     alert('clicked!');
        *   });
        * });
        */
        bind: function bind(listener) {
          remote.dialogListenerBound();
          var list = listeners[name];
          if (!list) {
            list = listeners[name] = [];
          }
          list.push(listener);
        },
        /**
        * Trigger a callback bound to a button.
        * @memberOf DialogButton
        * @noDemo
        * @example
        * AP.require('dialog', function(dialog){
        *   dialog.getButton('submit').bind(function(){
        *     alert('clicked!');
        *   });
        *   dialog.getButton('submit').trigger();
        * });
        */
        trigger: function trigger() {
          var self = this,
              cont = true,
              result = true,
              list = listeners[name];
          _dollar2['default'].each(list, function (i, listener) {
            result = listener.call(self, {
              button: self,
              stopPropagation: function stopPropagation() {
                cont = false;
              }
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
      dialogMessage: function dialogMessage(name) {
        var result = true;
        try {
          if (isDialog) {
            result = _exports.getButton(name).trigger();
          } else {
            _dollar2['default'].handleError('Received unexpected dialog button event from host:', name);
          }
        } catch (e) {
          _dollar2['default'].handleError(e);
        }
        return result;
      }

    },

    stubs: ['dialogListenerBound', 'setDialogButtonEnabled', 'isDialogButtonEnabled', 'createDialog', 'closeDialog'],

    init: function init() {
      if (isDialog) {
        window.addEventListener('keydown', function (event) {
          if (event.keyCode === 27) {
            _exports.close();
          }
        });
      }
    }

  };
});

exports['default'] = _exports;
module.exports = exports['default'];

},{"../common/ui-params":9,"../common/uri":10,"./dollar":15,"./rpc":21}],15:[function(_dereq_,module,exports){
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

},{"./util":22}],16:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = _dereq_('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _rpc = _dereq_('./rpc');

var _rpc2 = _interopRequireDefault(_rpc);

var _commonUiParams = _dereq_('../common/ui-params');

var _commonUiParams2 = _interopRequireDefault(_commonUiParams);

var uiParams = _commonUiParams2['default'].fromWindowName(),
    isInlineDialog = Boolean(uiParams.isInlineDialog),
    isInlineAddon = Boolean(uiParams.isInlineAddon);

var apis = _rpc2['default'].extend(function (remote) {

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
      getLocation: function getLocation(callback) {
        remote.getLocation(callback);
      },

      getUser: function getUser(callback) {
        AP.require(['user'], function (user) {
          if (user && user.getUser) {
            return user.getUser(callback);
          }
        });
      },

      /**
      * resize this iframe
      * @method
      * @param {String} width   the desired width
      * @param {String} height  the desired height
      */
      resize: _dollar2['default'].debounce(function (width, height) {
        var dim = apis.size(width, height, apis.container());
        remote.resize(dim.w, dim.h);
      }, 50),

      sizeToParent: _dollar2['default'].debounce(function () {
        remote.sizeToParent();
      }, 50)
    }

  };
});

exports['default'] = _dollar2['default'].extend(apis, {

  meta: function meta(name) {
    //IE8 fallback: querySelectorAll will never find nodes by name.
    if (navigator.userAgent.indexOf('MSIE 8') >= 0) {
      var i,
          metas = document.getElementsByTagName('meta');

      for (i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute('name') === 'ap-' + name) {
          return metas[i].getAttribute('content');
        }
      }
    } else {
      return (0, _dollar2['default'])('meta[name="ap-' + name + '"]').attr('content');
    }
  },

  container: function container() {
    // Look for these two selectors first... you need these to allow for the auto-shrink to work
    // Otherwise, it'll default to document.body which can't auto-grow or auto-shrink
    var container = (0, _dollar2['default'])('.ac-content, #content');
    return container.length > 0 ? container[0] : document.body;
  },

  localUrl: function localUrl(path) {
    return this.meta('local-base-url') + (path == null ? '' : path);
  },

  size: function size(width, height, container) {
    var w = width == null ? '100%' : width,
        h,
        docHeight;

    if (!container) {
      container = this.container();
    }

    // if it's an inline dialog. 100% won't work. Instead, get the container pixel width.
    if ((!w || w === '100%') && (isInlineAddon || isInlineDialog && width === '100%')) {
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
    // we need to return pixel width for inline elements such as dialogs and inline dialogs
    // as they cannot get height from the parent.
    return { w: w, h: h };
  }
});
module.exports = exports['default'];

},{"../common/ui-params":9,"./dollar":15,"./rpc":21}],17:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = _dereq_('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _rpc = _dereq_('./rpc');

var _rpc2 = _interopRequireDefault(_rpc);

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

exports['default'] = _rpc2['default'].extend(function (remote) {
  // Expose an Events API that delegates the to the underlying XdmRpc events bus; this is necessary since the bus
  // itself isn't actually created until the XdmRpc object is constructed, which hasn't happened yet at this point;
  // see the jsdoc in ../_events.js for API docs
  var apis = {};
  _dollar2['default'].each(['on', 'once', 'onAny', 'off', 'offAll', 'offAny', 'emit'], function (_, name) {
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
module.exports = exports['default'];

},{"./dollar":15,"./rpc":21}],18:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = _dereq_('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _rpc = _dereq_('./rpc');

var _rpc2 = _interopRequireDefault(_rpc);

/**
 * The inline dialog is a wrapper for secondary content/controls to be displayed on user request. Consider this component as displayed in context to the triggering control with the dialog overlaying the page content.
 * A inline dialog should be preferred over a modal dialog when a connection between the action has a clear benefit versus having a lower user focus.
 *
 * For more information, read about the Atlassian User Interface [inline dialog component](https://docs.atlassian.com/aui/latest/docs/inlineDialog.html).
 * @exports inline-dialog
 */

var _exports;

_rpc2['default'].extend(function (remote) {
    _exports = {
        /**
        * Hide the inline dialog that contains your connect add-on.
        * @noDemo
        * @example
        * AP.require('inline-dialog', function(inlineDialog){
        *   inlineDialog.hide();
        * });
        */
        hide: function hide() {
            remote.hideInlineDialog();
        }
    };
    return {
        stubs: ['hideInlineDialog']
    };
});

exports['default'] = _exports;
module.exports = exports['default'];

},{"./dollar":15,"./rpc":21}],19:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = _dereq_('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _rpc = _dereq_('./rpc');

var _rpc2 = _interopRequireDefault(_rpc);

/**
* Messages are the primary method for providing system feedback in the product user interface.
* Messages include notifications of various kinds: alerts, confirmations, notices, warnings, info and errors.
* For visual examples of each kind please see the [Design guide](https://developer.atlassian.com/design/latest/communicators/messages/).
* ### Example ###
* ```
* AP.require('messages', function(messages){
*   //create a message
*   var message = messages.info('plain text title', 'plain text body');
* });
* ```
* @exports messages
*/

var messageId = 0;

function getMessageId() {
    messageId++;
    return 'ap-message-' + messageId;
}

exports['default'] = _rpc2['default'].extend(function (remote) {

    var apis = {};
    _dollar2['default'].each(['generic', 'error', 'warning', 'success', 'info', 'hint'], function (_, name) {
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
    * AP.require('messages', function(messages){
    *   //create a message
    *   var message = messages.info('title', 'body');
    *   setTimeout(function(){
    *     messages.clear(message);
    *   }, 2000);
    * });
    */

    apis.clear = function (id) {
        remote.clearMessage(id);
    };

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
        * @example
        * AP.require('messages', function(messages){
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
        * @param    {MessageOptions}    options     Message Options
        * @returns  {String}    The id to be used when clearing the message
        * @example
        * AP.require('messages', function(messages){
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
        * @param    {MessageOptions}    options     Message Options
        * @returns  {String}    The id to be used when clearing the message
        * @example
        * AP.require('messages', function(messages){
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
        * @param    {MessageOptions}    options     Message Options
        * @returns  {String}    The id to be used when clearing the message
        * @example
        * AP.require('messages', function(messages){
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
        * @param    {MessageOptions}    options     Message Options
        * @returns  {String}    The id to be used when clearing the message
        * @example
        * AP.require('messages', function(messages){
        *   //create a message
        *   var message = messages.info('title', 'info message example');
        * });
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
        * @example
        * AP.require('messages', function(messages){
        *   //create a message
        *   var message = messages.hint('title', 'hint message example');
        * });
        */

        apis: apis,
        stubs: ['showMessage', 'clearMessage']
    };
});

/**
* @name MessageOptions
* @class
* @property {Boolean}   closeable   Adds a control allowing the user to close the message, removing it from the page.
* @property {Boolean}   fadeout     Toggles the fade away on the message
* @property {Number}    delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
* @property {Number}    duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
*/
module.exports = exports['default'];

},{"./dollar":15,"./rpc":21}],20:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = _dereq_('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

// Normalize overflow/underflow events across browsers
// http://www.backalleycoder.com/2013/03/14/oft-overlooked-overflow-and-underflow-events/
function addFlowListener(element, type, fn) {
    var flow = type == 'over';
    element.addEventListener('OverflowEvent' in window ? 'overflowchanged' : type + 'flow', function (e) {
        if (e.type == type + 'flow' || (e.orient == 0 && e.horizontalOverflow == flow || e.orient == 1 && e.verticalOverflow == flow || e.orient == 2 && e.horizontalOverflow == flow && e.verticalOverflow == flow)) {
            e.flow = type;
            return fn.call(this, e);
        }
    }, false);
};

// Adds a resize listener to a DOM element (other within <body>). It first adds a set of invisible
// 'sensor' divs to the bottom of the selected element. Those sensor divs serve as over/underflow
// detectors using the addFlowLister. The flowListener triggers the over/underflow within the div
// which tells us that the element has resized. We compare the previous and current size. If it's
// changed, we trigger the resize event.
//
// This listener is initiated during the page load event in _init.js. The callback function is
// the actual iframe resize function in env.js.
function addListener(element, fn) {
    var resize = ('onresize' in element);
    if (!resize && !element._resizeSensor) {
        (0, _dollar2['default'])('head').append({ tag: 'style', type: 'text/css', $text: '.ac-resize-sensor,.ac-resize-sensor>div {position: absolute;top: 0;left: 0;width: 100%;height: 100%;overflow: hidden;z-index: -1;}' });
        var sensor = element._resizeSensor = document.createElement('div');
        sensor.className = 'ac-resize-sensor';
        sensor.innerHTML = '<div class="ac-resize-overflow"><div></div></div><div class="ac-resize-underflow"><div></div></div>';

        var x = 0,
            y = 0,
            first = sensor.firstElementChild.firstChild,
            last = sensor.lastElementChild.firstChild,
            matchFlow = function matchFlow(event) {
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

        if (getComputedStyle(element).position === 'static') {
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
    if (_dollar2['default'].inArray(fn, events) == -1) events.push(fn);
    if (!resize) element.addEventListener('resize', fn, false);
    element.onresize = function (e) {
        _dollar2['default'].each(events, function (idx, fn) {
            fn.call(element, e);
        });
    };
};

exports['default'] = {
    addListener: addListener
};
module.exports = exports['default'];

},{"./dollar":15}],21:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = _dereq_('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _commonXdmRpc = _dereq_('../common/xdm-rpc');

var _commonXdmRpc2 = _interopRequireDefault(_commonXdmRpc);

var each = _dollar2['default'].each,
    _extend = _dollar2['default'].extend,
    isFn = _dollar2['default'].isFunction,
    proxy = {},
    rpc,
    apis = {},
    stubs = ['init'],
    internals = {},
    inits = [],
    isInited;

exports['default'] = {

  extend: function extend(config) {
    if (isFn(config)) config = config(proxy);
    _extend(apis, config.apis);
    _extend(internals, config.internals);
    stubs = stubs.concat(config.stubs || []);
    var init = config.init;
    if (isFn(init)) inits.push(init);
    return config.apis;
  },

  // inits the connect add-on on iframe content load
  init: function init(options) {
    options = options || {};
    if (!isInited) {
      // add stubs for each public api
      each(apis, function (method) {
        stubs.push(method);
      });
      // empty config for add-on-side ctor
      rpc = this.rpc = new _commonXdmRpc2['default'](_dollar2['default'], {}, { remote: stubs, local: internals });
      rpc.init();
      _extend(proxy, rpc);
      each(inits, function (_, init) {
        try {
          init(_extend({}, options));
        } catch (ex) {
          _dollar2['default'].handleError(ex);
        }
      });
      isInited = true;
    }
  }

};
module.exports = exports['default'];

},{"../common/xdm-rpc":11,"./dollar":15}],22:[function(_dereq_,module,exports){
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

exports['default'] = {
    each: each,
    log: log,
    decodeQueryComponent: decodeQueryComponent,
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

},{}]},{},[1])(1)
});


//# sourceMappingURL=plugin.js.map