( (typeof _AP !== "undefined") ? define : AP.define)("_create_iframe", ["_ui-params"], function (uiParams) {
    /**
     * Creates an iframe element from based on the given config
     * @param config {Object}
     * @param config.container {String}
     * @param config.uiParams {String}
     * @param config.props {Object} a map of additional HTML attributes for the new iframe
     * @param config.remote {String} the src url of the new iframe
     */
    return function createIframe(config) {
        if(!config.container){
            throw new Error("config.container must be defined");
        }
        var iframe = document.createElement("iframe"),
            id = "easyXDM_" + config.container + "_provider",
            windowName = "",
            event;

        if(config.uiParams){
            windowName = uiParams.encode(config.uiParams);
        }

        iframe.id = id;
        iframe.name = windowName;
        iframe.frameBorder = "0";
        iframe.width = config.props.width;
        iframe.height = config.props.height;
        iframe.setAttribute("rel", "nofollow");
        iframe.className = "ap-iframe";
        document.getElementById(config.container).appendChild(iframe);

        iframe.src = config.remote;

        if (window.CustomEvent) {
            event = new CustomEvent('ra.iframe.create');
        } else {
            event = document.createEvent('ra.iframe.create');
            iframe.initCustomEvent('ra.iframe.create', true, true, null);
        }

        iframe.dispatchEvent(event);

        return iframe;
    }
});
