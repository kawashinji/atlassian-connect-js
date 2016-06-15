( (typeof _AP !== "undefined") ? define : AP.define)("_dispatch_custom_event", [], function () {
    /**
     * Dispatches a custom event to the given target element
     * @param target {Object} The DOM node to which to dispatch the event to
     * @param eventName {String} The name of the event
     * @returns {Boolean} false if at least one of the event handlers which handled this event called Event.preventDefault(). Otherwise it returns true.
     */
     return function dispatchCustomEvent(target, eventName) {
        var event;

        if (window.CustomEvent) {
            event = new CustomEvent(eventName);
        } else {
            event = document.createEvent(eventName);
            target.initCustomEvent(event, true, true, null);
        }

        return target.dispatchEvent(event);
    }
});
