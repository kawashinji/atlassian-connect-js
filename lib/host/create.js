'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dollar = require('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

var _analytics = require('./analytics');

var _analytics2 = _interopRequireDefault(_analytics);

var _rpc = require('./rpc');

var _rpc2 = _interopRequireDefault(_rpc);

var _commonUiParams = require('../common/ui-params');

var _commonUiParams2 = _interopRequireDefault(_commonUiParams);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var defer = window.requestAnimationFrame || function (f) {
  setTimeout(f, 10);
};

function contentDiv(ns) {
  if (!ns) {
    throw new Error('ns undefined');
  }
  return _dollar2['default'](document.getElementById('embedded-' + ns));
}

/**
* @name Options
* @class
* @property {String}  ns            module key
* @property {String}  src           url of the iframe
* @property {String}  w             width of the iframe
* @property {String}  h             height of the iframe
* @property {String}  dlg           is a dialog (disables the resizer)
* @property {String}  simpleDlg     deprecated, looks to be set when a confluence macro editor is being rendered as a dialog
* @property {Boolean} general       is a page that can be resized
* @property {String}  productCtx    context to pass back to the server (project id, space id, etc)
* @property {String}  key           addon key from the descriptor
* @property {String}  uid           id of the current user
* @property {String}  ukey          user key
* @property {String}  data.timeZone timezone of the current user
* @property {String}  cp            context path
*/

/**
* @param {Options} options These values come from the velocity template and can be overridden using uiParams
*/
function create(options) {
  if (typeof options.uiParams !== 'object') {
    options.uiParams = _commonUiParams2['default'].fromUrl(options.src);
  }

  var ns = options.ns,
      contentId = 'embedded-' + ns,
      channelId = 'channel-' + ns,
      initWidth = options.w || '100%',
      initHeight = options.h || '0';

  if (typeof options.uiParams !== 'object') {
    options.uiParams = {};
  }

  if (!!options.general) {
    options.uiParams.isGeneral = true;
  }

  var xdmOptions = {
    remote: options.src,
    remoteKey: options.key,
    container: contentId,
    channel: channelId,
    props: { width: initWidth, height: initHeight },
    uiParams: options.uiParams
  };

  if (options.productCtx && !options.productContext) {
    options.productContext = JSON.parse(options.productCtx);
  }

  _rpc2['default'].extend({
    init: function init(opts, xdm) {
      xdm.analytics = _analytics2['default'].get(xdm.addonKey, ns);
      xdm.analytics.iframePerformance.start();
      xdm.productContext = options.productContext;
    }
  });

  _rpc2['default'].init(options, xdmOptions);
}

exports['default'] = function (options) {

  var attemptCounter = 0;
  function doCreate() {
    //If the element we are going to append the iframe to doesn't exist in the dom (yet). Wait for it to appear.
    if (contentDiv(options.ns).length === 0 && attemptCounter < 10) {
      setTimeout(function () {
        attemptCounter++;
        doCreate();
      }, 50);
      return;
    }

    // create the new iframe
    create(options);
  }

  if (AJS.$.isReady) {
    // if the dom is ready then this is being run during an ajax update;
    // in that case, defer creation until the next event loop tick to ensure
    // that updates to the desired container node's parents have completed
    defer(doCreate);
  } else {
    _dollar2['default'](doCreate);
  }
};

;
module.exports = exports['default'];