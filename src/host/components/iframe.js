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
  }

  setContentResolver(callback) {
    this._contentResolver = callback;
  }

  resize(width, height, context){
    var $el = util.getIframeByContext(context);
    width = util.stringToDimension(width);
    height = util.stringToDimension(height);
    $el.css({
      width: width,
      height: height
    });
    $el.trigger('resized', {width: width, height: height});
  }

  sizeToParent(context, hideFooter){
    if (context.extension.options.isFullPage) {
      var height;
      // This adds border between the iframe and the page footer as the connect addon has scrolling content and can't do this
      util.getIframeByExtensionId(context.extension_id).addClass('full-size-general-page');
      var $el = util.getIframeByExtensionId(context.extension_id);
      if(hideFooter) {
        $el.addClass('full-size-general-page-no-footer');
        $('#footer').css({display: 'none'});
        height = $(window).height() - $('#header > nav').outerHeight();
      } else {
        height = $(window).height() - $('#header > nav').outerHeight() - $('#footer').outerHeight() - 1; //1px comes from margin given by full-size-general-page
        $el.removeClass('full-size-general-page-no-footer');
        $('#footer').css({ display: 'block' });
      }
      this.resize('100%', height + 'px', context);
    } else {
      // This is only here to support integration testing
      // see com.atlassian.plugin.connect.test.pageobjects.RemotePage#isNotFullSize()
      util.getIframeByExtensionId(context.extension_id).addClass('full-size-general-page-fail');
    }
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
    extension.$el = this.render(iframeAttributes);
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
    return $('<iframe />').attr(attributes).addClass('ap-iframe');
  }
}

var IframeComponent = new Iframe();

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
  data.$el[0].bridgeEstablished = true;
});

export default IframeComponent;
