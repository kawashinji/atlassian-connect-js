import EventDispatcher from '../dispatchers/event_dispatcher';
import Util from '../util';

export default {
  registerContentResolver: function(data) {
    EventDispatcher.dispatch('content-resolver-register-by-extension', data);
  },
  requestRefreshUrl: function(data){
    if(!data.resolver) {
      throw Error('ACJS: No content resolver supplied');
    }
    var promise = data.resolver.call(null, Util.extend({classifier: 'json'}, data.extension));
    promise.fail(function(promiseData, error) {
      EventDispatcher.dispatch('jwt-url-refreshed-failed', {
        extension: data.extension,
        $container: data.$container,
        errorText: error.text
      });
    });
    promise.done(function (promiseData) {
      var newExtensionConfiguration = {};
      if(typeof promiseData === 'object') {
        newExtensionConfiguration = promiseData;
      } else if(typeof promiseData === 'string') {
        try{
          newExtensionConfiguration = JSON.parse(promiseData);
        } catch(e){
          console.error('ACJS: invalid response from content resolver');
        }
      }
      data.extension.url = newExtensionConfiguration.url;
      Util.extend(data.extension.options, newExtensionConfiguration.options);
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
