var fs = require('fs'),
    glob = require("glob"),
    extend = require('extend');


// function listPluginModules(){
//     var first = [
//             'src/js/iframe/host/_ap.js',
//             'src/js/iframe/_amd.js',
//         ];

//     var all = glob.sync('src/js/**/*.js').filter(function(filepath) {
//         if(first.indexOf(filepath) !== -1){
//             return false;
//         }
//         if(fs.readFileSync(filepath, "utf8").match(/[^_]AP\./) !== null){
//             return true;
//         }
//         return false;
//     });
//     extend(first, all);
//     return first;
// }

// function listHostModules(){
//     var first = [
//             'src/js/iframe/host/_ap.js',
//             'src/js/iframe/_amd.js',
//         ];

//     var all = glob.sync('src/js/**/*.js').filter(function(filepath) {
//             if(first.indexOf(filepath) !== -1){
//                 return false;
//             }
//             return (fs.readFileSync(filepath, "utf8").indexOf('_AP') > 0);
//     });
//     return extend(first, all);
// }

module.exports = {
    options: {
        stripBanners: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n\n',
        nonull: true
    },
    /**
    * The host takes all files that references _AP as all our JS is namespaced.
    */
    host: {
        src: [
            // ap-amd
            '<%= paths.jsSource %>' + 'iframe/host/_ap.js',
            '<%= paths.jsSource %>' + 'iframe/_amd.js',
            '<%= paths.jsSource %>' + 'iframe/host/_dollar.js',
            // iframe-host-js
            '<%= paths.jsSource %>' + 'iframe/host/_util.js',
            '<%= paths.jsSource %>' + 'iframe/host/_rpc.js',
            '<%= paths.jsSource %>' + 'iframe/host/env.js',
            '<%= paths.jsSource %>' + 'iframe/host/resize.js',
            '<%= paths.jsSource %>' + 'iframe/host/loading-indicator.js',
            '<%= paths.jsSource %>' + 'iframe/host/cookie.js',
            // old additional modules used to load here
            '<%= paths.jsSource %>' + 'iframe/host/request.js',
            //dialog
            '<%= paths.jsSource %>' + 'dialog/binder.js',
            '<%= paths.jsSource %>' + 'dialog/button.js',
            '<%= paths.jsSource %>' + 'dialog/dialog-factory.js',
            '<%= paths.jsSource %>' + 'dialog/main.js',
            '<%= paths.jsSource %>' + 'dialog/dialog-rpc.js',
            // inline dialog
            '<%= paths.jsSource %>' + 'inline-dialog/main.js',
            '<%= paths.jsSource %>' + 'inline-dialog/binder.js',
            '<%= paths.jsSource %>' + 'inline-dialog/simple.js',

            // messages
            '<%= paths.jsSource %>' + 'messages/main.js',
            '<%= paths.jsSource %>' + 'messages/messages-rpc.js',

            '<%= paths.jsSource %>' + 'history/history-rpc.js',
            '<%= paths.jsSource %>' + 'history/history.js',
            '<%= paths.jsSource %>' + 'iframe/_events.js',
            '<%= paths.jsSource %>' + 'iframe/_events.js',
            '<%= paths.jsSource %>' + 'iframe/_uri.js',
            '<%= paths.jsSource %>' + 'iframe/host/_addons.js',
            '<%= paths.jsSource %>' + 'iframe/host/main.js',
            '<%= paths.jsSource %>' + 'iframe/_base64.js',
            '<%= paths.jsSource %>' + 'iframe/host/content.js',
            '<%= paths.jsSource %>' + 'analytics/analytics.js',
            // core modules
            '<%= paths.jsSource %>' + 'iframe/_xdm.js',
            '<%= paths.jsSource %>' + 'iframe/_ui-params.js',
            '<%= paths.jsSource %>' + 'iframe/host/_status_helper.js',
            // JIRA
            '<%= paths.jsSource %>' + 'jira/workflow-post-function/workflow-post-function.js',
            '<%= paths.jsSource %>' + 'jira/workflow-post-function/workflow-post-function-rpc.js',
            '<%= paths.jsSource %>' + 'jira/events.js',
            // confluence
            '<%= paths.jsSource %>' + 'confluence/macro/editor-rpc.js',
            '<%= paths.jsSource %>' + 'confluence/macro/editor.js',
//            '<%= paths.jsSource %>' + 'confluence/macro/override.js',
            '<%= paths.jsSource %>' + 'iframe/_ui-params.js'

            ],
        dest: '.tmp/host-debug.js',
        nonull: true
    },
    /**
    * If the file references AP (without _ before it). Include it in the plugin
    */
    plugin: {
        src: [
            '<%= paths.jsSource %>' + 'iframe/_amd.js',
            '<%= paths.jsSource %>' + 'iframe/plugin/_util.js',
            '<%= paths.jsSource %>' + 'iframe/plugin/_dollar.js',
            '<%= paths.jsSource %>' + 'iframe/_events.js',
            '<%= paths.jsSource %>' + 'iframe/_base64.js',
            '<%= paths.jsSource %>' + 'iframe/_uri.js',
            '<%= paths.jsSource %>' + 'iframe/_ui-params.js',
            '<%= paths.jsSource %>' + 'iframe/_xdm.js',
            '<%= paths.jsSource %>' + 'iframe/plugin/_rpc.js',
            '<%= paths.jsSource %>' + 'iframe/plugin/events.js',
            '<%= paths.jsSource %>' + 'iframe/plugin/env.js',
            '<%= paths.jsSource %>' + 'iframe/plugin/request.js',
            '<%= paths.jsSource %>' + 'iframe/plugin/dialog.js',
            '<%= paths.jsSource %>' + 'iframe/plugin/inline-dialog.js',
            '<%= paths.jsSource %>' + 'iframe/plugin/messages.js',
            '<%= paths.jsSource %>' + 'iframe/plugin/cookie.js',
            '<%= paths.jsSource %>' + 'iframe/plugin/history.js',
            '<%= paths.jsSource %>' + 'iframe/plugin/_resize_listener.js',
            // jira / confluence specifics go here
            '<%= paths.jsSource %>' + 'iframe/plugin/jira.js',
            '<%= paths.jsSource %>' + 'iframe/plugin/confluence.js',

            '<%= paths.jsSource %>' + 'iframe/plugin/_init.js'
        ],
        dest: '.tmp/all-debug.js',
        nonull: true
    }
};
