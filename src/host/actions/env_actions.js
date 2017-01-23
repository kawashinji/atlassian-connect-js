import EventDispatcher from '../dispatchers/event_dispatcher';
import util from '../util';
import IframeComponent from '../components/iframe';
import $ from '../dollar';

EventDispatcher.register('iframe-resize', function(data){
  IframeComponent.resize(data.width, data.height, data.$el);
});

EventDispatcher.register('iframe-size-to-parent', function(data){
  var height;
  var $el = util.getIframeByExtensionId(data.context.extension_id);
  if(data.hideFooter) {
    $el.addClass('full-size-general-page-no-footer');
    $('.ac-content-page #footer').css({display: 'none'});
    $('.ac-content-page').css({overflow: 'hidden'});
    height = $(document).height() - $('#header > nav').outerHeight();
  } else {
    height = $(document).height() - $('#header > nav').outerHeight() - $('#footer').outerHeight() - 1; //1px comes from margin given by full-size-general-page
    $el.removeClass('full-size-general-page-no-footer');
    $('.ac-content-page #footer').css({ display: 'block' });
  }

  EventDispatcher.dispatch('iframe-resize', {width: '100%', height: height + 'px', $el});
});

AJS.$(window).on('resize', function (e) {
  EventDispatcher.dispatch('host-window-resize', e);
});

export default {
  iframeResize: function(width, height, context){
    var $el;
    if(context.extension_id){
      $el = util.getIframeByExtensionId(context.extension_id);
    } else {
      $el = context;
    }
    console.log('iframeResize', width, height, context.extension_id, $el, context);
    EventDispatcher.dispatch('iframe-resize', {width, height, $el, extension: context.extension});
  },
  sizeToParent: function(context, hideFooter){
    EventDispatcher.dispatch('iframe-size-to-parent', {
      hideFooter: hideFooter,
      context: context
    });
  }
}