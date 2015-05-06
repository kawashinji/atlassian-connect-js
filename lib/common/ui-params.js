'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _base64 = require('./base64');

var _base642 = _interopRequireDefault(_base64);

var _uri = require('./uri');

var _uri2 = _interopRequireDefault(_uri);

/**
* These are passed into the main host create statement and can override
* any options inside the velocity template.
* Additionally these are accessed by the js inside the client iframe to check if we are in a dialog.
*/

exports['default'] = {
    /**
    * Encode options for transport
    */
    encode: function encode(options) {
        if (options) {
            return _base642['default'].encode(JSON.stringify(options));
        }
    },
    /**
    * return ui params from a Url
    **/
    fromUrl: function fromUrl(url) {
        var url = new Uri.init(url),
            params = url.getQueryParamValue('ui-params');
        return this.decode(params);
    },
    /**
    * returns ui params from window.name
    */
    fromWindowName: function fromWindowName(w, param) {
        w = w || window;
        var decoded = this.decode(w.name);

        if (!param) {
            return decoded;
        }
        return decoded ? decoded[param] : undefined;
    },
    /**
    * Decode a base64 encoded json string containing ui params
    */
    decode: function decode(params) {
        var obj = {};
        if (params && params.length > 0) {
            try {
                obj = JSON.parse(_base642['default'].decode(params));
            } catch (e) {
                if (console && console.log) {
                    console.log('Cannot decode passed ui params', params);
                }
            }
        }
        return obj;
    }
};
module.exports = exports['default'];