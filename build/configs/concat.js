module.exports = {
    options: {
        stripBanners: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n\n',
        nonull: true
    },
    hostcss: {
        src: [
            '<%= paths.cssSource %>' + 'iframe/host.css',
            '<%= paths.cssSource %>' + 'messages/main.css',
            '<%= paths.cssSource %>' + 'dialog/dialog.css',
            '<%= paths.cssSource %>' + 'dialog/header-controls.css'
        ],
        dest: '.tmp/host-css.css',
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
            '<%= paths.jsSource %>' + 'iframe/_jwt.js',
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
            '<%= paths.jsSource %>' + 'iframe/plugin/navigator.js'
        ],
        dest: '.tmp/all-debug.js',
        nonull: true
    }
};
