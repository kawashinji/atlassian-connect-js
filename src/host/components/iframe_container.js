import $ from '../dollar';
import IframeComponent from './iframe';
import IframeFormComponent from './iframe_form';
import LoadingIndicatorComponent from './loading_indicator';
import EventDispatcher from '../dispatchers/event_dispatcher';
import IframeFormActions from '../actions/iframe_form_actions';

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
  var renderingMethod = data.extension.options.renderingMethod;
  var id = 'embedded-' + data.extension.id;
  var $container = data.extension.$el.parents('.ap-iframe-container');
  $container.attr('id', id);

  if(renderingMethod && renderingMethod.toUpperCase() === 'POST') {
    let $form = IframeFormComponent.render({
      url: data.extension.url,
      method: renderingMethod,
      target: data.$el.attr('name')
    });
    IframeFormActions.submit($form.attr('id'));
  }
});

export default IframeContainerComponent;