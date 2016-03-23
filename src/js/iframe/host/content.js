/**
 * Utility methods for rendering connect addons in AUI components
 */

define("host/content", ["_dollar", "_uri"], function ($, uri) {
    "use strict";

    function getKeyFromClass(target, pattern){
        var cssClass = target.attr('class');
        var m = cssClass ? cssClass.match(pattern) : null;
        return $.isArray(m) ? m[1] : false;
    }

    function getWebItemPluginKey(target){
        return getKeyFromClass(target, /ap-plugin-key-([^\s]*)/);
    }
    function getWebItemModuleKey(target){
        return getKeyFromClass(target, /ap-module-key-([^\s]*)/);
    }
    function getWebItemTargetKey(target){
        return getKeyFromClass(target, /ap-target-key-([^\s]*)/);
    }

    function getOptionsForWebItem(target){
        var moduleKey = getWebItemModuleKey(target),
            type = target.hasClass('ap-inline-dialog') ? 'inlineDialog' : 'dialog';
            return window._AP[type + 'Options'][moduleKey] || {};
    }

    function contextFromUrl (url) {
        var pairs = new uri.init(url).queryPairs;
        var obj = {};
        $.each(pairs, function (key, value) {
            obj[value[0]] = value[1];
        });
        return obj;
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
                key: getWebItemPluginKey($el),
                productContext: contextFromUrl(href)
            };
            callback(href, options, event.type);
        }

        $(window.document).on(action, selector, domEventHandler);

    }

    return {
        eventHandler: eventHandler,
        getOptionsForWebItem: getOptionsForWebItem,
        getWebItemPluginKey: getWebItemPluginKey,
        getWebItemModuleKey: getWebItemModuleKey,
        getWebItemTargetKey: getWebItemTargetKey
    };


});
