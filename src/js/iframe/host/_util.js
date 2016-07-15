define("host/_util", function () {
    "use strict";

    return {
        escapeSelector: function( s ){
            if(!s){
                throw new Error("No selector to escape");
            }
            return s.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&");
        },
        addonToNs: function(addon_key, module_key) {
          if(addon_key.length === 0 || module_key.length === 0) {
            throw new Error("addon_key and module_key must be specified");
          }
          return addon_key + '__' + module_key;
        }
    };
});
