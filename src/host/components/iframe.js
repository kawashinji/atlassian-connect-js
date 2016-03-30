import EventDispatcher from 'dispatchers/event_dispatcher';
import IframeActions from 'actions/iframe_actions';
import $ from '../dollar';
import util from '../util';
import simpleXDM from 'simple-xdm/dist/host';
import urlUtil from 'utils/url';

const CONTAINER_CLASSES = ['ap-container'];

class Iframe {

  resize(width, height, $el){
    width = util.stringToDimension(width);
    height = util.stringToDimension(height);
    $el.css({
      width: width,
      height: height
    });
    $el.trigger('resized', {width: width, height: height});
  }

  _bridgeEstablishedCallback($iframe, extension) {
    return function (){
      EventDispatcher.dispatch('iframe-bridge-estabilshed', {
        $el: $iframe,
        extension
      });
    };
  }

  simpleXdmExtension(extension) {
    var $iframe;
    var iframeAttributes = simpleXDM.create(extension, this._bridgeEstablishedCallback($iframe, extension));
    extension.id = iframeAttributes.id;
    $iframe = this._renderIframe(iframeAttributes);
    return {$el: $iframe, extension};
  }

  _renderIframe(attributes){
    return $('<iframe />').attr(attributes);
  }
}

var IframeComponent = new Iframe();

EventDispatcher.register('iframe-resize', function(data){
  IframeComponent.resize(data.width, data.height, data.$el);
});

export default IframeComponent;