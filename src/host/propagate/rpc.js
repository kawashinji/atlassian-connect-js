/**
 * Attaches listeners to the host document and propagates whitelisted
 * DOM events to addon webpanels.
 */
export default function () {
    'use strict';

    var SUPPORTED_MOUSE_EVENTS = [
        'click'
    ];

    var SUPPORTED_KEYBOARD_EVENTS = [
        'keydown',
        'keyup'
    ];

    var ALLOWED_KEYCODES = [
        AJS.keyCode.ESCAPE
    ];

    return {
        init: function (state, xdm) {
            if (state.uiParams.isGeneral) {
                bindListeners(xdm.propagate);
            }
        },
        stubs: ['propagate']
    };

    /**
     * Bind listeners to the document to propagate events to the rpc endpoint
     *
     * @param {function} endpoint The rpc endpoint to send events to
     */
    function bindListeners(endpoint) {
        for (var mouseEvent of SUPPORTED_MOUSE_EVENTS) {
            document.addEventListener(mouseEvent, function (e) {
                sendEvent(e.type, sanitiseMouseEvent(e), endpoint);
            })
        }
        for (var keyboardEvent of SUPPORTED_KEYBOARD_EVENTS) {
            document.addEventListener(keyboardEvent, function (e) {
                // We don't want to send all keystrokes to addon pages (that would be bad)
                if (ALLOWED_KEYCODES.indexOf(e.keyCode) > -1) {
                    sendEvent(e.type, sanitiseKeyboardEvent(e), endpoint);
                }
            });
        }
    }

    /**
     * Send the provided event across the provided XDM bridge
     *
     * @param {String} name The name of the event to propagate
     * @param {EventInit} data The (sanitised) event data to send
     * @param {function} propagate The rpc bridge to send to
     */
    function sendEvent(name, data, propagate) {
        propagate(name, data);
    }

    /**
     * Return a sanitised data object that can be used to re-create
     * a click event
     *
     * @param {MouseEvent} mouseEvent The event to sanitise
     * @return {MouseEventInit} Sanitised data suitable for sending to client iframes
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
     * re-create a keyboard event.
     *
     * @param {KeyboardEvent} keyboardEvent The event to sanitise
     * @return {KeyboardEventInit} Sanities data suitable for sending to client iframes
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
}
