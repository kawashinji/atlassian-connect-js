var deps = ["_events", "_jwt", "_uri", "_create-iframe"];

( (typeof _AP !== "undefined") ? define : AP.define)("_xdm", deps, function (events, jwt, uri, createIframe) {
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
   * @param {String} config.remoteOrigin The src of remote origin. Required in case when remote doesn't points directly to the add-on servlet. (host only)
   * @param {String} config.container The id of element to which the generated iframe is appended (host only)
   * @param {Object} config.props Additional attributes to add to iframe element (host only)
   * @param {String} config.channel Channel (host only); deprecated
   * @param {Boolean} [config.noIframe=false] When true xdmRpc is setup for the given target
   * @param {Object} [config.target] When noIframe is true this is the target to be used for the bridge.
   * @param {Object} bindings RPC method stubs and implementations
   * @param {Object} bindings.local Local function implementations - functions that exist in the current context.
   *    XdmRpc exposes these functions so that they can be invoked by code running in the other side of the iframe.
   * @param {Array} bindings.remote Names of functions which exist on the other side of the iframe.
   *    XdmRpc creates stubs to these functions that can be invoked from the current page.
   * @returns XdmRpc instance
   * @constructor
   *
   */
  function XdmRpc($, config, bindings) {

    var self, id, remoteOrigin, channel, mixin,
        localKey, remoteKey, addonKey, realAddonKey,
        loc = window.location.toString(),
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
    var isHost = !/xdm_e/.test(loc);

    var target, iframe;

    if(config.noIframe) {
      target = config.target;
    } else {
      iframe = createIframe(config);
      target = iframe.contentWindow;
    }

    if (isHost || iframe !== undefined) {
      // Host-side constructor branch
      //TODO: This is put into the event bus, but is never really used. If _event was used, when this was set, then that event would never match any of the channels in addons.js. This should be refactored away.
      localKey = "IsNotUsed";
      remoteKey = config.remoteKey;
      realAddonKey = remoteKey;
      addonKey = remoteKey;
      remoteOrigin = (config.remoteOrigin ? config.remoteOrigin : getBaseUrl(config.remote)).toLowerCase();
      channel = config.channel;
      // Define the host-side mixin
      mixin = {
        isHost: true,
        iframe: iframe,
        uiParams: config.uiParams,
        isActive: function () {
          // Host-side instances are only active as long as the iframe they communicate with still exists in the DOM
          if (!isHost && target !== window.top) {
            return document.contains(self.iframe);
          }

          if(isHost && iframe) {
            return $.contains(document.documentElement, self.iframe);
          }

          //This is a bridge for a frame of a frame. We can't tell if the frame is still there.
          return true; //Bridges for frames of frames are never destroyed. This should be ok, because each bridge only has a single target frame, and that frame should never change.
        }
      };

      if(isHost) {
        mixin.destroy = function () {
          window.clearTimeout(self.timeout); //clear the iframe load time.
          // Unbind postMessage handler when destroyed
          unbind();
          // Then remove the iframe, if it still exists
          if (self.iframe) {
            $(self.iframe).remove();
            delete self.iframe;
          }
        };

        if (iframe) {
          $(iframe).on('ra.iframe.destroy', mixin.destroy);
        }
      }
    } else {
      // Add-on-side constructor branch
      localKey = "local"; // Would be better to make this the add-on key, but it's not readily available at this time
      realAddonKey = param(loc, "xdm_deprecated_addon_key_do_not_use");
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
        var sendTarget = target,
            targetOrigin = remoteOrigin;

        if(!message) {
          return sendTarget.postMessage({
            c: channel,
            i: sid,
            k: realAddonKey,
            t: type,
            m: undefined
          }, targetOrigin);
        }

        var messageName = message.n;

        // Sanitize the incoming message arguments
        if (message.a) {
          message.a = sanitizeStructuredClone(message.a);
        }

        if(messageName === 'registerInnerIframe') {
          sendTarget = window.top;
          //Origin not yet in the origin-map so set it to *
          targetOrigin = '*';
        }

        var middleFrameMethods = ["resize", "sizeToParent", "init"];
        if (middleFrameMethods.indexOf(messageName) > -1) {
          sendTarget = window.parent;
          targetOrigin = '*';
        }

        return sendTarget.postMessage({
          c: channel,
          i: sid,
          k: realAddonKey,
          t: type,
          m: message
        }, targetOrigin);
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
    function receive(event) {
      try {
        // Extract message payload from the event
        var payload = event.data,
            pid = payload.i, pchannel = payload.c, ptype = payload.t, pmessage = payload.m, name;

        if (typeof pmessage === 'object') {
          name =  pmessage.n;
        }

        // If the payload doesn't match our expected event signature, assume its not part of the xdm-rpc protocol
        if (name !== 'registerInnerIframe' && (event.source !== target || event.origin.toLowerCase() !== remoteOrigin || pchannel !== channel)){
          return;
        }

        if (ptype === "request") {
          // If the payload type is request, this is an incoming method invocation
          var args = pmessage.a,
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
                if(context.analytics) {
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

    function errmsg(ex) {
      return ex.message || ex.toString();
    }

    function debug() {
      if (XdmRpc.debug) log.apply(window, ["DEBUG:"].concat([].slice.call(arguments)));
    }

    function log() {
      var log = $.log || (window.AJS && window.AJS.log);
      if (log) log.apply(window, arguments);
    }

    function logError() {
      // $.error seems to do the same thing as $.log in client console
      var error = (window.AJS && window.AJS.error);
      if (error) error.apply(window, arguments);
    }

    // Creates a deep copy of the object, rejecting Functions, Errors and Nodes
    // ACJS-200: This is to prevent postMessage from breaking when it encounters unexpected arguments.
    // Functions belonging to arrays will be null.
    // Functions that are object properties are deleted.
    // Errors and Nodes will be empty Objects
    function sanitizeStructuredClone(object) {

      // keep track the objects in case of circular references
      var objects = [];

      return (function clone(value) {
        var i, name, newValue;

        // For object types that are supported by the structured clone algorithm.
        // It also checks if it's not an Error or Node - these are handled after along with functions.
        if (typeof value === 'object' && value !== null &&
          !(value instanceof Boolean) && !(value instanceof String) &&
          !(value instanceof Date) && !(value instanceof RegExp) &&
          !(value instanceof Blob)  && !(value instanceof File) &&
          !(value instanceof FileList) && !(value instanceof Error) &&
          !(value instanceof Node)) {

          // check if the value already been seen
          if (objects.indexOf(value) > -1) {
            log("XDM: A circular reference was detected and removed from the message.");
            return null;
          }

          // Keep a reference of the value
          objects.push(value);

          // Recursively clone the Object or Array
          if (Array.isArray(value)) {
            newValue = [];
            for (i = 0; i < value.length; i++) {
              newValue[i] = clone(value[i]);
            }
          } else {
            newValue = {};
            for (name in value) {
              if (value.hasOwnProperty(name)) {
                var clonedValue = clone(value[name]);
                if (clonedValue !== null) {
                  newValue[name] = clonedValue;
                }
              }
            }
          }
          return newValue;
        }

        if (typeof value === 'function') {
          log("XDM: A function was detected and removed from the message.");
          return null;
        }

        if (value instanceof Error) {
          log("XDM: An Error object was detected and removed from the message.");
          return {};
        }

        if (value instanceof Node) {
          log("XDM: A Node object was detected and removed from the message.");
          return {};
        }

        return value;
      }(object));
    }

    // Immediately start listening for events
    bind();

    var bridgeThis = this;

    self.bridgeReceive = function(){
      return receive.apply(bridgeThis, arguments);
    };

    return self;
  }

//  XdmRpc.debug = true;

  return XdmRpc;

});
