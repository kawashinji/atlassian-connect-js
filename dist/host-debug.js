/*! atlassian-connect-js - v0.0.1 - 2014-07-04 */

window._AP = window._AP || {};
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

_AP.define("_dollar", function () {
  return AJS.$;
});

_AP.define("host/_util", function () {
    return {
        escapeSelector: function( s ){
            if(!s){
                throw new Error("No selector to escape");
            }
            return s.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&");
        }
    };
});
_AP.define("_rpc", ["_dollar", "_xdm"], function ($, XdmRpc) {

  "use strict";

  var each = $.each,
      extend = $.extend,
      isFn = $.isFunction,
      rpcCollection = [],
      apis = {},
      stubs = [],
      internals = {},
      inits = [];

  return {

    extend: function (config) {
      if (isFn(config)) config = config();
      extend(apis, config.apis);
      extend(internals, config.internals);
      stubs = stubs.concat(config.stubs || []);

      var init = config.init;
      if (isFn(init)) inits.push(init);
      return config.apis;
    },

    // init connect host side
    // options = things that go to all init functions

    init: function (options, xdmConfig) {
      options = options || {};

        // add stubs for each public api
        each(apis, function (method) { stubs.push(method); });

        // TODO: stop copying internals and fix references instead (fix for events going across add-ons when they shouldn't)
        var rpc = new XdmRpc($, xdmConfig, {remote: stubs, local: $.extend({}, internals)});
        rpcCollection[rpc.id] = rpc;
        each(inits, function (_, init) {
          try { init(extend({}, options), rpc); }
          catch (ex) { console.log(ex); }
        });

    }

  };

});

_AP.define("env", ["_dollar", "_rpc"], function ($, rpc) {
    "use strict";

    var connectModuleData; // data sent from the velocity template

    rpc.extend(function (config) {
        return {
            init: function (state) {
                connectModuleData = state;
            },
            internals: {
                getLocation: function () {
                    return window.location.href;
                },
                getUser: function () {
                    // JIRA 5.0, Confluence 4.3(?)
                    var meta = AJS.Meta,
                    fullName = meta ? meta.get("remote-user-fullname") : null;
                    if (!fullName) {
                        // JIRA 4.4, Confluence 4.1, Refapp 2.15.0
                        fullName = $("a#header-details-user-fullname, .user.ajs-menu-title, a#user").text();
                    }
                    if (!fullName) {
                        // JIRA 6, Confluence 5
                        fullName = $("a#user-menu-link").attr("title");
                    }
                    return {fullName: fullName, id: connectModuleData.uid, key: connectModuleData.ukey};
                },
                getTimeZone: function () {
                    return connectModuleData.data.timeZone;
                }
            }
        };
    });

});

_AP.define("resize", ["_dollar", "_rpc"], function ($, rpc) {
    "use strict";

    rpc.extend(function () {

        function resizeHandler(iframe) {
            var height = $(document).height() - $("#header > nav").outerHeight() - $("#footer").outerHeight() - 20;
            $(iframe).css({width: "100%", height: height + "px"});
        }

        return {
            init: function (config, xdm) {
                xdm.resize = _.debounce(function resize ($, width, height) {
                    $(this.iframe).css({width: width, height: height});
                });
            },
            internals: {
                resize: function(width, height) {
                    if(!this.uiParams.isDialog){
                        this.resize($, width, height);
                    }
                },
                sizeToParent: _.debounce(function() {
                    // sizeToParent is only available for general-pages
                    if (this.uiParams.isGeneral) {
                        // This adds border between the iframe and the page footer as the connect addon has scrolling content and can't do this
                        $(this.iframe).addClass("full-size-general-page");
                        $(window).on('resize', function(){
                            resizeHander(this.iframe);
                        });
                        resizeHandler(this.iframe);
                    }
                    else {
                        // This is only here to support integration testing
                        // see com.atlassian.plugin.connect.test.pageobjects.RemotePage#isNotFullSize()
                        $(this.iframe).addClass("full-size-general-page-fail");
                    }
                })
            }
        };
    });

});

