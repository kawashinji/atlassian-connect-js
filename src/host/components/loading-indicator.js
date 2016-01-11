import EventDispatcher from '../event-dispatcher';
import LoadingIndicatorActions from '../actions/loading-indicator';
import $ from '../dollar';
import util from '../util';

const LOADING_INDICATOR_CLASS = 'ap-loading-indicator';

const LOADING_STATUSES = {
  loading: '<div class="small-spinner"></div>Loading add-on...',
  'load-timeout': '<div class="small-spinner"></div>Add-on is not responding. Wait or <a href="#" class="ap-btn-cancel">cancel</a>?',
  'load-error': 'Add-on failed to load.'
};

// const LOADING_TIMEOUT = 12000;
const LOADING_TIMEOUT = 12;

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
  }

  hide($iframeContainer, extensionId){
    clearTimeout(this._stateRegistry[extensionId]);
    delete this._stateRegistry[extensionId];
    this._loadingContainer($iframeContainer).hide();
  }

  cancelled($iframeContainer, extensionId){
    var status = $(LOADING_STATUSES['load-error']);
    this._loadingContainer($iframeContainer).empty().append(status);
  }
  
  timeout($iframeContainer, extensionId){
    var status = $(LOADING_STATUSES['load-timeout']);
    debugger;
    status.find("a.ap-btn-cancel").click(function () {
      debugger;
      LoadingIndicatorActions.cancelled($iframeContainer, extensionId);
    });
    this._loadingContainer($iframeContainer).empty().append(status);
    delete this._stateRegistry[extensionId];
  }
}

var LoadingComponent = new LoadingIndicator();

EventDispatcher.register('create-iframe', (data) => {
  LoadingComponent.show(data.$el, data.extension_id);
});
EventDispatcher.register('iframe-bridge-estabilshed', (data) => {
  LoadingComponent.hide(util.getIframeByExtensionId(data.extension_id), data.extension_id);
});
EventDispatcher.register('iframe-bridge-timeout', (data) => {
  LoadingComponent.timeout(data.$el, data.extension_id);
});
EventDispatcher.register('iframe-bridge-cancelled', (data) => {
  LoadingComponent.cancelled(data.$el, data.extension_id);
});

export default LoadingComponent;