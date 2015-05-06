'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = require('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _rpc = require('./rpc');

var _rpc2 = _interopRequireDefault(_rpc);

exports['default'] = function () {
    return {
        init: function init(config, xdm) {
            xdm.resize = AJS.debounce(function resize($, width, height) {
                $(this.iframe).css({
                    width: width,
                    height: height
                });
                var nexus = $(this.iframe).closest('.ap-container');
                nexus.trigger('resized', {
                    width: width,
                    height: height
                });
            });
        },

        internals: {
            resize: function resize(width, height) {
                if (!this.uiParams.isDialog) {
                    this.resize(_dollar2['default'], width, height);
                }
            },

            sizeToParent: AJS.debounce(function () {
                function resizeHandler(iframe) {
                    var height = _dollar2['default'](document).height() - _dollar2['default']('#header > nav').outerHeight() - _dollar2['default']('#footer').outerHeight() - 20;
                    _dollar2['default'](iframe).css({
                        width: '100%',
                        height: height + 'px'
                    });
                }
                // sizeToParent is only available for general-pages
                if (this.uiParams.isGeneral) {
                    // This adds border between the iframe and the page footer as the connect addon has scrolling content and can't do this
                    _dollar2['default'](this.iframe).addClass('full-size-general-page');
                    _dollar2['default'](window).on('resize', function () {
                        resizeHandler(this.iframe);
                    });
                    resizeHandler(this.iframe);
                } else {
                    // This is only here to support integration testing
                    // see com.atlassian.plugin.connect.test.pageobjects.RemotePage#isNotFullSize()
                    _dollar2['default'](this.iframe).addClass('full-size-general-page-fail');
                }
            })
        }
    };
};

module.exports = exports['default'];