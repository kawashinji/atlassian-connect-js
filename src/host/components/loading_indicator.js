import EventDispatcher from 'dispatchers/event_dispatcher';
import LoadingIndicatorActions from 'actions/loading_indicator_actions';
import $ from '../dollar';
import util from '../util';

const LOADING_INDICATOR_CLASS = 'ap-status-indicator';

const LOADING_STATUSES = {
  loading: '<div class="ap-loading"><div class="small-spinner"></div>Loading add-on...</div>',
  'load-timeout': '<div class="ap-load-timeout><div class="small-spinner"></div>Add-on is not responding. Wait or <a href="#" class="ap-btn-cancel">cancel</a>?</div>',
  'load-error': 'Add-on failed to load.'
};

const LOADING_TIMEOUT = 12000;

class LoadingIndicator {
  constructor () {
    this._stateRegistry = {};
  }

  _loadingContainer($iframeContainer){
    return $iframeContainer.find('.' + LOADING_INDICATOR_CLASS);
  }

  show($iframeContainer, extensionId) {
    this._stateRegistry[extensionId] = setTimeout(() => {
      LoadingIndicatorActions.timeout($iframeContainer, extensionId);
    }, LOADING_TIMEOUT);
    var container = this._loadingContainer($iframeContainer);
    if(!container.length) {
      container = $('<div />').addClass(LOADING_INDICATOR_CLASS);
      container.appendTo($iframeContainer);
    }
    container.append(LOADING_STATUSES.loading);
    var spinner = container.find('.small-spinner');
    if (spinner.length && spinner.spin) {
      spinner.spin({lines: 12, length: 3, width: 2, radius: 3, trail: 60, speed: 1.5, zIndex: 1});
    }
    return container;
  }

  hide($iframeContainer, extensionId){
    clearTimeout(this._stateRegistry[extensionId]);
    delete this._stateRegistry[extensionId];
    this._loadingContainer($iframeContainer).hide();
  }

  cancelled($iframeContainer, extensionId){
    var status = LOADING_STATUSES['load-error'];
    this._loadingContainer($iframeContainer).empty().text(status);
  }
  
  timeout($iframeContainer, extensionId){
    var status = $(LOADING_STATUSES['load-timeout']),
    container = this._loadingContainer($iframeContainer);
    container.empty().append(status);
    $("a.ap-btn-cancel", container).click(function () {
      LoadingIndicatorActions.cancelled($iframeContainer, extensionId);
    });
    delete this._stateRegistry[extensionId];
    return container;
  }
}

var LoadingComponent = new LoadingIndicator();

EventDispatcher.register('iframe-create', (data) => {
  LoadingComponent.show(data.$el, data.extension.id);
});
EventDispatcher.register('iframe-bridge-estabilshed', (data) => {
  LoadingComponent.hide(data.$el, data.id);
});
EventDispatcher.register('iframe-bridge-timeout', (data) => {
  LoadingComponent.timeout(data.$el, data.id);
});
EventDispatcher.register('iframe-bridge-cancelled', (data) => {
  LoadingComponent.cancelled(data.$el, data.id);
});

export default LoadingComponent;