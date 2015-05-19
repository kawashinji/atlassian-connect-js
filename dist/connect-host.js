(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.connectHost = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _addons = _dereq_('./addons');

var _addons2 = _interopRequireDefault(_addons);

var _content = _dereq_('./content');

var _content2 = _interopRequireDefault(_content);

var _create = _dereq_('./create');

var _create2 = _interopRequireDefault(_create);

var _dialogApi = _dereq_('./dialog/api');

var _dialogApi2 = _interopRequireDefault(_dialogApi);

var _dialogBinder = _dereq_('./dialog/binder');

var _dialogBinder2 = _interopRequireDefault(_dialogBinder);

var _dialogRpc = _dereq_('./dialog/rpc');

var _dialogRpc2 = _interopRequireDefault(_dialogRpc);

var _env = _dereq_('./env');

var _env2 = _interopRequireDefault(_env);

var _inlineDialogRpc = _dereq_('./inline-dialog/rpc');

var _inlineDialogRpc2 = _interopRequireDefault(_inlineDialogRpc);

var _inlineDialogBinder = _dereq_('./inline-dialog/binder');

var _inlineDialogBinder2 = _interopRequireDefault(_inlineDialogBinder);

var _loadingIndicator = _dereq_('./loading-indicator');

var _loadingIndicator2 = _interopRequireDefault(_loadingIndicator);

var _messagesRpc = _dereq_('./messages/rpc');

var _messagesRpc2 = _interopRequireDefault(_messagesRpc);

var _resize = _dereq_('./resize');

var _resize2 = _interopRequireDefault(_resize);

var _rpc = _dereq_('./rpc');

var _rpc2 = _interopRequireDefault(_rpc);

var _statusHelper = _dereq_('./status-helper');

var _statusHelper2 = _interopRequireDefault(_statusHelper);

var _commonUiParams = _dereq_('../common/ui-params');

var _commonUiParams2 = _interopRequireDefault(_commonUiParams);

var _commonUri = _dereq_('../common/uri');

var _commonUri2 = _interopRequireDefault(_commonUri);

/**
 * Private namespace for host-side code.
 * @type {*|{}}
 * @private
 * @deprecated use AMD instead of global namespaces. The only thing that should be on _AP is _AP.define and _AP.require.
 */
if (!window._AP) {
    window._AP = {};
}

AJS.toInit(_dialogBinder2['default']);
AJS.toInit(_inlineDialogBinder2['default']);

_rpc2['default'].extend(_addons2['default']);
_rpc2['default'].extend(_dialogRpc2['default']);
_rpc2['default'].extend(_env2['default']);
_rpc2['default'].extend(_inlineDialogRpc2['default']);
_rpc2['default'].extend(_loadingIndicator2['default']);
_rpc2['default'].extend(_messagesRpc2['default']);
_rpc2['default'].extend(_resize2['default']);

exports['default'] = {
    extend: _rpc2['default'].extend,
    init: _rpc2['default'].init,
    uiParams: _commonUiParams2['default'],
    create: _create2['default'],
    _uriHelper: _commonUri2['default'],
    _statusHelper: _statusHelper2['default'],
    webItemHelper: _content2['default'],
    dialog: _dialogApi2['default']
};
module.exports = exports['default'];

},{"../common/ui-params":8,"../common/uri":9,"./addons":11,"./content":13,"./create":14,"./dialog/api":15,"./dialog/binder":16,"./dialog/rpc":19,"./env":21,"./inline-dialog/binder":22,"./inline-dialog/rpc":23,"./loading-indicator":26,"./messages/rpc":28,"./resize":29,"./rpc":30,"./status-helper":31}],2:[function(_dereq_,module,exports){
;(function () {

  var object = typeof exports != 'undefined' ? exports : this; // #8: web workers
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  function InvalidCharacterError(message) {
    this.message = message;
  }
  InvalidCharacterError.prototype = new Error;
  InvalidCharacterError.prototype.name = 'InvalidCharacterError';

  // encoder
  // [https://gist.github.com/999166] by [https://github.com/nignag]
  object.btoa || (
  object.btoa = function (input) {
    var str = String(input);
    for (
      // initialize result and counter
      var block, charCode, idx = 0, map = chars, output = '';
      // if the next str index does not exist:
      //   change the mapping table to "="
      //   check if d has no fractional digits
      str.charAt(idx | 0) || (map = '=', idx % 1);
      // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
      output += map.charAt(63 & block >> 8 - idx % 1 * 8)
    ) {
      charCode = str.charCodeAt(idx += 3/4);
      if (charCode > 0xFF) {
        throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
      }
      block = block << 8 | charCode;
    }
    return output;
  });

  // decoder
  // [https://gist.github.com/1020396] by [https://github.com/atk]
  object.atob || (
  object.atob = function (input) {
    var str = String(input).replace(/=+$/, '');
    if (str.length % 4 == 1) {
      throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
    }
    for (
      // initialize result and counters
      var bc = 0, bs, buffer, idx = 0, output = '';
      // get next character
      buffer = str.charAt(idx++);
      // character found in table? initialize bit storage and add its ascii value;
      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      // try to find character in table (0-63, not found => -1)
      buffer = chars.indexOf(buffer);
    }
    return output;
  });

}());

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

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Base64 = _dereq_('Base64');

var _Base642 = _interopRequireDefault(_Base64);

exports['default'] = {
    encode: _Base642['default'].btoa,
    decode: _Base642['default'].atob
};
module.exports = exports['default'];

},{"Base64":2}],5:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var $;
{
    $ = _dereq_('../host/dollar');
}

exports['default'] = $;

module.exports = exports['default'];
},{"../host/dollar":20}],6:[function(_dereq_,module,exports){
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

},{"./dollar":5}],7:[function(_dereq_,module,exports){
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

},{"./base64":4}],8:[function(_dereq_,module,exports){
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

},{"./base64":4,"./uri":9}],9:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jsuri = _dereq_('jsuri');

