module.exports = function (grunt) {
    'use strict';

    var config = require('./build/configs')(grunt);

    config.jquery = grunt.option('jquery') || '1.8.3';
    config.pkg = grunt.file.readJSON('package.json');
    config.paths = {
        jsSource: 'src/js/',
        jsVendorSource: 'src/js-vendor/',
        bowerSource: 'bower_components/',
        styleSource: 'src/less/',
        cssVendorSource: 'src/css-vendor/',
        dist: 'dist/',
        tmp: '.tmp/'
    };

    grunt.initConfig(config);

    grunt.loadTasks('build/tasks');
    grunt.loadNpmTasks('grunt-available-tasks');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-closure-compiler');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jscs-checker');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-text-replace');

    grunt.registerTask('default', 'Shows the available tasks.', 'availabletasks');
    grunt.registerTask('lint', 'Lints the code using JSHint and JSCS.', ['jshint', 'jscs']);
    grunt.registerTask('test', 'Runs the unit tests.', ['requirejs-config', 'karma:cli', 'clean:tmp']);
    grunt.registerTask('test-debug', 'Runs the unit tests.', ['watch:test', 'clean:tmp']);
    grunt.registerTask('test-dist', 'Runs the unit tests with the dist', ['requirejs-config', 'clean:tmp', 'clean:dist']);
    grunt.registerTask('build', 'Builds Atlassian Connect js', [
        'build-js',
        'clean:tmp'
/*       'less:dist',
        'replace:projectVersion',
*/
    ]);
    grunt.registerTask('build-js', 'Builds Atlassian Connect js', [
        'concat:host',
        'concat:plugin',
        'closure-compiler',
        'replace:projectVersion',
        'copy:dist',
//        'clean:tmp'
    ]);

};