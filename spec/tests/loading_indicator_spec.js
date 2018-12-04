import LoadingIndicatorComponent from 'src/host/components/loading_indicator';
import EventDispatcher from 'src/host/dispatchers/event_dispatcher';
import IframeActions from 'src/host/actions/iframe_actions';

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

  describe('loading timeout test', () => {
    var $timeoutLoadingIndicator;
    var $timeoutIframeContainer;
    var $timeoutLoadingIndicator;
    var timeoutExtension = {
      id: 'abc123-loading',
      addon_key: 'some-addon-key-loading',
      key: 'some-module-key-loading',
      $el: false,
      options: {}
    };

    beforeEach(() => {
      $timeoutIframeContainer = $('<div />').addClass('ap-iframe-container');
      $timeoutLoadingIndicator = LoadingIndicatorComponent.render();
      $timeoutIframeContainer.append($timeoutLoadingIndicator);
      timeoutExtension.$el = $('<iframe />');
      $timeoutIframeContainer.append(timeoutExtension.$el);
      jasmine.clock().install();
      $timeoutIframeContainer.appendTo('body');
    });

    afterEach(() => {
      jasmine.clock().uninstall();
      $timeoutIframeContainer.remove();
    });

    it('will trigger timeout if loaded too late', () => {
      var timeoutEventSpy = jasmine.createSpy('spy');
      EventDispatcher.registerOnce('iframe-bridge-timeout', timeoutEventSpy);
      console.log('timeout extension????', timeoutExtension, timeoutExtension.$el);
      EventDispatcher.dispatch('iframe-create', {
        extension: timeoutExtension,
        $el: timeoutExtension.$el
      });

      expect(timeoutEventSpy).not.toHaveBeenCalled();
      jasmine.clock().tick(12001);
      IframeActions.notifyBridgeEstablished(timeoutExtension.$el, timeoutExtension);
      // EventDispatcher.dispatch('iframe-bridge-established', {});
      expect(timeoutEventSpy).toHaveBeenCalled();
    });

    // it('will NOT trigger timeout if loaded within load timeout', () => {
    //   var timeoutEventSpy = jasmine.createSpy('spy');
    //   EventDispatcher.registerOnce('iframe-bridge-timeout', timeoutEventSpy);

    //   EventDispatcher.dispatch('iframe-create', {
    //     extension: timeoutExtension,
    //     $el: timeoutExtension.$el
    //   });

    //   expect(timeoutEventSpy).not.toHaveBeenCalled();
    //   jasmine.clock().tick(100);
    //   IframeActions.notifyBridgeEstablished(timeoutExtension.$el, timeoutExtension);
    //   jasmine.clock().tick(12001);
    //   expect(timeoutEventSpy).not.toHaveBeenCalled();
    // });


    // make another test using iframe-bridge-established to check for success case

  });

  it('will cancel', () => {
    var loadingIndicator = LoadingIndicatorComponent.render();
    $container.append(loadingIndicator);
    LoadingIndicatorComponent.cancelled($container, extensionId);
    expect($container.find('a.ap-btn-cancel').length).toEqual(0);
    expect($container.text().length > 1).toBe(true);
  });

});