var _jsuri2 = _interopRequireDefault(_jsuri);

exports['default'] = { init: _jsuri2['default'] };
module.exports = exports['default'];

},{"jsuri":3}],10:[function(_dereq_,module,exports){
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

    // if the authentication method is "none" then it is valid to have no jwt and no oauth in the url
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

},{"../host/util":32,"./events":6,"./jwt":7,"./ui-params":8,"./uri":9}],11:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = _dereq_('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _rpc = _dereq_('./rpc');

var _rpc2 = _interopRequireDefault(_rpc);

// Note that if it's desireable to publish host-level events to add-ons, this would be a good place to wire
// up host listeners and publish to each add-on, rather than using each XdmRpc.events object directly.

var _channels = {};

// Tracks all channels (iframes with an XDM bridge) for a given add-on key, managing event propagation
// between bridges, and potentially between add-ons.

exports['default'] = function () {
    var self = {
        _emitEvent: function _emitEvent(event) {
            _dollar2['default'].each(_channels[event.source.key], function (id, channel) {
                channel.bus._emitEvent(event);
            });
        },
        remove: function remove(xdm) {
            var channel = _channels[xdm.addonKey][xdm.id];
            if (channel) {
                channel.bus.offAny(channel.listener);
            }
            delete _channels[xdm.addonKey][xdm.id];
            return this;
        },
        init: function init(config, xdm) {
            if (!_channels[xdm.addonKey]) {
                _channels[xdm.addonKey] = {};
            }
            var channel = _channels[xdm.addonKey][xdm.id] = {
                bus: xdm.events,
                listener: function listener() {
                    var event = arguments[arguments.length - 1];
                    var trace = event.trace = event.trace || {};
                    var traceKey = xdm.id + '|addon';
                    if (!trace[traceKey]) {
                        // Only forward an event once in this listener
                        trace[traceKey] = true;
                        self._emitEvent(event);
                    }
                }
            };
            channel.bus.onAny(channel.listener); //forward add-on events.

            // Remove reference to destroyed iframes such as closed dialogs.
            channel.bus.on('ra.iframe.destroy', function () {
                self.remove(xdm);
            });
        }
    };
    return self;
};

module.exports = exports['default'];

},{"./dollar":20,"./rpc":30}],12:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _dollar = _dereq_("./dollar");

var _dollar2 = _interopRequireDefault(_dollar);

/**
 * Blacklist certain bridge functions from being sent to analytics
 * @const
 * @type {Array}
 */
var BRIDGEMETHODBLACKLIST = ["resize", "init"];

/**
 * Timings beyond 20 seconds (connect's load timeout) will be clipped to an X.
 * @const
 * @type {int}
 */
var THRESHOLD = 20000;

/**
 * Trim extra zeros from the load time.
 * @const
 * @type {int}
 */
var TRIMPPRECISION = 100;

function time() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

function Analytics(addonKey, moduleKey) {
    var metrics = {};
    this.addonKey = addonKey;
    this.moduleKey = moduleKey;
    this.iframePerformance = {
        start: function start() {
            metrics.startLoading = time();
        },
        end: function end() {
            var value = time() - metrics.startLoading;
            proto.track("iframe.performance.load", {
                addonKey: addonKey,
                moduleKey: moduleKey,
                value: value > THRESHOLD ? "x" : Math.ceil(value / TRIMPPRECISION)
            });
            delete metrics.startLoading;
        },
        timeout: function timeout() {
            proto.track("iframe.performance.timeout", {
                addonKey: addonKey,
                moduleKey: moduleKey
            });
            //track an end event during a timeout so we always have complete start / end data.
            this.end();
        },
        // User clicked cancel button during loading
        cancel: function cancel() {
            proto.track("iframe.performance.cancel", {
                addonKey: addonKey,
                moduleKey: moduleKey
            });
        }
    };
}

var proto = Analytics.prototype;

proto.getKey = function () {
    return this.addonKey + ":" + this.moduleKey;
};

proto.track = function (name, data) {
    var prefixedName = "connect.addon." + name;
    if (AJS.Analytics) {
        AJS.Analytics.triggerPrivacyPolicySafeEvent(prefixedName, data);
    } else if (AJS.trigger) {
        // BTF fallback
        AJS.trigger("analyticsEvent", {
            name: prefixedName,
            data: data
        });
    } else {
        return false;
    }

    return true;
};

proto.trackBridgeMethod = function (name) {
    if (_dollar2["default"].inArray(name, BRIDGEMETHODBLACKLIST) !== -1) {
        return false;
    }
    this.track("bridge.invokemethod", {
        name: name,
        addonKey: this.addonKey,
        moduleKey: this.moduleKey
    });
};

