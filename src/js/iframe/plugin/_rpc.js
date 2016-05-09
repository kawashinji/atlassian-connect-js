AP.define("_rpc", ["_dollar", "_xdm", "_util", '_ui-params'], function ($, XdmRpc, util, uiParams) {

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
    iframe.id = id;
    iframe.name = windowName;
    iframe.frameBorder = "0";
    iframe.width = config.props.width;
    iframe.height = config.props.height;
    iframe.setAttribute('rel', 'nofollow');
    document.getElementById(config.container).appendChild(iframe);

    iframe.src = config.remote;
    return iframe;
  }
  
  

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
        rpc = this.rpc = new XdmRpc($, {}, {remote: stubs, local: internals}, window.top, undefined);
        rpc.init();
        extend(proxy, rpc);
        each(inits, function (_, init) {
          try { init(extend({}, options)); }
          catch (ex) { $.handleError(ex); }
        });
        isInited = true;
      }
    },
    
    initWithFrame: function (options, xdmConfig) {
      // if there is already an iframe created. Destroy it. It's an old version.
      //TODO: Investigate consequences of lack of remove event.
      //$("#" + util.escapeSelector(xdmConfig.container)).find('iframe').trigger('ra.iframe.destroy');

      var containerEl = document.getElementById(xdmConfig.container);
      if (containerEl) {
        var existingFrameList = containerEl.getElementsByTagName('iframe');
        if(existingFrameList.length > 0) {
          existingFrameList[0].remove();
        }
      }


      var iframe = createIframe(xdmConfig);

      // TODO: stop copying internals and fix references instead (fix for events going across add-ons when they shouldn't)
      var rpc = new XdmRpc($, xdmConfig, {remote: stubs, local: $.extend({}, internals)}, iframe.contentWindow, iframe);

      //Not currently keeping a reference of all of our bridge objects.
      //rpcCollection[rpc.id] = rpc;
      each(inits, function (_, init) {
        try { init(extend({}, options), rpc); }
        catch (ex) { console.log(ex); }
      });
    }

  };

});
