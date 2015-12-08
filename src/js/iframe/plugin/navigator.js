AP.define("navigator", ["_dollar", "_rpc"],

    /**
     * The Navigator API allows your add-on to change the current page using Javascript.
     *
     * ### Example ###
     * ```
     * AP.require('navigator', function(navigator){
     *   navigator.go('dashboard');
     * });
     * ```
     *
     * Note: This API is currently only implemented for Confluence.
     *
     * @exports Navigator
     */

    function ($, rpc) {
    "use strict";
    return rpc.extend(function (remote) {
        var exports = {

            /**
             * @class Navigator~target
             * @property {String}        contentview        The view page for pages and blogs. Takes a `contentId` to identify the content.
             * @property {String}        contentedit        The edit page for pages and blogs. Takes a `draftId` to identify the content and a `shareToken` to allow editing.
             * @property {String}        spaceview          The space view page. Takes a `spaceKey` to identify the space.
             * @property {String}        spaceadmin         The space admin page. Takes a `spaceKey` to identify the space.
             * @property {String}        dashboard          The dashboard of Confluence.
             * @property {String}        userprofile        The profile page for a specific user. Takes a `username` to identify the user.
             */

            /**
             * Navigates the user from the current page to the specified page. This call is made from within your iframe, out to the parent page.
             * @name go
             * @method
             * @memberof module:Navigator#
             * @param {String} target The type of page to navigate to.
             * @param {Object} context Specific information that identifies the page to navigate to.
             * @noDemo
             * @example
             * AP.require('navigator', function(navigator){
             *   navigator.go('contentview', {contentId: '12345'});
             * });
             */
            go: function (target, context) {
                remote.go(target, context);
            },

            /**
             * Triggers a reload of the parent page.
             * @name reload
             * @method
             * @memberof module:Navigator#
             * @noDemo
             * @example
             * AP.require('navigator', function(navigator){
             *   navigator.reload();
             * });
             */
            reload: function () {
                remote.reload();
            }

        };

        return {
            apis: exports,
            stubs: ["to", "reload"]
        };

    });

});
