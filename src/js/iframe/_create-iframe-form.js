( (typeof _AP !== "undefined") ? define : AP.define)("_create-iframe-form", ["_uri"], function (uri) {
    /**
     * Creates a form to hold iframe parameters when rendering method is not GET
     *
     * @param config {Object}
     * @param config.iframeName {String} name of the iframe
     * @param config.iframeFormId {String} id of the form
     * @param config.renderingMethod {String} the http method for rendering the iframe
     * @param config.remote {String} the src url of the new iframe
     */
    return function createIframeForm(config) {
        var renderingMethod = (config.renderingMethod || 'GET').toUpperCase();
        var src = config.remote;

        if (renderingMethod !== 'GET') {
            var urlComponents = new uri.init(src);
            var url = (src.split('?')[0] || '');
            var form = document.createElement('form');
            form.setAttribute('id', config.iframeFormId);
            form.setAttribute('action', url);
            form.setAttribute('target', config.iframeName);
            form.setAttribute('method', renderingMethod);

            var queryParams = urlComponents.queryPairs;
            for (var i = 0; i < queryParams.length; i++) {
                var pair = queryParams[i];
                var input = document.createElement('input');
                input.setAttribute('name', pair[0]);
                input.setAttribute('type', 'hidden');
                input.setAttribute('value', pair[1]);
                form.appendChild(input);
            }

            return form;
        }
    };
});
