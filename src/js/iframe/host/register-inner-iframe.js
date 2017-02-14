require(["_dollar", "_rpc", "_ui-params"], function ($, rpc, uiParams) {
    "use strict";

    var initialisedChildren = [];
    var count = 0;
    var rememberedIframeOptions = [];

    /**
     * Processes and saves the given framedata for later use when creating a inner iframe bridge
     *
     * @param {Object} frameData the AC framedata to remember
     * @param {String} frameData.key the addonkey for the plugin
     * @param {String} frameData.origin the origin for the plugin
     * @param {String} frameData.ns the namespace for the plugin
     * @param {Object} frameData.productContext the product specific context for the plugin
     * @param {Object} frameData.productCtx the stringified product specific context for the plugin
     *
     */
    function registerInnerFrameOptions(frameData) {
        var addonKey = frameData.key;
        var origin = frameData.origin.toLowerCase();

        var innerFrameOptions = $.extend({}, frameData);
        var channelId = 'channel-' + innerFrameOptions.ns;

        innerFrameOptions.ns = innerFrameOptions.ns + "-" + addonKey + "-" + count++;
        innerFrameOptions.key = addonKey;
        innerFrameOptions.origin = origin;
        innerFrameOptions.uiParams = uiParams.fromUrl(window.location.toString()) || {};
        innerFrameOptions.uiParams.isGeneral = !!innerFrameOptions.general;

        if(innerFrameOptions.productCtx && !innerFrameOptions.productContext){
            innerFrameOptions.productContext = JSON.parse(innerFrameOptions.productCtx);
        }

        var contentId = 'embedded-' + innerFrameOptions.ns;

        var xdmOptions = {
            remote: innerFrameOptions.src,
            remoteOrigin: innerFrameOptions.origin,
            remoteKey: innerFrameOptions.key,
            container: contentId,
            channel: channelId,
            props: {},
            uiParams: innerFrameOptions.uiParams
        };

        rememberedIframeOptions.push({
            innerFrameOptions: innerFrameOptions,
            xdmOptions: xdmOptions,
            origin: innerFrameOptions.origin
        });
    }

    rpc.extend(function () {
        return {
            internals: {
                registerInnerIframe: function (options) {
                    registerInnerFrameOptions(options);
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
        return  addonKey && _AP.addonOriginMap &&
                _AP.addonOriginMap[addonKey] !== undefined &&
		_AP.addonOriginMap[addonKey].toLowerCase().substr(0, origin.length) === origin.toLowerCase();
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
     * Listens for messages coming from iframes that dont have a bridge yet(usually iframes inside iframes)
     * Then tries to setup a bridge on the host for the iframe inside the iframe
     *
     * @param event {Object} the message event
     */
    function innerFrameListener(event) {
        event = event.originalEvent ? event.originalEvent : event;

        // Extract message payload from the event
        var payload = event.data,
            source = event.source,
            origin = event.origin,
            channelId = payload.c,
            addonKey = payload.k;

        //This module is only used to initialise inner iframes. Ignore all messages from Confluence.
        if (source === window.top) {
            return;
        }

        var fromPage = getAllIFramesOnPage().filter(function(iframe) {return iframe.contentWindow === source;}).length > 0;

        if (fromPage) {
            return;
        }

        if (alreadyInitialised(channelId)) {
            return;
        }

        if (!keyMatchesOrigin(addonKey, origin)){
            return;
        }

        initialisedChildren.push(channelId);

        var settings = rememberedIframeOptions.filter(function (settings) {
            return settings && settings.xdmOptions && settings.xdmOptions.channel === channelId;
        })[0];

        if(!settings) {
            return;
        }

        var bridge = rpc.initInner(settings.innerFrameOptions, settings.xdmOptions, source);

        bridge.bridgeReceive(event);
    }

    /**
     * Listens for messages originating from a iframe without a bridge on the host
     */
    function init() {
        window.addEventListener('message', innerFrameListener);
    }
    init();
});
