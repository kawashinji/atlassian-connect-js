AP.define("_create_inner_frame", ['_ui-params', '_initialise_iframe_request', '_rpc', "_util"], function(uiParams, initialiseIframeRequest, rpc, util) {

    function contentDiv(ns) {
        if(!ns){
            throw new Error("ns undefined");
        }
        return document.getElementById("#embedded-" + util.escapeSelector(ns));
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

        window.mostRecentMacroOptions = options;
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

        rpc.initWithFrame(options, xdmOptions);
    }

    //TODO: In the future send the JSON blob up to the top frame.
    //initialiseIframeRequest(iframeData);

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
