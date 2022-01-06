const { Server } = require('karma');
const { argv } = require('yargs');

function runKarma(options, karmaDone) {
  options = Object.assign(options, {
    configFile: process.cwd() + '/spec/config/karma.conf'
  }, options);
  var server = new Server(options, karmaDone);
  server.start();
}

const singleRun = !!argv.ci;

runKarma({
  action: 'run',
  singleRun
});