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
        soySource: 'src/soy/',
        compiledSoySource: '.tmp/compiled-soy/',
        i18nBundle: 'src/i18n/aui.properties',
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
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jscs-checker');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-plato');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-text-replace');

    grunt.registerTask('default', 'Shows the available tasks.', 'availabletasks');
    grunt.registerTask('lint', 'Lints the code using JSHint and JSCS.', ['jshint', 'jscs']);
    grunt.registerTask('test', 'Runs the unit tests.', ['requirejs-config', 'karma:cli', 'clean:tmp']);
    grunt.registerTask('test-debug', 'Runs the unit tests.', ['watch:test', 'clean:tmp']);
    grunt.registerTask('test-dist', 'Runs the unit tests with the dist', ['requirejs-config', 'clean:tmp', 'clean:dist']);
    grunt.registerTask('build', 'Builds Atlassian Connect js', [
        'build-js',
        'less:dist',
        'concat:auiAll',
        'cssmin:dist',
        'replace:projectVersion',
        'clean:tmp'
    ]);
    grunt.registerTask('build-js', 'Builds Atlassian Connect js', [
        'soy-compile:core',
//        'amd-stubs', //TODO add back in
        'requirejs:dist',
        'replace:projectVersion',
        'clean:tmp'
    ]);

    // TODO: Refactor into grunt-shell command once https://bitbucket.org/atlassian/aui/pull-request/656/implement-jscs-and-re-enable-jshint-task/diff is merged.
    grunt.registerTask('amd-stubs', 'Create stub files for the RequireJS optimiser.',  function() {
        var cmds = [
            'mkdir -p .tmp/amd-stubs',
            'touch .tmp/amd-stubs/aui-datepicker.js',
            'touch .tmp/amd-stubs/aui-experimental.js',
            'touch .tmp/amd-stubs/aui-soy.js',
            'touch .tmp/amd-stubs/aui.js'
        ];

        require('child_process').exec(cmds.join(' && '), this.async());
    });
};