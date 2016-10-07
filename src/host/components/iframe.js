import EventDispatcher from '../dispatchers/event_dispatcher';
import IframeActions from '../actions/iframe_actions';
import $ from '../dollar';
import util from '../util';
import simpleXDM from 'simple-xdm/host';
import urlUtil from '../utils/url';
import JwtActions from '../actions/jwt_actions';
import iframeUtils from '../utils/iframe';

const CONTAINER_CLASSES = ['ap-container'];

class Iframe {

  constructor () {
    this._contentResolver = false;
    this.RENDER_BY_SUBMIT_FLAG = 'ap-render-by-submit';
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
    var iframeAttributes = simpleXDM.create(extension, () => {
      if(!extension.options){
        extension.options = {};
      }
      IframeActions.notifyBridgeEstablished(extension.$el, extension);
    }, () => {
      IframeActions.notifyUnloaded(extension.$el, extension);
    });
    extension.id = iframeAttributes.id;
    $.extend(iframeAttributes, iframeUtils.optionsToAttributes(extension.options));
    extension.$el = this.render(iframeAttributes, extension.options);
    return extension;
  }

  _appendExtension($container, extension){
    var existingFrame = $container.find('iframe');
    if(existingFrame.length > 0) {
      existingFrame.destroy();
    }
    $container.prepend(extension.$el);
    IframeActions.notifyIframeCreated(extension.$el, extension);
  }

  resolverResponse(data) {
    var simpleExtension = this._simpleXdmCreate(data.extension);
    this._appendExtension(data.$container, simpleExtension);
  }

  render(attributes, options = {}){
    var renderingMethod = (options.renderingMethod || 'GET').toUpperCase();

    var iframe = $(document.createElement('iframe')).addClass('ap-iframe');

    if (renderingMethod !== 'GET') {
      // The iframe name is a big JSON blob.
      // If we are rendering the iframe with other HTTP method,
      // then it means we will have a form submission to trigger the rendering.
      // In that case we assign a temporary name here to avoid the form targeting to the JSON blob.
      // We will change it back to the real name afterwards.
      attributes['data-iframe-name'] = attributes.name;
      attributes['data-iframe-form-id'] = attributes.id + '-form-id';
      attributes['name'] = attributes.id + '-iframe';

      // Clear the src attribute because the rendering will be triggered by the form submission.
      attributes['data-iframe-src'] = attributes.src;
      attributes['src'] = '';

      // Add a flag so ac/create knows to submit the form
      iframe.addClass(this.RENDER_BY_SUBMIT_FLAG);
    }

    return iframe.attr(attributes);
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

EventDispatcher.register('after:iframe-bridge-established', function(data) {
  data.$el[0].bridgeEstablished = true;
});

export default IframeComponent;