exports["default"] = {
    get: function get(addonKey, moduleKey) {
        return new Analytics(addonKey, moduleKey);
    }
};
module.exports = exports["default"];

},{"./dollar":20}],13:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = _dereq_('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _commonUri = _dereq_('../common/uri');

var _commonUri2 = _interopRequireDefault(_commonUri);

/**
* Utility methods for rendering connect addons in AUI components
*/

function getWebItemPluginKey(target) {
    var cssClass = target.attr('class');
    var m = cssClass ? cssClass.match(/ap-plugin-key-([^\s]*)/) : null;
    return _dollar2['default'].isArray(m) ? m[1] : false;
}
function getWebItemModuleKey(target) {
    var cssClass = target.attr('class');
    var m = cssClass ? cssClass.match(/ap-module-key-([^\s]*)/) : null;
    return _dollar2['default'].isArray(m) ? m[1] : false;
}

function getOptionsForWebItem(target) {
    var moduleKey = getWebItemModuleKey(target),
        type = target.hasClass('ap-inline-dialog') ? 'inlineDialog' : 'dialog';
    return window._AP[type + 'Options'][moduleKey] || {};
}

function contextFromUrl(url) {
    var pairs = new _commonUri2['default'].init(url).queryPairs;
    var obj = {};
    _dollar2['default'].each(pairs, function (key, value) {
        obj[value[0]] = value[1];
    });
    return obj;
}

function eventHandler(action, selector, callback) {

    function domEventHandler(event) {
        event.preventDefault();
        var $el = (0, _dollar2['default'])(event.target).closest(selector),
            href = $el.attr('href'),
            url = new _commonUri2['default'].init(href),
            options = {
            bindTo: $el,
            header: $el.text(),
            width: url.getQueryParamValue('width'),
            height: url.getQueryParamValue('height'),
            cp: url.getQueryParamValue('cp'),
            key: getWebItemPluginKey($el),
            productContext: contextFromUrl(href)
        };
        callback(href, options, event.type);
    }

    (0, _dollar2['default'])(window.document).on(action, selector, domEventHandler);
}

exports['default'] = {
    eventHandler: eventHandler,
    getOptionsForWebItem: getOptionsForWebItem,
    getWebItemPluginKey: getWebItemPluginKey,
    getWebItemModuleKey: getWebItemModuleKey
};
module.exports = exports['default'];

},{"../common/uri":9,"./dollar":20}],14:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = _dereq_('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _analytics = _dereq_('./analytics');

var _analytics2 = _interopRequireDefault(_analytics);

var _rpc = _dereq_('./rpc');

var _rpc2 = _interopRequireDefault(_rpc);

var _commonUiParams = _dereq_('../common/ui-params');

var _commonUiParams2 = _interopRequireDefault(_commonUiParams);

var _util = _dereq_('./util');

var _util2 = _interopRequireDefault(_util);

var defer = window.requestAnimationFrame || function (f) {
  setTimeout(f, 10);
};

function contentDiv(ns) {
  if (!ns) {
    throw new Error('ns undefined');
  }
  return (0, _dollar2['default'])(document.getElementById('embedded-' + ns));
}

/**
* @name Options
* @class
* @property {String}  ns            module key
* @property {String}  src           url of the iframe
* @property {String}  w             width of the iframe
* @property {String}  h             height of the iframe
* @property {String}  dlg           is a dialog (disables the resizer)
* @property {String}  simpleDlg     deprecated, looks to be set when a confluence macro editor is being rendered as a dialog
* @property {Boolean} general       is a page that can be resized
* @property {String}  productCtx    context to pass back to the server (project id, space id, etc)
* @property {String}  key           addon key from the descriptor
* @property {String}  uid           id of the current user
* @property {String}  ukey          user key
* @property {String}  data.timeZone timezone of the current user
* @property {String}  cp            context path
*/

/**
* @param {Options} options These values come from the velocity template and can be overridden using uiParams
*/
function create(options) {
  if (typeof options.uiParams !== 'object') {
    options.uiParams = _commonUiParams2['default'].fromUrl(options.src);
  }

  var ns = options.ns,
      contentId = 'embedded-' + ns,
      channelId = 'channel-' + ns,
      initWidth = options.w || '100%',
      initHeight = options.h || '0';

  if (typeof options.uiParams !== 'object') {
    options.uiParams = {};
  }

  if (!!options.general) {
    options.uiParams.isGeneral = true;
  }

  var xdmOptions = {
    remote: options.src,
    remoteKey: options.key,
    container: contentId,
    channel: channelId,
    props: { width: initWidth, height: initHeight },
    uiParams: options.uiParams
  };

  if (options.productCtx && !options.productContext) {
    options.productContext = JSON.parse(options.productCtx);
  }

  _rpc2['default'].extend({
    init: function init(opts, xdm) {
      xdm.analytics = _analytics2['default'].get(xdm.addonKey, ns);
      xdm.analytics.iframePerformance.start();
      xdm.productContext = options.productContext;
    }
  });

  _rpc2['default'].init(options, xdmOptions);
}

exports['default'] = function (options) {

  var attemptCounter = 0;
  function doCreate() {
    //If the element we are going to append the iframe to doesn't exist in the dom (yet). Wait for it to appear.
    if (contentDiv(options.ns).length === 0 && attemptCounter < 10) {
      setTimeout(function () {
        attemptCounter++;
        doCreate();
      }, 50);
      return;
    }

    // create the new iframe
    create(options);
  }

  if (AJS.$.isReady) {
    // if the dom is ready then this is being run during an ajax update;
    // in that case, defer creation until the next event loop tick to ensure
    // that updates to the desired container node's parents have completed
    defer(doCreate);
  } else {
    (0, _dollar2['default'])(doCreate);
  }
};

;
module.exports = exports['default'];

},{"../common/ui-params":8,"./analytics":12,"./dollar":20,"./rpc":30,"./util":32}],15:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _create2 = _dereq_('../create');

var _create3 = _interopRequireDefault(_create2);

var _button = _dereq_('./button');

var _button2 = _interopRequireDefault(_button);

var _statusHelper = _dereq_('../status-helper');

var _statusHelper2 = _interopRequireDefault(_statusHelper);

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var $global = (0, _dollar2['default'])(window);
var idSeq = 0;
var $nexus;
var dialog;
var dialogId;

var buttons = {
    submit: _button2['default'].submit({
        done: closeDialog
    }),
    cancel: _button2['default'].cancel({
        done: closeDialog
    })
};

function keyPressListener(e) {
    if (e.keyCode === 27 && dialog && dialog.hide) {
        dialog.hide();
        (0, _dollar2['default'])(document).unbind('keydown', keyPressListener);
    }
};

