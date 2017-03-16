import IframeComponent from 'src/host/components/iframe';
import EventDispatcher from 'src/host/dispatchers/event_dispatcher';
import simpleXDM from 'simple-xdm/host';
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

    it('renders an error when content resolver fails', () => {
      var addon_key = 'someaddonkey';
      var key = 'somekey';
      var options = {};
      var errorText = 'some error text';
      var $container = $('<div />');
      var failingResolver = function(){
        return AJS.$.Deferred(function(defer){
          defer.reject({
            addon_key: addon_key,
            key: key,
            options: options
          }, {
            text: errorText
          });
        }).promise();
      };
      IframeComponent.setContentResolver(failingResolver);
      var simpleExtension = IframeComponent.simpleXdmExtension({
        addon_key: addon_key,
        key: key,
        options: options
      }, $container);
      expect($container.text()).toContain(errorText);
    });
  });

  describe('_simpleXdmCreate', () => {
    it('returns an ID', () => {
      var extension = {
        addon_key: 'some-addon-key',
        key: 'some-module-key',
        url: 'https://www.example.com'
      };
      var simpleExtension = IframeComponent._simpleXdmCreate(extension);
      expect(simpleExtension.id).toEqual(jasmine.stringMatching(new RegExp('^' + extension.addon_key + '__' + extension.key)));
    });
  });


  describe('simpleXdmExtension', () => {
    beforeEach(() => {
      IframeComponent._contentResolver = false;
    });

    it('appends an iframe', () => {
      var extension = {
        addon_key: 'some-addon-key',
        key: 'some-module-key',
        url: 'https://www.example.com'
      };
      var $container = $('<div />');
      var simpleExtension = IframeComponent.simpleXdmExtension(extension, $container);
      expect($container.find('iframe').length).toEqual(1);
    });

    it('JWT url', () => {
      var extension = {
        addon_key: 'some-addon-key',
        key: 'some-module-key',
        url: 'https://www.example.com?jwt=abc123'
      };
      var $container = $('<div />');
      spyOn(urlUtil,'hasJwt').and.returnValue(true);
      spyOn(urlUtil,'isJwtExpired').and.returnValue(false);
      IframeComponent.simpleXdmExtension(extension, $container);
      expect($container.find('iframe').length).toEqual(1);
      expect($container.find('iframe').attr('src')).toEqual(extension.url);
    });

    it('expired JWT', () => {
      var spy = jasmine.createSpy('spy');
      var extension = {
        addon_key: 'some-addon-key',
        key: 'some-module-key',
        url: 'https://www.example.com?jwt=abc123',
        id: 'some-id'
      };
      var $container = $('<div />');

      spyOn(urlUtil,'hasJwt').and.returnValue(true);
      spyOn(urlUtil,'isJwtExpired').and.returnValue(true);

      var createdExtension = IframeComponent.simpleXdmExtension($container, extension);
      expect($container.find('iframe').length).toEqual(0);
    });

    it('triggers an event on bridge established', (done) => {
      var extension = {
        addon_key: 'some-addon-key',
        key: 'some-module-key',
        url: 'https://www.example2.com'
      };
      var $container = $('<div />');

      EventDispatcher.registerOnce('iframe-bridge-established', (data) => {
        expect(data.$el[0].nodeName).toEqual('IFRAME');
        expect(data.extension).toEqual(extension);
        done();
      });
      var spy = spyOn(simpleXDM, 'create').and.returnValue({id: 'abc123'});
      IframeComponent.simpleXdmExtension(extension, $container);
      setTimeout(function(){
        spy.calls.first().args[1]();
      }, 300);
    });

    it('triggers an event on iframe reload', (done) => {
      var extension = {
        addon_key: 'some-addon-key',
        key: 'some-module-key',
        url: 'https://www.example2.com'
      };
      var $container = $('<div />');

      EventDispatcher.registerOnce('iframe-unload', (data) => {
        expect(data.$el[0].nodeName).toEqual('IFRAME');
        expect(data.extension).toEqual(extension);
        done();
      });
      var spy = spyOn(simpleXDM, 'create').and.returnValue({id: 'abc123'});
      IframeComponent.simpleXdmExtension(extension, $container);
      setTimeout(function(){
        spy.calls.first().args[2]();
      }, 300);
    });

  });

  it('render returns an iframe with attributes', () => {
    var attributes = {
      width: '123',
      custom: 'somethingelse'
    };
    var $iframe = IframeComponent.render(attributes);
    expect($iframe.attr('width')).toEqual(attributes.width);
    expect($iframe.attr('custom')).toEqual(attributes.custom);
    expect($iframe[0].nodeName).toEqual('IFRAME');
  });


});
