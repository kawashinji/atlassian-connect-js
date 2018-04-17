import ScrollPosition from 'src/host/modules/scroll-position';
import EventDispatcher from 'src/host/dispatchers/event_dispatcher';

describe('scroll position', () => {
  beforeEach(() => {
    window.document.body.style.overflow = 'visible';
    $('iframe').remove();
  });
  afterEach(() => {
    $('iframe').remove();
  });

  it('gets the scroll position of parent page', (done) => {
    var elementId = Math.random().toString(36).substring(2, 8);
    var callback = function (position) {
      expect(position).toEqual({
        scrollY: 900,
        scrollX: -100,
        width: window.innerWidth,
        height: window.innerHeight
      });
      done();
    };
    callback._context = {
      extension: {
        options: {
          isFullPage: true
        }
      },
      extension_id: elementId
    };
    $('<iframe>').attr({id: elementId}).appendTo('body');
    $('body').css({
      height: 2000,
      margin: 100
    });
    window.scrollTo(0, 1000);
    ScrollPosition.getPosition(callback);
  });

  it('sets the scroll position of the page', (done) => {
    var elementId = Math.random().toString(36).substring(2, 8);
    var $window = $(window);
    var scrollPosition = 10;
    var callback = function (position) {
      expect(position.scrollY).toEqual($window.scrollTop() - $(document.getElementById(elementId)).offset().top);
      done();
    };
    callback._context = {
      extension: {
        options: {
          isFullPage: true
        }
      },
      extension_id: elementId
    };
    $('<iframe>').attr({id: elementId}).css({
      width: '300px',
      height: '2000px'
    }).appendTo('body');
    window.scrollTo(0, 0);
    ScrollPosition.setVerticalPosition(scrollPosition, callback);
    ScrollPosition.getPosition(callback);
  });

  it('scroll.nearTop is triggered when scrolling near the top', (done) => {
    var extension = {
      options: {isFullPage: true},
      id: 'abc123',
      addon_key: 'some-addon-key',
      key: 'some-module-key'
    };

    EventDispatcher.registerOnce('event-dispatch', (data) => {
      expect(data.type).toEqual('scroll.nearTop');
      expect(data.targetSpec).toEqual({id: extension.id});
      expect(data.event).toEqual({});
      done();
    });
    EventDispatcher.dispatch('iframe-bridge-established', {
      extension: extension
    });
    window.scrollTo(0,2);
  });

  it('scroll.nearBottom is triggered when scrolling near the bottom', (done) => {
    var extension = {
      options: {isFullPage: true},
      id: 'abc123',
      addon_key: 'some-addon-key',
      key: 'some-module-key'
    };
    EventDispatcher.dispatch('iframe-bridge-established', {
      extension: extension
    });
    window.scrollTo(0,2);
    EventDispatcher.registerOnce('event-dispatch', (data) => {
      expect(data.type).toEqual('scroll.nearBottom');
      expect(data.targetSpec).toEqual({id: extension.id});
      expect(data.event).toEqual({});
      done();
    });
    window.scrollTo(0,100000);
  });




});
