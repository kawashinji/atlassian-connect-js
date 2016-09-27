import envModule from 'src/host/modules/env';
import EventDispatcher from 'src/host/dispatchers/event_dispatcher';

describe('env module', () => {

  describe('sizeToParent', () => {
    afterEach(function(){
      $('.tempiframe').remove();
      $('.ac-content-page').remove();
      $('#footer').remove();
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

      EventDispatcher.registerOnce('iframe-resize', function(data){
        expect($('#footer').css('display')).toEqual('none');
        done();
      });

      envModule.sizeToParent(true, callback);
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
      var $el = $('<iframe class="tempiframe" id="abc123" />');
      callback._context = {
        extension_id: 'abc123',
        extension: {
          id: 'abc123',
          $el: $el
        }
      };
      $('body').append($el);

      EventDispatcher.registerOnce('iframe-resize', function(data){
        expect(data.width).toEqual(width);
        expect(data.height).toEqual(height);
        expect(data.extension.id).toEqual(callback._context.extension.id);
        done();
      });

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