import EventDispatcher from 'dispatchers/event_dispatcher';
import IframeActions from 'actions/iframe_actions';
import $ from '../dollar';
import util from '../util';
import simpleXDM from 'simple-xdm/dist/host';

const CONTAINER_CLASSES = ["ap-container"];

class Iframe {
  constructor () {
    this._stateRegistry = {};
  }

  simpleXdmExtension(extension) {
    var $iframe,
      $container = this._renderContainer();

    var iframeAttributes = simpleXDM.create(extension, function(extension_id){
      extension.id = extension_id;
      EventDispatcher.dispatch("iframe-bridge-estabilshed", $.extend({
        $el: $container
      }, extension));
    });
    extension.id = iframeAttributes.id;
    $iframe = this._renderIframe(iframeAttributes);
    $container.append($iframe);
    IframeActions.notifyIframeCreated($container, extension.id, extension);
    return $container;
  }

  _renderContainer(attributes){
    var container = $("<div />").attr(attributes || {});
    container.addClass(CONTAINER_CLASSES.join(" "));
    return container;
  }

  _renderIframe(attributes){
    return $("<iframe />").attr(attributes || {});
  }
}

var IframeComponent = new Iframe();

export default IframeComponent;