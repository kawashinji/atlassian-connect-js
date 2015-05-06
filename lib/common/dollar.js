'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var $;
if (process.env.ENV === 'host') {
    $ = require('../host/dollar');
} else {
    $ = require('../plugin/dollar');
}

exports['default'] = $;
module.exports = exports['default'];