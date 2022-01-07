/* eslint-env node */
const drool = require('drool');
const assert = require('assert');
const httpServer = require('http-server');
const { argv } = require('yargs');
const server = httpServer.createServer();
const driver = drool.start({
  chromeOptions: ['no-sandbox', 'headless']
});
const MAX_LEAK = 750000;
const port = argv.port ? parseInt(argv.port) : 8080;

server.listen(port);
drool.flow({
  repeatCount: 1000,
  setup: function() {
    driver.get(`http://localhost:${port}/`);
  },
  action: function() {
    driver.executeScript('loadAndRemoveAppIframe()');
  },
  assert: function(after, initial) {
    const leak = after.counts.jsHeapSizeUsed - initial.counts.jsHeapSizeUsed;
    console.log('initial.counts', initial.counts);
    console.log('after.counts', after.counts);
    assert.equal(initial.counts.nodes, after.counts.nodes, 'node count should match');
    assert(leak < MAX_LEAK, `leak (${leak}) should be < ${MAX_LEAK}`)
  },
  exit: function() {
    driver.quit();
    server.close();
  }
}, driver);