_AP.define("loading-indicator", ["_dollar", "_rpc", "host/_status_helper"], function ($, rpc, statusHelper) {
    "use strict";

    rpc.extend(function (config) {
        return {
            init: function (state, xdm) {
                var $home = $(xdm.iframe).closest(".ap-container");
                statusHelper.showLoadingStatus($home, 0);
                xdm.timeout = setTimeout(function(){
                    xdm.timeout = null;
                    statusHelper.showloadTimeoutStatus($home);
                    var $timeout = $home.find(".ap-load-timeout");
                    $timeout.find("a.ap-btn-cancel").click(function () {
                        statusHelper.showLoadErrorStatus($home);
                        this.analytics.iframePerformance.timeout();
                        //state.iframe.trigger(isDialog ? "ra.dialog.close" : "ra.iframe.destroy");
                    });
                }, 20000);
            },
            internals: {
                init: function() {
                    this.analytics.iframePerformance.end();
                    var $home = $(this.iframe).closest(".ap-container");
                    statusHelper.showLoadedStatus($home);

                    clearTimeout(this.timeout);
                    // Let the integration tests know the iframe has loaded.
                    $home.find(".ap-content").addClass("iframe-init");
                }
            }
        };

    });

});

_AP.define("request", ["_dollar", "_rpc"], function ($, rpc) {
    "use strict";

    var xhrProperties = ["status", "statusText", "responseText"],
        xhrHeaders = ["Content-Type"];

    rpc.extend(function () {
        return {
            internals: {
                request: function (args, success, error) {
                    // add the context path to the request url
                    var url = AJS.contextPath() + args.url;
                    // reduce the xhr object to the just bits we can/want to expose over the bridge
                    function toJSON (xhr) {
                        var json = {headers: {}};
                        // only copy key properties and headers for transport across the bridge
                        $.each(xhrProperties, function (i, v) { json[v] = xhr[v]; });
                        // only copy key response headers for transport across the bridge
                        $.each(xhrHeaders, function (i, v) { json.headers[v] = xhr.getResponseHeader(v); });
                        return json;
                    }
                    function done (data, textStatus, xhr) {
                        success([data, textStatus, toJSON(xhr)]);
                    }
                    function fail (xhr, textStatus, errorThrown) {
                        error([toJSON(xhr), textStatus, errorThrown]);
                    }

                    var headers = {};
                    $.each(args.headers || {}, function (k, v) { headers[k.toLowerCase()] = v; });
                    // Disable system ajax settings. This stops confluence mobile from injecting callbacks and then throwing exceptions.
                    $.ajaxSettings = {};

                    // execute the request with our restricted set of inputs
                    $.ajax({
                        url: url,
                        type: args.type || "GET",
                        data: args.data,
                        dataType: "text", // prevent jquery from parsing the response body
                        contentType: args.contentType,
                        headers: {
                            // */* will undo the effect on the accept header of having set dataType to "text"
                            "Accept": headers.accept || "*/*",
                            // send the client key header to force scope checks
                            "AP-Client-Key": this.addonKey
                        }
                    }).then(done, fail);
                }

            }
        };
    });

});

