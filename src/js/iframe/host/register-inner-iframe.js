define("register-inner-iframe", ["_dollar", "_rpc", "_ui-params"], function ($, rpc, uiParams) {
    "use strict";

    var initialisedChildren = [];
    var count = 0;
    var rememberedInnerIframeSettings = [];

    /**
     * Setups up the bridge with a iframe inside a iframe
     * @param event
     */
    function setupInnerFrameBridge(options, event) {
        var addonKey = options.key;
        var payload = event.data;
        var origin = options.origin.toLowerCase();

        var innerFrameOptions = $.extend({}, options);
        innerFrameOptions.ns = innerFrameOptions.ns + "." + addonKey + "." + count++;
        innerFrameOptions.key = addonKey;
        innerFrameOptions.origin = origin;

        innerFrameOptions.uiParams = uiParams.fromUrl(window.location.toString()) || {};

        var ns = innerFrameOptions.ns,
            contentId = "embedded-" + ns,
            channelId = payload.c,
            initWidth = innerFrameOptions.w || "100%",
            initHeight = innerFrameOptions.h || "0";

        innerFrameOptions.uiParams.isGeneral = !!innerFrameOptions.general;

        if(innerFrameOptions.productCtx && !innerFrameOptions.productContext){
            innerFrameOptions.productContext = JSON.parse(innerFrameOptions.productCtx);
        }

        var xdmOptions = {
            remote: innerFrameOptions.src,
            remoteOrigin: innerFrameOptions.origin,
            remoteKey: innerFrameOptions.key,
            container: contentId,
            channel: channelId,
            props: {width: initWidth, height: initHeight},
            uiParams: innerFrameOptions.uiParams
        };

        rememberedInnerIframeSettings.push({
            innerFrameOptions: innerFrameOptions,
            xdmOptions: xdmOptions,
            origin: innerFrameOptions.origin
        });
    }



    rpc.extend(function () {
        return {
            internals: {
                registerInnerIframe: function (options) {
                    var event = arguments[1];

                    setupInnerFrameBridge(options, event);
                }
            }
        };
    });

    /**
     * Checks if there was already a bridge initialised for the given source
     *
     * @param source {String} The source of the iframe to check bridges for
     * @returns {boolean}
     */
    function alreadyInitialised(source) {
        return initialisedChildren.indexOf(source) > -1;
    }

    /**
     * Checks if the addonOriginMap addonKey matches the origin
     *
     * @param addonKey
     * @param origin
     * @returns {boolean}
     */
    function keyMatchesOrigin(addonKey, origin) {
        return   _AP.addonOriginMap[addonKey] === origin.toLowerCase();
    }


    /**
     * Get all the IFrame elements in the page
     *
     * @returns {Array} a array with all the iframe elements
     */
    function getAllIFramesOnPage() {
        return [].slice.call(document.getElementsByTagName('iframe'));
    }

    /***
     * Listens for messages coming from iframes inside iframes
     *
     * @param event {Object} the message event
     */
    function innerFrameListener(event) {
        event = event.originalEvent ? event.originalEvent : event;

        // Extract message payload from the event
        var payload = event.data,
            addonKey = payload.k,
            source = event.source,
            origin = event.origin;

        if(event.data.m.n === 'registerInnerIframe') {
            return;
        }

        //This module is only used to initialise inner iframes. Ignore all messages from Confluence.
        if (source === window.top) {
            return;
        }

        var fromPage = getAllIFramesOnPage().filter(function(iframe) {return iframe.contentWindow === source;}).length > 0;

        if (fromPage) {
            return;
        }

        if (alreadyInitialised(origin)) {
            return;
        }

        initialisedChildren.push(origin);

        if (!keyMatchesOrigin(addonKey, origin)){
            return;
        }

        var settings = rememberedInnerIframeSettings.filter(function (settings) {
            return settings.origin === origin;
        })[0];

        var bridge = rpc.initInner(settings.innerFrameOptions, settings.xdmOptions, event.source);

        bridge.bridgeReceive(event);
    }

    /**
     * Sets up a message listener for inner iframe messages
     * @param options {Object} the options object containing the options needed for setting up a new bridge
     */
    function init() {
        window.addEventListener('message', innerFrameListener);
    }
    init();

});

require("register-inner-iframe");
