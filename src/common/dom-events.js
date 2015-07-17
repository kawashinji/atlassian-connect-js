'use strict';
/**
 * Common methods for propagating DOM events between host/plugin iframes
 */

var w = window,
        log = (w.AJS && w.AJS.log) || (w.console && w.console.log) || (function () {});

const SUPPORTED_MOUSE_EVENTS = [
    'click'
];

const SUPPORTED_KEYBOARD_EVENTS = [
    'keydown',
    'keyup'
];

const ALLOWED_KEYCODES = [
    27 // ESCAPE
];

export default  {
    // Public API
    bindListeners,
    receiveEvent,

    // Visible for testing only
    constructLegacyModifierString,
    supportedMouseEvents: SUPPORTED_MOUSE_EVENTS,
    supportedKeyboardEvents: SUPPORTED_KEYBOARD_EVENTS,
    isAllowedKeyCode
};

/**
 * Bind listeners to the document to propagate events to the rpc endpoint
 *
 * @param {String} channelKey The unique key that identifies the rpc channel the listeners are bound to
 * @param {function} endpoint The rpc endpoint to send events to
 */
function bindListeners(channelKey, endpoint) {
    SUPPORTED_MOUSE_EVENTS.forEach(function (mouseEvent) {
        document.addEventListener(mouseEvent, function (e) {
            if (e['channelKey'] == channelKey) {
                return;
            }
            endpoint(channelKey, e.type, sanitiseMouseEvent(e))
        });
    });
    SUPPORTED_KEYBOARD_EVENTS.forEach(function (keyboardEvent) {
        document.addEventListener(keyboardEvent, function (e) {
            if (e['channelKey'] == channelKey) {
                return;
            }
            // We don't want to send all keystrokes to addon pages (that would be bad)
            if (isAllowedKeyCode(e.keyCode)) {
                endpoint(channelKey, e.type, sanitiseKeyboardEvent(e))
            }
        });
    });
}

/**
 * Receive a DOM event from the remote and dispatch to this page,
 * unless we have already seen it.
 *
 * @param {String} channelKey The channel identifier
 * @param {String} eventName The event received
 * @param {EventInit} eventData The data to attach to the event
 */
function receiveEvent(channelKey, eventName, eventData) {
    let event = createEvent(channelKey, eventName, eventData);
    if (!event) {
        return;
    }

    dispatchEvent(event);
}

/**
 * Return a sanitised data object that can be used to re-create
 * a synthetic click event
 *
 * @param {MouseEvent} mouseEvent The event to sanitise
 * @return {MouseEventInit} Sanitised data suitable for sending between iframes
 */
function sanitiseMouseEvent(mouseEvent) {
    return {
        bubbles: true,
        cancelable: true,
        button: mouseEvent.button,
        ctrlKey: mouseEvent.ctrlKey,
        shiftKey: mouseEvent.shiftKey,
        altKey: mouseEvent.altKey,
        metaKey: mouseEvent.metaKey
    }
}

/**
 * Return a sanitised data object that can be used to
 * re-create a synthetic keyboard event.
 *
 * @param {KeyboardEvent} keyboardEvent The event to sanitise
 * @return {KeyboardEventInit} Sanities data suitable for sending between iframes
 */
function sanitiseKeyboardEvent(keyboardEvent) {
    return {
        bubbles: true,
        cancelable: true,
        key: keyboardEvent.key,
        code: keyboardEvent.code,
        keyCode: keyboardEvent.keyCode,
        ctrlKey: keyboardEvent.ctrlKey,
        shiftKey: keyboardEvent.shiftKey,
        altKey: keyboardEvent.altKey,
        metaKey: keyboardEvent.metaKey,
        locale: null
    }
}

/**
 * Create a synthetic DOM event using the provided data
 *
 * The returned event will include a param <code>channelKey</code> that can be
 * used to identify which channel the event was received on.
 *
 * @param {String} channelKey The key for the channel the event was received on
 * @param {String} eventName The name of the event to create
 * @param {KeyboardEventInit|MouseEventInit} eventData The data to create the event with
 *
 * @returns {KeyboardEvent|MouseEvent} The constructed synthetic event
 */
function createEvent(channelKey, eventName, eventData) {
    eventData.view = window;

    let event;
    if (SUPPORTED_MOUSE_EVENTS.indexOf(eventName > -1)) {
        if (typeof window.Event == 'function') {
            event = new MouseEvent(eventName, eventData);
        }
        else {
            // To support older browsers
            // (e.g. IE - https://msdn.microsoft.com/en-us/library/dn905219%28v=vs.85%29.aspx)
            event = document.createEvent('MouseEvent');
            event.initMouseEvent(eventName,
                    eventData.bubbles, eventData.cancelable, eventData.view,
                    0, 0, 0, 0, 0,
                    eventData.ctrlKey, eventData.altKey, eventData.shiftKey,
                    eventData.metaKey, eventData.button, null);
        }
    }
    else if (SUPPORTED_KEYBOARD_EVENTS.indexOf(eventName) > -1) {
        if (typeof window.Event == 'function') {
            event = new KeyboardEvent(eventName, eventData);
        }
        else {
            // To support older browsers
            // (e.g. IE - https://msdn.microsoft.com/en-us/library/dn905219%28v=vs.85%29.aspx)
            event = document.createEvent('KeyboardEvent');
            event.initKeyboardEvent(eventName,
                    eventData.bubbles, eventData.cancelable, eventData.view,
                    eventData.key, 0, constructLegacyModifierString(eventData),
                    false, eventData.locale);
        }
    }
    else {
        log('Event ' + eventName + ' not supported');
    }

    if (event) {
        event['channelKey'] = channelKey;
    }
    return event;
}

/**
 * Dispatch the given event to the current document
 *
 * Includes some AUI-specific dispatch if AUI is detected to ensure dialogs work correctly etc.
 *
 * @param event The event to dispatch
 */
function dispatchEvent(event) {
    document.body.dispatchEvent(event);

    if (AJS && event.type == 'click') {
        // If AJS is present we should fire the event on dialog curtains
        // if they exist, to ensure AUI dialogs etc. are dismissed.
        var blanket = AJS.$('.aui-blanket');
        if (blanket.length > 0 && blanket[0]) {
            blanket[0].dispatchEvent(event);
        }
    }
}

/**
 * Construct the legacy DOM L3 key modifier string required for pre-L4 keyboard event initialisation
 * @see https://msdn.microsoft.com/en-us/library/ff975297%28v=vs.85%29.aspx
 *
 * @param {KeyboardEventInit} eventData The data to create the modifier string from
 * @returns {String} The modifier string (e.g. "Ctr,Shift")
 */
function constructLegacyModifierString(eventData) {
    let result = [];
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

/**
 * Determine if the provided keycode is allowed to be propagated between iframes
 *
 * @param {Number} keyCode The keycode to test
 *
 * @returns {boolean} Whether the provided keycode is allowed to be propagated between iframes
 */
function isAllowedKeyCode(keyCode) {
    return ALLOWED_KEYCODES.indexOf(keyCode) > -1;
}