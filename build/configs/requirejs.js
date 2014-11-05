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
        '_uri': 'iframe/_uri',
        'host/_status_helper': 'iframe/host/_status_helper',
        '_xdm': 'iframe/_xdm',
        'host/jwt-keepalive': 'iframe/host/jwt-keepalive',
        '_jwt': 'iframe/_jwt',
        'dialog/rpc': 'dialog/dialog-rpc'
    };

    var config = {
        dist: {
            options: {
                baseUrl: PATH_BASEURL,
                preserveLicenseComments: false,
                optimize: 'none',
                paths: paths,
                skipDirOptimize: true,
                // dir: rootSource("dist/js"),
                dir: '.tmp/requirejs-optimizer',
                wrap: {
                    startFile: 'build/start.frag',
                    endFile: 'build/end.frag'
                },
                modules: [{
                    name: rootSource('.tmp/amd-stubs/connect-host'),
                    include: [
                        // ap-amd
                        'iframe/host/_ap.js',
                        'iframe/host/_dollar.js',
                        // iframe-host-js
                        'iframe/host/_util.js',
                        'iframe/host/_rpc.js',
                        'iframe/host/env.js',
                        'iframe/host/resize.js',
                        'iframe/host/loading-indicator.js',
                        'iframe/host/cookie.js',
                        // old additional modules used to load here
                        'iframe/host/request.js',
                        'iframe/host/content.js',
                        //dialog
                        'dialog/binder.js',
                        'dialog/button.js',
                        'dialog/dialog-factory.js',
                        'dialog/main.js',
                        'dialog/dialog-rpc.js',
                        // inline dialog
                        'inline-dialog/main.js',
                        'inline-dialog/binder.js',
                        'inline-dialog/simple.js',

                        // messages
                        'messages/main.js',
                        'messages/messages-rpc.js',

                        'history/history-rpc.js',
                        'history/history.js',
                        'iframe/_events.js',
                        'iframe/_events.js',
                        'iframe/_uri.js',
                        'iframe/host/_addons.js',
                        // 'iframe/host/main.js',
                        'iframe/_base64.js',
                        'analytics/analytics.js',
                        // core modules
                        'iframe/_jwt.js',
                        'iframe/host/jwt-keepalive.js',
                        'iframe/_xdm.js',
                        'iframe/_ui-params.js',
                        'iframe/host/_status_helper.js',
                        'iframe/host/create.js'
                    ]
                }],
                skipModuleInsertion: true
            }
        }
    };

    module.exports = config;
}());