function createDialogElement(options, $nexus, chromeless) {
    var $el;
    var extraClasses = ['ap-aui-dialog2'];

    if (chromeless) {
        extraClasses.push('ap-aui-dialog2-chromeless');
    }

    $el = (0, _dollar2['default'])(aui.dialog.dialog2({
        id: options.id,
        titleText: options.header,
        titleId: options.titleId,
        size: options.size,
        extraClasses: extraClasses,
        removeOnHide: true,
        footerActionContent: true,
        modal: true
    }));

    if (chromeless) {
        $el.find('header, footer').remove();
    } else {
        buttons.submit.setText(options.submitText);
        buttons.cancel.setText(options.cancelText);
        //soy templates don't support sending objects, so make the template and bind them.
        $el.find('.aui-dialog2-footer-actions').empty().append(buttons.submit.$el, buttons.cancel.$el);
    }

    $el.find('.aui-dialog2-content').append($nexus);
    $nexus.data('ra.dialog.buttons', buttons);

    function handler(button) {
        // ignore clicks on disabled links
        if (button.isEnabled()) {
            button.$el.trigger('ra.dialog.click', button.dispatch);
        }
    }

    _dollar2['default'].each(buttons, function (i, button) {
        button.$el.click(function () {
            handler(button);
        });
    });

    return $el;
}

function displayDialogContent($container, options) {
    $container.append('<div id="embedded-' + options.ns + '" class="ap-dialog-container ap-content" />');
}

function parseDimension(value, viewport) {
    if (typeof value === 'string') {
        var percent = value.indexOf('%') === value.length - 1;
        value = parseInt(value, 10);
        if (percent) {
            value = value / 100 * viewport;
        }
    }
    return value;
}

function closeDialog() {
    if ($nexus) {
        // Signal the XdmRpc for the dialog's iframe to clean up
        $nexus.trigger('ra.iframe.destroy').removeData('ra.dialog.buttons').unbind();
        // Clear the nexus handle to allow subsequent dialogs to open
        $nexus = null;
    }
    dialog.hide();
}

exports['default'] = {
    id: dialogId,

    getButton: function getButton(name) {
        var buttons = $nexus ? $nexus.data('ra.dialog.buttons') : null;
        return name && buttons ? buttons[name] : buttons;
    },

    /**
    * Constructs a new AUI dialog. The dialog has a single content panel containing a single iframe.
    * The iframe's content is either created by loading [options.src] as the iframe url. Or fetching the content from the server by add-on key + module key.
    *
    * @param {Object} options Options to configure the behaviour and appearance of the dialog.
    * @param {String} [options.header='Remotable Plugins Dialog Title']  Dialog header.
    * @param {String} [options.headerClass='ap-dialog-header'] CSS class to apply to dialog header.
    * @param {String|Number} [options.width='50%'] width of the dialog, expressed as either absolute pixels (eg 800) or percent (eg 50%)
    * @param {String|Number} [options.height='50%'] height of the dialog, expressed as either absolute pixels (eg 600) or percent (eg 50%)
    * @param {String} [options.id] ID attribute to assign to the dialog. Default to 'ap-dialog-n' where n is an autoincrementing id.
    */
    create: function create(options, showLoadingIndicator) {
        var defaultOptions = {
            // These options really _should_ be provided by the caller, or else the dialog is pretty pointless
            width: '50%',
            height: '50%'
        };
        var dialogId = options.id || 'ap-dialog-' + (idSeq += 1);
        var mergedOptions = _dollar2['default'].extend({ id: dialogId }, defaultOptions, options, { dlg: 1 });
        var dialogElement;

        // patch for an old workaround where people would make 100% height / width dialogs.
        if (mergedOptions.width === '100%' && mergedOptions.height === '100%') {
            mergedOptions.size = 'maximum';
        }

        mergedOptions.w = parseDimension(mergedOptions.width, $global.width());
        mergedOptions.h = parseDimension(mergedOptions.height, $global.height());

        $nexus = (0, _dollar2['default'])('<div />').addClass('ap-servlet-placeholder ap-container').attr('id', 'ap-' + options.ns).bind('ra.dialog.close', closeDialog);

        if (options.chrome) {
            dialogElement = createDialogElement(mergedOptions, $nexus);
        } else {
            dialogElement = createDialogElement(mergedOptions, $nexus, true);
        }

        if (options.size) {
            mergedOptions.w = '100%';
            mergedOptions.h = '100%';
        } else {
            AJS.layer(dialogElement).changeSize(mergedOptions.w, mergedOptions.h);
            dialogElement.removeClass('aui-dialog2-medium'); // this class has a min-height so must be removed.
        }

        dialog = AJS.dialog2(dialogElement);
        dialog.on('hide', closeDialog);
        // ESC key closes the dialog
        (0, _dollar2['default'])(document).on('keydown', keyPressListener);

        displayDialogContent($nexus, mergedOptions);

        if (showLoadingIndicator !== false) {
            $nexus.append(_statusHelper2['default'].createStatusMessages());
        }

        //difference between a webitem and opening from js.
        if (options.src) {
            (0, _create3['default'])(mergedOptions);
        }

        dialog.show();
    },

    close: closeDialog
};
module.exports = exports['default'];

},{"../create":14,"../dollar":20,"../status-helper":31,"./button":17}],16:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _content = _dereq_('../content');

var _content2 = _interopRequireDefault(_content);

var _api = _dereq_('./api');

var _api2 = _interopRequireDefault(_api);

var _factory = _dereq_('./factory');

var _factory2 = _interopRequireDefault(_factory);

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

exports['default'] = function () {
    var action = 'click';
    var selector = '.ap-dialog';

    function callback(href, options) {
        var webItemOptions = _content2['default'].getOptionsForWebItem(options.bindTo);
        var moduleKey = _content2['default'].getWebItemModuleKey(options.bindTo);
        var addonKey = _content2['default'].getWebItemPluginKey(options.bindTo);

        _dollar2['default'].extend(options, webItemOptions);

        if (!options.ns) {
            options.ns = moduleKey;
        }

        if (!options.container) {
            options.container = options.ns;
        }

        // webitem target options can sometimes be sent as strings.
        if (typeof options.chrome === 'string') {
            options.chrome = options.chrome.toLowerCase() === 'false' ? false : true;
        }

        //default chrome to be true for backwards compatibility with webitems
        if (options.chrome === undefined) {
            options.chrome = true;
        }

        (0, _factory2['default'])({
            key: addonKey,
            moduleKey: moduleKey
        }, options, options.productContext);
    }

    _content2['default'].eventHandler(action, selector, callback);
};

