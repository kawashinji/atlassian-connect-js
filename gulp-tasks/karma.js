const { Server } = require('karma');

module.exports = function (singleRun = false) {
  return function (done) {

    function runKarma(options, karmaDone) {
      options = Object.assign(options, {
        configFile: process.cwd() + '/spec/config/karma.conf'
      }, options);
      var server = new Server(options, karmaDone);
      server.start();
    }

    runKarma({
      action: 'run',
      singleRun
    }, function (result) {
      done(singleRun ? result : undefined);
    });
  };
};