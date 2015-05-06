'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

require('Base64');

exports['default'] = {
    encode: window.btoa,
    decode: window.atob
};
module.exports = exports['default'];