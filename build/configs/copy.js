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
    }
};