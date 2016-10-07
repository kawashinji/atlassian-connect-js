AP.define("_create-inner-frame", ['_ui-params', '_rpc', '_uri'], function(uiParams, rpc, uri) {

    function contentDiv(namespace) {
        if(!namespace){
            throw new Error("ns undefined");
        }
        return document.getElementById("embedded-" + namespace);
    }

    /* @name Options
    * @class
    * @property {String}  ns            module key
    * @property {String}  src           url of the iframe
    * @property {String}  w             width of the iframe
    * @property {String}  h             height of the iframe
    * @property {String}  dlg           is a dialog (disables the resizer)
    * @property {String}  simpleDlg     deprecated, looks to be set when a confluence macro editor is being rendered as a dialog
    * @property {Boolean} general       is a page that can be resized
    * @property {String}  productCtx    context to pass back to the server (project id, space id, etc)
    * @property {String}  key           addon key from the descriptor
    * @property {String}  uid           id of the current user
    * @property {String}  ukey          user key
    * @property {String}  data.timeZone timezone of the current user
    * @property {String}  cp            context path
    * @property {String}  origin        origin address of the add-on, required when src does not point directly to the add-on
    */

    /**
     * @param {Options} options These values come from the velocity template and can be overridden using uiParams
     */
    function create(options) {
        if(typeof options.uiParams !== "object"){
            options.uiParams = uiParams.fromUrl(options.src) || {};
        }

        options.uiParams.addonNestingLevel = typeof options.uiParams.addonNestingLevel === 'number' ? options.uiParams.addonNestingLevel : 1;
        options.uiParams.addonNestingLevel++;

        var ns = options.ns,
                contentId = "embedded-" + ns,
                channelId = "channel-" + ns,
                initWidth = options.w || "100%",
                initHeight = options.h || "0";

        options.uiParams.isGeneral = !!options.general;
        options.uiParams.xdm_p = param(options.src, 'xdm_deprecated_addon_key_do_not_use');
        options.uiParams.xdm_e = param(options.src, 'xdm_e');
        options.uiParams.xdm_c = param(options.src, 'xdm_c');

        var xdmOptions = {
            remote: options.src,
            remoteOrigin: options.origin,
            remoteKey: options.key,
            container: contentId,
            channel: channelId,
            props: {width: initWidth, height: initHeight},
            uiParams: options.uiParams,
            renderingMethod: options.renderingMethod
        };

        if(options.productCtx && !options.productContext){
            options.productContext = JSON.parse(options.productCtx);
        }

        rpc.initWithFrame(options, xdmOptions);
    }

    function param(url, name) {
        return new uri.init(url).getQueryParamValue(name);
    }

    return function(iframeData) {

        var attemptCounter = 0;
        function doCreate() {
            //If the element we are going to append the iframe to doesn't exist in the dom (yet). Wait for it to appear.
            if(contentDiv(iframeData.ns) && attemptCounter < 10){
                setTimeout(function(){
                    attemptCounter++;
                    doCreate();
                }, 50);
                return;
            }

            // create the new iframe
            create(iframeData);
        }

        doCreate();
    };


});
