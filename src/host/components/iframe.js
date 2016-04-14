import EventDispatcher from 'dispatchers/event_dispatcher';
import IframeActions from 'actions/iframe_actions';
import $ from '../dollar';
import util from '../util';
import simpleXDM from 'simple-xdm/dist/host';
import urlUtil from 'utils/url';
import JwtActions from 'actions/jwt_actions';
import iframeUtils from 'utils/iframe';

const CONTAINER_CLASSES = ['ap-container'];

class Iframe {

  constructor () {
    this._contentResolver = false;
  }

  setContentResolver(callback) {
    this._contentResolver = callback;
  }

  resize(width, height, $el){
    width = util.stringToDimension(width);
    height = util.stringToDimension(height);
    $el.css({
      width: width,
      height: height
    });
    $el.trigger('resized', {width: width, height: height});
  }

  simpleXdmExtension(extension) {
    var iframeAttributes = iframeUtils.optionsToAttributes(extension.options);
    extension.$el = this._renderIframe(iframeAttributes);

    if(!extension.url || (urlUtil.hasJwt(extension.url) && urlUtil.isJwtExpired(extension.url))){
      if(this._contentResolver){
        JwtActions.requestRefreshUrl({extension: extension, resolver: this._contentResolver});
      } else {
        console.error('JWT is expired and no content resolver was specified');
      }
    } else {
      this._simpleXdmCreate(extension);
    }
    IframeActions.notifyIframeCreated(extension.$el, extension);
    return extension;
  }

  _simpleXdmCreate(extension){
    var iframeAttributes = simpleXDM.create(extension, () => {
      IframeActions.notifyBridgeEstablished(extension.$el, extension);
    });
    extension.id = iframeAttributes.id;
    extension.$el.attr(iframeAttributes);
    return extension;
  }

  resolverResponse(data) {
    data.extension.url = data.url;
    return this._simpleXdmCreate(data.extension);
  }

  _renderIframe(attributes){
    return $('<iframe />').attr(attributes);
  }
}

var IframeComponent = new Iframe();

EventDispatcher.register('iframe-resize', function(data){
  IframeComponent.resize(data.width, data.height, data.$el);
});

EventDispatcher.register('content-resolver-register-by-extension', function(data){
  IframeComponent.setContentResolver(data.callback);
});

EventDispatcher.register('jwt-url-refreshed', function(data) {
  IframeComponent.resolverResponse(data);
});

export default IframeComponent;