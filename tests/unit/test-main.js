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
  baseUrl: '/base/src',

  paths: {
    // dependencies
    'aui-soy': '//aui-cdn.atlassian.com/aui-adg/5.4.3/js/aui-soy',
    // host side
    'aui-atlassian': '../bower_components/aui/src/js/atlassian',
    'iframe/host/_util': '../src/js/iframe/host/_util',
    'iframe/host/_ap': '../src/js/iframe/host/_ap',
    'iframe/host/_status_helper': '../src/js/iframe/host/_status_helper',
    'iframe/host/_dollar': '../src/js/iframe/host/_dollar',
    'iframe/host/content': '../src/js/iframe/host/content',
    'iframe/host/_rpc': '../src/js/iframe/host/_rpc',
    'iframe/host/cookie': '../src/js/iframe/host/cookie',
    'analytics/analytics': '../src/js/analytics/analytics',
    'history/history': '../src/js/history/history',
    'dialog/main': '../src/js/dialog/main',
    'dialog/button': '../src/js/dialog/button',
    'dialog/dialog-factory': '../src/js/dialog/dialog-factory',
    'inline-dialog/main': '../src/js/inline-dialog/main',
    'inline-dialog/simple': '../src/js/inline-dialog/simple',
    'messages/main': '../src/js/messages/main',
    // shared
    'iframe/_amd': '../src/js/iframe/_amd',
    'iframe/_events': '../src/js/iframe/_events',
    'iframe/_xdm': '../src/js/iframe/_xdm',
    'iframe/_uri': '../src/js/iframe/_uri',
    'iframe/_base64': '../src/js/iframe/_base64',
    'iframe/_ui-params': '../src/js/iframe/_ui-params',
    'iframe/host/main': '../src/js/iframe/host/main'
  },

  shim: {
    /////////////////
    //  HOST SIDE  //
    /////////////////
    'aui-atlassian': {
      deps: [
        'jquery'
      ]
    },
    'iframe/host/_dollar': {
      deps: [
        'jquery',
        'aui-atlassian',
        'iframe/_amd'
      ]
    },
    'iframe/host/_util': {
      deps: [
        'iframe/host/_dollar',
        'iframe/_amd'
      ]
    },
    'iframe/host/cookie': {
        deps: [
        'iframe/host/_dollar',
        'iframe/host/_rpc'
        ]
    },
    'iframe/host/content': {
        deps: [
        'jquery',
        'aui-atlassian',
        'iframe/_amd',
        'iframe/_ui-params'
        ]
    },
    'history/history': {
        deps: [
        'iframe/host/_dollar',
        'iframe/_uri'
        ]
    },
    'iframe/_base64': {
      deps: [
        'iframe/host/_dollar',
        'iframe/_amd',
      ]
    },
    'inline-dialog/simple': {
      deps: [
        'iframe/host/_dollar',
        'iframe/host/content',
        'iframe/host/_status_helper',
        'iframe/_ui-params'
      ]
    },
    'iframe/host/_status_helper': {
      deps: [
          'iframe/host/_dollar'
      ]
    },
    'inline-dialog/main': {
      deps: [
        'iframe/host/_dollar',
        'iframe/host/content',
        'iframe/host/_status_helper'
      ]
    },
    'dialog/main': {
      deps: [
        'iframe/host/_dollar',
        'iframe/_ui-params',
        'iframe/host/_status_helper',
        'dialog/button',
        'aui-soy'
      ]
    },
    'dialog/button': {
      deps: [
      'iframe/host/_dollar'
      ]
    },
    'dialog/dialog-factory': {
      deps: [
      'iframe/host/_dollar',
      'dialog/main'
      ]
    },
    'iframe/host/_rpc': {
      deps: [
        'iframe/host/_dollar',
        'iframe/_xdm'
      ]
    },
    'messages/main': {
        deps: [
        'iframe/host/_dollar'
        ]
    },
    'analytics/analytics': {
        deps: [
        'iframe/host/_dollar'
        ]
    },
    ///////////////////
    //  SHARED SIDE  //
    ///////////////////
    'iframe/_amd': {
      deps: [
        'iframe/host/_ap'
      ]
    },
    'iframe/_events': {
      deps: [
        'iframe/_amd'
      ]
    },
    'iframe/_uri': {
      deps: [
      'iframe/_amd'
      ]
    },
    'iframe/_ui-params': {
      deps: [
        'iframe/host/_dollar',
        'iframe/_uri',
        'iframe/_base64'
      ]
    },
    'iframe/_xdm': {
      deps: [
        'iframe/_uri',
        'iframe/_events',
        'iframe/host/_util'
      ]
    },
    'iframe/host/analytics':{
        deps: [
        'iframe/host/_ap',
        'iframe/host/_dollar',
        'iframe/_amd'
        ]
    },
    'iframe/host/main':{
        deps: [
        'iframe/host/_ap',
        'iframe/host/_dollar',
        'iframe/_amd'
        ]
    }
  },

  // ask Require.js to load these files (all our tests)
  deps: tests,

  // start test run, once Require.js is done
  callback: window.__karma__.start
});

//tests will timeout after 5 seconds
window.QUnit.config.testTimeout = 5000;
