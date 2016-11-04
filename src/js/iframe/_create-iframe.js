( (typeof _AP !== "undefined") ? define : AP.define)("_create-iframe", ["_create-iframe-form", "_ui-params", "_dispatch-custom-event", "_uri"], function (createIframeForm, uiParams, dispatchCustomEvent, uri) {
    /**
     * Creates an iframe element from based on the given config
     * @param config {Object}
     * @param config.container {String}
     * @param config.uiParams {String}
     * @param config.props {Object} a map of additional HTML attributes for the new iframe
     * @param config.remote {String} the src url of the new iframe
     * @param config.renderingMethod {String} http method for rendering the iframe
     */
    return function createIframe(config) {
        var renderingMethod = (config.renderingMethod || 'GET').toUpperCase();

        if(!config.container){
            throw new Error("config.container must be defined");
        }
        var iframe = document.createElement("iframe"),
            id = "easyXDM_" + config.container + "_provider",
            windowName = "";

        if(config.uiParams){
            config.uiParams.isIframe = true;
            windowName = uiParams.encode(config.uiParams);
            config.iframeName = windowName;
            config.iframeFormId = windowName + '-form-id';
        }

        iframe.id = id;
        iframe.name = windowName;
        iframe.frameBorder = "0";

        Object.keys(config.props).forEach(function (prop) {
            iframe[prop] = config.props[prop];
        });

        iframe.setAttribute("rel", "nofollow");
        iframe.className = "ap-iframe";

        var containerElement = document.getElementById(config.container);
        if(containerElement) {
            //Mimick jQuery append behaviour
            containerElement.appendChild(iframe);
        }

        dispatchCustomEvent(iframe, 'ra.iframe.create');

        // containerElement should always available unless in unit test
        if (containerElement) {
            if (renderingMethod === 'GET') {
                iframe.src = config.remote;
            } else {
                var form = createIframeForm(config);
                if (form) {
                    containerElement.appendChild(form);
                    form.submit();
                }
            }
        }

        return iframe;
    };
});
