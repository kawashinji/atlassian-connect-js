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
        '_events': '../_events',
        '_ui-params': '../_ui-params'
    },
    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: function(x){ 
        setTimeout(function(){
             window.__karma__.start(x);
        }, 1000);
    }
});

//tests will timeout after 5 seconds
window.QUnit.config.testTimeout = 5000;
