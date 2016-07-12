module.exports = function () {
  return function (done) {
    var _ = require('lodash');
    var Server = require('karma').Server;

    function runKarma(options, karmaDone) {
      options = _.assign(options, {
        configFile: process.cwd() + '/spec/config/karma.conf'
      }, options);
      var server = new Server(options, karmaDone);
      server.start();
    }

    runKarma({
      action: 'run',
      singleRun: true
    }, function () {
      done();
    });
  };
};
