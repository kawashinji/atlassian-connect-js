import $ from '../dollar';
import IframeComponent from './iframe';
import IframeFormComponent from './iframe_form';
import LoadingIndicatorComponent from './loading_indicator';
import EventDispatcher from '../dispatchers/event_dispatcher';

const CONTAINER_CLASSES = ['ap-iframe-container'];

class IframeContainer {

  createExtension(extension, options) {
    var $container = this._renderContainer();
    if(!options || options.loadingIndicator !== false){
      $container.append(this._renderLoadingIndicator());
    }
    IframeComponent.simpleXdmExtension(extension, $container);
    IframeFormComponent.createExtension(extension, $container);
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
  var id = 'embedded-' + data.extension.id;
  data.extension.$el.parents('.ap-iframe-container').attr('id', id);
});

export default IframeContainerComponent;