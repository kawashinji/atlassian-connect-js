import EventDispatcher from '../dispatchers/event_dispatcher';
import util from '../util';
import IframeComponent from '../components/iframe';
import $ from '../dollar';
import HostApi from '../host-api';

EventDispatcher.register('iframe-resize', function(data){
  let addonProvider = HostApi.getProvider('addon');
  if (addonProvider) {
    addonProvider.resize(data.width, data.height, data.extension.extension_id);
  } else {
    IframeComponent.resize(data.width, data.height, data.$el);
  }
});

EventDispatcher.register('iframe-size-to-parent', function(data){
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

AJS.$(window).on('resize', function (e) {
  EventDispatcher.dispatch('host-window-resize', e);
});

export default {
  iframeResize: function(width, height, context){
    var extensionId = context.extension_id;
    var $el;
    if(extensionId){
      $el = util.getIframeByExtensionId(extensionId);
    } else {
      $el = context;
    }

    EventDispatcher.dispatch('iframe-resize', {width, height, $el, extension: context.extension});
  },
  sizeToParent: function(extensionId, hideFooter){
    EventDispatcher.dispatch('iframe-size-to-parent', {
      hideFooter: hideFooter,
      extensionId: extensionId
    });
  }
}
