'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = require('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _commonUri = require('../common/uri');

var _commonUri2 = _interopRequireDefault(_commonUri);

/**
* Utility methods for rendering connect addons in AUI components
*/

function getWebItemPluginKey(target) {
    var cssClass = target.attr('class');
    var m = cssClass ? cssClass.match(/ap-plugin-key-([^\s]*)/) : null;
    return _dollar2['default'].isArray(m) ? m[1] : false;
}
function getWebItemModuleKey(target) {
    var cssClass = target.attr('class');
    var m = cssClass ? cssClass.match(/ap-module-key-([^\s]*)/) : null;
    return _dollar2['default'].isArray(m) ? m[1] : false;
}

function getOptionsForWebItem(target) {
    var moduleKey = getWebItemModuleKey(target),
        type = target.hasClass('ap-inline-dialog') ? 'inlineDialog' : 'dialog';
    return window._AP[type + 'Options'][moduleKey] || {};
}

function contextFromUrl(url) {
    var pairs = new _commonUri2['default'].init(url).queryPairs;
    var obj = {};
    _dollar2['default'].each(pairs, function (key, value) {
        obj[value[0]] = value[1];
    });
    return obj;
}

function eventHandler(action, selector, callback) {

    function domEventHandler(event) {
        event.preventDefault();
        var $el = _dollar2['default'](event.target).closest(selector),
            href = $el.attr('href'),
            url = new _commonUri2['default'].init(href),
            options = {
            bindTo: $el,
            header: $el.text(),
            width: url.getQueryParamValue('width'),
            height: url.getQueryParamValue('height'),
            cp: url.getQueryParamValue('cp'),
            key: getWebItemPluginKey($el),
            productContext: contextFromUrl(href)
        };
        callback(href, options, event.type);
    }

    _dollar2['default'](window.document).on(action, selector, domEventHandler);
}

exports['default'] = {
    eventHandler: eventHandler,
    getOptionsForWebItem: getOptionsForWebItem,
    getWebItemPluginKey: getWebItemPluginKey,
    getWebItemModuleKey: getWebItemModuleKey
};
module.exports = exports['default'];