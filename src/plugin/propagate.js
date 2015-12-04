import rpc from './rpc';
import events from '../common/dom-events.js';

/**
 * Allows add-ons to receive whitelisted DOM events from the host page in the addon iframe.
 */
export default rpc.extend(function (remote) {
  'use strict';
  return {
    init: function () {
      events.bindListeners(remote.channel, remote.propagateToHost);
    },
    internals: {
      propagateToPlugin: events.receiveEvent
    },
    stubs: ['propagateToHost']
  };
});