module.exports = exports['default'];

},{"../content":13,"../dollar":20,"./api":15,"./factory":18}],17:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

function Button(options) {
    this.$el = (0, _dollar2['default'])('<button />').text(options.text).addClass('aui-button aui-button-' + options.type).addClass(options.additionalClasses);

    this.isEnabled = function () {
        return !(this.$el.attr('aria-disabled') === 'true');
    };

    this.setEnabled = function (enabled) {
        //cannot disable a noDisable button
        if (options.noDisable === true) {
            return false;
        }
        this.$el.attr('aria-disabled', !enabled);
        return true;
    };

    this.setEnabled(true);

    this.click = function (listener) {
        if (listener) {
            this.$el.bind('ra.dialog.click', listener);
        } else {
            this.dispatch(true);
        }
    };

    this.dispatch = function (result) {
        var name = result ? 'done' : 'fail';
        options.actions && options.actions[name] && options.actions[name]();
    };

    this.setText = function (text) {
        if (text) {
            this.$el.text(text);
        }
    };
}

exports['default'] = {
    submit: function submit(actions) {
        return new Button({
            type: 'primary',
            text: 'Submit',
            additionalClasses: 'ap-dialog-submit',
            actions: actions
        });
    },

    cancel: function cancel(actions) {
        return new Button({
            type: 'link',
            text: 'Cancel',
            noDisable: true,
            additionalClasses: 'ap-dialog-cancel',
            actions: actions
        });
    }
};
module.exports = exports['default'];

},{"../dollar":20}],18:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _api = _dereq_('./api');

var _api2 = _interopRequireDefault(_api);

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

//might rename this, it opens a dialog by first working out the url (used for javascript opening a dialog).
/**
* opens a dialog by sending the add-on and module keys back to the server for signing.
* Used by dialog-pages, confluence macros and opening from javascript.
* @param {Object} options for passing to AP.create
* @param {Object} dialog options (width, height, etc)
* @param {String} productContextJson pass context back to the server
*/

exports['default'] = function (options, dialogOptions, productContext) {
    var promise;
    var container;
    var uiParams = _dollar2['default'].extend({ isDialog: 1 }, options.uiParams);

    _api2['default'].create({
        id: options.id,
        ns: options.moduleKey || options.key,
        chrome: dialogOptions.chrome || options.chrome,
        header: dialogOptions.header,
        width: dialogOptions.width,
        height: dialogOptions.height,
        size: dialogOptions.size,
        submitText: dialogOptions.submitText,
        cancelText: dialogOptions.cancelText
    }, false);

    container = (0, _dollar2['default'])('.ap-dialog-container');
    if (options.url) {
        throw new Error('Cannot retrieve dialog content by URL');
    }

    promise = window._AP.contentResolver.resolveByParameters({
        addonKey: options.key,
        moduleKey: options.moduleKey,
        productContext: productContext,
        uiParams: uiParams
    });

    promise.done(function (data) {
        var dialogHtml = (0, _dollar2['default'])(data);
        dialogHtml.addClass('ap-dialog-container');
        container.replaceWith(dialogHtml);
    }).fail(function (xhr, status, ex) {
        var title = (0, _dollar2['default'])('<p class="title" />').text('Unable to load add-on content. Please try again later.');
        container.html('<div class="aui-message error ap-aui-message"></div>');
        container.find('.error').append(title);
        var msg = status + (ex ? ': ' + ex.toString() : '');
        container.find('.error').text(msg);
        AJS.log(msg);
    });

    return _api2['default'];
};

module.exports = exports['default'];

},{"../dollar":20,"./api":15}],19:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _api = _dereq_('./api');

var _api2 = _interopRequireDefault(_api);

var _factory = _dereq_('./factory');

var _factory2 = _interopRequireDefault(_factory);

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

exports['default'] = function () {
    return {
        stubs: ['dialogMessage'],

        init: function init(state, xdm) {
            // fallback for old connect p2 plugin.
            if (state.dlg === '1') {
                xdm.uiParams.isDialog = true;
            }

            if (xdm.uiParams.isDialog) {
                var buttons = _api2['default'].getButton();
                if (buttons) {
                    _dollar2['default'].each(buttons, function (name, button) {
                        button.click(function (e, callback) {
                            if (xdm.isActive() && xdm.buttonListenerBound) {
                                xdm.dialogMessage(name, callback);
                            } else {
                                callback(true);
                            }
                        });
                    });
                }
            }
        },

        internals: {
            dialogListenerBound: function dialogListenerBound() {
                this.buttonListenerBound = true;
            },

            setDialogButtonEnabled: function setDialogButtonEnabled(name, enabled) {
                _api2['default'].getButton(name).setEnabled(enabled);
            },

            isDialogButtonEnabled: function isDialogButtonEnabled(name, callback) {
                var button = _api2['default'].getButton(name);
                callback(button ? button.isEnabled() : void 0);
            },

            createDialog: function createDialog(dialogOptions) {
                var xdmOptions = {
                    key: this.addonKey
                };

                //open by key or url. This can be simplified when opening via url is removed.
                if (dialogOptions.key) {
                    xdmOptions.moduleKey = dialogOptions.key;
                } else if (dialogOptions.url) {
                    throw new Error('Cannot open dialog by URL, please use module key');
                }

                if ((0, _dollar2['default'])('.aui-dialog2 :visible').length !== 0) {
                    throw new Error('Cannot open dialog when a layer is already visible');
                }

                (0, _factory2['default'])(xdmOptions, dialogOptions, this.productContext);
            },
            closeDialog: function closeDialog() {
                this.events.emit('ra.iframe.destroy');
                _api2['default'].close();
            }
        }
    };
};

