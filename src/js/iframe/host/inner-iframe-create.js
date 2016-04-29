require(["_dollar", "_rpc"], function ($, rpc) {
    "use strict";

    var initilialisedChildren = []
    
    function alreadyInitialised(source) {
        return initilialisedChildren.indexOf(source) > -1;
    }

    function keyMatchesOrigin(addonKey, origin) {
        //noinspection JSUnresolvedVariable
        return window.AddonOriginMap[addonKey].toLowerCase() == origin.toLowerCase();
    }

    function initialise(e) {
        var payload = JSON.parse(e.data),
                sid = payload.i, channel = payload.c, type = payload.t, message = payload.m, addonKey = payload.k;

        initilialisedChildren.push(e.source);

        var themeOptions = JSON.parse(document.getElementsByClassName('ap-iframe-json-data')[0].innerText);

        var productContext = JSON.parse(themeOptions.productCtx);

        //Example macro specific data:
        // productContext["macro.hash"] = "2558c326-463a-4f9c-b639-815cd64ba4ec";
        // productContext["macro.body"] = "<p>This is a macro yo<\/p>";
        // productContext["macro.truncated"] = "false";
        // productContext["macro.id"] = "2558c326-463a-4f9c-b639-815cd64ba4ec";

        productContext["macro.hash"] = undefined;
        productContext["macro.body"] = undefined;
        productContext["macro.truncated"] = undefined;
        productContext["macro.id"] = undefined;


        var options = {};
        options.ns = themeOptions.ns + "." + addonKey + "." + Math.floor(Math.random() * 1000000000);
        options.key = addonKey;
        options.cp = themeOptions.cp;
        options.uid = themeOptions.uid;
        options.ukey = themeOptions.ukey;
        options.origin = e.origin.toLowerCase();
        options.timeZone = themeOptions.timeZone;
        options.productCtx = JSON.stringify(productContext);
        options.dlg = "";
        options.simpleDlg = "";
        options.general = "";
        options.src = "";
        
        
        if(typeof options.uiParams !== "object"){
            options.uiParams = uiParams.fromUrl(options.src);
        }

        var ns = options.ns,
                contentId = "embedded-" + ns,
                channelId = "channel-" + ns,
                initWidth = options.w || "100%",
                initHeight = options.h || "0";

        if(typeof options.uiParams !== "object"){
            options.uiParams = {};
        }

        if(!!options.general) {
            options.uiParams.isGeneral = true;
        }

        var xdmOptions = {
            remote: options.src,
            remoteOrigin: options.origin,
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
                xdm.analytics = analytics.get({addonKey: xdm.addonKey, moduleKey: ns});
                xdm.analytics.iframePerformance.start();
                xdm.productContext = options.productContext;
            }
        });

        var bridge = rpc.initInner(options, xdmOptions, e.source);

        bridge.bridgeReceive(e);
    }

    function messageHandler(e) {
        e = e.originalEvent ? e.originalEvent : e;
        // Extract message payload from the event
        var payload = JSON.parse(e.data),
                pid = payload.i, pchannel = payload.c, ptype = payload.t, pmessage = payload.m, addonKey = payload.k;
        
        //This module is only used to initialise inner iframes. Ignore all messages from Confluence.
        if (e.source === window.top) {
            return;
        }

        var allIFramesOnPage = [].slice.call(document.getElementsByTagName('iframe'));
        var fromPage = allIFramesOnPage.filter(function(iframe) { return iframe.contentWindow === e.source;}).length > 0;
        
        if (fromPage) {
            return;
        }
        
        if (alreadyInitialised(e.source)) {
            return;
        }
        
        if (!keyMatchesOrigin(addonKey, e.origin)){
            return;
        }
        
        initialise(e);
    }
    
    // Starts listening for window messaging events
    function bind() {
        $(window).bind("message", messageHandler);
    }
    
    bind();
    
});
