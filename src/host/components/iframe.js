import EventDispatcher from 'dispatchers/event_dispatcher';
import IframeActions from 'actions/iframe_actions';
import $ from '../dollar';
import util from '../util';
import simpleXDM from 'simple-xdm/dist/host';
import urlUtil from 'utils/url';

const CONTAINER_CLASSES = ['ap-container'];
const DEFAULT_IFRAME_ATTRIBUTES = {width: '100%'};

class Iframe {
  constructor () {
    this._stateRegistry = {};
  }

  simpleXdmExtension(extension) {
    var $iframe;
    var iframeAttributes = simpleXDM.create(extension, function (extension_id) {
      extension.id = extension_id;
      EventDispatcher.dispatch('iframe-bridge-estabilshed', {
        $el: $iframe,
        extension
      });
    });
    extension.id = iframeAttributes.id;
    $iframe = this._renderIframe(iframeAttributes);
    return {$el: $iframe, extension};
  }

  _renderIframe(attributes){
    var attrs = $.extend({}, DEFAULT_IFRAME_ATTRIBUTES, attributes);
    return $('<iframe />').attr(attrs);
  }
}

var IframeComponent = new Iframe();

export default IframeComponent;