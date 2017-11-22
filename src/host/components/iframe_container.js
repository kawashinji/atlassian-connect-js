import $ from '../dollar';
import IframeComponent from './iframe';
import LoadingIndicatorComponent from './loading_indicator';
import EventDispatcher from '../dispatchers/event_dispatcher';
import util from '../util';

const CONTAINER_CLASS = 'ap-iframe-container';

class IframeContainer {

  createExtension(extension, options) {
    var container = this._renderContainer();
    if(!options || options.loadingIndicator !== false){
      container.appendChild(this._renderLoadingIndicator());
    }
    IframeComponent.simpleXdmExtension(extension, container);
    return container;
  }

  _renderContainer(attributes){
    var container = util.extend(document.createElement('div'), attributes || {})
    container.classList.add(CONTAINER_CLASS);
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