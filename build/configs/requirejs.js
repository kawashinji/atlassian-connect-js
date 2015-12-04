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
        '_uritemplate': 'iframe/_uritemplate',
        'host/_status_helper': 'iframe/host/_status_helper',
        '_util': 'iframe/host/_util',
        '_rpc': 'iframe/host/_rpc',
        '_events': 'iframe/_events',
        'env': 'iframe/host/env',
        'resize': 'iframe/host/resize',
        'loading-indicator': 'iframe/host/loading-indicator',
        'content': 'iframe/host/content',
        'host/_addons': 'iframe/host/_addons',
        '_base64': 'iframe/_base64',
        '_jwt': 'iframe/_jwt',
        'host/jwt-keepalive': 'iframe/host/jwt-keepalive',
        '_xdm': 'iframe/_xdm',
        '_ui-params': 'iframe/_ui-params',
        'create': 'iframe/host/create',
        'connect-host': rootSource('.tmp/amd-stubs/connect-host')
    };

    var coreModules = [
        '_ap',
        '_dollar',
        '_util',
        '_rpc',
        '_events',
        'resize',
        'loading-indicator',
        'content',
        '_uri',
        '_uritemplate',
        'host/_addons',
        '_base64',
        'analytics/analytics',
        '_jwt',
        'host/jwt-keepalive',
        '_xdm',
        '_ui-params',
        'host/_status_helper',
        'create'
    ];

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
                },
                {
                    name: rootSource('.tmp/amd-stubs/connect-host-env'),
                    include: [
                        'iframe/host/env'
                    ],
                    exclude: [
                        rootSource('.tmp/amd-stubs/connect-host')
                    ]
                },
                {
                    name: rootSource('.tmp/amd-stubs/connect-host-cookie'),
                    include: [
                        'cookie/main',
                        'cookie/cookie-rpc'
                    ],
                    exclude: [
                        rootSource('.tmp/amd-stubs/connect-host')
                    ]
                },
                {
                    name: rootSource('.tmp/amd-stubs/connect-host-history'),
                    include: [
                        'history/main',
                        'history/history-rpc'
                    ],
                    exclude: [
                        rootSource('.tmp/amd-stubs/connect-host')
                    ]
                },
                {
                    name: rootSource('.tmp/amd-stubs/connect-host-inline-dialog'),
                    include: [
                        'inline-dialog/main',
                        'inline-dialog/simple',
                        'inline-dialog/binder'
                    ],
                    exclude: [
                        rootSource('.tmp/amd-stubs/connect-host')
                    ]
                },
                {
                    name: rootSource('.tmp/amd-stubs/connect-host-dialog'),
                    include: [
                        'dialog/button',
                        'dialog/main',
                        'dialog/dialog-factory',
                        'dialog/dialog-rpc',
                        'dialog/binder'
                    ],
                    exclude: [
                        rootSource('.tmp/amd-stubs/connect-host')
                    ]
                },
                {
                    name: rootSource('.tmp/amd-stubs/connect-host-navigation'),
                    include: [
                        'navigation/navigation-routes',
                        'navigation/navigation-browser',
                        'navigation/main',
                        'navigation/navigation-rpc'
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
                modules: [
                {
                    name: rootSource('.tmp/amd-stubs/connect-host'),
                        include: ['almond'].concat(coreModules)
                },
                {
                    name: rootSource('.tmp/amd-stubs/connect-host-amd'),
                        include: coreModules
                }
                ],
                skipModuleInsertion: true
            }
        }
    };

    module.exports = config;
}());