import EventDispatcher from 'dispatchers/event_dispatcher';
import util from '../util';

module.exports = {
  notifyIframeCreated: function($el, extension_id, extension) {
    EventDispatcher.dispatch('iframe-create', {$el, extension_id, extension});
  }
};