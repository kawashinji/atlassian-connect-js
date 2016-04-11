import IframeComponent from 'src/host/components/iframe';
import EventDispatcher from 'src/host/dispatchers/event_dispatcher';
import simpleXDM from 'simple-xdm/dist/host';
import urlUtil from 'src/host/utils/url';

describe('Iframe component', () => {
  function randomWholeNumber(max){
    return Math.floor(Math.random() * max);
  }

  describe('resize', () =>{
    it('sets dimensions', () => {
      var $mock = $('<div />');
      var width = randomWholeNumber(1000) + 'px';
      var height = randomWholeNumber(1000) + 'px';
      IframeComponent.resize(width, height, $mock);
      expect($mock.css('height')).toEqual(height);
      expect($mock.css('width')).toEqual(width);
    });

    it('sets dimensions by %', () => {
      var $mock = $('<div />');
      var width = randomWholeNumber(99) + '%';
      var height = randomWholeNumber(99) + '%';
      IframeComponent.resize(width, height, $mock);
      expect($mock.css('height')).toEqual(height);
      expect($mock.css('width')).toEqual(width);
    });

    it('triggers a resized dom event', () => {
      var $mock = $('<div />');
      var spy = jasmine.createSpy('spy');
      var width = randomWholeNumber(1000) + 'px';
      var height = randomWholeNumber(1000) + 'px';
      $mock.on('resized', spy);
      IframeComponent.resize(width, height, $mock);
      expect(spy.calls.count()).toEqual(1);
      expect(spy.calls.first().args[1]).toEqual({
        height: height,
        width: width
      });
    });

    it('is triggered by a iframe-resize event', () => {
      var data = {
        $el: $('<div />'),
        width: randomWholeNumber(1000) + 'px',
        height: randomWholeNumber(1000) + 'px'
      };
      spyOn(IframeComponent, 'resize');
      EventDispatcher.dispatch('iframe-resize', data);
      expect(IframeComponent.resize.calls.count()).toEqual(1);
      var args = IframeComponent.resize.calls.first().args;
      expect(args[0]).toEqual(data.width);
      expect(args[1]).toEqual(data.height);
      expect(args[2]).toEqual(data.$el);
    });
  });

  describe('content resolver', () =>{
    it('setContentResolver sets the content resolver', () => {
      var spy = jasmine.createSpy('spy');
      expect(IframeComponent._contentResolver).not.toEqual(spy);
      IframeComponent.setContentResolver(spy);
      expect(IframeComponent._contentResolver).toEqual(spy);
    });

    it('sets the content resolver when content-resolver-register-by-extension is triggered', () => {
      var spy = jasmine.createSpy('spy');
      expect(IframeComponent._contentResolver).not.toEqual(spy);
      EventDispatcher.dispatch('content-resolver-register-by-extension', {
        callback: spy
      });
      expect(IframeComponent._contentResolver).toEqual(spy);
    });
  });

  describe('simpleXdmExtension', () => {
    beforeEach(() => {
      IframeComponent._contentResolver = false;
    });

    it('returns an iframe', () => {
      var extension = {
        addon_key: 'some-addon-key',
        key: 'some-module-key',
        url: 'https://www.example.com'
      };
      var simpleExtension = IframeComponent.simpleXdmExtension(extension);
      expect(simpleExtension.$el[0].nodeName).toEqual("IFRAME");
    });

    it('returns an ID', () => {
      var extension = {
        addon_key: 'some-addon-key',
        key: 'some-module-key',
        url: 'https://www.example.com'
      };
      var simpleExtension = IframeComponent.simpleXdmExtension(extension);
      expect(simpleExtension.id).toEqual(jasmine.stringMatching(new RegExp('^' + extension.addon_key + '__' + extension.key)));
    });

    it('iframe is immediately created', () => {
      var extension = {
        addon_key: 'some-addon-key',
        key: 'some-module-key',
        url: 'https://www.example.com'
      };
      var createdExtension = IframeComponent.simpleXdmExtension(extension);
      expect(createdExtension.$el[0].nodeName).toEqual('IFRAME');
      expect(createdExtension.$el.attr('src')).toEqual(extension.url);
    });

    it('JWT url', () => {
      var extension = {
        addon_key: 'some-addon-key',
        key: 'some-module-key',
        url: 'https://www.example.com?jwt=abc123'
      };
      spyOn(urlUtil,'hasJwt').and.returnValue(true);
      spyOn(urlUtil,'isJwtExpired').and.returnValue(false);
      var createdExtension = IframeComponent.simpleXdmExtension(extension);
      expect(createdExtension.$el[0].nodeName).toEqual('IFRAME');
      expect(createdExtension.$el.attr('src')).toEqual(extension.url);
    });

    it('expired JWT', () => {
      var spy = jasmine.createSpy('spy');
      var extension = {
        addon_key: 'some-addon-key',
        key: 'some-module-key',
        url: 'https://www.example.com?jwt=abc123',
        id: 'some-id'
      };
      spyOn(urlUtil,'hasJwt').and.returnValue(true);
      spyOn(urlUtil,'isJwtExpired').and.returnValue(true);

      var createdExtension = IframeComponent.simpleXdmExtension(extension);
      expect(createdExtension.$el[0].nodeName).toEqual('IFRAME');
      expect(createdExtension.$el.attr('src')).toEqual(undefined);
    });

    it('triggers an event on bridge established', (done) => {
      var extension = {
        addon_key: 'some-addon-key',
        key: 'some-module-key',
        url: 'https://www.example.com'
      };
      EventDispatcher.registerOnce('iframe-bridge-estabilshed', (data) => {
        expect(data.$el[0].nodeName).toEqual("IFRAME");
        expect(data.extension).toEqual(extension);
        done();
      });
      var spy = spyOn(simpleXDM, 'create').and.returnValue({id: 'abc123'});
      IframeComponent.simpleXdmExtension(extension);
      setTimeout(function(){
        spy.calls.first().args[1]();
      }, 100);
    });

  });

  it('_renderIframe returns an iframe with attributes', () => {
    var attributes = {
      width: '123',
      custom: 'somethingelse'
    };
    var $iframe = IframeComponent._renderIframe(attributes);
    expect($iframe.attr('width')).toEqual(attributes.width);
    expect($iframe.attr('custom')).toEqual(attributes.custom);
    expect($iframe[0].nodeName).toEqual('IFRAME');
  });


});
