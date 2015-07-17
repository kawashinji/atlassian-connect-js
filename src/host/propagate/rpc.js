import events from '../../common/dom-events.js';

/**
 * Acts as a broker to send DOM events to plugins. Events may originate in the host,
 * or be received from plugin panels.
 */
export default function () {
    'use strict';

    return {
        init: function (state, xdm) {
            if (state.uiParams.isGeneral) {
                events.bindListeners(xdm.channel, xdm.propagateToPlugin);
            }
        },
        internals: {
            propagateToHost: events.receiveEvent
        },
        stubs: ['propagateToPlugin']
    };
}