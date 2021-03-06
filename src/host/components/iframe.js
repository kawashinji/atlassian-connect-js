import EventDispatcher from '../dispatchers/event_dispatcher';
import IframeActions from '../actions/iframe_actions';
import $ from '../dollar';
import util from '../util';
import simpleXDM from 'simple-xdm/host';
import urlUtil from '../utils/url';
import JwtActions from '../actions/jwt_actions';
import iframeUtils from '../utils/iframe';
import simpleXdmUtils from '../utils/simplexdm';

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

  simpleXdmExtension(extension, $container) {
    if(!extension.url || (urlUtil.hasJwt(extension.url) && urlUtil.isJwtExpired(extension.url))){
      if(this._contentResolver){
        JwtActions.requestRefreshUrl({
          extension: extension,
          resolver: this._contentResolver,
          $container: $container
        });
      } else {
        console.error('JWT is expired and no content resolver was specified');
      }
    } else {
      this._appendExtension($container, this._simpleXdmCreate(extension));
    }
  }

  _simpleXdmCreate(extension){
    var simpleXdmAttributes = simpleXdmUtils.createSimpleXdmExtension(extension);
    extension.id = simpleXdmAttributes.iframeAttributes.id;
    extension.$el = this.render(simpleXdmAttributes.iframeAttributes);
    return extension;
  }

  _appendExtension($container, extension){
    var existingFrame = $container.find('iframe');
    if(existingFrame.length > 0) {
      existingFrame.destroy();
    }
    if (extension.options.hideIframeUntilLoad) {
      extension.$el
        .css({visibility: 'hidden'})
        .load(() => {
          extension.$el
            .css({visibility: ''});
        });
    }
    $container.prepend(extension.$el);
    IframeActions.notifyIframeCreated(extension.$el, extension);
  }

  _appendExtensionError($container, text) {
    var $error = $('<div class="connect-resolve-error"></div>');
    var $additionalText = $('<p />').text(text);
    $error.append('<p class="error">Error: The content resolver threw the following error:</p>');
    $error.append($additionalText);
    $container.prepend($error);
  }

  resolverResponse(data) {
    var simpleExtension = this._simpleXdmCreate(data.extension);
    this._appendExtension(data.$container, simpleExtension);
  }

  resolverFailResponse(data) {
    this._appendExtensionError(data.$container, data.errorText);
  }

  render(attributes){
    attributes = attributes || {};
    attributes.referrerpolicy = 'no-referrer';
    return $('<iframe />').attr(attributes).addClass('ap-iframe');
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

EventDispatcher.register('jwt-url-refreshed-failed', function(data) {
  IframeComponent.resolverFailResponse(data);
});


EventDispatcher.register('after:iframe-bridge-established', function(data) {
  if(!data.extension.options.noDom){
    data.$el[0].bridgeEstablished = true;
  } else {
    data.extension.options.bridgeEstablished = true;
  }
});

export default IframeComponent;