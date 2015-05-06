'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _addons = require('./addons');

var _addons2 = _interopRequireDefault(_addons);

var _content = require('./content');

var _content2 = _interopRequireDefault(_content);

var _cookieRpc = require('./cookie/rpc');

var _cookieRpc2 = _interopRequireDefault(_cookieRpc);

var _create = require('./create');

var _create2 = _interopRequireDefault(_create);

var _dialogApi = require('./dialog/api');

var _dialogApi2 = _interopRequireDefault(_dialogApi);

var _dialogBinder = require('./dialog/binder');

var _dialogBinder2 = _interopRequireDefault(_dialogBinder);

var _dialogRpc = require('./dialog/rpc');

var _dialogRpc2 = _interopRequireDefault(_dialogRpc);

var _env = require('./env');

var _env2 = _interopRequireDefault(_env);

var _historyRpc = require('./history/rpc');

var _historyRpc2 = _interopRequireDefault(_historyRpc);

var _inlineDialogRpc = require('./inline-dialog/rpc');

var _inlineDialogRpc2 = _interopRequireDefault(_inlineDialogRpc);

var _inlineDialogBinder = require('./inline-dialog/binder');

var _inlineDialogBinder2 = _interopRequireDefault(_inlineDialogBinder);

var _loadingIndicator = require('./loading-indicator');

var _loadingIndicator2 = _interopRequireDefault(_loadingIndicator);

var _messagesRpc = require('./messages/rpc');

var _messagesRpc2 = _interopRequireDefault(_messagesRpc);

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _resize = require('./resize');

var _resize2 = _interopRequireDefault(_resize);

var _rpc = require('./rpc');

var _rpc2 = _interopRequireDefault(_rpc);

var _statusHelper = require('./status-helper');

var _statusHelper2 = _interopRequireDefault(_statusHelper);

var _commonUiParams = require('../common/ui-params');

var _commonUiParams2 = _interopRequireDefault(_commonUiParams);

var _commonUri = require('../common/uri');

var _commonUri2 = _interopRequireDefault(_commonUri);

/**
 * Private namespace for host-side code.
 * @type {*|{}}
 * @private
 * @deprecated use AMD instead of global namespaces. The only thing that should be on _AP is _AP.define and _AP.require.
 */
if (!window._AP) {
    window._AP = {};
}

AJS.toInit(function () {
    if (typeof window._AP !== 'undefined') {
        window._AP.Dialog = _dialogApi2['default'];
    }
});

AJS.toInit(_dialogBinder2['default']);
AJS.toInit(_inlineDialogBinder2['default']);

_rpc2['default'].extend(_addons2['default']);
_rpc2['default'].extend(_cookieRpc2['default']);
_rpc2['default'].extend(_dialogRpc2['default']);
_rpc2['default'].extend(_env2['default']);
_rpc2['default'].extend(_historyRpc2['default']);
_rpc2['default'].extend(_inlineDialogRpc2['default']);
_rpc2['default'].extend(_loadingIndicator2['default']);
_rpc2['default'].extend(_messagesRpc2['default']);
_rpc2['default'].extend(_resize2['default']);
_rpc2['default'].extend(_request2['default']);

exports['default'] = {
    extend: _rpc2['default'].extend,
    init: _rpc2['default'].init,
    uiParams: _commonUiParams2['default'],
    create: _create2['default'],
    _uriHelper: _commonUri2['default'],
    _statusHelper: _statusHelper2['default'],
    webItemHelper: _content2['default']
};
module.exports = exports['default'];