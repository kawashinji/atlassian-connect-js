// Karma configuration
// Generated on Wed Oct 16 2013 15:12:27 GMT+1100 (EST)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['qunit', 'requirejs', 'sinon'],


    // list of files / patterns to load in the browser
    files: [
      {pattern: 'node_modules/karma-sinon/node_modules/sinon/lib/sinon/util/timers_ie.js', included: true},
      {pattern: 'bower_components/jquery/jquery.js', included: true},
      {pattern: 'bower_components/aui/src/js/atlassian.js', included: false},
      {pattern: 'bower_components/aui-dist/aui/js/aui-all.js', included: false},
      'tests/unit/test-main.js',
      {pattern: 'tests/unit/**/*-test.js', included: false},
      {pattern: 'tests/unit/fixtures/**', included: false},
      {pattern: 'src/js/**/*.js', included: false},
      {pattern: 'dist/all-debug.js', included: false},
      {pattern: 'tests/unit/fixtures/_init.js', included: false}

//      {pattern: 'target/qunit/dependencies/**/*.js', included: false},
    ],


    // list of files to exclude
    exclude: [
      'tests/unit/js/iframe/plugin/*-test.js'
    ],

    //do not process my html files.
    preprocessors: {
      'tests/unit/fixtures/!(*).html': ['html2js']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'junit'],
    junitReporter: {
      outputFile: 'tests/test-reports/karma-results.xml',
      suite: ''
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    //browsers: ['Chrome', 'Safari', 'Firefox', 'Opera', 'IE11 - Win7', 'IE10 - Win7', 'IE9 - Win7'],
    browsers: ['Chrome'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