module.exports = exports['default'];

},{"../dollar":20,"./api":15,"./factory":18}],20:[function(_dereq_,module,exports){
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

},{}],21:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports["default"] = function () {
    return {
        internals: {
            getLocation: function getLocation() {
                return window.location.href;
            }
        }
    };
};

module.exports = exports["default"];

},{}],22:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _content = _dereq_('../content');

var _content2 = _interopRequireDefault(_content);

var _simple = _dereq_('./simple');

var _simple2 = _interopRequireDefault(_simple);

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

exports['default'] = function () {
    var inlineDialogTrigger = '.ap-inline-dialog';
    var action = 'click mouseover mouseout';

    function callback(href, options, eventType) {
        var webItemOptions = _content2['default'].getOptionsForWebItem(options.bindTo);
        _dollar2['default'].extend(options, webItemOptions);
        if (options.onHover !== 'true' && eventType !== 'click') {
            return;
        }

        // don't repeatedly open if already visible as dozens of mouse-over events are fired in quick succession
        if (options.onHover === true && options.bindTo.hasClass('active')) {
            return;
        }
        (0, _simple2['default'])(href, options).show();
    }

    _content2['default'].eventHandler(action, inlineDialogTrigger, callback);
};

module.exports = exports['default'];

},{"../content":13,"../dollar":20,"./simple":24}],23:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

function getInlineDialog($content) {
    return $content.closest('.contents').data('inlineDialog');
}

function showInlineDialog($content) {
    getInlineDialog($content).show();
}

function resizeInlineDialog($content, width, height) {
    $content.closest('.contents').css({
        width: width,
        height: height
    });
    refreshInlineDialog($content);
}

function refreshInlineDialog($content) {
    getInlineDialog($content).refresh();
}

function _hideInlineDialog($content) {
    getInlineDialog($content).hide();
}

exports['default'] = function () {
    return {
        init: function init(state, xdm) {
            if (xdm.uiParams.isInlineDialog) {
                (0, _dollar2['default'])(xdm.iframe).closest('.ap-container').on('resized', function (e, dimensions) {
                    resizeInlineDialog((0, _dollar2['default'])(xdm.iframe), dimensions.width, dimensions.height);
                });
            }
        },
        internals: {
            hideInlineDialog: function hideInlineDialog() {
                _hideInlineDialog((0, _dollar2['default'])(this.iframe));
            }
        }
    };
};

module.exports = exports['default'];

},{"../dollar":20}],24:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _content = _dereq_('../content');

var _content2 = _interopRequireDefault(_content);

exports['default'] = function (contentUrl, options) {
    var $inlineDialog;

    // Find the web-item that was clicked, we'll be needing its ID.
    if (!options.bindTo || !options.bindTo.jquery) {
        return;
    }

    var webItem = options.bindTo.hasClass('ap-inline-dialog') ? options.bindTo : options.bindTo.closest('.ap-inline-dialog');
    var itemId = webItem.attr('id');
    if (!itemId) {
        return;
    }

    function displayInlineDialog(content, trigger, showInlineDialog) {
        trigger = (0, _dollar2['default'])(trigger); // sometimes it's not jQuery. Lets make it jQuery.
        content.data('inlineDialog', $inlineDialog);
        var pluginKey = _content2['default'].getWebItemPluginKey(trigger);
        var moduleKey = _content2['default'].getWebItemModuleKey(trigger);
        var promise = window._AP.contentResolver.resolveByParameters({
            addonKey: pluginKey,
            moduleKey: moduleKey,
            isInlineDialog: true,
            productContext: options.productContext,
            uiParams: {
                isInlineDialog: true
            }
        });

        promise.done(function (data) {
            content.empty().append(data);
            // if target options contain width and height. set it.
            if (options.width || options.height) {
                content.css({
                    width: options.width,
                    height: options.height
                });
            }
        }).fail(function (xhr, status, ex) {
            var title = (0, _dollar2['default'])('<p class="title" />').text('Unable to load add-on content. Please try again later.');
            content.html('<div class="aui-message error ap-aui-message"></div>');
            content.find('.error').append(title);
            var msg = status + (ex ? ': ' + ex.toString() : '');
            content.find('.error').text(msg);
            AJS.log(msg);
        }).always(function () {
            showInlineDialog();
        });
    }

    var dialogElementIdentifier = 'ap-inline-dialog-content-' + itemId;

    $inlineDialog = (0, _dollar2['default'])(document.getElementById('inline-dialog-' + dialogElementIdentifier));

    if ($inlineDialog.length !== 0) {
        $inlineDialog.remove();
    }

    //Create the AUI inline dialog with a unique ID.
    $inlineDialog = AJS.InlineDialog(options.bindTo,
    //assign unique id to inline Dialog
    dialogElementIdentifier, displayInlineDialog, options);

    return {
        id: $inlineDialog.attr('id'),

        show: function show() {
            $inlineDialog.show();
        },

        hide: function hide() {
            $inlineDialog.hide();
        }
    };
};

