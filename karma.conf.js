// Karma configuration
// Generated on Wed Oct 16 2013 15:12:27 GMT+1100 (EST)

var envify = require('envify/custom')

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',

    // frameworks to use
    frameworks: ['browserify', 'qunit', 'sinon'],

    // list of files / patterns to load in the browser
    files: [
      'https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.js',
      'https://aui-cdn.atlassian.com/aui-adg/5.8.9/js/aui.js',
      'https://aui-cdn.atlassian.com/aui-adg/5.8.9/js/aui-soy.js',
      'test/**/*.js',
      {pattern: 'fixtures/**', included: false, served: true},
      {pattern: 'dist/**', included: false, served: true}
    ],

    // list of files to exclude
    exclude: [
      'test/iframe/plugin/*-test.js',
      'test/iframe/plugin/*Test.js'
    ],

    //do not process my html files.
    preprocessors: {
      'test/**/*.js': ['browserify'],
      //'fixtures/!(*).html': ['html2js']
    },

    browserify: {
      debug: true,
      bundleDelay: 2000,
      //configure: function(bundle) {
      //  bundle._builtOnce = true; // fix issue in osx
      //},
      transform: ['babelify', envify({ENV: 'host'})],

    },

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'junit'],
    junitReporter: {
      outputFile: 'test/test-reports/karma-results.xml',
      useBrowserName: false,
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
