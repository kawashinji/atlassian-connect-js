require(["_dollar", "_rpc"], function ($, rpc) {
    "use strict";

    var initilialisedChildren = []
    
    function alreadyInitialised(source) {
        return initilialisedChildren.indexOf(source) > -1;
    }

    function keyMatchesOrigin(addonKey, origin) {
        return _AP.addonOriginMap[addonKey] === origin.toLowerCase();
    }

    function initialise(e) {
        var payload = e.data, addonKey = payload.k;

        initilialisedChildren.push(e.source);

        var outerFrameOptions = window._AP.mostRecentMacroOptions; //Slight hack

        //TODO: Send correct product context up from inner frame.
        var productContext = JSON.parse(outerFrameOptions.productCtx);

        //We sanitise productContext so that the macro specific context is gone (because we take it from the middle frame):
        //Here's what would normally be in these macro specific fields
        // productContext["macro.hash"] = "2558c326-463a-4f9c-b639-815cd64ba4ec";
        // productContext["macro.body"] = "<p>This is a macro yo<\/p>";
        // productContext["macro.truncated"] = "false";
        // productContext["macro.id"] = "2558c326-463a-4f9c-b639-815cd64ba4ec";

        productContext["macro.hash"] = undefined;
        productContext["macro.body"] = undefined;
        productContext["macro.truncated"] = undefined;
        productContext["macro.id"] = undefined;

        var options = {};
        options.ns = outerFrameOptions.ns + "." + addonKey + "." + Math.floor(Math.random() * 1000000000);
        options.key = addonKey;
        options.cp = outerFrameOptions.cp;
        options.uid = outerFrameOptions.uid;
        options.ukey = outerFrameOptions.ukey;
        options.origin = e.origin.toLowerCase();
        options.timeZone = outerFrameOptions.timeZone;
        options.productCtx = JSON.stringify(productContext);
        options.dlg = "";
        options.simpleDlg = "";
        options.general = "";
        options.src = "";
        
        //TODO: Send correct uiParams up from inner frame.
        // if(typeof options.uiParams !== "object"){
        //     options.uiParams = uiParams.fromUrl(options.src);
        // }

        var ns = options.ns,
                contentId = "embedded-" + ns,
                channelId = payload.c,
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

        var bridge = rpc.initInner(options, xdmOptions, e.source);

        bridge.bridgeReceive(e);
    }

    function messageHandler(e) {
        e = e.originalEvent ? e.originalEvent : e;
        // Extract message payload from the event
        var payload = e.data, addonKey = payload.k;
        
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
