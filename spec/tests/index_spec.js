import IndexActions from 'src/host/actions/index_actions';
import EventDispatcher from 'src/host/dispatchers/event_dispatcher';

describe('Host index', function() {

  it('onIframeEstablished binds', function() {
    var spy = jasmine.createSpy('spy');
    IndexActions.onIframeEstablished(spy);
    EventDispatcher.dispatch('after:iframe-bridge-established', {extension:{}});
    expect(spy).toHaveBeenCalled();
  });

  it('onIframeUnload binds', function() {
    var spy = jasmine.createSpy('spy');
    IndexActions.onIframeUnload(spy);
    EventDispatcher.dispatch('after:iframe-unload', {extension:{}});
    expect(spy).toHaveBeenCalled();
  });

  it('onEventDispatched binds', function(){
    var spy = jasmine.createSpy('spy');
    IndexActions.onEventDispatched(spy);
    EventDispatcher.dispatch('after:event-dispatch', {});
    expect(spy).toHaveBeenCalled();
  });

  it('offEventDispatched unbinds', function(){
    var spy = jasmine.createSpy('spy');
    IndexActions.onEventDispatched(spy);
    IndexActions.offEventDispatched(spy);
    EventDispatcher.dispatch('after:event-dispatch', {});
    expect(spy).not.toHaveBeenCalled();
  });

});