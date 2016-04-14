import $ from '../dollar';
import IframeComponent from 'components/iframe';
import LoadingIndicatorComponent from 'components/loading_indicator';
import EventDispatcher from 'dispatchers/event_dispatcher';

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
  var id = 'embedded-' + data.extension.id;
  data.extension.$el.parents('.ap-iframe-container').attr('id', id);
    // DialogComponent.setIframeDimensions(data.extension.$el);
});

export default IframeContainerComponent;