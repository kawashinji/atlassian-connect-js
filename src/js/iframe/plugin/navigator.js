AP.define("navigator", ["_dollar", "_rpc"],

    /**
     * The Navigator API allows your add-on to change the current page using Javascript.
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
             * @property {String}        contentedit        The edit page for pages and blogs. Takes a `contentType` and a `contentId` to identify the content.
             * @property {String}        spaceview          The space view page. Takes a `spaceKey` to identify the space.
             * @property {String}        spacetools         The space tools page. Takes a `spaceKey` to identify the space.
             * @property {String}        dashboard          The dashboard of Confluence.
             * @property {String}        userprofile        The profile page for a specific user. Takes a `username` to identify the user.
             */

            /**
             * @class Navigator~context
             * @property {String}        contentId          Identifies a piece of content. Required for the contentview target.
             * @property {String}        contentType        Identifies the type of content. Can be either 'page' or 'blogpost'. Required for the contentedit target.
             * @property {String}        spaceKey           Identifies a space. Required for the spaceview and spacetools targets.
             * @property {String}        username           Identifies a user. Required for the userprofile target.
             */

            /**
             * Navigates the user from the current page to the specified page. This call navigates the host product, not the iframe content.
             *
             * Requires a target location and the corresponding context. Navigating by passing a concrete url is currently unsupported.
             * @name go
             * @method
             * @memberof module:Navigator#
             * @param {Navigator~target} target The type of page to navigate to.
             * @param {Navigator~context} context Specific information that identifies the page to navigate to.
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
            },

            /**
             *
             * Returns the context of the current page within the host application.
             *
             * This method will provide a context object to the passed in callback.  This context object
             * will contain information about the page currently open in the host application.
             *
             * The object will contain a target, which can be used when calling the <pre>go</pre> method, and
             * a context map containing in formation about the opened page.
             *
             * Currently this method supports two contexts in Confluence only:
             *
             * <strong>contentview</strong> - The host application is currently viewing a page, blog post or
             * other content.
             *
             * <strong>contentedit</strong> - the host application is currently editing a page, blog post or
             * other content.
             *
             * @name getCurrent
             * @method
             * @memberof module:Navigator#
             * @noDemo
             * @example
             * AP.require('navigator', function(navigator){
             *   var context = navigator.getCurrent();
             *   // context will be:
             *   // {
             *   //   "target": "contentview",
             *   //   "context": {
             *   //     "contentId": 1234
             *   //     "contentType": "page"
             *   // }
             * });
             */
            getCurrent: function(callback) {
                remote.getCurrent(callback);
            }

        };

        return {
            apis: exports
        };

    });

});
