module.exports = function (grunt) {
    'use strict';

    var config = require('./build/configs')(grunt);

    config.jquery = grunt.option('jquery') || '1.8.3';
    config.pkg = grunt.file.readJSON('package.json');

    // Specified on the command line,
    // e.g. --deployPath=/Users/dtaylor/src/atlassian/AC/atlassian-connect/plugin/src/main/resources/js/core
    var deployPath = grunt.option('deployPath') || 'no deploy path';

    config.paths = {
        jsSource: 'src/js/',
        jsVendorSource: 'src/js-vendor/',
        bowerSource: 'bower_components/',
        styleSource: 'src/less/',
        cssSource: 'src/css/',
        cssVendorSource: 'src/css-vendor/',
        dist: 'dist/',
        tmp: '.tmp/',
        deploy: deployPath
    };

    grunt.initConfig(config);

    grunt.loadNpmTasks('grunt-available-tasks');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-append-sourcemapping');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jscs-checker');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', 'Shows the available tasks.', 'availabletasks');
    grunt.registerTask('lint', 'Lints the code using JSHint and JSCS.', ['jshint', 'jscs']);
    grunt.registerTask('test', 'Runs the unit tests.', [
        'karma:host',
        'karma:plugin',
        'clean:tmp'
        ]);
    grunt.registerTask('test-debug', 'Runs the unit tests.', ['watch:test', 'clean:tmp']);
    grunt.registerTask('test-dist', 'Runs the unit tests with the dist', ['requirejs-config', 'clean:tmp', 'clean:dist']);
    grunt.registerTask('build', 'Builds Atlassian Connect js', [
        'build-js',
        'build-css',
        'clean:tmp'
/*       'less:dist',
        'replace:projectVersion',
*/
    ]);
    grunt.registerTask('build-css', 'Builds Atlassian Connect js', [
        'concat:hostcss',
        'copy:distcss'
    ]);

    grunt.registerTask('build-js', 'Builds Atlassian Connect js', [
        'shell:amdStubs',
        'requirejs:extensions',
        'requirejs:dist',
        'concat:plugin',
        // 'closure-compiler',
//        'append-sourcemapping',
        'uglify',
        'replace:projectVersion',
        'copy:disthostjs',
        'copy:distpluginjs',
        'clean:tmp'
    ]);

    grunt.registerTask('build-and-deploy', 'Builds Atlassian Connect JS and deploys it to a local folder defined by --deployPath option.', [
        'build',
        'copy:deploy'
    ]);
};