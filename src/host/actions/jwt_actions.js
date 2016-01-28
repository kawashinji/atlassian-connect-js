import EventDispatcher from 'dispatchers/event_dispatcher';
import _ from '../underscore';

module.exports = {
  registerContentResolver: function(data) {
    EventDispatcher.dispatch('content-resolver-register-by-extension', data);
  },
  requestRefreshUrl: function(data){
    if(!data.resolver) {
      throw Error('ACJS: No content resolver supplied');
    }
    var promise = data.resolver.call(null, _.extend({classifier: 'json'}, data.extension));
    promise.done(function (promiseData) {
      var values = {};
      if(_.isObject(promiseData)) {
        values = promiseData;
      } else if(_.isString(promiseData)) {
        try{
          values = JSON.parse(promiseData);
        } catch(e){
          console.error('ACJS: invalid response from content resolver');
        }
      }
      EventDispatcher.dispatch('jwt-url-refreshed', {extension: data.extension, url: values.url});
    });
    EventDispatcher.dispatch('jwt-url-refresh-request', {data});
  }

};
