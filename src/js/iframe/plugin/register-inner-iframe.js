AP.require(['_dollar', '_rpc'],

    /**
     * Register inner iframe rpc method.
     * When creating a AC iframe from a plugin this method is used to sent the
     * appropriate framedata to the parent frame
     *
     * @exports RegisterInnerIframe
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
