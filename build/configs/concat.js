module.exports = {
    options: {
        stripBanners: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n\n'
    },

    // host side js in one file
    host: {
        files: {
            '.tmp/host-debug.js': [
            // ap-amd
            '<%= paths.jsSource %>' + 'iframe/host/_ap.js',
            '<%= paths.jsSource %>' + 'iframe/iframe/_amd.js',
            '<%= paths.jsSource %>' + 'iframe/host/_dollar.js',
            // iframe-host-js
            '<%= paths.jsSource %>' + 'iframe/host/_util.js',
            '<%= paths.jsSource %>' + 'iframe/host/_rpc.js',
            '<%= paths.jsSource %>' + 'iframe/host/env.js',
            '<%= paths.jsSource %>' + 'iframe/host/resize.js',
            '<%= paths.jsSource %>' + 'iframe/host/loading-indicator.js',
            // old additional modules used to load here
            '<%= paths.jsSource %>' + 'iframe/_xdm.js',
            '<%= paths.jsSource %>' + 'iframe/_ui-params.js',
            '<%= paths.jsSource %>' + 'iframe/host/_status_helper.js'

            ]
        }
    },
    // plugin (all.js) in one file
    plugin: {
        files: {
            '.tmp/all-debug.js': [
            '<%= paths.jsSource %>' + 'iframe/_amd.js',
            '<%= paths.jsSource %>' + 'iframe/plugin/_util.js',
            '<%= paths.jsSource %>' + 'iframe/plugin/_dollar.js',
            '<%= paths.jsSource %>' + 'iframe/_events.js',
            //base64
            // jsuri
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
            '<%= paths.jsSource %>' + 'iframe/plugin/_init.js',


            ]
        }
    }

};