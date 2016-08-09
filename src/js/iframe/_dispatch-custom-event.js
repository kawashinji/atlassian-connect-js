( (typeof _AP !== "undefined") ? define : AP.define)("_dispatch-custom-event", [], function () {

    /**
     * Dispatches a custom event to the given target element
     * @param target {Object} The DOM node to which to dispatch the event to
     * @param eventName {String} The name of the event
     * @returns {Boolean} false if at least one of the event handlers which handled this event called Event.preventDefault(). Otherwise it returns true.
     */
     return function dispatchCustomEvent(target, eventName, data) {
        var event;

        if (window.CustomEvent && typeof window.CustomEvent === 'function') {
            event = new CustomEvent(eventName, {
                detail: data
            });
        } else {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent(eventName, true, true, data);
        }

        return target.dispatchEvent(event);
    }
});
