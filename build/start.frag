(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        //Allow using this built library as an AMD module
        //in another project. That other project will only
        //see this AMD call, not the internal modules in
        //the closure below.
        define("connect-host", [], factory);
    } else {
        //Browser globals case. Just assign the
        //result to a property on the global.

        if(!window._AP){
            window._AP = {};
        }

        AJS.$.extend(_AP, factory());
    }
}(this, function () {

// Bootstrap the uppermost level
AJS.$(function() {
  $('.ap-iframe-body-script').each(function() {
    var bootstrapData = $(this).html().replace(/^\s*\/\/<!\[CDATA\[/, '').replace(/\/\/]]>\s*$/, '').trim();
    var iFrameData = JSON.parse(bootstrapData);

    if(typeof AP === 'object') {
      //If we are a plugin frame
      AP.require('_create-inner-frame', function(createInnerFrame) {
        createInnerFrame(iFrameData);
      });
    } else {
      _AP.addonOriginMap = iFrameData.addonOriginMap || {};
      require(['connect-host', 'ac/cookie', 'ac/env', 'ac/inline-dialog', 'ac/dialog', 'ac/messages', 'ac/request', 'ac/history', 'ac/scrollPosition'], function(host){
        host.create(iFrameData);
      });
    }
  });
});
