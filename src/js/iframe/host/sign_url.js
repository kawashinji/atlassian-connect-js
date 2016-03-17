(function(require, AJS, $){
  "use strict";
  require(['connect-host'], function (_AP) {

    _AP.extend(function () {
      return {
        internals: {
          signUrl: function (moduleKey, callback) {
            var promise = window._AP.contentResolver.resolveByParameters({
              key: this.addonKey,
              moduleKey: moduleKey,
              productContext: this.productContext,
              classifier: 'json'
            });

            promise
              .done(function(data) {
                callback(data);
              })
              .fail(function(xhr, status, ex) {
                console.error("Failed to resolve", xhr, status, ex);
              });
          }
        }
      };
    });
  });
})(require, AJS, AJS.$);