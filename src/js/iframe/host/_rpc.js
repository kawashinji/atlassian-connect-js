define("_rpc", ["_dollar", "_xdm", "host/jwt-keepalive", "_uri", "host/_util", "_create_iframe"], function ($, XdmRpc, jwtKeepAlive, uri, util, createIframe) {

    "use strict";

    var each = $.each,
        extend = $.extend,
        isFn = $.isFunction,
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

            var remoteUrl = new uri.init(xdmConfig.remote),
            remoteJwt = remoteUrl.getQueryParamValue('jwt'),
            promise;

            options = options || {};
            // add stubs for each public api
            each(apis, function (method) { stubs.push(method); });

            // refresh JWT tokens as required.
            if(remoteJwt && jwtKeepAlive.isExpired(remoteJwt)){
                promise = jwtKeepAlive.updateUrl({
                    addonKey: xdmConfig.remoteKey,
                    moduleKey: options.ns,
                    productContext: options.productContext || {},
                    uiParams: xdmConfig.uiParams,
                    width: xdmConfig.props.width,
                    height: xdmConfig.props.height
                });
            }

            $.when(promise).always(function(src){
                // if the promise resolves to a new url. update it.
                if(src){
                    xdmConfig.remote = src;
                }

                // if there is already an iframe created. Destroy it. It's an old version.
                $("#" + util.escapeSelector(xdmConfig.container)).find('iframe').trigger('ra.iframe.destroy');

                var iframe = createIframe(xdmConfig);

                // TODO: stop copying internals and fix references instead (fix for events going across add-ons when they shouldn't)
                var rpc = new XdmRpc($, xdmConfig, {remote: stubs, local: $.extend({}, internals)}, iframe.contentWindow, iframe);

                each(inits, function (_, init) {
                    try { init(extend({}, options), rpc); }
                    catch (ex) { console.log(ex); }
                });
            });
        },

        initInner: function (options, xdmConfig, target) {

            // add stubs for each public api
            each(apis, function (method) { stubs.push(method); });

            // TODO: stop copying internals and fix references instead (fix for events going across add-ons when they shouldn't)
            var rpc = new XdmRpc($, xdmConfig, {remote: stubs, local: $.extend({}, internals)}, target, undefined);

            each(inits, function (_, init) {
                try { init(extend({}, options), rpc); }
                catch (ex) { console.log(ex); }
            });

            return rpc;
        }
    };
});
