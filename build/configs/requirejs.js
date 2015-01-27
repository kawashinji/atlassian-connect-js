(function () {
    'use strict';

    var PATH_REQUIREJS_TRANSFORMED = '.tmp/requirejs-transformed';
    var PATH_BASEURL = 'src/js';

    var fs = require('fs-extra');
    var path = require('path');

    function bowerSource (file) {
        return rootSource('bower_components/' + file);
    }

    function npmSource (file) {
        return rootSource('node_modules/' + file);
    }

    function jsVendorSource (file) {
        return '../js-vendor/' + file;
    }

    function jsVendorFromModuleSource (file) {
        return '../../src/js-vendor/' + file;
    }

    function rootSource (file) {
        return '../../' + file;
    }

    var paths = {
        'almond': bowerSource('almond/almond'),
        '_ap': 'iframe/host/_ap',
        '_dollar': 'iframe/host/_dollar',
        '_uri': 'iframe/_uri',
        'host/_status_helper': 'iframe/host/_status_helper',
        '_util': 'iframe/host/_util',
        '_rpc': 'iframe/host/_rpc',
        '_events': 'iframe/_events',
        'env': 'iframe/host/env',
        'resize': 'iframe/host/resize',
        'loading-indicator': 'iframe/host/loading-indicator',
        'content': 'iframe/host/content',
        'history/rpc': 'history/history-rpc',
        'host/_addons': 'iframe/host/_addons',
        '_base64': 'iframe/_base64',
        '_jwt': 'iframe/_jwt',
        'host/jwt-keepalive': 'iframe/host/jwt-keepalive',
        '_xdm': 'iframe/_xdm',
        '_ui-params': 'iframe/_ui-params',
        'create': 'iframe/host/create',
        'connect-host': rootSource('.tmp/amd-stubs/connect-host')
    };

    var config = {
        extensions: {
            options: {
                baseUrl: PATH_BASEURL,
                preserveLicenseComments: false,
                paths: paths,
                dir: '.tmp/requirejs-optimizer',
                modules: [{
                    name: rootSource('.tmp/amd-stubs/connect-host-messages'),
                    include: [
                        'messages/main',
                        'messages/messages-rpc'
                    ],
                    exclude: [
                        rootSource('.tmp/amd-stubs/connect-host')
                    ]
                },
                {
                    name: rootSource('.tmp/amd-stubs/connect-host-request'),
                    include: [
                        'iframe/host/request'
                    ],
                    exclude: [
                        rootSource('.tmp/amd-stubs/connect-host')
                    ]
                }
                ],
                skipModuleInsertion: true
            }
        },
        dist: {
            options: {
                baseUrl: PATH_BASEURL,
                preserveLicenseComments: false,
                paths: paths,
                dir: '.tmp/requirejs-optimizer',
                wrap: {
                    startFile: 'build/start.frag',
                    endFile: 'build/end.frag'
                },
                shim: {
                    '_jwt': ['_base64'],
                    '_xdm': ["_events", "_jwt", "_uri",  "_ui-params", "_util"]
                },
                modules: [{
                    name: rootSource('.tmp/amd-stubs/connect-host'),
                    include: [
                        'almond',
                        // ap-amd
                        '_ap',
                        '_dollar',
                        // iframe-host-js
                        '_util',
                        '_rpc',
                        '_events',
                        'env',
                        'resize',
                        'loading-indicator',
                        'cookie/cookie',
                        'cookie/cookie-rpc',
                        // old additional modules used to load here
//                        'request',
                        'content',
                        //dialog
                        'dialog/binder',
                        'dialog/button',
                        'dialog/dialog-factory',
                        'dialog/main',
                        'dialog/dialog-rpc',
                        // inline dialog
                        'inline-dialog/main',
                        'inline-dialog/binder',
                        'inline-dialog/simple',

                        // messages

                        'history/history',
                        'history/rpc',
                        '_uri',
                        'host/_addons',
                        // 'iframe/host/main.js',
                        '_base64',
                        'analytics/analytics',
                        // core modules
                        '_jwt',
                        'host/jwt-keepalive',
                        '_xdm',
                        '_ui-params',
                        'host/_status_helper',
                        'create'
                    ]
                }],
                skipModuleInsertion: true
            }
        }
    };

    module.exports = config;
}());