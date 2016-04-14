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

  it('will render', () =>{
    var loadingIndicator = LoadingIndicatorComponent.render();
    expect(loadingIndicator.length).toEqual(1);
    expect(loadingIndicator.find('.small-spinner').length).toBe(1);
  });

  it('will hide', () => {
    var loadingIndicator = LoadingIndicatorComponent.render();
    $container.append(loadingIndicator);
    expect(loadingIndicator.is(':visible')).toBe(true);
    LoadingIndicatorComponent.hide($container, extensionId);
    expect(loadingIndicator.is(':visible')).toBe(false);
  });

  it('will timeout', () => {
    var loadingIndicator = LoadingIndicatorComponent.render();
    $container.append(loadingIndicator);
    LoadingIndicatorComponent.timeout($container, extensionId);
    expect($container.find('a.ap-btn-cancel').length).toEqual(1);
  });

  it('will cancel', () => {
    var loadingIndicator = LoadingIndicatorComponent.render();
    $container.append(loadingIndicator);
    LoadingIndicatorComponent.cancelled($container, extensionId);
    expect($container.find('a.ap-btn-cancel').length).toEqual(0);
    expect($container.text().length > 1).toBe(true);
  });

});
