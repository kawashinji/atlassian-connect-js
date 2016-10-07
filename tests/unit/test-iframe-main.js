var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/-test\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/src/js/iframe/plugin',

    paths: {
        'iframe/host/analytics': '../host/analytics',
        'iframe/_events': '../_events',
        'iframe/_uri': '../_uri',
        'iframe/_dispatch-custom-event': '../_dispatch-custom-event',
        'iframe/_create-iframe-form': '../_create-iframe-form',
        'iframe/_create-iframe': '../_create-iframe',
        '_events': '../_events',
        '_ui-params': '../_ui-params',
        '_uritemplate': '../_uritemplate',
        '_dispatch-custom-event': '../_dispatch-custom-event',
        '_create-iframe-form': '../_create-iframe-form',
        '_create-iframe': '../_create-iframe'
    },
    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: function(pluginTests){
        setTimeout(function(){
             window.__karma__.start(pluginTests);
        }, 1000);
    }
});

//tests will timeout after 5 seconds
window.QUnit.config.testTimeout = 5000;