_AP.define("dialog", ["_dollar", "_rpc", "dialog/dialog-factory", "dialog/main"], function ($, rpc, dialogFactory, dialogMain) {
    "use strict";

    rpc.extend(function () {
        return {
            stubs: ["dialogMessage"],
            init: function(state, xdm){
                if(xdm.uiParams.isDialog){
                    var buttons = dialogMain.getButton();
                    if(buttons){
                        $.each(buttons, function(name, button) {
                            button.click(function (e, callback) {
                                if(xdm.isActive()){
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
                setDialogButtonEnabled: function (name, enabled) {
                    dialogMain.getButton(name).setEnabled(enabled);
                },
                isDialogButtonEnabled: function (name, callback) {
                    var button =  dialogMain.getButton(name);
                    callback(button ? button.isEnabled() : void 0);
                },
                createDialog: function (dialogOptions) {
                    var xdmOptions = {
                        key: this.addonKey
                    };

                    //open by key or url. This can be simplified when opening via url is removed.
                    if(dialogOptions.key) {
                        xdmOptions.moduleKey = dialogOptions.key;
                    } else if(dialogOptions.url) {
                        xdmOptions.url = dialogOptions.url;
                    }
                    dialogFactory(xdmOptions, dialogOptions, this.productContext);

                },
                closeDialog: function(done, fail) {
                    this.events.emit('ra.iframe.destroy');
                    dialogMain.close();
                }
            }
        };
    });

});

_AP.define("history/rpc", ["_dollar", "history/history", "_rpc"], function($, history, rpc){

    rpc.extend(function(config){
        return {
            init: function (state, xdm) {
                if(state.uiParams.isGeneral){
                    // register for url hash changes to invoking history.popstate callbacks.
                    $(window).on("hashchange", function(e){
                        history.hashChange(e.originalEvent, xdm.historyMessage);
                    });
                }
            },
            internals: {
                historyPushState: function (url) {
                    if(this.uiParams.isGeneral){
                        return history.pushState(url);
                    } else {
                        $.log("History is only available to page modules");
                    }
                },
                historyReplaceState: function (url) {
                    if(this.uiParams.isGeneral){
                        return history.replaceState(url);
                    } else {
                        $.log("History is only available to page modules");
                    }
                },
                historyGo: function (delta) {
                    if(this.uiParams.isGeneral){
                        return history.go(delta);
                    } else {
                        $.log("History is only available to page modules");
                    }
                }
            },
            stubs: ["historyMessage"] 
        };
    });

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
(window.AP || window._AP).define("host/_addons", ["_dollar", "_rpc"], function ($, rpc) {

  "use strict";

  // Note that if it's desireable to publish host-level events to add-ons, this would be a good place to wire
  // up host listeners and publish to each add-on, rather than using each XdmRpc.events object directly.

    var _channels = {};

  // Tracks all channels (iframes with an XDM bridge) for a given add-on key, managing event propagation
  // between bridges, and potentially between add-ons.

    rpc.extend(function () {

        var self = {
            _emitEvent: function (event) {
                $.each(_channels[event.source.key], function (id, channel) {
                    channel.bus._emitEvent(event);
                });
            },
            remove: function (xdm) {
                var channel = _channels[xdm.addonKey][xdm.id];
                if (channel) {
                    channel.bus.offAny(channel.listener);
                }
                delete _channels[xdm.addonKey][xdm.id];
                return this;
            },
            init: function (config, xdm) {
                if(!_channels[xdm.addonKey]){
                    _channels[xdm.addonKey] = {};
                }
                var channel = _channels[xdm.addonKey][xdm.id] = {
                    bus: xdm.events,
                    listener: function () {
                        var event = arguments[arguments.length - 1];
                        var trace = event.trace = event.trace || {};
                        var traceKey = xdm.id + "|addon";
                        if (!trace[traceKey]) {
                            // Only forward an event once in this listener
                            trace[traceKey] = true;
                            self._emitEvent(event);
                        }
                    }
                };
                channel.bus.onAny(channel.listener); //forward add-on events.

                // Remove reference to destroyed iframes such as closed dialogs.
                channel.bus.on("ra.iframe.destroy", function(){
                    self.remove(xdm);
                }); 
            }
        };
        return self;
    });

});

_AP.define("host/main", ["_dollar", "_xdm", "host/_addons", "_rpc", "_ui-params", "analytics/analytics", "host/_util"], function ($, XdmRpc, addons, rpc, uiParams, analytics, util) {

  var defer = window.requestAnimationFrame || function (f) {setTimeout(f,10); };

  function contentDiv(ns) {
    if(!ns){
      throw new Error("ns undefined");
    }
    return $("#embedded-" + util.escapeSelector(ns));
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

    $.extend(options, uiParams.fromUrl(options.src));

    var ns = options.ns,
        $content = contentDiv(ns),
        contentId = $content.attr("id"),
        channelId = "channel-" + ns,
        initWidth = options.w || "100%",
        initHeight = options.h || "0",
        start = new Date().getTime(),
        isDialog = !!options.dlg,
        isInlineDialog = ($content.closest('.aui-inline-dialog').length > 0),
        isSimpleDialog = !!options.simpleDlg,
        isInited;

    if(typeof options.uiParams !== "object"){
      options.uiParams = {};
    }

    if(!!options.general) {
      options.uiParams.isGeneral = true;
    }

    if(options.dlg){
      options.uiParams.isDialog = true;
    }

    var xdmOptions = {
      remote: options.src,
      remoteKey: options.key,
      container: contentId,
      channel: channelId,
      props: {width: initWidth, height: initHeight},
      uiParams: options.uiParams
    };

    if(options.productCtx && !options.productContext){
      options.productContext = JSON.parse(options.productCtx);
    }

    rpc.extend({
      init: function(opts, xdm){
        xdm.analytics = analytics.get(xdm.addonKey, ns);
        xdm.analytics.iframePerformance.start();
        xdm.productContext = options.productContext;
      }
    });

    rpc.init(options, xdmOptions);

  }

  return function (options) {
    // AC-765 if we are about to replace an old instance of the connect iframe. Destroy it.
    $content = contentDiv(options.ns);
    $contentIframe = $content.find("iframe");
    if($contentIframe.length){
      $contentIframe.trigger('ra.iframe.destroy');
      $content.remove();
    }

    var attemptCounter = 0;
    function doCreate() {
        //If the element we are going to append the iframe to doesn't exist in the dom (yet). Wait for it to appear.
        if(contentDiv(options.ns).length === 0 && attemptCounter < 10){
            setTimeout(function(){
                attemptCounter++;
                doCreate();
            }, 50);
            return;
        }

      // create the new iframe
      create(options);
    }
    if(typeof ConfluenceMobile !== "undefined"){
      doCreate();
    } else if ($.isReady) {
      // if the dom is ready then this is being run during an ajax update;
      // in that case, defer creation until the next event loop tick to ensure
      // that updates to the desired container node's parents have completed
      defer(doCreate);
    }
    else {
      AJS.toInit(function hostInit(){
        // Load after confluence editor has finished loading content.
        if(AJS.Confluence && AJS.Confluence.EditorLoader && AJS.Confluence.EditorLoader.load) {
          /*
          NOTE: for some reason, the confluence EditorLoader will 404 sometimes on create page.
          Because of this, we need to pass our create function as both the success and error callback so we always get called
           */
          try {
            AJS.Confluence.EditorLoader.load(doCreate,doCreate);
          } catch(e) {
            try {
              doCreate();
            } catch(error) {
              AJS.log(error);
            }
          }

        } else {
          try {
              doCreate();
          } catch(error) {
            AJS.log(error);
          }
        }
      });
    }
  };

});

// Legacy global namespace
// TODO: should be able to express this as _AP.create = _AP.require("host/main"). Requires changes in _amd.js
if (!_AP.create) {
  _AP.require(["host/main"], function(main) {
    _AP.create = main;
  });
}

if(typeof ConfluenceMobile !== "undefined"){
  //confluence will not run scripts loaded in the body of mobile pages by default.
  ConfluenceMobile.contentEventAggregator.on("render:pre:after-content", function(a, b, content) {
    window['eval'].call(window, $(content.attributes.body).find(".ap-iframe-body-script").html());
  });
}

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

_AP.define("host/content", ["_dollar", "_uri", "_ui-params"], function ($, uri, UiParams) {
    "use strict";

    function getContentUrl(pluginKey, capability){
        return AJS.contextPath() + "/plugins/servlet/ac/" + encodeURIComponent(pluginKey) + "/" + encodeURIComponent(capability.key);
    }

    function getWebItemPluginKey(target){
        var m = target.attr('class').match(/ap-plugin-key-([^\s]*)/);
        return $.isArray(m) ? m[1] : false;
    }
    function getWebItemModuleKey(target){
        var m = target.attr('class').match(/ap-module-key-([^\s]*)/);
        return $.isArray(m) ? m[1] : false;
    }

    function getOptionsForWebItem(target){
        var pluginKey = getWebItemPluginKey(target),
            moduleKey = getWebItemModuleKey(target),
            type = target.hasClass('ap-inline-dialog') ? 'inlineDialog' : 'dialog';
            return window._AP[type + 'Options'][moduleKey] || {};
    }

    // Deprecated. This passes the raw url to ContextFreeIframePageServlet, which is vulnerable to spoofing.
    // Will be removed when XML descriptors are dropped - plugins should pass key of the <dialog-page>, NOT the url.
    // TODO: Remove this class when support for XML Descriptors goes away
    function getIframeHtmlForUrl(pluginKey, remoteUrl, productContext, params) {
        var contentUrl = AJS.contextPath() + "/plugins/servlet/render-signed-iframe";
        return $.ajax(contentUrl, {
            dataType: "html",
            data: {
                "dialog": true,
                "ui-params": UiParams.encode(params),
                "plugin-key": pluginKey,
                "product-context": JSON.stringify(productContext),
                "remote-url": remoteUrl,
                "width": "100%",
                "height": "100%",
                "raw": "true"
            }
        });
    }

    function getIframeHtmlForKey(pluginKey, productContext, capability, params) {
        var contentUrl = getContentUrl(pluginKey, capability);
        return $.ajax(contentUrl, {
            dataType: "html",
            data: {
                "ui-params": UiParams.encode(params),
                "plugin-key": pluginKey,
                "product-context": JSON.stringify(productContext),
                "key": capability.key,
                "width": "100%",
                "height": "100%",
                "raw": "true"
            }
        });
    }


    function eventHandler(action, selector, callback) {

        function domEventHandler(event) {
            event.preventDefault();
            var $el = $(event.target).closest(selector),
            href = $el.attr("href"),
            url = new uri.init(href),
            options = {
                bindTo: $el,
                header: $el.text(),
                width:  url.getQueryParamValue('width'),
                height: url.getQueryParamValue('height'),
                cp:     url.getQueryParamValue('cp'),
                key: getWebItemPluginKey($el)
            };
            callback(href, options, event.type);
        }

        $(window.document).on(action, selector, domEventHandler);

    }

    return {
        getContentUrl: getContentUrl,
        getIframeHtmlForUrl: getIframeHtmlForUrl,
        getIframeHtmlForKey: getIframeHtmlForKey,
        eventHandler: eventHandler,
        getOptionsForWebItem: getOptionsForWebItem
    };


});

_AP.define("analytics/analytics", ["_dollar"], function($){
    "use strict";

    /**
     * Blacklist certain bridge functions from being sent to analytics
     * @const
     * @type {Array}
     */
    var BRIDGEMETHODBLACKLIST = [
        "resize",
        "init"
    ];

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
            start: function(){
                metrics.startLoading = time();
            },
            end: function(){
                var value = time() - metrics.startLoading;
                proto.track('iframe.performance.load', {
                    addonKey: addonKey,
                    moduleKey: moduleKey,
                    value: value > THRESHOLD ? 'x' : Math.ceil((value) / TRIMPPRECISION)
                });
                delete metrics.startLoading;
            },
            timeout: function(){
                proto.track('iframe.performance.timeout', {
                    addonKey: addonKey,
                    moduleKey: moduleKey
                });
                //track an end event during a timeout so we always have complete start / end data.
                this.end();
            },
            // User clicked cancel button during loading
            cancel: function(){
                proto.track('iframe.performance.cancel', {
                    addonKey: addonKey,
                    moduleKey: moduleKey
                });
            }
        };

    }

    var proto = Analytics.prototype;

    proto.getKey = function () {
        return this.addonKey + ':' + this.moduleKey;
    };

    proto.track = function (name, data) {
        var prefixedName = "connect.addon." + name;
        if(AJS.Analytics){
            AJS.Analytics.triggerPrivacyPolicySafeEvent(prefixedName, data);
        } else if(AJS.trigger) {
            // BTF fallback
            AJS.trigger('analyticsEvent', {
                name: prefixedName,
                data: data
            });
        } else {
            return false;
        }

        return true;
    };

    proto.trackBridgeMethod = function(name){
        if($.inArray(name, BRIDGEMETHODBLACKLIST) !== -1){
            return false;
        }
        this.track('bridge.invokemethod', {
            name: name,
            addonKey: this.addonKey,
            moduleKey: this.moduleKey
        });
    };

    return {
        get: function (addonKey, moduleKey) {
            return new Analytics(addonKey, moduleKey);
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

_AP.define("host/_status_helper", ["_dollar"], function ($) {
    "use strict";

    var statuses = {
        loading: {
            descriptionHtml: '<div class="small-spinner"></div>Loading add-on...'
        },
        "load-timeout": {
            descriptionHtml: '<div class="small-spinner"></div>Add-on is not responding. Wait or <a href="#" class="ap-btn-cancel">cancel</a>?'
        },

        "load-error": {
            descriptionHtml: 'Add-on failed to load.'
        }
    };

    function hideStatuses($home){
        // If there's a pending timer to show the loading status, kill it.
        if ($home.data('loadingStatusTimer')) {
            clearTimeout($home.data('loadingStatusTimer'));
            $home.removeData('loadingStatusTimer');
        }
        $home.find(".ap-status").addClass("hidden");
    }

    function showStatus($home, status){
        hideStatuses($home);
        $home.closest('.ap-container').removeClass('hidden');
        $home.find(".ap-stats").removeClass("hidden");
        $home.find('.ap-' + status).removeClass('hidden');
        /* setTimout fixes bug in AUI spinner positioning */
        setTimeout(function(){
            var spinner = AJS.$('.small-spinner', '.ap-' + status);
            if(spinner.length){
                spinner.spin({zIndex: "1"});
            }
        }, 10);
    }

    //when an addon has loaded. Hide the status bar.
    function showLoadedStatus($home){
        hideStatuses($home);
    }

    function showLoadingStatus($home, delay){
        if (!delay) {
            showStatus($home, 'loading');
        } else {
            // Wait a second before showing loading status.
            var timer = setTimeout(showStatus.bind(null, $home, 'loading'), delay);
            $home.data('loadingStatusTimer', timer);
        }
    }

    function showloadTimeoutStatus($home){
        showStatus($home, 'load-timeout');
    }

    function showLoadErrorStatus($home){
        showStatus($home, 'load-error');
    }

    function createStatusMessages() {
        var i,
        stats = $('<div class="ap-stats" />');

        for(i in statuses){
            var status = $('<div class="ap-' + i + ' ap-status hidden" />');
            status.append('<small>' + statuses[i].descriptionHtml + '</small>');
            stats.append(status);
        }
        return stats;
    }

    return {
        createStatusMessages: createStatusMessages,
        showLoadingStatus: showLoadingStatus,
        showloadTimeoutStatus: showloadTimeoutStatus,
        showLoadErrorStatus: showLoadErrorStatus,
        showLoadedStatus: showLoadedStatus
    };

});
