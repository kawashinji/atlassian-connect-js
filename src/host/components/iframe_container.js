import $ from '../dollar';
import IframeActions from 'actions/iframe_actions';
import IframeComponent from 'components/iframe';
import LoadingIndicatorComponent from 'components/loading_indicator';

const CONTAINER_CLASSES = ['ap-container'];

class IframeContainer {

  _createIframe(extension) {
    return IframeComponent.simpleXdmExtension(extension);
  }

  createExtension(extension, options) {
    var $container = this._renderContainer();
    $container.append(this._createIframe(extension).$el);
    if(!options || options.loadingIndicator !== false){
      $container.append(this._renderLoadingIndicator());
    }
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

export default IframeContainerComponent;