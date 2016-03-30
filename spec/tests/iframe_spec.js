import IframeComponent from 'src/host/components/iframe';
import EventDispatcher from 'src/host/dispatchers/event_dispatcher';

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

  describe('simpleXdmExtension', () => {
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
      return;
      var extension = {
        addon_key: 'some-addon-key',
        key: 'some-module-key',
        url: 'https://www.example.com'
      };
      var simpleExtension = IframeComponent.simpleXdmExtension(extension);
      expect(simpleExtension.extension.id).toEqual(jasmine.stringMatching(new RegExp('^' + extension.addon_key + '__' + extension.key)));
    });
  });

  it('triggers an event on _bridgeEstablishedCallback', (done) => {
    var extension = {
      addon_key: 'some-addon-key',
      key: 'some-module-key',
      url: 'https://www.example.com'
    };
    var $iframe = $('<iframe />');
    EventDispatcher.registerOnce('iframe-bridge-estabilshed', (data) => {
      expect(data.$el).toEqual($iframe);
      expect(data.extension).toEqual(extension);
      done();
    });
    var cb = IframeComponent._bridgeEstablishedCallback($iframe, extension);
    expect(cb).toEqual(jasmine.any(Function));
    cb();
  });


  it('_renderIframe returns an iframe with attributes', () => {
    var attributes = {
      width: '123px',
      custom: 'somethingelse'
    };
    var $iframe = IframeComponent._renderIframe(attributes);
    expect($iframe.attr('width')).toEqual(attributes.width);
    expect($iframe.attr('custom')).toEqual(attributes.custom);
    expect($iframe[0].nodeName).toEqual('IFRAME');
  });



});
