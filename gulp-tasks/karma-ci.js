module.exports = function () {
  return function (done) {
    var _ = require('lodash');

    function runKarma(options, karmaDone) {
      options = _.assign(options, {
        configFile: process.cwd() + '/spec/config/karma.conf'
      }, options);
      require('karma').server.start(options, karmaDone);
    }

    runKarma({
      action: 'run',
      singleRun: true,
      browsers: ["PhantomJS"],
      reporters: ["junit", "dots"],
      plugins: [
        'karma-junit-reporter',
        'karma-jasmine',
        'karma-webpack',
        'karma-phantomjs-launcher'
      ]
    }, done);
  };
};