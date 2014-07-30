/**
 * Utility methods for rendering connect addons in AUI components
 */

_AP.define("host/content", ["_dollar", "_uri"], function ($, uri) {
    "use strict";

    function getWebItemPluginKey(target){
        var m = target.attr('class').match(/ap-plugin-key-([^\s]*)/);
        return $.isArray(m) ? m[1] : false;
    }
    function getWebItemModuleKey(target){
        var m = target.attr('class').match(/ap-module-key-([^\s]*)/);
        return $.isArray(m) ? m[1] : false;
    }

    function getOptionsForWebItem(target){
        var pluginKey = getWebItemPluginKey(target),
            moduleKey = getWebItemModuleKey(target),
            type = target.hasClass('ap-inline-dialog') ? 'inlineDialog' : 'dialog';
            return window._AP[type + 'Options'][moduleKey] || {};
    }

    function eventHandler(action, selector, callback) {

        function domEventHandler(event) {
            event.preventDefault();
            var $el = $(event.target).closest(selector),
            href = $el.attr("href"),
            url = new uri.init(href),
            options = {
                bindTo: $el,
                header: $el.text(),
                width:  url.getQueryParamValue('width'),
                height: url.getQueryParamValue('height'),
                cp:     url.getQueryParamValue('cp'),
                key: getWebItemPluginKey($el)
            };
            callback(href, options, event.type);
        }

        $(window.document).on(action, selector, domEventHandler);

    }

    return {
        eventHandler: eventHandler,
        getOptionsForWebItem: getOptionsForWebItem
    };


});
