import EventDispatcher from '../dispatchers/event_dispatcher';
import LoadingIndicatorActions from '../actions/loading_indicator_actions';
import $ from '../dollar';

const LOADING_INDICATOR_CLASS = 'ap-status-indicator';

const LOADING_STATUSES = {
  loading: '<div class="ap-loading"><div class="small-spinner"></div>Loading app...</div>',
  'load-timeout': '<div class="ap-load-timeout"><div class="small-spinner"></div>App is not responding. Wait or <a href="#" class="ap-btn-cancel">cancel</a>?</div>',
  'load-error': 'App failed to load.'
};

const LOADING_TIMEOUT = 12000;

class LoadingIndicator {
  constructor () {
    this._stateRegistry = {};
  }

  _loadingContainer($iframeContainer){
    return $iframeContainer.find('.' + LOADING_INDICATOR_CLASS);
  }

  render() {
    var container = document.createElement('div');
    container.classList.add(LOADING_INDICATOR_CLASS);
    container.innerHTML = LOADING_STATUSES.loading;
    var $container = $(container);
    this._startSpinner($container);
    return $container;
  }

  _startSpinner($container) {
    // TODO: AUI or spin.js broke something. This is bad but ironically matches v3's implementation.
    setTimeout(() => {
      var spinner = $container.find('.small-spinner');
      if (spinner.length && spinner.spin) {
        spinner.spin({lines: 12, length: 3, width: 2, radius: 3, trail: 60, speed: 1.5, zIndex: 1});
      }
    }, 10);
  }

  hide($iframeContainer, extensionId){
    clearTimeout(this._stateRegistry[extensionId]);
    delete this._stateRegistry[extensionId];
    this._loadingContainer($iframeContainer)[0].style.display = 'none';
  }

  cancelled($iframeContainer, extensionId){
    var status = LOADING_STATUSES['load-error'];
    this._loadingContainer($iframeContainer).empty().text(status);
  }

  _setupTimeout($container, extension){
    this._stateRegistry[extension.id] = setTimeout(() => {
      LoadingIndicatorActions.timeout($container, extension);
    }, LOADING_TIMEOUT);
  }

  timeout($iframeContainer, extensionId){
    var status = $(LOADING_STATUSES['load-timeout']);
    var container = this._loadingContainer($iframeContainer);
    container.empty().append(status);
    this._startSpinner(container);
    $('a.ap-btn-cancel', container).click(function () {
      LoadingIndicatorActions.cancelled($iframeContainer, extensionId);
    });
    delete this._stateRegistry[extensionId];
    return container;
  }

  // called when the iframe-unload event is invoked
  // when an iframe is being reloaded, or dom is destroyed / repainted.
  // these events are no longer accurate so cancel them.
  unloaded(extensionId) {
    clearTimeout(this._stateRegistry[extensionId]);
    delete this._stateRegistry[extensionId];
  }
}

var LoadingComponent = new LoadingIndicator();

EventDispatcher.register('iframe-create', (data) => {
  if(!data.extension.options.noDom) {
    LoadingComponent._setupTimeout(data.$el.parents('.ap-iframe-container'), data.extension);
  }
});

EventDispatcher.register('iframe-bridge-established', (data) => {
  if(!data.extension.options.noDom) {
    LoadingComponent.hide(data.$el.parents('.ap-iframe-container'), data.extension.id);
  }
});

EventDispatcher.register('iframe-bridge-timeout', (data) => {
  if(!data.extension.options.noDom) {
    LoadingComponent.timeout(data.$el, data.extension.id);
  }
});

EventDispatcher.register('iframe-bridge-cancelled', (data) => {
  if(!data.extension.options.noDom) {
    LoadingComponent.cancelled(data.$el, data.extension.id);
  }
});

EventDispatcher.register('before:iframe-unload', (data) => {
  LoadingComponent.unloaded(data.extension.id);
});

export default LoadingComponent;