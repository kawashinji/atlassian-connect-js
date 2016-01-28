import EventDispatcher from 'dispatchers/event_dispatcher';
import $ from '../dollar';
import urlUtil from 'utils/url';
import JwtActions from 'actions/jwt_actions';
import IframeActions from 'actions/iframe_actions';
import IframeComponent from 'components/iframe';

const CONTAINER_CLASSES = ['ap-container'];

class IframeContainer {
  constructor () {
    this._urlContainerRegistry = {};
    this._contentResolver = false;
  }

  setContentResolver(callback) {
    this._contentResolver = callback;
  }

  _insertIframe($container, extension) {
    var simpleExtension = IframeComponent.simpleXdmExtension(extension);
    $container.append(simpleExtension.$el);
    IframeActions.notifyIframeCreated(simpleExtension.$el, simpleExtension.extension);

  }

  createExtension(extension) {
    var $iframe;
    var $container = this._renderContainer();
    if(urlUtil.hasJwt(extension.url) && urlUtil.isJwtExpired(extension.url)){
      this._urlContainerRegistry[extension.id] = $container;
      JwtActions.requestRefreshUrl({extension, resolver: this._contentResolver});
    } else {
      this._insertIframe($container, extension);
    }

    return $container;
  }
  resolverResponse(data) {
    var extension = data.extension;
    var $container = this._urlContainerRegistry[extension.id];
    extension.url = data.url;
    this._insertIframe($container, extension);
    delete this._urlContainerRegistry[extension.id];
  }

  _renderContainer(attributes){
    var container = $('<div />').attr(attributes || {});
    container.addClass(CONTAINER_CLASSES.join(' '));
    return container;
  }

}

var IframeContainerComponent = new IframeContainer();
EventDispatcher.register('content-resolver-register-by-extension', function(data){
  IframeContainerComponent.setContentResolver(data.callback);
});

EventDispatcher.register('jwt-url-refreshed', function(data) {
  IframeContainerComponent.resolverResponse(data);
});

export default IframeContainerComponent;