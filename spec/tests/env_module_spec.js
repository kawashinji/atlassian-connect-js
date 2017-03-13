import envModule from 'src/host/modules/env';
import EventDispatcher from 'src/host/dispatchers/event_dispatcher';

describe('env module', () => {

  describe('sizeToParent', () => {
    afterEach(function(){
      $('.tempiframe').remove();
      $('.ac-content-page').remove();
      $('#footer').remove();
    });

    it('disables resize function', (done) => {
      var callback = function(){};
      var $el = $('<iframe class="tempiframe" id="d32idas" />');
      callback._context = {
        extension_id: 'd32idas',
        extension: {
          id: 'd32idas',
          $el: $el,
          options: {
            isFullPage: true
          }
        }
      };

      $('body').append($el);
      expect(envModule.resize('10px','10px', callback)).toEqual(true);
      var resizeSpy = (data) => {
        if(data.extensionId === callback._context.extension_id) {
          expect(envModule.resize('10px','10px', callback)).toEqual(false);
          done();
          EventDispatcher.unregister('after:iframe-size-to-parent', resizeSpy);
        }
      };
      EventDispatcher.register('after:iframe-size-to-parent', resizeSpy);
      envModule.sizeToParent(true, callback);
    });

    it('hideFooter hides the footer on pages', (done) =>{
      var $contentPage = $('<div class="ac-content-page" />');
      var $footer = $('<div id="footer" />');
      var callback = function(){};
      var $el = $('<iframe class="tempiframe" id="abc123" />');
      callback._context = {
        extension_id: 'abc123',
        extension: {
          id: 'abc123',
          $el: $el,
          options: {
            isFullPage: true
          }
        }
      };

      $('body').append($el);
      $contentPage.append($footer);
      $('body').append($contentPage);
      function spy (data){
        if(data.$el.attr('id') === 'abc123') {
          expect($('#footer').css('display')).toEqual('none');
          EventDispatcher.unregister('iframe-resize', spy);
          done();
        }
      }
      EventDispatcher.register('iframe-resize', spy);

      envModule.sizeToParent(true, callback);
    });

    it('changes the dimensions of the iframe to fill the rest of the page', (done) => {
      var $contentPage = $('<div class="ac-content-page" />');
      var $footer = $('<div id="footer" />').css('height', '50px');
      var $nav = $('<nav />').css('height', '23px');
      var $header = $('<header id="header"></header>').append($nav);
      var callback = function(){};
      var $el = $('<iframe class="tempiframe" id="zxy123" />').css({
        border: 0,
        padding: 0,
        margin: 0
      });
      callback._context = {
        extension_id: 'zxy123',
        extension: {
          id: 'zxy123',
          $el: $el,
          options: {
            isFullPage: true
          }
        }
      };

      $contentPage.append($header);
      $contentPage.append($el);
      $contentPage.append($footer);
      $('body').append($contentPage);
      // full height - header - footer - 1px border = scrollbar only on iframe
      var correctIframeHeight = $(window).height() - 50 - 23 - 1;
      function spy (data){
        if(data.$el.attr('id') === callback._context.extension_id) {
          expect($el.height()).toEqual(correctIframeHeight);
          EventDispatcher.unregister('iframe-resize', spy);
          done();
        }
      }
      EventDispatcher.register('iframe-resize', spy);
      envModule.sizeToParent(false, callback);
    });
  });

  describe('resize', () => {

    afterEach(function(){
      $('.tempiframe').remove();
    });

    it('triggers the resize function', (done) => {
      var width = '100px';
      var height = '120px';
      var callback = function(){};
      var $el = $('<iframe class="tempiframe" id="xabc123" />');
      callback._context = {
        extension_id: 'xabc123',
        extension: {
          id: 'xabc123',
          $el: $el
        }
      };
      $('body').append($el);
      function resizeSpy(data){
        if(data.extension && data.extension.id === callback._context.extension.id){
          expect(data.width).toEqual(width);
          expect(data.height).toEqual(height);
          expect(data.extension.id).toEqual(callback._context.extension.id);
          EventDispatcher.unregister('after:iframe-resize', resizeSpy);
          done();
        }
      }
      EventDispatcher.register('after:iframe-resize', resizeSpy);
      envModule.resize(width, height, callback);
    });

    it('triggers the resize function once per add-on', (done) => {
      var width = '110px';
      var height = '130px';
      var $el1= $('<iframe class="tempiframe" id="abc1234" />');
      var callback1 = function(){};
      callback1._context = {
        extension_id: 'abc1234',
        extension: {
          id: 'abc1234',
          $el: $el1
        }
      };

      var $el2 = $('<iframe class="tempiframe" id="xyz123" />');
      var callback2 = function(){};
      callback2._context = {
        extension_id: 'xyz123',
        extension: {
          id: 'xyz123',
          $el: $el2
        }
      };

      var spy = jasmine.createSpy('validator');
      EventDispatcher.register('iframe-resize', spy);
      $('body').append($el1);
      $('body').append($el2);
      envModule.resize(width, height, callback1);
      envModule.resize(width, height, callback1);
      envModule.resize(width, height, callback2);
      envModule.resize(width, height, callback2);

      setTimeout(function(){
        expect(spy.calls.count()).toEqual(2);
        expect(spy.calls.argsFor(0)[0].extension.id).toEqual('abc1234');
        expect(spy.calls.argsFor(1)[0].extension.id).toEqual('xyz123');
        EventDispatcher.unregister('iframe-resize', spy);
      }, 500);
      done();
    });


  });
});