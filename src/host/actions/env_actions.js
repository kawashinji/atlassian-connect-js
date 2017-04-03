import EventDispatcher from '../dispatchers/event_dispatcher';
import util from '../util';
import IframeComponent from '../components/iframe';
import $ from '../dollar';

EventDispatcher.register('iframe-resize', function(data){
  let addonProvider = HostApi.getProvider('addon');
  if (addonProvider) {
    addonProvider.resize(data.width, data.height, data.$el, data.extensionId);
  } else {
    IframeComponent.resize(data.width, data.height, data.$el, data.extensionId);
  }
});

EventDispatcher.register('iframe-size-to-parent', function(data){
  console.log('env_actions.js: Received iframe-size-to-parent: ', data);
  var height;
  var $el = util.getIframeByExtensionId(data.extensionId);
  if(data.hideFooter) {
    $el.addClass('full-size-general-page-no-footer');
    $('#footer').css({display: 'none'});
    height = $(window).height() - $('#header > nav').outerHeight();
  } else {
    height = $(window).height() - $('#header > nav').outerHeight() - $('#footer').outerHeight() - 1; //1px comes from margin given by full-size-general-page
    $el.removeClass('full-size-general-page-no-footer');
    $('#footer').css({ display: 'block' });
  }

  EventDispatcher.dispatch('iframe-resize', {
    width: '100%',
    height: height + 'px',
    extensionId: data.extensionId,
    $el
  });
});

console.log('env_actions.js: Registering for resize event...');
AJS.$(window).on('resize', function (e) {
  console.log('env_actions.js: Received resize: ', e);
  EventDispatcher.dispatch('host-window-resize', e);
});

export default {
  iframeResize: function(width, height, context){
    console.log('env_actions.js: iframeResize called: ', context);
    var extensionId = context.extension_id;
    var $el;
    if(context.extension_id){
      $el = util.getIframeByExtensionId(extensionId);
    } else {
      $el = context;
    }

    EventDispatcher.dispatch('iframe-resize', {width, height, extensionId, $el, extension: context.extension});
  },
  sizeToParent: function(extensionId, hideFooter){
    console.log('env_actions.js: In sizeToParent...');
    EventDispatcher.dispatch('iframe-size-to-parent', {
      hideFooter: hideFooter,
      extensionId: extensionId
    });
  }
}