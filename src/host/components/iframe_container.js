import $ from '../dollar';
import IframeComponent from './iframe';
import IframeFormComponent from './iframe_form';
import LoadingIndicatorComponent from './loading_indicator';
import EventDispatcher from '../dispatchers/event_dispatcher';
import IframeContainerActions from '../actions/iframe_container_actions';

const CONTAINER_CLASSES = ['ap-iframe-container'];

class IframeContainer {

  createExtension(extension, options) {
    var $container = this._renderContainer();
    if(!options || options.loadingIndicator !== false){
      $container.append(this._renderLoadingIndicator());
    }
    IframeComponent.simpleXdmExtension(extension, $container);
    this._onceContainerAppended(extension, $container);
    return $container;
  }

  _onceContainerAppended(extension, $container) {
    var checkHasParent = function() {
      setTimeout(function() {
        if ($container.parent().length) {
          IframeContainerActions.notifyAppended($container, extension);
        } else {
          checkHasParent();
        }
      }, 50);
    };

    checkHasParent();
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