window.helper = {
  host: window.document,
  iframe: undefined,
  connect: {
    addon_key: 'my_addon_key',
    key: 'key',
    url: window.location.origin + '/base/spec/fixtures/iframe.html',
    options: {
      isFullPage: true,
      autoresize: true
      // width: '123px',
      // height: '222px'
      // contextPath: '/derp/'
    }, //options to send to the iframe
    data: { //data to stay on the host side
        pageType: 'general',
        productCtx: '{}',
        uid: 'someUserId'
    }
  },
  addon: {

  },
  dialog: {

  }
};

function injectExample(str){
  return jQuery.Deferred(function(defer){
    $(function(){
      setTimeout(function(){
        $('.ap-iframe-container iframe').contents().find('#placeholder').empty().append(str);
      }, 500);
      //not very scientific - but does give time for events that could happen in the tests
      setTimeout(function(){
        defer.resolve();
      }, 1000);
    });

  }).promise();
}

connectHost.registerContentResolver.resolveByExtension(function(data){
  return jQuery.Deferred(function(defer){
    setTimeout(function(){
      defer.resolve({
        url: helper.connect.url,
        addon_key: helper.connect.addon_key,
        key: helper.connect.key
      });
    }, 1);
  }).promise();
});
