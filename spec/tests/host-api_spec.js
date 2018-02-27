import HostApi from 'src/host/host-api';
import EventDispatcher from 'src/host/dispatchers/event_dispatcher';
import eventActions from 'src/host/actions/event_actions';
import simpleXDM from 'simple-xdm/host';

describe('Host API', function() {

  it('onIframeEstablished binds', function() {
    var spy = jasmine.createSpy('spy');
    HostApi.onIframeEstablished(spy);
    EventDispatcher.dispatch('after:iframe-bridge-established', {$el: AJS.$('<div />'), extension:{options:{}}});
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

  it('setJwtClockSkew sets the clockSkew', function(done){
    var skew = 12345;
    EventDispatcher.once('jwt-skew-set', (data) => {
      expect(data.skew).toEqual(skew);
      done();
    });
    HostApi.setJwtClockSkew(skew);
  });

  it('getContentResolver gets the content resolver', function(){
    var testContentResolver = function(params){};
    HostApi.registerContentResolver.resolveByExtension(testContentResolver);
    expect(HostApi.getContentResolver()).toEqual(testContentResolver);
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

  it('Registered click handler gets called with reference to iframe', () => {
    const target_spec = {
      addon_key: 'some-key',
      key: 'module-key'
    };
    const reg = {
      extension: target_spec,
      extension_id: `${target_spec.addon_key}__${target_spec.key}`
    };
    const iframe = document.createElement('iframe');
    const callback = jasmine.createSpy('callback');

    iframe.id = reg.extension_id;
    document.body.appendChild(iframe);
    HostApi.onFrameClick(callback);
    simpleXDM._xdm._handleAddonClick(null, reg);
    expect(callback).toHaveBeenCalled();
    expect(callback.calls.mostRecent().args[0]).toEqual(iframe);
    document.body.removeChild(iframe);
  });

  it('destroy removes the extension', () => {
    const spec = {
      addon_key: 'my-addon-key',
      key: 'somekey',
      url: 'http://www.example.com'
    };
    let iframe = HostApi.create(spec);
    let extensions = HostApi.getExtensions(spec);
    expect(extensions.length).toEqual(1);
    HostApi.destroy(extensions[0].extension_id);
    expect(HostApi.getExtensions(spec).length).toEqual(0);
  });
});