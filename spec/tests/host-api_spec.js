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

  it('dialog.create uses dialog module options', function(done){
    var extension = {
      addon_key: 'abc',
      key: 'abc123'
    };
    var dialogOptions = {
      height: '200px',
      title: 'overriden'
    };
    var dialogBeanOptions = {
      width: '123px',
      title: 'override me'
    };
    // mock dialogBean options being placed in the product
    window._AP = {
      dialogModules: {
        abc: {
          abc123: {
            options: dialogBeanOptions
          }
        }
      }
    };

    EventDispatcher.registerOnce('after:dialog-extension-open', (e) => {
      expect(e.extension).toEqual({
        addon_key: extension.addon_key,
        key: extension.key
      });
      expect(e.options).toEqual({
        height: dialogOptions.height,
        width: dialogBeanOptions.width,
        title: dialogOptions.title
      });
      done();
    });

    HostApi.dialog.create(extension, dialogOptions);
  });

});