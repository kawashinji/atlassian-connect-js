import EventDispatcher from '../dispatchers/event_dispatcher';
import _ from '../underscore';

export default {
  registerContentResolver: function(data) {
    EventDispatcher.dispatch('content-resolver-register-by-extension', data);
  },
  requestRefreshUrl: function(data){
    if(!data.resolver) {
      throw Error('ACJS: No content resolver supplied');
    }
    var promise = data.resolver.call(null, _.extend({classifier: 'json'}, data.extension));
    promise.done(function (promiseData) {
      var newExtensionConfiguration = {};
      if(_.isObject(promiseData)) {
        newExtensionConfiguration = promiseData;
      } else if(_.isString(promiseData)) {
        try{
          newExtensionConfiguration = JSON.parse(promiseData);
        } catch(e){
          console.error('ACJS: invalid response from content resolver');
        }
      }
      data.extension.url = newExtensionConfiguration.url;
      _.extend(data.extension.options, newExtensionConfiguration.options);
      EventDispatcher.dispatch('jwt-url-refreshed', {
        extension: data.extension,
        $container: data.$container,
        url: data.extension.url
      });
    });
    EventDispatcher.dispatch('jwt-url-refresh-request', {data});
  },

  setClockSkew: function(skew) {
    if(typeof skew === 'number') {
      EventDispatcher.dispatch('jwt-skew-set', {skew});
    } else {
      console.error('ACJS: invalid JWT clock skew set');
    }
  }

};