module.exports = exports['default'];

},{"../content":13,"../dollar":20}],25:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = _dereq_('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _commonJwt = _dereq_('../common/jwt');

var _commonJwt2 = _interopRequireDefault(_commonJwt);

function updateUrl(config) {
    var promise = _dollar2['default'].Deferred(function (defer) {
        var contentPromise = window._AP.contentResolver.resolveByParameters({
            addonKey: config.addonKey,
            moduleKey: config.moduleKey,
            productContext: config.productContext,
            uiParams: config.uiParams,
            width: config.width,
            height: config.height,
            classifier: 'json'
        });

        contentPromise.done(function (data) {
            var values = JSON.parse(data);
            defer.resolve(values.src);
        });
    });

    return promise;
}

exports['default'] = {
    updateUrl: updateUrl,
    isExpired: _commonJwt2['default'].isJwtExpired
};
module.exports = exports['default'];

},{"../common/jwt":7,"./dollar":20}],26:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = _dereq_('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _rpc = _dereq_('./rpc');

var _rpc2 = _interopRequireDefault(_rpc);

var _statusHelper = _dereq_('./status-helper');

var _statusHelper2 = _interopRequireDefault(_statusHelper);

exports['default'] = function () {
    return {
        init: function init(state, xdm) {
            var $home = (0, _dollar2['default'])(xdm.iframe).closest('.ap-container');
            _statusHelper2['default'].showLoadingStatus($home, 0);

            $home.find('.ap-load-timeout a.ap-btn-cancel').click(function () {
                _statusHelper2['default'].showLoadErrorStatus($home);
                if (xdm.analytics && xdm.analytics.iframePerformance) {
                    xdm.analytics.iframePerformance.cancel();
                }
            });

            xdm.timeout = setTimeout(function () {
                xdm.timeout = null;
                _statusHelper2['default'].showloadTimeoutStatus($home);
                // if inactive, the iframe has been destroyed by the product.
                if (xdm.isActive() && xdm.analytics && xdm.analytics.iframePerformance) {
                    xdm.analytics.iframePerformance.timeout();
                }
            }, 20000);
        },

        internals: {
            init: function init() {
                if (this.analytics && this.analytics.iframePerformance) {
                    this.analytics.iframePerformance.end();
                }
                var $home = (0, _dollar2['default'])(this.iframe).closest('.ap-container');
                _statusHelper2['default'].showLoadedStatus($home);

                clearTimeout(this.timeout);
                // Let the integration tests know the iframe has loaded.
                $home.find('.ap-content').addClass('iframe-init');
            }
        }
    };
};

module.exports = exports['default'];

},{"./dollar":20,"./rpc":30,"./status-helper":31}],27:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = _dereq_('../dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var MESSAGE_BAR_ID = 'ac-message-container';
var MESSAGE_TYPES = ['generic', 'error', 'warning', 'success', 'info', 'hint'];

function validateMessageId(msgId) {
    return msgId.search(/^ap\-message\-[0-9]+$/) == 0;
}

function getMessageBar() {
    var msgBar = (0, _dollar2['default'])('#' + MESSAGE_BAR_ID);

    if (msgBar.length < 1) {
        msgBar = (0, _dollar2['default'])('<div id="' + MESSAGE_BAR_ID + '" />').appendTo('body');
    }
    return msgBar;
}

function filterMessageOptions(options) {
    var i;
    var key;
    var copy = {};
    var allowed = ['closeable', 'fadeout', 'delay', 'duration', 'id'];

    for (i in allowed) {
        key = allowed[i];
        if (key in options) {
            copy[key] = options[key];
        }
    }

    return copy;
}

exports['default'] = {
    showMessage: function showMessage(name, title, bodyHTML, options) {
        var msgBar = getMessageBar();

        options = filterMessageOptions(options);
        _dollar2['default'].extend(options, {
            title: title,
            body: AJS.escapeHtml(bodyHTML)
        });

        if (_dollar2['default'].inArray(name, MESSAGE_TYPES) < 0) {
            throw 'Invalid message type. Must be: ' + MESSAGE_TYPES.join(', ');
        }
        if (validateMessageId(options.id)) {
            AJS.messages[name](msgBar, options);
            // Calculate the left offset based on the content width.
            // This ensures the message always stays in the centre of the window.
            msgBar.css('margin-left', '-' + msgBar.innerWidth() / 2 + 'px');
        }
    },

    clearMessage: function clearMessage(id) {
        if (validateMessageId(id)) {
            (0, _dollar2['default'])('#' + id).remove();
        }
    }
};
module.exports = exports['default'];

},{"../dollar":20}],28:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _api = _dereq_('./api');

var _api2 = _interopRequireDefault(_api);

exports['default'] = function () {
    return {
        internals: {
            showMessage: function showMessage(name, title, body, options) {
                return _api2['default'].showMessage(name, title, body, options);
            },

            clearMessage: function clearMessage(id) {
                return _api2['default'].clearMessage(id);
            }
        }
    };
};

