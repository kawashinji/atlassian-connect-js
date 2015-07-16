import rpc from './rpc';
'use strict';

/**
 * Allows add-ons to receive whitelisted events from the parent page in the addon iframe.
 * @exports propagator
 */
export default rpc.extend(function (remote) {
    return {
        internals: {
            propagate: propagate
        }
    };
});

/**
 * Propagate an event to the plugin page
 *
 * @param eventName The event to propagate
 * @param eventData The data to attach to the event
 */
function propagate(eventName, eventData) {
    var event = recreateEvent(eventName, eventData);
    if (!event) {
        return;
    }

    document.body.dispatchEvent(event);

    if (AJS && eventName == 'click') {
        // If AJS is present we should fire the event on dialog curtains
        // if they exist, to ensure AUI dialogs etc. are dismissed.
        var blanket = AJS.$('.aui-blanket');
        if (blanket.length > 0 && blanket[0]) {
            blanket[0].dispatchEvent(event);
        }
    }
}

/**
 * Reconstruct the original host event using the provided data
 *
 * @param {String} eventName The name of the event to recreate
 * @param eventData The data to create the event with
 *
 * @returns {KeyboardEvent|MouseEvent} The re-constructed synthetic event
 */
function recreateEvent(eventName, eventData) {
    eventData.view = window;
    switch (eventName) {
        case 'click':
            if (typeof window.Event == 'function') {
                return new MouseEvent(eventName, eventData);
            }
            else {
                // To support older browsers
                // (e.g. IE - https://msdn.microsoft.com/en-us/library/dn905219%28v=vs.85%29.aspx)
                var event = document.createEvent('MouseEvent');
                event.initMouseEvent(eventName,
                        eventData.bubbles, eventData.cancelable, eventData.view,
                        0, 0, 0, 0, 0,
                        eventData.ctrlKey, eventData.altKey, eventData.shiftKey,
                        eventData.metaKey, eventData.button, null);
                return event;
            }
        case 'keyup':
        case 'keydown':
            if (typeof window.Event == 'function') {
                return new KeyboardEvent(eventName, eventData);
            }
            else {
                // To support older browsers
                // (e.g. IE - https://msdn.microsoft.com/en-us/library/dn905219%28v=vs.85%29.aspx)
                var event = document.createEvent('KeyboardEvent');
                event.initKeyboardEvent(eventName,
                        eventData.bubbles, eventData.cancelable, eventData.view,
                        eventData.key, 0, constructLegacyModifierString(eventData),
                        false, eventData.locale);
                return event;
            }
        default:
            log('Event ' + eventName + ' not supported');
    }
}

/**
 * Construct the legacy DOM L3 key modifier string required for pre-L4 keyboard event initialisation
 * @see https://msdn.microsoft.com/en-us/library/ff975297%28v=vs.85%29.aspx
 *
 * @param eventData
 * @returns {string} The modifier string (e.g. "Ctr,Shift")
 */
function constructLegacyModifierString(eventData) {
    var result = [];
    if (eventData.shiftKey) {
        result.push("Shift");
    }
    if (eventData.ctrlKey) {
        result.push("Ctrl");
    }
    if (eventData.metaKey) {
        result.push("Meta");
    }
    if (eventData.altKey) {
        result.push("Alt");
    }
    return result.join(',');
}

function log(msg) {
    if (AJS) {
        AJS.log(msg);
    }
    else if (window.console) {
        console.log(msg);
    }
}