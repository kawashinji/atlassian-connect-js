import EventDispatcher from 'dispatchers/event_dispatcher';
import IframeActions from 'actions/iframe_actions';
import $ from '../dollar';
import util from '../util';
import simpleXDM from 'simple-xdm/dist/host';
import urlUtil from 'utils/url';

const CONTAINER_CLASSES = ["ap-container"];

class Iframe {
  constructor () {
    this._stateRegistry = {};
  }

  simpleXdmExtension(extension) {
    var $iframe,
      iframeAttributes = simpleXDM.create(extension, function(extension_id){
        extension.id = extension_id;
        EventDispatcher.dispatch("iframe-bridge-estabilshed", $.extend({
          $el: $iframe
        }, extension));
      });
    extension.id = iframeAttributes.id;
    $iframe = this._renderIframe(iframeAttributes);
    // $container.append($iframe);
    // IframeActions.notifyIframeCreated($container, extension.id, extension);
    return $iframe;
  }

  _renderIframe(attributes){
    return $("<iframe />").attr(attributes || {});
  }
}

var IframeComponent = new Iframe();

export default IframeComponent;