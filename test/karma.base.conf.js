// Karma configuration
// Generated on Wed Oct 16 2013 15:12:27 GMT+1100 (EST)

var envify = require('envify/custom');
var webpack = require('webpack');
var path = require('path');
var customLaunchers = require('../build/configs/saucelabs-launchers');
var saucelabs = process.env.SAUCE_LABS || false;

module.exports = function(config) {
  var karmaConfig = {
    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // frameworks to use
    frameworks: ['qunit', 'sinon'],

    // list of files / patterns to load in the browser
    files: [
      'https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.js',
      'https://aui-cdn.atlassian.com/aui-adg/5.8.9/js/aui.js',
      'https://aui-cdn.atlassian.com/aui-adg/5.8.9/js/aui-soy.js',
      {pattern: 'test/fixtures/**', included: false, served: true},
      {pattern: 'dist/**', included: false, served: true}
    ],

    //do not process my html files.
    preprocessors: {
      'test/**/*.js': ['webpack'],
      'src/**/*.js': ['webpack']
    },

    webpack: {
      cache: true,
      resolve: {
        alias: {
          'src': path.join(__dirname, '../src/')
        }
      },
      module: {
        loaders: [
        ]
      },
      plugins: [
      ]
    },

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'junit'],
    junitReporter: {
      outputFile: 'test/test-reports/karma-results.xml',
      useBrowserName: false,
      suite: ''
    },

    plugins: [
      require('karma-webpack'),
      'karma-qunit',
      'karma-sinon',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-safari-launcher',
      'karma-ie-launcher'
    ],
    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR,


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
    browsers: ['Chrome', 'Safari', 'Firefox', 'IE11 - Win7'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  };

  if(saucelabs) {
    karmaConfig.reporters.push('saucelabs');
    karmaConfig.plugins.push('karma-sauce-launcher');
    karmaConfig.captureTimeout = 120000;
    karmaConfig.singleRun = true;
    karmaConfig.sauceLabs = {
      testName: 'Connect JS unit tests'
    };
    karmaConfig.customLaunchers = customLaunchers;
    karmaConfig.browsers = Object.keys(customLaunchers);
    karmaConfig.concurrency = 5;
  }
  return karmaConfig;
};
