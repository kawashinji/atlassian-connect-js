(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        //Allow using this built library as an AMD module
        //in another project. That other project will only
        //see this AMD call, not the internal modules in
        //the closure below.
        define("connect-host", [], factory);
    } else {
        //Browser globals case. Just assign the
        //result to a property on the global.

        if(!window._AP){
            window._AP = {};
        }

        AJS.$.extend(_AP, factory());
    }
}(this, function () {
