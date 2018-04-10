import util from '../util';
import $ from '../dollar';
import EventDispatcher from '../dispatchers/event_dispatcher';
import EventActions from '../actions/event_actions';

const TRIGGER_PERCENTAGE = 10; //% before scroll events are fired
let activeGeneralPageAddon;

EventDispatcher.register('iframe-bridge-established', function(extension) {
  if(extension.options.isFullPage) {
    window.addEventListener('scroll', scrollEventHandler);
    activeGeneralPageAddon = extension.extension_id;
  }
});

EventDispatcher.register('iframe-destroyed', function(extension) {
  removeScrollEvent();
});

EventDispatcher.register('iframe-unload', function(extension) {
  removeScrollEvent();
});

function removeScrollEvent(){
  window.removeEventListener('scroll', scrollEventHandler);
  activeGeneralPageAddon = undefined;
}

function scrollEventHandler(){
  var documentHeight = document.documentElement.scrollHeight;
  var windowHeight = window.innerHeight;

  var boundary = documentHeight * (TRIGGER_PERCENTAGE/100);
  if(window.scrollY <= boundary) {
    triggerEvent('nearTop');
  }
  if((windowHeight + window.scrollY + boundary) >= documentHeight) {
    triggerEvent('nearBottom');
  }
}

function triggerEvent(type) {
  EventActions.broadcast('scroll.' + type, {extension_id: activeGeneralPageAddon}, {});
}

export default {
  /**
   * Get's the scroll position relative to the browser viewport
   *
   * @param callback {Function} callback to pass the scroll position
   * @noDemo
   * @example
   * AP.scrollPosition.getPosition(function(obj) { console.log(obj); });
   */
  getPosition: function (callback) {
    callback = util.last(arguments);
    // scrollPosition.getPosition is only available for general-pages
    if (callback._context.extension.options.isFullPage) {
      var $el = util.getIframeByExtensionId(callback._context.extension_id);
      var offset = $el.offset();
      var $window = $(window);

      callback({
        scrollY: $window.scrollTop() - offset.top,
        scrollX: $window.scrollLeft() - offset.left,
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
  }
};
