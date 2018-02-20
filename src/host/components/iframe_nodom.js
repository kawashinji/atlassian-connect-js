import urlUtil from '../utils/url';
import JwtActions from '../actions/jwt_actions';

class IframeNoDOM {

  constructor () {
    this._contentResolver = false;
  }

  setContentResolver(callback) {
    this._contentResolver = callback;
  }

  applyContentResolver(extension) {
    return new Promise(function(resolve, reject) {
      if(!extension.url || (urlUtil.hasJwt(extension.url) && urlUtil.isJwtExpired(extension.url))){
        if(this._contentResolver){
          JwtActions.requestRefreshUrlNoDOM({
            extension: extension,
            resolver: this._contentResolver,
            resolve: resolve,
            reject: reject
          });
        } else {
          console.error('No URL or JWT is expired and no content resolver was specified');
          reject('Content resolver error');
        }
      } else {
        resolve(extension);
      }
    });
  }

  resolverResponse(data) {
    data.resolve(data.extension);
  }

  resolverFailResponse(data) {
    data.reject(data.errorText);
  }
}

var IframeNoDOMComponent = new IframeNoDOM();

EventDispatcher.register('content-resolver-register-by-extension', function(data){
  IframeNoDOMComponent.setContentResolver(data.callback);
});

EventDispatcher.register('jwt-url-refreshed-no-dom', function(data) {
  IframeNoDOMComponent.resolverResponse(data);
});
  
EventDispatcher.register('jwt-url-refreshed-failed-no-dom', function(data) {
  IframeNoDOMComponent.resolverFailResponse(data);
});
  
export default IframeNoDOMComponent;