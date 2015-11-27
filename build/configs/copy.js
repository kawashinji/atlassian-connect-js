module.exports = {
    disthostjs: {
        files: [{
            cwd: '<%= paths.tmp %>amd-stubs',
            dest:  '<%= paths.dist %>',
            expand: true,
            filter: 'isFile',
            src: ['**.js',
            '!*.report.txt']
        }]
    },
    distpluginjs: {
        files: [{
            cwd: '<%= paths.tmp %>',
            dest:  '<%= paths.dist %>',
            expand: true,
            filter: 'isFile',
            src: ['all.js', 'all-debug.js',
            '!*.report.txt']
        }]
    },
    distcss: {
        files: [{
            cwd: '<%= paths.tmp %>',
            dest:  '<%= paths.dist %>',
            expand: true,
            filter: 'isFile',
            src: ['**.css',
            '!*.report.txt']
        }]
    },

    // Copy distribution files to another directory, generally the target of the plugin.resource.directories
    // environment variable for the server running the Atlassian Connect Plugin. This enables resources from this project
    // to be available to a running server without having to re-install the plugin that normally wraps these files.
    deploy: {
        files: [{
            cwd: '<%= paths.dist %>',
            dest:  '<%= paths.deploy %>',
            expand: true,
            src: ['**.*']
        }]
    }
};