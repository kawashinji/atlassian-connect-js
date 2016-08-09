( (typeof _AP !== "undefined") ? define : AP.define)("_dispatch-custom-event", [], function () {

    /**
     * Dispatches a custom event to the given target element
     * @param target {Object} The DOM node to which to dispatch the event to
     * @param eventName {String} The name of the event
     * @returns {Boolean} false if at least one of the event handlers which handled this event called Event.preventDefault(). Otherwise it returns true.
     */
     return function dispatchCustomEvent(target, eventName, data) {
        var customEvent;

        if (window.CustomEvent && typeof window.CustomEvent === 'function') {
            customEvent = new CustomEvent(eventName, {
                detail: data
            });
        } else {
            customEvent = document.createEvent('CustomEvent');
            customEvent.initCustomEvent(eventName, true, true, data);
        }

        return target.dispatchEvent(customEvent);
    }
});
