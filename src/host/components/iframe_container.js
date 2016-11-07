import $ from '../dollar';
import IframeComponent from './iframe';
import IframeFormComponent from './iframe_form';
import LoadingIndicatorComponent from './loading_indicator';
import EventDispatcher from '../dispatchers/event_dispatcher';
import IframeContainerActions from '../actions/iframe_container_actions';

const CONTAINER_CLASSES = ['ap-iframe-container'];

class IframeContainer {

  createExtension(extension, options) {
    var $addonContainer = $(document.getElementById(extension.containerId));
    var $container = this._renderContainer();
    if(!options || options.loadingIndicator !== false){
      $container.append(this._renderLoadingIndicator());
    }
    IframeComponent.simpleXdmExtension(extension, $container);
    this._onceContainerAppended(extension, $addonContainer, $container);
    return $container;
  }

  _onceContainerAppended(extension, $addonContainer, $container) {
    if ($addonContainer.length === 0) {
      // If the parent of the container we are creating doesn't exist.
      // Then we are in unit test and the container will never be appended to the DOM.
      return;
    }

    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(mutation => {
        if (mutation && mutation.addedNodes[0] === $container[0]) {
          IframeContainerActions.notifyAppended($container, extension);
          observer.disconnect();
        }
      });
    });
    observer.observe($addonContainer[0], {childList: true});
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

  if(renderingMethod.toUpperCase() !== 'GET') {
    let $iframe = data.$el;
    let $form = IframeFormComponent.render({
      url: data.extension.url,
      method: renderingMethod,
      target: $iframe.attr('name')
    });
    $container.prepend($form);

    // Set iframe source to empty to avoid loading the page
    $iframe.attr('src', '');
  }
});

export default IframeContainerComponent;