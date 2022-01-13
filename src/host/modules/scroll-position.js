import util from '../util';
import $ from '../dollar';
import EventDispatcher from '../dispatchers/event_dispatcher';
import EventActions from '../actions/event_actions';


const TRIGGER_PERCENTAGE = 10; //% before scroll events are fired
let activeGeneralPageAddon;
let lastScrollEventTriggered; //top or bottom

EventDispatcher.register('iframe-bridge-established', function(data) {
  if(data.extension.options.isFullPage) {
    window.addEventListener('scroll', scrollEventHandler);
    activeGeneralPageAddon = data.extension.id;
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
  lastScrollEventTriggered = undefined;
}

function scrollEventHandler(){
  var documentHeight = document.documentElement.scrollHeight;
  var windowHeight = window.innerHeight;

  var boundary = documentHeight * (TRIGGER_PERCENTAGE/100);
  if(window.pageYOffset <= boundary) {
    triggerEvent('nearTop');
  } else if((windowHeight + window.pageYOffset + boundary) >= documentHeight) {
    triggerEvent('nearBottom');
  } else {
    lastScrollEventTriggered = undefined;
  }
}

function triggerEvent(type) {
  if(lastScrollEventTriggered === type) {
    return; // only once per scroll.
  }
  EventActions.broadcast('scroll.' + type, {id: activeGeneralPageAddon}, {});
  lastScrollEventTriggered = type;
}

/**
 * Enables apps to get and set the scroll position.
 * @exports Scroll-position
 */
export default {
  /**
   * Gets the scroll position relative to the browser viewport
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
  },
  /**
   * Sets the vertical scroll position relative to the iframe
   *
   * @param y {Number} vertical offset position
   * @param callback {Function} callback to pass the scroll position
   * @noDemo
   * @example
   * AP.scrollPosition.setVerticalPosition(30, function(obj) { console.log(obj); });
   */
  setVerticalPosition: function(y, callback) {
    callback = util.last(arguments);
    if (callback._context.extension.options && callback._context.extension.options.isFullPage) {
      var $el = util.getIframeByExtensionId(callback._context.extension_id);
      var offset = $el.offset();
      if(typeof y === 'number') {
        document.documentElement.scrollTop = offset.top + y;
      }
    }
  }
};