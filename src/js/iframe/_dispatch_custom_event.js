( (typeof _AP !== "undefined") ? define : AP.define)("_dispatch_custom_event", [], function () {
    /**
     *
     * @param target
     * @param eventName
     * @returns {*|boolean}
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
