import EventDispatcher from '../dispatchers/event_dispatcher';
import util from '../util';
import IframeComponent from '../components/iframe';

EventDispatcher.register('iframe-resize', function(data) {
  IframeComponent.resize(data.width, data.height, data.el);
});

EventDispatcher.register('iframe-size-to-parent', function(data) {
  var height;
  var el = document.getElementById(data.extensionId);
  var footer = document.getElementById('footer');
  var windowHeight = window.outerHeight;
  var headerHeight = document.querySelectorAll('#header > nav')[0].getBoundingClientRect().height;
  if (data.hideFooter) {
    el.classList.add('full-size-general-page-no-footer');
    footer.style.display = 'none';
    height = windowHeight - headerHeight;
  } else {
    var footerHeight = footer.getBoundingClientRect().height;
    height = windowHeight - headerHeight - footerHeight - 1; //1px comes from margin given by full-size-general-page
    el.classList.remove('full-size-general-page-no-footer');
    footer.style.display = 'block';
  }

  EventDispatcher.dispatch('iframe-resize', {
    width: '100%',
    height: height + 'px',
    el
  });
});

EventDispatcher.register('hide-footer', function(hideFooter) {
  if (hideFooter) {
    document.getElementById('footer').style.display = 'none';
  }
});

if(window.AJS && window.AJS.$){
  AJS.$(window).on('resize', function(e) {
    EventDispatcher.dispatch('host-window-resize', e);
  });
}
export default {
  iframeResize: function(width, height, context) {
    var el;
    if (context.extension_id) {
      el = document.getElementById(context.extension_id);
    } else {
      el = context;
    }

    EventDispatcher.dispatch('iframe-resize', { width, height, el, extension: context.extension });
  },
  sizeToParent: function(extensionId, hideFooter) {
    EventDispatcher.dispatch('iframe-size-to-parent', {
      hideFooter: hideFooter,
      extensionId: extensionId
    });
  },
  hideFooter: function(hideFooter) {
    EventDispatcher.dispatch('hide-footer', hideFooter);
  }
};