module.exports = exports['default'];

},{"./api":27}],29:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = _dereq_('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _rpc = _dereq_('./rpc');

var _rpc2 = _interopRequireDefault(_rpc);

exports['default'] = function () {
    return {
        init: function init(config, xdm) {
            xdm.resize = AJS.debounce(function resize($, width, height) {
                $(this.iframe).css({
                    width: width,
                    height: height
                });
                var nexus = $(this.iframe).closest('.ap-container');
                nexus.trigger('resized', {
                    width: width,
                    height: height
                });
            });
        },

        internals: {
            resize: function resize(width, height) {
                if (!this.uiParams.isDialog) {
                    this.resize(_dollar2['default'], width, height);
                }
            },

            sizeToParent: AJS.debounce(function () {
                function resizeHandler(iframe) {
                    var height = (0, _dollar2['default'])(document).height() - (0, _dollar2['default'])('#header > nav').outerHeight() - (0, _dollar2['default'])('#footer').outerHeight() - 20;
                    (0, _dollar2['default'])(iframe).css({
                        width: '100%',
                        height: height + 'px'
                    });
                }
                // sizeToParent is only available for general-pages
                if (this.uiParams.isGeneral) {
                    // This adds border between the iframe and the page footer as the connect addon has scrolling content and can't do this
                    (0, _dollar2['default'])(this.iframe).addClass('full-size-general-page');
                    (0, _dollar2['default'])(window).on('resize', function () {
                        resizeHandler(this.iframe);
                    });
                    resizeHandler(this.iframe);
                } else {
                    // This is only here to support integration testing
                    // see com.atlassian.plugin.connect.test.pageobjects.RemotePage#isNotFullSize()
                    (0, _dollar2['default'])(this.iframe).addClass('full-size-general-page-fail');
                }
            })
        }
    };
};

module.exports = exports['default'];

},{"./dollar":20,"./rpc":30}],30:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = _dereq_('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _commonXdmRpc = _dereq_('../common/xdm-rpc');

var _commonXdmRpc2 = _interopRequireDefault(_commonXdmRpc);

var _jwtKeepAlive = _dereq_('./jwt-keep-alive');

var _jwtKeepAlive2 = _interopRequireDefault(_jwtKeepAlive);

var _commonUri = _dereq_('../common/uri');

var _commonUri2 = _interopRequireDefault(_commonUri);

var each = _dollar2['default'].each;
var _extend = _dollar2['default'].extend;
var isFn = _dollar2['default'].isFunction;
var rpcCollection = [];
var apis = {};
var stubs = [];
var internals = {};
var inits = [];

exports['default'] = {
    extend: function extend(config) {
        if (isFn(config)) {
            config = config();
        }

        _extend(apis, config.apis);
        _extend(internals, config.internals);
        stubs = stubs.concat(config.stubs || []);

        var init = config.init;

        if (isFn(init)) {
            inits.push(init);
        }

        return config.apis;
    },

    // init connect host side
    // options = things that go to all init functions
    init: function init(options, xdmConfig) {
        var remoteUrl = new _commonUri2['default'].init(xdmConfig.remote);
        var remoteJwt = remoteUrl.getQueryParamValue('jwt');
        var promise;

        options = options || {};
        // add stubs for each public api
        each(apis, function (method) {
            stubs.push(method);
        });

        // refresh JWT tokens as required.
        if (remoteJwt && _jwtKeepAlive2['default'].isExpired(remoteJwt)) {
            promise = _jwtKeepAlive2['default'].updateUrl({
                addonKey: xdmConfig.remoteKey,
                moduleKey: options.ns,
                productContext: options.productContext || {},
                uiParams: xdmConfig.uiParams,
                width: xdmConfig.props.width,
                height: xdmConfig.props.height
            });
        }

        _dollar2['default'].when(promise).always(function (src) {
            // if the promise resolves to a new url. update it.
            if (src) {
                xdmConfig.remote = src;
            }
            // TODO: stop copying internals and fix references instead (fix for events going across add-ons when they shouldn't)
            var rpc = new _commonXdmRpc2['default'](_dollar2['default'], xdmConfig, { remote: stubs, local: _dollar2['default'].extend({}, internals) });

            rpcCollection[rpc.id] = rpc;
            each(inits, function (_, init) {
                try {
                    init(_extend({}, options), rpc);
                } catch (ex) {
                    console.log(ex);
                }
            });
        });
    }
};
module.exports = exports['default'];

},{"../common/uri":9,"../common/xdm-rpc":10,"./dollar":20,"./jwt-keep-alive":25}],31:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = _dereq_('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

/**
 * Methods for showing the status of a connect-addon (loading, time'd-out etc)
 */

var statuses = {
    loading: {
        descriptionHtml: '<div class="small-spinner"></div>Loading add-on...'
    },
    'load-timeout': {
        descriptionHtml: '<div class="small-spinner"></div>Add-on is not responding. Wait or <a href="#" class="ap-btn-cancel">cancel</a>?'
    },

    'load-error': {
        descriptionHtml: 'Add-on failed to load.'
    }
};

function hideStatuses($home) {
    // If there's a pending timer to show the loading status, kill it.
    if ($home.data('loadingStatusTimer')) {
        clearTimeout($home.data('loadingStatusTimer'));
        $home.removeData('loadingStatusTimer');
    }
    $home.find('.ap-status').addClass('hidden');
}

function showStatus($home, status) {
    hideStatuses($home);
    $home.closest('.ap-container').removeClass('hidden');
    $home.find('.ap-stats').removeClass('hidden');
    $home.find('.ap-' + status).removeClass('hidden');
    /* setTimout fixes bug in AUI spinner positioning */
    setTimeout(function () {
        var spinner = $home.find('.small-spinner', '.ap-' + status);
        if (spinner.length && spinner.spin) {
            spinner.spin({ zIndex: '1' });
        }
    }, 10);
}

//when an addon has loaded. Hide the status bar.
function showLoadedStatus($home) {
    hideStatuses($home);
}

function showLoadingStatus($home, delay) {
    if (!delay) {
        showStatus($home, 'loading');
    } else {
        // Wait a second before showing loading status.
        var timer = setTimeout(showStatus.bind(null, $home, 'loading'), delay);
        $home.data('loadingStatusTimer', timer);
    }
}

function showloadTimeoutStatus($home) {
    showStatus($home, 'load-timeout');
}

function showLoadErrorStatus($home) {
    showStatus($home, 'load-error');
}

function createStatusMessages() {
    var i;
    var stats = (0, _dollar2['default'])('<div class="ap-stats" />');

    for (i in statuses) {
        var status = (0, _dollar2['default'])('<div class="ap-' + i + ' ap-status hidden" />');
        status.append('<small>' + statuses[i].descriptionHtml + '</small>');
        stats.append(status);
    }
    return stats;
}

exports['default'] = {
    createStatusMessages: createStatusMessages,
    showLoadingStatus: showLoadingStatus,
    showloadTimeoutStatus: showloadTimeoutStatus,
    showLoadErrorStatus: showLoadErrorStatus,
    showLoadedStatus: showLoadedStatus
};
module.exports = exports['default'];

},{"./dollar":20}],32:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
function escapeSelector(s) {
    if (!s) {
        throw new Error("No selector to escape");
    }
    return s.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&");
}

exports["default"] = { escapeSelector: escapeSelector };
module.exports = exports["default"];

},{}]},{},[1])(1)
});


//# sourceMappingURL=connect-host.js.map