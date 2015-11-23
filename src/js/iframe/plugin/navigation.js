AP.define("navigation", ["_dollar", "_rpc"], function ($, rpc) {
    "use strict";
    return rpc.extend(function (remote) {
        var exports = {

            /**
             * @class Navigation~target
             * @property {String}        contentview        The view page for pages and blogs. Takes a `contentId` to identify the content.
             * @property {String}        contentedit        The edit page for pages and blogs. Takes a `contentId` to identify the content and a `shareToken` to allow editing.
             * @property {String}        spaceview          The space view page. Takes a `spaceKey` to identify the space.
             * @property {String}        spaceadmin         The space admin page. Takes a `spaceKey` to identify the space.
             * @property {String}        dashboard          The dashboard of Confluence.
             * @property {String}        userprofile        The profile page for a specific user. Takes a `username` to identify the user.
             */

            /**
             * Navigates the user from the current page to a different one. Call is made out to the parent page.
             * @name to
             * @method
             * @memberof module:Navigation#
             * @param {String} {Navigation~target} The type of page to navigate to
             * @param {Object} context Specific information that identifies the page to navigate to
             * @example
             * AP.require('navigation', function(navigation){
             *   navigation.to('contentview', {id: '12345'});
             * });
             */
            to: function (target, context) {
                remote.to(target, context);
            },

            /**
             * Triggers a reload of the parent page.
             * @name reload
             * @method
             * @memberof module:Navigation#
             * @param none
             * @example
             * AP.require('navigation', function(navigation){
             *   navigation.reload();
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
