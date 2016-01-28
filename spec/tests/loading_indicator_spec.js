import LoadingIndicatorComponent from 'src/host/components/loading_indicator';
import EventDispatcher from 'src/host/dispatchers/event_dispatcher';


describe('Loading indicator component', () => {
  var loadingIndicator;
  var $container;
  var extensionId = 'sd32ndiu2idni';

  beforeEach(() => {
    $container = $('<div />').addClass('loading-indicator-container');
    $container.appendTo('body');
  });

  afterEach(() => {
    $container.remove();
  });

  it('will show', () =>{
    var loadingContainer = LoadingIndicatorComponent.show($container, extensionId);
    expect(loadingContainer.length).toEqual(1);
    expect(loadingContainer.find('.small-spinner').length).toBe(1);
    expect($container.find('.ap-status-indicator').length).toBe(1);
  });

  it('will hide', () => {
    var loadingContainer = LoadingIndicatorComponent.show($container, extensionId);
    expect(loadingContainer.is(':visible')).toBe(true);
    LoadingIndicatorComponent.hide($container, extensionId);
    expect(loadingContainer.is(':visible')).toBe(false);
  });

  it('will timeout', () => {
    var loadingContainer = LoadingIndicatorComponent.show($container, extensionId);
    LoadingIndicatorComponent.timeout($container, extensionId);
    expect($container.find('a.ap-btn-cancel').length).toEqual(1);
  });

  it('will cancel', () => {
    var loadingContainer = LoadingIndicatorComponent.show($container, extensionId);
    LoadingIndicatorComponent.cancelled($container, extensionId);
    expect($container.find('a.ap-btn-cancel').length).toEqual(0);
    expect($container.text().length > 1).toBe(true);
  });

});
