// Karma configuration
// Generated on Wed Oct 16 2013 15:12:27 GMT+1100 (EST)

var envify = require('envify/custom');
var webpack = require('webpack');
var path = require('path');
var customLaunchers = require('../../build/configs/saucelabs-launchers');
var saucelabs = process.env.SAUCE_LABS || false;
var coverage = process.env.COVERAGE || false;

module.exports = function(config) {
  var karmaConfig = {
    // base path, that will be used to resolve files and exclude
    basePath: '../../',

    // frameworks to use
    //frameworks: ['browserify', 'qunit', 'sinon'],
    // list of files / patterns to load in the browser
    files: [
      'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js',
      'https://aui-cdn.atlassian.com/aui-adg/5.9.17/js/aui.js',
      'https://aui-cdn.atlassian.com/aui-adg/5.9.17/css/aui.min.css',
      'https://cdn.rawgit.com/requirejs/almond/0.3.1/almond.js',
      'https://aui-cdn.atlassian.com/aui-adg/5.9.17/js/aui-experimental.js',
      {pattern: 'src/css/host/**', included: true, served: true}
      // {pattern: 'fixtures/**', included: false, served: true},
      // {pattern: 'dist/**', included: false, served: true}
    ],

    //do not process my html files.
    preprocessors: {
      'spec/tests/**/*.js': ['webpack'],
      'src/**/*.js': ['webpack']
    },

    webpack: {
      cache: true,
      resolve: {
        alias: {
          'src': path.join(__dirname, '../../src/'),
          'fixtures': path.join(__dirname, '../fixtures/'),
        }
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel',
            query: {
              cacheDirectory: false,
              presets: [
                ['env', {
                  'targets': {
                    'browsers': [
                      'last 1 Chrome versions',
                      'last 1 Firefox versions',
                      'last 1 Safari versions',
                      'Explorer 11',
                      'last 1 Edge versions'
                    ]
                  },
                  'useBuiltIns': true
                }],
                'stage-2'
              ]
            }
          }
        ],
        postLoaders: [
        ]
      },
      plugins: [
      ],
    },

    // test results reporter to use
    // possible values: 'jasmine-diff', 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['jasmine-diff', 'progress', 'dots'],
    junitReporter: {
      outputFile: 'test/test-reports/karma-results.xml',
      useBrowserName: false,
      suite: ''
    },
    coverageReporter: {
      reporters: [
      ]
    },
    jasmineDiffReporter: {
      color: {
        expectedBg: 'bgRed',
        expectedWhitespaceBg: 'bgRed',
        expectedFg: 'white',
        actualBg: 'bgGreen',
        actualWhitespaceBg: 'bgGreen',
        actualFg: 'white',
        warningBg: 'bgYellow',
        warningWhitespaceBg: 'bgYellow',
        warningFg: 'white',
        defaultBg: '',
        defaultFg: ''
      },
      pretty: true,
      multiline: true,
      verbose: true,
      legacy: false,
      matchers: {}
    },

    plugins: [
      'karma-jasmine',
      'karma-webpack',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-nyan-reporter',
      'karma-jasmine-diff-reporter'
    ],
    frameworks: ['jasmine'],

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    // logLevel: config.LOG_ERROR,
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
    // browsers: ['Chrome', 'Safari', 'Firefox', 'IE11 - Win7'],
    browsers: ['Chrome', 'Firefox'],


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
      testName: 'Connect JS unit tests',
      connectOptions : {
        verbose: true
      }
    };
    karmaConfig.customLaunchers = customLaunchers;
    karmaConfig.browsers = Object.keys(customLaunchers);
    karmaConfig.concurrency = 5;
  }

  if(coverage === 'true') {
    karmaConfig.webpack.module.postLoaders.push(
      {
        test: /\/src\/host\/.*?\.js$/,
        loader: 'istanbul-instrumenter'
      }
    );
    karmaConfig['webpackMiddleware'] = {
      noInfo: true
    };
    karmaConfig.reporters.push('coverage');
    karmaConfig.plugins.push('karma-coverage');
    karmaConfig.coverageReporter.reporters.push({type: 'html', dir: 'coverage/', subdir: '.'});
    karmaConfig.coverageReporter.reporters.push({type: 'json', dir: 'coverage/', subdir: '.'});
  }

  return karmaConfig;
};

