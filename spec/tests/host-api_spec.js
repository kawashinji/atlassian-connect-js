import HostApi from 'src/host/host-api';
import EventDispatcher from 'src/host/dispatchers/event_dispatcher';
import eventActions from 'src/host/actions/event_actions';

describe('Host API', function() {

  it('onIframeEstablished binds', function() {
    var spy = jasmine.createSpy('spy');
    HostApi.onIframeEstablished(spy);
    EventDispatcher.dispatch('after:iframe-bridge-established', {$el: AJS.$('<div />'), extension:{}});
    expect(spy).toHaveBeenCalled();
  });

  it('onIframeUnload binds', function() {
    var spy = jasmine.createSpy('spy');
    HostApi.onIframeUnload(spy);
    EventDispatcher.dispatch('after:iframe-unload', {extension:{}});
    expect(spy).toHaveBeenCalled();
  });

  it('onEventDispatched binds', function(){
    var spy = jasmine.createSpy('spy');
    HostApi.onPublicEventDispatched(spy);
    eventActions.broadcastPublic('a', {}, {
      addon_key: 'abc',
      key: '123'
    });
    expect(spy).toHaveBeenCalled();
    HostApi.offPublicEventDispatched(spy);
  });

  it('offEventDispatched unbinds', function(){
    var spy = jasmine.createSpy('anotherspy');
    HostApi.onPublicEventDispatched(spy);
    HostApi.offPublicEventDispatched(spy);
    eventActions.broadcastPublic('a', {}, {
      addon_key: 'abc',
      key: '123'
    });
    expect(spy).not.toHaveBeenCalled();
  });

});