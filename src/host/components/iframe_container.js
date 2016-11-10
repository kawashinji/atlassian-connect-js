import $ from '../dollar';
import IframeComponent from './iframe';
import LoadingIndicatorComponent from './loading_indicator';
import EventDispatcher from '../dispatchers/event_dispatcher';
import IframeForm from '../../common/iframe_form';

const CONTAINER_CLASSES = ['ap-iframe-container'];

class IframeContainer {

  createExtension(extension, options) {
    var $container = this._renderContainer();
    if(!options || options.loadingIndicator !== false){
      $container.append(this._renderLoadingIndicator());
    }
    IframeComponent.simpleXdmExtension(extension, $container);
    return $container;
  }

  _renderContainer(attributes){
    var container = $('<div />').attr(attributes || {});
    container.addClass(CONTAINER_CLASSES.join(' '));
    return container;
  }

  _renderLoadingIndicator(){
    return LoadingIndicatorComponent.render();
  }

}

var IframeContainerComponent = new IframeContainer();

EventDispatcher.register('iframe-create', (data) => {
  data.extension.options = data.extension.options || {};
  var renderingMethod = data.extension.options.renderingMethod || 'GET';
  var id = 'embedded-' + data.extension.id;
  var $container = data.extension.$el.parents('.ap-iframe-container');
  $container.attr('id', id);

  IframeForm.createIfNecessary($container, renderingMethod);
});

export default IframeContainerComponent;