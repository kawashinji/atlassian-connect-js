AP.require(['_dollar', '_rpc'],

    /**
     * The Navigator API allows your add-on to change the current page using Javascript.
     *
     * Note: This API is currently only implemented for Confluence.
     *
     * @exports Navigator
     */

    function ($, rpc) {
        'use strict';
        return rpc.extend(function () {
            return {
                initForFrame: function registerInnerIframe(options, remote) {
                    options = options || {};

                    remote.registerInnerIframe(options);

                },
                stubs: ['registerInnerIframe']
            };
        });
    }
);
