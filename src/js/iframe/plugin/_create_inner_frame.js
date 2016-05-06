AP.define("_create_inner_frame", ['_ui-params', '_initialise_iframe_request'], function(uiParams, initialiseIframeRequest) {

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
    
    //TODO: In the future send the JSON blob up to the top frame. 
    //initialiseIframeRequest(iframeData);
    
    return function(iframeData) {
        

        if(typeof iframeData.uiParams !== "object"){
            iframeData.uiParams = uiParams.fromUrl(iframeData.src);
        }

        createIframe({
            "remote": iframeData.src,
            "remoteOrigin": iframeData.origin,
            "remoteKey": iframeData.key,
            "container": "embedded-" + iframeData.ns,
            "channel": "channel-" + iframeData.ns,
            "props": {
                "width": iframeData.w,
                "height": iframeData.h
            }//,
            // "uiParams":  //TODO: Figure out how to pass uiParams in.
        });    
    };

    
});
