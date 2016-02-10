var tests = [],
    paths = {
    // host side
    'aui-atlassian': '../../bower_components/aui/src/js/atlassian',
    '_ap': 'iframe/host/_ap',
    '_dollar': 'iframe/host/_dollar',
    '_uritemplate': 'iframe/_uritemplate',
    '_uri': 'iframe/_uri',
    'host/_status_helper': 'iframe/host/_status_helper',
    'host/_util': 'iframe/host/_util',
    '_rpc': 'iframe/host/_rpc',
    '_events': 'iframe/_events',
    'env': 'iframe/host/env',
    'resize': 'iframe/host/resize',
    'loading-indicator': 'iframe/host/loading-indicator',
    'cookie': 'cookie/cookie',
    'request': 'iframe/host/request',
    'host/content': 'iframe/host/content',
    'host/_addons': 'iframe/host/_addons',
    '_base64': 'iframe/_base64',
    '_jwt': 'iframe/_jwt',
    'host/jwt-keepalive': 'iframe/host/jwt-keepalive',
    '_xdm': 'iframe/_xdm',
    '_ui-params': 'iframe/_ui-params',
    'create': 'iframe/host/create',
    'ac/dialog': 'dialog/main',
    'ac/dialog/dialog-factory': 'dialog/dialog-factory',
    'ac/navigator': 'navigator/main',
    'ac/navigator-browser': 'navigator/navigator-browser',
    'connect-host': '../../dist/connect-host',
    'ac/request': 'iframe/host/request'
  };

for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/-test\.js$/.test(file)) {
      tests.push(file);
    } else {
      var str = file.replace(/\/base\/src\/js\//, '');
      str = str.substr(0,str.length -3);
      paths['ac/' + str] = str;
    }
  }
}



requirejs.config({
  // Karma serves files from '/base'
  baseUrl: '/base/src/js',

  paths: paths,

  shim: {
    /////////////////
    //  HOST SIDE  //
    /////////////////
    'aui-atlassian': {
      deps: [
        'jquery'
      ]
    },
    'jwt-keepalive': {
      deps: [
        '_ap',
        '_jwt'
      ]
    },
    '_jwt': {
      deps: [
        '_ap',
        '_base64'
      ]
    },
    '_dollar': {
      deps: [
        '_ap',
        'jquery',
        'aui-atlassian'
      ]
    },
    'host/_util': {
      deps: [
        '_ap',
        '_dollar'
      ]
    },
    'cookie': {
        deps: [
        '_ap',
        '_dollar',
        '_rpc'
        ]
    },
    'host/content': {
        deps: [
        '_ap',
        'jquery',
        'aui-atlassian',
        '_ui-params'
        ]
    },
    'history/history': {
        deps: [
        '_ap',
        '_dollar',
        '_uri'
        ]
    },
    '_base64': {
      deps: [
        '_ap',
        '_dollar'
      ]
    },
    'inline-dialog/simple': {
      deps: [
        '_ap',
        '_dollar',
        'host/content',
        'host/_status_helper',
        '_ui-params',
        'create'
      ]
    },
    'host/_status_helper': {
      deps: [
          '_ap',
          '_dollar'
      ]
    },
    'ac/dialog': {
      deps: [
        '_ap',
        '_dollar',
        '_ui-params',
        'host/_status_helper',
        'ac/dialog/button',
        'connect-host'
      ]
    },
    'ac/dialog/button': {
      deps: [
        '_ap',
        '_dollar'
      ]
    },
    'ac/dialog/dialog-factory': {
      deps: [
        '_ap',
        '_dollar',
        'ac/dialog'
      ]
    },
    'ac/navigator': {
      deps: [
        '_ap',
        'connect-host',
        'ac/navigator-browser',
        '_uritemplate'
      ]
    },
    'iframe/host/_rpc': {
      deps: [
        '_ap',
        '_dollar',
        'iframe/_xdm'
      ]
    },
    'messages/main': {
        deps: [
        '_ap',
        '_dollar'
        ]
    },
    'analytics/analytics': {
        deps: [
        '_ap',
        '_dollar'
        ]
    },
    '_ui-params': {
      deps: [
        '_ap',
        '_dollar',
        '_uri',
        '_base64'
      ]
    },
    '_events': {
      deps: [
        '_ap'
      ]
    },
    'iframe/_xdm': {
      deps: [
        '_ap',
        '_uri',
        '_events',
        'host/_util'
      ]
    },
    'iframe/host/analytics':{
        deps: [
        '_ap',
        '_dollar'
        ]
    },
    'iframe/host/main':{
        deps: [
        '_ap',
        '_dollar'
        ]
    },
    'iframe/host/request':{
        deps: [
        '_ap',
        '_dollar'
        ]
    }
  },

  // ask Require.js to load these files (all our tests)
  deps: tests,

  // start test run, once Require.js is done
  callback: function(hostTests){
    setTimeout(function(){
        window.__karma__.start(hostTests);
    }, 1000);
}
});

//tests will timeout after 5 seconds
window.QUnit.config.testTimeout = 5000;
