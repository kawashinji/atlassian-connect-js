import _ from '../underscore';
import EventDispatcher from '../dispatchers/event_dispatcher';

var callbacks = [];

function wrapCallback(callback, wrapper) {
  var wrappedCallback = function (data) {
    callback.apply(null, wrapper(data));
  };
  callbacks.push({wrappedCallback, callback});
  return wrappedCallback;
}

function findWrappedCallback(callback) {
  for (var i = 0; i < callbacks.length; i++) {
    var item = callbacks[i];
    if (item.callback === callback) {
      return callbacks.splice(i, 1)[0].wrappedCallback;
    }
  }
  return null;
}

export default {
  onIframeEstablished: (callback) => {
    EventDispatcher.register('after:iframe-bridge-established', wrapCallback(callback, function(data) {
      return {
        $el: data.$el,
        extension: _.pick(data.extension, ['id', 'addon_key', 'key', 'options', 'url'])
      };
    }));
  },
  onIframeUnload: (callback) => {
    EventDispatcher.register('after:iframe-unload', wrapCallback(callback, function(data) {
      return {
        $el: data.$el,
        extension: _.pick(data.extension, ['id', 'addon_key', 'key', 'options', 'url'])
      };
    }));
  },
  onEventDispatched: (callback) => {
    EventDispatcher.register('after:event-dispatch', wrapCallback(callback, function(data) {
      return [
        data.type,
        data.isPublicEvent,
        data.event,
        data.extension
      ];
    }));
  },
  offEventDispatched: (callback) => {
    var callbackFunc = findWrappedCallback(callback);
    if (callbackFunc) {
      EventDispatcher.unregister('after:event-dispatch', callbackFunc);
    }
  }
};